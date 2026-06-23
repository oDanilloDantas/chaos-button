import { z } from "zod";
import { TRACKED_PARAMS, type TrackedParam } from "./queryParams";

export const PRODUCT = "botao_do_caos";
export const ORIGIN = "landingpage";

/** Visible fields validated on the client before submit. */
export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(120, "Nome muito longo."),
  email: z.string().trim().toLowerCase().pipe(z.email("E-mail inválido.")),
});

const trackedShape = Object.fromEntries(
  TRACKED_PARAMS.map((key) => [key, z.string().max(512).optional()]),
) as Record<TrackedParam, z.ZodOptional<z.ZodString>>;

/** Full payload validated on the server proxy before forwarding to n8n. */
export const leadPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  whatsapp: z.string().regex(/^\d{8,15}$/, "WhatsApp inválido."),
  product: z.literal(PRODUCT),
  origin: z.literal(ORIGIN),
  ...trackedShape,
});

export type LeadPayload = z.infer<typeof leadPayloadSchema>;

export type LeadFormInput = {
  name: string;
  email: string;
  /** E.164 without the leading "+". */
  whatsapp: string;
};

/** Assembles the lead payload from form values and resolved tracking params. */
export function buildLeadPayload(
  form: LeadFormInput,
  tracked: Partial<Record<TrackedParam, string>>,
): LeadPayload {
  const payload: Record<string, string> = {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    whatsapp: form.whatsapp,
    product: PRODUCT,
    origin: ORIGIN,
  };
  for (const key of TRACKED_PARAMS) {
    const value = tracked[key];
    if (value) {
      payload[key] = value;
    }
  }
  return payload as LeadPayload;
}
