const assert = require('node:assert/strict');
const { MAX_MODES, validateAxes } = require('./axes.cjs');

const modes = n => Array.from({ length: n }, (_, i) => `M${i + 1}`);
const pkg = (context, extra = {}) => ({
  id: 'teste',
  axes: {
    operation: { collection: 'Operação', modes: ['PCON', 'REFIN', 'Port Ataque Saldo', 'Port Ataque Refin'] },
    context: { collection: 'Contexto', modes: context },
    additional: { collection: 'Produtos Adicionais', modes: ['Sem adicionais', 'Seguro', 'Portabilidade de salário', 'Seguro + portabilidade'] },
    ...extra
  }
});

// Contexto do OP: seis valores.
validateAxes(pkg(['Cl1', 'Cl2', 'Cl2.1', 'GOV.SP', 'Cl4', 'Cl5']));
// Limite exato passa; um acima não.
validateAxes(pkg(modes(MAX_MODES)));
assert.throws(() => validateAxes(pkg(modes(MAX_MODES + 1))), /eixo context/);
// Modes repetidos, lista vazia e coleção ausente continuam inválidos.
assert.throws(() => validateAxes(pkg(['A', 'A'])), /eixo context/);
assert.throws(() => validateAxes(pkg([])), /eixo context/);
assert.throws(() => validateAxes(pkg(['A'], { additional: { modes: ['Sem'] } })), /eixo additional/);
// Eixo ausente.
assert.throws(() => validateAxes({ id: 'x', axes: {} }), /eixo operation/);
console.log('Eixos: limite de modes e validação conferidos.');
