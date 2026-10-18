'use client';

import Link from 'next/link';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/format';

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, updateQty, remove, count } = useCart();
  const { t, lang, pick } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute end-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-lg font-bold">{t('cart.title')} ({count})</h2>
          <button className="btn-ghost -me-2" onClick={onClose} aria-label="close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-gray-500">{t('cart.empty')}</p>
              <Link href="/products" onClick={onClose} className="btn-primary">
                {t('cart.continueShopping')}
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-xl border border-gray-100 p-2">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium">{pick(item.name, item.nameFr)}</p>
                      <button onClick={() => remove(item.id)} className="text-gray-400 hover:text-red-500" aria-label="remove">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-gray-200">
                        <button onClick={() => updateQty(item.id, item.qty - 1)} className="p-1.5 text-gray-600">
                          <Minus size={14} />
                        </button>
                        <span className="min-w-7 text-center text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} className="p-1.5 text-gray-600">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(item.price * item.qty, lang)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('cart.subtotal')}</span>
              <span className="font-bold">{formatPrice(subtotal, lang)}</span>
            </div>
            <Link href="/checkout" onClick={onClose} className="btn-primary w-full">
              {t('cart.checkout')}
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

