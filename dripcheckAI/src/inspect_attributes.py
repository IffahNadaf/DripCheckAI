file_path = "dataset/annotations/list_attr_cloth.txt"

type_names = {
    1: "Texture",
    2: "Fabric",
    3: "Shape",
    4: "Part",
    5: "Style"
}

counts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
}

with open(file_path, "r", encoding="utf-8") as file:
    lines = file.readlines()[2:]

for line in lines:
    parts = line.strip().rsplit(maxsplit=1)

    if len(parts) == 2:
        attribute_name = parts[0]
        attribute_type = int(parts[1])

        counts[attribute_type] += 1

print("DeepFashion Attribute Distribution:\n")

for attribute_type, count in counts.items():
    print(f"{type_names[attribute_type]}: {count}")