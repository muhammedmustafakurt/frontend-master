"use client";
import { useState, useMemo } from 'react';
import { usePriceProducts, usePriceSummary, useUpdatePrice, useBulkUpdatePrices } from '@/app/(app)/hooks/usePrice';
import { Product } from '@/app/(app)/actions/price';
import PriceHistoryModal from './components/PriceHistoryModal';
import BulkUpdateModal from './components/BulkUpdateModal';
import PriceSummaryCards from './components/PriceSummaryCards';
import ProductPriceTable from './components/ProductPriceTable';

interface BulkUpdateData {
    type: 'PERCENTAGE' | 'FIXED';
    percentage?: number;
    fixedPrice?: number;
    reason?: string;
}

export default function PriceManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
    const [priceFilter, setPriceFilter] = useState<'all' | 'high' | 'low' | 'discounted'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

    const { data: products, isLoading: productsLoading, error: productsError } = usePriceProducts();
    const { data: summary, isLoading: summaryLoading } = usePriceSummary();
    const updatePriceMutation = useUpdatePrice();
    const bulkUpdateMutation = useBulkUpdatePrices();

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        if (!products) return [];

        const filtered = products.filter(product => {
            // Search filter
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.brand.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

            // Price filter
            let matchesPrice = true;
            if (priceFilter === 'high') matchesPrice = product.price > 1000;
            else if (priceFilter === 'low') matchesPrice = product.price < 100;
            else if (priceFilter === 'discounted') matchesPrice = product.price < 100; // You can adjust this logic

            return matchesSearch && matchesStatus && matchesPrice;
        });

        // Sort products
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'createdAt':
                    aValue = new Date(a.createdAt).getTime();
                    bValue = new Date(b.createdAt).getTime();
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [products, searchTerm, statusFilter, priceFilter, sortBy, sortOrder]);

    const handlePriceUpdate = async (productId: number, newPrice: number, notes?: string) => {
        try {
            await updatePriceMutation.mutateAsync({ 
                productId, 
                priceData: { price: newPrice, notes } 
            });
        } catch (error) {
            console.error('Failed to update price:', error);
        }
    };

    const handleViewHistory = (product: Product) => {
        setSelectedProductId(product.id);
    };

    const handleBulkUpdate = () => {
        setShowBulkUpdateModal(true);
    };

    const handleBulkUpdateSubmit = async (bulkUpdateData: BulkUpdateData) => {
        try {
            const result = await bulkUpdateMutation.mutateAsync({
                ...bulkUpdateData,
                productIds: selectedProducts.length > 0 ? selectedProducts : undefined
            });
            
            if (result) {
                alert(`Bulk update completed: ${result.updated} products updated, ${result.failed} failed`);
            }
            setShowBulkUpdateModal(false);
            setSelectedProducts([]);
        } catch (error) {
            console.error('Bulk update failed:', error);
        }
    };

    const handleProductSelect = (productId: number, selected: boolean) => {
        if (selected) {
            setSelectedProducts(prev => [...prev, productId]);
        } else {
            setSelectedProducts(prev => prev.filter(id => id !== productId));
        }
    };

    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedProducts(filteredAndSortedProducts.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    if (productsLoading || summaryLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-lg shadow p-6">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (productsError) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-red-800 mb-2">Hata</h2>
                        <p className="text-red-600">{productsError.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Fiyat Yönetimi</h1>
                            <p className="text-gray-600 mt-2">Ürün fiyatlarınızı yönetin ve takip edin</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleBulkUpdate}
                                disabled={bulkUpdateMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                Toplu Güncelleme
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                {summary && <PriceSummaryCards summary={summary} />}

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                    Arama
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Ürün adı, SKU veya marka..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Durum
                                </label>
                                <select
                                    id="status"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'draft')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tümü</option>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Pasif</option>
                                    <option value="draft">Taslak</option>
                                </select>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fiyat Durumu
                                </label>
                                <select
                                    id="price"
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value as 'all' | 'high' | 'low' | 'discounted')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tümü</option>
                                    <option value="high">Yüksek (&gt;1000₺)</option>
                                    <option value="low">Düşük (&lt;100₺)</option>
                                    <option value="discounted">İndirimli</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sırala
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'createdAt')}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="name">İsim</option>
                                        <option value="price">Fiyat</option>
                                        <option value="createdAt">Tarih</option>
                                    </select>
                                    <button
                                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <ProductPriceTable
                    products={filteredAndSortedProducts}
                    onPriceUpdate={handlePriceUpdate}
                    onViewHistory={handleViewHistory}
                    onProductSelect={handleProductSelect}
                    onSelectAll={handleSelectAll}
                    selectedProducts={selectedProducts}
                    isUpdating={updatePriceMutation.isPending}
                />

                {/* Modals */}
                {selectedProductId && (
                    <PriceHistoryModal
                        productId={selectedProductId}
                        isOpen={!!selectedProductId}
                        onClose={() => setSelectedProductId(null)}
                    />
                )}

                {showBulkUpdateModal && (
                    <BulkUpdateModal
                        isOpen={showBulkUpdateModal}
                        onClose={() => setShowBulkUpdateModal(false)}
                        onSubmit={handleBulkUpdateSubmit}
                        selectedCount={selectedProducts.length}
                        totalCount={filteredAndSortedProducts.length}
                    />
                )}
            </div>
        </div>
    );
}
