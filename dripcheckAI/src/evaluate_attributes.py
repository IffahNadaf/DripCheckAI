import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

TEST_DIR = "dataset/attribute_images/test"
TEST_LABELS = "dataset/attribute_test.npz"

model = tf.keras.models.load_model(
    "models/clothing_attributes.keras"
)

data = np.load(TEST_LABELS)

filenames = data["filenames"]
labels = data["labels"]

paths = [
    os.path.join(TEST_DIR, str(name))
    for name in filenames
]


def load_image(path, label):
    image = tf.io.read_file(path)
    image = tf.image.decode_jpeg(
        image,
        channels=3
    )
    image = tf.image.resize(
        image,
        IMG_SIZE
    )
    image = preprocess_input(image)

    return image, label


test_dataset = tf.data.Dataset.from_tensor_slices(
    (paths, labels)
)

test_dataset = (
    test_dataset
    .map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )
    .batch(BATCH_SIZE)
    .prefetch(tf.data.AUTOTUNE)
)

print("\nEvaluating on unseen test set...\n")

results = model.evaluate(
    test_dataset,
    verbose=1
)

print("\nFINAL TEST RESULTS")

for name, value in zip(
    model.metrics_names,
    results
):
    print(f"{name}: {value:.4f}")