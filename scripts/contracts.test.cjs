const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { assertCurrent, assertAllCurrent, assertBuildEligibility, checkRegistry, checkAll, lockSnapshots } = require('./contracts.cjs');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'chassi-contracts-'));
const folder = path.join(root, 'etapas', 'teste', 'contratos');
const packages = path.join(root, 'plugin', 'packages');
fs.mkdirSync(folder, { recursive: true });
fs.mkdirSync(packages, { recursive: true });
const source = {
  'etapa-teste.md': '**Versão:** proposta 0.1\nEtapa sintética.\n',
  'tela-a.md': '**Versão:** proposta 0.1\nCapacidade sem texto.\n',
  'produto-p-a.md': '**Versão:** 0.1\nConteúdo sintético.\n'
};
const entry = (id, layer, file, dependencies, extra = {}) => ({
  id, layer, stage: 'teste', path: `etapas/teste/contratos/${file}`, version: '0.1', state: 'proposal',
  dependsOn: dependencies, ...extra,
  locked: { version: '0.1', state: 'proposal', sha256: crypto.createHash('sha256').update(source[file]).digest('hex'), note: 'Linha de base sintética' }
});
const registry = {
  schemaVersion: 1,
  contracts: [
    entry('stage:teste', 'stage', 'etapa-teste.md', []),
    entry('screen:teste:a', 'screen', 'tela-a.md', ['stage:teste'], { screen: 'a' }),
    entry('product-screen:teste:P:a', 'product-screen', 'produto-p-a.md', ['stage:teste', 'screen:teste:a'], { product: 'P', screen: 'a' })
  ]
};
const snapshot = entry => `${entry.locked.version}:${entry.locked.state}:${entry.locked.sha256}`;
registry.contracts[1].locked.dependencies = { 'stage:teste': snapshot(registry.contracts[0]) };
registry.contracts[2].locked.dependencies = {
  'stage:teste': snapshot(registry.contracts[0]),
  'screen:teste:a': snapshot(registry.contracts[1])
};

try {
  for (const [name, contents] of Object.entries(source)) fs.writeFileSync(path.join(folder, name), contents);
  const registryPath = 'etapas/teste/contratos/registro.json';
  fs.writeFileSync(path.join(folder, 'registro.json'), `${JSON.stringify(registry, null, 2)}\n`);
  fs.mkdirSync(path.join(root, 'contracts'));
  fs.writeFileSync(path.join(root, 'contracts', 'index.json'), JSON.stringify({ schemaVersion: 1, registries: [] }));
  assert.equal(assertAllCurrent({ root }), 0);
  fs.writeFileSync(path.join(root, 'contracts', 'index.json'), JSON.stringify({ schemaVersion: 1, registries: [registryPath] }));
  const packagePath = path.join(packages, 'teste-p.json');
  const pkg = { id: 'teste:P', state: 'technical-proof', stage: { id: 'teste' }, product: { id: 'P' }, screens: [{ id: 'a', sourceContract: 'etapas/teste/contratos/produto-p-a.md' }] };
  fs.writeFileSync(packagePath, JSON.stringify(pkg));
  assert.equal(assertCurrent({ root, registryPath }).contracts.length, 3);
  assert.equal(assertAllCurrent({ root }), 3);
  assert.doesNotThrow(() => assertBuildEligibility({ root, packages: [pkg] }));
  pkg.state = 'draft';
  assert.throws(() => assertBuildEligibility({ root, packages: [pkg] }), /não pode entrar no build/);
  pkg.state = 'approved';
  assert.throws(() => assertBuildEligibility({ root, packages: [pkg] }), /precisa de estado approved/);
  const approved = structuredClone(registry);
  for (const contract of approved.contracts) contract.state = 'approved';
  fs.writeFileSync(path.join(folder, 'registro.json'), `${JSON.stringify(approved, null, 2)}\n`);
  assert.doesNotThrow(() => assertBuildEligibility({ root, packages: [pkg] }));
  fs.writeFileSync(path.join(folder, 'registro.json'), `${JSON.stringify(registry, null, 2)}\n`);
  pkg.state = 'technical-proof';

  fs.appendFileSync(path.join(folder, 'produto-p-a.md'), 'Nova linha.\n');
  assert.match(checkRegistry({ root, registryPath }).errors.join(' '), /mudou após o snapshot/);
  assert.throws(() => lockSnapshots({ root, registryPath, note: 'Mudança sem versão' }), /aumente a versão/);

  fs.writeFileSync(path.join(folder, 'produto-p-a.md'), '**Versão:** 0.2\nConteúdo sintético revisado.\n');
  registry.contracts[2].version = '0.2';
  fs.writeFileSync(path.join(folder, 'registro.json'), `${JSON.stringify(registry, null, 2)}\n`);
  assert.deepEqual(lockSnapshots({ root, registryPath, note: 'Revisão técnica; sem aprovação de negócio' }), ['product-screen:teste:P:a']);
  assert.equal(assertCurrent({ root, registryPath }).contracts[2].locked.version, '0.2');

  fs.writeFileSync(path.join(folder, 'etapa-teste.md'), '**Versão:** proposta 0.2\nEtapa sintética revisada.\n');
  const current = JSON.parse(fs.readFileSync(path.join(folder, 'registro.json'), 'utf8'));
  current.contracts[0].version = '0.2';
  fs.writeFileSync(path.join(folder, 'registro.json'), `${JSON.stringify(current, null, 2)}\n`);
  assert.throws(() => lockSnapshots({ root, registryPath, note: 'Impacto da etapa' }), /screen:teste:a: aumente a versão/);
  fs.writeFileSync(path.join(folder, 'tela-a.md'), '**Versão:** proposta 0.2\nCapacidade relida após mudança da etapa.\n');
  fs.writeFileSync(path.join(folder, 'produto-p-a.md'), '**Versão:** 0.3\nConteúdo relido após mudança da etapa.\n');
  current.contracts[1].version = '0.2';
  current.contracts[2].version = '0.3';
  fs.writeFileSync(path.join(folder, 'registro.json'), `${JSON.stringify(current, null, 2)}\n`);
  assert.equal(lockSnapshots({ root, registryPath, note: 'Dependências relidas' }).length, 3);
  assert.equal(assertCurrent({ root, registryPath }).contracts.length, 3);

  pkg.screens[0].sourceContract = 'etapas/teste/contratos/tela-a.md';
  fs.writeFileSync(packagePath, JSON.stringify(pkg));
  assert.match(checkRegistry({ root, registryPath }).errors.join(' '), /contrato fonte não corresponde/);
  pkg.screens[0].sourceContract = 'etapas/teste/contratos/produto-p-a.md';
  fs.writeFileSync(packagePath, JSON.stringify(pkg));

  pkg.stage.id = 'sem-registro';
  fs.writeFileSync(packagePath, JSON.stringify(pkg));
  assert.match(checkAll({ root }).errors.join(' '), /sem registro no índice/);
  pkg.stage.id = 'teste';
  fs.writeFileSync(packagePath, JSON.stringify(pkg));

  fs.writeFileSync(path.join(folder, 'tela-solta.md'), '**Versão:** 0.1\n');
  assert.match(checkRegistry({ root, registryPath }).errors.join(' '), /Contrato sem registro/);
  console.log('Contratos: snapshot, versão, pacote e arquivo sem registro validados.');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
