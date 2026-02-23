import type { Product } from "@/lib/supabase";

export type NarrativeBlock = {
    image: string;
    position: "left" | "right";
    verse: string;
    verse2: string;
    subtext: string;
    label: string;
};

export const catalogCollections = [
    {
        id: "set",
        name: "Set",
        tagline: "Curated sets for complete looks.",
        slug: "set",
        image: "/new_assets/sultry_suspcius_collection/sultry2.jpeg",
        count: "0 pieces",
        description: "Complete silhouettes designed to flow as one.",
    },
    {
        id: "bodysuit",
        name: "Bodysuit",
        tagline: "Second-skin one-pieces with sculpted lines.",
        slug: "bodysuit",
        image: "/new_assets/dentelle_sensual_collection/dentelle4.jpeg",
        count: "0 pieces",
        description: "One piece. Pure intention.",
    },
    {
        id: "bodysocks",
        name: "Bodysocks",
        tagline: "Mesh and net textures with daring structure.",
        slug: "bodysocks",
        image: "/new_assets/dark_mystrouis_collection/dark8.jpeg",
        count: "0 pieces",
        description: "Sheer textures that contour every move.",
    },
    {
        id: "accessories",
        name: "Accessories",
        tagline: "Harnesses, chains, chokers and finishing details.",
        slug: "accessories",
        image: "/new_assets/dark_mystrouis_collection/dark3.jpeg",
        count: "0 pieces",
        description: "Details that complete the ritual.",
    },
];

export const homeNarrativeBlocks: NarrativeBlock[] = [
    {
        image: "/new_assets/sultry_suspcius_collection/sultry2.jpeg",
        position: "left",
        verse: "She enters in instinct.",
        verse2: "The room follows.",
        subtext: "Animal print and sheer black trace every curve with a slow, magnetic confidence.",
        label: "The Wild Entrance",
    },
    {
        image: "/new_assets/dentelle_sensual_collection/dentelle4.jpeg",
        position: "right",
        verse: "Gloss, lace, and shadow.",
        verse2: "All in one breath.",
        subtext: "A sculpted silhouette that catches light like midnight and feels like pure control.",
        label: "The Dark Ritual",
    },
    {
        image: "/new_assets/dark_mystrouis_collection/dark1.jpeg",
        position: "left",
        verse: "Soft lace. Bare confidence.",
        verse2: "Nothing extra.",
        subtext: "Delicate straps and floral lace rest close to skin, revealing elegance with sensual ease.",
        label: "The Lace Whisper",
    },
];

