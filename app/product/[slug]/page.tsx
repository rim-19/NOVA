"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { supabase, type Product } from "@/lib/supabase";
import { PrivateTeaserArtifacts } from "@/components/shared/PrivateTeaserArtifacts";
import { catalogProducts } from "@/lib/catalog";

const fallbackProducts: Product[] = catalogProducts;

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [addedToCart, setAddedToCart] = useState(false);

    const heroRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const { addItem } = useCartStore();

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("slug", slug)
                    .single();

                if (error) throw error;

                if (data) {
                    setProduct(data);
                } else {
                    const local = fallbackProducts.find(p => p.slug === slug) || fallbackProducts[0];
                    setProduct(local);
                }
            } catch (err) {
                console.error("Supabase error/fallback:", err);
                const local = fallbackProducts.find(p => p.slug === slug) || fallbackProducts[0];
                setProduct(local);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    useEffect(() => {
        if (!product) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, scale: 1.05, filter: "blur(10px)" },
                { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }
            );

            gsap.fromTo(
                ".reveal-info",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "power3.out",
                    delay: 0.5
                }
            );
        });
        return () => ctx.revert();
    }, [product]);

    const handleAddToCart = () => {
        if (!product) return;
        if (!selectedSize) {
            alert("Please select a size to begin the ritual.");
            return;
        }

        addItem({
            id: product.id,
            name: product.name,
            price: product.discount_price || product.price,
            original_price: product.price,
            image: product.images[0],
            size: selectedSize,
            quantity: 1,
            slug: product.slug
        });

        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    useEffect(() => {
        if (!product || product.images.length < 2) return;
        // Automatic cycle for mobile/touch devices
        const isMobile = window.matchMedia("(hover: none)").matches;
        if (!isMobile) return;

        // Cycle every 3s (1.5s pause + 1.5s transition)
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev === 0 ? 1 : 0));
        }, 3000);

        return () => clearInterval(interval);
    }, [product]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-base">
            <div className="flex flex-col items-center gap-6">
                <p className="font-montecarlo text-4xl text-gold/30 animate-pulse">NOVA</p>
                <div className="w-12 h-px bg-gold/10 overflow-hidden">
                    <div className="w-full h-full bg-gold/60 animate-loading-bar" style={{ transformOrigin: "left" }} />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-base px-6">
            <div className="text-center space-y-4">
                <p className="font-cormorant italic text-2xl text-cream/40">This silhouette has faded into memory.</p>
                <Link href="/collection" className="text-label text-gold hover:text-cream transition-colors">Return to Collections</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-12 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start relative z-10">

                {/* â”€â”€ IMAGE SECTION â”€â”€ */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div ref={heroRef} className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-dark-card group">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={product.images[activeImage]}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                                    style={{ filter: "brightness(0.9) contrast(1.1)" }}
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-base/40 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative flex-shrink-0 w-20 aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-500 ${activeImage === i ? 'border-gold scale-95' : 'border-burgundy/20 opacity-40 hover:opacity-80'}`}
                            >
                                <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* â”€â”€ INFO SECTION â”€â”€ */}
                <div ref={stickyRef} className="w-full lg:w-1/2 space-y-8 lg:sticky lg:top-32">
                    <div className="reveal-info opacity-0">
                        <p className="text-label text-gold/50 text-[0.6rem] mb-4 tracking-[0.4em]">{product.collection}</p>
                        <h1 className="font-cormorant italic font-bold text-4xl md:text-6xl text-[#b8956a] leading-tight mb-4">
                            {product.name}
                        </h1>
                        <p className="font-montecarlo text-2xl text-gold/80 mb-8">{product.poetic_description}</p>
                    </div>

                    <div className="divider-luxury reveal-info opacity-0" />

                    <div className="reveal-info opacity-0 space-y-6">
                        <p className="font-inter text-sm text-cream/40 leading-relaxed font-light max-w-md">
                            {product.description || product.short_description}
                        </p>
                        <div className="flex flex-col gap-2">
                            {product.discount_price ? (
                                <div className="space-y-1">
                                    <p className="font-inter text-sm text-gold/30 line-through tracking-widest uppercase">
                                        {product.price.toLocaleString("fr-MA")} MAD
                                    </p>
                                    <p className="font-cormorant text-4xl text-gold font-bold">
                                        {product.discount_price.toLocaleString("fr-MA")} MAD
                                    </p>
                                    <span className="inline-block px-2 py-0.5 bg-burgundy/40 border border-white/5 rounded text-[0.55rem] text-white tracking-[0.2em] font-bold uppercase italic">Reduced Offer</span>
                                </div>
                            ) : product.price > 0 ? (
                                <p className="font-cormorant text-3xl text-gold/90">{product.price.toLocaleString("fr-MA")} MAD</p>
                            ) : (
                                <p className="font-cormorant text-3xl text-gold/70">Price on request</p>
                            )}
                        </div>
                    </div>

                    <div className="reveal-info opacity-0 space-y-4">
                        <p className="text-label text-[0.6rem] text-cream/30 tracking-widest uppercase">Select Size</p>
                        <div className="flex gap-3">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-lg border text-xs tracking-widest transition-all duration-500 btn-click-effect hover:scale-105 ${selectedSize === size ? 'border-gold text-gold bg-gold/5 shadow-gold-glow' : 'border-cream/10 text-cream/40 hover:border-cream/30'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="reveal-info opacity-0 pt-6">
                        <button
                            onClick={handleAddToCart}
                            className="btn-burgundy w-full py-5 text-sm tracking-[0.3em] uppercase animate-pulse-glow"
                        >
                            {addedToCart ? "Selection Confirmed âœ“" : "Add to Ritual"}
                        </button>
                    </div>

                    <p className="reveal-info opacity-0 text-[0.55rem] text-center text-cream/20 tracking-[0.3em] uppercase pt-4">
                        Hand washed Â· Silk care Â· Private Delivery
                    </p>
                </div>
            </div>

            {/* â”€â”€ RITUAL SECTION â”€â”€ */}
            <div className="max-w-7xl mx-auto mt-32 md:mt-48 pt-20 border-t border-cream/5 flex flex-col md:flex-row gap-16 text-center reveal-info opacity-0">
                <div className="flex-1 space-y-4">
                    <h3 className="font-cormorant italic text-xl text-cream">The Touch</h3>
                    <p className="text-xs text-cream/30 leading-relaxed font-light">Each piece is inspected under warm light, ensuring the silk meets our standard of silence.</p>
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="font-cormorant italic text-xl text-cream">The Whisper</h3>
                    <p className="text-xs text-cream/30 leading-relaxed font-light">Infused with a hint of rose and cedarwood before being wrapped in acid-free tissue.</p>
                </div>
                <div className="flex-1 space-y-4">
                    <h3 className="font-cormorant italic text-xl text-cream">The Mystery</h3>
                    <p className="text-xs text-cream/30 leading-relaxed font-light">Delivered in a discrete, magnetic-close box lined with charcoal velvet.</p>
                </div>
            </div>
        </div>
    );
}



