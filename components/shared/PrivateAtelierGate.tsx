"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function PrivateAtelierGate() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener("open-atelier-gate", handleOpen);
        return () => window.removeEventListener("open-atelier-gate", handleOpen);
    }, []);

    // Body scroll lock
    useEffect(() => {
        if (typeof document === "undefined") return;
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "auto";
            document.body.style.touchAction = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.touchAction = "auto";
        };
    }, [isOpen]);

    const hintImages = [
        { src: "/assets/blurred/private_1.jpeg", delay: 0.1 },
        { src: "/assets/blurred/private_2.jpeg", delay: 0.2 },
        { src: "/assets/blurred/private_4.jpeg", delay: 0.3 },
        { src: "/assets/blurred/private_5.jpeg", delay: 0.4 },
        { src: "/assets/blurred/private_6.jpeg", delay: 0.5 },
        { src: "/assets/blurred/private_png_1.png", delay: 0.6 },
        { src: "/assets/blurred/private_png_2.png", delay: 0.7 },
        { src: "/assets/blurred/private_png_3.png", delay: 0.8 },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Magical Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-dark-base/80 backdrop-blur-2xl cursor-crosshair"
                    />

                    {/* Random floating miniatures - Moved outside modal for full-screen impact */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
                        <div className="relative w-[84vw] max-w-[680px] h-[68vh] max-h-[680px]">
                        {hintImages.map((img, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.84, y: 10 }}
                                animate={{
                                    opacity: 0.62,
                                    scale: 1,
                                    x: [0, i % 2 === 0 ? 12 : -12, 0],
                                    y: [0, i % 3 === 0 ? -15 : 15, 0],
                                    rotate: [0, i % 2 === 0 ? 5 : -5, 0]
                                }}
                                transition={{
                                    opacity: { delay: 0.45 + img.delay, duration: 1.2 },
                                    scale: { delay: 0.5 + img.delay, type: "spring" },
                                    x: { duration: 12 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
                                    y: { duration: 10 + i * 0.6, repeat: Infinity, ease: "easeInOut" },
                                    rotate: { duration: 13 + i * 0.7, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="absolute w-[27vw] md:w-[17vw] max-w-[132px] aspect-square overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(125,23,54,0.1)] border border-white/10"
                                style={{
                                    top: `${50 + 32 * Math.sin(((i * 2 * Math.PI) / hintImages.length) - Math.PI / 2)}%`,
                                    left: `${50 + 32 * Math.cos(((i * 2 * Math.PI) / hintImages.length) - Math.PI / 2)}%`,
                                    transform: 'translate(-50%, -50%)',
                                    clipPath: 'url(#heart-clip)'
                                }}
                            >
                                <Image
                                    src={img.src}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    style={{ filter: "blur(0.8px) brightness(0.85) contrast(1.1)" }}
                                />
                                <div className="absolute inset-0 bg-burgundy/15 mix-blend-overlay" />
                            </motion.div>
                        ))}
                        </div>
                    </div>

                    {/* Seductive Floating Window - Minimized & No Border */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 100
                        }}
                        className="relative w-full max-w-lg bg-[#110101]/60 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8),0_0_80px_rgba(125,23,54,0.15)]"
                    >
                        {/* Internal Floating Lights */}
                        <div className="absolute inset-0 pointer-events-none">
                            <motion.div
                                animate={{
                                    scale: [1, 1.3, 1],
                                    opacity: [0.1, 0.2, 0.1],
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 right-0 w-full h-full bg-burgundy/10 rounded-full blur-[100px]"
                            />
                        </div>

                        {/* Content Container - Scrollable on mobile if needed */}
                        <div className="relative z-10 max-h-[90vh] overflow-y-auto no-scrollbar py-16 px-6 md:px-8 flex flex-col items-center justify-center text-center space-y-10 focus:outline-none">
                            <div className="space-y-3 pt-4 md:pt-0">
                                <motion.p
                                    initial={{ opacity: 0, letterSpacing: "0.2em" }}
                                    animate={{ opacity: 0.4, letterSpacing: "0.4em" }}
                                    transition={{ delay: 0.8, duration: 1.5 }}
                                    className="text-[0.5rem] text-gold uppercase tracking-[0.4em]"
                                >
                                    The Unspoken Collection
                                </motion.p>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="font-cormorant italic font-light text-3xl md:text-4xl text-cream tracking-tight"
                                >
                                    Behind the Latch
                                </motion.h2>
                            </div>

                            <div className="w-8 h-px bg-gold/20 mx-auto" />

                            <div className="max-w-xs mx-auto space-y-8 pb-4">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="font-inter text-xs md:text-sm text-cream/60 leading-relaxed font-light italic tracking-wide"
                                >
                                    &quot;Desire is a delicate game. Some pieces are too intimate for the public eye... they await those who know how to ask.&quot;
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.5 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <Link
                                        href="/contact"
                                        onClick={() => setIsOpen(false)}
                                        className="btn-burgundy group relative px-10 py-3.5 rounded-full text-[0.6rem] tracking-[0.3em] uppercase transition-all duration-700 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(125,23,54,0.3)] overflow-hidden"
                                    >
                                        <span className="relative z-10">Tempt Me Privately</span>
                                        <div className="absolute inset-0 bg-gold/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                    </Link>

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-[0.6rem] text-white/20 hover:text-gold transition-colors duration-500 tracking-[0.2em] uppercase italic border-b border-white/5 pb-0.5 mb-4"
                                    >
                                        Return to Surface
                                    </button>
                                </motion.div>
                            </div>
                        </div>

                        {/* Subtle Edge Glows */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
                    </motion.div>

                    {/* Close Trigger */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 md:top-10 md:right-10 text-cream/20 hover:text-gold transition-colors duration-500 z-50"
                        aria-label="Close"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
            {/* Global SVG ClipPath definition to ensure hearts scale perfectly */}
            <svg width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
                        <path d="M0.5,0.9 L0.44,0.83 C0.22,0.64 0.08,0.51 0.08,0.35 C0.08,0.22 0.18,0.12 0.31,0.12 C0.38,0.12 0.45,0.16 0.5,0.21 C0.55,0.16 0.62,0.12 0.69,0.12 C0.82,0.12 0.92,0.22 0.92,0.35 C0.92,0.51 0.78,0.64 0.56,0.83 L0.5,0.9 Z" />
                    </clipPath>
                </defs>
            </svg>
        </AnimatePresence>
    );
}
