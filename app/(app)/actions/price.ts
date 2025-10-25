"use server";
import { cookies } from 'next/headers';

// Helper function to get auth headers
async function getAuthHeaders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
        throw new Error('Authentication required');
    }
    
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

// Get API URL
function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
}

// Types
export interface PriceHistory {
    id: number;
    productId: number;
    vendorId: number;
    changeType: 'MANUAL' | 'BULK_UPDATE' | 'DISCOUNT_APPLIED' | 'DISCOUNT_REMOVED' | 'PERCENTAGE_INCREASE' | 'PERCENTAGE_DECREASE' | 'FIXED_PRICE';
    previousPrice: number;
    newPrice: number;
    discountPrice?: number;
    discountPercentage?: number;
    notes?: string;
    bulkUpdateReason?: string;
    createdAt: string;
    product: {
        id: number;
        name: string;
        sku: string;
    };
}

export interface PriceSummary {
    totalProducts: number;
    averagePrice: number;
    highestPrice: number;
    lowestPrice: number;
    totalValue: number;
    discountedProducts: number;
}

export interface UpdatePriceData {
    price: number;
    notes?: string;
}

export interface SetDiscountData {
    discountPrice: number;
    notes?: string;
}

export interface SetDiscountPercentageData {
    discountPercentage: number;
    notes?: string;
}

export interface BulkPriceUpdateData {
    percentage?: number;
    fixedPrice?: number;
    type: 'PERCENTAGE' | 'FIXED';
    reason?: string;
    productIds?: number[];
}

// Get vendor products for price management
export async function getPriceProducts(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/products`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch products' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get price products error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get price summary
export async function getPriceSummary(): Promise<{ success: boolean; data?: PriceSummary; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/summary`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch price summary' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get price summary error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get high price products
export async function getHighPriceProducts(threshold: number = 1000): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/high-price?threshold=${threshold}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch high price products' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get high price products error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get low price products
export async function getLowPriceProducts(threshold: number = 100): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/low-price?threshold=${threshold}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch low price products' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get low price products error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Update product price
export async function updatePrice(productId: number, priceData: UpdatePriceData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/products/${productId}/price`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(priceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to update price' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Update price error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Set discount price
export async function setDiscount(productId: number, discountData: SetDiscountData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/products/${productId}/discount`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(discountData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to set discount' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Set discount error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Set discount percentage
export async function setDiscountPercentage(productId: number, discountData: SetDiscountPercentageData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/products/${productId}/discount-percentage`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(discountData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to set discount percentage' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Set discount percentage error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Bulk update prices
export async function bulkUpdatePrices(bulkUpdateData: BulkPriceUpdateData): Promise<{ success: boolean; data?: { updated: number; failed: number }; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/bulk-update`, {
            method: 'POST',
            headers,
            body: JSON.stringify(bulkUpdateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to bulk update prices' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Bulk update prices error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get price history for a product
export async function getPriceHistory(productId: number): Promise<{ success: boolean; data?: PriceHistory[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/price/products/${productId}/history`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch price history' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get price history error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}
