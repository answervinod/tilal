import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '../../../../../../sanity/lib/fetch';
import {
  projectBySlugQuery,
  relatedProjectsQuery,
  allProjectSlugsQuery,
} from '../../../../../../sanity/lib/queries';
import type { ProjectListItem, SanityImage } from '../../../../../../sanity/lib/types';
import { imageUrl } from '../../../../../../sanity/lib/image';
import { ProjectCard } from '@/components/ProjectCard';
import { formatPrice, statusLabel, statusTone, formatArea } from '@/lib/format';
import { locales, type Locale } from '@/i18n/config';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';

interface ProjectDetail {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  location?: string;
  status?: string;
  featured?: boolean;
  description?: PortableTextBlock[];
  amenities?: string[];
  brochure?: { asset?: { url: string } };
  cover?: SanityImage;
  gallery?: SanityImage[];
  floorplans?: Array<SanityImage & { label?: string }>;
  categoryRef?: string;
  category?: { title: string; slug: string };
  price?: { mode?: 'show' | 'inquire'; amount?: number; currency?: string };
  specs?: { bedrooms?: number; bathrooms?: number; area?: number; parking?: number };
  coordinates?: { lat: number; lng: number };
  publishedAt?: string;
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
    noindex?: boolean;
  };
}

export async function generateStaticParams() {
  const all = await Promise.all(
    locales.map(async (locale) => {
      const slugs = await sanityFetch<string[]>({
        query: allProjectSlugsQuery,
        params: { locale },
        tags: ['project'],
      }).catch(() => [] as string[]);
      return slugs.filter(Boolean).map((slug) => ({ locale, slug }));
    })
  );
  return all.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await sanityFetch<ProjectDetail | null>({
    query: projectBySlugQuery,
    params: { slug, locale },
    tags: [`project:${slug}:${locale}`],
  }).catch(() => null);

  if (!project) return {};

  const title = project.seo?.title || project.title;
  const description = project.seo?.description || project.tagline;
  const ogImage = imageUrl(project.seo?.image || project.cover, 1200);

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/projects/${slug}`, languages },
    robots: project.seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Projects');

  const project = await sanityFetch<ProjectDetail | null>({
    query: projectBySlugQuery,
    params: { slug, locale },
    tags: [`project:${slug}:${locale}`],
  }).catch(() => null);

  if (!project) notFound();

  // Fetch related (same category, exclude self).
  // We need the raw category _ref; the query expansion converted it but the underlying
  // ref still exists when not projected. We pass undefined if missing.
  const related = await sanityFetch<ProjectListItem[]>({
    query: relatedProjectsQuery,
    params: {
      locale,
      excludeId: project._id,
      categoryId: project.categoryRef || null,
    },
    tags: ['project'],
  }).catch(() => [] as ProjectListItem[]);

  const heroSrc = imageUrl(project.cover, 2400);
  const price = formatPrice(project.price, locale as Locale);
  const specs = project.specs || {};
  const specEntries: Array<[string, string]> = [];
  if (specs.bedrooms) specEntries.push([t('specs.bedrooms'), String(specs.bedrooms)]);
  if (specs.bathrooms) specEntries.push([t('specs.bathrooms'), String(specs.bathrooms)]);
  if (specs.area) specEntries.push([t('specs.area'), formatArea(specs.area, locale as Locale)]);
  if (specs.parking) specEntries.push([t('specs.parking'), String(specs.parking)]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Residence',
    name: project.title,
    description: project.tagline || undefined,
    url: `${siteUrl}/${locale}/projects/${project.slug}`,
    image: heroSrc,
    ...(project.location ? { address: project.location } : {}),
    ...(project.price?.mode === 'show' && project.price?.amount
      ? {
          offers: {
            '@type': 'Offer',
            price: project.price.amount,
            priceCurrency: project.price.currency || 'SAR',
          },
        }
      : {}),
    ...(specs.bedrooms ? { numberOfBedrooms: specs.bedrooms } : {}),
    ...(specs.bathrooms ? { numberOfBathroomsTotal: specs.bathrooms } : {}),
    ...(specs.area
      ? {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: specs.area,
            unitCode: 'MTK',
          },
        }
      : {}),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* CINEMATIC HERO */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-fg">
        {heroSrc && (
          <div className="absolute inset-0 scale-110">
            <Image
              src={heroSrc}
              alt={project.title}
              fill
              priority
              className="object-cover cinematic"
              sizes="100vw"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-fg/50" aria-hidden />
        <div className="grain" aria-hidden />

        <div className="relative container pb-20 md:pb-28">
          <p className="label text-gold mb-6">{project.category?.title || ''}</p>
          <h1
            className="font-display text-bg"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
            }}
          >
            {project.title}
          </h1>
          {project.tagline && (
            <p className="mt-6 max-w-xl text-bg/80 text-lg leading-relaxed">
              {project.tagline}
            </p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
            {project.status && (
              <span className="inline-flex items-center px-4 py-2 text-label border border-bg/20 bg-bg/10 backdrop-blur text-bg">
                {statusLabel(project.status, locale as Locale)}
              </span>
            )}
            {project.location && (
              <span className="text-bg/80">{project.location}</span>
            )}
            {price && <span className="text-gold font-medium">{price}</span>}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-label text-bg/60">Scroll</span>
          <div className="w-px h-12 bg-bg/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gold animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container py-20 md:py-32 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-14">
          {project.description && project.description.length > 0 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-fg mb-6">{t('overview')}</h2>
              <div className="prose-tilal">
                <PortableText
                  value={project.description}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="my-4 leading-relaxed text-fg-muted">{children}</p>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          )}

          {project.amenities && project.amenities.length > 0 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-fg mb-6">{t('amenities')}</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm text-fg-muted">
                {project.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="text-gold">{'\u2022'}</span>{a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-fg mb-6">{t('details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.gallery.map((img, i) => {
                  const src = imageUrl(img, 1200);
                  if (!src) return null;
                  return (
                    <div key={img.asset?._id || i} className="relative aspect-[4/3] overflow-hidden bg-bg-soft">
                      <Image
                        src={src}
                        alt={img.alt || project.title}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover cinematic"
                        placeholder={img.asset?.metadata?.lqip ? 'blur' : 'empty'}
                        blurDataURL={img.asset?.metadata?.lqip}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {project.floorplans && project.floorplans.length > 0 && (
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-fg mb-6">{t('floorplans')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.floorplans.map((img, i) => {
                  const src = imageUrl(img, 1400);
                  if (!src) return null;
                  return (
                    <figure key={img.asset?._id || i} className="bg-bg-soft p-5">
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={src}
                          alt={img.label || `Floorplan ${i + 1}`}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-contain"
                        />
                      </div>
                      {img.label && (
                        <figcaption className="mt-3 text-label text-fg-subtle">{img.label}</figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 border border-fg/8 p-7 space-y-7">
            {specEntries.length > 0 && (
              <dl className="grid grid-cols-2 gap-5 text-sm">
                {specEntries.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-label text-fg-subtle">{k}</dt>
                    <dd className="mt-1 font-display text-xl text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {project.location && (
              <div>
                <p className="text-label text-fg-subtle mb-1">{t('location')}</p>
                <p className="text-sm text-fg-muted">{project.location}</p>
              </div>
            )}

            {project.brochure?.asset?.url && (
              <a
                href={project.brochure.asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-5 py-3 border border-fg text-fg text-label hover:bg-fg hover:text-bg transition-colors duration-500"
              >
                {t('downloadBrochure')}
              </a>
            )}

            <Link
              href={`/${locale}/contact?project=${encodeURIComponent(project.slug)}`}
              className="block w-full text-center px-5 py-3 bg-fg text-bg text-label hover:bg-gold transition-colors duration-500"
            >
              {t('inquire')}
            </Link>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="container pb-24 md:pb-32">
          <h2 className="font-display text-2xl md:text-3xl text-fg mb-10">{t('related')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
            {related.map((p) => (
              <ProjectCard key={p._id} project={p} locale={locale as Locale} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
