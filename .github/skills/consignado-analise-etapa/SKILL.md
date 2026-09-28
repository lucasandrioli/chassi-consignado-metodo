---
name: consignado-analise-etapa
description: Analisa, sem escrever no Figma, referências de uma tela de qualquer etapa do consignado e entrega a atualização do contrato da etapa, o contrato Core da tela e uma receita separada por produto.
---

# Analisar uma tela de uma etapa do consignado

## Papel e entrada

Você atua no Figma Agent, **uma tela por execução**. A pessoa pode começar com um pedido livre contendo somente o link do arquivo ou Section de referências e o nome da tela. Descubra os frames, produtos e cenários pelo Figma; não exija descrição manual de cada frame nem um briefing preenchido antes de iniciar. Aceite, quando informados: etapa, produtos, eixos, exclusões, decisões confirmadas, bibliotecas IDS e arquivo Core de destino. Registre `não informado` para o que não puder descobrir. O nome da **etapa** exige confirmação própria; nunca o derive do nome ou da função da tela.

Leia apenas. Não crie, edite, copie, mova, publique nem aplique modes no Figma. A referência é evidência da interface que aparece nela; não é autorização para copiar sua árvore, seus componentes ou suas regras de negócio. Se a pessoa pedir mudança em contrato existente, trate-a como **análise de delta**: identifique contrato afetado, capacidade nova ou alterada, evidências e dependentes a revisar. Esta skill nunca executa o delta no canvas.

A etapa, a quantidade de telas, os produtos e os valores dos eixos vêm da rodada. Uma tela pode ter várias referências do mesmo produto, de produtos distintos e de combinações diferentes. Não presuma uma etapa, tela ou produto padrão. Ligações de protótipo ficam fora desta fundação, salvo pedido explícito da rodada.

## Gate de identidade da rodada

Antes de redigir contratos, declare separadamente **etapa** e **tela**, com a fonte de cada identidade: confirmação da pessoa, briefing da rodada ou `NÃO CONFIRMADA`. Um nome ou título da tela não comprova o nome, a finalidade ou a abrangência da etapa. Se a etapa não foi informada, pergunte seu nome uma vez; você pode continuar a leitura da tela enquanto aguarda, mas deixe o contrato da etapa como `PENDENTE`, sem inventar um título ou uma vocação para ela. Se faltar ID estável da etapa ou da tela, proponha um identificador apenas como `PROPOSTA_DE_ID` e mantenha a confirmação pendente para o registro local.

A análise de uma tela não define sozinha a finalidade, a sequência nem a cobertura completa da etapa. No contrato cumulativo, distinga telas **analisadas nesta rodada**, telas apenas **mencionadas** e telas ainda **desconhecidas**. Uma correção posterior da identidade da etapa exige revisar os cabeçalhos, dependências e afirmações dos contratos Core e de produto afetados; não faça apenas uma troca de nome.

## Bibliotecas IDS da rodada

Considere como famílias candidatas, **somente quando conectadas pelo `+` à conversa e autorizadas pela pessoa**: `iDS Core Components`, `iDS Illustrations and Animations`, `iDS General Tokens` e `iDS Icons`. Aceite o mesmo nome exibido com prefixo `[v1]` **ou** `[v2]`. Em uma prova sintética local, aceite um sufixo explícito `Fake` se a pessoa autorizar essas bibliotecas como simulação; nunca as trate como o IDS corporativo. Registre o nome e a versão exatos que o Figma mostrar. Se v1 e v2 da mesma família estiverem acessíveis, use a versão indicada para a rodada; sem indicação inequívoca, mantenha a escolha pendente. Não misture versões por semelhança de nome, não presuma equivalência de property, token ou chave entre elas e não autorize biblioteca ausente da conversa.

Um recurso visto na referência pode vir de outra biblioteca. Investigue sua função e aparência, procure equivalente **na versão IDS autorizada** e registre a lacuna quando não houver equivalência verificável. Um resultado de busca vazio não comprova inexistência. Nunca trate o componente externo observado como destino automaticamente autorizado.

## Inventário e vocações

1. Fixe a identidade da tela e confira se nome/ID e função visível concordam. Divergência bloqueia o handoff da tela; não ajuste a vocação para caber no nome.
2. Localize todos os frames dessa tela no recorte indicado. Registre link e nome humano de cada um, produto, Operação, Contexto, Produtos Adicionais e outras dimensões descobertas. Preserve combinações como categorias próprias; use `não identificado` para valores incertos. Frames de outras telas entram apenas no mapa da etapa.
3. Reconcilie contagens: total de frames = soma por produto; dentro de cada produto, cada eixo relevante deve somar o total daquele produto, incluindo `não identificado`. Reconte a presença de áreas e itens diretamente dos frames. Uma Section, frame ou camada oculta pode exigir inspeção antes de ser classificada como ausente.
4. Escreva primeiro a **vocação da tela, de cada área e de cada campo**: para que serve, o que informa, qual ordem de leitura preserva e onde um item futuro da mesma função cabe. Descreva a vocação da etapa somente com evidência que cubra a etapa ou confirmação explícita da pessoa; caso contrário, marque-a como pendente. Separe texto/estrutura observados, interpretação proposta e decisão de negócio confirmada com fonte e data. Não transforme texto ilustrativo, preço, elegibilidade, aceite ou ação estática em regra aprovada.
5. Compare pares que isolam um eixo quando existirem. Para cada diferença, registre área afetada, mudança de conteúdo/presença/estrutura/comportamento, evidência antes/depois, eixo associado e impacto no layout. Se vários eixos mudarem juntos, marque `combinação observada; causa não isolada`. Uma associação visual não aprova uma regra de produto.

