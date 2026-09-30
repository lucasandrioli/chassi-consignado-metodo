# Como usar o Figma por MCP

Referência comum às três skills do consignado (análise, montagem e validação). Leia **antes da primeira chamada ao Figma** e volte a ela quando uma chamada falhar. O que muda de uma skill para outra é o que cada uma pode **escrever** (seção 6); a leitura é igual para as três.

Fontes oficiais: repositório [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) (skills `figma-use`, `figma-generate-design`, `figma-generate-library`) e a documentação do servidor MCP em developers.figma.com/docs/figma-mcp-server. Se esta página e a oficial divergirem, vale a oficial, com uma exceção: onde esta página diz que algo foi **testado**, confirme com uma chamada curta antes de descartar.

## 1. Antes da primeira chamada

- **Servidor.** Use o servidor **remoto** `https://mcp.figma.com/mcp` (VS Code: `MCP: Add Server` → HTTP → URL acima → id `figma`). Só o remoto tem `get_libraries`, `search_design_system`, `whoami` e escrita no canvas. Confirme que as ferramentas aparecem no chat (por exemplo `#get_metadata`).
- **Acesso e limites.** Leitura exige seat **Dev ou Full** em plano Professional ou superior (Starter ou seat View/Collab: 6 chamadas por mês) e tem limite por minuto. Segundo o Figma, as ferramentas que **escrevem** não entram nesse limite; não assuma que um `use_figma` só de leitura também seja isento. Se uma chamada falhar por permissão ou limite, chame `whoami` antes de qualquer outra coisa e reporte plano e seat à pessoa.
- **Não existe conversa "vinculada" a um arquivo, nem seleção, nem o botão `+` de bibliotecas do Figma Agent.** Toda chamada leva o `fileKey` explícito e o `nodeId` do que será lido. O arquivo, a Section ou o frame vêm da pessoa **como link**; sem link com `node-id`, peça um.
- **"Biblioteca conectada"** (termo das skills e dos contratos) significa **biblioteca adicionada ao arquivo de trabalho**, visível em `get_libraries`.
- **Regras oficiais do `use_figma`, antes da primeira chamada dele.** A ferramenta exige que você carregue a skill `figma-use` (se estiver instalada no Copilot) ou, pelo próprio servidor, a ferramenta `get_figma_skill` com `skill://figma/figma-use/SKILL.md` e `skill://figma/figma-use/references/gotchas.md`. Para **ler**, basta isso. Para **escrever**, carregue também `figma-generate-design` (montar a partir de componentes de biblioteca) e, se for criar componentes, `figma-generate-library`. Passe em cada chamada `skillNames` com **todas** as skills carregadas, separadas por vírgula (com o prefixo `resource:` em cada uma quando vieram do servidor).
- **Ferramentas adiadas.** Se o cliente listar as ferramentas do Figma como "deferred", carregue todas de uma vez, em uma só chamada de busca de ferramentas.

## 2. Identificadores

| Vem da URL | Vira |
| --- | --- |
| `figma.com/design/<fileKey>/<nome>` | `fileKey` |
| `figma.com/design/<fileKey>/branch/<branchKey>/<nome>` | use o `branchKey` como `fileKey` |
| `?node-id=1-2` | `nodeId` = `1:2` (trocar `-` por `:`) |
| `figma.com/board/…`, `/slides/…`, `/make/…` | **não são arquivos de design**: várias ferramentas de leitura não funcionam nelas; peça o link `/design/` |

Um nó dentro de instância tem id composto (`I2:491;1:2639;68:4659`); serve para `get_metadata` e `use_figma`, mas **não** para `get_screenshot`, que só aceita id simples. Para ler uma **biblioteca**, use o `fileKey` do arquivo da própria biblioteca em `use_figma`: cada chamada pode mirar um arquivo diferente.

## 3. Qual ferramenta para qual pergunta

