# Arquitetura do starter

O caminho de uma alteração é: a interface envia um comando, o backend identifica o perfil fictício, valida os dados, aplica a regra e grava o resultado. A tela consulta novamente o estado salvo.

| Arquivo ou pasta                   | Responsabilidade                                       |
| ---------------------------------- | ------------------------------------------------------ |
| `src/app/page.tsx` e `layout.tsx`  | Entrada Next.js, metadados, estilos e fonte local      |
| `src/components/portal.tsx`        | Quadro, filtros, seleção de perfil e chamadas da API   |
| `src/components/demand-form.tsx`   | Formulário de criação e edição                         |
| `src/components/demand-detail.tsx` | Detalhes, ações e histórico                            |
| `src/domain/model.ts`              | Esquemas Zod, tipos e comandos aceitos                 |
| `src/domain/demands.ts`            | Regras e transições, sem acesso a arquivos             |
| `src/domain/currency.ts`           | Conversão de valores para centavos e exibição em reais |
| `src/server/http.ts`               | Contrato HTTP e tradução de erros                      |
| `src/server/json-store.ts`         | Leitura, trava, gravação, inicialização e restauração  |
| `src/app/api/demands/route.ts`     | Publicação dos handlers no runtime Node.js             |

## Contrato HTTP

`GET /api/demands` devolve usuários fictícios e demandas. `POST /api/demands` recebe JSON e o cabeçalho `x-demo-user`, cujo valor deve corresponder a um usuário da seed. Nome e papel são lidos no servidor. Esse cabeçalho não constitui autenticação.

Comandos do starter: `create`, `update` e `advance`. A API recusa campos inesperados e exige a versão conhecida da demanda para edição ou movimentação. Uma versão desatualizada devolve conflito (409) para evitar sobrescrever uma alteração feita em outra tela.

Qualquer perfil consulta as demandas; somente o solicitante edita e movimenta as próprias. Demandas concluídas ficam somente para consulta. Essas são convenções da implementação de demonstração e podem ser examinadas durante a elaboração do PRD.

## Persistência

O arquivo de trabalho padrão é `.local/demands.json`; o caminho pode ser definido por `DEMANDS_DATA_FILE`. Não há carregamento estático do JSON no código cliente. Todos os ciclos de leitura e de leitura–alteração–gravação usam uma trava de arquivo, inclusive inicialização e reset.

O conteúdo validado é escrito em um temporário no mesmo diretório e depois substitui o arquivo de trabalho. Uma falha antes da substituição preserva o arquivo anterior. O mecanismo atende ao exercício local; não é um banco distribuído nem promete recuperação de toda falha de energia.

Testes de regras e API usam diretórios temporários próprios; os testes pelo navegador usam `.local/e2e/`. A seed é imutável durante o uso. O reset faz backup antes de restaurar os exemplos.

## Evolução no workshop

O starter armazena `schemaVersion: 1`. A história de aprovação deverá definir como ler esses dados ao introduzir novos campos, preservar o histórico e tratar as demandas já iniciadas. A referência completa fica em outra branch.

## Evolução nesta branch

A solução acrescenta aprovação de orçamento conforme `docs/feature/spec.md`. O formato de trabalho é v2, com leitura compatível de v1 e gravação v2 na próxima mutação. A seed permanece v1 para demonstrar a migração. O histórico separa execução e avaliação. O arquivo não deve voltar ao starter após a migração; use pastas distintas para comparar versões.
