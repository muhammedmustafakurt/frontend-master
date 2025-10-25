// app/auth/login/page.tsx
"use client";
import {useActionState,useEffect, useState} from "react";
import {login, verifySession} from "@/app/(app)/actions/auth";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, {
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

    useEffect(()=>{
        if(state?.type==="success"){
            const timer=setTimeout(()=>{
                router.push("/");
            },2000);
            return ()=>clearTimeout(timer);
        }
    },[state?.type,router]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
                <div className="text-white text-xl text-center">Yükleniyor...</div>
            </div>
        );
    }
    return (
        <>
            <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            src="https://res-console.cloudinary.com/djr54tvbt/thumbnails/v1/image/upload/v1759436318/aW1hZ2VzX3F5c2lpaQ==/drilldown"
                            alt="Your Company"
                            className="mx-auto h-10 w-auto"
                        />
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                            Giriş Yap
                        </h2>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action={formAction} method="POST" className="space-y-6">
                            <div>
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
                                <label
                                    htmlFor="email"
                                    className="block text-sm/6 font-medium text-gray-100"
                                >
                                    Email adresiniz
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="email"
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm/6 font-medium text-gray-100"
                                    >
                                        Şifre
                                    </label>
                                    <div className="text-sm">
                                        <a
                                            href="#"
                                            className="font-semibold text-indigo-400 hover:text-indigo-300"
                                        >
                                            Şifremi Unuttum
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        autoComplete="current-password"
                                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                    />
                                </div>
                            </div>
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
                                            Giriş Yapılıyor...
                                        </>
                                    ) : (
                                        "Giriş Yap"
                                    )}
                                </button>
                            </div>
                        </form>
                        <p className="mt-10 text-center text-sm/6 text-gray-400">
                            Hesabınız yok mu?
                            <a
                                href="/auth/register"
                                className="font-semibold text-indigo-400 hover:text-indigo-300"
                            >
                                <span>   Kayıt Ol</span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
}
