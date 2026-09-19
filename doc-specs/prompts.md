/to-prd

leia o seguinte arquivo:

+ 'doc-specs/constitution.md'

E faça o seguinte: 

+ crie um PRD.md bem detalhada e extremamente robusta 
+ foque na parte de negócios para criar esse PRD.md. Pois a parte técnica (especificação técnica) 
criaremos depois de validar o PRD.md 
+ Age como o melhor Product Manager Senior com ampla experiencia na implementação a ser feita 
e que tenha extenso conhecimento sobre o assunto que será implementado 
+ Pense também em diferentes cenários de teste que precisará ser implementada aqui. Assim sendo, crie
cenários de teste usando o Gherkin. Pois quaisquer erro nesse fluxo, pode 'travar' o processo aqui. 
+ No final gere um markdown chamado: PRD-v1.md
+ Evite de ser prolixo. Seja objetivo. Por mais que esse arquivo seja robusto.

---

## Criar especificação técnica

/create-specification

Leia o arquivo:

+ 'doc-specs/PRD-v1.md'

E crie uma especificação técnica detalhada e robusta baseada no PRD fornecido.
No final gere um markdown chamado: spec-v1.md

Todavia, quero que você age como o melhor Principal Software Engineer com ampla experiencia em
TypeScript e Next.js, garantindo que a especificação técnica seja precisa, eficiente e alinhada com as melhores práticas de desenvolvimento. Você sempre proverá as melhores soluções pensando numa entrega rápida, mas pensando nas boas práticas de programação, robustez, resiliência, escalamento dessa aplicação.

----

## Implementação Slice

/to-tickets

Leia 

+ `PRD-v1.md`
+  `spec-v1.md` 
+ e use `implementation-slice.template.md` apenas como referência de estrutura. NÃO copie conteúdo diretamente. Foque somente na estrutura para criar o output definidido abaixo.

Crie o arquivo: `implementation-slices.md` com slices:

- em ordem cronológica e por dependências;
- verticais, pequenos e implementáveis;
- seguindo o conceito de Smart Zone vs Dumb Zone. Se você não souber, pesquise na internet sobre o conceito, com resultado esperado, dependências, escopo, Acceptance Criteria, testes/verificação e handoff;
- com Source IDs separados que sejam combinados entre os arquivos do  `PRD:` e `SPEC:`, pensando
no conceito de Context Graph e Contexto Management. Vislumbrando não entrarmos no fenômeno
Lost in the Middle para a implementação desses slices.

Use apenas requisitos e IDs reais do PRD e da spec. Não copie requisitos, IDs, evidências, status ou checkboxes concluídos do exemplo.

Todos os Acceptance Criteria devem começar com `- [ ]`.

Não implemente código e não altere outros arquivos.

---

## Prompt para implementação dos slices

/tdd 

Implemente exclusivamente de acordo com o arquivo: doc-specs/implementation-slices.md:

+ Slice S01 — Preservar dados e exigir autorização
+ Leia o arquivo 'RULES.md' como roteador de contexto, não como ordem para carregar tudo.
+ Sempre que concluir o slice, leia o arquivo 'RULES.md' em relação a mudança de modelo para podermos atualizar a pasta 'harness' (siga o que a rules definiu sobre isso) - leia sob demanda! Para evitar context rot! Mantenha o contexto atualizado e evite carregar informações desnecessárias.
+ cumpra com todos os 'Acceptance criteria' e marque todos que foram cumpridos e depois de verificar se tudo foi concluído marcar [x] os que foram implementados

---

## Prompt - Criar a Rules

Leia integralmente o arquivo `rules.template.md` e analise a estrutura do projeto atual.

Com base nesse template, crie na raiz do repositório um arquivo chamado `RULES.md`, adaptado ao projeto, mas independente de linguagem, framework, ferramenta de IA ou plataforma específica.
> Atenção: estou usando para implementar o Codex CLI! Assim sendo o modelo para atualizar o 
> harness será o luna! Inclui isso no RULES.md

O arquivo deve funcionar como um contrato operacional para agentes de IA e definir, de forma objetiva:

* como carregar contexto sem ler o repositório inteiro;
* o que a IA pode fazer autonomamente;
* quais alterações exigem aprovação humana;
* o que a IA nunca deve executar;
* limites de escopo e prevenção de mudanças não solicitadas;
* regras de segurança, privacidade e proteção de credenciais;
* expectativas sobre testes, validações e evidências;
* critérios para considerar uma tarefa concluída;
* como lidar com dúvidas, conflitos e informações ausentes;
* ordem de precedência entre instruções e documentos.

Use o `rules.template.md` apenas como referência estrutural e de boas práticas. Remova regras específicas do projeto original, como tecnologias, caminhos, integrações, features, modelos de IA e comandos particulares.

Não invente convenções que não possam ser identificadas no projeto. Quando uma informação relevante não estiver disponível, registre-a como `[A DEFINIR]`.

O `RULES.md` final deve ser conciso, acionável, não redundante e escrito como instruções diretas para qualquer agente de IA que trabalhe no repositório.

Não altere nenhum outro arquivo.

