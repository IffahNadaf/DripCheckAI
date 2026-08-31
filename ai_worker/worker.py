import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"

import io
import json
from pathlib import Path
from urllib.parse import urlparse

import boto3
import numpy as np
import pika
import psycopg2
import tensorflow as tf

from dotenv import load_dotenv
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

load_dotenv(BASE_DIR / ".env")


# =========================================================
# CONFIGURATION
# =========================================================

RABBITMQ_URL = os.getenv(
    "RABBITMQ_URL",
    "amqp://localhost:5672"
)

QUEUE_NAME = "image_jobs"

MINIO_ENDPOINT = os.getenv(
    "MINIO_ENDPOINT",
    "http://127.0.0.1:9000"
)

MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")

MINIO_BUCKET = "dress-images"


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db_connection():

    return psycopg2.connect(
        host=os.getenv("PG_HOST"),
        port=5432,
        database="postgres",
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD"),
        sslmode="require"
    )


# =========================================================
# MINIO CLIENT
# =========================================================

s3_client = boto3.client(
    "s3",
    endpoint_url=MINIO_ENDPOINT,
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    region_name="us-east-1"
)


# =========================================================
# LOAD AI MODELS
# =========================================================

print("Loading DRIPCHECK AI models...")

category_model = tf.keras.models.load_model(
    MODEL_DIR / "clothing_category_improved.keras"
)

attribute_model = tf.keras.models.load_model(
    MODEL_DIR / "clothing_attributes.keras"
)


with open(
    MODEL_DIR / "category_classes_improved.txt",
    "r"
) as file:

    category_classes = [
        line.strip()
        for line in file.readlines()
    ]


with open(
    MODEL_DIR / "attribute_names.txt",
    "r"
) as file:

    attribute_names = [
        line.strip()
        for line in file.readlines()
    ]


print("AI models loaded successfully.")


# =========================================================
# DEEPFASHION CATEGORY MAPPING
# =========================================================

CATEGORY_NAMES = {
    1: "Anorak",
    2: "Blazer",
    3: "Blouse",
    4: "Bomber",
    5: "Button-Down",
    6: "Cardigan",
    7: "Flannel",
    8: "Halter",
    9: "Henley",
    10: "Hoodie",
    11: "Jacket",
    12: "Jersey",
    13: "Parka",
    14: "Peacoat",
    15: "Poncho",
    16: "Sweater",
    17: "Tank",
    18: "Tee",
    19: "Top",
    20: "Turtleneck",
    21: "Capris",
    22: "Chinos",
    23: "Culottes",
    24: "Cutoffs",
    25: "Gauchos",
    26: "Jeans",
    27: "Jeggings",
    28: "Jodhpurs",
    29: "Joggers",
    30: "Leggings",
    31: "Sarong",
    32: "Shorts",
    33: "Skirt",
    34: "Sweatpants",
    35: "Sweatshorts",
    36: "Trunks",
    37: "Caftan",
    38: "Cape",
    39: "Coat",
    40: "Coverup",
    41: "Dress",
    42: "Jumpsuit",
    43: "Kaftan",
    44: "Kimono",
    45: "Nightdress",
    46: "Onesie",
    47: "Robe",
    48: "Romper",
    49: "Shirtdress",
    50: "Sundress"
}


# =========================================================
# IMAGE PREPROCESSING
# =========================================================

def preprocess_image(image_bytes):

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    image = image.resize((224, 224))

    image = np.array(
        image,
        dtype=np.float32
    )

    image = np.expand_dims(
        image,
        axis=0
    )

    image = preprocess_input(image)

    return image


# =========================================================
# AI PREDICTION
# =========================================================

