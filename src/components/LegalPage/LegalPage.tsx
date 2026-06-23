import { type ReactNode } from "react";
import { QueryPreservingLink } from "../QueryPreservingLink/QueryPreservingLink";
import styles from "./LegalPage.module.css";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <QueryPreservingLink href="/" className={styles.back}>
          ← Voltar
        </QueryPreservingLink>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.content}>{children}</div>
      </article>
    </main>
  );
}
