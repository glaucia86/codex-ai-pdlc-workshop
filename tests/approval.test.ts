import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { applyCommand } from "../src/domain/demands";
import { readDatabase } from "../src/domain/model";
import { seed } from "./helpers";

test("solicitante envia o valor atual uma vez e registra autoria", async () => {
  const db = await seed();
  assert.throws(
    () =>
      applyCommand(db, "bruno", {
        type: "request-approval",
        id: "DEM-1048",
        version: 1,
      }),
    /Somente o solicitante/,
  );
  const demand = applyCommand(
    db,
    "ana",
    { type: "request-approval", id: "DEM-1048", version: 1 },
    "2026-09-19T13:00:00.000Z",
  );
  assert.equal(demand.approval.status, "Pendente");
  assert.equal(demand.approval.amountCents, demand.amountCents);
  assert.equal(demand.approval.requestedAt, "2026-09-19T13:00:00.000Z");
  assert.equal(demand.history.at(-1)?.actorId, "ana");
  assert.throws(
    () =>
      applyCommand(db, "ana", {
        type: "request-approval",
        id: demand.id,
        version: demand.version,
      }),
    /neste estado/,
  );
});

test("migração mantém demandas e histórico sem fabricar aprovação retroativa", async () => {
  const old = JSON.parse(await readFile("data/seed.json", "utf8"));
  const db = readDatabase(old);
  assert.equal(db.schemaVersion, 2);
  assert.equal(db.demands.length, old.demands.length);
  for (const demand of db.demands) {
    const original = old.demands.find(
      (item: { id: string }) => item.id === demand.id,
    );
    assert.deepEqual(demand.history, original.history);
    assert.equal(demand.legacyExecution, demand.status !== "Nova");
    assert.equal(demand.approval.status, "Não solicitada");
  }
  assert.throws(() => readDatabase({ ...old, schemaVersion: 99 }));
});

test("só outro gestor decide; rejeição exige motivo e mantém autoria/data", async () => {
  const db = await seed();
  const demand = applyCommand(db, "bruno", {
    type: "request-approval",
    id: "DEM-1046",
    version: 1,
  });
  const command = {
    type: "decide-approval" as const,
    id: demand.id,
    version: demand.version,
    decision: "reject" as const,
    reason: " ",
  };
  assert.throws(() => applyCommand(db, "bruno", command), /própria demanda/);
  assert.throws(() => applyCommand(db, "ana", command), /Somente gestores/);
  assert.throws(() => applyCommand(db, "marina", command), /justificativa/);
  assert.equal(demand.approval.status, "Pendente");
  const at = "2026-09-19T15:00:00.000Z";
  applyCommand(
    db,
    "marina",
    { ...command, reason: "  Revisar a cotação.  " },
    at,
  );
  assert.equal(demand.approval.status, "Rejeitada");
  assert.equal(demand.approval.reason, "Revisar a cotação.");
  assert.equal(demand.approval.decidedById, "marina");
  assert.equal(demand.approval.decidedAt, at);
  assert.match(demand.history.at(-1)!.message, /Revisar a cotação/);
});

test("a execução exige aprovação do valor atual no domínio", async () => {
  const db = await seed();
  const demand = db.demands.find((item) => item.id === "DEM-1048")!;
  const advance = () =>
    applyCommand(db, "ana", {
      type: "advance",
      id: demand.id,
      version: demand.version,
    });
  assert.throws(advance, /precisa de aprovação/);
  applyCommand(db, "ana", {
    type: "request-approval",
    id: demand.id,
    version: demand.version,
  });
  assert.throws(advance, /precisa de aprovação/);
  applyCommand(db, "bruno", {
    type: "decide-approval",
    id: demand.id,
    version: demand.version,
    decision: "approve",
  });
  assert.equal(demand.status, "Nova");
  advance();
  assert.equal(demand.status, "Em andamento");
});
