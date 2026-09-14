import {
  ArrowRight,
  Building2,
  CheckCheck,
  FileText,
  History,
  Pencil,
  Wallet,
} from "lucide-react";
import type { Command, Demand, User } from "../domain/model";
import { formatAmount } from "../domain/currency";
import { Avatar, Priority, StatusBadge } from "./shared";

import { ApprovalPanel } from "./approval-panel";

export type DetailProps = {
  demand: Demand;
  actor: User;
  users: User[];
  busy: boolean;
  error: string;
  onEdit: () => void;
  onAdvance: () => void;
  onCommand: (command: Command) => void;
};
export function DemandDetail({
  demand,
  actor,
  users,
  busy,
  error,
  onEdit,
  onAdvance,
  onCommand,
}: DetailProps) {
  const requester = users.find((user) => user.id === demand.requesterId)!;
  const own = actor.id === demand.requesterId;
  const canEdit = own && demand.status !== "Concluída";
  const canStart =
    demand.approval.status === "Aprovada" &&
    demand.approval.amountCents === demand.amountCents;
  return (
    <div className="detail">
      <div className="overline">
        <FileText size={16} aria-hidden="true" />
        {demand.id}
        <span>/</span>
        {demand.area}
      </div>
      <h2>{demand.title}</h2>
      <StatusBadge status={demand.status} />
      <p className="description">
        {demand.description || "Nenhuma descrição informada."}
      </p>
      <div className="budget">
        <span>
          <Wallet size={18} aria-hidden="true" />
          Valor solicitado
        </span>
        <strong>{formatAmount(demand.amountCents)}</strong>
        <small>Orçamento informado para esta demanda</small>
      </div>
      <ApprovalPanel
        demand={demand}
        actor={actor}
        busy={busy}
        onCommand={onCommand}
      />
      <dl className="detail-fields">
        <div>
          <dt>Solicitante</dt>
          <dd>
            <Avatar name={requester.name} />
            {requester.name}
          </dd>
        </div>
        <div>
          <dt>Área</dt>
          <dd>
            <Building2 size={16} aria-hidden="true" />
            {demand.area}
          </dd>
        </div>
        <div>
          <dt>Prioridade</dt>
          <dd>
            <Priority value={demand.priority} />
          </dd>
        </div>
        <div>
          <dt>Criada em</dt>
          <dd>
            {new Date(demand.createdAt).toLocaleDateString("pt-BR", {
              timeZone: "America/Sao_Paulo",
            })}
          </dd>
        </div>
      </dl>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="detail-actions">
        {canEdit && (
          <button className="secondary" disabled={busy} onClick={onEdit}>
            <Pencil size={16} />
            Editar demanda
          </button>
        )}
        {canEdit && (
          <button
            className="primary"
            disabled={busy || (demand.status === "Nova" && !canStart)}
            onClick={onAdvance}
          >
            {demand.status === "Nova" ? (
              <ArrowRight size={16} />
            ) : (
              <CheckCheck size={16} />
            )}
            {demand.status === "Nova" ? "Iniciar demanda" : "Concluir demanda"}
          </button>
        )}
      </div>
      {own && demand.status === "Nova" && !canStart && (
        <p className="quiet">
          O orçamento atual precisa ser aprovado antes do início.
        </p>
      )}
      {!own && (
        <p className="quiet">
          Somente o solicitante pode editar e movimentar esta demanda.
        </p>
      )}
      <div className="history-heading">
        <History size={18} aria-hidden="true" />
        <h3>Histórico de alterações</h3>
        <span>{demand.history.length}</span>
      </div>
      <ol className="timeline">
        {[...demand.history].reverse().map((event) => (
          <li key={event.id}>
            <span className="timeline-dot" />
            <div>
              <strong>{event.actorName}</strong>
              <p>{event.message}</p>
              <time dateTime={event.at}>
                {new Date(event.at).toLocaleString("pt-BR", {
                  timeZone: "America/Sao_Paulo",
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
