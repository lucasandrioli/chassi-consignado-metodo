# Execução técnica detalhada

## Execução técnica detalhada

A profundidade abaixo é o procedimento detalhado de montagem. Use-a para o **Core sem texto e sem coleções de conteúdo de produto**. Onde este procedimento fala em fidelidade de texto, faça essa comparação em instâncias de prova separadas; o mestre permanece vazio. Nunca use uma property interna de instância IDS como se fosse uma interface pública do Core consumida pelo produto.


## Profundidade de execucao por propriedade

O contrato do Analista transforma a leitura profunda da referencia em decisoes
de montagem. Ao executar cada decisao, aplique a mesma profundidade no Core ou no delta autorizado. Nao copie valores brutos ou estruturas da
referencia: reproduza a consequencia visual e funcional usando o mecanismo
autorizado que o contrato declarou.

| Frente | Ao montar, confira e aplique quando estiver no contrato | Nunca faca |
| --- | --- | --- |
| Hierarquia e estado | papel do node, ordem entre irmaos, visibilidade, relacao pai-filho, camada sobreposta e condicao do bloco | usar nome, numero ou posicao da referencia como papel semantico |
| Casca e containers | limite da tela, conteudo rolavel, acoes fixas, recorte, overflow e relacao entre regioes | transformar conteudo oculto ou superficie nao visivel em ausencia de bloco |
| Auto layout | direcao, alinhamento principal e cruzado, padding por lado, gap, quebra, ordem, tamanho fixo, hug, fill, minimos, maximos, stretch e item absoluto | usar coordenadas como substituto de regra de layout |
| **Containers internos de componente** | inspecionar `layoutSizingHorizontal` e `layoutSizingVertical` dos containers intermediarios para diagnosticar divergencias de quebra e altura; corrigir somente por controle publico contratado ou composicao local autorizada | editar diretamente o container interno do IDS para forcar fidelidade; sem controle compativel, registrar o limite |
| **Espacamento de instancias inseridas** | comparar padding, gap e `itemSpacing` com a referencia; aplicar somente ajustes contratados em containers locais ou controles publicos da instancia | transformar uma divergencia visual em autorizacao para override interno do IDS |
| Grade | distinguir guia visual de grade estrutural; na estrutural, aplicar colunas, linhas, tracks, gaps, spans, ancoras, fluxo e alinhamento previstos | criar grade apenas porque a referencia parece organizada em colunas |
| Geometria e borda | proporcao, tamanho, raio geral ou por canto, suavizacao, borda, traco, alinhamento e diferenca entre caixa geometrica e limite renderizado | redesenhar vetores ou copiar paths para obter fidelidade |
| Superficie | fill, opacidade, blend, gradiente, imagem, crop, escala, filtro, sombra, blur, textura ou ruido previstos | criar token, imagem, cor ou efeito local para tapar falta de recurso autorizado |
| Recorte e transformacao | clipping, mascara, crop, rotacao, espelhamento ou transformacao somente quando o contrato declarar mecanismo viavel | deduzir um mecanismo apenas pela aparencia final |
| Texto | conteudo, estilo, fonte, peso, tamanho, line-height, espacamento, alinhamento, quebra, truncamento, lista, link, decoracao e trechos excepcionais | uniformizar texto ou substituir trecho especial sem preservar seu papel |
| Asset | papel de icone, ilustracao, imagem, video, pattern, emoji ou vetor; escala, crop e relacao com o bloco | reutilizar URL, thumbnail ou asset externo observado na referencia |
| Componente | property publica, valor, variante, boolean, troca, visibilidade, tamanho, style e cadeia de elemento aninhado registrados | alterar elemento interno por acesso estrutural ou supor que uma property existe |
| Variable e binding | collection, group, mode, tipo, valor, alias, escopo e alvo de binding declarados | criar alias, scope ou binding em dimensao diferente para resolver uma lacuna |

Apos inserir uma instancia de componente reutilizado, compare imediatamente
suas dimensoes renderizadas com o bloco correspondente na referencia. Se
houver divergencia, investigue padding, gap e `itemSpacing` — os valores
default do componente podem nao corresponder a referencia. Aplique os
ajustes contratados por controles publicos ou no layout local autorizado;
sem mecanismo compativel, registre o limite da unidade.

