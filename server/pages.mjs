import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { load } from 'cheerio';
import { getImageData, getPrimaryImageOptions } from '../src/media.js';
import { routeMetadata, seoConfig, seoTagsFor } from '../src/seo.js';
import { projectRoot } from './config.mjs';
import { privateHeaders, requestPath } from './http.mjs';

export const dist = join(projectRoot, 'dist');

function renderHead(template, tags, { path, imageName } = {}) {
  const $ = load(template);
  $('title').text(tags.title);
  $('meta[name="description"],meta[name="robots"],meta[name^="twitter:"],meta[property^="og:"],link[rel="canonical"],link[data-primary-image-preload]').remove();
  const imageOptions = imageName ? getPrimaryImageOptions(path) : null;
  const image = imageOptions ? getImageData(imageName) : null;
  if (image?.srcset) {
    const preload = $('<link>').attr({
      rel: 'preload', as: 'image', imagesrcset: image.srcset,
      imagesizes: imageOptions.sizes, media: imageOptions.media,
      fetchpriority: 'high', 'data-primary-image-preload': '',
    });
    $('meta[name="viewport"]').after(preload);
  }
  for (const [name, content] of Object.entries(tags.names)) if (content) $('head').append($('<meta>').attr({ name, content }));
  for (const [property, content] of Object.entries(tags.properties)) if (content) $('head').append($('<meta>').attr({ property, content }));
  if (tags.canonical) $('head').append($('<link>').attr({ rel: 'canonical', href: tags.canonical }));
  return $.html();
}

const escapeXml = value => value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]));

function sendPage(request, response, status, contentType, body) {
  response.writeHead(status, { 'Content-Type': contentType, 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store' });
  response.end(request.method === 'HEAD' ? undefined : body);
}

export function runtimePages(store) {
  return (request, response, next) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    const pathname = requestPath(request);
    const detail = /^\/immobilien\/([a-z0-9-]{1,100})(?:\.html|\/index\.html|\/)?$/.exec(pathname);
    const admin = /^\/admin\/?$/.test(pathname);
    const sitemap = pathname === '/sitemap.xml';
    if (!detail && !admin && !sitemap) return next();

    async function respond() {
      if (sitemap) {
        if (!seoConfig.allowIndexing) return sendPage(request, response, 404, 'text/plain; charset=utf-8', 'Nicht gefunden');
        const paths = Object.keys(routeMetadata).filter(path => !path.startsWith('/immobilien/'));
        paths.push(...(await store.list()).map(property => `/immobilien/${property.id}`));
        const urls = paths.map(path => `<url><loc>${escapeXml(`${seoConfig.siteUrl}${path}`)}</loc></url>`).join('');
        return sendPage(request, response, 200, 'application/xml; charset=utf-8', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
      }

      const template = await readFile(join(dist, 'index.html'), 'utf8');
      if (admin) {
        privateHeaders(response);
        const body = renderHead(template, {
          title: 'Immobilienverwaltung · Basalic & Partner',
          names: { robots: 'noindex,nofollow,noarchive' },
          properties: {},
        });
        return sendPage(request, response, 200, 'text/html; charset=utf-8', body);
      }

      const [, id] = detail;
      const canonical = `/immobilien/${id}`;
      if (pathname.endsWith('.html')) {
        response.writeHead(308, { Location: canonical, 'Cache-Control': 'no-store' });
        return response.end();
      }
      const property = await store.getPublic(id);
      if (!property) privateHeaders(response);
      const html = renderHead(template, seoTagsFor(canonical, property), { path: canonical, imageName: property?.image });
      return sendPage(request, response, property ? 200 : 404, 'text/html; charset=utf-8', html);
    }

    void respond().catch(next);
  };
}
