"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/supabase";

interface ProductCardProps {
    product: Product;
    index?: number;
    className?: string;
}

export function ProductCard({ product, index = 0, className = "" }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showSecondImage, setShowSecondImage] = useState(false);
    const [showTeaser, setShowTeaser] = useState(false);

    useEffect(() => {
        // Automatic cycle for mobile/touch devices
        const isMobile = window.matchMedia("(hover: none)").matches;
        if (!isMobile) return;

        // Cycle every 3s (1.5s pause + 1.5s transition)
        const interval = setInterval(() => {
            setShowSecondImage((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Desktop hover state
    useEffect(() => {
        const isMobile = window.matchMedia("(hover: none)").matches;
        if (isMobile) return;

        setShowSecondImage(isHovered);
    }, [isHovered]);

    const handleMobileClick = (e: React.MouseEvent) => {
        const isMobile = window.matchMedia("(hover: none)").matches;
        if (isMobile) {
            e.preventDefault();
            setShowTeaser(true);
            setTimeout(() => setShowTeaser(false), 2500);
        }
    };

    const secondImageExists = product.images && product.images.length > 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
            className={`flex-shrink-0 group select-none relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={`/product/${product.slug}`}
                className="block"
                onClick={handleMobileClick}
            >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-dark border border-gold/5 shadow-2xl transition-all duration-700 group-hover:border-gold/20 group-hover:shadow-gold-glow/10 bg-dark-card">
                    {/* Layer 0: Base Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                            draggable={false}
                            sizes="(max-width: 768px) 300px, 420px"
                        />
                    </div>

                    {/* Layer 1: Second Image (Cross-fade) */}
                    {secondImageExists && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showSecondImage ? 1 : 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }} // 1.5s timing as requested
                            className="absolute inset-0 z-[1]"
                        >
                            <Image
                                src={product.images[1]}
                                alt={`${product.name} alternate`}
                                fill
                                className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                                draggable={false}
                                sizes="(max-width: 768px) 300px, 420px"
                            />
                        </motion.div>
                    )}

                    {/* Shadow overlay */}
                    <div className="absolute inset-0 z-[2] bg-gradient-to-t from-dark-base/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                    {/* Price tag */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className="px-3 py-1.5 glass-dark rounded-full border border-gold/10">
                            {product.discount_price ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-[0.65rem] text-gold/40 line-through tracking-widest">{product.price.toLocaleString("en-US")}</span>
                                    <span className="text-[0.65rem] text-gold font-bold tracking-widest">{product.discount_price.toLocaleString("en-US")} MAD</span>
                                </div>
                            ) : product.price > 0 ? (
                                <span className="text-[0.65rem] text-gold/80 tracking-widest">{product.price.toLocaleString("en-US")} MAD</span>
                            ) : (
                                <span className="text-[0.65rem] text-gold/50 tracking-widest">PRICE ON REQUEST</span>
                            )}
                        </div>
                    </div>

                    {/* Name & Poetic Line */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                        <p className="text-[0.5rem] md:text-[0.55rem] text-gold/40 tracking-[0.4em] uppercase mb-2">{product.collection}</p>
                        <h3 className="font-cormorant italic font-bold text-lg md:text-xl text-[#b8956a] mb-2 leading-tight">
                            {product.name}
                        </h3>
                        <p className="font-montecarlo text-lg md:text-xl text-gold/60 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                            {product.poetic_description}
                        </p>
                    </div>

                    {/* Private Collection Teaser Overlay (Mobile) */}
                    <AnimatePresence>
                        {showTeaser && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[40] flex flex-col items-center justify-center p-8 bg-dark-base/90 backdrop-blur-md"
                            >
                                <div className="absolute inset-0 opacity-20 overflow-hidden">
                                    <Image
                                        src="/assets/blurred_assets/image copy 3.png"
                                        alt=""
                                        fill
                                        className="object-cover scale-150 blur-xl"
                                    />
                                </div>
                                <div className="relative z-10 text-center space-y-4">
                                    <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] uppercase">Private Directive</p>
                                    <h4 className="font-cormorant italic text-2xl text-cream">Beyond Lingerie</h4>
                                    <div className="w-8 h-px bg-gold/20 mx-auto" />
                                    <p className="font-montecarlo text-xl text-gold/60">The Private Collection Opens Soon</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Link>
        </motion.div>
    );
}
