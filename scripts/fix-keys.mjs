/**
 * Fix: add missing _key to nested link/array objects inside page sections.
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
  console.error('Missing env vars');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-10-01',
  token: WRITE_TOKEN,
  useCdn: false,
});

function makeKey() {
  return Math.random().toString(36).substring(2, 9);
}

function ensureKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (item && typeof item === 'object') {
        const withKey = item._key ? item : { _key: makeKey(), ...item };
        return ensureKeys(withKey);
      }
      return item;
    });
  }
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = ensureKeys(v);
    }
    return out;
  }
  return obj;
}

(async () => {
  const pages = await client.fetch(`*[_type == "page"]{ _id, sections }`);
  for (const page of pages) {
    const fixed = ensureKeys(page.sections);
    try {
      await client.patch(page._id).set({ sections: fixed }).commit({ visibility: 'async' });
      console.log(`Fixed keys in ${page._id}`);
    } catch (err) {
      console.error(`Failed ${page._id}:`, err.message);
    }
  }
  console.log('\nDone. Refresh Sanity Studio and click "Publish".');
})();
