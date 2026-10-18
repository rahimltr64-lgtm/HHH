'use client';

import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }) {
  const { lang, pick, t } = useLanguage();
  const { add } = useCart();

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    add(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={pick(product.name, product.nameFr)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}
        {hasDiscount && (
          <span className="badge absolute start-2 top-2 bg-red-500 text-white">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="badge absolute end-2 top-2 bg-gray-900 text-white">{t('product.outOfStock')}</span>
        )}
      </div>
      <div className="p-3.5">
        <p className="mb-1.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold">
          {pick(product.name, product.nameFr)}
        </p>
        <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          <span>{(product.rating || 0).toFixed(1)}</span>
          <span>({product.reviewCount || 0})</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-brand-600">{formatPrice(product.price, lang)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.oldPrice, lang)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn-primary !px-3 !py-2 text-xs"
            aria-label={t('product.addToCart')}
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
}

