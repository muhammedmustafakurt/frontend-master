"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useVendorProducts, useDeleteProduct, useSoftDeleteProduct } from "@/app/(app)/hooks/useVendorProducts";

export default function VendorProductsPage() {
    const [deleteMode, setDeleteMode] = useState<'soft' | 'hard'>('soft');
    const { data: products, isLoading, error } = useVendorProducts();
    const deleteProductMutation = useDeleteProduct();
    const softDeleteProductMutation = useSoftDeleteProduct();

    const handleDelete = async (product: { id: number; name: string }) => {
        if (!confirm(`"${product.name}" ürününü silmek istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            if (deleteMode === 'soft') {
                await softDeleteProductMutation.mutateAsync(product.id);
                alert('Ürün başarıyla deaktif edildi');
            } else {
                await deleteProductMutation.mutateAsync(product.id);
                alert('Ürün başarıyla silindi');
            }
        } catch (error) {
            alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
    };

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

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
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

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-lg font-medium text-red-800 mb-2">Hata</h2>
                        <p className="text-red-600">{error.message}</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
                            <p className="text-gray-600 mt-2">Ürünlerinizi yönetin ve yeni ürünler ekleyin</p>
                        </div>
                        <Link
                            href="/vendor/panel/product/add"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Yeni Ürün Ekle
                        </Link>
                    </div>
                </div>

                {/* Delete Mode Toggle */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Silme Modu:</span>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="soft"
                                    checked={deleteMode === 'soft'}
                                    onChange={(e) => setDeleteMode(e.target.value as 'soft' | 'hard')}
                                    className="mr-2"
                                />
                                <span className="text-sm">Yumuşak Silme (Deaktif Et)</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="hard"
                                    checked={deleteMode === 'hard'}
                                    onChange={(e) => setDeleteMode(e.target.value as 'soft' | 'hard')}
                                    className="mr-2"
                                />
                                <span className="text-sm">Kalıcı Silme</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {products && products.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Resim
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
                                    {products.map((product: { id: number; images?: string[]; name: string; brand: string; sku: string; category: string; price: number; stock: number; status: string }) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {product.images && product.images.length > 0 ? (
                                                    <div className="w-12 h-12 rounded-md overflow-hidden border">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img 
                                                            src={product.images[0]} 
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {product.brand} - {product.category}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ₺{product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {product.stock}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(product.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link
                                                    href={`/vendor/panel/product/edit/${product.id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Düzenle
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={deleteProductMutation.isPending || softDeleteProductMutation.isPending}
                                                >
                                                    {deleteMode === 'soft' ? 'Deaktif Et' : 'Sil'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ürün yok</h3>
                            <p className="text-gray-500 mb-6">İlk ürününüzü ekleyerek başlayın</p>
                            <Link
                                href="/vendor/panel/product/add"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Ürün Ekle
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
