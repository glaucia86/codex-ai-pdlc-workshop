# Evidências de construção

Verificações locais realizadas em **14/09/2026**, Linux, Node.js **24.19.0**. Comandos executados com dados de teste isolados. A tabela registra evidências técnicas, não um ensaio humano da aula.

| Versão                                 | Validação                                       | Navegador                       |
| -------------------------------------- | ----------------------------------------------- | ------------------------------- |
| Starter / checkpoint 01 (mesmo código) | TypeScript, ESLint, 8 testes e build aprovados  | 2 jornadas aprovadas no starter |
| Checkpoint 02                          | TypeScript, ESLint, 10 testes e build aprovados | 3 jornadas aprovadas            |
| Checkpoint 03                          | TypeScript, ESLint, 12 testes e build aprovados | 3 jornadas aprovadas            |
| Checkpoint 04 / solução                | TypeScript, ESLint, 18 testes e build aprovados | 4 jornadas aprovadas            |

O starter também foi instalado com `npm ci` em uma cópia limpa no commit da tag e passou por `npm run doctor` e `npm run validate`.

## O que foi verificado

- Criação, edição, busca, avanço, conclusão, recarga e histórico da demanda.
- Somente o solicitante envia, edita e movimenta suas demandas.
- Decisão exclusiva de outro gestor, rejeição com justificativa, início condicionado a aprovação válida.
- Valor alterado invalida avaliação; mesmo valor preserva; reenvio mantém histórico.
- Valor bloqueado após início, inclusive no backend; conclusão de demanda preexistente.
- Requisições inválidas e ações recusadas não persistem mudanças.
- Duas instâncias do armazenamento recebem mutações concorrentes sem perder demandas.
- Duas decisões concorrentes têm um único vencedor; a outra recebe conflito de versão.
- JSON v1 é lido sem reset, histórico é preservado e a primeira mutação grava v2.
- Arquivo inválido não é apagado silenciosamente; reset preserva backup.
- Layout do starter e painel de aprovação inspecionados em desktop e celular, incluindo tema escuro; sem erros JavaScript observados nem transbordamento horizontal na verificação visual.

Os testes de persistência reabrem o mesmo arquivo por novas instâncias do armazenamento. Isso verifica a continuidade no arquivo; o ensaio inclui reiniciar manualmente o processo do servidor na máquina da instrutora.

## Ambiente e limitações

Neste ambiente de construção, o download padrão de Chromium do Playwright não estava disponível. As jornadas foram executadas com Chromium disponível localmente, por meio de `PLAYWRIGHT_EXECUTABLE_PATH`. No computador do participante, o caminho normal é `npx playwright install chromium` e `npm run test:e2e`.

A CI do **starter passou em Linux, Windows e macOS**, com `npm ci` e `npm run validate` nas três plataformas e E2E em Linux: [execução 34793041797](https://github.com/glaucia86/codex-ai-pdlc-workshop/actions/runs/34793041797). Para a solução e mudanças posteriores, consulte os [resultados por commit na aba Actions](https://github.com/glaucia86/codex-ai-pdlc-workshop/actions). A máquina local desta construção é Linux; CI bem-sucedida não substitui conferir o computador da apresentação.

ESLint está fixado na versão 9.39.5, compatível com o plugin de React usado neste conjunto de dependências. A tentativa com ESLint 10 falhou na API do plugin; o lockfile preserva a combinação validada. Reavalie atualizações em uma branch separada, sem mudar dependências no meio da aula.

Ensaio cronometrado, validação no projetor e verificação do acesso pessoal ao Codex seguem pendentes. Consulte [rehearsal.md](rehearsal.md).

## Reproduzir

```sh
npm ci
npm run doctor
npm run validate
npx playwright install chromium
npm run test:e2e
```

Pare o servidor de desenvolvimento antes de validar ou executar E2E. Os testes não usam o arquivo das demandas da pessoa.
