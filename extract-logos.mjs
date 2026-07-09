import fs from 'fs';
import https from 'https';

https.get('https://femto-scientific.com/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const regex = /https:\/\/femto-scientific\.com\/wp-content\/uploads\/[^"'\s>]+/g;
    const matches = data.match(regex) || [];
    const unique = [...new Set(matches)];
    fs.writeFileSync('extracted-urls.txt', unique.join('\n'));
    console.log(`Extracted ${unique.length} URLs`);
  });
});
