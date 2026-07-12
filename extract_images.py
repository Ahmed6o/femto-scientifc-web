import fitz  # PyMuPDF
import io
from PIL import Image
import os

pdf_path = "General Brochure Femto-scientific for pharma - final-1 - Copy - Copy (pdf.io).pdf"
output_dir = "public/images/products"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

try:
    doc = fitz.open(pdf_path)
    img_index = 1
    
    for page_index in range(len(doc)):
        page = doc[page_index]
        image_list = page.get_images()
        
        for image_info in image_list:
            xref = image_info[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Load image to check dimensions
            try:
                img = Image.open(io.BytesIO(image_bytes))
                # Skip very small images (like logos, bullets, etc.)
                if img.width >= 150 and img.height >= 150:
                    image_filename = f"product_{img_index}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    
                    # Fix colorspace / black image issues
                    pix = fitz.Pixmap(doc, xref)
                    if pix.n - pix.alpha >= 4:
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    
                    mode = "RGBA" if pix.alpha else "RGB"
                    corrected_img = Image.frombytes(mode, [pix.width, pix.height], pix.samples)
                    
                    if image_ext.lower() in ['jpeg', 'jpg']:
                        if corrected_img.mode in ('RGBA', 'LA'):
                            background = Image.new(corrected_img.mode[:-1], corrected_img.size, (255, 255, 255))
                            background.paste(corrected_img, corrected_img.split()[-1])
                            corrected_img = background
                        corrected_img.convert("RGB").save(image_path, "JPEG")
                    else:
                        corrected_img.save(image_path, "PNG")
                        
                    print(f"Saved {image_filename} from page {page_index + 1}")
                    img_index += 1

            except Exception as e:
                print(f"Error processing image {xref}: {e}")

    print(f"Extracted {img_index - 1} images successfully.")
except Exception as e:
    print(f"Failed to extract images: {e}")
