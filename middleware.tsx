import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // 🔓 Public routes - Token kontrolü yok
    const publicRoutes = ["/auth/login/customer", "/auth/login/vendor", "/auth/login/admin", "/auth/register"];
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
                    
                    // Giriş yapmış kullanıcıyı role'üne göre yönlendir
                    if (userRole === 'vendor') {
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
                const response = NextResponse.next();
                response.cookies.delete("token");
                return response;
            }
        }
        // Token yoksa public sayfaya izin ver
        return NextResponse.next();
    }

    // 🔒 Protected routes - Token gerekli
    if (!token) {
        // Token yoksa login'e yönlendir
        return NextResponse.redirect(new URL("/auth/login/customer", req.url));
    }

    try {
        // ✅ Token'ı backend'e doğrulat
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const verifyResponse = await fetch(`${apiUrl}/auth/verify`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        // ❌ Token geçersizse → cookie sil + login'e yönlendir
        if (!verifyResponse.ok) {
            const res = NextResponse.redirect(new URL("/auth/login/customer", req.url));
            res.cookies.delete("token");
            return res;
        }

        const userData = await verifyResponse.json();
        const userRole = userData.payload?.role;

        // 🎯 ROLE-BASED ACCESS CONTROL

        // 1️⃣ VENDOR: Sadece /vendor/panel ve alt sayfalarına erişebilir
        if (userRole === 'vendor') {
            if (!pathname.startsWith("/vendor/panel")) {
                // Vendor başka bir sayfaya gitmeye çalışıyor → vendor panel'e yönlendir
                return NextResponse.redirect(new URL("/vendor/panel", req.url));
            }
            // Vendor /vendor/panel/* sayfalarında → izin ver
            return NextResponse.next();
        }

        // 2️⃣ CUSTOMER: /vendor/panel ve /admin/panel'e erişemez
        if (userRole === 'customer') {
            if (pathname.startsWith("/vendor/panel") || pathname.startsWith("/admin/panel")) {
                // Customer yasak sayfaya gitmeye çalışıyor → ana sayfaya yönlendir
                return NextResponse.redirect(new URL("/", req.url));
            }
            // Customer diğer sayfalarda → izin ver
            return NextResponse.next();
        }

        // 3️⃣ ADMIN: Tüm sayfalara erişebilir
        if (userRole === 'admin') {
            return NextResponse.next();
        }

        // 🚫 Bilinmeyen role → login'e yönlendir
        const res = NextResponse.redirect(new URL("/auth/login/customer", req.url));
        res.cookies.delete("token");
        return res;

    } catch (err) {
        console.error("Token doğrulama hatası:", err);
        const res = NextResponse.redirect(new URL("/auth/login/customer", req.url));
        res.cookies.delete("token");
        return res;
    }
}

// 🔍 Middleware'in çalışacağı yollar
export const config = {
    matcher: [
        /*
         * Tüm route'larda middleware çalışır, şunlar hariç:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
