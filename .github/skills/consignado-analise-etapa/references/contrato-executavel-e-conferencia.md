# Contrato executável (receita de composição)

## Contrato executável (receita de composição)

O contrato precisa poder ser executado sem interpretação. A receita de composição (item 3 acima) termina em tabelas que o Montador, o gerador de pacote e o Validador consomem. Além do dossiê de rastreabilidade, ela contém, **nesta ordem**:

1. **Escopo e versão:** tela, `chassi vN`, estado (`proposta`), dependência da versão do contrato da etapa e do kit de regiões.
2. **Decisões de composição:** uma linha por bloco, com **uma única estratégia** (`INSTANCIA_AUTORIZADA`, `VARIANT`, `BOOLEAN_PROPERTY`, `INSTANCE_SWAP`, `LOCAL_LAYOUT`, `CANDIDATO_COMPONENTE_LOCAL`, `REGIAO_DO_CORE`). `REGIAO_DO_CORE` significa "instância do componente publicado no kit". Não proponha duas estratégias para o mesmo bloco.

   | Bloco | Papel na tela | Estratégia | Componente ou recurso autorizado | Produtos que usam |
   | --- | --- | --- | --- | --- |

3. **Ordem e layout por bloco:** direção do auto layout, alinhamento, padding **por lado**, gap, sizing (HUG/FILL/FIXED) e min/max, **com as dimensões renderizadas de cada bloco na referência** (largura × altura) para o Montador comparar bloco a bloco; a altura total da tela é consequência do auto layout e não é requisito. Cada espaçamento aponta para o **token** correspondente (tabela abaixo); nunca reproduza frame spacer. Espaço entre blocos e padding de bloco que variam por produto apontam para a **variável do chassi do próprio produto** (coleção de layout do Core dedicada àquele produto, um mode só), não para número, e o contrato de um produto nunca cita a coleção de outro; espaçamento interno de região aponta para token IDS. Mecanismo a provar na montagem: gap ligado a variável de biblioteca importada (coleção do próprio produto, sem mode a escolher).

   | Bloco | Direção | Padding T/R/B/L (token) | Gap (token) | Sizing H/V | Dimensão da referência | Diferença por produto |
   | --- | --- | --- | --- | --- | --- | --- |

4. **Itens da lista:** para cada lista de itens, a **quantidade**, a **ordem** e o **máximo declarado**, por produto e por cenário; e a **matriz por item** (uma linha por ocorrência):

   | Item (ocorrência) | Papel | Show leading item | Show supporting item | Supporting item Type | Trailing item | Texto da ação | Has next item | Fixo ou por mode | Evidência |
   | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

   `Fixo` significa property gravada na composição sem variável. **`Trailing item` é sempre fixo**: ligado a variável, ele bloqueia a escrita de textos aninhados do item (fato verificado no Figma). Registre `Show leading item = false` quando a referência não tiver leading item, mesmo que o padrão do IDS seja `true`. `Has next item` sozinho não prova ação.
5. **Camadas ligadas a variável de visibilidade:** caminho completo a partir da raiz da região, tipo de nó, modes/regra que a governam. Sem BOOLEAN pública.

   | Região | Caminho completo | Governada por (eixo/mode/regra) | Padrão | Produtos |
   | --- | --- | --- | --- | --- |

6. **Acesso a texto:** instância nomeada (caminho), property TEXT pública e a **chave real lida** (com o sufixo `#id` que o Figma mostra), por região. Destino de texto que hoje não tem caminho (por exemplo, o texto do aviso de combinação inválida) entra como `LIMITE` com a proposta.

   | Região | Instância (caminho) | Property (chave real) | Tipo | Onde a cópia de cada produto mora |
   | --- | --- | --- | --- | --- |

