// Local regression checks. This script does not control a browser, send a
// message, call the original website, or publish anything.
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import sharp from 'sharp';
import { properties, services, sourceDate } from '../src/data.js';
import { getLegalContent } from '../src/legal-content.js';
import { propertyGalleries } from '../src/property-galleries.js';
import { mediaManifest } from '../src/media-manifest.js';
import { routeMetadata, seoConfig } from '../src/seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFile(join(root, path), 'utf8');
const manifest = JSON.parse(await read('public/assets/manifest.json'));
const assetByFile = new Map(manifest.assets.map(asset => [asset.file, asset]));
const propertyById = new Map(properties.map(property => [property.id, property]));
const galleryProvenance = JSON.parse(await read('docs/PROPERTY_GALLERY_SOURCES.json'));
const galleryAssetByFile = new Map(galleryProvenance.assets.map(asset => [asset.file, asset]));
const listingEvidence = [...galleryProvenance.assets, ...galleryProvenance.listingEvidence];
const serviceImages = ['finanzierung', 'mietverwaltung', 'absicherung', 'altersvorsorge'].map(name => `/assets/services/${name}.webp`);
const additionalImages = new Set(serviceImages);

async function checkWebp(path, label) {
  const file = await readFile(path);
  assert.ok(file.length > 0, `${label}: vorhandene Datei`);
  // Decode the pixel data, so a valid header with a truncated image cannot pass.
  const { info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  const metadata = await sharp(file).metadata();
  assert.equal(metadata.format, 'webp', `${label}: WebP`);
  assert.ok(info.width > 0 && info.height > 0, `${label}: dekodierbares Bild`);
  return { file, width: info.width, height: info.height };
}

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
assert.ok(!propertyById.get('istrien').area, 'Steinhausfläche nicht als belegte Wohnfläche ausgeben');
assert.ok(!propertyById.get('referenz-tamm').rooms, 'Widersprüchliche Tamm-Zimmerzahl nicht erfinden');
assert.match(propertyById.get('referenz-gartenwohnung-88').city, /nicht genannt/, 'Keinen fehlenden Ort ergänzen');
for (const [id, expose] of Object.entries({ faurndau: '171049343', muehlhausen: '169662545', neidlingen: '169930109' })) {
  assert.equal(propertyById.get(id).expose, expose, `${id}: Exposé-Zuordnung`);
}
for (const p of properties) {
  assert.match(p.id, /^[a-z0-9-]+$/, `${p.id}: sichere Objekt-URL`);
  assert.match(p.sourceRow, /^\d+$/, `${p.id}: belegte Originalzeile`);
  assert.ok(['Haus', 'Wohnung', 'Grundstück'].includes(p.type), `${p.id}: Objektart für Filter`);
  assert.ok(p.city && p.kind && p.title && Array.isArray(p.features), `${p.id}: vollständiger Datensatz`);
  assert.doesNotMatch([p.city, p.note, p.areaLabel, p.imageRole, ...p.features].filter(Boolean).join(' '), /\b(?:Quellseite|Quellwebsite|Quelle)\b|bisherige Website/i, `${p.id}: kundenorientierter Besuchertext`);
  if (p.listingUrl) {
    assert.match(p.listingUrl, /^https:\/\/www\.immobilienscout24\.de\/expose\/\d{8,10}$/, `${p.id}: sichere öffentliche ImmoScout-Exposé-Adresse`);
    const evidence = listingEvidence.filter(entry => entry.propertyId === p.id && entry.source === p.listingUrl);
    assert.ok(evidence.length > 0, `${p.id}: Folgeinserat ist lokal für genau dieses Objekt belegt`);
    assert.ok(evidence.every(entry => entry.originalExpose === `https://www.immobilienscout24.de/expose/${p.expose}` && entry.identityEvidence?.trim()), `${p.id}: ursprüngliches Exposé und Objektidentität bleiben nachvollziehbar`);
  }
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
  const decoded = await checkWebp(path, asset.file);
  if (asset.pixelWidth) assert.equal(decoded.width, asset.pixelWidth, `${asset.file}: dokumentierte Breite`);
  if (asset.pixelHeight) assert.equal(decoded.height, asset.pixelHeight, `${asset.file}: dokumentierte Höhe`);
}
// These checks describe retained source evidence, not the newly generated service images.
assert.match(assetByFile.get('hero-original.webp').original, /\/10562\.jpeg$/, 'Archivierter Herkunftsnachweis des Startseitenmotivs');
assert.match(assetByFile.get('finanzierung.webp').original, /\/113667\.jpeg$/, 'Archivierter Herkunftsnachweis des früheren Finanzierungsmotivs');
for (const url of serviceImages) {
  assert.match(url, /^\/assets\/services\/[a-z-]+\.webp$/, 'Leistungsmotiv mit lokalem Asset-Pfad');
  await checkWebp(join(root, 'public', url.slice(1)), url);
}
assert.equal(galleryAssetByFile.size, galleryProvenance.assets.length, 'Zusatzfotos besitzen eindeutige Herkunftsdateien');
const usedGalleryFiles = new Set();
for (const [propertyId, photos] of Object.entries(propertyGalleries)) {
  const property = propertyById.get(propertyId);
  assert.ok(property && property.status === 'offer', `${propertyId}: Galerie ist einem Verkaufsangebot zugeordnet`);
  assert.ok(Array.isArray(photos), `${propertyId}: Fotoliste`);
  for (const photo of photos) {
    assert.match(photo.src, /^\/assets\/property-gallery\/[a-z0-9-]+\.webp$/, `${propertyId}: lokaler sicherer Bildpfad`);
    assert.ok(photo.alt && photo.alt.trim().length > 10, `${photo.src}: aussagekräftige Bildbeschreibung`);
    assert.ok(!additionalImages.has(photo.src), `${photo.src}: Bild ist nur einem Objekt zugeordnet`);
    additionalImages.add(photo.src);
    const filename = photo.src.split('/').at(-1);
    const provenance = galleryAssetByFile.get(filename);
    assert.ok(provenance, `${photo.src}: Herkunftsnachweis vorhanden`);
    assert.equal(provenance.propertyId, propertyId, `${filename}: Herkunft zum richtigen Objekt`);
    assert.equal(provenance.originalExpose, `https://www.immobilienscout24.de/expose/${property.expose}`, `${filename}: belegtes ursprüngliches Exposé`);
    assert.equal(new URL(provenance.source).hostname, 'www.immobilienscout24.de', `${filename}: Exposé als Herkunft`);
    assert.equal(new URL(provenance.original).hostname, 'pictures.immobilienscout24.de', `${filename}: originale Bildquelle`);
    assert.ok(provenance.identityEvidence && provenance.identityEvidence.length > 20, `${filename}: dokumentierte Objektidentität`);
    const decoded = await checkWebp(join(root, 'public', photo.src.slice(1)), photo.src);
    assert.equal(decoded.width, provenance.width, `${filename}: dokumentierte Breite`);
    assert.equal(decoded.height, provenance.height, `${filename}: dokumentierte Höhe`);
    assert.equal(decoded.file.length, provenance.bytes, `${filename}: dokumentierte Dateigröße`);
    assert.equal(createHash('sha256').update(decoded.file).digest('hex'), provenance.sha256, `${filename}: unverändertes belegtes Bild`);
    usedGalleryFiles.add(filename);
  }
}
assert.deepEqual(usedGalleryFiles, new Set(galleryAssetByFile.keys()), 'Jedes dokumentierte Zusatzfoto wird im zugehörigen Angebot verwendet');
for (const [route, page] of Object.entries(getLegalContent(''))) {
  const text = load(`${page.intro} ${page.body}`).text();
  assert.doesNotMatch(text, /\b(?:Quellseite|Quellwebsite|Quelle|Vorschau)\b|bisherige Website/i, `${route}: kundenorientierter Besuchertext`);
}

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
  /491786654819/
]) assert.match(sourceText, required, `Originalinhalt im Quellcode erhalten: ${required}`);

