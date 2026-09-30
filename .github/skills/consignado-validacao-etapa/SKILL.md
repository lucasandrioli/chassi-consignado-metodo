---
name: consignado-validacao-etapa
description: Audite, sem alterar o Figma, o kit de regiões, a receita ou a biblioteca de um produto contra contratos, recibos, referências e canvas, e entregue um veredito com limites de evidência. Use quando a pessoa pedir validação, auditoria ou conferência. Somente leitura.
---

# Validar uma tela da etapa do consignado

> Esta skill serve a qualquer etapa, tela e produto do consignado. Produtos, regiões, eixos e valores são descobertos nas referências e nos contratos; os exemplos são ilustrativos, não regras.

## Princípios de validação

1. **Confira contra o Figma, não contra o "✅" do recibo.** Cada critério `APTO` cita uma releitura do canvas (nó, property, `boundVariables`, altura). Recibo que diz "0 textos" ou "tudo conferido" é trilha, não prova; um recibo pode dizer "0 textos" enquanto o canvas tem textos default do IDS em camadas ocultas, padding sem token e overlay com altura errada.
2. **Recortes:** `KIT_DE_REGIOES`, `RECEITA` (composição de prova contra as referências), `PRODUTO` (biblioteca instalada) e `CADEIA_DE_ATUALIZACAO`. `CORE` é o apelido de `KIT_DE_REGIOES` + `RECEITA`; `CONJUNTO_DA_ETAPA` reconcilia todas as telas.
3. **O que o produto não usa não pode aparecer nele.** Reprove camada oculta, slot vazio, variante por perfil ou região não usada dentro do componente de um produto. Procure com `figma.skipInvisibleInstanceChildren = false`, senão a camada oculta "não existe" na busca.
4. **Sem BOOLEAN pública de visibilidade** em nenhuma região nem no componente do produto. O painel do designer não pode mostrar interruptores nem template para ligar e desligar coisas.
5. **Vínculo vivo:** região do produto é instância do componente publicado do Core (`detach` reprova). Por MCP: o nó no caminho do contrato é `INSTANCE` e o componente principal dele tem a chave do contrato (receita "Vínculo vivo" da referência do MCP); um frame no lugar da instância indica `detach`.
6. **Medida, bloco a bloco:** a tela é auto layout e a altura total é consequência. Compare altura e largura renderizadas de **cada bloco** e o espaçamento entre eles com a referência; diferença de bloco sem causa medida é `REPROVADO` (`MONTAGEM_CORE` ou `PRODUTO_PACOTE`). A altura total só serve de alarme e diverge legitimamente quando o conteúdo declarado difere. Confira que o chassi aceita o máximo de itens declarado.

## Papel e escopo

Você é um agente com acesso de leitura ao Figma por **MCP** (servidor remoto do Figma, no VS Code), em **somente leitura**, e **antes da primeira chamada ao Figma lê [`references/figma-mcp.md`](references/figma-mcp.md)**. `use_figma` só com scripts de leitura (seção 5 da referência). Você atua em uma tela e um recorte por execução. O recorte pode ser `CORE` (`KIT_DE_REGIOES` + `RECEITA`), `PRODUTO`, `CADEIA_DE_ATUALIZACAO` ou `CONJUNTO_DA_ETAPA`. Não crie, edite, renomeie, publique, mude modes, remova instâncias nem corrija falhas durante a auditoria. Uma correção necessária volta à skill ou camada responsável.

