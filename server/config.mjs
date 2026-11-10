import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

function isInside(directory, path) {
  const name = relative(directory, path);
  return name === '' || (!isAbsolute(name) && name !== '..' && !name.startsWith(`..${sep}`));
}

export function readConfig(env = process.env) {
  const dataDir = resolve(projectRoot, env.BASALIC_DATA_DIR || '.basalic-data');
  if (isInside(dataDir, projectRoot) || ['public', 'dist', 'src', 'server'].some(name => isInside(join(projectRoot, name), dataDir))) {
    throw new Error('BASALIC_DATA_DIR benötigt ein separates, privates Verzeichnis.');
  }
  let origin = '';
  if (env.BASALIC_SITE_ORIGIN) {
    const url = new URL(env.BASALIC_SITE_ORIGIN);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('BASALIC_SITE_ORIGIN muss eine HTTPS-Origin ohne Pfad sein.');
    }
    origin = url.origin;
  }
  return { dataDir, origin, passwordHash: env.BASALIC_ADMIN_PASSWORD_HASH || '' };
}
