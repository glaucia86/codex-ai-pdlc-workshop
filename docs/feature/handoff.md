# Handoff — referência concluída

Data: 14/09/2026. Objetivo: adicionar aprovação de orçamento ao Nexo, mantendo execução local e permitindo ensinar o processo em três slices.

## Estado atual

As três slices estão implementadas. `main` permanece starter; `workshop-solution` contém a referência e o guia. Checkpoints 01–04 permitem recuperar preparação, solicitação, decisão e regras finais. Consulte os refs reais do Git para confirmar a versão aberta.

- Regras no domínio, chamadas pela API dentro da transação JSON.
- UI com envio, decisão, justificativa, reenvio, indicação de aprovação e bloqueio de início/valor.
- Compatibilidade v1→v2 sem perda de demandas e sem aprovação retroativa fictícia.
- Histórico preservado e conflito de versão para ações antigas ou concorrentes.

## Decisões vigentes

Aprovação vinculada ao valor inteiro em centavos. Qualquer gestor elegível pode decidir, nunca o próprio solicitante. Alterar outros campos sem mudar valor não invalida a avaliação neste recorte. Todos consultam; só o solicitante edita e movimenta. Perfis são fictícios, sem autenticação. JSON local; nenhuma dependência adicional de produção na feature.

## Evidência executada

`npm run validate`: tipos, lint, **18 testes** e build passaram. `npm run test:e2e`: **4 jornadas** passaram com Chromium local. Starter também passou por instalação limpa. Resultados, condições e limites em `docs/instructor/verification.md`.

## Arquivos a consultar conforme a tarefa

- Intenção e aceite: `docs/feature/PRD.md`.
- Arquitetura da mudança: `docs/feature/spec.md`.
- Regras: `src/domain/model.ts` e `src/domain/demands.ts`.
- Transação e API: `src/server/json-store.ts` e `src/server/http.ts`.
- Aprovação visual: `src/components/approval-panel.tsx`.
- Condução da aula: `docs/instructor-guide.md`.

## Próximo passo concreto

A instrutora deve fazer um ensaio cronometrado a partir do starter em uma pasta nova, registrar tempos em `docs/instructor/rehearsal.md` e ajustar a facilitação para encerrar às 13h30. Conferir os resultados da CI publicada e o ambiente que será levado ao evento.

Não há deploy público previsto. Não ampliar o escopo com banco, login, notificações ou alçadas sem uma nova decisão de produto. Ao continuar, confira Git e arquivos antes de presumir que o estado desta nota é o mais recente.
