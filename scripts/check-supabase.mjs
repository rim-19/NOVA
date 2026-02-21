import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase env vars missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log('Products found:', data.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkProducts();
