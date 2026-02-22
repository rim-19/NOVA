import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
    id: string;
    name: string;
    slug: string;
    collection_slug: string;
    collection: string;
    price: number;
    discount_price?: number;
    images: string[];
    poetic_description?: string;
    description?: string;
    short_description?: string;
    sizes: string[];
    product_type?: "set" | "bodysuit" | "bodysocks" | "accessories";
    colors?: string[];
    is_bestseller?: boolean;
    is_new_arrival?: boolean;
    popularity?: number;
    category?: string;
    materials?: string;
    care_instructions?: string;
    is_featured?: boolean;
    is_visible?: boolean;
    created_at?: string;
};

export type Collection = {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    image: string;
    count: string;
    theme_color?: string;
    hero_phrase?: string;
    created_at?: string;
};

export type Order = {
    id: string;
    customer_name: string;
    phone: string;
    city: string;
    address?: string | null;
    message?: string | null;
    items?: CartItem[] | null;
    total_price?: number | null;
    status: 'new' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
};

export type HomepageConfig = {
    id: string;
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    narrative_blocks: any[]; // JSON array of narrative blocks
};

export type CartItem = {
    id: string;
    name: string;
    slug?: string;
    price: number;
    original_price?: number;
    quantity: number;
    image: string;
    size?: string;
};