| Pergunta | Ferramenta | Observações |
| --- | --- | --- |
| Que páginas o arquivo tem? | `get_metadata` **sem** `nodeId` | Lista só as páginas. Com `nodeId` devolve o XML esparso (id, tipo, nome, posição, tamanho) de **uma** página ou nó |
| Como é a estrutura de um frame? | `get_metadata` com `nodeId` | Barato. Não traz properties, variáveis nem texto |
| Que aparência tem o frame? | `get_screenshot` (`fileKey`, `nodeId`, `maxDimension`) | Devolve uma URL curta e o comando `curl` para baixar o PNG; use `enableBase64Response` só se não puder baixar. Dentro de um script, `await no.screenshot()` devolve a imagem na própria resposta |
| Quais variáveis e estilos um nó usa? | `get_variable_defs` (`nodeId` obrigatório) | Nome → valor resolvido |
| Que bibliotecas o arquivo tem? | `get_libraries` (`fileKey`) | Devolve as **adicionadas ao arquivo** e as **disponíveis** (paginadas: repita com `offset` enquanto vier `…next_offset`). Traz o nome exibido (com `[v1]`/`[v2]`, se houver) e a `library key`. **Substitui o `+` do Figma Agent** |
| Existe componente, variável ou estilo publicado com este nome? Qual a chave? | `search_design_system` | `queries: [{entity, query}]`, um tema por query, sem sinônimos; `includeLibraryKeys` (vindo de `get_libraries`) restringe a bibliotecas. Devolve nome e chave sem precisar de um segundo arquivo. Resultado vazio **não** prova inexistência |
| Propriedades públicas, chaves, camadas ocultas, ligações de variável, modos, medidas exatas | `use_figma` (script de **leitura**) | É o que dá acesso à Plugin API. Ver seção 5 |
| Escrever no arquivo | `use_figma` | Só a Montagem, e só no destino autorizado. Ver seção 6 |
| Problema de acesso ou de limite | `whoami` | Plano e seat |

Não use nestas skills: `get_design_context` (feita para gerar código; exige carregar antes a skill `figma-design-to-code`), `generate_figma_design`, `download_assets`, `upload_assets`, os plugins generativos, os shaders, as ferramentas Weave e as de Code Connect.

## 4. Regras de `use_figma` que mais importam aqui

Resumo do que já derrubou chamadas; o detalhe completo está na skill `figma-use` oficial.

- O código é **JavaScript com `await` no topo e `return`**. Não embrulhe em função assíncrona. **Só o que for devolvido com `return` chega a você** (objetos são serializados). `console.log` não volta.
- Não funcionam: `figma.notify`, `getPluginData`/`setPluginData` (falham com "not supported in this host runtime"; use `getSharedPluginData`/`setSharedPluginData` com namespace de **3 ou mais caracteres**, ou devolva ids), `loadAllPagesAsync`, `createImageAsync`.
- O contexto volta à **primeira página** a cada chamada. Troque com `await figma.setCurrentPageAsync(page)` (a atribuição direta não funciona), no máximo **uma vez por chamada**; para várias páginas, uma chamada por página, todas na mesma mensagem.
- Não há estado entre chamadas: passe ids como literais. Devolva sempre os ids que você criou ou alterou.
- **Faça `await` em tudo.** Uma promessa esquecida vira falha silenciosa. Leituras independentes vão juntas em `Promise.all` (esperar uma a uma em laço é lento).
- **Texto exige fonte carregada** antes de qualquer alteração, e a regra vale para qualquer operação em nó com fonte não carregada (`setBoundVariable`, `appendChild`, `setExplicitVariableModeForCollection`). Carregue com `await figma.loadFontAsync({family, style})`, lendo o estilo de `getStyledTextSegments(['fontName'])` ou de `listAvailableFontsAsync()`; nunca adivinhe `"SemiBold"` × `"Semi Bold"`.
- Antes de ler uma propriedade específica de um tipo (`characters`, `description`, `componentPropertyDefinitions`), confirme o tipo do nó. **Nunca leia `componentPropertyDefinitions` de uma variante**: suba ao `COMPONENT_SET` pai. Uma **instância** não tem `componentPropertyDefinitions`: ela tem `componentProperties`.
- Com erro, siga o campo `safeToRetryWithoutCanvasRead` da resposta: `true` → corrija e repita; `false` → **leia o canvas** para ver o que mudou antes de tentar de novo. Se o mesmo erro se repetir, leia a definição do que você chama (`skill://figma/figma-use/references/plugin-api-standalone.index.md`, pelo `get_figma_skill`) em vez de contornar.
- Trabalho relacionado pode ir junto em um script, desde que seja seguro repetir. Devolva contagens, nomes e ids como evidência; uma captura após a composição basta (a última que passar é a final).

