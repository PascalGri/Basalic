import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { properties as seed } from '../src/data.js';

const publicStatuses = new Set(['offer', 'sold', 'information']);
const types = new Set(['Haus', 'Wohnung', 'Grundstück']);
const legacyById = new Map(seed.map(property => [property.id, property]));
const fields = {
  title: ['Titel', 140], city: ['Ort', 100], type: ['Objektart', 40], kind: ['Bezeichnung', 120],
  note: ['Beschreibung', 6000], area: ['Fläche', 40], areaLabel: ['Flächenart', 50], land: ['Grundstücksfläche', 40],
  rooms: ['Zimmer', 40], year: ['Baujahr', 40], listingUrl: ['Exposé-Link', 2048], price: ['Kaufpreis', 100],
  commission: ['Käuferprovision', 240], heating: ['Heizung', 120], energyCertificate: ['Energieausweis', 900],
  energyYear: ['Baujahr laut Energieausweis', 40],
};

export const photoPathPattern = /^\/property-media\/([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.webp)$/;

export class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function validateStatus(status) {
  if (status !== 'draft' && !publicStatuses.has(status)) throw new RequestError(400, 'Der gewählte Status ist ungültig.');
  return status;
}

function validatePublish(property) {
  if (publicStatuses.has(property.status) && (!property.title || !property.city || !types.has(property.type) || !property.kind)) {
    throw new RequestError(400, 'Bitte ergänzen Sie Titel, Ort, Objektart und Bezeichnung vor der Veröffentlichung.');
  }
}

function forWebsite(property) {
  if (property.status !== 'sold') return property;
  const { price, commission, energyCertificate, energyYear, ...reference } = property;
  // Newly sold listings retain their original link in the editor only.
  if (reference.soldAt) {
    delete reference.listingUrl;
    delete reference.expose;
  }
  return reference;
}

function validateListingUrl(value) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password && !/[\x00-\x20\x7f]/.test(value)) return;
  } catch {
    // Use the same error for malformed or unsafe links.
  }
  throw new RequestError(400, 'Bitte geben Sie einen vollständigen Exposé-Link mit https:// ein.');
}

function changeStatus(property, status) {
  const updatedAt = new Date().toISOString();
  const updated = { ...property, status: validateStatus(status), updatedAt };
  if (property.status !== status && status === 'offer') updated.publishedAt = updatedAt;
  if (property.status !== status && status === 'sold') updated.soldAt = updatedAt;
  validatePublish(updated);
  return updated;
}

function slugFor(property) {
  return `${property.city || 'immobilie'}${property.kind ? `-${property.kind}` : ''}`
    .toLowerCase().replaceAll('ß', 'ss').normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70).replace(/-$/, '') || 'immobilie';
}

async function writeAtomic(path, contents) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temp = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temp, contents, { flag: 'wx', mode: 0o600, flush: true });
    await rename(temp, path);
  } finally {
    await rm(temp, { force: true });
  }
}

