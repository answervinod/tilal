import { type NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SanityWebhookBody {
  _type?: string;
  _id?: string;
  slug?: string | { current?: string };
  language?: string;
}

/**
 * On-demand revalidation webhook. Configure in Sanity Studio:
 *   sanity.io/manage \u2192 API \u2192 Webhooks \u2192 Create
 *   URL:     https://your-site.com/api/revalidate
 *   Trigger: Create / Update / Delete on all document types (or filter)
 *   Secret:  same value as SANITY_REVALIDATE_SECRET in your env
 *   Filter:  _type in ["page","project","post","siteSettings","navigation","redirect","category","author"]
 *
 * Maps each changed document to one or more cache tags and revalidates them.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'SANITY_REVALIDATE_SECRET not configured' },
      { status: 500 }
    );
  }

  const result = await parseBody<SanityWebhookBody>(req, secret).catch((err) => {
    console.error('[revalidate] body parse failed:', err);
    return null;
  });

  if (!result || !result.isValidSignature) {
    return NextResponse.json(
      { ok: false, error: 'Invalid signature' },
      { status: 401 }
    );
  }

  const body = result.body || {};
  const type = body._type;
  const slug =
    typeof body.slug === 'string'
      ? body.slug
      : body.slug && typeof body.slug === 'object'
        ? body.slug.current
        : undefined;
  const language = body.language;

  const tags = new Set<string>();
  if (type) tags.add(type);
  if (type && slug) tags.add(`${type}:${slug}`);
  if (type && slug && language) tags.add(`${type}:${slug}:${language}`);
  if (type === 'siteSettings') tags.add('siteSettings');
  if (type === 'navigation') {
    tags.add('navigation');
    if (language) tags.add(`navigation:${language}`);
  }

  for (const tag of tags) revalidateTag(tag);

  return NextResponse.json({
    ok: true,
    revalidated: Array.from(tags),
    received: { type, slug, language },
  });
}
