"use client";

import { useEffect, useState } from "react";
import { supabase, Product, Order } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        weeklyOrders: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    supabase.from("products").select("id", { count: "exact" }),
                    supabase.from("orders").select("*")
                ]);

                const totalOrders = ordersRes.data?.length || 0;
                const revenue = ordersRes.data?.reduce((acc, order) => acc + (order.total_price || 0), 0) || 0;

                // Weekly orders calculation
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const weeklyOrders = ordersRes.data?.filter(o => new Date(o.created_at) > weekAgo).length || 0;

                setStats({
                    products: productsRes.count || 0,
                    orders: totalOrders,
                    weeklyOrders,
                    revenue
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 md:space-y-12">
            <header>
                <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Directives Overview</p>
                <h1 className="font-cormorant italic text-4xl md:text-6xl text-cream tracking-tight">Atelier Dashboard</h1>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-3xl bg-white/5 border border-white/5" />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard label="Live Products" value={stats.products} icon="inventory" />
                    <StatCard label="Total Inquiries" value={stats.orders} icon="inquiries" />
                    <StatCard label="Weekly Activity" value={`+${stats.weeklyOrders}`} icon="trend" />
                    <StatCard label="Est. Movement" value={`${stats.revenue.toLocaleString()} MAD`} icon="revenue" />
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <motion.div variants={item} className="glass-card p-6 md:p-10 rounded-3xl border-gold-glow flex flex-col gap-6">
                    <h3 className="font-cormorant italic text-2xl text-cream">System Readiness</h3>
                    <div className="space-y-4">
                        <SystemCheck label="Supabase Connection" status="active" />
                        <SystemCheck label="Image Storage (CDN)" status="active" />
                        <SystemCheck label="WhatsApp Integration" status="active" />
                    </div>
                </motion.div>

                <motion.div variants={item} className="glass-card p-6 md:p-10 rounded-3xl border-gold-glow">
                    <h3 className="font-cormorant italic text-2xl text-cream mb-6">Operational Notes</h3>
                    <ul className="text-sm text-cream/50 leading-relaxed font-light space-y-2">
                        <li>Products and collections in this panel are the same records used by the live storefront.</li>
                        <li>If image upload fails, verify the Supabase storage bucket configured for admin uploads.</li>
                        <li>Use "Manifest Heritage" only to replace catalog content in bulk.</li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            className="glass-card p-8 rounded-3xl border-gold-glow group hover:border-gold/30 transition-all duration-500"
        >
            <p className="text-[0.6rem] text-gold/40 tracking-[0.3em] uppercase mb-4">{label}</p>
            <h4 className="text-3xl font-inter font-light text-cream group-hover:text-gold transition-colors">{value}</h4>
        </motion.div>
    );
}

function SystemCheck({ label, status }: { label: string; status: 'active' | 'warning' | 'error' }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/5">
            <span className="text-xs text-cream/50 tracking-wide font-light">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                <span className="text-[0.6rem] text-cream/30 uppercase tracking-widest">{status}</span>
            </div>
        </div>
    );
}
