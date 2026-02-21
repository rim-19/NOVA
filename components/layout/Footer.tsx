"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PrivateTeaserArtifacts } from "@/components/shared/PrivateTeaserArtifacts";

export function Footer() {
    const [poeticPhrase, setPoeticPhrase] = useState("Beauty is the illumination of the soul.");

    useEffect(() => {
        async function fetchFooter() {
            const { data } = await supabase.from("site_content").select("content").single();
            if (data?.content?.poetic_phrase) setPoeticPhrase(data.content.poetic_phrase);
        }
        fetchFooter();
    }, []);
    return (
        <footer
            className="relative py-16 md:py-24 px-6 md:px-12 overflow-hidden"
            style={{
                borderTop: "1px solid rgba(125, 23, 54, 0.15)",
                background: "linear-gradient(180deg, transparent 0%, rgba(26,2,2,0.5) 100%)",
            }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center gap-8">
                    {/* Logo */}
                    <div>
                        <span
                            style={{
                                fontFamily: "MonteCarlo, cursive",
                                fontSize: "2.5rem",
                                color: "#F5E9E2",
                                opacity: 0.8,
                            }}
                        >
                            NOVA
                        </span>
                        <p
                            className="mt-2"
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontStyle: "italic",
                                fontSize: "0.85rem",
                                color: "rgba(245,233,226,0.3)",
                                letterSpacing: "0.1em",
                            }}
                        >
                            {poeticPhrase}
                        </p>
                    </div>

                    <div className="divider-luxury" style={{ width: "80px" }} />

                    {/* Nav links */}
                    <nav className="flex flex-wrap justify-center gap-8">
                        {["Collection", "About", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-label transition-colors duration-500"
                                style={{
                                    color: "rgba(245,233,226,0.3)",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.3em",
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/novalingerieby?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 transition-colors duration-500"
                        style={{ color: "rgba(245,233,226,0.3)" }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="group-hover:stroke-gold transition-colors duration-500"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                        <span
                            className="text-label group-hover:text-cream/60 transition-colors duration-500"
                            style={{ fontSize: "0.6rem", letterSpacing: "0.3em" }}
                        >
                            @nova.lingerie
                        </span>
                    </a>

                    <div className="divider-luxury" style={{ width: "60px" }} />

                    {/* Copyright */}
                    <p
                        className="text-label"
                        style={{
                            color: "rgba(245,233,226,0.15)",
                            fontSize: "0.55rem",
                            letterSpacing: "0.2em",
                        }}
                    >
                        © {new Date().getFullYear()} NOVA. All rights reserved. Crafted
                        with intention.
                    </p>
                </div>
            </div>
        </footer>
    );
}
