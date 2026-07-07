/**
 * Shared HTTP helpers for live-data providers.
 *
 * Every provider follows the same contract: attempt the live upstream call,
 * and on any failure (missing key, network error, bad shape, timeout) return
 * `null` so the caller can fall back to deterministic mock data. This keeps the
 * app fully functional offline / without API keys while lighting up real data
 * the moment a source is reachable.
 */

type CacheEntry = { value: unknown; expires: number };

// Persist the cache across hot-reloads in dev.
const globalForCache = globalThis as unknown as { __eagleCache?: Map<string, CacheEntry> };
const cache: Map<string, CacheEntry> = globalForCache.__eagleCache ?? new Map();
globalForCache.__eagleCache = cache;

const DEFAULT_TTL = Number(process.env.MARKET_DATA_CACHE_SECONDS ?? 300);
const DEFAULT_TIMEOUT_MS = 8000;

export type FetchJsonOptions = {
  ttlSeconds?: number;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

/**
 * Fetch JSON with a timeout and an in-memory TTL cache. Returns `null` on any
 * failure instead of throwing, so providers can fall back cleanly.
 */
export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T | null> {
  const ttl = (options.ttlSeconds ?? DEFAULT_TTL) * 1000;
  const now = Date.now();

  const cached = cache.get(url);
  if (cached && cached.expires > now) {
    return cached.value as T;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...options.headers
      }
    });
    if (!response.ok) return null;
    const value = (await response.json()) as T;
    cache.set(url, { value, expires: now + ttl });
    return value;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Fetch raw text (used for a couple of non-JSON upstreams). */
export async function fetchText(url: string, options: FetchJsonOptions = {}): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: options.headers
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Run an async live-data resolver, falling back to `fallback` on null/throw. */
export async function withFallback<T>(resolver: () => Promise<T | null>, fallback: T): Promise<T> {
  try {
    const value = await resolver();
    if (value == null) return fallback;
    if (Array.isArray(value) && value.length === 0) return fallback;
    return value;
  } catch {
    return fallback;
  }
}

/** SEC EDGAR requires a descriptive User-Agent with contact info. */
export const SEC_USER_AGENT =
  process.env.SEC_EDGAR_USER_AGENT ?? "Eagle Quantitative Terminal contact@eaglequant.app";
