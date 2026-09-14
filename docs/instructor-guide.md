# Guia da instrutora — do PRD à entrega com Codex

**Glaucia Lemos · Codex Community Meetup — Rio · 19/09/2026**

Aula das **10h às 13h30**. Perguntas e respostas das **13h30 às 14h**. Horários locais do Rio de Janeiro.

Este é o roteiro de condução, com falas sugeridas, prompts e resultados observáveis. Abra-o em uma janela separada do projeto que será compartilhado. Use `starter-v1.0.0` para ensinar; `workshop-solution` é a sua referência. Os prompts orientam o trabalho: a saída do agente precisa ser lida e validada, e pode variar entre sessões.

## O que a turma vai construir

O Nexo já permite registrar demandas internas e acompanhar sua execução. A nova história pede **aprovação de orçamento antes de iniciar uma demanda**. Ana solicita, Bruno avalia e o servidor aplica as regras. A interface usa Next.js, React, TypeScript e Lucide; um arquivo JSON guarda os dados localmente.

A pessoa iniciante deve sair capaz de explicar o problema, executar uma pequena mudança e conferir a evidência. Quem já desenvolve pode aprofundar os testes e a revisão. Não é necessário escrever cada linha ao mesmo tempo que você.

Fala de abertura sugerida:

> “Hoje vamos receber uma necessidade de produto em uma aplicação que já funciona. Vamos transformar essa necessidade em regras verificáveis, oferecer contexto ao Codex e entregar uma mudança pequena de cada vez. Nosso trabalho é tomar decisões, conferir resultados e deixar uma boa continuidade.”

## Preparar antes do evento

1. Envie aos participantes o [guia de preparação](preparation.md) com antecedência. Peça Node.js 24, Git, editor e acesso ao Codex App ou CLI já funcionando. O projeto não exige chave da API OpenAI; o uso do Codex depende do acesso da pessoa. Instalar o projeto e usar Codex requer conexão.
2. Faça um **ensaio cronometrado completo** com os comandos deste roteiro. Reserve margem para instalação, leitura e explicação. Registre os tempos reais no [roteiro de ensaio](instructor/rehearsal.md).
3. Prepare duas pastas independentes: uma de demonstração no starter e outra da solução. Abra a primeira no Codex. Feche o servidor de uma pasta antes de abrir o da outra na mesma porta.
4. Na pasta do starter, rode `npm ci`, `npm run doctor`, `npm run validate` e `npm run dev`. Abra `http://127.0.0.1:3000`. Crie uma demanda, recarregue e confirme a persistência. Depois, com o servidor parado, use `npm run data:reset` e confirme o reset dos **dados fictícios dessa pasta**.
5. Prepare o navegador para testes: `npx playwright install chromium`, depois `npm run test:e2e`. Faça o download antes do evento. Em Linux, o Playwright pode solicitar dependências do sistema; siga o guia oficial indicado na preparação.
6. Confira a conexão, o projetor, o tamanho da fonte, as permissões de execução do Codex e a disponibilidade dos checkpoints no GitHub. Use aprovação normal para comandos que a exigirem.
7. Deixe a solução acessível para contingência. Os testes e a aplicação rodam localmente depois de instalados; gerar novas respostas com Codex continua dependendo do serviço e da rede.

Clonar para a demonstração:

```sh
git clone --branch starter-v1.0.0 --single-branch https://github.com/glaucia86/codex-ai-pdlc-workshop.git codex-rio-aula
cd codex-rio-aula
git switch -c minha-feature
npm ci
npm run doctor
npm run dev
```

Para participantes: fazer fork é recomendado para guardar o trabalho no próprio GitHub. Clonar o original e trabalhar localmente também permite acompanhar. Publicar um PR não é requisito para seguir a aula.

## Agenda para projetar

