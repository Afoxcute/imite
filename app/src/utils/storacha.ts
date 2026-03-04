/**
 * Storacha Network integration – client-side only.
 * User provides key + proof (from storacha CLI); uploads run in the browser.
 * @see https://docs.storacha.network/how-to/upload/
 */

const STORACHA_CREDENTIALS_KEY = 'storacha_credentials';

/** Read from app .env (Vite exposes VITE_* only). */
function getEnvCredentials(): { key: string; proof: string } | null {
  const key = (import.meta.env?.VITE_STORACHA_KEY as string)?.trim();
  const proof = (import.meta.env?.VITE_STORACHA_PROOF as string)?.trim().replace(/\s+/g, '');
  if (key && proof) return { key, proof };
  return null;
}

export type StorachaUploadResult = {
  success: boolean;
  cid?: string;
  ipfsUrl?: string;
  gatewayUrl?: string;
  message?: string;
  error?: string;
};

export type StorachaStatus = { available: boolean; reason?: 'unreachable' | 'not_configured' | null };

/** Credentials from app .env (VITE_STORACHA_KEY, VITE_STORACHA_PROOF) or session. */
export function getStorachaCredentials(): { key: string; proof: string } | null {
  const envCreds = getEnvCredentials();
  if (envCreds) return envCreds;
  try {
    const raw = sessionStorage.getItem(STORACHA_CREDENTIALS_KEY);
    if (!raw) return null;
    const { key, proof } = JSON.parse(raw) as { key?: string; proof?: string };
    const k = (key ?? '').trim();
    const p = (proof ?? '').trim().replace(/\s+/g, '');
    if (k.length > 0 && p.length > 0) return { key: k, proof: p };
    return null;
  } catch {
    return null;
  }
}

/** Whether credentials are coming from app .env (read-only). */
export function isStorachaFromEnv(): boolean {
  return getEnvCredentials() !== null;
}

export function setStorachaCredentials(key: string, proof: string): void {
  const k = key.trim();
  const p = proof.trim().replace(/\s+/g, '');
  sessionStorage.setItem(STORACHA_CREDENTIALS_KEY, JSON.stringify({ key: k, proof: p }));
}

export function clearStorachaCredentials(): void {
  sessionStorage.removeItem(STORACHA_CREDENTIALS_KEY);
}

/** Create Storacha client in the browser from key + proof. */
async function createClient(key: string, proof: string): Promise<{
  uploadFile: (file: Blob | File) => Promise<string>;
}> {
  const Client = await import('@storacha/client');
  const { StoreMemory } = await import('@storacha/client/stores/memory');
  const Proof = await import('@storacha/client/proof');
  const { Signer } = await import('@storacha/client/principal/ed25519');
  const principal = Signer.parse(key);
  const store = new StoreMemory();
  const client = await (Client as { create: (opts: unknown) => Promise<unknown> }).create({
    principal,
    store,
  });
  const proofParsed = await (Proof as { parse: (s: string) => Promise<unknown> }).parse(proof);
  const space = await (client as { addSpace: (p: unknown) => Promise<{ did: () => string }> }).addSpace(proofParsed);
  await (client as { setCurrentSpace: (did: string) => Promise<unknown> }).setCurrentSpace(space.did());
  return client as { uploadFile: (file: Blob | File) => Promise<string> };
}

/**
 * Upload a file to Storacha from the browser. Requires credentials via setStorachaCredentials / session.
 */
export async function uploadFileToStoracha(file: File): Promise<StorachaUploadResult> {
  const creds = getStorachaCredentials();
  if (!creds) {
    return { success: false, error: 'Storacha credentials not set. Enter key and proof above.' };
  }
  try {
    const client = await createClient(creds.key, creds.proof);
    const cid = await client.uploadFile(file);
    const cidStr = typeof cid === 'string' ? cid : String(cid);
    const ipfsUrl = `ipfs://${cidStr}`;
    return {
      success: true,
      cid: cidStr,
      ipfsUrl,
      gatewayUrl: getStorachaGatewayUrl(cidStr),
      message: 'Uploaded to Storacha',
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    const hint =
      /space\/blob\/add|invocation/i.test(msg)
        ? ' Recreate your proof with upload capabilities: storacha delegation create <your-did> --base64 --can space/blob/add --can space/index/add --can filecoin/offer --can upload/add'
        : '';
    return {
      success: false,
      error: msg + hint,
    };
  }
}

/**
 * Upload JSON to Storacha from the browser.
 */
export async function uploadJSONToStoracha(data: unknown): Promise<StorachaUploadResult> {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const file = new File([blob], `metadata-${Date.now()}.json`, { type: 'application/json' });
  return uploadFileToStoracha(file);
}

/** Client-side: available when we have credentials in session. No backend call. */
export function getStorachaStatus(): StorachaStatus {
  const creds = getStorachaCredentials();
  return creds ? { available: true, reason: null } : { available: false, reason: 'not_configured' };
}

export async function isStorachaAvailable(): Promise<boolean> {
  return getStorachaStatus().available;
}

/**
 * Gateway URL for retrieving content by CID (Storacha).
 */
export function getStorachaGatewayUrl(cidOrIpfsUrl: string): string {
  if (!cidOrIpfsUrl) return '';
  const cid = cidOrIpfsUrl.replace(/^ipfs:\/\//, '').trim();
  if (!cid) return '';
  return `https://${cid}.ipfs.storacha.link`;
}
