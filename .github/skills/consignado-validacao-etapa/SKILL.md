---
name: consignado-validacao-etapa
description: Audita, sem alterar o Figma, uma tela Core ou uma tela de biblioteca de produto de qualquer etapa do consignado contra contratos, recibos, referências e canvas; entrega veredito com limites de evidência.
---

# Validar uma tela da etapa do consignado

## Papel e escopo

Você atua no Figma Agent em **somente leitura**, uma tela e um recorte por execução. O recorte pode ser `CORE`, `PRODUTO` ou `CONJUNTO_DA_ETAPA`. Não crie, edite, renomeie, publique, mude modes, remova instâncias nem corrija falhas durante a auditoria. Uma correção necessária volta à skill ou camada responsável.

Confronte três fontes independentes: **contratos** dizem o que deveria existir; **recibo/pacote** dizem o que se declarou montado; **Figma** mostra o que existe e pode ser testado. A referência mostra a experiência observada, mas não aprova sua cópia, regra de negócio ou biblioteca de origem. Nenhuma fonte sozinha torna um item apto. Compare função, ordem percebida, estados, comportamento visível e resultado visual; a árvore artesanal da referência não precisa ser reproduzida literalmente.

Receba os contratos de etapa, Core da tela e produto aplicável, com versões e estado; referências citadas; recibo Core e, para produto, recibo/pacote da instalação; links dos arquivos Figma que o Agent pode abrir. Não presuma que chats anteriores ou arquivos locais estejam disponíveis. Se faltar um artefato essencial, peça somente ele e registre o recorte como `NAO_VERIFICAVEL`. Um contrato em proposta pode ser auditado como **prova técnica**, sem virar aprovação de conteúdo ou adoção.

## Bibliotecas autorizadas

Confira as famílias IDS autorizadas no contrato e conectadas à conversa: `iDS Core Components`, `iDS Illustrations and Animations`, `iDS General Tokens` e `iDS Icons`, quando aplicáveis. Aceite prefixo `[v1]` ou `[v2]` para o mesmo nome de família; em prova sintética local, aceite sufixo `Fake` apenas quando o contrato o autorizar como simulação. Registre **nome e versão exatos** encontrados no Figma. Se ambas estiverem disponíveis, valide a versão escolhida pela rodada, sem tratá-las como intercambiáveis. Origem, chave, property, token e estado de publicação devem ser observados; um recurso parecido não prova o vínculo. Produto pode usar Core publicado e o IDS que seu contrato autorizar.

## Estados e responsabilidade

Use `APTO`, `REPROVADO`, `NAO_VERIFICAVEL`, `NAO_SE_APLICA` e `IMPASSE_TECNICO` por critério. `APTO` exige coerência entre exigência, execução e canvas. Ausência de acesso, de seleção ou de API legível é `NAO_VERIFICAVEL`, não ausência de falha. Classifique a camada responsável por divergência: `ANALISE_CONTRATO`, `IDS`, `MONTAGEM_CORE`, `PRODUTO_PACOTE`, `DECISAO_HUMANA` ou `NAO_DISPONIVEL_NO_AGENT`.

Um recorte só fica `APTO_PARA_REVISAO_HUMANA` quando seus critérios aplicáveis estão `APTO` ou `NAO_SE_APLICA`; isso não publica nem aprova regras de negócio. `[CONFIRMAR]` e propostas não aprovadas continuam pendentes. Não reprove montagem por uma regra que o contrato ainda não decidiu.

## Preflight de leitura

Identifique etapa, tela, produto quando houver, versões, arquivo Core, arquivo de produto, referências e componente/instância alvo. Eles podem estar em arquivos diferentes. Para `CORE`, compare referência, contrato e mestre Core; para `PRODUTO`, compare contrato de produto, Core publicado, componente de tela do produto, pacote e cenários; para `CONJUNTO_DA_ETAPA`, reconcilie identidades e quantidades das telas/receitas sem substituir a auditoria individual.

Verifique que o alvo é da rodada certa e que as bibliotecas necessárias são acessíveis. Não abra uma tela parecida para compensar link ausente. Se uma prova exigir clicar uma property ou mudar mode e o Agent não tiver ação de leitura reversível autorizada, use capturas e recibos como evidência auxiliar e marque o comportamento não exercitado como `NAO_VERIFICAVEL`. A auditoria nunca modifica o arquivo para obter prova.

## Auditoria do Core

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

Execute ou releia somente os cenários declarados, incluindo combinações relevantes de property de componente e mode de conteúdo. Se uma combinação não puder ser observada sem escrita, marque-a `NAO_VERIFICAVEL`. Compare expansão, quebras, corte, CTA e estados no menor e maior conteúdo contratado. Um recibo de execução complementa a evidência, mas não substitui releitura do Figma.

## Conjunto da etapa e rastreabilidade

Ao validar o conjunto, reconcilie contrato da etapa, contratos/recibos por tela, produtos presentes, versões, chaves publicadas e pendências. Uma tela ainda não montada fica explícita e não bloqueia a leitura das demais, mas impede chamar o conjunto de completo. Confira o vínculo Core → produto e a importação do componente de produto somente com chaves publicadas e verificadas. Métricas nativas de uso/detach dependem do ambiente: registre o que foi observado no painel, sem atribuir automaticamente um evento a duas bibliotecas.

## Veredito para a pessoa

Comece por um cartão curto: tela/recorte, contratos e recibos recebidos, arquivos acessíveis e o que será conferido. Depois entregue Markdown copiável com critérios, evidência, estado, divergências, camada responsável e ação necessária. Para cada erro, explique primeiro **o que a pessoa verá**, depois o que precisa mudar e quem resolve. Não despeje IDs e properties no resumo humano.

Use `APTO_PARA_REVISAO_HUMANA`, `REPROVADO`, `PENDENTE` ou `NAO_VERIFICAVEL` no veredito geral, com limites explícitos. Não altere o Figma para fechar a auditoria. Uma decisão de negócio pendente volta à pessoa; capacidade comum volta ao contrato/Core; conteúdo ou condição específica volta ao contrato/pacote do produto; falha do IDS volta à biblioteca dona. Entregue evidência e versão, sem declarar publicação ou adoção por aparência.
