# Aprovação de orçamento antes de iniciar demandas

As demandas novas podiam iniciar sem avaliação do orçamento. Esta mudança exige a decisão de outro gestor sobre o valor atual e registra o caminho até a execução.

## Mudança de comportamento

O solicitante envia o orçamento; um gestor aprova ou rejeita, com justificativa obrigatória na rejeição. Somente uma aprovação válida libera o início. Alterar o valor antes de iniciar exige reenvio; depois de iniciar, o valor fica bloqueado. Decisões antigas permanecem no histórico e demandas preexistentes em execução podem concluir.

O backend impõe as regras independentemente da interface. A leitura compatível preserva os dados v1 e passa a gravar v2 na próxima mutação. A versão da demanda evita sobrescrever uma decisão feita por outra tela.

## Como verificar

Executar `npm run validate` e `npm run test:e2e`, com dependências e Chromium instalados. Na UI, criar como Ana, enviar, decidir como Bruno e retornar a Ana para iniciar. Em outra demanda aprovada ainda Nova, alterar o valor e confirmar a exigência de reenvio. Tentar autoaprovação e rejeição sem motivo; conferir bloqueios e histórico.

## Evidências e limites

Construção local: tipos, lint, 18 testes, build e quatro jornadas de navegador aprovados. Condições da execução em `docs/instructor/verification.md`. O ensaio de facilitação e a verificação do ambiente da apresentação são tarefas separadas.

Execução local, perfis fictícios e arquivo JSON são limites deliberados do workshop. Esta descrição é um exemplo pronto para revisão; nenhum PR foi publicado a partir dela.
