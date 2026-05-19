import { client } from '../../sanity/lib/client';
import { allRedirectsQuery } from '../../sanity/lib/queries';

export interface RedirectRule {
  from: string;
  to: string;
  permanent?: boolean;
}

const CACHE_TTL_MS = 60_000; // 1 minute \u2014 keeps middleware fast on every request.

let cache: { rules: RedirectRule[]; fetchedAt: number } | null = null;
let inflight: Promise<RedirectRule[]> | null = null;

/**
 * Get CMS-defined redirect rules with a short in-memory cache so the
 * middleware stays cheap. Errors return [] silently \u2014 redirects are
 * always a "nice to have" and should never break navigation.
 */
export async function getRedirects(): Promise<RedirectRule[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.rules;
  if (inflight) return inflight;

  inflight = client
    .fetch<RedirectRule[]>(allRedirectsQuery)
    .then((rules) => {
      cache = { rules: rules || [], fetchedAt: Date.now() };
      inflight = null;
      return cache.rules;
    })
    .catch(() => {
      inflight = null;
      return cache?.rules || [];
    });

  return inflight;
}

/**
 * Match `pathname` against the list of rules. Exact match only \u2014 keeps
 * behaviour predictable. Rules use absolute paths starting with "/".
 */
export function matchRedirect(
  pathname: string,
  rules: RedirectRule[]
): RedirectRule | undefined {
  if (!pathname || !rules?.length) return undefined;
  // Strip trailing slash (except root) for matching.
  const p = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return rules.find(
    (r) => r.from && (r.from === p || r.from === pathname)
  );
}
