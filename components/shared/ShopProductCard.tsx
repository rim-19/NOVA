"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import type { StorefrontProduct } from "@/lib/storefront";

type Props = {
  product: StorefrontProduct;
};

export function ShopProductCard({ product }: Props) {
  const { addItem } = useCartStore();
  const [hovered, setHovered] = useState(false);
  const [altImage, setAltImage] = useState(false);
  const [openQuickAdd, setOpenQuickAdd] = useState(false);
  const [size, setSize] = useState(product.sizes?.[0] || "M");
  const [qty, setQty] = useState(1);
  const { isFavorite, toggle } = useFavoriteStore();
  const liked = isFavorite(product.slug);
  const hasTwoImages = (product.images?.length || 0) > 1;

  const displayPrice = useMemo(() => `${product.price.toLocaleString("fr-MA")} MAD`, [product.price]);

  useEffect(() => {
    if (!hasTwoImages) return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;
    const timer = setInterval(() => setAltImage((prev) => !prev), 2600);
    return () => clearInterval(timer);
  }, [hasTwoImages]);

  const showAltImage = hasTwoImages
    ? (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches ? altImage : hovered)
    : false;

  const onQuickAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      image: product.images[0],
      name: product.name,
      price: product.price,
      quantity: qty,
      size,
    });
    setOpenQuickAdd(false);
    setQty(1);
  };

  return (
    <article
      className="group relative rounded-2xl overflow-hidden bg-dark-card/70 shadow-[0_10px_40px_rgba(0,0,0,0.45),0_0_30px_rgba(184,149,106,0.08)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {hasTwoImages && (
            <div className={`absolute inset-0 transition-opacity duration-700 ${showAltImage ? "opacity-100" : "opacity-0"}`}>
              <Image
                src={product.images[1]}
                alt={`${product.name} alt`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-base/80 via-transparent to-transparent" />
        </div>
      </Link>

      <button
        aria-label="Quick add"
        className="absolute right-3 top-3 z-20 rounded-full bg-dark-base/75 p-2 text-gold shadow-[0_0_18px_rgba(184,149,106,0.22)] transition md:opacity-0 md:group-hover:opacity-100"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenQuickAdd((prev) => !prev);
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 7h12l-1 13H7L6 7z" />
          <path d="M9 7a3 3 0 016 0" />
        </svg>
      </button>

      <div className="p-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-[0.52rem] uppercase tracking-[0.33em] text-gold/50">{product.collection}</p>
          <button
            aria-label="Favorite"
            className={`rounded-full p-1.5 transition-colors ${liked ? "text-gold" : "text-cream/55 hover:text-gold"}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product.slug);
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-6.5-4.35-9-8.28C.63 9.03 2.4 4 7 4c2.17 0 3.4 1 5 2.8C13.6 5 14.83 4 17 4c4.6 0 6.37 5.03 4 8.72C18.5 16.65 12 21 12 21z" />
            </svg>
          </button>
        </div>
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="mt-0.5 font-cormorant text-[0.95rem] italic font-bold text-[#b8956a] leading-tight text-left">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-[0.58rem] text-cream/50 line-clamp-1 text-left">{product.poetic_description}</p>
        <p className="mt-1 text-[0.72rem] font-medium text-gold text-left">{displayPrice}</p>
      </div>
      <div className="mx-3 mb-3 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {openQuickAdd && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(184,149,106,0.18),rgba(0,0,0,0.7))] p-4" onClick={() => setOpenQuickAdd(false)}>
          <div
            className="w-full max-w-xs rounded-2xl bg-[linear-gradient(180deg,rgba(57,10,22,0.95),rgba(26,2,2,0.98))] p-4 shadow-[0_30px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(184,149,106,0.24)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[0.55rem] uppercase tracking-[0.28em] text-gold/60">Quick Add</p>
            <h4 className="mt-1 font-cormorant text-lg italic text-cream">{product.name}</h4>

            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((itemSize) => (
                <button
                  key={itemSize}
                  className={`rounded-md px-2 py-1 text-[0.62rem] tracking-widest transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/70 ${
                    size === itemSize
                      ? "bg-gold/25 text-gold shadow-[0_0_12px_rgba(184,149,106,0.35)] scale-[1.03]"
                      : "bg-black/30 text-cream/60 hover:bg-black/45"
                  }`}
                  onClick={() => setSize(itemSize)}
                >
                  {itemSize}
                </button>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`rounded-md px-2 py-1 text-[0.62rem] tracking-wider ${
                    qty === n ? "bg-gold/20 text-gold" : "bg-black/30 text-cream/60"
                  }`}
                  onClick={() => setQty(n)}
                >
                  {n}x
                </button>
              ))}
            </div>

            <button
              className="mt-4 w-full rounded-full bg-burgundy/50 px-3 py-2 text-[0.62rem] uppercase tracking-[0.25em] text-cream"
              onClick={onQuickAdd}
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
