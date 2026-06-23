import { describe, expect, it } from "vitest";
import { ORIGIN, PRODUCT, buildLeadPayload, leadPayloadSchema } from "./lead";

describe("buildLeadPayload", () => {
  it("sets the fixed product and origin", () => {
    const payload = buildLeadPayload(
      { name: "Maria", email: "MARIA@EXEMPLO.COM", whatsapp: "5511987654321" },
      {},
    );
    expect(payload.product).toBe(PRODUCT);
    expect(payload.origin).toBe(ORIGIN);
  });

  it("normalizes name and email", () => {
    const payload = buildLeadPayload(
      { name: "  Maria  ", email: "  Maria@Exemplo.com ", whatsapp: "5511987654321" },
      {},
    );
    expect(payload.name).toBe("Maria");
    expect(payload.email).toBe("maria@exemplo.com");
  });

  it("includes only the tracking params that have values", () => {
    const payload = buildLeadPayload(
      { name: "Maria", email: "maria@exemplo.com", whatsapp: "5511987654321" },
      { utm_source: "ig", fbclid: "abc" },
    );
    expect(payload.utm_source).toBe("ig");
    expect(payload.fbclid).toBe("abc");
    expect(payload.gclid).toBeUndefined();
  });

  it("produces a payload that passes the server schema", () => {
    const payload = buildLeadPayload(
      { name: "Maria", email: "maria@exemplo.com", whatsapp: "5511987654321" },
      { utm_source: "ig" },
    );
    expect(leadPayloadSchema.safeParse(payload).success).toBe(true);
  });
});

describe("leadPayloadSchema", () => {
  const valid = {
    name: "Maria",
    email: "maria@exemplo.com",
    whatsapp: "5511987654321",
    product: PRODUCT,
    origin: ORIGIN,
  };

  it("rejects an invalid email", () => {
    expect(leadPayloadSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("rejects a whatsapp that is not E.164 digits", () => {
    expect(leadPayloadSchema.safeParse({ ...valid, whatsapp: "+55 11 9" }).success).toBe(false);
  });

  it("rejects a wrong product/origin", () => {
    expect(leadPayloadSchema.safeParse({ ...valid, product: "other" }).success).toBe(false);
    expect(leadPayloadSchema.safeParse({ ...valid, origin: "other" }).success).toBe(false);
  });
});
