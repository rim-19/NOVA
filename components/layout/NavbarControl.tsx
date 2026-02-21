"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export function NavbarControl() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/atelier-admin");

    if (isAdmin) return null;

    return <Navbar />;
}
