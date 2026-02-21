"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { supabase, Collection } from "@/lib/supabase";
import { PrivateTeaserArtifacts } from "@/components/shared/PrivateTeaserArtifacts";
import { catalogCollections } from "@/lib/catalog";

export default function CollectionArchivePage() {
    const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);
    const scrollKey = "scroll:/collection";

    useEffect(() => {
        const fetchCollections = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("collections")
                .select("*")
                .order("created_at", { ascending: true });

            if (!error && data) {
                const liveBySlug = new Map(data.map((collection) => [collection.slug, collection]));
                setCollectionsList(catalogCollections.map((collection) => liveBySlug.get(collection.slug) ?? collection) as any);
            } else {
                setCollectionsList(catalogCollections as any);
            }
            setLoading(false);
        };

        fetchCollections();
    }, []);

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".collection-row",
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: 0.3,
                    ease: "power3.out"
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [loading]);

    useEffect(() => {
        const saveScroll = () => {
            sessionStorage.setItem(scrollKey, String(window.scrollY));
        };
        window.addEventListener("scroll", saveScroll, { passive: true });
        return () => {
            saveScroll();
            window.removeEventListener("scroll", saveScroll);
        };
    }, []);

    useEffect(() => {
        if (loading) return;
        const saved = sessionStorage.getItem(scrollKey);
        if (!saved) return;
        requestAnimationFrame(() => {
            window.scrollTo({ top: Number(saved), behavior: "auto" });
        });
    }, [loading]);

    return (
        <div
            ref={sectionRef}
            className="min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden"
            style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}
        >
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-24 text-center">
                    <p className="text-label mb-4" style={{ color: "rgba(184,149,106,0.5)" }}>
                        The Collections
                    </p>
                    <h1
                        style={{
                            fontFamily: "MonteCarlo, cursive",
                            fontSize: "clamp(3rem, 10vw, 6rem)",
                            color: "#F5E9E2",
                            lineHeight: 1
                        }}
                    >
                        The Art of Lingerie
                    </h1>
                    <div className="divider-luxury mt-8" />
                </header>

                <div className="flex flex-col gap-32">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-12 h-12 border-t-2 border-gold rounded-full animate-spin" />
                        </div>
                    ) : (
                        collectionsList.map((col, i) => (
                            <div
                                key={col.slug}
                                className={`collection-row flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 opacity-0`}
                            >
                                {/* Image Container */}
                                <div className="w-full md:w-1/2 relative aspect-[4/5] overflow-hidden rounded-2xl group">
                                    <Image
                                        src={col.image}
                                        alt={col.name}
                                        fill
                                        className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                        style={{ filter: "brightness(0.85) contrast(1.1)" }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                </div>

                                {/* Text Context */}
                                <div className={`w-full md:w-1/2 flex flex-col ${i % 2 === 0 ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-center text-center`}>
                                    <p className="text-label mb-6" style={{ color: "rgba(184,149,106,0.4)" }}>
                                        {col.count} · Signature Edition
                                    </p>
                                    <h2
                                        style={{
                                            fontFamily: "Cormorant Garamond, serif",
                                            fontStyle: "italic",
                                            fontWeight: 300,
                                            fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                            color: "#F5E9E2",
                                            marginBottom: "0.5rem"
                                        }}
                                    >
                                        {col.name}
                                    </h2>
                                    <h3
                                        style={{
                                            fontFamily: "MonteCarlo, cursive",
                                            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                                            color: "rgba(184,149,106,0.8)",
                                            marginBottom: "1.5rem"
                                        }}
                                    >
                                        {col.tagline}
                                    </h3>
                                    <p
                                        className="mb-10 max-w-md"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontWeight: 300,
                                            fontSize: "0.9rem",
                                            lineHeight: 2,
                                            color: "rgba(245,233,226,0.4)"
                                        }}
                                    >
                                        {(col as any).description || "A curate narrative of beauty and desire. Built for those who appreciate the finer threads of life."}
                                    </p>
                                    <Link href={`/collection/${col.slug}`} className="btn-burgundy px-12">
                                        Explore Collection
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
