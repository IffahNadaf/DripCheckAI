import os
import time
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras import layers, Model

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 5

TRAIN_DIR = "dataset/attribute_images/train"
VAL_DIR = "dataset/attribute_images/val"

TRAIN_LABELS = "dataset/attribute_train.npz"
VAL_LABELS = "dataset/attribute_val.npz"

ATTRIBUTE_NAMES = [
    "print",
    "floral",
    "striped",
    "graphic",
    "polka dot",

    "lace",
    "knit",
    "denim",
    "chiffon",
    "cotton",
    "leather",

    "maxi",
    "bodycon",
    "crop",
    "skater",
    "skinny",
    "mini",

    "sleeveless",
    "long sleeve",
    "v-neck",
    "collar",
    "pocket",
    "hooded",

    "classic",
    "boho"
]


# --------------------------------------------------
# Load filename + label information
# --------------------------------------------------

train_data = np.load(TRAIN_LABELS)
val_data = np.load(VAL_LABELS)

train_filenames = train_data["filenames"]
train_labels = train_data["labels"]

val_filenames = val_data["filenames"]
val_labels = val_data["labels"]

print("Training samples:", len(train_filenames))
print("Validation samples:", len(val_filenames))
print("Number of attributes:", len(ATTRIBUTE_NAMES))


# --------------------------------------------------
# Image loading function
# --------------------------------------------------

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


# --------------------------------------------------
# Build paths
# --------------------------------------------------

train_paths = [
    os.path.join(TRAIN_DIR, str(name))
    for name in train_filenames
]

val_paths = [
    os.path.join(VAL_DIR, str(name))
    for name in val_filenames
]


# --------------------------------------------------
# TensorFlow datasets
# --------------------------------------------------

train_dataset = tf.data.Dataset.from_tensor_slices(
    (train_paths, train_labels)
)

train_dataset = (
    train_dataset
    .shuffle(5000)
    .map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )
    .batch(BATCH_SIZE)
    .prefetch(tf.data.AUTOTUNE)
)


val_dataset = tf.data.Dataset.from_tensor_slices(
    (val_paths, val_labels)
)

val_dataset = (
    val_dataset
    .map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )
    .batch(BATCH_SIZE)
    .prefetch(tf.data.AUTOTUNE)
)


# --------------------------------------------------
# MobileNetV2 backbone
# --------------------------------------------------

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False


# --------------------------------------------------
# Multi-label classifier
# --------------------------------------------------

inputs = tf.keras.Input(
    shape=(224, 224, 3)
)

x = base_model(
    inputs,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(0.2)(x)

outputs = layers.Dense(
    len(ATTRIBUTE_NAMES),
    activation="sigmoid"
)(x)

model = Model(
    inputs,
    outputs
)


# --------------------------------------------------
# Compile
# --------------------------------------------------

model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=[
        tf.keras.metrics.BinaryAccuracy(
            name="binary_accuracy"
        ),
        tf.keras.metrics.Precision(
            name="precision"
        ),
        tf.keras.metrics.Recall(
            name="recall"
        )
    ]
)

model.summary()


# --------------------------------------------------
# Train
# --------------------------------------------------

print("\nStarting attribute training...\n")

start_time = time.time()

history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=EPOCHS
)

training_time = time.time() - start_time

print(
    f"\nTraining time: "
    f"{training_time:.2f} seconds"
)


# --------------------------------------------------
# Save
# --------------------------------------------------

model.save(
    "models/clothing_attributes.keras"
)

with open(
    "models/attribute_names.txt",
    "w",
    encoding="utf-8"
) as file:

    for name in ATTRIBUTE_NAMES:
        file.write(name + "\n")


print("\nAttribute model saved:")
print("models/clothing_attributes.keras")

print("\nAttribute names saved:")
print("models/attribute_names.txt")