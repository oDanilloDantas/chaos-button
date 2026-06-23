import { describe, expect, it } from "vitest";
import { PRICING, computeCurrentPrice, formatPrice } from "./pricing";

describe("computeCurrentPrice", () => {
  it("returns the base price for the first member (count 0)", () => {
    expect(computeCurrentPrice(0)).toBe(10);
  });

  it("adds one step per member already joined", () => {
    expect(computeCurrentPrice(1)).toBe(15);
    expect(computeCurrentPrice(2)).toBe(20);
    expect(computeCurrentPrice(10)).toBe(60);
  });

  it("scales linearly without a cap", () => {
    expect(computeCurrentPrice(1000)).toBe(PRICING.base + PRICING.step * 1000);
  });

  it("floors fractional counts", () => {
    expect(computeCurrentPrice(3.9)).toBe(computeCurrentPrice(3));
  });

  it("never drops below the base for invalid or negative input", () => {
    expect(computeCurrentPrice(-5)).toBe(10);
    expect(computeCurrentPrice(Number.NaN)).toBe(10);
    expect(computeCurrentPrice(Number.POSITIVE_INFINITY)).toBe(10);
  });
});

describe("formatPrice", () => {
  it("formats as BRL currency with the real symbol", () => {
    const formatted = formatPrice(10).replace(/ | /g, " ");
    expect(formatted).toContain("R$");
    expect(formatted).toContain("10");
  });

  it("renders whole values without decimals", () => {
    expect(formatPrice(15)).not.toContain(",");
  });
});
