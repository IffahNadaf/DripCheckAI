import time
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras import layers, Model

IMG_SIZE = (224, 224)
BATCH_SIZE = 16

TRAIN_DIR = "dataset/full_categories_500/train"
VAL_DIR = "dataset/full_categories_500/val"

MODEL_PATH = "models/clothing_category_improved.keras"
CLASS_FILE = "models/category_classes_improved.txt"


# ==========================================================
# 1. LOAD DATASETS
# ==========================================================

train_dataset = tf.keras.utils.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=42
)

class_names = train_dataset.class_names
num_classes = len(class_names)

print("\nNumber of classes:", num_classes)
print("Class IDs:", class_names)


validation_dataset = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False,
    class_names=class_names
)


# ==========================================================
# 2. DATA AUGMENTATION
# ==========================================================

augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.08),
    layers.RandomZoom(0.10),
    layers.RandomTranslation(
        height_factor=0.05,
        width_factor=0.05
    )
], name="augmentation")


# ==========================================================
# 3. PREPROCESSING
# ==========================================================

def preprocess_train(images, labels):

    images = augmentation(
        images,
        training=True
    )

    images = preprocess_input(images)

    return images, labels


def preprocess_validation(images, labels):

    images = preprocess_input(images)

    return images, labels


train_dataset = train_dataset.map(
    preprocess_train,
    num_parallel_calls=tf.data.AUTOTUNE
)

validation_dataset = validation_dataset.map(
    preprocess_validation,
    num_parallel_calls=tf.data.AUTOTUNE
)

train_dataset = train_dataset.prefetch(
    tf.data.AUTOTUNE
)

validation_dataset = validation_dataset.prefetch(
    tf.data.AUTOTUNE
)


# ==========================================================
# 4. MOBILENETV2
# ==========================================================

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False


inputs = tf.keras.Input(
    shape=(224, 224, 3)
)

x = base_model(
    inputs,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(0.30)(x)

outputs = layers.Dense(
    num_classes,
    activation="softmax"
)(x)

model = Model(
    inputs,
    outputs
)


# ==========================================================
# 5. STAGE 1 — TRAIN CLASSIFICATION HEAD
# ==========================================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)


checkpoint = tf.keras.callbacks.ModelCheckpoint(
    MODEL_PATH,
    monitor="val_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)

early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=2,
    restore_best_weights=True,
    verbose=1
)


print("\n====================================")
print("STAGE 1: TRAINING CLASSIFIER HEAD")
print("====================================\n")

start_time = time.time()

model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=5,
    callbacks=[
        checkpoint,
        early_stop
    ]
)


# ==========================================================
# 6. STAGE 2 — FINE-TUNE MOBILENETV2
# ==========================================================

print("\n====================================")
print("STAGE 2: FINE-TUNING MOBILENETV2")
print("====================================\n")


base_model.trainable = True

# Freeze most of MobileNetV2.
# Fine-tune only approximately the final 30 layers.
for layer in base_model.layers[:-30]:
    layer.trainable = False


# Keep BatchNormalization frozen for stable fine-tuning.
for layer in base_model.layers:
    if isinstance(
        layer,
        layers.BatchNormalization
    ):
        layer.trainable = False


model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)


fine_tune_checkpoint = tf.keras.callbacks.ModelCheckpoint(
    MODEL_PATH,
    monitor="val_accuracy",
    save_best_only=True,
    mode="max",
    verbose=1
)

fine_tune_early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=2,
    restore_best_weights=True,
    verbose=1
)


model.fit(
    train_dataset,
    validation_data=validation_dataset,
    epochs=5,
    callbacks=[
        fine_tune_checkpoint,
        fine_tune_early_stop
    ]
)


# ==========================================================
# 7. SAVE CLASS ORDER
# ==========================================================

with open(
    CLASS_FILE,
    "w"
) as file:

    for class_name in class_names:
        file.write(class_name + "\n")


training_time = time.time() - start_time

print(
    f"\nTotal training time: "
    f"{training_time:.2f} seconds"
)

print("\nBest model saved:")
print(MODEL_PATH)

print("\nClass mapping saved:")
print(CLASS_FILE)