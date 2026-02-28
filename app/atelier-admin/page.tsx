"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type DashboardStats = {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    activeProducts: number;
    salesData: { day: string; amount: number }[];
    dailyActivity: Record<string, number>;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    supabase.from("products").select("id", { count: "exact" }).eq("is_visible", true),
                    supabase.from("orders").select("*").order("created_at", { ascending: true })
                ]);

                const orders = ordersRes.data || [];
                const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
                const totalOrders = orders.length;
                const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                // Process sales data for graph (last 30 days)
                const last30Days: Record<string, number> = {};
                const now = new Date();
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    last30Days[d.toISOString().split('T')[0]] = 0;
                }

                const dailyActivity: Record<string, number> = {};

                orders.forEach(order => {
                    const day = order.created_at.split('T')[0];
                    if (last30Days[day] !== undefined) {
                        last30Days[day] += (order.total_price || 0);
                    }
                    dailyActivity[day] = (dailyActivity[day] || 0) + 1;
                });

                const salesData = Object.entries(last30Days).map(([day, amount]) => ({
                    day: day.split('-').slice(1).join('/'),
                    amount
                }));

                setStats({
                    totalRevenue,
                    totalOrders,
                    avgOrderValue,
                    activeProducts: productsRes.count || 0,
                    salesData,
                    dailyActivity
                });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    const calendarData = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        // Padding for start of month
        for (let i = 0; i < firstDay; i++) days.push(null);
        // Days of month
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

        return days;
    }, [currentMonth]);

    if (loading) return (
        <div className="space-y-12 animate-pulse">
            <div className="h-16 w-1/3 bg-white/5 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl" />)}
            </div>
            <div className="h-64 bg-white/5 rounded-3xl" />
        </div>
    );

    if (!stats) return null;

    return (
        <div className="space-y-8 md:space-y-12 pb-20">
            <header>
                <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Royal Directives</p>
                <h1 className="font-cormorant italic text-4xl md:text-6xl text-cream tracking-tight">Atelier Control</h1>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="Total Revenue" value={`${stats.totalRevenue.toLocaleString()} MAD`} sub="Lifetime sales" />
                <MetricCard label="Inquiries" value={stats.totalOrders} sub="Total leads processed" />
                <MetricCard label="Average Basket" value={`${Math.round(stats.avgOrderValue).toLocaleString()} MAD`} sub="Per inquiry" />
                <MetricCard label="Active Pieces" value={stats.activeProducts} sub="Live in catalog" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Graph */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-cormorant italic text-2xl text-cream">Revenue Flow</h3>
                        <p className="text-[0.55rem] text-gold/40 uppercase tracking-widest text-right">Last 30 Days</p>
                    </div>

                    <div className="h-64 relative flex items-end justify-between px-2">
                        {/* Simple SVG Line Chart */}
                        <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#B8956A" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#B8956A" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d={createSmoothPath(stats.salesData.map(d => d.amount), 100, 250)}
                                fill="none"
                                stroke="#B8956A"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.path
                                d={`${createSmoothPath(stats.salesData.map(d => d.amount), 100, 250)} L 100% 100% L 0% 100% Z`}
                                fill="url(#lineGradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                            />
                        </svg>

                        {/* Chart X-Axis markers */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[0.5rem] text-cream/20 uppercase tracking-tighter">
                            <span>Day 1</span>
                            <span>Day 15</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Calendar View */}
                <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-cormorant italic text-2xl text-cream">Ledger Log</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 text-gold hover:text-white transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 text-gold hover:text-white transition-colors">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>

                    <p className="text-[0.6rem] text-gold/40 uppercase tracking-[0.2em] mb-4 text-center">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <span key={d} className="text-[0.5rem] text-white/20 font-bold mb-2">{d}</span>
                        ))}
                        {calendarData.map((date, idx) => {
                            if (!date) return <div key={idx} />;
                            const dayStr = date.toISOString().split('T')[0];
                            const ordersCount = stats.dailyActivity[dayStr] || 0;
                            return (
                                <div key={idx} className="relative aspect-square flex items-center justify-center group">
                                    <span className={`text-[0.6rem] transition-colors ${ordersCount > 0 ? 'text-gold font-bold' : 'text-cream/30'}`}>
                                        {date.getDate()}
                                    </span>
                                    {ordersCount > 0 && (
                                        <div className="absolute bottom-1 w-1 h-1 bg-gold rounded-full shadow-[0_0_8px_#B8956A]" />
                                    )}
                                    {ordersCount > 0 && (
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-dark-base text-[0.5rem] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                                            {ordersCount} Inquiries
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Action Shortcuts */}
            <div className="flex flex-wrap gap-4 pt-4">
                <ShortcutLink href="/atelier-admin/orders" label="Process Inquiries" icon="ledger" />
                <ShortcutLink href="/atelier-admin/products" label="Curation" icon="pieces" />
                <ShortcutLink href="/atelier-admin/narrative" label="Edit Narrative" icon="story" />
            </div>
        </div>
    );
}

function MetricCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl border border-white/5 group hover:border-gold/30 transition-all duration-700 bg-gradient-to-br from-white/[0.03] to-transparent"
        >
            <p className="text-[0.55rem] text-gold/40 tracking-[0.4em] uppercase mb-4">{label}</p>
            <h4 className="text-3xl font-inter font-light text-cream group-hover:text-gold transition-colors mb-2">{value}</h4>
            <p className="text-[0.5rem] text-cream/20 uppercase tracking-widest">{sub}</p>
        </motion.div>
    );
}

function ShortcutLink({ href, label, icon }: { href: string; label: string; icon: string }) {
    return (
        <Link href={href} className="glass-card px-6 py-4 rounded-full border border-white/5 hover:border-gold/50 transition-all duration-500 flex items-center gap-3 group">
            <div className="w-2 h-2 rounded-full bg-gold/50 group-hover:bg-gold animate-pulse" />
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-cream/60 group-hover:text-cream">{label}</span>
        </Link>
    );
}

// Utility to create a smooth SVG path from data points
function createSmoothPath(data: number[], width: number, height: number) {
    if (data.length === 0) return "M 0 0";
    const max = Math.max(...data, 1000);
    const step = 100 / (data.length - 1);

    return data.map((val, i) => {
        const x = i * step;
        const y = 90 - (val / max) * 80; // 10% padding
        return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
    }).join(' ');
}
