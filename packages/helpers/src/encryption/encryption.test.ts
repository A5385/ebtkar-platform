import { describe, expect, it } from "vitest";

import {
  decryptJson,
  decryptString,
  encryptJson,
  encryptString,
  generateEncryptionKey,
} from "../index.js";

describe("crypto helpers", () => {
  it("encrypts and decrypts a string", async () => {
    const key = await generateEncryptionKey();

    const encrypted = await encryptString("enterprise secret", key);

    const decrypted = await decryptString(encrypted, key);

    expect(decrypted).toBe("enterprise secret");
  });

  it("creates a different ciphertext each time", async () => {
    const key = await generateEncryptionKey();

    const first = await encryptString("same value", key);
    const second = await encryptString("same value", key);

    expect(first.nonce).not.toBe(second.nonce);
    expect(first.ciphertext).not.toBe(second.ciphertext);
  });

  it("encrypts and decrypts JSON", async () => {
    const key = await generateEncryptionKey();

    const value = {
      customerId: "customer-100",
      phone: "+971500000000",
    };

    const encrypted = await encryptJson(value, key);
    const decrypted = await decryptJson<typeof value>(encrypted, key);

    expect(decrypted).toEqual(value);
  });

  it("rejects a wrong key", async () => {
    const firstKey = await generateEncryptionKey();
    const secondKey = await generateEncryptionKey();

    const encrypted = await encryptString("confidential", firstKey);

    await expect(decryptString(encrypted, secondKey)).rejects.toThrow(
      "Decryption failed",
    );
  });

  it("rejects changed additional data", async () => {
    const key = await generateEncryptionKey();

    const encrypted = await encryptString("confidential", key, {
      additionalData: "tenant-1",
    });

    await expect(
      decryptString(encrypted, key, {
        additionalData: "tenant-2",
      }),
    ).rejects.toThrow("Decryption failed");
  });

  it("rejects tampered ciphertext", async () => {
    const key = await generateEncryptionKey();

    const encrypted = await encryptString("confidential", key);

    const tampered = {
      ...encrypted,
      ciphertext: `${encrypted.ciphertext.slice(0, -1)}A`,
    };

    await expect(decryptString(tampered, key)).rejects.toThrow(
      "Decryption failed",
    );
  });
});
