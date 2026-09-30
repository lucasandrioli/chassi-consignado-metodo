# Procedimento técnico detalhado de inspeção

## Procedimento técnico detalhado de inspeção

Este procedimento define a profundidade mínima de leitura. Aplique-o **a cada frame da tela**, não só a uma referência principal. O resultado é dividido entre contrato da etapa, capacidade Core e receitas dos produtos conforme as seções anteriores. Dados de texto e variables de conteúdo observados orientam a receita do produto; não entram no mestre Core. Uma propriedade observada numa referência não é, por si, uma propriedade disponível na versão IDS autorizada.

### 1.1 Matriz de inspecao obrigatoria

Esta matriz e o piso de profundidade da analise. Complete todas as linhas
aplicaveis antes de propor a montagem. Ela nao pede valores brutos no contrato:
pede que voce investigue o suficiente para tomar uma decisao de estrutura,
composicao ou variable.

Trate esse percurso como arqueologia da tela em producao: primeiro descreva o
que o designer realmente montou e como aquilo produz o resultado atual; depois
decida o que deve ser reorganizado para o alvo ou preservado no delta. Nao pule
a leitura da implementacao atual porque ela usa composicao manual ou biblioteca
externa. Esses elementos sao evidencia de comportamento e fidelidade, ainda
que nunca sejam candidatos autorizados de montagem em montagem de novo Core.

Em cada linha, registre internamente um destes resultados:

- `FATO_OBSERVADO`: o dado foi exposto e informa uma decisao;
- `NAO_SE_APLICA`: o tipo de elemento ou efeito nao existe naquela tela;
- `NAO_CONFIRMADO`: seria relevante, mas nao ficou visivel pelo MCP;
- `NAO_DISPONIVEL_NO_MCP`: depende de recurso que o MCP nao consegue
  examinar diretamente.

Nao avance para a proposta pulando uma linha aplicavel. Em
análise de delta, linhas fora do delta sao invariantes a registrar, nao
convite para ampliar a analise. Se uma linha bloquear uma decisao relevante,
leve o limite ao cartao da analise.

| Frente | Verifique obrigatoriamente | Transforme em decisao |
| --- | --- | --- |
| Hierarquia | raiz da tela, Sections e containers, ordem de filhos, visibilidade direta, conteudo oculto, grupos, mascaras e camadas sobrepostas | quais regioes viram estrutura semantica, quais grupos nao devem ser copiados e qual ordem a montagem preserva |
| Casca e fluxo | limites da tela, cabecalho, conteudo rolavel, rodape fixo, sobreposicao, recorte, scroll e elementos presos na tela | raiz, regioes, relacao pai-filho e unidade de montagem da casca |
| Auto layout | direcao, alinhamento principal e cruzado, padding por lado, gaps, HUG, FILL, FIXED, minimos e maximos, quebra, ordem invertida e itens absolutos | regra de layout-alvo, nunca coordenadas absolutas |
| Grade | grade visual de apoio, grade estrutural, colunas, linhas, tracks, gaps, spans, ancoras e fluxo automatico quando estiverem visiveis | usar grade estrutural, manter apenas guia visual ou nao usar grade |
| Geometria | proporcoes, dimensoes, raio, suavizacao de canto, bordas, alinhamento, renderizacao que ultrapassa a caixa e transformacoes visiveis | fidelidade visual que precisa ser preservada sem copiar matrizes ou paths |
| Superficie | fill solido, gradiente, imagem, video, emoji, pattern, opacidade, blend, borda, traco, sombra, blur, textura e ruido | fundamento iDS, asset autorizado, `LOCAL_LAYOUT` ou `[CONFIRMAR]` |
| Recorte e mascara | clipping de container, mascara entre irmaos, tipo de mascara, crop e filtros de imagem | limite estrutural que a montagem responsável deve reproduzir sem confundir os mecanismos |
| Texto | conteudo, papel, editabilidade, hierarquia, fonte, peso, tamanho, line-height, espacamento, cor, alinhamento, lista, link, decoracao, quebra e truncamento | texto editavel, estilo iDS, variable de conteudo, property publica ou excecao visual |
| Assets | papel de icone, ilustracao, imagem, video, pattern, emoji ou vetor; escala, crop e efeito visivel quando existirem | equivalente em biblioteca autorizada, asset autorizado, `LOCAL_LAYOUT` ou limite |
| Componente | papel, origem observada, set, configuracao publica, valores atuais, variante, boolean, texto, swap, tamanho, visibilidade, override exposto e cadeia de elementos aninhados relevante | `INSTANCIA_AUTORIZADA`, `VARIANT`, `BOOLEAN_PROPERTY`, `INSTANCE_SWAP`, `LOCAL_LAYOUT` ou impasse |
| Binding | property publica, valor da instancia, binding direto observado, style aplicado e relacao entre configuracao e resultado | `PROPERTY FIRST`, alvo de binding e risco que a montagem responsável deve checar |
| Variables | collections existentes, groups, modes, tipo, valores por mode, aliases, modes explicitamente aplicados e bindings nos blocos afetados | dona da diferenca, caminho de variable, politica e nivel de aplicacao do mode |
| Biblioteca | familias iDS conectadas, candidato encontrado, configuracao publica visivel, estilo, token, icone ou ilustracao equivalente | recurso autorizado ou evidencia de que sera necessario `LOCAL_LAYOUT` ou `[CONFIRMAR]` |
| Excecoes | efeito especial, transformacao composta, conteudo oculto, fonte ausente, asset sem equivalente, interacao ou prototipo indispensavel | secao condicional do contrato, preflight da montagem responsável ou `NAO_DISPONIVEL_NO_MCP` |

