<!-- CONTRATO-INSS-INICIO -->
# Contrato do Produto INSS — Tela Revisão (v0.6)

> **Versão:** 0.10 · **Rodada:** 2026-09-29
> **Etapa:** Formalização do crédito consignado
> **Tela:** Revisão · **Produto:** INSS
> **Arquivo de referência:** ZNL40Wf9QXl3qE7l4ZCrda
> **Δ 0.5 → 0.6:** Produtos Adicionais restaurado (portabilidade de benefício, FATO_CONFIRMADO_PELA_PESSOA); 4 frames sintéticos adicionados ao inventário; BOOLEANs B5/B6 configurados; conteúdo sintético documentado com caveat "salário"; indexação corrigida; T-11 resolvido.

---

## 1 · Eixos que influenciam esta tela

| Eixo | Valores observados | Implementação | Fonte |
|---|---|---|---|
| **Operação** | PCON, REFIN | Mode em coleção própria na biblioteca INSS | FATO_CONFIRMADO_PELA_PESSOA |
| **Contexto** | desbloqueado, bloqueado | Mode em coleção própria na biblioteca INSS | FATO_CONFIRMADO_PELA_PESSOA |
| **Produtos Adicionais** | sem adicionais, portabilidade de benefício | Mode em coleção própria na biblioteca INSS. Portabilidade de benefício é o único adicional do INSS (sem seguro). | FATO_CONFIRMADO_PELA_PESSOA |

> Cobertura visual de Produtos Adicionais INSS: **coberta por frame sintético** (4 frames, 48:4389–48:5844). FATO_CONFIRMADO_PELA_PESSOA (pessoa responsável, 29/09/2026): criados para teste; conteúdo copiado do OP port salário, com título trocado para "Portabilidade de benefício". Natureza sintética, não observação.
> A Revisão com portabilidade de benefício ainda não está no ar (FATO_CONFIRMADO_PELA_PESSOA, a pessoa responsável, 29/09/2026).

---

## 2 · Matriz de influência: Operação × Contexto × Produtos Adicionais

### 2.1 Frames por combinação

| | desbloqueado, sem adic. | bloqueado, sem adic. | desbloqueado, port benef. | bloqueado, port benef. |
|---|---|---|---|---|
| **PCON** | 9:304 | 10:882 | 48:4389 (sint.) | 48:4865 (sint.) |
| **REFIN** | 10:310 | 10:1276 | 48:5341 (sint.) | 48:5844 (sint.) |

### 2.2 Influência da Operação

