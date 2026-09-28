#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_REGISTRY = 'foundation/contratos/registro.json';
const DEFAULT_INDEX = 'contracts/index.json';
const LAYERS = new Set(['stage', 'screen', 'product-screen']);
const STATES = new Set(['proposal', 'reviewed', 'approved']);

function digest(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex');
}

function localPath(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative))
    throw new Error(`Caminho local inválido: ${relative}`);
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(`${root}${path.sep}`)) throw new Error(`Caminho fora do repositório: ${relative}`);
  return absolute;
}

function readRegistry(root = ROOT, registryPath = DEFAULT_REGISTRY) {
  const absolute = localPath(root, registryPath);
  const registry = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  return { registry, absolute };
}

function expectedId(entry) {
  if (entry.layer === 'stage') return `stage:${entry.stage}`;
  if (entry.layer === 'screen') return `screen:${entry.stage}:${entry.screen}`;
  return `product-screen:${entry.stage}:${entry.product}:${entry.screen}`;
}

function dependencySnapshot(entry, byId) {
  return Object.fromEntries((entry.dependsOn || []).map(id => {
    const upstream = byId.get(id)?.locked;
    return [id, upstream ? `${upstream.version}:${upstream.state}:${upstream.sha256}` : 'missing'];
  }));
}

function sameSnapshot(a, b) {
  return JSON.stringify(a || {}) === JSON.stringify(b);
}

