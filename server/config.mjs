import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isContactEmail } from '../src/contact-fields.js';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

function isInside(directory, path) {
  const name = relative(directory, path);
  return name === '' || (!isAbsolute(name) && name !== '..' && !name.startsWith(`..${sep}`));
}

function httpsOrigin(value, setting) {
  if (!value) return '';
  const url = URL.parse(value);
  if (!url || url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`${setting} muss eine HTTPS-Origin ohne Pfad sein.`);
  }
  return url.origin;
}

export function readConfig(env = process.env) {
  const dataDir = resolve(projectRoot, env.BASALIC_DATA_DIR || '.basalic-data');
  if (isInside(dataDir, projectRoot) || ['public', 'dist', 'src', 'server'].some(name => isInside(join(projectRoot, name), dataDir))) {
    throw new Error('BASALIC_DATA_DIR benötigt ein separates, privates Verzeichnis.');
  }
  const origin = httpsOrigin(env.BASALIC_SITE_ORIGIN, 'BASALIC_SITE_ORIGIN');
  const contact = {
    apiKey: env.BASALIC_CONTACT_RESEND_API_KEY?.trim() || '',
    from: env.BASALIC_CONTACT_FROM?.trim() || '',
    to: env.BASALIC_CONTACT_TO?.trim() || '',
    allowedOrigin: httpsOrigin(env.BASALIC_CONTACT_ALLOWED_ORIGIN, 'BASALIC_CONTACT_ALLOWED_ORIGIN'),
  };
  if ((contact.from && !isContactEmail(contact.from)) || (contact.to && !isContactEmail(contact.to))) {
    throw new Error('BASALIC_CONTACT_FROM und BASALIC_CONTACT_TO müssen gültige E-Mail-Adressen sein.');
  }
  return { dataDir, origin, passwordHash: env.BASALIC_ADMIN_PASSWORD_HASH || '', contact };
}
