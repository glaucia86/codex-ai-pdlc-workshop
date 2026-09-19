# Slices de implementação — Aprovação de orçamento no Nexo

## 1. Fontes, condições e regras comuns

Plano derivado de [PRD-v1.md](PRD-v1.md) e [spec-v1.md](spec-v1.md), presentes na branch `feat/implementacao-aprovacao-orcamento`. O [template](implementation-slice.template.md) orienta somente a organização deste documento. Os identificadores S00–S08 identificam unidades de trabalho deste plano; não são requisitos das fontes.

**Condição antes de implementar:** o PRD ainda registra propostas de negócio e a especificação depende de sua validação. Confirmar e registrar o aceite de D01–D07, especialmente D04, conforme `SPEC: VAL-001` e seção 1.1. A elaboração deste plano não constitui esse aceite. Não há slice implementado, teste executado da evolução ou aceite concluído neste documento.

### 1.1 Contratos e conclusão de cada slice

- Aplicar o glossário do Nexo e manter a interface em português. Aprovação autoriza o valor solicitado; execução continua nas três situações existentes.
- Preservar dados, eventos, seed e permissões existentes. Identidade vem do perfil de demonstração resolvido no servidor. Regras, versão, ciclo e escrita de histórico passam pela mesma transação; recusa não modifica o negócio.
- Manter JSON local, endpoint existente, Node.js 24 e bibliotecas instaladas; não acrescentar autenticação real, banco, Docker, serviços externos ou infraestrutura de idempotência.
- Cada slice funcional, S01–S08, atravessa somente as camadas necessárias à sua jornada: contrato/estado, domínio, armazenamento, HTTP, interface e verificação. Reutilizar o que já foi entregue; não criar fases isoladas de backend, frontend ou testes. S00 é a preparação operacional do harness solicitada para orientar essas jornadas; não entrega comportamento de produto.
- Introduzir permissões, validação estrita, controle de versão, mensagens, acessibilidade e testes junto com cada ação. S08 completa a recuperação entre jornadas; não adia as garantias de integridade dos slices anteriores.
- Antes de alterar código, consultar os guias pertinentes do repositório e a documentação local do Next.js. Localizar os componentes pela seção 4.1 da spec; este plano não fixa novos caminhos de implementação.
- Verificar cada slice com dados isolados, incluindo acesso direto à API, estado relido e histórico. Após mudanças de código executar `npm run validate`; após mudanças de interface/fluxo executar também `npm run test:e2e`, conforme ambiente. Registrar falhas e indisponibilidade de Chromium como pendências, nunca como sucesso.
- Não disponibilizar escrita v2 sem leitor compatível, nem permitir início sem aprovação durante a evolução. Substituir leitura, comandos e interface de forma coordenada, com escritores antigos parados. Slices intermediários são incrementos verificáveis na branch; a história só está completa quando toda a cobertura final for satisfeita.

**Source IDs comuns — PRD:** RN14, RN17, RN18, RN19, RN21.

**Source IDs comuns — SPEC:** SEC-001, SEC-002, SEC-003, SEC-004, SEC-005, SEC-006, CON-001, CON-002, CON-003, CON-004, PAT-001, PAT-002, GUD-001, GUD-002, EXT-001, SVC-001, INF-001, INF-002, INF-003, DAT-001, DAT-002, PLT-001, PLT-002, PLT-003, COM-001, VAL-001, VAL-002, VAL-003, VAL-006, VAL-007, VAL-008.

Essas referências são invariantes, não uma obrigação de carregar todas as seções em toda sessão. Os blocos locais abaixo delimitam as leituras específicas de cada slice.

### 1.2 Smart Zone, Dumb Zone e contexto de execução

