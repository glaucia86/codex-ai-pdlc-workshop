# Nexo — contexto inicial

Portal local de demandas internas para um workshop. A branch `main` é o produto existente; `workshop-solution` contém a referência desenvolvida por checkpoints.

## Encontrar o código

- `src/domain/`: tipos, validação e regras de negócio.
- `src/server/`: API e armazenamento JSON.
- `src/components/`: interface React do quadro e dos formulários.
- `data/seed.json`: exemplos versionados; dados de trabalho ficam em `.local/`.
- `tests/`: testes isolados e fluxo pelo navegador.
- `CONTEXT.md`: vocabulário; `docs/architecture.md`: organização.

## Executar e verificar

Node.js 24. Use `npm ci`, `npm run dev` e `npm run validate`.
Após mudanças de interface ou de fluxo, execute `npm run test:e2e` quando Chromium estiver disponível. Informe quais verificações realmente executou e o que ficou pendente.

## Cuidados do projeto

- Preserve as regras existentes e os dados do participante. Mutações passam pela transação do armazenamento.
- Valide regras no backend. Controles visuais não substituem validação.
- Não acrescente banco de dados, Docker, autenticação real ou serviços externos ao exercício.
- Leia referências conforme a tarefa exigir. Ao implementar a nova história, confirme o PRD e a especificação presentes na branch de trabalho.
- Mantenha a comunicação e a interface em português. Use os nomes do glossário.

Este arquivo orienta o trabalho; não substitui as permissões configuradas no agente.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Contexto da feature — consultar sob demanda

- Problema e regras: `docs/feature/PRD.md`.
- Arquitetura da mudança: `docs/feature/spec.md`.
- Unidade de trabalho atual: `docs/feature/implementation-slice.md`.
- Continuidade entre sessões: `docs/feature/handoff.md`, quando presente.
- Ao validar uma entrega, a skill `validar-entrega` contém o procedimento e uma referência específica de aprovação.

Preserve a diferença entre aprovação de orçamento e execução da demanda. Regras antigas de edição e movimentação continuam válidas. Não antecipe outras slices quando a instrutora delimitar a unidade atual.
