# Execução e validação

Leia ao preparar o ambiente, executar a aplicação ou verificar mudanças. Os comandos disponíveis são definidos no [package.json](../package.json).

## Ambiente local

Use Node.js 24 e npm. Instale as dependências com `npm ci`, confira os pré-requisitos com `npm run doctor` e inicie com `npm run dev`. A aplicação fica em `http://127.0.0.1:3000`.

No Windows, se o PowerShell bloquear `npm.ps1`, use `npm.cmd`. Para instalação e diagnóstico, consulte a [preparação](../docs/preparation.md).

## Verificações

| Comando | Finalidade |
| --- | --- |
| `npm run typecheck` | Tipos TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Regras, API e persistência com dados temporários |
| `npm run build` | Build Next.js |
| `npm run validate` | Tipos, lint, testes e build; interrompe na primeira falha |
| `npm run test:e2e` | Fluxo pelo navegador com Chromium |

Após mudanças de código, execute `npm run validate`. Após mudanças de interface ou de fluxo, execute também `npm run test:e2e` quando Chromium estiver disponível. Para preparar o navegador, use `npx playwright install chromium`.

Pare o servidor de desenvolvimento antes da validação completa ou do teste pelo navegador. O E2E usa a porta 3100 e dados próprios em `.local/e2e/`, conforme a [configuração do Playwright](../playwright.config.ts).

Em alterações exclusivamente documentais, confira a coerência das instruções, os comandos citados e os links locais; não é necessário executar a aplicação.

## Entrega

Informe o que mudou, quais verificações foram executadas e seus resultados. Se alguma etapa não foi executada ou ficou bloqueada, indique isso e o motivo; não apresente etapas pendentes como aprovadas.