7. **Plano de variáveis:** por eixo (`OPERAÇÃO`, `CONTEXTO`, `PRODUTOS ADICIONAIS`), tipo, modes e valores, alvo semântico, mecanismo (`setProperties` + `VariableAlias` para TEXT de componente; `setBoundVariable` para visibilidade, fill ou tamanho) e política (`CRIAR_VARIABLE_E_VINCULAR`, `CRIAR_MODE`, `VINCULAR_EXISTENTE`, `SEM_VARIABLE_DE_TELA`). Registre o **limite de modes por coleção** conhecido (o plano do Figma limita; um produto pode chegar a muitos modes em uma coleção) e a coleção que não influencia a tela.
8. **Plano de ação:** unidades ordenadas, cada uma com resultado, blocos, estratégia, recursos, dependência, **prova de término** e limite.

   | Ordem | Resultado parcial verificável | Blocos | Estratégia | Recursos autorizados | Dependência | Prova de término | Limite |
   | --- | --- | --- | --- | --- | --- | --- | --- |

9. **Cenários de prova:** por produto, um cenário por frame observado que represente menor densidade, maior densidade e cada estrutura especial, com **frame de origem, modes, itens por área e altura esperada da referência**. Nenhum cenário combina blocos de frames incompatíveis.

   | Cenário | Produto | Modes (Operação/Contexto/Adicionais) | Frame de origem | Regiões e itens | Altura total (só alarme) | Resultado esperado |
   | --- | --- | --- | --- | --- | --- | --- |

10. **Impasses e regras para o Montador:** lista curta e literal. Inclua sempre: não editar interior de peça IDS; texto só por property pública; região sem detach; camada que o produto não usa não entra; `Trailing item` fixo; prova com **texto literal da referência** (nunca "sintético"); dimensões renderizadas iguais às da referência salvo diferença declarada e medida.

### Regras gerais de decisão: do padrão observado à estratégia

Estas regras valem para qualquer tela, etapa e produto. Para cada bloco ou camada observado nos frames, classifique pelo **padrão de presença e de variação** (contado por produto, frame a frame), não pelo nome da camada. Registre no contrato a linha da tabela que se aplicou e a evidência (frames).

| Padrão observado | Classificação | Estratégia e regra |
| --- | --- | --- |
| Bloco **presente em todos os frames de alguns produtos e ausente em todos os de outros** | Região opcional por produto | `REGIAO_DO_CORE`, presente na composição só dos produtos que a têm. Nunca oculta, nunca slot vazio no produto que não a tem |
| Bloco presente em todos os produtos, com **conteúdo** diferente por produto ou eixo | Estrutura comum, conteúdo do produto | Parte comum na receita; texto por property TEXT pública da instância nomeada, valor por mode do eixo que o isola |
| Bloco ou camada que **aparece e some conforme um eixo** dentro de um mesmo produto | Presença governada por eixo | Camada ligável por caminho completo (nome único no pai) com `visible` ligado a variável do eixo; sem BOOLEAN pública |
| **Lista de itens do mesmo tipo com quantidade variável** | Lista dinâmica | Itens criados pela receita, quantidade e ordem por produto e cenário. O **máximo** é decisão da pessoa: proponha a partir do maior caso observado e marque `[CONFIRMAR]`; a maior contagem observada não é o máximo permitido |
| Item de lista com **ação à direita, texto de apoio ou ícone que difere por ocorrência** | Configuração por item | Matriz por item (uma linha por ocorrência); nunca configuração em lote; `Trailing item` fixo |
| Propriedade do IDS cujo **padrão da biblioteca difere do que a referência mostra** (por exemplo elemento à esquerda que a referência não usa) | Valor explícito | Declare o valor por ocorrência no contrato, mesmo que o padrão do IDS já pareça correto |
| **Composição repetida** (duas ou mais ocorrências com a mesma estrutura) que o IDS não oferece | Candidato a componente local | `CANDIDATO_COMPONENTE_LOCAL`: duas reutilizações concretas declaradas, feito só de peças do IDS, aprovado pela pessoa, dentro de uma região. Se a peça deveria existir no IDS, registre pedido ao dono do IDS em vez de criar |
| **Conteúdo interno decidido pelo produto**: a estrutura interna da região difere entre produtos de um jeito que os modes não explicam, **ou** a pessoa declara que o produto criará esse conteúdo | Região com slot de conteúdo do produto | Contêiner do chassi (componente local dentro da região) com um `SLOT` nomeado por papel e posição. O chassi contrata só o contêiner: espaçamento, posição, limites e presença da região por mode. O conteúdo do slot e as variáveis dele são do produto. Ver "Região com slot de conteúdo do produto" |
| Estrutura repetida **com estados** (aberto e fechado, por exemplo) | Estados por item | Espaço de conteúdo previsto para cada estado de cada item, mesmo que a referência mostre um só |
| **Espaçamento entre blocos diferente entre produtos** | Layout por produto | Coleção de layout com **uma coleção por produto e um só mode**; a receita diz quais variáveis cada bloco usa. Diferença de espaçamento **dentro** de um bloco: token do IDS |
| Regra de **bloqueio ou combinação inválida** entre eixos | Região de aviso ou sobreposição, com regra por mode | Região presente onde a regra existe, ligada por modes; a regra vale para o domínio inteiro, não só para a tela |
| Camada **sobreposta ou absoluta** (overlay, selo, rodapé fixo) | Sobreposição | Posicionamento absoluto só com papel real; dimensiona pela composição que cobre (constraints ou FILL), sem tamanho herdado |
| **Texto ou valor variável dentro de peça IDS que não expõe property** | Limite | Não editar `characters` nem o interior; alternativas na ordem: property pública de outro nível, composição local justificada, pedido ao IDS. Registre `LIMITE`/`IMPASSE_TECNICO` |
| Valor **igual em todos os frames e produtos** | Constante da estrutura | Vai para a região ou receita; **texto** continua pertencendo ao produto |
| **Diferença de dimensão sem causa visível** entre a referência e o candidato | Investigar antes de decidir | Verifique sizing HUG/FILL/FIXED de containers internos, padding e gap padrão do componente, quebra de texto e propriedades padrão do IDS; a causa vira override contratado |
| Elementos de **casca** (cabeçalho, rodapé, ação principal) | Peça IDS na receita | Não viram região; a receita nomeia a peça e sua configuração |

