// Optional live audit: run independently from the local regression check.
// A source-site edit intentionally causes a useful mismatch, not silent merging.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { load } from 'cheerio';
import { properties } from '../src/data.js';

const manifest = JSON.parse(await readFile('public/assets/manifest.json', 'utf8'));
const assetByFile = new Map(manifest.assets.map(asset => [asset.file, asset]));
const pages = new Map();
async function getPage(url) {
  if (!pages.has(url)) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `Quellseite ${url}`);
    pages.set(url, load(await response.text()));
  }
  return pages.get(url);
}
const d = await getPage('https://www.basalic.de/Immobilien');
const liveRows = new Map();
d('.dmRespRow').each((_index, element) => {
  const row = d(element);
  const images = row.find('img[data-dm-image-path]');
  if (images.length !== 1 || !/qm|Zimmer|familienhaus|Waldenbuch/i.test(row.text())) return;
  const id = row.attr('id');
  assert.ok(!liveRows.has(id), `Doppelte Live-Quellzeile ${id}`);
  liveRows.set(id, row);
});
assert.equal(liveRows.size, 49, 'Live-Bestand: 49 Quelleneinträge');
assert.deepEqual(new Set(properties.map(p => p.sourceRow)), new Set(liveRows.keys()), 'Exakte Übereinstimmung aller Live-Quellzeilen');
for (const p of properties) {
  const row = liveRows.get(p.sourceRow);
  const text = row.text().replace(/\s+/g, ' ').trim();
  const compact = text.replace(/\s/g, '').toLocaleLowerCase('de');
  const status = compact.includes('verkauft') ? 'sold' : compact.includes('zuverkaufen') ? 'offer' : 'information';
  assert.equal(p.status, status, `${p.id}: Live-Verkaufsstatus`);
  const image = row.find('img[data-dm-image-path]').first();
  const expose = image.closest('a').attr('href') || null;
  assert.equal(p.expose ? `https://www.immobilienscout24.de/expose/${p.expose}` : null, expose, `${p.id}: Live-Exposé gehört zur Textzeile`);
  if (!p.image) {
    assert.equal(p.id, 'salach');
    assert.match(text, /Beispielbild/i);
    continue;
  }
  const asset = assetByFile.get(`${p.image}.webp`);
  assert.equal(asset.sourceRow, p.sourceRow, `${p.id}: gespeicherte Bildzeile`);
  assert.equal(asset.original, image.attr('data-dm-image-path'), `${p.id}: Originalbild derselben Live-Zeile`);
  assert.equal(asset.expose, expose, `${p.id}: Bild-/Exposé-Provenienz`);
}
for (const asset of manifest.assets.filter(asset => !asset.propertyId)) {
  const page = await getPage(asset.source);
  if (asset.file === 'hero-original.webp') {
    const cssUrl = page('#homeCssLink').attr('href');
    assert.ok(cssUrl, 'Startseiten-Stylesheet vorhanden');
    const response = await fetch(new URL(cssUrl, asset.source), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, 'Startseiten-Stylesheet erreichbar');
    const css = await response.text();
    assert.ok(/10562(?:-|\.)/.test(css), 'Originales Startbild ist im Startseiten-CSS belegt');
    assert.match(asset.original, /\/10562\.jpeg$/);
  } else {
    const originals = page('img[data-dm-image-path]').toArray().map(element => page(element).attr('data-dm-image-path'));
    assert.ok(originals.includes(asset.original), `${asset.file}: Motiv auf der angegebenen Originalseite`);
  }
}
console.log(`OK: alle ${liveRows.size} Live-Immobilieneinträge, Status, Exposé- und Bildzeilen sowie ${manifest.assets.length} Bildnachweise abgeglichen.`);
