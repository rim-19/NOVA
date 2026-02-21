"use client";

import { useEffect, useState } from "react";
import { supabase, HomepageConfig } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function ContentAdminPage() {
    const [config, setConfig] = useState<HomepageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        setLoading(true);
        const { data, error } = await supabase
            .from("homepage_config")
            .select("*")
            .single();

        if (data) setConfig(data);
        else {
            // Seed default if empty
            const defaultConfig = {
                hero_title: "Desire, Redefined.",
                hero_subtitle: "An obsession with shadows and silk.",
                hero_image: "/assets/image-0.png",
                narrative_blocks: [
                    { title: "The Ritual", content: "Lingerie is the first layer of the soul." },
                    { title: "The Craft", content: "Months to weave, a lifetime to feel." }
                ]
            };
            setConfig(defaultConfig as any);
        }
        setLoading(false);
    }

    async function handleSave() {
        if (!config) return;
        setSaving(true);
        const { error } = await supabase
            .from("homepage_config")
            .upsert(config);

        if (!error) alert("The site's soul has been updated.");
        setSaving(false);
    }

    if (loading) return <div className="animate-pulse space-y-8"><div className="h-20 bg-white/5 rounded-3xl" /><div className="h-64 bg-white/5 rounded-3xl" /></div>;

    return (
        <div className="space-y-8 md:space-y-12">
            <header className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                    <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Visual Voice</p>
                    <h1 className="font-cormorant italic text-4xl md:text-6xl text-cream tracking-tight">The Content</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-luxury px-6 md:px-10 py-3 text-[0.7rem] btn-click-effect w-full md:w-auto"
                >
                    {saving ? "Rewriting..." : "Publish Changes"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-10">
                    <section className="glass-card p-6 md:p-10 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="font-cormorant italic text-2xl text-cream">The Heroic Entrance</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Main Title</label>
                                <input
                                    className="admin-input w-full"
                                    value={config?.hero_title}
                                    onChange={e => setConfig({ ...config!, hero_title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Subtitle</label>
                                <textarea
                                    className="admin-input w-full italic"
                                    value={config?.hero_subtitle}
                                    onChange={e => setConfig({ ...config!, hero_subtitle: e.target.value })}
                                    rows={2}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-10">
                    <section className="glass-card p-6 md:p-10 rounded-3xl border border-white/5 space-y-6">
                        <h3 className="font-cormorant italic text-2xl text-cream">The Narrative Arc</h3>
                        <div className="space-y-8">
                            {config?.narrative_blocks.map((block, i) => (
                                <div key={i} className="space-y-4 pt-4 border-t border-white/5 first:border-0 first:pt-0">
                                    <div className="space-y-2">
                                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Block {i + 1} Title</label>
                                        <input
                                            className="admin-input w-full"
                                            value={block.title}
                                            onChange={e => {
                                                const newBlocks = [...config.narrative_blocks];
                                                newBlocks[i].title = e.target.value;
                                                setConfig({ ...config, narrative_blocks: newBlocks });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Block {i + 1} Content</label>
                                        <textarea
                                            className="admin-input w-full italic text-sm"
                                            value={block.content}
                                            onChange={e => {
                                                const newBlocks = [...config.narrative_blocks];
                                                newBlocks[i].content = e.target.value;
                                                setConfig({ ...config, narrative_blocks: newBlocks });
                                            }}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
