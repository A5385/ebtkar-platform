export const ENCRYPTION_ALGORITHM = "xchacha20-poly1305" as const;
export const ENCRYPTION_VERSION = 1 as const;

export type EncryptionAlgorithm = typeof ENCRYPTION_ALGORITHM;

export interface EncryptedPayload {
  version: typeof ENCRYPTION_VERSION;
  algorithm: EncryptionAlgorithm;
  nonce: string;
  ciphertext: string;
}

export interface EncryptOptions {
  /**
   * Optional authenticated data.
   *
   * It is authenticated but not encrypted.
   */
  additionalData?: string;
}

export interface DecryptOptions {
  additionalData?: string;
}
