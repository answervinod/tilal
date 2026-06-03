import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from '@/components/admin/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/en/admin/login');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-md m-8">
        <h3 className="text-red-800 font-medium">Missing Configuration</h3>
        <p className="text-red-700 text-sm mt-2">Supabase credentials are not configured in .env.local.</p>
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-md m-8">
        <h3 className="text-red-800 font-medium">Database Error</h3>
        <p className="text-red-700 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-8 py-5 bg-white/40 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inquiries</h1>
      </div>

      <DashboardClient initialInquiries={inquiries || []} />
    </div>
  );
}
