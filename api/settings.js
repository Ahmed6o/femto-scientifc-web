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
    const { data: settingsRows, error } = await supabase.from('settings').select('*');
    if (error) return res.status(500).json({ error: error.message });

    const settings = {};
    if (settingsRows) {
      settingsRows.forEach(row => {
        settings[row.key] = row.value;
      });
    }
    return res.json(settings);
  }

  if (method === 'PUT') {
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    try {
      for (const [key, value] of Object.entries(req.body)) {
        const { data: existing } = await supabase.from('settings').select('key').eq('key', key).maybeSingle();
        if (existing) {
          await supabase.from('settings').update({ value }).eq('key', key);
        } else {
          await supabase.from('settings').insert([{ key, value }]);
        }
      }
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
