import jwt from 'jsonwebtoken';
import { supabase } from './_supabase.js';

const SECRET = process.env.JWT_SECRET || 'femto-admin-secret-key-123';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
}
