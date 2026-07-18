'use client';

import React, { useState, useMemo } from 'react';

export function EnquiriesClient({ initialEnquiries }: { initialEnquiries: any[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries || []);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const filteredEnquiries = useMemo(() => {
    let result = enquiries;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          (i.first_name || '').toLowerCase().includes(q) ||
          (i.last_name || '').toLowerCase().includes(q) ||
          (i.email || '').toLowerCase().includes(q) ||
          (i.phone || '').toLowerCase().includes(q)
      );
    }

    return result;
  }, [enquiries, search]);

  return (
    <>
      <div className="flex-1 overflow-auto p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search name, phone, email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p>No enquiries found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => {
                    return (
                      <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{enquiry.first_name} {enquiry.last_name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-900">{enquiry.email}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{enquiry.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                            {enquiry.project_slug || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {new Date(enquiry.submitted_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="text-purple-600 hover:text-purple-900 font-medium text-xs bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedEnquiry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-semibold text-slate-900">Enquiry Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">First Name</dt>
                  <dd className="text-sm font-medium text-slate-900">{selectedEnquiry.first_name}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Last Name</dt>
                  <dd className="text-sm font-medium text-slate-900">{selectedEnquiry.last_name}</dd>
                </div>
                
                <div className="col-span-2">
                  <div className="h-px bg-slate-100 w-full" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</dt>
                  <dd className="text-sm font-medium text-slate-900 break-all">{selectedEnquiry.email}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</dt>
                  <dd className="text-sm font-medium text-slate-900">{selectedEnquiry.phone || '-'}</dd>
                </div>

                <div className="col-span-2">
                  <div className="h-px bg-slate-100 w-full" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Project Downloaded</dt>
                  <dd className="text-sm font-medium text-purple-700">{selectedEnquiry.project_slug || '-'}</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Submitted At</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {new Date(selectedEnquiry.submitted_at).toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
