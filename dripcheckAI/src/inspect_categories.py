from collections import Counter

with open("dataset/annotations/list_category_img.txt", "r") as f:
    lines = f.readlines()[2:]  # skip first two header lines

category_counts = Counter()

for line in lines:
    parts = line.split()
    category_id = int(parts[1])
    category_counts[category_id] += 1

# DeepFashion IDs for our selected categories
selected_categories = {
    3: "Blouse",
    18: "Tee",
    26: "Jeans",
    32: "Shorts",
    41: "Dress"
}

for category_id, name in selected_categories.items():
    print(f"{name}: {category_counts[category_id]} images")