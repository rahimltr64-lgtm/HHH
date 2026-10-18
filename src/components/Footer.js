'use client';

import Link from 'next/link';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  const ig = process.env.NEXT_PUBLIC_INSTAGRAM;
  const fb = process.env.NEXT_PUBLIC_FACEBOOK;

  return (
    <footer className="mt-16 border-t border-gray-100 bg-surface">
      <div className="container-page grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2 font-extrabold text-xl">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">R</span>
            <span>R.Shop</span>
          </div>
          <p className="text-sm text-gray-600">{t('tagline')}</p>
        </div>
        <div>
          <h3 className="mb-3 font-bold">{t('footer.contact')}</h3>
          <ul className="space-y-2 text-sm">
            {wa && (
              <li>
                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </li>
            )}
            {ig && (
              <li>
                <a href={`https://instagram.com/${ig}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600">
                  <Instagram size={16} /> @{ig}
                </a>
              </li>
            )}
            {fb && (
              <li>
                <a href={`https://facebook.com/${fb}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-600">
                  <Facebook size={16} /> {fb}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-bold">{t('nav.products')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="text-gray-600 hover:text-brand-600">{t('nav.products')}</Link></li>
            <li><Link href="/cart" className="text-gray-600 hover:text-brand-600">{t('nav.cart')}</Link></li>
            <li><Link href="/admin" className="text-gray-600 hover:text-brand-600">{t('nav.admin')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200/60 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} R.Shop — {t('footer.rights')}
      </div>
    </footer>
  );
}

