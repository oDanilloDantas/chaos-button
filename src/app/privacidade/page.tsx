import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Políticas de Privacidade — Botão do Caos",
};

export default function PrivacidadePage() {
  return (
    <LegalPage title="Políticas de Privacidade">
      {/* TODO(2026-06-23): substituir pelo texto jurídico definitivo antes da fase de pagamento. */}
      <p>Conteúdo a definir.</p>
    </LegalPage>
  );
}