// Open operator details are tracked internally instead of rendered as editorial prompts.
const legalPages = getLegalContent('');
for (const [path, { body }] of Object.entries(legalPages)) {
  assert.equal(load(body)('.legal-placeholder').length, 0, `${path}: keine redaktionellen Platzhalter`);
}

const routes = [
  '/', '/immobilien', '/immobilie-verkaufen', '/mietverwaltung', '/finanzierung', '/vorsorge', '/ueber-uns',
  '/kontakt', '/impressum', '/datenschutz', '/erstinformationen', '/barrierefreiheit',
  '/bildnachweise', ...properties.map(p => `/immobilien/${p.id}`)
];
assert.equal(routes.length, 62);
assert.equal(new Set(routes).size, 62);
const base = (process.env.PREVIEW_URL || 'http://127.0.0.1:5104').replace(/\/$/, '');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname), 'Lokale Vorschau prüfen');
async function request(path) {
  try { return await fetch(new URL(path, `${base}/`), { signal: AbortSignal.timeout(5000) }); }
  catch (error) { throw new Error(`Lokale Vorschau ${base} nicht erreichbar. Vorher npm run build und npm run preview starten.`, { cause: error }); }
}
const entryAssets = new Set();
const servedTitles = new Set();
assert.deepEqual(new Set(Object.keys(routeMetadata)), new Set(routes), 'SEO-Metadaten für alle veröffentlichten lokalen Routen');
for (const route of routes) {
  const response = await request(route);
  assert.equal(response.status, 200, `HTTP ${route}`);
  assert.match(response.headers.get('content-type'), /text\/html/, `${route}: HTML`);
  const html = await response.text();
  const dom = load(html);
  assert.equal(dom('#app').length, 1, `${route}: App-Einstieg ausgeliefert`);
  const metadata = routeMetadata[route];
  assert.equal(dom('title').text(), metadata.title, `${route}: individueller Titel bereits im ausgelieferten HTML`);
  assert.equal(dom('meta[name="description"]').attr('content'), metadata.description, `${route}: individuelle Suchbeschreibung`);
  assert.equal(dom('meta[property="og:title"]').attr('content'), metadata.title, `${route}: Titel für Teilenvorschau`);
  assert.equal(dom('meta[property="og:image"]').attr('content'), `${seoConfig.siteUrl}${metadata.image}`, `${route}: Open-Graph-Vorschaubild`);
  assert.equal(dom('meta[property="og:image:type"]').attr('content'), 'image/jpeg', `${route}: MIME-Typ der Teilenvorschau`);
  assert.equal(dom('meta[name="twitter:image"]').attr('content'), `${seoConfig.siteUrl}${metadata.image}`, `${route}: Twitter-Vorschaubild`);
  assert.equal(dom('meta[name="twitter:card"]').attr('content'), 'summary_large_image', `${route}: große Teilenvorschau`);
  assert.equal(dom('link[rel="icon"][type="image/png"][sizes="96x96"]').attr('href'), '/favicon.png', `${route}: PNG-Favicon für Browser und Suchmaschinen`);
  assert.equal(dom('link[rel="apple-touch-icon"][sizes="180x180"]').attr('href'), '/apple-touch-icon.png', `${route}: iPhone-Symbol`);
  assert.equal(dom('meta[name="robots"]').attr('content'), seoConfig.allowIndexing ? 'index,follow,max-image-preview:large' : 'noindex,nofollow,noarchive', `${route}: bewusste Indexierungseinstellung`);
  if (!seoConfig.siteUrl) assert.equal(dom('link[rel="canonical"]').length, 0, `${route}: keine erfundene Produktionsdomain`);
  assert.ok(!servedTitles.has(metadata.title), `${route}: eindeutiger Seitentitel`);
  servedTitles.add(metadata.title);
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
// Responsive derivatives must match their originals and stay within original dimensions.
const responsiveUrls = [];
for (const [name, image] of Object.entries(mediaManifest.images)) {
  const original = await readFile(join(root, 'public', image.src));
  assert.equal(createHash('sha256').update(original).digest('hex'), image.sourceSha256, `${name}: responsive Bilder zum aktuellen Original`);
  assert.ok(image.variants.length > 0, `${name}: Bildvarianten vorhanden`);
  let previousWidth = 0;
  for (const variant of image.variants) {
    assert.match(variant.src, /^\/assets\/responsive\/[a-z0-9/_-]+\.webp$/i, `${name}: lokaler Variantenpfad`);
    assert.ok(variant.width > previousWidth && variant.width <= image.width, `${name}: sortierte Varianten ohne Vergrößerung`);
    const actual = await sharp(join(root, 'public', variant.src)).metadata();
    assert.equal(actual.format, 'webp', `${variant.src}: WebP`);
    assert.equal(actual.width, variant.width, `${variant.src}: tatsächliche Breite`);
    assert.equal(actual.height, variant.height, `${variant.src}: tatsächliche Höhe`);
    assert.ok(Math.abs(variant.width / variant.height - image.width / image.height) < 0.02, `${variant.src}: unverzerrtes Seitenverhältnis`);
    responsiveUrls.push(variant.src);
    previousWidth = variant.width;
  }
}
const socialUrls = [...new Set(Object.values(routeMetadata).map(page => page.image))];
for (const url of socialUrls) {
  const image = await sharp(join(root, 'public', url)).metadata();
  assert.equal(image.format, 'jpeg', `${url}: Format der Teilenvorschau`);
  assert.equal(image.width, 1200, `${url}: Breite der Teilenvorschau`);
  assert.equal(image.height, 630, `${url}: Höhe der Teilenvorschau`);
}
const robots = await request('/robots.txt');
assert.match(await robots.text(), seoConfig.allowIndexing ? /Allow: \// : /Disallow: \//, 'Crawlerfreigabe entspricht Indexierungseinstellung');
const favicon = await request('/favicon.png');
assert.equal(favicon.status, 200, 'PNG-Favicon erreichbar');
assert.match(favicon.headers.get('content-type'), /^image\/png\b/, 'PNG-Favicon korrekt ausgeliefert');
const { width: faviconWidth, height: faviconHeight } = await sharp(Buffer.from(await favicon.arrayBuffer())).metadata();
assert.equal(faviconWidth, 96, 'PNG-Favicon 96 Pixel breit');
assert.equal(faviconHeight, 96, 'PNG-Favicon quadratisch');
const touchIcon = await request('/apple-touch-icon.png');
assert.equal(touchIcon.status, 200, 'iPhone-Symbol erreichbar');
assert.match(touchIcon.headers.get('content-type'), /^image\/png\b/, 'iPhone-Symbol korrekt ausgeliefert');
const { width: iconWidth, height: iconHeight } = await sharp(Buffer.from(await touchIcon.arrayBuffer())).metadata();
assert.equal(iconWidth, 180, 'iPhone-Symbol 180 Pixel breit');
assert.equal(iconHeight, 180, 'iPhone-Symbol quadratisch');

const imageUrls = [...manifest.assets.map(asset => `/assets/${asset.file}`), ...additionalImages, ...responsiveUrls, ...socialUrls];
for (const url of imageUrls) {
  const response = await request(url);
  assert.equal(response.status, 200, `HTTP ${url}`);
  const expectedType = url.endsWith('.jpg') ? 'image/jpeg' : 'image/webp';
  assert.ok(response.headers.get('content-type')?.startsWith(expectedType), `${url}: korrekter MIME-Typ statt HTML-Fallback`);
}
console.log(`OK: 49 Objekte (7 Angebote + 2 Auslandsinfos + 40 verkauft), 54 ursprüngliche Bilddateien, ${serviceImages.length} neue Leistungsmotive und ${usedGalleryFiles.size} belegte Zusatzfotos, ${routes.length} HTTP-Routen mit individuellen Metadaten, ${responsiveUrls.length} responsive Bildvarianten, ${socialUrls.length} Teilenvorschauen, ${modules.length} JavaScript-Module, ${hashAnchors.length} statische Sprunglinks und keine Platzhalterlinks.`);
console.log('Prüfgrenze: HTTP bestätigt die SPA-Auslieferung. Gerenderte Inhalte, dynamische Ziele, Tastatur, Filter, Animationen und Kontaktaktionen benötigen den separaten Browserbericht.');
