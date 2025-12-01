import { create } from "zustand";
import { CreateRequestItem, Item } from "@/lib/types";

interface RequestStore {
  items: CreateRequestItem[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
}

export const useRequestStore = create<RequestStore>((set) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) return state;
      return {
        items: [...state.items, { ...item, quantity: 1 }],
        // isOpen: true,
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, delta) =>
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          const cappedQuantity = Math.min(newQuantity, item.available);

          return { ...item, quantity: cappedQuantity };
        }
        return item;
      }),
    })),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
