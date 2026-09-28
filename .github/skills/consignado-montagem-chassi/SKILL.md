---
name: consignado-montagem-chassi
description: Monta ou atualiza o mestre Core de uma tela de qualquer etapa do consignado a partir dos contratos revisados, com IDS publicado, texto vazio e recibo verificável.
---

# Montar o chassi de uma tela do consignado

## Escopo e entrada

Você atua no Figma Agent, **uma tela por execução**. Receba o contrato da etapa, o contrato Core da tela atual, as receitas dos produtos participantes para conhecer os casos de estresse, referências citadas, bibliotecas IDS autorizadas e arquivo Core de destino. A pessoa pode colar os contratos completos na conversa; não presuma acesso a chats anteriores nem ao repositório local. Se faltar uma decisão estrutural indispensável, devolva a lacuna ao Analista. Não infira aprovação de conteúdo de produto a partir de um frame.

Classifique o trabalho como `NOVA_TELA_CORE` ou `ATUALIZACAO_LOCALIZADA`. No segundo caso, identifique mestre local, subárvore/property/estado autorizado, quantidade exata de itens a criar e invariantes. Só essa fronteira pode mudar; não reconstrua o mestre inteiro para resolver um delta. As referências continuam somente leitura. Nunca monte no arquivo de referências, no IDS ou na biblioteca de produto.

Exija versão e estado dos contratos. O contrato da etapa pode permanecer **proposta parcial** porque as outras telas ainda não foram analisadas; isso não bloqueia a prova isolada da tela atual quando seus contratos e decisões estruturais estão suficientes. Identifique a prova como tal, sem tratá-la como publicação pronta para consumo. Quando a pessoa autorizar a montagem, não transforme isso em aprovação automática das regras de produto.

## Bibliotecas da rodada

Use somente famílias IDS conectadas pelo `+` à conversa e autorizadas no contrato: `iDS Core Components`, `iDS Illustrations and Animations`, `iDS General Tokens` e `iDS Icons`, conforme aplicáveis. Aceite prefixo `[v1]` ou `[v2]` com o mesmo nome de família. Em prova sintética local, um sufixo `Fake` explícito é permitido quando o contrato autoriza essas bibliotecas como simulação; não as confunda com o IDS corporativo. Confira no Figma o nome exato, a versão, a publicação, a chave e as properties de cada recurso usado. Se as duas versões da mesma família estiverem acessíveis, siga a escolha expressa no contrato/rodada; não alterne entre elas por conveniência nem presuma que defaults, tokens ou properties sejam equivalentes. Famílias distintas podem ter versões diferentes quando o contrato as autorizar. Biblioteca desconectada ou origem não verificável vira pendência.

Uma instância IDS mantém vínculo com seu componente publicado. Não faça detach para alterar aparência. Quando a referência tiver recurso externo, procure equivalente autorizado por papel e resultado visual; não copie o asset externo. Uma composição local deve ter justificativa de vocação e depender de componentes/tokens IDS quando aplicáveis. Crie componente local no Core apenas para uma composição realmente própria e reutilizada; do contrário use frame semântico local.

## Fronteira Core × produto

O Core oferece **estrutura, espaços de conteúdo, estados e controles públicos**. Nenhum mestre Core fornece texto: `characters` de textos locais, defaults de properties TEXT e defaults de textos em instâncias IDS aninhadas devem ficar vazios. Use nomes semânticos de camadas e properties para preservar a vocação. Texto sintético de prova só pode viver em instâncias separadas do mestre e deve ser removido da entrega publicável.

Não crie nem consuma no Core collections de conteúdo do produto, como Operação, Contexto ou Produtos Adicionais. Não use variables locais de um produto para fazer o Core parecer completo. Tokens e estilos publicados do IDS podem governar layout, cor e forma do Core, desde que a origem e a compatibilidade estejam verificadas. O produto vinculará conteúdo e presença às **properties/slots públicos do Core** em sua própria biblioteca, por pacote/plugin revisado.

Se um IDS aninhado não expuser um controle que o produto precisará, primeiro verifique se o Core consegue encaminhar uma property pública. Quando isso não for possível, proponha SLOT ou composição local justificada e prove a API disponível. O produto nunca depende de acessar sublayers ou instâncias internas do Core. Não combine SLOT e exposição de property nested no mesmo nó sem prova de suporte; se for impossível, registre impasse.

## Preflight antes de escrever

1. Confira arquivo Core, tela, versão dos contratos, fronteira de edição e alvos. Em atualização localizada, registre antes nomes, IDs, filhos, variantes, properties, vínculos e estado de publicação que devem permanecer intactos; confirme que o alvo é local e editável.
2. Confirme no Figma cada candidato IDS e sua configuração pública real. Uma property sugerida pelo Analista, mas ausente na versão conectada, é impasse, não licença para editar a instância por dentro.
3. Leia o blueprint semântico e os casos de estresse da tela atual. Confira se etapa e receitas de produto exigem uma capacidade comum ainda não contratada; devolva ao contrato antes de montar.
4. Planeje unidades verificáveis: casca, áreas, blocos repetíveis, estados, ações e exposição pública. Cada unidade tem resultado e prova de término.

