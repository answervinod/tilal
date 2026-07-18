'use client';

import React, { useState, useRef, useEffect } from 'react';
import { countries } from '@/lib/countries';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id?: string;
  variant?: 'default' | 'transparent' | 'dark';
}

export function PhoneInput({ value, onChange, error, id, variant = 'default' }: PhoneInputProps) {
  // Parse initial value (very basic parsing, assuming format "+Code Number")
  // For a robust app, we'd use libphonenumber, but this splits the UI as requested.
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === 'AE') || countries[0]);
  const [phoneVal, setPhoneVal] = useState('');
  
  // Set initial state from value if provided
  useEffect(() => {
    if (value && !phoneVal) {
      // Find matching dial code
      const match = countries.find(c => value.startsWith(c.dialCode));
      if (match) {
        setSelectedCountry(match);
        setPhoneVal(value.slice(match.dialCode.length).trim());
      } else {
        setPhoneVal(value);
      }
    }
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value.replace(/[^\d\s-]/g, ''); // Allow only digits, spaces, hyphens
    setPhoneVal(newVal);
    onChange(`${selectedCountry.dialCode} ${newVal}`);
  };

  const handleCountrySelect = (c: typeof countries[0]) => {
    setSelectedCountry(c);
    setIsOpen(false);
    onChange(`${c.dialCode} ${phoneVal}`);
  };

  const btnCls = variant === 'transparent'
    ? 'flex items-center gap-2 px-3 py-3 bg-transparent text-fg text-sm transition-colors focus:outline-none'
    : variant === 'dark'
    ? 'flex items-center gap-2 px-3 py-3 bg-white/5 border border-r-0 border-white/10 rounded-l-lg text-white text-sm transition-colors focus:outline-none focus:border-[#25D366]'
    : `flex items-center gap-2 px-3 py-3 bg-slate-50 border border-r-0 text-sm transition-colors ${
        error ? 'border-red-500' : 'border-neutral-300'
      } focus:outline-none focus:border-brand`;

  const inputCls = variant === 'transparent'
    ? 'w-full bg-transparent py-3 text-fg focus:outline-none transition-colors'
    : variant === 'dark'
    ? 'w-full bg-white/5 border border-white/10 rounded-r-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#25D366] transition-all'
    : `w-full bg-white border px-4 py-3 text-sm focus:outline-none focus:border-brand transition-colors ${
        error ? 'border-red-500' : 'border-neutral-300'
      }`;

  return (
    <div className={`relative flex ${variant === 'transparent' ? 'border-b border-fg/15 focus-within:border-gold' : ''}`} ref={wrapperRef}>
      {/* Country Code Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={btnCls}
      >
        <span className="text-base leading-none">{selectedCountry.flag}</span>
        <span className={variant === 'transparent' ? 'text-fg font-medium whitespace-nowrap' : variant === 'dark' ? 'text-white font-medium whitespace-nowrap' : 'text-slate-600 font-medium whitespace-nowrap'}>{selectedCountry.dialCode}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''} ${variant === 'transparent' ? 'text-fg/60' : variant === 'dark' ? 'text-white/60' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Phone Number Input */}
      <input
        id={id}
        type="tel"
        value={phoneVal}
        onChange={handlePhoneChange}
        className={inputCls}
        placeholder="Phone number"
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[300px] bg-white border border-neutral-200 shadow-xl rounded-md z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1 overscroll-contain" data-lenis-prevent="true">
            {countries.map((c) => (
              <button
                key={c.code}
                type="button"
                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 text-slate-800"
                onClick={() => handleCountrySelect(c)}
              >
                <span className="text-base w-6 text-center">{c.flag}</span>
                <span className="truncate flex-1 text-slate-700">{c.name}</span>
                <span className="text-slate-400 font-medium">{c.dialCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
