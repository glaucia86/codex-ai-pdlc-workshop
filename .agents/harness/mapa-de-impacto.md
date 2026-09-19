# Mapa de impacto

Referência: [índice e revisão das fontes](README.md). Mapa obtido por inspeção do código v1, sem grafo graphify existente e sem novas ferramentas. Símbolos abaixo são localizadores pesquisáveis, não funcionalidades futuras presumidas.

## Percurso existente

`Page` → `Portal` / `DemandForm` / `DemandDetail` → `mutate` → POST `/api/demands` → `handlers.POST` → `JsonStore.update` → `applyCommand` / `addEvent` → validação do JSON e renome atômico → resposta → `refresh` / GET → detalhes e histórico.

| Ponto real | Responsabilidade atual | Slices / fontes que fundamentam mudanças futuras | Verificação existente e lacuna |
| --- | --- | --- | --- |
| [model.ts](../../src/domain/model.ts): `inputSchema`, `commandSchema`, `databaseSchema`, `eventSchema` | Schema v1; comandos `create`, `update`, `advance`; valores inteiros em centavos; quatro tipos de eventos | S01–S06; PRD: RN01, RN11, RN15–RN21; SPEC: REQ-001, REQ-008, REQ-010–REQ-013 | Domínio/API/armazenamento abaixo; faltam schema v2, ciclos, migração e comandos de avaliação |
| [demands.ts](../../src/domain/demands.ts): `applyCommand`, ramo `create` | Resolve perfil em `db.users`, cria Nova, contador, versão e evento | S01; PRD: RN01–RN02; SPEC: REQ-001, REQ-005 | Teste do fluxo inicial; falta criação Nova / Não enviada e bloqueio de início |
| [demands.ts](../../src/domain/demands.ts): ramos `update` e `advance` | Titularidade global, conflito de versão, edição e transições Nova → Em andamento → Concluída | S01, S03–S06, S08; PRD: RN08–RN14, RN17–RN19; SPEC: REQ-003–REQ-009, REQ-011, REQ-013 | Testes de titularidade e versão; faltam autorização, invalidação, bloqueio monetário, decisões e corridas por ciclo |
| [currency.ts](../../src/domain/currency.ts): `parseAmount`, `formatAmount` | Conversão monetária e exibição em reais | S01, S03; PRD: D06, RN09–RN11; SPEC: REQ-006, REQ-008 | Teste monetário existente; ampliar limites e equivalência dos exemplos do PRD |
| [http.ts](../../src/server/http.ts): `handlers`, `POST`, `failure`; [route.ts](../../src/app/api/demands/route.ts) | GET/POST, perfil via `x-demo-user` resolvido pelo domínio, origem, conteúdo/tamanho/JSON, erros; Node.js e dados sem cache | S01–S08 conforme comando; PRD: RN14, RN17–RN19; SPEC: SEC-001–SEC-006, REQ-011 | HTTP testa perfil, entrada, origem, titularidade e consulta; falta matriz de aprovação pela API direta |
| [json-store.ts](../../src/server/json-store.ts): `locked`, `current`, `load`, `write`, `update` | Trava exclusiva, seed se ausente, validação, temporário exclusivo, sync e rename; resposta após escrita | S01, S08 e integridade em cada ação S02–S06; PRD: RN19–RN21; SPEC: CON-002, REQ-011–REQ-012, VAL-004–VAL-005 | Concorrência com duas instâncias, arquivo inválido e corrupção; faltam migração/backup exclusivo, falha real de escrita/rename e corridas de decisão |
| [demands.ts](../../src/domain/demands.ts): `addEvent`; [demand-detail.tsx](../../src/components/demand-detail.tsx): `demand.history` | Evento com pessoa/data junto da mutação; renderização do histórico | S01–S06, S08; PRD: RN15–RN16, RN19, RN21; SPEC: REQ-010–REQ-012 | Fluxo inicial valida pessoa/data; E2E consulta conclusão após recarga; faltam eventos/ciclos de aprovação e preservação de legado |
| [portal.tsx](../../src/components/portal.tsx): `actorId`, `loadDatabase`, `mutate`, `save`, `filtered` | Perfil de demonstração, fetch, criação/edição, busca/filtros, atualização e erro | S01–S08; PRD: D07, RN14, RN17–RN19, C40–C42; SPEC: REQ-014–REQ-015 | E2E atual; faltam filtro de avaliações, contexto capturado, conflito revisado e resultado incerto |
| [demand-form.tsx](../../src/components/demand-form.tsx), [demand-detail.tsx](../../src/components/demand-detail.tsx), [shared.tsx](../../src/components/shared.tsx), [modal.tsx](../../src/components/modal.tsx) | Formulário, valor, ações, situação de execução, histórico e modal | S01–S07; PRD: RN09–RN11, RN15, C40–C42; SPEC: REQ-006, REQ-008, REQ-014–REQ-015 | Jornada e 390 px atuais; faltam decisões, mensagens, teclado e 360 px da evolução |

