# 0002. Sem Docker: deploy edge

Date: 2026-06-23
Status: Accepted

## Context

A aplicação roda na edge (Cloudflare Workers) e, na fase atual, não tem nenhum
serviço local com estado: o n8n é externo e o Stripe entra depois. Containerizar um
app que só compila para o Worker não traz benefício real.

## Decision

Não usamos Docker nem docker-compose. A infraestrutura é Cloudflare/OpenNext/wrangler;
o desenvolvimento local é `next dev` com secrets em `.dev.vars`.

## Consequences

- Setup mais simples: clonar, instalar, copiar `.dev.vars.example` e rodar.
- Sem `Dockerfile`/`.dockerignore` para manter.
- Quando surgir um serviço com estado (banco próprio, fila), reavaliamos esta decisão.

## Alternatives considered

- **Docker Compose para dev**: padrão quando há banco/cache locais; aqui seria
  over-engineering, já que não existe serviço local para orquestrar.
