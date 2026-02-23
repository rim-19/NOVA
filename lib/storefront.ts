import type { Product } from "@/lib/supabase";
import { catalogProducts, featuredCatalogProducts } from "@/lib/catalog";

export type StoreCollectionType = "set" | "bodysuit" | "bodysocks" | "accessories";

export type StorefrontProduct = Product & {
  product_type: StoreCollectionType;
  colors: string[];
  is_bestseller: boolean;
  is_new_arrival: boolean;
  popularity: number;
};

export type StorefrontCollection = {
  slug: StoreCollectionType;
  name: string;
  image: string;
};

const COLLECTIONS: StorefrontCollection[] = [
  { slug: "set", name: "Set", image: "/new_assets/sultry_suspcius_collection/sultry2.jpeg" },
  { slug: "bodysuit", name: "Bodysuit", image: "/new_assets/dentelle_sensual_collection/dentelle4.jpeg" },
  { slug: "bodysocks", name: "Bodysocks", image: "/new_assets/dark_mystrouis_collection/dark8.jpeg" },
  { slug: "accessories", name: "Accessories", image: "/new_assets/dark_mystrouis_collection/dark3.jpeg" },
];

const TYPE_LABEL: Record<StoreCollectionType, string> = {
  set: "Set",
  bodysuit: "Bodysuit",
  bodysocks: "Bodysocks",
  accessories: "Accessories",
};

function toAssetUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function inferType(name: string): StoreCollectionType {
  const t = name.toLowerCase();
  if (t.includes("set") || t.includes("corset") || t.includes("two-piece")) return "set";
  if (t.includes("sock") || t.includes("mesh") || t.includes("net")) return "bodysocks";
  if (t.includes("harness") || t.includes("chain") || t.includes("accessory") || t.includes("choker")) return "accessories";
  return "bodysuit";
}

function inferColors(name: string): string[] {
  const n = name.toLowerCase();
  if (n.includes("ruby") || n.includes("crimson") || n.includes("scarlet") || n.includes("rouge")) return ["red", "black"];
  if (n.includes("leopard") || n.includes("feline") || n.includes("wild")) return ["brown", "black"];
  if (n.includes("ice") || n.includes("blue")) return ["blue"];
  if (n.includes("violet") || n.includes("plum")) return ["purple"];
  if (n.includes("mocha")) return ["brown"];
  return ["black"];
}

function ensureSizes(type: StoreCollectionType, sizes?: string[]): string[] {
  const base = sizes && sizes.length ? sizes : ["S", "M", "L"];
  if (type === "accessories") return ["S", "M", "L", "XL"];
  return base.includes("XL") ? base : [...base, "XL"];
}

function estimatePrice(slug: string): number {
  const h = hash(slug);
  const min = 220;
  const max = 599;
  return min + (h % (max - min + 1));
}

function catalogToStorefront(product: Product, index: number): StorefrontProduct {
  const type = inferType(product.name);
  return {
    ...product,
    collection_slug: type,
    collection: TYPE_LABEL[type],
    product_type: type,
    colors: inferColors(product.name),
    price: product.price > 0 ? product.price : estimatePrice(product.slug),
    sizes: ensureSizes(type, product.sizes),
    images: product.images.map(toAssetUrl),
    is_featured: index % 5 === 0 || product.is_featured,
    is_bestseller: index % 6 === 0,
    is_new_arrival: index % 4 === 0,
    popularity: 100 - (index % 100),
    created_at: product.created_at ?? `2026-01-${String((index % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
  };
}


function randomRank(slug: string): number {
  return hash(`nova-${slug}`) % 1000;
}

const CATALOG_STOREFRONT = catalogProducts.map(catalogToStorefront);

export const storefrontProducts: StorefrontProduct[] = [...CATALOG_STOREFRONT].sort(
  (a, b) => randomRank(a.slug) - randomRank(b.slug)
);

export const storefrontCollections = COLLECTIONS.map((col) => ({
  ...col,
  image: toAssetUrl(col.image),
}));

export const pickedForYouProducts: StorefrontProduct[] = featuredCatalogProducts
  .map((p) => storefrontProducts.find((sp) => sp.slug === p.slug))
  .filter((p): p is StorefrontProduct => Boolean(p))
  .slice(0, 6);

export function toStorefrontProduct(product: Product, fallbackIndex = 0): StorefrontProduct {
  const type = product.product_type || inferType(product.name);
  const colors = product.colors && product.colors.length ? product.colors : inferColors(product.name);
  return {
    ...product,
    collection_slug: product.collection_slug || type,
    collection: product.collection || TYPE_LABEL[type],
    product_type: type,
    price: product.price > 0 ? product.price : estimatePrice(product.slug),
    images: (product.images || []).map(toAssetUrl),
    colors,
    sizes: ensureSizes(type, product.sizes),
    is_bestseller: product.is_bestseller ?? false,
    is_new_arrival: product.is_new_arrival ?? true,
    popularity: product.popularity ?? (50 - fallbackIndex),
    created_at: product.created_at ?? new Date().toISOString(),
  };
}

export function mergeStorefrontWithLive(liveProducts: Product[]): StorefrontProduct[] {
  const bySlug = new Map(storefrontProducts.map((p) => [p.slug, p]));
  liveProducts.forEach((p, i) => bySlug.set(p.slug, toStorefrontProduct(p, i)));
  return Array.from(bySlug.values()).sort((a, b) => randomRank(a.slug) - randomRank(b.slug));
}

export function findStorefrontProductBySlug(slug: string): StorefrontProduct | undefined {
  return storefrontProducts.find((p) => p.slug === slug);
}
