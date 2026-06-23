import {
  AsYouType,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber,
  type CountryCode,
} from "libphonenumber-js";

/** Masks the national number as the user types, per the selected country. */
export function formatAsYouType(input: string, country: CountryCode): string {
  return new AsYouType(country).input(input);
}

/** Whether the national number is a valid phone number for the country. */
export function isValidPhone(input: string, country: CountryCode): boolean {
  if (!input.trim()) {
    return false;
  }
  try {
    return isValidPhoneNumber(input, country);
  } catch {
    // Malformed input is simply invalid.
    return false;
  }
}

/** Returns the number in E.164 without the leading "+", or null if invalid. */
export function toE164NoPlus(input: string, country: CountryCode): string | null {
  try {
    const parsed = parsePhoneNumber(input, country);
    if (!parsed?.isValid()) {
      return null;
    }
    return parsed.number.replace(/^\+/, "");
  } catch {
    // parsePhoneNumber throws on unparseable input.
    return null;
  }
}

/** The international calling code (DDI) for a country, e.g. "55" for BR. */
export function callingCode(country: CountryCode): string {
  try {
    return getCountryCallingCode(country);
  } catch {
    return "";
  }
}
