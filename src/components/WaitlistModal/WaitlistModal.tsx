"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { type CountryCode } from "libphonenumber-js";
import { DEFAULT_COUNTRY } from "@/config/countries";
import { isValidPhone, toE164NoPlus } from "@/lib/phone";
import {
  ORIGIN,
  PRODUCT,
  buildLeadPayload,
  leadFormSchema,
  type LeadFormInput,
} from "@/lib/lead";
import {
  TRACKED_PARAMS,
  resolveTrackedParams,
  type TrackedParam,
} from "@/lib/queryParams";
import { pushDataLayer } from "@/lib/analytics";
import { PhoneField } from "../PhoneField/PhoneField";
import styles from "./WaitlistModal.module.css";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "whatsapp", string>>;

function safeResolveTracked(): Partial<Record<TrackedParam, string>> {
  try {
    return resolveTrackedParams(window.location.search, window.sessionStorage);
  } catch {
    return resolveTrackedParams(window.location.search);
  }
}

export function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const focus = window.setTimeout(() => nameRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.clearTimeout(focus);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const parsed = leadFormSchema.safeParse({ name, email });
    const nextErrors: FieldErrors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "name" || field === "email") {
          nextErrors[field] = issue.message;
        }
      }
    }
    if (!isValidPhone(phone, country)) {
      nextErrors.whatsapp = "Informe um WhatsApp válido.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const whatsapp = toE164NoPlus(phone, country);
    if (!whatsapp) {
      setErrors({ whatsapp: "Informe um WhatsApp válido." });
      return;
    }

    const formData = new FormData(form);
    const honeypot = formData.get("company");
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      setStatus("success");
      return;
    }

    const tracked = safeResolveTracked();
    for (const key of TRACKED_PARAMS) {
      const value = formData.get(key);
      if (typeof value === "string" && value.trim().length > 0) {
        tracked[key] = value.trim();
      }
    }

    const input: LeadFormInput = { name, email, whatsapp };
    const payload = buildLeadPayload(input, tracked);

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`Lead request failed with status ${res.status}`);
      }
      setStatus("success");
      pushDataLayer("lead_submitted", { product: PRODUCT, origin: ORIGIN });
    } catch {
      setStatus("error");
    }
  }

  const submitting = status === "submitting";

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {status === "success" ? (
          <div className={styles.success} role="status">
            <div className={styles.successMark} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12.5l4 4 10-10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 id={titleId} className={styles.title}>
              Você está na lista
            </h2>
            <p className={styles.subtitle}>
              Seu lugar está reservado e o preço de entrada, garantido. Em breve falamos
              com você.
            </p>
            <button type="button" className={styles.secondary} onClick={onClose}>
              Fechar
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <header className={styles.header}>
              <h2 id={titleId} className={styles.title}>
                Entre na lista de espera
              </h2>
              <p className={styles.subtitle}>
                Vagas limitadas. Garanta seu lugar e trave o preço de entrada antes do
                próximo aumento.
              </p>
            </header>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={nameId}>
                Nome
              </label>
              <input
                ref={nameRef}
                id={nameId}
                type="text"
                autoComplete="name"
                className={styles.input}
                data-error={Boolean(errors.name)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                placeholder="Seu nome"
              />
              {errors.name ? (
                <span className={styles.error} role="alert">
                  {errors.name}
                </span>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={phoneId}>
                WhatsApp
              </label>
              <PhoneField
                id={phoneId}
                country={country}
                value={phone}
                onCountryChange={setCountry}
                onChange={setPhone}
                error={errors.whatsapp}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor={emailId}>
                E-mail
              </label>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                className={styles.input}
                data-error={Boolean(errors.email)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="voce@email.com"
              />
              {errors.email ? (
                <span className={styles.error} role="alert">
                  {errors.email}
                </span>
              ) : null}
            </div>

            {status === "error" ? (
              <div className={styles.banner} role="alert">
                Não conseguimos enviar agora. Tente novamente em instantes.
              </div>
            ) : null}

            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? "Enviando…" : "Quero entrar"}
            </button>

            {/* Hidden fields populated by GTM; present in the DOM on mount. */}
            {TRACKED_PARAMS.map((param) => (
              <input key={param} type="hidden" name={param} />
            ))}
            <input type="hidden" name="product" value={PRODUCT} readOnly />
            <input type="hidden" name="origin" value={ORIGIN} readOnly />

            {/* Honeypot — must stay empty. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="company">Empresa</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
