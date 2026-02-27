"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, Order } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

function toCsvValue(value: string | number | null | undefined): string {
  const v = value === null || value === undefined ? "" : String(value);
  return `"${v.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: string[][]) {
  const content = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (!error) fetchOrders();
  }

  async function deleteOrder(id: string) {
    if (!confirm("Remove this entry from the ledger?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (!error) fetchOrders();
  }

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + Number(o.total_price || 0), 0),
    [orders]
  );

  function exportOrdersCsv() {
    const header = [
      "Order Date",
      "Customer Name",
      "Phone Number",
      "City",
      "Delivery Address",
      "Note/Message",
      "Status",
      "Total Price (MAD)",
      "Selection Summary",
    ];

    const rows = orders.map((order) => {
      const items = order.items || [];
      const itemsSummary = items
        .map((item) => `${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ""}`)
        .join(" | ");

      // Format date to readable string
      const orderDate = new Date(order.created_at).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return [
        toCsvValue(orderDate),
        toCsvValue(order.customer_name),
        toCsvValue(`'${order.phone}`), // Prepend apostrophe to prevent Excel from scientific notation
        toCsvValue(order.city),
        toCsvValue(order.address || "N/A"),
        toCsvValue(order.message || "None"),
        toCsvValue(order.status.charAt(0).toUpperCase() + order.status.slice(1)),
        toCsvValue(order.total_price || 0),
        toCsvValue(itemsSummary),
      ];
    });

    downloadCsv(`nova-orders-${new Date().toISOString().slice(0, 10)}.csv`, [header.map(toCsvValue), ...rows]);
  }

  return (
    <div className="space-y-8 md:space-y-12">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-label text-[0.6rem] text-gold/40 tracking-[0.5em] mb-4 uppercase">Leads ledger</p>
          <h1 className="font-cormorant italic text-4xl md:text-6xl text-cream tracking-tight">The Inquiries</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[0.55rem] text-cream/40 uppercase tracking-[0.25em]">Orders</p>
            <p className="text-sm text-gold">{orders.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.55rem] text-cream/40 uppercase tracking-[0.25em]">Revenue</p>
            <p className="text-sm text-gold">{totalRevenue.toLocaleString("fr-MA")} MAD</p>
          </div>
          <button
            onClick={exportOrdersCsv}
            className="btn-luxury px-5 py-2 text-[0.6rem]"
          >
            Export CSV
          </button>
        </div>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order) => {
              const items = order.items || [];
              const total = Number(order.total_price || items.reduce((s, it) => s + it.price * it.quantity, 0));
              return (
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
                        <span
                          className={`text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1 rounded-full ${order.status === "new"
                            ? "bg-gold/20 text-gold"
                            : order.status === "processing"
                              ? "bg-burgundy/40 text-cream/70"
                              : order.status === "completed"
                                ? "bg-green-500/10 text-green-400"
                                : "bg-zinc-700/50 text-zinc-300"
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-cream/40 font-light">
                        {order.phone} · {order.city}
                      </p>
                      <p className="text-[0.6rem] text-cream/30">{new Date(order.created_at).toLocaleString()}</p>
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
                        <option value="cancelled" className="bg-dark-base">Cancelled</option>
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
                      <p className="text-[0.6rem] text-gold/30 tracking-[0.3em] uppercase">Order Items</p>
                      <div className="space-y-3">
                        {items.length > 0 ? (
                          items.map((item, i) => (
                            <div key={`${order.id}-${i}`} className="flex justify-between items-center text-sm">
                              <span className="font-cormorant italic text-cream/80">
                                {item.quantity}x {item.name} {item.size && `(${item.size})`}
                              </span>
                              <span className="text-xs text-cream/30">
                                {(item.price * item.quantity).toLocaleString("fr-MA")} MAD
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-cream/35 italic">No item details on this order.</p>
                        )}
                        <div className="pt-2 flex justify-between border-t border-white/5 font-inter text-xs tracking-widest text-gold uppercase">
                          <span>Total Price</span>
                          <span>{total.toLocaleString("fr-MA")} MAD</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[0.6rem] text-gold/30 tracking-[0.3em] uppercase">Customer Note</p>
                      <p className="text-xs text-cream/40 leading-relaxed font-light italic">
                        {order.message || "No note provided."}
                      </p>
                      <p className="text-xs text-cream/40 leading-relaxed font-light">
                        {order.address || "No address provided."}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

