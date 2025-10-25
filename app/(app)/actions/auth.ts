// app/actions/auth.ts
"use server";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// XSS koruması için sanitization
function sanitizeInput(input: unknown): string {
    if (typeof input !== 'string') return '';
    const window = new JSDOM('').window;
    const purify = DOMPurify(window as unknown as Window & typeof globalThis);
    return purify.sanitize(input, { ALLOWED_TAGS: [] });
}

// Email validation
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function isValidPassword(password: string): boolean {
    // En az 8 karakter, büyük harf, küçük harf, rakam ve özel karakter
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export async function signup(prevState: unknown, formData: FormData) {
    const rawFormData = {
        name: sanitizeInput(formData.get("name")),
        email: sanitizeInput(formData.get("email")),
        password: formData.get("password") as string,
        phone: sanitizeInput(formData.get("phone")),
    };

    try {
        // Input validation
        if (!rawFormData.email || !rawFormData.password || !rawFormData.name) {
            return { message: "Tüm alanlar zorunludur", type: "error" };
        }

        if (!isValidEmail(rawFormData.email)) {
            return { message: "Geçerli bir e-posta adresi giriniz", type: "error" };
        }

        if (!isValidPassword(rawFormData.password)) {
            return { 
                message: "Şifre en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir", 
                type: "error" 
            };
        }

        if (rawFormData.name.length < 2) {
            return { message: "Ad soyad en az 2 karakter olmalıdır", type: "error" };
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
        const response = await fetch(`${apiUrl}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rawFormData),
        });

        const data = await response.json();

        if (!response.ok) {

            return {
                message: data.message || "Kayıt sırasında bir hata oluştu",
                type: "error"
            };
        }


        return {
            message: data.message || "Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...",
            type: "success",
            data: data
        };

    } catch (error) {
        console.error("Signup error:", error);
        return {
            message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
            type: "error"
        };
    }
}

// Customer Login
export async function loginCustomer(prevState: unknown, formData: FormData) {
    const rawFormData = {
        email: sanitizeInput(formData.get("email")),
        password: formData.get("password") as string,
    };

    try {
        if (!rawFormData.email || !rawFormData.password) {
            return { message: "E-posta ve şifre zorunludur", type: "error" };
        }

        if (!isValidEmail(rawFormData.email)) {
            return { message: "Geçerli bir e-posta adresi giriniz", type: "error" };
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
        const response = await fetch(`${apiUrl}/auth/login/customer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rawFormData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                message: data.message || "Müşteri girişi sırasında bir hata oluştu",
                type: "error",
            };
        }

        const cookieStore = await cookies();
        cookieStore.set({
            name: "token",
            value: data.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });

        redirect("/");

    } catch (error) {
        if (error && typeof error === 'object' && 'digest' in error && 
            typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Customer login error:", error);
        return {
            message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
            type: "error",
        };
    }
}

// Vendor Login
export async function loginVendor(prevState: unknown, formData: FormData) {
    const rawFormData = {
        email: sanitizeInput(formData.get("email")),
        password: formData.get("password") as string,
    };

    try {
        if (!rawFormData.email || !rawFormData.password) {
            return { message: "E-posta ve şifre zorunludur", type: "error" };
        }

        if (!isValidEmail(rawFormData.email)) {
            return { message: "Geçerli bir e-posta adresi giriniz", type: "error" };
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
        const response = await fetch(`${apiUrl}/auth/login/vendor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rawFormData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                message: data.message || "Satıcı girişi sırasında bir hata oluştu",
                type: "error",
            };
        }

        const cookieStore = await cookies();
        cookieStore.set({
            name: "token",
            value: data.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });

        redirect("/vendor/panel");

    } catch (error) {
        if (error && typeof error === 'object' && 'digest' in error && 
            typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Vendor login error:", error);
        return {
            message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
            type: "error",
        };
    }
}

// Admin Login
export async function loginAdmin(prevState: unknown, formData: FormData) {
    const rawFormData = {
        email: sanitizeInput(formData.get("email")),
        password: formData.get("password") as string,
    };

    try {
        if (!rawFormData.email || !rawFormData.password) {
            return { message: "E-posta ve şifre zorunludur", type: "error" };
        }

        if (!isValidEmail(rawFormData.email)) {
            return { message: "Geçerli bir e-posta adresi giriniz", type: "error" };
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
        const response = await fetch(`${apiUrl}/auth/login/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rawFormData),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                message: data.message || "Admin girişi sırasında bir hata oluştu",
                type: "error",
            };
        }

        const cookieStore = await cookies();
        cookieStore.set({
            name: "token",
            value: data.access_token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24,
        });

        redirect("/admin/panel");

    } catch (error) {
        if (error && typeof error === 'object' && 'digest' in error && 
            typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("Admin login error:", error);
        return {
            message: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
            type: "error",
        };
    }
}

export async function verifySession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return { authenticated: false };
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-master-jgfr.onrender.com/api/v1';
        const res = await fetch(`${apiUrl}/auth/me`, {
            headers: {
                // Sunucu eyleminden istek atıldığı için httpOnly cookie otomatik iletilmez; header'a ekleyelim
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
        });
        if (!res.ok) {
            // Token geçersizse cookie'yi temizle
            cookieStore.set({
                name: 'token',
                value: '',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite: 'lax',
                maxAge: 0,
            });
            return { authenticated: false };
        }
        const data = await res.json();
        return { authenticated: !!data.valid, payload: data.payload };
    } catch {
        // Hata durumunda da cookie'yi temizle
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'token',
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            maxAge: 0,
        });
        return { authenticated: false };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 0,
    });
    return { message: 'Çıkış yapıldı', type: 'success' };
}

export async function checkUserRole() {
    try {
        const session = await verifySession();
        if (!session.authenticated) {
            return { hasAccess: false, role: null };
        }
        
        const userRole = session.payload?.role;
        return { hasAccess: true, role: userRole };
    } catch (error) {
        console.error("Role check failed:", error);
        return { hasAccess: false, role: null };
    }
}