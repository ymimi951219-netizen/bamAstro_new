#!/usr/bin/env python3
"""
갤러리 이미지를 인계동 사이트로 랜덤 복사하는 스크립트
"""

import os
import random
import shutil
from pathlib import Path

# 경로 설정
GALLERY_DIR = "/Users/deneb/Downloads/제목을 입력해주세요_분류완료/gallery"
TARGET_DIR = "/Users/deneb/bamAstro/apps/ingedong/public/images"

def get_gallery_images():
    """갤러리 폴더에서 모든 이미지 파일 가져오기"""
    gallery_path = Path(GALLERY_DIR)
    extensions = ['.jpg', '.jpeg', '.png', '.webp']
    images = []

    for ext in extensions:
        images.extend(list(gallery_path.glob(f'*{ext}')))
        images.extend(list(gallery_path.glob(f'*{ext.upper()}')))

    return images

def copy_random_images():
    """랜덤으로 이미지 복사"""
    gallery_images = get_gallery_images()

    if not gallery_images:
        print("❌ 갤러리에 이미지가 없습니다.")
        return

    print(f"✅ 갤러리 이미지 총 {len(gallery_images)}개 발견")

    # 랜덤하게 섞기
    random.shuffle(gallery_images)

    # 복사할 이미지 맵핑
    copy_map = {
        # Venue 이미지
        'venues/highpublic_1.webp': 0,
        'venues/highpublic_2.webp': 1,
        'venues/highpublic_3.webp': 2,
        'venues/highpublic_4.webp': 3,
        'venues/highpublic_5.webp': 4,
        'venues/highpublic_6.webp': 5,
        'venues/hyperpublic_main.webp': 6,

        'venues/karaoke_1.webp': 7,
        'venues/karaoke_2.webp': 8,
        'venues/karaoke_3.webp': 9,
        'venues/karaoke_4.webp': 10,
        'venues/karaoke_5.webp': 11,
        'venues/karaoke_6.webp': 12,
        'venues/karaoke_main.webp': 13,

        'venues/roomsalon_1.webp': 14,
        'venues/roomsalon_2.webp': 15,
        'venues/roomsalon_3.webp': 16,
        'venues/roomsalon_4.webp': 17,
        'venues/roomsalon_5.webp': 18,
        'venues/roomsalon_6.webp': 19,
        'venues/roomsalon_main.webp': 20,

        'venues/shirts_1.webp': 21,
        'venues/shirts_2.webp': 22,
        'venues/shirts_3.webp': 23,
        'venues/shirts_4.webp': 24,
        'venues/shirts_5.webp': 25,
        'venues/shirts_6.webp': 26,
        'venues/shirtsroom_main.webp': 27,

        'venues/kimono_1.webp': 28,
        'venues/kimono_2.webp': 29,
        'venues/kimono_3.webp': 30,
        'venues/kimono_4.webp': 31,
        'venues/kimono_5.webp': 32,
        'venues/kimono_6.webp': 33,
        'venues/kimono_main.webp': 34,

        'venues/hostbar_main.webp': 35,

        # OG 이미지 (홈페이지 공유 이미지)
        'og-home.jpg': 36,

        # 인계동 대표 이미지
        'suwon-highpublic-karaoke-private-room.webp': 37,
    }

    copied_count = 0

    for target_file, index in copy_map.items():
        if index >= len(gallery_images):
            print(f"⚠️  인덱스 {index}가 범위를 벗어났습니다. 갤러리 이미지: {len(gallery_images)}개")
            break

        src = gallery_images[index]
        dst = Path(TARGET_DIR) / target_file

        # 대상 디렉토리 생성
        dst.parent.mkdir(parents=True, exist_ok=True)

        # 복사
        shutil.copy2(src, dst)
        copied_count += 1
        print(f"✅ {src.name} → {target_file}")

    print(f"\n🎉 총 {copied_count}개 이미지 복사 완료!")

    # 갤러리용 추가 이미지 (홈페이지 갤러리 섹션용)
    print("\n📸 갤러리 섹션용 이미지 복사 중...")
    gallery_section_dir = Path(TARGET_DIR) / "gallery"
    gallery_section_dir.mkdir(parents=True, exist_ok=True)

    # 갤러리 섹션용 12개 이미지 복사
    for i in range(38, min(50, len(gallery_images))):
        src = gallery_images[i]
        dst = gallery_section_dir / f"gallery_{i-37}.webp"
        shutil.copy2(src, dst)
        print(f"✅ {src.name} → gallery/gallery_{i-37}.webp")

    print(f"\n✨ 갤러리 섹션 이미지 {min(12, len(gallery_images) - 38)}개 복사 완료!")

if __name__ == "__main__":
    print("🚀 인계동 사이트 이미지 교체 시작...\n")
    copy_random_images()
    print("\n✅ 모든 이미지 복사 완료!")