`src/domain/approval.ts` e `src/domain/migrations.ts` são **propostos** em spec §4.1; não existem nesta revisão e não são entregas de S00.

## Cobertura de referência

| Arquivo | Cobertura inspecionada |
| --- | --- |
| [demands.test.ts](../../tests/demands.test.ts) | 4 testes: fluxo e autoria/data; titularidade; conflito de versão; centavos e formatos |
| [http.test.ts](../../tests/http.test.ts) | 1 teste com múltiplas asserções: perfil, valor inválido, origem, criação, movimentação alheia e GET |
| [store.test.ts](../../tests/store.test.ts) | 3 testes: 12 criações concorrentes em duas instâncias e releitura; alteração inválida preserva bytes; corrupção preservada e backup no reset temporário |
| [starter.spec.ts](../../tests/e2e/starter.spec.ts) | 2 jornadas: criar/editar/iniciar/concluir/buscar/reabrir histórico; largura 390 px, vazio e tema |
| [helpers.ts](../../tests/helpers.ts) | Seed somente lida; `temporaryStore` usa `mkdtemp(tmpdir())` e limpeza restrita ao diretório criado |

Esses testes não comprovam aprovação. Em particular, rejeitar callback/estado inválido não comprova falha real de escrita; 390 px não comprova o aceite em 360 px; início direto é comportamento anterior a mudar em S01.

## Fontes → entregas → verificações futuras

Seleção focal para navegação, complementada pelos Source IDs completos de cada slice e pela matriz §4 do [plano](../../doc-specs/implementation-slices.md). Todas as verificações funcionais abaixo permanecem pendentes.

| Slice | PRD | SPEC | Verificação a acrescentar nas fronteiras acima |
| --- | --- | --- | --- |
| S00 | D01–D07, RN19, RN21 | CON-001–CON-003, PLT-001–PLT-003, COM-001, VAL-001, VAL-003, VAL-006, VAL-008 | Links, revisão, isolamento, baseline, diff e retomada; evidências em baseline/handoff |
| S01 | D06–D07, RN01–RN02, RN11, RN20–RN21, C34–C39 | REQ-001, REQ-005, REQ-008, REQ-012, REQ-014, AC-001, AC-011, AC-015–AC-017 | Legados/backup/falhas, criação sem início, conclusão dispensada; domínio + store + HTTP + E2E |
| S02 | RN02–RN05, RN22–RN23, C04, C07–C08, C15, C33, C39 | REQ-002, REQ-010, REQ-013, AC-003–AC-004, AC-007 | Envio, elegibilidade, recusa direta, persistência e histórico |
| S03 | RN09–RN11, RN13, C16–C20, C22–C24 | REQ-006–REQ-008, AC-008–AC-009, AC-011 | Mudança efetiva/equivalente do valor, invalidação e preservação histórica |
| S04 | RN04–RN05, RN08, RN17–RN19, C21, C25–C28 | REQ-003, REQ-005, REQ-011, AC-002–AC-003, AC-010–AC-013 | Gestor correto, versão/ciclo, aprovação → início → conclusão; concorrência e bloqueio de valor |
| S05 | RN06–RN07, RN12, C09–C12, C31, C42 | REQ-004, REQ-009–REQ-010, AC-005–AC-006 | Justificativa, correção, reenvio e decisões anteriores preservadas |
| S06 | RN03–RN04, RN16, RN18, RN23, C13–C15 | REQ-002, REQ-013, AC-004, AC-007 | Troca atômica, gestor/ciclo anterior recusado pela API e interface |
| S07 | D07, RN03–RN05, RN15, RN21, C40–C42 | REQ-014–REQ-015, AC-018, VAL-007 | Filtro/perfil/busca → contexto → decisão; teclado, 360 px, requisições |
| S08 | RN17–RN19, C20, C25–C33, C39–C42 | REQ-011, REQ-015, AC-012–AC-014, AC-017–AC-018, VAL-003, VAL-005–VAL-008 | Duas telas/instâncias, falha antes de rename, resposta perdida, GET falho após POST, integração de C01–C42 / AC-001–AC-018 |

Uma fonte fundamenta a entrega; somente teste realmente executado verifica aceite. Compartilhar arquivo ou requisito não significa que um slice dependa de outro além do grafo do índice.
