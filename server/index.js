import express from 'express';
import cors from 'cors';
import { supabase, initDb } from './db.js';
import { upload } from './upload.js';
import { syncToStaticFiles } from './sync.js';
import jwt from 'jsonwebtoken';

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
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/images/uploads/${req.file.filename}` });
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