### Itens iDS com acao a direita

Quando o contrato incluir uma `## Matriz de itens com acao a direita`,
aplicar as properties de **cada item individualmente**, nunca como lote
uniforme:

- **Item sem texto nem icone a direita**: configurar `Show supporting item = false`
  e `Trailing item = None`, quando esses controles forem publicos.
- **Item com acao**: configurar `Show supporting item = true`,
  `Trailing item = Icon` e texto exato da acao conforme a matriz. Preservar
  o `Supporting item Type` documentado no contrato — se for `Description`,
  manter `Description`; nunca substituir por `Tag` sem instrucao explicita.
  Descer a cadeia aninhada (`Supporting item` e descendentes de texto) para
  confirmar o texto real da acao por ocorrencia.
- **Icone sem texto de apoio**: quando a matriz registrar chevron sem legenda,
  testar a combinacao independente `Show supporting item = false` +
  `Trailing item = Icon` na versao IDS conectada. Preservar o icone somente se
  a combinacao funcionar na instancia; nao inventar texto para mante-lo.
- `Has next item` nao e evidencia de acao e nao governa `Show supporting item`
  nem `Trailing item`. Ignorar essa property ao decidir a presenca de acao.
- Inspecionar e registrar cada instancia individualmente no recibo. Nao
  assumir que todas as instancias de um mesmo bloco compartilham a mesma
  configuracao de acao.

### Layout, responsividade e ordem visual

Para cada container local previsto no blueprint, configure primeiro sua funcao
estrutural e depois sua aparencia. Confirme direcao, sizing e alinhamento dos
dois eixos antes de ajustar espacamentos. Quando o contrato usar quebra, ordem
invertida, item absoluto, grow, stretch, minimo, maximo ou grid, aplique essa
regra explicitamente e confira o resultado no tamanho de tela declarado.

Se uma borda, sombra, blur ou efeito fizer o bloco ocupar visualmente mais que
sua caixa, confira o resultado renderizado antes de ajustar largura, padding ou
overflow. Nao corrija essa diferenca encolhendo conteudo por tentativa.

### Texto, estilos e conteudo excepcional

Para texto controlável em **instância de prova**, use somente a property pública comprovada; mantenha vazios todos os textos e defaults do mestre Core. Depois confira a leitura completa: estilo,
largura, altura, quebra, truncamento, alinhamento e espacamentos. Quando o
contrato registrar trecho com enfase, lista, link, fonte ausente, texto em
caminho ou outro tratamento especial, preserve-o somente pelo mecanismo que o
contrato declarou. Se esse mecanismo nao estiver disponivel, interrompa o
bloco com `IMPASSE_TECNICO` em vez de reduzir silenciosamente sua leitura.

Se uma escrita falhar por fonte ausente, registre `FONTE_AUSENTE` com o nome da fonte e preserve a unidade original bloqueada; retome essa chamada somente quando a fonte estiver disponível. Uma alternativa tipográfica só pode ser uma **prova estrutural separada** quando a pessoa a autorizar explicitamente, com o limite visual declarado.

### Superficies, imagens e efeitos

Use primeiro styles, tokens, componentes e assets autorizados. Para gradiente,
imagem, crop, filtro, sombra, blur, textura, ruido, mascara ou transformacao,
execute apenas a intencao e o mecanismo descritos no contrato. Se o contrato
registrar um limite de fidelidade, mantenha-o visivel no recibo. Nao converta
efeito especial em cor solida, nem imagem externa em asset da proposta, sem
decisao humana.


## Montagem por unidades verificaveis

Siga o `Plano de acao para montagem` na ordem declarada. Na montagem de novo Core, a primeira unidade deve criar a fundação da próxima, sem tentar terminar a tela inteira. Em atualização localizada, cada unidade deve corresponder a uma
parte inequivoca do delta, sem tocar nos invariantes.

Para cada unidade:

