# PRD — Aprovação de orçamento

Estado: referência preenchida para o workshop. O produto inicial está em `starter-v1.0.0`; esta branch contém a evolução planejada e sua implementação por checkpoints.

## Problema e objetivo

As demandas podem ser iniciadas sem avaliação do orçamento. Queremos exigir uma decisão de um gestor antes de iniciar novos trabalhos, mantendo rastreabilidade e os dados já existentes.

O resultado esperado é que Ana envie o orçamento de um monitor, Bruno o avalie e a aplicação só permita iniciar quando houver aprovação válida para o valor atual.

## Pessoas e escopo

- **Solicitante:** registra, edita e movimenta suas próprias demandas; envia o orçamento para avaliação.
- **Gestor:** decide sobre demandas de outras pessoas. Também pode ser solicitante, mas não aprova a própria demanda.
- Todos podem consultar o quadro. Os papéis são simulados pela seleção de perfil; não há autenticação real.

As permissões de edição e movimentação seguem a convenção já implementada no starter. A história acrescenta o poder de decisão do gestor.

## Regras

| ID  | Regra                                                                                            |
| --- | ------------------------------------------------------------------------------------------------ |
| R1  | Toda demanda com orçamento precisa de aprovação antes de iniciar, sem limite por faixa de valor. |
| R2  | Somente um gestor pode decidir; o solicitante não pode aprovar nem rejeitar a própria demanda.   |
| R3  | Uma rejeição exige justificativa não vazia.                                                      |
| R4  | Mudar o valor antes do início invalida a aprovação ou avaliação pendente e exige reenvio.        |
| R5  | O valor fica bloqueado depois de iniciada a execução, inclusive após a conclusão.                |
| R6  | Após rejeição, o solicitante pode corrigir e reenviar; os registros anteriores permanecem.       |
| R7  | Cada solicitação de avaliação e decisão registra pessoa, data, resultado e valor pertinente.     |
| R8  | Demandas já iniciadas antes da política podem ser concluídas sem aprovação retroativa.           |
| R9  | A regra deve valer no backend, inclusive quando a interface é contornada.                        |

## Estados percebidos pelas pessoas

O quadro continua com **Nova**, **Em andamento** e **Concluída**. A avaliação de orçamento aparece como informação adicional: **Não solicitada**, **Pendente**, **Aprovada** ou **Rejeitada**.

Uma demanda aprovada continua na coluna Nova até o solicitante iniciar a execução. Uma rejeição não exclui a demanda nem a marca como concluída.

## Critérios de aceite

1. Ana cria uma demanda de R$ 1.200 e a envia; o orçamento aparece como pendente.
2. Bruno aprova; Ana consegue iniciar e concluir.
3. Um perfil solicitante não consegue decidir pelo backend. Bruno também não decide a própria demanda.
4. Rejeitar sem justificativa falha. Com justificativa, a decisão aparece no histórico.
5. Ana altera R$ 1.200 para R$ 1.500 antes de iniciar; a demanda exige nova avaliação. O histórico anterior permanece.
6. Editar o valor durante uma avaliação retira a pendência anterior. Uma decisão baseada na versão antiga é recusada.
7. Editar sem mudar o valor monetário não invalida a aprovação. A comparação é por centavos, não por formatação.
8. Depois de iniciada, uma tentativa de mudar o valor falha no backend.
9. Uma demanda rejeitada pode ser reenviada e avaliada novamente.
10. Uma demanda preexistente em andamento continua disponível e pode ser concluída.
11. Recarregar e reiniciar o servidor preserva alterações e histórico.

## Limites e decisões do recorte

Uma única avaliação por vez; qualquer gestor elegível pode decidir. Não há distribuição automática de aprovadores, notificações, anexos, múltiplas alçadas, banco de dados, autenticação real nem deploy corporativo.

A aprovação deste exercício está vinculada ao valor do orçamento. Mudanças de título, descrição, área e prioridade não invalidam a aprovação quando o valor permanece igual. Avaliação de mudanças de escopo é um exercício posterior possível. O responsável pela decisão humana continua sendo o gestor simulado; a IA auxilia o desenvolvimento do software.

## Evidência de sucesso

O fluxo principal funciona na interface; testes cobrem as regras e os conflitos; o produto anterior não sofre regressões; os dados antigos continuam utilizáveis. A instrutora consegue explicar o raciocínio e reproduzir o resultado com os checkpoints. O tempo da aula precisa ser ensaiado, não inferido da velocidade de geração do código.
