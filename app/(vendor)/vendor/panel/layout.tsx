"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function VendorPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([
        'Ürün Yönetimi',
        'Sipariş Yönetimi',
        'Müşteri Yönetimi',
        'Kargo & Teslimat',
        'Raporlar & Analitik',
        'Pazarlama',
        'Finansal İşlemler',
        'Destek & İletişim',
        'Ayarlar',
    ]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleExpanded = (itemName: string) => {
        setExpandedItems(prev => 
            prev.includes(itemName) 
                ? prev.filter(item => item !== itemName)
                : [...prev, itemName]
        );
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: '/vendor/panel',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
            ),
            current: pathname === '/vendor/panel'
        },
        {
            name: 'Ürün Yönetimi',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/product') || pathname.startsWith('/vendor/panel/stock') || pathname.startsWith('/vendor/panel/price-management'),
            children: [
                { name: 'Tüm Ürünler', href: '/vendor/panel/product' },
                { name: 'Ürün Ekle', href: '/vendor/panel/product/add' },
                { name: 'Kategoriler', href: '/vendor/panel/product/categories' },
                { name: 'Stok Yönetimi', href: '/vendor/panel/stock' },
                { name: 'Fiyat Yönetimi', href: '/vendor/panel/price-management' },
            ]
        },
        {
            name: 'Sipariş Yönetimi',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/orders'),
            children: [
                { name: 'Tüm Siparişler', href: '/vendor/panel/orders' },
                { name: 'Bekleyen Siparişler', href: '/vendor/panel/orders/pending' },
                { name: 'Hazırlanan Siparişler', href: '/vendor/panel/orders/processing' },
                { name: 'Kargoya Verilen', href: '/vendor/panel/orders/shipped' },
                { name: 'Teslim Edilen', href: '/vendor/panel/orders/delivered' },
                { name: 'İptal Edilen', href: '/vendor/panel/orders/cancelled' },
            ]
        },
        {
            name: 'Müşteri Yönetimi',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/customers'),
            children: [
                { name: 'Tüm Müşteriler', href: '/vendor/panel/customers' },
                { name: 'Müşteri Grupları', href: '/vendor/panel/customers/groups' },
                { name: 'Müşteri Yorumları', href: '/vendor/panel/customers/reviews' },
            ]
        },
        {
            name: 'Kargo & Teslimat',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/shipping'),
            children: [
                { name: 'Kargo Firmaları', href: '/vendor/panel/shipping/carriers' },
                { name: 'Teslimat Bölgeleri', href: '/vendor/panel/shipping/zones' },
                { name: 'Kargo Takibi', href: '/vendor/panel/shipping/tracking' },
            ]
        },
        {
            name: 'Raporlar & Analitik',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/reports'),
            children: [
                { name: 'Satış Raporları', href: '/vendor/panel/reports/sales' },
                { name: 'Ürün Raporları', href: '/vendor/panel/reports/products' },
                { name: 'Müşteri Raporları', href: '/vendor/panel/reports/customers' },
                { name: 'Finansal Raporlar', href: '/vendor/panel/reports/financial' },
                { name: 'Performans Analizi', href: '/vendor/panel/reports/performance' },
            ]
        },
        {
            name: 'Pazarlama',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/marketing'),
            children: [
                { name: 'Kampanyalar', href: '/vendor/panel/marketing/campaigns' },
                { name: 'Kuponlar', href: '/vendor/panel/marketing/coupons' },
                { name: 'İndirimler', href: '/vendor/panel/marketing/discounts' },
                { name: 'E-posta Pazarlama', href: '/vendor/panel/marketing/email' },
            ]
        },
        {
            name: 'Finansal İşlemler',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/finance'),
            children: [
                { name: 'Ödemeler', href: '/vendor/panel/finance/payments' },
                { name: 'Komisyonlar', href: '/vendor/panel/finance/commissions' },
                { name: 'Faturalar', href: '/vendor/panel/finance/invoices' },
                { name: 'Gelir Raporları', href: '/vendor/panel/finance/revenue' },
            ]
        },
        {
            name: 'Destek & İletişim',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/support'),
            children: [
                { name: 'Destek Talepleri', href: '/vendor/panel/support/tickets' },
                { name: 'SSS', href: '/vendor/panel/support/faq' },
                { name: 'İletişim', href: '/vendor/panel/support/contact' },
                { name: 'Dokümantasyon', href: '/vendor/panel/support/docs' },
            ]
        },
        {
            name: 'Ayarlar',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            current: pathname.startsWith('/vendor/panel/settings'),
            children: [
                { name: 'Profil Ayarları', href: '/vendor/panel/settings/profile' },
                { name: 'Mağaza Ayarları', href: '/vendor/panel/settings/store' },
                { name: 'Güvenlik', href: '/vendor/panel/settings/security' },
                { name: 'Bildirimler', href: '/vendor/panel/settings/notifications' },
                { name: 'Entegrasyonlar', href: '/vendor/panel/settings/integrations' },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                        <h1 className="text-xl font-bold text-white">Vendor Panel</h1>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <div>
                                        <button
                                            onClick={() => toggleExpanded(item.name)}
                                            className={`group flex w-full items-center justify-between px-2 py-2 text-sm font-medium rounded-md ${
                                                item.current
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-3">{item.icon}</span>
                                                {item.name}
                                            </div>
                                            <svg
                                                className={`w-4 h-4 transition-transform ${
                                                    expandedItems.includes(item.name) ? 'rotate-180' : ''
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {expandedItems.includes(item.name) && (
                                            <div className="ml-6 space-y-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        onClick={closeSidebar}
                                                        className={`block px-2 py-2 text-sm rounded-md ${
                                                            pathname === child.href
                                                                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-700'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href!}
                                        onClick={closeSidebar}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                            item.current
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="border-t border-gray-200 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">V</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">Vendor Name</p>
                                <p className="text-xs text-gray-500 truncate">vendor@example.com</p>
                            </div>
                        </div>
                        <button className="w-full flex items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 pt-16 lg:pt-0">
                {children}
            </div>
        </div>
    );
}
