'use strict';
// Gera plugin/packages/<etapa>-<produto>.json a partir dos contratos. Nenhum texto de conteúdo mora neste script:
// tudo vem das tabelas de máquina dos contratos (contract-tables.cjs).
//   node plugin/scripts/gen-packages.cjs           grava os pacotes
//   node plugin/scripts/gen-packages.cjs --check   só confere se os pacotes gravados estão em dia (sai com erro se não)
//   --root <pasta>   usa outra raiz (contracts/, etapas/ e plugin/packages/ dentro dela), por exemplo exemplos/fake
const fs = require('node:fs');
const path = require('node:path');
const { parseLayers, parseCoreKey, parseSource } = require('./contract-tables.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function readRegistries(root) {
  const index = JSON.parse(fs.readFileSync(path.join(root, 'contracts', 'index.json'), 'utf8'));
  return index.registries.map(p => ({ path: p, registry: JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')) }));
}

function buildPackages(root = ROOT) {
  const packages = [];
  for (const { registry } of readRegistries(root)) {
    const byId = new Map(registry.contracts.map(c => [c.id, c]));
    const groups = new Map(); // etapa/produto -> [entradas], na ordem do registro
    for (const entry of registry.contracts.filter(c => c.layer === 'product-screen')) {
      const key = `${entry.stage}::${entry.product}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    }
    for (const entries of groups.values()) {
      const { stage, product } = entries[0];
      const where = `${stage}/${product}`;
      const pkg = { schemaVersion: 2, id: `${stage}-${product}`, state: null, chassiVersion: null, stage: null, product: null, compatibleHashes: [], notes: [], axes: null, screens: [] };
      for (const entry of entries) {
        const screenEntry = byId.get(`screen:${entry.stage}:${entry.screen}`);
        if (!screenEntry) throw new Error(`${entry.id}: contrato da tela ausente no registro.`);
        const screenMd = fs.readFileSync(path.join(root, screenEntry.path), 'utf8');
        const layers = parseLayers(screenMd);
        const core = parseCoreKey(screenMd, screenEntry.path);
        const src = parseSource(fs.readFileSync(path.join(root, entry.path), 'utf8'), layers, entry.path);
        const need = ['etapa.nome', 'etapa.versao', 'chassi.versao', 'produto.versao', 'tela.id', 'tela.nome', 'tela.versao', 'estado'];
        if (!/^\d+\.\d+$/.test(src.config['chassi.versao'] || '')) throw new Error(`${entry.path}: chassi.versao deve ser N.N (versão maior e menor do chassi).`);
        if (src.config['tela.coreKey']) throw new Error(`${entry.path}: a chave do Core mora só no contrato da tela (${screenEntry.path}); remova "tela.coreKey" daqui.`);
        for (const k of need) if (!src.config[k]) throw new Error(`${entry.path}: configuração "${k}" ausente.`);
        if (src.config['tela.id'] !== entry.screen) throw new Error(`${entry.path}: tela.id "${src.config['tela.id']}" difere do registro (${entry.screen}).`);
        const stageInfo = { id: stage, name: src.config['etapa.nome'], version: src.config['etapa.versao'] };
        const productInfo = { id: product, version: src.config['produto.versao'] };
        if (pkg.stage && !same(pkg.stage, stageInfo)) throw new Error(`${where}: telas da mesma etapa declaram dados de etapa diferentes.`);
        if (pkg.product && !same(pkg.product, productInfo)) throw new Error(`${where}: telas do mesmo produto declaram versões diferentes.`);
        if (pkg.axes && !same(pkg.axes, src.axes)) throw new Error(`${where}: os eixos e modos devem ser os mesmos em todas as telas da etapa (${entry.screen} difere).`);
        if (pkg.state && pkg.state !== src.config.estado) throw new Error(`${where}: estado diferente entre telas.`);
        if (pkg.chassiVersion && pkg.chassiVersion !== src.config['chassi.versao']) throw new Error(`${where}: telas do mesmo produto declaram versões de chassi diferentes.`);
        pkg.chassiVersion = src.config['chassi.versao'];
        pkg.state = src.config.estado; pkg.stage = stageInfo; pkg.product = productInfo; pkg.axes = src.axes;
        for (const n of src.notes) if (!pkg.notes.includes(n)) pkg.notes.push(n);
        const bound = new Set(src.bindings.filter(b => b.target.kind === 'visible').map(b => b.id));
        for (const layer of layers.keys()) if (!bound.has(`visivel-${layer}`)) throw new Error(`${entry.path}: camada ligável "${layer}" sem ligação de visibilidade.`);
        pkg.screens.push({ id: entry.screen, name: src.config['tela.nome'], version: src.config['tela.versao'], coreKey: core.chave, sourceContract: entry.path, bindings: src.bindings });
      }
      packages.push(pkg);
    }
  }
  return packages;
}

function cli() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const rootAt = args.indexOf('--root');
  const root = rootAt >= 0 ? path.resolve(args[rootAt + 1]) : ROOT;
  const out = path.join(root, 'plugin', 'packages');
  const stale = [];
  const packages = buildPackages(root);
  if (!check) fs.mkdirSync(out, { recursive: true });
  for (const pkg of packages) {
    const file = path.join(out, `${pkg.id}.json`);
    const text = JSON.stringify(pkg, null, 2) + '\n';
    if (check) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) stale.push(path.basename(file)); }
    else { fs.writeFileSync(file, text); console.log(pkg.id, pkg.screens.map(s => `${s.id}: ${s.bindings.length} ligações`).join('; ')); }
  }
  if (check) {
    if (stale.length) { console.error(`Pacotes desatualizados em relação aos contratos: ${stale.join(', ')}. Rode node plugin/scripts/gen-packages.cjs.`); process.exitCode = 1; }
    else console.log('Pacotes em dia com os contratos.');
  }
}

if (require.main === module) {
  try { cli(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { buildPackages };
