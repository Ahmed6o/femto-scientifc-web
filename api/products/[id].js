import jwt from 'jsonwebtoken';
import { supabase } from '../_supabase.js';

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
  const id = req.query.id;

  if (method === 'GET') {
    const { data: p, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Not found' });
    return res.json(p);
  }

  const user = verifyAuth(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (method === 'PUT') {
    const { slug, name, category, brand, industry, image, description, excerpt, featured, url, specifications, video_url } = req.body;
    const { error } = await supabase.from('products').update({
      slug, name, category, brand, industry: industry || [], image, description, excerpt, featured: !!featured, url, specifications: specifications || [], video_url
    }).eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  if (method === 'DELETE') {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
