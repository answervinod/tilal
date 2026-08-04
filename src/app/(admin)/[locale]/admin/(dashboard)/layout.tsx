import '../../../../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SidebarProfile } from "@/components/admin/SidebarProfile";
import Link from 'next/link';
import { MobileSidebar } from '@/components/admin/MobileSidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Admin Dashboard \u2014 Tilal',
  description: 'Internal SAAS Dashboard for Tilal Inquiries',
};

export default async function AdminRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang={params.locale} className={inter.variable}>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans cursor-auto selection:bg-brand/30" style={{ fontFamily: 'var(--font-inter)' }}>
        <div className="flex min-h-screen">
          {/* Premium Dark Sidebar (BluNest Style) */}
          <aside className="w-[260px] bg-[#0F172A] hidden md:flex flex-col text-slate-400 z-20 relative">
            
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/></svg>
                </div>
                <span className="text-xl text-white font-bold tracking-tight">TilalAdmin</span>
              </div>
            </div>
            
            <div className="px-4 py-6 flex-1 overflow-y-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 px-3">Dashboards</div>
              <nav className="space-y-1 mb-8">
                <Link href={`/${params.locale}/admin`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Contact Page Enquiries
                </Link>
                <Link href={`/${params.locale}/admin/developments`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Development page Enquiries
                </Link>
                <Link href={`/${params.locale}/admin/whatsapp`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  <svg className="w-5 h-5 text-[#25D366]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                  Whatsapp Queries
                </Link>
                <Link href={`/${params.locale}/admin/popup-inquiries`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-all">
                  <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  Popup Form Queries
                </Link>
              </nav>
            </div>

            <SidebarProfile user={session?.user || null} />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
            <MobileSidebar locale={params.locale} user={session?.user || null} />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
