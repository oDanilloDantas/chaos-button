import { describe, expect, it } from "vitest";
import { checkRateLimit, isSameOriginRequest } from "./leadGuard";

describe("isSameOriginRequest", () => {
  it("accepts a matching Origin host", () => {
    expect(
      isSameOriginRequest(
        "https://caos.andremariga.com.br",
        null,
        "caos.andremariga.com.br",
      ),
    ).toBe(true);
  });

  it("accepts the workers.dev host and localhost", () => {
    expect(
      isSameOriginRequest("https://chaos-button.workers.dev", null, "chaos-button.workers.dev"),
    ).toBe(true);
    expect(isSameOriginRequest("http://localhost:3000", null, "localhost:3000")).toBe(true);
  });

  it("rejects a foreign origin", () => {
    expect(
      isSameOriginRequest("https://evil.example", null, "caos.andremariga.com.br"),
    ).toBe(false);
  });

  it("falls back to Referer when Origin is missing", () => {
    expect(isSameOriginRequest(null, "https://caos.andremariga.com.br/", "caos.andremariga.com.br")).toBe(
      true,
    );
  });

  it("rejects when origin/referer or host is missing or malformed", () => {
    expect(isSameOriginRequest(null, null, "caos.andremariga.com.br")).toBe(false);
    expect(isSameOriginRequest("not a url", null, "caos.andremariga.com.br")).toBe(false);
    expect(isSameOriginRequest("https://caos.andremariga.com.br", null, null)).toBe(false);
  });
});

describe("checkRateLimit", () => {
  it("allows up to the max within the window and blocks the next", () => {
    const store = new Map<string, number[]>();
    const now = 1_000_000;
    for (let i = 0; i < 5; i += 1) {
      expect(checkRateLimit(store, "ip", now, 60_000, 5)).toBe(true);
    }
    expect(checkRateLimit(store, "ip", now, 60_000, 5)).toBe(false);
  });

  it("resets after the window passes", () => {
    const store = new Map<string, number[]>();
    expect(checkRateLimit(store, "ip", 0, 60_000, 1)).toBe(true);
    expect(checkRateLimit(store, "ip", 30_000, 60_000, 1)).toBe(false);
    expect(checkRateLimit(store, "ip", 61_000, 60_000, 1)).toBe(true);
  });

  it("isolates limits per key", () => {
    const store = new Map<string, number[]>();
    expect(checkRateLimit(store, "a", 0, 60_000, 1)).toBe(true);
    expect(checkRateLimit(store, "b", 0, 60_000, 1)).toBe(true);
  });
});
