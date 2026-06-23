import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Políticas de Reembolso — Botão do Caos",
};

export default function ReembolsoPage() {
  return (
    <LegalPage title="Políticas de Reembolso">
      {/* TODO(2026-06-23): substituir pelo texto jurídico definitivo antes da fase de pagamento. */}
      <p>Conteúdo a definir.</p>
    </LegalPage>
  );
}
