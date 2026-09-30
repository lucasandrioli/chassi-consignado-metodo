#!/usr/bin/env node
'use strict';
// Promove os rascunhos de uma etapa (etapas/<etapa>/rascunhos/*.md) a contratos registrados:
// move os arquivos para etapas/<etapa>/contratos/, cria ou atualiza o registro.json, lista-o em contracts/index.json,
// registra o snapshot (lock) e confere tudo. Estado dos contratos: proposal.
// Contratos já registrados que não mudaram, mas dependem de um contrato que mudou (a etapa é cumulativa), têm o registro de dependências
// renovado com a mesma nota: a revisão é a que você declara em --note.
//
//   node scripts/promover.cjs <id-da-etapa> --note "por que estes contratos foram conferidos"
//
// Como cada rascunho é reconhecido (pelo conteúdo e pelo nome do arquivo):
//   etapa.md              contrato da etapa
//   <tela>.md             contrato da tela (tem o bloco <!-- camadas:inicio -->); o nome do arquivo é o id da tela
//   <produto>-<tela>.md   contrato do produto na tela (tem o bloco <!-- pacote:inicio -->); <tela> é um id de tela conhecido
// Cada Markdown precisa trazer "**Versão:** N.N" no cabeçalho.
const fs = require('node:fs');
const path = require('node:path');
const { checkAll, lockSnapshots } = require('./contracts.cjs');