**Onde está o recibo:** leia o arquivo em `etapas/<etapa>/recibos/` mais recente do recorte (a montagem o grava lá) e cite o caminho no veredito. Recibo ausente do repositório, ou cujas versões de contrato divergem das de `etapas/<etapa>/contratos/registro.json` (ou dos rascunhos, quando ainda não promovidos), deixa a fonte "recibo" como `NAO_VERIFICAVEL`; o Figma continua sendo lido. Confronte três fontes independentes: **contratos** dizem o que deveria existir; **recibo/pacote** dizem o que se declarou montado; **Figma** mostra o que existe e pode ser testado. A referência mostra a experiência observada, mas não aprova sua cópia, regra de negócio ou biblioteca de origem. Nenhuma fonte sozinha torna um item apto. Compare função, ordem percebida, estados, comportamento visível e resultado visual; a árvore artesanal da referência não precisa ser reproduzida literalmente.

Receba os contratos de etapa, Core da tela e produto aplicável, com versões e estado; referências citadas; recibo Core e, para produto, recibo/pacote da instalação; links `/design/` dos arquivos Figma, com `node-id`, que o MCP consegue abrir. Leia do repositório o que estiver acessível (contratos, recibos); não presuma acesso a conversas anteriores, e peça colado o que faltar. Se faltar um artefato essencial, peça somente ele e registre o recorte como `NAO_VERIFICAVEL`. Um contrato em proposta pode ser auditado como **prova técnica**, sem virar aprovação de conteúdo ou adoção.

Confirme também **como a prova foi produzida**. No recorte `CORE`, o recibo precisa mostrar execução da skill de montagem no Figma e apontar para o mestre e as instâncias/capturas de prova. Uma montagem externa pode ser auditada como experimento técnico, mas não recebe veredito de que o fluxo com skills funcionou. No recorte `PRODUTO`, a existência de frames com conteúdo aplicado não comprova modes: exija evidência do pacote/instalação e do comportamento de cada eixo na biblioteca do produto.

## Bibliotecas autorizadas

Confira as famílias IDS autorizadas no contrato e adicionadas ao arquivo auditado (`get_libraries`): `iDS Core Components`, `iDS Illustrations and Animations`, `iDS General Tokens` e `iDS Icons`, quando aplicáveis. Aceite prefixo `[v1]` ou `[v2]` para o mesmo nome de família; em prova sintética, aceite uma biblioteca de simulação declarada (por exemplo, com sufixo `Fake`) apenas quando o contrato a autorizar como simulação. Registre **nome e versão exatos** encontrados no Figma. Se ambas estiverem disponíveis, valide a versão escolhida pela rodada, sem tratá-las como intercambiáveis. Origem, chave, property, token e estado de publicação devem ser observados; um recurso parecido não prova o vínculo. Produto pode usar Core publicado e o IDS que seu contrato autorizar.

## Estados e responsabilidade

Use `APTO`, `REPROVADO`, `NAO_VERIFICAVEL`, `NAO_SE_APLICA` e `IMPASSE_TECNICO` por critério. `APTO` exige coerência entre exigência, execução e canvas. Ausência de acesso, de link com `node-id` ou de API legível é `NAO_VERIFICAVEL`, não ausência de falha. Classifique a camada responsável por divergência: `ANALISE_CONTRATO`, `IDS`, `MONTAGEM_CORE`, `PRODUTO_PACOTE`, `DECISAO_HUMANA` ou `NAO_DISPONIVEL_NO_MCP`.

Um recorte só fica `APTO_PARA_REVISAO_HUMANA` quando seus critérios aplicáveis estão `APTO` ou `NAO_SE_APLICA`; isso não publica nem aprova regras de negócio. `[CONFIRMAR]` e propostas não aprovadas continuam pendentes. Não reprove montagem por uma regra que o contrato ainda não decidiu.

## Preflight de leitura

Identifique etapa, tela, produto quando houver, versões, arquivo Core, arquivo de produto, referências e componente/instância alvo. Eles podem estar em arquivos diferentes. Para `CORE`, compare referência, contrato e mestre Core; para `PRODUTO`, compare contrato de produto, Core publicado, componente de tela do produto, pacote e cenários; para `CONJUNTO_DA_ETAPA`, reconcilie identidades e quantidades das telas/receitas sem substituir a auditoria individual.