Se um padrão observado **não cabe em nenhuma linha**, não improvise: registre-o como `NAO_CLASSIFICADO` com os frames e leve ao cartão como decisão da pessoa.

### Região com slot de conteúdo do produto

O padrão é o **chassi controlar o conteúdo** (texto e visibilidade por mode, variáveis planejadas). Só classifique uma região como slot quando **as referências mostrarem estrutura diferente entre produtos** ou a pessoa disser que o produto criará o conteúdo. Se as referências mostrarem a mesma estrutura variando só em texto ou presença, é conteúdo do chassi, não slot.

| | Controlada pelo chassi | Slot de conteúdo do produto |
| --- | --- | --- |
| Chassi entrega | Conteúdo, variáveis e ligações por mode | Contêiner, `SLOT` nomeado e regras do contêiner |
| Produto entrega | Valores (texto, visibilidade) | O conteúdo do slot e as variáveis dele |
| Variáveis do interior | Planejadas no contrato | **Fora do contrato**: não ligue nada a descendentes do slot |

Registre no contrato do kit, para cada slot: nome, papel, posição, o que o contêiner controla (espaçamento, posição, presença por mode) e `CONTEUDO_LIVRE_DO_PRODUTO` para o interior. A atualização de chassi **nunca escreve dentro de um slot preenchido**. Isso ainda não está provado no Figma: marque `NAO_CONFIRMADO` até a Montagem e a Validação comprovarem que uma atualização preserva o conteúdo do slot. Se as referências não decidirem entre as duas colunas, leve ao cartão como decisão da pessoa, com os frames comparados.

### Catálogo de opções por bloco

O chassi só oferece ao produto o que o contrato declara. Para cada peça do IDS usada em um bloco, liste no contrato do kit as propriedades públicas que a peça expõe (lidas na biblioteca conectada, não da memória) e classifique cada uma:

| Propriedade | Valores possíveis | Classificação | Valor padrão do chassi |
| --- | --- | --- | --- |
| (nome real lido) | (lista) | `FIXA_NO_CHASSI` (o produto não escolhe) ou `OPCAO_DO_PRODUTO` (o produto escolhe, dentro dos valores permitidos) ou `POR_EIXO` (varia por operação, contexto ou adicional) | (valor) |

