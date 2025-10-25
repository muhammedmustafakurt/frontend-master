'use client';

import React, { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye, Package, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: (productId: number) => void;
  onQuickView?: (product: Product) => void;
  isFavorite?: boolean;
}

export default function ProductCard({ 
  product, 
  onToggleFavorite, 
  onQuickView,
  isFavorite = false 
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/placeholder-product.jpg'];

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  const getStockStatus = () => {
    if (product.stock === 0) {
      return { text: 'Stokta Yok', color: 'text-red-600 bg-red-50', icon: 'bg-red-500' };
    } else if (product.stock <= 5) {
      return { text: `Son ${product.stock} adet`, color: 'text-orange-600 bg-orange-50', icon: 'bg-orange-500' };
    } else {
      return { text: 'Stokta Var', color: 'text-green-600 bg-green-50', icon: 'bg-green-500' };
    }
  };

  const stockStatus = getStockStatus();

  const discountPercentage = product.price && Number(product.price) > 0
    ? Math.round(((Number(product.price) * 0.15) / Number(product.price)) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('Bu ürün stokta yok!');
      return;
    }

    setIsAdding(true);
    try {
      const result = await addItem(product.id, 1);
      
      if (result.success) {
        setJustAdded(true);
        toast.success(`${product.name} sepete eklendi!`);
        
        // Reset "just added" state after 2 seconds
        setTimeout(() => {
          setJustAdded(false);
        }, 2000);
      } else {
        // Backend'den hata geldi
        toast.error(result.error || 'Ürün sepete eklenemedi');
      }
    } catch (error) {
      // Network hatası veya beklenmeyen hata
      const errorMessage = error instanceof Error ? error.message : 'Ürün sepete eklenirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div 
        className="relative h-64 bg-gray-100 overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onQuickView?.(product)}
      >
        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center p-4">
          {images[0] === '/placeholder-product.jpg' ? (
            <Package className="h-24 w-24 text-gray-300" />
          ) : (
            <img
              src={images[currentImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -%{discountPercentage}
          </div>
        )}

        {/* Stock Status Badge */}
        <div className={`absolute top-3 right-3 ${stockStatus.color} px-2 py-1 rounded text-xs font-semibold flex items-center gap-1`}>
          <span className={`w-2 h-2 ${stockStatus.icon} rounded-full`}></span>
          {stockStatus.text}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(product.id);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Favorilere ekle"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Hızlı görünüm"
          >
            <Eye className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase">{product.brand}</span>
          <span className="text-xs text-gray-400">{product.category}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
          {product.name}
        </h3>

        {/* OEM Number */}
        <p className="text-sm text-gray-500 mb-2">
          OEM: <span className="font-mono">{product.oemNumber}</span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(Number(product.rating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {Number(product.rating).toFixed(1)} ({product.reviewCount})
          </span>
        </div>

        {/* Vendor Info */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <span className="text-xs text-gray-500">Satıcı:</span>
          <span className="text-xs font-medium text-gray-700">{product.vendor.name}</span>
          {product.vendor.rating && Number(product.vendor.rating) > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{Number(product.vendor.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₺{Number(product.price).toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₺{(Number(product.price) * 1.15).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : justAdded
              ? 'bg-green-600 text-white'
              : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Ekleniyor...</span>
            </>
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Sepete Eklendi!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>{product.stock === 0 ? 'Stokta Yok' : 'Sepete Ekle'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