Verifique que o alvo é da rodada certa e que as bibliotecas necessárias são acessíveis. Não abra uma tela parecida para compensar link ausente. Se uma prova exigir mudar mode ou property, **não altere o arquivo**: leia as instâncias de prova que já estão em cada combinação (`explicitVariableModes`, `visible`, textos) e calcule o esperado por `valuesByMode` (receita na referência); use capturas e recibos como evidência auxiliar e marque o que não puder ser lido sem alterar como `NAO_VERIFICAVEL`. A auditoria nunca modifica o arquivo para obter prova.

Confira a coerência entre contrato da etapa, contrato Core, receitas e resumo antes de julgar a montagem: pertencimento dos frames à tela, links completos, totais por área/cenário, ações por ocorrência e estado de cada afirmação. A tabela de conferência do Analista é uma trilha a verificar, não prova independente. Contradição entre documentos volta a `ANALISE_CONTRATO`; não escolha a interpretação que faz o canvas passar. Uma hipótese declarada só muda de estado quando recibo e evidência relível demonstrarem sua prova. Preserve as confirmações humanas já registradas, sem pedir novamente os mesmos nomes ou autorizações.

Audite também a compatibilidade do contrato com as fronteiras Core/produto/IDS. Documentos coerentes entre si podem recomendar o mesmo mecanismo incompatível: se a receita exigir editar `characters`, binding em texto interno ou camadas internas de peça IDS, encaminhe a `ANALISE_CONTRATO`, mesmo que o override funcione no Figma. Visibilidade de camada **do Core** ligada por variável, por caminho de nome único, contratada e sem BOOLEAN pública, **é permitida**; texto por property TEXT pública de instância nomeada também. Não aceite “wrapper”, “SLOT”, “variável” ou “v1” como prova de exposição. Exija o controle público efetivamente disponível à instância consumida; quando a evidência faltar, use `NAO_VERIFICAVEL`, sem transformar uma capacidade genérica da ferramenta em prova da rodada.

Quando receber uma prova técnica reduzida, limite o veredito às capacidades exercitadas. Confira a correspondência entre hipótese, ação, alvo e evidência: testar um Body não comprova independência entre dois; alterar texto não prova binding; ocultar um alvo não comprova reexibição nem todos os containers. Verifique separadamente properties próprias do Core, controles das instâncias expostas no painel e o alvo real das chamadas da API. Uma captura do painel não comprova `setProperties()` no pai. Resultados ausentes ficam `NAO_VERIFICAVEL`; falha observada reprova a capacidade afetada. O sucesso dessa unidade pode liberar revisão para continuar a montagem, sem declarar tela completa, publicação ou pacote aptos.

## Verificações gerais por padrão contratado

Valem para qualquer tela e produto. Para cada padrão que o contrato declarou, faça a verificação correspondente **no Figma**:

| Padrão do contrato | Verificação | Falha vai para |
| --- | --- | --- |
| Região opcional por produto | Varra o componente de cada produto **incluindo camadas ocultas** (`skipInvisibleInstanceChildren = false`); nenhuma região que o contrato não lista para aquele produto | `PRODUTO_PACOTE` |
| Camada ligável por caminho | Cada nó do caminho existe, tem nome único no pai e o `visible` está ligado à variável do contrato | `MONTAGEM_CORE` ou `PRODUTO_PACOTE` |
| Texto por property pública | A chave existe na instância nomeada; texto de prova é o literal da referência ou receita; mestre sem texto | `MONTAGEM_CORE` |
| Lista dinâmica | Quantidade, ordem e máximo por produto e cenário; caso do máximo sem quebra nem corte | `MONTAGEM_CORE` / `PRODUTO_PACOTE` |
| Item por ocorrência | Cada propriedade da matriz por item confere ocorrência a ocorrência; `Trailing item` fixo | `MONTAGEM_CORE` |
| Componente local aprovado | Só existem os aprovados; duas ocorrências como instâncias; feito de peças e tokens do IDS | `MONTAGEM_CORE` |
| Layout por produto | Cada produto liga só à coleção dele (um mode); alterar o valor no Core chega ao consumidor; nenhuma opção de outro produto visível ao designer | `MONTAGEM_CORE` / `PRODUTO_PACOTE` |
| Sobreposição | Dimensiona pela composição em pelo menos dois tamanhos | `MONTAGEM_CORE` |
| Medida | Bloco a bloco; total só como alarme | `MONTAGEM_CORE` / `ANALISE_CONTRATO` |
| Padrão `NAO_CLASSIFICADO` | Existe decisão registrada da pessoa; sem ela o recorte fica `PENDENTE` | `DECISAO_HUMANA` |

