'use client';

import React, { useState, useMemo } from 'react';
import { EnquiriesExportButton } from './EnquiriesExportButton';

export function EnquiriesClient({ initialEnquiries }: { initialEnquiries: any[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries || []);
  const [search, setSearch] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredEnquiries.length && filteredEnquiries.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredEnquiries.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setEnquiries(prev => prev.filter(i => i.id !== id));
      
      const nextSelected = new Set(selectedIds);
      nextSelected.delete(id);
      setSelectedIds(nextSelected);
    } catch (err) {
      console.error(err);
      alert('Failed to delete the record. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} records?`)) return;

    setIsDeleting(true);
    try {
      for (const id of Array.from(selectedIds)) {
        await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      }
      setEnquiries(prev => prev.filter(i => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      alert('Some records failed to delete. Please refresh and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
          
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button
                onClick={deleteSelected}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Selected ({selectedIds.size})
              </button>
            )}
            
            <EnquiriesExportButton data={filteredEnquiries} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredEnquiries.length && filteredEnquiries.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                    />
                  </th>
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
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
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
                      <tr key={enquiry.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(enquiry.id) ? 'bg-purple-50/30' : ''}`}>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(enquiry.id)}
                            onChange={() => toggleSelect(enquiry.id)}
                            className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                          />
                        </td>
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
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="text-purple-600 hover:text-purple-900 font-medium text-xs bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteEnquiry(enquiry.id)}
                            disabled={isDeleting}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50 disabled:opacity-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Project/Source</dt>
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
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  deleteEnquiry(selectedEnquiry.id);
                  setSelectedEnquiry(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 focus:outline-none transition-colors"
              >
                Delete
              </button>
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
