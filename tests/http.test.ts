import { test } from "node:test";
import assert from "node:assert/strict";
import { handlers } from "../src/server/http";
import { sample, temporaryStore } from "./helpers";

test("a API exige perfil conhecido, valida entrada e aplica regras no servidor", async () => {
  const { store, cleanup } = await temporaryStore();
  const api = handlers(store);
  const request = (
    data: unknown,
    actor = "ana",
    origin = "http://localhost:3000",
  ) =>
    new Request("http://localhost:3000/api/demands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-user": actor,
        origin,
      },
      body: JSON.stringify(data),
    });
  try {
    assert.equal(
      (
        await api.POST(
          request({ type: "create", input: sample }, "inexistente"),
        )
      ).status,
      403,
    );
    assert.equal(
      (
        await api.POST(
          request({ type: "create", input: { ...sample, amountCents: -1 } }),
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await api.POST(
          request(
            { type: "create", input: sample },
            "ana",
            "http://outro-site.test",
          ),
        )
      ).status,
      403,
    );
    const created = await api.POST(request({ type: "create", input: sample }));
    assert.equal(created.status, 201);
    const { demand } = await created.json();
    assert.equal(
      (
        await api.POST(
          request(
            { type: "advance", id: demand.id, version: demand.version },
            "bruno",
          ),
        )
      ).status,
      403,
    );
    const data = await (await api.GET()).json();
    assert.equal(data.demands.length, 9);
  } finally {
    await cleanup();
  }
});

test("a API bloqueia desvios do fluxo e não grava ações recusadas", async () => {
  const { store, cleanup } = await temporaryStore();
  const api = handlers(store);
  const post = (actor: string, body: unknown) =>
    api.POST(
      new Request("http://localhost:3000/api/demands", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-demo-user": actor },
        body: JSON.stringify(body),
      }),
    );
  try {
    const id = "DEM-1048";
    assert.equal(
      (await post("ana", { type: "advance", id, version: 1 })).status,
      409,
    );
    assert.equal(
      (await post("ana", { type: "request-approval", id, version: 1 })).status,
      200,
    );
    const original = JSON.stringify(await store.read());
    assert.equal(
      (
        await post("diego", {
          type: "decide-approval",
          id,
          version: 2,
          decision: "approve",
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await post("bruno", {
          type: "decide-approval",
          id,
          version: 2,
          decision: "reject",
          reason: " ",
        })
      ).status,
      400,
    );
    assert.equal(JSON.stringify(await store.read()), original);
    assert.equal(
      (
        await post("bruno", {
          type: "decide-approval",
          id,
          version: 2,
          decision: "approve",
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await post("marina", {
          type: "decide-approval",
          id,
          version: 2,
          decision: "approve",
        })
      ).status,
      409,
    );
    assert.equal(
      (await post("ana", { type: "advance", id, version: 3 })).status,
      200,
    );
    assert.equal(
      (
        await post("ana", {
          type: "update",
          id,
          version: 4,
          input: { ...sample, amountCents: 150000 },
        })
      ).status,
      409,
    );
    assert.equal(
      (await post("ana", { type: "advance", id, version: 4 })).status,
      200,
    );
    const finished = (await store.read()).demands.find(
      (item) => item.id === id,
    )!;
    assert.equal(finished.status, "Concluída");
    assert.equal(finished.amountCents, 120000);
  } finally {
    await cleanup();
  }
});
