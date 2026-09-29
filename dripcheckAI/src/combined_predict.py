import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

IMAGE_PATH = "test_images/test.jpg"

CATEGORY_MODEL_PATH = "models/clothing_category_full.keras"
ATTRIBUTE_MODEL_PATH = "models/clothing_attributes.keras"

CATEGORY_CLASS_FILE = "models/category_classes.txt"
ATTRIBUTE_NAME_FILE = "models/attribute_names.txt"

IMG_SIZE = (224, 224)

# Attribute probability threshold
ATTRIBUTE_THRESHOLD = 0.20


# --------------------------------------------------
# DEEPFASHION CATEGORY NAMES
# --------------------------------------------------

CATEGORY_ID_TO_NAME = {
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


# --------------------------------------------------
# LOAD CLASS / ATTRIBUTE NAMES
# --------------------------------------------------

with open(CATEGORY_CLASS_FILE, "r") as file:
    category_ids = [
        line.strip()
        for line in file
        if line.strip()
    ]

with open(
    ATTRIBUTE_NAME_FILE,
    "r",
    encoding="utf-8"
) as file:
    attribute_names = [
        line.strip()
        for line in file
        if line.strip()
    ]


# --------------------------------------------------
# LOAD MODELS
# --------------------------------------------------

print("Loading models...")

category_model = tf.keras.models.load_model(
    CATEGORY_MODEL_PATH
)

attribute_model = tf.keras.models.load_model(
    ATTRIBUTE_MODEL_PATH
)

print("Models loaded successfully.")


# --------------------------------------------------
# PREPROCESS IMAGE
# --------------------------------------------------

image = tf.keras.utils.load_img(
    IMAGE_PATH,
    target_size=IMG_SIZE
)

image_array = tf.keras.utils.img_to_array(
    image
)

image_array = np.expand_dims(
    image_array,
    axis=0
)

image_array = preprocess_input(
    image_array
)


# --------------------------------------------------
# CATEGORY PREDICTION
# --------------------------------------------------

category_predictions = category_model.predict(
    image_array,
    verbose=0
)[0]

category_index = int(
    np.argmax(category_predictions)
)

category_confidence = float(
    category_predictions[category_index]
)

category_id = int(
    category_ids[category_index]
)

category_name = CATEGORY_ID_TO_NAME.get(
    category_id,
    f"Category {category_id}"
)


# --------------------------------------------------
# ATTRIBUTE PREDICTION
# --------------------------------------------------

attribute_predictions = attribute_model.predict(
    image_array,
    verbose=0
)[0]

# Show top 5 attribute predictions for debugging
top_indices = np.argsort(attribute_predictions)[::-1][:5]

print("\nTOP 5 ATTRIBUTE SCORES:")

for index in top_indices:
    print(
        f"{attribute_names[index]}: "
        f"{attribute_predictions[index] * 100:.2f}%"
    )

attributes = []

for name, confidence in zip(
    attribute_names,
    attribute_predictions
):

    confidence = float(confidence)

    if confidence >= ATTRIBUTE_THRESHOLD:

        attributes.append({
            "name": name,
            "confidence": round(
                confidence,
                4
            )
        })

# Highest-confidence attributes first
attributes.sort(
    key=lambda x: x["confidence"],
    reverse=True
)


# --------------------------------------------------
# FINAL RESULT
# --------------------------------------------------

result = {
    "category": category_name,
    "category_id": category_id,
    "category_confidence": round(
        category_confidence,
        4
    ),
    "attributes": attributes
}


print("\nFINAL PREDICTION:\n")

print(
    json.dumps(
        result,
        indent=4
    )
)