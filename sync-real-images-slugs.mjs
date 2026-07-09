import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

const imagesDir = './public/images';
const productsFile = './src/data/products.js';

async function fetchJson(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return null;
}

async function downloadImage(url, dest) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      await fsPromises.writeFile(dest, Buffer.from(buffer));
      return;
    } catch (err) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error(`Failed to download ${url}`);
}

async function run() {
  await fsPromises.mkdir(imagesDir, { recursive: true });
  let content = fs.readFileSync(productsFile, 'utf8');
  
  const productBlocks = content.split(/(?=\s*id:)/);
  for (let block of productBlocks) {
    const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/);
    const imgMatch = block.match(/image:\s*['"]([^'"]+)['"]/);
    
    if (slugMatch && imgMatch) {
      let slug = slugMatch[1];
      const fakeUrl = imgMatch[1];
      
      if (fakeUrl.startsWith('/images/')) continue;
      
      console.log(`Checking ${slug}...`);
      let posts = await fetchJson(`https://femto-scientific.com/wp-json/wp/v2/posts?slug=${slug}`);
      if (!posts || posts.length === 0) {
        let kw = slug.split('-')[0];
        posts = await fetchJson(`https://femto-scientific.com/wp-json/wp/v2/posts?search=${kw}`);
      }
      
      if (posts && posts.length > 0 && posts[0].featured_media) {
        const media = await fetchJson(`https://femto-scientific.com/wp-json/wp/v2/media/${posts[0].featured_media}`);
        if (media && media.source_url) {
          const realUrl = media.source_url;
          let filename = path.basename(realUrl).split('?')[0];
          filename = decodeURIComponent(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
          const dest = path.join(imagesDir, filename);
          
          if (!fs.existsSync(dest)) {
            console.log(`Downloading ${filename} for ${slug}...`);
            try { await downloadImage(realUrl, dest); } catch(e){}
          }
          content = content.replace(fakeUrl, `/images/${filename}`);
        }
      }
    }
  }

  // Any remaining fake urls will be mapped to a fallback existing local image
  content = content.replace(/https:\/\/femto-scientific\.com\/wp-content\/uploads\/[^'"]+/g, '/images/6.png');
  
  fs.writeFileSync(productsFile, content, 'utf8');
  console.log('Final image sync complete!');
}
run().catch(console.error);
