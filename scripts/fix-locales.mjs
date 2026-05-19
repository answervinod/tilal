/**
 * Fix: add missing `language` field to seeded page documents
 * so @sanity/document-internationalization recognises them as translations.
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!PROJECT_ID || !WRITE_TOKEN) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

const pages = [
  { _id: 'page-home-en', language: 'en' },
  { _id: 'page-home-ar', language: 'ar' },
  { _id: 'page-about-en', language: 'en' },
  { _id: 'page-about-ar', language: 'ar' },
  { _id: 'page-contact-en', language: 'en' },
  { _id: 'page-contact-ar', language: 'ar' },
  { _id: 'page-amenities-en', language: 'en' },
  { _id: 'page-amenities-ar', language: 'ar' },
  { _id: 'page-investment-en', language: 'en' },
  { _id: 'page-investment-ar', language: 'ar' },
  { _id: 'page-materials-en', language: 'en' },
  { _id: 'page-materials-ar', language: 'ar' },
  { _id: 'page-projects-en', language: 'en' },
  { _id: 'page-projects-ar', language: 'ar' },
];

(async () => {
  for (const p of pages) {
    try {
      await client.patch(p._id).set({ language: p.language }).commit({ visibility: 'async' });
      console.log(`Patched ${p._id} → language: ${p.language}`);
    } catch (err) {
      console.error(`Failed ${p._id}:`, err.message);
    }
  }
  console.log('\nDone. Refresh Sanity Studio — the "slug already in use" warning should be gone.');
})();
