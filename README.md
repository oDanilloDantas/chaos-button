# Botão do Caos

Landing de conversão do clube **Botão do Caos** — comunidade seletíssima com preço
dinâmico que sobe a cada novo membro. Esta fase entrega a landing e a captação de
leads (lista de espera); pagamento (Stripe) e área de membros vêm a seguir.

## Como rodar

```bash
npm install
cp .dev.vars.example .dev.vars   # preencha N8N_CAPTURE_URL
npm run dev                      # http://localhost:3000
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (Next) |
| `npm run preview` | Build OpenNext + Worker local (wrangler) |
| `npm run deploy` | Build OpenNext + deploy na Cloudflare |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sem emitir |
| `npm test` | Testes (Vitest) |

## Stack

Next.js (App Router) · TypeScript strict · Cloudflare Workers (OpenNext) · CSS Modules
· libphonenumber-js · zod · Vitest.

Detalhes em [`ARCHITECTURE.md`](ARCHITECTURE.md) e nas decisões em
[`docs/decisions`](docs/decisions).
