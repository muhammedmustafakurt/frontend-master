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
    return process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-production-b8a9.up.railway.app/api/v1';
}

// Types
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
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductData {
    name: string;
    category: string;
    brand: string;
    sku: string;
    oemNumber: string;
    compatibleVehicles?: string[];
    price: number;
    stock: number;
    status?: 'active' | 'inactive' | 'draft';
    description?: string;
    images?: string[];
}

export type UpdateProductData = Partial<CreateProductData>;

// Get all vendor products
export async function getVendorProducts(): Promise<{ success: boolean; data?: Product[]; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/products`, {
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
        console.error('Get products error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Get single product
export async function getProduct(id: number): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/products/${id}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to fetch product' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get product error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Create product
export async function createProduct(productData: CreateProductData): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/products`, {
            method: 'POST',
            headers,
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to create product' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Create product error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Update product
export async function updateProduct(id: number, productData: UpdateProductData): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/products/${id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to update product' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Update product error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Delete product
export async function deleteProduct(id: number): Promise<{ success: boolean; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/products/${id}`, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to delete product' };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete product error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}

// Soft delete product
export async function softDeleteProduct(id: number): Promise<{ success: boolean; data?: Product; error?: string }> {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${getApiUrl()}/vendor/products/${id}/soft-delete`, {
            method: 'PATCH',
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData.message || 'Failed to soft delete product' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('Soft delete product error:', error);
        return { success: false, error: 'Network error occurred' };
    }
}
