import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PWARegister from '@/components/PWARegister';

export const metadata = {
  title: 'R.Shop | متجرك لكل ما تحتاجه',
  description:
    'متجر إلكتروني متنوع يوفّر لك منتجات مختارة في الإلكترونيات والأزياء والمنزل والعناية والمزيد، مع توصيل لكافة الولايات الـ58 والدفع عند الاستلام.',
  manifest: '/manifest.json',
  themeColor: '#4d6bfe',
  metadataBase: new URL('https://rshopnew.vercel.app'),
  openGraph: {
    title: 'R.Shop | متجرك لكل ما تحتاجه',
    description: 'توصيل لكل الولايات الـ58 والدفع عند الاستلام.',
    type: 'website',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4d6bfe',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-ink">
        <LanguageProvider>
          <CartProvider>
            <AuthProvider>
              <Navbar />
              <main className="min-h-[70vh]">{children}</main>
              <Footer />
              <PWARegister />
            </AuthProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

