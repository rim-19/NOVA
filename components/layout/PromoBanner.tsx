"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function PromoBanner() {
    const [promo, setPromo] = useState<any>(null);

    useEffect(() => {
        async function fetchPromo() {
            const { data } = await supabase
                .from("site_content")
                .select("content")
                .eq("id", 1)
                .single();
            if (data?.content?.promo_banner) setPromo(data.content.promo_banner);
        }
        fetchPromo();
    }, []);

    if (!promo || !promo.is_active) return null;

    const themes: any = {
        burgundy: "bg-[#7D1736]",
        gold: "bg-[#B8956A]",
        dark: "bg-[#1A0202]"
    };

    const speeds: any = {
        slow: 35,
        medium: 20,
        fast: 10
    };

    const duration = speeds[promo.speed || "medium"];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onAnimationComplete={(definition: any) => {
                    // Set a global CSS variable for Navbar to offset itself
                    if (definition.height !== 0) {
                        document.documentElement.style.setProperty('--banner-height', '36px');
                    } else {
                        document.documentElement.style.setProperty('--banner-height', '0px');
                    }
                }}
                className={`${themes[promo.theme] || themes.burgundy} text-white py-2 overflow-hidden fixed top-0 left-0 right-0 z-[1100] border-b border-white/5 shadow-lg shadow-black/20`}
            >
                {/* Luxury Shimmer Overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 2 }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                    />
                </div>

                {promo.is_scrolling ? (
                    <div className="flex whitespace-nowrap overflow-hidden">
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{
                                repeat: Infinity,
                                duration: duration,
                                ease: "linear",
                            }}
                            className="flex gap-24 items-center min-w-full italic"
                        >
                            {[...Array(6)].map((_, i) => (
                                <Link key={i} href={promo.link || "#"} className="inline-flex items-center gap-6">
                                    <span
                                        className="text-[0.62rem] md:text-[0.72rem] font-medium tracking-[0.4em] uppercase whitespace-nowrap"
                                        style={{ fontFamily: "Inter, sans-serif" }}
                                    >
                                        {promo.text}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </Link>
                            ))}
                        </motion.div>
                        <motion.div
                            animate={{ x: [0, -1000] }}
                            transition={{
                                repeat: Infinity,
                                duration: duration,
                                ease: "linear",
                            }}
                            className="flex gap-24 items-center min-w-full italic"
                        >
                            {[...Array(6)].map((_, i) => (
                                <Link key={i + 10} href={promo.link || "#"} className="inline-flex items-center gap-6">
                                    <span
                                        className="text-[0.62rem] md:text-[0.72rem] font-medium tracking-[0.4em] uppercase whitespace-nowrap"
                                        style={{ fontFamily: "Inter, sans-serif" }}
                                    >
                                        {promo.text}
                                    </span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center px-4">
                        <Link href={promo.link || "#"} className="group inline-flex items-center gap-3">
                            <span
                                className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.25em] uppercase"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                {promo.text}
                            </span>
                            <svg
                                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                className="transition-transform group-hover:translate-x-1 opacity-70"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
