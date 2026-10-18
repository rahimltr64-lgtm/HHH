'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const NAV = [
  { href: '/admin', icon: LayoutDashboard, key: 'admin.dashboard' },
  { href: '/admin/products', icon: Package, key: 'admin.products' },
  { href: '/admin/orders', icon: ShoppingCart, key: 'admin.orders' },
  { href: '/admin/analytics', icon: BarChart3, key: 'admin.analytics' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const { user, loading, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (pathname === '/admin/login') return;
    if (!user) router.push('/admin/login');
  }, [user, loading, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;

  if (loading) return <div className="container-page py-10 text-sm text-gray-500">{t('common.loading')}</div>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-xl font-bold text-red-600">{t('admin.notAdmin')}</h1>
        <button onClick={logout} className="btn-outline mt-4">{t('admin.logout')}</button>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">{t('nav.admin')}</h1>
        <button onClick={() => { logout(); router.push('/'); }} className="btn-outline gap-2">
          <LogOut size={16} /> {t('admin.logout')}
        </button>
      </div>

      <nav className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-2">
        {NAV.map(({ href, icon: Icon, key }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                active ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} /> {t(key)}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}

