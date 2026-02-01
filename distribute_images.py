#!/usr/bin/env python3
"""
Randomly distribute gallery images to bundang app directories
"""
import random
import shutil
from pathlib import Path

# Source and target paths
source_dir = Path("/Users/deneb/Downloads/제목을 입력해주세요_분류완료/gallery")
bundang_base = Path("/Users/deneb/bamAstro/apps/bundang/public/images")

# Verify source directory exists
if not source_dir.exists():
    print(f"Error: Source directory not found: {source_dir}")
    exit(1)

# Get all webp files and shuffle randomly
all_images = list(source_dir.glob("*.webp"))
print(f"Found {len(all_images)} webp images in source directory")

if len(all_images) < 43:
    print(f"Error: Not enough images. Need 43, found {len(all_images)}")
    exit(1)

random.shuffle(all_images)

# Track used images
used_images = []
image_index = 0

def get_next_image():
    """Get the next random image from the list"""
    global image_index
    if image_index >= len(all_images):
        raise Exception("Ran out of images!")
    img = all_images[image_index]
    image_index += 1
    return img

# Venue assignments
venues = {
    'highpublic': {
        'dir': bundang_base / 'venues' / 'highpublic',
        'numbered': 6,
        'numbered_prefix': 'highpublic',
        'main': 'hyperpublic_main.webp'
    },
    'karaoke': {
        'dir': bundang_base / 'venues' / 'karaoke',
        'numbered': 6,
        'numbered_prefix': 'karaoke',
        'main': 'karaoke_main.webp'
    },
    'shirts': {
        'dir': bundang_base / 'venues' / 'shirts',
        'numbered': 5,
        'numbered_prefix': 'shirts',
        'main': 'shirtsroom_main.webp'
    },
    'roomsalon': {
        'dir': bundang_base / 'venues' / 'roomsalon',
        'numbered': 5,
        'numbered_prefix': 'roomsalon',
        'main': 'roomsalon_main.webp'
    },
    'kimono': {
        'dir': bundang_base / 'venues' / 'kimono',
        'numbered': 5,
        'numbered_prefix': 'kimono',
        'main': 'kimono_main.webp'
    },
    'hostbar': {
        'dir': bundang_base / 'venues' / 'hostbar',
        'numbered': 0,
        'numbered_prefix': None,
        'main': 'hostbar_main.webp'
    }
}

# Partners directory
partners_dir = bundang_base / 'partners'
partners_dir.mkdir(parents=True, exist_ok=True)

print("\n=== Starting image distribution ===\n")

# Process venues
for venue_name, venue_config in venues.items():
    print(f"Processing {venue_name}...")
    venue_dir = venue_config['dir']
    venue_dir.mkdir(parents=True, exist_ok=True)

    # Copy numbered images
    for i in range(1, venue_config['numbered'] + 1):
        src_img = get_next_image()
        dst_name = f"{venue_config['numbered_prefix']}_{i}.webp"
        dst_path = venue_dir / dst_name

        shutil.copy2(src_img, dst_path)
        used_images.append(src_img)
        print(f"  Copied {src_img.name} -> {dst_name}")

    # Copy main image
    src_img = get_next_image()
    dst_path = venue_dir / venue_config['main']
    shutil.copy2(src_img, dst_path)
    used_images.append(src_img)
    print(f"  Copied {src_img.name} -> {venue_config['main']}")

# Process partners
print(f"\nProcessing partners...")
for i in range(1, 11):
    src_img = get_next_image()
    dst_name = f"partner_{i}.webp"
    dst_path = partners_dir / dst_name

    shutil.copy2(src_img, dst_path)
    used_images.append(src_img)
    print(f"  Copied {src_img.name} -> {dst_name}")

print(f"\n=== Distribution complete ===")
print(f"Total images copied: {len(used_images)}")
print(f"\nDeleting used source images...")

# Delete used images from source
for img in used_images:
    img.unlink()
    print(f"  Deleted {img.name}")

remaining = len(list(source_dir.glob("*.webp")))
print(f"\n=== Summary ===")
print(f"Images copied: {len(used_images)}")
print(f"Images remaining in source: {remaining}")
print(f"Expected remaining: {233 - 43} = 190")
print(f"\nDone!")
