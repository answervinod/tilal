import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../../sanity/lib/fetch';
import { pageBySlugQuery, allPageSlugsQuery } from '../../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../../sanity/lib/types';
import { imageUrl } from '../../../../../sanity/lib/image';
import { SectionRenderer } from '@/components/SectionRenderer';
import { locales, type Locale } from '@/i18n/config';

function hreflangAlternates(slug: string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/${slug}`;
  return languages;
}

interface Params {
  locale: string;
  slug: string;
}

// Reserved top-level paths that have their own static routes (added in Phase 4+).
const RESERVED = new Set(['projects', 'blog', 'studio', 'api']);

export async function generateStaticParams(): Promise<Array<{ locale: string; slug: string }>> {
  const all = await Promise.all(
    locales.map(async (locale) => {
      const slugs = await sanityFetch<string[]>({
        query: allPageSlugsQuery,
        params: { locale },
        tags: ['page'],
      }).catch(() => [] as string[]);
      return slugs
        .filter((s) => s && s !== 'home' && !RESERVED.has(s))
        .map((slug) => ({ locale, slug }));
    })
  );
  return all.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug, locale },
    tags: [`page:${slug}:${locale}`],
  }).catch(() => null);

  if (!page) return {};

  const title = page.seo?.title || page.title;
  const description = page.seo?.description;
  const ogImage = imageUrl(page.seo?.image, 1200);

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${slug}`,
      languages: hreflangAlternates(slug),
    },
    robots: page.seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function CmsPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  if (RESERVED.has(slug)) notFound();

  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug, locale },
    tags: [`page:${slug}:${locale}`],
  }).catch(() => null);

  if (!page) notFound();

  return <SectionRenderer sections={page.sections || []} locale={locale as Locale} />;
}
