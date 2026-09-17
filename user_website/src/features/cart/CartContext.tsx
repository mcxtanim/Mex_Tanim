'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../catalog/types';
import { CartItem, CartContextType } from './types';

const CartContext = createContext<CartContextType | undefined>(undefined);

function sanitizeCartForStorage(items: CartItem[]): any[] {
  return items.map((item) => ({
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      nameBn: item.product.nameBn,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      discountBadge: item.product.discountBadge,
      category: item.product.category,
      // Strip massive base64 strings so localStorage stays lightweight (a few KB instead of MBs)
      image:
        item.product.image &&
        item.product.image.startsWith('data:') &&
        item.product.image.length > 500
          ? ''
          : item.product.image,
    },
  }));
}

function persistCartToStorage(cartItems: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeCartForStorage(cartItems);
    localStorage.setItem('mex_tanim_cart', JSON.stringify(sanitized));
  } catch (error) {
    console.warn(
      'LocalStorage quota exceeded while saving cart. Purging non-critical caches...',
      error
    );
    try {
      // Clear non-critical caches to free up quota
      localStorage.removeItem('mex_tanim_live_products_cache');
      localStorage.removeItem('mex_tanim_reviews');

      // Retry with minimal cart data
      const minimal = cartItems.map((item) => ({
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          nameBn: item.product.nameBn,
          price: item.product.price,
          category: item.product.category,
          image:
            item.product.image && !item.product.image.startsWith('data:')
              ? item.product.image
              : '',
        },
      }));
      localStorage.setItem('mex_tanim_cart', JSON.stringify(minimal));
    } catch (fallbackError) {
      console.warn(
        'Could not persist cart to localStorage, keeping in-memory state only.',
        fallbackError
      );
    }
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(60); // Default Inside Dhaka ৳60

  useEffect(() => {
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
    persistCartToStorage(newCart);
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
      persistCartToStorage(updated);
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
