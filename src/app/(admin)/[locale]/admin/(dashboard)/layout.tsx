import '../../../globals.css';
import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Admin Dashboard \u2014 Tilal',
  description: 'Internal SAAS Dashboard for Tilal Inquiries',
};

export default function AdminRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} className={inter.variable}>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans cursor-auto selection:bg-brand/30" style={{ fontFamily: 'var(--font-inter)' }}>
        <div className="flex min-h-screen">
          {/* Premium Dark Sidebar */}
          <aside className="w-[280px] bg-[#0B1120] border-r border-white/5 hidden md:flex flex-col text-slate-300 shadow-2xl z-20 relative">
            <div className="h-20 flex items-center px-8 border-b border-white/5 bg-[#0B1120]/50 backdrop-blur-md">
              <span className="font-display tracking-widest text-xl text-white font-semibold flex items-center gap-2">
                TILAL<span className="text-brand">ADMIN</span>
              </span>
            </div>
            
            <div className="px-6 py-8">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 px-2">Main Menu</div>
              <nav className="flex-1">
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-brand/10 text-brand rounded-xl text-sm font-medium border border-brand/20 shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                      Inquiries
                    </a>
                  </li>
                  <li>
                    <a href="/studio" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 group">
                      <svg className="w-5 h-5 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      Sanity Studio
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 mt-8 px-2">External Links</div>
              <ul className="space-y-2">
                  <li>
                    <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl text-sm font-medium transition-all duration-300 group">
                      <svg className="w-5 h-5 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      View Live Site
                    </a>
                  </li>
              </ul>
            </div>

            <div className="mt-auto p-6 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-sm border border-brand/30 shadow-inner">AD</div>
                <div className="text-xs">
                  <p className="text-slate-200 font-medium tracking-wide">Administrator</p>
                  <p className="text-slate-500">System User</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
            <div className="flex-1 overflow-auto">
              <div className="max-w-[1600px] mx-auto w-full p-8 md:p-12">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
