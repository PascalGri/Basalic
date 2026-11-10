import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Run after npm run build. Both the account and its inventory are temporary.
const root = fileURLToPath(new URL('../', import.meta.url));
const password = randomBytes(24).toString('base64url');
const passwordHash = spawnSync(process.execPath, ['scripts/admin-password.mjs'], {
  cwd: root,
  input: `${password}\n`,
  encoding: 'utf8',
});
assert.equal(passwordHash.status, 0, passwordHash.stderr);
const dataDir = await mkdtemp(join(tmpdir(), 'basalic-admin-check-'));

let server;
let origin;
let cookie;
let serverOutput = '';

async function startServer() {
  serverOutput = '';
  server = spawn(process.execPath, ['server/index.mjs'], {
    cwd: root,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: '0',
      BASALIC_DATA_DIR: dataDir,
      BASALIC_ADMIN_PASSWORD_HASH: passwordHash.stdout.trim(),
      BASALIC_SITE_ORIGIN: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', chunk => { serverOutput += chunk; });
  server.stderr.on('data', chunk => { serverOutput += chunk; });
  for (let attempt = 0; attempt < 50; attempt++) {
    if (server.exitCode !== null) break;
    const address = serverOutput.match(/Basalic läuft unter (http:\/\/127\.0\.0\.1:\d+)\s/);
    if (address) {
      origin = address[1];
      return;
    }
    await delay(100);
  }
  throw new Error(`Testserver konnte nicht gestartet werden. Bitte zuerst npm run build ausführen.\n${serverOutput}`);
}

async function stopServer() {
  if (!server || server.exitCode !== null || server.signalCode !== null) return;
  const closed = once(server, 'exit');
  server.kill();
  await closed;
}

async function request(path, { method = 'GET', auth = false, body, contentType, requestOrigin = origin, status = 200 } = {}) {
  const headers = {};
  if (auth) headers.Cookie = cookie;
  if (method !== 'GET') headers.Origin = requestOrigin;
  if (body !== undefined) headers['Content-Type'] = contentType || 'application/json';
  const response = await fetch(new URL(path, origin), {
    method,
    headers,
    body: body === undefined || contentType ? body : JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  });
  assert.equal(response.status, status, `${method} ${path} antwortete mit ${response.status}.`);
  return response;
}

async function json(path, options) {
  return (await request(path, options)).json();
}

async function publicProperties() {
  return (await json('/api/properties')).properties;
}

async function login() {
  const response = await request('/api/admin/session', { method: 'POST', body: { password } });
  const setCookie = response.headers.get('set-cookie');
  assert.match(setCookie, /(?:^|;\s*)HttpOnly(?:;|$)/i);
  assert.match(setCookie, /(?:^|;\s*)SameSite=(?:Strict|Lax)(?:;|$)/i);
  cookie = setCookie.split(';')[0];
  assert.equal((await response.json()).authenticated, true);
}

try {
  await startServer();
  const adminPage = await request('/admin');
  assert.match(adminPage.headers.get('content-type'), /text\/html/);
  assert.match(adminPage.headers.get('x-robots-tag'), /noindex/);
  const baseline = await publicProperties();
  const originalOffer = baseline.find(property => property.status === 'offer');
  assert.ok(originalOffer, 'Ein bestehendes Angebot ist vorhanden.');
  assert.equal((await json('/api/admin/session')).authenticated, false);
  await request('/api/admin/properties', { status: 401 });
  await request('/api/admin/session', { method: 'POST', body: { password: 'falsches-testpasswort' }, status: 401 });
  await login();

  const input = {
    title: 'Helles Testhaus am Park',
    city: 'Göppingen',
    type: 'Haus',
    kind: 'Einfamilienhaus',
    note: 'Eigenständiger Testdatensatz in einem temporären Verzeichnis.',
    features: ['Terrasse', 'Garten'],
    area: '110,5',
    rooms: '3,5',
    status: 'draft',
  };
  const adminPath = '/api/admin/properties';
  await request(adminPath, { method: 'POST', body: input, status: 401 });
  await request(adminPath, { method: 'POST', auth: true, body: input, requestOrigin: 'https://example.invalid', status: 403 });
  await request(adminPath, { method: 'POST', auth: true, body: { ...input, city: '', status: 'offer' }, status: 400 });

  const image = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#7f9922' } }).png().toBuffer();
  await request('/api/admin/uploads', {
    method: 'POST', auth: true, body: image, contentType: 'image/jpeg', status: 415,
  });
  const { url: photo } = await json('/api/admin/uploads', {
    method: 'POST', auth: true, body: image, contentType: 'image/png', status: 201,
  });
  assert.match(photo, /^\/property-media\/[^/]+\.webp$/);
  const { property: draft } = await json(adminPath, {
    method: 'POST', auth: true, body: { ...input, photos: [photo] }, status: 201,
  });
  const editPath = `${adminPath}/${draft.id}`;
  const detailPath = `/immobilien/${draft.id}`;
  assert.equal(draft.status, 'draft');
  assert.ok((await json(adminPath, { auth: true })).properties.some(property => property.id === draft.id));
  assert.ok(!(await publicProperties()).some(property => property.id === draft.id));
  await request(detailPath, { status: 404 });
  await request(editPath, { method: 'PATCH', body: { status: 'offer' }, status: 401 });
  const privatePhoto = await fetch(new URL(photo, origin), { signal: AbortSignal.timeout(5000) });
  assert.ok([401, 404].includes(privatePhoto.status), 'Das Entwurfsfoto ist ohne Anmeldung gesperrt.');

  const { property: published } = await json(editPath, { method: 'PATCH', auth: true, body: { status: 'offer' } });
  assert.equal(published.id, draft.id);
  const offer = (await publicProperties()).find(property => property.id === draft.id);
  assert.equal(offer?.status, 'offer');
  assert.equal(offer?.title, input.title);
  assert.deepEqual(offer?.photos, [photo]);
  assert.match((await request(photo)).headers.get('content-type'), /^image\/webp/);
  const offerPage = await request(detailPath);
  assert.match(offerPage.headers.get('content-type'), /text\/html/);
  assert.match(await offerPage.text(), /<title>Einfamilienhaus in Göppingen/);

  await json(editPath, { method: 'PUT', auth: true, body: { ...input, status: 'offer', photos: [photo], title: 'Testhaus mit Garten' } });
  assert.equal((await publicProperties()).find(property => property.id === draft.id)?.title, 'Testhaus mit Garten');
  for (const id of [draft.id, originalOffer.id]) {
    const { property } = await json(`${adminPath}/${id}`, { method: 'PATCH', auth: true, body: { status: 'sold' } });
    assert.equal(property.id, id);
    assert.equal(property.status, 'sold');
  }
  assert.match(await (await request(detailPath)).text(), /<title>Verkauft: Einfamilienhaus in Göppingen/);
  const loggedOut = await request('/api/admin/session', { method: 'DELETE', auth: true, status: 204 });
  assert.match(loggedOut.headers.get('set-cookie'), /Max-Age=0|Expires=/i);
  await request(adminPath, { auth: true, status: 401 });

  await stopServer();
  await startServer();
  const persisted = await publicProperties();
  assert.equal(persisted.length, baseline.length + 1);
  assert.equal(persisted.filter(property => property.status === 'offer').length, baseline.filter(property => property.status === 'offer').length - 1);
  assert.equal(persisted.filter(property => property.status === 'sold').length, baseline.filter(property => property.status === 'sold').length + 2);
  assert.equal(persisted.find(property => property.id === originalOffer.id)?.status, 'sold');
  assert.equal(persisted.find(property => property.id === draft.id)?.title, 'Testhaus mit Garten');
  assert.equal(persisted.find(property => property.id === draft.id)?.status, 'sold');
  assert.match((await request(photo)).headers.get('content-type'), /^image\/webp/);
  console.log('OK: Anmeldung, Zugriffsschutz, Entwurf, Fotoupload, Veröffentlichung, Bearbeitung, Verkauf und Neustart.');
} finally {
  await stopServer();
  await rm(dataDir, { recursive: true, force: true });
}
