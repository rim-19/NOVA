"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase, type Product } from "@/lib/supabase";
import { featuredCatalogProducts } from "@/lib/catalog";

import { ProductCard } from "@/components/shared/ProductCard";

export function FeaturedCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [width, setWidth] = useState(0);
    const [loading, setLoading] = useState(true);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            const demoProducts: Product[] = featuredCatalogProducts;

            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("is_visible", true)
                .eq("is_featured", true)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setProducts(demoProducts);
            } else {
                setProducts(demoProducts);
            }
            setLoading(false);
        };

        fetchFeatured();
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
    }, [products]); // Recalculate when products load

    return (
        <section className="pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden relative">
            {/* Background glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-40"
                style={{
                    background: "radial-gradient(circle, rgba(125,23,54,0.1) 0%, transparent 70%)"
                }}
            />

            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-14 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
                <div className="text-center md:text-left">
                    <p className="text-label text-gold/40 text-[0.6rem] tracking-[0.5em] mb-4 uppercase">Creative Directives</p>
                    <h2 className="font-cormorant italic text-5xl md:text-7xl text-cream tracking-tight">Masterpieces</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[0.6rem] text-gold/30 tracking-widest uppercase hidden md:block">Slide to explore</span>
                    <Link
                        href="/collection"
                        className="btn-luxury text-[0.7rem] px-8 py-3 btn-click-effect"
                    >
                        View All
                    </Link>
                </div>
            </div>

            <div
                ref={constraintsRef}
                className="cursor-grab active:cursor-grabbing px-6 md:px-12 overflow-visible"
            >
                <motion.div
                    ref={carouselRef}
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    dragElastic={0.1}
                    className="flex gap-8 md:gap-12 w-max"
                >
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="w-[280px] md:w-[420px] aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
                        ))
                    ) : (
                        products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                className="w-[280px] md:w-[420px]"
                            />
                        ))
                    )}
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t border-white/10 pt-10 md:pt-12">
                    <InfoCard
                        title="PRIVATE ORDERING"
                        text="Your selections are shared directly and confidentially. Every request is handled with absolute discretion."
                    />
                    <InfoCard
                        title="DISCREET DELIVERY"
                        text="All orders are prepared in neutral, unmarked packaging. No product details appear on the outside."
                    />
                    <InfoCard
                        title="PERSONAL ASSISTANCE"
                        text="Need guidance? We are available to help you choose what suits you best."
                    />
                </div>
            </div>
        </section>
    );
}

function InfoCard({ title, text }: { title: string; text: string }) {
    return (
        <div className="text-center space-y-3 md:space-y-4 flex flex-col items-center">
            <h3 className="text-[0.8rem] md:text-[0.9rem] tracking-[0.2em] uppercase text-cream/90">
                {title}
            </h3>
            <p className="text-sm leading-8 text-cream/55 font-light max-w-[34ch] mx-auto">
                {text}
            </p>
        </div>
    );
}
