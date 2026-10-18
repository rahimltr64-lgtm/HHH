'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import ProductCard from '@/components/ProductCard';

const CATS = ['all', 'electronics', 'fashion', 'home', 'beauty'];

function ProductsInner() {
  const { t, pick } = useLanguage();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const [cat, setCat] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (search.trim()) {
        const s = search.trim().toLowerCase();
        const hay = `${p.name || ''} ${p.nameFr || ''}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [products, cat, search]);

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-extrabold md:text-3xl">{t('nav.products')}</h1>
      <p className="mt-1 text-sm text-gray-500">{filtered.length} {pick('منتج', 'produits')}</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                cat === c
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="input !ps-9"
          />
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center text-gray-500">{t('common.noResults')}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-page py-8 text-sm text-gray-500">…</div>}>
      <ProductsInner />
    </Suspense>
  );
}

