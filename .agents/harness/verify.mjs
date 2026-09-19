import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, "../..");
const read = (path) => readFileSync(path, "utf8");
const same = (actual, expected, message) =>
  assert.deepEqual(actual, expected, message);

try {
  const list = JSON.parse(read(resolve(directory, "feature-list.json")));
  same(list.schema_version, 1, "Versão desconhecida da lista.");
  for (const source of Object.values(list.sources)) {
    const hash = createHash("sha256")
      .update(readFileSync(resolve(root, source.path)))
      .digest("hex");
    same(hash, source.sha256, `Fonte mudou: ${source.path}. Revisar o impacto.`);
  }
  same(Object.keys(list.sources).sort(),
    ["PRD-v1.md", "spec-v1.md", "implementation-slices.md"].sort(),
    "As três fontes precisam estar registradas.");
  const plan = read(resolve(root, "doc-specs/implementation-slices.md"));
  const slices = [...plan.matchAll(/^## Slice (S\d{2}) — (.+)\r?\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)];
  same(list.features.map((item) => item.id), slices.map((item) => item[1]),
    "A lista deve conter todos os slices na ordem do plano.");
  same(list.features.length, 9, "Esperados S00–S08.");
  same(list.gates.length, 1, "Registrar a condição documental VAL-001.");
  const gate = list.gates[0];
  same(gate.id, "VAL-001", "Condição documental incorreta.");
  assert(["pendente", "validado"].includes(gate.status), "Estado documental inválido.");
  same(Object.keys(gate.decisions), ["D01", "D02", "D03", "D04", "D05", "D06", "D07"],
    "Registrar todas as decisões de negócio.");
  assert(Object.values(gate.decisions).every((value) => ["pendente", "validado"].includes(value)),
    "Estado de decisão inválido.");
  if (gate.status === "validado") {
    assert(Object.values(gate.decisions).every((value) => value === "validado"),
      "VAL-001 exige D01–D07 validadas.");
    assert(gate.evidence.length > 0, "Falta referência ao aceite real no PRD.");
  }
  let criteria = 0;
  for (const [index, feature] of list.features.entries()) {
    const [, id, title, body] = slices[index];
    same(feature.title, title.trim(), `${id}: título diverge do plano.`);
    same(feature.priority, index, `${id}: prioridade diverge do plano.`);
    same(feature.category, id === "S00" ? "operacional" : "funcional", `${id}: categoria inválida.`);
    const row = plan.split(/\r?\n/).find((line) => line.startsWith(`| ${index} | ${id} `));
    const dependencies = row.split("|")[3].match(/S\d{2}/g) ?? [];
    same(feature.depends_on, dependencies, `${id}: dependências divergem do plano.`);
    same(feature.required_gates, id === "S00" ? [] : ["VAL-001"], `${id}: condição documental ausente.`);
    for (const source of ["PRD", "SPEC"]) {
      const line = body.match(new RegExp(`\\*\\*Source IDs — ${source}:\\*\\* (.+)`))[1];
      const ids = line.trim().replace(/\.$/, "").split(", ");
      same(feature.source_ids[source], ids, `${id}: Source IDs de ${source} divergentes.`);
    }
    const acceptance = [...body.matchAll(/^- \[ \] (.+)/gm)].map((item) => item[1].trim());
    same(feature.acceptance, acceptance, `${id}: critérios alterados, removidos ou acrescentados.`);
    criteria += acceptance.length;
    const steps = body.split("### Testes/verificação")[1].split("### Handoff")[0]
      .trim().split(/\r?\n\r?\n/).map((step) => step.replace(/\r/g, ""));
    same(feature.verification_steps, steps, `${id}: verificações divergem do plano.`);
    same(typeof feature.passes, "boolean", `${id}: passes deve ser booleano.`);
    assert(Array.isArray(feature.evidence), `${id}: evidence deve ser uma lista.`);
    if (feature.passes) {
      assert(feature.evidence.length > 0, `${id}: falta evidência.`);
      assert(dependencies.every((dependency) => list.features.find((item) => item.id === dependency).passes),
        `${id}: dependência ainda não aprovada.`);
      assert(id === "S00" || gate.status === "validado", `${id}: VAL-001 pendente.`);
    }
    for (const evidence of feature.evidence) {
      assert(existsSync(resolve(directory, evidence.split("#")[0])), `${id}: evidência não encontrada: ${evidence}`);
    }
  }
  for (const evidence of gate.evidence) {
    assert(existsSync(resolve(directory, evidence.split("#")[0])), `Aceite não encontrado: ${evidence}`);
  }
  let links = 0;
  for (const file of readdirSync(directory).filter((name) => name.endsWith(".md"))) {
    for (const match of read(resolve(directory, file)).matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0];
      if (!target || /^https?:/.test(target)) continue;
      assert(existsSync(resolve(directory, target)), `${file}: destino ausente: ${target}`);
      links++;
    }
  }
  console.log(`OK: ${list.features.length} slices, ${criteria} critérios, fontes, dependências e ${links} links locais.`);
  console.log(`Condição documental VAL-001: ${gate.status}. Conferir aceite humano no PRD; este script só verifica consistência.`);
  const next = list.features.find((feature) => !feature.passes &&
    feature.depends_on.every((id) => list.features.find((item) => item.id === id).passes));
  if (next) console.log(`Próximo candidato: ${next.id}; condições: ${next.required_gates.join(", ")}. Não é autorização para implementar.`);
  console.log("Aceite funcional exige executar as verificações do slice e revisar suas evidências.");
} catch (error) {
  console.error(`FALHA no harness: ${error.message}`);
  process.exitCode = 1;
}