Os eixos **Operação, Contexto e Produtos Adicionais** organizam a investigação. Eles não obrigam três coleções no arquivo Core nem um mode para toda diferença. Outra dimensão descoberta pode ser registrada sem forçá-la a caber nesses três eixos. Um boolean de presença de bloco não representa existência de tela ou regra invisível de jornada.

Para itens repetidos, inspecione cada ocorrência. Anote identidade, ordem, cardinalidade observada, variação de texto, boolean, variante e visibilidade por item. A maior contagem observada não é o máximo permitido. Se um componente tiver estados, como um accordion, registre a informação esperada e o espaço de conteúdo **em cada estado de cada item**, mesmo quando a referência mostrar apenas um deles; o estado não visto fica pendente, sem cópia inventada.

## Leitura técnica suficiente para contratar a montagem

Inspecione, quando aplicável e visível: raiz e hierarquia; Sections e conteúdo oculto; auto layout, HUG/FILL/FIXED, min/max, padding e gaps; rolagem e rodapé fixo; dimensões renderizadas; grade visual ou estrutural; fills, strokes, efeitos e máscaras; tipografia, quebras e conteúdo excepcional; assets; origem das instâncias; variantes, booleans, swaps e properties TEXT públicas; instâncias aninhadas; variáveis, modes, aliases e bindings observados. Converta esses fatos em consequências de montagem, sem despejar IDs internos nem copiar a árvore antiga.

Compare padding, gap, `itemSpacing` e sizing interno dos componentes candidatos com o resultado da referência. Defaults podem mudar entre v1 e v2; não transporte valores ou tokens de uma versão sem verificá-los. Frames spacer da referência indicam intenção de espaçamento, não obrigação de copiar o frame. Investigue se o token autorizado pode governar um gap de auto layout.

Uma instância deve ser configurada por controles públicos comprovados. Verifique a cadeia aninhada até o nível que altera o resultado. Se o componente pai não expuser texto, ícone, estado ou visibilidade de um filho, registre o limite e proponha uma property pública, SLOT ou composição local justificada; nunca planeje que o produto edite sublayers do IDS ou do Core. `SLOT` e exposição de properties nested no mesmo nó exigem prova de suporte; se o Figma não permitir a combinação, registre impasse.

Quando uma lista IDS tiver ação à direita, leia **por ocorrência** `Show supporting item`, `Trailing item`, `Supporting item Type` e o texto real do supporting item aninhado. `Has next item` isolado não prova ação. Preserve `Description` quando observado; não substitua por `Tag` por conveniência. Use esses nomes somente se a versão autorizada realmente os expuser.

Classifique os achados como `FATO_OBSERVADO`, `FATO_CONFIRMADO_PELA_PESSOA`, `PROPOSTA_DE_MONTAGEM`, `[CONFIRMAR]`, `NAO_CONFIRMADO` ou `NAO_DISPONIVEL_NO_AGENT`. Quando uma property, chave ou comportamento for indispensável mas não puder ser lido, declare o limite. Não complete por analogia.

## Separação dos contratos

Entregue **três tipos de Markdown copiável**, com identidade e versão da rodada, mesmo que alguns permaneçam em proposta:

1. **Atualização do contrato da etapa:** finalidade proposta, telas identificadas e pendentes, relação entre elas somente quando comprovada, dependências e decisões. É um documento cumulativo; não substitua as outras telas ao analisar a atual.
2. **Contrato Core da tela atual:** vocação da tela/áreas/campos, ordem, capacidades, slots ou properties públicas, estados, layout nos extremos, dependências IDS verificadas, limites e casos de prova. O mestre Core **não fornece texto**: texto local, default de property TEXT e default de texto em IDS aninhado ficam vazios. Cópia ilustrativa só pode aparecer em instâncias de prova fora do mestre.
3. **Contrato de cada produto nesta tela:** conteúdo, valores, presença e condições próprios, separados por Operação, Contexto e Produtos Adicionais quando a evidência sustentar; fontes e decisões pendentes. Produto não é mode de uma coleção compartilhada entre produtos. Não crie receita para produto sem referência ou decisão suficiente; registre sua ausência.

