"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type PromoBannerContent = {
    is_active: boolean;
    text: string;
    link: string;
    theme: "burgundy" | "gold" | "dark";
};

type SiteContent = {
    hero_tagline: string;
    hero_title_1: string;
    hero_title_2: string;
    hero_subtitle: string;
    narrative_label: string;
    poetic_phrase: string;
    promo_banner: PromoBannerContent;
};

const defaultContent: SiteContent = {
    hero_tagline: "Luxury Intimate Collection",
    hero_title_1: "Desire is not worn.",
    hero_title_2: "It is felt.",
    hero_subtitle: "Where shadow meets silk. Where longing becomes luxury.",
    narrative_label: "A Story in Silk",
    poetic_phrase: "Beauty is the illumination of the soul.",
    promo_banner: {
        is_active: false,
        text: "Free shipping on orders over 2000 MAD",
        link: "/collection",
        theme: "burgundy",
    },
};

export default function NarrativeAdminPage() {
    const [content, setContent] = useState<SiteContent>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    async function fetchContent() {
        setLoading(true);
        const { data, error } = await supabase
            .from("site_content")
            .select("*")
            .single();

        if (!error && data?.content) {
            setContent({
                ...defaultContent,
                ...data.content,
                promo_banner: {
                    ...defaultContent.promo_banner,
                    ...(data.content.promo_banner || {}),
                },
            });
        }
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from("site_content")
            .upsert({ id: 1, content });

        if (!error) alert("Homepage content updated.");
        else alert(`Error: ${error.message}`);

        setSaving(false);
    }

    if (loading) return <div className="p-10 animate-pulse text-gold/50">Loading content...</div>;

    return (
        <div className="max-w-4xl space-y-12 pb-24">
            <header>
                <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Homepage Content</p>
                <h1 className="font-cormorant italic text-5xl text-cream tracking-tight">Narrative</h1>
                <p className="text-zinc-500 text-xs mt-4 max-w-lg leading-relaxed">
                    Edit the real text shown on the public homepage.
                </p>
            </header>

            <form onSubmit={handleSave} className="grid gap-12 glass-card p-10 rounded-3xl border border-white/5 shadow-2xl">
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-gold/10 pb-4">
                        <h2 className="text-[0.6rem] text-gold/60 uppercase tracking-[0.3em] font-bold">Promo Banner</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">{content.promo_banner.is_active ? "Live" : "Hidden"}</span>
                            <button
                                type="button"
                                onClick={() => setContent({
                                    ...content,
                                    promo_banner: { ...content.promo_banner, is_active: !content.promo_banner.is_active },
                                })}
                                className={`w-10 h-5 rounded-full transition-all relative ${content.promo_banner.is_active ? "bg-gold" : "bg-zinc-800 border border-zinc-700"}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${content.promo_banner.is_active ? "right-1" : "left-1"}`} />
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Banner Text</label>
                            <input
                                className="admin-input w-full"
                                value={content.promo_banner.text}
                                onChange={(e) => setContent({
                                    ...content,
                                    promo_banner: { ...content.promo_banner, text: e.target.value },
                                })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Banner Link</label>
                                <input
                                    className="admin-input w-full"
                                    value={content.promo_banner.link}
                                    onChange={(e) => setContent({
                                        ...content,
                                        promo_banner: { ...content.promo_banner, link: e.target.value },
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Banner Theme</label>
                                <select
                                    className="admin-input w-full bg-zinc-900"
                                    value={content.promo_banner.theme}
                                    onChange={(e) => setContent({
                                        ...content,
                                        promo_banner: { ...content.promo_banner, theme: e.target.value as PromoBannerContent["theme"] },
                                    })}
                                >
                                    <option value="burgundy">Royal Burgundy</option>
                                    <option value="gold">Silk Gold</option>
                                    <option value="dark">Midnight Black</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-[0.6rem] text-gold/60 uppercase tracking-[0.3em] font-bold border-b border-gold/10 pb-4">Hero Section</h2>
                    <div className="space-y-2">
                        <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Top Tagline</label>
                        <input
                            className="admin-input w-full"
                            value={content.hero_tagline}
                            onChange={(e) => setContent({ ...content, hero_tagline: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Hero Title - Line 1</label>
                            <input
                                className="admin-input w-full font-montecarlo text-3xl py-4"
                                value={content.hero_title_1}
                                onChange={(e) => setContent({ ...content, hero_title_1: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Hero Title - Line 2</label>
                            <input
                                className="admin-input w-full font-cormorant italic text-3xl py-4"
                                value={content.hero_title_2}
                                onChange={(e) => setContent({ ...content, hero_title_2: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Hero Subtitle</label>
                        <textarea
                            className="admin-input w-full text-zinc-300 min-h-[90px] leading-relaxed"
                            value={content.hero_subtitle}
                            onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-[0.6rem] text-gold/60 uppercase tracking-[0.3em] font-bold border-b border-gold/10 pb-4">Story Label</h2>
                    <div className="space-y-2">
                        <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Narrative Section Label</label>
                        <input
                            className="admin-input w-full font-cormorant italic text-2xl py-4"
                            value={content.narrative_label}
                            onChange={(e) => setContent({ ...content, narrative_label: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-[0.6rem] text-gold/60 uppercase tracking-[0.3em] font-bold border-b border-gold/10 pb-4">Footer Phrase</h2>
                    <div className="space-y-2">
                        <label className="text-[0.55rem] text-zinc-500 uppercase tracking-widest">Poetic Phrase</label>
                        <input
                            className="admin-input w-full font-montecarlo text-2xl py-4 text-center"
                            value={content.poetic_phrase}
                            onChange={(e) => setContent({ ...content, poetic_phrase: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-luxury w-full py-5 text-[0.8rem] btn-click-effect shadow-gold-glow/10"
                    >
                        {saving ? "Saving..." : "Publish Content"}
                    </button>
                </div>
            </form>
        </div>
    );
}
