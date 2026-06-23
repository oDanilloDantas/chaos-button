import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";

export type Country = {
  code: CountryCode;
  name: string;
  dialCode: string;
  flag: string;
};

export const DEFAULT_COUNTRY: CountryCode = "BR";

/** Builds the flag emoji from an ISO country code via regional indicators. */
function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(0x1f1e6 + ch.charCodeAt(0) - 65));
}

function buildCountries(): Country[] {
  const names = new Intl.DisplayNames(["pt-BR"], { type: "region" });
  const list: Country[] = [];
  for (const code of getCountries()) {
    const name = names.of(code);
    if (!name || name === code) {
      continue;
    }
    list.push({ code, name, dialCode: getCountryCallingCode(code), flag: flagEmoji(code) });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export const COUNTRIES: Country[] = buildCountries();

export function findCountry(code: CountryCode): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

/** Filters countries by name, dial code or ISO code. */
export function searchCountries(query: string): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return COUNTRIES;
  }
  const digits = q.replace(/\D/g, "");
  return COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (digits.length > 0 && c.dialCode.includes(digits)) ||
      c.code.toLowerCase() === q,
  );
}
