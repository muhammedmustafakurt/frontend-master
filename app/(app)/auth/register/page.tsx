"use client";

import { useActionState, useEffect, useState } from "react";
import { signup, verifySession } from "@/app/(app)/actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, {
        message: "",
        type: "",
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Giriş yapmış kullanıcıları kontrol et
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await verifySession();
                if (session.authenticated) {
                    router.push("/");
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
        if (state?.type === "success") {
            const timer = setTimeout(() => {
                router.push("/auth/login");
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [state?.type, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
                <div className="text-white text-xl text-center">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form
                        action={formAction}
                        className="space-y-6 rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-lg border border-white/20"
                    >
                        {/* Başlık */}
                        <h2 className="text-2xl font-bold text-center text-white">Kayıt Ol</h2>
                        <p className="text-sm text-gray-300 text-center">
                            Hemen ücretsiz bir hesap oluşturun 🚀
                        </p>

                        {/* Hata/Success Mesajı */}
                        {state?.message && (
                            <div className={`p-3 rounded-lg text-sm ${
                                state.type === "success"
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                                <div className="flex items-center">
                                    {state.type === "success" ? (
                                        <i className="ri-checkbox-circle-fill mr-2"></i>
                                    ) : (
                                        <i className="ri-error-warning-fill mr-2"></i>
                                    )}
                                    {state.message}
                                </div>
                                {state.type === "success" && (
                                    <div className="text-xs mt-1 text-green-200">
                                        Yönlendiriliyorsunuz...
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Ad Soyad */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Ad Soyad
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    required
                                    placeholder="Adınızı ve soyadınızı giriniz"
                                    className="block w-full rounded-xl bg-white/10 px-4 py-3 pl-10 text-white
                    placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500
                    border border-white/20"
                                />
                                <span className="absolute left-3 top-3 text-gray-400">
                  <i className="ri-user-line"></i>
                </span>
                            </div>
                        </div>

                        {/* E-posta */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                E-posta
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    placeholder="ornek@mail.com"
                                    className="block w-full rounded-xl bg-white/10 px-4 py-3 pl-10 text-white
                    placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500
                    border border-white/20"
                                />
                                <span className="absolute left-3 top-3 text-gray-400">
                  <i className="ri-mail-line"></i>
                </span>
                            </div>
                        </div>

                        {/* Şifre */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Şifre
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="Şifrenizi giriniz"
                                    className="block w-full rounded-xl bg-white/10 px-4 py-3 pl-10 text-white
                    placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500
                    border border-white/20"
                                />
                                <span className="absolute left-3 top-3 text-gray-400">
                  <i className="ri-lock-2-line"></i>
                </span>
                            </div>
                        </div>

                        {/* Telefon */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Telefon
                            </label>
                            <div className="relative">
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    placeholder="05xx xxx xx xx"
                                    className="block w-full rounded-xl bg-white/10 px-4 py-3 pl-10 text-white
                    placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500
                    border border-white/20"
                                />
                                <span className="absolute left-3 top-3 text-gray-400">
                  <i className="ri-phone-line"></i>
                </span>
                            </div>
                        </div>

                        {/* Gönder Butonu */}
                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex w-full justify-center rounded-xl bg-indigo-500 px-4 py-3
                  text-sm font-semibold text-white shadow-md hover:bg-indigo-400 hover:scale-[1.02]
                  transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isPending ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                                        Kayıt Yapılıyor...
                                    </>
                                ) : (
                                    "Kayıt Ol"
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-400">
                        Zaten hesabınız var mı?
                        <a
                            href="/auth/login"
                            className="font-semibold text-indigo-400 hover:text-indigo-300 ml-1"
                        >
                            Giriş Yap
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}