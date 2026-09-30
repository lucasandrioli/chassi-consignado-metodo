const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { assertAllCurrent, assertBuildEligibility } = require('../../scripts/contracts.cjs');
const { AXES, validateAxes } = require('./axes.cjs');

// Uso: node plugin/scripts/build.cjs [--root <pasta>] [--out <arquivo>] [--check]
//   --root  raiz com contracts/, etapas/ e plugin/packages/ (padrão: este repositório)
//   --out   arquivo de saída (padrão: plugin/code.js)
//   --check só confere se o arquivo de saída está em dia com as fontes e os pacotes (sai com erro se não)
const cliArgs = process.argv.slice(2);
const option = name => { const at = cliArgs.indexOf(name); return at >= 0 ? cliArgs[at + 1] : undefined; };
const repoRoot = option('--root') ? path.resolve(option('--root')) : path.resolve(__dirname, '..', '..');
assertAllCurrent({ root: repoRoot });

const root = path.resolve(__dirname, '..');
const directory = path.join(repoRoot, 'plugin', 'packages');
const files = fs.existsSync(directory)
  ? fs.readdirSync(directory).filter(name => name.endsWith('.json')).sort()
  : [];
const packages = files.map(name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8')));
if (!packages.length) {
  console.log('Nenhum pacote registrado. O plugin permanece sem instalação disponível.');
}
assertBuildEligibility({ root: repoRoot, packages });
const ids = new Set();
for (const pkg of packages) {
  if (pkg.schemaVersion !== 2 || !pkg.id || ids.has(pkg.id)) throw new Error(`Pacote inválido ou duplicado: ${pkg.id}`);
  ids.add(pkg.id);
  if (!pkg.stage?.id || !pkg.stage?.name || !pkg.stage?.version || !pkg.product?.id || !pkg.product?.version)
    throw new Error(`${pkg.id}: etapa ou produto sem identidade e versão.`);
  if (!['draft', 'technical-proof', 'approved'].includes(pkg.state)) throw new Error(`${pkg.id}: estado inválido.`);
  if (!Array.isArray(pkg.screens) || !pkg.screens.length) throw new Error(`${pkg.id}: lista de telas vazia.`);
  if (!Array.isArray(pkg.compatibleHashes)) throw new Error(`${pkg.id}: migração sem lista de hashes compatíveis.`);
  if (!/^\d+\.\d+$/.test(pkg.chassiVersion || '')) throw new Error(`${pkg.id}: chassiVersion inválida (esperado N.N).`);
  validateAxes(pkg);
  const screenIds = new Set();
  for (const screen of pkg.screens) {
    if (!screen.id || screenIds.has(screen.id) || !screen.name || !screen.version)
      throw new Error(`${pkg.id}: tela sem identidade, versão ou duplicada.`);
    screenIds.add(screen.id);
    if (!/^[0-9a-f]{40}$/i.test(screen.coreKey))
      throw new Error(`${pkg.id}/${screen.id}: chave publicada do Core ausente ou inválida.`);
    if (!screen.sourceContract || !Array.isArray(screen.bindings) || !screen.bindings.length)
      throw new Error(`${pkg.id}/${screen.id}: contrato fonte ou bindings ausentes.`);
    if (screen.extensions && (!Array.isArray(screen.extensions) || screen.extensions.some(e => !e.within || !e.name || !/^[0-9a-f]{40}$/i.test(e.componentKey))))
      throw new Error(`${pkg.id}/${screen.id}: extensão IDS inválida.`);
    const bindingIds = new Set();
    for (const binding of screen.bindings) {
      if (!binding.id || bindingIds.has(binding.id) || !['STRING', 'BOOLEAN'].includes(binding.type) || (!binding.target?.name && !Array.isArray(binding.target?.path)))
        throw new Error(`${pkg.id}/${screen.id}: binding inválido ou duplicado.`);
      bindingIds.add(binding.id);
      if (!['core', 'component', 'text', 'visible'].includes(binding.target.kind)) throw new Error(`${pkg.id}/${screen.id}: destino inválido.`);
      if (binding.target.kind === 'component' && !binding.target.property) throw new Error(`${pkg.id}/${screen.id}: property de componente ausente.`);
      if (binding.target.path !== undefined && (!['component', 'visible'].includes(binding.target.kind) || !Array.isArray(binding.target.path)
        || !binding.target.path.length || binding.target.path.some(name => typeof name !== 'string' || !name)))
        throw new Error(`${pkg.id}/${screen.id}: caminho de instância inválido.`);
      if (binding.target.kind === 'text' && binding.type !== 'STRING') throw new Error(`${pkg.id}/${screen.id}: destino texto inválido.`);
      if (binding.target.kind === 'visible' && binding.type !== 'BOOLEAN') throw new Error(`${pkg.id}/${screen.id}: visibilidade deve ser booleana.`);
      if (binding.static !== undefined && (binding.static !== true || binding.target.kind !== 'component'
        || AXES.some(axis => binding[axis] !== undefined))) throw new Error(`${pkg.id}/${screen.id}: property fixa inválida (só kind component, sem valores por mode).`);
      if (typeof binding.default !== (binding.type === 'STRING' ? 'string' : 'boolean')) throw new Error(`${pkg.id}/${screen.id}: valor padrão inválido.`);
      for (const axis of AXES) for (const [mode, value] of Object.entries(binding[axis] || {}))
        if (!pkg.axes[axis].modes.includes(mode) || typeof value !== typeof binding.default)
          throw new Error(`${pkg.id}/${screen.id}: override ${axis}/${mode} inválido.`);
    }
  }
  const content = { ...pkg };
  delete content.hash; delete content.structureHash;
  pkg.hash = crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');
  // Estrutura = tudo o que o chassi decide (alvos, quais camadas são ligáveis, eixos, modes, properties fixas). Valores (texto e quando cada bloco aparece) e notas ficam de fora: pertencem ao produto.
  const strip = value => value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).map(mode => [mode, null])) : value;
  const structure = {
    id: pkg.id, chassiVersion: pkg.chassiVersion, axes: pkg.axes,
    screens: pkg.screens.map(screen => ({
      id: screen.id, coreKey: screen.coreKey,
      bindings: screen.bindings.map(b => ({
        id: b.id, type: b.type, target: b.target, static: b.static || false,
        ...(!b.static
          ? Object.fromEntries(['operation', 'context', 'additional'].filter(a => b[a]).map(a => [a, strip(b[a])]))
          : { default: b.default })
      }))
    }))
  };
  pkg.structureHash = crypto.createHash('sha256').update(JSON.stringify(structure)).digest('hex');
}
const source = ['paths.js', 'runtime.js', 'verify.js'].map(name => fs.readFileSync(path.join(root, 'src', name), 'utf8')).join('\n');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version || '')) throw new Error('plugin/version.json: versão inválida (esperado N.N.N).');
const output = source.replace('__PACKAGE_JSON__', JSON.stringify(packages)).replace('__PLUGIN_VERSION__', JSON.stringify(version));
const target = option('--out') ? path.resolve(option('--out')) : path.join(root, 'code.js');
if (cliArgs.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== output) {
    console.error('plugin/code.js está desatualizado em relação às fontes ou aos pacotes. Rode: node plugin/scripts/build.cjs');
    process.exitCode = 1;
  } else console.log('plugin/code.js em dia com as fontes e os pacotes.');
} else {
  fs.writeFileSync(target, output);
  console.log(`Plugin ${version} gerado com ${packages.length} pacote(s).`);
}
