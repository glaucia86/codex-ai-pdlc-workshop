# Rules for Devin CLI

Este arquivo define as regras globais para execucao de agentes de coding AI, incluindo Devin CLI, neste repositorio. Ele deve ser tratado como contrato operacional do projeto. Importante: seguir este arquivo nao significa carregar todos os documentos do repositorio na janela de contexto; significa usar este arquivo como roteador de contexto e carregar apenas o minimo necessario para o slice atual.

## 1. Onde manter as regras

Use a seguinte organizacao:

| Local | Papel | Quando usar |
|---|---|---|
| `rules.md` | Politica global do projeto para agentes AI | Carregar no inicio como roteador de contexto |
| `AGENTS.md` | Regras resumidas compartilhadas por coding assistants | Consultar no inicio ou quando houver duvida de regra global |
| `doc-agents/` | Detalhamento de arquitetura, convencoes e testes | Consultar sob demanda, conforme o tipo de arquivo a alterar |
| `doc-specs/` | Fonte de escopo da feature atual | Consultar somente o slice e os IDs relevantes |
| `.devin/skills/` | Skills reutilizaveis do Devin | Usar somente quando a capacidade for necessaria |
| `.devin/harness/<feature>/` | Evidencias, progresso, handoff e mapa de impacto da feature | Usar como memoria compacta entre janelas |

Regra pratica para Devin CLI: carregue `rules.md` no prompt inicial ou configure o projeto para referencia-lo como instrucao de repositorio, se a versao do CLI suportar esse mecanismo. Skills em `.devin/skills/` devem complementar estas regras, nunca sobrescreve-las. Se houver risco de estouro de contexto, priorize `rules.md`, o slice atual e o handoff mais recente.

## 2. Protocolo de contexto sob demanda

Antes de qualquer implementacao, o agente deve montar um context pack minimo. O objetivo e preservar janela para raciocinio, TDD, codigo e verificacao.

### 2.1 Context pack minimo no inicio do slice

1. Ler `rules.md`, priorizando as secoes 2, 3, 4, 10, 11 e 13.
2. Ler `AGENTS.md` apenas para confirmar regras globais e limites do projeto.
3. Ler em `doc-specs/implementation-slice.md` somente o slice atual e, no maximo, as regras globais aplicaveis ao slice.
4. Ler em `doc-specs/spec-final.md` somente os IDs citados pelo slice atual.
5. Ler o handoff mais recente em `.devin/harness/<feature>/handoff.md`, se existir.
6. Localizar arquivos-alvo com busca (`rg`, mapa de pacotes, testes proximos) antes de abrir arquivos grandes.
7. Abrir somente os arquivos de codigo e teste diretamente relacionados ao slice.

### 2.2 Leitura sob demanda de documentos especializados

Nao carregar todos os arquivos especializados por padrao. Use a tabela abaixo:

| Se a tarefa tocar... | Ler sob demanda |
|---|---|
| Pacotes, camadas, ports, adapters, clients | `doc-agents/architecture.md` |
| DTOs, controllers, services, mappers, exceptions, logs | `doc-agents/conventions.md` |
| Testes unitarios, integracao, WireMock, Jacoco | `doc-agents/testing.md` |
| Regra funcional, aceite, fluxo de funding | Trecho relevante de `doc-specs/spec-final.md` |
| Ordem de entrega e DoD do slice | Trecho relevante de `doc-specs/implementation-slice.md` |
| Capacidade tecnica especifica do Devin | Skill especifica em `.devin/skills/` |

### 2.3 O que nao fazer com contexto

- Nao carregar `spec-final.md` inteiro quando o slice cita apenas alguns IDs.
- Nao carregar todos os skills antes de saber qual sera usado.
- Nao reler arquivos ja resumidos no handoff, salvo se o codigo mudou.
- Nao abrir arquivos grandes de `target/`, fixtures ou WireMock sem necessidade pontual.
- Nao transformar pesquisa em implementacao; primeiro localizar, depois editar.

### 2.4 Passos obrigatorios antes de editar

1. Mapear arquivos impactados.
2. Explicar a intencao da mudanca ao usuario.
3. Apresentar arquivos-alvo, motivo, risco e testes quando a regra HITL exigir.
4. Pedir aprovacao quando a regra HITL exigir.

O agente deve tratar contexto como recurso de engenharia. A prioridade e manter informacao suficiente para decidir bem, sem sacrificar espaco para implementacao e verificacao.

## 3. Regra HITL obrigatoria

HITL significa Human in the Loop. Neste projeto, o agente deve envolver o usuario antes de qualquer alteracao que possa afetar comportamento existente.

