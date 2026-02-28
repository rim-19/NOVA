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
    revenueTrend: number[];
    ordersTrend: number[];
    avgTrend: number[];
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

                // Process data for sparklines & main graph (last 30 days)
                const now = new Date();
                const days: Record<string, { revenue: number, orders: number }> = {};
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    days[d.toISOString().split('T')[0]] = { revenue: 0, orders: 0 };
                }

                const dailyActivity: Record<string, number> = {};

                orders.forEach(order => {
                    const day = order.created_at.split('T')[0];
                    if (days[day]) {
                        days[day].revenue += (order.total_price || 0);
                        days[day].orders += 1;
                    }
                    dailyActivity[day] = (dailyActivity[day] || 0) + 1;
                });

                const salesData = Object.entries(days).map(([day, d]) => ({
                    day: day.split('-').slice(1).join('/'),
                    amount: d.revenue
                }));

                const revenueTrend = Object.values(days).map(d => d.revenue);
                const ordersTrend = Object.values(days).map(d => d.orders);
                const avgTrend = Object.values(days).map(d => d.orders > 0 ? d.revenue / d.orders : 0);

                setStats({
                    totalRevenue,
                    totalOrders,
                    avgOrderValue,
                    activeProducts: productsRes.count || 0,
                    salesData,
                    revenueTrend,
                    ordersTrend,
                    avgTrend,
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

        const daysGroup = [];
        for (let i = 0; i < firstDay; i++) daysGroup.push(null);
        for (let i = 1; i <= daysInMonth; i++) daysGroup.push(new Date(year, month, i));

        return daysGroup;
    }, [currentMonth]);

    if (loading) return (
        <div className="space-y-12 animate-pulse pr-4 md:pr-0">
            <div className="h-16 w-1/3 bg-white/5 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl" />)}
            </div>
            <div className="h-80 bg-white/5 rounded-3xl" />
        </div>
    );

    if (!stats) return null;

    return (
        <div className="space-y-8 md:space-y-12 pb-20 pr-4 md:pr-0">
            <header className="relative">
                <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Royal Directives</p>
                <h1 className="font-cormorant italic text-4xl md:text-6xl text-cream tracking-tight">Atelier Control</h1>
                <div className="absolute top-0 right-0 hidden md:block">
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
                        <span className="text-[0.6rem] text-cream/40 uppercase tracking-[0.2em]">Real-time Systems Active</span>
                    </div>
                </div>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Total Revenue"
                    value={`${stats.totalRevenue.toLocaleString()} MAD`}
                    sub="Lifetime sales"
                    trend={stats.revenueTrend}
                    color="#B8956A"
                />
                <MetricCard
                    label="Inquiries"
                    value={stats.totalOrders}
                    sub="Total leads processed"
                    trend={stats.ordersTrend}
                    color="#7D1736"
                />
                <MetricCard
                    label="Average Basket"
                    value={`${Math.round(stats.avgOrderValue).toLocaleString()} MAD`}
                    sub="Per inquiry value"
                    trend={stats.avgTrend}
                    color="#D4AF37"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-[#7D1736]/10 to-transparent flex flex-col justify-between"
                >
                    <div>
                        <p className="text-[0.55rem] text-gold/40 tracking-[0.4em] uppercase mb-4">Active Pieces</p>
                        <h4 className="text-3xl font-inter font-light text-cream mb-2">{stats.activeProducts}</h4>
                    </div>
                    <Link href="/atelier-admin/products" className="text-[0.55rem] text-gold hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 mt-4 self-start group">
                        Manage Catalog
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Graph */}
                <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="font-cormorant italic text-2xl text-cream leading-tight">Revenue Flow</h3>
                            <p className="text-[0.55rem] text-gold/40 uppercase tracking-widest">30-Day Trajectory</p>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <p className="text-[0.6rem] text-cream/40 font-inter uppercase tracking-tighter">Peak: {Math.max(...stats.revenueTrend).toLocaleString()} MAD</p>
                        </div>
                    </div>

                    <div className="h-72 relative flex items-end justify-between px-2 pt-10">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,149,106,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                        <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="mainGraphGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#B8956A" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#B8956A" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d={createSmoothPath(stats.salesData.map(d => d.amount), 100, 250)}
                                fill="none"
                                stroke="#B8956A"
                                strokeWidth="2.5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                            />
                            <motion.path
                                d={`${createSmoothPath(stats.salesData.map(d => d.amount), 100, 250)} L 100% 100% L 0% 100% Z`}
                                fill="url(#mainGraphGradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 1 }}
                            />
                        </svg>

                        {/* Chart X-Axis markers */}
                        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-6 text-[0.5rem] text-cream/15 uppercase tracking-[0.2em] font-medium">
                            <span>Beginning</span>
                            <span>Midway</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Calendar View */}
                <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-full group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B8956A]/05 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="font-cormorant italic text-2xl text-cream">Activity Log</h3>
                        <div className="flex gap-1.5">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gold hover:bg-white/5 hover:text-white transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-gold hover:bg-white/5 hover:text-white transition-all">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>
                    </div>

                    <p className="text-[0.65rem] text-gold/60 uppercase tracking-[0.25em] mb-6 text-center font-inter font-medium relative z-10">
                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>

                    <div className="grid grid-cols-7 gap-1 flex-1 relative z-10">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                            <div key={d} className="text-[0.55rem] text-white/10 font-bold mb-3 flex items-center justify-center uppercase">{d}</div>
                        ))}
                        {calendarData.map((date, idx) => {
                            if (!date) return <div key={idx} />;
                            const dayStr = date.toISOString().split('T')[0];
                            const ordersCount = stats.dailyActivity[dayStr] || 0;
                            const isToday = dayStr === new Date().toISOString().split('T')[0];

                            return (
                                <Link
                                    key={idx}
                                    href={ordersCount > 0 ? `/atelier-admin/orders?date=${dayStr}` : "#"}
                                    onClick={(e) => ordersCount === 0 && e.preventDefault()}
                                    className={`relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${ordersCount > 0
                                            ? 'cursor-pointer hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(184,149,106,0.15)] group/day'
                                            : 'cursor-default pointer-events-none'
                                        } ${isToday ? 'bg-white/5 border border-white/10' : ''}`}
                                >
                                    <span className={`text-[0.65rem] font-inter ${ordersCount > 0 ? 'text-gold font-bold scale-110' : 'text-cream/20'}`}>
                                        {date.getDate()}
                                    </span>
                                    {ordersCount > 0 && (
                                        <>
                                            <div className="w-1 h-1 bg-gold rounded-full mt-1 group-hover/day:scale-150 transition-transform shadow-[0_0_10px_#B8956A]" />
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A0202] border border-gold/30 text-gold text-[0.55rem] px-2.5 py-1.5 rounded-lg opacity-0 group-hover/day:opacity-100 transition-all scale-95 group-hover/day:scale-100 whitespace-nowrap z-50 pointer-events-none shadow-luxury">
                                                <span className="font-bold">{ordersCount}</span> Inquiries
                                            </div>
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Action Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <ShortcutLink href="/atelier-admin/orders" label="Process Inquiries" desc="Manage incoming client requests" />
                <ShortcutLink href="/atelier-admin/products" label="Curation Master" desc="Update artifacts in the catalog" />
                <ShortcutLink href="/atelier-admin/narrative" label="Brand Narrative" desc="Refine story and aesthetics" />
            </div>
        </div>
    );
}

function MetricCard({ label, value, sub, trend, color }: { label: string; value: string | number; sub: string; trend: number[]; color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 group hover:border-gold/30 transition-all duration-700 bg-gradient-to-br from-white/[0.04] to-transparent shadow-xl relative overflow-hidden"
        >
            <div className="relative z-10 flex flex-col h-full">
                <p className="text-[0.55rem] text-gold/40 tracking-[0.4em] uppercase mb-4">{label}</p>
                <h4 className="text-3xl font-inter font-light text-cream group-hover:text-gold transition-colors mb-2">{value}</h4>
                <p className="text-[0.5rem] text-cream/20 uppercase tracking-widest mb-6">{sub}</p>

                {/* Mini Sparkline */}
                <div className="h-10 w-full mt-auto relative pt-2">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <motion.path
                            d={createSmoothPath(trend, 100, 40)}
                            fill="none"
                            stroke={color}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </svg>
                </div>
            </div>

            {/* Subtle Inner Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gold/05 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </motion.div>
    );
}

function ShortcutLink({ href, label, desc }: { href: string; label: string; desc: string }) {
    return (
        <Link href={href} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-gold/40 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-cream"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
            </div>
            <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/80 group-hover:text-gold transition-colors">{label}</span>
                <span className="text-[0.55rem] uppercase tracking-widest text-cream/20 font-light">{desc}</span>
            </div>
            {/* Hover bar */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-700" />
        </Link>
    );
}

// Utility to create a smooth SVG path from data points
function createSmoothPath(data: number[], width: number, height: number) {
    if (data.length === 0) return "M 0 0";
    const max = Math.max(...data, 1);
    const step = 100 / Math.max(data.length - 1, 1);

    return data.map((val, i) => {
        const x = i * step;
        const y = 90 - (val / max) * 80; // 10% padding
        return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
    }).join(' ');
}
