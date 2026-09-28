# Pedido inicial para a análise — `<etapa>`

Você pode começar **com o prompt abaixo**, sem preencher um documento antes. Adicione pelo `+` as bibliotecas IDS autorizadas à conversa do Figma Agent. O registro opcional depois do prompt ajuda a repetir e versionar a rodada.

> Use `/consignado-analise-etapa` para analisar a tela **`<tela da vez>`** da etapa **`<etapa confirmada pela pessoa ou "etapa não confirmada">`**. Não deduza a etapa do título ou da função da tela; se ela não estiver confirmada, pergunte e mantenha o contrato da etapa pendente. As referências estão em **`<link do arquivo ou Section>`**. Os produtos conhecidos são **`<produtos ou "descubra nos frames">`**. Investigue Operação, Contexto e Produtos Adicionais e outras dimensões que os frames mostrarem; não preciso descrever cada frame. As bibliotecas IDS desta rodada foram adicionadas à conversa: **`<nomes e versões exibidos, v1 ou v2>`**. **`<exclusões e decisões já confirmadas, se houver>`**. Faça somente leitura. Entregue separadamente: atualização do contrato da etapa, contrato Core desta tela sem cópia de produto, contrato de cada produto observado nesta tela, evidências, pendências e handoff para montagem. Inclua uma linha por frame com link, contagens reconciliadas, versões e estados dos documentos, dependências entre contratos, tabelas de produto/cenário e origem IDS verificada ou pendente; informe separadamente se está pronto para revisão, registro ou montagem.

Se uma informação essencial faltar, a skill deve ler o que o Figma mostrar e marcar o restante como pendente. Ela não salva automaticamente os Markdown no repositório. Menções a outras telas ajudam o mapa da etapa, mas não comprovam a finalidade ou a cobertura completa dela.

## Registro opcional da rodada

**Projeto:** `<nome permitido neste ambiente>`

**Etapa e ID:** `<nome humano e identificador local>`

**Rodada/versão:** `<identificador e data>`

**Objetivo:** `<qual hipótese de chassi ou diversidade será testada>`

**Natureza das referências:** real aprovada / real não aprovada / sintética / mista

**Produtos participantes:** `<nomes e responsáveis; um contrato por produto>`

**Telas esperadas:** `<nomes e IDs confirmados, se houver; quantidade variável>`

**Tela da vez:** `<nome ou Section; deixe em aberto se a análise começará por inventário>`

**Referências Figma:** `<links locais acessíveis à equipe; arquivo, página ou Sections>`

**Arquivo Core:** `<link da rodada ou ainda não criado>`

**Bibliotecas IDS autorizadas:** `<nome exato exibido, v1 ou v2, link, papel e estado de publicação de cada uma; quantidade variável>`

**Eixos para investigar:** Operação `<valores observados ou desconhecidos>`; Contexto `<valores por produto ou desconhecidos>`; Produtos Adicionais `<valores ou desconhecidos>`; outras dimensões `<se houver>`.

**Decisões confirmadas:** `<afirmação, fonte/pessoa e data; vazio significa pendente>`

**Exclusões:** `<por exemplo, ligações de protótipo; não herdar exclusões de outra rodada>`

Use o mesmo registro em cada tela da etapa, atualizando a tela da vez e a cobertura observada. Os links e valores preenchidos não são transferidos automaticamente para outra máquina ou conta.

## Pedido copiável para a montagem, após revisão dos contratos

> Use `/consignado-montagem-chassi` para montar somente a tela `<tela da vez>` da etapa `<etapa>`. Leia a versão revisada do contrato da etapa, do contrato Core desta tela, das receitas dos produtos participantes e das referências citadas. O arquivo Core desta rodada é `<link>`. As bibliotecas IDS autorizadas são `<nomes e links>`; confira publicação, chaves e properties antes de usá-las. Monte um mestre de tela **sem qualquer texto padrão, inclusive nas instâncias IDS aninhadas**. Ponha cópia sintética apenas em instâncias de prova. Teste os cenários de menor e maior densidade e as áreas/estados condicionais do contrato. Entregue o recibo com vínculos, auditoria de texto vazio, provas e pendências, sem importar dados de outra etapa.

Substitua os campos entre `< >` antes de enviar. Uma tela com decisão estrutural pendente continua pendente para montagem; não complete a lacuna por analogia com a prova sintética.

## Pedido copiável para a validação

> Use `/consignado-validacao-etapa` para auditar a tela `<tela da vez>` da etapa `<etapa>`, no recorte `<CORE ou PRODUTO>`. Confronte os contratos revisados, o recibo ou pacote, as referências citadas e os arquivos Figma `<links>`. As bibliotecas IDS da rodada estão conectadas à conversa com suas versões exatas. Faça somente leitura e entregue um veredito com o que passou, falhou ou não pôde ser verificado; não corrija o arquivo durante a auditoria.
