"use client";
import { StockSummary } from '@/app/(app)/actions/stock';

interface StockSummaryCardsProps {
    summary: StockSummary;
}

export default function StockSummaryCards({ summary }: StockSummaryCardsProps) {
    const cards = [
        {
            title: 'Toplam Ürün',
            value: summary.totalProducts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-blue-500',
            textColor: 'text-blue-600'
        },
        {
            title: 'Toplam Stok',
            value: summary.totalStock.toLocaleString('tr-TR'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-green-500',
            textColor: 'text-green-600'
        },
        {
            title: 'Düşük Stok',
            value: summary.lowStockProducts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600'
        },
        {
            title: 'Stok Tükendi',
            value: summary.outOfStockProducts,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            color: 'bg-red-500',
            textColor: 'text-red-600'
        },
        {
            title: 'Toplam Değer',
            value: `₺${summary.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            color: 'bg-purple-500',
            textColor: 'text-purple-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {cards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full ${card.color} text-white`}>
                            {card.icon}
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">{card.title}</p>
                            <p className={`text-2xl font-bold ${card.textColor}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
