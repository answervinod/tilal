import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { ResidencesClient } from '@/components/ResidencesClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ResidencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ResidencesClient locale={locale} />;
}
