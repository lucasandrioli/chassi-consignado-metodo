/* Simulador mínimo da API do Figma para exercitar installProductLibrary (plugin/code.js)
 * contra um Core falso com os nomes e caminhos do recibo de montagem (core-revisao).
 * Sem dependências. Uso: node plugin/tests/installer-sim.cjs
 *
 * O que simula: árvore de nós (name/type/children/visible), findAll/findAllWithCriteria/findOne
 * (respeitando skipInvisibleInstanceChildren), instâncias por clonagem do mestre, componentProperties
 * com chaves "Rótulo#id", setProperties (inclusive com alias de variável), setBoundVariable,
 * coleções e variáveis com modes, alias entre variáveis e resolução por modes selecionados.
 * O que NÃO simula: layout/auto layout, fontes reais, overrides de instância além de visible/properties,
 * limite de modes por plano, publicação de bibliotecas, ordem de z-index.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const ROOT = path.resolve(__dirname, '..');
const CORE_KEY = '4a27f4beda4fa387be07dfe3cfb352b566e61d46';

// ---------------------------------------------------------------- nós falsos
let nextId = 1;
class FakeNode {
  constructor(type, name, opts = {}) {
    this.id = `n${nextId++}`; this.type = type; this.name = name;
    this.children = []; this.parent = null; this.visible = opts.visible !== false;
    this.componentProperties = opts.props ? JSON.parse(JSON.stringify(opts.props)) : {};
    this.boundVariables = {}; this.propertyBindings = {};
    this.x = 0; this.y = 0; this.width = opts.width || 100; this.height = opts.height || 40;
    this.removed = false; this._main = null; this.characters = opts.characters;
  }
  add(...nodes) { for (const n of nodes) { n.parent = this; this.children.push(n); } return this; }
  appendChild(n) { if (n.parent) n.parent.children = n.parent.children.filter(c => c !== n); this.add(n); }
  remove() { this.removed = true; if (this.parent) this.parent.children = this.parent.children.filter(c => c !== this); }
  resize(w, h) { this.width = w; this.height = h; }
  // Com skipInvisibleInstanceChildren, o Figma não entra em filhos invisíveis dentro de instâncias.
  _walk(visit, insideInstance = false) {
    for (const child of this.children) {
      if (FIGMA_STATE.skipInvisibleInstanceChildren && insideInstance && child.visible === false) continue;
      visit(child);
      child._walk(visit, insideInstance || child.type === 'INSTANCE');
    }
  }
  findAll(fn) { const out = []; this._walk(n => { if (fn(n)) out.push(n); }, this.type === 'INSTANCE'); return out; }
  findAllWithCriteria({ types }) { return this.findAll(n => types.includes(n.type)); }
  findOne(fn) { return this.findAll(fn)[0] || null; }
  createInstance() {
    assert.equal(this.type, 'COMPONENT');
    const copy = (n, top) => {
      const c = new FakeNode(top ? 'INSTANCE' : n.type === 'COMPONENT' ? 'INSTANCE' : n.type, n.name,
        { visible: n.visible, props: n.componentProperties, width: n.width, height: n.height, characters: n.characters });
      c.x = n.x; c.y = n.y;
      for (const child of n.children) c.add(copy(child, false));
      return c;
    };
    const instance = copy(this, true);
    instance._main = this;
    return instance;
  }
  async getMainComponentAsync() { return this._main; }
  setProperties(values) {
    for (const [key, value] of Object.entries(values)) {
      const def = this.componentProperties[key];
      if (!def) throw new Error(`Property inexistente: ${key} em ${this.name}`);
      if (value && value.type === 'VARIABLE_ALIAS') {
        const variable = FIGMA_STATE.variablesById.get(value.id);
        const expected = def.type === 'TEXT' || def.type === 'VARIANT' ? 'STRING' : def.type === 'BOOLEAN' ? 'BOOLEAN' : null;
        if (variable.resolvedType !== expected) throw new Error(`Alias ${variable.name} incompatível com property ${def.type}`);
        this.propertyBindings[key] = value.id;
        def.boundVariables = { value }; // como a API real expõe: componentProperties[chave].boundVariables.value
      } else def.value = value;
    }
  }
  setBoundVariable(field, variable) {
    const allowed = { characters: 'STRING', visible: 'BOOLEAN' };
    if (!allowed[field]) throw new Error(`Campo não ligável: ${field}`);
    if (variable.resolvedType !== allowed[field]) throw new Error(`Variável ${variable.name} não serve para ${field}`);
    this.boundVariables[field] = { type: 'VARIABLE_ALIAS', id: variable.id };
  }
  setExplicitVariableModeForCollection(collection, modeId) { (this.explicitModes ||= {})[collection.id] = modeId; }
  getStyledTextSegments() { return []; }
}

// ------------------------------------------------------------- estado do "Figma"
const FIGMA_STATE = { skipInvisibleInstanceChildren: true, variablesById: new Map(), collections: [], variables: [], pluginData: {}, messages: [], masters: new Map() };

function makeFigma(pageName = 'Página 1') {
  FIGMA_STATE.variablesById = new Map(); FIGMA_STATE.collections = []; FIGMA_STATE.variables = [];
  FIGMA_STATE.pluginData = {}; FIGMA_STATE.messages = []; FIGMA_STATE.skipInvisibleInstanceChildren = true;
  let seq = 1;
  const page = new FakeNode('PAGE', pageName); page.selection = [];
  const createCollection = name => {
    const modeId = `m${seq++}`;
    const col = { id: `c${seq++}`, name, modes: [{ modeId, name: 'Mode 1' }],
      renameMode(id, newName) { this.modes.find(m => m.modeId === id).name = newName; },
      addMode(newName) { const id = `m${seq++}`; this.modes.push({ modeId: id, name: newName }); return id; } };
    FIGMA_STATE.collections.push(col);
    return col;
  };
  return {
    currentPage: page, mixed: Symbol('mixed'), viewport: { scrollAndZoomIntoView() {} },
    get skipInvisibleInstanceChildren() { return FIGMA_STATE.skipInvisibleInstanceChildren; },
    set skipInvisibleInstanceChildren(v) { FIGMA_STATE.skipInvisibleInstanceChildren = v; },
    root: { getPluginData: k => FIGMA_STATE.pluginData[k] || '', setPluginData: (k, v) => { FIGMA_STATE.pluginData[k] = v; } },
    ui: { postMessage: m => FIGMA_STATE.messages.push(m), onmessage: null },
    showUI() {}, loadFontAsync: async () => {},
    createComponent() { return new FakeNode('COMPONENT', 'Component'); },
    async importComponentByKeyAsync(key) {
      const master = FIGMA_STATE.masters.get(key);
      if (!master) throw new Error(`Componente ${key} não encontrado`);
      return master;
    },
    variables: {
      async getLocalVariableCollectionsAsync() { return [...FIGMA_STATE.collections]; },
      async getLocalVariablesAsync() { return [...FIGMA_STATE.variables]; },
      createVariableCollection: createCollection,
      createVariable(name, collection, type) {
        assert.ok(FIGMA_STATE.collections.includes(collection), 'coleção desconhecida');
        const v = { id: `v${seq++}`, name, variableCollectionId: collection.id, resolvedType: type, valuesByMode: {}, scopes: [],
          setValueForMode(modeId, value) {
            assert.ok(collection.modes.some(m => m.modeId === modeId), `mode inválido em ${name}`);
            const okType = value && value.type === 'VARIABLE_ALIAS' ? true : typeof value === (type === 'STRING' ? 'string' : 'boolean');
            assert.ok(okType, `${name}: valor de tipo errado`);
            this.valuesByMode[modeId] = value;
          } };
        FIGMA_STATE.variables.push(v); FIGMA_STATE.variablesById.set(v.id, v);
        return v;
      },
      createVariableAlias(variable) { return { type: 'VARIABLE_ALIAS', id: variable.id }; }
    }
  };
}

// ---------------------------------------------------------------- Core falso
const TEXT = (key, value = '') => ({ type: 'TEXT', value, [key]: undefined });
function props(obj) { return Object.fromEntries(Object.entries(obj).map(([k, t]) => [k, { type: t, value: t === 'TEXT' ? '' : true }])); }
const inst = (name, p = {}, ...kids) => new FakeNode('INSTANCE', name, { props: props(p) }).add(...kids);
const frame = (name, opts, ...kids) => new FakeNode('FRAME', name, opts).add(...kids);
const item = name => inst(name, { 'Trailing item': 'VARIANT', 'Has next item#66:6': 'BOOLEAN', 'Show supporting item#66:3': 'BOOLEAN', 'Show leading item#66:0': 'BOOLEAN' },
  inst('Label box', {}, inst('Label 01', { 'Content#60:0': 'TEXT' }), inst('Label 02', { 'Content#60:0': 'TEXT' })),
  inst('Supporting item', {}, inst('.Description box', {}, inst('Description 01', { 'Content#60:0': 'TEXT' }))));
const body = name => inst(name, { 'Content#58:0': 'TEXT' });
const section = name => inst(name, { 'Content#60:8': 'TEXT' });

function buildCore(mutate) {
  const bodies = [];
  for (const row of ['header-row', 'linha-1', 'linha-2', 'linha-3', 'linha-4'])
    for (const col of ['col-label', 'col-valor-1', 'col-valor-2']) bodies.push(body(`body-${row}-${col}`));
  const core = new FakeNode('COMPONENT', 'core-revisao', { width: 360, height: 2550 });
  const ops = ['valor-receber', 'saldo-refinanciar', 'parcelas', 'total-pagar', 'iof', 'taxa-juros', 'cet', 'forma-pagamento', 'periodo',
    'dinheiro-conta', 'data-portabilidade', 'conta-recebimento', 'fonte-pagadora', 'matricula'];
  core.add(
    inst('Navigation header', { 'Large title content#67:20': 'TEXT' }),
    frame('conteudo', {},
      frame('tabela-comparativa', {}, ...bodies),
      frame('detalhes-portabilidade', {},
        inst('subtitulo-detalhes', { 'Content#60:8': 'TEXT' }),
        frame('dados-operacao', {}, ...ops.map(n => item(`item-${n}`)), body('body-condicoes'))),
      inst('banner-port-atq', { 'Body content#67:2': 'TEXT', 'Has interaction#1:1': 'BOOLEAN' }),
      frame('secao-seguro', {}, section('section-seguro'), ...['parcelas', 'total-pagar', 'forma-pagamento', 'conta-debito'].map(n => item(`seg-${n}`))),
      frame('secao-portabilidade', {}, section('section-portabilidade'), ...['fonte-pagadora', 'cnpj', 'banco', 'prazo'].map(n => item(`port-${n}`))),
      inst('aviso-portabilidade', { 'Content#58:0': 'TEXT' })),
    inst('Fixed button', {}, inst('Primary', { 'Label content#63:0': 'TEXT' })),
    frame('overlay-operacao-nao-utilizada', { visible: false },
      frame('wrapper-rule', {}, frame('wrapper-rule-operacao-sem-revisao', { visible: false },
        frame('rule-operacao-sem-revisao', {}, frame('overlay-blocker', {}, frame('badge', {}, new FakeNode('TEXT', 'Mensagem da operação'))))),
      frame('rule-port-ret-simples', {}, frame('overlay-blocker', {}, frame('badge', {}, new FakeNode('TEXT', 'Mensagem da operação')))))));
  if (mutate) mutate(core);
  core.remote = true; core.key = CORE_KEY; core.componentPropertyDefinitions = {};
  return core;
}

// ------------------------------------------------------- carga do plugin gerado
// O plugin de teste é gerado a partir do exemplo Fake (exemplos/fake), sem tocar em plugin/code.js.
function buildFakePlugin() {
  const out = path.join(require('node:os').tmpdir(), `chassi-plugin-fake-${process.pid}.js`);
  require('node:child_process').execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'build.cjs'), '--root', path.join(ROOT, '..', 'exemplos', 'fake'), '--out', out], { stdio: 'pipe' });
  return out;
}
const FAKE_PLUGIN = buildFakePlugin();
function loadPlugin(figma) {
  const code = fs.readFileSync(FAKE_PLUGIN, 'utf8');
  const ctx = vm.createContext({ figma, __html__: '', console, Math, JSON, Object, Array, Promise, Error, Set, Map });
  vm.runInContext(code, ctx);
  return { ctx, packages: vm.runInContext('PACKAGES', ctx), install: vm.runInContext('installProductLibrary', ctx), verify: vm.runInContext('verifyProductLibrary', ctx), plan: vm.runInContext('planInstall', ctx) };
}

// --------------------------------------------------------------- resolução
function resolveVar(variable, selection) {
  const col = FIGMA_STATE.collections.find(c => c.id === variable.variableCollectionId);
  const modeId = selection[col.id] || col.modes[0].modeId;
  const value = variable.valuesByMode[modeId];
  if (value && value.type === 'VARIABLE_ALIAS') return resolveVar(FIGMA_STATE.variablesById.get(value.id), selection);
  return value;
}
const collectionByName = name => FIGMA_STATE.collections.find(c => c.name === name);
function selectionFor(pkg, op, ctx, add) {
  const sel = {};
  for (const [axis, mode] of [['operation', op], ['context', ctx], ['additional', add]]) {
    const col = collectionByName(pkg.axes[axis].collection);
    const m = col.modes.find(x => x.name === mode);
    assert.ok(m, `mode ${mode} ausente em ${col.name}`);
    sel[col.id] = m.modeId;
  }
  return sel;
}
function resolvePath(root, pathNames) { let n = root; for (const s of pathNames) { const f = n.findAll(x => x.name === s); assert.equal(f.length, 1, `caminho ${s}`); n = f[0]; } return n; }

// ---------------------------------------------------------------- expectativas
// Escritas à mão a partir do contrato (regras por Operação / Adicionais), sem ler o pacote.
const ITEM_LAYERS = ['valor-receber', 'saldo-refinanciar', 'forma-pagamento', 'dinheiro-conta', 'data-portabilidade', 'conta-recebimento', 'fonte-pagadora', 'matricula'];
function expectedVisible(product, op, add) {
  const v = {};
  if (product === 'inss') {
    Object.assign(v, { 'tabela-comparativa': false, 'subtitulo-detalhes': false, 'banner-port-atq': false, 'secao-seguro': false,
      'secao-portabilidade': add === 'portabilidade de benefício', 'aviso-portabilidade': add === 'portabilidade de benefício',
      'overlay-operacao-nao-utilizada': false, 'wrapper-rule-operacao-sem-revisao': false,
      'item-valor-receber': true, 'item-saldo-refinanciar': op === 'REFIN', 'item-forma-pagamento': false, 'item-dinheiro-conta': true,
      'item-data-portabilidade': false, 'item-conta-recebimento': true, 'item-fonte-pagadora': false, 'item-matricula': false });
  } else {
    const port = op.startsWith('Port Ataque');
    Object.assign(v, { 'tabela-comparativa': op === 'Port Ataque Refin', 'subtitulo-detalhes': op === 'Port Ataque Refin', 'banner-port-atq': op === 'Port Ataque Refin',
      'secao-seguro': add === 'seguro' || add === 'seguro+port', 'secao-portabilidade': add === 'port salário' || add === 'seguro+port',
      'aviso-portabilidade': add === 'port salário' || add === 'seguro+port',
      'overlay-operacao-nao-utilizada': port, 'wrapper-rule-operacao-sem-revisao': add !== 'sem adicionais',
      'item-valor-receber': op !== 'Port Ataque Saldo', 'item-saldo-refinanciar': op === 'REFIN' || op === 'Port Ataque Refin',
      'item-forma-pagamento': op === 'PCON' || op === 'REFIN', 'item-dinheiro-conta': op !== 'Port Ataque Saldo',
      'item-data-portabilidade': port, 'item-conta-recebimento': op !== 'Port Ataque Saldo', 'item-fonte-pagadora': true, 'item-matricula': true });
  }
  return v;
}
const LAYER_PATHS = {
  'tabela-comparativa': ['conteudo', 'tabela-comparativa'], 'subtitulo-detalhes': ['conteudo', 'detalhes-portabilidade', 'subtitulo-detalhes'],
  'banner-port-atq': ['conteudo', 'banner-port-atq'], 'secao-seguro': ['conteudo', 'secao-seguro'], 'secao-portabilidade': ['conteudo', 'secao-portabilidade'],
  'aviso-portabilidade': ['conteudo', 'aviso-portabilidade'], 'overlay-operacao-nao-utilizada': ['overlay-operacao-nao-utilizada'],
  'wrapper-rule-operacao-sem-revisao': ['overlay-operacao-nao-utilizada', 'wrapper-rule', 'wrapper-rule-operacao-sem-revisao']
};
for (const n of ITEM_LAYERS.filter(x => x.length)) if (!LAYER_PATHS[`item-${n}`]) LAYER_PATHS[`item-${n}`] = ['conteudo', 'detalhes-portabilidade', 'dados-operacao', `item-${n}`];
const layerPath = l => LAYER_PATHS[l] || LAYER_PATHS[`item-${l}`];

// --------------------------------------------------------------------- testes
let passed = 0;
async function check(label, fn) { try { await fn(); passed++; console.log(`  ok   ${label}`); } catch (e) { console.log(`  FALHA ${label}\n       ${e.message}`); process.exitCode = 1; } }

async function installFresh(pkgId, mutateCore) {
  const figma = makeFigma();
  FIGMA_STATE.masters = new Map([[CORE_KEY, buildCore(mutateCore)]]);
  const { packages, install, verify, plan } = loadPlugin(figma);
  const pkg = packages.find(p => p.id === pkgId);
  assert.ok(pkg, `pacote ${pkgId} ausente em code.js`);
  await install(pkg);
  return { figma, pkg, install, verify, plan };
}

async function testProduct(id, product, combos) {
  console.log(`\n${id}`);
  const { figma, pkg, install, verify } = await installFresh(id);
  const screen = pkg.screens[0];
  const component = figma.currentPage.children.find(n => n.type === 'COMPONENT');
  const core = component.children.find(n => n.name === 'Chassi/revisao');

  await check('cria as 3 coleções com os modes do pacote', () => {
    for (const axis of ['operation', 'context', 'additional']) {
      const col = collectionByName(pkg.axes[axis].collection);
      assert.ok(col, `coleção ${axis} ausente`);
      assert.deepEqual(col.modes.map(m => m.name), [...pkg.axes[axis].modes]);
    }
    assert.equal(FIGMA_STATE.collections.length, 3);
  });
  await check('cria uma variável de Operação por binding e as dos demais eixos só onde há override', () => {
    const per = { operation: 0, context: 0, additional: 0 };
    for (const b of screen.bindings.filter(x => !x.static)) for (const axis of ['operation', 'context', 'additional']) if (axis === 'operation' || b[axis]) per[axis]++;
    for (const axis of Object.keys(per)) {
      const col = collectionByName(pkg.axes[axis].collection);
      assert.equal(FIGMA_STATE.variables.filter(v => v.variableCollectionId === col.id).length, per[axis], axis);
    }
  });
  await check('todo binding STRING liga a property TEXT do destino por caminho', () => {
    let n = 0;
    for (const b of screen.bindings.filter(x => x.type === 'STRING' && !x.static)) {
      const node = resolvePath(core, b.target.path);
      const key = Object.keys(node.componentProperties).find(k => k.split('#')[0] === b.target.property);
      assert.ok(key, `${b.id}: property ${b.target.property}`);
      const variable = FIGMA_STATE.variablesById.get(node.propertyBindings[key]);
      assert.ok(variable, `${b.id}: sem alias`);
      assert.ok(variable.name.startsWith(`${pkg.stage.id}/revisao/${b.id}/`), variable.name);
      n++;
    }
    assert.equal(n, screen.bindings.filter(x => x.type === 'STRING' && !x.static).length);
  });
  await check('properties fixas (Trailing item, Show leading item) recebem o valor direto, sem variável', () => {
    const fixed = screen.bindings.filter(x => x.static);
    assert.equal(fixed.length, 2 * screen.bindings.filter(x => x.id.endsWith('-has-next-item')).length); // 2 fixas por item
    for (const b of fixed) {
      const node = resolvePath(core, b.target.path);
      const key = Object.keys(node.componentProperties).find(k => k.split('#')[0] === b.target.property);
      assert.ok(key, `${b.id}: property ${b.target.property}`);
      assert.equal(node.componentProperties[key].value, b.default, b.id);
      assert.ok(!node.propertyBindings || !node.propertyBindings[key], `${b.id}: property fixa não pode ter variável`);
    }
  });
  await check('todo binding de visibilidade liga `visible` da camada do caminho e aplica o padrão', () => {
    for (const b of screen.bindings.filter(x => x.target.kind === 'visible')) {
      const node = resolvePath(core, b.target.path);
      const bound = node.boundVariables.visible;
      assert.ok(bound, `${b.id}: visible sem variável`);
      assert.ok(FIGMA_STATE.variablesById.get(bound.id).name.includes(`/${b.id}/`));
    }
  });
  await check('cada camada ocultável do recibo (16) tem exatamente um binding', () => {
    const layers = screen.bindings.filter(b => b.target.kind === 'visible').map(b => b.target.path.at(-1));
    assert.equal(layers.length, 16);
    assert.equal(new Set(layers).size, 16);
  });
  await check(`visibilidade resolvida confere com a matriz do contrato (${combos.length} combinações)`, () => {
    for (const [op, ctx, add] of combos) {
      const sel = selectionFor(pkg, op, ctx, add);
      const expected = expectedVisible(product, op, add);
      for (const [layer, want] of Object.entries(expected)) {
        const node = resolvePath(core, layerPath(layer));
        const got = resolveVar(FIGMA_STATE.variablesById.get(node.boundVariables.visible.id), sel);
        assert.equal(got, want, `${op}/${ctx}/${add}: ${layer} esperado ${want}, obtido ${got}`);
      }
    }
  });
  await check('modes iniciais do componente = primeiro mode de cada coleção', () => {
    for (const axis of ['operation', 'context', 'additional']) {
      const col = collectionByName(pkg.axes[axis].collection);
      assert.equal(component.explicitModes[col.id], col.modes[0].modeId);
    }
  });
  await check('reaplicar o mesmo pacote é idempotente (sem novas coleções, variáveis ou componentes)', async () => {
    const before = [FIGMA_STATE.collections.length, FIGMA_STATE.variables.length, figma.currentPage.children.length];
    await install(pkg);
    assert.deepEqual([FIGMA_STATE.collections.length, FIGMA_STATE.variables.length, figma.currentPage.children.length], before);
  });
  await check('grava no arquivo a versão do plugin junto do pacote instalado', () => {
    const recorded = JSON.parse(Object.values(FIGMA_STATE.pluginData)[0]);
    assert.match(recorded.pluginVersion, /^\d+\.\d+\.\d+$/);
    assert.equal(recorded.pluginVersion, JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'version.json'), 'utf8')).version);
    assert.equal(recorded.installs['1'].packageHash, pkg.hash);
    assert.equal(recorded.installs['1'].chassiVersion, pkg.chassiVersion);
    assert.match(figma.currentPage.children.find(n => n.type === 'COMPONENT').description, /Plugin \d+\.\d+\.\d+/);
  });
  await check('reinstalar preserva o texto e o quando-aparece editados pelo produto e completa valor que falta', async () => {
    const col = collectionByName(pkg.axes.operation.collection);
    const modeId = name => col.modes.find(m => m.name === name).modeId;
    const inCol = v => v.variableCollectionId === col.id;
    const title = FIGMA_STATE.variables.find(v => inCol(v) && v.name.includes('texto-titulo') && v.resolvedType === 'STRING');
    const flag = FIGMA_STATE.variables.find(v => inCol(v) && v.name.includes('visivel-') && v.resolvedType === 'BOOLEAN');
    const [firstMode, secondMode] = pkg.axes.operation.modes;
    const packageFlag = flag.valuesByMode[modeId(firstMode)];
    const originalTitle = title.valuesByMode[modeId(firstMode)], originalSecond = title.valuesByMode[modeId(secondMode)];
    title.valuesByMode[modeId(firstMode)] = 'Texto editado pelo produto';          // o produto edita no Figma
    flag.valuesByMode[modeId(firstMode)] = !packageFlag;                            // alguém mexe numa regra do chassi
    delete title.valuesByMode[modeId(secondMode)];                                  // valor que faltava
    const counts = [FIGMA_STATE.collections.length, FIGMA_STATE.variables.length];
    await install(pkg);
    assert.equal(title.valuesByMode[modeId(firstMode)], 'Texto editado pelo produto', 'texto do produto foi sobrescrito');
    assert.equal(flag.valuesByMode[modeId(firstMode)], !packageFlag, 'o quando-aparece decidido pelo produto foi sobrescrito');
    assert.notEqual(title.valuesByMode[modeId(secondMode)], undefined, 'valor ausente deve ser completado');
    assert.equal(title.valuesByMode[modeId(secondMode)] && JSON.stringify(title.valuesByMode[modeId(secondMode)]), JSON.stringify(originalSecond), 'o valor completado deve ser o do pacote');
    assert.deepEqual([FIGMA_STATE.collections.length, FIGMA_STATE.variables.length], counts);
    title.valuesByMode[modeId(firstMode)] = originalTitle; // devolve o estado para os testes seguintes
    flag.valuesByMode[modeId(firstMode)] = packageFlag;
  });
  // ---- verificação (só leitura): a biblioteca instalada × o pacote ----
  const has = (r, level, text) => r.findings.some(f => f.level === level && (f.where + ' ' + f.message).includes(text));
  const opCol = () => collectionByName(pkg.axes.operation.collection);
  const opVar = (fragment, type) => FIGMA_STATE.variables.find(v => v.variableCollectionId === opCol().id && v.name.includes(fragment) && v.resolvedType === type);
  await check('verificar: instalação recém-feita não tem erros nem avisos', async () => {
    const r = await verify(pkg);
    assert.equal(r.erros, 0, JSON.stringify(r.findings.slice(0, 5)));
    assert.equal(r.avisos, 0, JSON.stringify(r.findings.filter(f => f.level === 'aviso').slice(0, 5)));
  });
  await check('verificar: variável renomeada aparece como ausente e a nova como fora do pacote', async () => {
    const v = opVar('texto-titulo', 'STRING'); const name = v.name; v.name = name + '-renomeada';
    const r = await verify(pkg); v.name = name;
    assert.ok(has(r, 'erro', 'Variável ausente'), 'ausente');
    assert.ok(has(r, 'aviso', 'órfã ou renomeada'), 'órfã');
  });
  await check('verificar: quando-aparece (BOOLEAN) e texto alterados pelo produto são só informação', async () => {
    const flag = opVar('visivel-', 'BOOLEAN'), mode = opCol().modes[0].modeId, was = flag.valuesByMode[mode];
    const title = opVar('texto-titulo', 'STRING'), wasText = title.valuesByMode[mode];
    flag.valuesByMode[mode] = !was; title.valuesByMode[mode] = 'Texto do produto';
    const r = await verify(pkg); flag.valuesByMode[mode] = was; title.valuesByMode[mode] = wasText;
    assert.ok(has(r, 'info', 'o produto decidiu'), 'boolean');
    assert.equal(r.erros, 0, 'valor do produto não é erro');
    assert.ok(has(r, 'info', 'texto do produto difere'), 'texto');
    assert.equal(r.findings.filter(f => f.level === 'info' && f.message.includes('texto do produto')).length, 1);
  });
  await check('verificar: visibilidade desligada da variável e property fixa alterada são erros', async () => {
    const vis = screen.bindings.find(x => x.target.kind === 'visible'); const visNode = resolvePath(core, vis.target.path);
    const saved = visNode.boundVariables.visible; delete visNode.boundVariables.visible;
    const fixed = screen.bindings.find(x => x.static && x.target.property === 'Trailing item'); const fixedNode = resolvePath(core, fixed.target.path);
    const key = Object.keys(fixedNode.componentProperties).find(k => k.split('#')[0] === fixed.target.property);
    const was = fixedNode.componentProperties[key].value; fixedNode.componentProperties[key].value = 'Outro';
    const r = await verify(pkg); visNode.boundVariables.visible = saved; fixedNode.componentProperties[key].value = was;
    assert.ok(has(r, 'erro', 'visibilidade não está ligada'), 'visibilidade');
    assert.ok(has(r, 'erro', 'Property fixa'), 'fixa');
  });
  await check('verificar: mode removido, property pública no componente e pacote diferente do instalado', async () => {
    const col = opCol(); const removed = col.modes.pop();
    const component = figma.currentPage.children.find(n => n.type === 'COMPONENT'); component.componentPropertyDefinitions = { 'Mostrar#1:1': { type: 'BOOLEAN' } };
    const raw = FIGMA_STATE.pluginData[Object.keys(FIGMA_STATE.pluginData)[0]]; const rec = JSON.parse(raw); const key0 = Object.keys(FIGMA_STATE.pluginData)[0];
    FIGMA_STATE.pluginData[key0] = JSON.stringify({ ...rec, installs: { 1: { ...rec.installs['1'], packageHash: 'ffff' + rec.installs['1'].packageHash.slice(4) } } });
    const r = await verify(pkg);
    col.modes.push(removed); delete component.componentPropertyDefinitions; FIGMA_STATE.pluginData[key0] = raw;
    assert.ok(has(r, 'erro', 'Mode ausente'), 'mode');
    assert.ok(has(r, 'erro', 'properties públicas'), 'property pública');
    assert.ok(has(r, 'aviso', 'outro pacote'), 'hash');
  });
  await check('verificar: vínculo com o Core rompido e destino renomeado no Core são erros', async () => {
    const component = figma.currentPage.children.find(n => n.type === 'COMPONENT'); const inst = component.children.find(n => n.name === 'Chassi/revisao');
    const b = screen.bindings.find(x => x.target.kind === 'component' && x.target.path.length === 1 && !x.static);
    const node = resolvePath(core, b.target.path); const name = node.name; node.name = name + '-renomeado';
    const r1 = await verify(pkg); node.name = name;
    const main = inst._main; inst._main = { remote: false, key: 'x' };
    const r2 = await verify(pkg); inst._main = main;
    assert.ok(has(r1, 'erro', 'Destino não encontrado'), 'destino');
    assert.ok(has(r2, 'erro', 'vínculo com o Core'), 'vínculo');
  });
  await check('verificar: não altera o arquivo (só leitura)', async () => {
    const snapshot = JSON.stringify([FIGMA_STATE.variables.map(v => [v.name, v.valuesByMode]), FIGMA_STATE.pluginData]);
    await verify(pkg);
    assert.equal(JSON.stringify([FIGMA_STATE.variables.map(v => [v.name, v.valuesByMode]), FIGMA_STATE.pluginData]), snapshot);
  });
  return { figma, pkg, core };
}

(async () => {
  const H = (v, c, a) => [v, c, a];
  // INSS: 2 x 2 x 2 (todas)
  const inssCombos = []; for (const o of ['PCON', 'REFIN']) for (const c of ['desbloqueado', 'bloqueado']) for (const a of ['sem adicionais', 'portabilidade de benefício']) inssCombos.push(H(o, c, a));
  const inss = await testProduct('formalizacao-credito-consignado-inss', 'inss', inssCombos);
  await check('INSS: título, botão e "Dinheiro na conta" por Operação/Contexto', () => {
    const t = (p, sel) => resolveVar(FIGMA_STATE.variablesById.get(inss.core && resolvePath(inss.core, p).propertyBindings[Object.keys(resolvePath(inss.core, p).propertyBindings)[0]]), sel);
    assert.equal(t(['Navigation header'], selectionFor(inss.pkg, 'REFIN', 'desbloqueado', 'sem adicionais')), 'Revise as condições do seu refinanciamento');
    assert.equal(t(['Navigation header'], selectionFor(inss.pkg, 'PCON', 'bloqueado', 'sem adicionais')), 'Revise as condições do seu empréstimo');
    assert.equal(t(['Fixed button', 'Primary'], selectionFor(inss.pkg, 'PCON', 'desbloqueado', 'sem adicionais')), 'Continuar');
    assert.equal(t(['item-dinheiro-conta', 'Label 02'], selectionFor(inss.pkg, 'PCON', 'desbloqueado', 'sem adicionais')), 'Até 12 de fevereiro de 2026');
    assert.equal(t(['item-dinheiro-conta', 'Label 02'], selectionFor(inss.pkg, 'REFIN', 'bloqueado', 'sem adicionais')), 'Após o desbloqueio do benefício');
    assert.equal(t(['section-portabilidade'], selectionFor(inss.pkg, 'PCON', 'desbloqueado', 'portabilidade de benefício')), 'Portabilidade de benefício');
  });

  // OP: 4 x 6 x 4 completas, com a combinação inválida incluída
  const opCombos = []; for (const o of ['PCON', 'REFIN', 'Port Ataque Saldo', 'Port Ataque Refin']) for (const c of ['Cl1', 'Cl2', 'Cl2.1', 'GOV.SP', 'Cl4', 'Cl5']) for (const a of ['sem adicionais', 'seguro', 'port salário', 'seguro+port']) opCombos.push(H(o, c, a));
  const op = await testProduct('formalizacao-credito-consignado-op', 'op', opCombos);
  await check('OP: combinação inválida (Port Ataque + adicional) deixa overlay e regra visíveis; sem adicional, só o overlay', () => {
    const val = (l, o, a) => resolveVar(FIGMA_STATE.variablesById.get(resolvePath(op.core, layerPath(l)).boundVariables.visible.id), selectionFor(op.pkg, o, 'Cl1', a));
    for (const o of ['Port Ataque Saldo', 'Port Ataque Refin']) {
      assert.equal(val('overlay-operacao-nao-utilizada', o, 'seguro'), true);
      assert.equal(val('wrapper-rule-operacao-sem-revisao', o, 'seguro'), true);
      assert.equal(val('overlay-operacao-nao-utilizada', o, 'sem adicionais'), true);
      assert.equal(val('wrapper-rule-operacao-sem-revisao', o, 'sem adicionais'), false);
    }
    assert.equal(val('overlay-operacao-nao-utilizada', 'PCON', 'seguro'), false);
  });
  await check('OP: textos por Operação (título, botão, saldo, tabela, seção)', () => {
    const t = (p, o, a = 'sem adicionais') => { const n = resolvePath(op.core, p); return resolveVar(FIGMA_STATE.variablesById.get(Object.values(n.propertyBindings)[0]), selectionFor(op.pkg, o, 'Cl1', a)); };
    assert.equal(t(['Navigation header'], 'Port Ataque Refin'), 'Compare condições para a sua portabilidade');
    assert.equal(t(['Fixed button', 'Primary'], 'Port Ataque Saldo'), 'Voltar');
    assert.equal(t(['item-saldo-refinanciar', 'Label 01'], 'Port Ataque Refin'), 'Saldo a ser portado');
    assert.equal(t(['item-saldo-refinanciar', 'Label 01'], 'REFIN'), 'Saldo a refinanciar');
    assert.equal(t(['body-linha-2-col-valor-1'], 'Port Ataque Refin'), 'R$ 857,73');
    assert.equal(t(['body-header-row-col-label'], 'Port Ataque Refin'), 'Condições no Banco');
    assert.equal(t(['section-seguro'], 'PCON', 'seguro'), 'Seguro do Consignado');
    assert.equal(t(['item-periodo', 'Label 02'], 'Port Ataque Refin'), 'Dezembro de 2024 a Dezembro de 2028');
  });

  console.log('\nFalhas esperadas (o instalador deve recusar)');
  await check('chave do Core inexistente/errada é recusada antes de qualquer escrita', async () => {
    const figma = makeFigma(); FIGMA_STATE.masters = new Map();
    const { packages, install, verify, plan } = loadPlugin(figma);
    await assert.rejects(() => install(packages[0]), /componente Core publicado indisponível/);
    assert.equal(FIGMA_STATE.collections.length + FIGMA_STATE.variables.length, 0);
  });
  await check('camada ocultável ausente no Core falha', async () => {
    await assert.rejects(() => installFresh('formalizacao-credito-consignado-op', c => { c.findOne(n => n.name === 'secao-seguro').remove(); }), /secao-seguro ausente ou ambígua|section-seguro ausente|seg-parcelas ausente ou ambíguo/);
  });
  await check('nome de item duplicado no Core falha como ambíguo', async () => {
    await assert.rejects(() => installFresh('formalizacao-credito-consignado-op', c => {
      const dup = c.findOne(n => n.name === 'item-cet'); dup.parent.add(item('item-cet'));
    }), /item-cet ausente ou ambíguo/);
  });
  await check('LACUNA: falha de caminho ocorre depois de criar coleções/variáveis (sem rollback)', async () => {
    FIGMA_STATE.masters = new Map();
    let failed = false;
    try { await installFresh('formalizacao-credito-consignado-op', c => { c.findOne(n => n.name === 'banner-port-atq').remove(); }); } catch { failed = true; }
    assert.ok(failed);
    // O comportamento atual deixa 3 coleções e variáveis órfãs; o teste registra isso em vez de exigir o contrário.
    console.log(`       (registro) coleções restantes: ${FIGMA_STATE.collections.length}, variáveis: ${FIGMA_STATE.variables.length}, componentes na página: 0`);
    assert.equal(FIGMA_STATE.collections.length, 3);
  });
  await check('LACUNA: sem skipInvisibleInstanceChildren=false o instalador não alcançaria camadas ocultas', async () => {
    // o instalador liga a flag sozinho; aqui só confirmamos que o simulador reproduz o efeito quando ela está ligada
    const core = buildCore(); FIGMA_STATE.skipInvisibleInstanceChildren = true;
    const inst1 = core.createInstance();
    assert.equal(inst1.findAll(n => n.name === 'overlay-operacao-nao-utilizada').length, 0);
    FIGMA_STATE.skipInvisibleInstanceChildren = false;
    assert.equal(inst1.findAll(n => n.name === 'overlay-operacao-nao-utilizada').length, 1);
  });

  // ---- regra de migração: mesma versão maior atualiza no lugar; versão maior nova instala ao lado ----
  console.log('\nmigração (regra de versão do chassi)');
  const clone = o => JSON.parse(JSON.stringify(o));
  const ID = 'formalizacao-credito-consignado-op';
  const registryOf = () => JSON.parse(FIGMA_STATE.pluginData[Object.keys(FIGMA_STATE.pluginData)[0]]);
  const componentsOf = figma => figma.currentPage.children.filter(n => n.type === 'COMPONENT');
  const rejects = async (fn, re) => { let err; try { await fn(); } catch (e) { err = e; } assert.ok(err && re.test(err.message), `esperava erro ${re}; veio ${err && err.message}`); };
  await check('mesma versão e mesma estrutura: reaplica sem pedir confirmação; estrutura mudou sem subir a versão: recusa', async () => {
    const { pkg, install, plan } = await installFresh(ID);
    assert.equal((await plan(pkg)).kind, 'igual');
    assert.equal((await plan(pkg)).needsConfirmation, false);
    await install(pkg);
    const changed = clone(pkg); changed.structureHash = 'x'.repeat(64);
    await rejects(() => install(changed), /estrutura do pacote mudou sem subir a versão/);
  });
  await check('mudança só de texto inicial (mesma estrutura) não bloqueia a reinstalação', async () => {
    const { pkg, install, plan } = await installFresh(ID);
    const texts = clone(pkg); texts.hash = 'y'.repeat(64); // hash muda, structureHash igual
    assert.equal((await plan(texts)).kind, 'igual');
    await install(texts);
  });
  await check('versão menor acima (1.0 → 1.1): pede confirmação, atualiza no lugar, cria só o que falta e preserva o texto do produto', async () => {
    const { figma, pkg, install, plan } = await installFresh(ID);
    const col = collectionByName(pkg.axes.operation.collection);
    const title = FIGMA_STATE.variables.find(v => v.variableCollectionId === col.id && v.name.includes('texto-titulo') && v.resolvedType === 'STRING');
    const firstMode = col.modes[0].modeId; title.valuesByMode[firstMode] = 'Texto editado pelo produto';
    const next = clone(pkg); next.chassiVersion = '1.1'; next.structureHash = 'a'.repeat(64);
    const base = next.screens[0].bindings.find(b => b.type === 'STRING' && !b.static && b.target.kind === 'component');
    next.screens[0].bindings.push({ ...clone(base), id: 'texto-extra-1-1', operation: undefined, default: 'novo' });
    const decision = await plan(next);
    assert.equal(decision.kind, 'atualizar'); assert.equal(decision.needsConfirmation, true); assert.match(decision.message, /1\.0 → 1\.1/);
    const before = { components: componentsOf(figma).length, variables: FIGMA_STATE.variables.length, collections: FIGMA_STATE.collections.length };
    await rejects(() => install(next), /Confirmação necessária/);
    assert.equal(FIGMA_STATE.variables.length, before.variables, 'sem confirmação não pode escrever');
    await install(next, { confirmed: true });
    assert.equal(componentsOf(figma).length, before.components, 'atualização no lugar não cria componente');
    assert.equal(FIGMA_STATE.variables.length, before.variables + 1, 'só a variável nova');
    assert.equal(title.valuesByMode[firstMode], 'Texto editado pelo produto');
    assert.equal(registryOf().installs['1'].chassiVersion, '1.1');
    assert.equal(FIGMA_STATE.collections.length, before.collections);
  });
  await check('versão maior nova (1.x → 2.0): pede confirmação e instala um componente /v2 ao lado, sem apagar nada', async () => {
    const { figma, pkg, install, plan, verify } = await installFresh(ID);
    const next = clone(pkg); next.chassiVersion = '2.0'; next.structureHash = 'b'.repeat(64);
    const decision = await plan(next);
    assert.equal(decision.kind, 'nova-major'); assert.equal(decision.needsConfirmation, true);
    const before = { variables: FIGMA_STATE.variables.length, ids: componentsOf(figma).map(n => n.id) };
    await rejects(() => install(next), /Confirmação necessária/);
    const col = collectionByName(pkg.axes.operation.collection), mode = col.modes[0].modeId;
    const flag = FIGMA_STATE.variables.find(v => v.variableCollectionId === col.id && v.name.includes('visivel-') && v.resolvedType === 'BOOLEAN');
    const decided = !flag.valuesByMode[mode]; flag.valuesByMode[mode] = decided; // o produto decide, ainda na v1
    await install(next, { confirmed: true });
    assert.equal(flag.valuesByMode[mode], decided, 'o que o produto decidiu na v1 vale na v2');
    const names = componentsOf(figma).map(n => n.name);
    assert.equal(names.length, 2);
    assert.ok(names.some(n => n.endsWith('/revisao/v1')) && names.some(n => n.endsWith('/revisao/v2')), names.join(' | '));
    for (const id of before.ids) assert.ok(componentsOf(figma).some(n => n.id === id), 'componente antigo deve continuar');
    const stringVars = FIGMA_STATE.variables.filter(v => v.resolvedType === 'STRING').length;
    assert.equal(FIGMA_STATE.variables.length, before.variables, 'a versão nova reaproveita as variáveis: texto e quando-aparece são do produto');
    assert.equal(FIGMA_STATE.variables.filter(v => v.resolvedType === 'STRING').length, stringVars, 'textos do produto são compartilhados');
    const reg = registryOf(); assert.deepEqual(Object.keys(reg.installs).sort(), ['1', '2']);
    assert.equal(reg.installs['1'].chassiVersion, '1.0');
    // As duas versões maiores usam as mesmas variáveis: a verificação de cada uma segue limpa.
    for (const target of [pkg, next]) {
      const r = await verify(target);
      assert.equal(r.erros, 0, JSON.stringify(r.findings.filter(f => f.level === 'erro').slice(0, 3)));
      assert.equal(r.avisos, 0, `v${target.chassiVersion}: ` + JSON.stringify(r.findings.filter(f => f.level === 'aviso').slice(0, 3)));
    }
  });
  await check('pacote mais antigo que o instalado é recusado, inclusive versão maior anterior', async () => {
    const { pkg, install } = await installFresh(ID);
    const up = clone(pkg); up.chassiVersion = '2.0'; up.structureHash = 'c'.repeat(64); await install(up, { confirmed: true });
    const old = clone(pkg); old.chassiVersion = '1.5'; old.structureHash = 'd'.repeat(64);
    await rejects(() => install(old, { confirmed: true }), /mais antigo/);
    const minorDown = clone(up); minorDown.chassiVersion = '2.0'; minorDown.structureHash = 'e'.repeat(64);
    await rejects(() => install(minorDown), /estrutura do pacote mudou sem subir/);
  });
  await check('registro de plugin antigo (sem versão de chassi) é recusado com mensagem clara', async () => {
    const { pkg, install } = await installFresh(ID);
    const key = Object.keys(FIGMA_STATE.pluginData)[0];
    FIGMA_STATE.pluginData[key] = JSON.stringify({ schemaVersion: 2, packageId: pkg.id, packageHash: pkg.hash, components: {} });
    await rejects(() => install(pkg), /sem versão de chassi/);
  });

  console.log(`\n${passed} verificações passaram${process.exitCode ? '; HÁ FALHAS.' : '.'}`);
})();
