import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { readDatabase, type DemandInput } from "../src/domain/model";
import { JsonStore } from "../src/server/json-store";

export const sample: DemandInput = {
  title: "Monitor para a equipe",
  description: "Monitor de 27 polegadas.",
  area: "Engenharia",
  priority: "Alta",
  amountCents: 120_000,
};
export async function seed() {
  return readDatabase(JSON.parse(await readFile("data/seed.json", "utf8")));
}
export async function temporaryStore() {
  const directory = await mkdtemp(join(tmpdir(), "codex-rio-test-"));
  return {
    store: new JsonStore(join(directory, "demands.json")),
    directory,
    cleanup: () => rm(directory, { recursive: true, force: true }),
  };
}
