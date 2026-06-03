import { Inter } from 'next/font/google';
import '../../../globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sign In \u2014 Tilal Admin',
};

export default function LoginLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} className={inter.variable}>
      <body className="min-h-screen bg-gray-100 text-slate-800 font-sans cursor-auto" style={{ fontFamily: 'var(--font-inter)' }}>
        {children}
      </body>
    </html>
  );
}
