import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCommand } from "../src/domain/demands";
import { parseAmount } from "../src/domain/currency";
import { sample, seed } from "./helpers";

test("a demanda atravessa o fluxo inicial e registra quem agiu", async () => {
  const db = await seed();
  const demand = applyCommand(db, "ana", { type: "create", input: sample });
  assert.equal(demand.status, "Nova");
  assert.equal(demand.requesterId, "ana");
  applyCommand(db, "ana", {
    type: "request-approval",
    id: demand.id,
    version: demand.version,
  });
  applyCommand(db, "bruno", {
    type: "decide-approval",
    id: demand.id,
    version: demand.version,
    decision: "approve",
  });
  applyCommand(db, "ana", {
    type: "advance",
    id: demand.id,
    version: demand.version,
  });
  assert.equal(demand.status, "Em andamento");
  applyCommand(db, "ana", {
    type: "advance",
    id: demand.id,
    version: demand.version,
  });
  assert.equal(demand.status, "Concluída");
  assert.deepEqual(
    demand.history.map((event) => event.kind),
    [
      "created",
      "approval-requested",
      "approval-approved",
      "started",
      "completed",
    ],
  );
  assert.ok(
    demand.history.every(
      (event) =>
        ["ana", "bruno"].includes(event.actorId) &&
        !Number.isNaN(Date.parse(event.at)),
    ),
  );
});

test("um perfil não edita nem movimenta a demanda de outra pessoa", async () => {
  const db = await seed();
  assert.throws(
    () =>
      applyCommand(db, "bruno", {
        type: "update",
        id: "DEM-1048",
        version: 1,
        input: sample,
      }),
    /Somente o solicitante/,
  );
  assert.throws(
    () =>
      applyCommand(db, "bruno", {
        type: "advance",
        id: "DEM-1048",
        version: 1,
      }),
    /Somente o solicitante/,
  );
});

test("edição sobre uma versão desatualizada não sobrescreve os dados", async () => {
  const db = await seed();
  applyCommand(db, "ana", {
    type: "update",
    id: "DEM-1048",
    version: 1,
    input: { ...sample, title: "Título mais recente" },
  });
  assert.throws(
    () =>
      applyCommand(db, "ana", {
        type: "update",
        id: "DEM-1048",
        version: 1,
        input: sample,
      }),
    /outra tela/,
  );
  assert.equal(
    db.demands.find((demand) => demand.id === "DEM-1048")!.title,
    "Título mais recente",
  );
});

test("valores monetários preservam centavos e recusam formatos ambíguos", () => {
  assert.equal(parseAmount("1200,05"), 120005);
  assert.equal(parseAmount("0.01"), 1);
  for (const input of ["0", "-1", "1.200,50", "1e3", "3.333", "", "1000000.01"])
    assert.throws(() => parseAmount(input));
});
