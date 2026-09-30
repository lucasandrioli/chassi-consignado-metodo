# Histórico do plugin

O número de versão fica em `plugin/version.json`, aparece na tela do plugin e é gravado no arquivo junto do pacote instalado. Suba-o a cada geração do plugin que vá para alguém: **último dígito** quando só muda o conteúdo de um pacote, **do meio** quando muda o comportamento sem quebrar instalações existentes, **primeiro** quando o jeito de instalar muda de forma incompatível.

## 2.2.1
- Removida a regra que ligava a `true` toda property do Core com nome começando em "Mostrar ": era específica de um Core de teste e não estava em nenhum contrato. O plugin agora só age sobre o que o pacote declara.
- `build.cjs` ganhou `--root`, `--out` e `--check`; `gen-packages.cjs` e `contracts.cjs`, `--root`. Os testes usam o exemplo em `exemplos/fake`, não os pacotes do repositório.

## 2.2.0
- **Quando cada bloco aparece vale para todas as versões maiores**, como o texto: as variáveis de visibilidade deixam de levar `v<N>/` no nome. Instalar a v2 ao lado da v1 reaproveita o que o produto decidiu na v1 e só cria variáveis para ligações novas.
- **Incompatível com bibliotecas instaladas pelo 2.0.x/2.1.0**: nelas as variáveis de visibilidade têm `v1/` no nome; o Verificar as acusa como ausentes. Só há arquivos de teste nessa situação; reinstale em arquivo novo.

## 2.1.0
- **O quando-aparece de cada bloco passa a ser do produto.** O valor de visibilidade por mode que vem do pacote é só o valor inicial: ao reinstalar ou atualizar, o plugin **preserva** o que o produto já decidiu (como faz com o texto). O Verificar mostra a diferença como **informação**, não como erro.
- O `structureHash` deixa de incluir os valores de visibilidade: mudar só quando um bloco aparece não exige subir a versão do chassi. Continuam na estrutura: quais camadas são ligáveis, alvos, eixos, modes e properties fixas.
- **Bibliotecas instaladas pelo plugin 2.0.x** têm o `structureHash` antigo: reinstale em arquivo novo ou suba a versão do chassi (só há arquivos de teste nessa situação).

## 2.0.1
- Corrigido no Figma real: o botão **Confirmar e instalar** aparecia o tempo todo (agora só depois do plano); a janela ficou mais alta para os botões de confirmação não ficarem fora da vista.
- Corrigido: a verificação de uma versão maior tratava as variáveis de regra de outra versão maior (`…/vN/…`) como órfãs (54 avisos falsos com a 1.x e a 2.0 no mesmo arquivo).

## 2.0.0
- **Regra de versão do chassi.** O pacote traz `chassiVersion` (N.N, vinda do contrato) e o plugin decide: **mesma versão maior e menor maior** atualiza **no lugar**; **versão maior nova** instala um componente `.../vN` **ao lado** do antigo; pacote mais antigo é recusado; estrutura mudada sem subir a versão é recusada. Atualização no lugar e versão maior nova **pedem confirmação** na tela e nunca apagam nada.
- O nome do componente passa a levar a versão maior (`Etapa/<etapa>/<produto>/<tela>/v1`); as variáveis de regra (BOOLEAN) também são separadas por versão maior; os textos são compartilhados entre versões maiores.
- Novo registro no arquivo (`installs` por versão maior). **Incompatível com instalações do plugin 1.x**: elas são recusadas com mensagem clara (use um arquivo novo).
- O pacote passa a ter `structureHash` (estrutura sem textos): mudar só o texto inicial não bloqueia a reinstalação.

## 1.1.0
- Novo botão **Verificar biblioteca (só leitura)**: compara a biblioteca instalada com o pacote e lista erros (chassi violado), avisos (variável órfã ou renomeada, pacote diferente do instalado) e informações (texto do produto que difere do valor inicial). Não altera o arquivo.

## 1.0.0
- Primeira versão numerada. Instala a etapa a partir dos pacotes embutidos (INSS e OP, tela Revisão).
- Preserva os textos que o produto já editou ao reinstalar; presença e regras seguem o pacote.
- Mostra a versão do plugin e a identificação de cada pacote na tela e grava a versão no arquivo.
