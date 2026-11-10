import { mediaManifest } from './media-manifest.js';

const escapeAttribute = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// Match the container padding in style.css and the image tracks in finance-pages.css.
const serviceImageSizes = '(max-width: 360px) calc(100vw - 42px), (max-width: 600px) calc(100vw - 50px), (max-width: 900px) calc(100vw - 66px), (max-width: 1200px) calc(47.5vw - 34px), (max-width: 1440px) calc(566px - 2.5vw), 530px';
const profileImageSizes = '(max-width: 360px) calc(100vw - 40px), (max-width: 488px) calc(100vw - 48px), (max-width: 900px) 440px, (max-width: 1134px) calc(45vw - 30.32px), 480px';
const objectImageSizes = '(max-width: 360px) calc(100vw - 40px), (max-width: 600px) calc(100vw - 48px), (max-width: 1200px) calc(100vw - 64px), 1136px';

/** Share the responsive image and priority conditions with the static HTML build. */
export function getPrimaryImageOptions(path) {
  if (path === '/ueber-uns') return { sizes: profileImageSizes, media: '(min-height: 680px)' };
  if (['/mietverwaltung', '/finanzierung', '/vorsorge'].includes(path)) {
    return { sizes: serviceImageSizes, media: '(min-height: 680px)' };
  }
  if (/^\/immobilien\/[^/]+$/.test(path)) {
    return { sizes: objectImageSizes, media: '(min-height: 740px)' };
  }
  return null;
}

function assetName(value) {
  const name = String(value ?? '').replace(/^\/assets\//, '').replace(/\.webp$/i, '');
  return /^[a-z0-9][a-z0-9/_-]*$/i.test(name) && !name.split('/').some(part => !part) ? name : '';
}

export function mediaFor(name) {
  return mediaManifest.images[assetName(name)];
}

export function isPropertyMediaPath(value) {
  return /^\/property-media\/[a-f0-9-]{36}\.webp$/.test(value || '');
}

export function getImageData(name) {
  if (isPropertyMediaPath(name)) return { src: name };
  const image = mediaFor(name);
  if (!image) return null;
  const variants = image.variants;
  const preferred = [...variants].reverse().find(variant => variant.width <= 960) || variants[0];
  return {
    src: preferred?.src || image.src,
    srcset: variants.map(variant => `${variant.src} ${variant.width}w`).join(', '),
    width: image.width,
    height: image.height,
  };
}

/** Render local images only; unrecognised names are omitted rather than guessed. */
export function imageMarkup(name, alt, { className = '', eager = false, sizes = '100vw' } = {}) {
  const image = getImageData(name);
  if (!image) return '';
  const dimensions = image.width && image.height ? ` width="${image.width}" height="${image.height}"` : '';
  return `<img src="${escapeAttribute(image.src)}"${image.srcset ? ` srcset="${escapeAttribute(image.srcset)}" sizes="${escapeAttribute(sizes)}"` : ''} alt="${escapeAttribute(alt)}"${className ? ` class="${escapeAttribute(className)}"` : ''}${dimensions} loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''} decoding="async">`;
}

export function primaryImageMarkup(path, name, alt) {
  const options = getPrimaryImageOptions(path);
  if (!options) return imageMarkup(name, alt);
  const eager = globalThis.matchMedia?.(options.media).matches === true;
  return imageMarkup(name, alt, { sizes: options.sizes, eager });
}
