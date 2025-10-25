'use client';

import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Bosch Fren Balata Takımı',
    oem: '0986AB1234',
    price: 450,
    originalPrice: 520,
    rating: 4.8,
    reviews: 124,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 2,
    name: 'Mann Hava Filtresi',
    oem: 'C3698/3',
    price: 85,
    originalPrice: 95,
    rating: 4.6,
    reviews: 89,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 3,
    name: 'Valeo Alternatör',
    oem: '440012',
    price: 1250,
    originalPrice: 1400,
    rating: 4.9,
    reviews: 67,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 4,
    name: 'Bilstein Amortisör',
    oem: '19-064123',
    price: 680,
    originalPrice: 750,
    rating: 4.7,
    reviews: 156,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 5,
    name: 'NGK Buji Seti',
    oem: 'BKR6E',
    price: 120,
    originalPrice: 140,
    rating: 4.5,
    reviews: 203,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 6,
    name: 'Continental Lastik',
    oem: '205/55R16',
    price: 320,
    originalPrice: 380,
    rating: 4.8,
    reviews: 312,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 7,
    name: 'Bosch Motor Yağı',
    oem: '5W-30',
    price: 45,
    originalPrice: 55,
    rating: 4.4,
    reviews: 445,
    image: '/api/placeholder/300/200',
    inStock: true
  },
  {
    id: 8,
    name: 'Hella Far Ampulü',
    oem: 'H7 55W',
    price: 25,
    originalPrice: 35,
    rating: 4.6,
    reviews: 178,
    image: '/api/placeholder/300/200',
    inStock: true
  }
];

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: { id: number; name: string }) => {
    console.log('Added to cart:', product);
    alert(`${product.name} sepete eklendi!`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            En Çok Satan Ürünler
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Müşterilerimizin en çok tercih ettiği kaliteli ve uygun fiyatlı ürünler
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Ürün Görseli</span>
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favorites.includes(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400'
                    }`} 
                  />
                </button>
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    İndirim
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  OEM: {product.oem}
                </p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      ₺{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₺{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center font-semibold"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Sepete Ekle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
