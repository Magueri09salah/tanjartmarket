import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Product } from "@/data/store";

export type CartItem = { product: Product; qty: number };


type CartCtx = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "tanjartmarket_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (p: Product, qty = 1) =>
    setItems((curr) => {
      const existing = curr.find((i) => i.product.id === p.id);
      if (existing) {
        return curr.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...curr, { product: p, qty }];
    });

  const remove = (id: string) => setItems((c) => c.filter((i) => i.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((c) => (qty <= 0 ? c.filter((i) => i.product.id !== id) : c.map((i) => (i.product.id === id ? { ...i, qty } : i))));
  const clear = () => setItems([]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      add,
      remove,
      setQty,
      clear,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
      isOpen,
      setOpen,
    }),
    [items, isOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
