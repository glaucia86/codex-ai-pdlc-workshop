---
name: validar-entrega
description: Validar uma alteração do portal Nexo e preparar suas evidências de entrega. Use ao concluir uma slice ou revisar a aprovação de orçamento neste workshop.
---

# Validar uma entrega do Nexo

Leia o pedido atual, o diff e os critérios da slice em `docs/feature/implementation-slice.md`. Identifique quais regras foram alteradas.

Execute `npm run validate`. Se mudou um fluxo visível, execute também `npm run test:e2e` quando o navegador estiver disponível. Relate comandos e resultados reais; uma verificação indisponível permanece pendente.

Se a alteração envolve orçamento, decisão de gestor, edição de valor ou dados antigos, consulte [as verificações de aprovação](references/approval-checks.md). Para alterações em outros assuntos, carregue apenas a referência pertinente do projeto.

Confira se o diff preserva os testes existentes e se as regras continuam no backend. Apresente: comportamento entregue, evidências executadas, riscos concretos e próximo passo. Se outra sessão continuará o trabalho, atualize `docs/feature/handoff.md` com esse estado verificável.
