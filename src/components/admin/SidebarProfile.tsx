'use client';

import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';

interface SidebarProfileProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function SidebarProfile({ user }: SidebarProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mt-auto relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 m-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-colors text-left"
        style={{ width: 'calc(100% - 2rem)' }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {user?.image ? (
            <img src={user.image} alt="User" className="w-10 h-10 rounded-full bg-slate-800 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-500/20">
              {user?.name?.charAt(0) || 'A'}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white font-medium truncate">{user?.name || 'Administrator'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@tilal.com'}</p>
          </div>
        </div>
        <svg className="w-4 h-4 text-slate-500 group-hover:text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 left-4 w-[calc(100%-2rem)] bg-[#1E293B] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <button 
            onClick={() => signOut()}
            className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
