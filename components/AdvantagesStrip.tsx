'use client';

import React from 'react';
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const advantages = [
  {
    icon: Truck,
    title: 'Hızlı Kargo',
    description: 'Aynı gün kargo ile hızlı teslimat'
  },
  {
    icon: Shield,
    title: 'Uyumluluk Garantisi',
    description: 'Aracınıza uygun parça garantisi'
  },
  {
    icon: RotateCcw,
    title: 'Kolay İade',
    description: '30 gün içinde kolay iade imkanı'
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'Her zaman yanınızda müşteri hizmetleri'
  }
];

export default function AdvantagesStrip() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Müşteri memnuniyeti odaklı hizmet anlayışımız
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <advantage.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {advantage.title}
              </h3>
              <p className="text-gray-600">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
