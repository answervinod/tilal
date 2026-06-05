import os
from pathlib import Path
from PIL import Image

BASE_DIR = Path('public/Tilal Binghatti')

def compress_image(file_path):
    if file_path.suffix.lower() not in ['.jpg', '.jpeg', '.png']:
        return

    out_path = file_path.with_suffix('.webp')
    if out_path.exists():
        return

    try:
        with Image.open(file_path) as img:
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            max_width = 1200
            if img.width > max_width:
                ratio = max_width / img.width
                new_size = (max_width, int(img.height * ratio))
                img = img.resize(new_size, Image.Resampling.LANCZOS)
                
            img.save(out_path, 'WEBP', quality=80)
            
            orig_size = os.path.getsize(file_path) / (1024 * 1024)
            new_size = os.path.getsize(out_path) / (1024 * 1024)
            print(f"Compressed {file_path.name}: {orig_size:.2f}MB -> {new_size:.2f}MB")
    except Exception as e:
        print(f"Error compressing {file_path}: {e}")

def main():
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            file_path = Path(root) / file
            compress_image(file_path)

if __name__ == '__main__':
    main()
