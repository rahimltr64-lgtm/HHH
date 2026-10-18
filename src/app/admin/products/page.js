'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/lib/format';
import { SEED_PRODUCTS } from '@/lib/seed';

const EMPTY = {
  name: '', nameFr: '', description: '', descriptionFr: '',
  price: '', oldPrice: '', category: 'electronics', stock: 0,
  images: '', featured: false,
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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(EMPTY); setShowForm(true); };
  const openEdit = (p) => {
    setEditing({ ...p, images: (p.images || []).join('\n'), oldPrice: p.oldPrice || '' });
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); };

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
      images:

