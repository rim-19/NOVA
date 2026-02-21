"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212771907639";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "Personal Inquiry",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".reveal-content",
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.4 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const text = encodeURIComponent(
                `New Contact Inquiry - NOVA\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nSubject: ${form.subject}\nMessage: ${form.message}`
            );
            window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
            setStatus({ type: 'success', msg: "Redirecting to WhatsApp..." });
            setForm({ name: "", email: "", phone: "", subject: "Personal Inquiry", message: "" });
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: "A shadow passed over our servers. Please try again soon." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col items-center"
            style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}
        >
            <div className="max-w-4xl w-full">
                <header className="text-center mb-16 md:mb-24 reveal-content opacity-0">
                    <p className="text-label mb-4" style={{ color: "rgba(184,149,106,0.5)" }}>Contact Us</p>
                    <h1
                        style={{
                            fontFamily: "MonteCarlo, cursive",
                            fontSize: "clamp(3.5rem, 10vw, 6rem)",
                            color: "#F5E9E2",
                            lineHeight: 1
                        }}
                    >
                        The Atelier Inquiries
                    </h1>
                    <div className="divider-luxury mt-8" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    {/* Left Side: Poetry & Address */}
                    <div className="flex flex-col gap-10 reveal-content opacity-0">
                        <div>
                            <h2 className="font-cormorant italic text-2xl text-cream mb-6">Let's Speak</h2>
                            <p className="font-inter text-sm text-cream/40 leading-relaxed font-light">
                                Whether it is a custom sizing inquiry, a question about our silks, or a private collection request — we are here to listen.
                                Silence is luxury, but your voice is our inspiration.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-label text-[0.6rem] text-gold/50 tracking-[0.4em] uppercase">The Studio</p>
                            <address className="not-italic font-inter text-sm text-cream/30 space-y-1 font-light leading-relaxed">
                                <p>12 Avenue de l'Atelier</p>
                                <p>Casablanca, Morocco 20000</p>
                                <p className="pt-2">Direct: inquiries@nova-atelier.com</p>
                            </address>
                        </div>

                        <div className="pt-8">
                            <p className="font-montecarlo text-2xl text-gold/20">Nova</p>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="glass-card p-8 rounded-3xl border-gold-glow reveal-content opacity-0">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your name..."
                                    className="bg-transparent border-b border-burgundy/20 py-2 outline-none font-cormorant italic text-cream focus:border-gold/50 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@email.com..."
                                    className="bg-transparent border-b border-burgundy/20 py-2 outline-none font-cormorant italic text-cream focus:border-gold/50 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+212 ..."
                                    className="bg-transparent border-b border-burgundy/20 py-2 outline-none font-cormorant italic text-cream focus:border-gold/50 transition-colors"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Subject</label>
                                <select
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className="bg-transparent border-b border-burgundy/20 py-2 outline-none font-cormorant italic text-cream focus:border-gold/50 transition-colors"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="Personal Inquiry">Personal Inquiry</option>
                                    <option value="Custom Fit">Custom Fit Request</option>
                                    <option value="Press">Press & Media</option>
                                    <option value="Gift">Gifting Service</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your message whispered into words..."
                                    rows={4}
                                    className="bg-transparent border-b border-burgundy/20 py-2 outline-none font-inter text-sm text-cream/60 focus:border-gold/50 transition-colors resize-none leading-relaxed"
                                />
                            </div>

                            {status && (
                                <p
                                    className={`text-xs tracking-wide ${status.type === 'success' ? 'text-gold/80' : 'text-burgundy-light'}`}
                                >
                                    {status.msg}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-burgundy mt-4 w-full animate-pulse-glow"
                            >
                                {loading ? "Sending..." : "Submit Inquiry"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