## 5. Receitas de leitura (valem para as três skills)

Somente leitura: não chame `create*`, `createInstance`, `set*`, `swapComponent`, `remove()`, `appendChild`, `insertChild`, `detachInstance` nem atribua propriedades. `figma.skipInvisibleInstanceChildren = false` **não** altera o arquivo e é necessário para enxergar camadas ocultas dentro de instâncias. `figma.importComponentByKeyAsync`, `importComponentSetByKeyAsync` e `figma.variables.importVariableByKeyAsync` **são permitidos** em auditoria (não adicionam nós ao canvas); não chame `createInstance()` depois.

**Uma chamada por frame, tudo de uma vez.** Todas as receitas abaixo funcionam em um único script; junte as que precisar e devolva um JSON compacto.

**Instâncias de um frame: origem, variante, visibilidade e properties** (as chaves reais dos componentes, iguais às que o Figma Agent lia):

```js
figma.skipInvisibleInstanceChildren = false;
const raiz = await figma.getNodeByIdAsync('ID_DO_FRAME');
const insts = raiz.findAllWithCriteria({ types: ['INSTANCE'] });
const mcs = await Promise.all(insts.map(n => n.getMainComponentAsync()));
return insts.map((n, i) => {
  const mc = mcs[i];
  const set = mc && mc.parent && mc.parent.type === 'COMPONENT_SET' ? mc.parent : null;
  return {
    id: n.id, nome: n.name, visivel: n.visible,
    comp: mc ? { nome: set ? set.name : mc.name, variante: set ? mc.name : null, key: set ? set.key : mc.key, remota: mc.remote } : null,
    props: Object.fromEntries(Object.entries(n.componentProperties).map(([k, v]) => [k, v.value]))
  };
});
```

Para uma visão só da origem, agrupe por `key` e conte as ocorrências. `remota: true` indica que o componente vem de uma biblioteca; o nome do arquivo de origem não vem daqui: cruze a `key` com `search_design_system` e `get_libraries`.

**Properties públicas de uma instância** (chave completa, tipo, valor, variável ligada) e instâncias expostas:

```js
figma.skipInvisibleInstanceChildren = false;
const raiz = await figma.getNodeByIdAsync('ID');
const inst = raiz.findAll(n => n.type === 'INSTANCE' && n.name === 'NOME_DA_INSTANCIA')[0];
return {
  props: Object.entries(inst.componentProperties).map(([k, v]) => ({ k, tipo: v.type, valor: v.value, variavel: v.boundVariables && v.boundVariables.value ? v.boundVariables.value.id : null })),
  expostas: inst.exposedInstances.map(i => i.name)
};
```

A **chave completa inclui o sufixo** (`Nome#67:20`); use exatamente a chave lida. Uma property também existe **no nível de cada instância aninhada**: releia em cada nível até o que contém o texto. Property no pai, no filho e "não encontrada" são resultados diferentes e devem ser registrados separadamente. As **definições** (`componentPropertyDefinitions`) só existem no `COMPONENT` ou `COMPONENT_SET` dono.

**Medidas de um nível de blocos** (para o gate de pixels e para a leitura de layout; um nível por chamada, para descer passe o id do filho):

```js
const raiz = await figma.getNodeByIdAsync('ID');
const f = n => ({
  id: n.id, nome: n.name, tipo: n.type, w: Math.round(n.width * 100) / 100, h: Math.round(n.height * 100) / 100,
  layoutMode: n.layoutMode, gap: n.itemSpacing, pad: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft],
  sizing: [n.layoutSizingHorizontal, n.layoutSizingVertical],
  ligado: Object.keys(n.boundVariables || {}),
  render: n.absoluteRenderBounds ? { w: n.absoluteRenderBounds.width, h: n.absoluteRenderBounds.height } : null
});
return raiz.children.map(f);
```

