import type { ResolvedLink } from '../../sanity/lib/types';
import type { Locale } from '@/i18n/config';

/**
 * Convert a CMS `link` object into an actual href string.
 * Internal references resolve to locale-prefixed routes based on document type.
 */
export function resolveLink(link: ResolvedLink | undefined, locale: Locale): string {
  if (!link) return '#';

  if (link.type === 'external') {
    return link.href || '#';
  }

  const ref = link.internal;
  if (!ref) return '#';

  const slug = ref.slug || '';
  switch (ref._type) {
    case 'page':
      // Home page convention: slug "home" \u2192 root locale path.
      if (slug === 'home' || slug === '') return `/${locale}`;
      return `/${locale}/${slug}`;
    case 'project':
      return `/${locale}/projects/${slug}`;
    case 'post':
      return `/${locale}/blog/${slug}`;
    default:
      return `/${locale}`;
  }
}
