import {
  base64ToBytes,
  bytesToBase64,
  bytesToString,
  stringToBytes,
} from "./encoding.js";
import { getSodium } from "./sodium.js";
import {
  ENCRYPTION_ALGORITHM,
  ENCRYPTION_VERSION,
  type DecryptOptions,
  type EncryptedPayload,
  type EncryptOptions,
} from "./types.js";

function assertPayload(payload: EncryptedPayload): void {
  if (payload.version !== ENCRYPTION_VERSION) {
    throw new Error(
      `Unsupported encryption payload version: ${payload.version}`,
    );
  }

  if (payload.algorithm !== ENCRYPTION_ALGORITHM) {
    throw new Error(`Unsupported encryption algorithm: ${payload.algorithm}`);
  }

  if (!payload.nonce || !payload.ciphertext) {
    throw new Error("Invalid encrypted payload");
  }
}

async function validateKey(key: Uint8Array): Promise<void> {
  const sodium = await getSodium();

  if (key.length !== sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES) {
    throw new Error(
      `Encryption key must be ` +
        `${sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES} bytes`,
    );
  }
}

export async function encryptBytes(
  plaintext: Uint8Array,
  key: Uint8Array,
  options: EncryptOptions = {},
): Promise<EncryptedPayload> {
  const sodium = await getSodium();

  await validateKey(key);

  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES,
  );

  const additionalData = options.additionalData
    ? sodium.from_string(options.additionalData)
    : null;

  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    plaintext,
    additionalData,
    null,
    nonce,
    key,
  );

  return {
    version: ENCRYPTION_VERSION,
    algorithm: ENCRYPTION_ALGORITHM,
    nonce: await bytesToBase64(nonce),
    ciphertext: await bytesToBase64(ciphertext),
  };
}

export async function decryptBytes(
  payload: EncryptedPayload,
  key: Uint8Array,
  options: DecryptOptions = {},
): Promise<Uint8Array> {
  const sodium = await getSodium();

  assertPayload(payload);
  await validateKey(key);

  const nonce = await base64ToBytes(payload.nonce);
  const ciphertext = await base64ToBytes(payload.ciphertext);

  const additionalData = options.additionalData
    ? sodium.from_string(options.additionalData)
    : null;

  try {
    return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      ciphertext,
      additionalData,
      nonce,
      key,
    );
  } catch {
    throw new Error(
      "Decryption failed: the key, payload, or additional data is invalid",
    );
  }
}

export async function encryptString(
  plaintext: string,
  key: Uint8Array,
  options?: EncryptOptions,
): Promise<EncryptedPayload> {
  const plaintextBytes = await stringToBytes(plaintext);

  return encryptBytes(plaintextBytes, key, options);
}

export async function decryptString(
  payload: EncryptedPayload,
  key: Uint8Array,
  options?: DecryptOptions,
): Promise<string> {
  const plaintextBytes = await decryptBytes(payload, key, options);

  return bytesToString(plaintextBytes);
}

export async function encryptJson<T>(
  value: T,
  key: Uint8Array,
  options?: EncryptOptions,
): Promise<EncryptedPayload> {
  return encryptString(JSON.stringify(value), key, options);
}

export async function decryptJson<T>(
  payload: EncryptedPayload,
  key: Uint8Array,
  options?: DecryptOptions,
): Promise<T> {
  const value = await decryptString(payload, key, options);

  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error("Decrypted value is not valid JSON");
  }
}
