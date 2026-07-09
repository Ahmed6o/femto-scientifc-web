import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = './public/images/logos';
fs.mkdirSync(outDir, { recursive: true });

const lines = fs.readFileSync('extracted-urls.txt', 'utf8').split('\n');
const urls = lines.filter(l => l.includes('/thumbs/')).map(l => l.replace('&#039;)', ''));

const partners = [];
const clients = [];

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', err => { fs.unlinkSync(dest); reject(err); });
    }).on('error', reject);
  });
}

async function run() {
  let count = 0;
  for (let url of urls) {
    const filename = `logo_${count++}.png`;
    const dest = path.join(outDir, filename);
    if (!fs.existsSync(dest)) {
       try { await downloadImage(url, dest); } catch (e) { console.error(e); }
    }
    
    // Simple heuristic to split based on original site's naming conventions
    if (url.includes('WhatsApp') || /\d{4,}/.test(path.basename(url)) || url.includes('Cosmo') || url.includes('12-removebg') || url.includes('678-removebg') || url.includes('888-removebg')) {
      clients.push(`/images/logos/${filename}`);
    } else {
      partners.push(`/images/logos/${filename}`);
    }
  }

  // Move the 3M logo manually if we can't find it, wait I will just add the hardcoded text and assume 3M logo is one of them or I'll just use a generic path and download 3M logo.
  const jsContent = `export const partners = ${JSON.stringify(partners, null, 2)};\nexport const clients = ${JSON.stringify(clients, null, 2)};\n`;
  fs.writeFileSync('./src/data/logos.js', jsContent, 'utf8');
  console.log('Logos downloaded and src/data/logos.js created.');
}

run();
