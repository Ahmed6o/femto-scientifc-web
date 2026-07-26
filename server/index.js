import express from 'express';
import cors from 'cors';
import { supabase, initDb } from './db.js';
import { upload } from './upload.js';
import { syncToStaticFiles } from './sync.js';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'femto-admin-secret-key-123';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (user && !error) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '30d' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/images/uploads/${req.file.filename}` });
});

app.post('/api/scrape', auth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const fetchRes = await fetch(url);
    const html = await fetchRes.text();
    
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header').remove();
    const pageText = $('body').text().replace(/\s+/g, ' ').trim();
    
    let mainImageUrl = $('meta[property="og:image"]').attr('content') || 
                       $('.product-image img, .main-image img, .hero img, img').first().attr('src');
                       
    if (mainImageUrl && !mainImageUrl.startsWith('http')) {
        const urlObj = new URL(url);
        mainImageUrl = new URL(mainImageUrl, urlObj.origin).href;
    }

    const prompt = `
Extract the product details from the following webpage text. Return a JSON object with this exact structure:
{
  "name": "Product Name",
  "slug": "product-name-slug",
  "category": "Category Name",
  "brand": "Brand Name",
  "excerpt": "Short tagline or description",
  "description": "Full description of the product",
  "industry": ["Industry 1", "Industry 2"],
  "specifications": [
    { "group": "Group Name (e.g. ROD or General)", "key": "Spec Key", "value": "Spec Value" }
  ]
}

Webpage text:
${pageText.substring(0, 30000)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const aiData = JSON.parse(response.text);

    let localImageUrl = '';
    if (mainImageUrl) {
        try {
            const imgRes = await fetch(mainImageUrl);
            if (imgRes.ok) {
                const buffer = await imgRes.arrayBuffer();
                let ext = path.extname(new URL(mainImageUrl).pathname) || '.jpg';
                if (ext.length > 5) ext = '.jpg'; // Handle weird extensions
                const filename = 'ai-' + Date.now() + ext;
                const uploadDir = path.join(__dirname, '../public/images/uploads');
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
                fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(buffer));
                localImageUrl = '/images/uploads/' + filename;
            }
        } catch (e) {
            console.error('Image download failed:', e);
        }
    }

    aiData.image = localImageUrl;

    res.json(aiData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(products || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { data: p, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', auth, async (req, res) => {
  try {
    const { slug, name, category, brand, industry, image, description, excerpt, featured, url, specifications, video_url } = req.body;
    const { data, error } = await supabase.from('products').insert([
      { slug, name, category, brand, industry: industry || [], image, description, excerpt, featured: !!featured, url, specifications: specifications || [], video_url }
    ]).select().single();
    if (error) throw error;
    await syncToStaticFiles();
    res.json({ id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', auth, async (req, res) => {
  try {
    const { slug, name, category, brand, industry, image, description, excerpt, featured, url, specifications, video_url } = req.body;
    const { error } = await supabase.from('products').update({
      slug, name, category, brand, industry: industry || [], image, description, excerpt, featured: !!featured, url, specifications: specifications || [], video_url
    }).eq('id', req.params.id);
    if (error) throw error;
    await syncToStaticFiles();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Product not found or deletion blocked by database rules (RLS).' });
    }
    await syncToStaticFiles();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const { data: settingsRows, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    const settings = {};
    if (settingsRows) {
      settingsRows.forEach(row => {
        settings[row.key] = row.value;
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', auth, async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      const { data: existing } = await supabase.from('settings').select('key').eq('key', key).maybeSingle();
      if (existing) {
        await supabase.from('settings').update({ value }).eq('key', key);
      } else {
        await supabase.from('settings').insert([{ key, value }]);
      }
    }
    await syncToStaticFiles();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(console.error);
