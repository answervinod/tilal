import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../../sanity/lib/fetch';
import { pageBySlugQuery } from '../../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../../sanity/lib/types';
import { locales, type Locale } from '@/i18n/config';
import { SectionRenderer } from '@/components/SectionRenderer';
import { ContactPageClient } from '@/components/ContactPageClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'contact', locale },
    tags: [`page:contact:${locale}`],
  }).catch(() => null);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/contact`;
  return {
    title: page?.seo?.title || page?.title || (locale === 'ar' ? 'اتصل بنا | تيلال' : 'Contact | Tilal'),
    description: page?.seo?.description || (locale === 'ar' ? 'تواصل معنا. فريقنا مستعد لمساعدتك.' : 'Connect With Us. Our team is ready to assist.'),
    alternates: { canonical: `/${locale}/contact`, languages },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'contact', locale },
    tags: [`page:contact:${locale}`],
  }).catch(() => null);

  if (page?.sections?.length) {
    return <SectionRenderer sections={page.sections} locale={locale as Locale} />;
  }

  return <ContactPageClient locale={locale as Locale} />;
}
