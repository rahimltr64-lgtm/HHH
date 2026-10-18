'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice, formatDate } from '@/lib/format';

export default function AdminDashboard() {
  const { t, lang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(list);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const valid = orders.filter((o) => o.status !== 'cancelled');
  const revenue = valid.reduce((s, o) => s + (o.total || 0), 0);
  const avg = valid.length ? Math.round(revenue / valid.length) : 0;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={t('admin.totalRevenue')} value={formatPrice(revenue, lang)} />
        <Stat label={t('admin.totalOrders')} value={orders.length} />
        <Stat label={t('admin.avgOrder')} value={formatPrice(avg, lang)} />
      </div>

      <div className="mt-6 card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">{t('admin.recentOrders')}</h2>
          <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">{t('admin.orders')} →</Link>
        </div>
        {loading ? (
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">{t('common.noResults')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-gray-500">
                  <th className="py-2 text-start font-medium">#</th>
                  <th className="py-2 text-start font-medium">{t('checkout.fullName')}</th>
                  <th className="py-2 text-start font-medium">{t('cart.total')}</th>
                  <th className="py-2 text-start font-medium">{t('admin.updateStatus')}</th>
                  <th className="py-2 text-start font-medium">—</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o) => (
                  <tr key={o.id} className="border-t border-gray-100">
                    <td className="py-2 font-mono text-xs">{o.orderNumber}</td>
                    <td className="py-2">{o.customerName}</td>
                    <td className="py-2 font-semibold">{formatPrice(o.total, lang)}</td>
                    <td className="py-2"><StatusBadge status={o.status} /></td>
                    <td className="py-2 text-xs text-gray-400">{formatDate(o.createdAt, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-brand-600">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return <span className={`badge ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

