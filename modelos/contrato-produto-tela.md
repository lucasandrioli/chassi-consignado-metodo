# Receita do produto — `<produto>` / `<etapa>` / `<tela>`

**Versão:** 0.1

**Estado:** proposta / revisada / aprovada; responsável e data

**Depende de:** `<versões dos contratos da etapa e da tela Core>`

**Referências:** `<links HTTPS individuais com arquivo e node-id dos frames deste produto, natureza da cópia e duplicatas visuais preservadas>`

## Vocação no produto

`<O que este produto precisa comunicar ou permitir nesta tela. Separe amostra sintética de regra aprovada.>`

Derive esta matriz do inventário e das ocorrências do contrato Core. As três colunas centrais são distintas mesmo quando a regra ou o mecanismo permanecerem pendentes. Para valores base, registre a observação sem inventar uma variação.

| Operação | Contexto | Produtos Adicionais | Área/campo semântico do Core | Diferença observada na referência (conteúdo/presença/ação) | Regra proposta para o contrato (condição e fonte) | Mode/binding ainda a provar no Figma | Evidência por frame/par e estado da regra |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |

## Configuração da instância Core

| Área/campo semântico | Alvo público do Core/IDS | Valor base ou fonte | Variação por Operação, Contexto ou Produtos Adicionais | Collection/mode quando aplicável | Binding ou configuração | Prova no Figma |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

Separe o eixo que **explica a diferença observada** do mecanismo Figma que a implementa. Não crie mode para cada combinação nem override para um eixo sem variação nesta tela. Para uma property TEXT pública de componente, registre o alias de variável aplicado à própria property por `setProperties`, sem editar `characters` internos da instância. Para boolean, variante, slot ou propriedade direta, registre o mecanismo suportado pela versão concreta do Core/IDS. O contrato precisa distinguir regra confirmada, proposta e cenário não observado.

Uma property observada num filho IDS não comprova sua exposição na instância do Core. Na análise, registre alias, alvo novo e binding futuros como propostas; só declare aplicação/teste quando houver evidência. Confira presença e ações por cenário contra as mesmas ocorrências do contrato Core, explicitando exceções às tabelas gerais.

**Compatibilidade do mecanismo:** `<para cada alvo acima, indique o controle público que o consumidor usará e a prova necessária. Caminho de layer, override de characters ou binding em texto interno não são alvos públicos. Wrapper ou SLOT proposto precisa explicar como resolve o acesso; se não houver mecanismo compatível, registrar impasse na capacidade afetada. Copy e capitalização continuam nesta receita; o mestre Core fica sem texto/defaults e sem collections de conteúdo de produto>`.

## Conteúdo de componentes com estados, se houver

| ID semântico e ordem contratada | Cenário | Conteúdo no estado fechado | Conteúdo no estado aberto | Estado inicial proposto | Fonte e aprovação |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Preencha os dois estados de cada item exigido pelo contrato de tela. `Não observado` é uma pendência, não autorização para duplicar o texto do outro estado ou congelar o item na posição visual da referência. Preserve a sequência e a vocação definidas no Core; esta receita define a cópia e a condição próprias do produto.

**Combinações não observadas:** `<não extrapolar>`.

**Dependências e pendências:** `<dados, copy, IDS, Core, negócio, publicação>`.

**Saída:** instância do Core configurada e revisada na biblioteca deste produto, com chave e versão do Core e prova dos cenários. Sem vínculo e compatibilidade verificados, não declarar a receita pronta para instalação.

Um eixo que não varia nesta etapa usa **um modo único** (`padrao`). Enquanto o pacote for uma prova controlada, `estado` é `technical-proof`. O exemplo abaixo mostra um texto por modo, uma visibilidade por modo e uma property fixa: troque pelos ids, alvos e valores desta tela.

<!-- pacote:inicio -->
## Fonte do pacote

Lida pelo gerador de pacotes. Textos e valores podem ser alterados; **ids, alvos, eixos e modos não** (são a referência entre o contrato, o pacote e o Figma).

### Configuração

| chave | valor |
| --- | --- |
| etapa.nome | Nome da etapa |
| etapa.versao | 0.1 |
| chassi.versao | 1.0 |
| produto.versao | 0.1 |
| tela.id | id-da-tela |
| tela.nome | Nome da tela |
| tela.versao | 0.1 |
| estado | technical-proof |

### Eixos

| eixo | coleção | modos |
| --- | --- | --- |
| operation | Operação | modo-a ; modo-b |
| context | Contexto | padrao |
| additional | Produtos Adicionais | padrao |

### Notas

| nota |
| --- |
| Nota do produto (opcional). |

### Ligações

| id | tipo | alvo | eixo | fixa | padrão |
| --- | --- | --- | --- | --- | --- |
| texto-titulo | STRING | componente: Navigation header :: Large title content | operation |  | Título do produto |
| visivel-bloco-exemplo | BOOLEAN | camada: bloco-exemplo | operation |  | false |
| prop-item-trailing | STRING | componente: item :: Trailing item |  | sim | None |

### Valores por modo

| id | modo | valor |
| --- | --- | --- |
| texto-titulo | modo-a | Título do modo A |
| texto-titulo | modo-b | Título do modo B |
| visivel-bloco-exemplo | modo-a | true |
| visivel-bloco-exemplo | modo-b | false |
<!-- pacote:fim -->
