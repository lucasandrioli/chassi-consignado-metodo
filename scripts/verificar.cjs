#!/usr/bin/env node
'use strict';
// Roda todas as conferências do repositório, uma atrás da outra, e diz no fim o que falhou.
//   node scripts/verificar.cjs
// Só usa o Node (sem npm, sem internet).
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const node = process.execPath;
const major = Number(process.versions.node.split('.')[0]);
if (major < 18) { console.error(`Node ${process.versions.node} é antigo demais: use a versão 18 ou mais nova.`); process.exit(1); }

const steps = [
  ['Contratos da etapa em uso: registro, versões e snapshots', ['scripts/contracts.cjs', 'check']],
  ['Pacotes em dia com os contratos', ['plugin/scripts/gen-packages.cjs', '--check']],
  ['plugin/code.js em dia com as fontes e os pacotes', ['plugin/scripts/build.cjs', '--check']],
  ['Exemplo Fake: contratos consistentes', ['scripts/contracts.cjs', 'check', '--root', 'exemplos/fake']],
  ['Exemplo Fake: pacotes em dia com os contratos', ['plugin/scripts/gen-packages.cjs', '--check', '--root', 'exemplos/fake']],
  ['Skills: cabeçalho, links, referência do Figma MCP e termos proibidos', ['scripts/verificar-skills.cjs']],
  ['Teste: conferência de contratos', ['scripts/contracts.test.cjs']],
  ['Teste: promoção de rascunhos a contratos', ['scripts/promover.test.cjs']],
  ['Teste: gerador de pacotes', ['plugin/scripts/gen-packages.test.cjs']],
  ['Teste: eixos e modes', ['plugin/scripts/axes.test.cjs']],
  ['Teste: caminhos de camadas', ['plugin/scripts/paths.test.cjs']],
  ['Teste: instalador no simulador do Figma', ['plugin/tests/installer-sim.cjs']]
];

const failed = [];
for (const [label, args] of steps) {
  const run = spawnSync(node, args, { cwd: ROOT, encoding: 'utf8' });
  const ok = run.status === 0;
  console.log(`${ok ? 'OK    ' : 'FALHOU'}  ${label}`);
  if (!ok) { failed.push(label); console.log((run.stdout + run.stderr).trim().split('\n').map(l => '        ' + l).slice(-12).join('\n')); }
}
console.log(failed.length ? `\n${failed.length} conferência(s) falharam.` : '\nTudo certo.');
process.exitCode = failed.length ? 1 : 0;
