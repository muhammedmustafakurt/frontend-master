'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import ProductFiltersSidebar from '../../../components/ProductFiltersSidebar';
import ProductSearchBar from '../../../components/ProductSearchBar';
import ProductSortBar from '../../../components/ProductSortBar';
import ProductPagination from '../../../components/ProductPagination';
import { customerProductAPI } from '../../../lib/api/products';
import { Product, ProductFilters, ProductsResponse } from '../../../types/product';
import { Loader2 } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get filters from URL
  const getFiltersFromURL = (): ProductFilters => {
    return {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 24,
      category: searchParams.get('category') || undefined,
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      vendorId: searchParams.get('vendorId') ? parseInt(searchParams.get('vendorId')!) : undefined,
      inStock: searchParams.get('inStock') === 'true' || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'DESC',
      compatibleWith: searchParams.get('compatibleWith') || undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      oemNumber: searchParams.get('oemNumber') || undefined,
    };
  };

  const [activeFilters, setActiveFilters] = useState<ProductFilters>(getFiltersFromURL());

  // Update URL when filters change
  const updateURL = (filters: ProductFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(key, value.join(','));
          }
        } else {
          params.set(key, String(value));
        }
      }
    });

    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await customerProductAPI.getProducts(activeFilters);
        setProductsData(data);
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilters]);

  // Update filters from URL on mount and URL change
  useEffect(() => {
    setActiveFilters(getFiltersFromURL());
  }, [searchParams]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setActiveFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: ProductFilters = {
      page: 1,
      limit: 24,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    };
    setActiveFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...activeFilters, page };
    setActiveFilters(newFilters);
    updateURL(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (query: string) => {
    const newFilters = { ...activeFilters, search: query || undefined, page: 1 };
    setActiveFilters(newFilters);
    updateURL(newFilters);
    
    // Track search analytics
    if (query) {
      const sessionId = getSearchSessionId();
      setTimeout(async () => {
        const resultsCount = productsData?.pagination.total || 0;
        await customerProductAPI.trackSearch(query, resultsCount, undefined, sessionId, newFilters);
      }, 1000);
    }
  };

  const getSearchSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sessionId = localStorage.getItem('search_session_id');
    if (!sessionId) {
      sessionId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('search_session_id', sessionId);
    }
    return sessionId;
  };

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuickView = (product: Product) => {
    console.log('Hızlı görünüm:', product);
    // Modal açılabilir veya detay sayfasına yönlendirme yapılabilir
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductSearchBar 
            onSearch={handleSearch}
            initialValue={activeFilters.search}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            {productsData && (
              <ProductFiltersSidebar
                filterOptions={productsData.filters}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            )}
          </aside>

          {/* Products Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Bar */}
            {productsData && (
              <ProductSortBar
                totalResults={productsData.pagination.total}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onToggleFilters={() => setShowMobileFilters(true)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {/* Products Grid/List */}
            <div className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Tekrar Dene
                  </button>
                </div>
              ) : productsData && productsData.products.length > 0 ? (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}>
                    {productsData.products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onToggleFavorite={handleToggleFavorite}
                        onQuickView={handleQuickView}
                        isFavorite={favorites.includes(product.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <ProductPagination
                    pagination={productsData.pagination}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-4">Ürün bulunamadı</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && productsData && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <ProductFiltersSidebar
                filterOptions={productsData.filters}
                activeFilters={activeFilters}
                onFilterChange={(filters) => {
                  handleFilterChange(filters);
                  setShowMobileFilters(false);
                }}
                onClearFilters={() => {
                  handleClearFilters();
                  setShowMobileFilters(false);
                }}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

