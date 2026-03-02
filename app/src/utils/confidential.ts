/**
 * Client-side encryption/decryption for IP assets (Zama/OpenZeppelin confidential integration).
 * Uses Web Crypto API (AES-GCM) so metadata can be stored as ciphertext on any chain.
 * When isEncrypted is true, encrypt before sending to contract and decrypt when user has the key.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;

/**
 * Derive a crypto key from a password (or wallet-derived secret) using PBKDF2.
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  length: number = KEY_LENGTH
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 310000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random salt (for key derivation) and IV (for AES-GCM).
 * Prepend them to the ciphertext so we can decrypt later: salt(16) + iv(12) + ciphertext.
 */
function randomBytes(length: number): Uint8Array {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return buf;
}

/**
 * Encrypt plaintext (e.g. IP metadata JSON string) with a password-derived key.
 * Returns base64 string: salt + iv + ciphertext (all concatenated and base64-encoded).
 */
export async function encryptMetadata(plaintext: string, password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const key = await deriveKey(password, salt);
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
      tagLength: 128,
    },
    key,
    enc.encode(plaintext)
  );
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a payload produced by encryptMetadata.
 */
export async function decryptMetadata(encryptedBase64: string, password: string): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));
  if (combined.length < SALT_LENGTH + IV_LENGTH) {
    throw new Error('Invalid encrypted payload');
  }
  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = combined.slice(SALT_LENGTH + IV_LENGTH);
  const key = await deriveKey(password, salt);
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv,
      tagLength: 128,
    },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

/**
 * Check if a string looks like our encrypted payload (base64, length >= salt+iv).
 */
export function isEncryptedPayload(value: string): boolean {
  try {
    if (typeof value !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(value)) return false;
    const raw = atob(value);
    return raw.length >= SALT_LENGTH + IV_LENGTH;
  } catch {
    return false;
  }
}
