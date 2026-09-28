# Veredito de validação — <etapa> / <tela ou conjunto>

**schemaVersion:** 1

**Rodada, etapa e escopo:** <identificadores e versões; tela, produto ou conjunto da etapa>

**Estado geral:** APTO_PARA_REVISAO_HUMANA / REPROVADO / PENDENTE / NAO_VERIFICAVEL

**Artefatos confrontados:** <briefing, contratos de etapa/tela/produto, referências, recibos de montagem e pacote; versões e links>

**Ambiente e data da verificação:** <arquivo Figma, bibliotecas acessíveis, plano quando a prova exigir estatísticas, data>

O veredito compara o que foi contratado com o que existe no Figma. Um contrato revisado não comprova que o componente foi montado; uma montagem visual não comprova origem de biblioteca, publicação ou funcionamento em outro arquivo.

## Cobertura do escopo

| Tela e produto do contrato da etapa | Contrato e receita | Componente/instância encontrado | Cenários verificados | Resultado e pendência |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Reconciliar a quantidade e a identidade das telas da etapa. Uma tela ou um produto ainda não montado fica explícito, sem bloquear a análise das outras telas nem autorizar o consumo do conjunto incompleto.

## Resultado por critério

| Critério | Expectativa do contrato | Evidência observada após releitura | Estado: APTO / REPROVADO / NAO_VERIFICAVEL / NAO_SE_APLICA / IMPASSE_TECNICO | Camada responsável e ação |
| --- | --- | --- | --- | --- |
| Vocação da etapa, tela e áreas |  |  |  |  |
| Cenários, presença, ordem e densidade |  |  |  |  |
| Layout nos extremos e estados relevantes |  |  |  |  |
| Properties e overrides após aninhamento |  |  |  |  |
| Cada item repetível em todos os estados e conteúdos contratados |  |  |  |  |
| Origem IDS, exposição e independência das properties aninhadas, sem troca de mode quando não exigida |  |  |  |  |
| Modos e bindings de variáveis |  |  |  |  |
| Origem e vínculo das instâncias IDS |  |  |  |  |
| Origem e vínculo da instância Core no produto |  |  |  |  |
| Mestre Core sem textos e defaults de texto, inclusive IDS aninhado |  |  |  |  |
| Versão exata do IDS autorizada e conectada à conversa |  |  |  |  |
| TEXT alias na property pública do Core, quando houver |  |  |  |  |
| Chave e estado de publicação de cada componente exigido |  |  |  |  |
| Compatibilidade entre versões dos contratos e componentes |  |  |  |  |

Use `NAO_VERIFICAVEL` quando o arquivo, a permissão, a publicação ou a evidência faltar; não converta ausência de prova em aprovação. Registre o link do nó e a ação de teste quando uma property, modo ou vínculo tiver sido exercitado. Se a leitura só permitir comparar capturas e recibos, marque o comportamento não exercitado como tal. Compare textos e regras de produto somente com fontes aprovadas; uma referência sintética prova diversidade de layout, não conteúdo oficial. `APTO_PARA_REVISAO_HUMANA` não publica a biblioteca nem aprova uma regra de negócio.

## Divergências e encaminhamento

| ID | Diferença concreta | Camada responsável: referência / contrato / IDS / Core / produto / pacote | Efeito | Responsável e próximo passo | Estado |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

**Decisão:** <o que pode avançar, o que permanece pendente e quem revisou; data>. Uma mudança de vocação ou capacidade volta ao contrato correspondente antes de alterar o componente. Uma configuração exclusiva de produto volta à receita desse produto.

## Prova de instalação e rastreabilidade, quando aplicável

| Teste em arquivo de equipe | Biblioteca esperada | Evidência no arquivo | Evidência no painel nativo após atualização | Resultado |
| --- | --- | --- | --- | --- |
| Importação do componente publicado do produto por chave |  |  |  |  |
| Detach da instância de tela do produto |  |  |  |  |
| Detach direto da instância Core aninhada |  |  |  |  |

As métricas do Figma dependem do ambiente, do plano e do tempo de atualização. Registre separadamente cada detach e sua biblioteca observada; não atribua um único evento a duas bibliotecas por suposição. Se o teste não for elegível, deixe o resultado `não verificável` e não declare comprovada a rastreabilidade nativa.

**Síntese para a pessoa:** <o que foi validado, o que falhou e qual decisão falta, em linguagem curta>.
