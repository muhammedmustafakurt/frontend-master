// app/auth/login/vendor/page.tsx
"use client";
import {useActionState, useEffect, useState} from "react";
import {loginVendor, verifySession} from "@/app/(app)/actions/auth";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function VendorLoginPage() {
    const [state, formAction, isPending] = useActionState(loginVendor, {
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await verifySession();
                if (session.authenticated) {
                    const role = session.payload?.role;
                    if (role === 'customer') {
                        router.push("/");
                    } else if (role === 'vendor') {
                        router.push("/vendor/panel");
                    } else if (role === 'admin') {
                        router.push("/admin/panel");
                    } else {
                        router.push("/");
                    }
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
        if (state?.message && state?.type === "error") {
            setShowError(true);
        }
    }, [state]);

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
            {/* Animated Background Circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fadeIn">
                {/* Logo & Title */}
                <div className="text-center mb-8 animate-slideDown">
                    <div className="inline-block p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-green-500/50 transform hover:scale-110 transition-transform duration-300">
                        <i className="ri-store-2-line text-4xl text-white"></i>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Satıcı Girişi
                    </h2>
                    <p className="text-gray-400 text-sm">Mağazanızı yönetin</p>
                </div>

                {/* Login Card */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 animate-slideUp">
                    <form action={formAction} method="POST" className="space-y-6">
                        {/* Error Message with Animation */}
                        {showError && state?.message && state?.type === "error" && (
                            <div className="animate-slideDown">
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                                    <div className="flex items-start gap-3">
                                        <i className="ri-error-warning-fill text-red-400 text-xl mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-red-300 text-sm font-medium">{state.message}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowError(false)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <i className="ri-close-line text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="group">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 group-focus-within:text-green-400 transition-colors">
                                E-posta Adresi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-mail-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                    placeholder="satici@magaza.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 group-focus-within:text-green-400 transition-colors">
                                    Şifre
                                </label>
                                <Link href="#" className="text-xs text-green-400 hover:text-green-300 transition-colors font-medium">
                                    Şifremi Unuttum?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-gray-500 group-focus-within:text-green-400 transition-colors"></i>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full relative group overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-green-500/50 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                {isPending ? (
                                    <>
                                        <i className="ri-loader-4-line text-lg animate-spin"></i>
                                        <span>Giriş Yapılıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-login-box-line text-lg"></i>
                                        <span>Giriş Yap</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800/50 text-gray-400">Diğer Giriş Seçenekleri</span>
                        </div>
                    </div>

                    {/* Other Login Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            href="/auth/login/customer"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-900 hover:border-indigo-500/50 hover:text-indigo-400 transition-all duration-300 group"
                        >
                            <i className="ri-user-line text-lg group-hover:scale-110 transition-transform"></i>
                            <span>Müşteri</span>
                        </Link>
                        <Link
                            href="/auth/login/admin"
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-900 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 group"
                        >
                            <i className="ri-admin-line text-lg group-hover:scale-110 transition-transform"></i>
                            <span>Admin</span>
                        </Link>
                    </div>

                    {/* Register Link */}
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Satıcı olmak ister misiniz?{" "}
                        <Link href="/auth/register" className="font-semibold text-green-400 hover:text-green-300 transition-colors underline-offset-4 hover:underline">
                            Hemen Başvurun
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.6s ease-out;
                }
                .delay-700 {
                    animation-delay: 700ms;
                }
            `}</style>
        </div>
    );
}
