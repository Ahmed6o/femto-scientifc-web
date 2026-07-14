import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) console.error('Error:', error);
  else console.log('Product keys:', data.length > 0 ? Object.keys(data[0]) : 'No products');
  
  const { data: user, error: userError } = await supabase.from('users').select('*');
  console.log('Users error?', userError ? userError.message : 'No error');
}

check();
