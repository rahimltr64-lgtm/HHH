export function formatPrice(value, lang = 'ar') {
  const n = Number(value) || 0;
  const locale = lang === 'ar' ? 'ar-DZ' : 'fr-DZ';
  const formatted = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
  return lang === 'ar' ? `${formatted} دج` : `${formatted} DA`;
}

export function formatDate(ts, lang = 'ar') {
  if (!ts) return '—';
  const date = typeof ts?.toDate === 'function' ? ts.toDate() : new Date(ts);
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-DZ' : 'fr-DZ', {
    year: 'numeric', month: 'short', day: 'numeric',
  }).format(date);
}

export function orderNumber() {
  return 'RS-' + Date.now().toString(36).toUpperCase();
}