const VERSION = /\*\*Versão:\*\*\s*(?:proposta\s+)?(\d+(?:\.\d+){1,2})/i;
const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function promote({ root, stage, note }) {
  if (!ID.test(stage || '')) throw new Error(`Id de etapa inválido: "${stage}". Use minúsculas, números e hífen.`);
  if (!note || !note.trim()) throw new Error('Informe --note com o motivo da conferência dos contratos.');
  const draftDir = path.join(root, 'etapas', stage, 'rascunhos');
  const contractDir = path.join(root, 'etapas', stage, 'contratos');
  if (!fs.existsSync(draftDir)) throw new Error(`Não há rascunhos em etapas/${stage}/rascunhos/.`);
  const drafts = fs.readdirSync(draftDir).filter(n => n.endsWith('.md')).sort();
  if (!drafts.length) throw new Error(`etapas/${stage}/rascunhos/ não tem nenhum .md.`);

  const kind = {};
  const read = name => fs.readFileSync(path.join(draftDir, name), 'utf8');
  for (const name of drafts) {
    const text = read(name), base = name.replace(/\.md$/, '');
    const version = (text.match(VERSION) || [])[1];
    if (!version) throw new Error(`${name}: falta "**Versão:** N.N" no cabeçalho.`);
    if (base === 'etapa') kind[name] = { layer: 'stage', version };
    else if (text.includes('<!-- camadas:inicio -->')) {
      if (!ID.test(base)) throw new Error(`${name}: o nome do arquivo da tela deve ser o id da tela (minúsculas e hífen).`);
      kind[name] = { layer: 'screen', screen: base, version };
    } else if (text.includes('<!-- pacote:inicio -->')) kind[name] = { layer: 'product-screen', base, version };
    else throw new Error(`${name}: não é etapa.md, nem contrato de tela (bloco camadas) nem de produto (bloco pacote).`);
  }
  const existing = path.join(contractDir, 'registro.json');
  const registry = fs.existsSync(existing) ? JSON.parse(fs.readFileSync(existing, 'utf8')) : { schemaVersion: 1, contracts: [] };
  const screens = new Set([
    ...Object.values(kind).filter(k => k.layer === 'screen').map(k => k.screen),
    ...registry.contracts.filter(c => c.layer === 'screen').map(c => c.screen)
  ]);
  for (const [name, k] of Object.entries(kind)) if (k.layer === 'product-screen') {
    const screen = [...screens].filter(s => k.base.endsWith(`-${s}`)).sort((a, b) => b.length - a.length)[0];
    if (!screen) throw new Error(`${name}: não achei a tela. O nome deve ser <produto>-<tela>.md com <tela> = id de um contrato de tela (${[...screens].join(', ') || 'nenhum ainda'}).`);
    const product = k.base.slice(0, -(screen.length + 1));
    if (!ID.test(product)) throw new Error(`${name}: id de produto inválido "${product}".`);
    Object.assign(k, { screen, product });
  }

  const stageId = `stage:${stage}`;
  const hasStage = registry.contracts.some(c => c.id === stageId) || Object.values(kind).some(k => k.layer === 'stage');
  if (!hasStage) throw new Error(`Falta etapa.md em rascunhos (ou uma etapa já registrada). O contrato da etapa é obrigatório.`);
  fs.mkdirSync(contractDir, { recursive: true });
  const put = entry => {
    const at = registry.contracts.findIndex(c => c.id === entry.id);
    if (at < 0) registry.contracts.push(entry);
    else registry.contracts[at] = { ...registry.contracts[at], ...entry };
  };
  for (const [name, k] of Object.entries(kind)) {
    const rel = `etapas/${stage}/contratos/${name}`;
    if (k.layer === 'stage') put({ id: stageId, layer: 'stage', stage, path: rel, version: k.version, state: 'proposal', dependsOn: [] });
    else if (k.layer === 'screen') put({ id: `screen:${stage}:${k.screen}`, layer: 'screen', stage, screen: k.screen, path: rel, version: k.version, state: 'proposal', dependsOn: [stageId] });
    else put({ id: `product-screen:${stage}:${k.product}:${k.screen}`, layer: 'product-screen', stage, product: k.product, screen: k.screen, path: rel, version: k.version, state: 'proposal', dependsOn: [stageId, `screen:${stage}:${k.screen}`] });
  }
  const order = { stage: 0, screen: 1, 'product-screen': 2 };
  registry.contracts.sort((a, b) => order[a.layer] - order[b.layer] || a.id.localeCompare(b.id));

  // Tudo o que muda daqui para baixo é desfeito se o snapshot ou a conferência falharem: os rascunhos voltam e o registro fica como estava.
  const indexPath = path.join(root, 'contracts', 'index.json');
  const registryRel = `etapas/${stage}/contratos/registro.json`;
  const before = { registry: fs.existsSync(existing) ? fs.readFileSync(existing, 'utf8') : null, index: fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : null, replaced: {} };
  const moved = [];
  try {
    for (const name of Object.keys(kind)) {
      const target = path.join(contractDir, name);
      if (fs.existsSync(target)) before.replaced[name] = fs.readFileSync(target);
      fs.renameSync(path.join(draftDir, name), target);
      moved.push(name);
    }
    fs.writeFileSync(existing, JSON.stringify(registry, null, 2) + '\n');
    const index = before.index ? JSON.parse(before.index) : { schemaVersion: 1, registries: [] };
    if (!index.registries.includes(registryRel)) index.registries.push(registryRel);
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');

    var changed = lockSnapshots({ root, registryPath: registryRel, note, refreshDependencies: true });
    var result = checkAll({ root });
    if (result.errors.length) throw new Error(`a conferência falhou:\n- ${result.errors.join('\n- ')}`);
  } catch (error) {
    for (const name of moved) {
      fs.renameSync(path.join(contractDir, name), path.join(draftDir, name));
      if (before.replaced[name]) fs.writeFileSync(path.join(contractDir, name), before.replaced[name]);
    }
    if (before.registry === null) fs.rmSync(existing, { force: true }); else fs.writeFileSync(existing, before.registry);
    if (before.index === null) fs.rmSync(indexPath, { force: true }); else fs.writeFileSync(indexPath, before.index);
    throw new Error(`${error.message}\nNada foi alterado: os rascunhos continuam em etapas/${stage}/rascunhos/. Corrija e rode de novo.`);
  }
  return { moved: Object.keys(kind), locked: changed, total: result.count };
}

function cli() {
  const args = process.argv.slice(2);
  const opt = name => { const at = args.indexOf(name); return at >= 0 ? args[at + 1] : undefined; };
  const stage = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
  const root = opt('--root') ? path.resolve(opt('--root')) : path.resolve(__dirname, '..');
  const r = promote({ root, stage, note: opt('--note') });
  console.log(`Promovidos: ${r.moved.join(', ')}\nSnapshots: ${r.locked.length ? r.locked.join(', ') : 'nenhuma mudança'}\nContratos registrados nesta instalação: ${r.total}. Conferência ok.`);
}
if (require.main === module) { try { cli(); } catch (e) { console.error(e.message); process.exitCode = 1; } }
module.exports = { promote };
