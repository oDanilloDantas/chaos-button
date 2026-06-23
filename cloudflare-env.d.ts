// Bindings and secrets exposed to the Worker via getCloudflareContext().env.
// Secrets are provided by .dev.vars (local) and `wrangler secret put` (prod),
// never committed and never declared in wrangler.jsonc.
interface CloudflareEnv {
  /** n8n webhook endpoint that receives waitlist leads. Secret. */
  N8N_CAPTURE_URL: string;
}
