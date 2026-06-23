"use client";

import { useState } from "react";
import { pushDataLayer } from "@/lib/analytics";
import { WaitlistModal } from "../WaitlistModal/WaitlistModal";
import styles from "./WaitlistCta.module.css";

export function WaitlistCta({ label }: { label: string }) {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
    pushDataLayer("open_waitlist_modal");
  }

  return (
    <>
      <button type="button" className={styles.cta} onClick={openModal}>
        {label}
      </button>
      {open ? <WaitlistModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