function checkRegistry({ root = ROOT, registryPath = DEFAULT_REGISTRY, ignoreLocks = false, skipPackages = false } = {}) {
  root = path.resolve(root);
  const { registry, absolute } = readRegistry(root, registryPath);
  const errors = [];
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.contracts))
    return { errors: ['Registro inválido: schemaVersion 1 e contracts[] são obrigatórios.'], registry, absolute };

  const byId = new Map();
  const paths = new Set();
  const directories = new Set();
  for (const entry of registry.contracts) {
    if (!LAYERS.has(entry.layer) || !entry.stage || entry.id !== expectedId(entry))
      errors.push(`Identidade ou camada inválida: ${entry.id || '(sem ID)'}.`);
    if (!STATES.has(entry.state)) errors.push(`${entry.id}: estado inválido.`);
    if (!/^\d+(?:\.\d+){1,2}$/.test(entry.version || '')) errors.push(`${entry.id}: versão inválida.`);
    if (byId.has(entry.id)) errors.push(`${entry.id}: ID duplicado.`);
    byId.set(entry.id, entry);
    if (!Array.isArray(entry.dependsOn)) errors.push(`${entry.id}: dependsOn deve ser uma lista.`);
    if (entry.layer !== 'stage' && !entry.screen) errors.push(`${entry.id}: tela ausente.`);
    if (entry.layer === 'product-screen' && !entry.product) errors.push(`${entry.id}: produto ausente.`);
    if (entry.state !== 'proposal' && (!entry.decision?.by || !entry.decision?.date || !entry.decision?.evidence))
      errors.push(`${entry.id}: revisão/aprovação exige responsável, data e evidência.`);

    let file;
    try { file = localPath(root, entry.path); }
    catch (error) { errors.push(`${entry.id}: ${error.message}`); continue; }
    if (!entry.path.endsWith('.md')) errors.push(`${entry.id}: contrato deve ser Markdown.`);
    if (paths.has(file)) errors.push(`${entry.id}: caminho duplicado ${entry.path}.`);
    paths.add(file);
    directories.add(path.dirname(file));
    if (!fs.existsSync(file)) { errors.push(`${entry.id}: arquivo ausente ${entry.path}.`); continue; }
    const contents = fs.readFileSync(file, 'utf8');
    const header = contents.match(/\*\*Versão:\*\*\s*(?:proposta\s+)?(\d+(?:\.\d+){1,2})/i);
    if (!header || header[1] !== entry.version)
      errors.push(`${entry.id}: versão do Markdown difere do registro (${entry.version}).`);
    if (!ignoreLocks) {
      if (entry.locked?.version !== entry.version || entry.locked?.state !== entry.state || !/^[0-9a-f]{64}$/.test(entry.locked?.sha256 || ''))
        errors.push(`${entry.id}: versão sem snapshot revisado. Execute contracts lock após revisar a mudança.`);
      else if (entry.locked.sha256 !== digest(contents))
        errors.push(`${entry.id}: Markdown mudou após o snapshot ${entry.locked.version}; revise a receita e aumente a versão.`);
    }
  }

  for (const entry of registry.contracts) {
    if (!Array.isArray(entry.dependsOn)) continue;
    const required = entry.layer === 'stage' ? [] : entry.layer === 'screen'
      ? [`stage:${entry.stage}`]
      : [`stage:${entry.stage}`, `screen:${entry.stage}:${entry.screen}`];
    if (required.some(id => !entry.dependsOn.includes(id)))
      errors.push(`${entry.id}: dependência da etapa/tela ausente.`);
    for (const id of entry.dependsOn) if (!byId.has(id)) errors.push(`${entry.id}: dependência inexistente ${id}.`);
  }
  const visited = new Set();
  const visiting = new Set();
  function visit(id) {
    if (visiting.has(id)) { errors.push(`${id}: ciclo de dependências.`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of byId.get(id)?.dependsOn || []) if (byId.has(dep)) visit(dep);
    visiting.delete(id);
    visited.add(id);
  }
  for (const id of byId.keys()) visit(id);
  if (!ignoreLocks) for (const entry of registry.contracts) {
    if (!sameSnapshot(entry.locked?.dependencies, dependencySnapshot(entry, byId)))
      errors.push(`${entry.id}: dependência mudou após a revisão; revise este contrato e aumente sua versão.`);
  }

  for (const directory of directories) if (fs.existsSync(directory)) for (const name of fs.readdirSync(directory)) {
    if (!name.endsWith('.md') || name === 'README.md') continue;
    const file = path.join(directory, name);
    if (!paths.has(file)) errors.push(`Contrato sem registro: ${path.relative(root, file)}.`);
  }

  const packageDir = path.join(root, 'plugin', 'packages');
  if (!skipPackages && fs.existsSync(packageDir)) for (const name of fs.readdirSync(packageDir).filter(x => x.endsWith('.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, name), 'utf8'));
    const stage = pkg.stage?.id;
    if (!byId.has(`stage:${stage}`)) continue;
    const productEntries = registry.contracts.filter(e => e.layer === 'product-screen' && e.stage === stage && e.product === pkg.product?.id);
    const seen = new Set();
    for (const screen of pkg.screens || []) {
      const id = `product-screen:${stage}:${pkg.product.id}:${screen.id}`;
      const contract = byId.get(id);
      if (!contract || contract.path !== screen.sourceContract)
        errors.push(`${name}/${screen.id}: contrato fonte não corresponde ao registro.`);
      if (seen.has(id)) errors.push(`${name}/${screen.id}: tela duplicada no pacote.`);
      seen.add(id);
    }
    for (const entry of productEntries) if (!seen.has(entry.id))
      errors.push(`${name}: ${entry.id} está no registro e falta no pacote.`);
  }
  return { errors, registry, absolute };
}

function assertCurrent(options) {
  const result = checkRegistry(options);
  if (result.errors.length) throw new Error(`Contratos locais inconsistentes:\n- ${result.errors.join('\n- ')}`);
  return result.registry;
}

function checkAll({ root = ROOT, indexPath = DEFAULT_INDEX } = {}) {
  root = path.resolve(root);
  const index = JSON.parse(fs.readFileSync(localPath(root, indexPath), 'utf8'));
  const errors = [];
  if (index.schemaVersion !== 1 || !Array.isArray(index.registries) || !index.registries.length)
    return { errors: ['Índice de registros inválido.'], count: 0 };
  const stages = new Set();
  const registries = new Set();
  let count = 0;
  for (const registryPath of index.registries) {
    if (registries.has(registryPath)) { errors.push(`Registro duplicado no índice: ${registryPath}.`); continue; }
    registries.add(registryPath);
    const result = checkRegistry({ root, registryPath });
    errors.push(...result.errors.map(message => `${registryPath}: ${message}`));
    count += result.registry.contracts?.length || 0;
    for (const entry of result.registry.contracts || []) if (entry.layer === 'stage') {
      if (stages.has(entry.stage)) errors.push(`Etapa ${entry.stage} está em mais de um registro.`);
      stages.add(entry.stage);
    }
  }
  const packageDir = path.join(root, 'plugin', 'packages');
  if (fs.existsSync(packageDir)) for (const name of fs.readdirSync(packageDir).filter(x => x.endsWith('.json'))) {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageDir, name), 'utf8'));
    if (!stages.has(pkg.stage?.id)) errors.push(`${name}: etapa ${pkg.stage?.id || '(sem ID)'} sem registro no índice.`);
  }
  return { errors, count };
}

