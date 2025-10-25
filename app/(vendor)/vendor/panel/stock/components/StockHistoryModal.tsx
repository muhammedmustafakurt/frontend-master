"use client";
import { useStockHistory } from '@/app/(app)/hooks/useStock';

interface StockHistoryModalProps {
    productId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function StockHistoryModal({ productId, isOpen, onClose }: StockHistoryModalProps) {
    const { data: history, isLoading, error } = useStockHistory(productId);

    const getMovementTypeBadge = (type: string) => {
        const typeClasses = {
            IN: 'bg-green-100 text-green-800',
            OUT: 'bg-red-100 text-red-800',
            ADJUSTMENT: 'bg-blue-100 text-blue-800',
            RETURN: 'bg-yellow-100 text-yellow-800',
        };

        const typeText = {
            IN: 'Giriş',
            OUT: 'Çıkış',
            ADJUSTMENT: 'Düzeltme',
            RETURN: 'İade',
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeClasses[type as keyof typeof typeClasses]}`}>
                {typeText[type as keyof typeof typeText]}
            </span>
        );
    };

    const getReasonText = (reason: string) => {
        const reasonText = {
            PURCHASE: 'Satın Alma',
            SALE: 'Satış',
            ADJUSTMENT: 'Düzeltme',
            RETURN: 'İade',
            DAMAGED: 'Hasarlı',
            EXPIRED: 'Süresi Dolmuş',
            THEFT: 'Hırsızlık',
            OTHER: 'Diğer',
        };

        return reasonText[reason as keyof typeof reasonText] || reason;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Stok Geçmişi</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600">Hata: {error.message}</p>
                            </div>
                        ) : !history || history.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Stok geçmişi bulunamadı</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((movement) => (
                                    <div key={movement.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                {getMovementTypeBadge(movement.type)}
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getReasonText(movement.reason)}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(movement.createdAt).toLocaleDateString('tr-TR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Miktar:</span>
                                                <span className="ml-1 font-medium">
                                                    {movement.type === 'OUT' ? '-' : '+'}{movement.quantity}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Önceki Stok:</span>
                                                <span className="ml-1 font-medium">{movement.previousStock}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Yeni Stok:</span>
                                                <span className="ml-1 font-medium">{movement.newStock}</span>
                                            </div>
                                            {movement.unitPrice && (
                                                <div>
                                                    <span className="text-gray-500">Birim Fiyat:</span>
                                                    <span className="ml-1 font-medium">
                                                        ₺{movement.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {movement.notes && (
                                            <div className="mt-2">
                                                <span className="text-gray-500 text-sm">Not:</span>
                                                <p className="text-sm text-gray-700 mt-1">{movement.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
