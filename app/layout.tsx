import type { Metadata } from "next";
import "./globals.css";
import { NavbarControl } from "@/components/layout/NavbarControl";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CursorControl } from "@/components/layout/CursorControl";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { PrivateAtelierGate } from "@/components/shared/PrivateAtelierGate";

export const metadata: Metadata = {
  title: "NOVA - Luxury Lingerie",
  description:
    "Desire is not worn. It is felt. Discover NOVA - the luxury lingerie experience.",
  icons: {
    icon: "/new_assets/icon.png?v=3",
    apple: "/new_assets/icon.png?v=3",
    shortcut: "/new_assets/icon.png?v=3",
  },
  keywords: ["luxury lingerie", "haute couture", "intimate wear", "NOVA"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  openGraph: {
    title: "NOVA - Luxury Lingerie",
    description: "Desire is not worn. It is felt.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/new_assets/icon.png?v=3" />
        <link rel="shortcut icon" type="image/png" href="/new_assets/icon.png?v=3" />
        <link rel="apple-touch-icon" href="/new_assets/icon.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@200;300;400&family=MonteCarlo&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <LenisProvider>
          <PromoBanner />
          <CursorControl />
          <NavbarControl />
          <CartDrawer />
          <PrivateAtelierGate />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
