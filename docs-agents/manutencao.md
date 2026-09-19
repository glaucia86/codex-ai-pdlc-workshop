# Manutenção dos guias

Leia ao atualizar instruções para agentes.

## Organização por divulgação progressiva

1. **Entrada:** o [AGENTS.md](../AGENTS.md) mantém o contexto mínimo, as regras aplicáveis a qualquer tarefa e o índice com gatilhos de leitura.
2. **Guias por tarefa:** `docs-agents/` explica como trabalhar em cada assunto. Abra apenas os guias relevantes à tarefa atual.
3. **Referências:** os guias apontam para documentação do produto, código, configuração e documentos da história quando o trabalho exige detalhes.

## Ao acrescentar uma instrução

- Coloque orientações específicas no guia pertinente. Crie outro guia somente quando houver um assunto distinto e um gatilho de leitura claro.
- Inclua novos guias no índice do `AGENTS.md`; arquivos nesta pasta precisam ser referenciados e lidos explicitamente.
- Prefira links às fontes existentes a copiar glossário, arquitetura, requisitos ou listas extensas de comandos.
- Use caminhos relativos ao arquivo que contém o link e verifique se os destinos existem.
- Não descreva funcionalidades planejadas como já implementadas nem crie links para PRDs ou especificações ainda inexistentes.
- Preserve o bloco `nextjs-agent-rules` no `AGENTS.md`: ele é gerenciado pelo Next.js.
- Revise os guias afetados quando a organização do projeto, os comandos ou o fluxo de trabalho mudarem.

Mantenha os guias em português e curtos o suficiente para consulta por tarefa.
