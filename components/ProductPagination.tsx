'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationInfo } from '@/types/product';

interface ProductPaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({ pagination, onPageChange }: ProductPaginationProps) {
  const { page, totalPages } = pagination;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Gösterilecek sayfa sayısı

    if (totalPages <= showPages + 2) {
      // Tüm sayfaları göster
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // İlk sayfa
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Ortadaki sayfalar
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Son sayfa
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`p-2 rounded-lg border transition-colors ${
          page === 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Önceki sayfa"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(pageNum as number)}
                className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`p-2 rounded-lg border transition-colors ${
          page === totalPages
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        aria-label="Sonraki sayfa"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

