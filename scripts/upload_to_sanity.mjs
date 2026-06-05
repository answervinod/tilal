import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
});

const baseDir = path.join(process.cwd(), 'public');
const targets = [
  path.join(baseDir, 'Tilal Binghatti'),
  path.join(baseDir, 'project')
];

const assetsMap = {};

async function uploadFile(filePath, type = 'image') {
  const relPath = '/' + path.relative(baseDir, filePath).replace(/\\/g, '/');
  
  if (assetsMap[relPath]) {
    console.log(`Already uploaded: ${relPath}`);
    return;
  }

  console.log(`Uploading: ${relPath}`);
  const stream = fs.createReadStream(filePath);
  
  try {
    const asset = await client.assets.upload(type, stream, {
      filename: path.basename(filePath)
    });
    assetsMap[relPath] = asset.url;
    console.log(`Success: ${asset.url}`);
  } catch (error) {
    console.error(`Error uploading ${relPath}:`, error.message);
  }
}

async function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      await walkDir(filePath);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      if (['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) {
        await uploadFile(filePath, 'image');
      } else if (ext === '.pdf') {
        await uploadFile(filePath, 'file');
      }
    }
  }
}

async function main() {
  console.log('Starting Sanity asset upload...');
  
  // Load existing map if it exists to resume
  const mapFile = path.join(process.cwd(), 'src', 'assets_map.json');
  if (fs.existsSync(mapFile)) {
    Object.assign(assetsMap, JSON.parse(fs.readFileSync(mapFile, 'utf8')));
  }

  for (const target of targets) {
    await walkDir(target);
  }

  fs.writeFileSync(mapFile, JSON.stringify(assetsMap, null, 2));
  console.log('Done! Wrote to src/assets_map.json');
}

main().catch(console.error);