Para blocos repetidos, inspecione **cada ocorrencia individualmente**. Nao use
uma amostra como configuracao universal quando booleans, variants, textos ou
visibilidade diferirem entre as instancias. Se uma diferenca mudar conteudo,
configuracao, surface, comportamento visivel, valor de boolean, estado de
variante ou visibilidade de elemento aninhado, registre-a como ocorrencia
propria com seu valor especifico. Nunca conclua que todas sao iguais apenas
pela aparencia geral.

Quando instancias repetidas usarem o mesmo componente mas diferirem em
booleans, variantes ou visibilidade de elementos internos, documente
**cada instancia** com seu valor individual. Exemplo: se 6 itens usam o
mesmo componente mas apenas 1 tem `Has next item = false`, registre essa
diferenca explicitamente na instancia afetada, nao como regra geral do
bloco.

### 1.1.1 Regras de leitura para itens iDS com acao a direita

Para componentes iDS deste padrao (ex.: list items, linhas com suporte a
trailing action), a presenca ou ausencia de acao a direita e determinada pela
composicao de tres properties publicas, nao por uma propriedade isolada:

- **Item com acao**: `Show supporting item = true` + `Trailing item = Icon` +
  texto de acao aninhado nao vazio (ex.: "Editar", "Saber mais") — comprovam
  que o item possui acao a direita.
- **Item sem texto nem icone a direita**: `Show supporting item = false` +
  `Trailing item = None` — comprovam que o item nao possui trailing visivel.
- **Icone sem texto de apoio**: registre como terceiro caso quando a referencia
  mostrar um chevron sem legenda. Nao transforme o icone em acao textual nem
  remova o icone por `Show supporting item = false`. Confira se a versao IDS
  permite configurar `Trailing item = Icon` independentemente do texto; na
  biblioteca observada, `false` + `Icon` expressa esse estado (confirme na versão autorizada).
- **`Has next item` isoladamente NAO comprova acao** e nao governa a presenca
  ou ausencia de trailing action. Nao use essa property como evidencia de acao.

Para cada item, descer a cadeia aninhada ate o texto real da acao
(`Supporting item` e seus descendentes de texto), registrando o texto
exato (ex.: "Editar", "Saber mais") por ocorrencia individual. Nao
inferir o texto da acao a partir do contexto; leia diretamente do node.

