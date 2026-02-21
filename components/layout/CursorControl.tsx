"use client";

import { usePathname } from "next/navigation";
import { CustomCursor } from "./CustomCursor";

export function CursorControl() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/atelier-admin");

    if (isAdmin) return null;

    return <CustomCursor />;
}
