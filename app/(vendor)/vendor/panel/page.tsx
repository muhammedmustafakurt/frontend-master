"use client";
import { useEffect, useState } from "react";
import { verifySession, logout } from "@/app/(app)/actions/auth";
import { useRouter } from "next/navigation";

export default function VendorPanelPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await verifySession();
        if (!session.authenticated) {
          router.push("/auth/login");
          return;
        }

        // Role kontrolü - sadece vendor ve admin erişebilir
        if (session.payload?.role !== 'vendor' && session.payload?.role !== 'admin') {
          router.push("/");
          return;
        }

        setUser(session.payload);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-700 text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Vendor Panel</h1>
                  <p className="text-gray-500 mt-1">
                    Hoş geldiniz, {user?.email} ({user?.role})
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>

            {/* Role Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  user?.role === 'admin' ? 'bg-red-500' : 'bg-green-500'
                }`}></div>
                <h2 className="text-lg font-semibold text-blue-900">
                  {user?.role === 'admin' ? '🔴 Admin Yetkisi' : '🟢 Vendor Yetkisi'}
                </h2>
              </div>
              <p className="text-blue-800 mt-2 text-sm">
                {user?.role === 'admin' 
                  ? 'Tam yetkiye sahipsiniz - tüm vendor işlemlerini yapabilirsiniz'
                  : 'Vendor yetkisine sahipsiniz - ürün ve hizmet yönetimi yapabilirsiniz'
                }
              </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Ürün Yönetimi */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Ürün Yönetimi</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Ürünlerinizi ekleyin, düzenleyin ve yönetin
                </p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
                  Ürünleri Görüntüle
                </button>
              </div>

              {/* Sipariş Yönetimi */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 8h18M3 13h18M3 18h18" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Sipariş Yönetimi</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Gelen siparişleri görüntüleyin ve yönetin
                </p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
                  Siparişleri Görüntüle
                </button>
              </div>

              {/* İstatistikler */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">İstatistikler</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Satış ve performans raporlarınızı görüntüleyin
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                  Raporları Görüntüle
                </button>
              </div>

              {/* Profil Yönetimi */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Profil Yönetimi</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Şirket bilgilerinizi ve ayarlarınızı güncelleyin
                </p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors">
                  Profili Düzenle
                </button>
              </div>

              {/* Finansal Raporlar */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Finansal Raporlar</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Gelir, gider ve kâr raporlarınızı görüntüleyin
                </p>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors">
                  Finansal Raporlar
                </button>
              </div>

              {/* Müşteri Yönetimi */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-3m-4 6H2v-2a4 4 0 014-4h3m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Müşteri Yönetimi</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Müşteri bilgilerini ve iletişim geçmişini yönetin
                </p>
                <button className="w-full bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md transition-colors">
                  Müşterileri Görüntüle
                </button>
              </div>
            </div>

            {/* Admin Only Section */}
            {user?.role === 'admin' && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">
                  🔴 Admin Özel Bölümü
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md transition-colors">
                    Tüm Vendor'ları Yönet
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md transition-colors">
                    Sistem Ayarları
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
