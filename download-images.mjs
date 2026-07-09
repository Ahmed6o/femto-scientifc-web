import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import https from 'https';

const imagesDir = './public/images';

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', (err) => {
        fs.unlinkSync(dest);
        reject(err);
      });
    }).on('error', reject);
  });
}

async function processDirectory(dir) {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
      await processFile(fullPath);
    }
  }
}

async function processFile(filePath) {
  let content = await fsPromises.readFile(filePath, 'utf8');
  // Match any femto-scientific wp-content image URL
  const regex = /https:\/\/femto-scientific\.com\/wp-content\/uploads\/[^'"`\s)]+(?:\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg)/gi;
  
  let match;
  const urls = new Set();
  while ((match = regex.exec(content)) !== null) {
    urls.add(match[0]);
  }
  
  if (urls.size === 0) return;
  
  console.log(`Processing ${filePath} (${urls.size} images)...`);
  
  for (const url of urls) {
    let filename = path.basename(url);
    // Remove query params if any
    filename = filename.split('?')[0];
    // Avoid characters that might cause issues
    filename = decodeURIComponent(filename).replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const dest = path.join(imagesDir, filename);
    
    try {
      await fsPromises.access(dest);
    } catch {
      console.log(`Downloading ${filename}...`);
      try {
        await downloadImage(url, dest);
      } catch (err) {
        console.error(`Failed to download ${url}: ${err.message}`);
        continue;
      }
    }
    
    // Replace URL in content
    const localPath = `/images/${filename}`;
    content = content.split(url).join(localPath);
  }
  
  await fsPromises.writeFile(filePath, content, 'utf8');
}

async function run() {
  console.log('Starting image download script...');
  await fsPromises.mkdir(imagesDir, { recursive: true });
  await processDirectory('./src');
  console.log('All images downloaded and paths updated successfully!');
}

run().catch(console.error);