Quando a referencia usar `Supporting item Type = Description`, manter
`Description` no contrato. Nunca substituir `Description` por `Tag` por
default, conveniencia ou inferencia — so alterar o tipo se houver evidencia
visual explicita ou pedido da pessoa.

O contrato deve produzir, para cada item relevante, uma **matriz por item**
contendo: papel, `Show supporting item`, `Trailing item`, texto da acao
(ou vazio), presenca de icone e evidencia observada. Essa matriz e obrigatoria sempre que o
bloco contiver itens com potencial de acao diferenciada.

### 1.2 Roteiro tecnico de profundidade

Use este roteiro como bastidor da matriz. Tente observar cada propriedade que
for aplicavel e que o MCP conseguir expor (use_figma de leitura). No contrato, converta a leitura
em consequencia para a montagem, nunca em despejo de nomes tecnicos, valores
brutos ou identificadores.

#### A. Identidade, arvore, dimensoes renderizadas e estado global de cada elemento

Para todo elemento relevante, descubra:

- tipo de elemento, nome apenas como pista, visibilidade, rotacao e ordem
  entre irmaos;
- pai, filhos diretos, profundidade e caminho semantico;
- dimensao da caixa do elemento e dimensao que ele realmente ocupa quando
  sombra, borda ou efeito extrapolam seus limites;
- **dimensoes renderizadas (width x height)** do elemento na tela de
  producao — registre-as como referencia de fidelidade para que a montagem responsável
  possa comparar o resultado da proposta com o original. Quando a proposta
  diferir da referencia em altura ou largura, a causa deve ser investigada
  (ex.: container interno com sizing errado, texto quebrando, padding
  diferente);
- variaveis vinculadas, collection e mode explicitamente aplicado, quando o
  o MCP os expuser;
- relacao entre uma propriedade de camada e uma property publica de
  componente, quando for visivel.

Use estes fatos para definir papel, ordem, condicao e alvo de binding. Nao
leve identificador interno, dados privados de extensao, metadados de plugin ou
dados compartilhados de extensao para o contrato, exceto os identificadores
necessarios para tornar inequivoco um `ALVO_LOCAL_AUTORIZADO` no contrato
delta. Eles nao ajudam a montagem responsável a recriar a tela e nao sao fonte de regra.

#### B. Containers, Sections, Frames, Groups e transformacoes

Quando a referencia usar containers, investigue os pontos abaixo antes de
decidir sua estrutura-alvo.

| Elemento ou condicao | Verifique em profundidade | Decisao que isso informa |
| --- | --- | --- |
| Documento, pagina e Section | limites do recorte, filhos de topo, cor de canvas apenas se afeta a tela, conteudo de Section oculto e ordem das superficies | qual e a referencia valida e se a leitura visual ficou pendente |
| Frame de tela ou container | filhos, clipping, overflow, scroll, aspecto alvo, limites minimos e maximos, fundo, bordas, raio por canto, suavizacao, opacidade e blend | casca da tela, conteudo rolavel, rodape fixo, container local ou fundamento iDS |
| Group | filhos e resultado visual que ele agrupa | manter apenas se a relacao visual exigir; nunca copiar Group automaticamente |
| Transform group ou camada transformada | escala, rotacao, espelhamento, perspectiva ou composicao visual alterada | preservar o resultado visual; preferir estrutura comum se ela o reproduzir |
| Elemento bloqueado ou marcado para desenvolvimento | apenas como alerta de leitura | nunca usar bloqueio, anotacao ou status como estrategia de montagem |

Se a tela usar Section com conteudo oculto, marque sua superficie como
`FATO_OBSERVADO` estrutural e `NAO_CONFIRMADO` visual. Nao use a ausencia de
renderizacao como prova de ausencia de bloco.

#### C. Auto layout, sizing, posicionamento e grid

Para cada container que organiza filhos, verifique todos os pontos aplicaveis:

