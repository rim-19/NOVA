import { create } from "zustand";
import { persist } from "zustand/middleware";

type FavoriteStore = {
  slugs: string[];
  toggle: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
};

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const exists = get().slugs.includes(slug);
        set({
          slugs: exists ? get().slugs.filter((s) => s !== slug) : [...get().slugs, slug],
        });
      },
      isFavorite: (slug) => get().slugs.includes(slug),
    }),
    {
      name: "nova-favorites",
    }
  )
);

