import { Suspense } from 'react';
import { sanityFetch } from '../../../sanity/lib/fetch';
import {
  filteredProjectsQuery,
  allCategoriesQuery,
} from '../../../sanity/lib/queries';
import type { ProjectListItem } from '../../../sanity/lib/types';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectFilters } from '@/components/ProjectFilters';
import type { Locale } from '@/i18n/config';

export interface ListingsGridData {
  _type: 'listingsGridBlock';
  _key: string;
  heading?: string;
  subheading?: string;
  showFilters?: boolean;
  defaultCategory?: { slug?: string } | null;
  pageSize?: number;
}

/**
 * "Drop-in" listings grid for the page-builder.
 * For URL-driven filtering at scale, the dedicated /projects route is preferred
 * \u2014 this block is a snapshot view that respects an optional category preset.
 */
export async function ListingsGrid({
  data,
  locale,
}: {
  data: ListingsGridData;
  locale: Locale;
}) {
  const pageSize = data.pageSize && data.pageSize > 0 ? data.pageSize : 12;
  const category = data.defaultCategory?.slug || '';

  const [{ items, total }, categories] = await Promise.all([
    sanityFetch<{ items: ProjectListItem[]; total: number }>({
      query: filteredProjectsQuery,
      params: {
        locale,
        category,
        status: '',
        q: '',
        start: 0,
        end: pageSize,
      },
      tags: ['project', 'category'],
    }).catch(() => ({ items: [] as ProjectListItem[], total: 0 })),
    data.showFilters !== false
      ? sanityFetch<Array<{ _id: string; title: string; slug: string }>>({
          query: allCategoriesQuery,
          params: { locale },
          tags: ['category'],
        }).catch(() => [])
      : Promise.resolve([] as Array<{ _id: string; title: string; slug: string }>),
  ]);

  return (
    <section className="container py-16 md:py-24">
      {(data.heading || data.subheading) && (
        <div className="max-w-2xl mb-10">
          {data.heading && (
            <h2 className="font-display text-3xl md:text-5xl text-brand leading-tight">
              {data.heading}
            </h2>
          )}
          {data.subheading && (
            <p className="mt-3 text-neutral-600 leading-relaxed">{data.subheading}</p>
          )}
        </div>
      )}

      {data.showFilters !== false && categories.length > 0 && (
        <div className="mb-8">
          <Suspense fallback={<div className="h-10 animate-pulse bg-neutral-100 rounded" />}>
            <ProjectFilters categories={categories} current={{ category }} />
          </Suspense>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-neutral-500 py-12 text-center">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
          {items.map((p) => (
            <ProjectCard key={p._id} project={p} locale={locale} />
          ))}
        </div>
      )}

      {total > items.length && (
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-neutral-500">
          {`+${total - items.length} more projects`}
        </p>
      )}
    </section>
  );
}
