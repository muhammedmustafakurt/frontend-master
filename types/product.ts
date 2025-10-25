export interface Product {
  id: number;
  vendorId: number;
  name: string;
  category: string;
  brand: string;
  sku: string;
  oemNumber: string;
  compatibleVehicles: string[];
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  totalSales: number;
  specifications: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vendor: {
    id: number;
    name: string;
    rating?: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  vendorId?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'rating' | 'createdAt' | 'popularity' | 'totalSales';
  sortOrder?: 'ASC' | 'DESC';
  compatibleWith?: string;
  minRating?: number;
  oemNumber?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOption {
  name: string;
  count: number;
}

export interface VendorFilterOption {
  id: number;
  name: string;
  rating: number;
  count: number;
}

export interface FilterOptions {
  categories: FilterOption[];
  brands: FilterOption[];
  priceRange: {
    min: number;
    max: number;
  };
  vendors: VendorFilterOption[];
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
  filters: FilterOptions;
}

