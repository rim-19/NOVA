"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

const HERO_VIDEO_SOURCES = ["/new_assets/hero_video1.mp4", "/new_assets/hero_video.mp4"];

export function HeroSection() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoSourceIndex, setVideoSourceIndex] = useState(0);
    const [videoReady, setVideoReady] = useState(false);
    const [videoFailed, setVideoFailed] = useState(false);
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

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const tryPlay = async () => {
            try {
                await video.play();
                setVideoReady(true);
            } catch {
                setVideoReady(false);
            }
        };

        const handleReady = () => setVideoReady(true);
        const handleLoadStart = () => setVideoReady(false);
        const handleError = () => {
            if (videoSourceIndex < HERO_VIDEO_SOURCES.length - 1) {
                setVideoSourceIndex((prev) => prev + 1);
                return;
            }
            setVideoReady(false);
            setVideoFailed(true);
        };

        video.addEventListener("canplay", handleReady);
        video.addEventListener("canplaythrough", handleReady);
        video.addEventListener("playing", handleReady);
        video.addEventListener("loadeddata", handleReady);
        video.addEventListener("loadedmetadata", handleReady);
        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("error", handleError);
        video.load();
        void tryPlay();

        const resumeOnUserAction = () => {
            if (video.paused) void tryPlay();
        };

        document.addEventListener("touchstart", resumeOnUserAction, { passive: true });
        document.addEventListener("click", resumeOnUserAction);
        document.addEventListener("visibilitychange", resumeOnUserAction);

        return () => {
            video.removeEventListener("canplay", handleReady);
            video.removeEventListener("canplaythrough", handleReady);
            video.removeEventListener("playing", handleReady);
            video.removeEventListener("loadeddata", handleReady);
            video.removeEventListener("loadedmetadata", handleReady);
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("error", handleError);
            document.removeEventListener("touchstart", resumeOnUserAction);
            document.removeEventListener("click", resumeOnUserAction);
            document.removeEventListener("visibilitychange", resumeOnUserAction);
        };
    }, [videoSourceIndex]);

    const sectionRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const taglineRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(bgRef.current, {
                scale: 1.08,
                duration: 20,
                ease: "none",
                repeat: -1,
                yoyo: true,
            });

            const tl = gsap.timeline({ delay: 0.3 });

            tl.fromTo(sectionRef.current, { opacity: 0 }, { opacity: 1, duration: 2.5, ease: "power2.out" })
                .fromTo(
                    taglineRef.current,
                    { opacity: 0, y: 20, letterSpacing: "0.5em" },
                    { opacity: 0.5, y: 0, letterSpacing: "0.4em", duration: 1.8, ease: "power2.out" },
                    "-=1.5"
                )
                .fromTo(
                    titleRef.current,
                    { opacity: 0, y: 40, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: 2, ease: "power3.out" },
                    "-=1.2"
                )
                .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" }, "-=0.8")
                .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, "-=0.8");
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full lace-overlay overflow-hidden"
            style={{ height: "100vh", minHeight: "500px", opacity: 0 }}
        >
            <div ref={bgRef} className="absolute inset-0 will-change-transform bg-[#2B0303]">
                <div
                    className={`absolute inset-0 bg-[#2B0303] transition-opacity duration-700 ${videoReady ? "opacity-0" : "opacity-100"}`}
                />
                <video
                    key={HERO_VIDEO_SOURCES[videoSourceIndex]}
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/new_assets/unspoken.jpeg"
                    style={{ filter: "brightness(0.8) contrast(1.1)" }}
                    className={`w-full h-full object-cover object-top md:object-center md:scale-95 img-luxury transition-opacity duration-700 ${videoReady && !videoFailed ? "opacity-100" : "opacity-0"}`}
                >
                    <source src={HERO_VIDEO_SOURCES[videoSourceIndex]} type="video/mp4" />
                </video>

                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(43,3,3,0.5) 0%, rgba(57,10,22,0.7) 50%, rgba(43,3,3,0.9) 100%)",
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(43,3,3,0.6) 100%)" }}
                />
            </div>

            <div className="absolute inset-0 z-[2]" style={{ opacity: 0.03 }} />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
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
                    <span style={{ color: "#d4c4bc", fontStyle: "italic" }}>{content.hero_title_2}</span>
                </h1>

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

                <div ref={ctaRef} className="opacity-0 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Link
                        href="/collection"
                        className="btn-luxury rounded-none animate-pulse-glow"
                        style={{
                            minWidth: "180px",
                            boxShadow:
                                "0 0 50px rgba(184, 149, 106, 0.8), 0 0 100px rgba(184, 149, 106, 0.4), 0 0 150px rgba(184, 149, 106, 0.2), inset 0 0 30px rgba(184, 149, 106, 0.3)",
                            textShadow: "0 0 30px rgba(184, 149, 106, 0.6), 0 0 50px rgba(184, 149, 106, 0.4)",
                            border: "1px solid rgba(184, 149, 106, 0.6)",
                        }}
                    >
                        Explore Collections
                    </Link>
                    <Link
                        href="/about"
                        className="text-label text-cream/40 hover:text-cream/70 transition-colors duration-500 group flex items-center justify-center gap-3 w-full sm:w-auto mt-2 sm:mt-0"
                    >
                        <span className="w-8 h-px bg-cream/40 opacity-0 sm:hidden" />
                        Our Story
                        <span className="w-5 h-px bg-cream/40 group-hover:w-8 group-hover:bg-cream/70 transition-all duration-500 inline-block" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
