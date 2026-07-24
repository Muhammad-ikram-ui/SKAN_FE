import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem } from "@/types";

interface CartState {
  standId: number | null;
  items: CartItem[];
  addItem: (menu: MenuItem) => void;
  removeItem: (menuId: number) => void;
  decreaseItem: (menuId: number) => void;
  clearCart: () => void;
  totalHarga: () => number;
  totalQty: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      standId: null,
      items: [],
      addItem: (menu) => {
        const { standId, items } = get();
        // Cart hanya boleh berisi item dari 1 stand yang sama (sesuai validasi backend)
        if (standId && standId !== menu.stand_id) {
          set({ standId: menu.stand_id, items: [{ menu, jumlah: 1 }] });
          return;
        }
        const existing = items.find((i) => i.menu.id === menu.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.menu.id === menu.id ? { ...i, jumlah: i.jumlah + 1 } : i
            ),
          });
        } else {
          set({ standId: menu.stand_id, items: [...items, { menu, jumlah: 1 }] });
        }
      },
      removeItem: (menuId) =>
        set((state) => {
          const remaining = state.items.filter((i) => i.menu.id !== menuId);
          return { items: remaining, standId: remaining.length ? state.standId : null };
        }),
      decreaseItem: (menuId) =>
        set((state) => {
          const updated = state.items
            .map((i) => (i.menu.id === menuId ? { ...i, jumlah: i.jumlah - 1 } : i))
            .filter((i) => i.jumlah > 0);
          return { items: updated, standId: updated.length ? state.standId : null };
        }),
      clearCart: () => set({ items: [], standId: null }),
      totalHarga: () => get().items.reduce((sum, i) => sum + i.menu.harga * i.jumlah, 0),
      totalQty: () => get().items.reduce((sum, i) => sum + i.jumlah, 0),
    }),
    { name: "skan-cart-storage" }
  )
);
