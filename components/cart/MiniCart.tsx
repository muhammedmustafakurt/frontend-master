'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Package, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export default function MiniCart() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { cart, loading, totals, removeItem } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleGoToCart = () => {
    setIsOpen(false);
    router.push('/cart');
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  const displayItems = cart?.items.slice(0, 3) || [];
  const hasMoreItems = (cart?.items.length || 0) > 3;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Sepet"
      >
        <ShoppingCart className="h-6 w-6" />
        {totals.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
            {totals.itemCount > 9 ? '9+' : totals.itemCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Sepetim ({totals.itemCount} ürün)
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 mt-2">Yükleniyor...</p>
              </div>
            ) : totals.itemCount === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">Sepetiniz boş</p>
                <p className="text-sm text-gray-500 mb-4">
                  Alışverişe başlamak için ürünleri keşfedin
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/products');
                  }}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Ürünleri İncele
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="p-4 space-y-3">
                  {displayItems.map((item) => {
                    const image = item.productSnapshot.images && item.productSnapshot.images.length > 0
                      ? item.productSnapshot.images[0]
                      : null;

                    return (
                      <div key={item.cartItemId} className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        {/* Image */}
                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={item.productSnapshot.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                            {item.productSnapshot.name}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {item.quantity} adet
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              ₺{Number(item.subtotal).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}

                  {hasMoreItems && (
                    <div className="text-center">
                      <button
                        onClick={handleGoToCart}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        +{(cart?.items.length || 0) - 3} ürün daha
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-semibold text-gray-900">₺{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">KDV</span>
                    <span className="font-semibold text-gray-900">₺{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kargo</span>
                    <span className="font-semibold text-gray-900">
                      {totals.shipping === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        `₺${totals.shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Toplam</span>
                      <span className="text-lg font-bold text-gray-900">₺{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 space-y-2 border-t border-gray-200">
                  <button
                    onClick={handleGoToCart}
                    className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                  >
                    Sepete Git
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Ödemeye Geç
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

