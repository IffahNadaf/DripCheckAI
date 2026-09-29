import cv2
import numpy as np


def get_color_name(h, s, v):
    """
    Convert an HSV colour value into a human-readable colour name.
    OpenCV Hue range: 0-179
    """

    # Very dark colours
    if v < 45:
        return "Black"

    # Very light colours with little saturation
    if v > 210 and s < 35:
        return "White"

    # Low saturation = grey / beige / cream family
    if s < 45:
        if v < 110:
            return "Dark Grey"
        elif v < 190:
            return "Grey"
        else:
            return "Cream"

    # Brown / Beige
    if h < 15 and v < 170:
        return "Brown"

    if 10 <= h < 25 and s < 130 and v > 140:
        return "Beige"

    # Main colour families
    if h < 5 or h >= 170:
        return "Red"

    elif h < 12:
        return "Orange"

    elif h < 22:
        return "Yellow"

    elif h < 40:
        return "Green"

    elif h < 85:
        return "Green"

    elif h < 100:
        return "Teal"

    elif h < 130:
        return "Blue"

    elif h < 145:
        return "Purple"

    elif h < 170:
        return "Pink"

    return "Unknown"


def detect_primary_color(image_path):
    """
    Detect the primary visible colour of a clothing image.

    Returns:
        {
            "name": "Pink",
            "rgb": [220, 120, 160]
        }
    """

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    # ---------------------------------------------------------
    # 1. Resize image so processing stays fast and consistent
    # ---------------------------------------------------------

    image = cv2.resize(image, (300, 300))

    height, width = image.shape[:2]

    # ---------------------------------------------------------
    # 2. Focus mainly on the centre of the image.
    #
    # Clothing-product photographs usually place the garment
    # around the centre. This helps reduce background influence.
    # ---------------------------------------------------------

    x1 = int(width * 0.20)
    x2 = int(width * 0.80)

    y1 = int(height * 0.15)
    y2 = int(height * 0.85)

    garment_region = image[y1:y2, x1:x2]

    # ---------------------------------------------------------
    # 3. Convert BGR → HSV.
    #
    # HSV separates:
    # H = colour
    # S = colour intensity
    # V = brightness
    #
    # This makes colour classification easier than raw RGB.
    # ---------------------------------------------------------

    hsv = cv2.cvtColor(garment_region, cv2.COLOR_BGR2HSV)

    pixels = hsv.reshape(-1, 3)

    # ---------------------------------------------------------
    # 4. Remove extreme pixels that are often background,
    # highlights or shadows.
    # ---------------------------------------------------------

    useful_pixels = []

    for pixel in pixels:

        h, s, v = pixel

        if v < 20:
            continue

        if v > 245 and s < 15:
            continue

        useful_pixels.append(pixel)

    if len(useful_pixels) == 0:
        useful_pixels = pixels

    useful_pixels = np.array(useful_pixels, dtype=np.float32)

    # ---------------------------------------------------------
    # 5. K-Means clustering
    #
    # Instead of averaging every pixel, group similar colours.
    # The largest cluster represents the dominant colour.
    # ---------------------------------------------------------

    number_of_clusters = min(4, len(useful_pixels))

    criteria = (
        cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER,
        50,
        0.2,
    )

    _, labels, centers = cv2.kmeans(
        useful_pixels,
        number_of_clusters,
        None,
        criteria,
        10,
        cv2.KMEANS_PP_CENTERS,
    )

    cluster_counts = np.bincount(labels.flatten())

    dominant_cluster = np.argmax(cluster_counts)

    dominant_hsv = centers[dominant_cluster]

    h, s, v = dominant_hsv

    # ---------------------------------------------------------
    # 6. Convert HSV value to a readable colour name
    # ---------------------------------------------------------

    color_name = get_color_name(h, s, v)

    # ---------------------------------------------------------
    # 7. Convert detected HSV back to RGB for future frontend use
    # ---------------------------------------------------------

    hsv_pixel = np.uint8([[[h, s, v]]])

    bgr_pixel = cv2.cvtColor(
        hsv_pixel,
        cv2.COLOR_HSV2BGR
    )[0][0]

    b, g, r = [int(value) for value in bgr_pixel]

    return {
        "name": color_name,
        "rgb": [r, g, b],
    }
def detect_primary_color_from_bytes(image_bytes):
    """
    Detect primary clothing colour directly from image bytes.
    Used by the RabbitMQ AI worker.
    """

    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise ValueError(
            "Could not decode image bytes for colour detection."
        )

    image = cv2.resize(image, (300, 300))

    height, width = image.shape[:2]

    # Focus on central garment region
    x1 = int(width * 0.20)
    x2 = int(width * 0.80)

    y1 = int(height * 0.15)
    y2 = int(height * 0.85)

    garment_region = image[y1:y2, x1:x2]

    hsv = cv2.cvtColor(
        garment_region,
        cv2.COLOR_BGR2HSV
    )

    pixels = hsv.reshape(-1, 3)

    useful_pixels = []

    for pixel in pixels:
        h, s, v = pixel

        # Ignore extreme shadows
        if v < 20:
            continue

        # Ignore near-white background/highlights
        if v > 245 and s < 15:
            continue

        useful_pixels.append(pixel)

    if len(useful_pixels) == 0:
        useful_pixels = pixels

    useful_pixels = np.array(
        useful_pixels,
        dtype=np.float32
    )

    number_of_clusters = min(
        4,
        len(useful_pixels)
    )

    criteria = (
        cv2.TERM_CRITERIA_EPS
        + cv2.TERM_CRITERIA_MAX_ITER,
        50,
        0.2
    )

    _, labels, centers = cv2.kmeans(
        useful_pixels,
        number_of_clusters,
        None,
        criteria,
        10,
        cv2.KMEANS_PP_CENTERS
    )

    cluster_counts = np.bincount(
        labels.flatten()
    )

    dominant_cluster = np.argmax(
        cluster_counts
    )

    h, s, v = centers[
        dominant_cluster
    ]

    color_name = get_color_name(
        h,
        s,
        v
    )

    hsv_pixel = np.uint8(
        [[[h, s, v]]]
    )

    bgr_pixel = cv2.cvtColor(
        hsv_pixel,
        cv2.COLOR_HSV2BGR
    )[0][0]

    b, g, r = [
        int(value)
        for value in bgr_pixel
    ]

    return {
        "name": color_name,
        "rgb": [r, g, b]
    }


# Allows us to test this file independently
if __name__ == "__main__":

    image_path = input("Enter image path: ")

    result = detect_primary_color(image_path)

    print("\nDetected Colour")
    print("----------------")
    print("Name:", result["name"])
    print("RGB:", result["rgb"])