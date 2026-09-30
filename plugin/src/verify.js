/* Verificação: compara a biblioteca instalada com o pacote. Só lê; nunca altera o arquivo.
 * Níveis: 'erro' = viola o chassi (variável ausente, ligação, property fixa, estrutura); 'aviso' = deriva ou item fora do pacote;
 * 'info' = valor que pertence ao produto (texto, quando um bloco aparece) e difere do valor inicial (esperado). */

function bindingAxes(binding) { return AXES.filter(axis => axis === 'operation' || binding[axis]); }
function expectedValue(binding, axis, mode, previous) {
  const has = binding[axis] && Object.prototype.hasOwnProperty.call(binding[axis], mode);
  if (has) return { literal: binding[axis][mode] };
  return previous ? { alias: previous } : { literal: binding.default };
}
const sameLiteral = (a, b) => a === b;

async function verifyProductLibrary(pkg) {
  const findings = [];
  const add = (level, where, message) => findings.push({ level, where, message });
  insist(pkg, 'Pacote não encontrado.');
  figma.skipInvisibleInstanceChildren = false;

  // 1. Registro da instalação
  const raw = figma.root.getPluginData(LIBRARY_KEY);
  if (!raw) add('erro', 'registro', 'Este arquivo não tem registro de instalação do plugin.');
  else {
    let prior = null;
    try { prior = readRegistry(raw); } catch (error) { add('erro', 'registro', error.message); }
    if (prior) {
      const installed = prior.installs[chassiVersionOf(pkg).major];
      if (prior.packageId !== pkg.id) add('erro', 'registro', `O arquivo foi preparado para ${prior.packageId}, não para ${pkg.id}.`);
      else if (!installed) add('erro', 'registro', `Não há instalação do chassi ${pkg.chassiVersion} neste arquivo.`);
      else {
        if (installed.chassiVersion !== pkg.chassiVersion) add('aviso', 'registro', `Instalado o chassi ${installed.chassiVersion}; o pacote é ${pkg.chassiVersion}.`);
        if (installed.packageHash !== pkg.hash) add('aviso', 'registro', `Instalado com outro pacote (${String(installed.packageHash).slice(0, 8)}); o pacote atual é ${pkg.hash.slice(0, 8)}.`);
      }
      if (prior.pluginVersion && prior.pluginVersion !== PLUGIN_VERSION)
        add('info', 'registro', `Instalado pelo plugin ${prior.pluginVersion}; o plugin atual é ${PLUGIN_VERSION}.`);
    }
  }

  // 2. Coleções e modes
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const locals = await figma.variables.getLocalVariablesAsync();
  const sets = {};
  for (const axis of AXES) {
    const spec = pkg.axes[axis];
    const found = collections.filter(c => c.name === spec.collection);
    if (found.length !== 1) { add('erro', spec.collection, found.length ? 'Coleção duplicada.' : 'Coleção ausente.'); continue; }
    const collection = found[0];
    const names = collection.modes.map(m => m.name);
    for (const name of spec.modes) if (!names.includes(name)) add('erro', spec.collection, `Mode ausente: ${name}.`);
    for (const name of names) if (!spec.modes.includes(name)) add('erro', spec.collection, `Mode imprevisto: ${name}.`);
    sets[axis] = { collection, modes: Object.fromEntries(collection.modes.map(m => [m.name, m.modeId])) };
  }
  const byKey = new Map(locals.map(v => [`${v.variableCollectionId}:${v.name}`, v]));
  const expectedVariableIds = new Set();

  // 3. Variáveis esperadas e valores
  const finalVariable = new Map(); // tela/binding -> variável que a property ou a camada deve usar
  for (const screen of pkg.screens) for (const binding of screen.bindings) {
    if (binding.static) continue;
    let previous = null;
    for (const axis of bindingAxes(binding)) {
      const set = sets[axis];
      if (!set) continue;
      const name = variableName(pkg, screen, binding, axis);
      const variable = byKey.get(`${set.collection.id}:${name}`);
      if (!variable) { add('erro', name, 'Variável ausente (renomeada ou apagada).'); previous = null; continue; }
      expectedVariableIds.add(variable.id);
      if (variable.resolvedType !== binding.type) add('erro', name, `Tipo ${variable.resolvedType}, esperado ${binding.type}.`);
      for (const mode of pkg.axes[axis].modes) {
        const modeId = set.modes[mode];
        const actual = variable.valuesByMode[modeId];
        const want = expectedValue(binding, axis, mode, previous);
        if (actual === undefined) { add('erro', name, `Sem valor no mode ${mode}.`); continue; }
        if (want.alias) {
          if (!(actual && actual.type === 'VARIABLE_ALIAS' && actual.id === want.alias.id))
            add(binding.type === 'BOOLEAN' ? 'info' : 'aviso', name, `No mode ${mode} o valor não aponta para a variável de Operação (o produto pode ter definido outro).`);
        } else if (actual && actual.type === 'VARIABLE_ALIAS') {
          add('info', name, `No mode ${mode} o valor virou alias; o pacote define um valor inicial.`);
        } else if (!sameLiteral(actual, want.literal)) {
          add('info', name, binding.type === 'BOOLEAN'
            ? `Mode ${mode}: o produto decidiu ${actual}; o valor inicial do pacote é ${want.literal}.`
            : `Mode ${mode}: texto do produto difere do valor inicial.`);
        }
      }
      previous = variable;
    }
    finalVariable.set(`${screen.id}/${binding.id}`, previous);
  }

  // 4. Variáveis fora do pacote (órfãs ou renomeadas)
  for (const axis of AXES) {
    const set = sets[axis];
    if (!set) continue;
    for (const variable of locals.filter(v => v.variableCollectionId === set.collection.id))
      if (!expectedVariableIds.has(variable.id)) add('aviso', variable.name, `Variável fora do pacote em ${set.collection.name} (órfã ou renomeada).`);
  }

  // 5. Componentes do produto, vínculo com o Core e ligações
  const page = figma.currentPage;
  const components = page.findAllWithCriteria({ types: ['COMPONENT'] });
  for (const screen of pkg.screens) {
    const where = screen.name;
    const matches = components.filter(node => node.name === componentName(pkg, screen));
    if (matches.length !== 1) { add('erro', where, matches.length ? 'Componente do produto duplicado.' : 'Componente do produto ausente nesta página.'); continue; }
    const component = matches[0];
    if (Object.keys(component.componentPropertyDefinitions || {}).length)
      add('erro', where, 'O componente do produto tem properties públicas; o designer não pode ver interruptores.');
    let instance;
    try { instance = await nestedCore(component, screen); } catch (error) { add('erro', where, error.message); continue; }
    for (const binding of screen.bindings) {
      let target;
      try { target = targetOf(instance, binding, screen); } catch (error) { add('erro', `${where} · ${binding.id}`, `Destino não encontrado: ${error.message}`); continue; }
      const key = target.property;
      if (binding.static) {
        const value = instance && target.node.componentProperties[key] && target.node.componentProperties[key].value;
        if (value !== binding.default) add('erro', `${where} · ${binding.id}`, `Property fixa ${binding.target.property} = ${value}; o pacote define ${binding.default}.`);
        continue;
      }
      const expected = finalVariable.get(`${screen.id}/${binding.id}`);
      if (!expected) continue; // variável ausente já reportada
      let bound = null;
      if (target.visibility) bound = target.node.boundVariables && target.node.boundVariables.visible;
      else if (key) bound = target.node.componentProperties[key] && target.node.componentProperties[key].boundVariables && target.node.componentProperties[key].boundVariables.value;
      if (!bound || bound.id !== expected.id) add('erro', `${where} · ${binding.id}`, target.visibility ? 'A visibilidade não está ligada à variável esperada.' : `A property ${binding.target.property} não está ligada à variável esperada.`);
    }
  }

  const count = level => findings.filter(f => f.level === level).length;
  return { packageId: pkg.id, pluginVersion: PLUGIN_VERSION, erros: count('erro'), avisos: count('aviso'), infos: count('info'), findings };
}