## Reação a atualização do IDS

A **detecção** de diferenças é feita por conferências mecânicas fora desta skill. Para a biblioteca de um produto, o botão **Verificar biblioteca** do plugin (só leitura) gera um relatório com erros, avisos e informações: variável ausente ou renomeada, valor de regra alterado, ligação desfeita, property fixa alterada, mode faltando ou sobrando, properties públicas no componente, vínculo rompido com o Core, pacote diferente do instalado. Para mudanças do IDS ou do Core (propriedade renomeada, removida, nova, chave nova, destino inexistente) o mesmo relatório mostra os destinos que deixaram de existir. Esse botão só existe no plugin, **dentro do Figma**: você não o executa. Peça à pessoa que rode **Verificar biblioteca** e cole o texto do relatório na conversa (ou o salve em `etapas/<etapa>/recibos/`). Esta skill **interpreta o relatório** e não o substitui: sem relatório, o recorte fica `NAO_VERIFICAVEL` (camada `NAO_DISPONIVEL_NO_MCP`). Classifique cada diferença:

| Mudança no IDS | Classificação | Ação |
| --- | --- | --- |
| Propriedade nova, padrão não altera a aparência | Sem impacto | Aceitar; registrar como `CANDIDATA` no catálogo de opções |
| Propriedade nova, padrão altera a aparência | Versão menor com teste de impacto | Comparar bloco a bloco antes de aceitar; nota de publicação descreve a mudança |
| Propriedade renomeada ou removida, chave de componente nova, destino inexistente | Versão maior do chassi | Corrigir contrato e pacote; guia de migração; o produto reinstala |

Devolva a lista do que precisa mudar e a camada responsável (`IDS`, `ANALISE_CONTRATO`, `MONTAGEM_CORE`, `PRODUTO_PACOTE`). Confira também que nenhum produto alterou **nomes** (de variáveis, de coleções, de identificadores de ligação ou de caminhos): produto escolhe valores e opções do catálogo, nunca nomes.

## Auditoria do kit de regiões e da receita

Para cada região do contrato do kit (leitura, sem alterar o arquivo):

