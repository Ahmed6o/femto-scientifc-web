import { supabase } from './server/db.js';

async function run() {
  const { data: products, error } = await supabase.from('products').select('id, slug, name, brand');
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  const newSlugs = [
    "tensiio-force-tensiometer",
    "sync-particle-size-shape-analyzer",
    "turbiscan-lab",
    "silverson-lab-mixer",
    "jacomex-puresmart-glovebox",
    "steroglass-awlife",
    "serstech-arx",
    "t-and-d-tr7-series",
    "pi-oxysense",
    "phoenix-benchtop-ph-meter"
  ];
  
  const newProducts = products.filter(p => newSlugs.includes(p.slug));
  const oldProducts = products.filter(p => !newSlugs.includes(p.slug));
  
  console.log("--- New Products ---");
  newProducts.forEach(p => console.log(`${p.id}: [${p.brand}] ${p.name} (${p.slug})`));
  
  console.log("\n--- Old Products ---");
  oldProducts.forEach(p => console.log(`${p.id}: [${p.brand}] ${p.name} (${p.slug})`));
}

run();