export function createPropertyStore(dataDir) {
  const database = join(dataDir, 'properties.json');
  const photoDir = join(dataDir, 'photos');
  let pending = Promise.resolve();

  async function readEdits() {
    try {
      const saved = JSON.parse(await readFile(database, 'utf8'));
      if (!Array.isArray(saved) || saved.some(property => !property || typeof property.id !== 'string' || typeof property.status !== 'string')) {
        throw new Error('Ungültiger Immobilienbestand.');
      }
      return saved;
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  function merge(edits) {
    const all = new Map(legacyById);
    for (const property of edits) all.set(property.id, property);
    return all;
  }

  function save(mutate) {
    const result = pending.then(async () => {
      const edits = await readEdits();
      const property = await mutate(merge(edits));
      await writeAtomic(database, `${JSON.stringify([...edits.filter(item => item.id !== property.id), property], null, 2)}\n`);
      return property;
    });
    pending = result.catch(() => {});
    return result;
  }

  async function normalize(input, previous, id) {
    const property = { ...previous, id };
    for (const [key, [label, limit]] of Object.entries(fields)) {
      if (!(key in input)) continue;
      if (typeof input[key] !== 'string' || input[key].length > limit || input[key].includes('\0')) {
        throw new RequestError(400, `„${label}“ darf höchstens ${limit} Zeichen enthalten.`);
      }
      property[key] = input[key].trim();
    }
    if (property.type && !types.has(property.type)) throw new RequestError(400, 'Bitte wählen Sie eine gültige Objektart.');
    validateListingUrl(property.listingUrl);
    if ('listingUrl' in input && !property.listingUrl) delete property.expose;

    if ('features' in input) {
      if (!Array.isArray(input.features) || input.features.length > 20 || input.features.some(value => typeof value !== 'string' || value.length > 200 || value.includes('\0'))) {
        throw new RequestError(400, 'Bitte geben Sie höchstens 20 Merkmale mit je 200 Zeichen ein.');
      }
      property.features = input.features.map(value => value.trim()).filter(Boolean);
    }
    property.features ??= [];

    if ('photos' in input) {
      if (!Array.isArray(input.photos) || input.photos.length > 8) throw new RequestError(400, 'Pro Immobilie sind höchstens acht Fotos möglich.');
      const photos = [...new Set(input.photos)];
      for (const url of photos) {
        const filename = typeof url === 'string' && photoPathPattern.exec(url)?.[1];
        if (!filename) throw new RequestError(400, 'Bitte laden Sie die Objektfotos im Portal hoch.');
        try {
          if (!(await stat(join(photoDir, filename))).isFile()) throw new RequestError(400, 'Ein Objektfoto fehlt. Bitte laden Sie es erneut hoch.');
        } catch (error) {
          if (error.code === 'ENOENT') throw new RequestError(400, 'Ein Objektfoto fehlt. Bitte laden Sie es erneut hoch.');
          throw error;
        }
      }
      property.photos = photos;
      property.image = photos[0] || legacyById.get(id)?.image;
      property.imageRole = photos.length ? undefined : legacyById.get(id)?.imageRole;
    }
    return property;
  }

  async function list({ admin = false } = {}) {
    const properties = [...merge(await readEdits()).values()];
    const date = item => admin ? item.updatedAt : item.status === 'sold' ? item.soldAt : item.publishedAt;
    const visible = properties.filter(property => admin || publicStatuses.has(property.status))
      .sort((a, b) => (date(b) || '').localeCompare(date(a) || ''));
    return admin ? visible : visible.map(forWebsite);
  }

  function create(input) {
    return save(async all => {
      const property = await normalize(input, {}, undefined);
      const slug = slugFor(property);
      let id = slug;
      for (let index = 2; all.has(id); index++) id = `${slug}-${index}`;
      return changeStatus({ ...property, id }, input.status ?? 'draft');
    });
  }

  function update(id, input, statusOnly = false) {
    return save(async all => {
      const previous = all.get(id);
      if (!previous) throw new RequestError(404, 'Diese Immobilie wurde nicht gefunden.');
      const property = statusOnly ? previous : await normalize(input, previous, id);
      return changeStatus(property, statusOnly ? input.status : input.status ?? previous.status);
    });
  }

  async function getPublic(id) {
    const property = merge(await readEdits()).get(id);
    return publicStatuses.has(property?.status) ? forWebsite(property) : null;
  }

  async function savePhoto(contents) {
    const filename = `${randomUUID()}.webp`;
    await writeAtomic(join(photoDir, filename), contents);
    return `/property-media/${filename}`;
  }

  async function readPhoto(path, admin) {
    const filename = photoPathPattern.exec(path)?.[1];
    if (!filename) return null;
    if (!admin && !(await list()).some(property => property.photos?.includes(path))) return null;
    try {
      return await readFile(join(photoDir, filename));
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  return { list, create, update, getPublic, savePhoto, readPhoto };
}