| Horário     | Bloco                             | Resultado ao encerrar                         |
| ----------- | --------------------------------- | --------------------------------------------- |
| 10h–10h15   | Conhecer o produto e a história   | Turma entende a demanda e abre o starter      |
| 10h15–10h40 | Descoberta e PRD                  | Regras e critérios de aceite revisados        |
| 10h40–11h   | Especificação                     | Estados, comandos e arquivos identificados    |
| 11h–11h25   | Contexto, skill e validação       | Contexto organizado; checkpoint 01            |
| 11h25–11h35 | Intervalo                         | Retomar pontualmente                          |
| 11h35–11h50 | Unidades de implementação         | Três entregas com dependências claras         |
| 11h50–12h10 | Slice 1: solicitar                | Orçamento pendente; checkpoint 02             |
| 12h10–12h30 | Slice 2: decidir                  | Gestor aprova/rejeita; checkpoint 03          |
| 12h30–12h50 | Slice 3: preservar regras         | Valor, reenvio e dados antigos; checkpoint 04 |
| 12h50–13h15 | Testar, revisar e passar contexto | Evidências e handoff                          |
| 13h15–13h30 | Demonstrar e preparar o PR        | Jornada completa e descrição da entrega       |
| 13h30–14h   | Q&A                               | Perguntas e próximos passos                   |

Os minutos são uma proposta de facilitação, não uma medição já realizada. **Às 13h30, encerre o conteúdo.** Se houver atraso, use o checkpoint seguinte e explique o diff. Preserve o Q&A. Registre perguntas longas para o final e tire dúvidas que bloqueiam a prática no próprio bloco.

## 1. Conhecer a aplicação · 10h–10h15

**Mostre:** quadro, nova demanda, detalhes, histórico e seletor de perfil. Como Ana, abra “Monitor para estação de trabalho”. No starter, ela consegue iniciar sem aprovação. Explique por que isso se tornou um problema de produto. Se iniciar na demonstração, restaure os dados antes de continuar, com o servidor parado.

**Explique:** frontend é a tela; backend recebe e verifica ações; domínio concentra as regras. O JSON permite persistência sem instalar um banco. A troca de perfil simula pessoas para a aula e não é um mecanismo de autenticação.

**Abra:** `README.md`, `docs/workshop-brief.md`, `src/domain/demands.ts` e `src/server/http.ts`. Mostre o caminho de uma ação sem ler todos os arquivos.

**Prompt inicial:**

```text
Leia AGENTS.md, CONTEXT.md, docs/architecture.md e docs/workshop-brief.md.
Não altere arquivos ainda. Explique o produto existente, o caminho de uma
mutação da interface até o JSON e três riscos ao acrescentar aprovação de
orçamento. Aponte os arquivos que sustentam sua leitura. Use português simples.
```

**Confira com a turma:** a resposta cita arquivos reais? Distingue o que existe do que será criado? Mostre uma chamada à API ou a função `applyCommand` que comprova a explicação.

**Pergunta rápida:** “Aprovar significa que o trabalho começou?” Resposta esperada: não; o orçamento é aprovado e o solicitante inicia depois.

## 2. Do pedido ao PRD · 10h15–10h40

**Explique:** PRD registra o problema, o resultado esperado, as regras e como saber se funcionou. Ainda não precisa escolher cada função ou componente.

**Prompt:**

```text
Com base em docs/workshop-brief.md e no produto existente, crie
docs/feature/PRD.md. Inclua problema, pessoas, objetivo, escopo, regras
numeradas e critérios de aceite com exemplos. Liste ambiguidades antes de
assumir decisões. Não implemente código. Preserve as regras existentes
de edição e movimentação. Considere orçamento em centavos, decisão por
outro gestor, rejeição com motivo, reenvio, mudança de valor, histórico
e demandas já em andamento.
```

Leia a resposta como responsável pelo produto. Resolva as ambiguidades com estas decisões do workshop:

