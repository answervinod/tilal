import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../../sanity/lib/fetch';
import { pageBySlugQuery } from '../../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../../sanity/lib/types';
import { locales, type Locale } from '@/i18n/config';
import { SectionRenderer } from '@/components/SectionRenderer';
import { AmenitiesPageClient } from '@/components/AmenitiesPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'amenities', locale },
    tags: [`page:amenities:${locale}`],
  }).catch(() => null);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/amenities`;
  return {
    title: page?.seo?.title || page?.title || (locale === 'ar' ? 'المرافق | تيلال' : 'Amenities | Tilal'),
    description: page?.seo?.description || (locale === 'ar' ? 'مرافق عالمية المستوى مصممة لرفع جودة الحياة اليومية.' : 'World-Class Amenities designed to elevate every aspect of daily life.'),
    alternates: { canonical: `/${locale}/amenities`, languages },
  };
}

export default async function AmenitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'amenities', locale },
    tags: [`page:amenities:${locale}`],
  }).catch(() => null);

  if (page?.sections?.length) {
    return <SectionRenderer sections={page.sections} locale={locale as Locale} />;
  }

  return <AmenitiesPageClient locale={locale as Locale} />;
}
