# Arquitetura — Botão do Caos

Landing de conversão do clube **Botão do Caos**. Fase atual: captação de leads
(lista de espera). Pagamento (Stripe) e área de membros vêm nas próximas fases.

## Stack

- **Next.js (App Router) + React + TypeScript strict**
- **Cloudflare Workers** via **`@opennextjs/cloudflare`** + `wrangler`
- **CSS Modules** + design tokens (tema dark-first), fonte **Inter** (`next/font`)
- **libphonenumber-js** (telefone) e **zod** (validação cliente + servidor)
- **GTM** + **Cloudflare Web Analytics**
- **Vitest** para testes

Decisões registradas em [`docs/decisions`](docs/decisions).

## Estrutura

```
src/
  app/
    layout.tsx            # Inter, metadata/OG, GTM, provider de query params
    page.tsx              # landing (SSR do preço)
    api/lead/route.ts     # proxy server-side → n8n
    termos|privacidade|reembolso/  # páginas legais (stub)
  components/
    Hero/ Benefits/ Footer/
    WaitlistCta/ WaitlistModal/    # CTA e modal de lista de espera
    PhoneField/ CountryPicker/     # WhatsApp com DDI e validação
    QueryParamsProvider/ QueryPreservingLink/
    Analytics/ LegalPage/
  lib/
    pricing.ts            # preço dinâmico
    phone.ts              # E.164 sem "+"
    lead.ts               # schemas zod + payload
    leadGuard.ts          # same-origin + rate-limit
    queryParams.ts        # preservação de UTMs/click ids
    analytics.ts          # dataLayer
  config/
    countries.ts          # lista de países (nome pt-BR, DDI, bandeira)
```

## Fluxos

### Preço dinâmico

`preço = base + step × N` (`base = R$10`, `step = R$5`, sem teto). O preço trava no
momento da entrada e é monotônico — nunca regride. Renderizado no servidor (SSR) a
partir de `getMemberCount()` (hoje configurável via `PRICING_MEMBER_COUNT`). Ver
[ADR 0003](docs/decisions/0003-pricing-per-member-locked.md).

### Captura de leads

Browser → `/api/lead` (mesmo host) → n8n. O endpoint do n8n é um secret do Worker
(`N8N_CAPTURE_URL`) e nunca chega ao cliente. A rota valida same-origin, aplica
honeypot e rate-limit, valida o payload com zod e repassa. Ver
[ADR 0004](docs/decisions/0004-lead-capture-proxy-and-antiabuse.md).

### Tracking

Os parâmetros de campanha (UTMs, `gclid`, `fbclid`, `fbp`, `fbc`) são preservados em
toda navegação (links + sessionStorage) e enviados no payload. Campos ocultos no DOM
permitem o GTM populá-los; `product` e `origin` são fixos. O GTM gerencia o Meta Pixel
e demais tags; o código apenas dispara `open_waitlist_modal` e `lead_submitted` no
dataLayer.

## Variáveis de ambiente

| Variável                      | Escopo              | Descrição                                        |
| ----------------------------- | ------------------- | ------------------------------------------------ |
| `N8N_CAPTURE_URL`             | secret (Worker)     | Webhook do n8n que recebe os leads               |
| `NEXT_PUBLIC_GTM_ID`          | público             | ID do container GTM (`GTM-XXXX`)                 |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | público (opcional)  | Token do Cloudflare Web Analytics                |
| `NEXT_PUBLIC_SITE_URL`        | público             | URL canônica (`https://caos.andremariga.com.br`) |
| `PRICING_MEMBER_COUNT`        | servidor (opcional) | Contagem atual (padrão `0`)                      |

Localmente, copie `.dev.vars.example` para `.dev.vars`. Em produção, use
`wrangler secret put N8N_CAPTURE_URL`.

## Como rodar

```bash
npm install
cp .dev.vars.example .dev.vars   # preencha N8N_CAPTURE_URL
npm run dev                      # http://localhost:3000
```

Outros comandos: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
Para validar o Worker real: `npm run preview` (build OpenNext + wrangler).

## Deploy

Cloudflare Workers via OpenNext. O domínio `caos.andremariga.com.br` é configurado como
Custom Domain no painel da Cloudflare; o link `*.workers.dev` permanece ativo
(`workers_dev: true`). A rota `/api/lead` deve ter uma regra de Rate Limiting no WAF.

## Segurança

Headers (CSP, HSTS, nosniff, frame/referrer) em `next.config.ts`. A CSP é permissiva o
suficiente para as tags gerenciadas no GTM e o Cloudflare Analytics, restringindo
framing, `base-uri` e `form-action`. Sem secrets no repositório.
