import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../../sanity/lib/fetch';
import { pageBySlugQuery } from '../../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../../sanity/lib/types';
import { locales, type Locale } from '@/i18n/config';
import { SectionRenderer } from '@/components/SectionRenderer';
import { MaterialsPageClient } from '@/components/MaterialsPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'materials', locale },
    tags: [`page:materials:${locale}`],
  }).catch(() => null);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/materials`;
  return {
    title: page?.seo?.title || page?.title || (locale === 'ar' ? 'المواد والتصميم | تيلال' : 'Materials & Design | Tilal'),
    description: page?.seo?.description || (locale === 'ar' ? 'مصنوعة بإتقان. كل مسكن مبني باستخدام مواد متميزة.' : 'Crafted with Excellence. Each residence is built using premium materials.'),
    alternates: { canonical: `/${locale}/materials`, languages },
  };
}

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'materials', locale },
    tags: [`page:materials:${locale}`],
  }).catch(() => null);

  if (page?.sections?.length) {
    return <SectionRenderer sections={page.sections} locale={locale as Locale} />;
  }

  return <MaterialsPageClient locale={locale as Locale} />;
}
