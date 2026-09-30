<!-- CONTRATO-OP-INICIO -->
# Contrato do Produto OP (Órgão Público) — Tela Revisão (v0.6)

> **Versão:** 0.10 · **Rodada:** 2026-09-29
> **Etapa:** Formalização do crédito consignado
> **Tela:** Revisão · **Produto:** OP (Órgão Público)
> **Arquivo de referência:** ZNL40Wf9QXl3qE7l4ZCrda
> **Δ 0.5 → 0.6:** R8 renomeada para "Seção de portabilidade" (genérica, título pela receita); T-11 resolvido; B5/B6 renomeados para "portabilidade" (genérico); indexação corrigida.

---

## 1 · Eixos que influenciam esta tela

| Eixo | Valores observados | Implementação | Fonte |
|---|---|---|---|
| **Operação** | PCON, REFIN, Port Ataque Saldo, Port Ataque Refin | Mode em coleção própria na biblioteca OP | FATO_CONFIRMADO_PELA_PESSOA |
| **Contexto** | — | Não influencia esta tela | FATO_CONFIRMADO_PELA_PESSOA |
| **Produtos Adicionais** | sem adicionais, seguro, port salário, seguro+port | Mode em coleção própria na biblioteca OP | FATO_CONFIRMADO_PELA_PESSOA |

> **Port Retenção:** FORA_DO_RECORTE (FATO_CONFIRMADO_PELA_PESSOA). Camada rule-port-ret-simples preservada como evidência no Core.

---

## 2 · Matriz de influência: Operação × Produtos Adicionais

### 2.1 Frames por combinação

| | sem adicionais | seguro | port salário | seguro+port |
|---|---|---|---|---|
| **PCON** | 13:3705 | 13:4528 | 13:5351 | 13:6174 |
| **REFIN** | 13:2882 | 12:855 | 13:1064 | 13:2059 |
| **Port Atq Saldo** | 13:6997 | INVÁLIDA | INVÁLIDA | INVÁLIDA |
| **Port Atq Refin** | 13:8643 | INVÁLIDA | INVÁLIDA | INVÁLIDA |

> Combinações inválidas: FATO_CONFIRMADO_PELA_PESSOA.

### 2.2 Influência da Operação

