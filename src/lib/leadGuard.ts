// Guards for the lead-capture proxy. Pure and testable; the route handler wires
// them to the incoming request.

/**
 * Same-origin check that is host-agnostic: the request's Origin (or Referer)
 * host must equal the request Host. This covers the custom domain, the
 * workers.dev URL and localhost without maintaining an allowlist.
 */
export function isSameOriginRequest(
  origin: string | null,
  referer: string | null,
  host: string | null,
): boolean {
  const candidate = origin ?? referer;
  if (!candidate || !host) {
    return false;
  }
  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_HITS = 5;

/**
 * Fixed-window, in-memory rate limit. Best-effort defense-in-depth at the
 * isolate level; Cloudflare WAF rate limiting on the route is the primary line.
 * Returns true when the request is allowed.
 */
export function checkRateLimit(
  store: Map<string, number[]>,
  key: string,
  now: number,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
  maxHits: number = RATE_LIMIT_MAX_HITS,
): boolean {
  const recent = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxHits) {
    store.set(key, recent);
    return false;
  }
  recent.push(now);
  store.set(key, recent);
  return true;
}
