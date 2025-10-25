'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Package, Tag } from 'lucide-react';
import { customerProductAPI } from '@/lib/api/products';

interface ProductSearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

interface AutocompleteData {
  products: Array<{
    id: number;
    name: string;
    price: number;
    image: string | null;
    brand: string;
  }>;
  categories: Array<{ name: string; count: number }>;
  brands: Array<{ name: string; count: number }>;
  keywords: string[];
}

export default function ProductSearchBar({ onSearch, initialValue = '' }: ProductSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [autocomplete, setAutocomplete] = useState<AutocompleteData>({
    products: [],
    categories: [],
    brands: [],
    keywords: []
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        try {
          const results = await customerProductAPI.getAutocomplete(searchQuery, 10);
          console.log('Autocomplete sonuçları:', results);
          
          // Eğer autocomplete boşsa, basit ürün araması yap
          if (results.products.length === 0 && 
              results.categories.length === 0 && 
              results.brands.length === 0) {
            console.log('Autocomplete boş, basit arama yapılıyor...');
            const simpleResults = await customerProductAPI.searchProducts(searchQuery, 5);
            setAutocomplete({
              products: simpleResults.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.images && p.images.length > 0 ? p.images[0] : null,
                brand: p.brand
              })),
              categories: [],
              brands: [],
              keywords: []
            });
          } else {
            setAutocomplete(results);
          }
          
          setShowSuggestions(true);
        } catch (error) {
          console.error('Autocomplete error details:', error);
          // Geçici olarak boş sonuç göster, backend hatası UX'i bozmasın
          setAutocomplete({ products: [], categories: [], brands: [], keywords: [] });
          setShowSuggestions(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAutocomplete({ products: [], categories: [], brands: [], keywords: [] });
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
    setAutocomplete({ products: [], categories: [], brands: [], keywords: [] });
    setShowSuggestions(false);
  };

  const handleProductClick = (productId: number, productName: string) => {
    setSearchQuery(productName);
    setShowSuggestions(false);
    // Track the click
    customerProductAPI.trackSearch(searchQuery, 1, undefined, getSessionId());
    window.location.href = `/products/${productId}`;
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery(category);
    onSearch(category);
    setShowSuggestions(false);
  };

  const handleBrandClick = (brand: string) => {
    setSearchQuery(brand);
    onSearch(brand);
    setShowSuggestions(false);
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
    onSearch(keyword);
    setShowSuggestions(false);
  };

  const getSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('search_session_id');
    if (!sessionId) {
      sessionId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('search_session_id', sessionId);
    }
    return sessionId;
  };

  const hasResults = autocomplete.products.length > 0 || 
                     autocomplete.categories.length > 0 || 
                     autocomplete.brands.length > 0 || 
                     autocomplete.keywords.length > 0;

  console.log('hasResults:', hasResults, autocomplete);

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün adı, OEM kodu veya marka ara..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white font-semibold rounded-r-lg hover:bg-gray-800 transition-colors"
          >
            Ara
          </button>
        </div>
      </form>

      {/* Advanced Autocomplete Suggestions */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
              <p className="text-gray-500">Aranıyor...</p>
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Popular Keywords */}
              {autocomplete.keywords.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Popüler Aramalar</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {autocomplete.keywords.map((keyword, index) => (
                      <button
                        key={index}
                        onClick={() => handleKeywordClick(keyword)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {autocomplete.categories.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Kategoriler</h4>
                  </div>
                  <div className="space-y-1">
                    {autocomplete.categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(category.name)}
                        className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded flex items-center justify-between group"
                      >
                        <span className="text-sm text-gray-700 group-hover:text-black">{category.name}</span>
                        <span className="text-xs text-gray-400">{category.count} ürün</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {autocomplete.brands.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Markalar</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {autocomplete.brands.map((brand, index) => (
                      <button
                        key={index}
                        onClick={() => handleBrandClick(brand.name)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded text-sm text-blue-700 transition-colors"
                      >
                        {brand.name} ({brand.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {autocomplete.products.length > 0 && (
                <div className="px-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-gray-500" />
                    <h4 className="text-xs font-semibold text-gray-700 uppercase">Ürünler</h4>
                  </div>
                  <div className="space-y-1">
                    {autocomplete.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id, product.name)}
                        className="w-full px-3 py-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.brand}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-gray-900 text-sm">₺{Number(product.price).toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium mb-1">Sonuç bulunamadı</p>
              <p className="text-sm text-gray-500">Farklı anahtar kelimeler deneyin</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

