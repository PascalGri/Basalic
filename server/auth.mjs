import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const derive = promisify(scrypt);
const scryptOptions = { N: 2 ** 17, r: 8, p: 1, maxmem: 160 * 1024 * 1024 };
const sessionAge = 8 * 60 * 60;
const attemptWindow = 10 * 60 * 1000;
const maxAttempts = 8;
const maxSessions = 32;
const hashToken = token => createHash('sha256').update(token).digest('hex');

export async function makePasswordHash(password) {
  if (typeof password !== 'string' || password.length < 14 || Buffer.byteLength(password) > 1024) {
    throw new Error('Das Passwort muss mindestens 14 Zeichen haben und darf höchstens 1024 Byte lang sein.');
  }
  const salt = randomBytes(16);
  const key = await derive(password, salt, 32, scryptOptions);
  return `scrypt-v1:${salt.toString('hex')}:${key.toString('hex')}`;
}

export function createAuth({ origin, passwordHash }) {
  const hashParts = /^scrypt-v1:([a-f0-9]{32}):([a-f0-9]{64})$/.exec(passwordHash);
  if (passwordHash && !hashParts) throw new Error('BASALIC_ADMIN_PASSWORD_HASH ist ungültig. Verwenden Sie npm run admin:password.');

  const sessions = new Map();
  const failedAt = [];
  let verifying = false;
  const secure = Boolean(origin);
  const cookieName = secure ? '__Host-basalic_admin' : 'basalic_admin';
  const cookie = (token, maxAge) => `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;

  function sessionKey(request) {
    const entry = request.headers.cookie?.split(';').map(value => value.trim()).find(value => value.startsWith(`${cookieName}=`));
    const token = entry?.slice(cookieName.length + 1);
    return token && /^[a-f0-9]{64}$/.test(token) ? hashToken(token) : '';
  }

  function hasSession(request) {
    const key = sessionKey(request);
    const expires = sessions.get(key);
    if (!expires) return false;
    if (expires > Date.now()) return true;
    sessions.delete(key);
    return false;
  }

  function sameOrigin(request) {
    if (request.headers['sec-fetch-site'] && request.headers['sec-fetch-site'] !== 'same-origin') return false;
    if (origin) return request.headers.origin === origin;
    const host = request.headers.host || '';
    // Plain HTTP is limited to loopback, even if the server binds to another interface.
    if (!['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress)) return false;
    if (!/^(?:127\.0\.0\.1|localhost|\[::1\])(?::\d{1,5})?$/.test(host)) return false;
    return request.headers.origin === `http://${host}`;
  }

  async function login(request, password) {
    if (!hashParts) return { status: 503, error: 'Der Zugang wurde noch nicht eingerichtet.' };
    if (typeof password !== 'string' || !password || Buffer.byteLength(password) > 1024) {
      return { status: 401, error: 'Das Passwort stimmt nicht.' };
    }
    const now = Date.now();
    while (failedAt.length && failedAt[0] <= now - attemptWindow) failedAt.shift();
    if (failedAt.length >= maxAttempts) {
      return { status: 429, retryAfter: Math.ceil((failedAt[0] + attemptWindow - now) / 1000), error: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.' };
    }
    if (verifying) return { status: 429, retryAfter: 1, error: 'Eine Anmeldung läuft bereits. Bitte versuchen Sie es erneut.' };

    verifying = true;
    try {
      const key = await derive(password, Buffer.from(hashParts[1], 'hex'), 32, scryptOptions);
      if (!timingSafeEqual(key, Buffer.from(hashParts[2], 'hex'))) {
        failedAt.push(Date.now());
        return { status: 401, error: 'Das Passwort stimmt nicht.' };
      }
    } finally {
      verifying = false;
    }

    failedAt.length = 0;
    for (const [key, expires] of sessions) if (expires <= now) sessions.delete(key);
    sessions.delete(sessionKey(request));
    if (sessions.size >= maxSessions) sessions.delete(sessions.keys().next().value);
    const token = randomBytes(32).toString('hex');
    sessions.set(hashToken(token), Date.now() + sessionAge * 1000);
    return { status: 200, cookie: cookie(token, sessionAge) };
  }

  function logout(request) {
    sessions.delete(sessionKey(request));
    return cookie('', 0);
  }

  return { configured: Boolean(hashParts), hasSession, sameOrigin, login, logout };
}
