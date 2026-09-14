import { randomUUID } from "node:crypto";
import {
  commandSchema,
  DomainError,
  emptyApproval,
  type Command,
  type Database,
  type Demand,
  type HistoryEvent,
  type User,
} from "./model";
import { formatAmount } from "./currency";

export function addEvent(
  demand: Demand,
  actor: User,
  kind: HistoryEvent["kind"],
  message: string,
  now: string,
) {
  demand.history.push({
    id: randomUUID(),
    actorId: actor.id,
    actorName: actor.name,
    kind,
    message,
    at: now,
  });
  demand.updatedAt = now;
}

export function applyCommand(
  db: Database,
  actorId: string,
  rawCommand: Command,
  now = new Date().toISOString(),
): Demand {
  const actor = db.users.find((user) => user.id === actorId);
  if (!actor)
    throw new DomainError("Selecione um perfil de demonstração válido.", 403);
  const command = commandSchema.parse(rawCommand);

  if (command.type === "create") {
    const demand: Demand = {
      ...command.input,
      id: `DEM-${db.nextId++}`,
      requesterId: actor.id,
      status: "Nova",
      version: 1,
      createdAt: now,
      updatedAt: now,
      history: [],
      approval: emptyApproval(),
      legacyExecution: false,
    };
    addEvent(demand, actor, "created", "Registrou a demanda.", now);
    db.demands.unshift(demand);
    return demand;
  }

  const demand = db.demands.find((item) => item.id === command.id);
  if (!demand) throw new DomainError("Demanda não encontrada.", 404);
  if (demand.version !== command.version) {
    throw new DomainError(
      "Esta demanda foi atualizada em outra tela. Feche e abra os detalhes novamente para revisar os dados.",
      409,
    );
  }
  if (command.type === "decide-approval") {
    if (actor.role !== "gestor")
      throw new DomainError(
        "Somente gestores podem decidir sobre o orçamento.",
        403,
      );
    if (demand.requesterId === actor.id)
      throw new DomainError(
        "Você não pode decidir sobre a própria demanda.",
        403,
      );
    if (
      demand.status !== "Nova" ||
      demand.approval.status !== "Pendente" ||
      demand.approval.amountCents !== demand.amountCents
    )
      throw new DomainError(
        "Não há avaliação pendente para o valor atual.",
        409,
      );
    if (command.decision === "reject" && !command.reason)
      throw new DomainError(
        "Informe uma justificativa para rejeitar o orçamento.",
      );
    const approved = command.decision === "approve";
    demand.approval = {
      ...demand.approval,
      status: approved ? "Aprovada" : "Rejeitada",
      decidedAt: now,
      decidedById: actor.id,
      reason: approved ? null : command.reason!,
    };
    addEvent(
      demand,
      actor,
      approved ? "approval-approved" : "approval-rejected",
      approved
        ? `Aprovou ${formatAmount(demand.amountCents)}.`
        : `Rejeitou ${formatAmount(demand.amountCents)}. Justificativa: ${command.reason}`,
      now,
    );
    demand.version += 1;
    return demand;
  }
  if (demand.requesterId !== actor.id)
    throw new DomainError(
      "Somente o solicitante pode editar ou movimentar esta demanda.",
      403,
    );

  if (command.type === "request-approval") {
    if (
      demand.status !== "Nova" ||
      !["Não solicitada", "Rejeitada"].includes(demand.approval.status)
    )
      throw new DomainError(
        "Esta demanda não pode ser enviada para aprovação neste estado.",
        409,
      );
    demand.approval = {
      ...emptyApproval(),
      status: "Pendente",
      amountCents: demand.amountCents,
      requestedAt: now,
    };
    addEvent(
      demand,
      actor,
      "approval-requested",
      `Enviou ${formatAmount(demand.amountCents)} para aprovação.`,
      now,
    );
  } else if (command.type === "update") {
    if (demand.status === "Concluída")
      throw new DomainError(
        "Demandas concluídas ficam disponíveis apenas para consulta.",
        409,
      );
    Object.assign(demand, command.input);
    addEvent(demand, actor, "updated", "Atualizou os dados da demanda.", now);
  } else {
    if (demand.status === "Concluída")
      throw new DomainError("Esta demanda já foi concluída.", 409);
    const starting = demand.status === "Nova";
    if (
      starting &&
      (demand.approval.status !== "Aprovada" ||
        demand.approval.amountCents !== demand.amountCents)
    )
      throw new DomainError(
        "O orçamento atual precisa de aprovação antes de iniciar.",
        409,
      );
    demand.status = starting ? "Em andamento" : "Concluída";
    addEvent(
      demand,
      actor,
      starting ? "started" : "completed",
      starting ? "Iniciou a execução." : "Concluiu a demanda.",
      now,
    );
  }
  demand.version += 1;
  return demand;
}
