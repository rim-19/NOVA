"use client";

import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "212781563070";

export function WhatsAppIcon() {
    const pathname = usePathname();
    const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;
    
    // Hide WhatsApp icon on homepage only
    if (pathname === "/") {
        return null;
    }
    
    return (
        <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-5 right-4 z-[90] flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/90 text-white shadow-[0_8px_22px_rgba(0,0,0,0.35),0_0_16px_rgba(37,211,102,0.3)] transition-transform hover:scale-105"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.5 3.5A11 11 0 003 18.9L2 23l4.3-1.1A11 11 0 1020.5 3.5zm-8.5 18c-1.8 0-3.5-.5-5-1.4l-.4-.2-2.5.7.7-2.4-.2-.4A8.9 8.9 0 0112 21.5zm4.9-6.7c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1-.2.2-.3.2-.6.1a7.2 7.2 0 01-3.6-3.1c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-1 1-.9 2.3.1 1.4 1 2.7 1.1 2.9.1.2 2 3.1 5 4.3.7.3 1.3.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.1-1.4-.1-.2-.3-.3-.6-.4z" />
            </svg>
        </a>
    );
}
