# Progresso e handoffs

Entrada: [índice](README.md). Relações de fonte/código/teste: [mapa de impacto](mapa-de-impacto.md). Execuções reais: [baseline](baseline.md).

## Estado e evidências

O estado estruturado por slice está em [feature-list.json](feature-list.json); a sequência de sessões está em [progress.md](progress.md). Questões abertas e correções ficam em [feedback.md](feedback.md). Este arquivo concentra a passagem de contexto, evitando outro quadro de status concorrente.

`PRD: C01–C42`, `SPEC: AC-001–AC-018` e a validação funcional final permanecem abertos. S00 não comprova `VAL-001` nem a execução E2E de `VAL-006`.

## S00 → S01

**Fontes/revisão:** hashes e commits no índice. **Entregue:** índice, mapa real do percurso interface → HTTP → domínio → transação JSON → histórico, baseline e protocolo de progresso. Não houve alteração em `src`, testes, seed, dependências ou regras de aprovação/migração.

**Contratos a preservar:** comandos v1 `create/update/advance`, perfil resolvido no servidor, versão da demanda, escrita e histórico na mesma transação, seed imutável e dados isolados. O v1 ainda permite início direto; os testes atuais refletem esse comportamento e não demonstram a política futura.

**Bloqueio de negócio:** registrar aceite D01–D07 no PRD, especialmente D04, conforme spec §1.1 / `VAL-001`. O pedido de S00 não é esse aceite. Se houver mudança, atualizar contratos e testes previstos antes de implementar o comportamento dependente.

**Pendência de ambiente:** Chromium build 1243 ausente. Impede comprovar jornadas E2E e a validação completa de slices funcionais; não impede a leitura das fontes ou o planejamento de S01. Instalar navegador compatível e repetir B02 antes de tratar a baseline de navegador como aprovada. B01 não apresentou falhas prévias de tipos/lint/domínio/API/armazenamento/build.

**Próximo pacote mínimo:** índice → S01 no plano → este handoff → PRD §8 e cenários indicados em S01 (com todas as linhas parametrizadas) → spec §§4.2, 4.5, 4.7 e linhas de legado de §4.8 → arquivos do mapa relativos a schema, armazenamento, `applyCommand`, HTTP e apresentação. Ler guias locais do Next.js antes de escrever código.

**Próxima ação:** resolver a condição documental; depois executar somente a jornada S01, com escritores antigos parados, conversão/backup, leitor e proteção de início coordenados. Não gravar v2 isoladamente. Acrescentar testes de preservação/falha/recusa pela API e comparar com B01/B02. Nenhuma autorização para avançar a S01 é inferida deste handoff.

## Revisão inicial de S00 — B04 (histórico anterior à revisão do harness)

Checklist operacional; não altera os critérios dos slices futuros no plano de origem.

- [x] Fontes presentes, revisão e decisões pendentes identificadas no índice.
- [x] Mapa com criação, edição, execução, identidade, HTTP, JSON, histórico e interface reais; lacunas separadas de cobertura existente.
- [x] Limites de dados, transação, backend, dependências e escopo registrados.
- [x] Baseline executada: `validate` aprovado e E2E com impedimento concreto documentado.
- [x] Isolamento confirmado: temporários, `.local/e2e/`, porta 3100 e um worker; Node.js 24 e servidor de desenvolvimento parado.
- [x] Progresso relaciona slice, fontes, verificações e evidência/pendência, sem aprovar a evolução.
- [x] 48 links locais dos quatro documentos conferidos com resolução relativa e `Test-Path`: nenhum destino ausente. `git diff --exit-code` e `git diff --check` sem alterações/erros em arquivos já rastreados; `git status --short` mostra somente o harness novo e o plano preexistente não rastreado. Conteúdo dos quatro novos documentos revisado; hashes do plano, seed e dados locais permanecem iguais.
- [x] Retomada documental simulada: índice identifica S01 e `VAL-001`; bloco S01 fornece Source IDs/leituras/aceites; este handoff localiza mapa, B01/B02, contratos e próxima ação. O percurso não depende de histórico de conversa nem exige releitura integral das fontes. A simulação termina na validação documental pendente, sem iniciar S01.

## Modelo para cada próximo handoff

Acrescentar uma seção `Sxx → próximos slices`, sem sobrescrever evidências anteriores:

1. Data, branch/revisão e hashes das fontes usadas; Source IDs separados por PRD e SPEC.
2. Comportamento entregue e critérios ainda abertos; arquivos/símbolos alterados e contratos reutilizáveis.
3. Comandos realmente executados, ambiente/isolamento, resultados e caminho de evidência; comparar com a baseline e separar regressões de falhas anteriores.
4. Pendências de negócio/ambiente, dúvidas e bloqueadores diretos; nenhum aceite presumido.
5. Próximo slice e pacote mínimo de leitura, seguindo o grafo do índice.

Se o slice ficar parcial, registrar exatamente o estado verificável e o trabalho restante. Atualizar feature-list.json, progress.md e o mapa quando houver evidência nova, preservando as fontes originais.

## Revisão de S00 após feedback

Local atual: `.agents/harness/`. Links para fontes corrigidos para `../../doc-specs/`. Novos registros e scripts estão no índice; evidência da revisão em progress.md, sessão S00-R1. Os resultados B01–B04 acima são históricos, não novas execuções. Para retomar, executar init.mjs e ler o último progresso, feedback e a entrada S01 no JSON antes de expandir este handoff.
