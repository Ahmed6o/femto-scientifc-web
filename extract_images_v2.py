import fitz
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
        images = page.get_image_info(xrefs=True)
        
        for img in images:
            xref = img.get('xref')
            bbox = img.get('bbox')
            
            # Skip if xref is 0 or missing (inline images have xref=0)
            # Or if bbox is too small
            if not bbox:
                continue
                
            rect = fitz.Rect(bbox)
            
            # Original image dimensions
            orig_width = img.get('width', 0)
            orig_height = img.get('height', 0)
            
            # Skip very small images (like logos, bullets)
            if orig_width >= 150 and orig_height >= 150:
                # Render the bounding box from the page directly!
                # This guarantees it looks exactly as it appears in the PDF, solving all black/mask issues.
                # Use a zoom factor of 3 for high resolution
                mat = fitz.Matrix(3, 3)
                pix = page.get_pixmap(clip=rect, matrix=mat)
                
                image_filename = f"product_v2_{img_index}.png"
                image_path = os.path.join(output_dir, image_filename)
                
                pix.save(image_path)
                print(f"Saved {image_filename} (xref: {xref}) from page {page_index + 1}")
                img_index += 1

    print(f"Extracted {img_index - 1} images successfully using page rendering.")
except Exception as e:
    print(f"Failed to extract images: {e}")
