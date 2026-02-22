"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { supabase, type Product } from "@/lib/supabase";
import {
  findStorefrontProductBySlug,
  storefrontProducts,
  toStorefrontProduct,
  type StorefrontProduct,
} from "@/lib/storefront";
import { ProductCard } from "@/components/shared/ProductCard";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [liked, setLiked] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
        if (!error && data) {
          setProduct(toStorefrontProduct(data as Product));
        } else {
          setProduct(findStorefrontProductBySlug(slug) || storefrontProducts[0]);
        }
      } catch {
        setProduct(findStorefrontProductBySlug(slug) || storefrontProducts[0]);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product || product.images.length < 2) return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (!isTouch) return;
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [product]);

  const onAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    addItem({
      id: product.id,
      slug: product.slug,
      image: product.images[0],
      name: product.name,
      price: product.price,
      quantity: 1,
      size: selectedSize,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const recommendations = useMemo(() => {
    if (!product) return [];
    return storefrontProducts.filter((p) => p.slug !== product.slug && p.product_type === product.product_type).slice(0, 4);
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-base">
        <div className="w-10 h-10 border-t-2 border-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-base px-6">
        <div className="text-center">
          <p className="font-cormorant text-2xl italic text-cream/60">Product not found.</p>
          <Link href="/collection" className="text-label text-gold mt-3 inline-block">Back to Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-10" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                  className="absolute inset-0"
                >
                  <Image src={product.images[activeImage]} alt={product.name} fill priority className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>

            <div className="flex gap-3 overflow-x-auto">
              {product.images.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  className={`relative h-20 w-14 overflow-hidden rounded-lg border ${idx === activeImage ? "border-gold" : "border-white/20"}`}
                >
                  <Image src={img} alt={`${product.name} thumb ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-28">
            <Link href="/collection" className="text-[0.62rem] uppercase tracking-[0.25em] text-gold/60 hover:text-gold">
              Back to all products
            </Link>
            <p className="text-[0.58rem] uppercase tracking-[0.32em] text-gold/50">{product.collection}</p>
            <h1 className="font-cormorant text-4xl md:text-5xl italic font-bold text-[#b8956a] leading-tight">{product.name}</h1>
            <p className="font-montecarlo text-3xl text-gold/80">{product.poetic_description}</p>
            <p className="text-sm leading-7 text-cream/60">{product.description}</p>

            <p className="font-cormorant text-3xl text-gold">{product.price.toLocaleString("fr-MA")} MAD</p>

            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.25em] text-cream/40 mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md border px-3 py-2 text-xs tracking-[0.2em] ${
                      selectedSize === size ? "border-gold text-gold bg-gold/10" : "border-white/20 text-cream/60"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onAddToCart}
                className="flex-1 rounded-full border border-gold/50 bg-burgundy/50 px-4 py-3 text-[0.66rem] uppercase tracking-[0.3em] text-cream"
              >
                {addedToCart ? "Added" : "Add Ritual"}
              </button>
              <button
                aria-label="Favorite product"
                onClick={() => setLiked((prev) => !prev)}
                className={`rounded-full border p-3 ${liked ? "border-gold text-gold" : "border-white/25 text-cream/70"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-6.5-4.35-9-8.28C.63 9.03 2.4 4 7 4c2.17 0 3.4 1 5 2.8C13.6 5 14.83 4 17 4c4.6 0 6.37 5.03 4 8.72C18.5 16.65 12 21 12 21z" />
                </svg>
              </button>
            </div>

            <p className="text-[0.56rem] uppercase tracking-[0.22em] text-cream/35">Hand wash only · discreet delivery</p>
          </div>
        </div>

        <section className="mt-16 border-t border-gold/10 pt-10">
          <h2 className="text-center font-cormorant text-4xl italic text-cream mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((item, idx) => (
              <ProductCard key={item.slug} product={item} index={idx} />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-dark-base/95 px-4 py-3 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <button
            onClick={() => setLiked((prev) => !prev)}
            aria-label="Favorite product"
            className={`rounded-full border p-3 ${liked ? "border-gold text-gold" : "border-white/25 text-cream/70"}`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-6.5-4.35-9-8.28C.63 9.03 2.4 4 7 4c2.17 0 3.4 1 5 2.8C13.6 5 14.83 4 17 4c4.6 0 6.37 5.03 4 8.72C18.5 16.65 12 21 12 21z" />
            </svg>
          </button>
          <button
            onClick={onAddToCart}
            className="flex-1 rounded-full border border-gold/50 bg-burgundy/50 px-4 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-cream"
          >
            {addedToCart ? "Added" : "Add Ritual"}
          </button>
        </div>
      </div>
    </div>
  );
}