Não refaça a análise de negócio no preflight. Se a referência usar estrutura artesanal, preserve função, ordem percebida, comportamento visível e resultado visual pelo blueprint aprovado, sem copiar Groups ou coordenadas.

## Montagem por unidades

Monte primeiro a estrutura semântica: raiz e regiões de navegação, conteúdo rolável, ações fixas e sobreposições somente quando contratadas. Configure direção de auto layout, HUG/FILL/FIXED, min/max, alinhamento, padding, gap, wrap e ordem antes de ajustar aparência. Use posicionamento absoluto apenas se o contrato declarar um papel real de sobreposição. Distingua grade visual de grade estrutural. Confira dimensões **renderizadas** e quebras de texto nos casos de prova; uma divergência pode vir do sizing de container interno do IDS, padding ou `itemSpacing` default diferente.

Vincule padding, gap e corner radius de containers locais a tokens **publicados da versão IDS escolhida**, quando houver equivalentes verificáveis. Evite frames spacer da referência: represente a relação por auto layout e gap governado. Não transfira escala numérica ou nomes de tokens de v1 para v2 sem conferência. Se um componente como Card base ou Divider exigir ajuste especial de sizing, confirme isso na versão concreta antes de aplicar uma receita técnica; registre no recibo o mecanismo observado.

Configure instâncias apenas por suas properties públicas: TEXT, BOOLEAN, VARIANT, INSTANCE_SWAP e controles reais de sizing/visibilidade. Não invente troca, ícone, estado ou property porque uma versão anterior possuía. Inspecione a cadeia aninhada até o controle relevante. Quando um bloco IDS de ação à direita for usado, configure **cada item separadamente** conforme o contrato: `Show supporting item`, `Trailing item`, `Supporting item Type` e texto da ação, somente se essas properties existirem na versão escolhida. `Has next item` isolado não define ação. A cópia real de produto fica fora do mestre; instâncias de prova podem exercitar os controles e depois ser removidas.

Para itens repetidos com estados, mantenha identidades, ordem e crescimento vertical. Cada item deve permitir todos os estados exigidos e seus espaços de texto próprios, mesmo que a referência só mostre um estado. Teste a property do IDS em **cada instância**, independentemente dos modos de conteúdo futuros. Se uma property estrutural só se aplicar a parte dos estados, compare variante plana, componente aninhado, SLOT, composição local e wrapper condicional; escolha apenas a estratégia contratada. Não crie opções artificiais `Não se aplica` por padrão.

Depois de `createSlot()` ou de adicionar property ao mestre, releia imediatamente `componentPropertyDefinitions`. Confirme nomes, tipos, referências e ausência de duplicatas antes de inserir mais nós. Releia também em instâncias de prova após aninhamento; uma property presente no mestre IDS pode não ficar exposta ao consumidor do Core. Se faltarem controles, registre a falha no recibo e interrompa a unidade afetada.

## Prova e recibo

Para cada unidade, registre `CONCLUIDA`, `CONCLUIDA_COM_LIMITE` ou `BLOQUEADA`, com evidência de estrutura, vínculo IDS, property exposta e resultado visual. Teste os cenários declarados de menor e maior densidade e uma expansão adicional plausível quando o contrato exigir capacidade de crescimento. Prove banners, tabelas, áreas condicionais, ações e estados apenas quando previstos. Teste texto em **instâncias de prova** e confirme que o mestre continua vazio ao final. Não masque falha de herança fixando modos ou valores em descendentes.

Antes de concluir, audite o mestre: zero textos/defaults de texto, propriedades públicas realmente configuráveis, IDS aninhado ainda remoto e vinculado, tokens de origem correta, nenhum conteúdo de produto, nenhuma instância temporária no mestre. Em atualização localizada, compare snapshot anterior e posterior: irmãos, variantes, IDs, properties, bindings e coleções fora da fronteira intactos.

Entregue um recibo de montagem copiável com: etapa/tela/versões, arquivo e chave do Core, capacidades por ID semântico, propriedades e slots, dependências IDS com versão exata v1/v2, provas de estados e layout, auditoria de texto vazio, limites e decisões. O recibo deve comparar o esperado no contrato com o que foi encontrado no Figma e apontar pendências por unidade. Não escreva `published` nem declare chave válida antes da publicação normal e releitura no Figma. O recibo pode ficar `PENDENTE`, `PRONTO_PARA_REVISAO` ou `PRONTO_PARA_CONSUMO`, conforme evidência.

O pacote/plugin da biblioteca de produto aplicará conteúdo nas instâncias públicas do Core. Para TEXT properties de componente, ele deve vincular `VariableAlias` via `setProperties`; não deve usar `setBoundVariable('characters', ...)` em texto interno de instância. Esta skill registra os alvos públicos, mas **não instala** variables de produto nem componentes no arquivo do designer.
