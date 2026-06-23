# 0004. Captura de leads via proxy server-side + anti-abuse

Date: 2026-06-23
Status: Accepted

## Context

A landing captura leads (nome, WhatsApp, e-mail) e os envia para um fluxo no n8n. O
endpoint do n8n não pode ficar exposto no frontend, e o formulário recebe tráfego pago
— alvo natural de bots e spam.

## Decision

O formulário envia para uma rota interna (`/api/lead`) que roda no Worker e repassa o
payload ao n8n. O endpoint do n8n fica em um secret (`N8N_CAPTURE_URL`), nunca no
bundle do cliente.

Proteção do endpoint, sem widget de CAPTCHA (zero atrito):
- **Same-origin**: o host do `Origin`/`Referer` precisa bater com o host da requisição.
- **Honeypot**: campo oculto que, se preenchido, descarta o envio.
- **Rate-limit**: janela fixa por IP no Worker (best-effort), complementado por regra
  de Rate Limiting da Cloudflare na rota.
- **Validação**: o payload é validado com zod no servidor antes de repassar.

## Consequences

- O endpoint do n8n nunca aparece no browser.
- Sem fricção de UX (nenhum desafio visível).
- Proteção média: bots determinados ainda passam. Se o volume de abuso exigir,
  adicionamos Cloudflare Turnstile (já previsto no roadmap).
- O rate-limit em memória é por isolate; a regra de WAF é a linha principal.

## Alternatives considered

- **POST direto do front para o n8n**: expõe o endpoint e remove qualquer controle.
- **Cloudflare Turnstile agora**: melhor proteção, mas adiciona fricção e dependência
  de chaves; adiado.
