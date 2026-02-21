"use client";

import { useEffect, useState } from "react";
import { supabase, Order } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersAdminPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setOrders(data as any);
        setLoading(false);
    }

    async function updateStatus(id: string, newStatus: string) {
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", id);
        if (!error) fetchOrders();
    }

    async function deleteOrder(id: string) {
        if (!confirm("Remove this entry from the ledger?")) return;
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (!error) fetchOrders();
    }

    return (
        <div className="space-y-8 md:space-y-12">
            <header>
                <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Leads ledger</p>
                <h1 className="font-cormorant italic text-4xl md:text-6xl text-cream tracking-tight">The Inquiries</h1>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence>
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-4 md:p-8 rounded-3xl border border-white/5 space-y-6"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-cormorant italic text-2xl text-cream">{order.customer_name}</h3>
                                            <span className={`text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1 rounded-full ${order.status === 'new' ? 'bg-gold/20 text-gold' :
                                                    order.status === 'processing' ? 'bg-burgundy/40 text-cream/70' :
                                                        'bg-green-500/10 text-green-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-cream/40 font-light">{order.phone} • {order.city}</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2 text-[0.6rem] md:text-[0.65rem] tracking-widest uppercase text-gold/60 outline-none focus:border-gold/30 cursor-pointer"
                                        >
                                            <option value="new" className="bg-dark-base">New</option>
                                            <option value="processing" className="bg-dark-base">Processing</option>
                                            <option value="completed" className="bg-dark-base">Completed</option>
                                        </select>
                                        <button
                                            onClick={() => deleteOrder(order.id)}
                                            className="p-2.5 text-cream/20 hover:text-red-500 bg-white/5 rounded-xl transition-all"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-6 border-t border-white/5">
                                    <div className="space-y-4">
                                        <p className="text-[0.6rem] text-gold/30 tracking-[0.3em] uppercase">Selection</p>
                                        <div className="space-y-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center text-sm">
                                                    <span className="font-cormorant italic text-cream/80">{item.quantity}x {item.name} {item.size && `(${item.size})`}</span>
                                                    <span className="text-xs text-cream/30">{item.price.toLocaleString()} MAD</span>
                                                </div>
                                            ))}
                                            <div className="pt-2 flex justify-between border-t border-white/5 font-inter text-xs tracking-widest text-gold uppercase">
                                                <span>Total Price</span>
                                                <span>{order.total_price?.toLocaleString() || '0'} MAD</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[0.6rem] text-gold/30 tracking-[0.3em] uppercase">Private Intent</p>
                                        <p className="text-xs text-cream/40 leading-relaxed font-light italic">
                                            {order.address || "No specific address provided."}
                                        </p>
                                        <div className="pt-4">
                                            <a
                                                href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                className="btn-luxury px-6 py-2 text-[0.6rem] inline-block"
                                            >
                                                Start WhatsApp Dialogue
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && orders.length === 0 && (
                <div className="text-center py-40">
                    <p className="font-montecarlo text-4xl text-cream/10">The ledger is silent.</p>
                </div>
            )}
        </div>
    );
}
