# PRD v1 — Aprovação de orçamento no Nexo

| Item | Definição |
| --- | --- |
| Status | Proposta para validação de negócio; não autoriza implementação |
| Data | 19/09/2026 |
| Produto | Nexo — portal local de demandas internas |
| Fonte principal | [Constituição](constitution.md) |
| Referências | [Glossário](../CONTEXT.md), [contexto do produto](../docs-agents/contexto.md) e [enunciado do workshop](../docs/workshop-brief.md) |
| Entrega desta etapa | Requisitos de negócio, critérios de aceite e cenários Gherkin |
| Próxima etapa | Validar este PRD e elaborar a especificação técnica |

## 1. Problema e resultado esperado

Hoje, o solicitante registra uma demanda e pode iniciar sua execução sem avaliação prévia do orçamento. A gestão não dispõe de uma decisão obrigatória e rastreável que autorize o valor solicitado antes do início do trabalho.

A evolução deve impedir que uma demanda sujeita à nova política comece sem aprovação válida, permitir rejeição justificada e correção, e preservar a continuidade dos trabalhos já iniciados. A aprovação se refere ao valor solicitado; não representa pagamento, reserva de saldo nem conclusão da demanda.

### Objetivos e critérios de sucesso

| Objetivo | Evidência de aceite |
| --- | --- |
| Controlar o início da execução | Nenhum cenário sujeito à política permite início sem aprovação válida para o valor atual |
| Garantir independência da decisão | Nenhuma autoaprovação é aceita, inclusive quando o solicitante é gestor |
| Permitir correção sem perder contexto | Uma rejeição pode ser seguida por novo envio, preservando todas as decisões anteriores |
| Manter rastreabilidade | Toda decisão aceita identifica pessoa, momento, resultado e valor avaliado; rejeições incluem justificativa |
| Evitar autorizações desatualizadas | Toda mudança efetiva de valor antes do início exige novo envio e nova aprovação |
| Preservar continuidade | Demandas já em andamento continuam até a conclusão, sem aprovação retroativa |
| Proteger dados | Falhas, repetições e conflitos não geram decisões duplicadas, perda de histórico ou alterações parciais |

Esses critérios serão medidos pelos testes de aceite. Não há base de uso para prometer redução percentual de prazo ou definir SLA de decisão; tais metas não são requisitos da v1.

## 2. Contexto, pessoas e escopo

O produto existente permite criação, edição, consulta, busca, filtros, quadro por situação, histórico e seleção de perfis fictícios. As situações de execução são **Nova**, **Em andamento** e **Concluída**. Todos os perfis podem consultar demandas; apenas o solicitante pode editar e movimentar as próprias. Demandas concluídas são somente para consulta.

| Pessoa | Necessidade | Limite |
| --- | --- | --- |
| Solicitante | Solicitar avaliação, entender a decisão, corrigir e iniciar o trabalho autorizado | Não decide sobre a própria demanda |
| Gestor | Identificar o que precisa avaliar e decidir sobre o valor apresentado | O papel não transfere a titularidade da demanda nem permite editar ou executar demandas alheias |
| Participante do workshop | Experimentar o fluxo com perfis fictícios e seus dados locais | A seleção de perfil é simulação, sem autenticação real |

Um gestor que cria uma demanda também é solicitante daquela demanda e precisa de outro gestor para avaliá-la.

### Dentro do escopo

- Envio explícito para avaliação, aprovação, rejeição justificada e reenvio.
- Separação visível entre situação da execução e situação da aprovação.
- Bloqueio de início sem aprovação válida e de alteração do valor após o início.
- Invalidação da avaliação pendente ou da aprovação quando o valor muda.
- Histórico de envios, decisões e invalidações; consulta das justificativas.
- Tratamento de concorrência, repetição, falha e continuidade dos dados existentes.
- Preservação das jornadas de consulta, busca, filtros, edição permitida e conclusão.

## 3. Origem dos requisitos e propostas para validação

**Obrigatório** identifica exigência da constituição. **Preservado** identifica comportamento observado no produto atual. **Proposto** resolve uma lacuna de negócio para tornar esta versão testável; requer validação do PRD antes da implementação.

| ID | Decisão proposta | Motivo e impacto |
| --- | --- | --- |
| D01 | O solicitante seleciona um único gestor por envio; apenas ele pode decidir. Excluir o próprio solicitante dos gestores elegíveis | Concretiza “enviar a um gestor” e evita decisões de pessoas diferentes sobre a mesma avaliação |
| D02 | Antes de uma decisão, o solicitante pode reenviar a outro gestor elegível, substituindo a avaliação pendente e registrando a troca | Permite encaminhar novamente quando o gestor está indisponível; não cria duas avaliações ativas |
| D03 | Proibir também a autorrejeição | Mantém a separação entre solicitação e avaliação; a constituição proíbe explicitamente a autoaprovação |
| D04 | Alterações em título, descrição, área ou prioridade, sem mudança de valor, não invalidam a avaliação ou aprovação | Mantém o gatilho definido no enunciado restrito ao valor; o risco de mudar o conteúdo após aprovar precisa de aceite expresso |
| D05 | Permitir reenvio após rejeição mesmo sem mudar o valor ou outros campos | Uma reconsideração pode ser necessária; não exigir alteração artificial para destravar o fluxo |
| D06 | Manter a faixa atual de R$ 0,01 a R$ 1.000.000,00, com até duas casas decimais | “Qualquer valor” significa ausência de faixa dispensada de aprovação entre os valores aceitos; não introduz orçamento zero |
| D07 | Exibir aprovação separadamente das três situações de execução | Preserva o quadro atual e evita confundir aprovação com trabalho iniciado ou concluído |

