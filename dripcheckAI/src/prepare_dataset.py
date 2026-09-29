import os
import random
import zipfile
from collections import defaultdict

ZIP_PATH = "dataset/img.zip"
ANNOTATION_PATH = "dataset/annotations/list_category_img.txt"
OUTPUT_DIR = "dataset/poc_1000"

IMAGES_PER_CLASS = 200

selected_categories = {
    3: "Blouse",
    18: "Tee",
    26: "Jeans",
    32: "Shorts",
    41: "Dress"
}

# Read image paths and category IDs
category_images = defaultdict(list)

with open(ANNOTATION_PATH, "r") as f:
    lines = f.readlines()[2:]  # skip header

for line in lines:
    parts = line.split()
    image_path = parts[0]
    category_id = int(parts[1])

    if category_id in selected_categories:
        category_images[category_id].append(image_path)

# Use the same random selection every time
random.seed(42)

with zipfile.ZipFile(ZIP_PATH, "r") as zip_file:

    zip_names = set(zip_file.namelist())

    for category_id, category_name in selected_categories.items():

        os.makedirs(
            os.path.join(OUTPUT_DIR, category_name),
            exist_ok=True
        )

        available_images = [
            path for path in category_images[category_id]
            if path in zip_names
        ]

        selected = random.sample(
            available_images,
            IMAGES_PER_CLASS
        )

        for number, image_path in enumerate(selected, start=1):

            extension = os.path.splitext(image_path)[1]

            output_path = os.path.join(
                OUTPUT_DIR,
                category_name,
                f"{number:03d}{extension}"
            )

            with zip_file.open(image_path) as source:
                with open(output_path, "wb") as destination:
                    destination.write(source.read())

        print(
            f"{category_name}: "
            f"{len(selected)} images extracted"
        )

print("\nDataset preparation complete!")