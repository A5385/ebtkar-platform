export {
  decryptBytes,
  decryptJson,
  decryptString,
  encryptBytes,
  encryptJson,
  encryptString,
} from "./encryption.js";

export {
  base64ToBytes,
  bytesToBase64,
  bytesToString,
  stringToBytes,
} from "./encoding.js";

export { hashString, keyedHash } from "./hash.js";

export {
  generateEncryptionKey,
  generateEncryptionKeyBase64,
  generateRandomBytes,
  generateRandomToken,
} from "./random.js";

export { ENCRYPTION_ALGORITHM, ENCRYPTION_VERSION } from "./types.js";

export type {
  DecryptOptions,
  EncryptedPayload,
  EncryptionAlgorithm,
  EncryptOptions,
} from "./types.js";
