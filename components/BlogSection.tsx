'use client';

import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Balata Ne Zaman Değişir?',
    excerpt: 'Fren balatalarının değişim zamanı ve işaretleri hakkında bilmeniz gerekenler.',
    author: 'Mehmet Yılmaz',
    date: '15 Aralık 2024',
    readTime: '5 dk okuma',
    category: 'Bakım Rehberi',
    image: '/api/placeholder/400/250'
  },
  {
    id: 2,
    title: 'Motor Yağı Seçimi Nasıl Yapılır?',
    excerpt: 'Aracınız için doğru motor yağını seçmenin püf noktaları ve önemli detaylar.',
    author: 'Ayşe Demir',
    date: '12 Aralık 2024',
    readTime: '7 dk okuma',
    category: 'Teknik Rehber',
    image: '/api/placeholder/400/250'
  },
  {
    id: 3,
    title: 'Kış Lastiği Ne Zaman Takılır?',
    excerpt: 'Kış lastiği takma zamanı, seçimi ve güvenli sürüş için önemli ipuçları.',
    author: 'Ali Kaya',
    date: '10 Aralık 2024',
    readTime: '6 dk okuma',
    category: 'Güvenlik',
    image: '/api/placeholder/400/250'
  }
];

export default function BlogSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blog & Rehber
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Araç bakımı ve yedek parça konularında uzman tavsiyeleri
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Blog Image */}
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Blog Görseli</span>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {post.readTime}
                  </span>
                  <button className="flex items-center text-black font-semibold hover:text-gray-700 transition-colors">
                    Devamını Oku
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
