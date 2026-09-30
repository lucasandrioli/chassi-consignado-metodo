/* O build incorpora pacotes locais. Este plugin roda na biblioteca do produto. */
const PACKAGES = __PACKAGE_JSON__;
const PLUGIN_VERSION = __PLUGIN_VERSION__;
const LIBRARY_KEY = 'consignadoChassi:productLibraryV1';
const AXES = ['operation', 'context', 'additional'];

function insist(value, message) { if (!value) throw new Error(message); }
function send(type, data = {}) { figma.ui.postMessage({ type, ...data }); }
function packageById(id) { return PACKAGES.find(pkg => pkg.id === id); }
function chassiVersionOf(pkg) {
  const m = /^(\d+)\.(\d+)$/.exec(pkg.chassiVersion || '');
  insist(m, `${pkg.id}: pacote sem versão de chassi válida.`);
  return { major: Number(m[1]), minor: Number(m[2]) };
}
// A versão maior do chassi faz parte do nome: uma versão maior nova instala um componente ao lado do antigo.
function componentName(pkg, screen) { return `Etapa/${pkg.stage.id}/${pkg.product.id}/${screen.id}/v${chassiVersionOf(pkg).major}`; }
function variableName(pkg, screen, binding, axis) {
  // O Figma aceita separadores de grupo, espaços e acentos, mas rejeita
  // pontuação de IDs semânticos como ponto e ponto médio no nome da variável.
  // Texto e quando cada bloco aparece são do produto e valem para todas as versões maiores: o nome da variável não leva a versão.
  return `${pkg.stage.id}/${screen.id}/${binding.id.replace(/[.·]/g, '-')}/${axis}`;
}

async function coreMaster(screen) {
  let master;
  try { master = await figma.importComponentByKeyAsync(screen.coreKey); }
  catch { throw new Error(`${screen.name}: componente Core publicado indisponível.`); }
  insist(master && master.remote && master.key === screen.coreKey,
    `${screen.name}: chave do Core não corresponde à biblioteca publicada.`);
  return master;
}

async function nestedCore(component, screen) {
  const nested = component.findAllWithCriteria({ types: ['INSTANCE'] })
    .filter(node => node.name === `Chassi/${screen.id}`);
  insist(nested.length === 1, `${screen.name}: instância do Core ausente ou duplicada.`);
  const main = await nested[0].getMainComponentAsync();
  insist(main && main.remote && main.key === screen.coreKey,
    `${screen.name}: vínculo com o Core publicado foi rompido.`);
  return nested[0];
}

function setCoreProperties(instance, values, screen) {
  if (!values) return;
  const names = Object.keys(instance.componentProperties);
  const update = {};
  for (const [label, value] of Object.entries(values)) {
    const matches = names.filter(name => name.split('#')[0] === label);
    insist(matches.length === 1, `${screen.name}: property ${label} ausente ou ambígua no Core.`);
    update[matches[0]] = value;
  }
  instance.setProperties(update);
}

