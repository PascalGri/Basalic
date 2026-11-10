import { properties } from './data.js';
import { mediaManifest } from './media-manifest.js';
import { isPropertyMediaPath, mediaFor } from './media.js';
import { propertyLabel } from './public-properties.js';
import { assetPath, isPagesPreview, routeAliases, sitePath } from './site-paths.js';

const brand = 'Senad Basalic & Partner';
const browserEnv = import.meta.env || {};
const generatedConfig = mediaManifest.seo || {};

export function normalizeSiteUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value).trim());
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') return '';
    return url.origin;
  } catch { return ''; }
}

const configuredUrl = isPagesPreview
  ? browserEnv.VITE_BASALIC_PAGES_ORIGIN || globalThis.process?.env.BASALIC_PAGES_ORIGIN
  : browserEnv.VITE_SITE_URL || generatedConfig.siteUrl || '';
const configuredIndexing = browserEnv.VITE_ALLOW_INDEXING ?? generatedConfig.allowIndexing ?? false;
export const seoConfig = {
  siteUrl: normalizeSiteUrl(configuredUrl),
  allowIndexing: !isPagesPreview && Boolean(normalizeSiteUrl(configuredUrl)) && [true, 'true', '1', 1].includes(configuredIndexing),
};

const page = (title, description, imageName = '', imageAlt = title) => ({ title, description, imageName, imageAlt });
const homePreviewTitle = 'Für Ihr Zuhause.\nUnd alles, was folgt.';
const baseRoutes = {
  '/': {
    ...page('Immobilien & Finanzen in Göppingen', 'Immobilien finden, Eigentum verkaufen, Finanzierung und Vorsorge planen: Senad Basalic & Partner begleitet Sie persönlich in Göppingen und der Region.', '', homePreviewTitle.replace('\n', ' ')),
    previewTitle: homePreviewTitle,
  },
  '/immobilien': page('Immobilien in Göppingen und der Region', 'Entdecken Sie Häuser, Wohnungen und Grundstücke sowie bereits verkaufte Referenzen. Fragen Sie Senad Basalic & Partner nach Verfügbarkeit und Besichtigung.', 'faurndau', 'Zweifamilienhaus in Göppingen-Faurndau'),
  '/immobilie-verkaufen': page('Ihre Immobilie verkaufen', 'Sie möchten Ihr Haus oder Ihre Wohnung verkaufen? Besprechen Sie mit Senad Basalic & Partner Ihr Objekt und die nächsten Schritte für den Verkauf.'),
  '/mietverwaltung': page('Mietverwaltung für Eigentümer', 'Unterstützung für Kapitalanleger und Vermieter: Besprechen Sie mit Senad Basalic & Partner, welche Aufgaben Sie bei Ihrer vermieteten Immobilie abgeben möchten.', 'services/mietverwaltung', 'KI-generiertes Beispielbild: Helles Mehrfamilienhaus mit grauen Balkonen'),
  '/finanzierung': page('Baufinanzierung und Privatkredite', 'Baufinanzierung, Privatkredite und Umschuldung: Senad Basalic & Partner bespricht Ihr Vorhaben und begleitet Ihre Fragen rund um eine passende Finanzierung.', 'services/finanzierung', 'KI-generiertes Beispielbild: Eine Frau und ein Mann besprechen einen Wohnungsgrundriss am Tisch'),
  '/vorsorge': page('Absicherung und Altersvorsorge', 'Versorgungslücken erkennen und für den Ruhestand planen: Persönliche Beratung zu Absicherung und Altersvorsorge bei Senad Basalic & Partner.', 'services/absicherung', 'KI-generiertes Beispielbild: Elternteil hilft einem Kind in die Jacke'),
  '/ueber-uns': page('Senad Basalic – Ihr Ansprechpartner', 'In Göppingen verwurzelt und seit 2001 am Markt: Lernen Sie Senad Basalic und seine persönliche Begleitung bei Immobilien-, Finanzierungs- und Vorsorgefragen kennen.', 'senad-basalic', 'Senad Basalic, persönlicher Ansprechpartner'),
  '/kontakt': page('Kontakt zu Senad Basalic & Partner', 'Besprechen wir Ihr Vorhaben. Hier finden Sie Telefonnummer und E-Mail-Adressen für Immobilien, Finanzierung, Mietverwaltung und Vorsorge.', 'senad-basalic', 'Senad Basalic, persönlicher Ansprechpartner'),
  '/impressum': page('Impressum', 'Betreiber-, Kontakt- und Vermittlerangaben zu Senad Basalic & Partner.', 'senad-basalic', 'Senad Basalic'),
  '/datenschutz': page('Datenschutzhinweise', 'Informationen zur technischen Bereitstellung, zu Ihren Kontaktangaben, externen Links und Ihren Datenschutzrechten auf dieser Website.'),
  '/erstinformationen': page('Vermittler- und Verbraucherinformationen', 'Informationen zu Vermittlerstatus, Versicherungs- und Darlehensvermittlung sowie weiteren Verbraucherinformationen von Senad Basalic & Partner.'),
  '/barrierefreiheit': page('Informationen zur Barrierefreiheit', 'Informationen zur Bedienbarkeit dieser Website und Möglichkeiten, Barrieren bei Senad Basalic & Partner zu melden.'),
  '/bildnachweise': page('Bildnachweise', 'Herkunft der Immobilienbilder und des Porträts sowie Hinweise zu KI-generierten Servicebildern und lokal eingebundenen Schriften.'),
};

