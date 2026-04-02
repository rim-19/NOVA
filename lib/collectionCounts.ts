import type { Product } from "@/lib/supabase";

export function countProductsByCollectionSlug(products: Pick<Product, "collection_slug">[]) {
    return products.reduce<Record<string, number>>((acc, product) => {
        const slug = product.collection_slug?.trim();
        if (!slug) return acc;
        acc[slug] = (acc[slug] || 0) + 1;
        return acc;
    }, {});
}

export function formatPieceCount(count: number) {
    return `${count} piece${count === 1 ? "" : "s"}`;
}
