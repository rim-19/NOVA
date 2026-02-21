import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ktrumkbbgcezlebzrdxi.supabase.co';
const supabaseAnonKey = 'sb_publishable_hQVk6vf9zCip5lzE78guLg_GX2Fo_ff';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const products = [
    {
        name: "Noir Profond Silk Set",
        slug: "noir-profond-silk-set",
        collection_slug: "noir-profond",
        collection: "Noir Profond",
        price: 1850,
        images: ["/assets/image-0.png", "/assets/image-1.png"],
        poetic_description: "A whisper of midnight silk, crafted for the silent hours.",
        description: "Hand-stitched silk chemise with delicate Calais lace detailing.",
        sizes: ["XS", "S", "M", "L"]
    },
    {
        name: "Velveteen Desire Gown",
        slug: "velveteen-desire-gown",
        collection_slug: "velours-rouge",
        collection: "Velours Rouge",
        price: 2400,
        images: ["/assets/image-2.png", "/assets/image-3.png"],
        poetic_description: "The weight of desire, the lightness of touch.",
        description: "Deep red velvet gown with a floor-length silhouette and gold accents.",
        sizes: ["S", "M", "L"]
    },
    {
        name: "Golden Hour Lace",
        slug: "golden-hour-lace",
        collection_slug: "dentelle-dor",
        collection: "Dentelle d'Or",
        price: 1550,
        images: ["/assets/image-4.png", "/assets/image-5.png"],
        poetic_description: "Captured sunlight in every thread.",
        description: "Exquisite gold-thread lace lingerie set for unmatched elegance.",
        sizes: ["XS", "S", "M"]
    },
    {
        name: "Ombre Satin Robe",
        slug: "ombre-satin-robe",
        collection_slug: "ombre-ivoire",
        collection: "Ombre Ivoire",
        price: 2100,
        images: ["/assets/image-6.png", "/assets/image-7.png"],
        poetic_description: "A breath of ivory, as light as a memory.",
        description: "Premium ivory satin robe with dramatic sleeves and silk belt.",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        name: "Midnight Lace Bodysuit",
        slug: "midnight-lace-bodysuit",
        collection_slug: "noir-profond",
        collection: "Noir Profond",
        price: 1350,
        images: ["/assets/image-8.png", "/assets/image-9.png"],
        poetic_description: "Intricacy meets intimacy.",
        description: "Full lace bodysuit with adjustable silk straps and subtle shimmer.",
        sizes: ["XS", "S", "M", "L"]
    }
];

async function seed() {
    console.log('Clearing existing products...');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Seeding products...');
    const { data, error } = await supabase.from('products').insert(products);

    if (error) {
        console.error('Error seeding:', error);
    } else {
        console.log('Seeding complete! Website is now full.');
    }
}

seed();