function socialPath(path) {
  return `/assets/social/${path === '/' ? 'start' : path.slice(1).replaceAll('/', '--')}.webp`;
}

function metadataForProperty(property) {
  const label = propertyLabel(property);
  const heading = `${property.status === 'sold' ? 'Verkauft: ' : ''}${label}${property.area ? ` · ${property.area} m²` : ''}`;
  const details = [property.area ? `${property.area} m² ${property.areaLabel || 'Wohnfläche'}` : '', property.rooms ? `${property.rooms} Zimmer` : '', property.land ? `${property.land} m² Grundstück` : ''].filter(Boolean).join(' · ');
  const ending = property.status === 'sold'
    ? 'Bereits verkauft. Entdecken Sie diese Referenz und sprechen Sie uns auf ein ähnliches Objekt an.'
    : property.status === 'information'
      ? 'Informationen zu dieser Auslandsimmobilie erhalten Sie im persönlichen Gespräch.'
      : 'Fragen zu Verfügbarkeit, Preis und Besichtigung? Wir freuen uns auf Ihre Anfrage.';
  return page(heading, `${label}.${details ? ` ${details}.` : ''} ${ending}`, property.image || '', property.image ? propertyLabel(property, property.imageRole || property.kind) : heading);
}

const objectRoutes = Object.fromEntries(properties.map(property => [`/immobilien/${property.id}`, metadataForProperty(property)]));

/** Pure route metadata is also usable by the static build and later SSR. */
export const routeMetadata = Object.fromEntries(Object.entries({ ...baseRoutes, ...objectRoutes }).map(([path, metadata]) => [path, {
  ...metadata,
  title: `${metadata.title} · ${brand}`,
  previewTitle: metadata.previewTitle || metadata.title,
  image: socialPath(path),
  imageWidth: 1200,
  imageHeight: 630,
  generatedImage: metadata.imageName.startsWith('services/'),
}]));

export function normalizeSeoPath(path) {
  const clean = String(path || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return routeAliases[clean] || clean;
}

export function metadataFor(path, property) {
  const normalized = normalizeSeoPath(path);
  if (property === undefined || !normalized.startsWith('/immobilien/')) {
    if (routeMetadata[normalized]) return routeMetadata[normalized];
  } else if (property) {
    const current = metadataForProperty(property);
    const original = objectRoutes[normalized];
    if (original && Object.keys(current).every(key => current[key] === original[key])) return routeMetadata[normalized];

    const photo = isPropertyMediaPath(current.imageName) ? { src: current.imageName } : mediaFor(current.imageName);
    const preview = routeMetadata['/'];
    return {
      ...current,
      title: `${current.title} · ${brand}`,
      image: photo?.src || preview.image,
      imageAlt: photo ? current.imageAlt : preview.imageAlt,
      imageWidth: photo ? photo.width : preview.imageWidth,
      imageHeight: photo ? photo.height : preview.imageHeight,
    };
  }
  return {
    ...routeMetadata['/'],
    title: `Seite nicht gefunden · ${brand}`,
    description: 'Diese Seite ist nicht vorhanden. Entdecken Sie Immobilien und Leistungen von Senad Basalic & Partner oder nehmen Sie Kontakt auf.',
    missing: true,
  };
}

export function seoTagsFor(path, property) {
  const normalized = normalizeSeoPath(path);
  const metadata = metadataFor(normalized, property);
  const canonical = seoConfig.siteUrl && !metadata.missing ? `${seoConfig.siteUrl}${sitePath(normalized)}` : '';
  const image = `${seoConfig.siteUrl}${assetPath(metadata.image)}`;
  const index = seoConfig.allowIndexing && !metadata.missing;
  return {
    title: metadata.title,
    canonical,
    names: {
      description: metadata.description,
      robots: index ? 'index,follow,max-image-preview:large' : 'noindex,nofollow,noarchive',
      'twitter:card': 'summary_large_image',
      'twitter:title': metadata.title,
      'twitter:description': metadata.description,
      'twitter:image': image,
      'twitter:image:alt': metadata.imageAlt,
    },
    properties: {
      'og:type': 'website',
      'og:locale': 'de_DE',
      'og:site_name': brand,
      'og:title': metadata.title,
      'og:description': metadata.description,
      'og:image': image,
      'og:image:alt': metadata.imageAlt,
      'og:image:width': metadata.imageWidth ? String(metadata.imageWidth) : '',
      'og:image:height': metadata.imageHeight ? String(metadata.imageHeight) : '',
      'og:url': canonical,
    },
  };
}

/** Update the head after SPA navigation without inventing a production origin. */
export function updateSeo(path, property) {
  const tags = seoTagsFor(path, property);
  if (typeof document === 'undefined') return tags;
  document.title = tags.title;
  const writeMeta = (attribute, name, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
    if (!content) { element?.remove(); return; }
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.append(element);
    }
    element.setAttribute('content', content);
  };
  Object.entries(tags.names).forEach(([name, content]) => writeMeta('name', name, content));
  Object.entries(tags.properties).forEach(([name, content]) => writeMeta('property', name, content));
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (tags.canonical) {
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = tags.canonical;
  } else canonical?.remove();
  return tags;
}
