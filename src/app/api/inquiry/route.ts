import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
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
        firstName: data.firstName,
        lastName: data.lastName,
        workEmail: data.workEmail,
        phone: data.phone || undefined,
        nationality: data.nationality,
        occupation: data.occupation,
        unitType: data.unitType,
        purpose: data.purpose,
        timeline: data.timeline,
        buyerType: data.buyerType,
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

  // 2) Write to Supabase (best-effort)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
      const { error: supabaseError } = await supabase.from('inquiries').insert([{
        first_name: data.firstName,
        last_name: data.lastName,
        work_email: data.workEmail,
        phone: data.phone,
        nationality: data.nationality,
        occupation: data.occupation,
        property_type: 'N/A',
        unit_type: data.unitType,
        purpose: data.purpose,
        timeline: data.timeline,
        buyer_type: data.buyerType,
        message: data.message,
        subject: data.subject,
        locale: data.locale,
        project_slug: data.projectSlug,
        submitted_at: submittedAt
      }]);
      if (supabaseError) {
        console.error('[inquiry] supabase insert returned error:', supabaseError);
      }
    } catch (err) {
      console.error('[inquiry] supabase write exception:', err);
    }
  } else {
    console.warn('[inquiry] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
  }

  // 3) Send notification email (also best-effort).
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
        replyTo: data.workEmail,
        subject: subjectLine,
        text: [
          `Name: ${data.firstName} ${data.lastName}`,
          `Work Email: ${data.workEmail}`,
          data.phone ? `Phone: ${data.phone}` : null,
          `Nationality: ${data.nationality}`,
          `Occupation: ${data.occupation}`,
          `Unit: ${data.unitType}`,
          `Purpose: ${data.purpose}`,
          `Timeline: ${data.timeline}`,
          `Buyer Type: ${data.buyerType}`,
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
      '[inquiry] RESEND_API_KEY / INQUIRY_TO_EMAIL not set — no notification email sent.'
    );
  }

  return NextResponse.json({ ok: true, id: sanityId });
}
