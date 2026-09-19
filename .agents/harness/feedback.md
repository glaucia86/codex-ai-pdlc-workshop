# Feedback e recuperação

Ciclo: observar problema → registrar fonte e impacto → escolher ação no slice autorizado → executar verificação → anexar evidência e atualizar estado. Problemas de negócio voltam ao PRD/spec; problemas de ambiente não viram alterações genéricas de dependências. Preservar o registro original e acrescentar resolução.

| ID | Origem e observação | Impacto / ação | Estado / evidência |
| --- | --- | --- | --- |
| F01 | Usuário, 19/09/2026: faltam progress.md, feature-list.json, feedback e outros mecanismos do guia indicado | Completar memória entre sessões, lista verificável e rotina de inicialização/encerramento dentro de S00 | Corrigido e verificado pelo agente; arquivos e comandos em [progress.md](progress.md), sessão S00-R1. Aceite do usuário não presumido. |
| F02 | Baseline B02: executável Chromium headless build 1243 ausente; duas jornadas nem iniciaram | Preparar navegador compatível e repetir E2E isolado; sem downgrade ou remoção de testes | Aberto — ambiente. Evidência histórica em [baseline.md](baseline.md). Não bloqueia a preparação de S00, bloqueia comprovação E2E. |
| F03 | PRD §12 e SPEC §1.1 / VAL-001: D01–D07 ainda propostas | Registrar decisão de negócio no PRD, especialmente D04; revisar contratos se houver mudança | Aberto — negócio. Bloqueia S01–S08; JSON registra todas as decisões como pendentes. |
| F04 | Revisão local: harness encontrado em .agents/harness com links ../PRD-v1.md, ../spec-v1.md e ../implementation-slices.md | Corrigir destinos para ../../doc-specs/ e acrescentar verificação repetível de links | Corrigido e verificado: verify.mjs passou no destino final com 65 links válidos; progress.md/S00-R1. |

Para novos registros, indicar ID, data, fonte, resultado esperado/observado, comando ou evidência, slice afetado, ação, estado e verificação de encerramento. Distinguir “corrigido e verificado pelo agente” de “aceito pelo usuário”. Se uma falha reaparecer, reabrir o registro com a nova evidência; não apagar o histórico nem insistir no mesmo comando sem nova hipótese.