1. diga qual resultado parcial sera criado;
2. confirme os recursos autorizados e variables de que ela depende;
3. monte ou altere somente os blocos indicados;
4. aplique configurações públicas, styles e assets previstos; bindings de conteúdo do produto ficam para a biblioteca de produto;
5. compare a unidade com a referencia ou base autorizada;
6. confira estrutura, recurso usado, property configurada, binding e resultado
   visual;
7. registre `CONCLUIDA`, `CONCLUIDA_COM_LIMITE` ou `BLOQUEADA`;
8. so avance quando a prova de termino declarada para ela estiver atendida.

Nao transforme uma unidade bloqueada em outra estrutura por conveniencia. A
resolucao precisa vir do contrato, de uma decisao humana ou de uma estrategia
alternativa ja aprovada.


## Fidelity visual, texto e assets especiais

Fidelidade nao e copiar valores brutos da referencia. Ela e preservar o efeito
percebido usando a fundacao autorizada e a estrutura limpa do contrato ou,
para delta localizado, preservar o alvo e aplicar apenas a mudanca aprovada.

Quando uma secao condicional vier no contrato, aplique apenas sua estrategia
declarada:

| Secao do contrato | Como montar |
| --- | --- |
| Fundamentos visuais e efeitos especiais | usar recurso autorizado ou limite indicado; nao criar token novo para um unico valor |
| Assets, ilustracoes e icones | usar candidato autorizado, mantendo papel, escala e relacao visual previstos |
| Texto excepcional, lista ou link | preservar leitura, ordem, enfase e comportamento visivel dentro do mecanismo disponivel |
| Mascaras, recortes ou transformacoes | reproduzir somente o resultado e mecanismo que o contrato declarou viavel |
| Comportamento que exige confirmacao | parar antes de prometer resultado que a skill nao consegue executar |

Nao crie imagem, icone, vetor, style ou token para substituir uma lacuna de
biblioteca sem decisao humana. Nao trate asset externo da referencia como asset
autorizado.


## Fundamentos e componentes que exigem prova da versão IDS

Tokens e componentes variam entre versões do IDS. Primeiro leia **a biblioteca conectada**. Registre a versão, o nome do recurso, o valor resolvido e o vínculo aplicado. Não transporte a escala numérica de spacing, as properties ou uma correção de sizing de `[v1]` para `[v2]` por semelhança de nome.

Para cada container local, confira se padding dos quatro lados, gap e corner radius têm tokens publicados equivalentes. Se existirem e estiverem autorizados, vincule-os por `setBoundVariable` à propriedade de layout correspondente e releia `boundVariables`. Se não existirem, registre o limite e use somente a decisão do contrato. Um spacer da referência indica uma distância visual; investigue se o Core pode expressá-la com auto layout e gap antes de criar outro frame.

Quando um componente IDS for usado como superfície ou container, confirme se ele **aceita conteúdo**. Uma instância não pode receber filhos por `appendChild`. Se a versão autorizada oferecer apenas uma superfície visual, use um wrapper local semântico com a instância como fundo e o conteúdo como irmãos, somente quando o contrato autorizar essa composição. Confira clipping, constraints e dimensões renderizadas depois de preencher a instância de prova. Não aplique essa técnica automaticamente a todo Card.

Para Divider, linha ou outro elemento cuja geometria interna possa colapsar em auto layout, confira a altura renderizada antes de declarar a unidade concluída. Se `HUG` a reduzir a zero na versão observada, use o sizing previsto no contrato e registre a correção; o valor de altura não é universal entre bibliotecas.

Para cada peça IDS aninhada, faça duas provas distintas: (1) a property pública funciona na instância dessa peça; (2) a mesma capacidade chega ao consumidor de uma **instância do Core**, por exposição pública ou SLOT. A primeira prova não substitui a segunda. Ao criar SLOT ou promover property, releia imediatamente `componentPropertyDefinitions` **do `COMPONENT` dono** (se for variante, do `COMPONENT_SET` pai; nunca de uma variante) e verifique nomes, tipos e duplicatas; nas instâncias de prova releia `componentProperties` e `exposedInstances`. Guarde uma instância de prova separada ou um recibo com evidência relível de cada caso de menor e maior densidade; um teste temporário removido sem evidência não valida o layout.

---
