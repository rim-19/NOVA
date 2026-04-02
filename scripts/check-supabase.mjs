import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContents = fs.readFileSync(envPath, 'utf8');
    envContents.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) return;
        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim();
        if (!process.env[key]) {
            process.env[key] = value;
        }
    });
}

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