def predict_image(image_bytes):

    image = preprocess_image(image_bytes)


    # CATEGORY PREDICTION
    category_prediction = category_model.predict(
        image,
        verbose=0
    )[0]

    category_index = int(
        np.argmax(category_prediction)
    )

    category_id = int(
        category_classes[category_index]
    )

    category_name = CATEGORY_NAMES.get(
        category_id,
        "Unknown"
    )

    category_confidence = float(
        category_prediction[category_index]
    )


    # ATTRIBUTE PREDICTION
    attribute_prediction = attribute_model.predict(
        image,
        verbose=0
    )[0]


    attributes = []

    threshold = 0.20

    for index, score in enumerate(
        attribute_prediction
    ):

        if score >= threshold:

            attributes.append({
                "name": attribute_names[index],
                "confidence": round(
                    float(score),
                    4
                )
            })


    # TOP 5 ATTRIBUTE CANDIDATES
    top_indices = np.argsort(
        attribute_prediction
    )[::-1][:5]

    top_candidates = []

    for index in top_indices:

        top_candidates.append({
            "name": attribute_names[index],
            "confidence": round(
                float(
                    attribute_prediction[index]
                ),
                4
            )
        })


    return {
        "category": category_name,
        "category_id": category_id,
        "category_confidence": round(
            category_confidence,
            4
        ),
        "attributes": attributes,
        "top_attribute_candidates": top_candidates
    }


# =========================================================
# DOWNLOAD IMAGE FROM MINIO
# =========================================================

def download_image(job):

    object_key = job.get("image_key")

    # Fallback for the current backend,
    # which only sends image_url.
    if not object_key:

        image_url = job["image_url"]

        parsed_url = urlparse(image_url)

        object_key = Path(
            parsed_url.path
        ).name


    print(
        f"Downloading image from MinIO: "
        f"{object_key}"
    )

    response = s3_client.get_object(
        Bucket=MINIO_BUCKET,
        Key=object_key
    )

    return response["Body"].read()


# =========================================================
# SAVE RESULT TO POSTGRES
# =========================================================

def save_result(job_id, result):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE classification_results

        SET status = 'completed',
            category = %s,
            category_id = %s,
            category_confidence = %s,
            attributes = %s,
            top_attribute_candidates = %s

        WHERE job_id = %s
        """,
        (
            result["category"],
            result["category_id"],
            result["category_confidence"],
            json.dumps(
                result["attributes"]
            ),
            json.dumps(
                result[
                    "top_attribute_candidates"
                ]
            ),
            job_id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()


# =========================================================
# MARK FAILED JOB
# =========================================================

def mark_job_failed(job_id):

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE classification_results

        SET status = 'failed'

        WHERE job_id = %s
        """,
        (job_id,)
    )

    connection.commit()

    cursor.close()
    connection.close()


# =========================================================
# RABBITMQ MESSAGE HANDLER
# =========================================================

def process_job(
    channel,
    method,
    properties,
    body
):

    job = None

    try:

        job = json.loads(
            body.decode("utf-8")
        )

        job_id = job["job_id"]

        print("\n================================")
        print("New AI job received")
        print("Job ID:", job_id)
        print("================================")


        # 1. Download image
        image_bytes = download_image(job)


        # 2. Run AI models
        result = predict_image(
            image_bytes
        )


        print("\nPrediction:")

        print(
            json.dumps(
                result,
                indent=4
            )
        )


        # 3. Save result
        save_result(
            job_id,
            result
        )


        # 4. Tell RabbitMQ job completed
        channel.basic_ack(
            delivery_tag=method.delivery_tag
        )


        print(
            f"\nJob {job_id} completed successfully."
        )


    except Exception as error:

        print("\nAI job failed:")
        print(error)


        if job and "job_id" in job:

            try:

                mark_job_failed(
                    job["job_id"]
                )

            except Exception as db_error:

                print(
                    "Could not update failed status:",
                    db_error
                )


        # Acknowledge failed job so it does not
        # continuously repeat forever.
        channel.basic_ack(
            delivery_tag=method.delivery_tag
        )


# =========================================================
# START RABBITMQ WORKER
# =========================================================

def start_worker():

    print("Connecting to RabbitMQ...")

    parameters = pika.URLParameters(
        RABBITMQ_URL
    )

    connection = pika.BlockingConnection(
        parameters
    )

    channel = connection.channel()

    channel.queue_declare(
        queue=QUEUE_NAME,
        durable=True
    )

    channel.basic_qos(
        prefetch_count=1
    )

    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=process_job
    )


    print(
        f"Connected to RabbitMQ."
    )

    print(
        f"Waiting for jobs on queue: "
        f"{QUEUE_NAME}"
    )

    channel.start_consuming()


# =========================================================

if __name__ == "__main__":

    start_worker()