import tensorflow as tf
import numpy as np

from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

model = tf.keras.models.load_model(
    "models/clothing_classifier.keras"
)
class_names = [
    "Blouse",
    "Dress",
    "Jeans",
    "Shorts",
    "Tee"
]
image_path = "test_images/jeans.jpg"

image = tf.keras.utils.load_img(
    image_path,
    target_size=(224, 224)
)

image_array = tf.keras.utils.img_to_array(image)
image_array = np.expand_dims(image_array, axis=0)
image_array = preprocess_input(image_array)

predictions = model.predict(image_array)

predicted_index = np.argmax(predictions[0])
predicted_class = class_names[predicted_index]
confidence = predictions[0][predicted_index] * 100

print(f"Prediction: {predicted_class}")
print(f"Confidence: {confidence:.2f}%")