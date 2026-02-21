"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/lib/supabase";

const WHATSAPP_NUMBER = "212781563070"; // +212 781-563070

function formatWhatsAppMessage(
    name: string,
    email: string,
    phone: string,
    city: string,
    zip: string,
    address: string,
    message: string,
    items: { name: string; quantity: number; price: number; size?: string }[]
) {
    const itemLines = items
        .map(
            (i) =>
                `• ${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity} — ${(i.price * i.quantity).toLocaleString("fr-MA")} MAD`
        )
        .join("\n");

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    return encodeURIComponent(
        `✨ New Order — NOVA Lingerie\n\nClient: ${name}\nEmail: ${email}\nPhone: ${phone}\nCity: ${city}\nZip: ${zip}\nAddress: ${address}${message ? `\nNote: ${message}` : ""}\n\n${itemLines}\n\nTotal: ${total.toLocaleString("fr-MA")} MAD`
    );
}

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        zip: "",
        address: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.phone || !form.city || !form.zip || !form.address) {
            setError("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // Save order to Supabase
            const { error: dbError } = await supabase.from("orders").insert([
                {
                    customer_name: form.name,
                    phone: form.phone,
                    city: form.city,
                    message: form.message,
                    items: items,
                },
            ]);

            if (dbError) console.error("Supabase order error:", dbError);

            // Redirect to WhatsApp
            const message = formatWhatsAppMessage(
                form.name,
                form.email,
                form.phone,
                form.city,
                form.zip,
                form.address,
                form.message,
                items
            );
            clearCart();
            window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen pt-24 pb-16 px-4 md:px-12 flex items-center justify-center"
            style={{
                background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)",
            }}
        >
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <p
                        className="text-label mb-4"
                        style={{ color: "rgba(184,149,106,0.5)" }}
                    >
                        Final Step
                    </p>
                    <h1
                        style={{
                            fontFamily: "MonteCarlo, cursive",
                            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                            color: "#F5E9E2",
                            lineHeight: 1.2,
                        }}
                    >
                        Complete Your Order
                    </h1>
                    <div className="divider-luxury mt-5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
                    {/* ── Form ── */}
                    <div
                        className="glass-card p-8 rounded-3xl border-gold-glow"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            {[
                                { name: "name", label: "Full Name", type: "text", placeholder: "Your name..." },
                                { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                                { name: "phone", label: "Phone Number", type: "tel", placeholder: "+212 ..." },
                                { name: "city", label: "City", type: "text", placeholder: "Your city..." },
                                { name: "zip", label: "Zip Code", type: "text", placeholder: "10000" },
                                { name: "address", label: "Shipping Address", type: "text", placeholder: "Street name, building, apartment..." },
                            ].map((field) => (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label
                                        className="text-label"
                                        style={{
                                            color: "rgba(184,149,106,0.5)",
                                            fontSize: "0.6rem",
                                            letterSpacing: "0.35em",
                                        }}
                                    >
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={form[field.name as keyof typeof form]}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        required={field.name !== "message"}
                                        className="bg-transparent outline-none w-full transition-colors duration-400"
                                        style={{
                                            fontFamily: "Cormorant Garamond, serif",
                                            fontStyle: "italic",
                                            fontWeight: 300,
                                            fontSize: "1.05rem",
                                            color: "#F5E9E2",
                                            borderBottom: "1px solid rgba(125,23,54,0.25)",
                                            paddingBottom: "10px",
                                            letterSpacing: "0.04em",
                                        }}
                                        onFocus={(e) =>
                                        (e.target.style.borderBottomColor =
                                            "rgba(184,149,106,0.5)")
                                        }
                                        onBlur={(e) =>
                                        (e.target.style.borderBottomColor =
                                            "rgba(125,23,54,0.25)")
                                        }
                                    />
                                </div>
                            ))}

                            {/* Optional message */}
                            <div className="flex flex-col gap-2">
                                <label
                                    className="text-label"
                                    style={{
                                        color: "rgba(184,149,106,0.4)",
                                        fontSize: "0.6rem",
                                        letterSpacing: "0.35em",
                                    }}
                                >
                                    A Note (Optional)
                                </label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Anything you'd like us to know..."
                                    rows={3}
                                    className="bg-transparent outline-none resize-none w-full"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 300,
                                        fontSize: "0.85rem",
                                        color: "rgba(245,233,226,0.5)",
                                        borderBottom: "1px solid rgba(125,23,54,0.15)",
                                        paddingBottom: "10px",
                                        letterSpacing: "0.03em",
                                        lineHeight: 1.8,
                                    }}
                                />
                            </div>

                            {error && (
                                <p
                                    className="text-label"
                                    style={{ color: "rgba(184,149,106,0.8)", fontSize: "0.65rem", letterSpacing: "0.15em" }}
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || items.length === 0}
                                className="btn-burgundy animate-pulse-glow mt-4 w-full"
                            >
                                {loading ? "Sending..." : "Confirm via WhatsApp"}
                            </button>

                            <p
                                className="text-label text-center"
                                style={{
                                    color: "rgba(245,233,226,0.2)",
                                    fontSize: "0.55rem",
                                    letterSpacing: "0.2em",
                                }}
                            >
                                You will be redirected to WhatsApp to complete your order.
                            </p>
                        </form>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="flex flex-col gap-6">
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
                            Your Selection
                        </h2>

                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <div
                                    key={`${item.id}-${item.size}`}
                                    className="flex justify-between items-start pb-4"
                                    style={{ borderBottom: "1px solid rgba(125,23,54,0.1)" }}
                                >
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
                                        <p
                                            className="text-label mt-1"
                                            style={{
                                                color: "rgba(184,149,106,0.4)",
                                                fontSize: "0.6rem",
                                                letterSpacing: "0.2em",
                                            }}
                                        >
                                            {item.size && `Size ${item.size} · `}Qty {item.quantity}
                                        </p>
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: "Cormorant Garamond, serif",
                                            fontSize: "1rem",
                                            color: "rgba(184,149,106,0.8)",
                                        }}
                                    >
                                        {(item.price * item.quantity).toLocaleString("fr-MA")} MAD
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        {items.length > 0 && (
                            <div className="flex justify-between items-center pt-2">
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
                                        fontSize: "1.5rem",
                                        color: "rgba(184,149,106,0.9)",
                                    }}
                                >
                                    {total.toLocaleString("fr-MA")} MAD
                                </p>
                            </div>
                        )}

                        {items.length === 0 && (
                            <p
                                style={{
                                    fontFamily: "MonteCarlo, cursive",
                                    fontSize: "1.4rem",
                                    color: "rgba(245,233,226,0.2)",
                                }}
                            >
                                Your cart is empty.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
