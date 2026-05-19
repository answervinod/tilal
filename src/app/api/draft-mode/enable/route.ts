import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { client } from '../../../../../sanity/lib/client';

export const runtime = 'nodejs';

/**
 * Entry-point for Sanity's Presentation tool live preview.
 * Studio appends a one-time secret to the URL; we validate it against the
 * project's preview-url-secret store, enable Next.js Draft Mode, then redirect
 * to the requested path so the rest of the site renders with previewDrafts.
 *
 * Requires SANITY_API_READ_TOKEN in env so we can verify the secret AND fetch
 * draft content inside server components.
 */
export async function GET(req: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return new Response(
      'SANITY_API_READ_TOKEN must be set to enable preview mode.',
      { status: 500 }
    );
  }

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    client.withConfig({ token }),
    req.url
  );

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  const dm = await draftMode();
  dm.enable();

  redirect(redirectTo);
}
