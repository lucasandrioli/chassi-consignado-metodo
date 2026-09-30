<!-- CONTRATO-CORE-INICIO -->
> **LEIA ANTES (Ajuste 5, decisão da pessoa responsável, 29/09/2026):** onde este contrato diz "property BOOLEAN pública" (B1–B16, `Show …`), o Core NÃO terá BOOLEANs públicas: leia "camada ocultável por caminho de nomes", estado padrão visível (exceto overlay e rule, ocultos). T-13/T-14 substituídas. Detalhes no Ajuste 5 do pedido.

# Contrato Core — Tela Revisão (v0.6)

> **Versão:** 0.10 · **Rodada:** 2026-09-29
> **Etapa:** Formalização do crédito consignado (PROPOSTA_DE_ID: formalizacao-credito-consignado)
> **Tela:** Revisão · **ID proposto:** revisao
> **Fonte da identidade da tela:** FATO_CONFIRMADO_PELA_PESSOA
> **Arquivo Core destino:** Core Consignado — Revisão (Fake) (2idZZ4hy2l9rwqjvfHAhYT)
> **Arquivo de referência:** ZNL40Wf9QXl3qE7l4ZCrda
> **Mestre Core não fornece texto:** texto local, default de property TEXT e default em IDS aninhado ficam vazios.
> **Δ 0.5 → 0.6:** T-1/T-2 reescritos — Label / Content descoberto, cadeia de 3 níveis documentada, mecanismo de exposição com contagem; R8 generalizada ("Seção de portabilidade"); inventário expandido para 19 frames (4 sintéticos INSS); T-6 e I-2 indexação corrigida para base 1; T-11 reclassificado (não bloqueia mais) com registro literal da da resposta do a pessoa responsável; T-15 criado para pergunta residual.

---

## 1 · Vocação

### 1.1 Tela

Apresentar ao usuário um resumo consolidado das condições da operação de crédito consignado antes da contratação. Permite conferir valores, taxas, prazos e produtos adicionais, e oferece ações de edição em itens selecionados. É a última parada informativa antes do aceite/contratação.

### 1.2 Regiões e campos

| Região | Vocação | Ordem de leitura | Frames em que aparece | Condicional |
|---|---|---|---|---|
| **R1 — Cabeçalho** | Identificar a tela, permitir voltar e acessar ajuda | Topo, fixo | Todos (19/19) | não |
| **R2 — Tabela comparativa** | Comparar condições da portabilidade com e sem dinheiro extra | Antes da lista de dados, quando visível | 1/19 (Port Atq Refin) | sim |
| **R3 — Subtítulo de detalhes** | Contextualizar a lista de dados como detalhamento da portabilidade | Após tabela, quando visível | 1/19 (Port Atq Refin) | sim |
| **R4 — Lista de dados da operação** | Detalhar cada condição como par label/valor com ações opcionais | Corpo principal, vertical | Todos (19/19) | não (mas itens individuais são condicionais) |
| **R5 — Texto de condições** | Informar a validade temporal das condições | Após o último item da lista | Todos (19/19) | não |
| **R6 — Banner informativo** | Chamar atenção para condições complementares de portabilidade | Após dados da operação, quando visível | 1/19 (Port Atq Refin) | sim |
| **R7 — Seção Seguro do Consignado** | Detalhar condições do seguro | Após banner/dados, quando visível | 4/19 (OP com seguro) | sim |
| **R8 — Seção de portabilidade** | Detalhar condições da portabilidade (salário ou benefício, título pela receita) | Após seção seguro, quando visível | 8/19 (OP com port salário + INSS com port benefício) | sim |
| **R9 — Aviso de portabilidade** | Alertar sobre prazo de aprovação vs. próximo pagamento | Após seção portabilidade, quando visível | 8/19 (mesmos que R8) | sim |
| **R10 — Ação fixa** | Ação primária de avanço ou retorno | Rodapé fixo | Todos (19/19) | não |
| **R11 — Overlay de operação** | Conter regras de bloqueio para combinações inválidas de eixos | Sobreposta ao conteúdo, quando visível | 3/19 (Port Ataque, OP) | sim |

---

## 2 · Inventário de frames (19 frames, 2 Sections)

| # | Frame ID | Nome | Produto | Operação | Contexto | Prod. Adicionais | Dims | Sintético |
|---|---|---|---|---|---|---|---|---|
| 1 | 9:304 | inss-revisao-pcon-desbloqueado | INSS | PCON | desbloqueado | sem adicionais | 360×1110 | — |
| 2 | 10:882 | inss-revisao-pcon-bloqueado | INSS | PCON | bloqueado | sem adicionais | 360×1110 | — |
| 3 | 10:310 | inss-revisao-refin-desbloqueado | INSS | REFIN | desbloqueado | sem adicionais | 360×1190 | — |
| 4 | 10:1276 | inss-revisao-refin-bloqueado | INSS | REFIN | bloqueado | sem adicionais | 360×1190 | — |
| 5 | 48:4389 | inss-revisao-pcon-desbloqueado-com-port-beneficio | INSS | PCON | desbloqueado | port benefício | 360×1554 | ✓ |
| 6 | 48:4865 | inss-revisao-pcon-bloqueado-com-port-beneficio | INSS | PCON | bloqueado | port benefício | 360×1554 | ✓ |
| 7 | 48:5341 | inss-revisao-refin-desbloqueado-com-port-beneficio | INSS | REFIN | desbloqueado | port benefício | 360×1634 | ✓ |
| 8 | 48:5844 | inss-revisao-refin-bloqueado-com-port-beneficio | INSS | REFIN | bloqueado | port benefício | 360×1634 | ✓ |
| 9 | 13:3705 | op-revisao-pcon-sem-adicionais | OP | PCON | — | sem adicionais | 360×1326 | — |
| 10 | 13:4528 | op-revisao-pcon-com-seguro | OP | PCON | — | seguro | 360×1698 | — |
| 11 | 13:5351 | op-revisao-pcon-com-port-salario | OP | PCON | — | port salário | 360×1770 | — |
| 12 | 13:6174 | op-revisao-pcon-com-seguro-com-port-salario | OP | PCON | — | seguro+port | 360×2142 | — |
| 13 | 13:2882 | op-revisao-refin-sem-adicionais | OP | REFIN | — | sem adicionais | 360×1406 | — |
| 14 | 12:855 | op-revisao-refin-com-seguro | OP | REFIN | — | seguro | 360×1778 | — |
| 15 | 13:1064 | op-revisao-refin-com-port-salario | OP | REFIN | — | port salário | 360×1850 | — |
| 16 | 13:2059 | op-revisao-refin-com-seguro-com-portabilidade | OP | REFIN | — | seguro+port | 360×2222 | — |
| 17 | 13:6997 | op-revisao-port-atq-saldo-sem-adicional | OP | Port Ataque Saldo | — | sem adicionais | 360×1062 | — |
| 18 | 13:7820 | op-revisao-port-atq-saldo-sem-adicional | OP | Port Ataque Saldo | — | sem adicionais | 360×1062 | — |
| 19 | 13:8643 | op-revisao-port-atq-refin-sem-adicional | OP | Port Ataque Refin | — | sem adicionais | 360×1892 | — |

