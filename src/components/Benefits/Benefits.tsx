import type { ReactNode } from "react";
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

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Bespoke monoline glyphs — one per benefit, mapped to its meaning.
const GLYPHS: Record<string, ReactNode> = {
  // Conversation — the one-on-one call.
  "01": (
    <Glyph>
      <path d="M6 4h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6l-5 4v-4H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
      <path d="M7.5 8.5h9M7.5 11.5h5" />
    </Glyph>
  ),
  // Waveform — the 100 audios.
  "02": (
    <Glyph>
      <path d="M4 10.5v3M7.5 7.5v9M11 9.5v5M14 5.5v13M17.5 8.5v7M21 10.5v3" />
    </Glyph>
  ),
  // Connected nodes — the community.
  "03": (
    <Glyph>
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="17" r="2" />
      <path d="M8 7h8M7.7 8.1 10.3 15.9M16.3 8.1 13.7 15.9" />
    </Glyph>
  ),
  // Calendar — the biweekly live meetings.
  "04": (
    <Glyph>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 9.5h16M8.5 3.5v4M15.5 3.5v4" />
      <circle cx="12" cy="14" r="1.25" fill="currentColor" stroke="none" />
    </Glyph>
  ),
  // Play in a frame — the exclusive videos.
  "05": (
    <Glyph>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M10.4 9.2 14.9 12l-4.5 2.8Z" />
    </Glyph>
  ),
  // Erlenmeyer flask — the Laboratories.
  "06": (
    <Glyph>
      <path d="M9 3.5h6M10.5 3.5v5.6L6.2 16.6a1.5 1.5 0 0 0 1.3 2.3h9a1.5 1.5 0 0 0 1.3-2.3L13.5 9.1V3.5" />
      <path d="M8 14.2h8" />
    </Glyph>
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
                <span className={styles.glyph}>{GLYPHS[b.n]}</span>
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