const rawCatalogProducts: Product[] = [
    {
        id: "dark-midnight-command-corset-set",
        name: "Midnight Command Corset Set",
        slug: "midnight-command-corset-set",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark1.jpeg"],
        poetic_description: "A dark invitation with a commanding silhouette.",
        description: "Black lace corsetry with garter lines that frame the body in a bold, sensual rhythm.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-obsidian-lace-up-bodysuit",
        name: "Obsidian Lace-Up Bodysuit",
        slug: "obsidian-lace-up-bodysuit",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark2.jpeg"],
        poetic_description: "Gloss and tension, tied at the center.",
        description: "A high-neck glossy bodysuit with front lacing that sculpts every angle with sleek intensity.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-chain-kiss-harness-set",
        name: "Chain Kiss Harness Set",
        slug: "chain-kiss-harness-set",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark3.jpeg"],
        poetic_description: "Straps, chains, and pure provocation.",
        description: "A strappy harness look with silver chains that adds sharp detail to a daring silhouette.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-sheer-authority-teddy",
        name: "Sheer Authority Teddy",
        slug: "sheer-authority-teddy",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark4.jpeg"],
        poetic_description: "Light mesh, heavy attitude.",
        description: "Transparent black mesh with body-hugging straps that blends softness with unapologetic edge.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-noir-mesh-mockneck-teddy",
        name: "Noir Mesh Mockneck Teddy",
        slug: "noir-mesh-mockneck-teddy",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/DARK5.jpeg"],
        poetic_description: "Covered, but never quiet.",
        description: "Fishnet side panels and a high neckline create a confident silhouette with sleek noir energy.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-feline-veil-two-piece",
        name: "Feline Veil Two-Piece",
        slug: "feline-veil-two-piece",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark6.jpeg"],
        poetic_description: "A soft bite of leopard temptation.",
        description: "Sheer black mesh and feline trim meet in a playful set that feels wild and refined together.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-crimson-eclipse-strappy-set",
        name: "Crimson Eclipse Strappy Set",
        slug: "crimson-eclipse-strappy-set",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark7.jpeg"],
        poetic_description: "Bordeaux heat with midnight lines.",
        description: "Deep red lace and black straps wrap the figure in a dramatic, high-contrast sensual look.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-rebel-net-bodysuit",
        name: "Rebel Net Bodysuit",
        slug: "rebel-net-bodysuit",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark8.jpeg"],
        poetic_description: "Raw texture, controlled confidence.",
        description: "Open fishnet with belt accents for a strong, provocative silhouette that owns attention.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-shadow-lace-duo",
        name: "Shadow Lace Duo",
        slug: "shadow-lace-duo",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/DARK9.jpeg"],
        poetic_description: "Minimal lines, maximum allure.",
        description: "A delicate black lace set made to sit close to skin with effortless sensual simplicity.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-phantom-duality-set",
        name: "Phantom Duality Set",
        slug: "phantom-duality-set",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: [
            "/new_assets/dark_mystrouis_collection/dark10_1.jpeg",
            "/new_assets/dark_mystrouis_collection/dark10_2.jpeg",
        ],
        poetic_description: "Two angles, one dark obsession.",
        description: "A sheer black one-piece with seductive cutouts and precise straps, shown in dual views for full impact.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dark-midnight-velvet-command-set",
        name: "Midnight Velvet Command Set",
        slug: "midnight-velvet-command-set",
        collection_slug: "dark-mysterious",
        collection: "Dark Mysterious",
        price: 0,
        images: ["/new_assets/dark_mystrouis_collection/dark11.jpeg"],
        poetic_description: "Velvet shadows with a dominant pulse.",
        description: "A commanding dark silhouette that wraps the body in sleek tension and controlled desire.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-noir-dot-lace-bodysuit",
        name: "Noir Dot Lace Bodysuit",
        slug: "noir-dot-lace-bodysuit",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/dentelle1.jpeg"],
        poetic_description: "Soft dots, deep temptation.",
        description: "Sheer dotted mesh with floral lace panels that contour the waist and reveal with finesse.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-rouge-plume-garter-set",
        name: "Rouge Plume Garter Set",
        slug: "rouge-plume-garter-set",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/dentelle3.jpeg"],
        poetic_description: "Feather-light and fiercely seductive.",
        description: "A red lace set with feather accents that brings playful drama to every movement.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-midnight-bunny-lace-teddy",
        name: "Midnight Bunny Lace Teddy",
        slug: "midnight-bunny-lace-teddy",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/dentelle4.jpeg"],
        poetic_description: "Playful mood, polished lace.",
        description: "A black halter lace teddy with costume-inspired details for a flirtatious, feminine edge.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-nuit-fleur-strappy-set",
        name: "Nuit Fleur Strappy Set",
        slug: "nuit-fleur-strappy-set",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: [
            "/new_assets/dentelle_sensual_collection/dentelle5.jpeg",
            "/new_assets/dentelle_sensual_collection/dentelle5_2.jpeg",
        ],
        poetic_description: "Delicate lace, precise lines.",
        description: "Floral black lace with geometric straps that sculpts the body with subtle, sensual definition.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-violet-bloom-corset-set-side",
        name: "Violet Bloom Corset Set - Side",
        slug: "violet-bloom-corset-set-side",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/DENTELLE6.jpeg"],
        poetic_description: "The same bloom from another angle.",
        description: "Side profile of the violet lace corset highlighting curve-focused structure and soft mesh volume.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-bordeaux-muse-garter-teddy",
        name: "Bordeaux Muse Garter Teddy",
        slug: "bordeaux-muse-garter-teddy",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/dentelle7.jpeg"],
        poetic_description: "Deep wine tones, pure elegance.",
        description: "Burgundy lace bodysuit with garter lines and chain details for a refined sensual statement.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-midnight-whisper-lace-set",
        name: "Midnight Whisper Lace Set",
        slug: "midnight-whisper-lace-set",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/dentelle8.jpeg"],
        poetic_description: "Quiet lace, undeniable pull.",
        description: "Light black lace and slim straps that rest on skin with a soft, intimate finish.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-ruby-veil-lace-teddy",
        name: "Ruby Veil Lace Teddy",
        slug: "ruby-veil-lace-teddy",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/DENTELLE9.jpeg"],
        poetic_description: "A plunge wrapped in ruby lace.",
        description: "Deep red lace in a plunging one-piece that balances softness, heat, and graceful lines.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-ruby-chain-open-cup-set",
        name: "Ruby Chain Open-Cup Set",
        slug: "ruby-chain-open-cup-set",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/DENTELLE10.jpeg"],
        poetic_description: "Jewelry-like details on bare skin.",
        description: "Open-cup red lace with silver chain accents for a daring look with luxe contrast.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-velvet-nocturne-set",
        name: "Velvet Nocturne Set",
        slug: "velvet-nocturne-set",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: ["/new_assets/dentelle_sensual_collection/dentelle11.jpeg"],
        poetic_description: "Soft lace with a midnight pulse.",
        description: "A sensual lace silhouette designed to hug the body with refined tension and intimate elegance.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "dentelle-rose-eclipse-trio-set",
        name: "Rose Eclipse Trio Set",
        slug: "rose-eclipse-trio-set",
        collection_slug: "dentelle-sensual",
        collection: "Dentelle Sensual",
        price: 0,
        images: [
            "/new_assets/dentelle_sensual_collection/dentelle12.jpeg",
            "/new_assets/dentelle_sensual_collection/dentelle12_2.jpeg",
            "/new_assets/dentelle_sensual_collection/dentelle12_3.jpeg",
        ],
        poetic_description: "Three glances, one unforgettable seduction.",
        description: "A romantic lace composition revealed through three angles, blending softness, heat, and couture allure.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-heartline-chain-set",
        name: "Heartline Chain Set",
        slug: "heartline-chain-set",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry1.jpeg"],
        poetic_description: "Sweet shape, dangerous energy.",
        description: "Heart cups and chain accents create a provocative set that plays between cute and bold.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-wild-muse-corset-set",
        name: "Wild Muse Corset Set",
        slug: "wild-muse-corset-set",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry2.jpeg"],
        poetic_description: "Instinct in print and lace.",
        description: "Leopard cups, sheer black corsetry, and a tied mini wrap for a fearless, sensual silhouette.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-backless-temptation-teddy",
        name: "Backless Temptation Teddy",
        slug: "backless-temptation-teddy",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry3.jpeg"],
        poetic_description: "Bare back, full impact.",
        description: "An open-back black teddy with a deep plunge that leaves a lasting impression from every angle.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-leopard-desire-garter-set",
        name: "Leopard Desire Garter Set",
        slug: "leopard-desire-garter-set",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry4.jpeg"],
        poetic_description: "Predatory print, polished shape.",
        description: "Leopard mesh and garter structure combine into a look that feels wild, fitted, and irresistible.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-leopard-lace-up-monokini",
        name: "Leopard Lace-Up Monokini",
        slug: "leopard-lace-up-monokini",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry5.jpeg"],
        poetic_description: "One piece, all tension.",
        description: "A leopard monokini with front lacing that pulls the eye to every curve with bold precision.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-noir-pearl-plunge-teddy",
        name: "Noir Pearl Plunge Teddy",
        slug: "noir-pearl-plunge-teddy",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry6.jpeg"],
        poetic_description: "Lace, plunge, and pearl flirt.",
        description: "Plunging black lace with pearl side details and red bows for a seductive vintage-inspired finish.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-fringe-feline-bodysuit",
        name: "Fringe Feline Bodysuit",
        slug: "fringe-feline-bodysuit",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/SULTRY7.jpeg"],
        poetic_description: "Movement made to be noticed.",
        description: "Leopard bodysuit with chain straps and fringe accents that sway with every step.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-scarlet-frame-mesh-bodysuit",
        name: "Scarlet Frame Mesh Bodysuit",
        slug: "scarlet-frame-mesh-bodysuit",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/SULTRY8.jpeg"],
        poetic_description: "A red line around desire.",
        description: "Transparent scarlet mesh outlined in black to shape the body with graphic sensual contrast.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-mocha-sculpt-bodysuit",
        name: "Mocha Sculpt Bodysuit",
        slug: "mocha-sculpt-bodysuit",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/SULTRY9.jpeg"],
        poetic_description: "Minimal cut, maximum contour.",
        description: "A smooth mocha bodysuit with clean paneling that hugs the figure with modern sensual restraint.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-ice-bloom-lace-teddy",
        name: "Ice Bloom Lace Teddy",
        slug: "ice-bloom-lace-teddy",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/SULTRY10.jpeg"],
        poetic_description: "Cool tone, warm effect.",
        description: "Light blue lace with an open front detail for a fresh, luminous take on sensual styling.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-midnight-heat-bodysuit",
        name: "Midnight Heat Bodysuit",
        slug: "midnight-heat-bodysuit",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry11.jpeg"],
        poetic_description: "Dark shine, undeniable temptation.",
        description: "A high-impact silhouette with liquid-black attitude, designed to sculpt and seduce in one move.",
        sizes: ["S", "M", "L"],
    },
    {
        id: "sultry-velvet-instinct-set",
        name: "Velvet Instinct Set",
        slug: "velvet-instinct-set",
        collection_slug: "sultry-suspicious",
        collection: "Sultry Suspicious",
        price: 0,
        images: ["/new_assets/sultry_suspcius_collection/sultry12.jpeg"],
        poetic_description: "Wild instinct in a softer whisper.",
        description: "A sensual set with feline energy and a smooth finish that sits close to the skin.",
        sizes: ["S", "M", "L"],
    },
];

