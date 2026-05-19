import { draftMode } from 'next/headers';
import { client } from './client';

/**
 * Server-side fetch wrapper for Sanity content.
 *
 * Behaviour:
 * - Published reads: cached, revalidated by tag (Phase 7 webhook).
 * - Draft mode ON (set by /api/draft-mode/enable): bypasses cache, uses
 *   `previewDrafts` perspective, requires SANITY_API_READ_TOKEN.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = ['sanity'],
  revalidate = 60,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    const token = process.env.SANITY_API_READ_TOKEN;
    if (!token) {
      // Falls back to published content rather than crashing the page.
      console.warn(
        '[sanityFetch] Draft mode is on but SANITY_API_READ_TOKEN is missing \u2014 falling back to published.'
      );
    } else {
      return client.fetch<T>(query, params, {
        token,
        perspective: 'previewDrafts',
        useCdn: false,
        stega: true,
        next: { revalidate: 0, tags },
      });
    }
  }

  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? false : revalidate,
      tags,
    },
  });
}