function propKey(instance, label, screen) {
  const matches = Object.keys(instance.componentProperties).filter(name => name.split('#')[0] === label);
  insist(matches.length === 1, `${screen.name}: property ${label} ausente ou ambígua.`);
  return matches[0];
}
function targetOf(core, binding, screen) {
  const t = binding.target;
  if (t.kind === 'core') return { node: core, property: propKey(core, t.name, screen) };
  const parent = t.within ? exactDescendant(core, 'SLOT', t.within, screen.name) : core;
  if (t.kind === 'component') {
    const node = t.path
      ? resolveInstancePath(parent, t.path, screen.name)
      : exactDescendant(parent, 'INSTANCE', t.name, screen.name);
    return { node, property: propKey(node, t.property, screen) };
  }
  if (t.kind === 'text') return { node: exactDescendant(parent, 'TEXT', t.name, screen.name) };
  if (t.kind === 'visible') return {
    node: t.path ? resolveNodePath(parent, t.path, screen.name) : exactDescendant(parent, 'INSTANCE', t.name, screen.name),
    visibility: true };
  throw new Error(`${screen.name}: destino de binding inválido.`);
}
async function loadTextFonts(node) {
  const segments = node.getStyledTextSegments(['fontName']);
  for (const segment of segments) if (segment.fontName && segment.fontName !== figma.mixed)
    await figma.loadFontAsync(segment.fontName);
  if (!segments.length && node.fontName !== figma.mixed) await figma.loadFontAsync(node.fontName);
}
async function ensureAxes(pkg) {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const result = {};
  for (const axis of AXES) {
    const spec = pkg.axes[axis];
    const matches = existing.filter(c => c.name === spec.collection);
    insist(matches.length <= 1, `Coleção ${spec.collection} duplicada.`);
    const collection = matches[0] || figma.variables.createVariableCollection(spec.collection);
    if (!matches[0]) collection.renameMode(collection.modes[0].modeId, spec.modes[0]);
    const extras = collection.modes.filter(m => !spec.modes.includes(m.name));
    insist(!extras.length, `${spec.collection}: modos imprevistos: ${extras.map(m => m.name).join(', ')}.`);
    for (const name of spec.modes) if (!collection.modes.some(m => m.name === name)) collection.addMode(name);
    result[axis] = { collection, modes: Object.fromEntries(collection.modes.map(m => [m.name, m.modeId])) };
  }
  return result;
}
async function ensureVariables(pkg, sets) {
  const locals = await figma.variables.getLocalVariablesAsync();
  const existing = new Map(locals.map(v => [`${v.variableCollectionId}:${v.name}`, v]));
  const result = new Map();
  result.preserved = 0;
  for (const screen of pkg.screens) for (const binding of screen.bindings) {
    if (binding.static) continue; // property fixa: sem variável
    let previous = null;
    for (const axis of AXES) {
      if (axis !== 'operation' && !binding[axis]) continue;
      const set = sets[axis];
      const name = variableName(pkg, screen, binding, axis);
      const id = `${set.collection.id}:${name}`;
      let variable = existing.get(id);
      const isNew = !variable;
      if (isNew) {
        variable = figma.variables.createVariable(name, set.collection, binding.type);
        existing.set(id, variable);
      }
      insist(variable.resolvedType === binding.type, `${name}: tipo incompatível.`);
      variable.scopes = binding.type === 'STRING' ? ['TEXT_CONTENT'] : ['ALL_SCOPES'];
      // Os valores pertencem ao produto (texto e quando cada bloco aparece): em variável que já existe, valor já
      // preenchido é preservado e só se completa o que falta. O pacote dá o valor inicial.
      const keepContent = !isNew;
      for (const mode of pkg.axes[axis].modes) {
        if (keepContent && variable.valuesByMode[set.modes[mode]] !== undefined) { result.preserved += 1; continue; }
        const hasOverride = binding[axis] && Object.prototype.hasOwnProperty.call(binding[axis], mode);
        const value = hasOverride ? binding[axis][mode] : previous
          ? figma.variables.createVariableAlias(previous) : binding.default;
        variable.setValueForMode(set.modes[mode], value);
      }
      previous = variable;
    }
    result.set(`${screen.id}/${binding.id}`, previous);
  }
  return result;
}
async function ensureExtensions(core, screen, extensionMasters) {
  for (const spec of screen.extensions || []) {
    const slot = exactDescendant(core, 'SLOT', spec.within, screen.name);
    const matches = slot.findAllWithCriteria({ types: ['INSTANCE'] }).filter(n => n.name === spec.name);
    insist(matches.length <= 1, `${screen.name}: extensão ${spec.name} duplicada.`);
    if (matches.length) continue;
    const master = extensionMasters.get(spec.componentKey);
    const node = master.createInstance();
    slot.appendChild(node);
    node.name = spec.name;
    node.layoutSizingHorizontal = 'FILL';
  }
}
async function bindScreen(core, screen, variables, extensionMasters) {
  await ensureExtensions(core, screen, extensionMasters);
  // Properties fixas primeiro: uma variante ligada a variável (por exemplo Trailing item) impede escrever nos textos aninhados do item.
  for (const binding of screen.bindings.filter(b => b.static)) {
    const target = targetOf(core, binding, screen);
    insist(target.property, `${screen.name}: property fixa sem property de componente.`);
    target.node.setProperties({ [target.property]: binding.default });
  }
  for (const binding of screen.bindings.filter(b => b.type === 'STRING' && !b.static)) {
    const variable = variables.get(`${screen.id}/${binding.id}`);
    const target = targetOf(core, binding, screen);
    if (target.property) target.node.setProperties({ [target.property]: figma.variables.createVariableAlias(variable) });
    else { await loadTextFonts(target.node); target.node.setBoundVariable('characters', variable); }
  }
  for (const binding of screen.bindings.filter(b => b.type === 'BOOLEAN' && !b.static)) {
    const variable = variables.get(`${screen.id}/${binding.id}`);
    const target = targetOf(core, binding, screen);
    if (target.visibility) {
      target.node.visible = binding.default;
      target.node.setBoundVariable('visible', variable);
    }
    else {
      insist(target.property, `${screen.name}: boolean sem property de componente.`);
      target.node.setProperties({ [target.property]: figma.variables.createVariableAlias(variable) });
    }
  }
}

