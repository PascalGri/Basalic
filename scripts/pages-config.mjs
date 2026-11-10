export const pagesOutput = 'dist-pages';

export function readPagesConfig(env = process.env) {
  const base = env.BASALIC_PAGES_BASE || '/Basalic/';
  if (!/^\/(?:[a-z\d._-]+\/)*$/i.test(base) || base.split('/').some(segment => segment === '.' || segment === '..')) {
    throw new Error('BASALIC_PAGES_BASE muss ein Pfad mit führendem und abschließendem Schrägstrich sein.');
  }

  const origin = new URL(env.BASALIC_PAGES_ORIGIN || 'https://pascalgri.github.io');
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
    throw new Error('BASALIC_PAGES_ORIGIN muss eine HTTPS-Origin ohne Pfad sein.');
  }
  return { base, origin: origin.origin };
}