### 3.1 Pode fazer sem pedir aprovacao previa

- Ler arquivos, buscar referencias e mapear dependencias.
- Executar comandos de diagnostico nao destrutivos, como `mvn test`, `mvn verify`, `git diff`, `git status` e buscas com `rg`.
- Criar ou atualizar arquivos de documentacao pedidos explicitamente pelo usuario.
- Criar arquivos de harness em `.devin/harness/<feature>/` quando isso fizer parte do plano.
- Criar testes novos quando eles apenas documentam o comportamento do escopo aprovado.

### 3.2 Deve pedir aprovacao antes de executar

- Alterar qualquer arquivo de codigo existente em `app/src/main/java`.
- Alterar qualquer teste existente em `app/src/test/java`.
- Criar novo arquivo de codigo de producao.
- Alterar contratos publicos: endpoints, DTOs, codigos de erro, payloads, status HTTP ou headers.
- Alterar configuracoes de runtime, profiles, properties ou YAMLs.
- Alterar comportamento de integracoes externas, incluindo PG5, STS, QuickConfig, DynamoDB, WireMock e clients Feign.
- Fazer refactor, rename, move ou formatacao ampla.
- Alterar dependencias, plugins, Jacoco, Maven, build ou pipeline.

Antes de pedir aprovacao, o agente deve apresentar:

- objetivo da mudanca;
- arquivos que pretende alterar;
- motivo tecnico;
- risco esperado;
- testes que serao executados.

### 3.3 Nunca fazer sem instrucao explicita

- `git reset --hard`, `git checkout --`, force push, limpeza destrutiva ou remocao massiva.
- Alterar `infra/`, `Dockerfile`, `docker-compose.yml`, `entrypoint.sh` ou configuracao de infraestrutura.
- Alterar `RestClientFeignConfig` ou o fluxo de autenticacao STS.
- Alterar `pom.xml` sem aprovacao explicita.
- Introduzir framework, dependencia ou padrao novo sem aprovacao explicita.
- Comitar, criar branch ou abrir pull request sem pedido direto do usuario.
- Expor CPF, CNPJ, tokens, senhas, secrets, auth headers ou payloads sensiveis em logs, respostas, fixtures ou documentacao.

### 3.4 Politica de modelos e custo

O Devin CLI permite troca manual de modelo. Neste repositorio, a troca deve ser tratada como gate HITL entre a implementacao do slice e a atualizacao do harness.

Padrao operacional:

- Implementacao de slice: preferir `GLM-5.2`.
- Atualizacao de harness/documentacao operacional: preferir `SWE-1.6`.
- Revisao, arquitetura ou desbloqueio de alto risco: usar `GPT-5.5` apenas como escalonamento pontual, especialmente em slices com DynamoDB, concorrencia, idempotencia, falhas PG5 ou regressao dificil.

Ao concluir o comportamento verificavel de um slice, antes de atualizar `.devin/harness/<feature>/`, o agente deve parar e emitir o gate:

```text
Slice <NN> concluida. Quer alterar manualmente o modelo para SWE-1.6 antes de atualizar o harness?
```

Se o usuario confirmar a troca, o agente deve aguardar a confirmacao de que o modelo foi alterado antes de continuar. Se o usuario decidir nao trocar, o agente pode atualizar o harness com o modelo atual, registrando a decisao em `progress.md` quando relevante.

Este gate tambem se aplica quando a atualizacao do harness for disparada por skill ou slash command. Para atualizar `.devin/harness/<feature>/`, use a skill `/harness-update`, que exige confirmacao textual antes de escrever. A skill `/handoff-session` deve continuar reservada para handoff temporario fora do workspace e nao deve ser usada como caminho oficial de atualizacao do harness.

Limites para `SWE-1.6` no harness:

- Pode atualizar apenas arquivos em `.devin/harness/<feature>/`, como `progress.md`, `verification.md`, `handoff.md`, `README.md`, `change-boundaries.md`, `feature-list.json` e documentos auxiliares de estrategia.
- Nao pode alterar codigo de producao, testes, `pom.xml`, configs, contratos publicos, infra ou STS.
- Nao pode registrar comando, resultado, cobertura, erro ou evidencia que nao tenha sido executado/observado no slice.
- Deve manter `feature-list.json` como JSON valido quando alterar status ou criterios.
- Deve registrar pendencias e riscos sem mascarar regressao ou bloqueio de ambiente.

## 4. Limites de escopo da branch atual

