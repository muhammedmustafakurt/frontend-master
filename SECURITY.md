# Frontend Güvenlik Rehberi

## Uygulanan Güvenlik Önlemleri

### 1. XSS (Cross-Site Scripting) Koruması
- ✅ DOMPurify ile input sanitization
- ✅ Content Security Policy (CSP) headers
- ✅ X-XSS-Protection header
- ✅ React'ın built-in XSS koruması

### 2. Input Validation & Sanitization
- ✅ Client-side input validation
- ✅ Email format validation
- ✅ Password strength validation
- ✅ HTML tag sanitization
- ✅ Server-side validation ile senkronizasyon

### 3. Security Headers
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: origin-when-cross-origin
- ✅ Strict-Transport-Security
- ✅ Content-Security-Policy

### 4. Authentication Security
- ✅ HttpOnly cookies
- ✅ Secure cookie flags (production)
- ✅ SameSite cookie attribute
- ✅ Token expiration handling
- ✅ Automatic logout on token expiry

### 5. CSRF Protection
- ✅ SameSite cookie attribute
- ✅ Origin header validation
- ✅ CSRF token implementation (middleware)

### 6. Environment Security
- ✅ Environment variables for API URLs
- ✅ No sensitive data in client-side code
- ✅ Production/development environment separation

## Kurulum ve Yapılandırma

### 1. Environment Variables
```bash
# .env.local dosyası oluşturun
cp env.example .env.local

# Gerekli değişkenleri düzenleyin:
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### 2. Production Güvenlik Kontrolleri
- [ ] HTTPS kullanımı zorunlu
- [ ] Environment variables güvenli şekilde saklanmalı
- [ ] CSP headers production'a uygun şekilde yapılandırılmalı
- [ ] Source maps production'da devre dışı
- [ ] X-Powered-By header devre dışı

### 3. Content Security Policy
```javascript
// next.config.ts içinde CSP yapılandırması
Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:4000;"
```

## Güvenlik Testleri

### 1. XSS Testleri
```javascript
// Console'da test edin:
// Bu kod çalışmamalı (sanitized olmalı)
document.body.innerHTML = '<script>alert("XSS")</script>';
```

### 2. Input Validation Testleri
```javascript
// Form validation testleri
// Geçersiz email: test@
// Zayıf şifre: 123
// XSS payload: <script>alert(1)</script>
```

### 3. Cookie Security Testleri
```javascript
// Console'da test edin:
// HttpOnly cookie'ler JavaScript'ten okunamaz olmalı
document.cookie; // token cookie görünmemeli
```

## Güvenlik Best Practices

### 1. Client-Side Security
- ✅ Never store sensitive data in localStorage
- ✅ Use HttpOnly cookies for authentication
- ✅ Validate all user inputs
- ✅ Sanitize HTML content
- ✅ Use HTTPS in production

### 2. API Communication
- ✅ Use environment variables for API URLs
- ✅ Implement proper error handling
- ✅ Don't expose sensitive error messages
- ✅ Use secure HTTP methods

### 3. State Management
- ✅ Clear sensitive data on logout
- ✅ Implement session timeout
- ✅ Handle token expiration gracefully
- ✅ Secure state persistence

## Monitoring ve Logging

### 1. Security Events
- [ ] Authentication failures
- [ ] XSS attempt detection
- [ ] CSRF attack attempts
- [ ] Rate limiting violations

### 2. Error Tracking
- [ ] Client-side error tracking (Sentry)
- [ ] Security event logging
- [ ] Performance monitoring
- [ ] User behavior analytics

## Güvenlik Güncellemeleri

### Düzenli Kontroller
- [ ] Dependencies güncellemeleri
- [ ] Security advisories takibi
- [ ] CSP policy review
- [ ] Penetration testing

### Acil Durum Planı
1. Güvenlik açığı tespit edildiğinde
2. Hemen patch uygulama
3. Kullanıcıları bilgilendirme
4. Monitoring artırma
5. Security headers güncelleme