> **Sections no arquivo:** 2 — "Revisão · INSS" (14:3590, 8 frames) e "Revisão · OP" (14:3591, 11 frames).
> **Reconciliação:** 19 frames = 8 INSS (4 originais + 4 sintéticos) + 11 OP. Frames #17 e #18 são duplicatas visuais (T-8).
> **Frames sintéticos (5–8):** criados pela pessoa responsável (29/09/2026) para dar cobertura visual à portabilidade de benefício do INSS. Conteúdo copiado do OP (port salário), com título trocado. FATO_CONFIRMADO_PELA_PESSOA de natureza sintética para teste. Não são observação.

---

## 3 · Estrutura do Core — regiões semânticas

O Core é a capacidade da tela e é consumido igualmente por INSS e OP. Nenhum produto é subconjunto do outro.

### 3.1 Mapa de regiões e controles públicos

#### R1 — Cabeçalho (Navigation header, iDS [v2])

- Instância de Navigation header
- Properties usadas: `Text configuration` = Large, property TEXT `Large title content` (título da tela, configurado pela receita)
- INSS: dentro de wrapper (gap=40, padBottom=0)
- OP: filho direto da raiz (padBottom=16)

#### R2 — Tabela comparativa (LOCAL_LAYOUT — classificação fechada)

- Região do próprio Core, em LOCAL_LAYOUT (frame semântico dentro do mestre). Não é um componente reutilizável separado.
- Composição feita com instâncias de Body (iDS [v2]) e Divider (iDS), mais tokens.
- 15 instâncias de Body internas (3 cabeçalhos de coluna + 4 labels de linha + 8 células de valor).
- Cada Body tem property TEXT pública `Content` (key `Content#58:0`).
- Reutilizações concretas: 1 (Port Atq Refin, OP). INSS mantém oculta.
- **Property BOOLEAN:** `Show tabela comparativa`. Produto liga a variável da coleção Operação.
- **Properties TEXT:** mecanismo de exposição da Content de cada Body — ver T-9 (§7).

#### R3 — Subtítulo de detalhes

- Instância nomeada `subtitulo-detalhes`
- Texto observado: "Mais detalhes da portabilidade com dinheiro extra"
- **Property BOOLEAN:** `Show subtitulo detalhes`. Produto liga a variável da coleção Operação.

#### R4 — Lista de dados da operação

- Frame contendo N instâncias de **Item default** (iDS [v2]).
- O Item default tem a seguinte cadeia de instâncias aninhadas para texto (ver §3.5 para detalhes):
  - Item default → **Label box** (instância exposta pelo Item default, componente ".Label box") → **Label 01** (instância de **Label / Content**, NÃO exposta pelo Label box) → `Content` (TEXT, key `Content#60:0`)
  - Item default → **Label box** (exposta) → **Label 02** (instância de **Label / Content**, NÃO exposta pelo Label box) → `Content` (TEXT)
  - Item default → **Supporting item** (instância exposta pelo Item default, componente ".Item default / Supporting item") → **.Description box** (instância de ".Description box", NÃO exposta) → **Description 01** (instância de **Label / Content**, NÃO exposta) → `Content` (TEXT)
- Properties públicas do Item default: `Has next item` (BOOL), `Show supporting item` (BOOL), `Show leading item` (BOOL), `Trailing item` (VARIANT: Icon/None), `Contrast` (VARIANT), `Size` (VARIANT), `State` (VARIANT).
- **Slots unificados do Core:** 14 slots (união de OP e INSS). 6 slots fixos + 8 slots condicionais (cada um controlado por property BOOLEAN pública).
- Ver §3.4 para a tabela de slots fixos/condicionais e §3.3 para o inventário de BOOLEANs.

#### R5 — Texto de condições

- Instância de **Body** (iDS [v2]) nomeada `body-condicoes`, após spacer-condicoes.
- Property pública do Body: `Content` (TEXT). Texto configurado pela receita do produto.

#### R6 — Banner informativo (Banner Highlight, iDS [v2])

- Properties públicas: `Body content` (TEXT, default "Body"), `Has interaction` (BOOL, default true), `Contrast` (VARIANT), `State` (VARIANT), `Show title` (VARIANT)
- Valor observado em Port Atq Refin: Body content = "Confira também as condições da transferência do seu contrato para o Banco", Has interaction = true, Show title = False.
- **Property BOOLEAN:** `Show banner`. Produto liga a variável da coleção Operação.

#### R7 — Seção Seguro do Consignado

- Frame contendo instância de **Section** (iDS [v2]) como heading + 4 instâncias de Item default (iDS [v2]).
- Section (iDS [v2]): component set "Section", properties `Content` (TEXT, default "Section"), `Contrast` (VARIANT: Default), `Size` (VARIANT: Medium). Chave d35c5a23f055ce949252abba4cdb4936fdb83a0f, remote=true.
- **Property BOOLEAN:** `Show secao seguro`. Produto liga a variável da coleção Produtos Adicionais (true quando seguro ou seguro+port).

#### R8 — Seção de portabilidade (genérica — título pela receita)

- Frame contendo instância de **Section** (iDS [v2]) como heading + 4 instâncias de Item default (iDS [v2]).
- A região é genérica: o título vem da receita do produto via property `Content` da instância Section.
  - OP: Content = "Portabilidade de salário"
  - INSS: Content = "Portabilidade de benefício"
- **Property BOOLEAN:** `Show secao portabilidade`. Produto liga a variável da coleção Produtos Adicionais.

#### R9 — Aviso de portabilidade

- Instância de Body (iDS [v2]) com texto de alerta.
- **Property BOOLEAN:** `Show aviso portabilidade`. Produto liga a variável da coleção Produtos Adicionais (mesmos valores de R8).

#### R10 — Ação fixa (Fixed button, iDS [v2])

- Type=Single primary. Label do botão configurado pela receita via `Label content` (TEXT) no Main button aninhado.

#### R11 — Overlay de operação e regra de bloqueio

- Frame `overlay-operacao-nao-utilizada`, filho direto da raiz (z-index mais alto).
- Contém duas estruturas de regra:
  - `wrapper-rule-operacao-sem-revisao` > `rule-operacao-sem-revisao` > `overlay-blocker` > `badge` > "Mensagem da operação" (TEXT)
  - `rule-port-ret-simples` > `overlay-blocker` > `badge` > "Mensagem da operação" (TEXT: " ")
