const browserEnv = import.meta.env;
const nodeBase = typeof process === 'undefined' ? undefined : process.env.BASALIC_PAGES_BASE;
const baseSegment = (browserEnv?.BASE_URL || nodeBase || '/').replace(/^\/+|\/+$/g, '');

export const siteBase = baseSegment ? `/${baseSegment}/` : '/';
export const isPagesPreview = browserEnv ? browserEnv.MODE === 'pages' : nodeBase !== undefined;

export const routeAliases = {
  '/Immobilien': '/immobilien',
  '/Mietverwaltung': '/mietverwaltung',
  '/Vorsorge': '/vorsorge',
  '/about': '/ueber-uns',
};

function isRootRelative(path) {
  return path.startsWith('/') && !path.startsWith('//');
}

export function assetPath(path) {
  return isRootRelative(path) ? siteBase + path.slice(1) : path;
}

export function sitePath(path) {
  if (!isRootRelative(path)) return path;
  const separator = path.search(/[?#]/);
  const pathname = separator < 0 ? path : path.slice(0, separator);
  const suffix = separator < 0 ? '' : path.slice(separator);
  const trailingSlash = isPagesPreview && !pathname.endsWith('/') ? '/' : '';
  return assetPath(`${pathname}${trailingSlash}${suffix}`);
}

export function routePath(pathname) {
  if (pathname === siteBase.slice(0, -1)) return '/';
  if (!pathname.startsWith(siteBase)) return null;
  const path = '/' + pathname.slice(siteBase.length);
  const route = isPagesPreview ? path.replace(/\/index\.html$/, '/').replace(/\.html$/, '') : path;
  return route.replace(/\/+$/, '') || '/';
}

// Pages use the same internal route markup as the local server.
export function setSiteLinks(root) {
  if (!isPagesPreview && siteBase === '/') return;
  for (const link of root.querySelectorAll('a[href^="/"]')) {
    const href = link.getAttribute('href');
    if (siteBase !== '/' && href.startsWith(siteBase)) continue;
    link.setAttribute('href', sitePath(href));
  }
}
