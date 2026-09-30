# Recibos de montagem

Cada montagem no Figma (kit de regiões, prova da receita ou atualização localizada) deixa aqui **um arquivo novo** com o recibo: o que foi criado, o que foi medido e o que ficou como limite. A skill de montagem grava o arquivo; a skill de validação o lê.

- **Nome:** `<tela>[-<produto>]-<tipo>-v<versão dos contratos>-<AAAA-MM-DD>.md`, por exemplo `revisao-kit-de-regioes-v0.7-2026-09-30.md`. Mais de um no dia: acrescente `-2`.
- **Nunca sobrescreva** um recibo: o histórico é a evidência de cada versão do chassi.
- O cabeçalho registra etapa, tela, produto, data, e a versão e o `sha256` de cada contrato usado (os mesmos de `contratos/registro.json`).
- Esta pasta não é de contratos: o gate de contratos não a lê.