- Presente em OP; ausente na estrutura INSS.
- **Property BOOLEAN:** `Show overlay`. Produto liga a variável da coleção Operação (true quando Port Ataque Saldo ou Port Ataque Refin).
- **Property BOOLEAN:** `Show rule bloqueio`. Produto liga a variável da coleção Produtos Adicionais (true quando seguro, port salário ou seguro+port).
- No estado de combinação inválida, o overlay cobre o conteúdo (incluindo o Fixed button). O Core não precisa de controle próprio para o botão nesse estado. FATO_CONFIRMADO_PELA_PESSOA (pessoa responsável, 29/09/2026): "é o overlay que tem que cobrir, só isso". Proposta (sujeita a revisão): nenhum mecanismo adicional além de B7+B8 é necessário.
- Navegação de retorno quando overlay visível: ver T-15 (§7).

### 3.2 Diferenças estruturais entre produtos

| Aspecto | INSS | OP |
|---|---|---|
| Wrapper do conteúdo | Frame interno "Revisão - Novo" (PCON) com gap=40 | Filhos diretos da raiz |
| Nav header padBottom | 0 (dentro do wrapper) | 16 (na raiz) |
| Slots de item R4 | 10 (PCON) / 11 (REFIN) — subconjunto dos 14 do Core | 14 |
| Itens exclusivos OP | — | Forma de pagamento, Data portabilidade, Fonte pagadora, Matrícula |
| Item oculto INSS pos. 7/8 | hidden em todos (vocação a confirmar T-6); posição relativa alinhada com item-forma-pagamento do OP | — |
| Regiões R2, R3, R6, R11 | BOOLEANs = false | BOOLEANs controlados por receita |
| Região R7 | B4 = false (constante) | B4 controlado por Prod. Adicionais |
| Região R8 | B5 controlado por Prod. Adicionais INSS | B5 controlado por Prod. Adicionais OP |
| Título R8 Section | "Portabilidade de benefício" | "Portabilidade de salário" |
| Eixo Contexto | Influencia "Dinheiro na conta" (bloq/desblq) | Não influencia esta tela |
| Nav title por Operação | 2 variantes | 4 variantes |
| Botão label | "Continuar" | "Ir para contratação" ou "Voltar" |
| CET capitalização | "Custo Efetivo Total (CET)" | "Custo efetivo total (CET)" |

### 3.3 Inventário completo de properties BOOLEAN públicas do Core

**BOOLEANs de região (8):**

| # | Property BOOLEAN | Região | Coleção de binding |
|---|---|---|---|
| B1 | `Show tabela comparativa` | R2 | Operação |
| B2 | `Show subtitulo detalhes` | R3 | Operação |
| B3 | `Show banner` | R6 | Operação |
| B4 | `Show secao seguro` | R7 | Prod. Adicionais |
| B5 | `Show secao portabilidade` | R8 | Prod. Adicionais |
| B6 | `Show aviso portabilidade` | R9 | Prod. Adicionais |
| B7 | `Show overlay` | R11 frame | Operação |
| B8 | `Show rule bloqueio` | R11 rule | Prod. Adicionais |

**BOOLEANs de slot de item (8):**

| # | Property BOOLEAN | Slot | Coleção de binding OP | Coleção de binding INSS |
|---|---|---|---|---|
| B9 | `Show item valor receber` | #1 | Operação (false: Port Atq Saldo) | constante true |
| B10 | `Show item saldo refinanciar` | #2 | Operação (false: PCON, Port Atq Saldo) | Operação (false: PCON) |
| B11 | `Show item forma pagamento` | #8 | Operação (false: Port Atq Saldo, Port Atq Refin) | constante false |
| B12 | `Show item dinheiro conta` | #10 | Operação (false: Port Atq Saldo) | constante true |
| B13 | `Show item data portabilidade` | #11 | Operação (false: PCON, REFIN) | constante false |
| B14 | `Show item conta recebimento` | #12 | Operação (false: Port Atq Saldo) | constante true |
| B15 | `Show item fonte pagadora` | #13 | constante true | constante false |
| B16 | `Show item matricula` | #14 | constante true | constante false |

> **Total: 16 BOOLEANs públicas** (8 de região + 8 de slot de item).

### 3.4 Slots fixos e condicionais por produto

| # | Slot Core | Vocação | Fixo/Condicional | OP | INSS |
|---|---|---|---|---|---|
| 1 | item-valor-receber | Valor principal da operação | **condicional** (B9) | visível exceto Port Atq Saldo | sempre visível |
| 2 | item-saldo-refinanciar | Saldo a refinanciar / ser portado | **condicional** (B10) | visível em REFIN, Port Atq Refin | visível em REFIN |
| 3 | item-parcelas | Parcelas da operação | fixo | sempre visível | sempre visível |
| 4 | item-total-pagar | Total a pagar | fixo | sempre visível | sempre visível |
| 5 | item-iof | IOF | fixo | sempre visível | sempre visível |
| 6 | item-taxa-juros | Taxa de juros | fixo | sempre visível | sempre visível |
| 7 | item-cet | CET | fixo | sempre visível | sempre visível |
| 8 | item-forma-pagamento | Forma de pagamento | **condicional** (B11) | visível em PCON, REFIN | sempre oculto |
| 9 | item-periodo | Período de pagamento | fixo | sempre visível | sempre visível |
| 10 | item-dinheiro-conta | Data do dinheiro em conta | **condicional** (B12) | visível exceto Port Atq Saldo | sempre visível |
| 11 | item-data-portabilidade | Data prevista para portabilidade | **condicional** (B13) | visível em Port Atq Saldo, Port Atq Refin | sempre oculto |
| 12 | item-conta-recebimento | Conta para recebimento | **condicional** (B14) | visível exceto Port Atq Saldo | sempre visível |
| 13 | item-fonte-pagadora | Fonte pagadora | **condicional** (B15) | sempre visível | sempre oculto |
| 14 | item-matricula | Matrícula | **condicional** (B16) | sempre visível | sempre oculto |

