import jwt from 'jsonwebtoken';
import { supabase } from '../_supabase.js';

const SECRET = process.env.JWT_SECRET || 'femto-admin-secret-key-123';

function verifyAuth(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No token provided');
  if (token === 'null') throw new Error('Token is null string');
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error('JWT Verification failed: ' + err.message);
  }
}

export default async function handler(req, res) {
  try {
    const { method } = req;
    const id = req.query.id;

    if (method === 'GET') {
      const { data: p, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) return res.status(404).json({ error: 'Not found' });
      return res.json(p);
    }

    let user;
    try {
      user = verifyAuth(req);
    } catch (authErr) {
      return res.status(401).json({ error: 'Unauthorized: ' + authErr.message });
    }

    if (method === 'PUT') {
      let { slug, name, category, brand, industry, image, description, excerpt, featured, url, specifications, video_url } = req.body;
      
      let baseSlug = slug;
      if (!baseSlug && name) {
        baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      } else if (!baseSlug) {
        baseSlug = `product-${Date.now()}`;
      }

      let uniqueSlug = baseSlug;
      let counter = 1;
      let isUnique = false;
      
      while (!isUnique) {
        const { data: existing, error: checkError } = await supabase
          .from('products')
          .select('id')
          .eq('slug', uniqueSlug)
          .neq('id', id)
          .maybeSingle();
          
        if (checkError || !existing) {
          isUnique = true;
        } else {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }
      }

      const { data, error } = await supabase.from('products').update({
        slug: uniqueSlug, name, category, brand, industry: industry || [], image, description, excerpt, featured: !!featured, url, specifications: specifications || [], video_url
      }).eq('id', id).select();

      if (error) return res.status(500).json({ error: error.message });
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Product not found or update blocked by database rules (RLS).' });
      }
      return res.json({ success: true });
    }

    if (method === 'DELETE') {
      const { data, error } = await supabase.from('products').delete().eq('id', id).select();
      if (error) return res.status(500).json({ error: error.message });
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Product not found or deletion blocked by database rules (RLS).' });
      }
      return res.json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error occurred in Vercel function' });
  }
}
