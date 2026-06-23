# 0003. Preço por membro, travado no join e monotônico

Date: 2026-06-23
Status: Accepted

## Context

O Botão do Caos é um clube seletíssimo cujo apelo central é a escassez: o preço sobe
conforme o clube enche. Precisamos de um modelo que crie FOMO real e recompense quem
entra cedo.

## Decision

O preço mensal escala **por membro**: `preço = base + step × N`, com `base = R$10` e
`step = R$5`, **sem teto**. Cada membro **trava** o preço do momento em que entra
(grandfathered) e o mantém enquanto a assinatura estiver ativa.

O preço é **monotônico**: só sobe, nunca regride. `N` é uma posição de preço que só
incrementa a cada novo join — **não** o número de membros ativos (que cai com churn).

Na fase 1 (waitlist), `N` vem de configuração (`PRICING_MEMBER_COUNT`, padrão 0). Na
fase 2, `N` passa a vir de um contador só-incrementa, distinto do contador de membros
ativos usado para métricas.

## Consequences

- Mensagem de FOMO forte: "entre agora e trave o seu preço para sempre".
- No Stripe, cada membro terá um preço próprio definido no checkout (fase 2).
- Exige um contador monotônico confiável (Durable Object) como fonte do preço, separado
  da contagem de ativos.

## Alternatives considered

- **Preço fixo**: sem escassez, sem FOMO.
- **Por lote** (ex.: a cada 10 vagas): degraus maiores; optamos por granularidade
  por membro.
- **Flutuante para todos**: simples no Stripe, mas remove o gancho "trave seu preço" e
  gera atrito quando sobe.
