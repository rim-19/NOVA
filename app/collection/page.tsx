"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  storefrontCollections,
  storefrontProducts,
  toStorefrontProduct,
  type StorefrontProduct,
} from "@/lib/storefront";
import { ShopProductCard } from "@/components/shared/ShopProductCard";
import { Footer } from "@/components/layout/Footer";

const ITEMS_PER_PAGE = 15;
type SortKey = "featured" | "best-sellers" | "price-low" | "price-high" | "newest";
type PanelKey = "sort" | "size" | "filter" | null;

const sortOptions: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "best-sellers", label: "Best Sellers" },
  { id: "price-low", label: "Price Low To High" },
  { id: "price-high", label: "Price High To Low" },
  { id: "newest", label: "Newest Arrivals" },
];

const sizeOptions = ["all", "S", "M", "L", "XL"] as const;
const REAL_COLLECTION_SLUGS = ["set", "bodysuit", "bodysocks", "accessories"];
const filterOptions = [
  { value: "all", label: "All Filters" },
  { value: "type:set", label: "Set" },
  { value: "type:bodysuit", label: "Bodysuit" },
  { value: "type:bodysocks", label: "Bodysocks" },
  { value: "type:accessories", label: "Accessories" },
  { value: "color:black", label: "Black" },
  { value: "color:red", label: "Red" },
  { value: "color:brown", label: "Brown" },
  { value: "color:blue", label: "Blue" },
  { value: "color:purple", label: "Purple" },
];

