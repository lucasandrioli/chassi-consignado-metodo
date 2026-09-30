/* Localização de destinos dentro do Core. Incorporado ao plugin pelo build, antes do runtime. */
function exactDescendant(root, type, name, label) {
  const matches = root.findAllWithCriteria({ types: [type] }).filter(node => node.name === name);
  if (matches.length !== 1) throw new Error(`${label}: ${type} ${name} ausente ou ambíguo.`);
  return matches[0];
}
// Cada nome do caminho é procurado só dentro do nó do passo anterior; por isso
// 'Label 01' pode se repetir em 14 itens, desde que o item seja único no Core.
function resolveInstancePath(root, path, label) {
  let node = root;
  for (const name of path) node = exactDescendant(node, 'INSTANCE', name, label);
  return node;
}
// Camada de qualquer tipo (frame, instância...), para ligar visibilidade sem property pública.
function resolveNodePath(root, path, label) {
  let node = root;
  for (const name of path) {
    const matches = node.findAll(n => n.name === name);
    if (matches.length !== 1) throw new Error(`${label}: camada ${name} ausente ou ambígua.`);
    node = matches[0];
  }
  return node;
}
if (typeof module !== 'undefined') module.exports = { exactDescendant, resolveInstancePath, resolveNodePath };
