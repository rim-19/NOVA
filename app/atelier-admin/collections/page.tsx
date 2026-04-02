"use client";

import { useEffect, useState, useRef } from "react";
import { supabase, Collection, Product } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { HeartLoader } from "@/components/shared/HeartLoader";
import { countProductsByCollectionSlug, formatPieceCount } from "@/lib/collectionCounts";

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "product-images";
const REAL_COLLECTIONS = [
    {
        name: "Set",
        tagline: "Curated sets for complete looks.",
        slug: "set",
        image: "/new_assets/sultry_suspcius_collection/sultry2.jpeg",
        count: "0 pieces",
        hero_phrase: "Complete silhouettes designed to flow as one.",
    },
    {
        name: "Bodysuit",
        tagline: "Second-skin one-pieces with sculpted lines.",
        slug: "bodysuit",
        image: "/new_assets/dentelle_sensual_collection/dentelle4.jpeg",
        count: "0 pieces",
        hero_phrase: "One piece. Pure intention.",
    },
    {
        name: "Bodysocks",
        tagline: "Mesh and net textures with daring structure.",
        slug: "bodysocks",
        image: "/new_assets/dark_mystrouis_collection/dark8.jpeg",
        count: "0 pieces",
        hero_phrase: "Sheer textures that contour every move.",
    },
    {
        name: "Accessories",
        tagline: "Harnesses, chains, chokers and finishing details.",
        slug: "accessories",
        image: "/new_assets/dark_mystrouis_collection/dark3.jpeg",
        count: "0 pieces",
        hero_phrase: "Details that complete the ritual.",
    },
];