Outras leituras de layout, quando o contrato pedir: `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `layoutWrap`, `counterAxisSpacing`, `layoutPositioning`, `clipsContent`, `overflowDirection`, `strokesIncludedInLayout`, `cornerRadius` (e os quatro raios), `layoutGrids` e `absoluteBoundingBox`. `absoluteRenderBounds` é o limite **renderizado** (inclui sombra e borda).

**Caminho completo, nome único e ligação de visibilidade de cada camada** (para comparar com a tabela `camada | caminho` do contrato; o caminho do contrato começa **abaixo** da raiz da região):

```js
const raiz = await figma.getNodeByIdAsync('ID_DA_REGIAO');
const cam = n => { const p = []; for (let x = n; x && x.id !== raiz.id; x = x.parent) p.unshift(x.name); return p.join(' > '); };
return raiz.findAll(() => true).map(n => ({
  id: n.id, caminho: cam(n), tipo: n.type,
  unicoNoPai: n.parent ? n.parent.children.filter(c => c.name === n.name).length === 1 : true,
  visivel: n.visible, visivelLigadoA: n.boundVariables && n.boundVariables.visible ? n.boundVariables.visible.id : null
}));
```

**Mestre sem texto e sem BOOLEAN pública** (auditoria do Core):

```js
figma.skipInvisibleInstanceChildren = false;
const m = await figma.getNodeByIdAsync('ID_DO_COMPONENT');
const dono = m.type === 'COMPONENT' && m.parent && m.parent.type === 'COMPONENT_SET' ? m.parent : m;
return {
  textosNaoVazios: m.findAllWithCriteria({ types: ['TEXT'] }).filter(t => t.characters !== '').map(t => ({ id: t.id, nome: t.name, oculto: !t.visible, texto: t.characters })),
  definicoes: Object.entries(dono.componentPropertyDefinitions).map(([k, d]) => ({ k, tipo: d.type, padrao: d.defaultValue })),
  padroesDeTextoNasFilhas: m.findAllWithCriteria({ types: ['INSTANCE'] }).flatMap(i => Object.entries(i.componentProperties).filter(([, v]) => v.type === 'TEXT' && v.value !== '').map(([k, v]) => ({ instancia: i.id, k, valor: v.value })))
};
```

Reprove qualquer definição `BOOLEAN` que controle visibilidade. Ler `characters` não exige fonte carregada; só escrever exige.

**Vínculo vivo (sem `detach`)**: o nó no caminho do contrato tem de ser `INSTANCE` e o componente principal dele (`await n.getMainComponentAsync()`) tem de ter a chave do contrato (`set.key` se o pai for `COMPONENT_SET`, senão `mc.key`). Um frame no lugar da instância indica `detach`; não existe outra leitura direta disso.

**Variável a partir de um id**: `await figma.variables.getVariableByIdAsync(id)` dá `name`, `key`, `resolvedType`, `remote` e `valuesByMode`; a coleção sai de `await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId)` (nomes dos modes em `col.modes`). Modos escolhidos numa instância: `node.explicitVariableModes` (ids) e `node.resolvedVariableModes`.

**Variáveis publicadas por uma biblioteca** (existência, tipo, chave, modos): `getLocalVariableCollectionsAsync()` devolve **só as locais do arquivo**; coleção vazia **não** significa que o design system não tem variáveis. Para as bibliotecas, tente `figma.teamLibrary`: `await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` lista as coleções que o arquivo enxerga (`name`, `libraryName`, `key`) e `await figma.teamLibrary.getVariablesInLibraryCollectionAsync(colecao.key)` lista as variáveis (`name`, `resolvedType`, `key`). A documentação do Figma diz que `teamLibrary` não é implementado; **neste servidor funcionou em teste**, então tente e, se falhar, use: `get_variable_defs` (variáveis usadas por um nó), `search_design_system` com `entity: "variable"` ou `use_figma` no `fileKey` da própria biblioteca com `getLocalVariableCollectionsAsync()`. **"Publicada"** = `await figma.variables.importVariableByKeyAsync(key)` funciona a partir de um arquivo que use a biblioteca; sem esse arquivo, o item é `NAO_VERIFICAVEL`.

**Estilos**: `node.textStyleId` e `node.effectStyleId` → `await figma.getStyleByIdAsync(id)` (nome, chave). **Texto**: `getStyledTextSegments(['fontName','fontSize','lineHeight','letterSpacing'])`.

**Publicação e chave de um componente**: `comp.key` e `await comp.getPublishStatusAsync()` (`UNPUBLISHED`, `CURRENT` ou `CHANGED`). A chave só serve depois de publicada. Para obtê-la sem abrir outro arquivo, use `search_design_system` (`entity: "component"`, nome exato, `includeLibraryKeys` de `get_libraries`). Para **confirmá-la**, rode `use_figma` no `fileKey` de **outro arquivo que use a biblioteca** (peça o link à pessoa; confira com `get_libraries` nele) e chame `await figma.importComponentByKeyAsync(key)` (ou `importComponentSetByKeyAsync`), comparando o nome do componente importado.

**Conferir modes sem alterar o arquivo** (validação): leia as instâncias de prova que já estão em cada combinação (`node.explicitVariableModes`), o `visible` das camadas ligadas e os textos das properties; para uma combinação sem instância de prova, calcule o esperado com `valuesByMode` da variável em cada coleção (resolvendo alias com `getVariableByIdAsync`). Não troque mode nem property para "experimentar": isso é escrita.

**Busca por seletor (`query`)**: `node.query('INSTANCE[name="Navigation header"]')`. **Nome com espaço ou hífen exige aspas; sem elas a busca devolve 0 resultados, sem erro.** O tipo faz parte do seletor (`FRAME[name=x]` não acha uma `INSTANCE` de mesmo nome). Alternativa segura: `findAll(n => n.type === '…' && n.name === '…')`. Para listar componentes use `findAllWithCriteria({ types: [...] })`, muito mais rápido que `findAll` com predicado de tipo.

## 6. Receitas de escrita (somente a Montagem, somente no destino autorizado)

- **Comece de uma raiz nova.** Crie primeiro o componente ou o contêiner (`figma.createComponent()`, `figma.createAutoLayout('VERTICAL')`), devolva o id e monte **dentro dele** nas chamadas seguintes. Mover nós entre chamadas com `appendChild` falha em silêncio. Posicione nós de topo longe de (0,0) (à direita do que existe). Nunca duplique uma tela de referência para "limpar" depois.
- **Componentes de biblioteca**: `figma.importComponentByKeyAsync(key)` (ou `importComponentSetByKeyAsync`), depois `createInstance()`. Variáveis e estilos: `figma.variables.importVariableByKeyAsync(key)` e `figma.importStyleByKeyAsync(key)`. Importe tudo o que a seção precisa de uma vez, com `Promise.all`. **Se a importação falhar, a unidade está `BLOQUEADA` (IDS inacessível)**: não substitua por cópia local nem por instância sem origem.
- **Texto por property** (é como o pacote instala texto depois): `instancia.setProperties({ 'Chave#id': figma.variables.createVariableAlias(variavel) })` para ligar a variável, ou `{ 'Chave#id': 'valor' }` para valor literal, sempre com a chave lida na seção 5. Só use `characters` em texto que **nenhuma** property controla.
- **Tokens de layout**: `no.setBoundVariable('itemSpacing', v)`, `'paddingLeft'` (e demais lados), `'cornerRadius'`, com a variável importada por chave. Se o contêiner tem texto, carregue antes as fontes dos filhos. Cor: `figma.variables.setBoundVariableForPaint(paint, 'color', v)` **devolve um paint novo**; reatribua `node.fills`.
- **Visibilidade por mode**: `camada.setBoundVariable('visible', variavelBoolean)`; nunca uma property BOOLEAN pública. Se aparecer uma BOOLEAN pública no componente, remova com `componente.deleteComponentProperty(chave)` (chave lida de `componentPropertyDefinitions` do `COMPONENT` dono).
- **Modos**: `no.setExplicitVariableModeForCollection(colecao, modeId)`.
- **Slot** (área livre do produto): `componente.createSlot()`; o interior é do produto e não recebe ligações do chassi. Depois de criar slot ou property, releia `componentPropertyDefinitions` do `COMPONENT` dono (não de variante).
- **Fontes, escalas e cores** seguem `figma-use`: cores de 0 a 1, `{unit, value}` em `lineHeight`/`letterSpacing`, `layoutSizing = 'FILL'`/`'HUG'` só depois de `appendChild`, `resize()` antes de definir o sizing.
- **Componentes locais**: `description` só em `COMPONENT`/`COMPONENT_SET`. Nomes de camada únicos no pai (o plugin encontra por caminho).
- **Evidência na própria escrita**: cada script de escrita devolve, no `return`, os ids, as `boundVariables`, as medidas e as properties que gravou; isso conta como releitura estrutural. Uma captura (`await no.screenshot()` ou `get_screenshot`) após montar e outra após uma correção visual bastam.
- **Recibo**: o resultado de cada `use_figma` (ids, contagens, medidas) é a evidência; grave-o no recibo do repositório, não só na conversa.

## 7. O que o MCP não faz (a pessoa faz no Figma) e o que não consegue ler

- **Publicar uma biblioteca** (Core ou do produto) e **aceitar atualizações** de biblioteca em outro arquivo. Peça à pessoa e depois releia `getPublishStatusAsync()` e a chave. Peça também para **parar e avisar** quando uma prova depender disso.
- Esvaziar a Lixeira, apagar arquivos e **adicionar uma biblioteca a um arquivo** (Recursos → Bibliotecas). `get_libraries` mostra o que está ativo e o que está disponível.
- **Executar o plugin** do chassi (por exemplo o botão "Verificar biblioteca"): peça à pessoa que rode e cole o texto do relatório na conversa; sem relatório, o item é `NAO_VERIFICAVEL`.
- **Não são legíveis por MCP**: o painel de propriedades do designer ("o que aparece no painel"), as notas de publicação, a tela de atualização mostrada ao designer, a seleção atual, o protótipo e o histórico de versões. Esses itens só se comprovam por captura ou confirmação da pessoa e ficam `NAO_VERIFICAVEL` sem elas. A **API** (`componentProperties`, `exposedInstances`, `boundVariables`, `valuesByMode`, `explicitVariableModes`) é a evidência primária e não deve bloquear uma unidade por causa da leitura do painel.

## 8. Equivalências com o Figma Agent e estados de "não consegui ler"

| O que o Agent fazia | Como fazer por MCP |
| --- | --- |
| `+` conecta a biblioteca à conversa | `get_libraries` (ativa no arquivo?) + confirmar que o componente importa por chave |
| Ler properties e a hierarquia do IDS | `use_figma` de leitura (seção 5) |
| Ver o frame | `get_screenshot` |
| Medir | `use_figma` (receita de medidas) |
| Escrever no arquivo aberto | `use_figma` com o `fileKey` do destino, informado pela pessoa |
| "Não consigo ler isto" | Registre o limite com o estado da sua skill (abaixo), nunca complete por analogia |

`NAO_DISPONIVEL_NO_MCP` significa "depende de algo que o MCP não lê (ou de uma ação que só a pessoa faz)". Em cada skill ele aparece assim: **Análise**: classificação do achado. **Montagem**: estado `NAO_VERIFICAVEL` da capacidade, com o motivo `NAO_DISPONIVEL_NO_MCP`. **Validação**: critério `NAO_VERIFICAVEL`, com a camada responsável `NAO_DISPONIVEL_NO_MCP`.

## 9. Economia de chamadas

- Leia **um frame por script**, devolvendo um JSON compacto (nomes, chaves, properties, medidas, contagens), em vez de muitas chamadas pequenas. Vários frames independentes vão em chamadas paralelas **na mesma mensagem**.
- Com seat limitado (`whoami`), prefira `use_figma` de leitura e `no.screenshot()` a `get_metadata`, `get_screenshot` e `get_variable_defs`, e registre qual ferramenta cada leitura usou.
- `get_screenshot` com `maxDimension` padrão (1024) para conferir; aumente só para uma região específica.
- Guarde as medidas e as chaves lidas na análise no contrato e no recibo; a montagem e a validação **reusam** essas leituras em vez de reler a referência.
- Não repita uma leitura que nada invalidou. Releia depois de uma escrita **só** o que ela pode ter mudado.
