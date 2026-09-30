'use strict';
// Leitura e escrita das tabelas de máquina dos contratos (fonte do pacote e camadas ligáveis).
// O gerador de pacotes lê só estes blocos; o resto do contrato é texto livre.

const AXES = ['operation', 'context', 'additional'];
const SOURCE_BEGIN = '<!-- pacote:inicio -->';
const SOURCE_END = '<!-- pacote:fim -->';
const LAYERS_BEGIN = '<!-- camadas:inicio -->';
const LAYERS_END = '<!-- camadas:fim -->';
const CORE_BEGIN = '<!-- core:inicio -->';
const CORE_END = '<!-- core:fim -->';
const PATH_SEP = ' > ';
const PROP_SEP = ' :: ';
const MODE_SEP = ' ; ';

// Células: \ | e quebra de linha são escapados; o resto é literal (espaços das pontas incluídos, entre crases quando houver).
function encodeCell(value) {
  const text = String(value);
  const escaped = text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\r/g, '\\r').replace(/\n/g, '\\n');
  return /^\s|\s$|^`.*`$/.test(escaped) ? '`' + escaped.replace(/`/g, '\\`') + '`' : escaped;
}
function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) throw new Error(`Linha de tabela inválida: ${line}`);
  const body = trimmed.slice(1, -1);
  const cells = []; let cur = '';
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '\\' && i + 1 < body.length) { cur += c + body[++i]; continue; }
    if (c === '|') { cells.push(cur); cur = ''; continue; }
    cur += c;
  }
  cells.push(cur);
  return cells;
}
function decodeCell(cell) {
  let raw = cell.trim();
  if (raw.length >= 2 && raw.startsWith('`') && raw.endsWith('`')) raw = raw.slice(1, -1).replace(/\\`/g, '`');
  return raw.replace(/\\(.)/g, (_, ch) => (ch === 'n' ? '\n' : ch === 'r' ? '\r' : ch));
}
function tableRows(lines, headers, title) {
  const at = lines.findIndex(l => l.trim() === `### ${title}`);
  if (at < 0) throw new Error(`Seção ausente: ${title}.`);
  const rows = [];
  let i = at + 1;
  while (i < lines.length && !lines[i].trim().startsWith('|')) i++;
  const head = splitRow(lines[i]).map(decodeCell);
  if (JSON.stringify(head) !== JSON.stringify(headers))
    throw new Error(`${title}: cabeçalho esperado ${headers.join(' | ')}, encontrado ${head.join(' | ')}.`);
  i += 2; // cabeçalho e separador
  for (; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    const cells = splitRow(lines[i]).map(decodeCell);
    if (cells.length !== headers.length) throw new Error(`${title}: linha com ${cells.length} colunas, esperado ${headers.length}: ${lines[i]}`);
    rows.push(cells);
  }
  return rows;
}
const table = (headers, rows) => [
  `| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`,
  ...rows.map(r => `| ${r.map(encodeCell).join(' | ')} |`)
].join('\n');

function between(markdown, begin, end, what) {
  const a = markdown.indexOf(begin), b = markdown.indexOf(end);
  if (a < 0 || b < 0 || b < a) throw new Error(`Bloco ${what} ausente (${begin} … ${end}).`);
  return markdown.slice(a + begin.length, b).split('\n');
}

const targetText = (t, layerId) => t.kind === 'visible' ? `camada: ${layerId}` : `componente: ${t.path.join(PATH_SEP)}${PROP_SEP}${t.property}`;
function parseTarget(text, layers, where) {
  if (text.startsWith('camada: ')) {
    const id = text.slice(8);
    if (!layers.has(id)) throw new Error(`${where}: camada "${id}" não está na tabela de camadas ligáveis do contrato da tela.`);
    return { kind: 'visible', path: layers.get(id) };
  }
  if (text.startsWith('componente: ')) {
    const [pathText, property, ...rest] = text.slice(12).split(PROP_SEP);
    if (!property || rest.length) throw new Error(`${where}: alvo de componente inválido: ${text}`);
    return { kind: 'component', path: pathText.split(PATH_SEP), property };
  }
  throw new Error(`${where}: alvo desconhecido: ${text}`);
}

// ---- camadas ligáveis (contrato da tela) ----
function renderLayers(layerMap) {
  return [LAYERS_BEGIN, '### Camadas ligáveis', '',
    table(['camada', 'caminho'], Object.entries(layerMap).map(([id, p]) => [id, p.join(PATH_SEP)])), LAYERS_END].join('\n');
}
function parseLayers(markdown) {
  const rows = tableRows(between(markdown, LAYERS_BEGIN, LAYERS_END, 'de camadas'), ['camada', 'caminho'], 'Camadas ligáveis');
  const map = new Map();
  for (const [id, p] of rows) { if (map.has(id)) throw new Error(`Camada duplicada: ${id}.`); map.set(id, p.split(PATH_SEP)); }
  return map;
}