function assertAllCurrent(options) {
  const result = checkAll(options);
  if (result.errors.length) throw new Error(`Contratos locais inconsistentes:\n- ${result.errors.join('\n- ')}`);
  return result.count;
}

function lockSnapshots({ root = ROOT, registryPath = DEFAULT_REGISTRY, note } = {}) {
  if (!note?.trim()) throw new Error('Informe --note para registrar por que os contratos foram conferidos.');
  const result = checkRegistry({ root, registryPath, ignoreLocks: true, skipPackages: true });
  if (result.errors.length) throw new Error(`Registro inválido:\n- ${result.errors.join('\n- ')}`);
  const changed = [];
  const byId = new Map(result.registry.contracts.map(entry => [entry.id, entry]));
  const ordered = [];
  const visited = new Set();
  function order(entry) {
    if (visited.has(entry.id)) return;
    visited.add(entry.id);
    for (const id of entry.dependsOn) order(byId.get(id));
    ordered.push(entry);
  }
  for (const entry of result.registry.contracts) order(entry);
  for (const entry of ordered) {
    const sha256 = digest(fs.readFileSync(localPath(path.resolve(root), entry.path), 'utf8'));
    const dependencies = dependencySnapshot(entry, byId);
    if (entry.locked?.sha256 === sha256 && entry.locked?.version === entry.version && entry.locked?.state === entry.state && sameSnapshot(entry.locked?.dependencies, dependencies)) continue;
    if (entry.locked?.sha256 === sha256 && entry.locked?.version === entry.version &&
        (entry.locked?.state === undefined || entry.locked?.dependencies === undefined)) {
      entry.locked.state = entry.state;
      entry.locked.dependencies = dependencies;
      changed.push(entry.id);
      continue;
    }
    if (entry.locked?.sha256 && entry.locked.version === entry.version)
      throw new Error(`${entry.id}: aumente a versão no Markdown e no registro antes de atualizar o snapshot.`);
    if (entry.locked?.sha256 === sha256)
      throw new Error(`${entry.id}: versão mudou sem alteração no contrato.`);
    entry.locked = { version: entry.version, state: entry.state, sha256, dependencies, note: note.trim() };
    changed.push(entry.id);
  }
  if (changed.length) fs.writeFileSync(result.absolute, `${JSON.stringify(result.registry, null, 2)}\n`);
  return changed;
}

function cli() {
  const [action = 'check', ...args] = process.argv.slice(2);
  let registryPath = DEFAULT_REGISTRY;
  let explicitRegistry = false;
  let note = '';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--registry') { registryPath = args[++i]; explicitRegistry = true; }
    else if (args[i] === '--note') note = args[++i];
    else throw new Error(`Argumento desconhecido: ${args[i]}`);
  }
  if (action === 'check') {
    const count = explicitRegistry ? assertCurrent({ registryPath }).contracts.length : assertAllCurrent();
    console.log(`Contratos locais consistentes: ${count} arquivos registrados.`);
  } else if (action === 'lock') {
    const changed = lockSnapshots({ registryPath, note });
    console.log(changed.length ? `Snapshots registrados: ${changed.join(', ')}.` : 'Nenhum contrato mudou.');
  } else throw new Error(`Ação desconhecida: ${action}`);
}

if (require.main === module) {
  try { cli(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { assertCurrent, assertAllCurrent, checkRegistry, checkAll, lockSnapshots };
