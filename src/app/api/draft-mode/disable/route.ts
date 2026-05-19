import { draftMode } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Disables Next.js Draft Mode and returns to the requested path (or home). */
export async function GET(req: Request) {
  const dm = await draftMode();
  dm.disable();

  const url = new URL(req.url);
  const back = url.searchParams.get('redirect') || '/';
  // Only allow same-origin redirects.
  const safe = back.startsWith('/') ? back : '/';
  return NextResponse.redirect(new URL(safe, req.url));
}
