'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../catalog/types';
import { CartItem, CartContextType } from './types';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to sanitize cart items before persisting to localStorage
// Strips massive base64 strings and redundant heavy fields to prevent QuotaExceededError
function sanitizeCartForStorage(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    const img = item.product.image;
    const isLargeBase64 = typeof img === 'string' && img.startsWith('data:image') && img.length > 500;

    return {
      quantity: item.quantity,
      product: {
        ...item.product,
        image: isLargeBase64 ? '' : img,
        comboImages: undefined,
        description: '',
        descriptionBn: '',
        specs: [],
      },
    };
  });
}

function safePersistCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeCartForStorage(items);
    localStorage.setItem('mex_tanim_cart', JSON.stringify(sanitized));
  } catch (error) {
    console.warn('localStorage quota exceeded while persisting cart. Attempting minimal save...', error);
    try {
      // Minimal fallback: clear image and heavy fields completely
      const minimal = items.map((i) => ({
        quantity: i.quantity,
        product: {
          ...i.product,
          image: '',
          comboImages: undefined,
          description: '',
          descriptionBn: '',
          specs: [],
        },
      }));
      localStorage.setItem('mex_tanim_cart', JSON.stringify(minimal));
    } catch (fallbackError) {
      console.warn('localStorage is completely full. Cart state safely preserved in memory.', fallbackError);
    }
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(60); // Default Inside Dhaka ৳60

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCart = localStorage.getItem('mex_tanim_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage:', e);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    safePersistCart(newCart);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [...prev, { product, quantity }];
      }
      safePersistCart(updated);
      return updated;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        totalItems,
        subtotal,
        deliveryFee,
        setDeliveryFee,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
