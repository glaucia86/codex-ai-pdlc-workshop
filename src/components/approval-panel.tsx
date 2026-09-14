import { Send, ShieldCheck } from "lucide-react";
import type { Command, Demand, User } from "../domain/model";
import { formatAmount } from "../domain/currency";

export function ApprovalPanel({
  demand,
  actor,
  busy,
  onCommand,
}: {
  demand: Demand;
  actor: User;
  busy: boolean;
  onCommand: (command: Command) => void;
}) {
  const own = demand.requesterId === actor.id;
  const approval = demand.approval;
  const canRequest =
    own &&
    demand.status === "Nova" &&
    ["Não solicitada", "Rejeitada"].includes(approval.status);
  return (
    <section className="approval-panel" aria-label="Aprovação de orçamento">
      <div className="approval-heading">
        <ShieldCheck size={20} aria-hidden="true" />
        <h3>Aprovação de orçamento</h3>
      </div>
      <span className="approval-status" data-status={approval.status}>
        {approval.status}
      </span>
      {demand.legacyExecution ? (
        <p>
          Execução iniciada antes deste fluxo. Nenhuma aprovação retroativa é
          necessária.
        </p>
      ) : (
        <p>
          {approval.amountCents === null
            ? "Envie o orçamento para avaliação de um gestor."
            : `Valor enviado: ${formatAmount(approval.amountCents)}`}
        </p>
      )}
      {canRequest && (
        <button
          className="primary"
          disabled={busy}
          onClick={() =>
            onCommand({
              type: "request-approval",
              id: demand.id,
              version: demand.version,
            })
          }
        >
          <Send size={16} aria-hidden="true" />
          {approval.status === "Rejeitada"
            ? "Reenviar para aprovação"
            : "Enviar para aprovação"}
        </button>
      )}
    </section>
  );
}