Os cenários associados a essas decisões descrevem a proposta, não uma confirmação já recebida. Caso uma decisão seja alterada na validação, atualizar as regras e os cenários correspondentes antes da especificação técnica.

## 4. Histórias de usuário

1. Como solicitante, quero registrar uma demanda sem enviá-la automaticamente, para revisar o conteúdo antes da avaliação.
2. Como solicitante, quero escolher um gestor elegível, para encaminhar meu valor solicitado à pessoa que decidirá.
3. Como solicitante, quero enviar explicitamente a demanda, para iniciar a avaliação de orçamento.
4. Como solicitante, quero consultar quem está avaliando, para saber com quem está a decisão.
5. Como gestor, quero localizar as demandas aguardando minha avaliação, para identificar meu próximo trabalho.
6. Como gestor, quero consultar solicitante, conteúdo, valor e histórico, para decidir com contexto.
7. Como gestor, quero aprovar o valor apresentado, para autorizar o início posterior da execução.
8. Como gestor, quero rejeitar com justificativa, para explicar por que o trabalho não está autorizado.
9. Como solicitante, quero consultar a justificativa da rejeição, para compreender o que corrigir.
10. Como solicitante, quero corrigir e reenviar uma demanda rejeitada, para obter nova avaliação sem criar outra demanda.
11. Como solicitante, quero solicitar reconsideração após rejeição, para permitir uma nova decisão mesmo sem mudança do valor.
12. Como gestor que também solicita, quero encaminhar minha demanda a outro gestor, para manter a independência da decisão.
13. Como solicitante, quero iniciar a demanda aprovada, para realizar o trabalho autorizado.
14. Como solicitante, quero entender por que o início está bloqueado, para saber qual ação executar em seguida.
15. Como solicitante, quero ser informado da invalidação ao mudar o valor, para reenviar o orçamento correto.
16. Como gestor, quero que uma avaliação de valor antigo deixe de ser decidível, para não autorizar informação desatualizada.
17. Como solicitante, quero manter a aprovação quando salvo o mesmo valor, para evitar uma avaliação desnecessária.
18. Como solicitante, quero encaminhar uma avaliação pendente a outro gestor, para prosseguir quando o primeiro estiver indisponível.
19. Como solicitante, quero ter o valor bloqueado após iniciar, para preservar o orçamento autorizado durante o trabalho.
20. Como solicitante de demanda já iniciada antes da política, quero concluí-la sem aprovação retroativa, para manter a continuidade.
21. Como pessoa que consulta a demanda, quero distinguir execução e aprovação, para entender sua situação real.
22. Como pessoa que consulta a demanda, quero identificar quem decidiu, quando e sobre qual valor, para reconstruir as decisões.
23. Como pessoa que consulta a demanda, quero ver decisões anteriores após correções, para preservar a memória do processo.
24. Como usuário, quero ser avisado de alterações feitas em outra tela, para revisar os dados antes de agir novamente.
25. Como usuário, quero retomar uma ação após falha sem duplicá-la, para continuar o trabalho com segurança.
26. Como participante, quero reencontrar meus dados e históricos anteriores, para continuar o exercício sem reinicialização.

## 5. Regras de negócio

