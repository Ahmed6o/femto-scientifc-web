import jwt from 'jsonwebtoken';
import { supabase } from './_supabase.js';

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

    if (method === 'GET') {
      const { data: products, error } = await supabase.from('products').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.json(products || []);
    }

    if (method === 'POST') {
      let user;
      try {
        user = verifyAuth(req);
      } catch (authErr) {
        return res.status(401).json({ error: 'Unauthorized: ' + authErr.message });
      }

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
          .maybeSingle();
          
        if (checkError || !existing) {
          isUnique = true;
        } else {
          uniqueSlug = `${baseSlug}-${counter}`;
          counter++;
        }
      }

      const { data, error } = await supabase.from('products').insert([
        { slug: uniqueSlug, name, category, brand, industry: industry || [], image, description, excerpt, featured: !!featured, url, specifications: specifications || [], video_url }
      ]).select().single();

      if (error) return res.status(500).json({ error: error.message });
      return res.json({ id: data?.id });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error("Vercel API Error:", err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
