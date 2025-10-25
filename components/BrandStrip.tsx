'use client';

import React from 'react';

const brands = [
  { name: 'Bosch', logo: 'BOSCH' },
  { name: 'Valeo', logo: 'VALEO' },
  { name: 'Continental', logo: 'CONTINENTAL' },
  { name: 'Mann', logo: 'MANN' },
  { name: 'NGK', logo: 'NGK' },
  { name: 'Hella', logo: 'HELLA' },
  { name: 'Bilstein', logo: 'BILSTEIN' },
  { name: 'Brembo', logo: 'BREMBO' },
  { name: 'Michelin', logo: 'MICHELIN' },
  { name: 'Castrol', logo: 'CASTROL' }
];

export default function BrandStrip() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Güvenilir Markalar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dünyaca ünlü markaların kaliteli ve orijinal ürünleri
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-8">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-300"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {brand.logo}
                </div>
                <div className="text-sm text-gray-500">
                  {brand.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
