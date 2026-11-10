import { propertyGalleries } from './property-galleries.js';
import { imageMarkup, getImageData, isPropertyMediaPath } from './media.js';
import { assetPath } from './site-paths.js';
import { propertyCity, propertyLabel } from './public-properties.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function photosFor(property) {
  const uploads = (property.photos || []).filter(isPropertyMediaPath);
  if (uploads.length) {
    return uploads.map((src, index) => ({ src, alt: `${propertyLabel(property)}, Foto ${index + 1}` }));
  }
  return [
    ...(property.image ? [{ src: property.image, alt: propertyLabel(property, property.imageRole || property.kind) }] : []),
    ...(propertyGalleries[property.id] || [])
  ];
}

export function renderPropertyGallery(property, mainImage) {
  if (!mainImage) return '';
  const photos = photosFor(property);
  const caption = property.imageRole === 'Grundriss' ? 'Grundriss der Immobilie.' : `${propertyLabel(property)}.`;
  if (photos.length < 2) return `<figure class="object-hero container reveal">${mainImage}<figcaption>${esc(caption)}</figcaption></figure>`;
  return `<section class="object-gallery container reveal" aria-label="Fotos der Immobilie">
    <figure class="object-hero"><button type="button" class="gallery-main" data-gallery-open="0" aria-label="Alle ${photos.length} Objektfotos ansehen">${mainImage}<span class="gallery-count">${photos.length} Fotos ansehen <span aria-hidden="true">↗</span></span></button><figcaption>${esc(caption)}</figcaption></figure>
    <div class="gallery-thumbnails">${photos.slice(1).map((photo, index) => `<button type="button" data-gallery-open="${index + 1}" aria-label="Foto ${index + 2} ansehen: ${esc(photo.alt)}">${imageMarkup(photo.src, '', { sizes: '(max-width: 600px) calc(50vw - 29px), 245px' })}<span>${esc(photo.alt)}</span></button>`).join('')}</div>
    <dialog class="gallery-dialog" aria-labelledby="gallery-title">
      <header><div><span>Immobilien · Einblicke</span><h2 id="gallery-title">${esc(propertyCity(property) || property.kind)}</h2></div><button type="button" class="gallery-close" aria-label="Fotogalerie schließen" autofocus><span aria-hidden="true">×</span></button></header>
      <div class="gallery-stage"><button type="button" class="gallery-prev" aria-label="Vorheriges Foto"><span aria-hidden="true">←</span></button>${imageMarkup(photos[0].src, photos[0].alt, { sizes: '(max-width: 600px) calc(100vw - 56px), 960px' })}<button type="button" class="gallery-next" aria-label="Nächstes Foto"><span aria-hidden="true">→</span></button></div>
      <footer><p class="gallery-caption">${esc(photos[0].alt)}</p><p class="gallery-position" role="status" aria-live="polite" aria-atomic="true">Foto 1 von ${photos.length}</p></footer>
    </dialog>
  </section>`;
}

export function setupPropertyGallery(property) {
  const gallery = document.querySelector('.object-gallery');
  if (!gallery || !property) return () => {};
  const photos = photosFor(property);
  const dialog = gallery.querySelector('dialog');
  const image = dialog.querySelector('.gallery-stage img');
  let active = 0;
  let opener;
  let previousOverflow;
  const show = index => {
    active = (index + photos.length) % photos.length;
    const photo = photos[active];
    const source = getImageData(photo.src);
    image.src = source?.src || assetPath(photo.src);
    if (source?.srcset) image.srcset = source.srcset;
    else image.removeAttribute('srcset');
    if (source?.width && source.height) {
      image.width = source.width;
      image.height = source.height;
    } else {
      image.removeAttribute('width');
      image.removeAttribute('height');
    }
    image.loading = 'eager';
    image.alt = photo.alt;
    dialog.querySelector('.gallery-caption').textContent = photos[active].alt;
    dialog.querySelector('.gallery-position').textContent = `Foto ${active + 1} von ${photos.length}`;
  };
  const close = () => dialog.close();
  const restore = () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  };
  gallery.querySelectorAll('[data-gallery-open]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    show(Number(button.dataset.galleryOpen));
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }));
  dialog.querySelector('.gallery-close').addEventListener('click', close);
  dialog.querySelector('.gallery-prev').addEventListener('click', () => show(active - 1));
  dialog.querySelector('.gallery-next').addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  dialog.addEventListener('close', restore);
  return () => {
    dialog.removeEventListener('close', restore);
    if (dialog.open) {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    }
  };
}
