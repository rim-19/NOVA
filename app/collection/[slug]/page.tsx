"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { supabase, type Product } from "@/lib/supabase";
import { ProductCard } from "@/components/shared/ProductCard";
import { catalogProducts } from "@/lib/catalog";

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!slug) return;
        console.log("Collection slug detected:", slug);

        async function fetchProducts() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .ilike("collection_slug", slug);

                if (error) throw error;

                if (data && data.length > 0) {
                    console.log(`Fetched ${data.length} products from Supabase`);
                    const deduped = Array.from(new Map(data.map((product) => [product.slug, product])).values());
                    setProducts(deduped);
                } else {
                    console.warn(`No products found for ${slug} in Supabase. Triggering high-end fallback.`);
                    const filtered = catalogProducts.filter(p => p.collection_slug === slug);
                    setProducts(filtered.length > 0 ? filtered : catalogProducts.slice(0, 4));
                }
            } catch (err) {
                console.error("Supabase Error, using robust fallback:", err);
                const filtered = catalogProducts.filter(p => p.collection_slug === slug);
                setProducts(filtered.length > 0 ? filtered : catalogProducts.slice(0, 4));
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [slug]);

    useEffect(() => {
        if (products.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".product-card",
                { opacity: 0, y: 60, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    stagger: 0.1,
                    ease: "power4.out"
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, [products]);

    if (!slug) return null;

    const collectionTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (l: any) => l.toUpperCase());

    return (
        <div
            ref={sectionRef}
            className="min-h-screen pt-32 pb-24 px-6 md:px-12 relative overflow-hidden"
            style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}
        >
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 md:mb-24 text-center">
                    <Link href="/collection" className="text-label mb-6 inline-block hover:text-gold transition-colors" style={{ color: "rgba(184,149,106,0.4)", fontSize: "0.6rem" }}>
                        ← All Collections
                    </Link>
                    <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2.5rem, 8vw, 4.5rem)", color: "#F5E9E2", lineHeight: 1.1 }}>
                        {collectionTitle}
                    </h1>
                    <div className="divider-luxury mt-8" />
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 min-h-[400px]">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                        />
                    ))}
                </div>

                {loading && <div className="col-span-full h-40 flex items-center justify-center"><div className="w-10 h-10 border-t-2 border-gold rounded-full animate-spin" /></div>}

                <div className="mt-40 text-center opacity-20">
                    <p className="font-montecarlo text-2xl text-cream">"Beauty is the illumination of the soul."</p>
                </div>
            </div>
        </div>
    );
}

function TeaserOverlay({ productId }: { productId: string }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            if (e.detail === productId) {
                setShow(true);
                setTimeout(() => setShow(false), 2500);
            }
        };
        document.addEventListener('show-teaser', handler);
        return () => document.removeEventListener('show-teaser', handler);
    }, [productId]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[40] flex flex-col items-center justify-center p-6 bg-dark-base/90 backdrop-blur-md rounded-2xl pointer-events-none"
                >
                    <div className="absolute inset-0 opacity-20 overflow-hidden rounded-2xl">
                        <Image src="/assets/blurred_assets/image copy 5.png" alt="" fill className="object-cover scale-150 blur-xl" />
                    </div>
                    <div className="relative z-10 text-center space-y-3">
                        <p className="text-label text-[0.55rem] text-gold/40 tracking-[0.4em] uppercase">Private Directive</p>
                        <h4 className="font-cormorant italic text-xl text-cream">Beyond Lingerie</h4>
                        <div className="w-6 h-px bg-gold/10 mx-auto" />
                        <p className="font-montecarlo text-lg text-gold/60">Private Collection Coming Soon</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
