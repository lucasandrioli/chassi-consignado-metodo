# Auditoria técnica detalhada

## Auditoria técnica detalhada

Faça a conferência por ocorrência e por propriedade. Em `CORE`, compare a **capacidade** do mestre com referências e cenários montados em instâncias de prova; o mestre não carrega os textos da referência. Em `PRODUTO`, compare também cópia, values, modes e bindings da receita específica. Um recibo que diz “testado” só conta quando identifica o cenário, o alvo e a evidência que pode ser relida; um teste temporário não preservado fica `NAO_VERIFICAVEL`.


## Cola literal entre contrato, recibo e canvas

Audite cada elo abaixo. A validacao deve conseguir apontar qual fonte divergiu
e por que.

| Contrato do Analista | Recibo do Montador | Evidencia no canvas | Criterio |
| --- | --- | --- | --- |
| Cobertura declarada e matriz de impacto | cenarios conferidos e collections sem variable | blocos e variacoes visiveis no cenario selecionado | nenhuma dimensao dona foi trocada ou combinada indevidamente |
| Fatos, propostas e limites | unidades concluidas e limites | resultado visual e estrutural observavel | limite nao foi ocultado nem tratado como fato |
| Blueprint semantico | estrutura e recursos | frame raiz, regioes, ordem e relacao entre blocos | proposta segue a arquitetura-alvo, nao a arvore artesanal |
| Decisoes de composicao | estrategia aplicada | instancia, variante, boolean, troca, layout local ou componente local | cada bloco usa somente a estrategia aprovada |
| Equivalentes autorizados | recurso autorizado ou local | biblioteca, asset, style e componente usados | nenhum recurso externo entrou na proposta |
| Plano de variables | variables e bindings | collection, mode, alvo e binding visiveis quando expostos | valor controlavel nao ficou local sem excecao aprovada |
| Plano de acao | unidades concluidas | resultado parcial e dependencia final | nenhuma unidade foi declarada pronta sem sua prova |
| Cenarios de prova | cenarios conferidos | estado atualmente visivel ou prova apresentada no recibo | nao aprovar cenario que nao possa ser conferido |
| Impasses e regras | equivalencia e limites | ausencia de atalho proibido | limite foi respeitado e encaminhado corretamente |


## Estrategias de composicao contratadas

O campo `Estrategia` do contrato e o campo `Estrategia aplicada` do recibo
devem usar literalmente uma das etiquetas abaixo. Elas descrevem a decisao
aprovada, nao uma nova permissao para o Validador escolher como a tela deveria
ter sido montada.

| Estrategia | O que deve ser conferido |
| --- | --- |
| `INSTANCIA_AUTORIZADA` | instancia iDS autorizada com configuracao publica suficiente para cumprir o papel declarado |
| `VARIANT` | estado mutuamente exclusivo confirmado no componente, sem uso para representar texto, cor isolada ou regra de tela |
| `BOOLEAN_PROPERTY` | property publica que controla uma propriedade concreta, nunca existencia de tela, etapa ou regra de jornada |
| `INSTANCE_SWAP` | troca de elemento aninhado pelo controle publico comprovado do componente-pai, preservando o mesmo papel estrutural |
| `LOCAL_LAYOUT` | composicao local prevista no blueprint, sem copiar a arvore artesanal ou inserir filhos em instancia |
| `CANDIDATO_COMPONENTE_LOCAL` | componente local aprovado, com as duas reutilizacoes concretas declaradas no contrato |
| `REGIAO_DO_CORE` | instancia (sem detach) do componente da regiao publicado no kit, presente somente nos produtos que o contrato lista |

Se o contrato ou recibo usar uma estrategia fora dessa lista, ou usar o mesmo
nome com significado diferente, encaminhe para `ANALISE_CONTRATO`. Se a
estrategia valida do contrato foi aplicada de outro modo na proposta,
encaminhe para `MONTAGEM_CORE`.


## 1. Fidelidade da experiencia de producao

Compare referencia e proposta por papel e resultado percebido, nao pela mesma
arvore de layers. Para cada bloco relevante, confira quando aplicavel:

