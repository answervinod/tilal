import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ searchParams }: { searchParams: { key?: string } }) {
  // Simple password protection using URL query parameter ?key=YOUR_PASSWORD
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (adminPassword && searchParams.key !== adminPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">Please provide the correct access key in the URL (e.g. ?key=your_password)</p>
        </div>
      </div>
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="p-8 text-red-600">
        Supabase credentials (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not configured in .env.local
      </div>
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error fetching inquiries: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-display text-gray-900 mb-8">Inquiries Dashboard</h1>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Preferences</th>
                  <th className="px-6 py-4">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries?.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(inq.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {inq.first_name} {inq.last_name}
                      <div className="text-xs text-gray-500 font-normal mt-1">Nat: {inq.nationality}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{inq.work_email}</div>
                      <div className="text-gray-500">{inq.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>Occ: {inq.occupation}</div>
                      <div className="text-gray-500">Subj: {inq.subject || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{inq.property_type} - {inq.unit_type}</div>
                      <div className="text-gray-500">{inq.purpose} | {inq.buyer_type}</div>
                      <div className="text-gray-500">Timeline: {inq.timeline}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={inq.message}>
                      {inq.message || '-'}
                    </td>
                  </tr>
                ))}
                {(!inquiries || inquiries.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
