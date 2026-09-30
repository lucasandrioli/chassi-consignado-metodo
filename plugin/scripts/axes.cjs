const AXES = ['operation', 'context', 'additional'];
// Limite de modes por eixo (cada eixo é uma coleção de variáveis; o Figma limita os modes por coleção conforme o plano).
const MAX_MODES = 12;

function validateAxes(pkg) {
  for (const axis of AXES) {
    const spec = pkg.axes?.[axis];
    if (!spec?.collection || !Array.isArray(spec.modes) || !spec.modes.length
      || new Set(spec.modes).size !== spec.modes.length || spec.modes.length > MAX_MODES)
      throw new Error(`${pkg.id}: eixo ${axis} inválido ou acima do limite de ${MAX_MODES} modes.`);
  }
}

module.exports = { AXES, MAX_MODES, validateAxes };
