# Receita do produto — <produto> / <etapa> / <tela>

**Versão:** 0.1

**Estado:** proposta / revisada / aprovada; responsável e data

**Depende de:** <versões dos contratos da etapa e da tela Core>

**Referências:** <links e natureza da cópia>

## Vocação no produto

<O que este produto precisa comunicar ou permitir nesta tela. Separe amostra sintética de regra aprovada.>

| Operação | Contexto | Produtos Adicionais | Área/campo semântico do Core | Conteúdo ou fonte | Condição de presença | Evidência | Estado da regra |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |

## Configuração da instância Core

| Área/campo semântico | Alvo público do Core/IDS | Valor base ou fonte | Variação por Operação, Contexto ou Produtos Adicionais | Collection/mode quando aplicável | Binding ou configuração | Prova no Figma |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

Separe o eixo que **explica a diferença observada** do mecanismo Figma que a implementa. Não crie mode para cada combinação nem override para um eixo sem variação nesta tela. Para uma property TEXT pública de componente, registre o alias de variável aplicado à própria property por `setProperties`, sem editar `characters` internos da instância. Para boolean, variante, slot ou propriedade direta, registre o mecanismo suportado pela versão concreta do Core/IDS. O contrato precisa distinguir regra confirmada, proposta e cenário não observado.

## Conteúdo de componentes com estados, se houver

| ID semântico e ordem contratada | Cenário | Conteúdo no estado fechado | Conteúdo no estado aberto | Estado inicial proposto | Fonte e aprovação |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Preencha os dois estados de cada item exigido pelo contrato de tela. `Não observado` é uma pendência, não autorização para duplicar o texto do outro estado ou congelar o item na posição visual da referência. Preserve a sequência e a vocação definidas no Core; esta receita define a cópia e a condição próprias do produto.

**Combinações não observadas:** <não extrapolar>.

**Dependências e pendências:** <dados, copy, IDS, Core, negócio, publicação>.

**Saída:** instância do Core configurada e revisada na biblioteca deste produto, com chave e versão do Core e prova dos cenários. Sem vínculo e compatibilidade verificados, não declarar a receita pronta para instalação.
