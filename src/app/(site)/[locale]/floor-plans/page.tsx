import fs from 'fs';
import path from 'path';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { FloorPlansClient } from '@/components/FloorPlansClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

import assetsMap from '@/assets_map.json';

export default async function FloorPlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const prefix = '/assets/pdf-images/Unit Plans/';
  let plans: { id: string; name: string; pages: string[]; pdfUrl: string }[] = [];

  try {
    const unitPlanKeys = Object.keys(assetsMap).filter(k => k.startsWith(prefix));
    
    // Extract unique folder names
    const folderSet = new Set<string>();
    for (const key of unitPlanKeys) {
      const remaining = key.substring(prefix.length);
      const folderName = remaining.split('/')[0];
      if (folderName) folderSet.add(folderName);
    }
    
    const folders = Array.from(folderSet);

    for (const folder of folders) {
      const folderPrefix = `${prefix}${folder}/`;
      const pages = unitPlanKeys
        .filter(k => k.startsWith(folderPrefix))
        .sort((a, b) => {
          const numA = parseInt(a.replace(folderPrefix + 'page_', '').replace('.webp', '')) || 0;
          const numB = parseInt(b.replace(folderPrefix + 'page_', '').replace('.webp', '')) || 0;
          return numA - numB;
        });

      plans.push({
        id: folder.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: folder,
        pages: pages,
        pdfUrl: `/Tilal Binghatti/Unit Plans/${folder}.pdf`
      });
    }
  } catch (error) {
    console.error('Error reading floor plans:', error);
  }

  // Sort plans logically (4 BR, 5 BR, 6 BR...)
  plans.sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  return <FloorPlansClient locale={locale} plans={plans} />;
}