- Toda demanda possui valor positivo e precisa de aprovação, sem faixas de valor.
- Gestor não decide sobre sua própria demanda.
- Alteração de valor antes de iniciar exige nova avaliação; depois de iniciar, o valor fica bloqueado.
- Aprovação é vinculada ao valor. No recorte, editar outros campos sem mudar o valor não invalida a avaliação.
- Uma demanda que já estava em andamento antes da nova regra pode terminar.
- Perfis continuam simulados; não entra banco, Docker, autenticação ou serviço externo.

**Faça a turma transformar uma regra em exemplo:** “Dado um orçamento aprovado de R$ 1.200, quando Ana muda para R$ 1.500 antes de iniciar, então precisa reenviar e a decisão anterior permanece no histórico.”

**Critério para seguir:** há exemplos de sucesso, tentativa proibida e mudança de estado. Use o [PRD de referência](feature/PRD.md) para comparar depois que a turma produzir o próprio documento.

## 3. Do PRD à especificação · 10h40–11h

**Explique:** a especificação conecta a intenção aos pontos do sistema que precisam mudar. Separa o estado do trabalho do estado da aprovação, evitando transformar o quadro em muitas colunas.

| Execução     | Aprovação                    | Interpretação                         |
| ------------ | ---------------------------- | ------------------------------------- |
| Nova         | Não solicitada               | Orçamento ainda não enviado           |
| Nova         | Pendente                     | Aguardando gestor                     |
| Nova         | Aprovada                     | Pode iniciar pelo solicitante         |
| Nova         | Rejeitada                    | Pode corrigir e reenviar              |
| Em andamento | Aprovada                     | Trabalho em execução; valor bloqueado |
| Em andamento | Não solicitada, preexistente | Exceção da migração; pode concluir    |

**Prompt:**

```text
Leia o PRD aprovado e o código relevante. Crie docs/feature/spec.md com:
modelo de aprovação separado da execução; comandos da API e permissões;
transições válidas e erros; tratamento de valor e versão desatualizada;
leitura compatível dos dados v1; componentes afetados e plano de testes.
Preserve o armazenamento JSON, a trava e a gravação existentes.
Não implemente ainda. Aponte qualquer contradição com o PRD.
```

**Demonstre:** dois gestores podem abrir a mesma demanda. A `version` identifica qual edição cada um viu. A gravação precisa conferir a versão dentro da transação, para uma decisão antiga não sobrescrever a atual. A turma não precisa implementar outro armazenamento para aprender esse ponto.

**Critério para seguir:** os comandos `request-approval` e `decide-approval` têm ator, pré-condição e resultado; dados antigos têm tratamento explícito. [Especificação de referência](feature/spec.md).

## 4. Context Engineering, skills e harness · 11h–11h25

**Mostre o mapa de leitura:** `AGENTS.md` aponta para vocabulário, arquitetura, PRD e especificação; cada documento atende uma pergunta. Abra somente o arquivo útil ao trabalho atual.

Fala sugerida:

> “Contexto não é colar tudo no chat. É dar ao agente um caminho para encontrar a informação certa e critérios para conferir o que ele fez.”

**Prompt para atualizar as instruções:**

```text
Revise AGENTS.md. Mantenha-o curto: comandos reais, mapa dos arquivos,
limites do exercício e links para PRD, especificação e plano de slices.
Não copie os documentos inteiros. Explique o que mudou e por quê.
Não remova instruções geradas e mantidas pelo framework.
```

**Crie uma skill com finalidade concreta:**

```text
Crie a skill de projeto .agents/skills/validar-entrega/SKILL.md, com nome e
descrição no frontmatter. Ela deve orientar a validação de uma entrega do
Nexo usando comandos que já existem. Coloque os cenários específicos de
aprovação em references/approval-checks.md e oriente a leitura dessa
referência apenas quando a tarefa envolver aprovação. Exija relato fiel
dos testes executados, falhas, limitações e próximo passo. Não instale
plugins ou serviços e não implemente a feature ainda.
```

