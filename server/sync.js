import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function syncToStaticFiles() {
  try {
    const { data: products, error: productsError } = await supabase.from('products').select('*');
    if (productsError) throw productsError;

    const { data: settingsRows, error: settingsError } = await supabase.from('settings').select('*');
    if (settingsError) throw settingsError;

    const settings = {};
    if (settingsRows) {
      settingsRows.forEach(row => {
        settings[row.key] = row.value;
      });
    }

    // Write src/data/products.js
    const productsContent = `
export const products = ${JSON.stringify(products || [], null, 2)};
export const categories = ${JSON.stringify(settings.categories || [], null, 2)};
export const industries = ${JSON.stringify(settings.industries || [], null, 2)};
export const brands = ${JSON.stringify(settings.brands || [], null, 2)};
export const stats = ${JSON.stringify(settings.stats || [], null, 2)};
export const heroSlides = ${JSON.stringify(settings.heroSlides || [], null, 2)};
export const featuredProducts = (products || []).filter(p => p.featured);
export const getProductBySlug = (slug) => (products || []).find(p => p.slug === slug);
`;
    fs.writeFileSync(path.join(__dirname, '../src/data/products.js'), productsContent);

    // Write src/data/logos.js
    const logosContent = `
export const partners = ${JSON.stringify(settings.partners || [], null, 2)};
export const clients = ${JSON.stringify(settings.clients || [], null, 2)};
`;
    fs.writeFileSync(path.join(__dirname, '../src/data/logos.js'), logosContent);

    // Write src/data/pages.js
    const pagesContent = `
export const pageHome = ${JSON.stringify(settings.page_home || {}, null, 2)};
export const pageAbout = ${JSON.stringify(settings.page_about || {}, null, 2)};
export const pageContact = ${JSON.stringify(settings.page_contact || {}, null, 2)};
export const pageApp = ${JSON.stringify(settings.page_app || {}, null, 2)};
export const pageSol = ${JSON.stringify(settings.page_sol || {}, null, 2)};
`;
    fs.writeFileSync(path.join(__dirname, '../src/data/pages.js'), pagesContent);

    console.log('Successfully synced database to static files.');
  } catch (err) {
    console.error('Failed to sync to static files:', err);
  }
}
