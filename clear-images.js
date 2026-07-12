import { supabase } from './server/db.js';
import { syncToStaticFiles } from './server/sync.js';

async function run() {
  const slugs = [
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

  for (const slug of slugs) {
    await supabase.from('products').update({ image: '' }).eq('slug', slug);
  }
  
  await syncToStaticFiles();
  console.log("Images cleared and synced.");
}

run();
