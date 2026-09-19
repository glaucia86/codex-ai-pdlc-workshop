# Baseline do produto anterior à aprovação

Executada em 19/09/2026 na revisão registrada no [índice](README.md), sem mudança de código funcional. Os resultados abaixo são da aplicação v1; não são aceite da evolução.

## Ambiente e isolamento confirmado

- Windows / PowerShell; `node --version`: **v24.19.0**; `npm.cmd --version`: **12.0.2**. Next.js 16.3.5 e Playwright 1.63.0, conforme dependências instaladas e package.json.
- Havia um servidor de desenvolvimento deste projeto (processos Next.js 3892 e 15976). Ambos foram identificados pelo caminho do projeto e parados, com autorização, antes da baseline. A consulta inicial de processos foi negada pelo sandbox; a consulta autorizada funcionou. Nenhum processo de outro projeto foi encerrado.
- `DEMANDS_DATA_FILE` e `PLAYWRIGHT_EXECUTABLE_PATH` não estavam definidos na sessão. [playwright.config.ts](../../playwright.config.ts) fornece explicitamente `.local/e2e/demands.json`, porta **3100**, **um worker**, `fullyParallel: false`, `reuseExistingServer: false`.
- Integração: [helpers.ts](../../tests/helpers.ts) usa um diretório `codex-rio-test-*` criado por `mkdtemp` no temporário do sistema por teste. Limpeza somente nesse diretório. Concorrência usa duas instâncias no mesmo arquivo temporário.
- [e2e-server.mjs](../../scripts/e2e-server.mjs) chama o reset existente exclusivamente com o caminho isolado passado pelo Playwright e inicia Next.js na porta 3100. O teste de backup/reset em `store.test.ts` também usa arquivo temporário. Não executar `npm run data:reset` sobre o arquivo padrão do participante.

## Resultados efetivos

| ID | Comando / verificação | Resultado de referência |
| --- | --- | --- |
| B01 | `npm.cmd run validate` | **Aprovado, saída 0**. TypeScript, ESLint, 8 testes (4 domínio, 1 HTTP, 3 armazenamento), build Next.js concluído. Nenhum teste ignorado ou removido. |
| B02 | `npm.cmd run test:e2e` | **Bloqueio de ambiente**. Duas jornadas falharam em `browserType.launch`, antes das ações do navegador. O processo ficou sem encerrar após as falhas e foi interrompido com Ctrl+C (saída 1). Não há evidência de aprovação das jornadas. |
| B03 | `Get-FileHash data/seed.json,.local/demands.json` antes/depois | Hashes iguais; seed e dados do participante preservados. |
| B04 | Links, rastreabilidade, diff e simulação de retomada | Resultado final registrado no [handoff](handoff.md). |

Erro determinante de B02:

```text
browserType.launch: Executable doesn't exist at
%LOCALAPPDATA%\ms-playwright\chromium_headless_shell-1243\chrome-headless-shell-win64\chrome-headless-shell.exe
```

O cache inspecionado tinha `chromium-1234` e `chromium_headless_shell-1234`, não o build 1243 esperado. Não substituir silenciosamente por esse navegador antigo. Evidências locais geradas pelo Playwright: `test-results/starter-criar-editar-filtr-3bae0--uma-demanda-pelo-navegador/error-context.md` e `test-results/starter-a-tela-funciona-em-e8fe3-uena-e-oferece-estado-vazio/error-context.md`, com `trace.zip` em cada pasta. São artefatos ignorados pelo Git e substituíveis em outra execução; este registro versionável conserva a causa observada.

Avisos `NO_COLOR`/`FORCE_COLOR` apareceram na execução, mas a falha identificada foi a ausência do executável. Não foi diagnosticada regressão funcional em S00. Não foram executados testes da evolução, revisão manual de teclado ou jornada em 360 px.

Após a interrupção, consulta autorizada de processos confirmou ausência de `playwright`, `scripts/e2e-server.mjs` e Next.js deste projeto. O servidor de desenvolvimento original permaneceu parado; para retomá-lo, usar `npm.cmd run dev` depois das verificações. A causa da demora de finalização não foi investigada em S00.

SHA-256 antes e depois:

| Arquivo | Hash |
| --- | --- |
| `data/seed.json` | `25964DB59DB4FB46209D670FB0276913F11845112831D43BA6101C7FFAA45F3F` |
| `.local/demands.json` | `B050C1637E37F18ADD3DB0A107ABA04DB08D393CCC5D87ECF5D7A5E245C9D7EB` |

Nenhum conteúdo dos dados locais é incluído no harness.

## Reprodução e comparação futura

Na raiz do projeto, usar Node.js 24 e as dependências do lockfile; em checkout sem dependências, `npm ci`. Parar o servidor de desenvolvimento deste projeto antes de executar os comandos. Confirmar que a porta 3100 está livre e que a configuração mantém o caminho E2E isolado. Não remover trava sem diagnóstico.

```powershell
node --version
npm.cmd --version
npm.cmd run validate
npm.cmd run test:e2e
```

Para resolver B02, preparar o Chromium compatível com `npx.cmd playwright install chromium` e repetir `npm.cmd run test:e2e`, respeitando as permissões de instalação/download do ambiente. Essa instalação não foi feita em S00; ausência de navegador é pendência explícita permitida pelo slice, sem atualização genérica de dependências.

Após cada slice, registrar comando, data, revisão, saída e resultado com identificador novo. Comparar com B01 e distinguir B02 (ambiente anterior) de falhas introduzidas pelo novo código. `validate` interrompe na primeira falha: etapas não alcançadas permanecem pendentes. Preservar a suíte existente, adaptando o início de demandas novas à aprovação no slice pertinente. Para testes futuros de falha/concorrência, reler estado e histórico do arquivo temporário; recusa deve preservar ambos.