// Registro no arquivo: { installs: { "<versão maior>": { chassiVersion, packageHash, structureHash, ... } } }.
function readRegistry(raw) {
  if (!raw) return null;
  let registry;
  try { registry = JSON.parse(raw); } catch { throw new Error('Registro da biblioteca ilegível.'); }
  insist(registry.installs && typeof registry.installs === 'object',
    'Instalação anterior sem versão de chassi (plugin antigo). Use um arquivo novo ou migre manualmente.');
  return registry;
}
// Decide o que a instalação significa: nova, igual, atualização no lugar (mesma versão maior) ou versão maior nova ao lado.
function decideInstall(pkg, registry) {
  const to = chassiVersionOf(pkg);
  if (!registry) return { kind: 'nova', to: pkg.chassiVersion, needsConfirmation: false };
  insist(registry.packageId === pkg.id, `Este arquivo já foi preparado para ${registry.packageId}.`);
  const majors = Object.keys(registry.installs).map(Number).sort((a, b) => b - a);
  const latest = registry.installs[majors[0]];
  const from = chassiVersionOf({ id: pkg.id, chassiVersion: latest.chassiVersion });
  const fromText = latest.chassiVersion;
  if (to.major < from.major) throw new Error(`O arquivo já tem o chassi ${fromText}; o pacote é ${pkg.chassiVersion} (mais antigo). Nada foi alterado.`);
  if (to.major > from.major) return { kind: 'nova-major', from: fromText, to: pkg.chassiVersion, needsConfirmation: true };
  const current = registry.installs[to.major];
  if (to.minor < from.minor) throw new Error(`O arquivo já tem o chassi ${fromText}; o pacote é ${pkg.chassiVersion} (mais antigo). Nada foi alterado.`);
  if (to.minor > from.minor) return { kind: 'atualizar', from: fromText, to: pkg.chassiVersion, needsConfirmation: true };
  insist(current.structureHash === pkg.structureHash,
    `A estrutura do pacote mudou sem subir a versão do chassi (${pkg.chassiVersion}). Suba a versão no contrato e gere o pacote de novo.`);
  return { kind: 'igual', from: fromText, to: pkg.chassiVersion, needsConfirmation: false };
}
async function planInstall(pkg) {
  insist(pkg, 'Pacote não encontrado.');
  const decision = decideInstall(pkg, readRegistry(figma.root.getPluginData(LIBRARY_KEY)));
  if (decision.kind === 'atualizar') {
    const report = await verifyProductLibrary(pkg);
    decision.pending = report.erros;
    decision.message = `Atualizar o chassi ${decision.from} → ${decision.to} no lugar. ${report.erros} diferenças a aplicar (variáveis, ligações e regras que faltam ou divergem do pacote). Nada será apagado; os textos do produto são preservados.`;
  } else if (decision.kind === 'nova-major') {
    decision.message = `Instalar o chassi ${decision.to} ao lado da ${decision.from}. O componente da versão anterior continua no arquivo; o designer troca as instâncias conforme o guia de migração. Nada será apagado.`;
  } else decision.message = decision.kind === 'nova' ? `Primeira instalação do chassi ${decision.to}.` : `Reaplicar o chassi ${decision.to} (sem mudança de estrutura).`;
  return decision;
}

