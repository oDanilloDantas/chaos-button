import { describe, expect, it } from "vitest";
import { callingCode, formatAsYouType, isValidPhone, toE164NoPlus } from "./phone";
import { COUNTRIES, findCountry, searchCountries } from "@/config/countries";

describe("toE164NoPlus", () => {
  it("converts a valid BR mobile to E.164 without the plus", () => {
    expect(toE164NoPlus("11987654321", "BR")).toBe("5511987654321");
  });

  it("returns null for an invalid number", () => {
    expect(toE164NoPlus("123", "BR")).toBeNull();
    expect(toE164NoPlus("", "BR")).toBeNull();
  });
});

describe("isValidPhone", () => {
  it("accepts a valid BR mobile", () => {
    expect(isValidPhone("11987654321", "BR")).toBe(true);
  });

  it("rejects empty or malformed input", () => {
    expect(isValidPhone("", "BR")).toBe(false);
    expect(isValidPhone("11", "BR")).toBe(false);
  });
});

describe("formatAsYouType", () => {
  it("masks the BR national number", () => {
    expect(formatAsYouType("11987654321", "BR")).toContain("(11)");
  });
});

describe("callingCode", () => {
  it("returns the DDI for a country", () => {
    expect(callingCode("BR")).toBe("55");
    expect(callingCode("US")).toBe("1");
  });
});

describe("countries", () => {
  it("builds a non-empty, localized list including Brazil", () => {
    expect(COUNTRIES.length).toBeGreaterThan(100);
    const br = findCountry("BR");
    expect(br?.dialCode).toBe("55");
    expect(br?.name.toLowerCase()).toContain("brasil");
    expect(br?.flag).toBe("🇧🇷");
  });

  it("searches by name, dial code and ISO code", () => {
    expect(searchCountries("brasil").some((c) => c.code === "BR")).toBe(true);
    expect(searchCountries("55").some((c) => c.code === "BR")).toBe(true);
    expect(searchCountries("br").some((c) => c.code === "BR")).toBe(true);
  });
});
