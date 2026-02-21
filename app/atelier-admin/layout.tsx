"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user && pathname !== "/atelier-admin/login") {
                router.push("/atelier-admin/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user && pathname !== "/atelier-admin/login") {
                router.push("/atelier-admin/login");
            }
        });

        return () => subscription.unsubscribe();
    }, [router, pathname]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-base">
            <div className="w-12 h-12 border-2 border-gold/10 border-t-gold rounded-full animate-spin" />
        </div>
    );

    if (!user && pathname !== "/atelier-admin/login") return null;
    if (pathname === "/atelier-admin/login") return <>{children}</>;

    return (
        <div className="min-h-screen flex bg-zinc-950 text-zinc-100 selection:bg-gold/30">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-900/50 backdrop-blur-md h-screen sticky top-0">
                <div className="p-10 border-b border-zinc-800">
                    <Link href="/atelier-admin" className="block">
                        <h1 className="font-montecarlo text-4xl text-zinc-100">Nova</h1>
                        <p className="text-[0.5rem] text-gold/40 tracking-[0.4em] mt-1 uppercase">Backoffice</p>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <AdminNavLink href="/atelier-admin" label="Dashboard" active={pathname === "/atelier-admin"} />
                    <AdminNavLink href="/atelier-admin/products" label="Inventory" active={pathname.startsWith("/atelier-admin/products")} />
                    <AdminNavLink href="/atelier-admin/collections" label="Collections" active={pathname.startsWith("/atelier-admin/collections")} />
                    <AdminNavLink href="/atelier-admin/orders" label="Orders" active={pathname.startsWith("/atelier-admin/orders")} />
                    <AdminNavLink href="/atelier-admin/narrative" label="Narrative" active={pathname.startsWith("/atelier-admin/narrative")} />
                </nav>

                <div className="p-6 border-t border-zinc-800">
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="w-full text-left px-4 py-2 text-[0.6rem] text-zinc-500 hover:text-zinc-100 tracking-[0.2em] uppercase transition-colors"
                    >
                        Log Out
                    </button>
                    {user && (
                        <div className="mt-4 px-4 overflow-hidden">
                            <p className="text-[0.5rem] text-zinc-600 truncate">{user.email}</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function AdminNavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${active
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                }`}
        >
            <span className={`text-[0.7rem] tracking-wider uppercase font-medium`}>
                {label}
            </span>
            {active && (
                <div className="ml-auto w-1 h-1 rounded-full bg-gold" />
            )}
        </Link>
    );
}
