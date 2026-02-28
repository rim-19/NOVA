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
    dailyActivity: Record<string, { count: number, revenue: number, orders: any[] }>;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(new Date().toISOString().split('T')[0]);

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

                const dailyActivity: Record<string, { count: number, revenue: number, orders: any[] }> = {};

                orders.forEach(order => {
                    const day = order.created_at.split('T')[0];
                    if (days[day]) {
                        days[day].revenue += (order.total_price || 0);
                        days[day].orders += 1;
                    }

                    if (!dailyActivity[day]) {
                        dailyActivity[day] = { count: 0, revenue: 0, orders: [] };
                    }
                    dailyActivity[day].count += 1;
                    dailyActivity[day].revenue += (order.total_price || 0);
                    dailyActivity[day].orders.push(order);
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

    const selectedDayData = selectedDay && stats?.dailyActivity[selectedDay] ? stats.dailyActivity[selectedDay] : null;

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
                        <svg className="absolute inset-0 w-full h-full p-6 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="mainGraphGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#B8956A" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#B8956A" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <motion.path
                                d={createSmoothPath(stats.revenueTrend)}
                                fill="none"
                                stroke="#B8956A"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                            />
                            <motion.path
                                d={`${createSmoothPath(stats.revenueTrend)} L 100 100 L 0 100 Z`}
                                fill="url(#mainGraphGradient)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 1 }}
                            />
                        </svg>

                        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-6 text-[0.5rem] text-cream/15 uppercase tracking-[0.2em] font-medium">
                            <span>Beginning</span>
                            <span>Midway</span>
                            <span>Today</span>
                        </div>
                    </div>
                </div>

                {/* Day Mirror Panel (Daily achievement) */}
                <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col relative overflow-hidden bg-gradient-to-b from-[#1A0202] to-transparent">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="text-[0.5rem] text-gold/20 uppercase tracking-[0.3em]">Day Mirror</div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedDay}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col h-full"
                        >
                            <h3 className="font-cormorant italic text-3xl text-cream mb-1">
                                {selectedDay ? new Date(selectedDay).toLocaleDateString('default', { day: 'numeric', month: 'long' }) : "Select a date"}
                            </h3>
                            <p className="text-[0.6rem] text-gold/50 uppercase tracking-[0.2em] mb-8 font-medium">Daily Achievement</p>

                            {selectedDayData ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[0.5rem] text-cream/30 uppercase tracking-widest mb-1">Revenue</p>
                                            <p className="text-xl font-light text-gold">{selectedDayData.revenue.toLocaleString()} <span className="text-[0.6rem]">MAD</span></p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <p className="text-[0.5rem] text-cream/30 uppercase tracking-widest mb-1">Inquiries</p>
                                            <p className="text-xl font-light text-cream">{selectedDayData.count}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[0.55rem] text-gold/40 uppercase tracking-[0.2em] mb-4">Latest Leads</p>
                                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                                            {selectedDayData.orders.slice(0, 3).map((order: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.65rem] text-cream/80">{order.customer_name || "Private Client"}</span>
                                                        <span className="text-[0.5rem] text-cream/20 uppercase">#{order.id.slice(0, 8)}</span>
                                                    </div>
                                                    <span className="text-[0.6rem] text-gold/60">{order.total_price} MAD</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Link href={`/atelier-admin/orders?date=${selectedDay}`} className="mt-6 block text-center py-3 rounded-full border border-gold/20 text-[0.6rem] text-gold uppercase tracking-[0.3em] hover:bg-gold/5 transition-colors">
                                            View Full Ledger
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 text-center opacity-30 mt-10">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="mb-4"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
                                    <p className="text-[0.6rem] uppercase tracking-widest">Quiet Period</p>
                                    <p className="text-[0.5rem] leading-loose mt-2 italic px-4">No records found for this specific sunset.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Interactive Calendar View */}
            <div className="glass-card p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="font-cormorant italic text-3xl text-cream leading-tight">Activity Log</h3>
                                <p className="text-[0.55rem] text-gold/40 uppercase tracking-widest">Chronological Records</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-gold hover:bg-white/5 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                                </button>
                                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-gold hover:bg-white/5 transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                                </button>
                            </div>
                        </div>

                        <p className="text-[0.7rem] text-gold/70 uppercase tracking-[0.3em] mb-8 font-inter font-medium">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>

                        <div className="grid grid-cols-7 gap-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <div key={d} className="text-[0.6rem] text-white/10 font-bold mb-4 flex items-center justify-center uppercase tracking-widest">{d}</div>
                            ))}
                            {calendarData.map((date, idx) => {
                                if (!date) return <div key={idx} />;
                                const dayStr = date.toISOString().split('T')[0];
                                const dayData = stats.dailyActivity[dayStr];
                                const ordersCount = dayData?.count || 0;
                                const isToday = dayStr === new Date().toISOString().split('T')[0];
                                const isSelected = selectedDay === dayStr;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDay(dayStr)}
                                        className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-500 border group/day ${isSelected
                                                ? 'bg-gold/15 border-gold shadow-[0_0_30px_rgba(184,149,106,0.25)]'
                                                : isToday
                                                    ? 'bg-white/5 border-white/20'
                                                    : 'bg-black/20 border-white/[0.03] hover:border-gold/30 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className={`text-base font-inter ${isSelected ? 'text-gold font-bold scale-110' : ordersCount > 0 ? 'text-cream/80 font-medium' : 'text-cream/20'}`}>
                                            {date.getDate()}
                                        </span>
                                        {ordersCount > 0 && (
                                            <div className={`w-1 h-1 rounded-full mt-1.5 shadow-[0_0_8px_#B8956A] transition-all duration-500 ${isSelected ? 'bg-gold animate-bounce scale-150' : 'bg-gold/40'}`} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full md:w-64 pt-6 md:pt-20">
                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-[#B8956A]/05 to-transparent">
                                <h4 className="text-[0.6rem] text-gold/40 uppercase tracking-widest mb-4">Legend</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-gold" />
                                        <span className="text-[0.55rem] text-cream/60 uppercase tracking-widest">Order Logged</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-lg border border-gold/30 bg-gold/10" />
                                        <span className="text-[0.55rem] text-cream/60 uppercase tracking-widest">Active Date</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-lg border border-white/20 bg-white/5" />
                                        <span className="text-[0.55rem] text-cream/60 uppercase tracking-widest">Today</span>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d={createSmoothPath(trend)}
                            fill="none"
                            stroke={color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </svg>
                </div>
            </div>

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
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold group-hover:w-full transition-all duration-700" />
        </Link>
    );
}

// Utility to create a smooth SVG path from data points mapping to 0-100 range
function createSmoothPath(data: number[]) {
    if (data.length === 0) return "M 0 100";
    const max = Math.max(...data, 1);
    const step = 100 / Math.max(data.length - 1, 1);

    return data.map((val, i) => {
        const x = i * step;
        const y = 90 - (val / max) * 80;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
}
