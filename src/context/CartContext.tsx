import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/data/mockProducts";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  /** Add product to cart. Returns true if added, false if stock limit blocked it. */
  addToCart: (product: Product, qty?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getItemQuantity = (productId: string) => {
    return cartItems.find((item) => item.id === productId)?.quantity ?? 0;
  };

  const addToCart = (product: Product, qty = 1): boolean => {
    const stock = Math.max(0, product.stock ?? 0);
    if (stock <= 0 || qty <= 0) return false;

    let added = false;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const currentQty = existing?.quantity ?? 0;
      const room = stock - currentQty;

      if (room <= 0) {
        added = false;
        return prev;
      }

      const toAdd = Math.min(qty, room);
      added = toAdd > 0;

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + toAdd, stock }
            : item
        );
      }

      return [...prev, { ...product, quantity: toAdd, stock }];
    });

    return added;
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        const stock = Math.max(0, item.stock ?? 0);
        const capped = stock > 0 ? Math.min(quantity, stock) : quantity;
        return { ...item, quantity: capped };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
