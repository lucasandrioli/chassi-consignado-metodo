const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { promote } = require('./promover.cjs');
const { checkAll } = require('./contracts.cjs');

const fake = path.resolve(__dirname, '..', 'exemplos', 'fake', 'etapas', 'formalizacao-credito-consignado', 'contratos');
function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'promover-'));
  fs.mkdirSync(path.join(root, 'contracts'), { recursive: true });
  fs.writeFileSync(path.join(root, 'contracts', 'index.json'), JSON.stringify({ schemaVersion: 1, registries: [] }));
  const drafts = path.join(root, 'etapas', 'st', 'rascunhos');
  fs.mkdirSync(drafts, { recursive: true });
  return { root, drafts };
}
const copy = (drafts, from, to) => fs.copyFileSync(path.join(fake, from), path.join(drafts, to));

// 1. Etapa, tela e dois produtos: move, registra, trava e confere
{
  const { root, drafts } = workspace();
  copy(drafts, 'etapa.md', 'etapa.md'); copy(drafts, 'revisao.md', 'tela-a.md');
  copy(drafts, 'inss-revisao.md', 'produto-um-tela-a.md'); copy(drafts, 'op-revisao.md', 'produto-dois-tela-a.md');
  const r = promote({ root, stage: 'st', note: 'teste' });
  assert.equal(r.moved.length, 4);
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'etapas', 'st', 'contratos', 'registro.json'), 'utf8'));
  assert.deepEqual(registry.contracts.map(c => c.id), ['stage:st', 'screen:st:tela-a', 'product-screen:st:produto-dois:tela-a', 'product-screen:st:produto-um:tela-a']);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'contracts', 'index.json'), 'utf8')).registries, ['etapas/st/contratos/registro.json']);
  assert.equal(fs.readdirSync(drafts).length, 0, 'rascunhos foram movidos');
  assert.deepEqual(checkAll({ root }).errors, []);
}
// 2. Mais uma tela depois: atualiza o registro sem perder o que já estava
{
  const { root, drafts } = workspace();
  copy(drafts, 'etapa.md', 'etapa.md'); copy(drafts, 'revisao.md', 'tela-a.md'); copy(drafts, 'inss-revisao.md', 'p-tela-a.md');
  promote({ root, stage: 'st', note: 'primeira' });
  copy(drafts, 'revisao.md', 'tela-b.md'); copy(drafts, 'inss-revisao.md', 'p-tela-b.md');
  promote({ root, stage: 'st', note: 'segunda' });
  const ids = JSON.parse(fs.readFileSync(path.join(root, 'etapas', 'st', 'contratos', 'registro.json'), 'utf8')).contracts.map(c => c.id);
  assert.deepEqual(ids, ['stage:st', 'screen:st:tela-a', 'screen:st:tela-b', 'product-screen:st:p:tela-a', 'product-screen:st:p:tela-b']);
  assert.deepEqual(checkAll({ root }).errors, []);
}
// 3. Recusas com mensagem clara
{
  const { root, drafts } = workspace();
  assert.throws(() => promote({ root, stage: 'st', note: 'x' }), /nenhum \.md/);
  fs.writeFileSync(path.join(drafts, 'solto.md'), '# sem nada\n**Versão:** 0.1\n');
  assert.throws(() => promote({ root, stage: 'st', note: 'x' }), /não é etapa\.md/);
  fs.writeFileSync(path.join(drafts, 'solto.md'), '# sem versão\n');
  assert.throws(() => promote({ root, stage: 'st', note: 'x' }), /falta "\*\*Versão/);
  fs.rmSync(path.join(drafts, 'solto.md')); copy(drafts, 'revisao.md', 'tela-a.md');
  assert.throws(() => promote({ root, stage: 'st', note: 'x' }), /Falta etapa\.md/);
  copy(drafts, 'etapa.md', 'etapa.md'); copy(drafts, 'inss-revisao.md', 'sem-tela.md');
  assert.throws(() => promote({ root, stage: 'st', note: 'x' }), /não achei a tela/);
  assert.throws(() => promote({ root, stage: 'St!', note: 'x' }), /Id de etapa inválido/);
  assert.throws(() => promote({ root, stage: 'st', note: '' }), /--note/);
}
// 4. Falha no snapshot: nada muda e os rascunhos continuam onde estavam
{
  const { root, drafts } = workspace();
  copy(drafts, 'etapa.md', 'etapa.md'); copy(drafts, 'revisao.md', 'tela-a.md'); copy(drafts, 'inss-revisao.md', 'p-tela-a.md');
  promote({ root, stage: 'st', note: 'primeira' });
  const contracts = path.join(root, 'etapas', 'st', 'contratos');
  const registryBefore = fs.readFileSync(path.join(contracts, 'registro.json'), 'utf8');
  const etapaBefore = fs.readFileSync(path.join(contracts, 'etapa.md'), 'utf8');
  fs.writeFileSync(path.join(drafts, 'etapa.md'), etapaBefore + '\nMudou sem subir a versão.\n');
  assert.throws(() => promote({ root, stage: 'st', note: 'segunda' }), /aumente a versão[\s\S]*Nada foi alterado/);
  assert.equal(fs.readFileSync(path.join(contracts, 'registro.json'), 'utf8'), registryBefore, 'registro intacto');
  assert.equal(fs.readFileSync(path.join(contracts, 'etapa.md'), 'utf8'), etapaBefore, 'contrato registrado intacto');
  assert.deepEqual(fs.readdirSync(drafts), ['etapa.md'], 'rascunho continua no lugar');
  assert.deepEqual(checkAll({ root }).errors, []);
  // depois de subir a versão, a promoção passa
  fs.writeFileSync(path.join(drafts, 'etapa.md'), (etapaBefore + '\nMudou.\n').replace(/\*\*Versão:\*\*\s*[0-9.]+/, '**Versão:** 5.0'));
  promote({ root, stage: 'st', note: 'terceira' });
  assert.deepEqual(checkAll({ root }).errors, []);
}
// 5. A etapa evolui (nova versão) e as telas já registradas, que não mudaram, seguem válidas
{
  const { root, drafts } = workspace();
  copy(drafts, 'etapa.md', 'etapa.md'); copy(drafts, 'revisao.md', 'tela-a.md'); copy(drafts, 'inss-revisao.md', 'p-tela-a.md');
  promote({ root, stage: 'st', note: 'primeira' });
  const etapa = fs.readFileSync(path.join(root, 'etapas', 'st', 'contratos', 'etapa.md'), 'utf8');
  fs.writeFileSync(path.join(drafts, 'etapa.md'), (etapa + '\nCobertura: tela b.\n').replace(/\*\*Versão:\*\*\s*[0-9.]+/, '**Versão:** 5.0'));
  copy(drafts, 'revisao.md', 'tela-b.md'); copy(drafts, 'inss-revisao.md', 'p-tela-b.md');
  const r = promote({ root, stage: 'st', note: 'segunda tela' });
  assert.ok(r.locked.includes('screen:st:tela-a') && r.locked.includes('product-screen:st:p:tela-a'), 'dependências das telas antigas renovadas');
  assert.deepEqual(checkAll({ root }).errors, []);
}
console.log('promover: ok');
