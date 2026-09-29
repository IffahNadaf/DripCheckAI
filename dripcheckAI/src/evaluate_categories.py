import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

TEST_DIR = "dataset/full_categories/test"
MODEL_PATH = "models/clothing_category_full.keras"
CLASS_FILE = "models/category_classes.txt"


# -----------------------------------------
# Load saved class order
# -----------------------------------------

with open(CLASS_FILE, "r") as file:
    class_names = [
        line.strip()
        for line in file
        if line.strip()
    ]

print("Number of classes:", len(class_names))


# -----------------------------------------
# Load test dataset
# -----------------------------------------

test_dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False,
    class_names=class_names
)

test_dataset = test_dataset.map(
    lambda x, y: (
        preprocess_input(x),
        y
    ),
    num_parallel_calls=tf.data.AUTOTUNE
)

test_dataset = test_dataset.prefetch(
    tf.data.AUTOTUNE
)


# -----------------------------------------
# Load trained model
# -----------------------------------------

model = tf.keras.models.load_model(
    MODEL_PATH
)


# -----------------------------------------
# Evaluate on unseen test data
# -----------------------------------------

print("\nEvaluating category model on unseen test set...\n")

results = model.evaluate(
    test_dataset,
    verbose=1
)

print("\nFINAL CATEGORY TEST RESULTS")

for name, value in zip(
    model.metrics_names,
    results
):
    print(f"{name}: {value:.4f}")