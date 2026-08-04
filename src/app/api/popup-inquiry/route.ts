import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const popupSchema = z.object({
  firstName: z.string().trim().min(2).max(120),
  lastName: z.string().trim().min(2).max(120),
  workEmail: z.string().trim().email().max(160),
  phone: z.string().trim().min(5).max(40),
  nationality: z.string().trim().min(2).max(120),
  message: z.string().trim().max(3000).optional().or(z.literal('')),
  locale: z.enum(['en', 'ar']),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = popupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const submittedAt = new Date().toISOString();

  // 1) Write to Supabase (best-effort)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
      const { error: supabaseError } = await supabase.from('popup_inquiries').insert([{
        first_name: data.firstName,
        last_name: data.lastName,
        work_email: data.workEmail,
        phone: data.phone,
        nationality: data.nationality,
        message: data.message,
        locale: data.locale,
        submitted_at: submittedAt
      }]);
      if (supabaseError) {
        console.error('[popup-inquiry] supabase insert returned error:', supabaseError);
      }
    } catch (err) {
      console.error('[popup-inquiry] supabase write exception:', err);
    }
  } else {
    console.warn('[popup-inquiry] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
  }

  // 2) Send notification email (best-effort)
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL;
  if (resendKey && toEmail) {
    try {
      const resend = new Resend(resendKey);
      const fromEmail = process.env.INQUIRY_FROM_EMAIL || 'Tilal <onboarding@resend.dev>';
      const subjectLine = 'New Popup Form Inquiry';

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
      console.error('[popup-inquiry] email send failed:', err);
    }
  } else {
    console.warn(
      '[popup-inquiry] RESEND_API_KEY / INQUIRY_TO_EMAIL not set — no notification email sent.'
    );
  }

  return NextResponse.json({ ok: true });
}
