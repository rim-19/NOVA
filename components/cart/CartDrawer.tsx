"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export function CartDrawer() {
    const [mounted, setMounted] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
        useCartStore();

    useEffect(() => {
        setMounted(true);
        const drawer = drawerRef.current;
        const overlay = overlayRef.current;
        if (!drawer || !overlay) return;

        // Ensure hidden state initially via GSAP to sync with animations
        gsap.set(overlay, { display: "none", opacity: 0 });
        gsap.set(drawer, {
            display: "none",
            visibility: "hidden",
            x: "100%",
            opacity: 0
        });
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const drawer = drawerRef.current;
        const overlay = overlayRef.current;
        if (!drawer || !overlay) return;

        if (isOpen) {
            // Lock body scroll
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "var(--scrollbar-width, 0px)"; // Prevent jitter if possible

            gsap.set([overlay, drawer], { display: "block", visibility: "visible" });
            gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" });
            gsap.to(drawer, {
                x: "0%",
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
                pointerEvents: "auto"
            });
        } else {
            // Unlock body scroll
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";

            gsap.to(drawer, {
                x: "100%",
                opacity: 0,
                duration: 0.4,
                ease: "power3.in",
                pointerEvents: "none"
            });
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    gsap.set([drawer, overlay], { display: "none", visibility: "hidden" });
                },
            });
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [isOpen, mounted]);

    const total = getTotalPrice();

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;
        window.location.href = "/checkout";
    };

    if (!mounted) return null;

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[1300]"
                style={{
                    background: "rgba(43,3,3,0.8)",
                    backdropFilter: "blur(4px)",
                    display: "none",
                    opacity: 0
                }}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed right-0 top-0 bottom-0 z-[1400] w-full max-w-sm flex flex-col bg-[#1A0202] shadow-2xl overflow-hidden"
                style={{
                    borderLeft: "1px solid rgba(125,23,54,0.3)",
                    display: "none",
                    visibility: "hidden",
                    height: "100dvh" // Use dynamic viewport height
                }}
            >
                {/* Header - Fixed */}
                <div
                    className="flex-shrink-0 flex items-center justify-between p-6 md:p-8"
                    style={{
                        borderBottom: "1px solid rgba(184, 149, 106, 0.15)",
                        background: "linear-gradient(to bottom, #1A0202, #2B0303)"
                    }}
                >
                    <div>
                        <p className="text-label mb-1 text-gold/60">Your Selection</p>
                        <h2 className="font-cormorant italic font-light text-2xl text-cream tracking-wide">
                            The Cart
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 -mr-2 text-gold/40 hover:text-gold transition-colors btn-click-effect"
                        aria-label="Close cart"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable Items Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain px-6 md:px-8 py-6">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 3px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: rgba(184, 149, 106, 0.2);
                            border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: rgba(184, 149, 106, 0.4);
                        }
                    `}} />

                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-6 opacity-30 text-center py-20">
                            <p className="font-montecarlo text-3xl">Your cart whispers...</p>
                            <p className="text-[0.6rem] uppercase tracking-[0.3em]">Nothing yet. The collection awaits.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                    <div className="relative w-20 h-26 flex-shrink-0 rounded-sm overflow-hidden bg-black/40 border border-gold/5">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div>
                                            <h3 className="font-cormorant italic text-[1.1rem] text-cream leading-tight mb-1">{item.name}</h3>
                                            <div className="flex items-center gap-3">
                                                {item.size && (
                                                    <span className="text-[0.55rem] text-gold/40 uppercase tracking-widest">Size {item.size}</span>
                                                )}
                                                <span className="text-[0.55rem] text-gold/40 uppercase tracking-widest">|</span>
                                                <span className="font-cormorant text-gold/80 text-sm tracking-wide">{item.price.toLocaleString()} MAD</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border border-gold/10 rounded-sm overflow-hidden bg-black/20">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-gold/5 transition-colors text-gold/40"
                                                >−</button>
                                                <span className="w-8 text-center text-[0.7rem] text-cream/90 font-light">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                    className="w-7 h-7 flex items-center justify-center hover:bg-gold/5 transition-colors text-gold/40"
                                                >+</button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id, item.size)}
                                                className="text-[0.55rem] text-burgundy-light/60 hover:text-burgundy-light uppercase tracking-[0.2em] transition-colors"
                                            >Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Section - Fixed */}
                {items.length > 0 && (
                    <div
                        className="flex-shrink-0 p-6 md:p-8 bg-[#150202]"
                        style={{ borderTop: "1px solid rgba(184, 149, 106, 0.15)" }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cream/40">Total Est.</p>
                            <p className="font-cormorant italic text-2xl text-gold">{total.toLocaleString()} MAD</p>
                        </div>
                        <button
                            onClick={handleWhatsAppCheckout}
                            className="w-full py-4 bg-burgundy hover:bg-burgundy-deep text-cream text-[0.65rem] uppercase tracking-[0.4em] transition-all duration-700 shadow-xl shadow-black/40 border border-burgundy-light/20 relative overflow-hidden group btn-click-effect"
                        >
                            <span className="relative z-10">Proceed to Order</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                        <button
                            onClick={closeCart}
                            className="w-full mt-4 text-[0.55rem] uppercase tracking-[0.4em] text-gold/30 hover:text-gold/60 transition-colors"
                        >
                            Continue Browsing
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
