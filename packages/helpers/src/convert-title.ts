export function convertTitle(txt: string): string {
  return txt
    .split(/[-_\s]+/)
    .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
    .join(" ");
}
