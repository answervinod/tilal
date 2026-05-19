import type { Image } from 'sanity';

/**
 * Lightweight types for what our GROQ queries return.
 * (We avoid sanity-codegen for now to keep the dependency surface small;
 *  these can be auto-generated later via `sanity typegen` if desired.)
 */

export type SanityImage = Image & {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      lqip?: string;
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  alt?: string;
  caption?: string;
};

export interface ResolvedLink {
  label: string;
  type: 'internal' | 'external';
  href?: string;
  newTab?: boolean;
  internal?: {
    _type: string;
    slug?: string;
    title?: string;
  };
}

export interface SiteSettings {
  title: string;
  description?: string;
  logo?: SanityImage;
  favicon?: SanityImage;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  social?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
  defaultOgImage?: SanityImage;
}

export interface Navigation {
  title?: string;
  header?: ResolvedLink[];
  footerColumns?: Array<{
    title?: string;
    links?: ResolvedLink[];
  }>;
  footerNote?: string;
}

export interface ProjectListItem {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  location?: string;
  status?: 'available' | 'reserved' | 'sold' | 'coming_soon';
  featured?: boolean;
  publishedAt?: string;
  category?: { title: string; slug: string };
  cover?: SanityImage;
  price?: { mode: 'show' | 'inquire'; amount?: number; currency?: string };
  specs?: { bedrooms?: number; bathrooms?: number; area?: number; parking?: number };
}

/* Page section types are intentionally loose for now; Phase 3 narrows them. */
export interface PageSection {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface PageDoc {
  _id: string;
  title: string;
  slug: string;
  seo?: {
    title?: string;
    description?: string;
    image?: SanityImage;
    noindex?: boolean;
  };
  sections?: PageSection[];
}
