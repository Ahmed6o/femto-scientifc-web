import os
from PIL import Image

output_dir = "public/images/products"

def check_sizes(image_numbers):
    for num in image_numbers:
        path = os.path.join(output_dir, f"product_v2_{num}.png")
        if os.path.exists(path):
            with Image.open(path) as img:
                print(f"product_v2_{num}.png: {img.width}x{img.height} (Aspect: {img.width/img.height:.2f})")
        else:
            print(f"product_v2_{num}.png: NOT FOUND")

print("--- Page 3 (Tensíío) ---")
check_sizes([3, 4, 5, 6, 7, 8])

print("\n--- Page 5 (SYNC) ---")
check_sizes([14, 15, 16, 17, 18])

print("\n--- Page 6 (TURBISCAN) ---")
check_sizes([19, 20, 21, 22, 23, 24])

print("\n--- Page 10 (L5M-A) ---")
check_sizes(range(45, 54))

print("\n--- Page 12 (PURESMART) ---")
check_sizes(range(62, 67))

print("\n--- Page 13 (aWLife) ---")
check_sizes(range(67, 72))

print("\n--- Page 14 (Serstech Arx) ---")
check_sizes(range(72, 76))

print("\n--- Page 17 (TR7 series) ---")
check_sizes(range(93, 96))

print("\n--- Page 18 (OxySense) ---")
check_sizes(range(96, 103))

print("\n--- Page 19 (Benchtop pH-Meter) ---")
check_sizes(range(103, 111))