| Critério | Como conferir | Camada se falhar |
| --- | --- | --- |
| Componente publicado | nome, ID, chave relida; vínculo com o IDS remoto | `MONTAGEM_CORE` |
| Sem property pública de visibilidade | `componentPropertyDefinitions` da região (do `COMPONENT`; se for variante, do `COMPONENT_SET` pai) não tem BOOLEAN de visibilidade | `MONTAGEM_CORE` |
| Camadas ligáveis | cada caminho do contrato existe; cada nome é único dentro do nó anterior; o estado padrão bate | `MONTAGEM_CORE` (ou `ANALISE_CONTRATO` se o caminho do contrato não existe) |
| Texto | mestre sem texto local nem default TEXT; texto default de IDS em camada oculta não editável fica como `LIMITE`, não como `APTO` | `MONTAGEM_CORE` / `IDS` |
| Acesso a texto | a property TEXT pública da instância nomeada existe com a chave real; a escrita foi exercitada em instância de prova | `MONTAGEM_CORE` |
| Itens | por ocorrência: `Show leading item`, `Show supporting item`, `Type`, `Trailing item` (fixo), `Has next item` e texto da ação conferem com a matriz por item; `Show leading item` bate com a referência | `MONTAGEM_CORE` |
| Tokens | padding (4 lados), gap e raio com `boundVariables` resolvidos ao token do contrato; sem spacer | `MONTAGEM_CORE` |
| Medidas | altura/largura de cada bloco e do espaçamento entre blocos × referência, com causa medida para cada diferença; total só como alarme; máximo de itens aceito sem quebrar | `MONTAGEM_CORE` / `ANALISE_CONTRATO` |
| Variáveis de layout | a coleção de layout do chassi existe e está publicada ("publicada" = `importVariableByKeyAsync` funciona a partir de um arquivo consumidor; sem esse arquivo, `NAO_VERIFICAVEL`); só tem variáveis FLOAT de layout; **uma coleção por produto com um só mode** (reprove coleção com mode de outro produto); o componente de um produto não referencia a coleção de outro; `boundVariables` do gap/padding aponta para ela; alterar o valor no Core muda a altura (evidência da rodada controlada) | `MONTAGEM_CORE` |
| Overlay | altura acompanha a composição; não é número fixo herdado | `MONTAGEM_CORE` |
| Texto de prova | literal da referência ou da receita; nenhum texto "sintético" nem de outro produto | `MONTAGEM_CORE` |
| Provas mantidas | as provas citadas no recibo ainda existem | `MONTAGEM_CORE` |

Para a **receita** (`chassi vN`): a ordem dos blocos e o espaçamento por bloco reproduzem cada cenário; a lista de itens respeita quantidade, ordem e máximo por produto; nenhuma região aparece num produto sem evidência; a versão do chassi está declarada no contrato da etapa e no componente instalado.

## Auditoria do Core (critérios herdados)

1. **Vocação e layout:** confira áreas, ordem, capacidade de crescimento, rolagem, ações fixas e estados contra o contrato. Compare dimensões renderizadas nos cenários declarados; investigue padding, gap, `itemSpacing`, sizing HUG/FILL/FIXED e containers internos antes de chamar uma diferença de falha. Um valor default de v1 não é referência automática para v2.
2. **IDS e origem:** cada componente, ícone, token e estilo usado deve vir da biblioteca autorizada na versão registrada, ou ser composição local justificada. Não exija que o Core copie componentes externos da referência. Instâncias aninhadas mantêm vínculo; um detach não é equivalência.
3. **API pública:** properties TEXT, BOOLEAN, VARIANT, INSTANCE_SWAP e SLOT contratados precisam estar realmente expostos na instância consumida pelo produto. Um controle apenas em sublayer ou instância de nível 2+ não é API pública suficiente. Se o pai não expõe a property, confira a solução contratada por SLOT/composição; não permita que o produto acesse a camada interna. Verifique definições duplicadas ou ausentes após criação de slot/property.
4. **Texto vazio:** o mestre Core não pode fornecer cópia. Audite textos locais, defaults de properties TEXT e defaults das instâncias IDS aninhadas. Instâncias de prova separadas podem ter conteúdo ilustrativo, sem contaminar o mestre.
5. **Estados repetíveis:** confira cada item e cada estado contratado, incluindo seus espaços de conteúdo aberto/fechado e independência de modes de produto. Uma amostra visual em um estado não prova os demais. Compare identidade, ordem, cardinalidade e expansão vertical.
6. **Tokens de layout:** quando houver token IDS equivalente e contrato de uso, confirme o vínculo de padding, gap e radius; frames spacer hardcoded e cores/valores inventados não satisfazem esse contrato. Ajustes especiais de componentes, como Card base ou Divider, só são exigidos se a versão conectada realmente os demandar e o contrato os registrar.

