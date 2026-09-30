# Padrões recorrentes de execução

## Padrões recorrentes de execução

Regras gerais para quando o contrato traz um destes padrões (qualquer tela):

| Situação no contrato | Como executar | Como provar |
| --- | --- | --- |
| Região opcional por produto | Um componente por região, raiz nomeada pelo papel, sem texto, sem property pública de visibilidade; instâncias IDS internas mantidas | Composição de prova de cada produto **contém só as regiões dele**; varredura com camadas ocultas incluídas não acha região de outro produto |
| Camada ligável por caminho | Dê nome único dentro do pai a cada nó do caminho; estado padrão como no contrato | Releia o caminho a partir da raiz; escreva e releia `visible` na instância de prova |
| Texto por property pública | Leia `componentProperties` da instância nomeada e use a chave real (com sufixo `#id`) | Grave um valor e releia; confirme que o mestre continua sem texto |
| Lista dinâmica com máximo | Crie somente os itens pedidos, na ordem; configure item a item | Caso com o **máximo** declarado: altura por bloco, sem quebra, sem corte |
| Item com estados | Todos os estados previstos com espaço de conteúdo próprio | Uma instância de prova por estado |
| Composição repetida aprovada como componente local | Crie o componente uma vez, com peças IDS e tokens; use as duas ocorrências como instâncias | As duas ocorrências mudam juntas quando o componente muda |
| Espaçamento por produto | Variáveis de layout por produto (uma coleção, um mode); gap e padding ligados | Trocar o valor no Core muda o bloco no consumidor sem plugin; nenhuma opção de outro produto aparece |
| Sobreposição | Absoluta, com constraints que seguem a composição | Altura e largura acompanham a composição em dois cenários de tamanhos diferentes |
| Peça IDS que não expõe o controle | Percorra a cadeia até o nível que expõe; senão composição local justificada; senão impasse | Registre o nível onde a property existe e o teste de escrita |
| Diferença de medida sem causa | Meça o bloco, o container interno, o padding/gap padrão e a quebra de texto | A causa medida vai ao recibo; sem causa, a unidade fica bloqueada |
