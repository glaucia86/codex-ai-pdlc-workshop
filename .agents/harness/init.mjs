// Preparação de sessão: diagnóstico sem instalação ou escrita de dados.
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, "../..");
console.log(`Projeto: ${root}`);
for (const script of [resolve(root, "scripts/doctor.mjs"), resolve(directory, "verify.mjs")]) {
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: "inherit" });
  if (result.error) console.error(`Falha no diagnóstico: ${result.error.message}`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log("Leia progress.md, feedback.md, feature-list.json e o handoff do slice autorizado.");
console.log("Aplicação manual: npm.cmd run dev (encerrar antes da validação).");
console.log("Baseline: npm.cmd run validate; depois npm.cmd run test:e2e.");
console.log("E2E: Chromium compatível, porta 3100 e dados em .local/e2e/, conforme Playwright.");
console.log("Este diagnóstico não executa testes, não comprova Chromium e não valida decisões de negócio.");
