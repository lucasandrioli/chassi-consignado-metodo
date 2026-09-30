const assert = require('node:assert/strict');
const { exactDescendant, resolveInstancePath, resolveNodePath } = require('../src/paths.js');

// Nó de teste: findAllWithCriteria devolve todos os descendentes do tipo pedido.
function node(name, type, children = []) {
  const self = { name, type, children };
  self.findAll = fn => { const found = []; const walk = n => { for (const c of n.children) { if (fn(c)) found.push(c); walk(c); } }; walk(self); return found; };
  self.findAllWithCriteria = ({ types }) => {
    const found = [];
    const walk = n => { for (const c of n.children) { if (types.includes(c.type)) found.push(c); walk(c); } };
    walk(self);
    return found;
  };
  return self;
}
const item = name => node(name, 'INSTANCE', [
  node('Label box', 'INSTANCE', [node('Label 01', 'INSTANCE'), node('Label 02', 'INSTANCE')]),
  node('Supporting item', 'INSTANCE', [node('Description 01', 'INSTANCE')])
]);
const core = node('Core', 'COMPONENT', [item('item-valor-receber'), item('item-parcelas'), item('item-iof')]);

// O mesmo nome repetido em vários itens é ambíguo na busca global...
assert.throws(() => exactDescendant(core, 'INSTANCE', 'Label 01', 'Revisão'), /Label 01 ausente ou ambíguo/);
// ...e único quando o caminho passa pelo item.
const a = resolveInstancePath(core, ['item-valor-receber', 'Label 01'], 'Revisão');
const b = resolveInstancePath(core, ['item-parcelas', 'Label 01'], 'Revisão');
assert.notEqual(a, b);
assert.equal(a.name, 'Label 01');
// Caminho mais profundo (Description 01 dentro do Supporting item).
assert.equal(resolveInstancePath(core, ['item-iof', 'Description 01'], 'Revisão').name, 'Description 01');
// Item inexistente e nome de item duplicado.
assert.throws(() => resolveInstancePath(core, ['item-inexistente', 'Label 01'], 'Revisão'), /ausente ou ambíguo/);
core.children.push(item('item-iof'));
assert.throws(() => resolveInstancePath(core, ['item-iof', 'Label 01'], 'Revisão'), /item-iof ausente ou ambíguo/);
// Camada de qualquer tipo (visibilidade): frame dentro de frame, nomes repetidos em ramos distintos.
const shell = node('Core', 'COMPONENT', [
  node('overlay', 'FRAME', [node('wrapper-rule', 'FRAME'), node('col', 'FRAME')]),
  node('conteudo', 'FRAME', [node('secao-seguro', 'FRAME', [node('col', 'FRAME')])])
]);
assert.equal(resolveNodePath(shell, ['overlay', 'wrapper-rule'], 'Revisão').type, 'FRAME');
assert.equal(resolveNodePath(shell, ['conteudo', 'secao-seguro', 'col'], 'Revisão').name, 'col');
assert.throws(() => resolveNodePath(shell, ['col'], 'Revisão'), /camada col ausente ou ambígua/);
console.log('Caminhos: resolução por passos e ambiguidade conferidas.');
