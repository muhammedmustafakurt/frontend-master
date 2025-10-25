"use client";
import { useState } from 'react';

interface BulkUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    selectedCount: number;
    totalCount: number;
}

export default function BulkUpdateModal({ isOpen, onClose, onSubmit, selectedCount, totalCount }: BulkUpdateModalProps) {
    const [updateType, setUpdateType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
    const [percentage, setPercentage] = useState<number | ''>('');
    const [fixedPrice, setFixedPrice] = useState<number | ''>('');
    const [reason, setReason] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (updateType === 'FIXED' && (!fixedPrice || Number(fixedPrice) <= 0)) {
            alert('Sabit fiyat 0\'dan büyük olmalıdır');
            return;
        }

        if (updateType === 'PERCENTAGE' && (!percentage || Number(percentage) <= 0)) {
            alert('Yüzde değeri 0\'dan büyük olmalıdır');
            return;
        }

        const data: any = {
            type: updateType,
            reason: reason || undefined
        };

        // Only include the relevant field based on updateType
        if (updateType === 'FIXED') {
            data.fixedPrice = Number(fixedPrice);
        } else {
            data.percentage = Number(percentage);
        }

        console.log('Bulk update data:', data); // Debug için
        onSubmit(data);
    };

    const getUpdateTypeText = (type: string) => {
        switch (type) {
            case 'PERCENTAGE':
                return 'Yüzde Artış';
            case 'FIXED':
                return 'Sabit Fiyat';
            default:
                return type;
        }
    };

    const getPreviewText = () => {
        if (updateType === 'FIXED' && fixedPrice) {
            return `Tüm seçili ürünlerin fiyatı ₺${Number(fixedPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} olarak ayarlanacak`;
        } else if (updateType === 'PERCENTAGE' && percentage) {
            return `Tüm seçili ürünlerin fiyatı %${percentage} artırılacak`;
        }
        return 'Lütfen gerekli değerleri girin';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Toplu Fiyat Güncelleme</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-blue-900 mb-2">Güncelleme Bilgileri</h4>
                        <div className="text-sm text-blue-800">
                            <p>
                                <strong>Seçili Ürünler:</strong> {selectedCount} / {totalCount}
                            </p>
                            <p>
                                <strong>Güncelleme Türü:</strong> {getUpdateTypeText(updateType)}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Update Type */}
                        <div>
                            <label htmlFor="updateType" className="block text-sm font-medium text-gray-700 mb-1">
                                Güncelleme Türü *
                            </label>
                            <select
                                id="updateType"
                                value={updateType}
                                onChange={(e) => setUpdateType(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="PERCENTAGE">Yüzde Artış</option>
                                <option value="FIXED">Sabit Fiyat</option>
                            </select>
                        </div>

                        {/* Percentage Input */}
                        {updateType === 'PERCENTAGE' && (
                            <div>
                                <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
                                    Yüzde Değeri *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="percentage"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value === '' ? '' : Number(e.target.value))}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Örn: 10"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">%</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fixed Price Input */}
                        {updateType === 'FIXED' && (
                            <div>
                                <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sabit Fiyat (₺) *
                                </label>
                                <input
                                    type="number"
                                    id="fixedPrice"
                                    value={fixedPrice}
                                    onChange={(e) => setFixedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Örn: 100.00"
                                />
                            </div>
                        )}

                        {/* Reason */}
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                Sebep (Opsiyonel)
                            </label>
                            <input
                                type="text"
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Güncelleme sebebi..."
                            />
                        </div>

                        {/* Preview */}
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <h4 className="font-medium text-yellow-900 mb-2">Önizleme</h4>
                            <p className="text-sm text-yellow-800">
                                {getPreviewText()}
                            </p>
                        </div>

                        {/* Warning */}
                        <div className="bg-red-50 rounded-lg p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Dikkat
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>Bu işlem geri alınamaz. Tüm seçili ürünlerin fiyatları güncellenecektir.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Toplu Güncelleme Yap
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
