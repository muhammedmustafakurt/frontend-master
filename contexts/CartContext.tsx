'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart } from '@/types/cart';
import { cartAPI, getSessionId, clearSessionId } from '@/lib/api/cart';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  totals: {
    itemCount: number;
    quantity: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  addToCart: (productId: number, quantity?: number) => Promise<{ success: boolean; cart?: Cart; error?: string }>;
  addItem: (productId: number, quantity?: number) => Promise<{ success: boolean; cart?: Cart; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
  removeItem: (itemId: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<{ success: boolean; error?: string }>;
  mergeGuestCart: () => Promise<{ success: boolean; error?: string }>;
  validateCart: () => Promise<any>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  // Load cart
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const cartData = await cartAPI.getCart(isAuthenticated);
      setCart(cartData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sepet yüklenemedi');
      console.error('Cart load error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Add to cart
  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    try {
      const updatedCart = await cartAPI.addItem(productId, quantity, isAuthenticated);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sepete eklenemedi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated]);

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await cartAPI.updateItem(itemId, quantity, isAuthenticated);
      setCart(updatedCart);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Miktar güncellenemedi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated]);

  // Remove item
  const removeItem = useCallback(async (itemId: string) => {
    try {
      const updatedCart = await cartAPI.removeItem(itemId, isAuthenticated);
      setCart(updatedCart);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ürün silinemedi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      const updatedCart = await cartAPI.clearCart(isAuthenticated);
      setCart(updatedCart);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sepet temizlenemedi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated]);

  // Merge guest cart after login
  const mergeGuestCart = useCallback(async () => {
    const guestCartId = getSessionId();
    if (!guestCartId) return { success: true };

    try {
      const updatedCart = await cartAPI.mergeCarts(guestCartId);
      setCart(updatedCart);
      clearSessionId();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sepetler birleştirilemedi';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Validate cart
  const validateCart = useCallback(async () => {
    try {
      const validationResult = await cartAPI.validateCart(isAuthenticated);
      return validationResult;
    } catch (err) {
      console.error('Cart validation error:', err);
      return null;
    }
  }, [isAuthenticated]);

  // Get cart totals
  const totals = {
    itemCount: cart?.summary.totalItems || 0,
    quantity: cart?.summary.totalQuantity || 0,
    subtotal: cart?.summary.subtotal || 0,
    tax: cart?.summary.tax || 0,
    shipping: cart?.summary.shipping || 0,
    total: cart?.summary.grandTotal || 0
  };

  const value: CartContextType = {
    cart,
    loading,
    error,
    isAuthenticated,
    totals,
    addToCart,
    addItem: addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    mergeGuestCart,
    validateCart,
    refreshCart: loadCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

