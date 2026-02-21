"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function PromoBanner() {
    const [promo, setPromo] = useState<any>(null);

    useEffect(() => {
        async function fetchPromo() {
            const { data } = await supabase.from("site_content").select("content").single();
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

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`${themes[promo.theme] || themes.burgundy} text-white py-2 px-4 text-center relative z-[100]`}
            >
                <Link href={promo.link || "#"} className="group inline-flex items-center gap-2">
                    <span
                        className="text-[0.6rem] md:text-[0.7rem] font-bold tracking-[0.2em] uppercase"
                        style={{ fontFamily: "Inter, sans-serif" }}
                    >
                        {promo.text}
                    </span>
                    <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="transition-transform group-hover:translate-x-1"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </motion.div>
        </AnimatePresence>
    );
}
