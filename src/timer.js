/**
 * Timer math — pure functions, no DOM access.
 *
 * All times are Unix epoch seconds (not milliseconds).
 * Duration is in seconds.
 */

/** Build timer state from URL search params. Returns null if params are missing. */
export function parseTimerParams(searchParams) {
  const s = Number(searchParams.get("s"));
  const d = Number(searchParams.get("d"));
  if (!s || !d || d <= 0) return null;
  return { start: s, duration: d };
}

/** Build URL search string for a timer. */
export function toSearchString(start, duration) {
  return `?s=${Math.floor(start)}&d=${Math.floor(duration)}`;
}

/** Seconds remaining (clamped to 0). */
export function remaining(start, duration, nowEpoch) {
  const end = start + duration;
  return Math.max(0, end - nowEpoch);
}

/** Format seconds into MM:SS (or HH:MM:SS when ≥ 1 hour). */
export function formatRemaining(seconds) {
  const s = Math.ceil(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
}

/** Current Unix epoch in seconds. */
export function nowEpoch() {
  return Date.now() / 1000;
}
