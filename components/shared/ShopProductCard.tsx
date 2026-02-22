"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
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
  const [liked, setLiked] = useState(false);
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
      className="group relative rounded-2xl overflow-hidden border border-gold/10 bg-dark-card/70"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setOpenQuickAdd(false);
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
        aria-label="Favorite"
        className={`absolute right-3 top-3 z-20 rounded-full border px-2 py-2 transition-colors ${
          liked
            ? "border-gold bg-gold/20 text-gold"
            : "border-white/20 bg-black/30 text-white/70 hover:border-gold/60 hover:text-gold"
        }`}
        onClick={() => setLiked((prev) => !prev)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M12 21s-6.5-4.35-9-8.28C.63 9.03 2.4 4 7 4c2.17 0 3.4 1 5 2.8C13.6 5 14.83 4 17 4c4.6 0 6.37 5.03 4 8.72C18.5 16.65 12 21 12 21z" />
        </svg>
      </button>

      <button
        aria-label="Quick add"
        className={`absolute right-3 bottom-20 z-20 rounded-full border border-gold/50 bg-dark-base/80 p-2 text-gold transition md:opacity-0 md:group-hover:opacity-100 ${
          openQuickAdd ? "opacity-100" : "opacity-100"
        }`}
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

      <div className="p-4">
        <p className="text-[0.58rem] uppercase tracking-[0.35em] text-gold/50">{product.collection}</p>
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="mt-1 font-cormorant text-xl italic font-bold text-[#b8956a] leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-[0.72rem] text-cream/50 line-clamp-2">{product.poetic_description}</p>
        <p className="mt-2 text-sm font-medium text-gold">{displayPrice}</p>
      </div>

      <div
        className={`absolute inset-x-3 bottom-3 z-30 rounded-xl border border-gold/20 bg-dark-base/95 p-3 transition-all ${
          openQuickAdd ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="mb-2 flex flex-wrap gap-2">
          {product.sizes.map((itemSize) => (
            <button
              key={itemSize}
              className={`rounded-md border px-2 py-1 text-[0.62rem] tracking-widest ${
                size === itemSize ? "border-gold text-gold" : "border-white/20 text-cream/60"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSize(itemSize);
              }}
            >
              {itemSize}
            </button>
          ))}
        </div>

        <div className="mb-3 flex gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              className={`rounded-md border px-2 py-1 text-[0.62rem] tracking-wider ${
                qty === n ? "border-gold text-gold" : "border-white/20 text-cream/60"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQty(n);
              }}
            >
              {n}x
            </button>
          ))}
        </div>

        <button
          className="w-full rounded-full border border-gold/50 bg-burgundy/40 px-3 py-2 text-[0.62rem] uppercase tracking-[0.25em] text-cream"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickAdd();
          }}
        >
          Add To Cart
        </button>
      </div>
    </article>
  );
}
