export const SESSION_COOKIE = 'maanaksetu_session';
const encoder = new TextEncoder();
let cachedKey: CryptoKey | null = null;
let cachedSecret: string | null = null;

async function key() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('Authentication is not configured');
  if (cachedKey && cachedSecret === secret) return cachedKey;
  cachedSecret = secret;
  cachedKey = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  return cachedKey;
}
export async function createSession() {
  const payload = `${Date.now() + 8 * 60 * 60 * 1000}:${crypto.randomUUID()}`;
  const signature = await crypto.subtle.sign('HMAC', await key(), encoder.encode(payload));
  return `${payload}.${Array.from(new Uint8Array(signature), b => b.toString(16).padStart(2, '0')).join('')}`;
}
export async function validSession(token?: string) {
  try {
    if (!token) return false;
    const [payload, signature, extra] = token.split('.');
    if (extra || !/^[a-f0-9]{64}$/.test(signature || '') || Number(payload.split(':')[0]) <= Date.now()) return false;
    const bytes = Uint8Array.from(signature.match(/../g)!, v => parseInt(v, 16));
    return await crypto.subtle.verify('HMAC', await key(), bytes, encoder.encode(payload));
  } catch { return false; }
}
