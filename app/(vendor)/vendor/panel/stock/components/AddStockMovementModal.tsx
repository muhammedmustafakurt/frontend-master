"use client";
import { useState } from 'react';
import { useAddStockMovement } from '@/app/(app)/hooks/useStock';

interface Product {
    id: number;
    name: string;
    sku: string;
    stock: number;
}

interface AddStockMovementModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStockMovementModal({ product, isOpen, onClose }: AddStockMovementModalProps) {
    const [formData, setFormData] = useState({
        type: 'IN' as 'IN' | 'OUT' | 'ADJUSTMENT' | 'RETURN',
        reason: 'PURCHASE' as 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGED' | 'EXPIRED' | 'THEFT' | 'OTHER',
        quantity: 0,
        unitPrice: 0,
        notes: ''
    });

    const addStockMovementMutation = useAddStockMovement();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.quantity <= 0) {
            alert('Miktar 0\'dan büyük olmalıdır');
            return;
        }

        if (formData.type === 'OUT' && formData.quantity > product.stock) {
            alert('Çıkış miktarı mevcut stoktan fazla olamaz');
            return;
        }

        try {
            await addStockMovementMutation.mutateAsync({
                productId: product.id,
                ...formData
            });
            
            alert('Stok hareketi başarıyla eklendi');
            onClose();
            
            // Reset form
            setFormData({
                type: 'IN',
                reason: 'PURCHASE',
                quantity: 0,
                unitPrice: 0,
                notes: ''
            });
        } catch (error) {
            alert(`Hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Stok Hareketi Ekle</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Product Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 mb-2">Ürün Bilgileri</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Ürün:</span>
                                <span className="ml-1 font-medium">{product.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">SKU:</span>
                                <span className="ml-1 font-medium">{product.sku}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Mevcut Stok:</span>
                                <span className="ml-1 font-medium">{product.stock}</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Movement Type */}
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Hareket Türü *
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="IN">Giriş</option>
                                    <option value="OUT">Çıkış</option>
                                    <option value="ADJUSTMENT">Düzeltme</option>
                                    <option value="RETURN">İade</option>
                                </select>
                            </div>

                            {/* Reason */}
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sebep *
                                </label>
                                <select
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PURCHASE">Satın Alma</option>
                                    <option value="SALE">Satış</option>
                                    <option value="ADJUSTMENT">Düzeltme</option>
                                    <option value="RETURN">İade</option>
                                    <option value="DAMAGED">Hasarlı</option>
                                    <option value="EXPIRED">Süresi Dolmuş</option>
                                    <option value="THEFT">Hırsızlık</option>
                                    <option value="OTHER">Diğer</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                    Miktar *
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Unit Price */}
                            <div>
                                <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Birim Fiyat (₺)
                                </label>
                                <input
                                    type="number"
                                    id="unitPrice"
                                    name="unitPrice"
                                    value={formData.unitPrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Notlar
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Stok hareketi hakkında notlar..."
                            />
                        </div>

                        {/* Preview */}
                        {formData.quantity > 0 && (
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-medium text-blue-900 mb-2">Önizleme</h4>
                                <div className="text-sm text-blue-800">
                                    <p>
                                        <strong>Mevcut Stok:</strong> {product.stock}
                                    </p>
                                    <p>
                                        <strong>Hareket:</strong> {formData.type === 'OUT' ? '-' : '+'}{formData.quantity}
                                    </p>
                                    <p>
                                        <strong>Yeni Stok:</strong> {
                                            formData.type === 'IN' ? product.stock + formData.quantity :
                                            formData.type === 'OUT' ? product.stock - formData.quantity :
                                            formData.type === 'ADJUSTMENT' ? formData.quantity :
                                            product.stock + formData.quantity
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                disabled={addStockMovementMutation.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {addStockMovementMutation.isPending ? 'Ekleniyor...' : 'Stok Hareketi Ekle'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
