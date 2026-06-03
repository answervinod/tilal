'use client';

import React, { useState, useMemo } from 'react';
import { ExportButton } from './ExportButton';

export function DashboardClient({ initialInquiries }: { initialInquiries: any[] }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filteredInquiries = useMemo(() => {
    let result = initialInquiries || [];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          (i.first_name || '').toLowerCase().includes(q) ||
          (i.last_name || '').toLowerCase().includes(q) ||
          (i.work_email || '').toLowerCase().includes(q) ||
          (i.phone || '').toLowerCase().includes(q)
      );
    }

    // Dropdown filter
    if (filterType !== 'All') {
      if (['Immediately', 'Less than 6 months', '6 months to 1 year'].includes(filterType)) {
        result = result.filter((i) => i.timeline === filterType);
      } else if (['Cash buyer', 'Mortgage buyer'].includes(filterType)) {
        result = result.filter((i) => i.buyer_type === filterType);
      }
    }

    return result;
  }, [initialInquiries, search, filterType]);

  return (
    <>
      <div className="flex-1 overflow-auto p-8">
        
        {/* Action Bar */}
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
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`p-2 bg-white border rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all shadow-sm ${filterType !== 'All' ? 'border-blue-300 bg-blue-50 text-blue-600' : 'border-slate-200'}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              </button>

              {showFilterMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-lg z-20 py-2">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buyer Type</div>
                  <button onClick={() => { setFilterType('All'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">All Inquiries</button>
                  <button onClick={() => { setFilterType('Cash buyer'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Cash Buyer</button>
                  <button onClick={() => { setFilterType('Mortgage buyer'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Mortgage Buyer</button>
                  <div className="px-3 py-1 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-3">Timeline</div>
                  <button onClick={() => { setFilterType('Immediately'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Immediately</button>
                  <button onClick={() => { setFilterType('Less than 6 months'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50">Less than 6 months</button>
                </div>
              )}
            </div>
            {filterType !== 'All' && (
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                {filterType} <button onClick={() => setFilterType('All')} className="ml-1 hover:text-blue-900">&times;</button>
              </span>
            )}
          </div>
          
          <ExportButton data={filteredInquiries} />
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden min-h-[500px]">
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
                {filteredInquiries.map((inq, index) => {
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
                        <RowActionMenu inquiry={inq} onView={() => setSelectedInquiry(inq)} />
                      </td>
                    </tr>
                  );
                })}
                {filteredInquiries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-slate-500">
                      <p className="text-base font-medium text-slate-900">No properties/inquiries found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="text-xs text-slate-500">
              Results: 1 - {filteredInquiries.length} of {filteredInquiries.length}
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-600 cursor-not-allowed"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <button className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium bg-blue-600 text-white">1</button>
              <button className="p-1 text-slate-400 hover:text-slate-600 cursor-not-allowed"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Message</p>
                <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
                  {selectedInquiry.message || <span className="italic text-slate-400">No message provided.</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Submitted On</p>
                  <p className="text-sm font-medium text-slate-900">{new Date(selectedInquiry.submitted_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Locale</p>
                  <p className="text-sm font-medium text-slate-900 uppercase">{selectedInquiry.locale}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedInquiry(null)} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Separate component for the row menu to handle its own open/close state cleanly
function RowActionMenu({ inquiry, onView }: { inquiry: any, onView: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-lg z-50 py-1">
          <button 
            onClick={() => { setIsOpen(false); onView(); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            View Details
          </button>
        </div>
      )}
    </div>
  );
}