A feature da branch atual deve ser implementada a partir dos documentos em `doc-specs/`. O agente deve considerar `doc-specs/spec-final.md` e `doc-specs/implementation-slice.md` como fontes de verdade para escopo, criterios de aceite e ordem de entrega.

Regras de escopo:

- Nao alterar fluxo existente fora do escopo definido em `doc-specs/`.
- Preservar comportamento atual para propostas fora do escopo da feature.
- Implementar por slices verticais pequenos, com teste verificavel por slice.
- Nao misturar slices diferentes na mesma execucao quando isso aumentar risco.
- Se aparecer necessidade de refactor amplo, registrar como risco ou proposta separada, nao executar automaticamente.
- Se houver conflito entre codigo existente, `AGENTS.md`, `doc-agents/` e `doc-specs/`, parar e pedir decisao ao usuario.

## 5. Arquitetura obrigatoria

O projeto segue arquitetura hexagonal. O agente deve preservar os limites abaixo:

- Controllers devem ser finos e retornar `BffResponse<T>`.
- Controllers nao podem conter regra de negocio.
- Services contem logica de negocio pura.
- Services nao fazem chamada HTTP direta.
- Adapters lidam com I/O, clients externos, tratamento de erro de integracao e conversao.
- Novas integracoes devem usar OpenFeign no padrao do projeto.
- DTOs e domains devem usar `record`, quando coerente com o padrao existente.
- Mappers devem usar MapStruct quando houver conversao entre camadas.
- Injeção deve seguir padrao Spring/Lombok existente, principalmente `@RequiredArgsConstructor`.
- Paralelismo de chamadas externas deve seguir padrao existente, preferencialmente `CompletableFuture` quando aplicavel.

## 5.1 Convencao de nomenclatura

- Nomes de dominio, regra de negocio, variaveis, funcoes, metodos, classes e arquivos devem seguir portugues do Brasil (pt-BR), conforme o padrao da codebase.
- Termos ligados a stack, frameworks, bibliotecas, protocolos, produtos tecnicos ou contratos externos podem permanecer em ingles, por exemplo Docker, DynamoDB, Feign, Repository, Service, Adapter, Mapper, Request, Response, PK, SK, GSI, HTTP, JSON e statuses de integracao.
- Quando um termo fizer parte do nome da feature ou da especificacao, como `Funding`, ele pode permanecer em ingles; os demais qualificadores de dominio devem ficar em pt-BR.

## 6. Erros e respostas

- Todos os erros de negocio ou integracao devem usar `AgroException` e `ErrosGlobais`.
- Nao criar exception nova fora do padrao `AgroException` + `ErrosGlobais`.
- Nao retornar stack trace em resposta HTTP.
- Nao revelar detalhe tecnico interno em mensagem publica.
- Para funding, preservar os contratos definidos em `doc-specs/spec-final.md`, incluindo `BGTP_E065` e `BGTP_E066` quando aplicavel.
- Erros publicos nao devem revelar saldo, funding total, gerente regional, funcional, status de ledger, DynamoDB, PG5, QuickConfig ou causa tecnica interna.

## 7. Logs e seguranca

Logs devem ser estruturados com `kv()` do Logstash.

Obrigatorio:

- Logar entrada, saida e principais decisoes operacionais com campos estaveis.
- Usar `reasonCode` interno para bloqueios e decisoes importantes.
- Usar `eventName` quando previsto na spec.
- Logar identificadores tecnicos permitidos, como `idProposta`, `idSimulacao`, `idPessoa` ou correlation id, quando nao forem sensiveis.

Proibido:

- Logar CPF, CNPJ, nomes de clientes, tokens, senhas, secrets, auth headers, payload completo ou JSON completo do Portal Manager.
- Logar dados que permitam inferir saldo disponivel, funding total ou hierarquia sensivel em resposta publica.
- Incluir secrets em fixtures, documentacao ou exemplos.

## 8. Regras especificas da feature de funding

Enquanto a branch tratar o guardrail de Funding da Exigibilidade VSR, o agente deve obedecer:

