import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { ExportButton } from '@/components/admin/ExportButton';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
      <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-md">
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
      <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-md">
        <h3 className="text-red-800 font-medium">Database Error</h3>
        <p className="text-red-700 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  const total = inquiries?.length || 0;
  const cashBuyers = inquiries?.filter(i => i.buyer_type === 'Cash buyer').length || 0;
  const immediate = inquiries?.filter(i => i.timeline === 'Immediately').length || 0;
  const thisWeek = inquiries?.filter(i => {
    const date = new Date(i.submitted_at);
    const now = new Date();
    return (now.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7;
  }).length || 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Manage and track your lead inquiries in real-time.</p>
        </div>
        <ExportButton data={inquiries || []} />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-xl p-7 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 relative z-10">Total Inquiries</span>
          <span className="text-5xl font-bold text-slate-900 relative z-10">{total}</span>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-7 rounded-2xl shadow-[0_8px_30px_rgba(59,130,246,0.3)] border border-blue-400 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-2 relative z-10">New This Week</span>
          <span className="text-5xl font-bold text-white relative z-10">{thisWeek}</span>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-7 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-600">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 relative z-10">Cash Buyers</span>
          <span className="text-5xl font-bold text-emerald-600 relative z-10">{cashBuyers}</span>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-7 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-600">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-3 2.5-4.5 1 2.5 2 4.5 5 5 2.5 1 2.5 3 2.5 3.5a5.5 5.5 0 01-1.343 4.157z" /></svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 relative z-10">Hot Leads (Immediate)</span>
          <span className="text-5xl font-bold text-orange-500 relative z-10">{immediate}</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Inquiries</h2>
          <span className="px-4 py-1.5 bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider rounded-full border border-brand/20 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
            Live Sync
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 font-semibold">Client</th>
                <th className="px-8 py-5 font-semibold">Contact</th>
                <th className="px-8 py-5 font-semibold">Property Details</th>
                <th className="px-8 py-5 font-semibold">Timeline & Buyer</th>
                <th className="px-8 py-5 font-semibold w-1/4">Message</th>
                <th className="px-8 py-5 font-semibold text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries?.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="font-bold text-slate-900 text-base">{inq.first_name} {inq.last_name}</div>
                    <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium border border-slate-200/60">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {inq.nationality}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{inq.occupation}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="text-slate-900 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {inq.phone}
                    </div>
                    <div className="text-slate-500 text-xs mt-1.5 flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {inq.work_email}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase bg-purple-50 text-purple-700 border border-purple-100 shadow-sm">
                      {inq.property_type}
                    </div>
                    <div className="text-slate-600 text-sm mt-2 font-medium">
                      {inq.unit_type}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {inq.purpose}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex flex-col gap-2.5">
                      <span className={`inline-flex w-fit items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm border ${inq.timeline === 'Immediately' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                        {inq.timeline}
                      </span>
                      <span className={`inline-flex w-fit items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm border ${inq.buyer_type === 'Cash buyer' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        {inq.buyer_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-slate-600 text-sm leading-relaxed max-w-sm" title={inq.message}>
                      {inq.message || <span className="text-slate-400 italic">No message provided</span>}
                    </p>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-right">
                    <div className="text-slate-900 font-medium">
                      {new Date(inq.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-slate-400 text-xs mt-1 font-medium">
                      {new Date(inq.submitted_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
              {(!inquiries || inquiries.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-500">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                      <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <p className="text-lg font-medium text-slate-900">No inquiries yet</p>
                    <p className="mt-1">Inquiries will appear here automatically when submitted.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
