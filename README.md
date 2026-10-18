# 🛒 R.Shop — الإصدار 2.0

متجر إلكتروني متنوع (إلكترونيات، أزياء، منزل، عناية والمزيد) مع توصيل لكل الولايات الـ58 والدفع عند الاستلام.

## ✨ الميزات

- **Next.js 14 (App Router) + Tailwind CSS** — أداء عالٍ و SEO ممتاز.
- **ثنائي اللغة (عربي / فرنسي)** مع تبديل اتجاه RTL/LTR.
- **PWA** — قابل للتثبيت ويعمل دون اتصال.
- **Firebase** (Firestore + Auth + Storage).
- **لوحة تحكم للأدمن**: إدارة المنتجات، الطلبات، الإحصائيات.
- **تقييمات وآراء** للزوار لكل منتج.
- **تكامل واتساب / إنستغرام**.
- **58 ولاية جزائرية** مع حساب التوصيل تلقائياً.
- **الدفع عند الاستلام** (COD).
- **تحليلات مبيعات**: إيرادات، طلبات حسب الحالة، أكثر الولايات طلباً.

## 🚀 التشغيل

```bash
npm install
cp .env.example .env.local   # املأ بيانات Firebase
npm run dev
```

افتح http://localhost:3000.

## 🔧 إعداد Firebase

1. أنشئ مشروعاً على console.firebase.google.com.
2. فعّل:

- **Authentication** → Sign-in method → Email/Password.
- **Firestore Database** → Create database → Production mode.
- **Storage** (اختياري لرفع صور المنتجات).
3. من Project Settings → General → Your apps → Web، انسخ بيانات `firebaseConfig` إلى `.env.local`.
4. من Authentication → Users → Add user — أنشئ حساب الأدمن بنفس بريد `NEXT_PUBLIC_ADMIN_EMAIL`.
5. في Firestore، سجّل أول منتج من لوحة التحكم أو استخدم زر "استيراد بيانات تجريبية" في `/admin/products`.

## 🔐 قواعد Firestore (مهم!)

انسخ القواعد التالية في Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
             request.auth.token.email == 'admin@rshop.dz'; // بدّلها
    }

    match /products/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /reviews/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasAll(['productId','name','rating','comment','createdAt']);
      allow update, delete: if isAdmin();
    }
    match /orders/{id} {
      allow create: if request.resource.data.keys().hasAll(['customerName','phone','wilaya','total','items','status']);
      allow read, update, delete: if isAdmin();
    }
  }
}
```

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── layout.js          # Root layout + Providers
│   ├── page.js            # Home
│   ├── products/          # Catalog + product detail
│   ├── cart/, checkout/   # Cart & order
│   └── admin/             # Dashboard, products, orders, analytics
├── components/            # Navbar, Footer, ProductCard, ...
├── context/               # Language, Cart, Auth
└── lib/                   # firebase, i18n, wilayas, seed
```

## 🌐 النشر

### Vercel (موصى به)

1. ارفع المشروع إلى GitHub.
2. New Project على vercel.com → استورد المستودع.
3. أضف متغيرات البيئة من `.env.example`.
4. Deploy.

بعد النشر، أضف نطاق Vercel إلى:

- Firebase → Authentication → Settings → Authorized domains
- Firebase → Project Settings → API restrictions (إن استخدمت)

### PWA Icons

أضف في `public/icons/`:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)
- `apple-touch-icon.png` (180×180)

يمكنك توليدها من realfavicongenerator.net.

## 📄 الترخيص

MIT

</BDS:create_file>
<BDS:create_file fileName="rshop/public/manifest.json">

```json
{
  "name": "R.Shop — متجرك لكل ما تحتاجه",
  "short_name": "R.Shop",
  "description": "متجر إلكتروني متنوع: إلكترونيات، أزياء، منزل، عناية والمزيد.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#4d6bfe",
  "lang": "ar",
  "dir": "rtl",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}

