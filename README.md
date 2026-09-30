# Chassi do consignado por etapa

Método e ferramentas para criar, uma **etapa** de cada vez, um **chassi reutilizável** das telas do consignado e instalá-lo na biblioteca do Figma de cada produto, sem que os designers recriem telas nem colem texto à mão.

## Como funciona

| # | Passo | Quem faz | Ferramenta | Saída |
| --- | --- | --- | --- | --- |
| 1 | **Analisar** uma tela de referência | Agente (skill `consignado-analise-etapa`) | Copilot no VS Code + MCP do Figma, só leitura | Contratos em `etapas/<etapa>/rascunhos/` |
| 2 | **Montar** o kit de regiões no Core | Agente (skill `consignado-montagem-chassi`) | Copilot + MCP do Figma, escreve no arquivo Core | Componentes no Core e recibo em `etapas/<etapa>/recibos/` |
| 3 | **Publicar** o Core e registrar a chave | Pessoa, no Figma | Figma | Chave do componente nos contratos |
| 4 | **Validar** contra as referências | Agente (skill `consignado-validacao-etapa`) | Copilot + MCP do Figma, só leitura | Veredito |
| 5 | **Promover** os rascunhos a contratos | Pessoa | `node scripts/promover.cjs` | Contratos registrados e travados |
| 6 | **Gerar o pacote e o plugin** | Pessoa | `node plugin/scripts/gen-packages.cjs` e `build.cjs` | `plugin/code.js` |
| 7 | **Instalar na biblioteca do produto** | Time do produto | Plugin no Figma | Coleções, variáveis e componentes do produto |
| 8 | **Usar** | Designer | Figma | Instâncias publicadas, modes escolhidos no painel |

O texto de cada produto vive nas **variáveis da biblioteca do produto** (editado no Figma, sem plugin). O plugin só roda quando a **estrutura** do chassi muda. Quem é dono de cada coisa está na tabela de [plugin/README.md](plugin/README.md#quem-é-dono-do-quê-depois-da-instalação).

## Começar

Requisitos: **Node.js 18 ou mais novo** (sem npm e sem internet), VS Code com GitHub Copilot em modo Agent, o servidor MCP remoto do Figma, um seat Dev ou Full no Figma e o Figma Desktop.

```sh
node -v                      # 18 ou mais novo
node scripts/verificar.cjs   # tudo precisa dar OK
```

Depois siga o [passo a passo](docs/passo-a-passo.md), que traz os prompts prontos para cada skill.

## O que tem aqui

| Pasta | Conteúdo |
| --- | --- |
| `.github/skills/` | As três skills (análise, montagem, validação), cada uma com `references/`. Incluem `references/figma-mcp.md`: como usar as ferramentas do Figma por MCP |
| `docs/` | [Passo a passo](docs/passo-a-passo.md) e [decisões e pendências](docs/decisoes-e-pendencias.md) |
| `modelos/` | Modelos dos contratos de etapa, de tela e de produto (com as tabelas de máquina) e do veredito de validação |
| `etapas/` | Uma pasta por etapa: rascunhos, contratos e recibos. Nasce vazia |
| `contracts/index.json` | Lista dos registros de etapa promovidos. Nasce vazia |
| `plugin/` | O plugin do Figma (código, pacotes gerados, testes e [guia](plugin/README.md)) |
| `scripts/` | `verificar.cjs` (roda tudo), `promover.cjs`, `contracts.cjs` (registro e snapshots) |
| `exemplos/fake/` | Uma etapa completa com dados fictícios (contratos, pacotes e recibo), usada nos testes |

## Verificação

`node scripts/verificar.cjs` confere, em sequência: contratos e snapshots, pacotes em dia com os contratos, `plugin/code.js` em dia, o exemplo, as skills e os testes (contratos, promoção, gerador, eixos, caminhos e um simulador do instalador). Rode antes de qualquer commit e depois de qualquer mudança em contrato.
