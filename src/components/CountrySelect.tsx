'use client';

import React, { useState, useRef, useEffect } from 'react';
import { countries } from '@/lib/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  variant?: 'default' | 'transparent';
}

export function CountrySelect({ value, onChange, error, variant = 'default' }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const baseCls = variant === 'transparent'
    ? 'w-full bg-transparent border-b border-fg/15 py-3 text-fg flex items-center justify-between cursor-pointer transition-colors focus:border-gold focus:outline-none'
    : `w-full bg-white border px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors ${
        error ? 'border-red-500' : isOpen ? 'border-brand' : 'border-neutral-300'
      }`;

  const selectedCountry = countries.find(c => c.name === value);

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={baseCls}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`flex items-center gap-2 ${variant === 'transparent' ? 'text-fg' : value ? 'text-slate-900' : 'text-slate-400'}`}>
          {selectedCountry && <span className="text-base">{selectedCountry.flag}</span>}
          {value || 'Select Nationality...'}
        </span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-brand' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 shadow-xl rounded-b-md">
          <div className="p-2 border-b border-neutral-100">
            <input 
              type="text" 
              placeholder="Search country..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-brand"
            />
          </div>
          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {filtered.length > 0 ? filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-800"
                onClick={() => {
                  onChange(c.name);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                <span className="text-base">{c.flag}</span>
                <span className="truncate">{c.name}</span>
              </button>
            )) : (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
