import type { Locale } from '@/i18n/config';

const STATUS_LABELS: Record<string, Record<Locale, string>> = {
  available: { en: 'Available', ar: 'متاح' },
  reserved: { en: 'Reserved', ar: 'محجوز' },
  sold: { en: 'Sold', ar: 'تم البيع' },
  coming_soon: { en: 'Coming Soon', ar: 'قريباً' },
};

export function statusLabel(status: string | undefined, locale: Locale): string {
  if (!status) return '';
  return STATUS_LABELS[status]?.[locale] || status.replace(/_/g, ' ');
}

export function statusTone(status: string | undefined): string {
  switch (status) {
    case 'available':
      return 'bg-status-available/10 text-status-available border-status-available/20';
    case 'reserved':
      return 'bg-gold/10 text-gold border-gold/20';
    case 'sold':
      return 'bg-fg/5 text-fg-subtle border-fg/10';
    case 'coming_soon':
      return 'bg-status-coming/10 text-status-coming border-status-coming/20';
    default:
      return 'bg-fg/5 text-fg-muted border-fg/10';
  }
}

interface PriceLike {
  mode?: 'show' | 'inquire';
  amount?: number;
  currency?: string;
}

export function formatPrice(price: PriceLike | undefined, locale: Locale): string {
  if (!price) return '';
  if (price.mode === 'inquire') {
    return locale === 'ar' ? 'السعر عند الطلب' : 'Inquire for price';
  }
  if (typeof price.amount !== 'number') return '';
  const currency = price.currency || 'SAR';
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price.amount);
  } catch {
    return `${currency} ${price.amount.toLocaleString()}`;
  }
}

export function formatArea(sqm: number | undefined, locale: Locale): string {
  if (typeof sqm !== 'number') return '';
  return locale === 'ar' ? `${sqm.toLocaleString('ar')} م²` : `${sqm.toLocaleString('en')} sqm`;
}