- Nao bloquear simulacao; funding atua apenas na criacao da proposta.
- Aplicabilidade restrita a `Credito Rural Varejo + RO/Recursos Obrigatorios + DEMAIS/Geral`, conforme normalizacao da spec.
- CPR, Credito Rural RL, Pronamp, Pronaf e demais programas fora do MVP devem preservar fluxo atual.
- Credito Rural Varejo + RO com programa ausente, branco, desconhecido ou nao mapeavel deve falhar fechado antes do PG5.
- `valorOperacao` deve vir de `simulacao.orcamento().valorFinanciadoTotal()`.
- `periodoParametro` deve vir de `recursoEscolhido.safra`.
- Funcional do usuario deve vir de fonte confiavel do BFF, como `CustomHeaders.get(EMPLOYEE_ID)`, nunca do body frontend.
- Nao fazer retry automatico sincrono do `POST /propostas` PG5 apos reserva.
- Nao criar cache proprio de ultimo valor valido para `FUNDING_EXIGIBILIDADE_GERENTES_REGIONAIS`.
- Nao criar TTL automatico em ledgers ou agregados DynamoDB.
- Se DynamoDB for introduzido, usar AWS SDK v2 e padrao QuickCloud/Enhanced Client; AWS SDK v1 nao deve ser introduzido.
- Saldo online deve seguir `funding_total - AgregadoPoteFunding.valorComprometidoCentavos`.
- Estados do registro funding devem permanecer no contrato `RESERVED`, `ACTIVE`, `FAILED_PG5`, `CANCELLED`.

## 9. Testes e qualidade

Nenhuma implementacao deve ser considerada concluida sem teste proporcional ao risco.

Obrigatorio:

- Testes unitarios para regras puras, normalizacao, validacao, resolucao e erros.
- Testes de adapter para integracoes e mapeamento de falhas.
- Testes de integracao com WireMock quando o fluxo passar por endpoint externo.
- Nomenclatura no padrao `deve{Acao}Quando{Condicao}()` ou equivalente existente.
- Padrao AAA: Arrange, Act, Assert.
- Cobertura minima Jacoco LINE de 90% no fechamento.
- Executar o menor comando de teste aplicavel durante o slice.
- Executar `cd app && mvn clean verify` em gates de release ou quando o slice tocar fluxo critico.

Se os testes falharem por ambiente, o agente deve registrar:

- comando executado;
- erro principal;
- evidencia relevante;
- impacto para o aceite;
- proximo passo recomendado.

O agente nao deve mascarar regressao nem alterar teste para esconder falha.

## 10. Harness engineering

Para features grandes, o agente deve manter um harness em `.devin/harness/<feature>/` com:

- `README.md` com objetivo e fontes lidas;
- `change-boundaries.md` com limites de alteracao;
- `feature-list.json` com slices e criterios;
- `progress.md` com progresso e decisoes;
- `verification.md` com comandos e resultados;
- `handoff.md` com contexto para continuar em nova sessao.

Arquivos auxiliares podem ser adicionados quando reduzirem risco operacional, como `model-strategy.md` para registrar a politica de modelos da feature.

Atualizacoes finais de harness apos conclusao de slice devem usar `/harness-update` ou seguir exatamente o mesmo preflight: confirmacao explicita de modelo antes de qualquer escrita em `.devin/harness/<feature>/`. Nao use `/handoff-session` como substituto desse fluxo.

O harness deve ser atualizado quando:

- um slice comeca;
- um arquivo relevante e alterado;
- um teste importante passa ou falha;
- uma decisao de escopo e tomada;
- a sessao se aproxima de perda de contexto.

## 11. Controle de contexto

O agente deve trabalhar em Smart Zone:

- carregar apenas o contexto necessario para o slice atual;
- evitar leitura ampla e improdutiva;
- evitar implementar quando o contexto estiver saturado;
- dividir tarefas grandes em slices menores;
- fazer handoff antes de continuar se houver risco de perda de contexto.

### 11.1 Fluxo recomendado por slice

Use este ciclo para cada slice de `doc-specs/implementation-slice.md`:

1. Carregar o context pack minimo do slice.
2. Criar ou atualizar o harness da feature.
3. Mapear arquivos-alvo e testes proximos.
4. Usar a skill `tdd` somente quando for escrever ou ajustar testes.
5. Implementar o menor comportamento verificavel do slice.
6. Executar o menor comando de teste aplicavel.
7. Aplicar o gate de modelo da secao 3.4 antes de atualizar o harness final do slice.
8. Atualizar `progress.md`, `verification.md` e `handoff.md`.
9. Encerrar ou continuar apenas se ainda houver contexto saudavel.

### 11.2 Limites praticos de janela

- Ate cerca de 40% da janela: Smart Zone forte; pode explorar, testar e implementar com boa margem.
- Entre 40% e 50%: reduzir leitura, evitar novos escopos e focar em concluir o comportamento ja iniciado.
- Entre 50% e 60%: nao iniciar novo subproblema; preparar handoff antes de editar mais codigo.
- Acima de 60%: parar implementacao, atualizar handoff e continuar em nova janela.

