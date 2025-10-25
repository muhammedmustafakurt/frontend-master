// app/auth/register/vendor/page.tsx
"use client";
import { useActionState, useEffect, useState } from "react";
import { signupVendor, verifySession } from "@/app/(app)/actions/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorRegisterPage() {
    const [state, formAction, isPending] = useActionState(signupVendor, {
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await verifySession();
                if (session.authenticated) {
                    const role = session.payload?.role;
                    if (role === 'customer') router.push("/");
                    else if (role === 'vendor') router.push("/vendor/panel");
                    else if (role === 'admin') router.push("/admin/panel");
                    else router.push("/");
                    return;
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    useEffect(() => {
        if (state?.message) {
            setShowMessage(true);
        }
        if (state?.type === "success") {
            const timer = setTimeout(() => {
                router.push("/auth/login/vendor");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-green-950 to-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white text-lg animate-pulse">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-lg relative z-10 animate-fadeIn">
                <div className="text-center mb-8 animate-slideDown">
                    <div className="inline-block p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-green-500/50 transform hover:scale-110 transition-transform duration-300">
                        <i className="ri-store-2-add-line text-4xl text-white"></i>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Satıcı Kaydı
                    </h2>
                    <p className="text-gray-400 text-sm">Mağazanızı açın ve satışa başlayın</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 animate-slideUp">
                    <form action={formAction} method="POST" className="space-y-5">
                        {showMessage && state?.message && (
                            <div className="animate-slideDown">
                                <div className={`p-4 rounded-xl backdrop-blur-sm ${
                                    state.type === "success"
                                        ? 'bg-green-500/10 border border-green-500/20'
                                        : 'bg-red-500/10 border border-red-500/20'
                                }`}>
                                    <div className="flex items-start gap-3">
                                        <i className={`${state.type === "success" ? 'ri-checkbox-circle-fill text-green-400' : 'ri-error-warning-fill text-red-400'} text-xl mt-0.5`}></i>
                                        <div className="flex-1">
                                            <p className={`${state.type === "success" ? 'text-green-300' : 'text-red-300'} text-sm font-medium`}>
                                                {state.message}
                                            </p>
                                            {state.type === "success" && (
                                                <p className="text-green-200 text-xs mt-1">Giriş sayfasına yönlendiriliyorsunuz...</p>
                                            )}
                                        </div>
                                        <button type="button" onClick={() => setShowMessage(false)} className="text-gray-400 hover:text-gray-300 transition-colors">
                                            <i className="ri-close-line text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="group">
                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                Şirket/Mağaza Adı <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-store-2-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                </div>
                                <input
                                    id="companyName"
                                    type="text"
                                    name="companyName"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                    placeholder="Şirket/Mağaza Adınız"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                Yetkili Adı Soyadı <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-user-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                    placeholder="Yetkili Kişi Adı"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                E-posta <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-mail-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                    placeholder="sirket@email.com"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                Şifre <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">En az 8 karakter, büyük harf, rakam ve özel karakter</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                    Telefon
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i className="ri-phone-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                    </div>
                                    <input
                                        id="phone"
                                        type="text"
                                        name="phone"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                        placeholder="05XX XXX XX XX"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                    Adres
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i className="ri-map-pin-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                    </div>
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                        placeholder="Şehir"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                {isPending ? (
                                    <>
                                        <i className="ri-loader-4-line text-lg animate-spin"></i>
                                        <span>Kayıt Yapılıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-store-2-add-line text-lg"></i>
                                        <span>Satıcı Kaydı Yap</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800/50 text-gray-400">Diğer Kayıt Seçenekleri</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/auth/register/customer" className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-900 hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-300 group">
                            <i className="ri-user-line text-lg group-hover:scale-110 transition-transform"></i>
                            <span>Müşteri</span>
                        </Link>
                        <Link href="/auth/register/admin" className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-900 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 group">
                            <i className="ri-admin-line text-lg group-hover:scale-110 transition-transform"></i>
                            <span>Admin</span>
                        </Link>
                    </div>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/auth/login/vendor" className="font-semibold text-green-400 hover:text-green-300 transition-colors underline-offset-4 hover:underline">
                            Giriş Yapın
                        </Link>
                    </p>
                </div>
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
                .delay-700 { animation-delay: 700ms; }
            `}</style>
        </div>
    );
}

