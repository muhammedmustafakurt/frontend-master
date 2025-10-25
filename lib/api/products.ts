import { Product, ProductFilters, ProductsResponse, FilterOptions } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Advanced search types
interface AdvancedSearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  vendorId?: number;
}

interface AdvancedSearchResponse {
  products: Product[];
  totalResults: number;
  searchTerm: string;
  appliedFilters: AdvancedSearchFilters;
}

interface AutocompleteResponse {
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

interface FailedSearch {
  searchTerm: string;
  timestamp: string;
  count: number;
}

export const customerProductAPI = {
  /**
   * Get products with filters and pagination
   */
  async getProducts(filters: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/customer/products?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Ürünler yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Search products by query
   */
  async searchProducts(query: string, limit: number = 10): Promise<Product[]> {
    const params = new URLSearchParams({
      q: query,
      limit: String(limit)
    });

    const response = await fetch(`${API_BASE_URL}/customer/products/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Arama yapılırken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/customer/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Ürün yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get similar products
   */
  async getSimilarProducts(id: number, limit: number = 6): Promise<Product[]> {
    const params = new URLSearchParams({
      limit: String(limit)
    });

    const response = await fetch(`${API_BASE_URL}/customer/products/${id}/similar?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Benzer ürünler yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get filter options
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const response = await fetch(`${API_BASE_URL}/customer/products/filter-options`);
    
    if (!response.ok) {
      throw new Error('Filtre seçenekleri yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/customer/products/categories`);
    
    if (!response.ok) {
      throw new Error('Kategoriler yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get all brands
   */
  async getBrands(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/customer/products/brands`);
    
    if (!response.ok) {
      throw new Error('Markalar yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  // ==================== ADVANCED SEARCH FEATURES ====================

  /**
   * Advanced search with fuzzy matching and semantic search
   */
  async advancedSearch(searchTerm: string, filters: AdvancedSearchFilters = {}, userId?: number, sessionId?: string): Promise<AdvancedSearchResponse> {
    const params = new URLSearchParams({
      q: searchTerm,
      ...(filters.category && { category: filters.category }),
      ...(filters.minPrice && { minPrice: String(filters.minPrice) }),
      ...(filters.maxPrice && { maxPrice: String(filters.maxPrice) }),
      ...(filters.vendorId && { vendorId: String(filters.vendorId) }),
      ...(userId && { userId: String(userId) }),
      ...(sessionId && { sessionId })
    });

    const response = await fetch(`${API_BASE_URL}/customer/products/advanced-search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Gelişmiş arama yapılırken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get autocomplete suggestions
   */
  async getAutocomplete(query: string, limit: number = 10): Promise<AutocompleteResponse> {
    if (!query || query.length < 2) {
      return { products: [], categories: [], brands: [], keywords: [] };
    }

    try {
      const params = new URLSearchParams({
        q: query,
        limit: String(limit)
      });

      const response = await fetch(`${API_BASE_URL}/customer/products/autocomplete?${params.toString()}`);
      
      if (!response.ok) {
        console.warn('Autocomplete endpoint error:', response.status);
        // Fallback: Boş sonuç döndür
        return { products: [], categories: [], brands: [], keywords: [] };
      }
      
      return response.json();
    } catch (error) {
      console.error('Autocomplete fetch error:', error);
      // Fallback: Boş sonuç döndür, UX'i bozma
      return { products: [], categories: [], brands: [], keywords: [] };
    }
  },

  /**
   * Get trending products
   */
  async getTrendingProducts(limit: number = 12): Promise<Product[]> {
    const params = new URLSearchParams({
      limit: String(limit)
    });

    const response = await fetch(`${API_BASE_URL}/customer/products/trending?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Trend ürünler yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Get popular searches
   */
  async getPopularSearches(query?: string, limit: number = 10): Promise<string[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('limit', String(limit));

    const response = await fetch(`${API_BASE_URL}/customer/products/popular-searches?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Popüler aramalar yüklenirken hata oluştu');
    }
    
    return response.json();
  },

  /**
   * Track search analytics
   */
  async trackSearch(searchTerm: string, resultsCount: number, userId?: number, sessionId?: string, filters?: AdvancedSearchFilters): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/products/track-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchTerm,
          resultsCount,
          userId,
          sessionId,
          filters
        })
      });
      
      if (!response.ok) {
        console.warn('Search tracking failed silently:', response.status);
      }
    } catch (error) {
      // Silent fail - analytics tracking shouldn't break user experience
      console.debug('Search tracking error (non-critical):', error);
    }
  },

  /**
   * Get failed searches (for admin/analytics)
   */
  async getFailedSearches(limit: number = 20): Promise<FailedSearch[]> {
    const params = new URLSearchParams({
      limit: String(limit)
    });

    const response = await fetch(`${API_BASE_URL}/customer/products/failed-searches?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Başarısız aramalar yüklenirken hata oluştu');
    }
    
    return response.json();
  }
};

