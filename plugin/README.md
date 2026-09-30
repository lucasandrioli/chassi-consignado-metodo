# Plugin da biblioteca de produto

O plugin roda **no arquivo da biblioteca de cada produto** e instala ali a **etapa** (não telas soltas): as três coleções de variáveis (Operação, Contexto e Produtos Adicionais, com seus modes), as variáveis com os valores iniciais, e um componente do produto por tela, ligado ao componente publicado do Core. Depois de revisar e publicar a biblioteca pelo Figma, o designer usa as instâncias.

Os pacotes que o plugin instala **vêm dos contratos** (nunca são escritos à mão) e ficam **embutidos** em `code.js`. Sem pacote, o plugin abre e informa que não há nada para instalar.

## Do contrato ao plugin

```sh
node plugin/scripts/gen-packages.cjs   # lê os contratos e grava plugin/packages/<etapa>-<produto>.json
node plugin/scripts/build.cjs          # embute os pacotes e gera plugin/code.js
node scripts/verificar.cjs             # confere tudo (contratos, pacotes, code.js e testes)
```

Requer só o **Node 18 ou mais novo**; não há dependências para instalar. O build recusa contrato inconsistente e pacote sem estado válido (`technical-proof` para prova controlada; `approved` exige os três contratos aprovados).

## Usar no Figma

1. No Figma Desktop: **Plugins → Desenvolvimento → Importar plugin do manifesto** e escolha `plugin/manifest.json` (uma vez). Depois de um novo `build`, basta rodar o plugin de novo.
2. Abra o arquivo da **biblioteca do produto**, com a biblioteca do Core ativada, e execute **Instalar chassi na biblioteca**. Não rode no arquivo do designer.
3. O plugin confere as chaves e as properties do Core antes de escrever. Revise o resultado, use **Verificar biblioteca** e publique pelo fluxo normal do Figma.

O Core não tem texto de produto: conteúdo e condições ficam nos contratos do produto e, depois da instalação, nas variáveis da biblioteca dele. Ligações de protótipo só entram se a rodada as contratar.

## Destinos de binding por caminho

Um binding `component` pode indicar o destino por `target.path`, uma lista de nomes de instância do Core para o nível mais interno (por exemplo `["item-valor-receber", "Label 01"]`), e `target.property` com o nome da property pública da última instância. Cada nome é procurado só dentro do nó do passo anterior e precisa ser único ali; isso permite repetir `Label 01` em vários itens desde que o item seja único no Core. Sem `path`, vale o comportamento anterior (`target.name`, único em todo o Core). O plugin desliga `skipInvisibleInstanceChildren` para alcançar instâncias ocultas. Testes: `node plugin/scripts/paths.test.cjs` e `node plugin/scripts/axes.test.cjs`.

## Visibilidade sem property pública

O Core não expõe BOOLEANs públicas. Um binding `BOOLEAN` com `target.kind = "visible"` liga a variável à visibilidade (`visible`) da camada indicada por `target.path` (lista de nomes de camada, de qualquer tipo, cada nome único dentro do nó anterior). Sem `path`, vale `target.name` (instância única no Core). O plugin aplica `binding.default` e liga a variável; o designer do produto só troca os modes. Verificado em arquivo descartável: a ligação numa camada dentro de instância funciona, o painel da instância fica sem properties e a altura reflui pelo auto layout. Teste: `node plugin/scripts/paths.test.cjs`.

## Quem é dono do quê depois da instalação

| Dono | O que é | Como muda | Plugin? |
| --- | --- | --- | --- |
| **Chassi** (contrato → pacote) | Eixos, nomes de coleções e de modes; nomes das variáveis; quais camadas são ligáveis e seus caminhos; qual property do Core recebe qual variável; properties fixas; chave do Core; nome do componente do produto; contêiner e nome dos slots; versão do chassi | Contrato, pacote e versão do chassi | **Sim** (atualiza no lugar ou instala versão maior ao lado, com confirmação) |
| **Core / IDS** | Visual dentro dos componentes; espaçamento entre blocos (variável de layout publicada); tokens do IDS | Publicar o Core; o Figma propaga | Não (versão menor) |
| **Produto** | Textos por mode | Editar a variável no Figma do produto e publicar | Não; o plugin **preserva** ao reinstalar |
| **Produto** | **Quando cada bloco aparece** (valor de visibilidade por mode). O chassi só define **quais blocos podem ser ligados** e onde ficam; o valor no pacote é a semente, tirada do que o produto já faz nas referências | Editar a variável no Figma do produto e publicar | Não; o plugin **preserva** ao reinstalar |
| **Produto** | Conteúdo dentro de um slot e as variáveis dele. O chassi só entrega o contêiner e as regras dele | Desenhar no Figma do produto | Não. **Não provado**: que uma atualização do chassi preserva o conteúdo do slot |
| **Designer** | Escolher o mode de cada eixo na instância; sobrescrever texto pontual pela property pública | Painel de propriedades | Não |

