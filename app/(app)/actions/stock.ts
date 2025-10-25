"use server";
import { cookies } from 'next/headers';
import type { Product } from './products';

// Re-export Product type for convenience
export type { Product };

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
    return process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
}

// Types
export interface StockMovement {
    id: number;
    productId: number;
    vendorId: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
    reason: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGED' | 'EXPIRED' | 'THEFT' | 'OTHER';
    quantity: number;
    unitPrice?: number;
    notes?: string;
    previousStock: number;
    newStock: number;
    createdAt: string;
    product: {
        id: number;
        name: string;
        sku: string;
    };
}

export interface StockSummary {
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalValue: number;
}

export interface CreateStockMovementData {
    productId: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN';
    reason: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGED' | 'EXPIRED' | 'THEFT' | 'OTHER';
    quantity: number;
    unitPrice?: number;
    notes?: string;
}

// Get vendor products for stock management
export async function getStockProducts(): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/products`, {
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
        console.error('Get stock products error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get stock summary
export async function getStockSummary(): Promise<{ success: boolean; data?: StockSummary; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/summary`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch stock summary' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get stock summary error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get low stock products
export async function getLowStockProducts(threshold: number = 10): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/low-stock?threshold=${threshold}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch low stock products' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get low stock products error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Update product stock
export async function updateStock(productId: number, stock: number): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/products/${productId}/stock`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ stock }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to update stock' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Update stock error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Update product price
export async function updatePrice(productId: number, price: number): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/products/${productId}/price`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ price }),
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

// Add stock movement
export async function addStockMovement(movementData: CreateStockMovementData): Promise<{ success: boolean; data?: StockMovement; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/movements`, {
            method: 'POST',
            headers,
            body: JSON.stringify(movementData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to add stock movement' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Add stock movement error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get stock history for a product
export async function getStockHistory(productId: number): Promise<{ success: boolean; data?: StockMovement[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/stock/products/${productId}/history`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch stock history' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get stock history error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}
