"use client";
import { useState, useMemo } from 'react';
import { useStockProducts, useStockSummary, useUpdateStock, useUpdatePrice } from '@/app/(app)/hooks/useStock';
import StockHistoryModal from './components/StockHistoryModal';
import AddStockMovementModal from './components/AddStockMovementModal';
import StockSummaryCards from './components/StockSummaryCards';
import ProductStockTable from './components/ProductStockTable';

interface ProductForMovement {
    id: number;
    name: string;
    sku: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    images?: string[];
    [key: string]: unknown;
}

export default function StockManagementPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
    const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'normal'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'createdAt'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [showAddMovementModal, setShowAddMovementModal] = useState(false);
    const [selectedProductForMovement, setSelectedProductForMovement] = useState<ProductForMovement | null>(null);

    const { data: products, isLoading: productsLoading, error: productsError } = useStockProducts();
    const { data: summary, isLoading: summaryLoading } = useStockSummary();
    const updateStockMutation = useUpdateStock();
    const updatePriceMutation = useUpdatePrice();

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

            // Stock filter
            let matchesStock = true;
            if (stockFilter === 'low') matchesStock = product.stock < 10 && product.stock > 0;
            else if (stockFilter === 'out') matchesStock = product.stock === 0;
            else if (stockFilter === 'normal') matchesStock = product.stock >= 10;

            return matchesSearch && matchesStatus && matchesStock;
        });

        // Sort products
        filtered.sort((a, b) => {
            let aValue, bValue;
            
            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'stock':
                    aValue = a.stock;
                    bValue = b.stock;
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
    }, [products, searchTerm, statusFilter, stockFilter, sortBy, sortOrder]);

    const handleStockUpdate = async (productId: number, newStock: number) => {
        try {
            await updateStockMutation.mutateAsync({ productId, stock: newStock });
        } catch (error) {
            console.error('Failed to update stock:', error);
        }
    };

    const handlePriceUpdate = async (productId: number, newPrice: number) => {
        try {
            await updatePriceMutation.mutateAsync({ productId, price: newPrice });
        } catch (error) {
            console.error('Failed to update price:', error);
        }
    };

    const handleViewHistory = (product: { id: number }) => {
        setSelectedProductId(product.id);
    };

    const handleAddMovement = (product: ProductForMovement) => {
        setSelectedProductForMovement(product);
        setShowAddMovementModal(true);
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
                    <h1 className="text-3xl font-bold text-gray-900">Stok Yönetimi</h1>
                    <p className="text-gray-600 mt-2">Ürün stoklarınızı yönetin ve takip edin</p>
                </div>

                {/* Summary Cards */}
                {summary && <StockSummaryCards summary={summary} />}

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

                            {/* Stock Filter */}
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stok Durumu
                                </label>
                                <select
                                    id="stock"
                                    value={stockFilter}
                                    onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out' | 'normal')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tümü</option>
                                    <option value="normal">Normal (≥10)</option>
                                    <option value="low">Düşük (&lt;10)</option>
                                    <option value="out">Tükendi (0)</option>
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
                                        onChange={(e) => setSortBy(e.target.value as 'name' | 'stock' | 'price' | 'createdAt')}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="name">İsim</option>
                                        <option value="stock">Stok</option>
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
                <ProductStockTable
                    products={filteredAndSortedProducts as unknown as ProductForMovement[]}
                    onStockUpdate={handleStockUpdate}
                    onPriceUpdate={handlePriceUpdate}
                    onViewHistory={handleViewHistory}
                    onAddMovement={handleAddMovement}
                    isUpdating={updateStockMutation.isPending || updatePriceMutation.isPending}
                />

                {/* Modals */}
                {selectedProductId && (
                    <StockHistoryModal
                        productId={selectedProductId}
                        isOpen={!!selectedProductId}
                        onClose={() => setSelectedProductId(null)}
                    />
                )}

                {showAddMovementModal && selectedProductForMovement && (
                    <AddStockMovementModal
                        product={selectedProductForMovement}
                        isOpen={showAddMovementModal}
                        onClose={() => {
                            setShowAddMovementModal(false);
                            setSelectedProductForMovement(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
