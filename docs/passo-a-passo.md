# Passo a passo

Este guia leva de um repositório recém-clonado até o plugin instalado na biblioteca de um produto. Os blocos de texto em cinza são **prompts prontos**: troque só o que está entre `< >`.

Trabalhe **uma tela por vez**. Cada tela passa pelas três skills e é promovida antes da próxima; o contrato da etapa vai crescendo com cada tela.

## 0. Preparação (uma vez)

### 0.1 Node.js

Precisa do **Node 18 ou mais novo**. É só o executável: o projeto não usa `npm`, não baixa nada da internet e não tem dependências.

```sh
node -v
```

Se não estiver instalado, peça à TI para instalar pelo portal de software da empresa ou por um **espelho (mirror) interno** de pacotes (é um servidor da empresa que guarda cópias de programas e bibliotecas, como um Artifactory ou um Nexus, para as máquinas não acessarem a internet). Só o Node é necessário.

### 0.2 Repositório

```sh
git clone https://github.com/lucasandrioli/chassi-consignado-metodo chassi-consignado
cd chassi-consignado
node scripts/verificar.cjs
```

Tudo deve dar `OK`. Se algo falhar, pare e resolva antes de continuar (veja a seção 6).

### 0.3 MCP do Figma no VS Code

1. `⇧⌘P` → **MCP: Add Server** → **HTTP** → cole `https://mcp.figma.com/mcp` → id `figma` → escopo global ou do workspace.
2. Autorize o Figma quando o navegador abrir.
3. Abra o chat do Copilot em modo **Agent** e digite `#get_metadata`: as ferramentas do Figma devem aparecer. Se não, reinicie o VS Code.
4. Requisito de conta: seat **Dev ou Full** em plano Professional ou superior. Sem isso o Figma limita a 6 chamadas por mês.

### 0.4 Skills

As skills estão em `.github/skills/`. Digite `/` no chat: devem aparecer `consignado-analise-etapa`, `consignado-montagem-chassi` e `consignado-validacao-etapa`.

### 0.5 Arquivos no Figma

Você precisa de três arquivos de design (`/design/` na URL):

| Arquivo | Para quê | Prepare |
| --- | --- | --- |
| **Referências** | Frames da tela atual, agrupados por produto e cenário | Nomes dos frames que permitam saber produto e cenário |
| **Core** | Recebe o kit de regiões montado pela skill | Bibliotecas do IDS **adicionadas ao arquivo** (Recursos → Bibliotecas) |
| **Biblioteca do produto** | Recebe a instalação do plugin (passo 3) | Só depois de publicar o Core: adicione a biblioteca Core a este arquivo |

O arquivo de referências pode ser também o do Core (uma página separada para o Core); diga isso no prompt.

## 1. Cada tela: análise, montagem, validação, promoção

### 1.1 Analisar (só leitura)

```
/consignado-analise-etapa
Analise a tela "<nome da tela>" da etapa "<nome da etapa>" (id sugerido da etapa: <id-da-etapa>, id sugerido da tela: <id-da-tela>).
Referências: <link do arquivo ou da Section, com node-id>.
Bibliotecas IDS já adicionadas a esse arquivo: <nomes exatos>.
Arquivo Core de destino: <link>.
Grave os contratos em etapas/<id-da-etapa>/rascunhos/ e mostre o cartão-resumo.
```

A skill devolve arquivos em `etapas/<id-da-etapa>/rascunhos/`:

| Arquivo | Conteúdo |
| --- | --- |
| `etapa.md` | Contrato da etapa (cumulativo) |
| `<id-da-tela>.md` | Kit de regiões e receita de composição da tela, com as camadas ligáveis e a chave do Core |
| `<id-do-produto>-<id-da-tela>.md` | Um por produto observado, com os textos por modo e as ligações |

**O que conferir no cartão-resumo antes de seguir:** a contagem de frames por produto bate com o arquivo; a vocação da tela faz sentido; as diferenças por Operação, Contexto e Produtos Adicionais estão certas; nenhuma decisão de negócio foi inventada. Responda às perguntas da skill (uma por vez). Se faltar algo, peça a correção e a skill **aumenta a versão** do rascunho.

