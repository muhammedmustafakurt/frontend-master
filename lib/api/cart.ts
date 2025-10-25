import { 
  Cart, 
  CartSummary, 
  AddToCartRequest, 
  CartValidationResult 
} from '@/types/cart';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-production-b8a9.up.railway.app/api/v1';

// Session ID'yi localStorage'dan al veya oluştur
export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const clearSessionId = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart_session_id');
  }
};

export const cartAPI = {
  /**
   * Get user or guest cart
   */
  async getCart(isAuthenticated: boolean): Promise<Cart> {
    const url = isAuthenticated 
      ? `${API_BASE_URL}/cart`
      : `${API_BASE_URL}/cart/guest?sessionId=${getSessionId()}`;

    const response = await fetch(url, {
      credentials: 'include',
      headers: isAuthenticated ? {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      } : {}
    });

    if (!response.ok) {
      throw new Error('Sepet yüklenirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Add item to cart
   */
  async addItem(productId: number, quantity: number, isAuthenticated: boolean): Promise<Cart> {
    const body: AddToCartRequest = {
      productId,
      quantity,
      sessionId: isAuthenticated ? undefined : getSessionId()
    };

    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isAuthenticated && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        })
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sepete eklenirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: string, quantity: number, isAuthenticated: boolean): Promise<Cart> {
    const sessionId = isAuthenticated ? '' : getSessionId();
    const url = `${API_BASE_URL}/cart/items/${itemId}${sessionId ? `?sessionId=${sessionId}` : ''}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(isAuthenticated && {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        })
      },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sepet güncellenirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string, isAuthenticated: boolean): Promise<Cart> {
    const sessionId = isAuthenticated ? '' : getSessionId();
    const url = `${API_BASE_URL}/cart/items/${itemId}${sessionId ? `?sessionId=${sessionId}` : ''}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: isAuthenticated ? {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      } : {},
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Ürün silinirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Clear cart
   */
  async clearCart(isAuthenticated: boolean): Promise<Cart> {
    const sessionId = isAuthenticated ? '' : getSessionId();
    const url = `${API_BASE_URL}/cart/items${sessionId ? `?sessionId=${sessionId}` : ''}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: isAuthenticated ? {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      } : {},
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Sepet temizlenirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Merge guest cart with user cart after login
   */
  async mergeCarts(guestCartId: string): Promise<Cart> {
    const response = await fetch(`${API_BASE_URL}/cart/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      credentials: 'include',
      body: JSON.stringify({ guestCartId })
    });

    if (!response.ok) {
      throw new Error('Sepetler birleştirilirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Get cart summary (for mini cart)
   */
  async getCartSummary(isAuthenticated: boolean): Promise<CartSummary> {
    const sessionId = isAuthenticated ? '' : getSessionId();
    const url = `${API_BASE_URL}/cart/summary${sessionId ? `?sessionId=${sessionId}` : ''}`;

    const response = await fetch(url, {
      headers: isAuthenticated ? {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      } : {},
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Sepet özeti yüklenirken hata oluştu');
    }

    return response.json();
  },

  /**
   * Validate cart (check stock, prices)
   */
  async validateCart(isAuthenticated: boolean): Promise<CartValidationResult> {
    const sessionId = isAuthenticated ? '' : getSessionId();
    const url = `${API_BASE_URL}/cart/validation${sessionId ? `?sessionId=${sessionId}` : ''}`;

    const response = await fetch(url, {
      headers: isAuthenticated ? {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      } : {},
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Sepet doğrulanırken hata oluştu');
    }

    return response.json();
  }
};

