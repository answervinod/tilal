import os
import fitz  # PyMuPDF
from pathlib import Path

BASE_DIR = Path('public/Tilal Binghatti')

def convert_pdf_to_images(pdf_path, output_dir):
    print(f"Converting: {pdf_path}")
    doc = fitz.open(pdf_path)
    os.makedirs(output_dir, exist_ok=True)
    
    # 0.5x zoom is plenty for web (~700-1000px wide)
    zoom_x = 0.5 
    zoom_y = 0.5 
    mat = fitz.Matrix(zoom_x, zoom_y)
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(matrix=mat)
        output_file = os.path.join(output_dir, f"page_{page_num + 1}.webp")
        # Save as WebP via PIL (since PyMuPDF might not support WEBP natively in all builds)
        # Actually PyMuPDF supports writing to PNG, then we can convert it. Wait, PyMuPDF supports saving to image.
        # Let's save to PIL Image directly from pixmap to ensure WebP encoding at 80% quality
        from PIL import Image
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        img.save(output_file, "WEBP", quality=80)
        print(f"  Saved: {output_file}")
    
    doc.close()

def main():
    # Target folders
    targets = [
        BASE_DIR / 'Unit Plans',
        BASE_DIR / 'Payment Plan & Pricing',
        BASE_DIR / 'Tilal Community General',
        BASE_DIR
    ]
    
    for target in targets:
        if not target.exists() or not target.is_dir():
            continue
            
        for file in target.iterdir():
            if file.is_file() and file.suffix.lower() == '.pdf':
                # Place images in public/assets/pdf-images/...
                rel_path = file.relative_to(BASE_DIR)
                out_dir = Path('public/assets/pdf-images') / rel_path.parent / file.stem
                
                if out_dir.exists() and len(list(out_dir.glob('*.webp'))) > 0:
                    print(f"Skipping already processed: {file}")
                    continue
                
                convert_pdf_to_images(file, out_dir)

if __name__ == '__main__':
    main()
