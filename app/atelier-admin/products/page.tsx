"use client";

import { useEffect, useState, useRef } from "react";
import { supabase, Product, Collection } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { catalogProducts } from "@/lib/catalog";

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        setLoading(true);
        const [pRes, cRes] = await Promise.all([
            supabase.from("products").select("*").order("created_at", { ascending: false }),
            supabase.from("collections").select("*")
        ]);
        if (pRes.data) setProducts(pRes.data);
        if (cRes.data) setCollections(cRes.data);
        setLoading(false);
    }

    async function toggleVisibility(id: string, current: boolean) {
        const { error } = await supabase
            .from("products")
            .update({ is_visible: !current })
            .eq("id", id);
        if (!error) fetchInitialData();
    }

    async function deleteProduct(id: string) {
        if (!confirm("Are you sure? This action is permanent.")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (!error) fetchInitialData();
    }

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-center bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-white mb-2 font-cormorant italic">Inventory</h1>
                    <p className="text-[0.6rem] text-zinc-500 uppercase tracking-[0.3em]">Registry of all masterpieces</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={async () => {
                            if (!confirm("Replace all current products with the new catalog set?")) return;
                            const demoProducts = catalogProducts.map(({ id, ...product }) => ({
                                ...product,
                                is_visible: true,
                                is_featured: false,
                            }));
                            const { error: deleteError } = await supabase
                                .from("products")
                                .delete()
                                .neq("id", "00000000-0000-0000-0000-000000000000");
                            if (deleteError) {
                                alert(`Ritual failed: ${deleteError.message}`);
                                return;
                            }
                            const { error } = await supabase.from("products").insert(demoProducts);
                            if (!error) {
                                alert("Catalog replaced successfully.");
                                fetchInitialData();
                            } else {
                                alert(`Ritual failed: ${error.message}`);
                            }
                        }}
                        className="bg-zinc-800 text-gold px-6 py-3 rounded-lg text-[0.6rem] font-bold tracking-[0.2em] uppercase hover:bg-zinc-700 transition-all border border-gold/10"
                    >
                        Manifest Heritage
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setIsFormOpen(true);
                        }}
                        className="bg-white text-zinc-950 px-8 py-3 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
                    >
                        Add New Piece
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 w-full bg-zinc-900 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800 text-[0.6rem] text-zinc-500 uppercase tracking-widest bg-zinc-900/80">
                                <th className="px-8 py-6 font-medium">Product Details</th>
                                <th className="px-8 py-6 font-medium">Collection</th>
                                <th className="px-8 py-6 font-medium text-right">Price</th>
                                <th className="px-8 py-6 font-medium text-center">Visibility</th>
                                <th className="px-8 py-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-14 h-16 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex-shrink-0">
                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-zinc-200 block mb-1">{product.name}</span>
                                                <span className="text-[0.6rem] text-zinc-600 uppercase tracking-widest">{product.collection || "No Collection"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs text-zinc-500 font-light">{product.collection}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right font-mono text-gold text-xs">
                                        {product.price.toLocaleString()} MAD
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleVisibility(product.id, product.is_visible ?? true);
                                            }}
                                            className={`text-[0.55rem] tracking-widest uppercase px-3 py-1 rounded-full border transition-all ${product.is_visible !== false
                                                ? "border-green-500/20 text-green-500/60 bg-green-500/5"
                                                : "border-zinc-700 text-zinc-600 bg-zinc-800/30"
                                                }`}
                                        >
                                            {product.is_visible !== false ? "Visible" : "Hidden"}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setIsFormOpen(true);
                                                }}
                                                className="p-3 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M12 20h9" />
                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="p-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && products.length === 0 && (
                        <div className="py-32 text-center bg-zinc-900/20">
                            <p className="text-zinc-600 text-sm font-light italic">The inventory is clear. Add your first masterpiece.</p>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <ProductForm
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={() => {
                            setIsFormOpen(false);
                            fetchInitialData();
                        }}
                        initialData={editingProduct}
                        collections={collections}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ProductForm({ onClose, onSuccess, initialData, collections }: {
    onClose: () => void,
    onSuccess: () => void,
    initialData: Product | null,
    collections: Collection[]
}) {
    const [form, setForm] = useState({
        name: initialData?.name || "",
        collection_slug: initialData?.collection_slug || (collections[0]?.slug || ""),
        price: initialData?.price || 0,
        discount_price: initialData?.discount_price,
        poetic_description: initialData?.poetic_description || "",
        description: initialData?.description || "",
        category: initialData?.category || "Lingerie Set",
        materials: initialData?.materials || "",
        care_instructions: initialData?.care_instructions || "",
        sizes: initialData?.sizes || ["S", "M", "L", "XL", "XXL"],
        images: initialData?.images || [],
        is_featured: initialData?.is_featured || false,
    });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Track state in console for debugging
    useEffect(() => {
        console.log("Current Form State:", form);
    }, [form]);

    useEffect(() => {
        if (!form.collection_slug && collections.length > 0) {
            setForm((prev) => ({ ...prev, collection_slug: collections[0].slug }));
        }
    }, [collections, form.collection_slug]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        let successCount = 0;

        for (const file of Array.from(files)) {
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                console.log(`Starting upload for: ${file.name}`);

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    console.error("Upload failed details:", uploadError);
                    alert(`Upload failed for ${file.name}: ${uploadError.message}`);
                    continue;
                }

                const { data } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                if (data?.publicUrl) {
                    setForm(prev => ({
                        ...prev,
                        images: [...prev.images, data.publicUrl]
                    }));
                    successCount++;
                }
            } catch (err: any) {
                console.error("Critical storage error:", err);
                alert(`System error uploading ${file.name}: ${err.message}`);
            }
        }

        if (successCount > 0) {
            alert(`Ritual successful: ${successCount} shadows manifested.`);
        } else {
            alert("No shadows were manifested. Please ensure you are choosing valid image files.");
        }

        setUploading(false);
        // Reset file input to allow re-uploading the same file if needed
        if (e.target) e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Submitting with images:", form.images);

        if (form.images.length === 0) {
            return alert("The ritual requires at least one shadow. Please upload an image first.");
        }

        setUploading(true);
        const slug = form.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const selectedCollection = collections.find((c) => c.slug === form.collection_slug);
        const productData = {
            ...form,
            slug,
            collection: selectedCollection?.name || initialData?.collection || "Uncategorized",
        };

        const { error } = initialData
            ? await supabase.from("products").update(productData).eq("id", initialData.id)
            : await supabase.from("products").insert([productData]);

        if (!error) onSuccess();
        else {
            console.error("Manifestation error:", error);
            alert(`Manifestation failed: ${error.message}`);
        }
        setUploading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 30 }}
                className="bg-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-zinc-800 p-8 md:p-14 shadow-2xl relative"
            >
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-3xl font-light text-white font-cormorant italic">{initialData ? "Refine Masterpiece" : "Define New Piece"}</h2>
                        <p className="text-[0.6rem] text-zinc-500 uppercase tracking-widest mt-2">Every detail is a choice.</p>
                    </div>
                    <button onClick={onClose} className="p-4 text-zinc-600 hover:text-white transition-colors bg-zinc-800/50 rounded-full hover:bg-zinc-800">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">Public Title</label>
                            <input
                                className="w-full bg-zinc-800 border-b border-zinc-700 focus:border-gold py-4 text-white outline-none transition-all font-cormorant italic text-xl"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">Price (MAD)</label>
                                <input
                                    type="number"
                                    className="w-full bg-zinc-800 border-b border-zinc-700 focus:border-gold py-4 text-white outline-none transition-all font-mono"
                                    value={form.price}
                                    onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">Sale Price (Optional)</label>
                                <input
                                    type="number"
                                    className="w-full bg-zinc-800 border-b border-zinc-700 focus:border-gold py-4 text-white outline-none transition-all font-mono"
                                    value={form.discount_price || ""}
                                    onChange={e => setForm({ ...form, discount_price: e.target.value ? parseInt(e.target.value) : undefined })}
                                    placeholder="Empty if no reduction"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">Collection</label>
                            <select
                                className="w-full bg-zinc-800 border-b border-zinc-700 focus:border-gold py-4 text-white outline-none transition-all"
                                value={form.collection_slug}
                                onChange={e => setForm({ ...form, collection_slug: e.target.value })}
                                required
                            >
                                {collections.length === 0 ? (
                                    <option value="">No collections available</option>
                                ) : (
                                    collections.map((collection) => (
                                        <option key={collection.id} value={collection.slug}>
                                            {collection.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">The Poetic Line (Visible on site)</label>
                            <input
                                className="w-full bg-zinc-800 border-b border-zinc-700 focus:border-gold py-4 text-white outline-none transition-all italic font-cormorant"
                                value={form.poetic_description}
                                onChange={e => setForm({ ...form, poetic_description: e.target.value })}
                                placeholder="A whisper of midnight..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">Composition & Materials</label>
                            <textarea
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-300 outline-none focus:border-gold transition-all h-24 resize-none"
                                value={form.materials}
                                onChange={e => setForm({ ...form, materials: e.target.value })}
                                placeholder="90% Silk, 10% Calais Lace..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold">Ritual of Sizing</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            const newSizes = form.sizes.includes(size)
                                                ? form.sizes.filter(s => s !== size)
                                                : [...form.sizes, size];
                                            setForm({ ...form, sizes: newSizes });
                                        }}
                                        className={`px-4 py-2 rounded-lg text-[0.6rem] font-bold tracking-widest uppercase transition-all border ${form.sizes.includes(size)
                                            ? "bg-white text-zinc-950 border-white shadow-glow-sm"
                                            : "bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-500"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800">
                            <input
                                type="checkbox" id="featured"
                                checked={form.is_featured}
                                onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                                className="w-5 h-5 accent-gold"
                            />
                            <label htmlFor="featured" className="text-[0.6rem] text-zinc-400 uppercase tracking-[0.2em] font-bold cursor-pointer">Mark as Masterpiece (Homepage View)</label>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-[0.3em] font-bold block">Visual Proof ({form.images.length}/4)</label>
                            <div className="grid grid-cols-2 gap-4">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 container-zoom group">
                                        <Image src={img} alt="preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                                                className="bg-red-500/80 p-2 rounded-full text-white hover:scale-110 transition-transform"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {form.images.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3 hover:bg-zinc-800 transition-all hover:border-zinc-600"
                                    >
                                        {uploading ? <div className="w-6 h-6 border-2 border-zinc-600 border-t-gold rounded-full animate-spin" /> :
                                            <div className="text-center px-4">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2 text-zinc-600"><path d="M12 5v14M5 12h14" /></svg>
                                                <span className="text-[0.5rem] tracking-widest text-zinc-600 uppercase font-bold">Add Shadow</span>
                                            </div>}
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleUpload} multiple className="hidden" accept="image/*" />
                        </div>

                        <div className="space-y-4 pt-12">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-white text-zinc-950 py-5 rounded-2xl font-bold uppercase text-[0.65rem] tracking-[0.4em] hover:bg-zinc-200 transition-all shadow-2xl active:scale-[0.98]"
                            >
                                {initialData ? (uploading ? "Refining..." : "Refine Creation") : (uploading ? "Manifesting..." : "Manifest Masterpiece")}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full text-zinc-500 py-2 text-[0.6rem] uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