Reprove como `MONTAGEM_CORE` collection de conteúdo de produto no Core, texto governável embutido no mestre, property essencial inacessível ao produto, dependência IDS falsa ou mudança fora da fronteira de atualização localizada. Se a API não expuser o vínculo para conferência, marque o item `NAO_VERIFICAVEL`.

## Auditoria da biblioteca de produto

Confira que a tela do produto é um componente publicado próprio, com instância do Core publicado esperado. A receita de produto governa texto, valores, presença e condições; o Core fornece capacidade. Verifique separadamente as coleções **Operação, Contexto e Produtos Adicionais** quando previstas no pacote, sem criar uma quarta coleção ou mode combinatório por inferência. Um eixo investigado que não varie naquela tela não exige override inventado.

Para cada campo governável, compare valor base, valores dos modes, variável, collection, binding e alvo público com contrato e pacote. Valores iguais entre modes podem estar centralizados deliberadamente. Para TEXT property de componente, o binding correto aparece em `componentProperties[prop].boundVariables.value` como `VARIABLE_ALIAS`, aplicado por `setProperties` + `VariableAlias`; binding em `characters` de texto interno de instância não satisfaz a property pública. Para visibilidade/fill/tamanho, confira o mecanismo de binding realmente suportado. Não aceite variável como substituto de property ou SLOT público do Core.

Confira items repetidos **por ocorrência**: título, corpo, estado, boolean, variante e visibilidade. Se a versão IDS oferecer itens com ação à direita, valide `Show supporting item`, `Trailing item`, `Supporting item Type` e texto real do supporting item aninhado para cada ocorrência; `Has next item` isolado não comprova ação. Preserve `Description` quando contratado, sem trocar por `Tag` por aparência.

Releia somente os cenários declarados, incluindo combinações relevantes de property de componente e mode de conteúdo. Se uma combinação não puder ser observada sem escrita, marque-a `NAO_VERIFICAVEL`. Compare expansão, quebras, corte, CTA e estados no menor e maior conteúdo contratado. Um recibo de execução complementa a evidência, mas não substitui releitura do Figma.

Para cada eixo do produto, confronte a matriz de influência da análise com a coleção e os bindings instalados: (1) um cenário base, (2) um par em que apenas aquele eixo muda, quando observado, e (3) o resultado de voltar ao base. Registre por campo/bloco o valor ou presença antes/depois, a property pública afetada e se os outros dois eixos permaneceram constantes. `SEM_COBERTURA` ou `DIFERENCA_SEM_CAUSA_ISOLADA` na análise não viram `APTO` por alternar um mode arbitrário. Se o agente não puder executar a troca sem editar o arquivo durante a auditoria, use evidência preservada de uma rodada controlada e marque o comportamento não observável como `NAO_VERIFICAVEL`.

### Produto instalado: o que ele não pode ter

No componente do produto: (a) só as regiões que o contrato do produto lista; (b) nenhuma camada oculta que pertença a região de outro produto; (c) nenhuma property pública de visibilidade nem de "template"; (d) coleções `Operação`, `Contexto` e `Produtos Adicionais` com os modes do contrato (lembre o limite de modes por coleção do plano do Figma); (e) bindings por caminho aplicados e visíveis em `boundVariables`; (f) textos do modo base iguais aos da referência; (g) altura por cenário × referência; (h) versão do chassi gravada. Confira a troca de cada eixo de um mode para outro **por leitura** (instâncias de prova em cada combinação e `valuesByMode`), sem alterar o arquivo; o que só uma alteração exercitaria usa a evidência preservada e fica `NAO_VERIFICAVEL`.

### Cadeia de atualização (Core → biblioteca do produto → designer)

