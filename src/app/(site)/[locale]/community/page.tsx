import fs from 'fs';
import path from 'path';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { CommunityClient } from '@/components/CommunityClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function getPdfPages(subPath: string) {
  const dir = path.join(process.cwd(), 'public', 'assets', 'pdf-images', subPath);
  let pages: string[] = [];
  try {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir)
        .filter(f => f.endsWith('.webp'))
        .sort((a, b) => {
          const numA = parseInt(a.replace('page_', '').replace('.webp', '')) || 0;
          const numB = parseInt(b.replace('page_', '').replace('.webp', '')) || 0;
          return numA - numB;
        });
      pages = files.map(f => `/assets/pdf-images/${subPath}/${f}`);
    }
  } catch (error) {
    console.error(`Error reading ${subPath}:`, error);
  }
  return pages;
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dunesPages = getPdfPages('Tilal Community General/Tilal Binghatti - Dunes');
  const oasisPages = getPdfPages('Tilal Community General/Tilal Binghatti - Oasis');
  const masterPlanPages = getPdfPages('Tilal Master Plan');

  return (
    <CommunityClient 
      locale={locale} 
      dunesPages={dunesPages} 
      oasisPages={oasisPages} 
      masterPlanPages={masterPlanPages} 
    />
  );
}
