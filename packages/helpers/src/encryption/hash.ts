import { bytesToBase64, stringToBytes } from "./encoding.js";
import { getSodium } from "./sodium.js";

export async function hashString(
  value: string,
  outputLength = 32,
): Promise<string> {
  if (!Number.isInteger(outputLength) || outputLength < 16) {
    throw new Error("Hash output length must be at least 16 bytes");
  }

  const sodium = await getSodium();
  const valueBytes = await stringToBytes(value);

  const hash = sodium.crypto_generichash(outputLength, valueBytes);

  return bytesToBase64(hash);
}

export async function keyedHash(
  value: string,
  key: Uint8Array,
  outputLength = 32,
): Promise<string> {
  const sodium = await getSodium();
  const valueBytes = await stringToBytes(value);

  const hash = sodium.crypto_generichash(outputLength, valueBytes, key);

  return bytesToBase64(hash);
}
