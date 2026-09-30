# Pacotes da biblioteca de produto

Esta pasta é preenchida pelo gerador (`node plugin/scripts/gen-packages.cjs`), um JSON por etapa e produto, a partir dos contratos. Um exemplo completo, com dados fictícios, está em `exemplos/fake/`. O [guia do plugin](../README.md) descreve a passagem.

## Como o pacote é gerado (a partir dos contratos)

Os pacotes **não são editados à mão**. `node plugin/scripts/gen-packages.cjs` lê duas tabelas de máquina dos contratos e grava `plugin/packages/<etapa>-<produto>.json`; `--check` só confere se os pacotes gravados estão em dia. O gerador não guarda texto de conteúdo.

- **Contrato da tela** (por exemplo `tela-a.md`): bloco `<!-- camadas:inicio -->` com a tabela **Camadas ligáveis** (`camada` → `caminho` completo, com ` > ` entre os níveis) e bloco `<!-- core:inicio -->` com a tabela **Chave publicada do Core** (componente, chave, link do arquivo, data e nota; exatamente uma linha). A chave mora **só aqui**, para todos os produtos; declará-la no contrato do produto é erro.
- **Contrato do produto na tela** (por exemplo `produto-x-tela-a.md`): a configuração inclui `chassi.versao` (N.N), que vira `chassiVersion` do pacote e comanda a regra de instalação do plugin (ver README do plugin). Bloco `<!-- pacote:inicio -->` com as tabelas **Configuração**, **Eixos**, **Notas**, **Ligações** (`id`, `tipo`, `alvo`, `eixo`, `fixa`, `padrão`) e **Valores por modo** (`id`, `modo`, `valor`). O alvo é `componente: A > B :: Property` ou `camada: <id da camada ligável>`. Em células, `\|` é a barra e `\n` a quebra de linha.
- **Uma etapa com várias telas**: cada contrato de produto por tela vira uma tela do mesmo pacote do produto, na ordem do registro. Os eixos e os modos precisam ser **iguais em todas as telas** da etapa do produto; o gerador recusa se diferirem.
- **Regra de propriedade**: o produto altera textos e valores; **ids, alvos, eixos e modos** pertencem ao chassi.
- Mudou um contrato? Suba a versão no cabeçalho e no `registro.json`, rode `node scripts/contracts.cjs lock --registry <registro> --note "..."`, regere os pacotes e rode `node scripts/verificar.cjs`, que falha se algum pacote gravado diferir do contrato.
