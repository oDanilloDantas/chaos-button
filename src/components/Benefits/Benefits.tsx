import styles from "./Benefits.module.css";

type Benefit = {
  n: string;
  title: string;
  lines?: string[];
  bullets?: string[];
  footer?: string;
};

const BENEFITS: Benefit[] = [
  {
    n: "01",
    title:
      "One-on-one com André Mariga para falar sobre desenvolvimento pessoal, profissional ou qualquer tema de sua escolha.",
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
  },
  {
    n: "03",
    title:
      "Acesso a uma comunidade para trocar experiências, criar conexões reais e fazer networking.",
  },
  {
    n: "04",
    title: "Encontros ao vivo quinzenais em grupo com compartilhamento de conhecimento.",
  },
  {
    n: "05",
    title: "Vídeos exclusivos do André Mariga.",
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
  },
];

export function Benefits() {
  return (
    <section id="beneficios" className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title}>Benefícios de membro</h2>
          <p className={styles.subtitle}>
            Essas sessões, conteúdos e eventos não estão disponíveis fora do Club.
          </p>
        </header>

        <ol className={styles.grid}>
          {BENEFITS.map((b) => (
            <li key={b.n} className={styles.item}>
              <span className={styles.number} aria-hidden="true">
                {b.n}
              </span>
              <div className={styles.body}>
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
