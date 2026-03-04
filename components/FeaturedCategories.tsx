'use client';

import React from 'react';
import {
  Sun,
  Wrench,
  Droplets,
  Hammer,
  Bath,
  ShowerHead
} from 'lucide-react';

const categories = [
  {
    name: 'Güneş enerjisi tamiratı',
    icon: Sun,
    description: 'Güneş enerji sistemlerinde arıza tespiti ve tamir hizmeti',
    color: 'bg-gray-100'
  },
  {
    name: 'Güneş enerjisi montajı',
    icon: Wrench,
    description: 'Yeni güneş enerjisi sistemleri için profesyonel montaj',
    color: 'bg-gray-100'
  },
  {
    name: 'Sıhhi tesisat',
    icon: Droplets,
    description: 'Ev ve iş yerleri için genel sıhhi tesisat hizmetleri',
    color: 'bg-gray-100'
  },
  {
    name: 'Klozet tamiri',
    icon: Hammer,
    description: 'Klozet arızaları için hızlı tamir ve parça değişimi',
    color: 'bg-gray-100'
  },
  {
    name: 'Daire tesisatı yenileme',
    icon: Bath,
    description: 'Eski tesisatların yenilenmesi ve modernizasyonu',
    color: 'bg-gray-100'
  },
  {
    name: 'Çeşme montajı',
    icon: ShowerHead,
    description: 'Banyo ve mutfak için yeni çeşme montaj hizmeti',
    color: 'bg-gray-100'
  },
  {
    name: 'Banyo bataryası montajı',
    icon: ShowerHead,
    description: 'Banyo bataryalarında söküm, kurulum ve kontrol işlemleri',
    color: 'bg-gray-100'
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hizmet Alanlarımız
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İhtiyacınıza uygun tesisat ve güneş enerjisi hizmetlerini seçin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group cursor-pointer"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors`}>
                  <category.icon className="h-8 w-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
