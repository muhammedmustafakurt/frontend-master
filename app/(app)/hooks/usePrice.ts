"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getPriceProducts, 
    getPriceSummary, 
    getHighPriceProducts, 
    getLowPriceProducts,
    updatePrice, 
    setDiscount, 
    setDiscountPercentage,
    bulkUpdatePrices, 
    getPriceHistory,
    UpdatePriceData,
    SetDiscountData,
    SetDiscountPercentageData,
    BulkPriceUpdateData,
    PriceSummary,
    PriceHistory
} from '@/app/(app)/actions/price';

// Query Keys
export const priceKeys = {
    all: ['price'] as const,
    products: () => [...priceKeys.all, 'products'] as const,
    summary: () => [...priceKeys.all, 'summary'] as const,
    highPrice: (threshold?: number) => [...priceKeys.all, 'highPrice', threshold] as const,
    lowPrice: (threshold?: number) => [...priceKeys.all, 'lowPrice', threshold] as const,
    history: (productId: number) => [...priceKeys.all, 'history', productId] as const,
};

// Get price products
export function usePriceProducts() {
    return useQuery({
        queryKey: priceKeys.products(),
        queryFn: async () => {
            const result = await getPriceProducts();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

// Get price summary
export function usePriceSummary() {
    return useQuery({
        queryKey: priceKeys.summary(),
        queryFn: async () => {
            const result = await getPriceSummary();
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data as PriceSummary;
        },
    });
}

// Get high price products
export function useHighPriceProducts(threshold: number = 1000) {
    return useQuery({
        queryKey: priceKeys.highPrice(threshold),
        queryFn: async () => {
            const result = await getHighPriceProducts(threshold);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

// Get low price products
export function useLowPriceProducts(threshold: number = 100) {
    return useQuery({
        queryKey: priceKeys.lowPrice(threshold),
        queryFn: async () => {
            const result = await getLowPriceProducts(threshold);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
    });
}

// Get price history
export function usePriceHistory(productId: number) {
    return useQuery({
        queryKey: priceKeys.history(productId),
        queryFn: async () => {
            const result = await getPriceHistory(productId);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data as PriceHistory[];
        },
        enabled: !!productId,
    });
}

// Update price mutation
export function useUpdatePrice() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ productId, priceData }: { productId: number; priceData: UpdatePriceData }) => {
            const result = await updatePrice(productId, priceData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch price data
            queryClient.invalidateQueries({ queryKey: priceKeys.products() });
            queryClient.invalidateQueries({ queryKey: priceKeys.summary() });
            queryClient.invalidateQueries({ queryKey: priceKeys.highPrice() });
            queryClient.invalidateQueries({ queryKey: priceKeys.lowPrice() });
        },
    });
}

// Set discount mutation
export function useSetDiscount() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ productId, discountData }: { productId: number; discountData: SetDiscountData }) => {
            const result = await setDiscount(productId, discountData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch price data
            queryClient.invalidateQueries({ queryKey: priceKeys.products() });
            queryClient.invalidateQueries({ queryKey: priceKeys.summary() });
            queryClient.invalidateQueries({ queryKey: priceKeys.history(variables.productId) });
        },
    });
}

// Set discount percentage mutation
export function useSetDiscountPercentage() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ productId, discountData }: { productId: number; discountData: SetDiscountPercentageData }) => {
            const result = await setDiscountPercentage(productId, discountData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: (_, variables) => {
            // Invalidate and refetch price data
            queryClient.invalidateQueries({ queryKey: priceKeys.products() });
            queryClient.invalidateQueries({ queryKey: priceKeys.summary() });
            queryClient.invalidateQueries({ queryKey: priceKeys.history(variables.productId) });
        },
    });
}

// Bulk update prices mutation
export function useBulkUpdatePrices() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (bulkUpdateData: BulkPriceUpdateData) => {
            const result = await bulkUpdatePrices(bulkUpdateData);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result.data;
        },
        onSuccess: () => {
            // Invalidate and refetch all price data
            queryClient.invalidateQueries({ queryKey: priceKeys.products() });
            queryClient.invalidateQueries({ queryKey: priceKeys.summary() });
            queryClient.invalidateQueries({ queryKey: priceKeys.highPrice() });
            queryClient.invalidateQueries({ queryKey: priceKeys.lowPrice() });
        },
    });
}
