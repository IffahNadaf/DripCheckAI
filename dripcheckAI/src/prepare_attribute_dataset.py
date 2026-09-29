import os
import zipfile
import random
import numpy as np

ZIP_PATH = "dataset/img.zip"
ATTR_FILE = "dataset/annotations/list_attr_img.txt"
SPLIT_FILE = "dataset/annotations/list_eval_partition.txt"

OUTPUT_DIR = "dataset/attribute_images"

# Selected DeepFashion attribute indices
SELECTED_INDICES = [
    # Pattern / Texture
    730, 365, 884, 441, 722,

    # Fabric / Material
    513, 495, 254, 142, 196, 546,

    # Shape
    596, 81, 226, 830, 831, 620,

    # Part
    837, 568, 956, 181, 720, 470,

    # Style
    162, 83
]

TRAIN_LIMIT = 5000
VAL_LIMIT = 1000
TEST_LIMIT = 1000

random.seed(42)

# --------------------------------------------------
# Read official split
# --------------------------------------------------

splits = {}

with open(SPLIT_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()[2:]

for line in lines:
    parts = line.strip().split()
    splits[parts[0]] = parts[1]


# --------------------------------------------------
# Read selected attribute labels
# --------------------------------------------------

attribute_data = {}

with open(ATTR_FILE, "r", encoding="utf-8") as f:
    lines = f.readlines()[2:]

for line in lines:

    parts = line.strip().split()

    image_path = parts[0]

    all_labels = parts[1:]

    selected = []

    for index in SELECTED_INDICES:

        value = int(all_labels[index])

        # DeepFashion:
        # 1  = positive
        # -1 = negative
        # 0  = unknown
        #
        # For this controlled experiment,
        # positive -> 1
        # everything else -> 0
        selected.append(
            1 if value == 1 else 0
        )

    attribute_data[image_path] = selected


# --------------------------------------------------
# Group according to official split
# --------------------------------------------------

split_images = {
    "train": [],
    "val": [],
    "test": []
}

for image_path in attribute_data:

    split = splits.get(image_path)

    if split in split_images:
        split_images[split].append(image_path)


limits = {
    "train": TRAIN_LIMIT,
    "val": VAL_LIMIT,
    "test": TEST_LIMIT
}


# --------------------------------------------------
# Extract images
# --------------------------------------------------

os.makedirs(OUTPUT_DIR, exist_ok=True)

with zipfile.ZipFile(ZIP_PATH, "r") as zip_file:

    zip_names = set(zip_file.namelist())

    for split in ["train", "val", "test"]:

        folder = os.path.join(
            OUTPUT_DIR,
            split
        )

        os.makedirs(
            folder,
            exist_ok=True
        )

        available = [
            path
            for path in split_images[split]
            if path in zip_names
        ]

        random.shuffle(available)

        selected_images = available[
            :limits[split]
        ]

        filenames = []
        labels = []

        print(
            f"{split}: extracting "
            f"{len(selected_images)} images..."
        )

        for i, image_path in enumerate(
            selected_images
        ):

            extension = os.path.splitext(
                image_path
            )[1]

            filename = (
                f"{split}_{i:05d}{extension}"
            )

            destination = os.path.join(
                folder,
                filename
            )

            with zip_file.open(
                image_path
            ) as source:

                with open(
                    destination,
                    "wb"
                ) as target:

                    target.write(
                        source.read()
                    )

            filenames.append(filename)

            labels.append(
                attribute_data[image_path]
            )

        np.savez_compressed(
            f"dataset/attribute_{split}.npz",
            filenames=np.array(filenames),
            labels=np.array(
                labels,
                dtype=np.float32
            )
        )


print("\nDONE!")
print("Selected attributes:", len(SELECTED_INDICES))
print("Train limit:", TRAIN_LIMIT)
print("Validation limit:", VAL_LIMIT)
print("Test limit:", TEST_LIMIT)