**Explique progressive disclosure:** o nome e a descrição ajudam a identificar quando usar a skill; o procedimento é lido quando acionado; a referência detalhada é consultada conforme a necessidade. Confirme que a skill aparece na sessão. Se necessário, reabra o projeto/sessão para descoberta; ler o arquivo manualmente permite seguir a prática, mas não comprova descoberta automática.

A skill do projeto não depende de outras skills. Ela usa arquivos e comandos do repositório. **Wayfinder foi usado na preparação para organizar decisões**, e não é requisito de instalação para a turma. Uma skill que declara dependências precisa que elas sejam lidas e estejam disponíveis; navegar na internet não substitui suas instruções.

**Explique harness engineering com uma demonstração:** execute `npm run validate`. Esse comando reúne tipos, lint, testes e build, e interrompe ao falhar. O harness é o conjunto de ambiente, ferramentas, verificações e sinais que permite executar e avaliar o trabalho. O arquivo de instruções é apenas uma parte.

**Guardrails concretos:** mantenha permissões normais do Codex, preserve os dados, use testes isolados, revise o diff e não peça para ignorar uma falha. Instruções de texto não substituem controles de execução.

**Critério para seguir:** arquivos localizáveis, comandos executáveis e validação inicial verde. Compare com `checkpoint-01`. Este checkpoint agrupa a preparação, incluindo o plano do próximo bloco.

## 5. Dividir o trabalho · 11h35–11h50

**Explique slice:** uma pequena parte da história que atravessa regra, API, tela e verificação, entregando um comportamento observável.

**Prompt:**

```text
Decomponha o PRD e a especificação em docs/feature/implementation-slice.md.
Use três slices verticais: solicitar aprovação; decidir e impedir início
sem aprovação; invalidar/reavaliar valores e preservar dados/histórico.
Para cada uma, liste dependência, arquivos prováveis, comportamento
observável, testes e critério de conclusão. Não implemente ainda.
```

Peça à turma que leia uma slice inteira antes de executar. Se o plano disser apenas “fazer backend” e “fazer frontend”, peça que seja refeito em comportamentos demonstráveis. [Plano de referência](feature/implementation-slice.md).

## 6. Implementar em três rodadas · 11h50–12h50

Em cada rodada: explique a regra em dois minutos, peça a implementação, acompanhe o diff e demonstre o resultado. Tempo de resposta do agente varia; use os checkpoints quando necessário.

### Rodada 1 · 11h50–12h10 · solicitar aprovação

```text
Implemente somente a slice 1 de docs/feature/implementation-slice.md.
Leia as instruções e referências necessárias. Acrescente a leitura
compatível dos dados antigos, estado de aprovação, comando de solicitação,
painel React e teste do comportamento. Mantenha as outras regras do
starter até a próxima slice. Valide e explique o diff, indicando o que
ainda falta para atender ao PRD completo.
```

**Mostre:** Ana abre o monitor e clica “Enviar para aprovação”. Estado Pendente, valor copiado e histórico com autoria. O botão de envio desaparece. Explique que o bloqueio de início vem na próxima rodada e que esta entrega intermediária não atende ainda ao PRD inteiro.

**Confira:** outra pessoa não envia em nome de Ana; envio duplicado falha; dados antigos aparecem. Retomada: `checkpoint-02`.

### Rodada 2 · 12h10–12h30 · decisão e bloqueio

```text
Implemente somente a slice 2. Gestor deve aprovar ou rejeitar demanda de
outra pessoa; rejeição exige justificativa. O backend deve bloquear o
início sem aprovação válida do valor atual. Acrescente as ações na tela
e testes de permissão, rejeição e transição. Atualize o teste do fluxo
inicial para passar por aprovação, preservando criação, edição, conclusão
e recarga. Execute as verificações e informe o que ainda falta.
```

