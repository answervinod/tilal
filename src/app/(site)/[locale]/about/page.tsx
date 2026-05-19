import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../../sanity/lib/fetch';
import { pageBySlugQuery } from '../../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../../sanity/lib/types';
import { locales, type Locale } from '@/i18n/config';
import { SectionRenderer } from '@/components/SectionRenderer';
import { AboutPageClient } from '@/components/AboutPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'about', locale },
    tags: [`page:about:${locale}`],
  }).catch(() => null);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/about`;
  return {
    title: page?.seo?.title || page?.title || (locale === 'ar' ? 'من نحن | تيلال' : 'About | Tilal'),
    description: page?.seo?.description || (locale === 'ar' ? 'إعادة تعريف الحياة العصرية. تيلال أكثر من مجرد علامة عقارية.' : 'Redefining Modern Living. Tilal is more than a real estate brand.'),
    alternates: { canonical: `/${locale}/about`, languages },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'about', locale },
    tags: [`page:about:${locale}`],
  }).catch(() => null);

  if (page?.sections?.length) {
    return <SectionRenderer sections={page.sections} locale={locale as Locale} />;
  }

  return <AboutPageClient locale={locale as Locale} />;
}
