import { supabase } from './server/db.js';
import { syncToStaticFiles } from './server/sync.js';

async function run() {
  const updates = [
    { slug: "tensiio-force-tensiometer", image: "/images/products/product_v2_4.png" },
    { slug: "sync-particle-size-shape-analyzer", image: "/images/products/product_v2_14.png" },
    { slug: "turbiscan-lab", image: "/images/products/product_v2_21.png" },
    { slug: "silverson-lab-mixer", image: "/images/products/product_v2_47.png" },
    { slug: "jacomex-puresmart-glovebox", image: "/images/products/product_v2_63.png" },
    { slug: "steroglass-awlife", image: "/images/products/product_v2_68.png" },
    { slug: "serstech-arx", image: "/images/products/product_v2_73.png" },
    { slug: "t-and-d-tr7-series", image: "/images/products/product_v2_94.png" },
    { slug: "pi-oxysense", image: "/images/products/product_v2_97.png" },
    { slug: "phoenix-benchtop-ph-meter", image: "/images/products/product_v2_107.png" }
  ];

  for (const item of updates) {
    const { error } = await supabase.from('products').update({ image: item.image }).eq('slug', item.slug);
    if (error) {
        console.error(`Failed to update ${item.slug}:`, error);
    } else {
        console.log(`Updated ${item.slug}`);
    }
  }
  
  await syncToStaticFiles();
  console.log("Images mapped and synced.");
}

run();
