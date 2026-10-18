'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/format';
import { SEED_PRODUCTS } from '@/lib/seed';

// Newline separator that can never be corrupted by editors or GitHub paste
const NL = String.fromCharCode(10);

const EMPTY = {
  name: '',
  nameFr: '',
  description: '',
  descriptionFr: '',
  price: '',
  oldPrice: '',
  category: 'electronics',
  stock: 0,
  images: '',
  featured: false,
};

export default function AdminProductsPage() {
  const { t, lang, pick } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'products'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setProducts(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(EMPTY);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing({
      ...p,
      images: (p.images || []).join(NL),
      oldPrice: p.oldPrice || '',
    });
    setShowForm(true);
  };

  const close = () => {
    setShowForm(false);
    setEditing(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!db || !editing) return;
    const payload = {
      name: editing.name.trim(),
      nameFr: editing.nameFr.trim(),
      description: editing.description.trim(),
      descriptionFr: editing.descriptionFr.trim(),
      price: Number(editing.price) || 0,
      oldPrice: Number(editing.oldPrice) || 0,
      category: editing.category,
      stock: Number(editing.stock) || 0,
      images: String(editing.images || '')
        .split(NL)
        .map((s) => s.trim())
        .filter(Boolean),
      featured: !!editing.featured,
    };
    try {
      if (editing.id) {
        await updateDoc(doc(db, 'products', editing.id), payload);
      } else {
        await addDoc(collection(db, 'products'), {
          ...payload,
          rating: 0,
          reviewCount: 0,
          createdAt: serverTimestamp(),
        });
      }
      close();
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!db || !confirm(t('admin.confirmDelete'))) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const seed = async () => {
    if (!db) return;
    if (products.length > 0) {
      alert(t('admin.seedExists'));
      return;
    }
    try {
      for (const p of SEED_PRODUCTS) {
        await addDoc(collection(db, 'products'), { ...p, createdAt: serverTimestamp() });
      }
      alert(t('admin.seeded'));
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{t('admin.products')}</h2>
        <div className="flex gap-2">
          <button onClick={seed} className="btn-outline">{t('admin.seed')}</button>
          <button onClick={openNew} className="btn-primary gap-1">
            <Plus size={16} /> {t('admin.newProduct')}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{t('common.loading')}</p>
      ) : products.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">{t('common.noResults')}</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="card flex gap-3 p-3">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {p.images?.[0] && (
                  <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="line-clamp-2 text-sm font-semibold">{pick(p.name, p.nameFr)}</p>
                <p className="text-sm font-bold text-brand-600">{formatPrice(p.price, lang)}</p>
                <p className="text-xs text-gray-500">
                  {t('admin.stock')}: {p.stock}
                </p>
                <div className="mt-auto flex justify-end gap-1">
                  <button onClick={() => openEdit(p)} className="btn-ghost !p-1.5">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => remove(p.id)} className="btn-ghost !p-1.5 text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <form
            onSubmit={save}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editing.id ? t('admin.editProduct') : t('admin.newProduct')}
              </h3>
              <button type="button" onClick={close} className="btn-ghost -me-2">
                <X size={20} />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">{t('admin.nameAr')}</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">{t('admin.nameFr')}</label>
                <input
                  value={editing.nameFr}
                  onChange={(e) => setEditing({ ...editing, nameFr: e.target.value })}
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t('admin.descAr')}</label>
                <textarea
                  rows={2}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="input resize-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t('admin.descFr')}</label>
                <textarea
                  rows={2}
                  value={editing.descriptionFr}
                  onChange={(e) => setEditing({ ...editing, descriptionFr: e.target.value })}
                  className="input resize-none"
                />
              </div>
              <div>
                <label className="label">{t('admin.price')}</label>
                <input
                  type="number"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">{t('admin.oldPrice')}</label>
                <input
                  type="number"
                  value={editing.oldPrice}
                  onChange={(e) => setEditing({ ...editing, oldPrice: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">{t('admin.stock')}</label>
                <input
                  type="number"
                  value={editing.stock}
                  onChange={(e) => setEditing({ ...editing, stock: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">{t('admin.category')}</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="input"
                >
                  <option value="electronics">{t('categories.electronics')}</option>
                  <option value="fashion">{t('categories.fashion')}</option>
                  <option value="home">{t('categories.home')}</option>
                  <option value="beauty">{t('categories.beauty')}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t('admin.images')}</label>
                <textarea
                  rows={3}
                  value={editing.images}
                  onChange={(e) => setEditing({ ...editing, images: e.target.value })}
                  className="input resize-none"
                />
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  id="featured"
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                />
                <label htmlFor="featured" className="text-sm">{t('admin.featured')}</label>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={close} className="btn-outline">
                {t('admin.cancel')}
              </button>
              <button type="submit" className="btn-primary">
                {t('admin.save')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
    }
