import { properties as originalProperties } from './data.js';

const publicStatuses = new Set(['offer', 'information', 'sold']);
export let publishedProperties = originalProperties;

export function propertyCity(property) {
  return property.city === 'Ort nicht genannt' ? '' : property.city || '';
}

export function propertyLabel(property, kind = property.kind) {
  const city = propertyCity(property);
  return city ? `${kind} in ${city}` : kind;
}

export async function loadPublicProperties() {
  if (import.meta.env.MODE === 'pages') return;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch('/api/properties', {
      cache: 'no-store',
      signal: controller.signal,
    });
    // The original catalog also works on hosts that serve only the static build.
    if (response.status === 404 || (response.ok && response.headers.get('content-type')?.includes('text/html'))) return;
    if (!response.ok) throw new Error('Immobilienbestand nicht verfügbar');
    const { properties } = await response.json();
    if (!Array.isArray(properties)) throw new Error('Ungültiger Immobilienbestand');
    publishedProperties = properties.filter(property => publicStatuses.has(property?.status));
  } catch {
    // A failed live catalog must not show potentially withdrawn offers as current.
    publishedProperties = [];
  } finally {
    clearTimeout(timeout);
  }
}

export function propertyForPath(path) {
  const match = /^\/immobilien\/([a-z0-9-]+)$/.exec(path);
  return match ? publishedProperties.find(property => property.id === match[1]) || null : null;
}
