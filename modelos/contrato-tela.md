# Contrato de fundação da tela — `<etapa>` / `<tela>`

**Nome da tela e fonte da confirmação:** `<a declaração direta da pessoa confirma o nome; registrar fonte/data>`

**ID da tela:** `<confirmado ou PROPOSTA_DE_ID; não confundir com confirmação do nome>`

**Versão:** 0.1

**Contrato da etapa e briefing:** `<links e versões>`

**Estado:** proposta / revisado / pendente para montagem

## Recorte e reconciliação

Uma linha por frame inspecionado, inclusive duplicatas visuais. Preserve nome e link HTTPS completo com arquivo e `node-id`. Separe variação da tela atual, tela auxiliar/outra tela e pertencimento pendente, com motivo. Categorias compostas contam uma vez; a contagem da tela usa somente os frames atribuídos a ela.

| Frame e link individual | Pertencimento e motivo | Produto | Operação | Contexto | Produtos Adicionais | Outras dimensões | Natureza da cópia / duplicata visual |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |

**Total da tela:** `<soma por produto e por cada eixo; incluir não identificado>`. Se a soma não fechar, mantenha a tela pendente.

## Evidências por ocorrência

Esta matriz sustenta as contagens, tabelas de produto e casos de prova. Registre cada ocorrência que compõe o cenário, preservando diferenças entre frames.

| Frame/link | Área | Item e ordem | Presença e natureza (conteúdo, vazio, espaçador, auxiliar, oculto) | Conteúdo observado | Ação/ícone | Estado e controles observados |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

## Vocação e identidade

`<Compare nome/ID confirmados com o que a tela efetivamente permite compreender ou fazer. Exponha qualquer conflito.>`

| Área/campo e ID semântico | Estrutura/texto observado e frame | Vocação inferida | Regra confirmada e fonte | Critério para novo item |
| --- | --- | --- | --- | --- |
|  |  |  | não aprovada / fonte e data |  |

## Variações e limites

| Par de frames | Eixo isolado ou combinação | Diferença de conteúdo, presença, estrutura ou estado | Impacto de layout | Regra de produto |
| --- | --- | --- | --- | --- |
|  |  |  |  | não aprovada / fonte e data |

Registre menor e maior densidade, áreas condicionais, quebra de texto, tabela, componentes com estados e conteúdo não demonstrado. A maior quantidade vista não define o máximo do chassi.

| Caso de prova e frame/link | Recorte e critério de densidade | Quantidades visíveis por área e total | Vazios/espaçadores/ocultos separados | Dimensões observadas | Limite ou prova necessária |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Origem e capacidade dos recursos

| Recurso/controle observado na referência e evidência | Equivalente IDS ou composição proposta | Acesso, autorização e versão exata | Controle realmente inspecionado e em qual nível | Capacidade pública necessária no Core | Prova pendente |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Blueprint semântico para montagem

| Área/ID semântico | Papel e ordem de leitura | Estrutura e sizing esperados | Scroll/fixação | Origem IDS exata ou layout local | Controle público necessário | Casos de prova |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

Registre a família e a versão IDS observada (`[v1]` ou `[v2]`), o recurso publicado e as properties realmente disponíveis. Uma proposta de property, SLOT ou composição local ainda não provada fica pendente. Não transporte tokens, defaults ou chaves entre versões por semelhança de nome.

Marque em cada célula aplicável o que foi observado e o que é proposta, inclusive scroll/fixação. Preserve o mesmo estado nas receitas, pendências e resumo. Componente local encontrado na referência não se torna automaticamente recurso autorizado para o Core.

## Componentes repetíveis e estados, se houver

| Ordem proposta | ID semântico do item | Vocação e informação que deve caber | Estados exigidos para cada item | Conteúdo conhecido/faltante por estado | Evidência e aprovação da ordem |
| ---: | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Separe o **estado visto numa referência** da **capacidade de cada item**. Se um conjunto de accordions exige aberto e fechado, todos os itens precisam aceitar os dois estados e seus respectivos conteúdos, mesmo quando a amostra só mostra um estado por item. O contrato do Core define identidade, sequência, espaços necessários e a exigência de alternância; quando o componente vem do IDS, é ele que implementa suas properties. Cada produto fornece os textos, fontes e condições. Não copie automaticamente o conteúdo visível de um estado para preencher o outro. Registre a ordem como proposta até haver revisão da regra de informação.

**Interface de configuração:** `<para cada property, indique a biblioteca/componente de origem, o item que a consome no Core e se a instância aninhada precisará ser exposta; valores independentes por item; mode somente se esta tela precisar dele, com a relação entre mode e property explicitada>`.

**Auditoria de texto do mestre:** `<nós de texto locais, defaults de properties TEXT e defaults de textos nas instâncias IDS aninhadas devem ficar vazios; textos de prova ficam somente em instâncias separadas>`.

## Fronteiras e handoff

| Capacidade | Core | Produto(s) | IDS | Property/encaixe proposto | Evidência e limite |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

**Entrada para montagem:** contrato da etapa, este contrato revisado, receitas dos produtos participantes, referências, bibliotecas IDS acessíveis, casos de estresse e decisões que afetam estrutura ou presença.

### Prova técnica reduzida, quando houver mecanismo incerto

Planeje a menor unidade que preserve o aninhamento real até a instância consumida. Use duas ocorrências quando precisar provar independência. Distingua falta de decisão/recurso, que impede iniciar a unidade, da hipótese que a própria prova deve resolver.

| Capacidade e hipótese | Unidade mínima e aninhamento | Alvo público proposto e dono da property | Ação no painel/API | Resultado esperado e evidência | Efeito de falha e passagem afetada |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

**Pendências:** `<decisão, responsável, efeito e estado>`.

## Conferência da entrega

Preencha após confrontar este contrato com o da etapa e todas as receitas. Cite resultados concretos, sem aprovação automática por preenchimento. Contradição não resolvida mantém o documento afetado pendente.

| Critério | Resultado concreto e fonte/seção | Lacuna e passagem afetada |
| --- | --- | --- |
| Identidade e recorte |  |  |
| Inventário e links |  |  |
| Contagens e ocorrências entre documentos |  |  |
| Fonte de cada regra e pares de comparação |  |  |
| Observação, proposta e configuração a provar |  |  |
| Origem, autorização, controles públicos e compatibilidade com as fronteiras Core/produto/IDS |  |  |
| Anomalias preservadas e impacto das pendências |  |  |

## Tabelas de máquina (lidas pelo gerador de pacotes)

Estes dois blocos alimentam o pacote do plugin. Preencha com as camadas ligáveis desta tela e, **só depois de publicar o Core e ler a chave no Figma**, com a chave real. Enquanto o Core não foi publicado, mantenha a chave abaixo como está e **não gere pacote**.

<!-- camadas:inicio -->
### Camadas ligáveis

| camada | caminho |
| --- | --- |
| bloco-exemplo | conteudo > bloco-exemplo |
<!-- camadas:fim -->

<!-- core:inicio -->
### Chave publicada do Core

| componente | chave | arquivo do Core | publicado em | nota |
| --- | --- | --- | --- | --- |
| nome-do-componente-core | 0000000000000000000000000000000000000000 | https://www.figma.com/design/CHAVE_DO_ARQUIVO?node-id=1-2 | 2000-01-01 | PENDENTE: substitua pela chave lida no Figma após publicar o Core |
<!-- core:fim -->
