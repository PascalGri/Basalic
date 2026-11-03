import { load } from 'cheerio';
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { properties, sourceDate } from '../src/data.js';

// Run from the repository root. Each image is resolved within the exact
// dmRespRow that contains its property's original text, never by global index.
// --references-only updates the historical archive without touching other files.
const referencesOnly = process.argv.includes('--references-only');
const source = 'https://www.basalic.de/Immobilien';
const checked = sourceDate.split('.').reverse().join('-');
await mkdir('public/assets', { recursive: true });
const previous = JSON.parse(await readFile('public/assets/manifest.json', 'utf8'));
const propertyFiles = new Set(properties.filter(p => p.image).map(p => `${p.image}.webp`));
const retained = previous.assets.filter(asset => !propertyFiles.has(asset.file));
const manifest = [];
let written = 0;

async function page(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return load(await response.text());
}
async function download(url, file, width = 1400, quality = 85) {
  const response = await fetch(url.replaceAll('&amp;', '&'));
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await sharp(buffer).rotate().resize({ width, withoutEnlargement: true })
    .webp({ quality }).toFile(`public/assets/${file}`);
  written++;
}

const d = await page(source);
for (const p of properties) {
  const row = d(`[id="${p.sourceRow}"]`);
  if (row.length !== 1 || !row.hasClass('dmRespRow')) {
    throw new Error(`${p.id}: Quellzeile ${p.sourceRow} fehlt oder ist nicht eindeutig`);
  }
  if (!p.image) {
    if (p.id !== 'salach' || !/Beispielbild/i.test(row.text())) {
      throw new Error(`${p.id}: fehlende Bildzuordnung prüfen`);
    }
    continue; // The Salach image is expressly a sample, not a property photo.
  }
  const images = row.find('img[data-dm-image-path]');
  if (images.length !== 1) throw new Error(`${p.id}: Bild in Quellzeile nicht eindeutig`);
  const image = images.first();
  const original = image.attr('data-dm-image-path');
  const url = image.attr('src');
  if (!original?.startsWith('https://cdn.website-editor.net/') || !url?.startsWith('https://')) {
    throw new Error(`${p.id}: Originalbildquelle prüfen`);
  }
  const expose = image.closest('a').attr('href') || null;
  if (p.expose && expose !== `https://www.immobilienscout24.de/expose/${p.expose}`) {
    throw new Error(`${p.id}: Exposé gehört nicht zur gespeicherten Quellzeile`);
  }
  const file = `${p.image}.webp`;
  if (!referencesOnly || p.status === 'sold') await download(url, file);
  manifest.push({
    file, source, sourceRow: p.sourceRow, propertyId: p.id, original, expose,
    role: p.imageRole || 'Abbildung aus dem zugehörigen Immobilien-Quelleneintrag',
    rights: 'Betreiberfreigabe und Urhebernachweis ausstehend; ausschließlich interne Entwurfsvorschau.'
  });
}

// Keep other locally sourced assets (for example service images and the home
// page motif). Their canonical original URL makes the complete set reproducible.
// Do not replace or discard additional metadata supplied with those entries.
for (const asset of retained) {
  if (!referencesOnly) {
    if (asset.file === 'senad-basalic.webp') {
      const about = await page('https://www.basalic.de/about');
      const photo = about('img[data-dm-image-path]').first();
      const original = photo.attr('data-dm-image-path');
      if (!original || !photo.attr('src')) throw new Error('Porträtquelle prüfen');
      asset.original = original;
      await download(photo.attr('src'), asset.file, 1000, 88);
    } else if (asset.original?.startsWith('https://cdn.website-editor.net/')) {
      await download(asset.downloadUrl || asset.original, asset.file, asset.width || 2000, asset.quality || 88);
    } else {
      throw new Error(`${asset.file}: reproduzierbare Originalquelle auf basalic.de fehlt`);
    }
  }
  manifest.push(asset);
}
await writeFile('public/assets/manifest.json', JSON.stringify({ ...previous, checked, assets: manifest }, null, 2) + '\n');
console.log(`Asset-Zuordnung geprüft: ${properties.length} Objekte, ${propertyFiles.size} Objektabbildungen; ${written} WebP-Dateien geschrieben.`);
