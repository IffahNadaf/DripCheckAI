from collections import Counter

ATTR_NAME_FILE = "dataset/annotations/list_attr_cloth.txt"
ATTR_LABEL_FILE = "dataset/annotations/list_attr_img.txt"

# --------------------------------------------------
# Read attribute names and types
# --------------------------------------------------

attributes = []

with open(ATTR_NAME_FILE, "r", encoding="utf-8") as file:
    lines = file.readlines()[2:]

for index, line in enumerate(lines):
    parts = line.strip().rsplit(maxsplit=1)

    if len(parts) == 2:
        name = parts[0]
        attr_type = int(parts[1])

        attributes.append({
            "index": index,
            "name": name,
            "type": attr_type
        })


# --------------------------------------------------
# Count positive examples for each attribute
# --------------------------------------------------

positive_counts = Counter()

with open(ATTR_LABEL_FILE, "r", encoding="utf-8") as file:
    lines = file.readlines()[2:]

for line in lines:
    parts = line.strip().split()

    labels = parts[1:]

    for index, label in enumerate(labels):

        if label == "1":
            positive_counts[index] += 1


# --------------------------------------------------
# Print useful attributes by group
# --------------------------------------------------

type_names = {
    1: "TEXTURE / PATTERN",
    2: "FABRIC / MATERIAL",
    3: "SHAPE",
    4: "PART",
    5: "STYLE"
}

for attr_type in range(1, 6):

    print("\n" + "=" * 60)
    print(type_names[attr_type])
    print("=" * 60)

    group = [
        attr for attr in attributes
        if attr["type"] == attr_type
    ]

    group.sort(
        key=lambda x: positive_counts[x["index"]],
        reverse=True
    )

    # Only show the 15 most common attributes
    for attr in group[:15]:

        count = positive_counts[attr["index"]]

        print(
            f'{attr["index"]:4d} | '
            f'{attr["name"]:<35} | '
            f'{count} positives'
        )