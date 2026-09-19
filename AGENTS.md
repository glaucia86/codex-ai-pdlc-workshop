# Nexo — instruções para agentes

Portal local de demandas internas para um workshop. A branch `main` contém o produto inicial; a aprovação de orçamento é a evolução proposta para o exercício.

## Regras essenciais

- Mantenha a comunicação e a interface em português, usando o [glossário](CONTEXT.md).
- Preserve as regras existentes e os dados do participante. Mutações passam pela transação do armazenamento; regras de negócio são validadas no backend.
- Não acrescente banco de dados, Docker, autenticação real ou serviços externos ao exercício.
- Antes de implementar a nova história, confirme o PRD e a especificação presentes na branch de trabalho.
- Informe as verificações realmente executadas e o que ficou pendente.

## Consulte conforme a tarefa

Use divulgação progressiva (*Progressive Disclosure*): comece por este arquivo, abra apenas os guias pertinentes e siga suas referências quando precisar de detalhes. Não carregue toda a documentação por padrão.

| Quando precisar… | Leia… |
| --- | --- |
| Entender o produto, o vocabulário ou a nova história | [Contexto e escopo](docs-agents/contexto.md) |
| Localizar código ou alterar domínio, API e dados | [Arquitetura e implementação](docs-agents/arquitetura.md) |
| Preparar o ambiente, executar ou verificar mudanças | [Execução e validação](docs-agents/validacao.md) |
| Atualizar estas instruções ou acrescentar orientações | [Manutenção dos guias](docs-agents/manutencao.md) |

Este arquivo orienta o trabalho; não substitui as permissões configuradas no agente.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
