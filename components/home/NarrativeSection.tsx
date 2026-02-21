"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { homeNarrativeBlocks } from "@/lib/catalog";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function NarrativeSection() {
    const [content, setContent] = useState<any>(null);

    useEffect(() => {
        async function fetchContent() {
            const { data } = await supabase.from("site_content").select("content").single();
            if (data?.content) setContent(data.content);
        }
        fetchContent();
    }, []);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const blocks = gsap.utils.toArray<HTMLDivElement>(".narrative-block");

            blocks.forEach((block) => {
                const textEls = block.querySelectorAll(".narrative-text");
                const imageEl = block.querySelector(".narrative-image");
                const labelEl = block.querySelector(".narrative-label");

                gsap.fromTo(
                    labelEl,
                    { opacity: 0, y: 10 },
                    {
                        opacity: 0.4,
                        y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: block,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );

                gsap.fromTo(
                    textEls,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1.4,
                        stagger: 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: block,
                            start: "top 75%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );

                if (imageEl) {
                    gsap.fromTo(
                        imageEl,
                        { y: 30, opacity: 0, scale: 1.05 },
                        {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            duration: 1.6,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: block,
                                start: "top 80%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    );

                    const isMobile = window.innerWidth < 768;
                    if (!isMobile) {
                        gsap.to(imageEl, {
                            y: -40,
                            ease: "none",
                            scrollTrigger: {
                                trigger: block,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.5,
                            },
                        });
                    }
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto"
        >
            <div className="text-center mb-20 md:mb-32">
                <p
                    className="text-label mb-4"
                    style={{ color: "rgba(184,149,106,0.5)" }}
                >
                    {content?.narrative_label || "A Story in Silk"}
                </p>
                <div className="divider-luxury" />
            </div>

            <div className="flex flex-col gap-24 md:gap-40">
                {homeNarrativeBlocks.map((block, i) => (
                    <div
                        key={i}
                        className={`narrative-block flex flex-col ${block.position === "right"
                            ? "md:flex-row-reverse"
                            : "md:flex-row"
                            } items-center gap-10 md:gap-20`}
                    >
                        <div className="narrative-image w-full md:w-1/2 relative overflow-hidden rounded-2xl opacity-0">
                            <div
                                className="absolute inset-0 z-10"
                                style={{
                                    background:
                                        block.position === "left"
                                            ? "linear-gradient(90deg, transparent 60%, rgba(43,3,3,0.8) 100%)"
                                            : "linear-gradient(270deg, transparent 60%, rgba(43,3,3,0.8) 100%)",
                                }}
                            />
                            <Image
                                src={block.image}
                                alt={block.label}
                                width={700}
                                height={900}
                                className="w-full object-cover img-luxury"
                                style={{
                                    height: "clamp(300px, 60vw, 600px)",
                                    filter: "contrast(1.05) saturate(0.8) brightness(0.85)",
                                }}
                            />
                        </div>

                        <div
                            className={`w-full md:w-1/2 flex flex-col ${block.position === "right"
                                ? "md:items-end md:text-right"
                                : "md:items-start md:text-left"
                                } items-center text-center`}
                        >
                            <p
                                className="narrative-label text-label mb-6 opacity-0"
                                style={{ color: "rgba(184,149,106,0.4)" }}
                            >
                                {block.label}
                            </p>
                            <h2
                                className="narrative-text opacity-0"
                                style={{
                                    fontFamily: "Cormorant Garamond, serif",
                                    fontStyle: "italic",
                                    fontWeight: 300,
                                    fontSize: "clamp(1.8rem, 4.5vw, 3.2rem)",
                                    lineHeight: 1.3,
                                    color: "#F5E9E2",
                                    letterSpacing: "0.02em",
                                    marginBottom: "0.25em",
                                }}
                            >
                                {block.verse}
                            </h2>
                            <h2
                                className="narrative-text opacity-0"
                                style={{
                                    fontFamily: "MonteCarlo, cursive",
                                    fontSize: "clamp(2rem, 5vw, 3.8rem)",
                                    lineHeight: 1.2,
                                    color: "#d4c4bc",
                                    marginBottom: "1.5rem",
                                }}
                            >
                                {block.verse2}
                            </h2>
                            <div className="divider-luxury mb-6" style={{ margin: block.position === "right" ? "0 0 1.5rem auto" : "0 auto 1.5rem 0" }} />
                            <p
                                className="narrative-text opacity-0"
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 300,
                                    fontSize: "0.85rem",
                                    lineHeight: 2,
                                    color: "rgba(245,233,226,0.45)",
                                    letterSpacing: "0.04em",
                                    maxWidth: "360px",
                                }}
                            >
                                {block.subtext}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
