import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

global.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function initDb() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing in .env file.");
  } else {
    console.log("✅ Supabase client initialized.");
  }
}