> **6 slots fixos** (parcelas, total-pagar, iof, taxa-juros, cet, periodo).
> **8 slots condicionais** — cada um com uma BOOLEAN pública.
> O item oculto do INSS (posição 7 em PCON / 8 em REFIN, contando a partir de 1) ocupa a mesma posição relativa que item-forma-pagamento (slot #8). Plausível que seja o mesmo slot; vocação a confirmar (T-6).

### 3.5 Cadeia de instâncias aninhadas do Item default — acesso ao texto

O texto de cada item é mantido por instâncias de **Label / Content** (iDS [v2]), component set "Label / Content", com as seguintes properties públicas: `Content` (TEXT, key `Content#60:0`), `Contrast` (VARIANT), `Style` (VARIANT), `Size` (VARIANT), `Is bold` (VARIANT).

**Cadeia completa (3 níveis de instância):**

| Nível | Instância | Componente | Exposta por | Contém |
|---|---|---|---|---|
| L1 | **Label box** | .Label box | Item default (exposedInstance) | Label 01, Label 02 |
| L2 | **Label 01** | Label / Content | NÃO exposta (Label box.exposedInstances = []) | Content TEXT = label do item |
| L2 | **Label 02** | Label / Content | NÃO exposta (Label box.exposedInstances = []) | Content TEXT = valor do item |
| L1 | **Supporting item** | .Item default / Supporting item | Item default (exposedInstance) | .Description box |
| L2 | **.Description box** | .Description box | NÃO exposta (Supporting item.exposedInstances = []) | Description 01 |
| L3 | **Description 01** | Label / Content | NÃO exposta (Description box.exposedInstances = []) | Content TEXT = texto do supporting |

> Confirmação: Label box, Supporting item e .Description box têm `exposedInstances = []` (vazio). Nenhum nível intermediário expõe Label 01, Label 02 ou Description 01. A property TEXT `Content` existe em cada Label / Content, mas não é acessível ao consumidor do Core apenas pela cadeia de exposição do Item default.

**Mecanismo proposto — instância exposta no Core:**

O Core expõe directamente cada instância de Label / Content (Label 01, Label 02, Description 01) no seu `exposedInstances`, atravessando os 3 níveis de instância aninhada: Core > Item default > Label box > Label 01. O consumidor acede à property `Content` de cada instância exposta no painel de properties.

Para os controles do Item default (Show supporting item, Trailing item, etc.), o Core expõe também cada instância de **Item default**, dando ao consumidor acesso às properties BOOLEAN e VARIANT do Item default.

**Contagem de instâncias expostas para texto:**

| Região | Instâncias de Item default | × Label 01 | × Label 02 | × Description 01 | Subtotal Label/Content |
|---|---|---|---|---|---|
| R4 (lista principal) | 14 | 14 | 14 | 14 | 42 |
| R7 (seção seguro) | 4 | 4 | 4 | 4 | 12 |
| R8 (seção portabilidade) | 4 | 4 | 4 | 4 | 12 |
| **Total** | **22** | **22** | **22** | **22** | **66** |

> **Total de instâncias expostas para acesso a texto:** 66 instâncias de Label / Content.
> **Total de instâncias expostas de Item default (para BOOL/VARIANT):** 22.
> **Grande total de instâncias expostas pelo Core (apenas Item default chain):** 88 (22 Item default + 66 Label / Content).
> Adicionam-se as instâncias expostas de T-9 (8 Body da Tabela), de R5 (1 Body body-condicoes), de R9 (1 Body aviso), de R7/R8 (2 Section headings) e de R6 (1 Banner Highlight). Total geral estimado: ~101 instâncias expostas.
> Prova necessária: ver T-1/T-2 em §7.

---

## 4 · Componentes utilizados

| Componente | Origem | Nome do component set | Properties públicas confirmadas | Classificação |
|---|---|---|---|---|
| Navigation header | [v2] iDS Core Components — Fake | Navigation header | `Text configuration` (VARIANT), `Large title content` (TEXT), `Contrast` (VARIANT), `Is collapsed` (VARIANT), `Show media` (VARIANT) | IDS |
| Item default | [v2] iDS Core Components — Fake | Item default | `Has next item` (BOOL), `Show supporting item` (BOOL), `Show leading item` (BOOL), `Trailing item` (VARIANT: Icon/None), `Contrast` (VARIANT), `Size` (VARIANT), `State` (VARIANT). Instâncias expostas: Label box, Supporting item, Icon. | IDS |
| Label / Content | [v2] iDS Core Components — Fake | Label / Content | `Content` (TEXT, key Content#60:0), `Contrast` (VARIANT), `Style` (VARIANT), `Size` (VARIANT), `Is bold` (VARIANT) | IDS |
| Fixed button | [v2] iDS Core Components — Fake | Fixed button | `Type` (VARIANT), `Show divider` (BOOL). Label via Main button aninhado (`Label content` TEXT). | IDS |
| Body | [v2] iDS Core Components — Fake | Body | `Content` (TEXT), `Contrast` (VARIANT: Default), `Style` (VARIANT), `Size` (VARIANT), `Is bold` (VARIANT) | IDS |
| Section | [v2] iDS Core Components — Fake | Section | `Content` (TEXT, default "Section"), `Contrast` (VARIANT: Default), `Size` (VARIANT: Medium). Chave d35c5a23f055ce949252abba4cdb4936fdb83a0f, remote=true. | IDS |
| Banner Highlight | [v2] iDS Core Components — Fake | Banner Highlight | `Body content` (TEXT), `Has interaction` (BOOL, default true), `Contrast` (VARIANT), `State` (VARIANT), `Show title` (VARIANT) | IDS |
| Tabela comparativa | Composição local | — | nenhuma (componentPropertyDefinitions vazio, exposedInstances vazio) | LOCAL_LAYOUT |

---

## 5 · Blueprint de itens — inventário por ocorrência

### 5.1 INSS — itens por frame (originais, sem adicionais)

**PCON desbloqueado (9:304)** — 10 slots, 9 visíveis + 1 hidden:

| Pos. | Slot Core | Label 01 (Content) | Label 02 (Content) | Vis | HN | SS | TI | Supp (Desc 01 Content) |
|---|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 55.898,46 | ✓ | T | T | Icon | Editar |
| 2 | #3 parcelas | Parcelas | 96× de R$1.324,57 | ✓ | T | T | Icon | Editar |
| 3 | #4 total-pagar | Total a pagar | R$ 127.158,72 | ✓ | T | T | Icon | Saber mais |
| 4 | #5 iof | IOF | R$ 1.936,73 | ✓ | T | F | None | — |
| 5 | #6 taxa-juros | Taxa de juros | 1,85% ao mês e 24,6% ao ano | ✓ | T | F | None | — |
| 6 | #7 cet | Custo Efetivo Total (CET) | 1,95% ao mês e 26,02% ao ano | ✓ | T | F | None | — |
| 7 | #8 forma-pagamento | (hidden) | (hidden) | ✗ | T | F | None | — |
| 8 | #9 periodo | Período de pagamento | Abril de 2026 a março de 2034 | ✓ | T | F | None | — |
| 9 | #10 dinheiro-conta | Dinheiro na conta | Até 12 de fevereiro de 2026 | ✓ | T | F | None | — |
| 10 | #12 conta-recebimento | Conta para recebimento | Agência 2500 \| Conta 58788-2 | ✓ | F | F | None | — |

> Slots ausentes da estrutura INSS: #2 (saldo-refinanciar), #11 (data-portabilidade), #13 (fonte-pagadora), #14 (matrícula).

**PCON bloqueado (10:882)** — idêntico ao desbloqueado exceto:

| Slot | Label 02 bloqueado |
|---|---|
| #10 dinheiro-conta | Após o desbloqueio do benefício |

**REFIN desbloqueado (10:310)** — 11 slots, 10 visíveis + 1 hidden:

| Pos. | Slot Core | Label 01 (Content) | Label 02 (Content) | Vis | HN | SS | TI | Supp (Desc 01 Content) |
|---|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 58.201,57 | ✓ | T | T | Icon | Editar |
| 2 | #2 saldo-refinanciar | Saldo a refinanciar | R$ 355,55 | ✓ | T | T | Icon | Saber mais |
| 3 | #3 parcelas | Parcelas | 96× de R$ 1.357,82 | ✓ | T | T | Icon | Editar |
| 4 | #4 total-pagar | Total a pagar | R$ 130.350,72 | ✓ | T | T | Icon | Saber mais |
| 5 | #5 iof | IOF | R$ 2.018,06 | ✓ | T | F | None | — |
| 6 | #6 taxa-juros | Taxa de juros | 1,79% ao mês e 23,72% ao ano | ✓ | T | F | None | — |
| 7 | #7 cet | Custo Efetivo Total (CET) | 1,88% ao mês e 25,11% ao ano | ✓ | T | F | None | — |
| 8 | #8 forma-pagamento | (hidden) | (hidden) | ✗ | T | F | None | — |
| 9 | #9 periodo | Período de pagamento | Abril de 2026 a março de 2034 | ✓ | T | F | None | — |
| 10 | #10 dinheiro-conta | Dinheiro na conta | Até 12 de fevereiro de 2026 | ✓ | T | F | None | — |
| 11 | #12 conta-recebimento | Conta para recebimento | Agência 2500 \| Conta 58788-2 | ✓ | F | F | None | — |

**REFIN bloqueado (10:1276)** — idêntico ao desbloqueado exceto:

| Slot | Label 02 bloqueado |
|---|---|
| #10 dinheiro-conta | Após o desbloqueio do benefício |

### 5.1b INSS — frames sintéticos com portabilidade de benefício

**PCON desbloqueado com port benefício (48:4389)** — 10 itens R4 (iguais a 9:304) + secao-port-beneficio (4 itens) + aviso:

Itens R4: idênticos à tabela PCON desbloqueado acima.

Seção portabilidade de benefício (R8):

Heading: Section (iDS [v2]), Content = "Portabilidade de benefício"

| # | Slot | Label 01 (Content) | Label 02 (Content) | SS | TI | HN |
|---|---|---|---|---|---|---|
| 1 | port-fonte-pagadora | Fonte pagadora | Governo do Rio de Janeiro | F | None | T |
| 2 | port-cnpj | CNPJ | 42.591.651/1402-39 | F | None | T |
| 3 | port-banco | Banco da conta salário | Bradesco | F | None | T |
| 4 | port-prazo | Prazo de aprovação | Até 5 dias úteis | F | None | T |

Aviso portabilidade de benefício (R9): Body iDS, Content = "Se o próximo salário for pago antes da aprovação, o valor cairá no banco atual."

body-condicoes: Content = "Condições válidas para hoje."
Fixed button: "Continuar"

> ⚠ Conteúdo sintético (FATO_CONFIRMADO_PELA_PESSOA, a pessoa responsável, 29/09/2026): copiado do OP port salário, para uso em teste. Textos que mencionam "salário" ("Banco da conta salário", "Se o próximo salário for pago…") devem ser revisados antes de uso real com portabilidade de benefício.

**PCON bloqueado com port benefício (48:4865)** — idêntico ao desbloqueado exceto:

| Slot | Label 02 bloqueado |
|---|---|
| #10 dinheiro-conta | Após o desbloqueio do benefício |

**REFIN desbloqueado com port benefício (48:5341)** — 11 itens R4 (iguais a 10:310) + secao-port-beneficio (4 itens) + aviso:

Itens R4: idênticos à tabela REFIN desbloqueado acima.
Seção e aviso: idênticos ao PCON sintético acima.
Nav: "Revise as condições do seu refinanciamento"
body-condicoes: "Condições válidas para hoje."

**REFIN bloqueado com port benefício (48:5844)** — idêntico ao desbloqueado exceto:

| Slot | Label 02 bloqueado |
|---|---|
| #10 dinheiro-conta | Após o desbloqueio do benefício |

### 5.2 OP — itens por Operação (14 slots, visibilidade variável)

**Visibilidade por Operação:**

| # | Slot | PCON | REFIN | Port Atq Saldo | Port Atq Refin |
|---|---|---|---|---|---|
| 1 | item-valor-receber | ✓ | ✓ | ✗ | ✓ |
| 2 | item-saldo-refinanciar | ✗ | ✓ | ✗ | ✓ |
| 3 | item-parcelas | ✓ | ✓ | ✓ | ✓ |
| 4 | item-total-pagar | ✓ | ✓ | ✓ | ✓ |
| 5 | item-iof | ✓ | ✓ | ✓ | ✓ |
| 6 | item-taxa-juros | ✓ | ✓ | ✓ | ✓ |
| 7 | item-cet | ✓ | ✓ | ✓ | ✓ |
| 8 | item-forma-pagamento | ✓ | ✓ | ✗ | ✗ |
| 9 | item-periodo | ✓ | ✓ | ✓ | ✓ |
| 10 | item-dinheiro-conta | ✓ | ✓ | ✗ | ✓ |
| 11 | item-data-portabilidade | ✗ | ✗ | ✓ | ✓ |
| 12 | item-conta-recebimento | ✓ | ✓ | ✗ | ✓ |
| 13 | item-fonte-pagadora | ✓ | ✓ | ✓ | ✓ |
| 14 | item-matricula | ✓ | ✓ | ✓ | ✓ |
| | **Total visíveis** | **12** | **13** | **9** | **13** |

**Valores — PCON (13:3705):**

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 7.000,00 | T | Icon | Editar | T |
| 3 | #3 parcelas | Parcelas | 36× de R$ 246,11 | T | Icon | Editar | T |
| 4 | #4 total-pagar | Total a pagar | R$ 12.000,00 | T | Icon | Saber mais | T |
| 5 | #5 iof | IOF | R$ 389,58 | F | None | — | T |
| 6 | #6 taxa-juros | Taxa de juros | 1,79% ao mês e 17,48% ao ano | F | None | — | T |
| 7 | #7 cet | Custo efetivo total (CET) | 1,91% ao mês e 22,92% ao ano | F | None | — | T |
| 8 | #8 forma-pagamento | Forma de pagamento | Desconto na folha de pagamento | F | None | — | T |
| 9 | #9 periodo | Período de pagamento | Novembro de 2025 a novembro de 2029 | F | None | — | T |
| 10 | #10 dinheiro-conta | Dinheiro na conta | Até 1 hora | F | None | — | T |
| 12 | #12 conta-recebimento | Conta para recebimento | Agência 8560 \| Conta 22349-9 | F | None | — | T |
| 13 | #13 fonte-pagadora | Fonte pagadora | Governo do Estado de São Paulo | F | None | — | T |
| 14 | #14 matricula | Matrícula | 123456789 | T | Icon | Saber mais | F |

**Valores — REFIN (13:2882):**

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 10.000,00 | T | Icon | Editar | T |
| 2 | #2 saldo-refinanciar | Saldo a refinanciar | R$ 6.300,00 | T | Icon | Saber mais | T |
| 3 | #3 parcelas | Parcelas | 36× de R$ 246,11 | T | Icon | Editar | T |
| 4 | #4 total-pagar | Total a pagar | R$ 6.752,53 | T | Icon | Saber mais | T |
| 5 | #5 iof | IOF | R$ 160,22 | F | None | — | T |
| 6 | #6 taxa-juros | Taxa de juros | 1,66% ao mês e 25,59% ao ano | F | None | — | T |
| 7 | #7 cet | Custo efetivo total (CET) | 2,02% ao mês e 27,60% ao ano | F | None | — | T |
| 8 | #8 forma-pagamento | Forma de pagamento | Desconto na folha de pagamento | F | None | — | T |
| 9 | #9 periodo | Período de pagamento | Abril de 2024 a abril de 2029 | F | None | — | T |
| 10 | #10 dinheiro-conta | Dinheiro na conta | Até 1 hora | F | None | — | T |
| 12 | #12 conta-recebimento | Conta para recebimento | Agência 8560 \| Conta 22349-9 | F | None | — | T |
| 13 | #13 fonte-pagadora | Fonte pagadora | Governo do Estado de São Paulo | F | None | — | T |
| 14 | #14 matricula | Matrícula | 123456789 | T | Icon | Saber mais | F |

**Valores — Port Ataque Saldo (13:6997):**

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 3 | #3 parcelas | Parcelas | 93× de R$ 590,25 | T | Icon | Editar | T |
| 4 | #4 total-pagar | Total a pagar | R$ 54.893,25 | T | Icon | Saber mais | T |
| 5 | #5 iof | IOF | R$ 0,00 | F | None | — | T |
| 6 | #6 taxa-juros | Taxa de juros | 1,55% ao mês e 18,60% ao ano | F | None | — | T |
| 7 | #7 cet | Custo efetivo total (CET) | 2,24% ao mês e 27,60% ao ano | F | None | — | T |
| 9 | #9 periodo | Período de pagamento | Dezembro de 2024 a dezembro de 2028 | F | None | — | T |
| 11 | #11 data-portabilidade | Data prevista para portabilidade | Até 7 dias úteis | F | None | — | F |
| 13 | #13 fonte-pagadora | Fonte pagadora | Governo do Rio de Janeiro | F | None | — | T |
| 14 | #14 matricula | Matrícula | 90988765 | T | Icon | Saber mais | F |

**Valores — Port Ataque Refin (13:8643):**

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 857,73 | F | Icon | — | T |
| 2 | #2 saldo-refinanciar | Saldo a ser portado | R$ 1.992,50 | F | Icon | — | T |
| 3 | #3 parcelas | Parcelas | 96× de R$ 90,81 | F | Icon | — | T |
| 4 | #4 total-pagar | Total a pagar | R$ 8.717,86 | T | Icon | Saber mais | T |
| 5 | #5 iof | IOF | R$ 1.973,50 | F | None | — | T |
| 6 | #6 taxa-juros | Taxa de juros | 1,55% ao mês e 18,60% ao ano | F | None | — | T |
| 7 | #7 cet | Custo efetivo total (CET) | 2,24% ao mês e 27,60% ao ano | F | None | — | T |
| 9 | #9 periodo | Período de pagamento | Dezembro de 2024 a Dezembro de 2028 | F | None | — | T |
| 10 | #10 dinheiro-conta | Data prevista para dinheiro em conta | Até X dias | F | None | — | T |
| 11 | #11 data-portabilidade | Data prevista para portabilidade | Até 5 dias úteis | F | None | — | T |
| 12 | #12 conta-recebimento | Conta para recebimento | Agência 8560 \| Conta 22349-9 | F | None | — | T |
| 13 | #13 fonte-pagadora | Fonte pagadora | Governo do Rio de Janeiro | F | None | — | T |
| 14 | #14 matricula | Matrícula | 90988765 | F | Icon | — | F |

### 5.3 Seções condicionais do OP

**Seção Seguro do Consignado (R7)** — heading + 4 itens, lido de 13:4528:

Heading: Section (iDS [v2]), Content = "Seguro do Consignado"

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | seg-parcelas | Parcelas | 36× de R$ 12,69 | T | Icon | Editar | T |
| 2 | seg-total-pagar | Total a pagar | R$ 1.218,24 | F | Icon | — | T |
| 3 | seg-forma-pagamento | Forma de pagamento do seguro | Débito em conta | F | None | — | T |
| 4 | seg-conta-debito | Conta a ser debitada o seguro | Agência 8560 Conta 22349-9 | F | None | — | F |

**Seção Portabilidade de salário (R8 — OP)** — heading + 4 itens, lido de 13:5351:

Heading: Section (iDS [v2]), Content = "Portabilidade de salário"

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | port-fonte-pagadora | Fonte pagadora | Governo do Rio de Janeiro | F | None | — | T |
| 2 | port-cnpj | CNPJ | 42.591.651/1402-39 | F | None | — | T |
| 3 | port-banco | Banco da conta salário | Bradesco | F | None | — | T |
| 4 | port-prazo | Prazo de aprovação | Até 5 dias úteis | F | None | — | T |

**Aviso portabilidade (R9 — OP)** — lido de 13:5351:

> Body iDS, Content = "Se o próximo salário for pago antes da aprovação, o valor cairá no banco atual."

### 5.4 Tabela comparativa (R2, LOCAL_LAYOUT — classificação fechada)

Ordem visual (topo → base), lida de Port Atq Refin (13:8643):

| Ordem visual | Nome da camada | col-label | col-valor-1 | col-valor-2 |
|---|---|---|---|---|
| 1 | header-row | Condições no Banco | Com dinheiro extra | Sem dinheiro extra |
| 2 | linha-1 | Parcelas a pagar | 96 | 57 |
| 3 | linha-4 | Valor da parcela | R$ 80,92 | R$ 69,02 |
| 4 | linha-3 | Juros ao mês | 1,55% | 1,55% |
| 5 | linha-2 | Valor a receber | R$ 857,73 | R$ 0 |

> Nomes das camadas não correspondem à ordem visual.
> Total instâncias Body internas: 15. Cada célula: col-frame > Body (iDS [v2]) > "body content" (TEXT).
> Mecanismo TEXT: ver T-9 (§7).

### 5.5 Overlay de operação (R11) — mecanismo de combinação inválida

**FATO_CONFIRMADO_PELA_PESSOA:**

1. O overlay segue o eixo Operação: visível quando Port Ataque (Saldo ou Refin)
2. A rule-operacao-sem-revisao segue Produtos Adicionais: visível quando há qualquer adicional
3. Quando as duas condições coincidem, badge de bloqueio cobre o conteúdo
4. "É o overlay que tem que cobrir, só isso" (pessoa responsável, 29/09/2026) — o overlay cobre o conteúdo incluindo o Fixed button; nenhum controle adicional necessário para o botão nesse estado

**Matriz de comportamento:**

| Operação | Prod. Adicionais | B7 | B8 | Efeito |
|---|---|---|---|---|
| PCON / REFIN | sem adicionais | false | false | nenhum |
| PCON / REFIN | seguro / port / seg+port | false | true (preparado) | nenhum |
| Port Atq Saldo / Refin | sem adicionais | true | false | overlay sem badge |
| Port Atq Saldo / Refin | seguro / port / seg+port | true | true | **badge de bloqueio** |

**Portabilidade Retenção:** FORA_DO_RECORTE (FATO_CONFIRMADO_PELA_PESSOA). Camada rule-port-ret-simples preservada como evidência, texto " ".

### 5.6 Elementos adicionais

**Navigation header — título por Operação:**

| Operação | Large title content |
|---|---|
| PCON | Revise as condições do seu empréstimo |
| REFIN | Revise as condições do seu refinanciamento |
| Port Ataque Saldo | Mais detalhes da portabilidade |
| Port Ataque Refin | Compare condições para a sua portabilidade |

**Fixed button — label por Operação/Produto:**

| Operação / Produto | Label |
|---|---|
| PCON (OP) | Ir para contratação |
| REFIN (OP) | Ir para contratação |
| Port Ataque Saldo | Voltar |
| Port Ataque Refin | Ir para contratação |
| PCON/REFIN (INSS) | Continuar |

**body-condicoes:**

| Produto / Frames | Content (Body iDS) |
|---|---|
| INSS (todos, incl. sintéticos) | Condições válidas para hoje. |
| OP PCON / REFIN | Condições válidas pelos próximos 2 dias úteis |
| OP Port Ataque Saldo / Refin | As condições são válidas para 2 dias |

**Banner (R6) — Port Atq Refin:**

| Property | Valor |
|---|---|
| Body content | Confira também as condições da transferência do seu contrato para o Banco |
| Has interaction | true |
| Show title | False |

**Subtítulo (R3) — Port Atq Refin:**

| Texto |
|---|
| Mais detalhes da portabilidade com dinheiro extra |

---

## 6 · Casos de prova (densidade)

| Caso | Descrição | Frame ref. | Itens R4 | Blocos extras | Altura |
|---|---|---|---|---|---|
| **Menor OP** | Port Ataque Saldo, sem adicionais | 13:6997 | 9 | overlay | 1062 |
| **Menor INSS** | INSS PCON desbloqueado | 9:304 | 9 | 0 | 1110 |
| **Maior INSS sem adicionais** | INSS REFIN — adiciona Saldo a refinanciar | 10:310 | 10 | 0 | 1190 |
| **INSS com port benefício (PCON)** | PCON desbloqueado + seção + aviso (sintético) | 48:4389 | 9 + 4 port | seção + aviso | 1554 |
| **INSS com port benefício (REFIN)** | REFIN desbloqueado + seção + aviso (sintético) | 48:5341 | 10 + 4 port | seção + aviso | 1634 |
| **OP base PCON** | OP PCON sem adicionais | 13:3705 | 12 | 0 | 1326 |
| **OP base REFIN** | OP REFIN sem adicionais | 13:2882 | 13 | 0 | 1406 |
| **OP com tabela** | Port Ataque Refin, sem adicionais | 13:8643 | 13 | tabela+subtítulo+banner+overlay | 1892 |
| **Maior OP** | OP REFIN com seguro+port | 13:2059 | 13 + 4 seg + 4 port | aviso | 2222 |

---

## 7 · Pendências técnicas e de prova

| # | Pendência | Classificação | Status v0.6 |
|---|---|---|---|
| **T-1/T-2** | **Prova de exposição das instâncias Label / Content (Label 01, Label 02, Description 01) no Core.** Cadeia de 3 níveis confirmada: Core > Item default > Label box > Label 01 (Label / Content). Label box.exposedInstances = [] (vazio); Label 01/02 e Description 01 NÃO são expostos pelos níveis intermediários. O Core precisa expor directamente cada Label / Content no seu exposedInstances, atravessando instâncias aninhadas. **Prova:** criar Core com ≥2 Item default; expor Label 01, Label 02, Description 01 de cada um; verificar que Content aparece no painel de properties da instância do Core; alterar Content de cada instância exposta independentemente; confirmar independência. Se exposedInstances não alcançar instâncias a 3 níveis de profundidade (através de 2 instâncias intermediárias de componente), registrar IMPASSE_TECNICO. Inclui também a exposição dos 22 Item default para acesso às suas BOOLEAN/VARIANT (T-3 absorvido). **Contagem total de instâncias expostas do Item default chain: 88** (22 Item default + 66 Label / Content). | BLOQUEIA_TELA_ATUAL | reescrita — absorve T-1, T-2 e T-3 |
| T-6 | Item oculto INSS posição 7 (PCON) / 8 (REFIN) (base 1): vocação a confirmar. Posição relativa alinhada com slot #8 (item-forma-pagamento). | PENDENTE_DA_ETAPA | indexação corrigida |
| T-7 | Diferença entre combinação seguro+port e soma isolada. | PENDENTE_DA_ETAPA | mantida |
| T-8 | Frame duplicado 13:7820. | PENDENTE_DA_ETAPA | mantida |
| **T-9** | **Tabela comparativa — properties TEXT via instância exposta.** As 15 instâncias de Body têm Content (TEXT), mas a Tabela não as promove (componentPropertyDefinitions vazio, exposedInstances vazio). O Core expõe as 8 Body instances das células variáveis via exposedInstances. **Prova:** criar Core com estrutura R2, expor 8 Body instances, verificar Content no painel, alterar independentemente. Se exposedInstances não alcançar, IMPASSE_TECNICO. | BLOQUEIA_TELA_ATUAL | mantida |
| **T-11** | **RESOLVIDO.** FATO_CONFIRMADO_PELA_PESSOA (pessoa responsável, 29/09/2026): "é o overlay que tem que cobrir, só isso". Proposta: o Core não precisa de controle próprio para o Fixed button nesse estado (B7+B8 bastam). Navegação de retorno: ver T-15. | **não bloqueia** | reclassificado |
| T-12 | Port Retenção: FORA_DO_RECORTE. | FORA_DO_RECORTE | FATO_CONFIRMADO_PELA_PESSOA |
| **T-13** | Prova das 8 BOOLEANs de região (B1–B8) com VariableAlias. | BLOQUEIA_TELA_ATUAL | mantida |
| **T-14** | Prova das 8 BOOLEANs de slot de item (B9–B16) com VariableAlias. | BLOQUEIA_TELA_ATUAL | mantida |
| **T-15** | **Navegação de retorno quando overlay visível.** A pessoa responsável confirmou que o overlay "tem que cobrir, só isso". Não confirmou se o Navigation header (voltar, ajuda) fica acessível acima do overlay. Registrada como pergunta, não como bloqueio da tela — o overlay já funciona com B7+B8. | PENDENTE_DA_ETAPA | **nova** |

### Prova mínima proposta (T-1/T-2, inclui T-3)

**Unidade:** 1 frame Core com 2 instâncias de Item default (iDS [v2]).
**Ação:**
1. Expor no Core: Item default 1, Item default 2, Label 01 de cada, Label 02 de cada, Description 01 de cada = 8 instâncias expostas.
2. Na instância do Core, alterar Content de Label 01 do item 1 (label) e verificar que Label 01 do item 2 não muda.
3. Alterar Content de Label 02 do item 1 (valor) e verificar independência.
4. Alterar Content de Description 01 do item 1 (supp text) e verificar independência.
5. Alterar Show supporting item no Item default 1 exposto e verificar que Description 01 aparece/desaparece.
6. Alterar Trailing item no Item default 1 e verificar que o ícone trailing muda.
**Resultado esperado:** 6 textos e controles independentes por item, todos acessíveis via painel de properties sem navegação pela árvore.
**Evidência:** screenshot + log de componentProperties antes e depois.
**Efeito de falha:** IMPASSE_TECNICO na capacidade de exposição multi-nível.

### Prova mínima proposta (T-9)

Sem alteração em relação à v0.5.

### Prova mínima proposta (T-13 + T-14)

Sem alteração em relação à v0.5.

---

## 8 · Conferência da entrega (7 critérios)

| # | Critério | Resultado |
|---|---|---|
| 1 | Todos os frames listados com link individual | ✓ 19/19 em §2 (4 sintéticos marcados) |
| 2 | Contagem reconciliada por produto × eixo | ✓ INSS: 8 (2 Op × 2 Ctx × 2 ProdAd). OP: 11 (4 Op, variável ProdAd, 1 dup). 2 Sections. |
| 3 | Vocação de tela, regiões e campos | ✓ §1.2 (11 regiões, R8 genérica), §5 completo |
| 4 | Blueprint com origem verificada | ✓ §4: 7 IDS + 1 LOCAL_LAYOUT. Label / Content adicionado. |
| 5 | Casos de prova com extremos de densidade | ✓ §6: 9 casos (2 INSS sintéticos adicionados) |
| 6 | Pendências classificadas | ✓ §7: 4 BLOQUEIA (T-1/T-2, T-9, T-13, T-14), 4 PENDENTE_ETAPA (T-6, T-7, T-8, T-15), 1 FORA_RECORTE (T-12), 1 RESOLVIDO (T-11) |
| 7 | Core sem cópia de produto, produto sem vocação comum | ✓ |

### O que ainda impede PRONTO_PARA_PROVA_CORE

- **T-1/T-2:** prova de exposição das Label / Content instances a 3 níveis + Item default para BOOL/VARIANT (88 instâncias)
- **T-9:** prova de exposição das Body instances da Tabela comparativa (8 instâncias)
- **T-13:** prova das 8 BOOLEANs de região com VariableAlias
- **T-14:** prova das 8 BOOLEANs de slot de item com VariableAlias

> T-11 removido desta lista (RESOLVIDO, não bloqueia mais).

<!-- CONTRATO-CORE-FIM -->

<!-- camadas:inicio -->
### Camadas ligáveis

| camada | caminho |
| --- | --- |
| tabela-comparativa | conteudo > tabela-comparativa |
| subtitulo-detalhes | conteudo > detalhes-portabilidade > subtitulo-detalhes |
| banner-port-atq | conteudo > banner-port-atq |
| secao-seguro | conteudo > secao-seguro |
| secao-portabilidade | conteudo > secao-portabilidade |
| aviso-portabilidade | conteudo > aviso-portabilidade |
| overlay-operacao-nao-utilizada | overlay-operacao-nao-utilizada |
| wrapper-rule-operacao-sem-revisao | overlay-operacao-nao-utilizada > wrapper-rule > wrapper-rule-operacao-sem-revisao |
| item-valor-receber | conteudo > detalhes-portabilidade > dados-operacao > item-valor-receber |
| item-saldo-refinanciar | conteudo > detalhes-portabilidade > dados-operacao > item-saldo-refinanciar |
| item-forma-pagamento | conteudo > detalhes-portabilidade > dados-operacao > item-forma-pagamento |
| item-dinheiro-conta | conteudo > detalhes-portabilidade > dados-operacao > item-dinheiro-conta |
| item-data-portabilidade | conteudo > detalhes-portabilidade > dados-operacao > item-data-portabilidade |
| item-conta-recebimento | conteudo > detalhes-portabilidade > dados-operacao > item-conta-recebimento |
| item-fonte-pagadora | conteudo > detalhes-portabilidade > dados-operacao > item-fonte-pagadora |
| item-matricula | conteudo > detalhes-portabilidade > dados-operacao > item-matricula |
<!-- camadas:fim -->

<!-- core:inicio -->
### Chave publicada do Core

| componente | chave | arquivo do Core | publicado em | nota |
| --- | --- | --- | --- | --- |
| core-revisao | 4a27f4beda4fa387be07dfe3cfb352b566e61d46 | https://www.figma.com/design/ZNL40Wf9QXl3qE7l4ZCrda?node-id=68-4489 | 2026-09-29 | Consignado Core Components. A chave não muda ao republicar o Core (verificado); só muda se o componente for recriado. |
<!-- core:fim -->
