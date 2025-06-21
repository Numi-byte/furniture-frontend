import { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartCtx {
  items: CartItem[];
  add   : (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: number) => void;
  clear : () => void;
}

const CartContext = createContext<CartCtx>(null!);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, set] = useState<CartItem[]>(() =>
    JSON.parse(localStorage.getItem('cart') || '[]')
  );

  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);

  const add = (prod: Omit<CartItem, 'quantity'>) => {
    set(c =>
      c.some(i => i.id === prod.id)
        ? c.map(i => (i.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...c, { ...prod, quantity: 1 }]
    );
  };
  const remove = (id: number) => set(c => c.filter(i => i.id !== id));
  const clear  = () => set([]);

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}
