'use client';

import React, { useState } from 'react';
import { Minus, Plus, Trash2, Heart, Package } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>;
  onRemove: (itemId: string) => Promise<void>;
  onAddToWishlist?: (productId: number) => void;
  disabled?: boolean;
}

export default function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemove,
  onAddToWishlist,
  disabled = false
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.productSnapshot.stock) return;
    if (newQuantity === item.quantity) return;

    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.cartItemId, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.cartItemId);
    } finally {
      setIsRemoving(false);
    }
  };

  const getStockStatus = () => {
    const stock = item.productSnapshot.stock;
    if (stock === 0) {
      return { text: 'Stokta Yok', color: 'text-red-600 bg-red-50' };
    } else if (stock <= 5) {
      return { text: `Son ${stock} adet`, color: 'text-orange-600 bg-orange-50' };
    } else {
      return { text: 'Stokta Var', color: 'text-green-600 bg-green-50' };
    }
  };

  const stockStatus = getStockStatus();
  const image = item.productSnapshot.images && item.productSnapshot.images.length > 0
    ? item.productSnapshot.images[0]
    : null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 transition-opacity ${
      isRemoving ? 'opacity-50' : ''
    }`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={item.productSnapshot.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-10 w-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {item.productSnapshot.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                <span className="font-medium">{item.productSnapshot.brand}</span>
                <span>•</span>
                <span>OEM: {item.productSnapshot.oemNumber}</span>
                <span>•</span>
                <span>SKU: {item.productSnapshot.sku}</span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-500">
                  Satıcı: <span className="font-medium text-gray-700">{item.productSnapshot.vendorName}</span>
                </span>
                <span className={`text-xs px-2 py-1 rounded ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>

              {/* Price Change Warning */}
              {item.validation?.priceChanged && (
                <div className="mb-2">
                  {Number(item.validation.currentPrice) > Number(item.price) ? (
                    <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">
                      Fiyat ₺{Number(item.price).toFixed(2)}&apos;den ₺{Number(item.validation.currentPrice).toFixed(2)}&apos;ye yükseldi
                    </div>
                  ) : (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                      Fiyat ₺{Number(item.price).toFixed(2)}&apos;den ₺{Number(item.validation.currentPrice).toFixed(2)}&apos;ye düştü
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                ₺{Number(item.subtotal).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                ₺{Number(item.price).toFixed(2)} / adet
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 mr-2">Miktar:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={disabled || isUpdating || item.quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  disabled={disabled || isUpdating}
                  className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                  min="1"
                  max={item.productSnapshot.stock}
                />
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={disabled || isUpdating || item.quantity >= item.productSnapshot.stock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {isUpdating && (
                <span className="text-sm text-gray-500 ml-2">Güncelleniyor...</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onAddToWishlist && (
                <button
                  onClick={() => onAddToWishlist(item.productId)}
                  disabled={disabled}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Favorilere Ekle"
                >
                  <Heart className="h-5 w-5" />
                </button>
              )}
              
              <button
                onClick={handleRemove}
                disabled={disabled || isRemoving}
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Sepetten Kaldır"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

