# etapas/

Uma pasta por etapa, com o id da etapa (minúsculas e hífen):

```
etapas/<id-da-etapa>/
  rascunhos/    saída da skill de análise, ainda não registrada (ignorada pelo Git)
  contratos/    contratos registrados (etapa.md, <tela>.md, <produto>-<tela>.md, registro.json)
  recibos/      recibos das montagens, um arquivo por montagem, nunca sobrescrito
```

A pasta nasce vazia. O comando `node scripts/promover.cjs <id-da-etapa> --note "..."` move os rascunhos para `contratos/`, cria ou atualiza o `registro.json`, registra o snapshot e confere tudo. Um exemplo completo, com dados fictícios, está em [`exemplos/fake/`](../exemplos/fake/).