Recorte `CADEIA_DE_ATUALIZACAO`, só com evidência da rodada controlada. **Por MCP só se lê**: `getPublishStatusAsync()`, a `key` estável, a importação por chave e o estado atual das instâncias no arquivo do produto e do designer (alturas, modes, textos). Notas de publicação e a tela de atualização do designer **não são legíveis**: os itens (1) a (3) só se comprovam por captura ou texto que a pessoa anexar, senão ficam `NAO_VERIFICAVEL` (camada `NAO_DISPONIVEL_NO_MCP`). Confira nesta ordem: (1) o Core foi publicado com nota; (2) a biblioteca do produto mostra a atualização com a nota, foi aceita e **republicada**; (3) o designer mostra a atualização com a nota e a aceitou; (4) a tela mudou como esperado (altura/estrutura), a **chave do componente** não mudou, os **modes escolhidos** e os textos continuam; (5) uma tela do designer que não usa a região alterada não mudou. Sem republicar a biblioteca do produto a mudança não chega ao designer: isso é comportamento esperado, não falha. Para **versão maior** confira também: (6) o guia de migração existe na receita e está completo (antes → depois, ação do time, ação do designer sem `detach`, o que se preserva, prazo de convivência e obsolescência); (7) a versão anterior continua publicada durante o prazo; (8) a troca de instância antiga → nova mantém o nó, os modes e os textos (as coleções foram reaproveitadas por nome). Classificação errada de menor/maior (mudança de receita entregue como menor) reprova `ANALISE_CONTRATO`. Vínculo perdido, modes perdidos ou texto perdido reprovam `PRODUTO_PACOTE` ou `MONTAGEM_CORE`.

## Conjunto da etapa e rastreabilidade

Ao validar o conjunto, reconcilie contrato da etapa, contratos/recibos por tela, produtos presentes, versões, chaves publicadas e pendências. Uma tela ainda não montada fica explícita e não bloqueia a leitura das demais, mas impede chamar o conjunto de completo. Confira o vínculo Core → produto e a importação do componente de produto somente com chaves publicadas e verificadas. Métricas nativas de uso e de `detach` não são legíveis por MCP: marque-as `NAO_VERIFICAVEL`, ou registre o que a pessoa enviar (captura), sem atribuir automaticamente um evento a duas bibliotecas.

## Veredito para a pessoa

Comece por um cartão curto: tela/recorte, contratos e recibos recebidos, arquivos acessíveis e o que será conferido. Depois entregue Markdown copiável (modelo em `modelos/veredito-validacao.md`) com critérios, evidência, estado, divergências, camada responsável e ação necessária. Para cada erro, explique primeiro **o que a pessoa verá**, depois o que precisa mudar e quem resolve. Não despeje IDs e properties no resumo humano.

Use `APTO_PARA_REVISAO_HUMANA`, `REPROVADO`, `PENDENTE` ou `NAO_VERIFICAVEL` no veredito geral, com limites explícitos. Não altere o Figma para fechar a auditoria. Uma decisão de negócio pendente volta à pessoa; capacidade comum volta ao contrato/Core; conteúdo ou condição específica volta ao contrato/pacote do produto; falha do IDS volta à biblioteca dona. Entregue evidência e versão, sem declarar publicação ou adoção por aparência. Uma auditoria do Core pode liberar **revisão e registro da tela** com o contrato da etapa ainda parcial; ela não libera automaticamente o pacote da etapa inteira.

---

## Referências (leia no momento indicado)

O detalhe fica em arquivos de apoio, carregados sob demanda. Este texto diz **quando** ler cada um; a leitura é obrigatória nesse momento.

- [`references/figma-mcp.md`](references/figma-mcp.md): Leia **antes da primeira chamada ao Figma** e sempre que uma chamada falhar: servidor, ferramentas, identificadores, regras do `use_figma`, receitas de leitura e o que a pessoa precisa fazer no Figma.
- [`references/auditoria-tecnica.md`](references/auditoria-tecnica.md): Leia ao auditar: cola contrato–recibo–canvas, estratégias de composição, fidelidade da experiência e bibliotecas, componentes e configuração pública.
