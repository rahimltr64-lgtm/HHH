'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { dict, getNested } from '@/lib/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('ar');

  useEffect(() => {
    const stored = typeof window !== 'undefined' && localStorage.getItem('rshop_lang');
    if (stored === 'ar' || stored === 'fr') setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined') localStorage.setItem('rshop_lang', lang);
  }, [lang]);

  const setLang = (l) => setLangState(l === 'fr' ? 'fr' : 'ar');
  const toggle = () => setLangState((l) => (l === 'ar' ? 'fr' : 'ar'));
  const t = (key) => getNested(dict[lang], key) ?? key;

  const pick = (ar, fr) => (lang === 'ar' ? ar || fr || '' : fr || ar || '');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, pick, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

