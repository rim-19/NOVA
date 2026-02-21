import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/lib/supabase";

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    removeItem: (id: string, size?: string) => void;
    updateQuantity: (id: string, quantity: number, size?: string) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => {
                const existing = get().items.find(
                    (i) => i.id === item.id && i.size === item.size
                );
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.id === item.id && i.size === item.size
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, item] });
                }
                set({ isOpen: true });
            },

            removeItem: (id, size) => {
                set({
                    items: get().items.filter(
                        (i) => !(i.id === id && i.size === size)
                    ),
                });
            },

            updateQuantity: (id, quantity, size) => {
                if (quantity <= 0) {
                    get().removeItem(id, size);
                    return;
                }
                set({
                    items: get().items.map((i) =>
                        i.id === id && i.size === size ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set({ isOpen: !get().isOpen }),

            getTotalItems: () =>
                get().items.reduce((sum, item) => sum + item.quantity, 0),

            getTotalPrice: () =>
                get().items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                ),
        }),
        {
            name: "nova-cart",
        }
    )
);
