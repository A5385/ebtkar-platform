import { getSodium } from "./sodium.js";

export async function stringToBytes(value: string): Promise<Uint8Array> {
  const sodium = await getSodium();

  return sodium.from_string(value);
}

export async function bytesToString(value: Uint8Array): Promise<string> {
  const sodium = await getSodium();

  return sodium.to_string(value);
}

export async function bytesToBase64(value: Uint8Array): Promise<string> {
  const sodium = await getSodium();

  return sodium.to_base64(value, sodium.base64_variants.URLSAFE_NO_PADDING);
}

export async function base64ToBytes(value: string): Promise<Uint8Array> {
  const sodium = await getSodium();

  return sodium.from_base64(value, sodium.base64_variants.URLSAFE_NO_PADDING);
}
