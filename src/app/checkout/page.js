'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2 } from 'lucide-react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice, orderNumber } from '@/lib/format';
import { WILAYAS, deliveryFee } from '@/lib/wilayas';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const { t, lang, pick } = useLanguage();

  const [form, setForm] = useState({
    customerName: '', phone: '', wilaya: '', city: '', address: '', notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  if (items.length === 0 && !success) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-xl font-bold">{t('cart.empty')}</h1>
        <p className="mt-2 text-gray-600">{t('checkout.emptyCart')}</p>
        <Link href="/products" className="btn-primary mt-5">{t('cart.continueShopping')}</Link>
      </div>
    );
  }

  const fee = form.wilaya ? deliveryFee(Number(form.wilaya), subtotal) : 0;
  const total = subtotal + fee;

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = t('checkout.required');
    if (!/^0[5-7][0-9]{8}$/.test(form.phone.trim())) e.phone = t('checkout.invalidPhone');
    if (!form.wilaya) e.wilaya = t('checkout.required');
    if (!form.city.trim()) e.city = t('checkout.required');
    if (!form.address.trim()) e.address = t('checkout.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!isFirebaseConfigured) {
      alert('Firebase not configured. Please set env vars.');
      return;
    }
    setSubmitting(true);
    try {
      const num = orderNumber();
      const payload = {
        orderNumber: num,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        wilaya: Number(form.wilaya),
        wilayaName: WILAYAS.find((w) => w.code === Number(form.wilaya))?.ar || '',
        city: form.city.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        items: items.map((i) => ({ id: i.id, name: i.name, nameFr: i.nameFr, price: i.price, qty: i.qty })),
        subtotal, deliveryFee: fee, total,
        status: 'pending',
        createdAt: serverTimestamp(),
        lang,
      };
      await addDoc(collection(db, 'orders'), payload);
      clear();
      setSuccess({ orderNumber: num, total });
    } catch (e) {
      console.error(e);
      alert(t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container-page py-16 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-green-100 text-green-600">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-extrabold">{t('checkout.success')}</h1>
        <p className="mt-2 text-gray-600">{t('checkout.successMsg')}</p>
        <div className="card mx-auto mt-6 max-w-sm p-5 text-start">
          <div className="flex justify-between text-sm"><span className="text-gray-600">{t('checkout.orderNumber')}</span><span className="font-bold">{success.orderNumber}</span></div>
          <div className="mt-2 flex justify-between text-sm"><span className="text-gray-600">{t('cart.total')}</span><span className="font-bold">{formatPrice(success.total, lang)}</span></div>
        </div>
        <Link href="/products" className="btn-primary mt-6">{t('checkout.continue')}</Link>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 text-2xl font-extrabold">{t('checkout.title')}</h1>

      <form onSubmit={submit} className="grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">{t('checkout.fullName')}</label>
              <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="input" />
              {errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
            </div>
            <div>
              <label className="label">{t('checkout.phone')}</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XXXXXXXX" className="input" inputMode="numeric" />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">{t('checkout.wilaya')}</label>
              <select value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="input">
                <option value="">—</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code.toString().padStart(2, '0')} — {pick(w.ar, w.fr)}
                  </option>
                ))}
              </select>
              {errors.wilaya && <p className="mt-1 text-xs text-red-500">{errors.wilaya}</p>}
            </div>
            <div>
              <label className="label">{t('checkout.city')}</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
            </div>
            <div>
              <label className="label">{t('checkout.address')}</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">{t('checkout.notes')}</label>
              <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input resize-none" />
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">{t('checkout.codNote')}</p>
        </div>

        <aside className="card h-fit p-5">
          <h2 className="mb-3 font-bold">{t('cart.title')}</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">{pick(i.name, i.nameFr)} × {i.qty}</span>
                <span className="whitespace-nowrap">{formatPrice(i.price * i.qty, lang)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">{t('cart.subtotal')}</span><span>{formatPrice(subtotal, lang)}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">{t('cart.delivery')}</span><span>{fee === 0 ? t('cart.freeDelivery') : formatPrice(fee, lang)}</span></div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold"><span>{t('cart.total')}</span><span className="text-brand-600">{formatPrice(total, lang)}</span></div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">
            {submitting ? '…' : t('checkout.placeOrder')}
          </button>
        </aside>
      </form>
    </div>
  );
}