Regras do contrato de produto que o gerador de pacotes exige (o modelo está em [`modelos/`](../modelos/)):

- todo eixo (Operação, Contexto, Produtos Adicionais) precisa de **ao menos um modo**; um eixo que não varia usa um modo único `padrao`;
- `chassi.versao` no formato `N.N` (comece em `1.0`);
- `estado` = `technical-proof` enquanto for prova controlada;
- todo arquivo começa com `**Versão:** N.N`.

### 1.2 Montar o kit de regiões (escreve no Core)

```
/consignado-montagem-chassi
Monte o kit de regiões da tela <id-da-tela> da etapa <id-da-etapa> a partir dos contratos em etapas/<id-da-etapa>/rascunhos/.
Destino Core: <link do arquivo Core>. Bibliotecas IDS adicionadas a esse arquivo: <nomes exatos>.
Grave o recibo em etapas/<id-da-etapa>/recibos/.
```

A skill cria os componentes no arquivo Core, prova a receita contra as referências e grava o recibo. Ela **não publica** nada.

### 1.3 Publicar o Core e registrar a chave (você, no Figma)

1. No arquivo Core: **Recursos → Bibliotecas → Publicar** (o Figma pode pedir para mover o arquivo para uma pasta da equipe).
2. Peça ao agente:

```
O Core foi publicado. Leia a chave publicada do componente da tela <id-da-tela>, confirme-a importando por chave a partir de outro arquivo que use a biblioteca, registre no recibo e atualize a tabela "Chave publicada do Core" em etapas/<id-da-etapa>/rascunhos/<id-da-tela>.md.
```

Enquanto a chave estiver como está no modelo (40 zeros), **não gere pacote**.

### 1.4 Validar (só leitura)

```
/consignado-validacao-etapa
Valide o recorte CORE da tela <id-da-tela> da etapa <id-da-etapa>. Contratos em etapas/<id-da-etapa>/rascunhos/, recibo em etapas/<id-da-etapa>/recibos/. Core: <link>. Referências: <link>.
```

Leia o veredito. Se houver `REPROVADO` ou `PENDENTE`, o veredito diz **qual camada corrige** (análise, montagem, IDS ou decisão sua). Corrija e valide de novo.

### 1.5 Promover os rascunhos a contratos

```sh
node scripts/promover.cjs <id-da-etapa> --note "<por que estes contratos foram conferidos>"
```

O comando move os arquivos para `etapas/<id-da-etapa>/contratos/`, cria ou atualiza o `registro.json`, lista-o em `contracts/index.json`, registra o snapshot e confere tudo. Erros comuns:

| Mensagem | O que fazer |
| --- | --- |
| `falta "**Versão:** N.N"` | O rascunho precisa da linha de versão no cabeçalho |
| `não achei a tela` | O arquivo do produto deve se chamar `<produto>-<tela>.md`, e o contrato `<tela>.md` deve estar nos rascunhos ou já registrado |
| `aumente a versão no Markdown…` | Você mudou o **conteúdo** de um contrato já registrado sem subir a versão: aumente `**Versão:**` no arquivo e rode de novo. Nada é alterado quando o comando falha: os rascunhos continuam onde estavam |

Repita 1.1 a 1.5 para a próxima tela. Na segunda tela em diante, a análise **atualiza** `etapa.md` (nova versão) e reusa os ids de produto e os modos de cada eixo, que precisam ser **os mesmos em todas as telas da etapa**. Os contratos das telas anteriores que não mudaram continuam válidos: o `promover` renova o registro deles com a sua nota.

## 2. Gerar o pacote e o plugin

Só depois de a chave do Core estar registrada nos contratos:

```sh
node plugin/scripts/gen-packages.cjs   # um pacote por produto, com uma tela por contrato
node plugin/scripts/build.cjs          # embute os pacotes em plugin/code.js
node scripts/verificar.cjs             # tudo OK
```

O gerador recusa: camada ligável sem ligação de visibilidade, eixos ou modos diferentes entre telas, `chassi.versao` diferente entre telas, chave do Core ausente ou inválida.

