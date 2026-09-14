# Retomar uma etapa

Um checkpoint é uma versão conhecida do exercício. Ele serve para continuar a prática se você ficar para trás ou quiser comparar seu resultado.

| Referência       | Etapa                                                        |
| ---------------- | ------------------------------------------------------------ |
| `starter-v1.0.0` | Aplicação inicial                                            |
| `checkpoint-01`  | PRD, especificação, contexto, skill e plano de implementação |
| `checkpoint-02`  | Solicitação de aprovação                                     |
| `checkpoint-03`  | Decisão do gestor e bloqueio da execução                     |
| `checkpoint-04`  | Reenvio, invalidação, dados antigos e validação completa     |

## Caminho mais simples durante a aula

Deixe sua pasta atual preservada. Pare o servidor e abra uma **nova pasta** a partir do repositório original; isso funciona mesmo se seu fork contiver somente a branch principal.

Exemplo para retomar depois da preparação do contexto:

```sh
git clone --branch checkpoint-01 --single-branch https://github.com/glaucia86/codex-ai-pdlc-workshop.git codex-rio-retomada-01
cd codex-rio-retomada-01
git switch -c minha-retomada
npm ci
npm run validate
npm run dev
```

Ao clonar uma tag, o Git pode informar que você está em `detached HEAD`. O comando `git switch -c minha-retomada` cria uma branch para seu trabalho. Use outra pasta se o nome do exemplo já existir.

Para outro ponto, substitua `checkpoint-01` pelo nome desejado e use uma nova pasta. Seus arquivos da tentativa anterior permanecem intactos. Não copie o arquivo JSON da solução de volta para o starter; cada cópia inicia com dados compatíveis.

Se quiser enviar a retomada ao seu fork, confira os remotos e ajuste o destino para o seu repositório antes do push. Você não precisa publicar nada para acompanhar a prática local.

## Manutenção das referências

Na solução, `docs/checkpoint-refs.json` registra os commits publicados de cada etapa. O workflow **Publish workshop checkpoints** cria as tags com o token padrão do GitHub Actions e falha se uma tag existente apontar para outro commit; ele não move tags. A publicação fica restrita à branch `workshop-solution` do repositório original. Forks não executam essa publicação.

As tags representam versões de aula. Correções posteriores devem preservar a rastreabilidade e usar uma nova versão quando alterarem um ponto de partida já distribuído.
