import { QueryPreservingLink } from "../QueryPreservingLink/QueryPreservingLink";
import styles from "./Footer.module.css";

const LEGAL_LINKS = [
  { href: "/termos", label: "Termos de Uso" },
  { href: "/privacidade", label: "Políticas de Privacidade" },
  { href: "/reembolso", label: "Políticas de Reembolso" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          © {year} André Mariga. Todos os direitos reservados.
        </p>
        <nav className={styles.links} aria-label="Links legais">
          {LEGAL_LINKS.map((link, i) => (
            <span key={link.href} className={styles.linkItem}>
              {i > 0 ? <span className={styles.sep} aria-hidden="true" /> : null}
              <QueryPreservingLink href={link.href} className={styles.link}>
                {link.label}
              </QueryPreservingLink>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
