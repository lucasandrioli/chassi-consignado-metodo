# Reconstruir o processo em outro ambiente

Este repositório pode distribuir **método, skills e modelos de contrato**. Arquivos Figma, bibliotecas publicadas, chaves, permissões e conversas do Figma Agent pertencem ao ambiente onde foram criados; um clone Git não os transfere. Uma rodada local de exemplo não é configuração para importar em outro ambiente.

## Pacote portátil

Copie ou recrie no ambiente permitido:

1. `.github/skills/consignado-analise-etapa/SKILL.md`, `.github/skills/consignado-montagem-chassi/SKILL.md` e `.github/skills/consignado-validacao-etapa/SKILL.md` para configurar as três habilidades no Figma Agent. O conteúdo é genérico para etapas do consignado.
2. Os modelos de `workflow/templates/` para abrir uma rodada e guardar contratos, registro, recibos, vereditos, cadastro de publicações e pacote de instalação versionados. Copie também `scripts/contracts.cjs` para conferir os snapshots locais e os dois geradores com `viewer/` para gerar os [painéis de consulta](../viewer/README.md).
3. Este guia e o [fluxo](README.md), que definem a passagem entre referências, Core, bibliotecas de produto e arquivo do designer.

Faça a cópia manual dos arquivos de texto se o repositório público não puder ser clonado na máquina de trabalho. Mantenha o mesmo nome e versão das skills nos dois lados ou registre a diferença no briefing. Instalar a habilidade no Figma Agent não cria automaticamente os arquivos Figma nem conecta o projeto local à conversa.

Antes de substituir habilidades que já funcionam no ambiente de destino, compare suas instruções e resultados com estas propostas. Preserve os detalhes comprovados de acesso às bibliotecas, properties, variáveis, bindings e validação; execute uma prova com o mesmo recorte antes de adotar a versão ampla.

Se usar o GitHub como fonte manual, abra **Raw** de cada `SKILL.md` e copie o conteúdo integral para uma habilidade com o mesmo nome no Figma Agent do novo ambiente. Copie os modelos Markdown necessários para arquivos locais permitidos. O endereço Raw entrega texto; ele não instala a habilidade, não recria bibliotecas e não concede acesso a links Figma de outro ambiente.

## Configuração da nova rodada

1. Comece com o [pedido inicial](templates/briefing-execucao.md): informe a tela da vez, a etapa quando conhecida e o link das referências. O briefing completo pode ser registrado depois; não precisa descrever cada frame antes da análise. Não transporte IDs, chaves ou URLs da prova sintética.
2. Reúna as telas de referência em um arquivo próprio. Identifique os cenários nos nomes ou metadados dos frames para ajudar a busca, mas deixe a skill ler a estrutura e as diferenças. Preserve a fonte e o estado de aprovação de cada referência.
3. Identifique as bibliotecas IDS aprovadas nesse ambiente. Podem existir arquivos separados para componentes, ícones e tokens ou outra organização, com prefixo `[v1]` ou `[v2]` no mesmo nome de família. Registre recursos publicados, propriedades, versão exata, permissões e lacunas; selecione as bibliotecas relevantes no `+` da conversa do Figma Agent. Não presuma equivalência entre versões.
4. Crie ou escolha um arquivo Core separado. Execute a skill de análise **uma tela por vez**. Revise contratos da etapa, tela e produto antes da montagem. A skill deve devolver Markdown copiável se não tiver acesso ao repositório.
   Salve os Markdown em arquivos locais, registre cada contrato no modelo `workflow/templates/registro-contratos.json` e liste o registro em `contracts/index.json` usando o modelo `workflow/templates/indice-registros.json`. Atualize as versões e execute `node scripts/contracts.cjs lock --registry etapas/<id>/contratos/registro.json --note "linha de base da rodada"` seguido de `node scripts/contracts.cjs check`. Substitua `<id>` pelo caminho da etapa. O snapshot registra revisão técnica, não aprovação de conteúdo.
5. Execute a skill de montagem para cada tela revisada. Guarde um recibo por mestre e use a skill de validação para confrontar contrato, recibo e Figma em cada recorte. Reconcilie o conjunto de telas com o contrato da etapa. A publicação do Core, a composição das bibliotecas de produto e o [pacote de instalação](templates/pacote-etapa.md) dependem das chaves e vínculos gerados **nesse novo ambiente**.
6. Após publicar as bibliotecas de produto, copie `workflow/templates/cadastro-publicacoes.json` para `catalog/figma-publications.json` e registre as chaves dos componentes, coleções e variáveis verificadas no Figma. Gere `viewer/catalogo.html` com `python3 scripts/build-key-catalog.py`. Esse cadastro é próprio da rodada e não substitui o contrato.

## Limite do material público

Antes de publicar o repositório, revise exemplos, histórico Git, links e arquivos anexos. O pacote público deve conter apenas material que pode ser divulgado: método, modelos e exemplos sintéticos. Não copie telas reais de colegas, textos ou regras internas, componentes/ícones/tokens proprietários, links internos, identificadores de clientes, credenciais ou chaves de bibliotecas corporativas. Se a equipe autorizar um conteúdo específico, documente a origem e a aprovação no ambiente de trabalho, não o presuma a partir da prova local.

Exemplos locais podem conter links e chaves de bibliotecas de prova. Eles servem à auditoria da rodada e não são dependências do método. No **checkout de origem**, antes de publicar, use `python3 scripts/exportar-pacote-publico.py <diretório-novo>`: o comando copia `workflow/`, as três skills genéricas e o verificador local de contratos, verifica identificadores do exemplo e cria um pacote sem histórico Git. Não inclui contratos, bibliotecas nem pacotes do plugin desta prova. Quem recebeu o pacote exportado já pode começar pelo pedido inicial, sem esse comando. Revise o resultado antes de criar um repositório público novo. A revisão de divulgação deve alcançar também commits anteriores se for reutilizado um histórico existente.

O pacote exportado é um repositório separado, sem o histórico nem os arquivos Figma da prova local. Na nova máquina, ele é a fonte do método; cada rodada cria seus próprios contratos, registros e chaves.
