# Codex AI PDLC Workshop · Rio de Janeiro

Hands-on AI PDLC workshop with Codex: from PRD to implementation using a full-stack application with Next.js, React and TypeScript.

**19 de setembro de 2026 · 10h–13h30 · Q&A 13h30–14h · Glaucia Lemos**

Esta é a **solução de referência** do workshop. Para começar o exercício, use `main` ou `starter-v1.0.0`. O Nexo é um portal fictício de demandas internas com criação, edição, busca, filtros, quadro por situação, histórico e perfis de demonstração. Nesta branch, a aprovação de orçamento está implementada. O [guia da instrutora](docs/instructor-guide.md) explica como conduzir a construção passo a passo.

![Quadro de demandas do Nexo](docs/images/portal.png)

## Comece aqui

Requisitos: **Node.js 24**, npm, Git e navegador. Prepare também seu acesso ao Codex App ou CLI antes do evento. A aplicação não usa API de IA nem pede chave de API.

Faça um fork e clone seu repositório. Para experimentar diretamente a base original:

```sh
git clone --branch workshop-solution https://github.com/glaucia86/codex-ai-pdlc-workshop.git
cd codex-ai-pdlc-workshop
npm ci
npm run doctor
npm run dev
```

Abra **http://127.0.0.1:3000**. Os dados são criados automaticamente no primeiro acesso. Não é necessário configurar variáveis de ambiente, banco de dados ou Docker.

Antes do evento, execute também:

```sh
npm run validate
npx playwright install chromium
npm run test:e2e
```

O teste pelo navegador usa a porta 3100 e dados próprios, sem alterar suas demandas. Pare o servidor de desenvolvimento antes de executar a validação completa ou o teste pelo navegador.

Leia a [preparação e solução de problemas](docs/preparation.md). No Windows, se o PowerShell bloquear `npm.ps1`, use o **Prompt de Comando** ou execute `npm.cmd` no lugar de `npm`.

## Durante o workshop

1. Explore o portal com o perfil Ana Costa. Crie uma demanda, abra os detalhes e acompanhe o histórico.
2. Leia a [nova necessidade de produto](docs/workshop-brief.md).
3. Crie sua branch de trabalho: `git switch -c feature/aprovacao-orcamento`.
4. Acompanhe o PRD, a especificação, o contexto, a implementação, os testes e a revisão.

| Referência                                                                                                                | Finalidade                                                      |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `main` e `starter-v1.0.0`                                                                                                 | Ponto de partida do exercício                                   |
| [Guia da instrutora](https://github.com/glaucia86/codex-ai-pdlc-workshop/blob/workshop-solution/docs/instructor-guide.md) | Fala sugerida, demonstrações, prompts, resultados e recuperação |
| [Solução de referência](https://github.com/glaucia86/codex-ai-pdlc-workshop/tree/workshop-solution)                       | Feature completa e documentos preenchidos                       |
| [Checkpoints](docs/checkpoints.md)                                                                                        | Retomar uma etapa em uma cópia separada                         |

## Comandos

| Comando                       | O que faz                                                         |
| ----------------------------- | ----------------------------------------------------------------- |
| `npm run dev`                 | Inicia a aplicação local na porta 3000                            |
| `npm run doctor`              | Confere os pré-requisitos locais básicos                          |
| `npm test`                    | Testa regras, API e persistência com diretórios temporários       |
| `npm run lint`                | Verifica o código com ESLint                                      |
| `npm run typecheck`           | Verifica tipos TypeScript                                         |
| `npm run validate`            | Executa tipos, lint, testes e build; interrompe na primeira falha |
| `npm run test:e2e`            | Verifica a interface em Chromium, usando porta e dados isolados   |
| `npm run data:reset`          | Restaura os exemplos após confirmação e preserva um backup        |
| `npm run build` / `npm start` | Gera e executa o build local                                      |

## Como o projeto funciona

- **Interface:** Next.js App Router, React, TypeScript, Lucide e fonte Geist servida pelo próprio projeto.
- **Backend:** endpoints Next.js; validação de entrada e regras executadas no servidor.
- **Dados:** arquivo JSON local, gravação coordenada por trava e substituição por arquivo temporário. Uma instância local por participante.
- **Demonstração:** todos consultam as demandas; cada pessoa edita e movimenta as próprias. Há dois gestores para demonstrar decisões sobre demandas de outras pessoas. A seleção de perfil representa um cenário de aula, sem autenticação real.

Veja a [arquitetura](docs/architecture.md) e o [glossário](CONTEXT.md).

## Recuperar os dados

Pare o servidor com `Ctrl+C` e execute `npm run data:reset`. Os dados anteriores ficam em um arquivo de backup ao lado do arquivo de trabalho. Não apague a seed versionada.

Se houver JSON inválido ou uma trava abandonada após encerrar o processo abruptamente, siga a [recuperação documentada](docs/preparation.md#recuperação-de-dados-e-trava). O projeto não apaga uma trava automaticamente pelo tempo de existência.

## Limites da demonstração

O alvo é execução local. JSON e perfis fictícios simplificam a instalação; uma entrega corporativa exigiria decisões próprias de armazenamento, identidade, infraestrutura e operação. O encerramento prático do workshop é uma mudança validada e pronta para revisão em PR.

Código sob a [licença MIT](LICENSE). Projeto comunitário para ensino, sem vínculo de produto oficial com a OpenAI.
