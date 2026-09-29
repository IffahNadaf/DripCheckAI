import time
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras import layers, models

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

TRAIN_DIR = "dataset/full_categories/train"
VAL_DIR = "dataset/full_categories/val"

# Load training dataset
train_dataset = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

# IMPORTANT:
# Save the class IDs/order before mapping the dataset.
class_names = train_dataset.class_names
num_classes = len(class_names)

print("\nClass IDs:", class_names)
print("Number of classes:", num_classes)

# Load validation dataset using the SAME class order
validation_dataset = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_names=class_names
)

# MobileNetV2 preprocessing
train_dataset = train_dataset.map(
    lambda x, y: (preprocess_input(x), y)
)

validation_dataset = validation_dataset.map(
    lambda x, y: (preprocess_input(x), y)
)

# Improve input pipeline performance
train_dataset = train_dataset.prefetch(
    tf.data.AUTOTUNE
)

validation_dataset = validation_dataset.prefetch(
    tf.data.AUTOTUNE
)

# Load pretrained MobileNetV2
base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze pretrained backbone
base_model.trainable = False

# Build classifier
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.2),
    layers.Dense(
        num_classes,
        activation="softmax"
    )
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

print("\nStarting training...\n")

start_time = time.time()

history = model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=5
)

training_time = time.time() - start_time

print(
    f"\nTraining time: "
    f"{training_time:.2f} seconds"
)

# Save expanded model
model.save(
    "models/clothing_category_full.keras"
)

# Save class ID order for inference
with open(
    "models/category_classes.txt",
    "w"
) as file:

    for class_name in class_names:
        file.write(class_name + "\n")

print("\nModel saved:")
print("models/clothing_category_full.keras")

print("\nClass mapping saved:")
print("models/category_classes.txt")