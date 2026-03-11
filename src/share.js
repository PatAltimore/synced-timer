import { toSearchString } from "./timer.js";

/** Build the full shareable URL for a timer. */
export function buildShareURL(start, duration) {
  const base = `${location.origin}${location.pathname}`;
  return `${base}${toSearchString(start, duration)}`;
}

/** Copy text to clipboard. Returns true on success. */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
