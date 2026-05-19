import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales } from './i18n/config';
import { getRedirects, matchRedirect } from './lib/redirects';

const intlMiddleware = createMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) CMS-driven redirects (runtime). Cached for 60s.
  try {
    const rules = await getRedirects();
    const hit = matchRedirect(pathname, rules);
    if (hit && hit.to) {
      const dest = hit.to.startsWith('http') ? hit.to : `${hit.to}${search}`;
      const url = hit.to.startsWith('http') ? new URL(dest) : new URL(dest, req.url);
      return NextResponse.redirect(url, hit.permanent ? 308 : 307);
    }
  } catch {
    /* never block navigation on a redirect lookup failure */
  }

  // 2) i18n routing (locale prefix, negotiation).
  return intlMiddleware(req);
}

export const config = {
  // Skip the Sanity Studio, Next internals, static files, and API routes
  matcher: ['/((?!api|studio|_next|_vercel|.*\\..*).*)'],
};
