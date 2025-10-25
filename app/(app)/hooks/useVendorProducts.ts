"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getVendorProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    softDeleteProduct,
    type Product,
    type CreateProductData,
    type UpdateProductData
} from '../actions/products';

// Query keys
export const productKeys = {
    all: ['products'] as const,
    lists: () => [...productKeys.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...productKeys.lists(), { filters }] as const,
    details: () => [...productKeys.all, 'detail'] as const,
    detail: (id: number) => [...productKeys.details(), id] as const,
};

// Get all vendor products
export function useVendorProducts() {
    return useQuery({
        queryKey: productKeys.lists(),
        queryFn: async () => {
            const result = await getVendorProducts();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Get single product
export function useProduct(id: number) {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: async () => {
            const result = await getProduct(id);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
}

// Create product mutation
export function useCreateProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (productData: CreateProductData) => {
            const result = await createProduct(productData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch products list
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

// Update product mutation
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateProductData }) => {
            const result = await updateProduct(id, data);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: (data, variables) => {
            // Update the specific product in cache
            queryClient.setQueryData(productKeys.detail(variables.id), data);
            // Invalidate products list
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

// Delete product mutation
export function useDeleteProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: number) => {
            const result = await deleteProduct(id);
            if (!result.success) {
                throw new Error(result.error);
            }
        },
        onSuccess: (_, id) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: productKeys.detail(id) });
            // Invalidate products list
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}

// Soft delete product mutation
export function useSoftDeleteProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (id: number) => {
            const result = await softDeleteProduct(id);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: (data, id) => {
            // Update the specific product in cache
            queryClient.setQueryData(productKeys.detail(id), data);
            // Invalidate products list
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
    });
}
