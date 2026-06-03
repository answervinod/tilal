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
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-8 py-5 bg-white/40 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inquiries</h1>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search name, phone, email..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </button>
          </div>
          
          <ExportButton data={inquiries || []} />
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-medium border-b border-slate-200 bg-white">
                <tr>
                  <th className="px-6 py-4 font-medium">Client Name</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Property Details</th>
                  <th className="px-6 py-4 font-medium">Timeline</th>
                  <th className="px-6 py-4 font-medium">Buyer Type</th>
                  <th className="px-6 py-4 font-medium text-right">Date</th>
                  <th className="px-4 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries?.map((inq, index) => {
                  const colors = ['bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${color}`}>
                            {inq.first_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{inq.first_name} {inq.last_name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{inq.nationality} • {inq.occupation}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-900 font-medium">{inq.phone}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{inq.work_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-slate-900 font-medium">{inq.unit_type}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{inq.property_type} • {inq.purpose}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                          inq.timeline === 'Immediately' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                          {inq.timeline}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                          inq.buyer_type === 'Cash buyer' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                          'bg-blue-50 text-blue-600 border-blue-200'
                        }`}>
                          {inq.buyer_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-slate-900 font-medium">
                          {new Date(inq.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          {new Date(inq.submitted_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {(!inquiries || inquiries.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                      <p className="text-base font-medium text-slate-900">No properties/inquiries yet</p>
                      <p className="text-sm mt-1">New entries will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Results: 1 - {inquiries?.length || 0} of {inquiries?.length || 0}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-600 cursor-not-allowed"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <button className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium bg-blue-600 text-white">1</button>
              <button className="p-1 text-slate-400 hover:text-slate-600 cursor-not-allowed"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
