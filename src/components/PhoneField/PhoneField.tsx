"use client";

import { type ChangeEvent, useState } from "react";
import { type CountryCode } from "libphonenumber-js";
import { findCountry } from "@/config/countries";
import { formatAsYouType } from "@/lib/phone";
import { CountryPicker } from "../CountryPicker/CountryPicker";
import styles from "./PhoneField.module.css";

type Props = {
  id: string;
  country: CountryCode;
  value: string;
  onCountryChange: (code: CountryCode) => void;
  onChange: (value: string) => void;
  error?: string;
};

export function PhoneField({ id, country, value, onCountryChange, onChange, error }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const current = findCountry(country);
  const errorId = `${id}-error`;

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    onChange(formatAsYouType(e.target.value, country));
  }

  function handleSelect(code: CountryCode) {
    onCountryChange(code);
    onChange(formatAsYouType(value, code));
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.row} data-error={Boolean(error)}>
        <button
          type="button"
          className={styles.ddi}
          onClick={() => setPickerOpen(true)}
          aria-haspopup="dialog"
          aria-label={`País: ${current?.name ?? country}. Tocar para trocar.`}
        >
          <span className={styles.flag} aria-hidden="true">
            {current?.flag}
          </span>
          <span className={styles.code}>+{current?.dialCode}</span>
          <svg className={styles.chevron} viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M3 4.5 6 7.5 9 4.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className={styles.input}
          placeholder="(11) 99999-9999"
          value={value}
          onChange={handleInput}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error ? (
        <span id={errorId} className={styles.error} role="alert">
          {error}
        </span>
      ) : null}

      {pickerOpen ? (
        <CountryPicker
          selected={country}
          onSelect={handleSelect}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </div>
  );
}
