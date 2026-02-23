"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useCartStore } from "@/store/useCartStore";

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [hideHeroActions, setHideHeroActions] = useState(true);
    const navRef = useRef<HTMLElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const { getTotalItems, toggleCart } = useCartStore();
    const totalItems = getTotalItems();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setHideHeroActions(pathname === "/");
    }, [pathname]);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Init nav entrance
    useEffect(() => {
        gsap.fromTo(
            navRef.current,
            { y: -30, opacity: 1 }, // Ensure opacity is 1 from start
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" } // Removed delay and opacity transition
        );
    }, []);

    // Mobile menu animation
    useEffect(() => {
        const menu = mobileMenuRef.current;
        const overlay = document.getElementById("mobile-overlay");
        if (!menu || !overlay) return;

        if (menuOpen) {
            gsap.to(overlay, { opacity: 1, duration: 0.4, pointerEvents: "auto" });
            gsap.fromTo(
                menu,
                { x: "100%" },
                { x: "0%", duration: 0.7, ease: "power4.out" }
            );
        } else {
            gsap.to(overlay, { opacity: 0, duration: 0.4, pointerEvents: "none" });
            gsap.to(menu, {
                x: "100%",
                duration: 0.6,
                ease: "power4.in",
            });
        }
    }, [menuOpen]);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Collection", href: "/collection" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 border-b border-transparent ${scrolled
                    ? "glass-dark py-4 shadow-luxury border-gold/5"
                    : "bg-dark-base md:bg-transparent py-5 md:py-6"
                    }`}
                style={{ opacity: 1, visibility: "visible" }}
            >
                <div className="w-full max-w-7xl mx-auto px-5 md:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex-shrink-0 relative z-10">
                        <span
                            className="font-montecarlo text-2xl md:text-3xl text-cream tracking-wide"
                            style={{ fontFamily: "MonteCarlo, cursive" }}
                        >
                            NOVA
                        </span>
                    </Link>

                    {/* Desktop Links - Hidden on mobile */}
                    {!hideHeroActions && (
                        <div className="hidden md:flex items-center gap-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-label text-cream/60 hover:text-cream/100 transition-colors duration-500 relative group btn-click-effect nav-link-hover"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold/60 group-hover:w-full transition-all duration-500" />
                                </Link>
                            ))}

                            {/* Private Collection Teaser Trigger */}
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent("open-atelier-gate"))}
                                className="group relative flex items-center justify-center w-10 h-10 transition-all duration-700 btn-click-effect"
                                aria-label="Atelier Entrance"
                            >
                                <div className="relative w-5 h-5 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="0.3"
                                        className="w-full h-full text-gold/80 filter drop-shadow-[0_0_10px_rgba(184,149,106,0.6)] animate-pulse-glow"
                                    >
                                        <path
                                            d="M12 4C12 4 12.5 11 20 12C12.5 13 12 20 12 20C12 20 11.5 13 4 12C11.5 11 12 4 12 4Z"
                                            fill="currentColor"
                                        />
                                        <path d="M12 0V24M0 12H24" stroke="currentColor" strokeWidth="0.2" className="opacity-10" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Right side - Mobile compact */}
                    {!hideHeroActions && (
                        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 relative z-10">
                        {/* Cart button (Desktop) */}
                        <button
                            onClick={toggleCart}
                            className="relative text-label text-cream/60 hover:text-cream transition-colors duration-500 hidden md:flex items-center gap-3 btn-click-effect"
                            aria-label="Open cart"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {isMounted && totalItems > 0 && (
                                <span
                                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-light text-cream"
                                    style={{ background: "#7D1736" }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile cart */}
                        <button
                            onClick={toggleCart}
                            className="relative flex md:hidden items-center justify-center w-10 h-10 text-cream/80 btn-click-effect flex-shrink-0"
                            aria-label="Open cart"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {isMounted && totalItems > 0 && (
                                <span
                                    className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-cream"
                                    style={{ background: "#7D1736" }}
                                >
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="relative flex md:hidden items-center gap-3 group flex-shrink-0"
                            aria-label="Toggle menu"
                        >
                            <span className="text-[0.7rem] text-cream tracking-[0.2em] font-medium uppercase block">
                                {menuOpen ? "Close" : "Menu"}
                            </span>
                            <div className="flex flex-col gap-1.5 w-6">
                                <span
                                    className={`block w-full h-[1.2px] bg-cream transition-all duration-500 ${menuOpen ? "rotate-45 translate-y-2" : ""
                                        }`}
                                />
                                <span
                                    className={`block w-2/3 h-[1.2px] bg-cream transition-all duration-500 ml-auto ${menuOpen ? "opacity-0 translate-x-2" : ""
                                        }`}
                                />
                                <span
                                    className={`block w-full h-[1.2px] bg-cream transition-all duration-500 ${menuOpen ? "-rotate-45 -translate-y-2" : ""
                                        }`}
                                />
                            </div>
                        </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div
                id="mobile-overlay"
                className="fixed inset-0 z-[1100] md:hidden bg-dark-base/60 backdrop-blur-sm pointer-events-none opacity-0 transition-opacity duration-500"
                onClick={() => setMenuOpen(false)}
            />

            {/* Mobile Side Drawer */}
            <div
                ref={mobileMenuRef}
                className="fixed top-0 bottom-0 right-0 z-[1200] w-[80%] max-w-xs md:hidden flex flex-col glass-dark border-l border-gold/10"
                style={{
                    transform: "translateX(100%)",
                }}
            >
                {/* Header / Close */}
                <div className="flex items-center justify-between p-8">
                    <span className="font-montecarlo text-2xl text-gold/80 italic">NOVA</span>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-cream/40 hover:text-cream transition-colors p-2 -mr-2"
                        aria-label="Close menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="px-8 py-4 flex flex-col gap-8 flex-1 justify-center">
                    <p className="text-label text-[0.55rem] text-gold/30 tracking-[0.4em] mb-4">Navigation</p>
                    <div className="flex flex-col gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-xl md:text-2xl font-cormorant italic text-cream/70 hover:text-gold transition-colors duration-500 flex items-center gap-4 group"
                                onClick={() => setMenuOpen(false)}
                            >
                                <span className="w-0 h-px bg-gold/40 group-hover:w-8 transition-all duration-500" />
                                {link.label}
                            </Link>
                        ))}

                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                setTimeout(() => window.dispatchEvent(new CustomEvent("open-atelier-gate")), 400);
                            }}
                            className="mt-8 flex items-center gap-6 group"
                        >
                            <div className="w-10 h-10 flex items-center justify-center transition-all duration-500">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="0.3"
                                    className="w-6 h-6 text-gold/80 filter drop-shadow-[0_0_12px_rgba(184,149,106,0.5)] animate-pulse-glow"
                                >
                                    <path
                                        d="M12 4C12 4 12.5 11 20 12C12.5 13 12 20 12 20C12 20 11.5 13 4 12C11.5 11 12 4 12 4Z"
                                        fill="currentColor"
                                    />
                                    <path d="M12 0V24M0 12H24" stroke="currentColor" strokeWidth="0.2" className="opacity-10" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-[0.6rem] text-gold/40 tracking-[0.2em] uppercase">Private Wing</p>
                                <p className="font-cormorant italic text-lg text-cream/70 group-hover:text-cream transition-colors">Request Entrance</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="p-8 border-t border-gold/5 opacity-40">
                    <p className="text-[0.6rem] text-cream tracking-widest uppercase mb-2">Social</p>
                    <div className="flex gap-4">
                        <span className="text-[0.65rem] text-cream/60">Instagram</span>
                        <span className="text-[0.65rem] text-cream/60">Vogue</span>
                    </div>
                </div>
            </div>
        </>
    );
}