Regras: uma propriedade só é `OPCAO_DO_PRODUTO` quando a referência mostra variação entre produtos ou a pessoa decidiu oferecê-la; o padrão é `FIXA_NO_CHASSI`. Propriedade que o IDS ganhar depois entra no catálogo como `CANDIDATA`, sem efeito até a pessoa classificá-la. Nomes de propriedades, de variáveis e identificadores de ligação pertencem ao chassi: o produto escolhe valores, nunca nomes. O cartão de aprovação mostra as opções oferecidas por bloco.

### Versionamento do chassi e guia de migração

- **Versão menor/correção (`v2.1`, `v2.2`):** muda só o que está **dentro de um componente ou de uma variável publicada** (região do Core, valor de token/variável de espaçamento). Chega ao designer por publicação no Figma, sem rodar o plugin. Nunca altera ordem de blocos, quais regiões entram, quantidade de itens nem a estrutura da receita.
- **Como o plugin trata a versão do chassi:** `chassi.versao` (N.N) no contrato vira `chassiVersion` no pacote. Mudança **só dentro de um componente ou de uma variável publicada** não altera o pacote e não exige o plugin. Se o **pacote** muda de forma compatível (por exemplo, uma variável ou ligação nova), suba o número menor (`1.0` → `1.1`): o plugin **atualiza no lugar** (cria o que falta, preserva textos, não apaga) **depois de pedir confirmação**. Versão maior nova (`1.x` → `2.0`): instala o componente `.../v2` **ao lado** do anterior, também com confirmação. Mudar a estrutura do pacote sem subir `chassi.versao` é recusado pelo plugin.
- **Versão maior (`v3`):** qualquer mudança na receita (ordem, região adicionada ou removida da composição, estrutura da lista de itens, troca de token usado). Exige o time rodar o plugin com a receita nova; o plugin **instala do zero** (componente novo, mesmas coleções reaproveitadas por nome) e **não** atualiza no lugar.
- Ao propor mudança, **classifique-a** como menor ou maior e diga por quê. Na dúvida (o time precisa parar e decidir algo?), é maior.
- **Toda versão maior vem com guia de migração**, dentro da receita, com: o que mudou (antes → depois, por bloco); o que o time de produto faz (rodar o plugin, republicar a biblioteca); o que o designer faz (trocar a instância antiga pela nova em cada tela; **nunca `detach`**, porque a tela destacada deixa de receber qualquer atualização); o que se preserva (coleções e modes, textos, chave das regiões) e o que precisa ser conferido depois; e o **prazo de convivência** (a versão anterior continua publicada e suportada por, no mínimo, o prazo declarado; a referência do mercado é de 3 a 6 meses) e o que passa a ser obsoleto.
- **Comportamento verificado no Figma:** trocar a instância de um componente do chassi pela versão nova da mesma biblioteca (`swapComponent`) mantém o mesmo nó, os modes escolhidos e os textos; muda só o que a versão nova mudou. Isso vale enquanto a versão nova **reaproveita as coleções da anterior** (o plugin as reaproveita por nome). Se uma versão renomear ou recriar coleção, os modes do designer se perdem: isso é mudança maior e o guia precisa dizer.

### Escala de tokens de layout (confirme na biblioteca da rodada)

Ao mapear cada distância de spacer ou padding, registre o **nome do token e o valor resolvido lido na biblioteca conectada**, não a memória. Exemplo ilustrativo (os nomes e valores reais vêm da biblioteca conectada): `spacing/1x`=4, `2x`=8, `4x`=16, `10x`=40; raios `card/01`=16. Uma distância sem token equivalente é `LIMITE` e vai para o cartão; não invente token. Frames spacer da referência são intenção de espaçamento: substitua por `gap` de auto layout vinculado a token, e escreva a substituição (`spacer 16 → gap spacing/4x`).

### Pergunta e cartão de aprovação

