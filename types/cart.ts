export interface CartItem {
  cartItemId: string;
  productId: number;
  vendorId: number;
  quantity: number;
  addedAt: Date;
  price: number;
  subtotal: number;
  productSnapshot: {
    name: string;
    images: string[];
    brand: string;
    sku: string;
    oemNumber: string;
    vendorName: string;
    stock: number;
  };
  validation?: {
    isAvailable: boolean;
    currentStock: number;
    currentPrice: number;
    priceChanged: boolean;
  };
}

export interface VendorSummary {
  vendorId: number;
  vendorName: string;
  itemCount: number;
  subtotal: number;
  shipping: number;
  items: CartItem[];
}

export interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  shipping: number;
  discount: number;
  grandTotal: number;
  vendors: VendorSummary[];
}

export interface Cart {
  id: string;
  items: CartItem[];
  summary: CartSummary;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  sessionId?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface MergeCartRequest {
  guestCartId: string;
}

export interface CartValidationResult {
  isValid: boolean;
  errors: CartError[];
  warnings: CartWarning[];
  updatedItems: CartItem[];
}

export interface CartError {
  type: 'OUT_OF_STOCK' | 'PRICE_CHANGED' | 'PRODUCT_UNAVAILABLE' | 'VENDOR_INACTIVE';
  itemId: string;
  productId: number;
  message: string;
  currentData: {
    availableStock?: number;
    currentPrice?: number;
    productStatus?: string;
  };
}

export interface CartWarning {
  type: 'LOW_STOCK' | 'PRICE_INCREASE' | 'PRICE_DECREASE';
  itemId: string;
  productId: number;
  message: string;
}

