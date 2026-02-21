"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export function HeroSection() {
    const [content, setContent] = useState({
        hero_tagline: "Luxury Intimate Collection",
        hero_title_1: "Desire is not worn.",
        hero_title_2: "It is felt.",
        hero_subtitle: "Where shadow meets silk. Where longing becomes luxury.",
    });

    useEffect(() => {
        async function fetchHero() {
            const { data } = await supabase.from("site_content").select("content").single();
            if (data?.content) setContent(data.content);
        }
        fetchHero();
    }, []);
    const sectionRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background slow zoom loop
            gsap.to(bgRef.current, {
                scale: 1.08,
                duration: 20,
                ease: "none",
                repeat: -1,
                yoyo: true,
            });

            // Entrance timeline
            const tl = gsap.timeline({ delay: 0.3 });

            tl.fromTo(
                sectionRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 2.5, ease: "power2.out" }
            )
                .fromTo(
                    taglineRef.current,
                    { opacity: 0, y: 20, letterSpacing: "0.5em" },
                    {
                        opacity: 0.5,
                        y: 0,
                        letterSpacing: "0.4em",
                        duration: 1.8,
                        ease: "power2.out",
                    },
                    "-=1.5"
                )
                .fromTo(
                    titleRef.current,
                    { opacity: 0, y: 40, scale: 0.97 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 2,
                        ease: "power3.out",
                    },
                    "-=1.2"
                )
                .fromTo(
                    subRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
                    "-=0.8"
                )
                .fromTo(
                    ctaRef.current,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
                    "-=0.8"
                )
                .fromTo(
                    scrollIndicatorRef.current,
                    { opacity: 0 },
                    { opacity: 0.5, duration: 1 },
                    "-=0.5"
                );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full lace-overlay overflow-hidden"
            style={{ height: "100vh", minHeight: "500px" }}
        >
            {/* Background image with overlay */}
            <div ref={bgRef} className="absolute inset-0 will-change-transform">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/new_assets/hero.png"
                    className="w-full h-full object-cover object-top md:object-center md:scale-95 img-luxury"
                >
                    <source src="/new_assets/hero_video.mp4" type="video/mp4" />
                </video>
                {/* Multi-layer overlay for depth */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(43,3,3,0.5) 0%, rgba(57,10,22,0.7) 50%, rgba(43,3,3,0.9) 100%)",
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, transparent 30%, rgba(43,3,3,0.6) 100%)",
                    }}
                />
            </div>

            {/* Lace z-layer */}
            <div className="absolute inset-0 z-[2]" style={{ opacity: 0.03 }} />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
                {/* Top tagline */}
                <div
                    ref={taglineRef}
                    className="mb-8 md:mb-12 opacity-0"
                    style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.65rem",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        color: "rgba(184, 149, 106, 0.7)",
                        fontWeight: 300,
                    }}
                >
                    {content.hero_tagline}
                </div>

                {/* Emotional main line */}
                <h1
                    ref={titleRef}
                    className="opacity-0 mb-6 md:mb-8"
                    style={{
                        fontFamily: "MonteCarlo, cursive",
                        fontSize: "clamp(2.8rem, 11vw, 7rem)",
                        lineHeight: 1.15,
                        color: "#F5E9E2",
                        textShadow: "0 2px 40px rgba(125, 23, 54, 0.4)",
                        maxWidth: "900px",
                    }}
                >
                    {content.hero_title_1}
                    <br />
                    <span
                        style={{
                            color: "#d4c4bc",
                            fontStyle: "italic",
                        }}
                    >
                        {content.hero_title_2}
                    </span>
                </h1>

                {/* Sub line */}
                <p
                    ref={subRef}
                    className="opacity-0 mb-10 md:mb-14"
                    style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontStyle: "italic",
                        fontWeight: 300,
                        fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                        color: "rgba(245, 233, 226, 0.5)",
                        letterSpacing: "0.08em",
                        maxWidth: "400px",
                    }}
                >
                    {content.hero_subtitle}
                </p>

                {/* CTA Buttons */}
                <div
                    ref={ctaRef}
                    className="opacity-0 flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        href="/collection"
                        className="btn-luxury rounded-none"
                        style={{ minWidth: "180px" }}
                    >
                        Explore Collections
                    </Link>
                    <Link
                        href="/about"
                        className="text-label text-cream/40 hover:text-cream/70 transition-colors duration-500 group flex items-center gap-3"
                    >
                        Our Story
                        <span className="w-5 h-px bg-cream/40 group-hover:w-8 group-hover:bg-cream/70 transition-all duration-500 inline-block" />
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div
                ref={scrollIndicatorRef}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 flex flex-col items-center gap-2"
            >
                <span
                    className="text-label"
                    style={{
                        color: "rgba(245,233,226,0.3)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.4em",
                    }}
                >
                    scroll
                </span>
                <div
                    className="w-px h-12 relative overflow-hidden"
                    style={{ background: "rgba(245,233,226,0.1)" }}
                >
                    <div
                        className="absolute top-0 left-0 w-full"
                        style={{
                            height: "40%",
                            background:
                                "linear-gradient(180deg, rgba(184,149,106,0.6) 0%, transparent 100%)",
                            animation: "scrollLine 2s ease-in-out infinite",
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(300%);
          }
        }
      `}</style>
        </section>
    );
}
