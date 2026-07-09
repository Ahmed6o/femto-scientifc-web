import jwt from 'jsonwebtoken';
import { supabase } from './_supabase.js';

const SECRET = process.env.JWT_SECRET || 'femto-admin-secret-key-123';

function verifyAuth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { data: products, error } = await supabase.from('products').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(products || []);
  }

  if (method === 'POST') {
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { slug, name, category, brand, industry, image, description, excerpt, featured, url, specifications, video_url } = req.body;
    const { data, error } = await supabase.from('products').insert([
      { slug, name, category, brand, industry: industry || [], image, description, excerpt, featured: !!featured, url, specifications: specifications || [], video_url }
    ]).select().single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ id: data.id });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