| ID | Regra | Origem |
| --- | --- | --- |
| RN01 | Toda demanda ainda não iniciada está sujeita à aprovação antes de executar, independentemente do valor aceito, área ou prioridade | Obrigatório |
| RN02 | Criar ou editar não envia automaticamente para avaliação; somente o solicitante pode enviar ou reenviar a própria demanda | Obrigatório + preservado |
| RN03 | Cada envio apresenta o valor atual a um gestor elegível. Há no máximo uma avaliação pendente por demanda | Proposto — D01 |
| RN04 | Apenas o gestor selecionado pode aprovar ou rejeitar uma avaliação pendente; não há decisão sobre demanda sem envio válido | Proposto — D01 |
| RN05 | Ninguém aprova a própria demanda, mesmo sendo gestor; a proposta também impede autorrejeição | Obrigatório + D03 |
| RN06 | Rejeitar exige justificativa com conteúdo após desconsiderar espaços. Não há exigência de justificativa para aprovar | Obrigatório |
| RN07 | Aprovação e rejeição encerram a avaliação atual. Uma rejeição não exclui nem conclui a demanda | Obrigatório |
| RN08 | Uma aprovação só autoriza início se continuar válida para o valor atual. Aprovar não inicia a execução automaticamente | Obrigatório |
| RN09 | Qualquer mudança efetiva do valor antes da execução, para mais ou para menos, invalida aprovação ou avaliação pendente. Exige novo envio e decisão | Obrigatório |
| RN10 | Retornar a um valor anteriormente aprovado não restaura a aprovação antiga. Salvar o mesmo valor, inclusive em outra representação equivalente, não invalida | Obrigatório, derivado da mudança efetiva |
| RN11 | Após o primeiro início, o valor não pode mudar, inclusive para demandas anteriores à política. A conclusão não remove esse bloqueio | Obrigatório |
| RN12 | Demanda rejeitada pode ser corrigida e reenviada. Nenhum novo ciclo apaga ou substitui decisões históricas | Obrigatório + D05 |
| RN13 | Edição sem mudança do valor mantém a situação da aprovação; após início, os demais campos continuam editáveis pelo solicitante enquanto não concluída | Preservado + D04 |
| RN14 | Apenas o solicitante inicia e conclui a própria demanda. É vedado concluir diretamente uma demanda Nova ou reabrir uma Concluída | Preservado |
| RN15 | Toda decisão aceita registra autor, momento, resultado e valor avaliado; a rejeição registra também a justificativa | Obrigatório + detalhamento de rastreabilidade |
| RN16 | Envios, reenvios, trocas de gestor e invalidações são identificáveis no histórico, com autor e momento. Mudanças de valor mostram valor anterior e novo | Proposto para rastreabilidade |
| RN17 | Uma ação desatualizada não sobrescreve alterações posteriores. O usuário deve revisar o estado atual antes de tentar novamente | Preservado |
| RN18 | Repetições não criam duas avaliações ativas, duas decisões para o mesmo envio ou duas transições de execução | Preservado + extensão ao novo fluxo |
| RN19 | Uma ação só é apresentada como confirmada quando seu resultado e histórico estão salvos de forma consistente. Uma recusa não altera o negócio | Preservado |
| RN20 | Demandas já Em andamento na entrada da política podem ser concluídas sem avaliação retroativa. Demandas antigas ainda Novas precisam de aprovação | Obrigatório |
| RN21 | Demandas antigas Concluídas permanecem para consulta, sem decisões fictícias ou exigências retroativas. Todos os dados e históricos anteriores permanecem disponíveis | Obrigatório + preservado |
| RN22 | Sem gestor elegível, preservar a demanda e explicar a impossibilidade de envio. Não aprovar automaticamente nem liberar início | Proposto — consequência de D01 |
| RN23 | Reencaminhar uma pendência a outro gestor encerra a pendência anterior; o gestor anterior perde a possibilidade de decidir. Repetir o envio ao mesmo gestor sem mudança não abre outro ciclo | Proposto — D02 |

### Permissões consolidadas

| Ação | Solicitante da demanda | Gestor selecionado, diferente do solicitante | Demais perfis |
| --- | --- | --- | --- |
| Consultar demanda e histórico | Sim | Sim | Sim |
| Editar antes da conclusão | Sim; valor apenas antes do início | Não | Não |
| Enviar, reenviar ou trocar gestor pendente | Sim, nas condições deste PRD | Não | Não |
| Aprovar ou rejeitar | Não | Sim, somente avaliação pendente atual | Não |
| Iniciar e concluir | Sim, nas condições deste PRD | Não | Não |

A elegibilidade deve ser conferida no momento da ação. Selecionar um perfil diferente na demonstração não altera quem é o solicitante nem transfere permissões entre pessoas.

## 6. Jornada e estados de negócio

Os nomes abaixo descrevem o comportamento esperado; não prescrevem estrutura de dados.

| Execução | Aprovação exibida | Próxima ação permitida |
| --- | --- | --- |
| Nova | Não enviada | Solicitar avaliação a um gestor elegível |
| Nova | Aguardando avaliação | Gestor selecionado decide; solicitante pode editar ou trocar o gestor conforme as regras |
| Nova | Aprovada | Solicitante inicia; mudar o valor exige reenvio |
| Nova | Rejeitada | Solicitante consulta justificativa, corrige se necessário e reenvia |
| Nova | Reenvio necessário | Solicitante envia o valor atual para nova avaliação |
| Em andamento | Aprovada | Solicitante conclui; valor bloqueado |
| Em andamento, anterior à política | Dispensada por início anterior à política | Solicitante conclui; valor bloqueado |
| Concluída | Decisão preservada ou indicação de conclusão anterior à política | Apenas consulta |

### Transições relevantes