export default function CollectionArchivePage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212781563070";
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  const [allProducts, setAllProducts] = useState<StorefrontProduct[]>(storefrontProducts);
  const [collectionsList, setCollectionsList] = useState<Array<{ slug: string; name: string; image: string }>>(storefrontCollections);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState<string | "all">(() => {
    if (typeof window === "undefined") return "all";
    const typeParam = new URLSearchParams(window.location.search).get("type");
    if (typeParam) {
      return typeParam;
    }
    return "all";
  });
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [selectedSize, setSelectedSize] = useState<(typeof sizeOptions)[number]>("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [activePanel, setActivePanel] = useState<PanelKey>(null);

  const collectionTrackRef = useRef<HTMLDivElement>(null);
  const collectionWrapRef = useRef<HTMLDivElement>(null);
  const pickedTrackRef = useRef<HTMLDivElement>(null);
  const pickedWrapRef = useRef<HTMLDivElement>(null);
  const [collectionDragWidth, setCollectionDragWidth] = useState(0);
  const [pickedDragWidth, setPickedDragWidth] = useState(0);

  useEffect(() => {
    const fetchLive = async () => {
      const [productsRes, collectionsRes] = await Promise.all([
        supabase.from("products").select("*").eq("is_visible", true).order("created_at", { ascending: false }),
        supabase.from("collections").select("slug,name,image").in("slug", REAL_COLLECTION_SLUGS).order("created_at", { ascending: true }),
      ]);

      if (!productsRes.error && productsRes.data) {
        setAllProducts(productsRes.data.map((product, i) => toStorefrontProduct(product, i)));
      } else if (productsRes.error) {
        setAllProducts(storefrontProducts);
      }

      if (!collectionsRes.error && collectionsRes.data && collectionsRes.data.length > 0) {
        setCollectionsList(
          collectionsRes.data.map((collection) => ({
            slug: collection.slug,
            name: collection.name,
            image: collection.image || storefrontCollections[0]?.image || "/new_assets/dark_mystrouis_collection/dark3.jpeg",
          }))
        );
      } else {
        setCollectionsList(storefrontCollections);
      }
      setLoading(false);
    };
    fetchLive();
  }, []);

  useEffect(() => {
    const updateDragWidths = () => {
      if (collectionTrackRef.current && collectionWrapRef.current) {
        setCollectionDragWidth(Math.max(0, collectionTrackRef.current.scrollWidth - collectionWrapRef.current.offsetWidth));
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
      const typeOk =
        selectedType === "all" ||
        product.collection_slug === selectedType ||
        product.product_type === selectedType;
      const searchOk = !search || product.name.toLowerCase().includes(search.toLowerCase());
      const sizeOk = selectedSize === "all" || product.sizes.includes(selectedSize);
      const filterOk =
        selectedFilter === "all"
          ? true
          : selectedFilter.startsWith("color:")
            ? (product.colors || []).includes(selectedFilter.replace("color:", ""))
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
          return Number(Boolean(b.is_bestseller)) - Number(Boolean(a.is_bestseller)) || (b.popularity || 0) - (a.popularity || 0);
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
  const pickedForYou = useMemo(
    () =>
      [...allProducts]
        .sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)) || (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 6),
    [allProducts]
  );

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

        <section className="md:hidden mb-2 overflow-hidden no-scrollbar" ref={collectionWrapRef}>
          <motion.div
            ref={collectionTrackRef}
            drag="x"
            dragConstraints={{ left: -collectionDragWidth, right: 0 }}
            dragElastic={0.06}
            className="flex w-max gap-3 cursor-grab active:cursor-grabbing px-0.5"
          >
            {collectionsList.map((collection) => {
              const isActive = selectedType === collection.slug;
              return (
                <button
                  key={collection.slug}
                  onClick={() => {
                    setSelectedType((prev) => (prev === collection.slug ? "all" : collection.slug));
                    setPage(1);
                  }}
                  className="w-[98px] shrink-0"
                >
                  <div className={`relative aspect-[4/5] overflow-hidden rounded-md shadow-[0_10px_24px_rgba(0,0,0,0.35),0_0_14px_rgba(184,149,106,0.14)] ${isActive ? "ring-1 ring-gold/70" : ""}`}>
                    <img src={collection.image} alt={collection.name} className="h-full w-full object-cover" />
                  </div>
                  <p className={`mt-1 text-[0.5rem] uppercase tracking-[0.14em] text-center ${isActive ? "text-gold" : "text-cream/78"}`}>{collection.name}</p>
                </button>
              );
            })}
          </motion.div>
        </section>

        <section className="hidden md:grid mb-3 grid-cols-4 gap-5">
          {collectionsList.map((collection) => {
            const isActive = selectedType === collection.slug;
            return (
              <button
                key={collection.slug}
                onClick={() => {
                  setSelectedType((prev) => (prev === collection.slug ? "all" : collection.slug));
                  setPage(1);
                }}
                className="w-full"
              >
                <div className={`relative aspect-[4/5] overflow-hidden rounded-lg shadow-[0_12px_30px_rgba(0,0,0,0.4),0_0_18px_rgba(184,149,106,0.15)] ${isActive ? "ring-1 ring-gold/70" : ""}`}>
                  <img src={collection.image} alt={collection.name} className="h-full w-full object-cover" />
                </div>
                <p className={`mt-2 text-[0.58rem] uppercase tracking-[0.2em] text-center ${isActive ? "text-gold" : "text-cream/80"}`}>{collection.name}</p>
              </button>
            );
          })}
        </section>

        <section className="mb-6 space-y-3 rounded-xl bg-dark-card/25 p-3">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name..."
            className="w-full rounded-full bg-dark-base/65 px-4 py-2.5 text-xs text-cream/80 outline-none placeholder:text-cream/35"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActivePanel("sort")}
                className="rounded-full bg-dark-base/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.14em] text-cream/85"
              >
                Sort ▼
              </button>
              <button
                onClick={() => setActivePanel("size")}
                className="rounded-full bg-dark-base/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.14em] text-cream/85"
              >
                Size ▼
              </button>
              <button
                onClick={() => setActivePanel("filter")}
                className="flex items-center gap-1 rounded-full bg-dark-base/70 px-3 py-2 text-[0.58rem] uppercase tracking-[0.14em] text-cream/85"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                Filter
              </button>
            </div>

            <div />
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {paginated.map((product) => (
              <div key={product.slug} className="w-full md:max-w-[260px] lg:max-w-[300px] xl:max-w-[320px] md:mx-auto">
                <ShopProductCard product={product} />
              </div>
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

        <section className="mt-16 rounded-3xl bg-dark-card/30 px-6 py-10 text-center">
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
              {pickedForYou.map((product, index) => (
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

      <AnimatePresence>
        {activePanel && (
          <motion.div
            className="fixed inset-0 z-[110] bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[linear-gradient(180deg,#390a16,#1a0202)] p-5 shadow-[0_-20px_45px_rgba(0,0,0,0.55)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gold/35" />
              {activePanel === "sort" && (
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">Sort</p>
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`block w-full rounded-xl px-3 py-2 text-left text-xs uppercase tracking-[0.14em] ${
                        sortBy === option.id ? "bg-gold/20 text-gold" : "bg-black/25 text-cream/75"
                      }`}
                      onClick={() => {
                        setSortBy(option.id);
                        setPage(1);
                        setActivePanel(null);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {activePanel === "size" && (
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        className={`rounded-xl px-3 py-2 text-xs uppercase tracking-[0.14em] ${
                          selectedSize === size ? "bg-gold/20 text-gold" : "bg-black/25 text-cream/75"
                        }`}
                        onClick={() => {
                          setSelectedSize(size);
                          setPage(1);
                          setActivePanel(null);
                        }}
                      >
                        {size === "all" ? "All" : size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {activePanel === "filter" && (
                <div className="space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">Filter</p>
                  <div className="max-h-[42vh] overflow-y-auto no-scrollbar space-y-2">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full rounded-xl px-3 py-2 text-left text-xs uppercase tracking-[0.14em] ${
                          selectedFilter === option.value ? "bg-gold/20 text-gold" : "bg-black/25 text-cream/75"
                        }`}
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setPage(1);
                          setActivePanel(null);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
