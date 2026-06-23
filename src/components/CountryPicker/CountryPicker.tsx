"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { type CountryCode } from "libphonenumber-js";
import { searchCountries } from "@/config/countries";
import styles from "./CountryPicker.module.css";

type Props = {
  selected: CountryCode;
  onSelect: (code: CountryCode) => void;
  onClose: () => void;
};

/** Mounted only while open, so each open starts with a fresh, empty search. */
export function CountryPicker({ selected, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    const focus = window.setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focus);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const results = useMemo(() => searchCountries(query), [query]);

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span id={titleId} className={styles.title}>
            Selecione o país
          </span>
          <input
            ref={inputRef}
            type="text"
            className={styles.search}
            placeholder="Buscar país ou código"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar país"
          />
        </div>
        <ul className={styles.list} role="listbox" aria-label="Países">
          {results.length === 0 ? (
            <li className={styles.empty}>Nenhum país encontrado.</li>
          ) : (
            results.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  className={styles.item}
                  data-selected={c.code === selected}
                  onClick={() => {
                    onSelect(c.code);
                    onClose();
                  }}
                >
                  <span className={styles.flag} aria-hidden="true">
                    {c.flag}
                  </span>
                  <span className={styles.name}>{c.name}</span>
                  <span className={styles.dial}>+{c.dialCode}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
