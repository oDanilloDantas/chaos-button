// Dynamic pricing for the club.
//
// The price scales per member and locks at the moment each member joins
// (grandfathered): price = base + step * N.
//
// INVARIANT: the price is monotonic — it only ever goes up and must never
// regress, even if members churn. In phase 1, N comes from config below.
// In phase 2 it is replaced by a monotonic price-position counter (a value
// that increments on each new join and never decreases on cancellation).

export const PRICING = {
  base: 10,
  step: 5,
  currency: "BRL",
  locale: "pt-BR",
} as const;

/** Normalizes any input into a non-negative integer member count. */
function normalizeCount(memberCount: number): number {
  if (!Number.isFinite(memberCount) || memberCount <= 0) {
    return 0;
  }
  return Math.floor(memberCount);
}

/** Price for the next member to join, given how many already joined. */
export function computeCurrentPrice(memberCount: number): number {
  return PRICING.base + PRICING.step * normalizeCount(memberCount);
}

/** Formats a price in BRL, without decimals (all values are whole). */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat(PRICING.locale, {
    style: "currency",
    currency: PRICING.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Reads the current member count from the environment (phase 1 source). */
export function getMemberCount(): number {
  const raw = process.env.PRICING_MEMBER_COUNT;
  return normalizeCount(raw ? Number.parseInt(raw, 10) : 0);
}
