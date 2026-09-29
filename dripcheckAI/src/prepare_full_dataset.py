import os
import zipfile
import random
import shutil

ZIP_PATH = "dataset/img.zip"
CATEGORY_FILE = "dataset/annotations/list_category_img.txt"
SPLIT_FILE = "dataset/annotations/list_eval_partition.txt"

OUTPUT_DIR = "dataset/full_categories_500"

# Keep the experiment manageable on CPU.
# 100 images per category = up to 5,000 images across 50 DeepFashion categories.
IMAGES_PER_CATEGORY = 500

random.seed(42)

# --------------------------------------------------
# 1. Read image -> category ID
# --------------------------------------------------

image_categories = {}

with open(CATEGORY_FILE, "r", encoding="utf-8") as file:
    lines = file.readlines()[2:]

for line in lines:
    parts = line.strip().split()

    if len(parts) >= 2:
        image_path = parts[0]
        category_id = int(parts[-1])

        image_categories[image_path] = category_id


# --------------------------------------------------
# 2. Read official DeepFashion splits
# --------------------------------------------------

image_splits = {}

with open(SPLIT_FILE, "r", encoding="utf-8") as file:
    lines = file.readlines()[2:]

for line in lines:
    parts = line.strip().split()

    if len(parts) >= 2:
        image_path = parts[0]
        split = parts[-1]

        image_splits[image_path] = split


# --------------------------------------------------
# 3. Group images by category
# --------------------------------------------------

categories = {}

for image_path, category_id in image_categories.items():

    if image_path not in image_splits:
        continue

    categories.setdefault(category_id, []).append(image_path)


print("Categories found:", len(categories))


# --------------------------------------------------
# 4. Extract a controlled subset from img.zip
# --------------------------------------------------

os.makedirs(OUTPUT_DIR, exist_ok=True)

with zipfile.ZipFile(ZIP_PATH, "r") as zip_file:

    zip_names = set(zip_file.namelist())

    for category_id, images in sorted(categories.items()):

        available = [
            image
            for image in images
            if image in zip_names
        ]

        if not available:
            continue

        selected = random.sample(
            available,
            min(IMAGES_PER_CATEGORY, len(available))
        )

        print(
            f"Category {category_id}: "
            f"{len(selected)} images"
        )

        for image_path in selected:

            split = image_splits[image_path]

            destination_folder = os.path.join(
                OUTPUT_DIR,
                split,
                str(category_id)
            )

            os.makedirs(
                destination_folder,
                exist_ok=True
            )

            filename = os.path.basename(image_path)

            destination = os.path.join(
                destination_folder,
                filename
            )

            with zip_file.open(image_path) as source:
                with open(destination, "wb") as target:
                    shutil.copyfileobj(source, target)


print("\nDataset preparation complete!")
print("Saved to:", OUTPUT_DIR)