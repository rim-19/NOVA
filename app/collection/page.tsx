"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  mergeStorefrontWithLive,
  pickedForYouProducts,
  storefrontCollections,
  storefrontProducts,
  type StoreCollectionType,
  type StorefrontProduct,
} from "@/lib/storefront";
import { ShopProductCard } from "@/components/shared/ShopProductCard";
import { Footer } from "@/components/layout/Footer";

const ITEMS_PER_PAGE = 15;
type SortKey = "featured" | "best-sellers" | "price-low" | "price-high" | "newest";

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "price-low", label: "Price Low To High" },
  { id: "price-high", label: "Price High To Low" },
  { id: "newest", label: "Newest Arrivals" },
];

const sizeOptions = ["all", "S", "M", "L", "XL"] as const;
const filterOptions = [
  { value: "all", label: "Filter" },
  { value: "type:set", label: "Type: Set" },
  { value: "type:bodysuit", label: "Type: Bodysuit" },
  { value: "type:bodysocks", label: "Type: Bodysocks" },
  { value: "type:accessories", label: "Type: Accessories" },
  { value: "color:black", label: "Color: Black" },
  { value: "color:red", label: "Color: Red" },
  { value: "color:brown", label: "Color: Brown" },
  { value: "color:blue", label: "Color: Blue" },
  { value: "color:purple", label: "Color: Purple" },
];

