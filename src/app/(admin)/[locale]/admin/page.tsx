import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ searchParams }: { searchParams: { key?: string } }) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (adminPassword && searchParams.key !== adminPassword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You need a valid access key to view this dashboard.</p>
          <div className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            Append <code className="font-mono text-black bg-gray-200 px-1 py-0.5 rounded">?key=YOUR_PASSWORD</code> to the URL.
          </div>
        </div>
      </div>
    );
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">Total Inquiries</span>
          <span className="text-4xl font-bold text-gray-900">{total}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">New This Week</span>
          <span className="text-4xl font-bold text-blue-600">{thisWeek}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">Cash Buyers</span>
          <span className="text-4xl font-bold text-green-600">{cashBuyers}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <span className="text-sm font-medium text-gray-500 mb-1">Hot Leads (Immediate)</span>
          <span className="text-4xl font-bold text-orange-500">{immediate}</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">Live Sync</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Property Details</th>
                <th className="px-6 py-4 font-medium">Timeline & Buyer</th>
                <th className="px-6 py-4 font-medium">Message</th>
                <th className="px-6 py-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries?.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{inq.first_name} {inq.last_name}</div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span className="w-4 h-4 inline-flex items-center justify-center bg-gray-100 rounded-full text-[10px]">\ud83c\udf0d</span>
                      {inq.nationality} \u2022 {inq.occupation}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-medium">{inq.phone}</div>
                    <div className="text-gray-500 text-xs mt-1">{inq.work_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                      {inq.property_type}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {inq.unit_type} \u2022 {inq.purpose}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium ${inq.timeline === 'Immediately' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                        {inq.timeline}
                      </span>
                      <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium ${inq.buyer_type === 'Cash buyer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {inq.buyer_type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 line-clamp-2 max-w-xs text-xs" title={inq.message}>
                      {inq.message || <span className="text-gray-400 italic">No message provided</span>}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 text-xs">
                    {new Date(inq.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    <div className="mt-1">
                      {new Date(inq.submitted_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                </tr>
              ))}
              {(!inquiries || inquiries.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    No inquiries have been received yet.
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
