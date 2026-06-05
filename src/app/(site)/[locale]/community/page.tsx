import fs from 'fs';
import path from 'path';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { CommunityClient } from '@/components/CommunityClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

import assetsMap from '@/assets_map.json';

function getPdfPages(subPath: string) {
  const prefix = `/assets/pdf-images/${subPath}/`;
  let pages: string[] = [];
  try {
    pages = Object.keys(assetsMap)
      .filter(k => k.startsWith(prefix))
      .sort((a, b) => {
        const numA = parseInt(a.replace(prefix + 'page_', '').replace('.webp', '')) || 0;
        const numB = parseInt(b.replace(prefix + 'page_', '').replace('.webp', '')) || 0;
        return numA - numB;
      });
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
