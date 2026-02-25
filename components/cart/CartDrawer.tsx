"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export function CartDrawer() {
    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
        useCartStore();

    // Prevent flash on initial load
    useEffect(() => {
        const drawer = drawerRef.current;
        const overlay = overlayRef.current;
        if (!drawer || !overlay) return;

        // Ensure hidden state initially
        gsap.set([drawer, overlay], { display: "none", opacity: 0 });
    }, []);

    useEffect(() => {
        const drawer = drawerRef.current;
        const overlay = overlayRef.current;
        if (!drawer || !overlay) return;

        if (isOpen) {
            // Make visible first
            gsap.set([drawer, overlay], { 
                display: "block", 
                opacity: 0,
                visibility: "visible",
                pointerEvents: "auto"
            });
            gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" });
            gsap.fromTo(
                drawer,
                { x: "100%" },
                { x: "0%", duration: 0.6, ease: "power4.out" }
            );
        } else {
            gsap.to(drawer, {
                x: "100%",
                duration: 0.5,
                ease: "power4.in",
            });
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    gsap.set([drawer, overlay], { 
                        display: "none", 
                        visibility: "hidden",
                        pointerEvents: "none"
                    });
                },
            });
        }
    }, [isOpen]);

    const total = getTotalPrice();

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;
        window.location.href = "/checkout";
    };

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-[1300]"
                style={{ 
                    background: "rgba(43,3,3,0.7)", 
                    opacity: 0,
                    visibility: "hidden",
                    pointerEvents: "none"
                }}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed right-0 top-0 bottom-0 z-[1400] w-full max-w-sm flex-col"
                style={{
                    background: "rgba(26,2,2,0.95)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderLeft: "1px solid rgba(125,23,54,0.2)",
                    visibility: "hidden",
                    pointerEvents: "none",
                    transform: "translateX(100%)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between p-6 md:p-8"
                    style={{ borderBottom: "1px solid rgba(125,23,54,0.1)" }}
                >
                    <div>
                        <p
                            className="text-label mb-1"
                            style={{ color: "rgba(184,149,106,0.6)", fontSize: "0.6rem" }}
                        >
                            Your Selection
                        </p>
                        <h2
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontStyle: "italic",
                                fontWeight: 300,
                                fontSize: "1.4rem",
                                color: "#F5E9E2",
                                letterSpacing: "0.05em",
                            }}
                        >
                            The Cart
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="text-cream/40 hover:text-cream/80 transition-colors duration-300"
                        aria-label="Close cart"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto py-4 px-6 md:px-8">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-6 py-20">
                            <p
                                style={{
                                    fontFamily: "MonteCarlo, cursive",
                                    fontSize: "1.8rem",
                                    color: "rgba(245,233,226,0.2)",
                                }}
                            >
                                Your cart whispers...
                            </p>
                            <p
                                className="text-label text-center"
                                style={{
                                    color: "rgba(245,233,226,0.2)",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.25em",
                                }}
                            >
                                Nothing yet. The collection awaits.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 py-2">
                            {items.map((item) => (
                                <div
                                    key={`${item.id}-${item.size}`}
                                    className="flex gap-4 pb-6"
                                    style={{ borderBottom: "1px solid rgba(125,23,54,0.08)" }}
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            style={{ filter: "contrast(1.05) saturate(0.85)" }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <p
                                                style={{
                                                    fontFamily: "Cormorant Garamond, serif",
                                                    fontStyle: "italic",
                                                    fontWeight: 300,
                                                    fontSize: "1rem",
                                                    color: "#F5E9E2",
                                                }}
                                            >
                                                {item.name}
                                            </p>
                                            {item.size && (
                                                <p
                                                    className="text-label mt-1"
                                                    style={{
                                                        color: "rgba(184,149,106,0.5)",
                                                        fontSize: "0.6rem",
                                                    }}
                                                >
                                                    Size: {item.size}
                                                </p>
                                            )}
                                            <div className="flex flex-col gap-1 mt-1">
                                                {item.original_price ? (
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            style={{
                                                                fontFamily: "Cormorant Garamond, serif",
                                                                fontSize: "0.8rem",
                                                                color: "rgba(184,149,106,0.3)",
                                                                textDecoration: "line-through"
                                                            }}
                                                        >
                                                            {item.original_price.toLocaleString("en-US")}
                                                        </span>
                                                        <span
                                                            style={{
                                                                fontFamily: "Cormorant Garamond, serif",
                                                                fontSize: "0.95rem",
                                                                color: "#B8956A",
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {item.price.toLocaleString("en-US")} MAD
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p
                                                        style={{
                                                            fontFamily: "Cormorant Garamond, serif",
                                                            fontSize: "0.9rem",
                                                            color: "rgba(184,149,106,0.8)",
                                                        }}
                                                    >
                                                        {item.price.toLocaleString("en-US")} MAD
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity & remove */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1,
                                                            item.size
                                                        )
                                                    }
                                                    className="w-6 h-6 flex items-center justify-center transition-colors duration-300"
                                                    style={{
                                                        border: "1px solid rgba(245,233,226,0.1)",
                                                        color: "rgba(245,233,226,0.4)",
                                                        borderRadius: "2px",
                                                        fontSize: "1rem",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    −
                                                </button>
                                                <span
                                                    className="text-label"
                                                    style={{
                                                        color: "rgba(245,233,226,0.6)",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1,
                                                            item.size
                                                        )
                                                    }
                                                    className="w-6 h-6 flex items-center justify-center transition-colors duration-300"
                                                    style={{
                                                        border: "1px solid rgba(245,233,226,0.1)",
                                                        color: "rgba(245,233,226,0.4)",
                                                        borderRadius: "2px",
                                                        fontSize: "1rem",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id, item.size)}
                                                className="text-label transition-colors duration-300 hover:text-cream/60"
                                                style={{
                                                    color: "rgba(245,233,226,0.2)",
                                                    fontSize: "0.6rem",
                                                    letterSpacing: "0.2em",
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div
                        className="p-6 md:p-8 flex flex-col gap-5"
                        style={{ borderTop: "1px solid rgba(125,23,54,0.1)" }}
                    >
                        <div className="flex justify-between items-center">
                            <p
                                className="text-label"
                                style={{ color: "rgba(245,233,226,0.4)", letterSpacing: "0.2em" }}
                            >
                                Total
                            </p>
                            <p
                                style={{
                                    fontFamily: "Cormorant Garamond, serif",
                                    fontStyle: "italic",
                                    fontSize: "1.2rem",
                                    color: "rgba(184,149,106,0.9)",
                                }}
                            >
                                {total.toLocaleString("fr-MA")} MAD
                            </p>
                        </div>
                        <button
                            onClick={handleWhatsAppCheckout}
                            className="btn-burgundy w-full animate-pulse-glow"
                        >
                            Proceed to Order
                        </button>
                        <button
                            onClick={closeCart}
                            className="text-label text-center transition-colors duration-300"
                            style={{ color: "rgba(245,233,226,0.2)", fontSize: "0.6rem", letterSpacing: "0.3em" }}
                        >
                            Continue Browsing
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