| Evento | Resultado esperado |
| --- | --- |
| Criar demanda | Nova / Não enviada |
| Enviar demanda elegível | Nova / Aguardando avaliação, vinculada ao gestor e valor apresentados |
| Aprovar avaliação atual | Nova / Aprovada |
| Rejeitar com justificativa | Nova / Rejeitada |
| Mudar valor enquanto aguarda ou após aprovação | Nova / Reenvio necessário; decisão anterior continua apenas no histórico |
| Mudar valor após rejeição | Continua sem autorização; rejeição anterior permanece visível até novo envio |
| Reenviar após rejeição ou invalidação | Nova / Aguardando avaliação, em novo ciclo |
| Trocar gestor de avaliação pendente | Nova / Aguardando avaliação do novo gestor; avaliação anterior deixa de estar ativa |
| Iniciar com aprovação válida | Em andamento; valor passa a ficar bloqueado |
| Concluir demanda em andamento elegível | Concluída; somente consulta |

Demanda Não enviada permanece assim ao editar o valor. Demanda com Reenvio necessário não volta a Aprovada ao restaurar um valor anterior. Reenviar uma demanda já Aprovada sem invalidação não é uma ação da v1.

### Exemplo principal

Ana registra R$ 1.200,00, envia a Bruno e recebe aprovação. Antes de iniciar, muda para R$ 1.500,00. A demanda passa a exigir reenvio; a aprovação de R$ 1.200,00 permanece no histórico, sem autorizar execução. Após novo envio e aprovação de R$ 1.500,00, Ana pode iniciar. A partir desse momento, o valor fica bloqueado.

## 7. Clareza da interface e recuperação do fluxo

- Mostrar situação da execução, situação da aprovação e valor solicitado sem depender apenas de cor.
- Antes do envio, permitir identificar o gestor escolhido; ao gestor, apresentar solicitante, conteúdo, valor e histórico antes da decisão.
- Permitir identificar as demandas aguardando decisão do perfil gestor atual; a forma de apresentação será definida na etapa de interface.
- Exibir justificativa de rejeição no contexto da demanda, junto à decisão correspondente.
- Informar antes de salvar um novo valor que a avaliação ou aprovação perderá validade; após salvar, indicar o reenvio como próximo passo.
- Para ações bloqueadas, explicar a causa e a saída: enviar, aguardar decisão, reenviar ou revisar dados atualizados. Evitar mensagens genéricas de erro.
- Em conflito entre telas, apresentar a necessidade de atualizar e revisar; nunca repetir automaticamente uma decisão sobre dados novos.
- Em falha ao salvar, preservar o conteúdo digitado quando possível e permitir nova tentativa. Em resposta incerta, orientar a consultar o estado salvo antes de repetir.
- Manter uso por teclado, rótulos compreensíveis, leitura das mensagens e funcionamento em largura pequena nas novas interações.

Não há prazo de expiração nem aprovação automática por demora. A recuperação de uma avaliação sem resposta é o reencaminhamento previsto em D02.

## 8. Compatibilidade e entrada em vigor

A entrada da política deve distinguir as demandas já iniciadas das que ainda precisam de autorização. O mecanismo será definido na especificação técnica; o resultado de negócio é obrigatório:

1. Demandas antigas Novas entram no fluxo como Não enviadas, independentemente da data de criação.
2. Demandas já Em andamento recebem indicação de dispensa por início anterior à política; não recebem uma aprovação inventada.
3. Demandas antigas Concluídas permanecem somente para consulta, sem reabertura ou aprovação retroativa.
4. Identidade da demanda, solicitante, conteúdo, valor, situação e eventos anteriores são preservados.
5. Reabrir a aplicação não pode conceder dispensa a demandas novas nem duplicar registros da adaptação.
6. Falha ao ler ou adaptar dados existentes deve ser explícita e preservar o conteúdo anterior; não pode ser resolvida apagando ou reinicializando os dados do participante.

## 9. Estratégia e critérios de testes

Testar resultados observáveis: quem pode agir, estado resultante, mensagem útil, continuidade da jornada e histórico salvo. Evitar testes que apenas reproduzam detalhes internos da implementação.

| Ponto de verificação proposto | Cobertura |
| --- | --- |
| Jornada pelo navegador | Envio → decisão → início → conclusão; rejeição e reenvio; invalidação; clareza, teclado e largura pequena |
| Ações pela API | Permissões e regras mesmo sem usar os controles da tela; dados inválidos, ações fora de ordem e concorrência |
| Dados salvos e reabertura | Persistência das decisões, histórico, falhas sem alteração parcial e continuidade das demandas antigas |
| Regras de negócio isoladas, quando necessário | Combinações e limites que sejam mais claros ou econômicos de verificar fora do navegador |

O projeto já possui testes de jornada no navegador, regras, API e armazenamento, incluindo conflitos de edição, precisão monetária, alterações inválidas e concorrência. Reaproveitar essas fronteiras de teste. A jornada atual de início direto precisa ser atualizada para exigir aprovação; mantê-la apenas para a exceção histórica aplicável.

**Cobertura confirmada pelo usuário em 19/09/2026:** jornadas pelo navegador, regras e permissões pela API e preservação dos dados no armazenamento. Essa confirmação trata da estratégia de testes, não da aprovação integral das decisões de negócio.

Usar dados fictícios isolados dos dados do participante. Os cenários abaixo são especificações de aceite a implementar, não testes já automatizados ou executados.

