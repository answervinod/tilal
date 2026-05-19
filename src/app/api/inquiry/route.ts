import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { inquirySchema } from '@/lib/inquirySchema';
import { writeClient, hasWriteToken } from '../../../../sanity/lib/serverClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot \u2014 silently accept (so bots don't learn) but don't process.
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const submittedAt = new Date().toISOString();

  // 1) Write to Sanity (best-effort \u2014 don't fail the user if Sanity write fails).
  let sanityId: string | null = null;
  if (hasWriteToken) {
    try {
      // Look up the related project's _id (if a slug was provided).
      let projectRef: { _type: 'reference'; _ref: string } | undefined;
      if (data.projectSlug) {
        const id = await writeClient.fetch<string | null>(
          `*[_type == "project" && slug.current == $slug && language == $locale][0]._id`,
          { slug: data.projectSlug, locale: data.locale }
        );
        if (id) projectRef = { _type: 'reference', _ref: id };
      }

      const created = await writeClient.create({
        _type: 'inquiry',
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        message: data.message,
        subject: data.subject || undefined,
        project: projectRef,
        locale: data.locale,
        submittedAt,
        status: 'new',
      });
      sanityId = created._id;
    } catch (err) {
      // Log server-side; don't break the user flow.
      console.error('[inquiry] sanity write failed:', err);
    }
  } else {
    console.warn(
      '[inquiry] SANITY_API_WRITE_TOKEN not set \u2014 inquiry will NOT be saved to Studio.'
    );
  }

  // 2) Send notification email (also best-effort).
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL;
  if (resendKey && toEmail) {
    try {
      const resend = new Resend(resendKey);
      const fromEmail = process.env.INQUIRY_FROM_EMAIL || 'Tilal <onboarding@resend.dev>';
      const subjectLine = data.projectSlug
        ? `New inquiry: ${data.projectSlug}`
        : data.subject
          ? `New inquiry: ${data.subject}`
          : 'New website inquiry';

      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: subjectLine,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          data.phone ? `Phone: ${data.phone}` : null,
          data.subject ? `Subject: ${data.subject}` : null,
          data.projectSlug ? `Project: ${data.projectSlug}` : null,
          `Locale: ${data.locale}`,
          `Submitted: ${submittedAt}`,
          '',
          'Message:',
          data.message,
        ]
          .filter(Boolean)
          .join('\n'),
      });
    } catch (err) {
      console.error('[inquiry] email send failed:', err);
    }
  } else {
    console.warn(
      '[inquiry] RESEND_API_KEY / INQUIRY_TO_EMAIL not set \u2014 no notification email sent.'
    );
  }

  return NextResponse.json({ ok: true, id: sanityId });
}
