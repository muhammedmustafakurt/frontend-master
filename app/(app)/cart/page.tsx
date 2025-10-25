'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, AlertCircle, Package, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartItemComponent from '../../../components/cart/CartItem';
import CartSummary from '../../../components/cart/CartSummary';

interface ValidationMessage {
  productId: number;
  message: string;
}

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, error, totals, updateQuantity, removeItem, clearCart, validateCart } = useCart();
  const [validationErrors, setValidationErrors] = useState<ValidationMessage[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<ValidationMessage[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Validate cart on mount and when cart changes
  useEffect(() => {
    const validate = async () => {
      if (cart && cart.items.length > 0) {
        setIsValidating(true);
        const result = await validateCart();
        if (result) {
          setValidationErrors(result.errors || []);
          setValidationWarnings(result.warnings || []);
        }
        setIsValidating(false);
      }
    };

    validate();
  }, [cart?.items.length]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    await updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    if (confirm('Sepetinizi temizlemek istediğinizden emin misiniz?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Sepetiniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || totals.itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sepetiniz Boş
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Henüz sepetinize ürün eklemediniz. Alışverişe başlamak için ürünlerimizi keşfedin.
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              Alışverişe Başla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Alışveriş Sepetim
          </h1>
          <p className="text-gray-600">
            {totals.itemCount} ürün sepetinizde
          </p>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-2">Sepetinizde Sorunlar Var</h3>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">
                      • {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Validation Warnings */}
        {validationWarnings.length > 0 && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-2">Uyarılar</h3>
                <ul className="space-y-1">
                  {validationWarnings.map((warning, index) => (
                    <li key={index} className="text-sm text-orange-700">
                      • {warning.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ürünler</h2>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Sepeti Temizle
              </button>
            </div>

            {/* Items List */}
            {cart.items.map((item) => (
              <CartItemComponent
                key={item.cartItemId}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                disabled={isValidating}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              summary={cart.summary}
              onCheckout={handleCheckout}
              onContinueShopping={handleContinueShopping}
              loading={isValidating}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Güvenli Alışveriş</h3>
            <p className="text-sm text-gray-600">256-bit SSL şifreleme ile güvenli ödeme</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Kolay İade</h3>
            <p className="text-sm text-gray-600">30 gün içinde kolay iade imkanı</p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">7/24 Destek</h3>
            <p className="text-sm text-gray-600">Her zaman yanınızdayız</p>
          </div>
        </div>
      </div>
    </div>
  );
}