### 9.1 Envio, decisão e autorização

```gherkin
# language: pt
Funcionalidade: Avaliar orçamento antes de iniciar uma demanda

  Contexto:
    Dado que Ana é solicitante e Bruno e Carla são gestores
    E que a nova política de aprovação está em vigor

  Cenário: C01 - Criar sem enviar automaticamente
    Quando Ana registra uma demanda válida de R$ 1.200,00
    Então a demanda fica Nova e Não enviada
    E a execução não está autorizada

  Cenário: C02 - Aprovar e executar o ciclo completo
    Dado uma demanda Nova de Ana no valor de R$ 1.200,00
    Quando Ana envia a demanda a Bruno
    E Bruno aprova a avaliação atual
    Então a demanda fica Aprovada e continua Nova
    Quando Ana inicia e depois conclui a demanda
    Então a demanda fica Concluída com o valor de R$ 1.200,00
    E o histórico identifica envio, aprovação, início e conclusão

  Esquema do Cenário: C03 - Exigir aprovação em todos os valores aceitos
    Dado uma demanda Nova de Ana com valor solicitado de <valor>
    Quando Ana tenta iniciar sem aprovação
    Então o início é recusado e a demanda permanece Nova
    Exemplos:
      | valor           |
      | R$ 0,01         |
      | R$ 1.200,05     |
      | R$ 1.000.000,00 |

  Esquema do Cenário: C04 - Impedir início sem decisão válida
    Dado uma demanda Nova de Ana com aprovação <situacao>
    Quando Ana tenta iniciar a execução
    Então a ação é recusada sem alteração do histórico
    E Ana recebe orientação sobre o próximo passo necessário
    Exemplos:
      | situacao            |
      | Não enviada         |
      | Aguardando avaliação |
      | Rejeitada           |
      | Reenvio necessário  |

  Esquema do Cenário: C05 - Impedir decisão por pessoa não autorizada
    Dado uma demanda de Ana aguardando avaliação de Bruno
    Quando <pessoa> tenta <decisao> inclusive por acesso direto à ação
    Então a decisão é recusada e a avaliação de Bruno permanece pendente
    Exemplos:
      | pessoa                      | decisao  |
      | Ana                         | aprovar  |
      | um solicitante diferente    | aprovar  |
      | Carla                       | aprovar  |
      | Carla                       | rejeitar |
      | um perfil inexistente       | aprovar  |

  Esquema do Cenário: C06 - Impedir decisão sobre a própria demanda
    Dado que Bruno criou uma demanda como solicitante
    Quando Bruno tenta <decisao> sua própria demanda
    Então a ação é recusada mesmo que Bruno tenha papel de gestor
    E outro gestor é necessário para avaliar a demanda
    Exemplos:
      | decisao  |
      | aprovar  |
      | rejeitar |

  Cenário: C07 - Preservar titularidade das ações
    Dado uma demanda de Ana aprovada por Bruno
    Quando Bruno tenta editar, reenviar, iniciar ou concluir a demanda de Ana
    Então cada ação é recusada sem modificar a demanda

  Cenário: C08 - Ausência de gestor elegível
    Dado que não existe gestor diferente do solicitante disponível para seleção
    Quando o solicitante tenta enviar sua demanda
    Então o envio não ocorre e a demanda continua disponível
    E a interface explica que é necessário um gestor elegível
    E a execução permanece bloqueada
```

### 9.2 Rejeição, reenvio e encaminhamento

```gherkin
# language: pt
Funcionalidade: Recuperar o fluxo após rejeição ou indisponibilidade do gestor

  Cenário: C09 - Rejeitar com justificativa e corrigir
    Dado uma demanda de Ana aguardando avaliação de Bruno
    Quando Bruno rejeita com a justificativa "Revisar o valor solicitado"
    Então a demanda fica Rejeitada e a justificativa fica visível
    Quando Ana corrige o valor e reenvia a Carla
    E Carla aprova o novo envio
    Então a demanda fica Aprovada para o novo valor
    E a rejeição de Bruno permanece no histórico

  Esquema do Cenário: C10 - Recusar justificativa sem conteúdo
    Dado uma avaliação pendente de Bruno
    Quando Bruno tenta rejeitar com justificativa <conteudo>
    Então a ação é recusada com orientação para informar uma justificativa
    E a avaliação continua pendente sem registro de rejeição
    Exemplos:
      | conteudo       |
      | ausente        |
      | vazia          |
      | somente espaços |

  Cenário: C11 - Reconsiderar sem exigir edição artificial
    Dado uma demanda rejeitada de Ana
    Quando Ana reenvia ao mesmo gestor sem alterar os dados
    Então uma nova avaliação fica pendente
    E a rejeição anterior continua consultável

  Cenário: C12 - Manter vários ciclos de avaliação
    Dado uma demanda que foi rejeitada e reenviada duas vezes
    Quando o gestor aprova o terceiro envio
    Então as duas rejeições e a aprovação permanecem identificáveis em ordem
    E apenas a aprovação do envio atual pode autorizar o início

  Cenário: C13 - Trocar gestor de avaliação pendente
    Dado uma demanda de Ana aguardando avaliação de Bruno
    Quando Ana reencaminha a avaliação a Carla
    Então somente Carla pode decidir o envio atual
    E Bruno não pode decidir mesmo a partir de uma tela antiga
    E o histórico identifica o encaminhamento anterior e o novo

  Cenário: C14 - Recusar destino inválido sem perder a avaliação atual
    Dado uma demanda aguardando avaliação de Bruno
    Quando Ana tenta reencaminhar a si mesma ou a uma pessoa sem papel de gestor
    Então o reencaminhamento é recusado
    E a avaliação de Bruno permanece ativa

  Cenário: C15 - Não multiplicar avaliações por repetição de envio
    Dado uma demanda de Ana aguardando avaliação de Bruno
    Quando Ana repete o envio a Bruno sem mudança da demanda
    Então continua existindo apenas a avaliação pendente original
    E não é registrado um segundo envio aceito
```