| Aspecto | PCON | REFIN | Estado |
|---|---|---|---|
| Título (Large title content) | Revise as condições do seu empréstimo | Revise as condições do seu refinanciamento | INFLUENCIA_ISOLADA_NA_REFERENCIA |
| Item "Saldo a refinanciar" (slot #2) | hidden (B10 = false) | **visible** (B10 = true) | INFLUENCIA_ISOLADA_NA_REFERENCIA |
| Contagem de itens visíveis R4 | 9 | 10 | INFLUENCIA_ISOLADA_NA_REFERENCIA |
| Todos os outros itens R4 | presentes, valores diferentes | presentes, valores diferentes | conteúdo de receita |

### 2.3 Influência do Contexto

| Aspecto | desbloqueado | bloqueado | Estado |
|---|---|---|---|
| Item "Dinheiro na conta" (Label 02) | "Até 12 de fevereiro de 2026" | "Após o desbloqueio do benefício" | INFLUENCIA_ISOLADA_NA_REFERENCIA |
| Todos os outros itens | = | = | SEM_DIFERENCA_OBSERVADA |

### 2.4 Influência dos Produtos Adicionais

| Aspecto | sem adicionais | portabilidade de benefício | Estado |
|---|---|---|---|
| Seção portabilidade (R8) | hidden | **visible** | INFLUENCIA_ISOLADA_NA_REFERENCIA (sint.) |
| Aviso portabilidade (R9) | hidden | **visible** | INFLUENCIA_ISOLADA_NA_REFERENCIA (sint.) |
| Itens R4 | = | = | SEM_DIFERENCA_OBSERVADA |
| body-condicoes | = | = | SEM_DIFERENCA_OBSERVADA |

---

## 3 · Conteúdo da receita INSS

### 3.1 Navigation header

| Operação | Large title content |
|---|---|
| PCON | Revise as condições do seu empréstimo |
| REFIN | Revise as condições do seu refinanciamento |

### 3.2 Configuração dos BOOLEANs do Core pela receita INSS

**BOOLEANs de região:**

| BOOLEAN | Valor INSS | Binding |
|---|---|---|
| B1 Show tabela comparativa | false (constante) | — |
| B2 Show subtitulo detalhes | false (constante) | — |
| B3 Show banner | false (constante) | — |
| B4 Show secao seguro | false (constante) | — |
| B5 Show secao portabilidade | variável | VariableAlias → coleção Prod. Adicionais INSS (false: sem adicionais; true: portabilidade de benefício) |
| B6 Show aviso portabilidade | variável | VariableAlias → coleção Prod. Adicionais INSS (false: sem adicionais; true: portabilidade de benefício) |
| B7 Show overlay | false (constante) | — |
| B8 Show rule bloqueio | false (constante) | — |

**BOOLEANs de slot de item:**

| BOOLEAN | Valor INSS | Binding |
|---|---|---|
| B9 Show item valor receber | true (constante) | — |
| B10 Show item saldo refinanciar | variável | VariableAlias → coleção Operação (false em PCON, true em REFIN) |
| B11 Show item forma pagamento | false (constante) | — |
| B12 Show item dinheiro conta | true (constante) | — |
| B13 Show item data portabilidade | false (constante) | — |
| B14 Show item conta recebimento | true (constante) | — |
| B15 Show item fonte pagadora | false (constante) | — |
| B16 Show item matricula | false (constante) | — |

### 3.3 Itens da operação — valores lidos dos nós

**PCON** (valores de 9:304, desbloqueado; Ctx bloq = diferenças com 10:882):

| Pos. | Slot Core | Label 01 | Label 02 | SS | TI | Supp | Ctx bloq |
|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 55.898,46 | T | Icon | Editar | = |
| 2 | #3 parcelas | Parcelas | 96× de R$1.324,57 | T | Icon | Editar | = |
| 3 | #4 total-pagar | Total a pagar | R$ 127.158,72 | T | Icon | Saber mais | = |
| 4 | #5 iof | IOF | R$ 1.936,73 | F | None | — | = |
| 5 | #6 taxa-juros | Taxa de juros | 1,85% ao mês e 24,6% ao ano | F | None | — | = |
| 6 | #7 cet | Custo Efetivo Total (CET) | 1,95% ao mês e 26,02% ao ano | F | None | — | = |
| 7 | #8 forma-pagamento | (hidden, B11=false) | — | — | — | — | = |
| 8 | #9 periodo | Período de pagamento | Abril de 2026 a março de 2034 | F | None | — | = |
| 9 | #10 dinheiro-conta | Dinheiro na conta | Até 12 de fevereiro de 2026 | F | None | — | **Após o desbloqueio do benefício** |
| 10 | #12 conta-recebimento | Conta para recebimento | Agência 2500 \| Conta 58788-2 | F | None | — | = |

**REFIN** (valores de 10:310, desbloqueado; Ctx bloq = diferenças com 10:1276):

| Pos. | Slot Core | Label 01 | Label 02 | SS | TI | Supp | Ctx bloq |
|---|---|---|---|---|---|---|---|
| 1 | #1 valor-receber | Valor a receber | R$ 58.201,57 | T | Icon | Editar | = |
| 2 | #2 saldo-refinanciar | Saldo a refinanciar | R$ 355,55 | T | Icon | Saber mais | = |
| 3 | #3 parcelas | Parcelas | 96× de R$ 1.357,82 | T | Icon | Editar | = |
| 4 | #4 total-pagar | Total a pagar | R$ 130.350,72 | T | Icon | Saber mais | = |
| 5 | #5 iof | IOF | R$ 2.018,06 | F | None | — | = |
| 6 | #6 taxa-juros | Taxa de juros | 1,79% ao mês e 23,72% ao ano | F | None | — | = |
| 7 | #7 cet | Custo Efetivo Total (CET) | 1,88% ao mês e 25,11% ao ano | F | None | — | = |
| 8 | #8 forma-pagamento | (hidden, B11=false) | — | — | — | — | = |
| 9 | #9 periodo | Período de pagamento | Abril de 2026 a março de 2034 | F | None | — | = |
| 10 | #10 dinheiro-conta | Dinheiro na conta | Até 12 de fevereiro de 2026 | F | None | — | **Após o desbloqueio do benefício** |
| 11 | #12 conta-recebimento | Conta para recebimento | Agência 2500 \| Conta 58788-2 | F | None | — | = |

### 3.4 Seção portabilidade de benefício (R8, conteúdo sintético)

Heading: Section (iDS [v2]), Content = "Portabilidade de benefício"

| # | Slot | Label 01 | Label 02 | SS | TI | HN |
|---|---|---|---|---|---|---|
| 1 | port-fonte-pagadora | Fonte pagadora | Governo do Rio de Janeiro | F | None | T |
| 2 | port-cnpj | CNPJ | 42.591.651/1402-39 | F | None | T |
| 3 | port-banco | Banco da conta salário | Bradesco | F | None | T |
| 4 | port-prazo | Prazo de aprovação | Até 5 dias úteis | F | None | T |

Aviso portabilidade de benefício (R9): Body iDS, Content = "Se o próximo salário for pago antes da aprovação, o valor cairá no banco atual."

> ⚠ **Conteúdo sintético** (FATO_CONFIRMADO_PELA_PESSOA, a pessoa responsável, 29/09/2026): copiado do OP port salário para teste. Textos que mencionam "salário" e devem ser revisados antes de uso real:
> - port-banco Label 01: "Banco da conta **salário**"
> - Aviso R9: "Se o próximo **salário** for pago…"
> O título da Section já foi corrigido: "Portabilidade de benefício".

### 3.5 Texto de condições (R5)

| Content (Body iDS) |
|---|
| Condições válidas para hoje. |

### 3.6 Fixed button (R10)

| Label |
|---|
| Continuar |

### 3.7 Regiões não utilizadas pelo INSS

R2 (Tabela comparativa), R3 (Subtítulo), R6 (Banner), R7 (Seção Seguro), R11 (Overlay) — BOOLEANs B1–B4, B7, B8 = false constante.

Slots ausentes: #11 (data-portabilidade), #13 (fonte-pagadora), #14 (matrícula) — B13, B15, B16 = false constante. Slot #8 (forma-pagamento) — B11 = false constante (vocação T-6).

---

## 4 · Pendências do produto INSS

| # | Pendência | Classificação | Status v0.6 |
|---|---|---|---|
| I-1 | Cobertura de Produtos Adicionais (portabilidade de benefício): coberta por frame sintético (48:4389–48:5844). | RESOLVIDO | coberta |
| I-2 | Vocação do item oculto posição 7 (PCON) / 8 (REFIN) (base 1) — mapeamento plausível para slot #8 (forma-pagamento). | PENDENTE_DA_ETAPA | indexação corrigida |
| I-3 | Capitalização "Custo Efetivo Total (CET)" (INSS) vs "Custo efetivo total (CET)" (OP). | PENDENTE_DA_ETAPA | mantida |
| I-4 | Textos sintéticos de R8/R9 com referência a "salário" devem ser revisados para uso real com portabilidade de benefício. | PENDENTE_DA_ETAPA | **nova** |

### O que impede PRONTO_PARA_PROVA_INSS

Nenhuma pendência própria do INSS bloqueia a prova. A prova depende das pendências do Core (T-1/T-2, T-9, T-13, T-14).

<!-- CONTRATO-INSS-FIM -->

<!-- pacote:inicio -->
## Fonte do pacote

Lida pelo gerador de pacotes. Textos e valores podem ser alterados; **ids, alvos, eixos e modos não** (são a referência entre o contrato, o pacote e o Figma).

### Configuração

| chave | valor |
| --- | --- |
| etapa.nome | Formalização do crédito consignado |
| etapa.versao | 0.1 |
| chassi.versao | 1.0 |
| produto.versao | 0.9 |
| tela.id | revisao |
| tela.nome | Revisão |
| tela.versao | 0.9 |
| estado | technical-proof |

### Eixos

| eixo | coleção | modos |
| --- | --- | --- |
| operation | Operação | PCON ; REFIN |
| context | Contexto | desbloqueado ; bloqueado |
| additional | Produtos Adicionais | sem adicionais ; portabilidade de benefício |

### Notas

| nota |
| --- |
| Prova técnica. coreKey do core-revisao lida no Figma em 29/09/2026 (arquivo do Core publicado como "Consignado Core Components"); republicar o Core não muda a chave. Botão do Fixed button: instância "Primary". |
| Estados de contrato: proposal. Textos e valores vêm de contratos-v0.6.md (INSS, seção 3), incluindo conteúdo sintético de portabilidade de benefício (pendência I-4: textos com "salário"). |
| Caminhos de texto omitem os frames intermediários do Core (dados-operacao, secao-*), pois resolveInstancePath só atravessa INSTANCE. |

### Ligações

| id | tipo | alvo | eixo | fixa | padrão |
| --- | --- | --- | --- | --- | --- |
| texto-titulo | STRING | componente: Navigation header :: Large title content | operation |  | Revise as condições do seu empréstimo |
| texto-botao | STRING | componente: Fixed button > Primary :: Label content |  |  | Continuar |
| texto-condicoes | STRING | componente: body-condicoes :: Content |  |  | Condições válidas para hoje. |
| texto-item-valor-receber-label-01 | STRING | componente: item-valor-receber > Label 01 :: Content |  |  | Valor a receber |
| texto-item-valor-receber-label-02 | STRING | componente: item-valor-receber > Label 02 :: Content | operation |  | R$ 55.898,46 |
| texto-item-valor-receber-descricao-01 | STRING | componente: item-valor-receber > Description 01 :: Content |  |  | Editar |
| texto-item-saldo-refinanciar-label-01 | STRING | componente: item-saldo-refinanciar > Label 01 :: Content | operation |  |  |
| texto-item-saldo-refinanciar-label-02 | STRING | componente: item-saldo-refinanciar > Label 02 :: Content | operation |  |  |
| texto-item-saldo-refinanciar-descricao-01 | STRING | componente: item-saldo-refinanciar > Description 01 :: Content | operation |  |  |
| texto-item-parcelas-label-01 | STRING | componente: item-parcelas > Label 01 :: Content |  |  | Parcelas |
| texto-item-parcelas-label-02 | STRING | componente: item-parcelas > Label 02 :: Content | operation |  | 96× de R$1.324,57 |
| texto-item-parcelas-descricao-01 | STRING | componente: item-parcelas > Description 01 :: Content |  |  | Editar |
| texto-item-total-pagar-label-01 | STRING | componente: item-total-pagar > Label 01 :: Content |  |  | Total a pagar |
| texto-item-total-pagar-label-02 | STRING | componente: item-total-pagar > Label 02 :: Content | operation |  | R$ 127.158,72 |
| texto-item-total-pagar-descricao-01 | STRING | componente: item-total-pagar > Description 01 :: Content |  |  | Saber mais |
| texto-item-iof-label-01 | STRING | componente: item-iof > Label 01 :: Content |  |  | IOF |
| texto-item-iof-label-02 | STRING | componente: item-iof > Label 02 :: Content | operation |  | R$ 1.936,73 |
| texto-item-taxa-juros-label-01 | STRING | componente: item-taxa-juros > Label 01 :: Content |  |  | Taxa de juros |
| texto-item-taxa-juros-label-02 | STRING | componente: item-taxa-juros > Label 02 :: Content | operation |  | 1,85% ao mês e 24,6% ao ano |
| texto-item-cet-label-01 | STRING | componente: item-cet > Label 01 :: Content |  |  | Custo Efetivo Total (CET) |
| texto-item-cet-label-02 | STRING | componente: item-cet > Label 02 :: Content | operation |  | 1,95% ao mês e 26,02% ao ano |
| texto-item-periodo-label-01 | STRING | componente: item-periodo > Label 01 :: Content |  |  | Período de pagamento |
| texto-item-periodo-label-02 | STRING | componente: item-periodo > Label 02 :: Content |  |  | Abril de 2026 a março de 2034 |
| texto-item-dinheiro-conta-label-01 | STRING | componente: item-dinheiro-conta > Label 01 :: Content |  |  | Dinheiro na conta |
| texto-item-dinheiro-conta-label-02 | STRING | componente: item-dinheiro-conta > Label 02 :: Content | context |  | Até 12 de fevereiro de 2026 |
| texto-item-conta-recebimento-label-01 | STRING | componente: item-conta-recebimento > Label 01 :: Content |  |  | Conta para recebimento |
| texto-item-conta-recebimento-label-02 | STRING | componente: item-conta-recebimento > Label 02 :: Content |  |  | Agência 2500 \| Conta 58788-2 |
| texto-section-portabilidade | STRING | componente: section-portabilidade :: Content | additional |  |  |
| texto-port-fonte-pagadora-label-01 | STRING | componente: port-fonte-pagadora > Label 01 :: Content | additional |  |  |
| texto-port-fonte-pagadora-label-02 | STRING | componente: port-fonte-pagadora > Label 02 :: Content | additional |  |  |
| texto-port-cnpj-label-01 | STRING | componente: port-cnpj > Label 01 :: Content | additional |  |  |
| texto-port-cnpj-label-02 | STRING | componente: port-cnpj > Label 02 :: Content | additional |  |  |
| texto-port-banco-label-01 | STRING | componente: port-banco > Label 01 :: Content | additional |  |  |
| texto-port-banco-label-02 | STRING | componente: port-banco > Label 02 :: Content | additional |  |  |
| texto-port-prazo-label-01 | STRING | componente: port-prazo > Label 01 :: Content | additional |  |  |
| texto-port-prazo-label-02 | STRING | componente: port-prazo > Label 02 :: Content | additional |  |  |
| texto-aviso-portabilidade | STRING | componente: aviso-portabilidade :: Content | additional |  |  |
| prop-item-valor-receber-trailing-item | STRING | componente: item-valor-receber :: Trailing item |  | sim | Icon |
| prop-item-saldo-refinanciar-trailing-item | STRING | componente: item-saldo-refinanciar :: Trailing item |  | sim | Icon |
| prop-item-parcelas-trailing-item | STRING | componente: item-parcelas :: Trailing item |  | sim | Icon |
| prop-item-total-pagar-trailing-item | STRING | componente: item-total-pagar :: Trailing item |  | sim | Icon |
| prop-item-iof-trailing-item | STRING | componente: item-iof :: Trailing item |  | sim | None |
| prop-item-taxa-juros-trailing-item | STRING | componente: item-taxa-juros :: Trailing item |  | sim | None |
| prop-item-cet-trailing-item | STRING | componente: item-cet :: Trailing item |  | sim | None |
| prop-item-forma-pagamento-trailing-item | STRING | componente: item-forma-pagamento :: Trailing item |  | sim | None |
| prop-item-periodo-trailing-item | STRING | componente: item-periodo :: Trailing item |  | sim | None |
| prop-item-dinheiro-conta-trailing-item | STRING | componente: item-dinheiro-conta :: Trailing item |  | sim | None |
| prop-item-data-portabilidade-trailing-item | STRING | componente: item-data-portabilidade :: Trailing item |  | sim | None |
| prop-item-conta-recebimento-trailing-item | STRING | componente: item-conta-recebimento :: Trailing item |  | sim | None |
| prop-item-fonte-pagadora-trailing-item | STRING | componente: item-fonte-pagadora :: Trailing item |  | sim | None |
| prop-item-matricula-trailing-item | STRING | componente: item-matricula :: Trailing item |  | sim | None |
| prop-port-fonte-pagadora-trailing-item | STRING | componente: port-fonte-pagadora :: Trailing item |  | sim | None |
| prop-port-cnpj-trailing-item | STRING | componente: port-cnpj :: Trailing item |  | sim | None |
| prop-port-banco-trailing-item | STRING | componente: port-banco :: Trailing item |  | sim | None |
| prop-port-prazo-trailing-item | STRING | componente: port-prazo :: Trailing item |  | sim | None |
| prop-item-valor-receber-show-supporting-item | BOOLEAN | componente: item-valor-receber :: Show supporting item |  |  | true |
| prop-item-valor-receber-show-leading-item | BOOLEAN | componente: item-valor-receber :: Show leading item |  | sim | false |
| prop-item-valor-receber-has-next-item | BOOLEAN | componente: item-valor-receber :: Has next item |  |  | true |
| prop-item-saldo-refinanciar-show-supporting-item | BOOLEAN | componente: item-saldo-refinanciar :: Show supporting item |  |  | true |
| prop-item-saldo-refinanciar-show-leading-item | BOOLEAN | componente: item-saldo-refinanciar :: Show leading item |  | sim | false |
| prop-item-saldo-refinanciar-has-next-item | BOOLEAN | componente: item-saldo-refinanciar :: Has next item |  |  | true |
| prop-item-parcelas-show-supporting-item | BOOLEAN | componente: item-parcelas :: Show supporting item |  |  | true |
| prop-item-parcelas-show-leading-item | BOOLEAN | componente: item-parcelas :: Show leading item |  | sim | false |
| prop-item-parcelas-has-next-item | BOOLEAN | componente: item-parcelas :: Has next item |  |  | true |
| prop-item-total-pagar-show-supporting-item | BOOLEAN | componente: item-total-pagar :: Show supporting item |  |  | true |
| prop-item-total-pagar-show-leading-item | BOOLEAN | componente: item-total-pagar :: Show leading item |  | sim | false |
| prop-item-total-pagar-has-next-item | BOOLEAN | componente: item-total-pagar :: Has next item |  |  | true |
| prop-item-iof-show-supporting-item | BOOLEAN | componente: item-iof :: Show supporting item |  |  | false |
| prop-item-iof-show-leading-item | BOOLEAN | componente: item-iof :: Show leading item |  | sim | false |
| prop-item-iof-has-next-item | BOOLEAN | componente: item-iof :: Has next item |  |  | true |
| prop-item-taxa-juros-show-supporting-item | BOOLEAN | componente: item-taxa-juros :: Show supporting item |  |  | false |
| prop-item-taxa-juros-show-leading-item | BOOLEAN | componente: item-taxa-juros :: Show leading item |  | sim | false |
| prop-item-taxa-juros-has-next-item | BOOLEAN | componente: item-taxa-juros :: Has next item |  |  | true |
| prop-item-cet-show-supporting-item | BOOLEAN | componente: item-cet :: Show supporting item |  |  | false |
| prop-item-cet-show-leading-item | BOOLEAN | componente: item-cet :: Show leading item |  | sim | false |
| prop-item-cet-has-next-item | BOOLEAN | componente: item-cet :: Has next item |  |  | true |
| prop-item-forma-pagamento-show-supporting-item | BOOLEAN | componente: item-forma-pagamento :: Show supporting item |  |  | false |
| prop-item-forma-pagamento-show-leading-item | BOOLEAN | componente: item-forma-pagamento :: Show leading item |  | sim | false |
| prop-item-forma-pagamento-has-next-item | BOOLEAN | componente: item-forma-pagamento :: Has next item |  |  | true |
| prop-item-periodo-show-supporting-item | BOOLEAN | componente: item-periodo :: Show supporting item |  |  | false |
| prop-item-periodo-show-leading-item | BOOLEAN | componente: item-periodo :: Show leading item |  | sim | false |
| prop-item-periodo-has-next-item | BOOLEAN | componente: item-periodo :: Has next item |  |  | true |
| prop-item-dinheiro-conta-show-supporting-item | BOOLEAN | componente: item-dinheiro-conta :: Show supporting item |  |  | false |
| prop-item-dinheiro-conta-show-leading-item | BOOLEAN | componente: item-dinheiro-conta :: Show leading item |  | sim | false |
| prop-item-dinheiro-conta-has-next-item | BOOLEAN | componente: item-dinheiro-conta :: Has next item |  |  | true |
| prop-item-data-portabilidade-show-supporting-item | BOOLEAN | componente: item-data-portabilidade :: Show supporting item |  |  | false |
| prop-item-data-portabilidade-show-leading-item | BOOLEAN | componente: item-data-portabilidade :: Show leading item |  | sim | false |
| prop-item-data-portabilidade-has-next-item | BOOLEAN | componente: item-data-portabilidade :: Has next item |  |  | true |
| prop-item-conta-recebimento-show-supporting-item | BOOLEAN | componente: item-conta-recebimento :: Show supporting item |  |  | false |
| prop-item-conta-recebimento-show-leading-item | BOOLEAN | componente: item-conta-recebimento :: Show leading item |  | sim | false |
| prop-item-conta-recebimento-has-next-item | BOOLEAN | componente: item-conta-recebimento :: Has next item |  |  | false |
| prop-item-fonte-pagadora-show-supporting-item | BOOLEAN | componente: item-fonte-pagadora :: Show supporting item |  |  | false |
| prop-item-fonte-pagadora-show-leading-item | BOOLEAN | componente: item-fonte-pagadora :: Show leading item |  | sim | false |
| prop-item-fonte-pagadora-has-next-item | BOOLEAN | componente: item-fonte-pagadora :: Has next item |  |  | true |
| prop-item-matricula-show-supporting-item | BOOLEAN | componente: item-matricula :: Show supporting item |  |  | false |
| prop-item-matricula-show-leading-item | BOOLEAN | componente: item-matricula :: Show leading item |  | sim | false |
| prop-item-matricula-has-next-item | BOOLEAN | componente: item-matricula :: Has next item |  |  | true |
| prop-port-fonte-pagadora-show-supporting-item | BOOLEAN | componente: port-fonte-pagadora :: Show supporting item |  |  | false |
| prop-port-fonte-pagadora-show-leading-item | BOOLEAN | componente: port-fonte-pagadora :: Show leading item |  | sim | false |
| prop-port-fonte-pagadora-has-next-item | BOOLEAN | componente: port-fonte-pagadora :: Has next item |  |  | true |
| prop-port-cnpj-show-supporting-item | BOOLEAN | componente: port-cnpj :: Show supporting item |  |  | false |
| prop-port-cnpj-show-leading-item | BOOLEAN | componente: port-cnpj :: Show leading item |  | sim | false |
| prop-port-cnpj-has-next-item | BOOLEAN | componente: port-cnpj :: Has next item |  |  | true |
| prop-port-banco-show-supporting-item | BOOLEAN | componente: port-banco :: Show supporting item |  |  | false |
| prop-port-banco-show-leading-item | BOOLEAN | componente: port-banco :: Show leading item |  | sim | false |
| prop-port-banco-has-next-item | BOOLEAN | componente: port-banco :: Has next item |  |  | true |
| prop-port-prazo-show-supporting-item | BOOLEAN | componente: port-prazo :: Show supporting item |  |  | false |
| prop-port-prazo-show-leading-item | BOOLEAN | componente: port-prazo :: Show leading item |  | sim | false |
| prop-port-prazo-has-next-item | BOOLEAN | componente: port-prazo :: Has next item |  |  | true |
| visivel-tabela-comparativa | BOOLEAN | camada: tabela-comparativa |  |  | false |
| visivel-subtitulo-detalhes | BOOLEAN | camada: subtitulo-detalhes |  |  | false |
| visivel-banner-port-atq | BOOLEAN | camada: banner-port-atq |  |  | false |
| visivel-secao-seguro | BOOLEAN | camada: secao-seguro |  |  | false |
| visivel-secao-portabilidade | BOOLEAN | camada: secao-portabilidade | additional |  | false |
| visivel-aviso-portabilidade | BOOLEAN | camada: aviso-portabilidade | additional |  | false |
| visivel-overlay-operacao-nao-utilizada | BOOLEAN | camada: overlay-operacao-nao-utilizada |  |  | false |
| visivel-wrapper-rule-operacao-sem-revisao | BOOLEAN | camada: wrapper-rule-operacao-sem-revisao |  |  | false |
| visivel-item-valor-receber | BOOLEAN | camada: item-valor-receber |  |  | true |
| visivel-item-saldo-refinanciar | BOOLEAN | camada: item-saldo-refinanciar | operation |  | false |
| visivel-item-forma-pagamento | BOOLEAN | camada: item-forma-pagamento |  |  | false |
| visivel-item-dinheiro-conta | BOOLEAN | camada: item-dinheiro-conta |  |  | true |
| visivel-item-data-portabilidade | BOOLEAN | camada: item-data-portabilidade |  |  | false |
| visivel-item-conta-recebimento | BOOLEAN | camada: item-conta-recebimento |  |  | true |
| visivel-item-fonte-pagadora | BOOLEAN | camada: item-fonte-pagadora |  |  | false |
| visivel-item-matricula | BOOLEAN | camada: item-matricula |  |  | false |

### Valores por modo

| id | modo | valor |
| --- | --- | --- |
| texto-titulo | PCON | Revise as condições do seu empréstimo |
| texto-titulo | REFIN | Revise as condições do seu refinanciamento |
| texto-item-valor-receber-label-02 | PCON | R$ 55.898,46 |
| texto-item-valor-receber-label-02 | REFIN | R$ 58.201,57 |
| texto-item-saldo-refinanciar-label-01 | REFIN | Saldo a refinanciar |
| texto-item-saldo-refinanciar-label-02 | REFIN | R$ 355,55 |
| texto-item-saldo-refinanciar-descricao-01 | REFIN | Saber mais |
| texto-item-parcelas-label-02 | PCON | 96× de R$1.324,57 |
| texto-item-parcelas-label-02 | REFIN | 96× de R$ 1.357,82 |
| texto-item-total-pagar-label-02 | PCON | R$ 127.158,72 |
| texto-item-total-pagar-label-02 | REFIN | R$ 130.350,72 |
| texto-item-iof-label-02 | PCON | R$ 1.936,73 |
| texto-item-iof-label-02 | REFIN | R$ 2.018,06 |
| texto-item-taxa-juros-label-02 | PCON | 1,85% ao mês e 24,6% ao ano |
| texto-item-taxa-juros-label-02 | REFIN | 1,79% ao mês e 23,72% ao ano |
| texto-item-cet-label-02 | PCON | 1,95% ao mês e 26,02% ao ano |
| texto-item-cet-label-02 | REFIN | 1,88% ao mês e 25,11% ao ano |
| texto-item-dinheiro-conta-label-02 | desbloqueado | Até 12 de fevereiro de 2026 |
| texto-item-dinheiro-conta-label-02 | bloqueado | Após o desbloqueio do benefício |
| texto-section-portabilidade | portabilidade de benefício | Portabilidade de benefício |
| texto-port-fonte-pagadora-label-01 | portabilidade de benefício | Fonte pagadora |
| texto-port-fonte-pagadora-label-02 | portabilidade de benefício | Governo do Rio de Janeiro |
| texto-port-cnpj-label-01 | portabilidade de benefício | CNPJ |
| texto-port-cnpj-label-02 | portabilidade de benefício | 42.591.651/1402-39 |
| texto-port-banco-label-01 | portabilidade de benefício | Banco da conta salário |
| texto-port-banco-label-02 | portabilidade de benefício | Bradesco |
| texto-port-prazo-label-01 | portabilidade de benefício | Prazo de aprovação |
| texto-port-prazo-label-02 | portabilidade de benefício | Até 5 dias úteis |
| texto-aviso-portabilidade | portabilidade de benefício | Se o próximo salário for pago antes da aprovação, o valor cairá no banco atual. |
| visivel-secao-portabilidade | sem adicionais | false |
| visivel-secao-portabilidade | portabilidade de benefício | true |
| visivel-aviso-portabilidade | sem adicionais | false |
| visivel-aviso-portabilidade | portabilidade de benefício | true |
| visivel-item-saldo-refinanciar | PCON | false |
| visivel-item-saldo-refinanciar | REFIN | true |
<!-- pacote:fim -->
