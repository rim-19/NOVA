"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ProductCard } from "@/components/shared/ProductCard";
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

const colorOptions = ["black", "red", "brown", "blue", "purple"];
const sizeOptions = ["S", "M", "L", "XL"];

export default function CollectionArchivePage() {
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
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [page, setPage] = useState(1);

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

  const filteredAndSorted = useMemo(() => {
    let base = allProducts.filter((product) => {
      const typeOk = selectedType === "all" || product.product_type === selectedType;
      const searchOk = !search || product.name.toLowerCase().includes(search.toLowerCase());
      const colorOk = selectedColors.length === 0 || selectedColors.some((color) => product.colors.includes(color));
      const sizeOk = selectedSizes.length === 0 || selectedSizes.some((size) => product.sizes.includes(size));
      return typeOk && searchOk && colorOk && sizeOk;
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
  }, [allProducts, search, selectedType, selectedColors, selectedSizes, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
  const paginated = filteredAndSorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleItem = (list: string[], value: string, setter: (next: string[]) => void) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-28 md:pt-32 pb-20 px-4 md:px-8 lg:px-12" style={{ background: "linear-gradient(180deg, #2B0303 0%, #390A16 100%)" }}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label text-gold/50">Private Selection</p>
            <h1 className="font-cormorant text-5xl md:text-6xl italic text-cream">Intimates</h1>
          </div>
          <p className="text-sm text-cream/60 tracking-widest uppercase">{filteredAndSorted.length} Articles</p>
        </header>

        <section className="mb-7 overflow-x-auto rounded-2xl border border-gold/10 bg-dark-card/40 p-3">
          <div className="flex w-max gap-3">
            <button
              onClick={() => {
                setSelectedType("all");
                setPage(1);
              }}
              className={`rounded-xl border px-4 py-2 text-xs uppercase tracking-[0.22em] ${selectedType === "all" ? "border-gold text-gold" : "border-white/20 text-cream/60"}`}
            >
              All
            </button>
            {storefrontCollections.map((collection) => (
              <button
                key={collection.slug}
                onClick={() => {
                  setSelectedType(collection.slug);
                  setPage(1);
                }}
                className={`group relative w-[118px] overflow-hidden rounded-xl border ${selectedType === collection.slug ? "border-gold" : "border-white/15"}`}
              >
                <img src={collection.image} alt={collection.name} className="h-[100px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 right-2 text-[0.58rem] uppercase tracking-[0.22em] text-cream">{collection.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-7 space-y-4 rounded-2xl border border-gold/10 bg-dark-card/30 p-4 md:p-5">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by product name..."
            className="w-full rounded-full border border-gold/20 bg-dark-base/70 px-5 py-3 text-sm text-cream/80 outline-none placeholder:text-cream/30 focus:border-gold/50"
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortKey);
                setPage(1);
              }}
              className="rounded-full border border-gold/20 bg-dark-base px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream/80"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            {colorOptions.map((color) => (
              <button
                key={color}
                onClick={() => toggleItem(selectedColors, color, setSelectedColors)}
                className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] ${
                  selectedColors.includes(color) ? "border-gold text-gold" : "border-white/20 text-cream/60"
                }`}
              >
                {color}
              </button>
            ))}

            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => toggleItem(selectedSizes, size, setSelectedSizes)}
                className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] ${
                  selectedSizes.includes(size) ? "border-gold text-gold" : "border-white/20 text-cream/60"
                }`}
              >
                {size}
              </button>
            ))}

            <div className="ml-auto flex gap-1">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setGridCols(n as 2 | 3 | 4)}
                  className={`rounded-md border px-2 py-1 text-[0.62rem] ${
                    gridCols === n ? "border-gold text-gold" : "border-white/20 text-cream/60"
                  }`}
                >
                  {n}x
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
          <section className={`grid gap-4 md:gap-6 ${gridCols === 2 ? "grid-cols-2" : gridCols === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pickedForYouProducts.map((product, index) => (
              <motion.div key={product.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