### 9.3 Valor solicitado e validade da aprovação

```gherkin
# language: pt
Funcionalidade: Vincular a autorização ao valor efetivamente avaliado

  Esquema do Cenário: C16 - Invalidar após aumento ou redução
    Dado uma demanda Nova de R$ 1.200,00 com aprovação <situacao>
    Quando o solicitante muda o valor para <novo_valor>
    Então a demanda passa a exigir reenvio
    E a avaliação ou aprovação anterior não pode autorizar o início
    E o histórico preserva os valores anterior e novo e a invalidação
    Exemplos:
      | situacao             | novo_valor  |
      | Aprovada             | R$ 1.500,00 |
      | Aprovada             | R$ 1.000,00 |
      | Aguardando avaliação | R$ 1.500,00 |
      | Aguardando avaliação | R$ 1.000,00 |

  Cenário: C17 - Não restaurar uma aprovação antiga
    Dado uma demanda aprovada por R$ 1.200,00
    Quando Ana altera para R$ 1.500,00 e depois retorna a R$ 1.200,00
    Então a demanda continua exigindo reenvio e nova aprovação

  Cenário: C18 - Salvar valor equivalente sem invalidar
    Dado uma demanda aprovada por R$ 1.200,00
    Quando Ana salva o valor como "1200,0"
    Então o valor permanece R$ 1.200,00 e a aprovação continua válida

  Esquema do Cenário: C19 - Editar conteúdo sem mudar o valor
    Dado uma demanda Nova com aprovação <situacao>
    Quando o solicitante altera somente título, descrição, área ou prioridade
    Então a situação da aprovação permanece <situacao>
    E a edição fica registrada no histórico
    Exemplos:
      | situacao             |
      | Aguardando avaliação |
      | Aprovada             |
      | Rejeitada            |

  Cenário: C20 - Recusar decisão de valor invalidado
    Dado que Bruno abriu uma avaliação de R$ 1.200,00
    E que Ana já salvou o valor de R$ 1.500,00 sem reenviar
    Quando Bruno tenta aprovar ou rejeitar a avaliação antiga
    Então a decisão é recusada
    E a demanda continua exigindo reenvio de R$ 1.500,00

  Cenário: C21 - Concluir a reavaliação antes de iniciar
    Dado uma aprovação de R$ 1.200,00 invalidada pela mudança para R$ 1.500,00
    Quando Ana reenvia e Bruno aprova R$ 1.500,00
    Então Ana pode iniciar a demanda por R$ 1.500,00
    E ambas as decisões permanecem no histórico com seus valores

  Esquema do Cenário: C22 - Bloquear mudança do valor após o início
    Dado uma demanda <condicao> com valor de R$ 1.200,00
    Quando o solicitante tenta mudar para R$ 1.500,00
    Então a alteração é recusada inclusive fora da interface
    E o valor e o histórico permanecem inalterados
    Exemplos:
      | condicao                                  |
      | Em andamento com aprovação                |
      | Em andamento antes da entrada da política |
      | Concluída                                 |

  Cenário: C23 - Preservar edição permitida durante execução
    Dado uma demanda de Ana Em andamento
    Quando Ana altera apenas a descrição mantendo o valor
    Então a descrição é salva e a execução permanece Em andamento

  Esquema do Cenário: C24 - Recusar valores inválidos sem invalidar aprovação
    Dado uma demanda aprovada por R$ 1.200,00
    Quando o solicitante tenta salvar o valor <valor>
    Então a alteração é recusada com orientação de valor válido
    E a demanda permanece aprovada por R$ 1.200,00
    Exemplos:
      | valor            |
      | zero             |
      | negativo         |
      | R$ 1.000.000,01  |
      | três casas decimais |
      | texto não numérico |
```

### 9.4 Concorrência, repetição e falhas

