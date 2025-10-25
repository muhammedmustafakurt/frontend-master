"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getStockProducts, 
    getStockSummary, 
    getLowStockProducts, 
    updateStock, 
    updatePrice, 
    addStockMovement, 
    getStockHistory,
    CreateStockMovementData,
    StockSummary,
    StockMovement
} from '@/app/(app)/actions/stock';

// Query Keys
export const stockKeys = {
    all: ['stock'] as const,
    products: () => [...stockKeys.all, 'products'] as const,
    summary: () => [...stockKeys.all, 'summary'] as const,
    lowStock: (threshold?: number) => [...stockKeys.all, 'lowStock', threshold] as const,
    history: (productId: number) => [...stockKeys.all, 'history', productId] as const,
};

// Get stock products
export function useStockProducts() {
    return useQuery({
        queryKey: stockKeys.products(),
        queryFn: async () => {
            const result = await getStockProducts();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

// Get stock summary
export function useStockSummary() {
    return useQuery({
        queryKey: stockKeys.summary(),
        queryFn: async () => {
            const result = await getStockSummary();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data as StockSummary;
        },
    });
}

// Get low stock products
export function useLowStockProducts(threshold: number = 10) {
    return useQuery({
        queryKey: stockKeys.lowStock(threshold),
        queryFn: async () => {
            const result = await getLowStockProducts(threshold);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

// Get stock history
export function useStockHistory(productId: number) {
    return useQuery({
        queryKey: stockKeys.history(productId),
        queryFn: async () => {
            const result = await getStockHistory(productId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data as StockMovement[];
        },
        enabled: !!productId,
    });
}

// Update stock mutation
export function useUpdateStock() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ productId, stock }: { productId: number; stock: number }) => {
            const result = await updateStock(productId, stock);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch stock data
            queryClient.invalidateQueries({ queryKey: stockKeys.products() });
            queryClient.invalidateQueries({ queryKey: stockKeys.summary() });
            queryClient.invalidateQueries({ queryKey: stockKeys.lowStock() });
        },
    });
}

// Update price mutation
export function useUpdatePrice() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ productId, price }: { productId: number; price: number }) => {
            const result = await updatePrice(productId, price);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch stock data
            queryClient.invalidateQueries({ queryKey: stockKeys.products() });
            queryClient.invalidateQueries({ queryKey: stockKeys.summary() });
        },
    });
}

// Add stock movement mutation
export function useAddStockMovement() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (movementData: CreateStockMovementData) => {
            const result = await addStockMovement(movementData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch stock data
            queryClient.invalidateQueries({ queryKey: stockKeys.products() });
            queryClient.invalidateQueries({ queryKey: stockKeys.summary() });
            queryClient.invalidateQueries({ queryKey: stockKeys.lowStock() });
            queryClient.invalidateQueries({ queryKey: stockKeys.history(variables.productId) });
        },
    });
}