const CANONICAL_COLLECTIONS = [
    { slug: "set", name: "Set" },
    { slug: "bodysuit", name: "Bodysuit" },
    { slug: "bodysocks", name: "Bodysocks" },
    { slug: "accessories", name: "Accessories" },
] as const;

const WHATSAPP_ASSETS = [
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.55 (1).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.55 (2).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.55.jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.56 (1).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.56.jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.57 (1).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.57.jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.58 (1).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.58 (2).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.58 (3).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.58.jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.59 (1).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.36.59.jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.37.00 (1).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.37.00 (2).jpeg",
    "/new_assets/WhatsApp Image 2026-02-22 at 01.37.00.jpeg",
];

function slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function estimatePrice(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) hash = (hash << 5) - hash + seed.charCodeAt(i);
    const min = 220;
    const max = 599;
    return min + (Math.abs(hash) % (max - min + 1));
}

function chooseCollection(name: string, index: number) {
    const lower = name.toLowerCase();
    if (lower.includes("harness") || lower.includes("chain") || lower.includes("choker") || lower.includes("accessor")) {
        return CANONICAL_COLLECTIONS[3];
    }
    if (lower.includes("sock") || lower.includes("mesh") || lower.includes("net")) {
        return CANONICAL_COLLECTIONS[2];
    }
    if (lower.includes("set") || lower.includes("corset") || lower.includes("two-piece")) {
        return CANONICAL_COLLECTIONS[0];
    }
    if (lower.includes("bodysuit") || lower.includes("teddy")) {
        return CANONICAL_COLLECTIONS[1];
    }
    return CANONICAL_COLLECTIONS[index % CANONICAL_COLLECTIONS.length];
}

