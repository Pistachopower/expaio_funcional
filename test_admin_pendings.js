import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Admin Pendings Query...');
  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombre, apellido, rol, estado_cuenta')
    .eq('estado_cuenta', 'pendiente');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Pendings:', data);
  }
}
test();