- **Pergunta:** uma por vez, com até três opções, cada uma com o **efeito visível** para a pessoa (o que o designer verá) e uma recomendação. Nunca pergunte o que a referência já responde.
- **Cartão de aprovação** (fim da análise, fora dos blocos de contrato): tela e etapa; frames cobertos e contagem reconciliada; regiões propostas (quais produtos usam cada uma); `chassi vN` proposto; máximo de itens por lista; por produto, o que ele **não** terá e o que terá; limites e decisões pendentes (classificadas); veredito por documento. A pessoa responde "aprovo o kit e a receita" ou aponta o que muda; a skill não escreve `APROVADO` sozinha.

Os Markdown desta skill são **rascunhos para revisão**, mesmo quando a cobertura da tela parece completa. Não peça para listar a rodada em `contracts/index.json`, executar `contracts lock`, compilar pacote ou rodar plugin nesta fase. Primeiro a pessoa revisa as decisões estruturais; depois o Montador prova o Core e o Validador confronta contrato, recibo e canvas. A promoção ao registro versionado vem após esse confronto. O contrato da etapa pode continuar parcial sem bloquear a prova isolada da tela atual.

### Mínimos de rastreabilidade antes do handoff

Use os modelos `modelos/contrato-etapa.md`, `modelos/contrato-tela.md` e `modelos/contrato-produto-tela.md` quando estiverem acessíveis. Mesmo sem acesso aos arquivos locais, **inclua estes campos e tabelas nos Markdown entregues**, preenchendo lacunas como `PENDENTE` com motivo; um resumo narrativo não os substitui:

- **Etapa:** ID estável confirmado ou `PROPOSTA_DE_ID`; versão; estado `proposta (proposal)` ou `pendente`; fonte do briefing e referências; cobertura limitada à tela e aos frames desta rodada; tabela de telas com vocação, relação, evidência e estado (`analisada`, `mencionada` ou `ainda não identificada`); cobertura por produto e eixo somente do recorte observado; decisões necessárias para a tela atual separadas das decisões da etapa futura. Não apresente as outras telas como analisadas apenas por terem sido citadas.
- **Kit de regiões e receita (tela):** identidade e dependência da versão do contrato da etapa; **uma linha por frame** com nome, link individual, produto, eixos e natureza da cópia; contagem reconciliada por produto e eixo; vocação por área/campo e por região; pares de comparação com evidência antes/depois; blueprint com origem IDS exata ou `PENDENTE`, property pública comprovada ou proposta marcada, scroll/fixação; as dez seções do "Contrato executável".
- **Cada produto:** versão, estado, referências e dependência das versões da etapa, do kit e da receita (`chassi vN`); **regiões usadas e regiões não usadas (com a evidência)**; matriz por Operação, Contexto e Produtos Adicionais com área/campo, conteúdo ou fonte, condição, evidência e estado da regra; tabela de configuração com alvo público e mecanismo comprovado ou pendente; espaçamento próprio do produto. Registre explicitamente combinações não observadas e dependências abertas.

Na matriz do produto, separe três colunas que não podem ser fundidas: **diferença observada na referência**, **regra proposta para o contrato** e **mode/binding ainda a provar no Figma**. Uma variante montada manualmente ou uma troca visual de conteúdo não comprova que o mode da coleção governa o campo. Não declare os três eixos testados por ter encontrado frames em cada categoria.

### Conferência obrigatória antes de emitir os Markdown

Faça esta conferência **sobre o texto final de cada bloco**, não apenas sobre suas notas de análise. Se algum item falhar, corrija o bloco antes de entregá-lo ou marque a lacuna como `PENDENTE` e explique seu efeito no handoff:

