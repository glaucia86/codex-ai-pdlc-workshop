"use client";
import { useState } from "react";
import { Send, ShieldCheck, Check, X } from "lucide-react";
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
  const [reason, setReason] = useState("");
  const own = demand.requesterId === actor.id;
  const approval = demand.approval;
  const canRequest =
    own &&
    demand.status === "Nova" &&
    ["Não solicitada", "Rejeitada"].includes(approval.status);
  const canDecide =
    actor.role === "gestor" &&
    !own &&
    demand.status === "Nova" &&
    approval.status === "Pendente";
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
      {approval.reason && (
        <p className="rejection-reason">
          <strong>Justificativa:</strong> {approval.reason}
        </p>
      )}
      {canDecide && (
        <div className="approval-decision">
          <label>
            Justificativa da rejeição
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={500}
              rows={2}
              disabled={busy}
              placeholder="Obrigatória ao rejeitar."
            />
          </label>
          <div className="detail-actions">
            <button
              className="primary"
              disabled={busy}
              onClick={() =>
                onCommand({
                  type: "decide-approval",
                  id: demand.id,
                  version: demand.version,
                  decision: "approve",
                })
              }
            >
              <Check size={16} aria-hidden="true" />
              Aprovar orçamento
            </button>
            <button
              className="secondary"
              disabled={busy || !reason.trim()}
              onClick={() =>
                onCommand({
                  type: "decide-approval",
                  id: demand.id,
                  version: demand.version,
                  decision: "reject",
                  reason,
                })
              }
            >
              <X size={16} aria-hidden="true" />
              Rejeitar orçamento
            </button>
          </div>
        </div>
      )}
      {own && actor.role === "gestor" && approval.status === "Pendente" && (
        <p>Outro gestor precisa avaliar sua demanda.</p>
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