function normalizeProduct(product: Product, index: number): Product {
    const collection = chooseCollection(product.name, index);
    return {
        ...product,
        collection_slug: collection.slug,
        collection: collection.name,
        price: product.price && product.price > 0 ? product.price : estimatePrice(product.slug || product.name),
        sizes: product.sizes?.length ? product.sizes : ["S", "M", "L"],
    };
}

const whatsappNames = [
    "Velvet Signal", "Noir Invitation", "Silk Voltage", "Secret Pulse",
    "Midnight Spark", "Lace Current", "Crimson Orbit", "Moonlit Sway",
];

const generatedWhatsappProducts: Product[] = WHATSAPP_ASSETS.map((image, index) => {
    const name = `${whatsappNames[index % whatsappNames.length]} ${index + 1}`;
    const slug = slugify(`whatsapp-${name}`);
    const collection = CANONICAL_COLLECTIONS[index % CANONICAL_COLLECTIONS.length];
    return {
        id: slug,
        name,
        slug,
        collection_slug: collection.slug,
        collection: collection.name,
        price: estimatePrice(slug),
        images: [image],
        poetic_description: "A slow, sensual silhouette made to stay in memory.",
        description: "A magnetic piece with confident lines and soft tension, curated for intimate elegance.",
        sizes: ["S", "M", "L"],
    };
});

export const catalogProducts: Product[] = [
    ...rawCatalogProducts.map(normalizeProduct),
    ...generatedWhatsappProducts,
];

const featuredOrder = [
    "rose-eclipse-trio-set",
    "midnight-heat-bodysuit",
    "heartline-chain-set",
    "velvet-nocturne-set",
    "midnight-command-corset-set",
    "midnight-whisper-lace-set",
    "rouge-plume-garter-set",
];

export const featuredCatalogProducts = featuredOrder
    .map((slug) => catalogProducts.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