Smart Zone e Dumb Zone são uma heurística de trabalho: contexto focado favorece consistência; acúmulo de material, erros anteriores e assuntos independentes pode degradá-la antes do limite da janela. Não adotar percentual ou quantidade universal de tokens. Usar uma sessão por slice e reiniciar com handoff quando surgirem esquecimentos de regras, repetição de investigação ou contradições. Referência: [Matt Pocock — Smart zone](https://github.com/mattpocock/dictionary-of-ai-coding/blob/main/dictionary/Smart%20zone.md).

O estudo [Lost in the Middle, Liu et al.](https://arxiv.org/abs/2307.03172) encontrou sensibilidade à posição da informação em contextos longos nas tarefas avaliadas. Aplicamos essa evidência como orientação de organização, sem prometer eliminar o fenômeno: objetivo, bloqueadores e fontes entram no início; verificações e próximo passo encerram o pacote. Evitar carregar todo este plano, todo o PRD e toda a spec durante cada implementação.

**Pacote mínimo de uma sessão:** regras comuns aplicáveis → slice atual → handoff dos bloqueadores diretos → trechos correspondentes aos Source IDs → contratos citados na leitura focal → código e testes diretamente envolvidos. Carregar cenários parametrizados com todas as linhas de exemplos. Se a fonte divergir do resumo, explicitar a divergência e ajustar o plano antes do comportamento dependente.

**Grafo de contexto:** nós de origem são qualificados por arquivo (`PRD: RN09`, `SPEC: REQ-006`); nós Sxx são entregas; evidências futuras são testes/comandos reais. Arestas distintas: requisito **fundamenta** contrato, slice **realiza** contrato, teste **verifica** aceite, slice **depende de** entrega anterior. A matriz ao final permite navegação reversa. Compartilhar uma fonte não cria dependência de execução.

Se um slice não couber em uma sessão focada, interromper em estado verificável, registrar pendências e subdividir por comportamento observável. Não usar como saída uma divisão genérica entre camadas nem marcar o slice original como concluído sem seus aceites.

## 2. Ordem cronológica e dependências

A ordem abaixo é uma ordenação válida. S00 pode preparar o harness e levantar pendências antes da validação de negócio, sem implementar as regras propostas. Para S01–S08, satisfazer também a condição documental e executar a fronteira cujos bloqueadores estão completos; a numeração não acrescenta dependências artificiais.

| Ordem | Slice | Bloqueado por | Resultado observável |
| --- | --- | --- | --- |
| 0 | S00 — Preparar harness, baseline e mapa de impacto | Nenhum slice | Retomar o trabalho com fontes, limites, verificações e pendências localizáveis |
| 1 | S01 — Preservar dados e exigir autorização | S00; condição documental | Consultar legados, concluir iniciadas e criar Nova sem liberar início |
| 2 | S02 — Enviar ao gestor escolhido | S01 | Solicitar avaliação explícita e consultar a pendência persistida |
| 3 | S03 — Editar valor sem conservar autorização antiga | S02 | Invalidar, orientar reenvio e preservar edições equivalentes |
| 4 | S04 — Aprovar e executar pelo valor autorizado | S03 | Aprovar, iniciar e concluir com permissões e valor bloqueado |
| 5 | S05 — Rejeitar, corrigir e reenviar | S04 | Consultar motivo e obter nova avaliação sem perder decisões |
| 6 | S06 — Reencaminhar avaliação pendente | S04 | Trocar gestor sem duas pendências ou decisão do ciclo anterior |
| 7 | S07 — Localizar avaliações do gestor | S04 | Filtrar, abrir e aprovar com contexto, preservando busca e perfis |
| 8 | S08 — Recuperar conflitos e resultados incertos | S05, S06, S07 | Revisar estado salvo e retomar sem repetir efeitos entre jornadas |

S03 antecede S04 para que a primeira aprovação utilizável já conviva com edição segura do valor. S05 usa a aprovação de S04 para demonstrar a recuperação completa. S06 depende de S04 para demonstrar a recusa da decisão do gestor anterior pela API e pela interface; S07 requer aprovação para demonstrar filtro → decisão. S08 integra os três ramos finais sem exigir releitura de todos os seus históricos de conversa.

## Slice S00 — Preparar harness, baseline e mapa de impacto

**Resultado esperado:** uma sessão nova consegue identificar a próxima entrega, carregar seu contexto mínimo, reproduzir as verificações existentes e reconhecer limites e pendências antes de alterar o produto.

**Bloqueado por:** nenhum slice. Preparar o harness não equivale a validar D01–D07 nem libera implementação dependente dessas decisões.

**Source IDs — PRD:** D01, D02, D03, D04, D05, D06, D07, RN19, RN21.

**Source IDs — SPEC:** CON-001, CON-002, CON-003, PLT-001, PLT-002, PLT-003, COM-001, VAL-001, VAL-003, VAL-006, VAL-008.

As fontes fundamentam validação prévia, ambiente, preservação e rastreabilidade. A organização do harness é uma decisão operacional deste plano solicitada pelo usuário; não é um novo requisito de produto atribuído ao PRD ou à spec.

### Escopo e Smart Zone

Preparar um ponto de entrada local e versionável para implementação assistida, reaproveitando as instruções e ferramentas do repositório. Organizar o harness com um índice de retomada e registros de mapa de impacto, verificações de referência e handoff por slice. Definir sua localização na execução de S00 conforme a organização existente; vincular os registros pelo índice, sem impor a estrutura de diretórios ou ferramentas do exemplo.

O índice deve apontar para as fontes e sua revisão, condição de validação de negócio, grafo S00–S08, limites de alteração e pacote mínimo de cada sessão. O mapa relaciona fontes qualificadas por PRD/SPEC aos slices, pontos reais do código e testes existentes ou ainda necessários. Os registros de verificação distinguem resultado anterior à mudança, evidência futura e bloqueio de ambiente. O handoff permite atualizar progresso com base em evidência, sem duplicar integralmente PRD, spec ou este plano.

Leitura focal: PRD seções 9 e 12; spec 1.1, 4.1, 6, 7.1 e 10; guias pertinentes do repositório, scripts e configuração de testes. Localizar o percurso atual interface → HTTP → domínio → transação JSON → histórico e a cobertura existente, sem implementar aprovação, migração ou refatoração de produto.

**Proteção contra Dumb Zone:** explorar a partir do mapa de responsabilidades da spec, abrindo somente os pontos necessários. Se a investigação se ampliar, salvar referências e dúvidas em um handoff parcial e retomar em contexto novo. Não importar a solução de outra branch nem transformar uma falha de ambiente em atualização genérica de dependências.

### Acceptance Criteria

- [ ] O harness possui um índice local com referências válidas ao PRD, à spec, a este plano e às instruções aplicáveis; identifica a revisão consultada e distingue decisões D01–D07 pendentes de decisões efetivamente validadas.
- [ ] O mapa de impacto identifica os pontos reais de criação, edição, execução, identidade de demonstração, HTTP, transação JSON, histórico e interface, relacionando-os aos slices e testes pertinentes sem presumir que a aprovação já existe.
- [ ] Os limites registram preservação de dados e seed, uso de transação e validação no backend, dependências existentes e ausência de reset, autenticação real, banco, Docker ou serviços externos.
- [ ] As verificações de referência do produto atual registram execução de `npm run validate` e `npm run test:e2e`, ou impedimentos concretos para executá-las, com comandos, resultados e contexto de reprodução. Falhas anteriores ficam separadas de regressões futuras e não são ocultadas pela remoção de testes.
- [ ] Os procedimentos usam arquivos temporários para integração e dados E2E isolados, mantendo porta 3100 e um worker; identificam Node.js 24, Chromium e servidor de desenvolvimento parado como condições pertinentes, sem usar os dados do participante para testes.
- [ ] O registro de progresso relaciona slice → Source IDs de PRD/SPEC → verificação → evidência ou pendência. Critérios da evolução permanecem abertos até sua comprovação; sucesso da baseline não é apresentado como aceite da nova história.
- [ ] Uma retomada usando somente índice, slice atual e handoff permite localizar as fontes e o próximo passo. Nenhuma regra de aprovação ou migração foi implementada em S00, e bloqueios que impeçam S01 permanecem explícitos.

### Testes/verificação

Na execução futura de S00, conferir links, referências, comandos do projeto e rastreabilidade do harness. Executar a baseline descrita acima no produto atual com isolamento confirmado; registrar limitações de ambiente e falhas existentes, sem exigir testes da evolução ainda não implementada. Inspecionar o diff para garantir que a preparação não alterou comportamento funcional ou dados do participante. Simular a retomada de S01 a partir do índice e seu handoff, verificando que não exige leitura integral do histórico de conversas.

### Handoff

Entregar a S01 a localização do índice, mapa de impacto, revisão das fontes, resultados da baseline, limites de mudança e pendências de ambiente/negócio. Indicar quais falhas impedem a próxima etapa e quais evidências deverão ser comparadas após a mudança. Se D01–D07 continuarem pendentes, o harness pode estar preparado, mas a implementação dependente permanece bloqueada por `SPEC: VAL-001`.

## Slice S01 — Preservar dados e exigir autorização

**Resultado esperado:** o participante reencontra suas demandas, compreende as dispensas legadas e não inicia uma demanda Nova sem autorização.

**Bloqueado por:** S00, que fornece harness, mapa de impacto e baseline ou impedimentos documentados; depende também do registro da validação documental descrito na seção 1 e da resolução dos bloqueios que impeçam esta implementação.

**Source IDs — PRD:** D06, D07, RN01, RN02, RN11, RN13, RN14, RN20, RN21, C01, C03, C04, C22, C23, C34, C35, C36, C37, C38, C39.

**Source IDs — SPEC:** REQ-001, REQ-005, REQ-008, REQ-012, REQ-014, AC-001, AC-011, AC-015, AC-016, AC-017, VAL-002, VAL-004.

### Escopo e Smart Zone

Entregar o percurso carregar/migrar → consultar → criar ou concluir legado. Introduzir o contrato v2 e suas invariantes, conversão sob trava com backup exclusivo, leitura HTTP compatível, apresentação textual da aprovação e proteção de `advance`/edição de valor. Validar o esquema completo necessário ao leitor, sem implementar ainda as ações de avaliação. Reusar busca, quadro e detalhes existentes.

Leitura focal: spec 4.2, 4.5, 4.7 e linhas de legado em 4.8; PRD seção 8 e cenários citados. O limite deste slice é continuidade de dados e entrada na política, não envio ou decisão.

**Proteção contra Dumb Zone:** se contratos, migração e apresentação exigirem investigação extensa, registrar o contrato confirmado e retomar a mesma jornada em sessão nova; não ativar um gravador v2 isolado do leitor e das proteções de início.

### Acceptance Criteria

- [ ] Dados v1 nos três estados tornam-se v2: Nova / Não enviada, Em andamento dispensada e Concluída anterior à política; preservam IDs, pessoas, contador, valores, versões, datas e eventos, sem decisões fictícias.
- [ ] Backup exclusivo preserva os bytes originais antes da substituição; arquivo inválido, versão desconhecida, dados adicionais não preserváveis ou falha de backup/migração produzem erro explícito sem reset ou alteração parcial.
- [ ] Reiniciar sobre v2 não repete migração, cria eventos ou amplia dispensa. Arquivo ausente usa seed validada sem regravá-la; combinações v2 inconsistentes são recusadas.
- [ ] Criar ou editar não envia automaticamente. Nos valores de C03, Nova não inicia sem aprovação; a interface separa execução/aprovação e orienta a necessidade de envio.
- [ ] Apenas o solicitante conclui a demanda legada iniciada; valor permanece bloqueado, descrição continua editável antes da conclusão e Concluída admite somente consulta, inclusive pela API.

### Testes/verificação

Migração e armazenamento com arquivos temporários: preservação, backup, falhas antes do renome, releitura e seed imutável. Domínio/HTTP para bloqueio de Nova, titularidade, bloqueio monetário e transições ilegais aplicáveis. Navegador: abrir os três legados, criar Nova e concluir legado iniciado. Os estados pendente/rejeitado/inválido de C04 serão completados nos slices correspondentes, sem declarar o cenário inteiro concluído aqui.

### Handoff

Entregar contrato do leitor v2, mecanismo de migração/backup, política de erros e evidências por C01/C03/C34–C38. Informar os comandos ainda indisponíveis e os casos de C04/C22/C39 cobertos. S02 recebe a demanda Nova persistida e o bloqueio de início; não recebe uma autorização implícita para alterar dados reais.

## Slice S02 — Enviar ao gestor escolhido

**Resultado esperado:** o solicitante escolhe um gestor elegível, envia explicitamente e consulta quem avaliará qual valor.

**Bloqueado por:** S01, que disponibiliza leitor, persistência v2 e bloqueio de início.

**Source IDs — PRD:** D01, RN02, RN03, RN04, RN05, RN16, RN18, RN19, RN22, RN23, C04, C07, C08, C15, C33, C39.

**Source IDs — SPEC:** REQ-002, REQ-003, REQ-010, REQ-011, REQ-013, REQ-014, AC-003, AC-004, AC-007, AC-014, AC-017, DAT-002.

### Escopo e Smart Zone

Percurso selecionar → `submitApproval` → ciclo/evento persistidos → detalhes atualizados. Derivar gestor, pessoa, valor, UUID e data no servidor; versão aumenta uma vez. Exibir gestor/valor pendentes e bloquear repetição enquanto salva. Ausência de gestor não cria perfil nem libera execução. Recusar reenvio redundante ao mesmo gestor; troca para outro será entregue em S06.

Leitura focal: spec 4.2–4.6 apenas para envio e 4.8 para seleção/pendência; PRD C08/C15/C33. A transição de edição de uma pendência pertence a S03 e a decisão a S04/S05. Até esses incrementos, não disponibilizar ao participante um fluxo parcial que aceite alteração monetária pendente sem invalidação.

**Proteção contra Dumb Zone:** não expandir para filtro do gestor ou decisões; carregar somente contrato de envio e handoff de S01.

### Acceptance Criteria

- [ ] Selecionar gestor não cria ciclo. Enviar demanda própria Nova / Não enviada a gestor elegível cria uma pendência com valor atual, snapshots e um evento de envio; o início permanece bloqueado.
- [ ] Só o solicitante envia; destino inexistente, sem papel de gestor ou igual ao solicitante é recusado. Sem gestor elegível, a interface explica a impossibilidade e preserva a demanda.
- [ ] Repetir envio ao mesmo gestor com versão atual retorna `ALREADY_PENDING`/409; com versão antiga retorna conflito, sem novo ciclo, evento ou versão.
- [ ] Envio fora dos estados permitidos é recusado pela API. Corpo estrito e identidade resolvida no servidor impedem atribuir dispensa, histórico, valor do ciclo ou papel por campos adulterados.
- [ ] Falha antes de salvar mantém demanda/histórico anteriores; uma nova tentativa válida produz exatamente uma pendência e só há mensagem de sucesso após confirmação.

### Testes/verificação

Domínio e HTTP: titularidade, destinos, ausência de gestor, comandos adulterados, repetição e estados não permitidos. Armazenamento: falha real de escrita/renome e retomada de C33. E2E: criação → seleção sem envio → envio → consulta após recarga, incluindo gestor que também é solicitante. Verificar campos rotulados, teclado e mensagens legíveis.

### Handoff

Registrar contrato de `submitApproval`, formato de ciclo/evento, códigos de recusa e evidências de efeito único. Fornecer a S03 e S06 um cenário pendente reproduzível em dados isolados. Identificar explicitamente que troca de gestor e reenvios ainda não foram demonstrados.

## Slice S03 — Editar valor sem conservar autorização antiga

**Resultado esperado:** editar orçamento antes do início informa e persiste a perda de validade; salvar valor equivalente ou somente conteúdo não retira a aprovação.

**Bloqueado por:** S02, que produz pendência e seu histórico reais.

**Source IDs — PRD:** D04, D06, RN09, RN10, RN11, RN13, RN16, RN17, RN19, C16, C17, C18, C19, C20, C22, C23, C24, C32.

**Source IDs — SPEC:** REQ-006, REQ-007, REQ-008, REQ-010, REQ-011, AC-008, AC-009, AC-011, AC-014, VAL-002.

### Escopo e Smart Zone

Percurso formulário existente → `update` → valor/ciclo/histórico atômicos → indicação de reenvio. Tratar os estados previstos sem criar nova superfície de mutação. Usar centavos inteiros e parser existente; exibir aviso antes de salvar pendência/aprovação com valor alterado. Entregar invariantes de edição antes de permitir aprovação no próximo slice.

Leitura focal: spec 4.2–4.4, 4.6, edição em 4.8 e 9.2; PRD C16–C24/C32. Para estado aprovado ou rejeitado ainda não alcançável pelas ações entregues, usar fixtures v2 válidas isoladas e registrar essa limitação; S04/S05 repetirão os percursos com decisões reais.

**Proteção contra Dumb Zone:** limitar a investigação a normalização monetária, edição e validade; não antecipar comandos de decisão nem refatorar formulários sem relação com o comportamento.

### Acceptance Criteria

- [ ] Aumento ou redução em pendência/aprovação mostra aviso antes de salvar e produz Reenvio necessário, preservando decisão anterior e registrando `updated` seguido de `approval_invalidated`, no mesmo instante e com uma incrementação de versão.
- [ ] Restaurar valor antigo não restaura aprovação; Não enviada e Reenvio necessário mantêm seus estados ao editar valor. Após rejeição, a correção mantém a rejeição vinculada ao valor avaliado até novo envio.
- [ ] Salvar representação equivalente ou alterar apenas título, descrição, área ou prioridade mantém ciclo/situação, registra edição e respeita versão e titularidade.
- [ ] Valores fora da faixa, fracionários em centavos ou entradas inválidas são recusados sem invalidar a aprovação existente. Após início, inclusive legado, valor não muda; Concluída não admite edição.
- [ ] Falha antes do renome mantém valor e aprovação anteriores, sem evento parcial; a interface não apresenta a invalidação como confirmada.

### Testes/verificação

Domínio/HTTP com todos os exemplos de C16/C19/C22/C24 e equivalências da spec 9.2. Armazenamento: C32 com falha de gravação, comparando estado e histórico relidos. E2E: pendência real → aviso → edição → Reenvio necessário; casos com fixtures aprovadas/rejeitadas devem estar identificados. A tentativa de decidir ciclo invalidado de C20 será concluída em S04/S05.

### Handoff

Entregar predicado de validade, contrato dos eventos e evidências de equivalência/invalidação/falha. Destacar para S04 que nenhum início pode usar ciclo encerrado e listar verificações que precisam ser repetidas com aprovação criada pela interface.

## Slice S04 — Aprovar e executar pelo valor autorizado

**Resultado esperado:** o gestor escolhido aprova; o solicitante inicia e conclui separadamente, pelo valor autorizado. Uma invalidação exige novo envio e decisão.

**Bloqueado por:** S03; edição segura é necessária assim que uma aprovação passa a existir.

**Source IDs — PRD:** D01, D03, RN03, RN04, RN05, RN07, RN08, RN09, RN11, RN12, RN14, RN15, RN17, RN18, C02, C04, C05, C06, C07, C20, C21, C22, C25, C26, C27, C28, C39.

**Source IDs — SPEC:** REQ-003, REQ-005, REQ-008, REQ-009, REQ-010, REQ-011, AC-002, AC-003, AC-008, AC-010, AC-011, AC-012, AC-013, AC-017, VAL-005.

### Escopo e Smart Zone

Percurso pendência → `approveBudget` → decisão persistida → início → conclusão. Integrar aprovação e reenvio após invalidação aos detalhes; os comandos de execução já existem. Alterar a verificação de titularidade somente por comando, preservando edição e execução exclusivas do solicitante. Checar pessoa, papel atual, versão, ciclo e validade na transação.

Leitura focal: spec 4.2–4.6 e linhas de aprovação/execução em 4.8; handoff de S03. Não incluir formulário de rejeição, filtro ou troca de gestor.

**Proteção contra Dumb Zone:** demonstrar primeiro C02 e depois C21 com os contratos existentes. Se precisar de nova sessão, entregar esses dois percursos e pendências de permissões/corridas, sem declarar a jornada completa antes da verificação.

### Acceptance Criteria

- [ ] Apenas o gestor selecionado e ainda elegível aprova o ciclo pendente atual, sem justificativa obrigatória; decisão registra autor, momento e valor e mantém execução Nova.
- [ ] Autoaprovação, decisão de outro gestor/perfil, ausência de envio e ciclo encerrado ou antigo são recusados, inclusive com versão atual e `cycleId` antigo. Permissões de editar, enviar e movimentar não passam ao gestor.
- [ ] Só o solicitante inicia com aprovação válida para o valor atual e depois conclui. Valor fica bloqueado; não há início automático, conclusão direta de Nova, reabertura nem repetição de transição.
- [ ] Invalidação real seguida de novo envio e aprovação permite início pelo novo valor e preserva ambas as decisões no histórico. Reenvio de Aprovada sem invalidação é recusado.
- [ ] Repetição antiga não duplica decisão. Nas corridas aprovação/edição e início/edição com mesma versão, somente uma ação prevalece e a outra exige revisão, sem aprovação de valor antigo autorizar valor novo.

### Testes/verificação

E2E C02/C21 usando envios e decisões reais; demonstrar também valor bloqueado e histórico após recarga. Domínio/HTTP cobrem permissões de C05–C07, C20 e transições de C39 já disponíveis. Duas instâncias de armazenamento sobre arquivo temporário testam concorrência, ambos os desfechos em ordem controlada e repetição de C26; aprovação versus rejeição de C25 será completada em S05/S08.

### Handoff

Entregar decisões e execução verificadas, evidências das corridas disponíveis e lista de ramificações ainda sem rejeição. S05 recebe jornada de aprovação completa; S07 recebe ação acessível pelo detalhe, sem depender de filtro novo.

## Slice S05 — Rejeitar, corrigir e reenviar

**Resultado esperado:** o solicitante entende o motivo da rejeição, corrige se necessário e consegue nova decisão sem perder o histórico.

**Bloqueado por:** S04, para demonstrar rejeição → reenvio → aprovação → início com ações reais.

**Source IDs — PRD:** D03, D05, RN04, RN05, RN06, RN07, RN12, RN13, RN15, RN16, RN17, RN18, RN19, C04, C05, C06, C09, C10, C11, C12, C19, C20, C25, C29, C31, C39, C42.

**Source IDs — SPEC:** REQ-004, REQ-007, REQ-009, REQ-010, REQ-011, REQ-014, AC-003, AC-005, AC-006, AC-009, AC-012, AC-014, AC-017, SEC-005.

### Escopo e Smart Zone

Percurso justificativa → `rejectBudget` → consulta da rejeição → correção opcional → `submitApproval` em novo ciclo → decisão. Exibir razão atual e razões anteriores junto aos valores correspondentes. Reusar permissões, versão, recuperação básica e componentes existentes.

Leitura focal: justificativa/ciclos da spec 4.2–4.5, linhas de rejeição em 4.8 e exemplos de 9.2; PRD C09–C12/C42. Não incluir troca de gestor enquanto pendente; escolher gestor no reenvio após rejeição pertence a este slice.

**Proteção contra Dumb Zone:** limitar a sessão à decisão desfavorável e recuperação; usar as evidências de S04 como contrato, sem reabrir toda a implementação de aprovação.

### Acceptance Criteria

- [ ] Justificativa ausente, vazia, só com espaços ou acima de 2.000 caracteres após `trim` é recusada sem decisão. Conteúdo válido é salvo como texto, com autor, instante e valor avaliado.
- [ ] Só o gestor selecionado decide; autorrejeição, ciclo antigo/invalidado e rejeição fora de pendência são recusados. Rejeitar mantém demanda Nova, bloqueia início e não exclui nem conclui.
- [ ] Reenviar após rejeição, com ou sem edição, ao mesmo ou a outro gestor elegível, cria novo ciclo. Corrigir valor mantém a rejeição anterior ligada ao valor antigo até o envio.
- [ ] Vários ciclos preservam todas as decisões/justificativas em ordem, inclusive após reinício; qualquer perfil pode consultá-las e só aprovação atual válida autoriza início.
- [ ] Aprovação e rejeição concorrentes geram uma única decisão. Falha antes de salvar rejeição mantém pendência/histórico e não informa sucesso; o texto digitado é preservado quando possível.

### Testes/verificação

E2E C09/C11/C12/C31/C42, incluindo dois ciclos rejeitados antes da aprovação e edição monetária/textual. Domínio/HTTP verificam limites da justificativa, papel e autoavaliação. Armazenamento cobre C25/C29 e releitura. Verificar texto sem interpretação HTML, foco, teclado e erro de justificativa legível.

### Handoff

Entregar formato e apresentação das decisões completas, matriz de limites e evidências de reenvio/reinício. Para S08, registrar comportamento de rascunho, conflito e falha já existente e as lacunas específicas de resultado incerto.

## Slice S06 — Reencaminhar avaliação pendente

**Resultado esperado:** o solicitante substitui o gestor de uma pendência; somente o novo gestor pode decidir.

**Bloqueado por:** S04, que fornece a decisão necessária para verificar o impedimento do gestor anterior de ponta a ponta, além do envio de S02. Não depende do caminho de rejeição de S05.

**Source IDs — PRD:** D01, D02, RN02, RN03, RN04, RN16, RN17, RN18, RN22, RN23, C08, C13, C14, C15.

**Source IDs — SPEC:** REQ-002, REQ-003, REQ-010, REQ-011, REQ-013, AC-004, AC-007, VAL-005.

### Escopo e Smart Zone

Percurso alterar gestor → `submitApproval` pendente → encerramento/novo ciclo atômicos → detalhes com novo destinatário. Emitir um único `approval_reassigned`, contendo vínculos e gestores. Não criar comando paralelo nem delegação automática.

Leitura focal: troca em spec 4.2–4.6 e 4.8; PRD C13–C15. A verificação da decisão do gestor anterior usa o contrato de ciclo e a ação entregue em S04.

**Proteção contra Dumb Zone:** manter somente handoff de envio e contrato de encerramento; não carregar todos os caminhos de rejeição ou invalidação para implementar a troca.

### Acceptance Criteria

- [ ] Solicitante troca pendência para outro gestor elegível; ciclo anterior é encerrado por troca, novo ciclo fixa valor atual e há uma única pendência, uma incrementação de versão e um evento de reencaminhamento.
- [ ] Gestor anterior não decide o ciclo substituído, mesmo usando versão atual com ID antigo; a interface mostra gestor atual e mantém a sequência anterior consultável.
- [ ] Destino inválido, igual ao solicitante ou tentativa por terceiro preserva a pendência original. Repetir o mesmo destino não cria ciclo/evento adicional.
- [ ] Troca com versão antiga ou falha antes do renome não deixa encerramento parcial nem duas pendências; a interface orienta revisão ou tentativa após confirmação do estado.

### Testes/verificação

Domínio/HTTP/armazenamento: C13–C15, versão atual com ciclo antigo, atomicidade e releitura. E2E: enviar a Bruno → reencaminhar a Carla → consultar destinatário/histórico → recusar tentativa de Bruno → aceitar decisão de Carla. Conferir que nenhuma tentativa recusada acrescenta decisão ao histórico.

### Handoff

Entregar identidade e encerramento dos ciclos, evento único e evidências da recusa de gestor anterior. S08 recebe a corrida de troca contra decisão como percurso para revisão de tela antiga, usando a mesma proteção de versão/ciclo.

## Slice S07 — Localizar avaliações do gestor

**Resultado esperado:** o gestor encontra as avaliações destinadas a ele, consulta contexto e decide mantendo as jornadas de busca e filtros.

**Bloqueado por:** S04, para verificar filtro → detalhe → aprovação. Dados de rejeição/troca são adicionais quando S05/S06 estiverem disponíveis, não bloqueadores artificiais.

**Source IDs — PRD:** D07, RN03, RN04, RN05, RN15, RN21, C40, C41, C42.

**Source IDs — SPEC:** REQ-014, REQ-015, AC-018, CON-004, GUD-001, VAL-007.

### Escopo e Smart Zone

Percurso consultar documento → filtrar pendências do perfil → abrir contexto → aprovar → atualizar listagem. Compor o filtro “Aguardando minha avaliação” com busca, área e prioridade. Preservar as três colunas, indicadores e consulta por todos os perfis.

Leitura focal: spec 4.5 e 4.8, PRD seção 7 e C40–C42. Não criar endpoint por cartão, painel analítico, cache de decisão ou nova busca no servidor.

**Proteção contra Dumb Zone:** trabalhar apenas a seleção e navegação sobre contratos existentes; não reimplementar aprovação nem reformular todo o portal.

### Acceptance Criteria

- [ ] O filtro do gestor inclui apenas demandas pendentes cujo ciclo atual lhe pertence; busca, área e prioridade continuam compondo o resultado corretamente.
- [ ] Ativar “Aguardando minha avaliação” desativa “Só minhas” e vice-versa, com controles coerentes. Trocar perfil desativa o novo filtro e fecha contextos de ação.
- [ ] Cartões e detalhes distinguem execução e aprovação em texto, mostram valor e permitem consultar solicitante, conteúdo e histórico antes da decisão; nenhuma coluna ou indicador muda de significado.
- [ ] Pelo teclado e em 360 px, o gestor filtra, abre e decide com foco visível, rótulos, retorno de foco e mensagens compreensíveis, sem depender de cor, cortar ações ou gerar rolagem horizontal da página.
- [ ] Ação confirmada atualiza consulta sem requisições por cartão ou aprovação otimista; bloqueia cliques repetidos e troca de perfil enquanto a mutação está em andamento.

### Testes/verificação

E2E com conjuntos destinados a gestores diferentes, gestor solicitante, estados variados, busca e filtros existentes. Inspecionar requisições para verificar uma mutação e uma atualização de consulta por ação. Revisão manual de teclado, 360 px e leitura das mensagens. Na integração com S05, completar C40 com rejeição sem justificativa e C42 com decisões sucessivas.

### Handoff

Entregar semântica dos filtros, comportamento de perfil/foco e evidências de navegação. Para S08, destacar captura de pessoa/versão/ciclo e atualização da listagem após decisão, sem transportar dumps completos de DOM ou logs.

## Slice S08 — Recuperar conflitos e resultados incertos

**Resultado esperado:** diante de outra tela, falha de gravação ou resposta perdida, a pessoa distingue rascunho de estado salvo e retoma conscientemente sem duplicar efeitos.

**Bloqueado por:** S05, S06 e S07; essas entregas fornecem todos os percursos e contextos de ação a integrar.

**Source IDs — PRD:** RN17, RN18, RN19, C20, C25, C26, C27, C28, C29, C30, C31, C32, C33, C39, C40, C41, C42.

**Source IDs — SPEC:** REQ-011, REQ-015, AC-012, AC-013, AC-014, AC-017, AC-018, GUD-001, VAL-003, VAL-005, VAL-006, VAL-007, VAL-008.

### Escopo e Smart Zone

Entregar recuperação visível sobre as garantias transacionais já implantadas: comando com contexto revisado → conflito/falha/resposta incerta → releitura → revisão explícita → nova ação permitida. Completar tratamento de rascunho e distinguir falha de atualização da lista de falha da mutação. Verificar a integração final sem transformar este slice em uma etapa horizontal de testes atrasados.

Leitura focal: spec 4.5–4.8, 6 e 10; PRD C25–C33. Usar os handoffs diretos como índice para evidências anteriores, não reler todos os diffs.

**Proteção contra Dumb Zone:** organizar a sessão pelos três resultados — recusa confirmada, sucesso confirmado e resposta incerta. Se a auditoria final exceder o contexto, retomar com matriz de evidências/pendências; não acumular saídas integrais de suítes nem misturar recuperação com novas regras de negócio.

### Acceptance Criteria

- [ ] Em 409, a interface recarrega o estado e exige revisão explícita antes de habilitar nova decisão; não substitui silenciosamente pessoa, versão ou ciclo capturados nem reaplica edição automaticamente.
- [ ] Rascunhos de justificativa/edição são preservados quando possível e distinguíveis do estado confirmado; falha antes do renome não altera estado, versão ou histórico nem apresenta sucesso.
- [ ] Se POST confirmou e a consulta seguinte falhou, a interface informa que a alteração foi salva. Sem resposta conclusiva do POST, orienta consultar antes de repetir; cancelamento no navegador não é apresentado como cancelamento da transação.
- [ ] Após resposta perdida e nova consulta, decisão salva permanece única; comando antigo não duplica envio, decisão ou transição. Criação não é repetida automaticamente nem ganha promessa de deduplicação geral.
- [ ] Corridas decisão/decisão, decisão/edição e início/edição aceitam somente uma ação da versão inicial; ciclo antigo após troca/reenvio é recusado mesmo com versão atual, com revisão compreensível na tela.
- [ ] A integração tem evidências de todos os aceites AC-001–AC-018 e cenários C01–C42, incluindo exemplos parametrizados, consulta/histórico, permissões diretas, falhas, teclado e 360 px; verificações indisponíveis permanecem explicitamente pendentes.

### Testes/verificação

Armazenamento com duas instâncias em arquivo temporário e ordens controladas para ambos os vencedores; comparar arquivo relido, eventos e versões. Simular falha real antes do renome separadamente da perda de resposta após persistência. E2E com duas telas, rejeição com rascunho, alteração salva seguida de falha de GET e retomada sem repetição automática.

Conferir todas as linhas da matriz abaixo e executar `npm run validate` e `npm run test:e2e` com servidor de desenvolvimento parado, dados isolados, porta 3100 e um worker no E2E. Revisar documentação afetada de arquitetura/recuperação conforme spec 7.1 na implementação futura. Conferir diff para ausência de dados do participante, reset, serviços ou alterações alheias. Não executar esses procedimentos como parte da criação deste plano.

### Handoff

Entregar mapa cenário → teste/evidência real, resultados dos comandos, limitações de ambiente e pendências de aceite. Registrar como reproduzir falha e recuperação em dados isolados. O próximo responsável recebe a condição real de entrega, sem inferir aprovação de negócio ou sucesso de testes por existência deste documento.

## 3. Handoff e manutenção do grafo

O harness preparado em S00 é o ponto de entrada para esses registros. Atualizá-lo durante os slices seguintes com referências e evidências reais, preservando a distinção entre baseline, trabalho entregue e pendências.

Ao encerrar uma implementação, registrar no handoff: slice e revisão das fontes usadas; comportamento entregue; Source IDs afetados separados por PRD/SPEC; contratos/invariantes que o próximo slice reutiliza; mudanças localizáveis no código; verificações realmente executadas e seus resultados; limitações, dúvidas e próximo passo. Referenciar evidências reais em vez de copiar logs. Nenhuma evidência está preenchida antecipadamente neste plano.

O consumidor lê somente o handoff dos bloqueadores diretos, expandindo referências se houver uma dúvida concreta. Se uma fonte mudar, percorrer a matriz para localizar slices afetados, revisar seus aceites e testes e só então continuar. O PRD define negócio e a spec concretiza contratos; divergências não são resolvidas inventando IDs ou requisitos. Se uma decisão de produto mudar, registrar a necessidade de atualizar as fontes, sem fazê-lo silenciosamente durante um slice.

## 4. Matriz de rastreabilidade e cobertura

Os IDs em cada coluna pertencem exclusivamente ao arquivo indicado. Intervalos abaixo são inclusivos e representam IDs existentes. “Integração” identifica onde a cobertura parcial é reunida; não adia as verificações locais.

| PRD: regras/cenários | SPEC: requisito/aceite | Slice responsável e integração |
| --- | --- | --- |
| D01–D07, RN19, RN21 | CON-001–CON-003, PLT-001–PLT-003, COM-001, VAL-001, VAL-003, VAL-006, VAL-008 | S00 prepara contexto, baseline e rastreabilidade; não comprova aceite funcional nem valida decisões de negócio |
| RN01–RN02; C01, C03, C04 | REQ-001, REQ-005; AC-001 | S01; estados adicionais de C04 em S02–S05 |
| RN02–RN08, RN14–RN16; C02 | REQ-002–REQ-005, REQ-010; AC-002 | S02 + S04 |
| RN02–RN05, RN14; C05–C07 | REQ-002, REQ-003, REQ-005; AC-003 | S02 + S04 + S05 |
| RN22–RN23; C08, C14 | REQ-002; AC-004 | S02 + S06 |
| RN06–RN07, RN15; C09, C10, C42 | REQ-004, REQ-010; AC-005 | S05 |
| RN12, RN15–RN16; C09, C11, C12, C31 | REQ-009, REQ-010; AC-006 | S05 |
| RN03–RN04, RN16, RN18, RN23; C13, C15 | REQ-013; AC-007 | S02 + S06; decisão integrada com S04 |
| RN09–RN10; C16, C17, C20 | REQ-006; AC-008 | S03; tentativas de decisão em S04/S05 |
| RN10, RN12–RN13; C09, C18, C19, C23 | REQ-007, REQ-009; AC-009 | S03 + S05 |
| RN08–RN10, RN15–RN16; C21 | REQ-005, REQ-006, REQ-010; AC-010 | S04 com invalidação de S03 |
| RN11, RN14; C22, C24 | REQ-008; AC-011 | S01 + S03 + S04 |
| RN17–RN19; C25, C27, C28 | REQ-011; AC-012 | S04 + S05; recuperação integrada em S08 |
| RN17–RN19; C26, C30, C39 | REQ-011; AC-013 | S04 + S08 |
| RN19; C29, C32, C33 | REQ-011; AC-014 | S02 + S03 + S05; recuperação integrada em S08 |
| RN20–RN21; C34–C37 | REQ-012; AC-015 | S01 |
| RN21; C38 | REQ-012; AC-016 | S01 |
| RN04, RN07, RN11, RN14, RN18–RN19; C39 | REQ-003–REQ-005, REQ-008, REQ-011; AC-017 | S01–S05 por comando; matriz completa em S08 |
| RN15–RN16, RN21; C40–C42 | REQ-014, REQ-015; AC-018 | S05 + S07; integração em S08 |

**Condições finais:** `SPEC: VAL-001` precede implementação; `SPEC: VAL-002` acompanha os contratos de cada slice; `SPEC: VAL-004` é demonstrado em S01; `SPEC: VAL-005` acompanha as ações e é consolidado em S08; `SPEC: VAL-003`, `SPEC: VAL-006`, `SPEC: VAL-007` e `SPEC: VAL-008` consolidam cobertura, execução, revisão manual e escopo. A matriz não é evidência de que essas condições já foram satisfeitas.
