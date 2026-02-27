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
                    style={{ borderBottom: "1px solid rgba(125,23,54,0.15)" }}
                >
                    <div>
                        <p className="text-label mb-1 text-gold/60">Your Selection</p>
                        <h2 className="font-cormorant italic font-light text-2xl text-cream tracking-wide">
                            The Cart
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 -mr-2 text-cream/30 hover:text-cream/80 transition-colors"
                        aria-label="Close cart"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Unified Scroll Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 custom-scrollbar">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 5px;
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
                    <div className="flex flex-col min-h-full">
                        {/* Items Section */}
                        <div className="flex-1 py-4 px-6 md:px-8">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-40">
                                    <p className="font-montecarlo text-3xl">Your cart whispers...</p>
                                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-center">Nothing yet. The collection awaits.</p>
                                </div>
                            ) : (
                                <div className="space-y-6 py-2">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.size}`} className="flex gap-4 pb-6 border-b border-burgundy/10">
                                            <div className="relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black/40">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <h3 className="font-cormorant italic text-lg text-cream leading-tight">{item.name}</h3>
                                                    {item.size && (
                                                        <p className="text-[0.6rem] text-gold/50 uppercase tracking-widest mt-1">Size: {item.size}</p>
                                                    )}
                                                    <p className="font-cormorant text-gold/80 mt-1">{item.price.toLocaleString()} MAD</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center border border-white/10 rounded overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-white/5 transition-colors text-cream/40"
                                                        >−</button>
                                                        <span className="w-8 text-center text-[0.7rem] text-cream/80">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-white/5 transition-colors text-cream/40"
                                                        >+</button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="text-[0.6rem] text-cream/20 hover:text-burgundy-light uppercase tracking-widest transition-colors"
                                                    >Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Section - Part of the scroll if items are many */}
                        {items.length > 0 && (
                            <div className="p-6 md:p-8 mt-auto bg-black/20 border-t border-burgundy/10">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="text-[0.6rem] uppercase tracking-widest text-cream/40">Total Amount</p>
                                    <p className="font-cormorant italic text-xl text-gold">{total.toLocaleString()} MAD</p>
                                </div>
                                <button
                                    onClick={handleWhatsAppCheckout}
                                    className="w-full py-4 bg-burgundy hover:bg-burgundy-light text-cream text-[0.7rem] uppercase tracking-[0.3em] rounded-full transition-all duration-500 shadow-lg shadow-burgundy/20"
                                >
                                    Proceed to Order
                                </button>
                                <button
                                    onClick={closeCart}
                                    className="w-full mt-4 text-[0.6rem] uppercase tracking-[0.4em] text-cream/20 hover:text-cream/50 transition-colors"
                                >
                                    Continue Browsing
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
