"use client";
import { PriceSummary } from '@/app/(app)/actions/price';

interface PriceSummaryCardsProps {
    summary: PriceSummary;
}

export default function PriceSummaryCards({ summary }: PriceSummaryCardsProps) {
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
            title: 'Ortalama Fiyat',
            value: `₺${summary.averagePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'bg-green-500',
            textColor: 'text-green-600'
        },
        {
            title: 'En Yüksek Fiyat',
            value: `₺${summary.highestPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            color: 'bg-purple-500',
            textColor: 'text-purple-600'
        },
        {
            title: 'En Düşük Fiyat',
            value: `₺${summary.lowestPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            ),
            color: 'bg-orange-500',
            textColor: 'text-orange-600'
        },
        {
            title: 'Toplam Değer',
            value: `₺${summary.totalValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            color: 'bg-indigo-500',
            textColor: 'text-indigo-600'
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
