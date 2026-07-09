import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

async function migrateData() {
  try {
    console.log("Migrating Users...");
    const users = await query('SELECT * FROM users');
    for (const user of users) {
      const { error } = await supabase.from('users').upsert([
        { id: user.id, username: user.username, password: user.password }
      ]);
      if (error) console.error('Error inserting user:', error.message);
    }

    console.log("Migrating Settings...");
    const settings = await query('SELECT * FROM settings');
    for (const setting of settings) {
      let value = setting.value;
      try { value = JSON.parse(setting.value); } catch (e) {}
      const { error } = await supabase.from('settings').upsert([
        { key: setting.key, value: value }
      ]);
      if (error) console.error('Error inserting setting:', error.message);
    }

    console.log("Migrating Products...");
    const products = await query('SELECT * FROM products');
    for (const p of products) {
      let industry = p.industry;
      let specifications = p.specifications;
      try { industry = JSON.parse(p.industry); } catch (e) {}
      try { specifications = JSON.parse(p.specifications); } catch (e) {}
      
      const { error } = await supabase.from('products').upsert([
        { 
          id: p.id,
          slug: p.slug,
          name: p.name,
          category: p.category,
          brand: p.brand,
          industry: industry || [],
          image: p.image,
          description: p.description,
          excerpt: p.excerpt,
          featured: p.featured === 1,
          url: p.url,
          specifications: specifications || [],
          video_url: p.video_url
        }
      ]);
      if (error) console.error('Error inserting product:', error.message);
    }

    console.log("Migration complete!");
    process.exit(0);
  } catch(err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateData();
