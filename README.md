# Método portátil de chassi do consignado

Este pacote contém as três skills do Figma Agent, os modelos em `workflow/` e
o verificador local de contratos em `scripts/contracts.cjs`, além do gerador
dos visualizadores em `scripts/build-contract-viewer.py` e
`scripts/build-key-catalog.py`.
Comece por `workflow/COMECE-AQUI.md` e use `workflow/README.md` para o fluxo
completo. `workflow/portar-ambiente.md` explica a mudança de máquina. Nenhum arquivo Figma, biblioteca, chave
publicada ou histórico Git foi incluído. Comece pelo pedido inicial de cada
etapa e selecione no Figma Agent as bibliotecas aprovadas no ambiente de uso,
conferindo se a versão disponível é v1 ou v2.
Depois de salvar os contratos e o registro da nova etapa, gere a página HTML
com `python3 scripts/build-contract-viewer.py`; o guia está em `viewer/README.md`.
Após publicar bibliotecas nesse ambiente, preencha um cadastro a partir de
`workflow/templates/cadastro-publicacoes.json` em `catalog/figma-publications.json`
e gere `viewer/catalogo.html` com `python3 scripts/build-key-catalog.py`.

Este repositório distribui o método; as referências e os contratos de cada
rodada devem ser criados e revisados no ambiente em que serão usados.
