import { properties as seed } from './data.js';
import { clearDemoPhotos, isPropertyMediaPath, registerDemoPhoto } from './media.js';
import { siteBase } from './site-paths.js';

const databaseName = `basalic-admin-demo:${siteBase}`;
const stores = ['properties', 'photos'];
const seedById = new Map(seed.map(property => [property.id, property]));
const publicStatuses = new Set(['offer', 'sold', 'information']);
const propertyTypes = new Set(['Haus', 'Wohnung', 'Grundstück']);
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const fields = {
  title: ['Titel', 140], city: ['Ort', 100], type: ['Objektart', 40], kind: ['Bezeichnung', 120],
  note: ['Beschreibung', 6000], area: ['Fläche', 40], areaLabel: ['Flächenart', 50], land: ['Grundstücksfläche', 40],
  rooms: ['Zimmer', 40], year: ['Baujahr', 40], listingUrl: ['Exposé-Link', 2048], price: ['Kaufpreis', 100],
  commission: ['Käuferprovision', 240], heating: ['Heizung', 120], energyCertificate: ['Energieausweis', 900],
  energyYear: ['Baujahr laut Energieausweis', 40],
};
let databasePromise;

class DemoError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function storageError(error) {
  if (error instanceof DemoError) return error;
  if (error?.name === 'QuotaExceededError') return new DemoError(507, 'Der Browserspeicher ist voll. Setzen Sie die Demo zurück oder verwenden Sie kleinere Fotos.');
  return new DemoError(503, 'Der Browserspeicher für die Demo ist gerade nicht verfügbar. Bitte versuchen Sie es erneut.');
}

function openDatabase() {
  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('properties', { keyPath: 'id' });
      request.result.createObjectStore('photos', { keyPath: 'path' });
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        databasePromise = undefined;
      };
      resolve(database);
    };
  }).catch(error => {
    databasePromise = undefined;
    throw error;
  });
  return databasePromise;
}

function resultOf(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function inStore(mode, use) {
  try {
    const transaction = (await openDatabase()).transaction(stores, mode);
    const done = new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onabort = () => reject(transaction.error);
    });
    done.catch(() => {});
    try {
      const value = await use(transaction.objectStore('properties'), transaction.objectStore('photos'));
      await done;
      return value;
    } catch (error) {
      try { transaction.abort(); } catch { /* The transaction has already finished. */ }
      await done.catch(() => {});
      throw error;
    }
  } catch (error) {
    throw storageError(error);
  }
}

function changeStatus(property, status) {
  if (status !== 'draft' && !publicStatuses.has(status)) throw new DemoError(400, 'Der gewählte Status ist ungültig.');
  if (publicStatuses.has(status) && (!property.title || !property.city || !propertyTypes.has(property.type) || !property.kind)) {
    throw new DemoError(400, 'Bitte ergänzen Sie Titel, Ort, Objektart und Bezeichnung vor der Veröffentlichung.');
  }
  const now = new Date().toISOString();
  const updated = { ...property, status, updatedAt: now };
  if (property.status !== status && status === 'offer') updated.publishedAt = now;
  if (property.status !== status && status === 'sold') updated.soldAt = now;
  return updated;
}

function forWebsite(property) {
  if (property.status !== 'sold') return property;
  const { price, commission, energyCertificate, energyYear, ...reference } = property;
  if (reference.soldAt) {
    delete reference.listingUrl;
    delete reference.expose;
  }
  return reference;
}

function slugFor(property) {
  const label = [property.city, property.kind].filter(Boolean).join(' ');
  return label.toLowerCase().replaceAll('ß', 'ss').normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '') || 'immobilie';
}

async function normalize(input, previous, photos) {
  const property = { ...previous };
  for (const [key, [label, limit]] of Object.entries(fields)) {
    if (!Object.hasOwn(input, key)) continue;
    const value = input[key];
    if (typeof value !== 'string' || value.length > limit || value.includes('\0')) {
      throw new DemoError(400, `„${label}“ darf höchstens ${limit} Zeichen enthalten.`);
    }
    property[key] = value.trim();
  }
  if (property.type && !propertyTypes.has(property.type)) throw new DemoError(400, 'Bitte wählen Sie eine gültige Objektart.');
  if (property.listingUrl) {
    try {
      const url = new URL(property.listingUrl);
      if (url.protocol !== 'https:' || url.username || url.password || /[\x00-\x20\x7f]/.test(property.listingUrl)) throw new Error();
    } catch {
      throw new DemoError(400, 'Bitte geben Sie einen vollständigen Exposé-Link mit https:// ein.');
    }
  }
  if (Object.hasOwn(input, 'listingUrl') && !property.listingUrl) delete property.expose;

  if (Object.hasOwn(input, 'features')) {
    if (!Array.isArray(input.features) || input.features.length > 20 || input.features.some(value => typeof value !== 'string' || value.length > 200 || value.includes('\0'))) {
      throw new DemoError(400, 'Bitte geben Sie höchstens 20 Merkmale mit je 200 Zeichen ein.');
    }
    property.features = input.features.map(value => value.trim()).filter(Boolean);
  }
  property.features ??= [];

  if (Object.hasOwn(input, 'photos')) {
    if (!Array.isArray(input.photos) || input.photos.length > 8) throw new DemoError(400, 'Pro Immobilie sind höchstens acht Fotos möglich.');
    const paths = [...new Set(input.photos)];
    if (!paths.every(path => typeof path === 'string' && isPropertyMediaPath(path))) {
      throw new DemoError(400, 'Bitte laden Sie die Objektfotos im Portal hoch.');
    }
    const keys = await Promise.all(paths.map(path => resultOf(photos.getKey(path))));
    if (keys.some(key => key === undefined)) throw new DemoError(400, 'Ein Objektfoto fehlt. Bitte laden Sie es erneut hoch.');
    property.photos = paths;
    property.image = paths[0] || seedById.get(property.id)?.image;
    property.imageRole = paths.length ? undefined : seedById.get(property.id)?.imageRole;
  }
  return property;
}

