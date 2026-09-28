# Comece aqui: fundação em um novo ambiente

Este guia serve para iniciar **qualquer etapa do consignado** com as referências e bibliotecas disponíveis no ambiente de trabalho. A prova sintética local não é ponto de partida obrigatório. O GitHub transfere texto e método; arquivos Figma, bibliotecas, permissões e chats precisam existir ou ser acessíveis no novo ambiente.

## Antes da primeira análise

1. Copie os arquivos deste repositório para um local permitido na máquina. Se só puder usar o navegador, abra **Raw** e salve os arquivos de texto mantendo seus nomes e pastas.
2. No Figma Agent, configure a [skill de análise](../.github/skills/consignado-analise-etapa/SKILL.md) com o conteúdo integral. Se já houver uma skill curada em uso, compare as duas e faça uma prova curta antes de substituí-la. A [skill de montagem](../.github/skills/consignado-montagem-chassi/SKILL.md) e a [de validação](../.github/skills/consignado-validacao-etapa/SKILL.md) serão usadas depois da análise.
3. Reúna as referências da etapa em um arquivo Figma acessível à equipe. Agrupe por tela e mantenha o nome dos frames suficientemente claro para identificar produto e cenário. Você não precisa descrever manualmente cada frame no prompt.
4. Identifique as bibliotecas IDS autorizadas nesse ambiente. No **+ → Bibliotecas** da conversa do Figma Agent, adicione as que a análise precisa consultar. Registre os nomes e versões que aparecem ali; `[v1]` e `[v2]` não são intercambiáveis por suposição.

## Primeira tela

Escolha **uma tela** da etapa e envie ao Figma Agent. Informe o nome da etapa quando souber; o nome da tela nunca é usado para inventá-lo:

> Use `/consignado-analise-etapa` para analisar a tela **`<nome da tela>`** da etapa **`<nome da etapa>`**. As referências estão em **`<link do arquivo ou Section>`**. Descubra os produtos e cenários nos frames; investigue Operação, Contexto e Produtos Adicionais quando aparecerem. As bibliotecas IDS **`<nomes e versões>`** estão conectadas à conversa. Faça somente leitura e entregue separadamente a atualização do contrato da etapa, o contrato Core da tela sem texto de produto e o contrato de cada produto observado, com evidências e pendências.

A análise deve devolver **rascunhos**, não contratos aprovados. Se a etapa ainda não foi confirmada, escreva `etapa não confirmada` no pedido: a skill pode ler a tela, mas deve perguntar a etapa e deixar o contrato da etapa pendente, sem derivá-la do título da tela. Confira a tabela com um link por frame, as contagens reconciliadas, as vocações, as diferenças com evidência, a origem IDS realmente inspecionada e as pendências. O contrato da etapa é cumulativo: ao analisar a próxima tela, acrescente sua função sem apagar as anteriores. Uma combinação que não aparece nas referências permanece desconhecida.

## Guardar o resultado localmente

1. Crie `etapas/<id-da-etapa>/contratos/`. Salve ali os Markdown revisados usando os [modelos de etapa](templates/contrato-etapa.md), [tela/Core](templates/contrato-tela.md) e [produto por tela](templates/contrato-produto-tela.md). Mantenha `**Versão:** 0.1` na primeira revisão e aumente a versão quando mudar um contrato já registrado. Antes do registro, compare todos os documentos com os campos obrigatórios dos modelos; pendências técnicas podem continuar explícitas, mas identidade, versões, referências e tabelas exigidas não podem simplesmente faltar.
2. Copie o [modelo de registro](templates/registro-contratos.json) para `etapas/<id-da-etapa>/contratos/registro.json`. Substitua os IDs, caminhos, produtos e dependências de exemplo pelos desta rodada. Liste esse registro em `contracts/index.json`, a partir do [modelo de índice](templates/indice-registros.json). **`contracts/` guarda o índice; os Markdown e o registro da rodada ficam em `etapas/<id-da-etapa>/contratos/`.** O registro deve conter a etapa, cada tela analisada e a receita de cada produto nessa tela.
3. Depois de conferir o conteúdo, execute `node scripts/contracts.cjs lock --registry etapas/<id-da-etapa>/contratos/registro.json --note "revisão inicial"` e `node scripts/contracts.cjs check`. O snapshot detecta mudanças posteriores; **não significa aprovação de negócio**.
4. Repita a análise, uma tela por vez, até cobrir as telas da etapa. Revise a vocação e a relação entre telas no contrato cumulativo. Marque decisões que alteram estrutura ou presença como pendentes até haver evidência ou confirmação.

Se quiser visualizar os contratos depois de registrá-los, instale `viewer/requirements.txt` e rode `python3 scripts/build-contract-viewer.py`. Isso gera uma página local de leitura; os Markdown continuam sendo a fonte.

## Quando a fundação termina

A passagem para montagem exige, para cada tela: referências reconciliadas; vocação e áreas definidas; capacidades, ordem, estados e limites de layout descritos; receitas de produto separadas; bibliotecas IDS identificadas; e decisões estruturais resolvidas ou explicitamente bloqueadas. Só então use a skill de montagem no arquivo Core da nova rodada. O plugin de biblioteca de produto pertence a uma fase posterior.

Para detalhes e limites de transporte, leia o [fluxo completo](README.md) e [portar o ambiente](portar-ambiente.md).
