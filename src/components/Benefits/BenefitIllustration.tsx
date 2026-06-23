"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Benefits.module.css";

/**
 * Wraps a card illustration and draws it on once the card scrolls into view.
 * Progressive enhancement: with no JS the SVG renders fully drawn, and with
 * `prefers-reduced-motion` we skip the draw and just show the final state.
 * Animation classes are applied imperatively (no state) to avoid re-renders.
 */
export function BenefitIllustration({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const { armed, inView } = styles;
    if (!el || !armed || !inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add(armed);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add(inView);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={styles.illustration} aria-hidden="true">
      {children}
    </span>
  );
}