1. **Identidade e recorte:** nomes e autorizações já informados permanecem confirmados com sua fonte. Confira o pertencimento dos frames antes de contar cenários. Separe os frames da tela, os auxiliares e os pendentes; não amplie a vocação para absorver uma referência de função incerta.
2. **Inventário rastreável:** o contrato do kit de regiões tem uma linha por frame inspecionado, com pertencimento, nome, link HTTPS completo do Figma com arquivo e `node-id`, produto, Operação, Contexto, Produtos Adicionais e indicação de duplicata/cópia. Use arquivo e nó efetivamente identificados; não invente uma URL para preencher lacuna. Cada contrato de produto repete os links dos seus próprios frames. `figma://node/...`, ID solto, link da página ou menção que perde o destino ao copiar não substituem esses links.
3. **Aritmética e ocorrências:** reconte as categorias do inventário e os itens visíveis por área em cada caso de prova. Por produto, cada eixo soma o total de frames daquele produto, incluindo valores não identificados. Confira presença, ação, ícone, texto e estado da mesma ocorrência nas tabelas Core, produto e síntese. Recalcule menor/maior densidade com o critério declarado. Frames visualmente duplicados continuam no inventário; não declare cenários semanticamente distintos ou idênticos sem evidência suficiente.
4. **Fonte de cada regra:** para toda afirmação causal ou universal sobre um eixo, cite um par de frames do mesmo produto que isole aquele eixo ou uma confirmação explícita da pessoa. Se o valor do eixo não estiver identificado por frame, use `SEM_COBERTURA`/`NAO_CONFIRMADO`; não afirme que ele altera ou preserva a estrutura. Um texto do tipo “Até X dias” demonstra um campo variável, mas não prova qual contexto o governa. Contratos anteriores não aprovados servem para comparação, não como fonte de fatos confirmados.
5. **Três níveis de certeza nas receitas:** mantenha colunas distintas para diferença observada, regra proposta e mode/binding ainda a provar. Registre o alvo público e a property verificada ou `NAO_CONFIRMADO`. Confira também se blueprint, pendências e resumo preservam esses estados, inclusive para scroll, fixação e composição local. A ausência de um mode ou binding provado não pode virar status de implementação concluída.
6. **Dependências e compatibilidade:** cada capacidade distingue origem na referência, acesso/autorização no destino, controle inspecionado e exposição a provar no Core. Confronte os mecanismos recomendados com as fronteiras de Core, produto e IDS descritas em “Escolha técnica”. Registre qual acesso público o consumidor usará e qual prova falta. Concordância entre documentos não valida uma solução que viola essas fronteiras; marque a recomendação como incompatível e corrija-a antes do handoff. Nome parecido, biblioteca conectada ou property interna não comprovam os demais elos.
7. **Anomalias sem interpretação:** preserve links de duplicatas visuais, itens vazios e camadas incoerentes, com observação e intenção desconhecida. Não peça remoção de evidência para concluir a análise. Diga qual decisão ou prova é afetada; pendência sem impacto na tela atual não bloqueia seu avanço.

8. **Fidelidade do que cada produto recebe:** para cada produto, liste as regiões e camadas que **não** aparecem nos seus frames e confirme que não constam da sua composição (nem "ocultas por padrão"). Confira que cada texto de exemplo do contrato é o **texto literal** do frame (com o produto certo: um termo de um produto não pode aparecer no texto de outro). Confira que cada dimensão da referência citada existe no frame apontado, e que a soma dos itens por área bate com o máximo declarado.

Registre ao fim dos rascunhos uma tabela curta **Conferência da entrega**, com os oito critérios acima, resultado concreto (contagem, par/ocorrência, seção ou fonte) e lacuna/efeito na passagem. Uma declaração genérica “conferido” não substitui essa evidência. Escreva o cartão-resumo a partir dos documentos conferidos. Contradição não resolvida mantém o documento afetado `PENDENTE`; não anuncie “análise completa” nem `PRONTO_PARA_PROVA_CORE` enquanto faltar conferência necessária. Rascunhos coerentes com lacunas explícitas podem ficar `PRONTO_PARA_REVISAO`.

Se a resposta for longa, entregue por documento em mensagens sucessivas; não omita tabelas, links ou colunas para caber em uma única mensagem. Ao corrigir um rascunho, aumente sua versão e reemita todos os blocos afetados com dependências coerentes.

Uma biblioteca conectada com prefixo `[v1]` ou `[v2]` comprova apenas a família e a versão exibidas, não a disponibilidade de todos os componentes, chaves, tokens ou properties. Para cada dependência técnica, cite o recurso e o controle público inspecionados; se isso não foi possível, mantenha `NAO_CONFIRMADO` ou `NAO_DISPONIVEL_NO_MCP`. Não transforme `SLOT`, instance swap, scroll, responsividade ou valores de cenário em fato por plausibilidade.

