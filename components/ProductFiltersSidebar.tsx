'use client';

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { FilterOptions, ProductFilters } from '@/types/product';

interface ProductFiltersSidebarProps {
  filterOptions: FilterOptions;
  activeFilters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function ProductFiltersSidebar({
  filterOptions,
  activeFilters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  onClose
}: ProductFiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    brands: true,
    price: true,
    vendors: false,
    rating: true,
    stock: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = activeFilters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    
    onFilterChange({ ...activeFilters, brands: newBrands, page: 1 });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    onFilterChange({ 
      ...activeFilters, 
      minPrice: min, 
      maxPrice: max,
      page: 1 
    });
  };

  const handleVendorToggle = (vendorId: number) => {
    onFilterChange({ 
      ...activeFilters, 
      vendorId: activeFilters.vendorId === vendorId ? undefined : vendorId,
      page: 1 
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({ 
      ...activeFilters, 
      minRating: activeFilters.minRating === rating ? undefined : rating,
      page: 1 
    });
  };

  const handleStockToggle = () => {
    onFilterChange({ 
      ...activeFilters, 
      inStock: !activeFilters.inStock,
      page: 1 
    });
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-3"
      >
        {title}
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && children}
    </div>
  );

  return (
    <div className={`bg-white ${isMobile ? 'h-full' : 'sticky top-4'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Temizle
          </button>
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* Kategori Filtresi */}
        <FilterSection title="Kategori" sectionKey="category">
          <div className="space-y-2">
            {filterOptions.categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onFilterChange({ 
                  ...activeFilters, 
                  category: activeFilters.category === category.name ? undefined : category.name,
                  page: 1 
                })}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeFilters.category === category.name
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className={`text-xs ${
                    activeFilters.category === category.name ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {category.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Marka Filtresi */}
        <FilterSection title="Markalar" sectionKey="brands">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filterOptions.brands.map((brand) => (
              <label
                key={brand.name}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={activeFilters.brands?.includes(brand.name) || false}
                    onChange={() => handleBrandToggle(brand.name)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">{brand.name}</span>
                </div>
                <span className="text-xs text-gray-500">{brand.count}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Fiyat Aralığı */}
        <FilterSection title="Fiyat Aralığı" sectionKey="price">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={activeFilters.minPrice || ''}
                onChange={(e) => handlePriceChange(
                  e.target.value ? Number(e.target.value) : undefined,
                  activeFilters.maxPrice
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={activeFilters.maxPrice || ''}
                onChange={(e) => handlePriceChange(
                  activeFilters.minPrice,
                  e.target.value ? Number(e.target.value) : undefined
                )}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="text-xs text-gray-500">
              Aralık: ₺{filterOptions.priceRange.min} - ₺{filterOptions.priceRange.max}
            </div>
          </div>
        </FilterSection>

        {/* Satıcılar */}
        <FilterSection title="Satıcılar" sectionKey="vendors">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filterOptions.vendors.map((vendor) => (
              <button
                key={vendor.id}
                onClick={() => handleVendorToggle(vendor.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeFilters.vendorId === vendor.id
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{vendor.name}</span>
                  <span className={`text-xs ${
                    activeFilters.vendorId === vendor.id ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {vendor.count}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(Number(vendor.rating))
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className={`text-xs ml-1 ${
                    activeFilters.vendorId === vendor.id ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {Number(vendor.rating).toFixed(1)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Rating Filtresi */}
        <FilterSection title="Değerlendirme" sectionKey="rating">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  activeFilters.minRating === rating
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm">ve üzeri</span>
                </div>
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Stok Durumu */}
        <FilterSection title="Stok Durumu" sectionKey="stock">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={activeFilters.inStock || false}
              onChange={handleStockToggle}
              className="rounded border-gray-300 text-black focus:ring-black"
            />
            <span className="text-sm text-gray-700">Sadece stokta olanları göster</span>
          </label>
        </FilterSection>
      </div>
    </div>
  );
}

