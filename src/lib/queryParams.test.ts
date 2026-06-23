import { beforeEach, describe, expect, it } from "vitest";
import { buildHref, persistParams, readPersistedParams, resolveTrackedParams } from "./queryParams";

function makeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      map.set(k, String(v));
    },
    removeItem: (k) => {
      map.delete(k);
    },
    clear: () => map.clear(),
    key: (i) => Array.from(map.keys())[i] ?? null,
    get length() {
      return map.size;
    },
  } as Storage;
}

describe("persistParams / readPersistedParams", () => {
  let storage: Storage;
  beforeEach(() => {
    storage = makeStorage();
  });

  it("persists tracked params from the search string", () => {
    persistParams("?utm_source=ig&fbclid=abc&foo=bar", storage);
    const stored = readPersistedParams(storage);
    expect(stored.utm_source).toBe("ig");
    expect(stored.fbclid).toBe("abc");
  });

  it("ignores untracked params", () => {
    persistParams("?foo=bar", storage);
    expect(readPersistedParams(storage)).toEqual({});
  });

  it("is first-touch: never overwrites an existing value in the session", () => {
    persistParams("?utm_source=first", storage);
    persistParams("?utm_source=second", storage);
    expect(readPersistedParams(storage).utm_source).toBe("first");
  });
});

describe("resolveTrackedParams", () => {
  it("prefers the current URL value over the persisted one", () => {
    const storage = makeStorage();
    persistParams("?utm_source=persisted", storage);
    const resolved = resolveTrackedParams("?utm_source=current", storage);
    expect(resolved.utm_source).toBe("current");
  });

  it("falls back to persisted values when the URL lost them", () => {
    const storage = makeStorage();
    persistParams("?utm_source=ig&gclid=xyz", storage);
    const resolved = resolveTrackedParams("", storage);
    expect(resolved.utm_source).toBe("ig");
    expect(resolved.gclid).toBe("xyz");
  });
});

describe("buildHref", () => {
  it("carries the full current query into an internal link", () => {
    const href = buildHref("/termos", "?utm_source=ig&fbclid=abc");
    const url = new URL(href, "http://x.invalid");
    expect(url.pathname).toBe("/termos");
    expect(url.searchParams.get("utm_source")).toBe("ig");
    expect(url.searchParams.get("fbclid")).toBe("abc");
  });

  it("keeps the target's own params and merges current ones", () => {
    const href = buildHref("/termos?foo=bar", "?utm_source=ig");
    const url = new URL(href, "http://x.invalid");
    expect(url.searchParams.get("foo")).toBe("bar");
    expect(url.searchParams.get("utm_source")).toBe("ig");
  });

  it("lets the target's params win on conflict", () => {
    const href = buildHref("/termos?utm_source=keep", "?utm_source=current");
    const url = new URL(href, "http://x.invalid");
    expect(url.searchParams.get("utm_source")).toBe("keep");
  });

  it("preserves the hash", () => {
    const href = buildHref("/termos#topo", "?utm_source=ig");
    expect(href).toContain("#topo");
  });

  it("only forwards tracked params to external links", () => {
    const href = buildHref("https://andremariga.com.br/", "?utm_source=ig&foo=bar");
    const url = new URL(href);
    expect(url.searchParams.get("utm_source")).toBe("ig");
    expect(url.searchParams.get("foo")).toBeNull();
  });

  it("leaves non-http schemes untouched", () => {
    expect(buildHref("mailto:hi@x.com", "?utm_source=ig")).toBe("mailto:hi@x.com");
  });

  it("returns a clean href when there is no current query", () => {
    expect(buildHref("/termos", "")).toBe("/termos");
  });
});