Estes percentuais sao heuristicas operacionais. Se o agente demonstrar confusao antes disso, aplicar handoff mais cedo.

Sinais de Dumb Zone:

- o agente comeca a repetir leituras sem conclusao;
- mistura escopos de slices diferentes;
- tenta resolver falha com refactor amplo;
- esquece criterios de aceite ja lidos;
- passa a propor atalhos inseguros.

Ao detectar Dumb Zone, o agente deve parar a implementacao, atualizar handoff/progresso e pedir retomada em nova sessao.

### 11.3 Conteudo minimo do handoff

O handoff deve ser compacto e suficiente para retomar sem reler tudo:

- slice atual e objetivo;
- arquivos lidos e arquivos alterados;
- decisoes tomadas;
- testes criados, alterados ou planejados;
- comandos executados e resultado;
- pendencias e proximo passo exato;
- riscos ou perguntas abertas.

## 12. Definition of Done para agentes AI

Uma tarefa so pode ser entregue quando:

- o escopo implementado corresponde ao pedido do usuario e aos documentos em `doc-specs/`;
- o agente respeitou HITL para alteracoes existentes;
- os arquivos alterados foram listados e justificados;
- os testes relevantes foram criados ou atualizados;
- os testes aplicaveis foram executados ou o bloqueio foi documentado;
- nao ha alteracao fora do escopo;
- nao ha dado sensivel exposto;
- nao ha dependencia ou padrao novo sem aprovacao;
- o handoff esta atualizado, quando a tarefa fizer parte de uma feature longa;
- a resposta final informa claramente o que mudou, como foi validado e quais riscos restam.

## 13. Prompt recomendado para Devin CLI

Use um prompt inicial neste formato:

```text
Leia rules.md como roteador de contexto, nao como ordem para carregar tudo.
Monte um context pack minimo: rules.md, AGENTS.md resumido, slice atual de doc-specs/implementation-slice.md, IDs relevantes de doc-specs/spec-final.md e handoff mais recente se existir.
Trabalhe no slice <ID_DO_SLICE> da feature atual.
Use GLM-5.2 para implementar o slice, salvo decisao explicita em contrario.
Use a skill tdd somente quando for escrever ou ajustar testes.
Antes de alterar qualquer codigo existente, apresente os arquivos-alvo, motivo, risco e testes, e aguarde minha aprovacao.
Nao altere infra, STS, pom.xml, Dockerfile, docker-compose.yml ou fluxo fora do escopo.
Se a janela chegar perto de 50% a 60%, pare novas alteracoes, atualize o handoff e reporte o proximo passo exato para continuar em nova janela.
Ao finalizar o comportamento verificavel do slice, antes de atualizar o harness, pare e pergunte: "Slice <ID_DO_SLICE> concluida. Quer alterar manualmente o modelo para SWE-1.6 antes de atualizar o harness?".
Apos a decisao do usuario, use `/harness-update` para atualizar progress.md, verification.md e handoff.md quando aplicavel, e reporte testes executados. Nao use `/handoff-session` para atualizar `.devin/harness/`.
```

## 14. Precedencia de regras

Quando houver conflito, aplicar esta ordem:

1. Instrucao explicita mais recente do usuario.
2. `rules.md`.
3. `AGENTS.md`.
4. `doc-specs/`.
5. `doc-agents/`.
6. Padroes inferidos do codigo existente.

Se o conflito envolver seguranca, dados sensiveis, infraestrutura, autenticacao, escopo de negocio ou contrato publico, o agente deve parar e pedir decisao humana antes de prosseguir.

## 15. Delegacao de comandos Maven ao usuario

O agente **nao deve executar** comandos `mvn` (compile, test, verify, clean, install, etc.). Esses comandos podem travar a sessao por tempo prolongado e a usuaria prefere executa-los manualmente para manter o processo fluido.

Padrao operacional:

- Quando o agente precisar validar compilacao, testes ou cobertura, deve **sinalizar** o comando exato a ser executado, por exemplo:
  - `cd app && mvn -q compile`
  - `cd app && mvn test`
  - `cd app && mvn clean verify`
- O agente deve **aguardar** a usuaria confirmar a execucao e o resultado antes de continuar a lista de tarefas.
- Se a usuaria reportar falha, o agente deve tratar o erro, propor correcao e repetir o ciclo.
- Se a usuaria reportar sucesso, o agente deve marcar a tarefa de verificacao como concluida e prosseguir.
- Esta regra nao se aplica a comandos nao-Maven (git, grep, find, etc.), que podem ser executados normalmente pelo agente quando necessarios.