O produto nunca renomeia nem apaga variáveis, coleções ou modes. O designer não vê interruptores de visibilidade.

Detalhes do texto: depois da primeira instalação, cada texto é uma variável na biblioteca do produto e o time do produto o edita direto no Figma (edita a variável, publica, o designer aceita a atualização). Ao **reinstalar**, o plugin **preserva os valores de texto que já existem** e só preenche o que falta (por exemplo, um mode novo). Vale o mesmo para o **quando cada bloco aparece** (variáveis BOOLEAN de visibilidade): o valor do pacote é inicial e não é sobrescrito. Seguem o pacote só as **properties fixas** e a estrutura (quais camadas são ligáveis, alvos, eixos, modes). Os textos dos contratos de produto são os **valores iniciais** da primeira instalação. Preservação de texto coberta por teste no simulador e exercitada no Figma real (96 valores preservados na reinstalação).

## Versão do plugin

O número (`plugin/version.json`, formato N.N.N) é copiado para o plugin no build, aparece no topo da tela, é gravado no arquivo junto do pacote instalado (`pluginVersion`) e consta na descrição do componente do produto. Regras de subida e histórico em `plugin/CHANGELOG.md`. O build recusa versão inválida.

## Verificar biblioteca (só leitura)

O botão **Verificar biblioteca** lê o arquivo aberto e o compara com o pacote escolhido, sem alterar nada. Confere: o registro da instalação (pacote, hash e versão do plugin); as três coleções e seus modes (faltando ou sobrando); cada variável esperada (existência, tipo e valores); variáveis fora do pacote (órfãs ou renomeadas); o componente do produto (existência, ausência de properties públicas, vínculo vivo com o Core pela chave publicada); e cada ligação (destino encontrado no Core, property ou visibilidade ligada à variável esperada, property fixa com o valor do pacote). Níveis: **erro** (estrutura ou vínculo do chassi divergem do pacote: variável ausente ou renomeada, ligação quebrada, property fixa alterada), **aviso** (variável fora do pacote, pacote instalado diferente do atual) e **info** (texto ou quando-aparece que o produto alterou e difere do valor inicial: esperado, pois pertencem ao produto). Código em `src/verify.js`; testes no simulador; as formas de leitura da API (`componentProperties[chave].boundVariables.value`, `boundVariables.visible`, `valuesByMode`) foram conferidas no Figma real. Ainda não foi rodado o relatório completo no Figma real.

## Regra de versão do chassi (instalar, atualizar, versão maior)

O pacote informa `chassiVersion` (por exemplo `1.1`, vinda de `chassi.versao` na configuração do contrato do produto). Ao instalar, o plugin compara com o registro do arquivo (`installs` por versão maior):

| Situação | O que o plugin faz | Confirmação |
| --- | --- | --- |
| Arquivo sem instalação | Primeira instalação | Não |
| Mesma versão e mesma estrutura (`structureHash`) | Reaplica (textos do produto preservados) | Não |
| Mesma versão maior, menor mais nova (1.0 → 1.1) | **Atualiza no lugar**: cria o que falta, reaplica regras do chassi, preserva texto; **nunca apaga** | **Sim** |
| Versão maior mais nova (1.x → 2.0) | Instala o componente `…/v2` **ao lado** do `…/v1`; texto e quando-aparece compartilhados entre as versões maiores | **Sim** |
| Mesma versão, estrutura diferente | Recusa: suba a versão do chassi no contrato | — |
| Pacote mais antigo que o instalado | Recusa | — |
| Registro de plugin 1.x | Recusa (use um arquivo novo) | — |

Na tela, "Instalar" primeiro mostra o plano (o que vai acontecer e quantas diferenças serão aplicadas) e só escreve depois de **Confirmar e instalar**. O relatório de **Verificar biblioteca** funciona em qualquer estado. Testes: `node plugin/tests/installer-sim.cjs` (bloco "migração").
