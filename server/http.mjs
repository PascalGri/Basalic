import sharp from 'sharp';
import { createAuth } from './auth.mjs';
import { createPropertyStore, RequestError } from './properties.mjs';

const maxUpload = 12 * 1024 * 1024;
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function privateHeaders(response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('X-Content-Type-Options', 'nosniff');
}

export function sendJson(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(JSON.stringify(value));
}

export function requestPath(request) {
  try {
    const path = decodeURIComponent(request.url.split('?')[0]);
    if (path.startsWith('/') && !path.startsWith('//') && !/[\\\x00-\x1f\x7f]/.test(path)) return path;
  } catch {
    // Malformed request targets never reach a static or API handler.
  }
  return '';
}

function contentType(request) {
  return (request.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
}

async function readBody(request, limit) {
  const oversized = () => new RequestError(413, limit === maxUpload ? 'Das Foto darf höchstens 12 MB groß sein.' : 'Die Eingabe ist zu groß.');
  if (Number(request.headers['content-length']) > limit) throw oversized();
  const chunks = [];
  let size = 0;
  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    size += chunk.length;
    if (size > limit) throw oversized();
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, size);
}

async function readJson(request, limit = 32 * 1024) {
  if (contentType(request) !== 'application/json') throw new RequestError(415, 'Diese Eingabe muss als JSON gesendet werden.');
  const body = await readBody(request, limit);
  try {
    const data = JSON.parse(body.toString('utf8'));
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Expected an object');
    return data;
  } catch {
    throw new RequestError(400, 'Die Eingabe konnte nicht gelesen werden.');
  }
}

function detectedImageType(input) {
  if (input.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return 'image/jpeg';
  if (input.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (input.toString('ascii', 0, 4) === 'RIFF' && input.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return '';
}

function wrongMethod(response, methods) {
  response.setHeader('Allow', methods.join(', '));
  throw new RequestError(405, 'Diese Anfrage ist hier nicht möglich.');
}

export function createSiteApi(config) {
  const auth = createAuth(config);
  const store = createPropertyStore(config.dataDir);
  let uploadsInFlight = 0;

  async function upload(request) {
    const type = contentType(request);
    if (!imageTypes.has(type)) throw new RequestError(415, 'Bitte wählen Sie ein Foto im JPG-, PNG- oder WebP-Format.');
    if (uploadsInFlight >= 2) throw new RequestError(429, 'Bitte warten Sie, bis die laufenden Uploads abgeschlossen sind.');
    uploadsInFlight++;
    try {
      const input = await readBody(request, maxUpload);
      if (detectedImageType(input) !== type) throw new RequestError(415, 'Die Datei entspricht keinem gültigen JPG-, PNG- oder WebP-Foto.');
      let contents;
      try {
        contents = await sharp(input, { limitInputPixels: 40_000_000, failOn: 'error' })
          .rotate().resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 86 }).toBuffer();
      } catch {
        throw new RequestError(400, 'Das Foto konnte nicht gelesen werden oder überschreitet 40 Megapixel.');
      }
      return store.savePhoto(contents);
    } finally {
      uploadsInFlight--;
    }
  }

  async function handle(request, response, path) {
    const { method } = request;
    if (path === '/api/properties') {
      if (method !== 'GET') return wrongMethod(response, ['GET']);
      return sendJson(response, 200, { properties: await store.list() });
    }
    if (path === '/property-media' || path.startsWith('/property-media/')) {
      privateHeaders(response);
      if (method !== 'GET' && method !== 'HEAD') return wrongMethod(response, ['GET', 'HEAD']);
      const photo = await store.readPhoto(path, auth.hasSession(request));
      if (!photo) throw new RequestError(404, 'Dieses Foto wurde nicht gefunden.');
      response.writeHead(200, { 'Content-Type': 'image/webp', 'Content-Length': photo.length });
      return response.end(method === 'HEAD' ? undefined : photo);
    }
    if (!path.startsWith('/api/admin/')) throw new RequestError(404, 'Diese Anfrage wurde nicht gefunden.');

    privateHeaders(response);
    if (method !== 'GET' && !auth.sameOrigin(request)) throw new RequestError(403, 'Bitte öffnen Sie den Verwaltungsbereich direkt auf dieser Website.');

    if (path === '/api/admin/session') {
      if (method === 'GET') return sendJson(response, 200, { authenticated: auth.hasSession(request), configured: auth.configured });
      if (method === 'POST') {
        const { password } = await readJson(request, 4096);
        const result = await auth.login(request, password);
        if (result.retryAfter) response.setHeader('Retry-After', result.retryAfter);
        if (result.error) throw new RequestError(result.status, result.error);
        response.setHeader('Set-Cookie', result.cookie);
        return sendJson(response, 200, { authenticated: true, configured: true });
      }
      if (method === 'DELETE') {
        response.writeHead(204, { 'Set-Cookie': auth.logout(request) });
        return response.end();
      }
      return wrongMethod(response, ['GET', 'POST', 'DELETE']);
    }

    if (!auth.hasSession(request)) throw new RequestError(401, 'Bitte melden Sie sich an.');
    if (path === '/api/admin/properties') {
      if (method === 'GET') return sendJson(response, 200, { properties: await store.list({ admin: true }) });
      if (method === 'POST') return sendJson(response, 201, { property: await store.create(await readJson(request)) });
      return wrongMethod(response, ['GET', 'POST']);
    }

    const id = /^\/api\/admin\/properties\/([a-z0-9-]{1,100})$/.exec(path)?.[1];
    if (id) {
      if (method !== 'PUT' && method !== 'PATCH') return wrongMethod(response, ['PUT', 'PATCH']);
      return sendJson(response, 200, { property: await store.update(id, await readJson(request), method === 'PATCH') });
    }

    if (path === '/api/admin/uploads') {
      if (method !== 'POST') return wrongMethod(response, ['POST']);
      return sendJson(response, 201, { url: await upload(request) });
    }
    throw new RequestError(404, 'Diese Anfrage wurde nicht gefunden.');
  }

  function middleware(request, response, next) {
    const pathname = requestPath(request);
    if (!pathname) return sendJson(response, 400, { error: 'Ungültige Adresse' });
    if (/^\/admin(?:\/|$)/.test(pathname)) privateHeaders(response);
    if (!/^\/(?:api|property-media)(?:\/|$)/.test(pathname)) return next();
    void handle(request, response, pathname).catch(error => {
      request.resume();
      if (response.destroyed) return;
      if (error instanceof RequestError) return sendJson(response, error.status, { error: error.message });
      console.error('Basalic-Anfrage fehlgeschlagen:', error);
      return sendJson(response, 500, { error: 'Das Speichern oder Laden ist gerade nicht möglich. Bitte versuchen Sie es erneut.' });
    });
  }

  return { middleware, store };
}
