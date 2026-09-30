const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { encodeCell, decodeCell, renderLayers, renderCoreKey, renderSource, parseLayers, parseSource } = require('./contract-tables.cjs');

// ---- células ----
for (const value of ['', 'texto simples', 'com | barra', 'com \\ contrária', 'linha 1\nlinha 2', ' espaço na ponta ', '`crase`', 'R$ 1.324,57 | Conta 58788-2', 'a\\nb']) {
  assert.equal(decodeCell(encodeCell(value)), value, `ida e volta: ${JSON.stringify(value)}`);
}

// ---- fixture de contratos ----
const AXES = {
  operation: { collection: 'Operação', modes: ['A', 'B'] },
  context: { collection: 'Contexto', modes: ['x'] },
  additional: { collection: 'Produtos Adicionais', modes: ['sem', 'com'] }
};
const LAYERS = { 'bloco-opcional': ['conteudo', 'bloco-opcional'] };
const KEY = 'a'.repeat(40);
const bindings = (title) => [
  { id: 'texto-titulo', type: 'STRING', target: { kind: 'component', path: ['Header'], property: 'Titulo' }, default: title, operation: { A: title, B: 'Outro | título' } },
  { id: 'visivel-bloco-opcional', type: 'BOOLEAN', target: { kind: 'visible', path: LAYERS['bloco-opcional'] }, default: false, additional: { sem: false, com: true } },
  { id: 'prop-item-trailing', type: 'STRING', target: { kind: 'component', path: ['item'], property: 'Trailing item' }, default: 'None', static: true }
];
function fixture({ productBindings = { a: bindings('Título A') }, axesFor = {}, layers = LAYERS, extraConfig = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-pkg-'));
  const dir = path.join(root, 'etapas', 'st', 'contratos');
  fs.mkdirSync(dir, { recursive: true }); fs.mkdirSync(path.join(root, 'contracts')); fs.mkdirSync(path.join(root, 'plugin', 'packages'), { recursive: true });
  const contracts = [{ id: 'stage:st', layer: 'stage', stage: 'st', path: 'etapas/st/contratos/etapa.md' }];
  fs.writeFileSync(path.join(dir, 'etapa.md'), '# etapa\n');
  for (const screen of Object.keys(productBindings)) {
    contracts.push({ id: `screen:st:${screen}`, layer: 'screen', stage: 'st', screen, path: `etapas/st/contratos/${screen}.md` });
    fs.writeFileSync(path.join(dir, `${screen}.md`), `# tela ${screen}\n\n${renderLayers(layers)}\n\n${renderCoreKey({ componente: 'core-x', chave: KEY, arquivo: 'https://www.figma.com/design/abc?node-id=1-2', publicado: '2026-01-02', nota: 'teste' })}\n`);
    contracts.push({ id: `product-screen:st:p1:${screen}`, layer: 'product-screen', stage: 'st', product: 'p1', screen, path: `etapas/st/contratos/p1-${screen}.md` });
    const config = { 'etapa.nome': 'Etapa de teste', 'etapa.versao': '0.1', 'chassi.versao': '1.0', 'produto.versao': '0.1', 'tela.id': screen, 'tela.nome': `Tela ${screen}`, 'tela.versao': '0.1', ...extraConfig, estado: 'technical-proof' };
    fs.writeFileSync(path.join(dir, `p1-${screen}.md`), `# p1 ${screen}\n\n${renderSource({ config, axes: axesFor[screen] || AXES, notes: [`nota de ${screen}`, 'nota comum'], bindings: productBindings[screen] })}\n`);
  }
  fs.writeFileSync(path.join(dir, 'registro.json'), JSON.stringify({ schemaVersion: 1, contracts }));
  fs.writeFileSync(path.join(root, 'contracts', 'index.json'), JSON.stringify({ schemaVersion: 1, registries: ['etapas/st/contratos/registro.json'] }));
  return root;
}
const { buildPackages } = require('./gen-packages.cjs');

// 1. Pacote sai do contrato, sem passar por outro lugar
{
  const [pkg] = buildPackages(fixture());
  assert.equal(pkg.id, 'st-p1');
  assert.equal(pkg.screens.length, 1);
  assert.deepEqual(pkg.screens[0].bindings, bindings('Título A'));
  assert.deepEqual(pkg.axes, AXES);
  assert.deepEqual(pkg.notes, ['nota de a', 'nota comum']);
  assert.equal(pkg.screens[0].bindings[0].operation.B, 'Outro | título', 'texto com barra sobrevive');
}
// 2. Mudar um texto no contrato muda o pacote (sem editar script)
{
  const root = fixture();
  const file = path.join(root, 'etapas', 'st', 'contratos', 'p1-a.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replaceAll('Título A', 'Título NOVO'));
  assert.equal(buildPackages(root)[0].screens[0].bindings[0].default, 'Título NOVO');
}
// 3. Etapa com várias telas: um pacote por produto, uma tela por contrato, na ordem do registro
{
  const [pkg] = buildPackages(fixture({ productBindings: { a: bindings('A'), b: bindings('B') } }));
  assert.deepEqual(pkg.screens.map(s => s.id), ['a', 'b']);
  assert.deepEqual(pkg.notes, ['nota de a', 'nota comum', 'nota de b'], 'notas unidas sem duplicar');
  assert.equal(pkg.screens[1].bindings[0].default, 'B');
}
// 4. Eixos diferentes entre telas da mesma etapa: recusa
assert.throws(() => buildPackages(fixture({ productBindings: { a: bindings('A'), b: bindings('B') }, axesFor: { b: { ...AXES, operation: { collection: 'Operação', modes: ['A', 'B', 'C'] } } } })), /mesmos em todas as telas/);
// 5. Camada ligável sem ligação: recusa
assert.throws(() => buildPackages(fixture({ layers: { ...LAYERS, 'outra-camada': ['conteudo', 'outra-camada'] } })), /sem ligação de visibilidade/);
// 6. Alvo apontando para camada inexistente: recusa
{
  const bad = bindings('A'); bad[1] = { ...bad[1], id: 'visivel-fantasma' };
  const root = fixture({ productBindings: { a: bad } });
  const file = path.join(root, 'etapas', 'st', 'contratos', 'p1-a.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('camada: fantasma', 'camada: fantasma'));
  assert.throws(() => buildPackages(root));
}
// 7. Modo inexistente no eixo: recusa
{
  const bad = bindings('A'); bad[0].operation = { Z: 'x' };
  assert.throws(() => buildPackages(fixture({ productBindings: { a: bad } })), /modo "Z" não existe/);
}
// 8. Tabelas de máquina ausentes: recusa com mensagem clara
{
  const root = fixture();
  fs.writeFileSync(path.join(root, 'etapas', 'st', 'contratos', 'p1-a.md'), '# sem bloco\n');
  assert.throws(() => buildPackages(root), /Bloco da fonte do pacote ausente/);
}
// 9. Contratos do exemplo Fake geram pacotes idênticos aos gravados (--check em código)
{
  const fakeRoot = path.resolve(__dirname, '..', '..', 'exemplos', 'fake');
  const real = buildPackages(fakeRoot);
  for (const pkg of real) {
    const file = path.join(fakeRoot, 'plugin', 'packages', `${pkg.id}.json`);
    assert.equal(fs.readFileSync(file, 'utf8'), JSON.stringify(pkg, null, 2) + '\n', `${pkg.id}: pacote gravado difere do contrato`);
  }
  assert.ok(real.length >= 2);
}
// 10. A chave do Core vem só do contrato da tela e chega a todas as telas/produtos
{
  const [pkg] = buildPackages(fixture({ productBindings: { a: bindings('A'), b: bindings('B') } }));
  assert.deepEqual(pkg.screens.map(s => s.coreKey), [KEY, KEY]);
}
// 11. Chave declarada também no contrato do produto: recusa (uma fonte só)
assert.throws(() => buildPackages(fixture({ extraConfig: { 'tela.coreKey': KEY } })), /mora só no contrato da tela/);
// 12. Chave inválida ou tabela de chave ausente: recusa
{
  const root = fixture();
  const file = path.join(root, 'etapas', 'st', 'contratos', 'a.md');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(KEY, 'xyz'));
  assert.throws(() => buildPackages(root), /chave do Core inválida/);
  fs.writeFileSync(file, '# sem chave\n' + renderLayers(LAYERS) + '\n');
  assert.throws(() => buildPackages(root), /Bloco da chave do Core ausente/);
}
// 13. Os modelos de contrato trazem tabelas de máquina que o próprio gerador consegue ler
{
  const models = path.resolve(__dirname, '..', '..', 'modelos');
  const screen = fs.readFileSync(path.join(models, 'contrato-tela.md'), 'utf8');
  const product = fs.readFileSync(path.join(models, 'contrato-produto-tela.md'), 'utf8');
  const layers = require('./contract-tables.cjs').parseLayers(screen);
  assert.ok(layers.size >= 1, 'modelo da tela tem camadas ligáveis');
  assert.equal(require('./contract-tables.cjs').parseCoreKey(screen).chave.length, 40);
  const source = parseSource(product, layers);
  assert.ok(source.bindings.length >= 3 && Object.keys(source.axes).length === 3, 'modelo do produto tem ligações e três eixos');
  assert.ok(/\*\*Versão:\*\*\s*\d+\.\d+/.test(screen) && /\*\*Versão:\*\*\s*\d+\.\d+/.test(product), 'modelos com linha de versão');
}
console.log('gen-packages: ok');
