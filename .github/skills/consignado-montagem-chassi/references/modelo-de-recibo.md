# Modelo de recibo

### Modelo de recibo

O recibo é um **arquivo** em `etapas/<etapa>/recibos/`, nunca sobrescrito (veja o gate 9 da skill). O conteúdo abaixo é o corpo do arquivo. Cada linha vem **da releitura do Figma**, não do plano.

```md
# Recibo de montagem: <tela> — kit de regiões v<N> e prova da receita chassi v<N>

Etapa: <id> · Tela: <id> · Produto: <id ou kit> · Data: <AAAA-MM-DD> · Arquivo: <caminho deste recibo>
Contratos usados (versão e sha256 do arquivo do contrato, `shasum -a 256 <arquivo>`, ou `n/a (rascunho)`): <etapa vX, tela vX, produto vX> · Tipo: NOVO_KIT_DE_REGIOES | PROVA_DA_RECEITA | ATUALIZACAO_LOCALIZADA
Arquivo e página: <link> · Referências preservadas: <sim, links> · Bibliotecas IDS usadas (nome e versão exatos): <...>

## Regiões
| Região | Componente (nome e ID) | Chave publicada (só se já publicada e relida) | Properties públicas (esperado: nenhuma de visibilidade) | Textos locais / defaults TEXT | Estado |
| --- | --- | --- | --- | --- | --- |

## Camadas ligáveis (visibilidade por caminho)
| Região | Caminho completo | Nome único no pai? | Padrão | Estado |
| --- | --- | --- | --- | --- |

## Acesso a texto
| Região | Instância (caminho) | Chave real lida | Tipo | Escrita testada (valor gravado → relido) | Estado |
| --- | --- | --- | --- | --- | --- |

## Itens (por ocorrência)
| Item | Show leading | Show supporting | Supporting Type | Trailing (fixo) | Has next | Texto da ação lido | Confere com o contrato? |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Tokens de layout
| Container | Padding T/R/B/L (token → valor) | Gap (token → valor) | Raio (token → valor) | `boundVariables` relido? |
| --- | --- | --- | --- | --- |

## Medidas (gate de pixels)
| Bloco / região | Produto | Frame de origem | Altura e largura do bloco na referência | Obtido | Causa medida da diferença | Estado |
| --- | --- | --- | --- | --- | --- | --- |

## Texto de prova
| Instância | Origem do texto (frame ou receita) | Amostra conferida caractere a caractere | Estado |
| --- | --- | --- | --- |

## Auditoria
- Textos locais / defaults TEXT / defaults IDS aninhados / collections de produto: <vazios ou lista>
- Textos default do IDS em camada oculta que não é editável (LIMITE): <lista>
- Camadas do produto que **não** entraram na composição de prova de cada produto: <lista>
- Provas mantidas (aguardando autorização para limpar): <lista>
- NAO_VERIFICAVEL: <lista> · Próximo passo permitido: <...>

Status: PRONTO_PARA_VALIDACAO | BLOQUEADO
```

Notas de publicação: a montagem **não publica** o Core. Quando a pessoa responsável publicar, a nota de publicação é o changelog da versão do kit; registre no recibo a frase sugerida.

Liste também o resultado da auditoria do mestre (`textos locais`, `defaults TEXT`, `defaults IDS aninhados`, `collections de produto`: todos vazios/ausentes), o que ficou `NAO_VERIFICAVEL` e o próximo passo permitido. Se encaminhar à skill `consignado-validacao-etapa` nos recortes `KIT_DE_REGIOES` e `RECEITA` (juntos: `CORE`), delimite a validação às capacidades efetivamente entregues; uma prova reduzida não é a entrega da tela completa. Uma instância com conteúdo só é evidência do cenário que ela realmente representa; não conte várias combinações como testadas por uma única montagem.

O pacote/plugin da biblioteca de produto aplicará conteúdo nas instâncias públicas do Core. Para TEXT properties de componente, ele deve vincular `VariableAlias` via `setProperties`; não deve usar `setBoundVariable('characters', ...)` em texto interno de instância. Esta skill registra os alvos públicos, mas **não instala** variables de produto nem componentes no arquivo do designer.

---
