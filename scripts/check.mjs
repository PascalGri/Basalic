// Local regression checks. This script does not control a browser, send a
// message, call the original website, or publish anything.
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';
import sharp from 'sharp';
import { properties, services, sourceDate } from '../src/data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFile(join(root, path), 'utf8');
const manifest = JSON.parse(await read('public/assets/manifest.json'));
const assetByFile = new Map(manifest.assets.map(asset => [asset.file, asset]));
const propertyById = new Map(properties.map(property => [property.id, property]));

assert.equal(sourceDate, '03.11.2026', 'Dokumentierter Original-Quellenstand');
assert.equal(properties.length, 49, 'Alle 49 Originaleinträge übernommen');
assert.equal(propertyById.size, 49, 'Eindeutige lokale Objekt-URLs');
assert.equal(new Set(properties.map(p => p.sourceRow)).size, 49, '49 eindeutige Originalzeilen');
for (const [status, count] of Object.entries({ offer: 7, information: 2, sold: 40 })) {
  assert.equal(properties.filter(p => p.status === status).length, count, `Status ${status}`);
}
assert.deepEqual(services.map(service => service.path), ['/immobilien', '/mietverwaltung', '/finanzierung', '/vorsorge'], 'Alle vier Originalleistungen');
assert.equal(manifest.assets.length, 54, '48 Objektbilder, Porträt und fünf Original-Seitenmotive');
assert.equal(assetByFile.size, 54, 'Eindeutige lokale Bilddateien');
assert.equal(properties.filter(p => p.image).length, 48);
assert.ok(!propertyById.get('salach').image, 'Beispielbild nicht als tatsächliches Salach-Objektfoto ausgeben');
assert.equal(propertyById.get('plochingen').area, '50');
assert.equal(propertyById.get('referenz-plochingen').area, '51');
assert.notEqual(propertyById.get('plochingen').sourceRow, propertyById.get('referenz-plochingen').sourceRow);
assert.notEqual(assetByFile.get('plochingen.webp').original, assetByFile.get('referenz-plochingen.webp').original, 'Plochingen-Angebot und Referenz besitzen getrennte Fotos');
assert.equal(propertyById.get('bezgenriet').areaLabel, 'Gesamtfläche', 'Keine unbelegte Wohnfläche aus Gesamtfläche machen');
assert.ok(!propertyById.get('istrien').area, 'Steinhausfläche nicht als belegte Wohnfläche ausgeben');
assert.ok(!propertyById.get('referenz-tamm').rooms, 'Widersprüchliche Tamm-Zimmerzahl nicht erfinden');
assert.match(propertyById.get('referenz-tamm').note, /1 Zimmer[\s\S]*1,5 Zimmer/, 'Beide Originalangaben bleiben nachvollziehbar');
assert.match(propertyById.get('referenz-gartenwohnung-88').city, /nicht genannt/, 'Keinen fehlenden Ort ergänzen');
for (const [id, expose] of Object.entries({ faurndau: '171049343', muehlhausen: '169662545', neidlingen: '169930109' })) {
  assert.equal(propertyById.get(id).expose, expose, `${id}: Exposé-Zuordnung`);
}
for (const p of properties) {
  assert.match(p.id, /^[a-z0-9-]+$/, `${p.id}: sichere Objekt-URL`);
  assert.match(p.sourceRow, /^\d+$/, `${p.id}: belegte Originalzeile`);
  assert.ok(['Haus', 'Wohnung', 'Grundstück'].includes(p.type), `${p.id}: Objektart für Filter`);
  assert.ok(p.city && p.kind && p.title && Array.isArray(p.features), `${p.id}: vollständiger Datensatz`);
  if (p.status === 'sold') assert.match(p.note, /verkauft/i, `${p.id}: historischer Status`);
  if (!p.image) continue;
  const asset = assetByFile.get(`${p.image}.webp`);
  assert.ok(asset, `${p.id}: Bildnachweis vorhanden`);
  assert.equal(asset.propertyId, p.id, `${p.id}: Foto zum richtigen Objekt`);
  assert.equal(asset.sourceRow, p.sourceRow, `${p.id}: Bild und Text aus derselben Zeile`);
  assert.equal(asset.expose, p.expose ? `https://www.immobilienscout24.de/expose/${p.expose}` : null, `${p.id}: Bild-/Exposé-Verknüpfung`);
}
for (const asset of manifest.assets) {
  assert.equal(new URL(asset.source).hostname, 'www.basalic.de', `${asset.file}: Originalwebsite als Herkunft`);
  assert.equal(new URL(asset.original).hostname, 'cdn.website-editor.net', `${asset.file}: ursprünglicher Bilderdienst`);
  assert.ok(!/unsplash/i.test(JSON.stringify(asset)), `${asset.file}: kein fremdes Ersatzfoto`);
  const path = join(root, 'public/assets', asset.file);
  assert.ok((await stat(path)).size > 0, `${asset.file}: vorhandene Datei`);
  const metadata = await sharp(path).metadata();
  assert.equal(metadata.format, 'webp', asset.file);
  assert.ok(metadata.width > 0 && metadata.height > 0, `${asset.file}: dekodierbares Bild`);
  if (asset.pixelWidth) assert.equal(metadata.width, asset.pixelWidth, `${asset.file}: dokumentierte Breite`);
  if (asset.pixelHeight) assert.equal(metadata.height, asset.pixelHeight, `${asset.file}: dokumentierte Höhe`);
}
assert.match(assetByFile.get('hero-original.webp').original, /\/10562\.jpeg$/, 'Originales Startseitenmotiv');
assert.match(assetByFile.get('finanzierung.webp').original, /\/113667\.jpeg$/, 'Originales Finanzierungsmotiv');

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? filesIn(join(directory, entry.name)) : [join(directory, entry.name)]));
  return nested.flat();
}
const sourceFiles = await filesIn(join(root, 'src'));
const scriptFiles = await filesIn(join(root, 'scripts'));
const modules = [...sourceFiles, ...scriptFiles].filter(file => ['.js', '.mjs'].includes(extname(file)));
assert.ok(sourceFiles.some(file => file.endsWith('/app.js')), 'Eigenständiger App-Einstieg vorhanden');
assert.ok(sourceFiles.some(file => file.endsWith('/pages.js')), 'Eigenständige Unterseiten vorhanden');
for (const file of modules) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8', cwd: root });
  assert.equal(result.status, 0, `${file}: JavaScript-Modulsyntax\n${result.stderr || result.error || ''}`);
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*)['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;
    const importPath = fileURLToPath(new URL(specifier, `file://${file}`));
    assert.ok((await stat(importPath)).isFile(), `${file}: relative Moduldatei ${specifier}`);
  }
}
const sourceText = (await Promise.all(sourceFiles.filter(file => /\.(?:js|mjs|css)$/.test(file)).map(file => readFile(file, 'utf8')))).join('\n');
const index = await read('index.html');
assert.match(index, /<html\s+lang="de"/, 'Deutsche Dokumentensprache');
assert.match(index, /<script\s+type="module"\s+src="\/src\/app\.js"/, 'Eigenständige App als Modul eingebunden');
assert.ok(!sourceText.includes('555-555-5555'), 'Keine Platzhaltertelefonnummer');
assert.ok(!/architektur\.webp|images\.unsplash\.com|\/mock-logos\/|dashboardmock\.png/i.test(sourceText + index), 'Keine fremden SaaS- oder Ersatzassets');
assert.ok(!/\bhref\s*=\s*['"]\s*#\s*['"]/i.test(sourceText + index), 'Kein href="#"-Platzhalter für echte Aktionen');
assert.ok(!/\bhref\s*=\s*['"]\s*javascript:/i.test(sourceText + index), 'Keine JavaScript-Pseudolinks');
// Static anchors are checked against declared IDs. Actual rendered links,
// mobile navigation, filtering and mailto composition are checked in the browser.
const ids = new Set([...`${index}\n${sourceText}`.matchAll(/\bid\s*=\s*['"]([^'"$<>]+)['"]/g)].map(match => match[1]));
const hashAnchors = [...`${index}\n${sourceText}`.matchAll(/\bhref\s*=\s*['"]#([^'"$<>\s]+)['"]/g)].map(match => match[1]);
for (const id of hashAnchors) assert.ok(ids.has(id), `Statischer Sprunglink #${id} hat ein deklariertes Ziel`);
for (const required of [
  /Privatkredit/i, /Umschuldung/i, /Krankheit/i, /Berufsunfähigkeit/i, /Pflege/i,
  /Todesfall/i, /Altersvorsorge/i, /Rentenlücken/i, /IHK/i, /2001/,
  /Göppingen/, /Profilerstellung|persönliche[srn]? Profil|Suchprofil/i,
  /info@basalic\.de/, /immobilien@basalic\.de/, /finanzierung@basalic\.de/,
  /491786654819/, /Dürnau/, /Heiningen/
]) assert.match(sourceText, required, `Originalinhalt im Quellcode erhalten: ${required}`);

const routes = [
  '/', '/immobilien', '/mietverwaltung', '/finanzierung', '/vorsorge', '/ueber-uns',
  '/kontakt', '/impressum', '/datenschutz', '/erstinformationen', '/barrierefreiheit',
  '/bildnachweise', ...properties.map(p => `/immobilien/${p.id}`)
];
assert.equal(routes.length, 61);
assert.equal(new Set(routes).size, 61);
const base = (process.env.PREVIEW_URL || 'http://127.0.0.1:5104').replace(/\/$/, '');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname), 'Lokale Vorschau prüfen');
async function request(path) {
  try { return await fetch(new URL(path, `${base}/`), { signal: AbortSignal.timeout(5000) }); }
  catch (error) { throw new Error(`Lokale Vorschau ${base} nicht erreichbar. Vorher npm run build und npm run preview starten.`, { cause: error }); }
}
const entryAssets = new Set();
for (const route of routes) {
  const response = await request(route);
  assert.equal(response.status, 200, `HTTP ${route}`);
  assert.match(response.headers.get('content-type'), /text\/html/, `${route}: HTML`);
  const html = await response.text();
  const dom = load(html);
  assert.equal(dom('#app').length, 1, `${route}: App-Einstieg ausgeliefert`);
  dom('script[type="module"][src],link[rel="stylesheet"][href]').each((_i, element) => {
    const target = dom(element).attr('src') || dom(element).attr('href');
    assert.ok(target.startsWith('/'), `${route}: lokal ausgeliefertes Modul/Stylesheet`);
    entryAssets.add(target);
  });
}
assert.ok(entryAssets.size > 0, 'Anwendungsmodule tatsächlich referenziert');
for (const path of entryAssets) {
  const response = await request(path);
  assert.equal(response.status, 200, `HTTP Modul/Stylesheet ${path}`);
  assert.match(response.headers.get('content-type'), /javascript|text\/css/, `${path}: kein HTML-Fallback statt Asset`);
}
for (const asset of manifest.assets) {
  const response = await request(`/assets/${asset.file}`);
  assert.equal(response.status, 200, `HTTP ${asset.file}`);
  assert.match(response.headers.get('content-type'), /image\/webp/, `${asset.file}: korrekter MIME-Typ`);
}
console.log(`OK: 49 Objekte (7 Angebote + 2 Auslandsinfos + 40 verkauft), 54 Originalbilder, 61 HTTP-Routen, ${modules.length} JavaScript-Module, ${hashAnchors.length} statische Sprunglinks und keine Platzhalterlinks.`);
console.log('Prüfgrenze: HTTP bestätigt die SPA-Auslieferung. Gerenderte Inhalte, dynamische Ziele, Tastatur, Filter, Animationen und Kontaktaktionen benötigen den separaten Browserbericht.');
