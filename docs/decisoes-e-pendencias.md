# Decisões e pendências

Decisões que moldam o método (valem para qualquer etapa) e o que ainda está em aberto. As tabelas de responsabilidade e as regras de versão do plugin estão em [plugin/README.md](../plugin/README.md).

## Decisões

**Arquitetura**
- O Core é um **kit de regiões**: cada bloco funcional é um componente publicado. O chassi é a **receita de composição versionada** (ordem, espaçamento, itens e máximos). O plugin executa a receita no arquivo do produto.
- **O que um produto não usa não aparece nele**: nem camada oculta, nem slot vazio, nem variante por perfil, nem `detach`. Uma região usada é uma instância do Core, com vínculo vivo.
- Sem BOOLEAN pública de visibilidade: o painel do designer não mostra interruptores. A visibilidade é ligada pelo instalador a uma variável do produto, por caminho de camada.
- Área de conteúdo **livre do produto** é um **slot**, contratado só como contêiner (espaço, posição, presença por modo); o interior e as variáveis dele são do produto. A skill de análise decide entre "controlada pelo chassi" e "slot" pelo que as referências mostram, e pergunta em caso de dúvida.

**Eixos e variáveis**
- Os três eixos (**Operação, Contexto e Produtos Adicionais**) pertencem à **etapa**: uma coleção de cada por produto, compartilhada por todas as telas, com os mesmos modos em todas. Cada tela liga só aos eixos que a influenciam.
- O plugin instala a **etapa** (um pacote por produto, com todas as telas), não telas soltas.
- Espaço entre blocos: variável de layout publicada no Core, uma coleção por produto com um só modo. Mudar o valor é versão menor (chega pelo Figma, sem plugin).

**Quem altera o quê**
- **Texto** e **quando cada bloco aparece** (visibilidade por modo) são do produto: editados nas variáveis da biblioteca do produto, sem plugin e sem contrato. O valor no contrato é só o valor inicial, tirado do que o produto já fazia nas referências.
- Nomes de variáveis, coleções, modos, ids de ligação e caminhos são do chassi; o produto não os altera.
- O designer pode sobrescrever um texto na tela; isso desconecta aquele campo da variável (não recebe mais atualizações da biblioteca) e sobrevive à troca de versão.
- O **IDS manda** no que existe; o chassi decide quando aceitar uma mudança do IDS e o que repassar ao produto como opção.

**Versões e migração**
- Versão **menor** do chassi: dentro de componente ou variável publicada (chega pelo Figma) ou mudança compatível de pacote (o plugin atualiza no lugar, **com confirmação**, sem apagar nada).
- Versão **maior**: mudança de receita. O plugin instala o componente `…/vN` ao lado do anterior, **com confirmação**; o produto troca as instâncias com "Trocar instância" do Figma, que mantém nó, modos e textos. Texto e "quando aparece" são compartilhados entre versões maiores.
- Pacote mais antigo que o instalado, ou estrutura mudada sem subir a versão, são recusados.

**Pacote e plugin**
- O pacote é **gerado dos contratos** (nunca escrito à mão) e fica **embutido** em `plugin/code.js`. A chave publicada do Core mora em um só lugar: a tabela do contrato da tela.
- O plugin é mantido neste repositório; a publicação na organização (privada) depende do time responsável pela liberação de plugins.

## Pendências

**Plugin**
- **Etapa com mais de uma tela** instalada por um mesmo pacote: prevista e coberta no gerador e no simulador, ainda não exercitada no Figma real.
- **Espaçamento por produto** como variável de layout do Core: o plugin ainda não importa a variável nem liga `gap` e padding a ela.
- O **slot** ainda não é declarado no pacote: o pacote não conhece slots e não se provou que uma atualização do chassi preserva o conteúdo colocado num slot.
- **Modo de verificação do Core e do IDS**: comparar destinos, propriedades e chaves dos contratos com o Core e o IDS conectados (renomeada, removida, nova), sem criar nada.
- Conferência **automática das chaves** publicadas contra o Figma.
- Testar o "Redefinir" do Figma para religar um texto sobrescrito à variável.

**Skills**
- As skills de montagem e de validação ainda **não constroem nem conferem** o contêiner com slot.
- As três skills foram atualizadas para o MCP do Figma e ainda não foram executadas de ponta a ponta por um agente com o MCP em telas reais.

**Documentação e organização**
- **Guia de migração** para os times de produto a cada versão maior, com prazo de convivência.
- Organização do repositório por produto (`produtos/<produto>/`) e `CODEOWNERS`.
- Verificação automática no repositório remoto (rodar `node scripts/verificar.cjs` a cada mudança).

**Governança**
- Pedir a liberação do plugin ao time de operações e perguntar: quem aprova uma atualização, quanto tempo leva e se cada versão exige nova análise de segurança.
- Confirmar qual plano do Figma vale para bibliotecas e plugins privados da organização (limite de modos por coleção).
