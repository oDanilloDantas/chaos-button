# 0001. Stack: Next.js + OpenNext em Cloudflare Workers

Date: 2026-06-23
Status: Accepted

## Context

Precisamos de uma landing de conversão rápida e com SSR (para renderizar o preço
dinâmico no servidor, sem flash e indexável) e de um backend leve para um proxy de
captura de leads que esconda o endpoint do n8n. O produto vai crescer para pagamento
(Stripe) e área de membros, então a base precisa suportar rotas de servidor.

## Decision

Usamos **Next.js (App Router) + React + TypeScript em modo strict**, com deploy em
**Cloudflare Workers via `@opennextjs/cloudflare`** e `wrangler`. As Route Handlers
rodam no Worker, com acesso a secrets via `getCloudflareContext()`.

## Consequences

- SSR e distribuição global na edge, com cold start baixo.
- O proxy de captura roda no mesmo app, lendo o secret do n8n sem expô-lo ao browser.
- Ficamos acoplados ao ecossistema Next + Cloudflare (build via OpenNext).
- `next dev` cobre o desenvolvimento local; `wrangler dev` valida o Worker real.

## Alternatives considered

- **SPA (Vite/React)**: sem SSR; preço e SEO ficariam piores.
- **Astro**: ótimo para conteúdo, menos natural para o fluxo dinâmico que vem por aí.
- **`next-on-pages`**: caminho descontinuado em favor de `@opennextjs/cloudflare`.
- **Vercel**: bom DX, mas preferimos manter borda e custo na Cloudflare.