**Mostre:** como Ana, não é possível iniciar. Feche os detalhes, troque para Bruno, reabra o monitor e aprove. Volte para Ana; iniciar ficou disponível. Uma demanda aprovada permanece Nova até essa ação.

**Mostre o caso proibido:** Bruno envia a própria demanda “Treinamento de acessibilidade”; ele não vê ações para aprová-la. Marina pode decidir. No teste de backend, uma tentativa de autoaprovação também falha.

**Confira:** rejeitar sem motivo não funciona; decisão registra gestor e data. Retomada: `checkpoint-03`.

### Rodada 3 · 12h30–12h50 · mudança de valor, reenvio e legado

```text
Implemente a slice 3. Alterar o valor antes de iniciar deve invalidar
avaliação pendente ou aprovada, preservar o histórico e exigir reenvio.
Depois de iniciar, bloqueie mudança de valor no backend e na interface.
Permita corrigir e reenviar rejeições. Preserve conclusão de demandas
preexistentes. Cubra edição sem mudança de centavos, decisão sobre versão
antiga, concorrência e persistência. Complete o fluxo no navegador e
execute a validação. Não amplie o escopo do PRD.
```

**Mostre:** em uma demanda ainda Nova, aprove R$ 1.200 e altere para R$ 1.500. O estado volta a Não solicitada; a aprovação antiga continua no histórico. Reenvie, rejeite com “Revisar cotação”, corrija e reenvie novamente. Aprove e inicie; valor agora fica somente para leitura.

**Mostre o legado:** como Bruno, abra “Revisão da identidade do produto”, que já veio em andamento. Ela pode ser concluída sem aprovação retroativa.

**Confira:** mudanças são preservadas após recarregar; falhas não criam eventos de sucesso. Retomada: `checkpoint-04`.

## 7. Validação, revisão e handoff · 12h50–13h15

**Acione a skill criada:**

```text
$validar-entrega Revise a implementação contra docs/feature/PRD.md.
Execute as verificações aplicáveis. Liste evidências por regra, falhas e
limitações. Não declare um comando aprovado se ele não foi executado.
```

**Explique três camadas de evidência:**

| Verificação                            | O que responde                                  |
| -------------------------------------- | ----------------------------------------------- |
| Testes de domínio                      | A regra recusa e aceita as transições corretas? |
| Testes de persistência e HTTP          | A API impõe a regra e grava sem perder dados?   |
| Teste pelo navegador e inspeção visual | Uma pessoa consegue completar a jornada?        |

Execute `npm run validate` e `npm run test:e2e`. Use uma falha real, se ocorrer, para mostrar a investigação. Não remova uma asserção só para obter verde. Compare teste e PRD antes de decidir que o teste está errado.

**Prompt de revisão:**

```text
Revise o diff da feature contra o PRD. Procure permissão validada apenas
na UI, aprovação de valor antigo, autoaprovação, perda de histórico e
regressão em demandas preexistentes. Cite arquivo e cenário de cada
problema encontrado. Não invente achados nem altere código nesta revisão.
```

**Context window:** explique que uma sessão acumula mensagens, saídas e arquivos consultados. Sinais de perda de foco incluem repetir investigação, esquecer decisões ou ampliar o escopo. Peça um handoff antes de começar outra unidade; não use uma porcentagem universal como regra.

**Prompt de handoff:**

```text
Escreva docs/feature/handoff.md com objetivo, decisões vigentes, estado
atual, arquivos importantes, comandos realmente executados e seus
resultados, pendências e próximo passo concreto. Diferencie concluído de
planejado. Não copie toda a conversa. Não inclua segredos.
```

Abra uma **nova sessão no mesmo projeto** e use:

```text
Leia AGENTS.md e docs/feature/handoff.md. Confirme o estado pelo código e
pelo Git. Resuma o próximo passo e os riscos restantes antes de alterar
arquivos. Consulte PRD e especificação somente conforme a tarefa exigir.
```

