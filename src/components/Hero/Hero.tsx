import { PRICING, formatPrice } from "@/lib/pricing";
import { WaitlistCta } from "../WaitlistCta/WaitlistCta";
import styles from "./Hero.module.css";

export function Hero({ price }: { price: string }) {
  const step = formatPrice(PRICING.step);

  return (
    <section className={styles.hero}>
      <div className={styles.aura} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.brandName}>Botão do Caos</span>
        </div>

        <h1 className={styles.headline}>
          Você não precisa de mais um curso.
          <span className={styles.headlineAccent}>Você precisa da verdade.</span>
        </h1>

        <div className={styles.priceBlock}>
          <span className={styles.priceTag}>Preço dinâmico</span>
          <p className={styles.price}>
            <span className={styles.priceValue}>{price}</span>
            <span className={styles.pricePer}>/mês</span>
          </p>
          <p className={styles.priceNote}>
            O preço sobe {step} a cada novo membro. Entre agora e trave o seu para sempre.
          </p>
        </div>

        <WaitlistCta label="Entrar no Club →" />

        <a className={styles.scroll} href="#beneficios">
          <span>Conheça os benefícios</span>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 3v10M3.5 8.5 8 13l4.5-4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
