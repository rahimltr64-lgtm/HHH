'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Menu, X, Globe, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { t, lang, toggle } = useLanguage();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="btn-ghost -ms-2 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">R</span>
              <span>R.Shop</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-600"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={toggle}
              className="btn-ghost gap-1.5"
              aria-label="switch language"
              title={lang === 'ar' ? 'Français' : 'العربية'}
            >
              <Globe size={18} />
              <span className="text-xs font-semibold">{lang === 'ar' ? 'FR' : 'ع'}</span>
            </button>
            <Link href="/admin" className="btn-ghost hidden sm:inline-flex" title={t('nav.admin')}>
              <LayoutDashboard size={18} />
            </Link>
            <button onClick={() => setCartOpen(true)} className="btn-ghost relative" aria-label="cart">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-gray-100 md:hidden">
            <div className="container-page flex flex-col py-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

