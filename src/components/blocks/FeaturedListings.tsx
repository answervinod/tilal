import Link from 'next/link';
import { AnimatedGrid, StaggerReveal } from '@/components/AnimatedGrid';
import { sanityFetch } from '../../../sanity/lib/fetch';
import {
  featuredProjectsQuery,
  projectsByCategoryQuery,
} from '../../../sanity/lib/queries';
import type { ProjectListItem, ResolvedLink } from '../../../sanity/lib/types';
import { ProjectCard } from '@/components/ProjectCard';
import { resolveLink } from '@/lib/resolveLink';
import type { Locale } from '@/i18n/config';

export interface FeaturedListingsData {
  _type: 'featuredListingsBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  mode?: 'manual' | 'featured' | 'category';
  manualListings?: ProjectListItem[];
  category?: { _ref?: string; slug?: string } | null;
  limit?: number;
  cta?: ResolvedLink | null;
}

export async function FeaturedListings({
  data,
  locale,
}: {
  data: FeaturedListingsData;
  locale: Locale;
}) {
  const limit = data.limit && data.limit > 0 ? data.limit : 6;
  let items: ProjectListItem[] = [];

  if (data.mode === 'manual') {
    items = (data.manualListings || []).slice(0, limit);
  } else if (data.mode === 'category' && data.category?.slug) {
    items = await sanityFetch<ProjectListItem[]>({
      query: projectsByCategoryQuery,
      params: { locale, category: data.category.slug, limit },
      tags: ['project'],
    }).catch(() => []);
  } else {
    items = await sanityFetch<ProjectListItem[]>({
      query: featuredProjectsQuery,
      params: { locale, limit },
      tags: ['project'],
    }).catch(() => []);
  }

  if (!items.length) return null;

  return (
    <section className="bg-bg">
      <div className="container py-24 md:py-36">
        <StaggerReveal className="grid grid-cols-12 gap-x-6 gap-y-6 mb-14 md:mb-24" selector=".reveal-child" stagger={0.08} y={25}>
          <div className="reveal-child col-span-12 flex items-baseline justify-between">
            <span className="index-mark">03 — The Portfolio</span>
            <span className="hidden md:inline index-mark">{String(items.length).padStart(2, '0')} entries</span>
          </div>

          {data.heading && (
            <h2
              className="reveal-child col-span-12 md:col-span-8 font-display text-fg"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
                lineHeight: '1.02',
                letterSpacing: '-0.025em',
              }}
            >
              {data.heading}
            </h2>
          )}

          {data.subheading && (
            <p className="reveal-child col-span-12 md:col-span-5 md:col-start-8 text-body-lg text-fg-muted self-end">
              {data.subheading}
            </p>
          )}
        </StaggerReveal>

        <AnimatedGrid className="grid grid-cols-12 gap-x-6 gap-y-16 md:gap-y-24" stagger={0.15} y={80} duration={1.2}>
          {items.map((p, i) => {
            const layouts = [
              'col-span-12 md:col-span-7',
              'col-span-12 md:col-span-5 md:mt-24',
              'col-span-12 md:col-span-5 md:col-start-2',
              'col-span-12 md:col-span-6 md:col-start-7 md:mt-12',
              'col-span-12 md:col-span-5',
              'col-span-12 md:col-span-6 md:col-start-7 md:mt-16',
            ];
            const cls = layouts[i] || 'col-span-12 md:col-span-6';
            return (
              <div key={p._id} className={cls}>
                <ProjectCard project={p} locale={locale} index={i} priority={i < 2} />
              </div>
            );
          })}
        </AnimatedGrid>

        {data.cta && (
          <div className="mt-24 md:mt-32 flex items-center justify-between">
            <div className="rule flex-1 me-8" />
            <Link
              href={resolveLink(data.cta, locale)}
              className="link-underline text-label text-fg"
            >
              {data.cta.label}<span aria-hidden>&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
