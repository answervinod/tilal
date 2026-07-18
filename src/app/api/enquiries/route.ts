import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, projectSlug } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error: supabaseError } = await supabase.from('enquiries').insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          project_slug: projectSlug || null,
        }
      ]);

      if (supabaseError) {
        console.error('[enquiries] supabase insert returned error:', supabaseError);
        return NextResponse.json({ ok: false, error: 'Database error' }, { status: 500 });
      }
    } else {
      console.warn('[enquiries] NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set.');
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[enquiries] Exception:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
