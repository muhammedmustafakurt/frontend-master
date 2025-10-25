import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;
    
    // Tek bir API URL kullan (tutarlılık için)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';

    console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}, API URL: ${apiUrl}`);

    // 🔒 Auth sayfaları için özel kontrol
    if (pathname.startsWith("/auth/")) {
        // Eğer token varsa ve geçerliyse, ana sayfaya yönlendir
        if (token) {
            try {
                console.log(`[Middleware] Verifying token at: ${apiUrl}/auth/verify`);
                
                const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: 'no-store', // Cache'i devre dışı bırak
                });

                console.log(`[Middleware] Verify response status: ${verifyResponse.status}`);

                if (verifyResponse.ok) {
                    // Token geçerli, ana sayfaya yönlendir
                    return NextResponse.redirect(new URL("/", req.url));
                } else {
                    const errorText = await verifyResponse.text();
                    console.error(`[Middleware] Token invalid on auth page: ${errorText}`);
                    // Token geçersiz, sil ve auth sayfasına izin ver
                    const response = NextResponse.next();
                    response.cookies.delete("token");
                    return response;
                }
            } catch (err) {
                console.error(`[Middleware] Error verifying token on auth page:`, err);
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
        console.log(`[Middleware] No token found, redirecting to login`);
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        // ✅ Token'ı Nest.js backend'e doğrulat
        console.log(`[Middleware] Verifying token for protected route at: ${apiUrl}/auth/verify`);
        
        const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store', // Cache'i devre dışı bırak
        });

        console.log(`[Middleware] Protected route verify response status: ${verifyResponse.status}`);

        // ❌ Token geçersizse → cookie sil + yönlendir
        if (!verifyResponse.ok) {
            const errorText = await verifyResponse.text();
            console.error(`[Middleware] Token verification failed: ${errorText}`);
            const res = NextResponse.redirect(new URL("/auth/login", req.url));
            res.cookies.delete("token");
            return res;
        }

        console.log(`[Middleware] Token verified successfully`);


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
