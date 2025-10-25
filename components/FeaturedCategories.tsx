'use client';

import React from 'react';
import { 
  Settings, 
  Zap, 
  Lightbulb, 
  Droplets, 
  Wrench, 
  Car, 
  Battery, 
  Shield 
} from 'lucide-react';

const categories = [
  {
    name: 'Motor & Mekanik',
    icon: Settings,
    description: 'Motor parçaları ve mekanik aksamlar',
    color: 'bg-gray-100'
  },
  {
    name: 'Fren Sistemi',
    icon: Zap,
    description: 'Fren balata, disk ve sistem parçaları',
    color: 'bg-gray-100'
  },
  {
    name: 'Elektrik & Aydınlatma',
    icon: Lightbulb,
    description: 'Elektrikli parçalar ve aydınlatma',
    color: 'bg-gray-100'
  },
  {
    name: 'Yağ & Sıvı',
    icon: Droplets,
    description: 'Motor yağları ve sıvılar',
    color: 'bg-gray-100'
  },
  {
    name: 'Filtreler',
    icon: Wrench,
    description: 'Hava, yağ ve yakıt filtreleri',
    color: 'bg-gray-100'
  },
  {
    name: 'Aksesuar',
    icon: Car,
    description: 'Araç aksesuarları ve yedek parçalar',
    color: 'bg-gray-100'
  },
  {
    name: 'Akü & Elektrik',
    icon: Battery,
    description: 'Akü ve elektrik sistemleri',
    color: 'bg-gray-100'
  },
  {
    name: 'Güvenlik',
    icon: Shield,
    description: 'Güvenlik sistemleri ve parçaları',
    color: 'bg-gray-100'
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popüler Kategoriler
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aracınız için ihtiyacınız olan tüm parçaları kategoriler halinde bulun
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
