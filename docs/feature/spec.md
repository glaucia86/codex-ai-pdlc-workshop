# Especificação técnica — Aprovação de orçamento

Fonte de produto: [PRD.md](PRD.md). Este documento orienta a implementação; consulte o checkpoint para saber quais partes já estão concluídas.

## Estrutura

Preservar as camadas existentes. Os comandos da API continuam entrando por `src/server/http.ts`, passam por `applyCommand` e são gravados na transação do `JsonStore`. A interface não decide se uma transição é válida.

| Componente                          | Mudança                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| `src/domain/model.ts`               | Estado da aprovação, comandos adicionais e leitura compatível do formato anterior |
| `src/domain/demands.ts`             | Solicitação, decisão, liberação de execução e invalidação                         |
| `src/server/json-store.ts`          | Usar a leitura compatível, preservando trava e gravação existentes                |
| `src/components/approval-panel.tsx` | Estado do orçamento e ações do solicitante/gestor                                 |
| `src/components/demand-detail.tsx`  | Integrar aprovação e disponibilidade de iniciar                                   |
| `src/components/portal.tsx`         | Enviar os novos comandos e mostrar o estado nos cartões                           |
| `tests/approval.test.ts`            | Regras, transições, versões e dados antigos                                       |
| `tests/e2e/approval.spec.ts`        | Jornada real de perfis no navegador                                               |

## Dados

Adicionar `approval` à demanda:

- `status`: Não solicitada, Pendente, Aprovada ou Rejeitada.
- `amountCents`: valor enviado para avaliação, ou `null` quando não há solicitação válida.
- `requestedAt`, `decidedAt`, `decidedById`, `reason`: dados da avaliação atual, nulos quando não se aplicam.

Adicionar `legacyExecution` para identificar demandas já iniciadas no formato anterior. Não gerar uma aprovação fictícia para representar essa exceção.

O arquivo passa de `schemaVersion: 1` para `2`. A leitura de v1 deve validar os campos anteriores, acrescentar o estado inicial de aprovação e preservar todos os registros. Marcar como preexistentes apenas demandas v1 que já estavam em andamento ou concluídas. A gravação posterior usa v2. Dados de versão desconhecida ou inválidos devem falhar claramente, sem reset automático.

## Comandos e transições

| Comando                   | Quem                         | Condições                                           | Resultado                                                           |
| ------------------------- | ---------------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| `request-approval`        | Solicitante da demanda       | Demanda Nova; avaliação Não solicitada ou Rejeitada | Pendente, com cópia do valor e evento no histórico                  |
| `decide-approval`         | Gestor que não é solicitante | Nova, avaliação Pendente, versão e valor atuais     | Aprovada ou Rejeitada; registrar decisão; exigir motivo na rejeição |
| `advance` de Nova         | Solicitante                  | Aprovação Aprovada para o valor atual               | Em andamento                                                        |
| `advance` de Em andamento | Solicitante                  | Transição já permitida pelo starter                 | Concluída; respeita os casos preexistentes                          |
| `update` com novo valor   | Solicitante                  | Ainda não iniciada                                  | Limpar aprovação ou avaliação pendente e registrar invalidação      |
| `update` sem novo valor   | Solicitante                  | Demanda não concluída                               | Preservar avaliação atual                                           |

Toda mutação exige a `version` que o cliente consultou e incrementa a versão uma vez. Operações repetidas ou sobre versão antiga devolvem 409. A rejeição de uma ação não modifica o arquivo nem acrescenta evento de sucesso.

O cliente envia somente o identificador do perfil fictício. Nome e papel são obtidos do cadastro no servidor. Preservar os controles existentes de leitura, edição e movimentação; gestores ganham a ação de decidir, sem ganhar edição das demandas alheias.

## Histórico

Acrescentar eventos para solicitação, aprovação, rejeição e invalidação. Registrar o valor na mensagem do evento pertinente; manter as decisões antigas mesmo depois de limpar o estado de aprovação atual. Armazenar datas ISO em UTC; exibir no fuso de São Paulo.

## Interface

Manter o quadro B. O cartão recebe um indicador de aprovação nas demandas novas; os detalhes recebem um painel com o orçamento em avaliação. O solicitante vê Enviar para aprovação ou Reenviar. O gestor elegível vê Aprovar e Rejeitar, com campo de justificativa.

Enquanto um comando está em execução, impedir envio duplicado pela interface. Em conflito, recarregar os dados e pedir revisão antes de reenviar. Não fechar o formulário com erro nem apagar o texto preenchido.

## Verificação e entrega

Regras puras com teste unitário; persistência e HTTP com testes usando diretórios isolados; fluxo de aprovação pelo navegador. Atualizar o teste do fluxo inicial para incluir aprovação quando o bloqueio for introduzido, preservando as verificações anteriores de criação, edição, conclusão e recarga.

Executar `npm run validate` e `npm run test:e2e`. Não enfraquecer testes para obter sucesso. Registrar o que foi executado e suas limitações em `handoff.md` e no relatório de validação.

## Escolhas de implementação

Validação com Zod, valores inteiros em centavos, conflito otimista por demanda, trava de arquivo para o ciclo completo e nenhuma nova dependência de produção para a feature. O código deve permanecer legível para explicar cada responsabilidade no workshop.
