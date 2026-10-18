'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { Laptop, Shirt, Home as HomeIcon, Sparkles, ArrowRight, Truck, BadgeCheck, Wallet } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = [
  { key: 'electronics', icon: Laptop },
  { key: 'fashion', icon: Shirt },
  { key: 'home', icon: HomeIcon },
  { key: 'beauty', icon: Sparkles },
];

export default function HomePage() {
  const { t, pick } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    (async () => {
      try {
        const q = query(collection(db, 'products'), where('featured', '==', true), limit(8));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (list.length) setFeatured(list);
        else {
          const all = await getDocs(query(collection(db, 'products'), limit(8)));
          setFeatured(all.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <span className="badge mb-3 bg-brand-100 text-brand-700">R.Shop</span>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mt-4 max-w-xl text-gray-600 leading-relaxed">
              {t('home.heroSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary !px-6 !py-3">
                {t('home.cta')} <ArrowRight size={18} className="rtl:rotate-180" />
              </Link>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600"><Truck size={16} className="text-brand-500" /> 58 {pick('ولاية', 'wilayas')}</div>
              <div className="flex items-center gap-2 text-gray-600"><Wallet size={16} className="text-brand-500" /> COD</div>
              <div className="flex items-center gap-2 text-gray-600"><BadgeCheck size={16} className="text-brand-500" /> {pick('جودة', 'Qualité')}</div>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl bg-brand-500/10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80"
              alt="shopping"
              className="relative h-full w-full rounded-3xl object-cover shadow-soft"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-12">
        <h2 className="mb-6 text-xl font-bold md:text-2xl">{t('home.categories')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map(({ key, icon: Icon }) => (
            <Link
              key={key}
              href={`/products?cat=${key}`}
              className="card flex flex-col items-center gap-2 p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={22} />
              </div>
              <span className="text-sm font-semibold">{t(`categories.${key}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-page pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold md:text-2xl">{t('home.featured')}</h2>
          <Link href="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
            {t('home.viewAll')} <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        ) : featured.length === 0 ? (
          <p className="text-sm text-gray-500">{t('common.noResults')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* WHY US */}
      <section className="container-page pb-16">
        <h2 className="mb-6 text-xl font-bold md:text-2xl">{t('home.whyUs')}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { icon: Truck, k: 1 },
            { icon: Wallet, k: 2 },
            { icon: BadgeCheck, k: 3 },
          ].map(({ icon: Icon, k }) => (
            <div key={k} className="card flex items-start gap-3 p-5">
              <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-bold">{t(`home.f${k}Title`)}</h3>
                <p className="mt-0.5 text-sm text-gray-600">{t(`home.f${k}Desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

