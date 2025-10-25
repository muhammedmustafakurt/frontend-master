'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    location: 'İstanbul',
    rating: 5,
    comment: 'Çok hızlı kargo ve kaliteli ürünler. Aracım için ihtiyacım olan tüm parçaları buldum. Kesinlikle tavsiye ederim.',
    car: '2018 BMW 3 Series'
  },
  {
    id: 2,
    name: 'Fatma Demir',
    location: 'Ankara',
    rating: 5,
    comment: 'Müşteri hizmetleri çok ilgili ve yardımcı. Ürün uyumluluğu konusunda endişem vardı ama hiç sorun yaşamadım.',
    car: '2020 Toyota Corolla'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    location: 'İzmir',
    rating: 5,
    comment: 'Fiyatlar çok uygun ve ürün kalitesi mükemmel. Aynı gün kargo ile teslimat aldım. Teşekkürler!',
    car: '2019 Volkswagen Golf'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Memnun müşterilerimizin deneyimleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <Quote className="h-8 w-8 text-gray-300" />
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 text-center mb-6 italic">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500 mb-1">
                  {testimonial.location}
                </p>
                <p className="text-xs text-gray-400">
                  {testimonial.car}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
