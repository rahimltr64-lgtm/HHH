'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { formatPrice, formatDate } from '@/lib/format';
import StarRating from '@/components/StarRating';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, lang, pick } = useLanguage();
  const { add } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!db || !id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
        else router.push('/products');
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id, router]);

  useEffect(() => {
    if (!db || !id) return;
    (async () => {
      try {
        const q = query(collection(db, 'reviews'), where('productId', '==', id));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setReviews(list);
      } catch (e) { console.error(e); }
    })();
  }, [id, submitted]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!db || !form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: id,
        name: form.name.trim(),
        rating: Number(form.rating) || 5,
        comment: form.comment.trim(),
        createdAt: serverTimestamp(),
      });
      setForm({ name: '', rating: 5, comment: '' });
      setSubmitted((v) => !v);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="container-page py-10 text-sm text-gray-500">{t('common.loading')}</div>;
  if (!product) return null;

  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : (product.rating || 0).toFixed(1);

  return (
    <div className="container-page py-8">
      <button onClick={() => router.back()} className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600">
        <ArrowRight size={16} className="rtl:rotate-180 rotate-180" /> {t('cart.continueShopping')}
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
            {product.images?.[activeImg] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[activeImg]} alt={pick(product.name, product.nameFr)} className="h-full w-full object-cover" />
            ) : null}
          </div>
          {product.images?.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${i === activeImg ? 'border-brand-500' : 'border-transparent'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">{pick(product.name, product.nameFr)}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <StarRating value={Math.round(Number(avgRating))} readOnly size={16} />
            <span className="text-gray-500">{avgRating} · {reviews.length} {t('product.reviews')}</span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            <span className="text-2xl font-extrabold text-brand-600">{formatPrice(product.price, lang)}</span>
            {hasDiscount && (
              <>
                <span className="text-gray-400 line-through">{formatPrice(product.oldPrice, lang)}</span>
                <span className="badge bg-red-100 text-red-600">-{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-4 whitespace-pre-line text-gray-700 leading-relaxed">
            {pick(product.description, product.descriptionFr)}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className={`badge ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
              {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-gray-200">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600">−</button>
                <span className="min-w-8 text-center">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-gray-600">+</button>
              </div>
              <button
                onClick={() => add(product, qty)}
                className="btn-primary !px-6 !py-3"
              >
                <ShoppingBag size={18} /> {t('product.addToCart')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-14">
        <h2 className="mb-4 text-xl font-bold">{t('product.reviews')} ({reviews.length})</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-500">{t('product.noReviews')}</p>
            ) : reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{r.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(r.createdAt, lang)}</span>
                </div>
                <div className="my-1"><StarRating value={r.rating} readOnly size={14} /></div>
                <p className="text-sm text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>

          <form onSubmit={submitReview} className="card h-fit p-5">
            <h3 className="mb-3 font-bold">{t('product.writeReview')}</h3>
            <div className="mb-3">
              <label className="label">{t('product.name')}</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div className="mb-3">
              <label className="label">{t('product.rating')}</label>
              <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <div className="mb-3">
              <label className="label">{t('product.comment')}</label>
              <textarea
                rows={3}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="input resize-none"
                required
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? '…' : t('product.submit')}
            </button>
            {submitted && <p className="mt-2 text-sm text-green-600">{t('product.saved')}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}

