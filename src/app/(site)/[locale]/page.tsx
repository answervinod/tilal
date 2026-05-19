import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '../../../../sanity/lib/fetch';
import { pageBySlugQuery } from '../../../../sanity/lib/queries';
import type { PageDoc } from '../../../../sanity/lib/types';
import { locales, type Locale } from '@/i18n/config';
import { CinematicHero } from '@/components/CinematicHero';
import { SectionRenderer } from '@/components/SectionRenderer';
import { BrandIntro } from '@/components/BrandIntro';
import { HighlightsGrid } from '@/components/HighlightsGrid';
import { ProjectsShowcase } from '@/components/ProjectsShowcase';
import { LifestyleSection } from '@/components/LifestyleSection';
import { AmenitiesPreview } from '@/components/AmenitiesPreview';
import { InvestmentTeaser } from '@/components/InvestmentTeaser';
import { FullCTA } from '@/components/FullCTA';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'home', locale },
    tags: [`page:home:${locale}`],
  }).catch(() => null);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}`;

  return {
    title: page?.seo?.title || page?.title || 'Tilal',
    description: page?.seo?.description || 'Tilal — Where Architecture Meets Investment Excellence.',
    alternates: { canonical: `/${locale}`, languages },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const page = await sanityFetch<PageDoc | null>({
    query: pageBySlugQuery,
    params: { slug: 'home', locale },
    tags: [`page:home:${locale}`],
  }).catch(() => null);

  /* NOTE: Set useSanityHome=true once you have populated the home page in Sanity Studio */
  const useSanityHome = false;
  const sections = page?.sections || [];
  const heroSection = sections[0]?._type === 'heroBlock' ? sections[0] : null;
  const contentSections = heroSection ? sections.slice(1) : sections;

  if (useSanityHome && sections.length > 0) {
    return (
      <main>
        {heroSection && (
          <CinematicHero
            eyebrow={(heroSection as any).eyebrow}
            heading={(heroSection as any).heading}
            subheading={(heroSection as any).subheading}
            media={(heroSection as any).media}
          />
        )}
        <div className="relative z-[5] bg-bg">
          <SectionRenderer sections={contentSections} locale={locale as Locale} wrapInMain={false} />
        </div>
      </main>
    );
  }

  /* Fallback: hardcoded sections when no Sanity home page exists */
  return (
    <main>
      <CinematicHero
        eyebrow={locale === 'ar' ? 'تيلال العقارية' : 'Tilal Real Estate'}
        heading={locale === 'ar' ? 'حيث يلتقي التصميم والاستثمار والتميز' : 'Where Architecture Meets Investment Excellence'}
        subheading={locale === 'ar'
          ? 'اكتشف الحياة الفاخرة المنسقة من خلال مجتمعات تيلال الرائدة — مصممة لأنماط حياة راقية وعوائد استثمارية عالية.'
          : "Discover curated luxury living through Tilal's visionary communities — designed for elevated lifestyles and high-value returns."}
        media={undefined}
      />

      <div className="relative z-[5] bg-bg">
        <BrandIntro locale={locale as Locale} />
        <HighlightsGrid locale={locale as Locale} />
        <ProjectsShowcase locale={locale as Locale} />
        <LifestyleSection locale={locale as Locale} />
        <AmenitiesPreview locale={locale as Locale} />
        <InvestmentTeaser locale={locale as Locale} />
        <FullCTA locale={locale as Locale} />
      </div>
    </main>
  );
}
