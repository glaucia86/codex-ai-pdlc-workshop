# Ensaio da aula

**Situação: ensaio humano cronometrado pendente.** Os testes técnicos não medem o tempo de ensinar, ler respostas, explicar decisões ou atender a turma.

## Antes de cronometrar

Use o mesmo computador, editor, Codex e conta da apresentação. Clone `starter-v1.0.0` em uma pasta nova, instale as dependências e o Chromium antes de iniciar o relógio. Tenha a solução em outra pasta e abra o guia em uma janela separada.

Confirme que cada tag abre no GitHub e permite um clone. Teste pelo menos uma retomada, seguindo `docs/checkpoints.md`, para praticar a recuperação preservando a pasta original. Se quiser reiniciar o exercício, pare o servidor e use `npm run data:reset`, que confirma a ação e guarda backup.

## Registro de tempo real

| Bloco                        | Reserva     | Tempo observado                | Ajuste necessário |
| ---------------------------- | ----------- | ------------------------------ | ----------------- |
| Produto e história           | 15 min      | A medir                        |                   |
| PRD                          | 25 min      | A medir                        |                   |
| Especificação                | 20 min      | A medir                        |                   |
| Contexto, skill e harness    | 25 min      | A medir                        |                   |
| Intervalo                    | 10 min      | A medir                        |                   |
| Slices                       | 15 min      | A medir                        |                   |
| Solicitar                    | 20 min      | A medir                        |                   |
| Decidir                      | 20 min      | A medir                        |                   |
| Reavaliar                    | 20 min      | A medir                        |                   |
| Validação, revisão e handoff | 25 min      | A medir                        |                   |
| Demonstração e PR            | 15 min      | A medir                        |                   |
| **Prática total**            | **210 min** | A medir                        |                   |
| Q&A reservado                | 30 min      | Não usar para recuperar atraso |                   |

## Critérios para considerar o ensaio concluído

- [ ] Starter abre do zero e preserva uma demanda após reiniciar o servidor.
- [ ] A conta e o ambiente do Codex funcionam na máquina da apresentação.
- [ ] Cada prompt foi executado e você consegue explicar o resultado, mesmo se diferente da referência.
- [ ] Você consegue mostrar as três slices e pelo menos um caso recusado por regra.
- [ ] Uma nova sessão entende o handoff e confirma o estado pelo código.
- [ ] Uma retomada por checkpoint foi realizada em outra pasta.
- [ ] Os horários observados permitem encerrar a prática às 13h30.
- [ ] O tamanho da fonte e as telas são legíveis no projetor.
- [ ] As perguntas frequentes e a contingência estão prontas.

## Contingência durante a aula

| Situação                                     | Ação de facilitação                                                                                       |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Instalação individual bloqueada              | Pessoa acompanha em dupla; apoio específico sem parar a turma inteira                                     |
| Codex ou rede indisponível                   | Usar solução previamente instalada e explicar diff/documentos; registrar prática de geração como pendente |
| Geração ou teste demora                      | Ler o diff e os critérios enquanto executa; ao fim do bloco, retomar checkpoint se necessário             |
| Mudança ultrapassa a slice                   | Revisar escopo e diff; pedir correção delimitada antes de aceitar                                         |
| Teste falha                                  | Reproduzir, comparar com a regra, corrigir a causa; não apagar a verificação                              |
| Atraso acumulado de 10–15 min                | Demonstrar a slice seguinte a partir do checkpoint, mantendo explicação e validação                       |
| Arquivo local corrompido ou trava após queda | Parar o processo e seguir a recuperação de `docs/preparation.md`                                          |

Ao fechar o ensaio, registre data, ambiente, tempos e mudanças feitas no roteiro. A decisão de ritmo pertence à instrutora, com base nessa evidência.