export default function CollectionsAdminPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [productsByCollection, setProductsByCollection] = useState<Record<string, Product[]>>({});
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

    useEffect(() => {
        void fetchCollections();
    }, []);

    async function fetchCollections() {
        setLoading(true);
        const [collectionsRes, productsRes] = await Promise.all([
            supabase
                .from("collections")
                .select("*")
                .order("created_at", { ascending: false }),
            supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false }),
        ]);

        if (!collectionsRes.error && collectionsRes.data) {
            const products = productsRes.data || [];
            const pieceCounts = countProductsByCollectionSlug(products);
            const groupedProducts = products.reduce<Record<string, Product[]>>((acc, product) => {
                const slug = product.collection_slug?.trim();
                if (!slug) return acc;
                if (!acc[slug]) acc[slug] = [];
                acc[slug].push(product);
                return acc;
            }, {});
            const hydratedCollections = collectionsRes.data.map((collection) => ({
                ...collection,
                count: formatPieceCount(pieceCounts[collection.slug] || 0),
            }));
            setCollections(hydratedCollections);
            setProductsByCollection(groupedProducts);
        }
        setLoading(false);
    }

    async function deleteCollection(id: string, slug: string, name: string) {
        if (!confirm(`Delete "${name}" and all products linked to it? This cannot be undone.`)) return;

        const { data: linkedProducts, error: linkedProductsError } = await supabase
            .from("products")
            .select("id")
            .eq("collection_slug", slug);

        if (linkedProductsError) {
            alert(`Unable to verify linked pieces: ${linkedProductsError.message}`);
            return;
        }

        const productIds = (linkedProducts || []).map((product) => product.id);
        if (productIds.length > 0) {
            const { error: deleteProductsError } = await supabase
                .from("products")
                .delete()
                .in("id", productIds);

            if (deleteProductsError) {
                alert(`Unable to delete linked pieces: ${deleteProductsError.message}`);
                return;
            }
        }

        const { error } = await supabase.from("collections").delete().eq("id", id);
        if (!error) {
            if (selectedCollection?.id === id) {
                setSelectedCollection(null);
            }
            void fetchCollections();
        }
    }

    async function syncManifestHeritage() {
        if (!confirm("Sync the storefront collections (Set, Bodysuit, Bodysocks, Accessories) without deleting your custom collections?")) return;

        const { data: existingCollections, error: existingError } = await supabase
            .from("collections")
            .select("id, slug");

        if (existingError) {
            alert(`Ritual failed: ${existingError.message}`);
            return;
        }

        const existingBySlug = new Map((existingCollections || []).map((collection) => [collection.slug, collection.id]));

        for (const collection of REAL_COLLECTIONS) {
            const existingId = existingBySlug.get(collection.slug);
            const payload = { ...collection };
            const { error } = existingId
                ? await supabase.from("collections").update(payload).eq("id", existingId)
                : await supabase.from("collections").insert([payload]);

            if (error) {
                alert(`Ritual failed: ${error.message}`);
                return;
            }
        }

        alert("Collections synced successfully. Your custom collections were preserved.");
        void fetchCollections();
    }

    return (
        <div className="space-y-8 md:space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div>
                    <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Narratives</p>
                    <h1 className="font-cormorant italic text-5xl md:text-6xl text-cream tracking-tight">The Chapters</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                        onClick={() => void syncManifestHeritage()}
                        className="bg-zinc-900 text-gold px-4 md:px-6 py-3 rounded-lg text-[0.6rem] font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all border border-gold/10 w-full sm:w-auto"
                    >
                        Manifest Heritage
                    </button>
                    <button
                        onClick={() => {
                            setEditingCollection(null);
                            setIsFormOpen(true);
                        }}
                        className="btn-luxury px-6 md:px-10 py-3 text-[0.7rem] btn-click-effect w-full sm:w-auto"
                    >
                        Create New Chapter
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[3/4] rounded-3xl bg-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    <AnimatePresence>
                        {collections.map((col) => (
                            <motion.div
                                key={col.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 active:scale-95 transition-all duration-500"
                            >
                                <Image src={col.image} alt={col.name} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000" />
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    <p className="text-[0.6rem] text-gold/40 tracking-widest uppercase mb-1">{col.count}</p>
                                    <h3 className="font-cormorant italic text-2xl text-cream">{col.name}</h3>

                                    <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                                        <button
                                            onClick={() => setSelectedCollection(col)}
                                            className="px-3 py-1.5 text-[0.55rem] tracking-widest uppercase bg-gold/10 hover:bg-gold/20 rounded-full transition-colors"
                                        >
                                            View Pieces
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingCollection(col);
                                                setIsFormOpen(true);
                                            }}
                                            className="px-3 py-1.5 text-[0.55rem] tracking-widest uppercase bg-white/10 hover:bg-gold/20 rounded-full transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => void deleteCollection(col.id, col.slug, col.name)}
                                            className="px-3 py-1.5 text-[0.55rem] tracking-widest uppercase bg-burgundy/20 hover:bg-burgundy/40 rounded-full transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <CollectionForm
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={() => {
                            setIsFormOpen(false);
                            fetchCollections();
                        }}
                        initialData={editingCollection}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedCollection && (
                    <CollectionProductsModal
                        collection={selectedCollection}
                        products={productsByCollection[selectedCollection.slug] || []}
                        onClose={() => setSelectedCollection(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CollectionForm({ onClose, onSuccess, initialData }: {
    onClose: () => void,
    onSuccess: () => void,
    initialData: Collection | null
}) {
    const [form, setForm] = useState({
        name: initialData?.name || "",
        tagline: initialData?.tagline || "",
        image: initialData?.image || "",
        hero_phrase: initialData?.hero_phrase || "",
    });
    const [uploading, setUploading] = useState(false);
    const [imageUrlDraft, setImageUrlDraft] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `collections/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);
            setForm({ ...form, image: publicUrl });
        } else {
            alert(`Upload failed: ${uploadError.message}. Check bucket '${STORAGE_BUCKET}' and storage policies.`);
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const slug = form.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const data = { ...form, slug };

        const { error } = initialData
            ? await supabase.from("collections").update(data).eq("id", initialData.id)
            : await supabase.from("collections").insert([data]);

        if (!error) onSuccess();
        setUploading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-dark-base/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card w-full max-w-lg rounded-2xl md:rounded-3xl border-gold-glow p-4 md:p-8 max-h-[92vh] overflow-y-auto"
            >
                <h2 className="font-cormorant italic text-2xl md:text-3xl text-cream mb-6 md:mb-8">{initialData ? "Edit Chapter" : "New Chapter"}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Chapter Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            className="admin-input w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Tagline</label>
                        <input
                            type="text"
                            value={form.tagline}
                            onChange={e => setForm({ ...form, tagline: e.target.value })}
                            className="admin-input w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Hero Phrase</label>
                        <textarea
                            value={form.hero_phrase}
                            onChange={e => setForm({ ...form, hero_phrase: e.target.value })}
                            className="admin-input w-full italic"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider block">Visual Identity</label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative aspect-video rounded-2xl border border-dashed border-gold/20 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gold/5"
                        >
                            {form.image ? (
                                <Image src={form.image} alt="preview" fill className="object-cover opacity-60" />
                            ) : (
                                <span className="text-[0.6rem] text-gold/30 tracking-widest uppercase">Select Cover</span>
                            )}
                            {uploading && (
                                <div className="absolute inset-0 bg-dark-base/50 flex items-center justify-center">
                                    <HeartLoader className="drop-shadow-[0_0_12px_rgba(184,149,106,0.45)]" heartClassName="text-gold" />
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={imageUrlDraft}
                                onChange={(e) => setImageUrlDraft(e.target.value)}
                                placeholder="/new_assets/... or https://..."
                                className="admin-input w-full"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const cleaned = imageUrlDraft.trim();
                                    if (!cleaned) return;
                                    setForm((prev) => ({ ...prev, image: cleaned }));
                                    setImageUrlDraft("");
                                }}
                                className="px-4 py-2 text-[0.58rem] uppercase tracking-[0.16em] rounded-xl border border-zinc-700 text-zinc-300 hover:border-gold/50"
                            >
                                Use URL
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-[0.65rem] text-cream/40 tracking-widest uppercase border border-white/10 rounded-xl hover:bg-white/5 transition-colors">Cancel</button>
                        <button type="submit" disabled={uploading} className="flex-[2] btn-burgundy py-3">Save Chapter</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function CollectionProductsModal({
    collection,
    products,
    onClose,
}: {
    collection: Collection;
    products: Product[];
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-6 bg-dark-base/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                className="glass-card w-full max-w-3xl rounded-2xl md:rounded-3xl border-gold-glow p-4 md:p-8 max-h-[92vh] overflow-y-auto"
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.4em] uppercase">Collection Pieces</p>
                        <h2 className="font-cormorant italic text-2xl md:text-3xl text-cream">{collection.name}</h2>
                        <p className="mt-2 text-[0.7rem] text-cream/55">{formatPieceCount(products.length)}</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-zinc-600 hover:text-white transition-colors bg-zinc-800/50 rounded-full hover:bg-zinc-800">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-10 text-center">
                        <p className="font-cormorant italic text-xl text-cream/70">No pieces in this collection yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3"
                            >
                                <div className="relative h-20 w-16 overflow-hidden rounded-xl bg-black/20">
                                    <Image
                                        src={product.images?.[0] || collection.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-cormorant italic text-xl text-cream">{product.name}</p>
                                    <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-gold/55">
                                        {product.slug}
                                    </p>
                                    <p className="mt-2 text-[0.75rem] text-cream/60">
                                        {product.price.toLocaleString("fr-MA")} MAD
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