| Frente | O que comparar | Divergencia |
| --- | --- | --- |
| Conteudo e ordem | textos, hierarquia de leitura, rotulos, dados, ordem percebida e enfase | `MONTAGEM_CORE` quando o contrato e claro; `ANALISE_CONTRATO` quando ele for insuficiente |
| Casca | viewport, cabecalho, conteudo rolavel, acoes fixas, sobreposicoes, recorte e overflow | diferenca visivel que mude uso ou leitura |
| Layout | direcao, alinhamento, padding, gap, sizing, quebra, ordem, grid ou item absoluto previstos | regra do blueprint ausente ou resultado desorganizado |
| **Dimensoes renderizadas** | comparar width x height de cada bloco da proposta com os valores documentados no contrato. Divergencia de altura pode indicar container interno com sizing errado (FIXED em vez de FILL), texto quebrando, ou padding diferente | `MONTAGEM_CORE` quando a causa for sizing ou configuracao; `ANALISE_CONTRATO` quando o contrato nao documentou a dimensao |
| **Containers internos** | verificar `layoutSizingHorizontal/Vertical` de containers intermediarios dentro de instancias (ex.: `.Description box` dentro de `Supporting item`). FIXED em vez de FILL causa quebra de texto e altura incorreta | `MONTAGEM_CORE` — o Montador deve corrigir o sizing do container interno |
| **Espacamento de componentes reutilizados** | comparar padding, gap e `itemSpacing` de cada instancia de componente reutilizado na proposta com os valores do bloco correspondente na referencia. Valores default do componente podem diferir da referencia, causando divergencia de dimensoes renderizadas sem erro estrutural aparente | `MONTAGEM_CORE` quando o contrato documentou os overrides esperados e eles nao foram aplicados; `ANALISE_CONTRATO` quando o contrato nao documentou a diferenca de espacamento |
| Geometria | proporcao, dimensao, raio, borda, alinhamento e limite renderizado por efeito | diferenca perceptivel que altere a tela |
| Superficie | fill, opacidade, blend, gradiente, imagem, crop, filtro, sombra, blur, textura ou ruido contratados | efeito perdido, recurso externo ou fundamento diferente sem autorizacao |
| Texto | estilo, quebra, truncamento, lista, link, decoracao, trecho especial e fonte que afetem entendimento | leitura alterada ou excecao apagada |
| Assets | icone, ilustracao, imagem, video, pattern, emoji ou vetor pelo papel visual | asset incorreto, ausente ou externo |

Nao reprove por diferenca interna que deixa a experiencia aprovada e foi uma
diferenca estrutural intencional do contrato. Nao aprove resultado visual que
parece semelhante se ele perdeu conteudo, estado ou comportamento visivel.

**Instancias repetidas:** quando o contrato documentar que instancias do
mesmo componente diferem em booleans, variantes ou visibilidade (ex.: apenas
o ultimo item com `Has next item = false`), verificar **cada instancia
individualmente**. Nao assumir que todas estao corretas porque uma esta.
Comparar os valores especificos de cada instancia com o que o contrato
determinou para ela.

**Blocos repetidos — comparacao individual obrigatoria:** em qualquer sequencia
de blocos ou itens repetidos do mesmo tipo de componente, comparar cada
ocorrencia separadamente contra a referencia correspondente. Nunca usar uma
amostra universal — quando booleans, variants, textos ou visibilidade diferirem
entre ocorrencias, cada uma deve ser verificada e aprovada ou reprovada de
forma independente.

**Acao a direita de item iDS — composicao, nao botao separado:** no recorte `CORE`, verifique a capacidade e a configuração em instância de prova; o texto do mestre deve continuar vazio. No recorte `PRODUTO`, confira o texto real da receita. A acao
exibida a direita de um item de lista iDS (ex.: "Editar", "Saber mais") e
parte da composicao interna do proprio componente iDS, nunca um botao ou
elemento independente adicionado fora do item. Validar por descida na arvore
do componente:

- `Show supporting item = true` + `Trailing item = Icon` + texto aninhado nao
  vazio (ex.: "Editar", "Saber mais") comprovam que a acao esta presente e
  corretamente configurada naquela ocorrencia.
- `Show supporting item = false` + `Trailing item = None` comprovam ausencia
  de acao naquela ocorrencia.
- `Has next item` isoladamente **nao comprova nem governa** a presenca ou
  ausencia de acao — nao usar esse campo como criterio de acao.

