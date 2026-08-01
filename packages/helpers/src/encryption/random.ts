import { bytesToBase64 } from "./encoding.js";
import { getSodium } from "./sodium.js";

export async function generateEncryptionKey(): Promise<Uint8Array> {
  const sodium = await getSodium();

  return sodium.crypto_aead_xchacha20poly1305_ietf_keygen();
}

export async function generateEncryptionKeyBase64(): Promise<string> {
  const key = await generateEncryptionKey();

  return bytesToBase64(key);
}

export async function generateRandomBytes(length: number): Promise<Uint8Array> {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("Random byte length must be a positive integer");
  }

  const sodium = await getSodium();

  return sodium.randombytes_buf(length);
}

export async function generateRandomToken(byteLength = 32): Promise<string> {
  const bytes = await generateRandomBytes(byteLength);

  return bytesToBase64(bytes);
}
