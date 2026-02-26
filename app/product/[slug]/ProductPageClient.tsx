"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useFavoriteStore } from "@/store/useFavoriteStore";
import { supabase, type Product } from "@/lib/supabase";
import {
  findStorefrontProductBySlug,
  storefrontProducts,
  toStorefrontProduct,
  type StorefrontProduct,
} from "@/lib/storefront";
import { ShopProductCard } from "@/components/shared/ShopProductCard";

interface ProductPageClientProps {
  slug: string;
}

export default function ProductPageClient({ slug }: ProductPageClientProps) {
  console.log('🔍 ProductPageClient received slug:', slug);
  
  // Early return if slug is invalid
  if (!slug) {
    console.log('❌ Slug is undefined or null');
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-base px-6">
        <div className="text-center">
          <p className="font-cormorant text-2xl italic text-cream/60">Invalid product URL.</p>
          <Link href="/collection" className="text-label text-gold mt-3 inline-block">Back to Collection</Link>
        </div>
      </div>
    );
  }
  
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [liveProducts, setLiveProducts] = useState<StorefrontProduct[]>([]);
  const { addItem, getTotalPrice, openCart, toggleCart } = useCartStore();
  const { isFavorite, toggle } = useFavoriteStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageDragWidth, setImageDragWidth] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});
  const imageTrackRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const recTrackRef = useRef<HTMLDivElement>(null);
  const recWrapRef = useRef<HTMLDivElement>(null);
  const [recWidth, setRecWidth] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      console.log('🔍 Fetching product for slug:', slug);
      
      try {
        const [oneRes, allRes] = await Promise.all([
          supabase.from("products").select("*").eq("slug", slug).single(),
          supabase.from("products").select("*").eq("is_visible", true),
        ]);

        console.log('📦 Single product result:', { data: oneRes.data, error: oneRes.error });
        console.log('📦 All products result:', { data: allRes.data?.length, error: allRes.error });

        if (!allRes.error && allRes.data) {
          setLiveProducts(allRes.data.map((item, index) => toStorefrontProduct(item as Product, index)));
          console.log('✅ Live products set:', allRes.data.length);
        }

        const { data, error } = oneRes;
        if (!error && data) {
          console.log('✅ Product found in database:', data.name);
          setProduct(toStorefrontProduct(data as Product));
        } else {
          console.log('❌ Database query failed, trying catalog...');
          // Database query failed, try catalog products first
          const foundProduct = findStorefrontProductBySlug(slug);
          if (foundProduct) {
            console.log('✅ Product found in catalog:', foundProduct.name);
            setProduct(foundProduct);
          } else {
            console.log('❌ Product not found anywhere');
            // Product not found in catalog either - show 404
            setProduct(null);
          }
        }
      } catch (error) {
        console.log('💥 Error in fetchProduct:', error);
        // Try catalog products first when there's an error
        const foundProduct = findStorefrontProductBySlug(slug);
        if (foundProduct) {
          console.log('✅ Product found in catalog after error:', foundProduct.name);
          setProduct(foundProduct);
        } else {
          console.log('❌ Product not found anywhere after error');
          // Product not found - show 404
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const recommendations = useMemo(() => {
    if (!product) return [];
    return liveProducts.filter((p) => p.slug !== product.slug && p.collection_slug === product.collection_slug).slice(0, 5);
  }, [product, liveProducts]);

  // Detect image dimensions - use actual image ratios
  useEffect(() => {
    if (!product?.images) return;

    const detectDimensions = async () => {
      const dimensions: { [key: string]: { width: number; height: number } } = {};
      
      for (const imgSrc of product.images) {
        try {
          console.log('🔍 Detecting dimensions for:', imgSrc);
          // Create a new image element to get dimensions
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous'; // Add this for Supabase URLs
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Image load timeout')), 5000);
          });
          
          await Promise.race([
            new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = imgSrc;
            }),
            timeoutPromise
          ]);
          
          dimensions[imgSrc] = { width: img.naturalWidth, height: img.naturalHeight };
          console.log('✅ Detected dimensions:', imgSrc, dimensions[imgSrc]);
        } catch (error) {
          console.log('❌ Error detecting dimensions for:', imgSrc, error);
          // Fallback to 3:4 ratio if image fails to load
          dimensions[imgSrc] = { width: 3, height: 4 };
        }
      }
      
      console.log('📦 Final dimensions object:', dimensions);
      setImageDimensions(dimensions);
    };

    detectDimensions();
  }, [product?.images]);

  const getAspectRatio = (imgSrc: string) => {
    const dim = imageDimensions[imgSrc];
    console.log('🔍 Getting aspect ratio for:', imgSrc, 'dimensions:', dim);
    if (!dim) {
      console.log('❌ No dimensions found, using fallback 3/4');
      return "3/4"; // fallback
    }
    
    const ratio = dim.width / dim.height;
    console.log('📐 Calculated ratio:', ratio);
    
    // Common aspect ratios
    if (Math.abs(ratio - 2/3) < 0.1) return "2/3";
    if (Math.abs(ratio - 3/4) < 0.1) return "3/4";
    if (Math.abs(ratio - 4/5) < 0.1) return "4/5";
    if (Math.abs(ratio - 1/1) < 0.1) return "1/1";
    if (Math.abs(ratio - 9/16) < 0.1) return "9/16";
    if (Math.abs(ratio - 16/9) < 0.1) return "16/9";
    
    // Custom aspect ratio
    const customRatio = `${dim.width}/${dim.height}`;
    console.log('✅ Using custom ratio:', customRatio);
    return customRatio;
  };

  useEffect(() => {
    const update = () => {
      if (imageWrapRef.current && imageTrackRef.current) {
        const wrapW = imageWrapRef.current.offsetWidth;
        setImageWidth(wrapW);
        setImageDragWidth(Math.max(0, imageTrackRef.current.scrollWidth - wrapW));
      }
      if (recWrapRef.current && recTrackRef.current) {
        setRecWidth(Math.max(0, recTrackRef.current.scrollWidth - recWrapRef.current.offsetWidth));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [recommendations.length, product?.images.length]);

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
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const liked = isFavorite(product?.slug || "");

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

  const rawDescription =
    (product.short_description && product.short_description.trim()) ||
    (product.description && product.description.trim()) ||
    (product.poetic_description && product.poetic_description.trim()) ||
    "";
  const firstSentence = rawDescription
    ? rawDescription.split(".").map((part) => part.trim()).find(Boolean) || rawDescription
    : "";
  const shortDescription = firstSentence
    ? `${firstSentence.replace(/[.!?]+$/, "")}.`
    : "A sensual piece curated to reveal your confidence.";

  return (
    <div className="min-h-screen pt-20 pb-14 px-3 md:px-10" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 items-start">
          <div className="space-y-2">
            <div ref={imageWrapRef} className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(184,149,106,0.12)]">
              <motion.div
                ref={imageTrackRef}
                drag={product.images.length > 1 ? "x" : false}
                dragConstraints={{ left: -(imageDragWidth + imageWidth * 0.1), right: 0 }}
                dragElastic={0.08}
                className="flex w-max cursor-grab active:cursor-grabbing"
              >
                {product.images.map((img, idx) => {
                  // For Supabase images, use a simpler approach
                  const aspectRatio = getAspectRatio(img);
                  const [width, height] = aspectRatio.split('/').map(Number);
                  const paddingBottom = (height / width) * 100;
                  const fallbackWidth = imageWidth > 0 ? imageWidth : 600;
                  console.log('🎨 Rendering image:', img, 'aspectRatio:', aspectRatio, 'paddingBottom:', paddingBottom, 'imageWidth:', imageWidth, 'fallbackWidth:', fallbackWidth);
                  return (
                    <div key={`${img}-${idx}`} className="relative" style={{ width: `${fallbackWidth}px`, paddingBottom: `${paddingBottom}%` }}>
                      <Image 
                        src={img} 
                        alt={`${product.name} ${idx + 1}`} 
                        fill 
                        priority={idx === 0} 
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={true} // Add this for Supabase URLs
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          <div className="space-y-1">
            <Link href="/collection" aria-label="Back to all products" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-dark-base/60 text-gold/80 hover:text-gold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <p className="text-[0.5rem] uppercase tracking-[0.32em] text-gold/50">{product.collection}</p>
            <h1 className="font-cormorant text-2xl md:text-3xl italic font-bold text-[#b8956a] leading-tight">{product.name}</h1>
            <p className="text-[0.65rem] leading-5 text-cream/60">{shortDescription}</p>

            <p className="font-cormorant text-xl text-gold">{product.price.toLocaleString("fr-MA")} MAD</p>

            <div>
              <p className="text-[0.55rem] uppercase tracking-[0.25em] text-cream/40 mb-2">Select Size</p>
              <div className="flex flex-wrap gap-2 relative z-10">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Size clicked:', size);
                      setSelectedSize(size);
                    }}
                    className={`rounded-md px-3 py-1.5 text-[0.6rem] tracking-[0.2em] transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/70 cursor-pointer relative z-10 hover:scale-105 ${
                      selectedSize === size
                        ? "bg-burgundy text-cream shadow-lg"
                        : "bg-dark-base/40 text-cream/70 hover:bg-dark-base/60"
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <p className="text-[0.5rem] text-gold/60 mt-1">Selected: {selectedSize}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddToCart}
                className="flex-1 rounded-full bg-burgundy/70 px-3 py-2 text-[0.55rem] uppercase tracking-[0.28em] text-cream shadow-[0_0_20px_rgba(125,23,54,0.55),0_0_36px_rgba(154,31,68,0.35)]"
              >
                {addedToCart ? "Added" : "Add Ritual"}
              </button>
              <button
                aria-label="Favorite product"
                onClick={() => toggle(product.slug)}
                className={`rounded-full p-2 ${liked ? "text-gold" : "text-cream/70"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-6.5-4.35-9-8.28C.63 9.03 2.4 4 7 4c2.17 0 3.4 1 5 2.8C13.6 5 14.83 4 17 4c4.6 0 6.37 5.03 4 8.72C18.5 16.65 12 21 12 21z" />
                </svg>
              </button>
            </div>

            <p className="text-[0.52rem] uppercase tracking-[0.22em] text-cream/35">Hand wash only · discreet delivery</p>
          </div>
        </div>

        <section className="mt-12 border-t border-gold/10 pt-8">
          <h2 className="text-center font-cormorant text-4xl italic text-cream mb-6">You Might Also Like</h2>
          <div ref={recWrapRef} className="overflow-hidden">
            <motion.div
              ref={recTrackRef}
              drag="x"
              dragConstraints={{ left: -recWidth, right: 0 }}
              dragElastic={0.08}
              className="flex w-max gap-4 cursor-grab active:cursor-grabbing"
            >
              {recommendations.map((item) => (
                <div key={item.slug} className="w-[240px] sm:w-[280px]">
                  <ShopProductCard product={item} />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
