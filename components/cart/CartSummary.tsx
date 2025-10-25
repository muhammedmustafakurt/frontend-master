'use client';

import React from 'react';
import { ShoppingBag, Truck, Receipt, CreditCard } from 'lucide-react';
import { CartSummary as CartSummaryType } from '@/types/cart';

interface CartSummaryProps {
  summary: CartSummaryType;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  loading?: boolean;
}

export default function CartSummary({
  summary,
  onCheckout,
  onContinueShopping,
  loading = false
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 sticky top-4">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Sipariş Özeti
        </h2>

        {/* Order Summary Details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ara Toplam ({summary.totalItems} ürün)</span>
            <span className="font-semibold text-gray-900">₺{summary.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Receipt className="h-4 w-4" />
              KDV (%{(summary.taxRate * 100).toFixed(0)})
            </span>
            <span className="font-semibold text-gray-900">₺{summary.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Kargo
            </span>
            <span className="font-semibold text-gray-900">
              {summary.shipping === 0 ? (
                <span className="text-green-600">Ücretsiz</span>
              ) : (
                `₺${summary.shipping.toFixed(2)}`
              )}
            </span>
          </div>

          {summary.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">İndirim</span>
              <span className="font-semibold text-green-600">-₺{summary.discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Free Shipping Progress */}
        {summary.shipping > 0 && summary.subtotal < 500 && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-blue-700 font-medium">Ücretsiz Kargo</span>
              <span className="text-blue-600">₺{(500 - summary.subtotal).toFixed(2)} kaldı</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((summary.subtotal / 500) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              500₺ ve üzeri alışverişlerde kargo ücretsiz!
            </p>
          </div>
        )}

        {/* Vendor Breakdown */}
        {summary.vendors && summary.vendors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Satıcılar</h3>
            <div className="space-y-2">
              {summary.vendors.map((vendor) => (
                <div key={vendor.vendorId} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{vendor.vendorName}</p>
                    <p className="text-xs text-gray-500">{vendor.itemCount} ürün</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₺{vendor.subtotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Kargo: {vendor.shipping === 0 ? 'Ücretsiz' : `₺${vendor.shipping.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-4 border-t border-gray-200 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Toplam</span>
            <span className="text-2xl font-bold text-gray-900">₺{summary.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onCheckout && (
            <button
              onClick={onCheckout}
              disabled={loading || summary.totalItems === 0}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              {loading ? 'Yükleniyor...' : 'Ödemeye Geç'}
            </button>
          )}

          {onContinueShopping && (
            <button
              onClick={onContinueShopping}
              className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-colors"
            >
              Alışverişe Devam Et
            </button>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Güvenli ödeme</span>
          </div>
        </div>
      </div>
    </div>
  );
}