| Aspecto | PCON | REFIN | Port Atq Saldo | Port Atq Refin | Estado |
|---|---|---|---|---|---|
| Título | Revise as condições do seu empréstimo | Revise as condições do seu refinanciamento | Mais detalhes da portabilidade | Compare condições para a sua portabilidade | INFLUENCIA_ISOLADA |
| item-saldo-refinanciar (#2) | hidden | visible | hidden | visible (label: "Saldo a ser portado") | INFLUENCIA_ISOLADA |
| item-valor-receber (#1) | visible, SS=T | visible, SS=T | hidden | visible, SS=F | INFLUENCIA_ISOLADA |
| item-parcelas (#3) SS | T (Editar) | T (Editar) | T (Editar) | F (sem supp) | INFLUENCIA_ISOLADA |
| item-forma-pagamento (#8) | visible | visible | hidden | hidden | INFLUENCIA_ISOLADA |
| item-dinheiro-conta (#10) | visible, "Dinheiro na conta" | visible, "Dinheiro na conta" | hidden | visible, "Data prevista para dinheiro em conta" | INFLUENCIA_ISOLADA |
| item-data-portabilidade (#11) | hidden | hidden | visible | visible | INFLUENCIA_ISOLADA |
| item-conta-recebimento (#12) | visible | visible | hidden | visible | INFLUENCIA_ISOLADA |
| item-matricula (#14) SS | T (Saber mais) | T (Saber mais) | T (Saber mais) | F (sem supp) | INFLUENCIA_ISOLADA |
| Itens visíveis R4 | 12 | 13 | 9 | 13 | INFLUENCIA_ISOLADA |
| R2/R3/R6 | hidden | hidden | hidden | visible | INFLUENCIA_ISOLADA |
| R11 overlay | hidden | hidden | visible | visible | INFLUENCIA_ISOLADA |
| Fixed button | Ir para contratação | Ir para contratação | Voltar | Ir para contratação | INFLUENCIA_ISOLADA |
| body-condicoes | próximos 2 dias úteis | próximos 2 dias úteis | 2 dias | 2 dias | INFLUENCIA_ISOLADA |

### 2.3 Influência dos Produtos Adicionais

| Aspecto | sem adicionais | seguro | port salário | seguro+port | Estado |
|---|---|---|---|---|---|
| R7 Seção Seguro | hidden | **visible** | hidden | **visible** | INFLUENCIA_ISOLADA |
| R8 Seção Portabilidade | hidden | hidden | **visible** | **visible** | INFLUENCIA_ISOLADA |
| R9 Aviso | hidden | hidden | **visible** | **visible** | INFLUENCIA_ISOLADA |
| R11 rule bloqueio | hidden | **visible** | **visible** | **visible** | FATO_CONFIRMADO_PELA_PESSOA |
| Itens R4 | = | = | = | = | SEM_DIFERENCA_OBSERVADA |

---

## 3 · Conteúdo da receita OP

### 3.1 Navigation header

| Operação | Large title content |
|---|---|
| PCON | Revise as condições do seu empréstimo |
| REFIN | Revise as condições do seu refinanciamento |
| Port Ataque Saldo | Mais detalhes da portabilidade |
| Port Ataque Refin | Compare condições para a sua portabilidade |

### 3.2 Configuração dos BOOLEANs do Core pela receita OP

**BOOLEANs de região:**

| BOOLEAN | Binding OP | Coleção |
|---|---|---|
| B1 Show tabela comparativa | VariableAlias (true: Port Atq Refin) | Operação |
| B2 Show subtitulo detalhes | VariableAlias (true: Port Atq Refin) | Operação |
| B3 Show banner | VariableAlias (true: Port Atq Refin) | Operação |
| B4 Show secao seguro | VariableAlias (true: seguro, seg+port) | Prod. Adicionais |
| B5 Show secao portabilidade | VariableAlias (true: port sal, seg+port) | Prod. Adicionais |
| B6 Show aviso portabilidade | VariableAlias (true: port sal, seg+port) | Prod. Adicionais |
| B7 Show overlay | VariableAlias (true: Port Atq Saldo, Port Atq Refin) | Operação |
| B8 Show rule bloqueio | VariableAlias (true: seguro, port sal, seg+port) | Prod. Adicionais |

**BOOLEANs de slot de item:**

| BOOLEAN | Binding OP | Coleção |
|---|---|---|
| B9 Show item valor receber | VariableAlias (false: Port Atq Saldo) | Operação |
| B10 Show item saldo refinanciar | VariableAlias (false: PCON, Port Atq Saldo) | Operação |
| B11 Show item forma pagamento | VariableAlias (false: Port Atq Saldo, Port Atq Refin) | Operação |
| B12 Show item dinheiro conta | VariableAlias (false: Port Atq Saldo) | Operação |
| B13 Show item data portabilidade | VariableAlias (false: PCON, REFIN) | Operação |
| B14 Show item conta recebimento | VariableAlias (false: Port Atq Saldo) | Operação |
| B15 Show item fonte pagadora | true (constante) | — |
| B16 Show item matricula | true (constante) | — |

### 3.3 Itens da operação — valores completos por Operação

**PCON (13:3705)** — 12 itens visíveis:

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

**REFIN (13:2882)** — 13 itens visíveis:

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

**Port Ataque Saldo (13:6997)** — 9 itens visíveis:

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

**Port Ataque Refin (13:8643)** — 13 itens visíveis:

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

### 3.4 body-condicoes (R5)

| Frames | Content (Body iDS) |
|---|---|
| PCON / REFIN | Condições válidas pelos próximos 2 dias úteis |
| Port Ataque Saldo / Refin | As condições são válidas para 2 dias |

### 3.5 Fixed button (R10)

| Operação | Label |
|---|---|
| PCON | Ir para contratação |
| REFIN | Ir para contratação |
| Port Ataque Saldo | Voltar |
| Port Ataque Refin | Ir para contratação |

### 3.6 Tabela comparativa (R2) — Port Atq Refin

Visível apenas em Port Atq Refin (B1 = true). Conteúdo na ordem visual:

| Ordem | col-label | col-valor-1 | col-valor-2 |
|---|---|---|---|
| 1 (header) | Condições no Banco | Com dinheiro extra | Sem dinheiro extra |
| 2 | Parcelas a pagar | 96 | 57 |
| 3 | Valor da parcela | R$ 80,92 | R$ 69,02 |
| 4 | Juros ao mês | 1,55% | 1,55% |
| 5 | Valor a receber | R$ 857,73 | R$ 0 |

### 3.7 Subtítulo (R3) — Port Atq Refin

| Texto |
|---|
| Mais detalhes da portabilidade com dinheiro extra |

### 3.8 Banner (R6) — Port Atq Refin

| Property | Valor |
|---|---|
| Body content | Confira também as condições da transferência do seu contrato para o Banco |
| Has interaction | true |
| Show title | False |

### 3.9 Seção Seguro do Consignado (R7)

Heading: Section (iDS [v2]), Content = "Seguro do Consignado"

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | seg-parcelas | Parcelas | 36× de R$ 12,69 | T | Icon | Editar | T |
| 2 | seg-total-pagar | Total a pagar | R$ 1.218,24 | F | Icon | — | T |
| 3 | seg-forma-pagamento | Forma de pagamento do seguro | Débito em conta | F | None | — | T |
| 4 | seg-conta-debito | Conta a ser debitada o seguro | Agência 8560 Conta 22349-9 | F | None | — | F |

### 3.10 Seção Portabilidade de salário (R8)

Heading: Section (iDS [v2]), Content = "Portabilidade de salário"

| # | Slot | Label 01 | Label 02 | SS | TI | Supp | HN |
|---|---|---|---|---|---|---|---|
| 1 | port-fonte-pagadora | Fonte pagadora | Governo do Rio de Janeiro | F | None | — | T |
| 2 | port-cnpj | CNPJ | 42.591.651/1402-39 | F | None | — | T |
| 3 | port-banco | Banco da conta salário | Bradesco | F | None | — | T |
| 4 | port-prazo | Prazo de aprovação | Até 5 dias úteis | F | None | — | T |

### 3.11 Aviso portabilidade (R9)

| Texto (body content da Body iDS) |
|---|
| Se o próximo salário for pago antes da aprovação, o valor cairá no banco atual. |

### 3.12 Overlay e regra de bloqueio (R11)

Texto do badge em rule-operacao-sem-revisao: "Combinação inválida: operações de portabilidade de ataque e portabilidade de retenção com refin não permitem produtos adicionais"

Texto do badge em rule-port-ret-simples: " " (espaço). Camada preservada como evidência.

FATO_CONFIRMADO_PELA_PESSOA (pessoa responsável, 29/09/2026): "é o overlay que tem que cobrir, só isso". O overlay cobre o conteúdo, incluindo o Fixed button.

---

## 4 · Pendências do produto OP

| # | Pendência | Classificação | Status v0.6 |
|---|---|---|---|
| O-1 | Port Ataque × Produtos Adicionais: combinações inválidas confirmadas. | RESOLVIDO | FATO_CONFIRMADO_PELA_PESSOA |
| O-2 | Diferença entre combinação seguro+port e soma isolada. | PENDENTE_DA_ETAPA | mantida |
| O-3 | Frame duplicado 13:7820. | PENDENTE_DA_ETAPA | mantida |
| O-6 | Texto de rule-port-ret-simples: " " (espaço). Camada preservada. | PENDENTE_DA_ETAPA | mantida |
| O-7 | Trailing actions removidas em Port Ataque Refin (itens #1–3 e #14 perdem SS). | PENDENTE_DA_ETAPA | mantida |
| O-8 | Port Retenção: operação existente, sem frame. | FORA_DO_RECORTE | FATO_CONFIRMADO_PELA_PESSOA |

### O que impede PRONTO_PARA_PROVA_OP

Pendências do Core (T-1/T-2, T-9, T-13, T-14) que afetam capacidades compartilhadas.

<!-- CONTRATO-OP-FIM -->

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
| operation | Operação | PCON ; REFIN ; Port Ataque Saldo ; Port Ataque Refin |
| context | Contexto | Cl1 ; Cl2 ; Cl2.1 ; GOV.SP ; Cl4 ; Cl5 |
| additional | Produtos Adicionais | sem adicionais ; seguro ; port salário ; seguro+port |

### Notas

| nota |
| --- |
| Prova técnica. coreKey do core-revisao lida no Figma em 29/09/2026 (arquivo do Core publicado como "Consignado Core Components"); republicar o Core não muda a chave. Botão do Fixed button: instância "Primary". |
| Contexto (Cl1, Cl2, Cl2.1, GOV.SP, Cl4, Cl5) não influencia esta tela (contrato OP, seção 1): o eixo existe só com seus modes, sem override. |
| Nomes dos modes de Produtos Adicionais seguem a tabela do contrato OP (seção 1): sem adicionais, seguro, port salário, seguro+port. |
| Nomes das 15 camadas Body da tabela comparativa são inferidos do padrão body-<linha>-col-<coluna> (recibo) e dos nomes de camada do contrato 5.4; confirmar no Core publicado. |
| Caminhos de texto omitem os frames intermediários do Core (dados-operacao, tabela-comparativa, secao-*), pois resolveInstancePath só atravessa INSTANCE. |

### Ligações

| id | tipo | alvo | eixo | fixa | padrão |
| --- | --- | --- | --- | --- | --- |
| texto-titulo | STRING | componente: Navigation header :: Large title content | operation |  | Revise as condições do seu empréstimo |
| texto-botao | STRING | componente: Fixed button > Primary :: Label content | operation |  | Ir para contratação |
| texto-condicoes | STRING | componente: body-condicoes :: Content | operation |  | Condições válidas pelos próximos 2 dias úteis |
| texto-item-valor-receber-label-01 | STRING | componente: item-valor-receber > Label 01 :: Content | operation |  | Valor a receber |
| texto-item-valor-receber-label-02 | STRING | componente: item-valor-receber > Label 02 :: Content | operation |  | R$ 7.000,00 |
| texto-item-valor-receber-descricao-01 | STRING | componente: item-valor-receber > Description 01 :: Content | operation |  | Editar |
| texto-item-saldo-refinanciar-label-01 | STRING | componente: item-saldo-refinanciar > Label 01 :: Content | operation |  |  |
| texto-item-saldo-refinanciar-label-02 | STRING | componente: item-saldo-refinanciar > Label 02 :: Content | operation |  |  |
| texto-item-saldo-refinanciar-descricao-01 | STRING | componente: item-saldo-refinanciar > Description 01 :: Content | operation |  |  |
| texto-item-parcelas-label-01 | STRING | componente: item-parcelas > Label 01 :: Content |  |  | Parcelas |
| texto-item-parcelas-label-02 | STRING | componente: item-parcelas > Label 02 :: Content | operation |  | 36× de R$ 246,11 |
| texto-item-parcelas-descricao-01 | STRING | componente: item-parcelas > Description 01 :: Content | operation |  | Editar |
| texto-item-total-pagar-label-01 | STRING | componente: item-total-pagar > Label 01 :: Content |  |  | Total a pagar |
| texto-item-total-pagar-label-02 | STRING | componente: item-total-pagar > Label 02 :: Content | operation |  | R$ 12.000,00 |
| texto-item-total-pagar-descricao-01 | STRING | componente: item-total-pagar > Description 01 :: Content |  |  | Saber mais |
| texto-item-iof-label-01 | STRING | componente: item-iof > Label 01 :: Content |  |  | IOF |
| texto-item-iof-label-02 | STRING | componente: item-iof > Label 02 :: Content | operation |  | R$ 389,58 |
| texto-item-taxa-juros-label-01 | STRING | componente: item-taxa-juros > Label 01 :: Content |  |  | Taxa de juros |
| texto-item-taxa-juros-label-02 | STRING | componente: item-taxa-juros > Label 02 :: Content | operation |  | 1,79% ao mês e 17,48% ao ano |
| texto-item-cet-label-01 | STRING | componente: item-cet > Label 01 :: Content |  |  | Custo efetivo total (CET) |
| texto-item-cet-label-02 | STRING | componente: item-cet > Label 02 :: Content | operation |  | 1,91% ao mês e 22,92% ao ano |
| texto-item-forma-pagamento-label-01 | STRING | componente: item-forma-pagamento > Label 01 :: Content | operation |  | Forma de pagamento |
| texto-item-forma-pagamento-label-02 | STRING | componente: item-forma-pagamento > Label 02 :: Content | operation |  | Desconto na folha de pagamento |
| texto-item-periodo-label-01 | STRING | componente: item-periodo > Label 01 :: Content |  |  | Período de pagamento |
| texto-item-periodo-label-02 | STRING | componente: item-periodo > Label 02 :: Content | operation |  | Novembro de 2025 a novembro de 2029 |
| texto-item-dinheiro-conta-label-01 | STRING | componente: item-dinheiro-conta > Label 01 :: Content | operation |  | Dinheiro na conta |
| texto-item-dinheiro-conta-label-02 | STRING | componente: item-dinheiro-conta > Label 02 :: Content | operation |  | Até 1 hora |
| texto-item-data-portabilidade-label-01 | STRING | componente: item-data-portabilidade > Label 01 :: Content | operation |  |  |
| texto-item-data-portabilidade-label-02 | STRING | componente: item-data-portabilidade > Label 02 :: Content | operation |  |  |
| texto-item-conta-recebimento-label-01 | STRING | componente: item-conta-recebimento > Label 01 :: Content | operation |  | Conta para recebimento |
| texto-item-conta-recebimento-label-02 | STRING | componente: item-conta-recebimento > Label 02 :: Content | operation |  | Agência 8560 \| Conta 22349-9 |
| texto-item-fonte-pagadora-label-01 | STRING | componente: item-fonte-pagadora > Label 01 :: Content |  |  | Fonte pagadora |
| texto-item-fonte-pagadora-label-02 | STRING | componente: item-fonte-pagadora > Label 02 :: Content | operation |  | Governo do Estado de São Paulo |
| texto-item-matricula-label-01 | STRING | componente: item-matricula > Label 01 :: Content |  |  | Matrícula |
| texto-item-matricula-label-02 | STRING | componente: item-matricula > Label 02 :: Content | operation |  | 123456789 |
| texto-item-matricula-descricao-01 | STRING | componente: item-matricula > Description 01 :: Content | operation |  | Saber mais |
| texto-tabela-header-row-col-label | STRING | componente: body-header-row-col-label :: Content | operation |  |  |
| texto-tabela-header-row-col-valor-1 | STRING | componente: body-header-row-col-valor-1 :: Content | operation |  |  |
| texto-tabela-header-row-col-valor-2 | STRING | componente: body-header-row-col-valor-2 :: Content | operation |  |  |
| texto-tabela-linha-1-col-label | STRING | componente: body-linha-1-col-label :: Content | operation |  |  |
| texto-tabela-linha-1-col-valor-1 | STRING | componente: body-linha-1-col-valor-1 :: Content | operation |  |  |
| texto-tabela-linha-1-col-valor-2 | STRING | componente: body-linha-1-col-valor-2 :: Content | operation |  |  |
| texto-tabela-linha-4-col-label | STRING | componente: body-linha-4-col-label :: Content | operation |  |  |
| texto-tabela-linha-4-col-valor-1 | STRING | componente: body-linha-4-col-valor-1 :: Content | operation |  |  |
| texto-tabela-linha-4-col-valor-2 | STRING | componente: body-linha-4-col-valor-2 :: Content | operation |  |  |
| texto-tabela-linha-3-col-label | STRING | componente: body-linha-3-col-label :: Content | operation |  |  |
| texto-tabela-linha-3-col-valor-1 | STRING | componente: body-linha-3-col-valor-1 :: Content | operation |  |  |
| texto-tabela-linha-3-col-valor-2 | STRING | componente: body-linha-3-col-valor-2 :: Content | operation |  |  |
| texto-tabela-linha-2-col-label | STRING | componente: body-linha-2-col-label :: Content | operation |  |  |
| texto-tabela-linha-2-col-valor-1 | STRING | componente: body-linha-2-col-valor-1 :: Content | operation |  |  |
| texto-tabela-linha-2-col-valor-2 | STRING | componente: body-linha-2-col-valor-2 :: Content | operation |  |  |
| texto-subtitulo-detalhes | STRING | componente: subtitulo-detalhes :: Content | operation |  |  |
| texto-banner | STRING | componente: banner-port-atq :: Body content | operation |  |  |
| texto-section-seguro | STRING | componente: section-seguro :: Content |  |  | Seguro do Consignado |
| texto-seg-parcelas-label-01 | STRING | componente: seg-parcelas > Label 01 :: Content |  |  | Parcelas |
| texto-seg-parcelas-label-02 | STRING | componente: seg-parcelas > Label 02 :: Content |  |  | 36× de R$ 12,69 |
| texto-seg-parcelas-descricao-01 | STRING | componente: seg-parcelas > Description 01 :: Content |  |  | Editar |
| texto-seg-total-pagar-label-01 | STRING | componente: seg-total-pagar > Label 01 :: Content |  |  | Total a pagar |
| texto-seg-total-pagar-label-02 | STRING | componente: seg-total-pagar > Label 02 :: Content |  |  | R$ 1.218,24 |
| texto-seg-forma-pagamento-label-01 | STRING | componente: seg-forma-pagamento > Label 01 :: Content |  |  | Forma de pagamento do seguro |
| texto-seg-forma-pagamento-label-02 | STRING | componente: seg-forma-pagamento > Label 02 :: Content |  |  | Débito em conta |
| texto-seg-conta-debito-label-01 | STRING | componente: seg-conta-debito > Label 01 :: Content |  |  | Conta a ser debitada o seguro |
| texto-seg-conta-debito-label-02 | STRING | componente: seg-conta-debito > Label 02 :: Content |  |  | Agência 8560 Conta 22349-9 |
| texto-section-portabilidade | STRING | componente: section-portabilidade :: Content |  |  | Portabilidade de salário |
| texto-port-fonte-pagadora-label-01 | STRING | componente: port-fonte-pagadora > Label 01 :: Content |  |  | Fonte pagadora |
| texto-port-fonte-pagadora-label-02 | STRING | componente: port-fonte-pagadora > Label 02 :: Content |  |  | Governo do Rio de Janeiro |
| texto-port-cnpj-label-01 | STRING | componente: port-cnpj > Label 01 :: Content |  |  | CNPJ |
| texto-port-cnpj-label-02 | STRING | componente: port-cnpj > Label 02 :: Content |  |  | 42.591.651/1402-39 |
| texto-port-banco-label-01 | STRING | componente: port-banco > Label 01 :: Content |  |  | Banco da conta salário |
| texto-port-banco-label-02 | STRING | componente: port-banco > Label 02 :: Content |  |  | Bradesco |
| texto-port-prazo-label-01 | STRING | componente: port-prazo > Label 01 :: Content |  |  | Prazo de aprovação |
| texto-port-prazo-label-02 | STRING | componente: port-prazo > Label 02 :: Content |  |  | Até 5 dias úteis |
| texto-aviso-portabilidade | STRING | componente: aviso-portabilidade :: Content |  |  | Se o próximo salário for pago antes da aprovação, o valor cairá no banco atual. |
| prop-item-valor-receber-trailing-item | STRING | componente: item-valor-receber :: Trailing item |  | sim | Icon |
| prop-item-saldo-refinanciar-trailing-item | STRING | componente: item-saldo-refinanciar :: Trailing item |  | sim | Icon |
| prop-item-parcelas-trailing-item | STRING | componente: item-parcelas :: Trailing item |  | sim | Icon |
| prop-item-total-pagar-trailing-item | STRING | componente: item-total-pagar :: Trailing item |  | sim | Icon |
| prop-item-iof-trailing-item | STRING | componente: item-iof :: Trailing item |  | sim | None |
| prop-item-taxa-juros-trailing-item | STRING | componente: item-taxa-juros :: Trailing item |  | sim | None |
| prop-item-cet-trailing-item | STRING | componente: item-cet :: Trailing item |  | sim | None |
| prop-item-periodo-trailing-item | STRING | componente: item-periodo :: Trailing item |  | sim | None |
| prop-item-forma-pagamento-trailing-item | STRING | componente: item-forma-pagamento :: Trailing item |  | sim | None |
| prop-item-dinheiro-conta-trailing-item | STRING | componente: item-dinheiro-conta :: Trailing item |  | sim | None |
| prop-item-data-portabilidade-trailing-item | STRING | componente: item-data-portabilidade :: Trailing item |  | sim | None |
| prop-item-conta-recebimento-trailing-item | STRING | componente: item-conta-recebimento :: Trailing item |  | sim | None |
| prop-item-fonte-pagadora-trailing-item | STRING | componente: item-fonte-pagadora :: Trailing item |  | sim | None |
| prop-item-matricula-trailing-item | STRING | componente: item-matricula :: Trailing item |  | sim | Icon |
| prop-seg-parcelas-trailing-item | STRING | componente: seg-parcelas :: Trailing item |  | sim | Icon |
| prop-seg-total-pagar-trailing-item | STRING | componente: seg-total-pagar :: Trailing item |  | sim | Icon |
| prop-seg-forma-pagamento-trailing-item | STRING | componente: seg-forma-pagamento :: Trailing item |  | sim | None |
| prop-seg-conta-debito-trailing-item | STRING | componente: seg-conta-debito :: Trailing item |  | sim | None |
| prop-port-fonte-pagadora-trailing-item | STRING | componente: port-fonte-pagadora :: Trailing item |  | sim | None |
| prop-port-cnpj-trailing-item | STRING | componente: port-cnpj :: Trailing item |  | sim | None |
| prop-port-banco-trailing-item | STRING | componente: port-banco :: Trailing item |  | sim | None |
| prop-port-prazo-trailing-item | STRING | componente: port-prazo :: Trailing item |  | sim | None |
| prop-item-valor-receber-show-supporting-item | BOOLEAN | componente: item-valor-receber :: Show supporting item | operation |  | true |
| prop-item-valor-receber-show-leading-item | BOOLEAN | componente: item-valor-receber :: Show leading item |  | sim | false |
| prop-item-valor-receber-has-next-item | BOOLEAN | componente: item-valor-receber :: Has next item |  |  | true |
| prop-item-saldo-refinanciar-show-supporting-item | BOOLEAN | componente: item-saldo-refinanciar :: Show supporting item | operation |  | true |
| prop-item-saldo-refinanciar-show-leading-item | BOOLEAN | componente: item-saldo-refinanciar :: Show leading item |  | sim | false |
| prop-item-saldo-refinanciar-has-next-item | BOOLEAN | componente: item-saldo-refinanciar :: Has next item |  |  | true |
| prop-item-parcelas-show-supporting-item | BOOLEAN | componente: item-parcelas :: Show supporting item | operation |  | true |
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
| prop-item-periodo-show-supporting-item | BOOLEAN | componente: item-periodo :: Show supporting item |  |  | false |
| prop-item-periodo-show-leading-item | BOOLEAN | componente: item-periodo :: Show leading item |  | sim | false |
| prop-item-periodo-has-next-item | BOOLEAN | componente: item-periodo :: Has next item |  |  | true |
| prop-item-forma-pagamento-show-supporting-item | BOOLEAN | componente: item-forma-pagamento :: Show supporting item |  |  | false |
| prop-item-forma-pagamento-show-leading-item | BOOLEAN | componente: item-forma-pagamento :: Show leading item |  | sim | false |
| prop-item-forma-pagamento-has-next-item | BOOLEAN | componente: item-forma-pagamento :: Has next item |  |  | true |
| prop-item-dinheiro-conta-show-supporting-item | BOOLEAN | componente: item-dinheiro-conta :: Show supporting item |  |  | false |
| prop-item-dinheiro-conta-show-leading-item | BOOLEAN | componente: item-dinheiro-conta :: Show leading item |  | sim | false |
| prop-item-dinheiro-conta-has-next-item | BOOLEAN | componente: item-dinheiro-conta :: Has next item |  |  | true |
| prop-item-data-portabilidade-show-supporting-item | BOOLEAN | componente: item-data-portabilidade :: Show supporting item |  |  | false |
| prop-item-data-portabilidade-show-leading-item | BOOLEAN | componente: item-data-portabilidade :: Show leading item |  | sim | false |
| prop-item-data-portabilidade-has-next-item | BOOLEAN | componente: item-data-portabilidade :: Has next item | operation |  | false |
| prop-item-conta-recebimento-show-supporting-item | BOOLEAN | componente: item-conta-recebimento :: Show supporting item |  |  | false |
| prop-item-conta-recebimento-show-leading-item | BOOLEAN | componente: item-conta-recebimento :: Show leading item |  | sim | false |
| prop-item-conta-recebimento-has-next-item | BOOLEAN | componente: item-conta-recebimento :: Has next item |  |  | true |
| prop-item-fonte-pagadora-show-supporting-item | BOOLEAN | componente: item-fonte-pagadora :: Show supporting item |  |  | false |
| prop-item-fonte-pagadora-show-leading-item | BOOLEAN | componente: item-fonte-pagadora :: Show leading item |  | sim | false |
| prop-item-fonte-pagadora-has-next-item | BOOLEAN | componente: item-fonte-pagadora :: Has next item |  |  | true |
| prop-item-matricula-show-supporting-item | BOOLEAN | componente: item-matricula :: Show supporting item | operation |  | true |
| prop-item-matricula-show-leading-item | BOOLEAN | componente: item-matricula :: Show leading item |  | sim | false |
| prop-item-matricula-has-next-item | BOOLEAN | componente: item-matricula :: Has next item |  |  | false |
| prop-seg-parcelas-show-supporting-item | BOOLEAN | componente: seg-parcelas :: Show supporting item |  |  | true |
| prop-seg-parcelas-show-leading-item | BOOLEAN | componente: seg-parcelas :: Show leading item |  | sim | false |
| prop-seg-parcelas-has-next-item | BOOLEAN | componente: seg-parcelas :: Has next item |  |  | true |
| prop-seg-total-pagar-show-supporting-item | BOOLEAN | componente: seg-total-pagar :: Show supporting item |  |  | false |
| prop-seg-total-pagar-show-leading-item | BOOLEAN | componente: seg-total-pagar :: Show leading item |  | sim | false |
| prop-seg-total-pagar-has-next-item | BOOLEAN | componente: seg-total-pagar :: Has next item |  |  | true |
| prop-seg-forma-pagamento-show-supporting-item | BOOLEAN | componente: seg-forma-pagamento :: Show supporting item |  |  | false |
| prop-seg-forma-pagamento-show-leading-item | BOOLEAN | componente: seg-forma-pagamento :: Show leading item |  | sim | false |
| prop-seg-forma-pagamento-has-next-item | BOOLEAN | componente: seg-forma-pagamento :: Has next item |  |  | true |
| prop-seg-conta-debito-show-supporting-item | BOOLEAN | componente: seg-conta-debito :: Show supporting item |  |  | false |
| prop-seg-conta-debito-show-leading-item | BOOLEAN | componente: seg-conta-debito :: Show leading item |  | sim | false |
| prop-seg-conta-debito-has-next-item | BOOLEAN | componente: seg-conta-debito :: Has next item |  |  | false |
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
| visivel-tabela-comparativa | BOOLEAN | camada: tabela-comparativa | operation |  | false |
| visivel-subtitulo-detalhes | BOOLEAN | camada: subtitulo-detalhes | operation |  | false |
| visivel-banner-port-atq | BOOLEAN | camada: banner-port-atq | operation |  | false |
| visivel-secao-seguro | BOOLEAN | camada: secao-seguro | additional |  | false |
| visivel-secao-portabilidade | BOOLEAN | camada: secao-portabilidade | additional |  | false |
| visivel-aviso-portabilidade | BOOLEAN | camada: aviso-portabilidade | additional |  | false |
| visivel-overlay-operacao-nao-utilizada | BOOLEAN | camada: overlay-operacao-nao-utilizada | operation |  | false |
| visivel-wrapper-rule-operacao-sem-revisao | BOOLEAN | camada: wrapper-rule-operacao-sem-revisao | additional |  | false |
| visivel-item-valor-receber | BOOLEAN | camada: item-valor-receber | operation |  | true |
| visivel-item-saldo-refinanciar | BOOLEAN | camada: item-saldo-refinanciar | operation |  | false |
| visivel-item-forma-pagamento | BOOLEAN | camada: item-forma-pagamento | operation |  | true |
| visivel-item-dinheiro-conta | BOOLEAN | camada: item-dinheiro-conta | operation |  | true |
| visivel-item-data-portabilidade | BOOLEAN | camada: item-data-portabilidade | operation |  | false |
| visivel-item-conta-recebimento | BOOLEAN | camada: item-conta-recebimento | operation |  | true |
| visivel-item-fonte-pagadora | BOOLEAN | camada: item-fonte-pagadora |  |  | true |
| visivel-item-matricula | BOOLEAN | camada: item-matricula |  |  | true |

### Valores por modo

| id | modo | valor |
| --- | --- | --- |
| texto-titulo | PCON | Revise as condições do seu empréstimo |
| texto-titulo | REFIN | Revise as condições do seu refinanciamento |
| texto-titulo | Port Ataque Saldo | Mais detalhes da portabilidade |
| texto-titulo | Port Ataque Refin | Compare condições para a sua portabilidade |
| texto-botao | PCON | Ir para contratação |
| texto-botao | REFIN | Ir para contratação |
| texto-botao | Port Ataque Saldo | Voltar |
| texto-botao | Port Ataque Refin | Ir para contratação |
| texto-condicoes | PCON | Condições válidas pelos próximos 2 dias úteis |
| texto-condicoes | REFIN | Condições válidas pelos próximos 2 dias úteis |
| texto-condicoes | Port Ataque Saldo | As condições são válidas para 2 dias |
| texto-condicoes | Port Ataque Refin | As condições são válidas para 2 dias |
| texto-item-valor-receber-label-01 | PCON | Valor a receber |
| texto-item-valor-receber-label-01 | REFIN | Valor a receber |
| texto-item-valor-receber-label-01 | Port Ataque Refin | Valor a receber |
| texto-item-valor-receber-label-02 | PCON | R$ 7.000,00 |
| texto-item-valor-receber-label-02 | REFIN | R$ 10.000,00 |
| texto-item-valor-receber-label-02 | Port Ataque Refin | R$ 857,73 |
| texto-item-valor-receber-descricao-01 | PCON | Editar |
| texto-item-valor-receber-descricao-01 | REFIN | Editar |
| texto-item-saldo-refinanciar-label-01 | REFIN | Saldo a refinanciar |
| texto-item-saldo-refinanciar-label-01 | Port Ataque Refin | Saldo a ser portado |
| texto-item-saldo-refinanciar-label-02 | REFIN | R$ 6.300,00 |
| texto-item-saldo-refinanciar-label-02 | Port Ataque Refin | R$ 1.992,50 |
| texto-item-saldo-refinanciar-descricao-01 | REFIN | Saber mais |
| texto-item-parcelas-label-02 | PCON | 36× de R$ 246,11 |
| texto-item-parcelas-label-02 | REFIN | 36× de R$ 246,11 |
| texto-item-parcelas-label-02 | Port Ataque Saldo | 93× de R$ 590,25 |
| texto-item-parcelas-label-02 | Port Ataque Refin | 96× de R$ 90,81 |
| texto-item-parcelas-descricao-01 | PCON | Editar |
| texto-item-parcelas-descricao-01 | REFIN | Editar |
| texto-item-parcelas-descricao-01 | Port Ataque Saldo | Editar |
| texto-item-total-pagar-label-02 | PCON | R$ 12.000,00 |
| texto-item-total-pagar-label-02 | REFIN | R$ 6.752,53 |
| texto-item-total-pagar-label-02 | Port Ataque Saldo | R$ 54.893,25 |
| texto-item-total-pagar-label-02 | Port Ataque Refin | R$ 8.717,86 |
| texto-item-iof-label-02 | PCON | R$ 389,58 |
| texto-item-iof-label-02 | REFIN | R$ 160,22 |
| texto-item-iof-label-02 | Port Ataque Saldo | R$ 0,00 |
| texto-item-iof-label-02 | Port Ataque Refin | R$ 1.973,50 |
| texto-item-taxa-juros-label-02 | PCON | 1,79% ao mês e 17,48% ao ano |
| texto-item-taxa-juros-label-02 | REFIN | 1,66% ao mês e 25,59% ao ano |
| texto-item-taxa-juros-label-02 | Port Ataque Saldo | 1,55% ao mês e 18,60% ao ano |
| texto-item-taxa-juros-label-02 | Port Ataque Refin | 1,55% ao mês e 18,60% ao ano |
| texto-item-cet-label-02 | PCON | 1,91% ao mês e 22,92% ao ano |
| texto-item-cet-label-02 | REFIN | 2,02% ao mês e 27,60% ao ano |
| texto-item-cet-label-02 | Port Ataque Saldo | 2,24% ao mês e 27,60% ao ano |
| texto-item-cet-label-02 | Port Ataque Refin | 2,24% ao mês e 27,60% ao ano |
| texto-item-forma-pagamento-label-01 | PCON | Forma de pagamento |
| texto-item-forma-pagamento-label-01 | REFIN | Forma de pagamento |
| texto-item-forma-pagamento-label-02 | PCON | Desconto na folha de pagamento |
| texto-item-forma-pagamento-label-02 | REFIN | Desconto na folha de pagamento |
| texto-item-periodo-label-02 | PCON | Novembro de 2025 a novembro de 2029 |
| texto-item-periodo-label-02 | REFIN | Abril de 2024 a abril de 2029 |
| texto-item-periodo-label-02 | Port Ataque Saldo | Dezembro de 2024 a dezembro de 2028 |
| texto-item-periodo-label-02 | Port Ataque Refin | Dezembro de 2024 a Dezembro de 2028 |
| texto-item-dinheiro-conta-label-01 | PCON | Dinheiro na conta |
| texto-item-dinheiro-conta-label-01 | REFIN | Dinheiro na conta |
| texto-item-dinheiro-conta-label-01 | Port Ataque Refin | Data prevista para dinheiro em conta |
| texto-item-dinheiro-conta-label-02 | PCON | Até 1 hora |
| texto-item-dinheiro-conta-label-02 | REFIN | Até 1 hora |
| texto-item-dinheiro-conta-label-02 | Port Ataque Refin | Até X dias |
| texto-item-data-portabilidade-label-01 | Port Ataque Saldo | Data prevista para portabilidade |
| texto-item-data-portabilidade-label-01 | Port Ataque Refin | Data prevista para portabilidade |
| texto-item-data-portabilidade-label-02 | Port Ataque Saldo | Até 7 dias úteis |
| texto-item-data-portabilidade-label-02 | Port Ataque Refin | Até 5 dias úteis |
| texto-item-conta-recebimento-label-01 | PCON | Conta para recebimento |
| texto-item-conta-recebimento-label-01 | REFIN | Conta para recebimento |
| texto-item-conta-recebimento-label-01 | Port Ataque Refin | Conta para recebimento |
| texto-item-conta-recebimento-label-02 | PCON | Agência 8560 \| Conta 22349-9 |
| texto-item-conta-recebimento-label-02 | REFIN | Agência 8560 \| Conta 22349-9 |
| texto-item-conta-recebimento-label-02 | Port Ataque Refin | Agência 8560 \| Conta 22349-9 |
| texto-item-fonte-pagadora-label-02 | PCON | Governo do Estado de São Paulo |
| texto-item-fonte-pagadora-label-02 | REFIN | Governo do Estado de São Paulo |
| texto-item-fonte-pagadora-label-02 | Port Ataque Saldo | Governo do Rio de Janeiro |
| texto-item-fonte-pagadora-label-02 | Port Ataque Refin | Governo do Rio de Janeiro |
| texto-item-matricula-label-02 | PCON | 123456789 |
| texto-item-matricula-label-02 | REFIN | 123456789 |
| texto-item-matricula-label-02 | Port Ataque Saldo | 90988765 |
| texto-item-matricula-label-02 | Port Ataque Refin | 90988765 |
| texto-item-matricula-descricao-01 | PCON | Saber mais |
| texto-item-matricula-descricao-01 | REFIN | Saber mais |
| texto-item-matricula-descricao-01 | Port Ataque Saldo | Saber mais |
| texto-tabela-header-row-col-label | Port Ataque Refin | Condições no Banco |
| texto-tabela-header-row-col-valor-1 | Port Ataque Refin | Com dinheiro extra |
| texto-tabela-header-row-col-valor-2 | Port Ataque Refin | Sem dinheiro extra |
| texto-tabela-linha-1-col-label | Port Ataque Refin | Parcelas a pagar |
| texto-tabela-linha-1-col-valor-1 | Port Ataque Refin | 96 |
| texto-tabela-linha-1-col-valor-2 | Port Ataque Refin | 57 |
| texto-tabela-linha-4-col-label | Port Ataque Refin | Valor da parcela |
| texto-tabela-linha-4-col-valor-1 | Port Ataque Refin | R$ 80,92 |
| texto-tabela-linha-4-col-valor-2 | Port Ataque Refin | R$ 69,02 |
| texto-tabela-linha-3-col-label | Port Ataque Refin | Juros ao mês |
| texto-tabela-linha-3-col-valor-1 | Port Ataque Refin | 1,55% |
| texto-tabela-linha-3-col-valor-2 | Port Ataque Refin | 1,55% |
| texto-tabela-linha-2-col-label | Port Ataque Refin | Valor a receber |
| texto-tabela-linha-2-col-valor-1 | Port Ataque Refin | R$ 857,73 |
| texto-tabela-linha-2-col-valor-2 | Port Ataque Refin | R$ 0 |
| texto-subtitulo-detalhes | Port Ataque Refin | Mais detalhes da portabilidade com dinheiro extra |
| texto-banner | Port Ataque Refin | Confira também as condições da transferência do seu contrato para o Banco |
| prop-item-valor-receber-show-supporting-item | PCON | true |
| prop-item-valor-receber-show-supporting-item | REFIN | true |
| prop-item-valor-receber-show-supporting-item | Port Ataque Saldo | true |
| prop-item-valor-receber-show-supporting-item | Port Ataque Refin | false |
| prop-item-saldo-refinanciar-show-supporting-item | PCON | true |
| prop-item-saldo-refinanciar-show-supporting-item | REFIN | true |
| prop-item-saldo-refinanciar-show-supporting-item | Port Ataque Saldo | true |
| prop-item-saldo-refinanciar-show-supporting-item | Port Ataque Refin | false |
| prop-item-parcelas-show-supporting-item | PCON | true |
| prop-item-parcelas-show-supporting-item | REFIN | true |
| prop-item-parcelas-show-supporting-item | Port Ataque Saldo | true |
| prop-item-parcelas-show-supporting-item | Port Ataque Refin | false |
| prop-item-data-portabilidade-has-next-item | PCON | false |
| prop-item-data-portabilidade-has-next-item | REFIN | false |
| prop-item-data-portabilidade-has-next-item | Port Ataque Saldo | false |
| prop-item-data-portabilidade-has-next-item | Port Ataque Refin | true |
| prop-item-matricula-show-supporting-item | PCON | true |
| prop-item-matricula-show-supporting-item | REFIN | true |
| prop-item-matricula-show-supporting-item | Port Ataque Saldo | true |
| prop-item-matricula-show-supporting-item | Port Ataque Refin | false |
| visivel-tabela-comparativa | PCON | false |
| visivel-tabela-comparativa | REFIN | false |
| visivel-tabela-comparativa | Port Ataque Saldo | false |
| visivel-tabela-comparativa | Port Ataque Refin | true |
| visivel-subtitulo-detalhes | PCON | false |
| visivel-subtitulo-detalhes | REFIN | false |
| visivel-subtitulo-detalhes | Port Ataque Saldo | false |
| visivel-subtitulo-detalhes | Port Ataque Refin | true |
| visivel-banner-port-atq | PCON | false |
| visivel-banner-port-atq | REFIN | false |
| visivel-banner-port-atq | Port Ataque Saldo | false |
| visivel-banner-port-atq | Port Ataque Refin | true |
| visivel-secao-seguro | sem adicionais | false |
| visivel-secao-seguro | seguro | true |
| visivel-secao-seguro | port salário | false |
| visivel-secao-seguro | seguro+port | true |
| visivel-secao-portabilidade | sem adicionais | false |
| visivel-secao-portabilidade | seguro | false |
| visivel-secao-portabilidade | port salário | true |
| visivel-secao-portabilidade | seguro+port | true |
| visivel-aviso-portabilidade | sem adicionais | false |
| visivel-aviso-portabilidade | seguro | false |
| visivel-aviso-portabilidade | port salário | true |
| visivel-aviso-portabilidade | seguro+port | true |
| visivel-overlay-operacao-nao-utilizada | PCON | false |
| visivel-overlay-operacao-nao-utilizada | REFIN | false |
| visivel-overlay-operacao-nao-utilizada | Port Ataque Saldo | true |
| visivel-overlay-operacao-nao-utilizada | Port Ataque Refin | true |
| visivel-wrapper-rule-operacao-sem-revisao | sem adicionais | false |
| visivel-wrapper-rule-operacao-sem-revisao | seguro | true |
| visivel-wrapper-rule-operacao-sem-revisao | port salário | true |
| visivel-wrapper-rule-operacao-sem-revisao | seguro+port | true |
| visivel-item-valor-receber | PCON | true |
| visivel-item-valor-receber | REFIN | true |
| visivel-item-valor-receber | Port Ataque Saldo | false |
| visivel-item-valor-receber | Port Ataque Refin | true |
| visivel-item-saldo-refinanciar | PCON | false |
| visivel-item-saldo-refinanciar | REFIN | true |
| visivel-item-saldo-refinanciar | Port Ataque Saldo | false |
| visivel-item-saldo-refinanciar | Port Ataque Refin | true |
| visivel-item-forma-pagamento | PCON | true |
| visivel-item-forma-pagamento | REFIN | true |
| visivel-item-forma-pagamento | Port Ataque Saldo | false |
| visivel-item-forma-pagamento | Port Ataque Refin | false |
| visivel-item-dinheiro-conta | PCON | true |
| visivel-item-dinheiro-conta | REFIN | true |
| visivel-item-dinheiro-conta | Port Ataque Saldo | false |
| visivel-item-dinheiro-conta | Port Ataque Refin | true |
| visivel-item-data-portabilidade | PCON | false |
| visivel-item-data-portabilidade | REFIN | false |
| visivel-item-data-portabilidade | Port Ataque Saldo | true |
| visivel-item-data-portabilidade | Port Ataque Refin | true |
| visivel-item-conta-recebimento | PCON | true |
| visivel-item-conta-recebimento | REFIN | true |
| visivel-item-conta-recebimento | Port Ataque Saldo | false |
| visivel-item-conta-recebimento | Port Ataque Refin | true |
<!-- pacote:fim -->
