import fs from 'fs';
import path from 'path';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { FloorPlansClient } from '@/components/FloorPlansClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function FloorPlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Read the directory structure of generated PDF images for Unit Plans
  const baseDir = path.join(process.cwd(), 'public', 'assets', 'pdf-images', 'Unit Plans');
  let plans: { id: string; name: string; pages: string[]; pdfUrl: string }[] = [];

  try {
    if (fs.existsSync(baseDir)) {
      const folders = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const folder of folders) {
        const folderPath = path.join(baseDir, folder);
        const files = fs.readdirSync(folderPath)
          .filter(f => f.endsWith('.webp'))
          .sort((a, b) => {
            // Sort by page number (page_1.webp, page_2.webp)
            const numA = parseInt(a.replace('page_', '').replace('.webp', '')) || 0;
            const numB = parseInt(b.replace('page_', '').replace('.webp', '')) || 0;
            return numA - numB;
          });

        plans.push({
          id: folder.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: folder,
          pages: files.map(f => `/assets/pdf-images/Unit Plans/${folder}/${f}`),
          pdfUrl: `/Tilal Binghatti/Unit Plans/${folder}.pdf`
        });
      }
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
