"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase, Collection } from "@/lib/supabase";
import { catalogCollections } from "@/lib/catalog";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function CollectionSection() {
    const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [width, setWidth] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCollections = async () => {
            const demoCollections = catalogCollections;

            const { data, error } = await supabase
                .from("collections")
                .select("*")
                .order("created_at", { ascending: true });

            if (!error && data) {
                const liveBySlug = new Map(data.map((collection) => [collection.slug, collection]));
                setCollectionsList(demoCollections.map((collection) => liveBySlug.get(collection.slug) ?? collection) as any);
            } else {
                setCollectionsList(demoCollections as any);
            }
            setLoading(false);
        };

        fetchCollections();
    }, []);

    useEffect(() => {
        const calculateWidth = () => {
            if (carouselRef.current && constraintsRef.current) {
                const scrollWidth = carouselRef.current.scrollWidth;
                const offsetWidth = constraintsRef.current.offsetWidth;
                setWidth(scrollWidth - offsetWidth);
            }
        };

        const timer = setTimeout(calculateWidth, 100);
        window.addEventListener("resize", calculateWidth);
        return () => {
            window.removeEventListener("resize", calculateWidth);
            clearTimeout(timer);
        };
    }, [collectionsList]);

    useEffect(() => {
        if (loading) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>(".collection-card");
            cards.forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 60, scale: 0.97 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        delay: i * 0.1,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [loading]);

    return (
        <section
            id="collection"
            ref={sectionRef}
            className="relative py-20 md:py-36 px-6 md:px-12 overflow-hidden"
            style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(26,2,2,0.4) 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 md:mb-24">
                    <p className="text-label mb-4" style={{ color: "rgba(184,149,106,0.5)" }}>The Collections</p>
                    <h2
                        style={{
                            fontFamily: "Cormorant Garamond, serif",
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: "clamp(1.8rem, 4vw, 3rem)",
                            color: "#F5E9E2",
                            letterSpacing: "0.05em",
                            marginBottom: "1rem",
                        }}
                    >
                        Curated for the Woman
                        <br />
                        <span style={{ fontFamily: "MonteCarlo, cursive", fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "#d4c4bc" }}>who feels deeply.</span>
                    </h2>
                    <div className="divider-luxury mt-6" />
                </div>

                <div
                    ref={constraintsRef}
                    className="cursor-grab active:cursor-grabbing overflow-visible"
                >
                    <motion.div
                        ref={carouselRef}
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        dragElastic={0.1}
                        className="flex gap-6 w-max md:w-full md:justify-center"
                    >
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="w-[300px] aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />)
                        ) : (
                            collectionsList.map((col, i) => (
                                <motion.div
                                    key={col.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="flex-shrink-0 w-[300px]"
                                >
                                    <Link
                                        href={`/collection/${col.slug}`}
                                        className="collection-card block relative group overflow-hidden rounded-2xl"
                                        style={{ aspectRatio: "3/4" }}
                                    >
                                        <Image
                                            src={col.image}
                                            alt={col.name}
                                            fill
                                            className="object-cover transition-all duration-1000 group-hover:scale-105"
                                            style={{ filter: "contrast(1.05) saturate(0.75) brightness(0.75)" }}
                                            sizes="(max-width: 768px) 300px, 300px"
                                            draggable={false}
                                        />
                                        <div className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-60" style={{ background: "linear-gradient(180deg, rgba(43,3,3,0.2) 0%, rgba(43,3,3,0.85) 100%)" }} />
                                        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                                            <p className="mb-1 text-label" style={{ color: "rgba(184,149,106,0.6)", fontSize: "0.55rem", letterSpacing: "0.4em" }}>{col.count}</p>
                                            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(0.9rem, 3vw, 1.3rem)", color: "#F5E9E2", lineHeight: 1.2, letterSpacing: "0.03em" }}>{col.name}</h3>
                                            <p className="mt-2 transition-all duration-700 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "0.65rem", color: "rgba(245,233,226,0.5)", letterSpacing: "0.06em" }}>{col.tagline}</p>
                                            <div className="mt-3 flex items-center gap-2 transition-all duration-700 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                                <span className="text-label" style={{ color: "rgba(184,149,106,0.7)", fontSize: "0.6rem", letterSpacing: "0.3em" }}>Explore</span>
                                                <span className="h-px w-4 group-hover:w-8 transition-all duration-500" style={{ background: "rgba(184,149,106,0.5)" }} />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: "inset 0 0 0 1px rgba(184,149,106,0.15)" }} />
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