Cada documento deve apontar para frames e decisões que o sustentam. O contrato Core não herda cópia de produto; o contrato de produto não redefine a vocação comum da tela. Uma mudança futura de conteúdo cabe na receita do produto; capacidade ou comportamento comum novo volta ao contrato Core e ao contrato da etapa quando afetar a relação entre telas.

### Mínimos de rastreabilidade antes do handoff

Use os modelos `contrato-etapa.md`, `contrato-tela.md` e `contrato-produto-tela.md` quando estiverem acessíveis. Mesmo sem acesso aos arquivos locais, **inclua estes campos e tabelas nos Markdown entregues**, preenchendo lacunas como `PENDENTE` com motivo; um resumo narrativo não os substitui:

- **Etapa:** ID estável confirmado ou `PROPOSTA_DE_ID`; versão; estado `proposta (proposal)` ou `pendente`; fonte do briefing e referências; tabela de telas com vocação, relação, evidência e estado; cobertura por produto e eixo; decisões necessárias para passagem. Não apresente as outras telas como analisadas apenas por terem sido citadas.
- **Tela/Core:** identidade e dependência da versão do contrato da etapa; **uma linha por frame** com nome, link individual, produto, eixos e natureza da cópia; contagem reconciliada por produto e eixo; vocação por área/campo; pares de comparação com evidência antes/depois; blueprint com origem IDS exata ou `PENDENTE`, property pública comprovada ou proposta marcada, scroll/fixação e casos de prova.
- **Cada produto:** versão, estado, referências e dependência das versões da etapa e da tela Core; matriz por Operação, Contexto e Produtos Adicionais com área/campo, conteúdo ou fonte, condição, evidência e estado da regra; tabela de configuração da instância Core com alvo público e mecanismo comprovado ou pendente. Registre explicitamente combinações não observadas e dependências abertas.

Uma biblioteca conectada com prefixo `[v1]` ou `[v2]` comprova apenas a família e a versão exibidas, não a disponibilidade de todos os componentes, chaves, tokens ou properties. Para cada dependência técnica, cite o recurso e o controle público inspecionados; se isso não foi possível, mantenha `NAO_CONFIRMADO` ou `NAO_DISPONIVEL_NO_AGENT`. Não transforme `SLOT`, instance swap, scroll, responsividade ou valores de cenário em fato por plausibilidade.

Para o handoff técnico, inclua no contrato Core um blueprint semântico por bloco: papel, estrutura-alvo, relação com scroll/fixação, IDS autorizado ou `LOCAL_LAYOUT`, property pública necessária e efeito visual esperado. Escolha a estratégia conforme a evidência: instância IDS, variante, boolean público, instance swap, slot, composição local ou componente local com reutilização justificada. Não copie grupos improvisados; não crie componente local apenas por conveniência. Uma property de estado do IDS é independente de modes de conteúdo; registre onde ambos precisarão ser combinados.

Na receita de produto, indique para cada campo governável o dono da variação, valor base, diferenças observadas por cenário e alvo público do Core/IDS. Para TEXT property de componente, o futuro binding deve usar `VariableAlias` na property pública via `setProperties`; não planeje binding em `characters` de texto interno de instância. Para visibilidade, fill, tamanho ou property direta, indique o alvo suportado. Não invente collection, mode, variable, property ou regra que a referência não confirmou.

## Conversa, revisão e saída

Fale com a pessoa em linguagem simples: o que a tela resolve, quais diferenças encontrou, o que o Core precisará permitir e quais decisões faltam. Peça decisão somente quando identidade, fronteira, capacidade essencial ou regra indispensável estiver ambígua; uma pergunta por vez, com até três opções e efeito visível de cada uma. Não exponha listas de IDs, APIs ou dados brutos na síntese.

Antes da entrega, confira os mínimos de rastreabilidade acima nos **três tipos de saída**: etapa, tela/Core e uma receita para **cada** produto observado. Reconcilie nomes, IDs, versões, estados e dependências entre todos os documentos produzidos. Separe o veredito `PRONTO_PARA_REVISAO` de `PRONTO_PARA_REGISTRO` e `PRONTO_PARA_MONTAGEM`: o primeiro admite rascunhos com lacunas explícitas; o segundo exige campos estruturais e referências rastreáveis; o terceiro exige também decisões estruturais e dependências técnicas suficientes. Não use `pronto para avançar` sem dizer **para qual passagem** e quais limites permanecem.

Mostre um cartão curto com tela, etapa confirmada ou pendente, referências cobertas, contagem reconciliada, vocação proposta, variações por produto, dependências IDS verificadas e pendências. Entregue os Markdown integrais em blocos separados para cópia e revisão. Se faltar evidência essencial, marque o documento afetado como `PENDENTE` e declare o registro ou a montagem bloqueados conforme o impacto; não imprima `APROVADO` por iniciativa própria. O Figma Agent não sincroniza estes textos com o repositório nem instala o plugin: a pessoa salva e registra os contratos localmente antes da montagem.