async function readProperties(admin) {
  const { properties, photoRecords } = await inStore('readonly', async (edits, photos) => {
    const all = new Map(seed.map(property => [property.id, structuredClone(property)]));
    for (const property of await resultOf(edits.getAll())) all.set(property.id, property);
    const date = item => admin ? item.updatedAt : item.status === 'sold' ? item.soldAt : item.publishedAt;
    const properties = [...all.values()].filter(property => admin || publicStatuses.has(property.status))
      .sort((a, b) => (date(b) || '').localeCompare(date(a) || ''));
    const paths = new Set(properties.flatMap(property => property.photos || []).filter(isPropertyMediaPath));
    const photoRecords = await Promise.all([...paths].map(path => resultOf(photos.get(path))));
    return { properties, photoRecords };
  });
  photoRecords.filter(Boolean).forEach(registerDemoPhoto);
  return admin ? properties : properties.map(forWebsite);
}

async function saveProperty(input, id, statusOnly = false) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new DemoError(400, 'Die Eingabe konnte nicht gelesen werden.');
  return inStore('readwrite', async (edits, photos) => {
    const previous = id ? (await resultOf(edits.get(id))) || seedById.get(id) : {};
    if (!previous) throw new DemoError(404, 'Diese Immobilie wurde nicht gefunden.');
    let property = statusOnly ? previous : await normalize(input, previous, photos);
    if (!id) {
      const usedIds = new Set([...seedById.keys(), ...await resultOf(edits.getAllKeys())]);
      const slug = slugFor(property);
      id = slug;
      for (let index = 2; usedIds.has(id); index++) id = `${slug}-${index}`;
    }
    const status = statusOnly ? input.status : input.status ?? previous.status ?? 'draft';
    property = changeStatus({ ...property, id }, status);
    await resultOf(edits.put(property));
    return property;
  });
}

function fileType(bytes) {
  const signature = (...values) => values.every((value, index) => bytes[index] === value);
  if (signature(0xff, 0xd8, 0xff)) return 'image/jpeg';
  if (signature(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'image/png';
  if (String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') return 'image/webp';
  return '';
}

async function preparePhoto(file) {
  if (!(file instanceof Blob) || !imageTypes.has(file.type)) throw new DemoError(415, 'Bitte wählen Sie ein Foto im JPG-, PNG- oder WebP-Format.');
  if (file.size > 12 * 1024 * 1024) throw new DemoError(413, 'Das Foto darf höchstens 12 MB groß sein.');
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (fileType(header) !== file.type) throw new DemoError(415, 'Die Datei entspricht keinem gültigen JPG-, PNG- oder WebP-Foto.');

  const src = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = src;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error();
    const scale = Math.min(1, 1920 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    const width = canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.86));
    if (!blob) throw new Error();
    return { path: `/property-media/${crypto.randomUUID()}.webp`, blob, width, height };
  } catch {
    throw new DemoError(400, 'Das Foto konnte nicht gelesen werden oder überschreitet 40 Megapixel.');
  } finally {
    URL.revokeObjectURL(src);
  }
}

export function loadDemoProperties() {
  return readProperties(false);
}

export async function resetDemo() {
  await inStore('readwrite', (edits, photos) => Promise.all([resultOf(edits.clear()), resultOf(photos.clear())]));
  clearDemoPhotos();
}

export async function demoRequest(path, { method = 'GET', data, file } = {}) {
  if (path === '/session' && method === 'GET') return { authenticated: true, configured: true };
  if (path === '/properties' && method === 'GET') return { properties: await readProperties(true) };
  if (path === '/properties' && method === 'POST') return { property: await saveProperty(data) };
  const id = /^\/properties\/([a-z0-9-]{1,100})$/.exec(path)?.[1];
  if (id && (method === 'PUT' || method === 'PATCH')) return { property: await saveProperty(data, id, method === 'PATCH') };
  if (path === '/uploads' && method === 'POST') {
    const photo = await preparePhoto(file);
    await inStore('readwrite', (_, photos) => resultOf(photos.add(photo)));
    registerDemoPhoto(photo);
    return { url: photo.path };
  }
  throw new DemoError(404, 'Diese Anfrage wurde nicht gefunden.');
}