## 3. Instalar na biblioteca do produto

1. Figma Desktop: **Plugins → Desenvolvimento → Importar plugin do manifesto…** e escolha `plugin/manifest.json` (uma vez; se a empresa bloquear plugins de desenvolvimento, o plugin precisa ser publicado de forma privada pela organização).
2. Abra o arquivo da **biblioteca do produto** com a biblioteca Core **adicionada** (Recursos → Bibliotecas).
3. **Plugins → Desenvolvimento → Chassi · Biblioteca do produto → Instalar chassi na biblioteca**, escolha o pacote do produto e clique em **Instalar na biblioteca**.
4. Clique em **Verificar biblioteca**: deve dar 0 erros e 0 avisos.
5. Publique a biblioteca (Recursos → Bibliotecas → Publicar).

Depois disso o designer adiciona a biblioteca do produto ao arquivo dele, arrasta o componente da tela e escolhe os modes de Operação, Contexto e Produtos Adicionais no painel.

Para validar a biblioteca do produto com a skill:

```
/consignado-validacao-etapa
Valide o recorte PRODUTO "<id-do-produto>" da etapa <id-da-etapa>, tela <id-da-tela>. Biblioteca do produto: <link>. Core: <link>. Contratos e recibo em etapas/<id-da-etapa>/.
```

## 4. Depois da instalação

| O que mudou | Onde se faz | Precisa do plugin? |
| --- | --- | --- |
| Um texto de um produto | Variável na biblioteca do produto (Figma), publicar | Não |
| Quando um bloco aparece num modo | Variável de visibilidade na biblioteca do produto | Não |
| Visual dentro de um componente do Core | Arquivo Core, publicar | Não |
| Bloco novo, regra nova, nome de variável, eixo | Contrato → `promover` → `gen-packages` → `build` → plugin, com **versão do chassi maior** | Sim, com confirmação |

Regras de versão (atualizar no lugar × instalar ao lado como `/v2`) e a tabela de quem é dono de quê estão em [plugin/README.md](../plugin/README.md).

## 5. Com poucos créditos

- Comece com **uma tela** de ponta a ponta antes de partir para as outras: os erros aparecem cedo e custam pouco.
- **Uma tela por execução** de skill; não peça a etapa inteira de uma vez.
- Não rode a análise de novo para corrigir um detalhe: peça a correção do rascunho.
- Se uma skill pedir um dado que você já deu, aponte o arquivo em vez de repetir.

## 6. Problemas comuns

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| As ferramentas do Figma não aparecem no chat | MCP não conectado ou VS Code não reiniciado | Repita 0.3; reinicie o VS Code |
| Chamada do Figma falha por permissão ou limite | Seat sem permissão ou limite de leitura | Peça ao agente para chamar `whoami` e confira o plano e o seat |
| O agente diz que não vê a biblioteca do IDS | Ela não está **adicionada ao arquivo** | Adicione em Recursos → Bibliotecas e confirme com `get_libraries` |
| O link não funciona nas ferramentas | É `/board/`, `/slides/` ou `/make/` | Use um link `/design/` com `node-id` |
| `node scripts/verificar.cjs` falha em "code.js em dia" | Pacote ou fonte mudou sem novo build | `node plugin/scripts/build.cjs` |
| `gen-packages` recusa um contrato | Ver a mensagem: a tabela de máquina tem erro | Corrija o rascunho pelo [modelo](../modelos/) e promova de novo |
| Plugin: "componente Core publicado indisponível" | O Core não está publicado, não foi adicionado ao arquivo da biblioteca ou a chave está errada | Publique o Core, adicione-o ao arquivo e releia a chave |
| Plugin: "a estrutura do pacote mudou sem subir a versão" | Mudou a estrutura sem subir `chassi.versao` | Suba a versão do chassi no contrato do produto |
| Plugin: "Confirmação necessária" | Atualização no lugar ou versão maior | Leia o plano e clique em **Confirmar e instalar** |
| Verificar: "Variável ausente" | Alguém renomeou ou apagou uma variável | Nomes de variáveis são do chassi: desfaça no Figma ou reinstale |