// ---- chave publicada do Core (contrato da tela): fonte única da coreKey de todos os produtos ----
const CORE_HEADERS = ['componente', 'chave', 'arquivo do Core', 'publicado em', 'nota'];
function renderCoreKey(row) {
  return [CORE_BEGIN, '### Chave publicada do Core', '', table(CORE_HEADERS, [[row.componente, row.chave, row.arquivo, row.publicado, row.nota]]), CORE_END].join('\n');
}
function parseCoreKey(markdown, where = 'contrato da tela') {
  const rows = tableRows(between(markdown, CORE_BEGIN, CORE_END, 'da chave do Core'), CORE_HEADERS, 'Chave publicada do Core');
  if (rows.length !== 1) throw new Error(`${where}: a tabela da chave do Core deve ter exatamente uma linha (uma tela, um componente); encontradas ${rows.length}.`);
  const [componente, chave, arquivo, publicado, nota] = rows[0];
  if (!/^[0-9a-f]{40}$/.test(chave)) throw new Error(`${where}: chave do Core inválida (esperado 40 caracteres hexadecimais).`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publicado)) throw new Error(`${where}: "publicado em" deve ser AAAA-MM-DD.`);
  if (!/^https:\/\/www\.figma\.com\//.test(arquivo)) throw new Error(`${where}: "arquivo do Core" deve ser o link do Figma.`);
  return { componente, chave, arquivo, publicado, nota };
}

// ---- fonte do pacote (contrato do produto na tela) ----
function renderSource(src) {
  const { config, axes, notes, bindings } = src;
  const layerOf = b => b.id.replace(/^visivel-/, '');
  const ligacoes = bindings.map(b => [b.id, b.type, targetText(b.target, layerOf(b)),
    AXES.find(a => b[a]) || '', b.static ? 'sim' : '', typeof b.default === 'boolean' ? String(b.default) : b.default]);
  const valores = [];
  for (const b of bindings) { const axis = AXES.find(a => b[a]); if (axis) for (const [mode, v] of Object.entries(b[axis])) valores.push([b.id, mode, typeof v === 'boolean' ? String(v) : v]); }
  return [SOURCE_BEGIN, '## Fonte do pacote', '',
    'Lida pelo gerador de pacotes. Textos e valores podem ser alterados; **ids, alvos, eixos e modos não** (são a referência entre o contrato, o pacote e o Figma).', '',
    '### Configuração', '', table(['chave', 'valor'], Object.entries(config)), '',
    '### Eixos', '', table(['eixo', 'coleção', 'modos'], AXES.map(a => [a, axes[a].collection, axes[a].modes.join(MODE_SEP)])), '',
    '### Notas', '', table(['nota'], notes.map(n => [n])), '',
    '### Ligações', '', table(['id', 'tipo', 'alvo', 'eixo', 'fixa', 'padrão'], ligacoes), '',
    '### Valores por modo', '', table(['id', 'modo', 'valor'], valores), SOURCE_END].join('\n');
}
function parseSource(markdown, layers, where = 'contrato') {
  const lines = between(markdown, SOURCE_BEGIN, SOURCE_END, 'da fonte do pacote');
  const config = Object.fromEntries(tableRows(lines, ['chave', 'valor'], 'Configuração'));
  const axes = {};
  for (const [axis, collection, modes] of tableRows(lines, ['eixo', 'coleção', 'modos'], 'Eixos')) {
    if (!AXES.includes(axis)) throw new Error(`${where}: eixo desconhecido ${axis}.`);
    axes[axis] = { collection, modes: modes.split(MODE_SEP) };
  }
  for (const a of AXES) if (!axes[a]) throw new Error(`${where}: eixo ${a} ausente.`);
  const notes = tableRows(lines, ['nota'], 'Notas').map(r => r[0]);
  const values = new Map();
  for (const [id, mode, value] of tableRows(lines, ['id', 'modo', 'valor'], 'Valores por modo')) {
    if (!values.has(id)) values.set(id, []);
    values.get(id).push([mode, value]);
  }
  const seen = new Set(), bindings = [];
  for (const [id, type, target, axis, fixed, def] of tableRows(lines, ['id', 'tipo', 'alvo', 'eixo', 'fixa', 'padrão'], 'Ligações')) {
    if (seen.has(id)) throw new Error(`${where}: ligação duplicada ${id}.`);
    seen.add(id);
    if (type !== 'STRING' && type !== 'BOOLEAN') throw new Error(`${where}: ${id}: tipo inválido ${type}.`);
    const conv = v => type === 'BOOLEAN' ? (v === 'true' ? true : v === 'false' ? false : (() => { throw new Error(`${where}: ${id}: booleano inválido "${v}".`); })()) : v;
    const b = { id, type, target: parseTarget(target, layers, `${where}: ${id}`), default: conv(def) };
    if (axis) {
      if (!AXES.includes(axis)) throw new Error(`${where}: ${id}: eixo inválido ${axis}.`);
      const list = values.get(id);
      if (!list) throw new Error(`${where}: ${id}: eixo ${axis} sem valores por modo.`);
      b[axis] = {};
      for (const [mode, v] of list) {
        if (!axes[axis].modes.includes(mode)) throw new Error(`${where}: ${id}: modo "${mode}" não existe no eixo ${axis}.`);
        b[axis][mode] = conv(v);
      }
    } else if (values.has(id)) throw new Error(`${where}: ${id}: valores por modo sem eixo.`);
    if (fixed === 'sim') b.static = true; else if (fixed) throw new Error(`${where}: ${id}: coluna "fixa" só aceita "sim" ou vazio.`);
    bindings.push(b);
  }
  for (const id of values.keys()) if (!seen.has(id)) throw new Error(`${where}: valores por modo de ligação inexistente: ${id}.`);
  return { config, axes, notes, bindings };
}

module.exports = { AXES, encodeCell, decodeCell, renderLayers, parseLayers, renderCoreKey, parseCoreKey, renderSource, parseSource, SOURCE_BEGIN, SOURCE_END, LAYERS_BEGIN, LAYERS_END, CORE_BEGIN, CORE_END };
