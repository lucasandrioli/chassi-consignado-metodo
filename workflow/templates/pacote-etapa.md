# Pacote de instalação — <produto> / <etapa>

**schemaVersion:** <versão do formato>

**Etapa e versão:** <ID estável e versão do contrato da etapa>

**Produto e versão:** <ID e versão da receita/biblioteca>

**Estado:** rascunho / publicado / compatibilidade verificada

**Biblioteca do produto:** <arquivo e versão acessíveis neste ambiente>

## Telas publicadas

Uma linha por tela que a etapa deste produto realmente oferece. A quantidade e a ordem de apresentação vêm do contrato revisado, não de um número fixo no instalador.

| ID estável da tela | Chave publicada do componente do produto | Versão da tela | Chave/versão do Core aninhado | Contrato e recibo usados | Estado de publicação |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Dependências e validação

| Dependência | Biblioteca de origem | Chave/versão esperada | Como foi verificada | Resultado |
| --- | --- | --- | --- | --- |
| Core por tela |  |  | instância aninhada, origem e properties |  |
| IDS usado pelo Core |  |  | recurso publicado, variável/propriedade e vínculo |  |

O plugin roda no arquivo da biblioteca do produto: importa **as chaves publicadas do Core** e instala um componente por tela listada, três coleções de variáveis, modos e bindings definidos no pacote do produto. Antes de escrever, valida etapa, produto, chaves e propriedades do Core. Uma tela sem chave Core publicada bloqueia a instalação da etapa; nenhuma chave é inventada a partir do nome do frame. Após validar conteúdo, modos e componentes e publicar, o designer usa os componentes publicados pelo Figma.

**Exclusões ou relações de navegação:** <seguir o contrato da rodada; protótipo pode estar fora do escopo>.

**Prova em arquivo de equipe:** <links e resultado dos vínculos; métricas nativas quando disponíveis>.
