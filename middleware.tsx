import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // 🔒 Auth sayfaları için özel kontrol
    if (pathname.startsWith("/auth/")) {
        // Eğer token varsa ve geçerliyse, ana sayfaya yönlendir
        if (token) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
                const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (verifyResponse.ok) {
                    // Token geçerli, ana sayfaya yönlendir
                    return NextResponse.redirect(new URL("/", req.url));
                } else {
                    // Token geçersiz, sil ve auth sayfasına izin ver
                    const response = NextResponse.next();
                    response.cookies.delete("token");
                    return response;
                }
            } catch (err) {
                // Hata durumunda token'ı sil ve auth sayfasına izin ver
                const response = NextResponse.next();
                response.cookies.delete("token");
                return response;
            }
        }
        // Token yoksa auth sayfasına izin ver
        return NextResponse.next();
    }

    // 🔒 Korumalı sayfalar için token kontrolü
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        // ✅ Token'ı Nest.js backend'e doğrulat
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // ❌ Token geçersizse → cookie sil + yönlendir
        if (!verifyResponse.ok) {
            const res = NextResponse.redirect(new URL("/auth/login", req.url));
            res.cookies.delete("token");
            return res;
        }

        // 🔒 Vendor panel için role kontrolü
        if (pathname.startsWith("/vendor/")) {
            const userData = await verifyResponse.json();
            const userRole = userData.payload?.role;
            
            // Sadece vendor ve admin erişebilir
            if (userRole !== 'vendor' && userRole !== 'admin') {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        // ✅ Token geçerli → isteğe izin ver
        return NextResponse.next();
    } catch (err) {
        console.error("Token doğrulama hatası:", err);

        const res = NextResponse.redirect(new URL("/auth/login", req.url));
        res.cookies.delete("token");
        return res;
    }
}

// 🔍 Middleware'in çalışacağı yollar
export const config = {
    matcher: [
        "/",   // ana sayfa korunuyor
        "/dashboard/:path*",   // dashboard sayfaları
        "/profile/:path*",     // profil sayfaları
        "/vendor/:path*",      // vendor panel (role kontrolü ile)
        "/auth/:path*",        // auth sayfaları (giriş yapmış kullanıcıları yönlendirmek için)
    ],
};
