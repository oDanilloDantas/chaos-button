import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { leadPayloadSchema } from "@/lib/lead";
import { checkRateLimit, isSameOriginRequest } from "@/lib/leadGuard";

// Best-effort per-isolate rate limiting; see leadGuard for the rationale.
const rateStore = new Map<string, number[]>();

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function POST(request: Request): Promise<Response> {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!isSameOriginRequest(origin, referer, host)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (!checkRateLimit(rateStore, clientIp(request), Date.now())) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = leadPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 422 });
  }

  const { env } = getCloudflareContext();
  const endpoint = env.N8N_CAPTURE_URL;
  if (!endpoint) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!upstream.ok) {
      throw new Error(`Upstream responded with status ${upstream.status}`);
    }
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
