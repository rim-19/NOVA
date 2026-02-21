"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            router.push("/atelier-admin");
        } catch (err: any) {
            setError(err.message || "Failed to enter the atelier.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
            {/* Cinematic background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-burgundy/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full max-w-sm glass-card p-10 rounded-3xl border-gold-glow relative z-10"
            >
                <div className="text-center mb-10">
                    <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Atelier Access</p>
                    <h1 className="font-montecarlo text-5xl text-cream">Nova</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-label text-[0.6rem] text-gold/40 tracking-wider">Credentials</label>
                        <input
                            type="email"
                            placeholder="Email address..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-burgundy/20 py-3 outline-none font-cormorant italic text-cream focus:border-gold/50 transition-colors"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-burgundy/20 py-3 outline-none font-cormorant italic text-cream focus:border-gold/50 transition-colors"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-[0.65rem] text-red-500/80 tracking-wide text-center uppercase">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-burgundy w-full animate-pulse-glow mt-4"
                    >
                        {loading ? "Decrypting..." : "Enter the Atelier"}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-[0.55rem] text-cream/20 tracking-[0.4em] uppercase">Private Command Suite</p>
                </div>
            </motion.div>
        </div>
    );
}
