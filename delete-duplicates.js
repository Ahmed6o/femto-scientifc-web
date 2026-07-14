import { supabase } from './server/db.js';
import { syncToStaticFiles } from './server/sync.js';

async function run() {
  const duplicateIds = [10, 17];
  
  for (const id of duplicateIds) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
        console.error(`Failed to delete product ${id}:`, error);
    } else {
        console.log(`Successfully deleted duplicate product ${id}`);
    }
  }
  
  await syncToStaticFiles();
  console.log("Database synced after removing duplicates.");
}

run();
