export function normalizeErrorDetails(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }

  if (value instanceof Error) {
    return value.message;
  }

  if (typeof value === "string") {
    return value;
  }

  if (value === null || value === undefined) {
    return "Unknown error";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
