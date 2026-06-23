import type { ReactNode } from "react";
import { BenefitIllustration } from "./BenefitIllustration";
import styles from "./Benefits.module.css";

// Value anchor shown at the foot of each card: either what the benefit
// costs outside the Club, or that it simply does not exist outside it.
type Flag = { kind: "price"; value: string } | { kind: "exclusive" };

type Benefit = {
  n: string;
  title: string;
  lines?: string[];
  bullets?: string[];
  footer?: string;
  flag: Flag;
};

const BENEFITS: Benefit[] = [
  {
    n: "01",
    title:
      "One-on-one com André Mariga para falar sobre desenvolvimento pessoal, profissional ou qualquer tema de sua escolha.",
    flag: { kind: "price", value: "R$ 3.500 a sessão" },
  },
  {
    n: "02",
    title: "100 áudios que ninguém quer ouvir.",
    lines: [
      "Porque as verdades que transformam são sempre as que machucam.",
      "A maioria não vai além da Faixa 1.",
      "Alguns poucos chegam até a Faixa 7.",
      "Você será um deles?",
    ],
    flag: { kind: "exclusive" },
  },
  {
    n: "03",
    title:
      "Acesso a uma comunidade para trocar experiências, criar conexões reais e fazer networking.",
    flag: { kind: "exclusive" },
  },
  {
    n: "04",
    title: "Encontros ao vivo quinzenais em grupo com compartilhamento de conhecimento.",
    flag: { kind: "exclusive" },
  },
  {
    n: "05",
    title: "Vídeos exclusivos do André Mariga.",
    flag: { kind: "exclusive" },
  },
  {
    n: "06",
    title:
      "Acesso aos Laboratórios, criados pelo André Mariga, enquanto sua assinatura do Botão do Caos estiver ativa.",
    bullets: [
      "Laboratório Pessoal é um ambiente seleto e contínuo de desenvolvimento emocional.",
      "Laboratório Profissional é um ambiente seleto e contínuo de desenvolvimento profissional.",
    ],
    footer: "Ambos com protocolos semanais, exercícios práticos e diagnóstico direto.",
    flag: { kind: "price", value: "R$ 1.000/ano cada" },
  },
];

// Larger line illustration shared frame: 56px, monoline, gold (currentColor).
function Illustration({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Bespoke animated line illustrations, one per benefit. Each line draws itself
// on scroll-in (data-draw) with accent marks popping after (data-pop); on hover
// each gets its own signature motion (data-typing/node/beat/play/bubble).
const ILLUSTRATIONS: Record<string, ReactNode> = {
  // 01 — a video call: a person on screen with a live dot that pulses on hover.
  "01": (
    <Illustration>
      <rect data-draw pathLength={1} x="10" y="12" width="36" height="32" rx="5" />
      <circle data-draw pathLength={1} cx="25" cy="26" r="4.5" />
      <path data-draw pathLength={1} d="M16 40c1-5.6 5-8.6 9-8.6s8 3 9 8.6" />
      <circle data-pop data-live cx="39" cy="18" r="2" fill="currentColor" stroke="none" />
    </Illustration>
  ),
  // 02 — an equalizer whose bars rise as it enters, then dance on hover.
  "02": (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      <g className={styles.bars} fill="currentColor">
        <rect x="5.5" y="19" width="3" height="18" rx="1.5" />
        <rect x="12.5" y="13" width="3" height="30" rx="1.5" />
        <rect x="19.5" y="7" width="3" height="42" rx="1.5" />
        <rect x="26.5" y="16" width="3" height="24" rx="1.5" />
        <rect x="33.5" y="10" width="3" height="36" rx="1.5" />
        <rect x="40.5" y="18" width="3" height="20" rx="1.5" />
        <rect x="47.5" y="14" width="3" height="28" rx="1.5" />
      </g>
    </svg>
  ),
  // 03 — three nodes that connect, then pulse in sequence on hover.
  "03": (
    <Illustration>
      <path data-draw pathLength={1} d="M20.5 17H35.5M18 21 26 37M38 21 30 37" />
      <circle data-pop data-node cx="16" cy="17" r="4.5" />
      <circle data-pop data-node cx="40" cy="17" r="4.5" />
      <circle data-pop data-node cx="28" cy="41" r="4.5" />
    </Illustration>
  ),
  // 04 — a calendar whose marked date beats on hover.
  "04": (
    <Illustration>
      <rect data-draw pathLength={1} x="11" y="13" width="34" height="32" rx="4" />
      <path data-draw pathLength={1} d="M11 22H45M20 9V16M36 9V16" />
      <rect
        data-pop
        data-beat
        x="25"
        y="29"
        width="6"
        height="6"
        rx="1.5"
        fill="currentColor"
        stroke="none"
      />
    </Illustration>
  ),
  // 05 — a framed play mark that pulses on hover.
  "05": (
    <Illustration>
      <rect data-draw pathLength={1} x="9" y="13" width="38" height="30" rx="5" />
      <path data-pop data-play d="M24 22 34 28 24 34Z" fill="currentColor" stroke="none" />
    </Illustration>
  ),
  // 06 — an Erlenmeyer flask with a bubble that rises on hover.
  "06": (
    <Illustration>
      <path
        data-draw
        pathLength={1}
        d="M21 9H35M24 9v12L13.5 39a3 3 0 0 0 2.6 4.6H39.9a3 3 0 0 0 2.6-4.6L32 21V9"
      />
      <path data-draw pathLength={1} d="M18 33H38" />
      <circle data-bubble cx="28" cy="37" r="1.6" fill="currentColor" stroke="none" opacity="0" />
    </Illustration>
  ),
};

export function Benefits() {
  return (
    <section id="beneficios" className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title}>Benefícios de membro</h2>
          <p className={styles.subtitle}>
            Alguns desses benefícios, conteúdos e eventos são exclusivos e não estão disponíveis
            fora do Club.
          </p>
        </header>

        <ol className={styles.grid}>
          {BENEFITS.map((b) => (
            <li key={b.n} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={styles.number} aria-hidden="true">
                  {b.n}
                </span>
                <BenefitIllustration>{ILLUSTRATIONS[b.n]}</BenefitIllustration>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.itemTitle}>{b.title}</h3>
                {b.lines?.map((line, i) => (
                  <p key={i} className={styles.line}>
                    {line}
                  </p>
                ))}
                {b.bullets ? (
                  <ul className={styles.bullets}>
                    {b.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {b.footer ? <p className={styles.footnote}>{b.footer}</p> : null}
              </div>

              <div className={styles.flag}>
                {b.flag.kind === "price" ? (
                  <>
                    <span className={styles.flagLabel}>Fora do Club</span>
                    <span className={styles.flagValue}>{b.flag.value}</span>
                  </>
                ) : (
                  <span className={styles.flagExclusive}>Exclusivo do Club</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
