import { randomBytes } from 'node:crypto';
import { makePasswordHash } from '../server/auth.mjs';

if (process.stdin.isTTY) {
  const password = randomBytes(24).toString('base64url');
  console.log(`Passwort für Herrn Basalic: ${password}\nBASALIC_ADMIN_PASSWORD_HASH=${await makePasswordHash(password)}`);
} else {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    input += chunk;
    if (Buffer.byteLength(input) > 1026) throw new Error('Das Passwort darf höchstens 1024 Byte lang sein.');
  }
  console.log(await makePasswordHash(input.replace(/\r?\n$/, '')));
}
