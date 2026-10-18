'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError(t('admin.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <form onSubmit={submit} className="card w-full max-w-md p-6">
        <h1 className="mb-1 text-xl font-extrabold">{t('admin.login')}</h1>
        <p className="mb-5 text-sm text-gray-500">R.Shop</p>
        <div className="mb-3">
          <label className="label">{t('admin.email')}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
        </div>
        <div className="mb-4">
          <label className="label">{t('admin.password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
        </div>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? '…' : t('admin.signIn')}
        </button>
      </form>
    </div>
  );
}

