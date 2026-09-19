# Progresso de implementação

Estado por slice: [feature-list.json](feature-list.json). Pendências e correções: [feedback.md](feedback.md). Acrescentar uma entrada ao final de cada sessão; preservar registros anteriores e identificar correções posteriores. Nenhum registro substitui evidência de teste ou aceite de negócio.

## S00 — preparação inicial — 19/09/2026

- Revisão: `9c3cc4898ee6a1c7657499e4a70a3573f6aeef46`, branch `feat/implementacao-aprovacao-orcamento`.
- Entrega inicial: índice, mapa, baseline e handoff; originalmente em `doc-specs/harness`, encontrados em `.agents/harness` no início da revisão seguinte. Não atribuímos a movimentação a um commit.
- Fontes: PRD D01–D07, RN19, RN21; SPEC CON-001–CON-003, PLT-001–PLT-003, COM-001, VAL-001, VAL-003, VAL-006, VAL-008.
- Verificações históricas: B01 `npm.cmd run validate` aprovado (8 testes e build); B02 E2E bloqueado antes das jornadas por Chromium headless 1243 ausente e interrompido na finalização; B03 hashes de seed/dados iguais. Detalhes em [baseline](baseline.md).
- Pendências: D01–D07 sem aceite; E2E não aprovado. Nenhuma regra de aprovação ou migração implementada.

## S00-R1 — revisão após feedback — 19/09/2026

- Solicitação: complementar o harness com progresso, lista estruturada, feedback e operação entre sessões. Registro F01 em [feedback.md](feedback.md).
- Mesma revisão de produto. Fontes PRD/spec/plano preservadas; atualização restrita ao harness e seu ponto de descoberta nas instruções.
- Entrega: `progress.md`, `feature-list.json` (9 slices, 47 critérios e verificações extraídos do plano), `feedback.md`, `init.mjs`, `verify.mjs`; índice com ciclo de trabalho e encerramento; links corrigidos para a localização atual. Handoff preserva contratos e histórico sem duplicar a tabela de estado.
- Evidências da preparação desta revisão: `node .local/harness-s00-review/init.mjs` passou (Node.js 24, Git, dependências, seed e consistência); `verify.mjs` conferiu 9 slices, 47 critérios, hashes das três fontes, dependências e 65 links locais. Quatro simulações isoladas foram recusadas com saída 1: critério alterado, S01 aprovado com VAL-001 pendente, hash de fonte divergente e evidência inexistente; o JSON original foi restaurado e passou novamente. B01/B02 são resultados anteriores, não reexecuções desta sessão.
- Inicialização: a tentativa inicial em PowerShell foi bloqueada pela política local de execução; o artefato final usa Node.js existente e não altera política ou permissões da máquina.
- Verificação no destino final: `node .agents/harness/init.mjs` e `node .agents/harness/verify.mjs` passaram; 65 links locais válidos. `node --check` passou nos dois scripts. ESLint explícito dos scripts passou; `npm.cmd run validate` foi executado novamente e passou em tipos, lint, 8 testes e build (saída 0). Consulta anterior confirmou ausência de servidor do projeto ativo. E2E não foi reexecutado nesta revisão de ferramentas/documentação, sem mudança de interface; B02 continua pendente.
- Preservação: hashes atuais de `data/seed.json` e `.local/demands.json` iguais a B03. Diff revisado e `git diff --check` sem erros; a alteração gerada pelo build em `next-env.d.ts` foi restaurada ao conteúdo inicial. Arquivos de produto, testes, dependências e fontes preservados; nenhuma migração ou regra de aprovação entregue. Sem commit criado nesta sessão.
- Retomada simulada no destino final: AGENTS → índice → progresso/feedback → JSON (S01, passes false e VAL-001 pendente) → handoff → fontes. F01 e F04 corrigidos e verificados pelo agente; sem presumir aceite do usuário. O verificador não declara aprovação funcional por existirem evidências: seu conteúdo continua sujeito a revisão.
- Condição de conclusão: S00 é preparação operacional e admite o impedimento de B02 registrado; `passes: true` de S00 não aprova S01–S08, nem expressa aceite do usuário à revisão do harness.
- Próximo passo: registrar aceite D01–D07 no PRD e resolver Chromium antes de comprovar jornadas; só implementar S01 mediante solicitação e condições satisfeitas. Retomar por índice → progresso/feedback → JSON/S01 → handoff → fontes focais.

## Modelo para nova entrada

`Sxx / sessão / data / revisão`: objetivo autorizado; arquivos e comportamento entregues; Source IDs PRD/SPEC; comandos/resultados e evidência; comparação com baseline; feedback tratado ou aberto; pendências; próximo passo. Registrar o commit somente quando existir. Se a sessão não concluir o slice, manter `passes: false`.
