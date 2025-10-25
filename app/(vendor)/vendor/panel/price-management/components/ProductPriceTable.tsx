"use client";
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    sku: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    status: string;
    images?: string[];
}

interface ProductPriceTableProps {
    products: Product[];
    onPriceUpdate: (productId: number, newPrice: number, notes?: string) => void;
    onViewHistory: (product: Product) => void;
    onProductSelect: (productId: number, selected: boolean) => void;
    onSelectAll: (selected: boolean) => void;
    selectedProducts: number[];
    isUpdating: boolean;
}

export default function ProductPriceTable({
    products,
    onPriceUpdate,
    onViewHistory,
    onProductSelect,
    onSelectAll,
    selectedProducts,
    isUpdating
}: ProductPriceTableProps) {
    const [editingPrice, setEditingPrice] = useState<number | null>(null);
    const [tempPrice, setTempPrice] = useState<number>(0);
    const [tempNotes, setTempNotes] = useState<string>('');

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800',
            draft: 'bg-yellow-100 text-yellow-800',
        };
        
        const statusText = {
            active: 'Aktif',
            inactive: 'Pasif',
            draft: 'Taslak',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
                {statusText[status as keyof typeof statusText]}
            </span>
        );
    };

    const getPriceBadge = (price: number) => {
        if (price > 1000) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Yüksek</span>;
        } else if (price < 100) {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Düşük</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Normal</span>;
        }
    };

    const handlePriceEdit = (product: Product) => {
        setEditingPrice(product.id);
        setTempPrice(product.price);
        setTempNotes('');
    };

    const handlePriceSave = (productId: number) => {
        if (tempPrice >= 0) {
            onPriceUpdate(productId, tempPrice, tempNotes || undefined);
        }
        setEditingPrice(null);
        setTempNotes('');
    };

    const handlePriceCancel = () => {
        setEditingPrice(null);
        setTempNotes('');
    };

    const allSelected = products.length > 0 && selectedProducts.length === products.length;
    const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow">
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ürün bulunamadı</h3>
                    <p className="text-gray-500">Arama kriterlerinize uygun ürün bulunamadı</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(input) => {
                                        if (input) input.indeterminate = someSelected;
                                    }}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ürün
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fiyat
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stok
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durum
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={(e) => onProductSelect(product.id, e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {product.images && product.images.length > 0 ? (
                                            <div className="w-10 h-10 rounded-md overflow-hidden border mr-3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={product.images[0]} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {product.brand} - {product.category}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.sku}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {editingPrice === product.id ? (
                                        <div className="space-y-2">
                                            <input
                                                type="number"
                                                value={tempPrice}
                                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                min="0"
                                                step="0.01"
                                            />
                                            <input
                                                type="text"
                                                value={tempNotes}
                                                onChange={(e) => setTempNotes(e.target.value)}
                                                placeholder="Not (opsiyonel)"
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => handlePriceSave(product.id)}
                                                    className="text-green-600 hover:text-green-800 text-xs"
                                                    disabled={isUpdating}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={handlePriceCancel}
                                                    className="text-red-600 hover:text-red-800 text-xs"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <div 
                                                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                                                onClick={() => handlePriceEdit(product)}
                                            >
                                                ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </div>
                                            {getPriceBadge(product.price)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(product.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onViewHistory(product)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Geçmiş
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