```gherkin
# language: pt
Funcionalidade: Manter uma única decisão consistente e permitir recuperação

  Cenário: C25 - Decisões concorrentes sobre o mesmo envio
    Dado que Bruno abriu a mesma avaliação em duas telas
    Quando tenta aprovar em uma e rejeitar com justificativa na outra
    Então apenas uma decisão é aceita
    E a outra tentativa informa que os dados precisam ser revisados
    E o histórico contém somente a decisão aceita para aquele envio

  Cenário: C26 - Repetir uma decisão já confirmada
    Dado que Bruno já aprovou uma avaliação
    Quando repete a ação a partir da tela anterior
    Então nenhuma segunda decisão é criada
    E a aprovação confirmada permanece disponível

  Cenário: C27 - Concorrer início e mudança do valor
    Dado uma demanda Nova aprovada por R$ 1.200,00 aberta em duas telas
    Quando Ana tenta iniciar em uma tela e mudar o valor na outra
    Então somente uma ação baseada naquele estado é aceita
    E se o início prevalecer o valor permanece R$ 1.200,00 e fica bloqueado
    E se a mudança prevalecer o início não ocorre e a demanda exige reenvio

  Cenário: C28 - Concorrer decisão e mudança do valor
    Dado uma demanda de R$ 1.200,00 aguardando avaliação
    Quando o gestor decide e o solicitante altera o valor simultaneamente
    Então a ação desatualizada é recusada e exige revisão
    E nenhuma aprovação para R$ 1.200,00 autoriza execução por outro valor

  Cenário: C29 - Falha ao salvar decisão
    Dado uma avaliação pendente
    Quando ocorre uma falha antes de confirmar o salvamento da decisão
    Então a interface não informa sucesso
    E a avaliação e seu histórico permanecem no último estado confirmado
    E o usuário pode consultar a demanda e tentar novamente

  Cenário: C30 - Perder a resposta após confirmação do salvamento
    Dado que uma aprovação foi salva mas a resposta não chegou à tela
    Quando o usuário consulta novamente a demanda e repete a ação antiga
    Então encontra a aprovação salva
    E a repetição não acrescenta outra decisão

  Cenário: C31 - Reabrir aplicação preserva a decisão
    Dado uma demanda rejeitada com justificativa e depois reenviada e aprovada
    Quando a aplicação é fechada e aberta novamente
    Então a aprovação atual e todo o histórico anterior continuam disponíveis

  Cenário: C32 - Falha ao salvar mudança de valor não invalida aprovação
    Dado uma demanda aprovada por R$ 1.200,00
    Quando Ana tenta mudar para R$ 1.500,00 e o salvamento falha
    Então o valor confirmado continua R$ 1.200,00 com aprovação válida
    E não existe invalidação parcial no histórico

  Cenário: C33 - Falha de envio permite retomada
    Dado uma demanda Não enviada com gestor elegível selecionado
    Quando o envio falha antes de ser salvo
    Então a demanda permanece Não enviada e o início continua bloqueado
    Quando o solicitante tenta novamente e o envio é salvo
    Então existe uma única avaliação pendente
```

### 9.5 Dados anteriores, transições e usabilidade

```gherkin
# language: pt
Funcionalidade: Introduzir a política preservando o trabalho existente

  Cenário: C34 - Concluir demanda já iniciada antes da política
    Dado uma demanda Em andamento antes da entrada da política
    Quando o solicitante a conclui sem aprovação
    Então a conclusão é aceita e a dispensa fica compreensível na consulta
    E nenhuma aprovação fictícia é criada

  Cenário: C35 - Exigir aprovação de demanda antiga ainda Nova
    Dado uma demanda criada antes da política que ainda está Nova
    Quando o solicitante tenta iniciá-la sem avaliação
    Então o início é recusado
    E o solicitante pode enviá-la para aprovação

  Cenário: C36 - Preservar demanda anteriormente concluída
    Dado uma demanda Concluída antes da política
    Quando o usuário consulta seus detalhes
    Então todos os dados e eventos anteriores permanecem disponíveis
    E não é exigida aprovação retroativa nem permitida reabertura

  Cenário: C37 - Não ampliar a dispensa ao reabrir a aplicação
    Dado que os dados antigos já foram adaptados à política
    E que existe uma demanda Nova criada após essa adaptação
    Quando a aplicação é aberta novamente
    Então essa demanda continua sujeita à aprovação
    E os históricos existentes não recebem eventos duplicados de adaptação

  Cenário: C38 - Preservar dados diante de falha na adaptação
    Dado dados existentes que não puderam ser adaptados com sucesso
    Quando a aplicação tenta disponibilizar o novo fluxo
    Então informa a falha sem substituir os dados por exemplos iniciais
    E preserva o conteúdo anterior para recuperação

  Esquema do Cenário: C39 - Recusar transições fora de ordem
    Dado uma demanda na condição <condicao>
    Quando ocorre a tentativa de <acao>
    Então a ação é recusada sem alterar a demanda ou o histórico
    Exemplos:
      | condicao             | acao                         |
      | Nova e Não enviada   | decidir sem envio            |
      | Nova e Aprovada      | concluir sem iniciar         |
      | Nova e Rejeitada     | aprovar sem novo envio       |
      | Em andamento         | enviar para avaliação        |
      | Em andamento         | iniciar novamente            |
      | Concluída            | editar qualquer campo        |
      | Concluída            | reenviar para avaliação      |
      | Concluída            | concluir novamente           |

  Cenário: C40 - Identificar a próxima ação e navegar pelo fluxo
    Dado uma demanda aguardando avaliação de Bruno
    Quando Bruno utiliza o portal por teclado em largura pequena
    Então consegue identificar e abrir a avaliação destinada a ele
    E consultar o valor, decidir e compreender o resultado sem depender de cor
    E uma rejeição sem justificativa mantém a avaliação e apresenta orientação legível

  Cenário: C41 - Preservar consulta e filtros após a evolução
    Dado demandas Novas, Em andamento e Concluídas com diferentes avaliações
    Quando o usuário busca uma demanda e aplica os filtros existentes
    Então os resultados mantêm o comportamento anterior de busca e filtragem
    E os detalhes distinguem situação da execução e situação da aprovação

  Cenário: C42 - Consultar decisão completa
    Dado uma rejeição seguida de reenvio e aprovação
    Quando qualquer perfil consulta o histórico da demanda
    Então cada decisão identifica quem decidiu, quando, o resultado e o valor avaliado
    E a justificativa está associada à rejeição correspondente
    E a sequência não apresenta a aprovação antiga como autorização para outro valor
```

