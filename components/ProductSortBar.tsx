'use client';

import React from 'react';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { ProductFilters } from '@/types/product';

interface ProductSortBarProps {
  totalResults: number;
  activeFilters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onToggleFilters?: () => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const sortOptions = [
  { value: 'createdAt-DESC', label: 'Önerilen', sortBy: 'createdAt' as const, sortOrder: 'DESC' as const },
  { value: 'price-ASC', label: 'En Düşük Fiyat', sortBy: 'price' as const, sortOrder: 'ASC' as const },
  { value: 'price-DESC', label: 'En Yüksek Fiyat', sortBy: 'price' as const, sortOrder: 'DESC' as const },
  { value: 'rating-DESC', label: 'En Yüksek Puan', sortBy: 'rating' as const, sortOrder: 'DESC' as const },
  { value: 'totalSales-DESC', label: 'En Çok Satan', sortBy: 'totalSales' as const, sortOrder: 'DESC' as const },
  { value: 'name-ASC', label: 'İsme Göre (A-Z)', sortBy: 'name' as const, sortOrder: 'ASC' as const },
  { value: 'name-DESC', label: 'İsme Göre (Z-A)', sortBy: 'name' as const, sortOrder: 'DESC' as const },
];

export default function ProductSortBar({
  totalResults,
  activeFilters,
  onFilterChange,
  onToggleFilters,
  viewMode = 'grid',
  onViewModeChange
}: ProductSortBarProps) {
  const currentSortValue = `${activeFilters.sortBy || 'createdAt'}-${activeFilters.sortOrder || 'DESC'}`;

  const handleSortChange = (value: string) => {
    const option = sortOptions.find(opt => opt.value === value);
    if (option) {
      onFilterChange({
        ...activeFilters,
        sortBy: option.sortBy,
        sortOrder: option.sortOrder,
        page: 1
      });
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4 px-4 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Side - Results Count & Filter Toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          {onToggleFilters && (
            <button
              onClick={onToggleFilters}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span className="font-medium">Filtreler</span>
            </button>
          )}

          {/* Results Count */}
          <div className="text-gray-600">
            <span className="font-semibold text-gray-900">{totalResults}</span> ürün bulundu
          </div>
        </div>

        {/* Right Side - Sort & View Mode */}
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
              Sıralama:
            </label>
            <select
              id="sort"
              value={currentSortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle - Desktop Only */}
          {onViewModeChange && (
            <div className="hidden md:flex items-center gap-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid görünümü"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Liste görünümü"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilters.category || activeFilters.brands?.length || activeFilters.minPrice || activeFilters.maxPrice || activeFilters.search) && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Aktif Filtreler:</span>
          
          {activeFilters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full">
              {activeFilters.category}
              <button
                onClick={() => onFilterChange({ ...activeFilters, category: undefined, page: 1 })}
                className="hover:bg-gray-800 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilters.brands?.map((brand) => (
            <span key={brand} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
              {brand}
              <button
                onClick={() => {
                  const newBrands = activeFilters.brands?.filter(b => b !== brand);
                  onFilterChange({ ...activeFilters, brands: newBrands, page: 1 });
                }}
                className="hover:bg-gray-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {(activeFilters.minPrice || activeFilters.maxPrice) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
              ₺{activeFilters.minPrice || 0} - ₺{activeFilters.maxPrice || '∞'}
              <button
                onClick={() => onFilterChange({ ...activeFilters, minPrice: undefined, maxPrice: undefined, page: 1 })}
                className="hover:bg-gray-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-sm rounded-full">
              "{activeFilters.search}"
              <button
                onClick={() => onFilterChange({ ...activeFilters, search: undefined, page: 1 })}
                className="hover:bg-gray-700 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

