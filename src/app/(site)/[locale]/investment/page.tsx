import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../../sanity/lib/fetch';
import { pageBySlugQuery } from '../../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../../sanity/lib/types';
import { locales, type Locale } from '@/i18n/config';
import { SectionRenderer } from '@/components/SectionRenderer';
import { InvestmentPageClient } from '@/components/InvestmentPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'investment', locale },
    tags: [`page:investment:${locale}`],
  }).catch(() => null);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/investment`;
  return {
    title: page?.seo?.title || page?.title || (locale === 'ar' ? 'الاستثمار | تيلال' : 'Investment | Tilal'),
    description: page?.seo?.description || (locale === 'ar' ? 'فرص استثمارية ذكية. تطويرات تيلال مصممة لخلق الثروة.' : 'Smart Investment Opportunities. Tilal developments are designed for wealth creation.'),
    alternates: { canonical: `/${locale}/investment`, languages },
  };
}

import fs from 'fs';
import path from 'path';

export default async function InvestmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'investment', locale },
    tags: [`page:investment:${locale}`],
  }).catch(() => null);

  // Read the PDF images for the Standard Payment Plan
  const ppDir = path.join(process.cwd(), 'public', 'assets', 'pdf-images', 'Payment Plan & Pricing', 'Tilal Binghatti - PP');
  let standardPpPages: string[] = [];

  try {
    if (fs.existsSync(ppDir)) {
      const files = fs.readdirSync(ppDir)
        .filter(f => f.endsWith('.webp'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('page_', '').replace('.webp', '')) || 0;
          const numB = parseInt(b.replace('page_', '').replace('.webp', '')) || 0;
          return numA - numB;
        });
      standardPpPages = files.map(f => `/assets/pdf-images/Payment Plan & Pricing/Tilal Binghatti - PP/${f}`);
    }
  } catch (error) {
    console.error('Error reading payment plan images:', error);
  }

  if (page?.sections?.length) {
    return <SectionRenderer sections={page.sections} locale={locale as Locale} />;
  }

  return <InvestmentPageClient locale={locale as Locale} standardPpPages={standardPpPages} />;
}
