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
      console.log(`Retry ${i+1} for ${url}: ${err.message}`);
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
      console.log(`Retry download ${i+1} for ${url}: ${err.message}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error(`Failed to download ${url}`);
}

async function run() {
  await fsPromises.mkdir(imagesDir, { recursive: true });
  console.log('Fetching posts from WP API using fetch()...');
  let posts = [];
  let page = 1;
  while(true) {
      let p = await fetchJson(`https://femto-scientific.com/wp-json/wp/v2/posts?per_page=100&page=${page}`);
      if (!p || p.length === 0 || p.code === 'rest_post_invalid_page_number') break;
      posts = posts.concat(p);
      page++;
  }
  console.log(`Found ${posts.length} posts.`);
  
  let content = fs.readFileSync(productsFile, 'utf8');
  
  const productBlocks = content.split(/(?=\s*id:)/);
  for (let block of productBlocks) {
    const nameMatch = block.match(/name:\s*['"]([^'"]+)['"]/);
    const imgMatch = block.match(/image:\s*['"]([^'"]+)['"]/);
    
    if (nameMatch && imgMatch) {
      let name = nameMatch[1];
      const fakeUrl = imgMatch[1];
      
      let post = posts.find(p => p.title.rendered.toLowerCase().replace(/&#8211;/g, '-').replace(/&amp;/g, '&').trim() === name.toLowerCase().trim());
      if (!post) {
         post = posts.find(p => p.title.rendered.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.title.rendered.toLowerCase()));
      }
      
      if (post && post.featured_media) {
        const media = await fetchJson(`https://femto-scientific.com/wp-json/wp/v2/media/${post.featured_media}`);
        if (media && media.source_url) {
          const realUrl = media.source_url;
          let filename = path.basename(realUrl).split('?')[0];
          filename = decodeURIComponent(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
          const dest = path.join(imagesDir, filename);
          
          if (!fs.existsSync(dest)) {
            console.log(`Downloading real image ${filename} for ${name}...`);
            try {
              await downloadImage(realUrl, dest);
            } catch (err) {
              console.error(`Failed: ${err.message}`);
              continue;
            }
          } else {
             console.log(`Already have ${filename}`);
          }
          
          content = content.replace(fakeUrl, `/images/${filename}`);
        }
      } else {
        console.log(`No real media found for ${name}`);
      }
    }
  }
  
  const statics = [
    { url: 'https://femto-scientific.com/wp-content/uploads/2023/09/logo.svg', matchRegex: /https:\/\/femto-scientific\.com[^'"\s]+/g }
  ];
  
  let filename = path.basename(statics[0].url);
  const dest = path.join(imagesDir, filename);
  if (!fs.existsSync(dest)) {
      console.log(`Downloading ${filename}...`);
      try { await downloadImage(statics[0].url, dest); } catch(e){}
  }
  
  const processDir = async (dir) => {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') await processDir(fullPath);
        else if (fullPath.endsWith('.jsx')) {
            let text = fs.readFileSync(fullPath, 'utf8');
            let matched = false;
            text = text.replace(statics[0].matchRegex, (match) => {
                matched = true;
                return `/images/${filename}`;
            });
            if (matched) fs.writeFileSync(fullPath, text, 'utf8');
        }
    }
  };
  await processDir('./src');

  fs.writeFileSync(productsFile, content, 'utf8');
  console.log('Real images sync complete!');
}
run().catch(console.error);
