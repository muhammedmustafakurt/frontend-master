'use client';

import React from 'react';
import { ArrowRight, Car } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Car className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Aracına Uygun Parçayı
            <span className="block text-gray-300">Hemen Bul</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Türkiye&apos;nin en kapsamlı otomotiv yedek parça marketi. 
            Orijinal ve kaliteli parçalar, hızlı kargo, uygun fiyatlar.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Alışverişe Başla
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
