# Verificações específicas da aprovação

Consultar quando a alteração tocar as regras de orçamento. A fonte do comportamento é `docs/feature/PRD.md`.

- Distinguir solicitante e gestor; um gestor não decide a própria demanda.
- Verificar uma tentativa pelo backend, além de botões disponíveis ou desabilitados.
- Rejeição vazia falha; o motivo de uma rejeição válida permanece no histórico.
- Comparar valores em centavos: valor diferente exige reenvio; apenas formatação diferente não muda a aprovação.
- Uma edição enquanto a avaliação está pendente impede decisão sobre a versão antiga.
- Depois do início, alteração do valor falha; demandas antigas em andamento continuam podendo ser concluídas.
- Verificar que os testes usam diretórios isolados e que a leitura de v1 não inventa aprovações nem apaga histórico.

Use `tests/approval.test.ts` e os testes E2E como evidências conforme eles forem implementados. Um arquivo ausente no checkpoint atual indica trabalho ainda pendente, não uma verificação realizada.
