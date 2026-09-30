# Técnicas detalhadas de execução

## Técnicas detalhadas de execução

Onde esta seção disser "tela", leia "região" ou "composição de prova".

### Leitura de montagem antes de escrever

O contrato já investigou. Sua releitura só confirma que recursos e destinos existem **neste arquivo**. Antes da primeira unidade, confirme cada linha; se não confirmar, aja como indicado. Não transforme isso em nova análise de negócio.

| Frente | Confirmação necessária | Se não confirmar |
| --- | --- | --- |
| Destino do kit | página do Core correta; regiões podem ser criadas sem tocar nas referências nem em outras regiões | parar antes de criar |
| Destino em `ATUALIZACAO_LOCALIZADA` | região inequívoca, página, tipo esperado, `remote = false`, fronteira e quantidade exata | parar antes de editar |
| Bibliotecas | famílias autorizadas conectadas; candidatos do contrato encontrados **por chave publicada** | `IMPASSE_TECNICO` ou `LOCAL_LAYOUT` se já previsto |
| Componente | property pública, variante, boolean, texto ou troca exigidos pela decisão existem | não inventar configuração |
| Variável (coleção de layout do chassi) | coleção, tipo e valores do plano existem ou podem ser criados como declarados | parar se o plano não puder ser executado |
| Binding | o alvo aceita a variável (gap, padding, radius) | parar; não deixar valor solto como atalho |
| Visual | asset, efeito, máscara ou texto excepcional tem estratégia declarada | seguir o limite do contrato |

No preflight de `ATUALIZACAO_LOCALIZADA`, registre **antes** de escrever: nó e página do alvo; contagem, nomes e IDs dos filhos e variantes; snapshot das component properties; snapshot das variáveis, modes e bindings relevantes; a base indicada pelo valor da property; nome e quantidade exatos do que será criado; overrides e visibilidades autorizados.

### Receita do Card base como container

Na biblioteca observada, `Card base` é um container vazio (80×80, sem filhos, properties só VARIANT); confirme na versão da rodada. **Instância não aceita `appendChild`.** Para usá-lo como fundo de conteúdo, só se o contrato autorizar:

1. Crie um frame local `wrapper` (auto layout vertical, sem fill, `clipsContent = true`, raio ligado ao token de card).
2. Insira a instância de Card base como filho **absoluto** (`layoutPositioning = 'ABSOLUTE'`, `x = 0`, `y = 0`, constraints `STRETCH` nos dois eixos).
3. Insira um frame de conteúdo como filho normal (vertical, padding e gap ligados a token, fill transparente).
4. **Depois de montar todo o conteúdo**, redimensione o Card base para o tamanho do wrapper (`resize(wrapper.width, wrapper.height)`): constraints `STRETCH` sob auto layout `HUG` deixam uma sobra que só o `resize` manual corrige. Confira clipping e o tamanho renderizado.

### Divider em auto layout

Na biblioteca observada, o Divider tem uma linha de altura 0. Com `layoutSizingVertical = 'HUG'` ele colapsa e some. Configure `divider.layoutSizingVertical = 'FIXED'; divider.resize(divider.width, 1);` e confirme a altura renderizada. O valor de 1 px vale para a biblioteca observada; leia o da biblioteca da rodada.

### Aliases, scopes e origem de variáveis

Use alias só quando o contrato declarar reaproveitamento válido de valor. Não invente alias, não crie ciclo e não use alias para misturar os eixos Operação, Contexto e Produtos Adicionais. Scope serve para organizar a escolha (por exemplo `GAP` para espaçamento) e não autoriza recurso nem substitui o binding no alvo. Não estenda coleção, não trate valor remoto como autorizado e não complete modes ou valores ausentes por suposição.

### Wrapper de estados condicionais (estratégia opcional, `WRAPPER_ESTADOS_CONDICIONAIS`)

Nunca é o padrão. Só quando uma property estrutural (por exemplo `Quantidade`) se aplica a parte dos estados e uma matriz plana criaria duplicação ou opções "não se aplica". Compare antes `VARIANT` plano, componente aninhado, SLOT, composição local e wrapper. O wrapper usa um `INSTANCE_SWAP` público para `Estado`, uma instância aninhada exposta para promover só as properties do estado, sizing `HUG` com `minHeight`. Limite do Figma: não combine SLOT e property aninhada exposta no mesmo nó; se ambos forem exigidos, abra decisão humana. Exige no contrato: preferred values do swap, properties por estado, quantidade exata de componentes auxiliares, cenários por estado e a limpeza prevista.

### O que não fazer (lista consolidada)

- Não montar nem editar sem contrato aprovado e completo; não trabalhar em família inteira, tela parecida ou superfície não declarada.
- Não alterar referências nem outras regiões; não copiar, duplicar ou reutilizar a estrutura, os componentes, styles, tokens ou assets externos de uma referência.
- Em `ATUALIZACAO_LOCALIZADA`, não mutar fora da fronteira, não reconstruir a região, não alterar irmãos ou variantes.
- Não criar coleção de conteúdo de produto no Core, mode combinatório nem BOOLEAN pública de visibilidade ou de "existência de tela".
- Não deixar conteúdo governável fixo porque a referência está fixa; não inventar property, variante, troca, equivalente de biblioteca, valor de variável, token ou regra de negócio.
- Não editar o interior de instância IDS; não usar `setBoundVariable('characters', …)` em texto interno (usar `setProperties` + `VariableAlias` na property TEXT pública da instância nomeada).
- Não criar componente local por conveniência, sem as duas reutilizações declaradas; não criar recurso visual novo para tapar lacuna de biblioteca.
- Não declarar pronta uma unidade sem sua prova de término; não imprimir o recibo antes da conferência completa.
- Não parar a configuração no nível 1 de um wrapper: desça até a instância aninhada onde a property existe, conforme o contrato.
- Não assumir o sizing dos containers internos de componentes: leia `layoutSizingHorizontal/Vertical` e compare **bloco a bloco** com a referência.
- Não tratar instâncias repetidas como idênticas: confira booleans, variantes e visibilidade de cada uma.
- Não usar padding, gap ou raio fixo quando há token; não reproduzir frame spacer (usar `gap` ligado a token).
- Não aplicar a ação à direita em lote: configure cada item pela matriz por item. `Has next item` não prova ação. Não trocar `Supporting item Type = Description` por `Tag`. Não inferir texto de ação sem descer até o nó de texto real.