No CLI, `/diff` ajuda a inspecionar mudanças e `/compact` resume o histórico da sessão. Compactação não substitui um handoff versionado nem cria uma sessão independente. No App, use os controles disponíveis de revisão e uma nova conversa; os prompts funcionam nas duas superfícies. As opções da interface podem mudar: confira a documentação oficial antes da aula.

## 8. Demonstrar e preparar a entrega · 13h15–13h30

**Demonstração final, em até cinco minutos:** criar → enviar → decidir como outro gestor → iniciar → concluir → recarregar → consultar histórico. Cite um caso proibido e a evidência correspondente.

**Prompt para preparar o PR:**

```text
Prepare docs/feature/pr-description.md com problema, mudança de
comportamento, regras atendidas, verificações executadas, limitações e
como reproduzir. Baseie-se no diff e no handoff. Não publique o PR.
```

Leia a descrição, revise os arquivos e faça commit na branch da pessoa. Se houver tempo, mostre a criação de um PR no **seu fork** ou a comparação de branches. Não peça que toda a turma envie a solução ao repositório original. O modelo de entrega inclui revisão humana.

**Sobre “Production” no título:** a aula entrega código validado, build e uma proposta de integração. Não haverá deploy público. Discuta a passagem para um ambiente corporativo: identidade real, armazenamento adequado ao ambiente, observabilidade, revisão, homologação e deploy são decisões adicionais; o JSON local e os perfis fictícios delimitam este exercício.

Fala para fechar a prática:

> “Conseguimos explicar qual problema foi resolvido, onde as regras vivem, como testamos e como outra sessão pode continuar. Esse conjunto é a entrega.”

## 9. Q&A · 13h30–14h

Use perguntas da turma. Se precisar iniciar:

- Por que um botão desabilitado não garante uma regra? Porque requisições podem chegar por outros caminhos; o backend também precisa validar.
- Qual a diferença entre AGENTS.md e uma skill? O primeiro orienta o projeto; a segunda empacota um procedimento reutilizável descoberto conforme a tarefa.
- Preciso de muitas skills? Não. Comece com uma tarefa repetível e referências úteis.
- O agente tem que acertar de primeira? Não. Evidências, revisão e escopo pequeno permitem corrigir de forma controlada.
- JSON impede aprender engenharia? Não. Este recorte ainda inclui regras, concorrência local, API, migração, interface, testes e decisões de produto.
- Como levar para empresas? Adapte o processo às regras, aos controles, às ferramentas e à infraestrutura reais; mantenha critérios de conclusão observáveis.

## Apoiar níveis diferentes sem perder o ritmo

- **Trilha guiada:** usar os prompts, executar o fluxo e explicar uma regra com suas próprias palavras. Programar em dupla é válido.
- **Trilha principal:** acompanhar cada slice e revisar o diff junto com os testes.
- **Desafio opcional:** propor um critério de aceite adicional e um teste que demonstre a lacuna. Não implementar nova feature durante a trilha principal.

Se uma pessoa ficar bloqueada por mais de alguns minutos, indique [a retomada por checkpoint](checkpoints.md), preservando a pasta anterior. Se for indisponibilidade de rede/Codex, acompanhe a demonstração e explore a referência já instalada. Evite gastar o tempo coletivo depurando uma máquina; registre o problema para apoio individual.

## Referências da instrutora

- [PRD preenchido](feature/PRD.md), [especificação](feature/spec.md), [slices](feature/implementation-slice.md).
- [Ensaio e contingência](instructor/rehearsal.md), [evidências da construção](instructor/verification.md).
- Documentação oficial: [instruções AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [skills](https://learn.chatgpt.com/docs/build-skills), [comandos do CLI](https://learn.chatgpt.com/docs/developer-commands?surface=cli).

Documentação do Codex consultada em 14/09/2026. Reconfira o ambiente antes de 19/09.
