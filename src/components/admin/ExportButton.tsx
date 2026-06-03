'use client';

import React from 'react';

interface Inquiry {
  [key: string]: any;
}

interface ExportButtonProps {
  data: Inquiry[];
}

export function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) return;

    // We specifically order the columns for the CSV
    const headers = [
      'Date Submitted',
      'First Name',
      'Last Name',
      'Work Email',
      'Phone',
      'Nationality',
      'Occupation',
      'Property Type',
      'Unit Type',
      'Purpose',
      'Timeline',
      'Buyer Type',
      'Locale',
      'Message'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      // Escape quotes by doubling them, wrap in quotes if contains comma, quote, or newline
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const csvRows = [];
    csvRows.push(headers.join(',')); // Header row

    for (const row of data) {
      const values = [
        row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '',
        row.first_name || '',
        row.last_name || '',
        row.work_email || '',
        row.phone || '',
        row.nationality || '',
        row.occupation || '',
        row.property_type || '',
        row.unit_type || '',
        row.purpose || '',
        row.timeline || '',
        row.buyer_type || '',
        row.locale || '',
        row.message || ''
      ];
      csvRows.push(values.map(escapeCsv).join(','));
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    
    // Create an invisible link to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tilal_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1F2937] hover:bg-[#111827] text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md ring-1 ring-inset ring-white/10"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export to CSV
    </button>
  );
}