Para cada ocorrencia de item com acao declarada no contrato, descer ate o
`Supporting item` e seus descendentes, localizar o texto real (ex.: "Editar",
"Saber mais") e validar o valor por ocorrencia. Reprovar explicitamente:
tag inventada, acao ausente onde deveria existir, acao presente onde nao
existe, texto errado no supporting item, `Supporting item` ou `Trailing item`
inconsistentes com a referencia, e uniformizacao indevida entre ocorrencias
que deveriam diferir.

**Supporting item Type — preservar o tipo da referencia:** se a referencia
usar `Supporting item Type = Description`, a proposta deve manter `Description`
para aquela ocorrencia. Nunca alterar para `Tag` por conveniencia, valor
default ou inferencia. Reprovar explicitamente qualquer troca de tipo de
Supporting item nao autorizada pelo contrato.


## 3. Bibliotecas, componentes e configuracao publica

Para cada bloco em `Estrutura e recursos` do recibo, compare o contrato, o
recurso declarado e o canvas:

| Verificacao | Resultado esperado |
| --- | --- |
| Origem | componente, style, token ou asset pertence a familia autorizada conectada, ou e `LOCAL_LAYOUT` aprovado |
| Papel | candidato reproduz o papel funcional e visual indicado no contrato |
| Property publica | texto, boolean, variante, troca, tamanho, visibilidade, imagem ou layout usados sao os que o contrato confirmou |
| Cadeia aninhada | icone, ilustracao, selo, texto ou outro elemento interno so muda pelo controle publico do pai documentado |
| **Instancias aninhadas nivel 2+** | o designer nunca acessa a instancia filha; o instalador do produto acessa somente por caminho nomeado declarado no pacote (property TEXT publica da instancia nomeada; `visible` de camada do Core por variavel). Camada interna de peca IDS nao entra. SLOT so quando o contrato o exigir |
| Recurso externo | nenhum componente, asset, style ou token externo permanece na proposta |

Quando a configuracao publica nao estiver exposta pelo MCP, use o recibo
como trilha, mas marque o criterio `NAO_VERIFICAVEL`. Nao tente abrir ou
alterar a estrutura interna de uma instancia para deduzir a resposta.

Para uma cadeia aninhada, compare somente o que o contrato registrou: papel
do elemento interno, recurso autorizado correspondente e controle publico que
liga pai e elemento. Nao exija que a arvore interna do iDS seja igual a da
referencia externa.

**Contrato publico para instancias aninhadas:**
Quando um conteudo ou visibilidade variavel nao estiver exposto pelo
componente-pai, o Validador deve:
1. Reprovar `characters`, binding em texto interno de peca IDS e qualquer
   acesso do **designer** a instancia aninhada ou sublayer.
2. Aceitar o acesso do **instalador** somente pelos caminhos e chaves do
   contrato (nome unico no pai; property TEXT publica da instancia nomeada;
   `visible` ligado a variavel do produto, sem BOOLEAN publica).
3. Se a API publica nao puder ser lida pelo MCP, marcar `NAO_VERIFICAVEL`,
   sem aprovar por aparencia visual sozinha.

**Verificacao de Supporting item e acao por ocorrencia:**
Para cada item de lista que o contrato declare com acao (ex.: "Editar",
"Saber mais"), descer na arvore do componente ate o `Supporting item` e seus
descendentes e ler o texto real. Verificar por ocorrencia:
- `Show supporting item`, `Trailing item` e o texto aninhado conferem com a
  referencia para aquela ocorrencia especifica.
- `Supporting item Type` corresponde ao tipo declarado na referencia (ex.:
  `Description` permanece `Description`; nunca inferir `Tag` como substituto).
- Reprovar explicitamente: tag inventada, acao ausente, acao presente onde nao
  existe, texto errado, `Supporting item`/`Trailing item` inconsistentes com a
  referencia, uniformizacao indevida entre ocorrencias que deveriam diferir, e
  troca de Type nao autorizada pelo contrato.


## Chave publicada do Core

A chave que o pacote usa vem da tabela `Chave publicada do Core` do contrato da tela. Confira, sem alterar nada: (1) a chave do contrato é a `component.key` lida no arquivo do Core para o componente indicado; (2) a importação por essa chave, a partir de um arquivo consumidor, devolve o componente esperado (mesmo nome); (3) o pacote gerado tem essa mesma chave em cada tela. Chave divergente, importação que falha ou componente de nome diferente reprova `PRODUTO_PACOTE`; sem acesso para importar, o item é `NAO_VERIFICAVEL`. Se o componente foi recriado, a chave mudou: é versão maior do chassi.