async function installProductLibrary(pkg, options = {}) {
  insist(pkg, 'Pacote não encontrado.');
  // Filhos ocultos de instâncias (por exemplo, o texto do supporting item com o item desligado) precisam ser alcançáveis.
  figma.skipInvisibleInstanceChildren = false;
  const priorRaw = figma.root.getPluginData(LIBRARY_KEY);
  const registry = readRegistry(priorRaw);
  const decision = decideInstall(pkg, registry);
  insist(!decision.needsConfirmation || options.confirmed, `Confirmação necessária: ${decision.kind === 'atualizar' ? 'atualização no lugar' : 'versão maior nova ao lado'}.`);
  const page = figma.currentPage;
  const existing = page.findAllWithCriteria({ types: ['COMPONENT'] });
  const planned = [];
  const extensionMasters = new Map();
  for (const screen of pkg.screens) {
    const matches = existing.filter(node => node.name === componentName(pkg, screen));
    insist(matches.length <= 1, `${screen.name}: componente de produto duplicado.`);
    if (matches[0]) {
      insist(priorRaw, `${screen.name}: componente preexistente sem registro do plugin; revisão necessária.`);
      await nestedCore(matches[0], screen);
    }
    const core = await coreMaster(screen);
    for (const binding of screen.bindings.filter(b => b.target.kind === 'core')) {
      const matches = Object.entries(core.componentPropertyDefinitions)
        .filter(([name]) => name.split('#')[0] === binding.target.name);
      insist(matches.length === 1 && matches[0][1].type === (binding.type === 'STRING' ? 'TEXT' : 'BOOLEAN'),
        `${screen.name}: property Core incompatível: ${binding.target.name}.`);
    }
    for (const spec of screen.extensions || []) if (!extensionMasters.has(spec.componentKey)) {
      let master;
      try { master = await figma.importComponentByKeyAsync(spec.componentKey); }
      catch { throw new Error(`${screen.name}: componente IDS da extensão ${spec.name} indisponível.`); }
      insist(master?.remote && master.key === spec.componentKey,
        `${screen.name}: chave IDS da extensão ${spec.name} incompatível.`);
      extensionMasters.set(spec.componentKey, master);
    }
    planned.push({ screen, core, existing: matches[0] || null });
  }
  // Todas as chaves e properties Core são conferidas antes de qualquer escrita.
  const sets = await ensureAxes(pkg);
  const variables = await ensureVariables(pkg, sets);
  const created = [];
  const result = [];
  try {
    let x = page.children.reduce((end, node) => Math.max(end, node.x + node.width + 80), 80);
    for (const { screen, core, existing: component } of planned) {
      let product = component;
      if (!product) {
        product = figma.createComponent();
        page.appendChild(product);
        product.name = componentName(pkg, screen);
        product.layoutMode = 'VERTICAL';
        product.resize(core.width, Math.max(core.height, 1));
        product.primaryAxisSizingMode = 'AUTO';
        product.counterAxisSizingMode = 'FIXED';
        const instance = core.createInstance();
        product.appendChild(instance);
        instance.name = `Chassi/${screen.id}`;
        instance.layoutSizingHorizontal = 'FILL';
        product.x = x; product.y = 80;
        x += Math.max(product.width, 320) + 80;
        created.push(product);
      }
      const instance = await nestedCore(product, screen);
      await bindScreen(instance, screen, variables, extensionMasters);
      for (const axis of AXES) {
        const set = sets[axis];
        product.setExplicitVariableModeForCollection(set.collection, set.modes[pkg.axes[axis].modes[0]]);
      }
      product.primaryAxisSizingMode = 'AUTO';
      product.counterAxisSizingMode = 'FIXED';
      product.description = `${screen.name} · ${pkg.stage.name} · ${pkg.product.id}. Receita sintética dos contratos da fundação. Chassi ${pkg.chassiVersion}. Core ${screen.coreKey}. Pacote ${pkg.hash}. Plugin ${PLUGIN_VERSION}.`;
      result.push({ screenId: screen.id, nodeId: product.id, key: product.key, reused: !!component });
      send('progress', { message: `Conteúdo e bindings: ${screen.name} (${result.length}/${planned.length})…` });
    }
    page.selection = result.map(item => page.findOne(node => node.id === item.nodeId)).filter(Boolean);
    if (page.selection.length) figma.viewport.scrollAndZoomIntoView(page.selection);
    const installs = { ...(registry ? registry.installs : {}) };
    installs[chassiVersionOf(pkg).major] = {
      chassiVersion: pkg.chassiVersion, packageHash: pkg.hash, structureHash: pkg.structureHash,
      stageVersion: pkg.stage.version, productVersion: pkg.product.version,
      components: Object.fromEntries(result.map(item => [item.screenId, item.nodeId]))
    };
    figma.root.setPluginData(LIBRARY_KEY, JSON.stringify({ schemaVersion: 3, pluginVersion: PLUGIN_VERSION, packageId: pkg.id, installs }));
  } catch (error) {
    for (const component of created) if (!component.removed) component.remove();
    throw error;
  }
  send('installed', { pluginVersion: PLUGIN_VERSION, packageId: pkg.id, count: result.length, variableCount: variables.size, preservedValues: variables.preserved, components: result });
}

figma.showUI(__html__, { width: 420, height: 620, themeColors: true });
figma.ui.onmessage = async message => {
  try {
    if (message.type === 'ready') {
      send('catalog', { pluginVersion: PLUGIN_VERSION, packages: PACKAGES.map(pkg => ({
        id: pkg.id, stage: pkg.stage.name, product: pkg.product.id, productVersion: pkg.product.version, chassiVersion: pkg.chassiVersion,
        hash: pkg.hash.slice(0, 8), count: pkg.screens.length, state: pkg.state
      })) });
      return;
    }
    if (message.type === 'plan') send('plan', { plan: await planInstall(packageById(message.packageId)) });
    else if (message.type === 'install') await installProductLibrary(packageById(message.packageId), { confirmed: message.confirmed === true });
    else if (message.type === 'verify') send('verified', { report: await verifyProductLibrary(packageById(message.packageId)) });
    else throw new Error('Comando desconhecido.');
  } catch (error) { send('error', { message: error instanceof Error ? error.message : String(error) }); }
};