export default function CollectionArchivePage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212781563070";
  const whatsappHref = `https://wa.me/${whatsappNumber}`;
  const [allProducts, setAllProducts] = useState<StorefrontProduct[]>(storefrontProducts);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState<StoreCollectionType | "all">(() => {
    if (typeof window === "undefined") return "all";
    const typeParam = new URLSearchParams(window.location.search).get("type");
    if (typeParam === "set" || typeParam === "bodysuit" || typeParam === "bodysocks" || typeParam === "accessories") {
      return typeParam;
    }
    return "all";
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [selectedSize, setSelectedSize] = useState<(typeof sizeOptions)[number]>("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [page, setPage] = useState(1);
  const collectionTrackRef = useRef<HTMLDivElement>(null);
  const collectionWrapRef = useRef<HTMLDivElement>(null);
  const pickedTrackRef = useRef<HTMLDivElement>(null);
  const pickedWrapRef = useRef<HTMLDivElement>(null);
  const [collectionDragWidth, setCollectionDragWidth] = useState(0);
  const [pickedDragWidth, setPickedDragWidth] = useState(0);

  useEffect(() => {
    const fetchLive = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAllProducts(mergeStorefrontWithLive(data));
      } else {
        setAllProducts(storefrontProducts);
      }
      setLoading(false);
    };
    fetchLive();
  }, []);

  useEffect(() => {
    const updateDragWidths = () => {
      if (collectionTrackRef.current && collectionWrapRef.current) {
        setCollectionDragWidth(
          Math.max(0, collectionTrackRef.current.scrollWidth - collectionWrapRef.current.offsetWidth)
        );
      }
      if (pickedTrackRef.current && pickedWrapRef.current) {
        setPickedDragWidth(Math.max(0, pickedTrackRef.current.scrollWidth - pickedWrapRef.current.offsetWidth));
      }
    };
    updateDragWidths();
    window.addEventListener("resize", updateDragWidths);
    return () => window.removeEventListener("resize", updateDragWidths);
  }, [allProducts]);

  const filteredAndSorted = useMemo(() => {
    let base = allProducts.filter((product) => {
      const typeOk = selectedType === "all" || product.product_type === selectedType;
      const searchOk = !search || product.name.toLowerCase().includes(search.toLowerCase());
      const sizeOk = selectedSize === "all" || product.sizes.includes(selectedSize);
      const filterOk =
        selectedFilter === "all"
          ? true
          : selectedFilter.startsWith("color:")
            ? product.colors.includes(selectedFilter.replace("color:", ""))
            : selectedFilter.startsWith("type:")
              ? product.product_type === selectedFilter.replace("type:", "")
              : true;
      return typeOk && searchOk && sizeOk && filterOk;
    });

    const byDate = (a: StorefrontProduct, b: StorefrontProduct) =>
      new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();

    base = [...base].sort((a, b) => {
      switch (sortBy) {
        case "best-sellers":
          return (b.popularity || 0) - (a.popularity || 0);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return byDate(a, b);
        case "featured":
        default:
          return Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)) || byDate(a, b);
      }
    });

    return base;
  }, [allProducts, search, selectedType, selectedSize, selectedFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
  const paginated = filteredAndSorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pt-20 md:pt-28 pb-20 px-3 md:px-8 lg:px-12" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[0.52rem] uppercase tracking-[0.3em] text-gold/45">Curated Intimates</p>
            <h1 className="font-cormorant text-4xl md:text-6xl italic text-cream">All Products</h1>
          </div>
          <p className="text-[0.65rem] text-cream/65 tracking-[0.22em] uppercase text-right">{filteredAndSorted.length} Articles</p>
        </header>

        <section ref={collectionWrapRef} className="mb-5 overflow-hidden p-1 no-scrollbar">
          <motion.div
            ref={collectionTrackRef}
            drag="x"
            dragConstraints={{ left: -collectionDragWidth, right: 0 }}
            dragElastic={0.06}
            className="flex w-max gap-2 cursor-grab active:cursor-grabbing"
          >
            {storefrontCollections.map((collection) => (
              <button
                key={collection.slug}
                onClick={() => {
                  setSelectedType((prev) => (prev === collection.slug ? "all" : collection.slug));
                  setPage(1);
                }}
                className={`group relative w-[92px] overflow-hidden rounded-xl ${selectedType === collection.slug ? "ring-1 ring-gold/70" : "ring-1 ring-transparent"} shadow-[0_8px_25px_rgba(0,0,0,0.35),0_0_16px_rgba(184,149,106,0.13)]`}
              >
                <img src={collection.image} alt={collection.name} className="h-[78px] w-full object-contain bg-black/25 px-1 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[0.5rem] uppercase tracking-[0.16em] text-cream">{collection.name}</span>
              </button>
            ))}
          </motion.div>
        </section>

        <section className="mb-6 space-y-3 rounded-2xl bg-dark-card/25 p-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name..."
            className="w-full rounded-full bg-dark-base/65 px-4 py-2.5 text-xs text-cream/80 outline-none placeholder:text-cream/35"
          />

          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap no-scrollbar">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortKey);
                setPage(1);
              }}
              className="appearance-none rounded-full bg-dark-base/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.14em] text-cream/80 outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value as (typeof sizeOptions)[number]);
                setPage(1);
              }}
              className="appearance-none rounded-full bg-dark-base/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.14em] text-cream/80 outline-none"
            >
              <option value="all">Size</option>
              {sizeOptions.filter((x) => x !== "all").map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <select
              value={selectedFilter}
              onChange={(e) => {
                setSelectedFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none rounded-full bg-dark-base/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.14em] text-cream/80 outline-none"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div className="ml-auto flex gap-1">
              {[2, 3, 4].map((n, idx) => (
                <button
                  key={n}
                  onClick={() => setGridCols(n as 2 | 3 | 4)}
                  className={`rounded-full bg-dark-base/70 px-2.5 py-2 text-[0.58rem] ${
                    gridCols === n ? "text-gold" : "text-cream/60"
                  }`}
                >
                  {idx === 0 ? "||" : idx === 1 ? "|||" : "4"}
                </button>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <section className={`grid gap-3 md:gap-5 ${gridCols === 2 ? "grid-cols-2" : gridCols === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
            {paginated.map((product) => (
              <ShopProductCard key={product.slug} product={product} />
            ))}
          </section>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream/70 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-xs uppercase tracking-[0.25em] text-gold/70">Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream/70 disabled:opacity-30"
          >
            Next
          </button>
        </div>

        <section className="mt-16 rounded-3xl border border-gold/10 bg-dark-card/30 px-6 py-10 text-center">
          <p className="font-montecarlo text-4xl text-gold/80">A story woven for skin and silence.</p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-8 text-cream/55">
            Keep exploring. The right piece is never loud, it simply meets your body like it has always belonged there.
          </p>
        </section>

        <section className="mt-16">
          <div className="mb-8 text-center">
            <p className="text-label text-gold/50">Picked For You</p>
            <h2 className="font-cormorant text-5xl italic text-cream">Masterpieces</h2>
          </div>
          <div ref={pickedWrapRef} className="overflow-hidden">
            <motion.div
              ref={pickedTrackRef}
              drag="x"
              dragConstraints={{ left: -pickedDragWidth, right: 0 }}
              dragElastic={0.08}
              className="flex w-max gap-4 cursor-grab active:cursor-grabbing"
            >
              {pickedForYouProducts.map((product, index) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="w-[240px] sm:w-[280px]"
                >
                  <ShopProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-4 z-[90] flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/90 text-white shadow-[0_8px_22px_rgba(0,0,0,0.35),0_0_16px_rgba(37,211,102,0.3)] transition-transform hover:scale-105"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A11 11 0 003 18.9L2 23l4.3-1.1A11 11 0 1020.5 3.5zm-8.5 18c-1.8 0-3.5-.5-5-1.4l-.4-.2-2.5.7.7-2.4-.2-.4A8.9 8.9 0 1112 21.5zm4.9-6.7c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1-.2.2-.3.2-.6.1a7.2 7.2 0 01-3.6-3.1c-.2-.3 0-.4.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.7.3-.2.2-1 1-.9 2.3.1 1.4 1 2.7 1.1 2.9.1.2 2 3.1 5 4.3.7.3 1.3.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.1-1.4-.1-.2-.3-.3-.6-.4z" />
        </svg>
      </a>
      <Footer />
    </div>
  );
}
