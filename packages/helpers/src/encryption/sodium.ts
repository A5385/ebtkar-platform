import sodium from "libsodium-wrappers";

let initializationPromise: Promise<typeof sodium> | undefined;

/**
 * Initializes libsodium once and reuses the same promise.
 *
 * All cryptographic functions must wait for sodium.ready before use.
 */
export function getSodium(): Promise<typeof sodium> {
  if (!initializationPromise) {
    initializationPromise = sodium.ready.then(() => sodium);
  }

  return initializationPromise;
}
