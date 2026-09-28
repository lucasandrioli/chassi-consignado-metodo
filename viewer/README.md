# Consulta local da etapa

Abra [`catalogo.html`](catalogo.html) para consultar o **cadastro de chaves**. O mapa mostra qual componente publicado do Core corresponde a cada tela, qual componente publicado de cada produto o consome e quais chaves de coleção e variável alimentam os bindings de conteúdo. Selecione uma tela e um produto; a busca encontra IDs lógicos, destinos e chaves Figma. As chaves completas podem ser copiadas.

Os dados vêm de duas fontes locais:

- `plugin/packages/*.json`: versões, telas, chave Core, IDs lógicos de conteúdo, destinos, modos e valores sintéticos.
- `catalog/figma-publications.json`: observação das bibliotecas Figma, com chaves dos componentes de produto, coleções e variáveis. Este registro pertence ao ambiente da rodada. Chaves de outro ambiente precisam ser cadastradas após a publicação nesse ambiente.

O gerador confere o vínculo Core, o hash do pacote e a presença das variáveis esperadas. Uma divergência aparece como **Revisar cadastro**; o selo **Chaves conferidas** significa apenas que o registro local corresponde ao pacote na data indicada. Não equivale a aprovação de conteúdo nem a monitoramento contínuo do Figma.

Para atualizar a página depois de mudar o pacote ou recadastrar publicações, na raiz do repositório:

```sh
python3 scripts/build-key-catalog.py
```

O HTML gerado é autônomo e abre com `file://` ou pelo servidor local. Ele não modifica o Figma. O modelo portátil de cadastro vazio está em `workflow/templates/cadastro-publicacoes.json`.

Abra [`contratos.html`](contratos.html) para ler os contratos em formato de painel. Esse segundo painel organiza as fontes Markdown por etapa, tela, Core e produto. Após editar ou adicionar contratos ao `contracts/index.json`, gere novamente:

```sh
python3 -m pip install -r viewer/requirements.txt
python3 scripts/build-contract-viewer.py
```

O cadastro de chaves e o painel dos contratos são somente para consulta. Os arquivos JSON e Markdown seguem como fontes versionadas.
