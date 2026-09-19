# Arquitetura e implementação

Leia ao localizar código ou alterar interface, regras, API ou persistência. Para contratos e detalhes do armazenamento, consulte a [arquitetura do starter](../docs/architecture.md).

## Mapa do código

| Local | Responsabilidade |
| --- | --- |
| `src/app/` | Entrada Next.js, layout, estilos e rotas |
| `src/components/` | Quadro, formulários, detalhes e interações React |
| `src/domain/model.ts` | Esquemas Zod, tipos e comandos |
| `src/domain/demands.ts` | Regras e transições, sem acesso a arquivos |
| `src/domain/currency.ts` | Valores em centavos e exibição em reais |
| `src/server/http.ts` | Handlers, contrato HTTP e tradução de erros |
| `src/server/json-store.ts` | Transações, trava, leitura e gravação JSON |
| `data/seed.json` | Exemplos versionados |
| `.local/` | Dados locais de trabalho |
| `tests/` | Testes de domínio, API, persistência e navegador |

## Ao modificar o comportamento

- Antes de escrever código, leia o guia pertinente em `node_modules/next/dist/docs/`, conforme a instrução do Next.js no [AGENTS.md](../AGENTS.md).
- Mantenha as regras no domínio e sua validação no backend. Desabilitar um botão não garante a regra.
- Preserve a identificação do perfil no servidor, a validação dos comandos e a verificação de versão contra atualizações concorrentes.
- Encaminhe mutações pela transação do armazenamento. Não substitua o ciclo protegido de leitura, alteração e gravação por escrita direta no JSON.
- Preserve o histórico e a compatibilidade dos dados ao introduzir campos ou estados.
- A seed permanece imutável durante o uso. Não use os dados do participante como massa de testes.

## Leituras complementares

- Para requisitos da aprovação, consulte [Contexto e escopo](contexto.md).
- Para verificar uma alteração, consulte [Execução e validação](validacao.md).
- Para problemas com JSON ou trava, consulte a [preparação e recuperação](../docs/preparation.md). O reset faz backup; não remova dados ou travas indiscriminadamente.