Para o handoff técnico, inclua no contrato do kit e na receita um blueprint semântico por bloco: papel, estrutura-alvo, relação com scroll/fixação, IDS autorizado, `REGIAO_DO_CORE` ou `LOCAL_LAYOUT`, property pública necessária e efeito visual esperado. Escolha a estratégia conforme a evidência: instância IDS, região do Core, variante, instance swap, composição local ou componente local com reutilização justificada. **Não proponha BOOLEAN pública nem slot vazio para "ligar e desligar" bloco de produto:** bloco exclusivo de um produto é região que só entra na composição desse produto. Não copie grupos improvisados; não crie componente local apenas por conveniência. Uma property de estado do IDS é independente de modes de conteúdo; registre onde ambos precisarão ser combinados.

Na receita de produto, indique para cada campo governável o dono da variação, valor base, diferenças observadas por cenário e alvo público do Core/IDS. Para TEXT property de componente, o futuro binding deve usar `VariableAlias` na property pública via `setProperties`; não planeje binding em `characters` de texto interno de instância. Para visibilidade, fill, tamanho ou property direta, indique o alvo suportado. Não invente collection, mode, variable, property ou regra que a referência não confirmou.


## Fonte do pacote: tabelas de máquina nos contratos

O gerador de pacotes lê **somente** estes blocos; o resto do contrato é texto livre. Produza-os no formato exato abaixo.

**Contrato da tela (kit de regiões)** — bloco entre `<!-- camadas:inicio -->` e `<!-- camadas:fim -->`, seção `### Camadas ligáveis`, tabela `| camada | caminho |` (caminho completo a partir da raiz da região, níveis separados por ` > `, cada nome único dentro do anterior).

Também no contrato da tela, bloco entre `<!-- core:inicio -->` e `<!-- core:fim -->`, seção `### Chave publicada do Core`, tabela `| componente | chave | arquivo do Core | publicado em | nota |` com **exatamente uma linha** (uma tela, um componente do Core): a chave de 40 caracteres, o link do Figma do componente, a data (AAAA-MM-DD) e uma nota. É a **fonte única** da chave para todos os produtos. Antes da publicação do Core a chave fica `PENDENTE` e o pacote não é gerado.

**Contrato do produto na tela** — bloco entre `<!-- pacote:inicio -->` e `<!-- pacote:fim -->` com estas seções, nesta ordem:
- `### Configuração`: `| chave | valor |` com `etapa.nome`, `etapa.versao`, `chassi.versao` (N.N: versão maior e menor do chassi que este contrato representa), `produto.versao`, `tela.id`, `tela.nome`, `tela.versao` e `estado` (`technical-proof` enquanto o pacote for uma prova controlada). **A chave do Core não vai aqui** (veja o contrato da tela abaixo); declará-la no contrato do produto é erro.
- `### Eixos`: `| eixo | coleção | modos |` para `operation`, `context` e `additional`; modos separados por ` ; `. Os modos são **os mesmos em todas as telas da etapa**. Todo eixo precisa de ao menos um modo: um eixo que não varia na etapa usa um modo único (`padrao`).
- `### Notas`: `| nota |`, uma por linha.
- `### Ligações`: `| id | tipo | alvo | eixo | fixa | padrão |`. `tipo` é `STRING` ou `BOOLEAN`; `alvo` é `componente: <Instância> > <Instância> :: <Property>` ou `camada: <id da camada ligável>`; `eixo` é o único eixo que governa a ligação (vazio se nenhum); `fixa` é `sim` para property gravada sem variável (por exemplo `Trailing item`); `padrão` é o valor base (`true` ou `false` para BOOLEAN).
- `### Valores por modo`: `| id | modo | valor |`, uma linha por modo em que a ligação tem valor.

Regras: em célula, `\|` é a barra e `\n` a quebra de linha. O produto altera textos e valores; **ids, alvos, eixos e modos pertencem ao chassi**. Um `id` de visibilidade é `visivel-<id da camada>` e toda camada ligável do contrato da tela precisa ter a sua ligação. O texto de cada valor é o **literal** da referência. Mudou o contrato: suba a versão, refaça o lock e regere os pacotes.
