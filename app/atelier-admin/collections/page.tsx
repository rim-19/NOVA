"use client";

import { useEffect, useState, useRef } from "react";
import { supabase, Collection } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { catalogCollections } from "@/lib/catalog";

export default function CollectionsAdminPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

    useEffect(() => {
        fetchCollections();
    }, []);

    async function fetchCollections() {
        setLoading(true);
        const { data, error } = await supabase
            .from("collections")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) setCollections(data);
        setLoading(false);
    }

    async function deleteCollection(id: string) {
        if (!confirm("Remove this story from the atelier? This will not delete the products within it.")) return;
        const { error } = await supabase.from("collections").delete().eq("id", id);
        if (!error) fetchCollections();
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
                        onClick={async () => {
                            if (!confirm("Replace all current collections with the new catalog collections?")) return;
                            const demoCols = catalogCollections.map((collection) => ({
                                name: collection.name,
                                tagline: collection.tagline,
                                slug: collection.slug,
                                image: collection.image,
                                count: collection.count,
                                hero_phrase: collection.description,
                            }));
                            const { error: deleteError } = await supabase
                                .from("collections")
                                .delete()
                                .neq("id", "00000000-0000-0000-0000-000000000000");
                            if (deleteError) {
                                alert(`Ritual failed: ${deleteError.message}`);
                                return;
                            }
                            const { error } = await supabase.from("collections").insert(demoCols);
                            if (!error) {
                                alert("Collections replaced successfully.");
                                fetchCollections();
                            } else {
                                alert(`Ritual failed: ${error.message}`);
                            }
                        }}
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
                                            onClick={() => {
                                                setEditingCollection(col);
                                                setIsFormOpen(true);
                                            }}
                                            className="px-3 py-1.5 text-[0.55rem] tracking-widest uppercase bg-white/10 hover:bg-gold/20 rounded-full transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCollection(col.id)}
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `collections/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);
            setForm({ ...form, image: publicUrl });
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
                            {uploading && <div className="absolute inset-0 bg-dark-base/50 flex items-center justify-center animate-spin" />}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
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