### Rastreabilidade dos critérios

| Regras | Cenários principais |
| --- | --- |
| RN01–RN05 | C01–C08, C14, C35 |
| RN06–RN08 | C02, C04, C09–C12, C39 |
| RN09–RN10 | C16–C21, C24, C28, C32 |
| RN11–RN14 | C07, C09–C12, C19, C22–C23, C34, C39 |
| RN15–RN16 | C02, C09, C12–C13, C16, C21, C31, C42 |
| RN17–RN19 | C15, C20, C25–C33 |
| RN20–RN21 | C34–C38 |
| RN22–RN23 | C08, C13–C15 |
| Experiência e regressão | C04, C10, C29–C30, C40–C41 |

## 10. Riscos de negócio e respostas

| Risco | Resposta prevista |
| --- | --- |
| Gestor não responde e a demanda fica parada | Identificar quem avalia e permitir reencaminhamento explícito; sem aprovação automática |
| Mudança de valor mantém autorização antiga | Invalidar tanto pendência quanto aprovação; testar aumento, redução e retorno ao valor anterior |
| Duas telas produzem resultados contraditórios | Aceitar somente ação sobre estado atual e exigir revisão em conflito |
| Novo fluxo bloqueia trabalho que já começou | Aplicar dispensa somente às demandas iniciadas antes da política |
| Histórico confunde valor atual e valor aprovado | Associar cada decisão ao valor avaliado e explicitar invalidação |
| Falha gera estado sem histórico correspondente | Confirmar a ação somente com resultado e histórico consistentes |
| Mudança de descrição altera o sentido do orçamento aprovado | Submeter D04 à validação de negócio; ampliar o gatilho de reavaliação se necessário antes da implementação |
| Não existe outro gestor elegível | Explicar o bloqueio, preservar a demanda e exigir disponibilidade de outro perfil gestor no ambiente do workshop |

## 11. Fora de escopo e especificação posterior

- Pagamentos, compras, reserva ou controle de saldo, centros de custo e execução financeira.
- Alçadas por valor, aprovação em múltiplos níveis, votação e aprovação parcial.
- Alterar o valor durante ou após a execução, reabrir demandas concluídas ou excluir histórico.
- Cancelamento, retirada de aprovação já concedida, delegação automática, substituição automática de gestor e expiração de avaliações.
- Notificações externas, e-mail, integrações, serviços externos e novos painéis analíticos.
- Autenticação real, banco de dados e Docker; o exercício continua local com perfis fictícios e armazenamento existente.

Após validação, a especificação técnica definirá representação dos estados e ciclos, contratos de ações, compatibilidade dos dados, controle de concorrência, persistência, componentes e automação de testes. Este PRD define os resultados exigidos, sem antecipar esses contratos.

## 12. Condições para avançar e registro da revisão

- Validar as decisões D01–D07, especialmente gestor exclusivo, reencaminhamento, edição sem mudança de valor e faixa monetária.
- Revisar os cenários de recuperação do fluxo dentro da cobertura de testes já confirmada.
- Aprovar as regras, a exceção para demandas já iniciadas e o tratamento das demandas antigas ainda Novas.
- Elaborar e validar a especificação técnica na branch de trabalho antes de implementar.

**Revisão realizada nesta elaboração:** constituição confrontada com o enunciado, glossário, regras atuais de domínio, documentação do armazenamento e testes existentes. Na branch consultada, não havia PRD nem especificação técnica da evolução em `doc-specs`.

**Pendente:** validação de negócio deste documento, especificação técnica, implementação e execução dos novos testes. Os cenários Gherkin são critérios propostos; não constituem evidência de funcionalidade implementada.
