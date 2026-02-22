"use client";

import Link from "next/link";

const socialLinks = [
  {
    id: "instagram",
    href: "https://www.instagram.com/novalingerieby?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "facebook",
    href: "https://www.facebook.com",
    label: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 8h3V4h-3c-2.2 0-4 1.8-4 4v3H8v4h3v5h4v-5h3l1-4h-4V8a1 1 0 011-1z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    href: "https://www.tiktok.com",
    label: "TikTok",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 3v10a3 3 0 11-3-3" />
        <path d="M14 3c1 2 2.5 3 5 3" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-gold/15 bg-dark-card/30 px-6 py-14 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-10">
          <p className="font-montecarlo text-5xl text-cream/90">NOVA</p>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="rounded-full border border-gold/30 p-3 text-gold/80 transition-colors hover:border-gold hover:text-gold-light"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <div className="grid w-full max-w-xl grid-cols-1 gap-6 text-center md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-label text-gold/60">Get Help</p>
              <Link href="/contact" className="block text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-gold">
                Contact Us
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-label text-gold/60">Company</p>
              <Link href="/about" className="block text-sm uppercase tracking-[0.2em] text-cream/70 hover:text-gold">
                About Me
              </Link>
            </div>
          </div>

          <p className="text-center font-cormorant text-xl italic text-cream/60">
            Desire is not a costume. It is the way you arrive.
          </p>
        </div>
      </div>
    </footer>
  );
}

