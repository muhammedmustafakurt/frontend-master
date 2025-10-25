"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorUnauthorizedPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Cookie'yi temizle
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            router.push("/auth/login/vendor");
        } catch (error) {
            console.error("Logout error:", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-950 to-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10 animate-fadeIn">
                {/* Icon and Header */}
                <div className="text-center mb-8 animate-slideDown">
                    <div className="inline-block p-4 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-3xl mb-6 shadow-lg shadow-orange-500/50 transform hover:scale-110 transition-transform duration-300">
                        <i className="ri-time-line text-6xl text-white"></i>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        Hesap Onayı Bekleniyor
                    </h1>
                    <p className="text-gray-300 text-lg max-w-xl mx-auto">
                        Satıcı hesabınız admin tarafından henüz onaylanmamıştır
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 mb-6 animate-slideUp">
                    {/* Status */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <span className="text-orange-300 text-sm font-medium">Onay Bekliyor</span>
                        </div>
                    </div>

                    {/* Process Steps */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-700/50">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-full border-2 border-green-500 flex-shrink-0">
                                <i className="ri-checkbox-circle-fill text-green-400 text-xl"></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">Kayıt Tamamlandı</h3>
                                <p className="text-gray-400 text-sm">Satıcı hesabınız başarıyla oluşturuldu</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-orange-500/30">
                            <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-full border-2 border-orange-500 flex-shrink-0">
                                <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">Admin Onayı Bekleniyor</h3>
                                <p className="text-gray-400 text-sm">Hesabınız inceleniyor. Bu işlem genellikle 24-48 saat içinde tamamlanır</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-700/50 opacity-50">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-700/50 rounded-full border-2 border-gray-600 flex-shrink-0">
                                <i className="ri-checkbox-blank-circle-line text-gray-500 text-xl"></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-gray-400 font-semibold mb-1">Satış Başlatma</h3>
                                <p className="text-gray-500 text-sm">Onay sonrası vendor paneline erişim sağlayacaksınız</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <i className="ri-information-line text-blue-400 text-xl mt-0.5"></i>
                            <div className="flex-1">
                                <p className="text-sm text-gray-300 mb-2">
                                    <strong className="text-blue-300">Onay süreci neden gerekli?</strong>
                                </p>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Platformumuzda kaliteli ve güvenilir satıcılarla çalışmayı hedefliyoruz. 
                                    Admin ekibimiz tüm satıcı başvurularını inceleyerek müşterilerimize en iyi 
                                    alışveriş deneyimini sunmayı amaçlamaktadır.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-start gap-3">
                            <i className="ri-mail-line text-gray-400 text-xl mt-0.5"></i>
                            <div className="flex-1">
                                <p className="text-sm text-gray-300 mb-1">
                                    <strong>Acil bir durum mu var?</strong>
                                </p>
                                <p className="text-xs text-gray-400 mb-2">
                                    Destek ekibimizle iletişime geçebilirsiniz
                                </p>
                                <a 
                                    href="mailto:support@example.com" 
                                    className="text-sm text-orange-400 hover:text-orange-300 transition-colors underline-offset-4 hover:underline"
                                >
                                    support@example.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 animate-slideUp delay-200">
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex-1 relative group overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <i className="ri-loader-4-line text-lg animate-spin"></i>
                                    <span>Çıkış Yapılıyor...</span>
                                </>
                            ) : (
                                <>
                                    <i className="ri-logout-box-r-line text-lg"></i>
                                    <span>Çıkış Yap</span>
                                </>
                            )}
                        </span>
                    </button>

                    <Link
                        href="/"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-900 hover:border-gray-600 hover:text-white transition-all duration-300 group"
                    >
                        <i className="ri-home-line text-lg group-hover:scale-110 transition-transform"></i>
                        <span>Ana Sayfaya Dön</span>
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-500 mt-6 animate-fadeIn delay-300">
                    E-posta adresinize onay bildirimi gönderilecektir
                </p>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                .animate-slideDown { animation: slideDown 0.5s ease-out; }
                .animate-slideUp { animation: slideUp 0.6s ease-out; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }
                .delay-700 { animation-delay: 700ms; }
            `}</style>
        </div>
    );
}

