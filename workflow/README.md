# Método reutilizável de chassi por etapa

Este diretório descreve o **processo**. Uma rodada sintética local pode servir como exemplo e prova, mas nenhum nome de tela, quantidade de telas, valor de cenário, URL do Figma ou chave publicada dessa rodada é padrão para outras etapas. O método funciona sem acesso ao exemplo.

**Estado das skills:** análise, montagem e validação foram adaptadas a partir das três skills curadas recebidas. A análise passou por uma prova sintética local no Figma Agent com bibliotecas fake v2, mas seus rascunhos ainda exigem revisão. **A execução comparativa com bibliotecas reais v1/v2 no ambiente de trabalho ainda falta.** Não substitua uma skill em uso nesse ambiente só pela existência destes arquivos.

## Camadas e passagem

| Momento | Entrada | Saída | Onde vive |
| --- | --- | --- | --- |
| Referências | Telas existentes reunidas pelo designer, com produto e cenário identificáveis. | Frames brutos e [pedido inicial](templates/briefing-execucao.md), com registro opcional da rodada. | Arquivo de referências da etapa. |
| Análise de fundação | Pedido, referências e skill `consignado-analise-etapa`. | Atualização do [contrato da etapa](templates/contrato-etapa.md), [contrato Core da tela](templates/contrato-tela.md), [receita de cada produto na tela](templates/contrato-produto-tela.md), lacunas e evidências. | Markdown versionado local; uma tela por execução. |
| Montagem do Core | Contratos revisados, manifesto IDS e skill `consignado-montagem-chassi`. | Um componente mestre e um [recibo](templates/recibo-montagem.md) por tela montada. | Arquivo Core separado, consumindo bibliotecas IDS publicadas. |
| Biblioteca de produto | Mestre do Core, [receita própria do produto](templates/contrato-produto-tela.md) e pacote local. | O plugin instala os componentes de tela, três coleções, modos e bindings de conteúdo; a equipe valida e publica. | Uma biblioteca por produto ou a organização aprovada pela equipe. |
| Validação | Contratos, referências, recibos e componentes de Core/produto; skill `consignado-validacao-etapa`. | [Veredito](templates/veredito-validacao.md) por recorte e reconciliação do conjunto da etapa. | Leitura independente dos artefatos e arquivos Figma da rodada. |
| Arquivo do designer | Biblioteca de produto publicada e acessível. | Instâncias publicadas inseridas pelo próprio Figma. | Arquivo de uso do designer. |

A análise não instala componentes, a montagem Core não publica regras de produto e a validação não altera o Figma. O plugin da biblioteca não infere compatibilidade a partir de nomes parecidos. O pacote lista **N telas do produto** e suas chaves Core, permitindo montar outras etapas sem fixar a quantidade de telas. O uso no arquivo do designer é feito pela biblioteca publicada do Figma.

**Contratos locais:** cada rodada guarda os Markdown de etapa, tela e produto em arquivos versionados. Um registro lista identidade, dependências, estado e snapshot revisado; um índice lista os registros das etapas presentes. O build confere esses registros e as receitas estruturadas antes de gerar o plugin. Uma nova etapa usa seu próprio registro baseado no [modelo](templates/registro-contratos.json) e adiciona seu caminho ao [modelo de índice](templates/indice-registros.json). A passagem do Figma Agent para o repositório exige salvar seu Markdown e revisar a tradução das regras de produto; não é uma sincronização automática.

## O que varia por etapa

- Identidade, finalidade, número de telas e relação entre elas.
- Produtos participantes e valores observados de **Operação**, **Contexto** e **Produtos Adicionais**. Uma tela pode não variar em um eixo; outra dimensão descoberta também pode ser registrada.
- Arquivos de referência, Core e IDS; quantidade de bibliotecas IDS, chaves, versões e permissões.
- Áreas, campos, componentes necessários, propriedades, conteúdo e casos de estresse de layout.
- Decisões de negócio confirmadas e exclusões da rodada, como protótipos.

Cada execução pode começar com um **prompt curto** contendo tela e link das referências; o briefing estruturado é um registro útil, não uma barreira. A skill encontra os frames e confronta o pedido com eles; não reutiliza contagens, chaves ou texto da rodada anterior. A identidade da etapa precisa de confirmação própria: o nome ou a função de uma tela não a definem, e uma única tela não comprova a vocação de toda a etapa. O contrato da etapa evolui como proposta parcial, tela por tela; desconhecer as demais telas não bloqueia o registro ou a prova isolada da atual. A saída separa rascunho para revisão, documentação pronta para registro e contrato pronto para montagem **da tela analisada**. Uma mudança futura entra pela vocação da etapa, depois pela tela e área afetadas. Se uma capacidade já existe, muda a receita do produto; se exige uma capacidade comum, revê-se o contrato e o mestre do Core antes de atualizar os produtos.

**Properties e modes são mecanismos diferentes.** Uma property pode pertencer a um componente do IDS publicado, que o chassi consome como instância aninhada. Nesse caso, registre a biblioteca dona da property e prove se ela continua acessível para quem usa uma instância do chassi; o Core não deve fingir que criou o controle do IDS. Os eixos Operação, Contexto e Produtos Adicionais organizam os cenários de análise; não exigem por si só um mode no Figma. Quando uma etapa precisar combinar mode e property, o contrato da tela deve dizer qual dimensão governa cada valor e a validação deve exercitar a combinação.

**O mestre Core não fornece cópia.** Todos os nós de texto e defaults de properties de texto do mestre, inclusive os das instâncias IDS aninhadas, devem ficar vazios. Nomes semânticos de camadas e properties preservam a vocação. Testes de layout usam texto apenas em instâncias de prova; bibliotecas de produto aplicam a cópia revisada.

**Versão IDS:** as famílias autorizadas podem aparecer com prefixo `[v1]` ou `[v2]`. O contrato registra nome, versão e recurso efetivamente conectado ao chat. Famílias distintas podem estar em versões distintas; a skill não alterna versões da mesma família por conveniência nem transfere automaticamente keys, tokens, properties ou defaults entre v1 e v2.

## Critério de passagem

Uma análise pode terminar com pendências explícitas. Só se chama uma tela de pronta para montagem quando sua identidade, vocação, estrutura necessária e decisões que mudam presença ou comportamento estiverem suficientemente revistas. Cada montagem deve provar vínculo ao Core e ao IDS, properties acessíveis após aninhamento e layout nos cenários relevantes. A validação confronta essas provas com os contratos e registra o que passou, falhou ou não pôde ser verificado. Só uma chave publicada e verificada pode entrar no pacote de biblioteca de produto ou de instalação.

Para reconstruir a rodada em outro ambiente, siga [portar-ambiente.md](portar-ambiente.md).
