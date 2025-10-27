import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // 🔓 Public routes - Token kontrolü yok
    const publicRoutes = [
        "/auth/login/customer", 
        "/auth/login/vendor", 
        "/auth/login/admin", 
        "/auth/register",
        "/vendor/unauthorized"
    ];
    
    // ⚠️ Vendor unauthorized sayfası - özel durum (token varsa kalabilir)
    if (pathname.startsWith("/vendor/unauthorized")) {
        return NextResponse.next();
    }
    
    // 🔓 Public routes - Token kontrolü yok
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        // Eğer token varsa ve geçerliyse, role'e göre yönlendir
        if (token) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
                const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (verifyResponse.ok) {
                    const userData = await verifyResponse.json();
                    const userRole = userData.payload?.role;
                    const isApproved = userData.payload?.isApproved;
                    
                    // Giriş yapmış kullanıcıyı role'üne göre yönlendir
                    if (userRole === 'vendor') {
                        // Vendor onaylı değilse unauthorized sayfasına yönlendir
                        if (isApproved === false) {
                            return NextResponse.redirect(new URL("/vendor/unauthorized", req.url));
                        }
                        return NextResponse.redirect(new URL("/vendor/panel", req.url));
                    } else if (userRole === 'admin') {
                        return NextResponse.redirect(new URL("/admin/panel", req.url));
                    } else {
                        // Customer ana sayfaya
                        return NextResponse.redirect(new URL("/", req.url));
                    }
                } else {
                    // Token geçersiz, sil ve sayfaya izin ver
                    const response = NextResponse.next();
                    response.cookies.delete("token");
                    return response;
                }
            } catch (err) {
                // Hata durumunda token'ı sil ve sayfaya izin ver
                console.error('[Middleware] Public route token check error:', err);
                const response = NextResponse.next();
                response.cookies.delete("token");
                return response;
            }
        }
        // Token yoksa public sayfaya izin ver
        return NextResponse.next();
    }

    // 🔒 PRIVATE ROUTES - Sadece vendor/panel ve admin/panel korunmalı
    const privateRoutes = ["/vendor/panel", "/admin/panel"];
    
    if (privateRoutes.some(route => pathname.startsWith(route))) {
        // Token yoksa login'e yönlendir
        if (!token) {
            return NextResponse.redirect(new URL("/auth/login/customer", req.url));
        }

        try {
            // ✅ Token'ı backend'e doğrulat
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
            const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            });

            // ❌ Token geçersizse → cookie sil + login'e yönlendir
            if (!verifyResponse.ok) {
                console.error('[Middleware] Token verification failed:', verifyResponse.status);
                const res = NextResponse.redirect(new URL("/auth/login/customer", req.url));
                res.cookies.delete("token");
                return res;
            }

            const userData = await verifyResponse.json();
            const userRole = userData.payload?.role;
            const isApproved = userData.payload?.isApproved;

            // 🎯 ROLE-BASED ACCESS CONTROL

            // 1️⃣ VENDOR PANEL: Sadece onaylı vendor'lar erişebilir
            if (pathname.startsWith("/vendor/panel")) {
                if (userRole !== 'vendor') {
                    return NextResponse.redirect(new URL("/auth/login/vendor", req.url));
                }
                if (isApproved === false) {
                    return NextResponse.redirect(new URL("/vendor/unauthorized", req.url));
                }
                // ✅ Onaylı vendor → izin ver
                return NextResponse.next();
            }

            // 2️⃣ ADMIN PANEL: Sadece admin'ler erişebilir
            if (pathname.startsWith("/admin/panel")) {
                if (userRole !== 'admin') {
                    return NextResponse.redirect(new URL("/auth/login/admin", req.url));
                }
                // ✅ Admin → izin ver
                return NextResponse.next();
            }

        } catch (err) {
            console.error('[Middleware] Token verification error:', err);
            const res = NextResponse.redirect(new URL("/auth/login/customer", req.url));
            res.cookies.delete("token");
            return res;
        }
    }

    // 🌐 PUBLIC SITE - Diğer tüm sayfalar serbest (ana sayfa, ürünler, vs.)
    return NextResponse.next();
}

// 🔍 Middleware'in çalışacağı yollar - Sadece gerekli sayfalar
export const config = {
    matcher: [
        // Auth sayfaları
        "/auth/login/:path*",
        "/auth/register/:path*",
        // Private paneller
        "/vendor/panel/:path*",
        "/admin/panel/:path*",
        // Vendor unauthorized
        "/vendor/unauthorized/:path*",
    ],
};
