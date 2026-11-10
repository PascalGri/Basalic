import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { loadEnvFile } from 'node:process';
import { readConfig, projectRoot } from './config.mjs';
import { createSiteApi, requestPath } from './http.mjs';
import { dist, runtimePages } from './pages.mjs';

const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
};

try {
  loadEnvFile(join(projectRoot, '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await access(join(dist, 'index.html')).catch(() => { throw new Error('Bitte führen Sie vor dem Serverstart npm run build aus.'); });

const { middleware, store } = createSiteApi(readConfig());
const renderRuntimePage = runtimePages(store);

async function fileInfo(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? info : null;
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) return null;
    throw error;
  }
}

async function serveStatic(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    return response.end();
  }
  const path = requestPath(request).replace(/\/$/, '') || '/';
  const target = resolve(dist, `.${path}`);
  if ((target !== dist && !target.startsWith(`${dist}${sep}`)) || path.includes('\0') || path.split('/').some(part => part.startsWith('.'))) {
    response.writeHead(404);
    return response.end('Nicht gefunden');
  }
  const candidates = path === '/' ? [join(dist, 'index.html')] : [target];
  if (path !== '/' && !extname(path)) candidates.push(join(target, 'index.html'), join(dist, 'index.html'));
  for (const candidate of candidates) {
    const info = await fileInfo(candidate);
    if (!info) continue;
    const type = types[extname(candidate)] || 'application/octet-stream';
    const immutable = /\/assets\/[^/]+-[a-z\d_-]{8,}\.(?:js|css|woff2?)$/i.test(path);
    response.writeHead(200, {
      'Content-Type': type,
      'Content-Length': info.size,
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') return response.end();
    return createReadStream(candidate).on('error', error => response.destroy(error)).pipe(response);
  }
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  return response.end('Nicht gefunden');
}

function onError(response, error) {
  console.error('Basalic-Seite konnte nicht ausgeliefert werden:', error);
  if (response.headersSent) return response.destroy(error);
  response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end('Die Seite ist gerade nicht erreichbar. Bitte versuchen Sie es erneut.');
}

const server = createServer({ requestTimeout: 45_000, headersTimeout: 15_000 }, (request, response) => {
  try {
    middleware(request, response, () => renderRuntimePage(request, response, error => {
      if (error) return onError(response, error);
      void serveStatic(request, response).catch(error => onError(response, error));
    }));
  } catch (error) {
    onError(response, error);
  }
});

const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT ?? 5104);
server.listen(port, host, () => {
  const address = server.address();
  console.log(`Basalic läuft unter http://${host.includes(':') ? `[${host}]` : host}:${address.port}`);
});