| Grupo de propriedades | O que observar | Como orientar a montagem responsável |
| --- | --- | --- |
| Direcao e sizing | `NONE`, horizontal, vertical ou grid; tamanho fixo, hug ou fill em cada eixo; minimos, maximos e proporcao bloqueada | declarar algoritmo de layout e comportamento responsivo, sem copiar coordenadas |
| Alinhamento | alinhamento no eixo principal e cruzado, baseline, distribuicao entre itens e alinhamento de tracks quebrados | preservar distribuicao e alinhamento que alteram a leitura do bloco |
| Espacamento | padding por lado, gap entre itens, gap entre linhas quebradas e espacamento negativo quando houver | usar padding e gap como regras da composicao, nao como ajuste visual solto |
| Quebra e ordem | wrap, inversao de empilhamento, ordem de leitura e z-order em auto layout | manter a ordem visual e a sobreposicao correta em estados menores |
| Filho dentro do container | stretch, grow/fill, alinhamento individual, constraints e posicionamento automatico ou absoluto | definir o que deve acompanhar o container e o que realmente precisa ficar absoluto |
| **Containers internos de componente** | `layoutSizingHorizontal` e `layoutSizingVertical` de containers intermediarios dentro de instancias (ex.: `.Description box` dentro de `Supporting item`) — comparar FILL vs FIXED entre referencia e proposta | quando um container interno esta FIXED em vez de FILL, o conteudo de texto pode quebrar e aumentar a altura do item. Documentar o sizing correto observado na referencia para cada container interno relevante |
| **Espacamento de componentes reutilizados** | quando um componente candidato for identificado para reutilizacao, comparar os valores default de padding, gap e `itemSpacing` da instancia com os valores do bloco correspondente na referencia. Diferenca de espacamento altera dimensoes renderizadas sem que haja erro visivel na arvore | se os valores diferirem, o contrato deve documentar os overrides esperados (ex.: padding de 24px em vez do default 16px, gap de 16px em vez de 8px). Nao confiar que o default do componente reproduz o espacamento da referencia |
| Grid estrutural | quantidade e tamanho de colunas e linhas, gaps, tracks, fluxo manual ou automatico, spans, ancoras e alinhamento individual | usar grid somente quando estas regras forem observadas; nao confundir com guia visual |
| Grid visual | colunas, linhas, margem, gutter, alinhamento e offset que aparecem como guia | usar apenas como referencia de espacamento, salvo evidencia de grid estrutural |
| Stroke no layout | se a borda entra ou nao no calculo de tamanho | evitar divergencia de largura, padding ou overflow no alvo |

Quando um componente candidato a reutilizacao for identificado, nao assuma que
seus valores default de padding, gap e `itemSpacing` coincidem com a
referencia. Compare explicitamente cada propriedade de espacamento e, se
houver divergencia, registre os overrides necessarios no contrato para que o
Montador os aplique na instancia.

Quando o MCP nao expuser uma configuracao de grid ou quebra que seja
necessaria para explicar a referencia, registre `NAO_CONFIRMADO`. Nao tente
deduzir tracks, spans ou ancoras somente por posicao visual.

#### D. Geometria, bordas, vetores e formas

Investigue:

- caixa geometrica versus limite renderizado por sombra, borda ou efeito;
- raio unico ou raio individual por canto, suavizacao de cantos e proporcao
  obrigatoria;
- peso, alinhamento, dashes, cap, join, miter e pesos por lado de bordas;
- arcos, formas geometricas, operacoes booleanas, paths e vetores somente
  quando alterarem o papel visual;
- quando sombra, stroke ou blur fizer o bloco parecer maior que sua caixa,
  registre os dois limites e o efeito.

Nao lance path data, matrizes de transformacao, IDs de vetores ou dados brutos
de curvas ao contrato. A montagem responsável precisa conhecer o resultado visual, nao a
representacao numerica.

#### E. Superficies, fills, strokes, efeitos e fundamentos visuais

Para cada fill, stroke ou efeito relevante:

- tipo, cor, opacidade, blend, gradiente (stops, posicoes, direcao, angulo),
  pattern (escala, tile, offset, rotacao), imagem (crop, scale mode, filtro);
