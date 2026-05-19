import type { MetadataRoute } from 'next';
import { sanityFetch } from '../../sanity/lib/fetch';
import { allPageSlugsQuery, allProjectSlugsQuery } from '../../sanity/lib/queries';
import { locales, defaultLocale } from '@/i18n/config';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function url(path: string): string {
  return `${SITE.replace(/\/$/, '')}${path}`;
}

/**
 * Build hreflang alternates for a path that exists in all locales.
 * Next.js renders these as <xhtml:link rel="alternate" hreflang="...">.
 */
function alternates(pathFor: (locale: string) => string) {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = url(pathFor(l));
  languages['x-default'] = url(pathFor(defaultLocale));
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pull slugs for each locale in parallel.
  const perLocale = await Promise.all(
    locales.map(async (locale) => {
      const [pageSlugs, projectSlugs] = await Promise.all([
        sanityFetch<string[]>({
          query: allPageSlugsQuery,
          params: { locale },
          tags: ['page'],
        }).catch(() => [] as string[]),
        sanityFetch<string[]>({
          query: allProjectSlugsQuery,
          params: { locale },
          tags: ['project'],
        }).catch(() => [] as string[]),
      ]);
      return { locale, pageSlugs, projectSlugs };
    })
  );

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Per-locale home + projects index.
  for (const locale of locales) {
    entries.push({
      url: url(`/${locale}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: alternates((l) => `/${l}`),
    });
    entries.push({
      url: url(`/${locale}/projects`),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: alternates((l) => `/${l}/projects`),
    });
  }

  // Pages: union of slugs across locales, generate per-locale entries with hreflang.
  const allPageSlugs = new Set<string>();
  for (const { pageSlugs } of perLocale) {
    for (const s of pageSlugs) {
      if (s && s !== 'home') allPageSlugs.add(s);
    }
  }
  for (const slug of allPageSlugs) {
    for (const locale of locales) {
      entries.push({
        url: url(`/${locale}/${slug}`),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: alternates((l) => `/${l}/${slug}`),
      });
    }
  }

  // Project detail pages.
  const allProjectSlugs = new Set<string>();
  for (const { projectSlugs } of perLocale) {
    for (const s of projectSlugs) if (s) allProjectSlugs.add(s);
  }
  for (const slug of allProjectSlugs) {
    for (const locale of locales) {
      entries.push({
        url: url(`/${locale}/projects/${slug}`),
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: alternates((l) => `/${l}/projects/${slug}`),
      });
    }
  }

  return entries;
}
