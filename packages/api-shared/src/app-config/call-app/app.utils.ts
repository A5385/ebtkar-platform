import * as dotenv from "dotenv";
dotenv.config();

export const env = process.env;

export function normalizePrefix(value: string): string {
  return String(value ?? "").replace(/^\/+|\/+$/g, "");
}

export function parsePort(
  value: string | undefined,
  variableName: string,
): number {
  const parsedPort = Number(value);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error(
      `${variableName} must be a valid positive integer. Received: ${value}`,
    );
  }

  return parsedPort;
}
