import '../../../globals.css';
import type { Metadata } from 'next';

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
    <html lang={params.locale}>
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
              <span className="font-bold tracking-widest text-lg">TILAL ADMIN</span>
            </div>
            <nav className="p-4 flex-1">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-3 px-4 py-2 bg-black text-white rounded-md text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    Inquiries
                  </a>
                </li>
                <li>
                  <a href="/studio" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    Sanity Studio
                  </a>
                </li>
                <li>
                  <a href="/" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Live Site
                  </a>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Logged in as Admin
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm z-10">
              <h1 className="text-lg font-medium">Dashboard Overview</h1>
            </header>
            <div className="flex-1 overflow-auto p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
