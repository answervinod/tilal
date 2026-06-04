'use client';

import React, { useState, useMemo } from 'react';
import { ExportButton } from './ExportButton';

export function DashboardClient({ initialInquiries }: { initialInquiries: any[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries || []);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredInquiries = useMemo(() => {
    let result = inquiries;

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
  }, [inquiries, search, filterType]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/inquiry/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error(err);
      alert('Failed to delete inquiry.');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} inquiries? This action cannot be undone.`)) return;
    
    try {
      // Use Promise.all to delete all selected items
      const deletePromises = Array.from(selectedIds).map(id => 
        fetch(`/api/inquiry/${id}`, { method: 'DELETE' }).then(res => {
          if (!res.ok) throw new Error('Failed to delete ' + id);
        })
      );
      
      await Promise.all(deletePromises);
      
      setInquiries(prev => prev.filter(inq => !selectedIds.has(inq.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      alert('Failed to delete one or more inquiries.');
    }
  };

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
          
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete Selected ({selectedIds.size})
              </button>
            )}
            <ExportButton data={filteredInquiries} />
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden min-h-[500px]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 font-medium border-b border-slate-200 bg-white">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      checked={filteredInquiries.length > 0 && selectedIds.size === filteredInquiries.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(filteredInquiries.map(i => i.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                    />
                  </th>
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
                    <tr key={inq.id} className={`hover:bg-slate-50/50 transition-colors group ${selectedIds.has(inq.id) ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedIds.has(inq.id)}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) next.add(inq.id);
                            else next.delete(inq.id);
                            setSelectedIds(next);
                          }}
                        />
                      </td>
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
                        <RowActionMenu 
                          inquiry={inq} 
                          onView={() => setSelectedInquiry(inq)} 
                          onDelete={() => handleDelete(inq.id)}
                        />
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

      {/* Inquiry Slide-over Panel */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
            onClick={() => setSelectedInquiry(null)} 
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200">
            
            {/* Panel Header */}
            <div className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedInquiry.first_name} {selectedInquiry.last_name}
                </h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {selectedInquiry.phone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {selectedInquiry.work_email}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)} 
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Profile Overview */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Profile</h3>
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Nationality</p>
                    <p className="font-medium text-slate-900">{selectedInquiry.nationality || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Occupation</p>
                    <p className="font-medium text-slate-900">{selectedInquiry.occupation || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Buyer Type</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                      selectedInquiry.buyer_type === 'Cash buyer' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {selectedInquiry.buyer_type}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Timeline</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                      selectedInquiry.timeline === 'Immediately' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {selectedInquiry.timeline}
                    </span>
                  </div>
                </div>
              </section>

              {/* Property Details */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Property Interest</h3>
                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Property Type</p>
                    <p className="font-medium text-slate-900">{selectedInquiry.property_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Unit Type</p>
                    <p className="font-medium text-slate-900">{selectedInquiry.unit_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Purpose</p>
                    <p className="font-medium text-slate-900">{selectedInquiry.purpose}</p>
                  </div>
                </div>
              </section>

              {/* Message */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Message</h3>
                <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || <span className="italic text-slate-400">No message provided.</span>}
                </div>
              </section>

              {/* Metadata */}
              <section className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Submitted On</p>
                    <p className="text-xs font-medium text-slate-600">
                      {new Date(selectedInquiry.submitted_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      <br/>
                      {new Date(selectedInquiry.submitted_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Language Locale</p>
                    <p className="text-xs font-medium text-slate-600 uppercase">{selectedInquiry.locale}</p>
                  </div>
                </div>
              </section>

            </div>

            {/* Panel Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={() => setSelectedInquiry(null)} 
                className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// Separate component for the row menu to handle its own open/close state cleanly
function RowActionMenu({ inquiry, onView, onDelete }: { inquiry: any, onView: () => void, onDelete: () => void }) {
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
          <div className="border-t border-slate-100 my-1"></div>
          <button 
            onClick={() => { setIsOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
