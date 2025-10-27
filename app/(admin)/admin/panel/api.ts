// API hooks for admin panel backend integration
// This file contains all the API calls needed for the admin panel

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';

// Generic API call helper
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Dashboard Analytics API
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async () => {
    return apiCall('/admin/analytics/stats');
  },

  // Get revenue chart data
  getRevenueChart: async (period: 'week' | 'month' | 'year' = 'month') => {
    return apiCall(`/admin/analytics/revenue?period=${period}`);
  },

  // Get signup chart data
  getSignupChart: async (period: 'week' | 'month' | 'year' = 'month') => {
    return apiCall(`/admin/analytics/signups?period=${period}`);
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10) => {
    return apiCall(`/admin/analytics/activity?limit=${limit}`);
  },

  // Get pending approvals count
  getPendingApprovals: async () => {
    return apiCall('/admin/analytics/pending');
  },
};

// Vendor Management API
export const vendorAPI = {
  // Get all vendors with pagination and filters
  getVendors: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    sortBy?: 'name' | 'joinDate' | 'products';
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/vendors${queryString ? `?${queryString}` : ''}`);
  },

  // Get single vendor details
  getVendor: async (vendorId: number) => {
    return apiCall(`/admin/vendors/${vendorId}`);
  },

  // Approve vendor
  approveVendor: async (vendorId: number) => {
    return apiCall(`/admin/vendors/${vendorId}/approve`, {
      method: 'POST',
    });
  },

  // Reject vendor
  rejectVendor: async (vendorId: number, reason?: string) => {
    return apiCall(`/admin/vendors/${vendorId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Update vendor details
  updateVendor: async (vendorId: number, data: {
    name?: string;
    email?: string;
    companyName?: string;
    phone?: string;
    address?: string;
  }) => {
    return apiCall(`/admin/vendors/${vendorId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete vendor
  deleteVendor: async (vendorId: number) => {
    return apiCall(`/admin/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },

  // Get vendor's products
  getVendorProducts: async (vendorId: number, params: {
    page?: number;
    limit?: number;
    status?: 'all' | 'active' | 'pending' | 'rejected';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/vendors/${vendorId}/products${queryString ? `?${queryString}` : ''}`);
  },
};

// Product Management API
export const productAPI = {
  // Get all products with pagination and filters
  getProducts: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    vendor?: number;
    status?: 'all' | 'active' | 'pending' | 'rejected';
    sortBy?: 'name' | 'price' | 'createdAt' | 'vendor';
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get single product details
  getProduct: async (productId: number) => {
    return apiCall(`/admin/products/${productId}`);
  },

  // Approve product
  approveProduct: async (productId: number) => {
    return apiCall(`/admin/products/${productId}/approve`, {
      method: 'POST',
    });
  },

  // Reject product
  rejectProduct: async (productId: number, reason?: string) => {
    return apiCall(`/admin/products/${productId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Update product details
  updateProduct: async (productId: number, data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    stock?: number;
    status?: 'active' | 'inactive';
  }) => {
    return apiCall(`/admin/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete product
  deleteProduct: async (productId: number) => {
    return apiCall(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  // Bulk actions on products
  bulkAction: async (productIds: number[], action: 'approve' | 'reject' | 'activate' | 'deactivate') => {
    return apiCall('/admin/products/bulk', {
      method: 'POST',
      body: JSON.stringify({ productIds, action }),
    });
  },

  // Get product categories
  getCategories: async () => {
    return apiCall('/admin/products/categories');
  },
};

// Customer Management API
export const customerAPI = {
  // Get all customers with pagination and filters
  getCustomers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'active' | 'blocked';
    sortBy?: 'name' | 'email' | 'joinDate' | 'totalSpent';
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/customers${queryString ? `?${queryString}` : ''}`);
  },

  // Get single customer details
  getCustomer: async (customerId: number) => {
    return apiCall(`/admin/customers/${customerId}`);
  },

  // Block customer
  blockCustomer: async (customerId: number, reason?: string) => {
    return apiCall(`/admin/customers/${customerId}/block`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Unblock customer
  unblockCustomer: async (customerId: number) => {
    return apiCall(`/admin/customers/${customerId}/unblock`, {
      method: 'POST',
    });
  },

  // Get customer's order history
  getCustomerOrders: async (customerId: number, params: {
    page?: number;
    limit?: number;
    status?: 'all' | 'pending' | 'completed' | 'cancelled';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/customers/${customerId}/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Update customer details
  updateCustomer: async (customerId: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    return apiCall(`/admin/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};

// Order Management API
export const orderAPI = {
  // Get all orders with pagination and filters
  getOrders: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    vendor?: number;
    customer?: number;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'createdAt' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  // Get single order details
  getOrder: async (orderId: number) => {
    return apiCall(`/admin/orders/${orderId}`);
  },

  // Update order status
  updateOrderStatus: async (orderId: number, status: string, notes?: string) => {
    return apiCall(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Cancel order
  cancelOrder: async (orderId: number, reason?: string) => {
    return apiCall(`/admin/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Get order statistics
  getOrderStats: async (period: 'week' | 'month' | 'year' = 'month') => {
    return apiCall(`/admin/orders/stats?period=${period}`);
  },
};

// Admin Settings API
export const adminAPI = {
  // Get admin profile
  getProfile: async () => {
    return apiCall('/admin/profile');
  },

  // Update admin profile
  updateProfile: async (data: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    return apiCall('/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Get system settings
  getSettings: async () => {
    return apiCall('/admin/settings');
  },

  // Update system settings
  updateSettings: async (settings: {
    siteName?: string;
    siteDescription?: string;
    maintenanceMode?: boolean;
    registrationEnabled?: boolean;
    vendorApprovalRequired?: boolean;
  }) => {
    return apiCall('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
  },

  // Get admin activity log
  getActivityLog: async (params: {
    page?: number;
    limit?: number;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    return apiCall(`/admin/activity${queryString ? `?${queryString}` : ''}`);
  },
};

// Export all APIs
export default {
  dashboard: dashboardAPI,
  vendors: vendorAPI,
  products: productAPI,
  customers: customerAPI,
  orders: orderAPI,
  admin: adminAPI,
};
