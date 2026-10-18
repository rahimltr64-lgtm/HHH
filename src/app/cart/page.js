'use client';

import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, subtotal, updateQty, remove } = useCart();
  const { t, lang, pick } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="container-page py-16 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-xl font-bold">{t('cart.empty')}</h1>
        <Link href="/products" className="btn-primary mt-5">{t('cart.continueShopping')}</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-extrabold">{t('cart.title')}</h1>
      <div className="grid gap-6 md:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="card flex gap-3 p-3">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/products/${item.id}`} className="line-clamp-2 font-medium hover:text-brand-600">
                    {pick(item.name, item.nameFr)}
                  </Link>
                  <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500" aria-label="remove">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-gray-200">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-2 text-gray-600"><Minus size={14} /></button>
                    <span className="min-w-8 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-2 text-gray-600"><Plus size={14} /></button>
                  </div>
                  <span className="font-semibold">{formatPrice(item.price * item.qty, lang)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card h-fit p-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('cart.subtotal')}</span>
            <span className="font-bold">{formatPrice(subtotal, lang)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">{t('cart.freeDeliveryHint')}</p>
          <Link href="/checkout" className="btn-primary mt-5 w-full">{t('cart.checkout')}</Link>
          <Link href="/products" className="btn-outline mt-2 w-full">{t('cart.continueShopping')}</Link>
        </aside>
      </div>
    </div>
  );
}