- sombra, blur, textura, ruido e efeitos compostos;
- style ou token iDS aplicado, ou fill nao coberto pelo sistema;
- stroke: peso, alinhamento, cap, join, dashes, padding interno e se o stroke
  entra no calculo de tamanho do auto layout;
- quando mais de um fill ou stroke existir na mesma camada, registre a
  composicao.

Quando o fundamento visual vier de asset externo (imagem, padrao ou textura),
registre o papel visual e a estrategia autorizada, nunca o asset em si.

#### F. Texto, tipografia e conteudo excepcional

Para cada texto relevante, registre:

- conteudo, hierarquia, editabilidade, papel funcional e segmentacao visual;
- familia, peso, tamanho, line-height, letter-spacing, alinhamento e cor;
- binding, property publica, style iDS ou valor hardcoded;
- decoracao (underline, strikethrough, superscript, list markers, links);
- quebra, truncamento, max-lines e area visivel versus area de conteudo;
- conteudo misto (trechos com peso, cor ou tamanho diferentes dentro do
  mesmo text node), com descricao do padrao;
- fonte ausente: quando uma fonte nao estiver carregada, registre a
  discrepancia e marque como `NAO_CONFIRMADO`;
- texto excepcional: texto em caminho, emoji como elemento, texto gerado por
  conteudo dinamico com formatacao condicional, listas complexas ou link
  visual que nao e hyperlink.

Nao invente familia ou peso por semelhanca visual. Se o MCP nao expuser o
nome da fonte, registre `NAO_CONFIRMADO` e siga com a informacao disponivel.

#### G. Assets, icones, ilustracoes e imagens

Para cada asset relevante:

- papel visual, tipo (icone, ilustracao, imagem, video, emoji, pattern, vetor),
  escala, crop e relacao com o bloco;
- origem observada e equivalente autorizado nas bibliotecas conectadas;
- quando o asset vier de biblioteca externa, registrar o papel visual e o
  equivalente autorizado, nunca o asset externo;
- composicao visual quando o asset interagir com outros elementos (mascara,
  overlay, blend, filtro).

#### H. Componentes, properties publicas e cadeia aninhada

Para cada componente relevante, registre:

- papel, nome apenas como pista, set ou component standalone;
- properties publicas (TEXT, BOOLEAN, VARIANT, INSTANCE_SWAP) e valores atuais;
- overrides aplicados na instancia;
- cadeia de elementos aninhados relevante: ate que nivel o componente expoe
  controles publicos para seus filhos?
- elementos internos que sao instancias de outros componentes: para cada um,
  registre o papel, o equivalente autorizado nas bibliotecas conectadas e o
  controle publico que conecta o pai ao elemento. Se o pai nao expuser controle,
  registre `LIMITE` e indique o nivel onde a property esta disponivel;
- binding a aplicar em cada property publica controlavel.

Para componentes compostos, descreva a cadeia ate nivel 3 quando ela mudar o
resultado da montagem. Nao descreva todos os subnos: foque nos que precisam
de configuracao, troca ou binding. Nunca proponha configurar uma property que
nao apareceu como publica.

#### I. Variables, modes e bindings observados

Para cada variable, mode ou binding visivel:

- collection, group, modo explicito e tipo;
- valores por mode quando expostos;
- binding no elemento (property publica, fill, texto, visibilidade, tamanho);
- relacao entre a variable, a collection e o papel do bloco;
- alias, scope e origem quando existirem.

Nao extrapole regras de negocio a partir de valores de variable. Nao assuma
que um valor igual em todos os modes significa que a variable e desnecessaria.

#### J. Biblioteca, estilos e tokens

Para cada estilo, token ou componente vindo de biblioteca conectada:

- nome exibido, familia, papel visual e aplicacao na tela;
- se cobre o papel necessario ou se sera necessario `LOCAL_LAYOUT` ou
  `[CONFIRMAR]`;
- equivalente autorizado quando a referencia usar recurso de biblioteca
  externa.
