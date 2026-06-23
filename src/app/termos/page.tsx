import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso — Botão do Caos",
};

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso">
      {/* TODO(2026-06-23): substituir pelo texto jurídico definitivo antes da fase de pagamento. */}
      <p>Conteúdo a definir.</p>
    </LegalPage>
  );
}
