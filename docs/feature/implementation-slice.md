# Plano de implementação por pequenas entregas

Fonte: [PRD](PRD.md) e [especificação](spec.md). Os estados abaixo descrevem o que verificar em cada checkpoint; não são um registro automático de tarefas concluídas.

## Preparação — checkpoint-01

Produto existente funcionando; PRD, especificação, instruções e skill disponíveis; plano legível; validação inicial passando.

## Slice 1 — Solicitar avaliação · checkpoint-02

**Objetivo:** Ana envia um orçamento e enxerga a avaliação pendente.

**Dependência:** preparação.

**Mudança vertical:** dados compatíveis com v1, comando `request-approval`, regra no domínio, rota existente aceitando o novo comando, painel e indicador de aprovação na interface.

**Aceite:** a solicitação copia o valor atual; apenas o solicitante envia; reenvio duplicado é recusado; histórico registra a ação; demandas antigas permanecem. O bloqueio de execução ainda será acrescentado na slice seguinte.

**Verificação:** testes de solicitação e migração; `npm run validate`; demonstração de envio pela interface.

## Slice 2 — Decidir e liberar execução · checkpoint-03

**Objetivo:** Bruno decide e Ana só inicia com aprovação válida.

**Dependência:** slice 1.

**Mudança vertical:** comando de decisão; restrição a gestor não solicitante; justificativa obrigatória; histórico; painel de decisão; bloqueio no backend e na interface.

**Aceite:** aprovação libera início; rejeição com motivo fica registrada; rejeição vazia, autoaprovação e decisão por solicitante falham; demandas antigas em andamento podem ser concluídas.

**Verificação:** testes das regras, revisão do teste E2E do fluxo inicial para refletir a nova política, `npm run validate` e `npm run test:e2e`.

## Slice 3 — Reavaliar e preservar o histórico · checkpoint-04

**Objetivo:** uma mudança do valor não reutiliza aprovação antiga.

**Dependência:** slice 2.

**Mudança vertical:** invalidação por mudança real de centavos; retirada da avaliação pendente; reenvio após correção; valor bloqueado após início; mensagens claras nos detalhes.

**Aceite:** R$ 1.200 aprovado, alterado para R$ 1.500, exige reenvio; mesmo valor mantém aprovação; edição durante avaliação torna a decisão antiga inválida; histórico permanece; reenvio após rejeição funciona.

**Verificação:** testes de conflito, igualdade monetária, reenvio e dados antigos; fluxo completo no navegador; validação agregada; revisão e handoff.

## Contrato de conclusão de cada slice

O resultado funciona de ponta a ponta e possui evidência executada. Registrar arquivos alterados, testes, resultado e próximo passo. Se a alteração ficar grande ou o agente perder o foco, concluir um ponto coerente, registrar um handoff e iniciar outra sessão com apenas o contexto necessário.

Não implementar a slice seguinte automaticamente quando o pedido delimitar a atual. O ritmo da aula é conduzido pela instrutora.
