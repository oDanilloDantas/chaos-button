// Tracking params that must survive any navigation and reach the lead payload.
export const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_adset",
  "utm_content",
  "utm_placement",
  "utm_term",
  "utm_id",
  "gclid",
  "fbclid",
  "fbp",
  "fbc",
] as const;

export type TrackedParam = (typeof TRACKED_PARAMS)[number];

const STORAGE_PREFIX = "bdc:";

function toSearchParams(search: string): URLSearchParams {
  return new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
}

/**
 * Persists tracked params from a search string into storage (first-touch:
 * an existing stored value is never overwritten within the session).
 */
export function persistParams(search: string, storage: Storage): void {
  const params = toSearchParams(search);
  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value && !storage.getItem(STORAGE_PREFIX + key)) {
      storage.setItem(STORAGE_PREFIX + key, value);
    }
  }
}

/** Reads previously persisted tracked params from storage. */
export function readPersistedParams(storage: Storage): Partial<Record<TrackedParam, string>> {
  const out: Partial<Record<TrackedParam, string>> = {};
  for (const key of TRACKED_PARAMS) {
    const value = storage.getItem(STORAGE_PREFIX + key);
    if (value) {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Resolves tracked params for the payload: current URL values take precedence,
 * falling back to anything persisted in storage so nothing is ever lost.
 */
export function resolveTrackedParams(
  search: string,
  storage?: Storage,
): Partial<Record<TrackedParam, string>> {
  const out: Partial<Record<TrackedParam, string>> = storage
    ? readPersistedParams(storage)
    : {};
  const params = toSearchParams(search);
  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) {
      out[key] = value;
    }
  }
  return out;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) || href.startsWith("//");
}

/**
 * Returns an href that carries the current query string forward.
 * Internal links keep the full current query; external links keep only the
 * tracked params. The target's own query params always win on conflict.
 */
export function buildHref(
  target: string,
  currentSearch: string,
  options?: { external?: boolean },
): string {
  if (!target) {
    return target;
  }
  // Leave non-http schemes (mailto:, tel:, etc.) untouched.
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) && !isExternalHref(target)) {
    return target;
  }

  const external = options?.external ?? isExternalHref(target);
  const current = toSearchParams(currentSearch);
  const url = new URL(target, "http://_local_.invalid");

  const merged = new URLSearchParams();
  if (external) {
    for (const key of TRACKED_PARAMS) {
      const value = current.get(key);
      if (value) {
        merged.set(key, value);
      }
    }
  } else {
    current.forEach((value, key) => merged.set(key, value));
  }
  url.searchParams.forEach((value, key) => merged.set(key, value));

  const query = merged.toString();
  if (external) {
    url.search = query;
    return url.toString();
  }
  return `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
}
