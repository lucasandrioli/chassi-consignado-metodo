#!/usr/bin/env node
'use strict';
// Confere as skills em .github/skills: cabeçalho, links, referência comum do Figma MCP idêntica nas três, e termos que não devem voltar.
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS = path.join(ROOT, '.github', 'skills');
const errors = [];
const fail = message => errors.push(message);
const read = file => fs.readFileSync(file, 'utf8');
const names = fs.readdirSync(SKILLS).filter(n => fs.statSync(path.join(SKILLS, n)).isDirectory()).sort();
if (!names.length) fail('Nenhuma skill em .github/skills.');

const FORBIDDEN = [
  [/NAO_DISPONIVEL_NO_AGENT/, 'use NAO_DISPONIVEL_NO_MCP'],
  [/conectad[ao]s? pelo `\+`/, 'o "+" era do Figma Agent; use get_libraries'],
  [/Figma Agent/, 'as skills rodam por MCP; só a referência figma-mcp.md pode citar o Figma Agent (tabela de equivalências)'],
  [/rodada [0-9]/i, 'sem referência a rodadas do projeto'],
  [/handoffs\//, 'sem referência a handoffs']
];

for (const name of names) {
  const dir = path.join(SKILLS, name);
  const skillFile = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) { fail(`${name}: falta SKILL.md.`); continue; }
  const text = read(skillFile);
  const front = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!front) fail(`${name}: SKILL.md sem cabeçalho (frontmatter).`);
  else {
    const fieldName = (front[1].match(/^name:\s*(.+)$/m) || [])[1];
    const description = (front[1].match(/^description:\s*(.+)$/m) || [])[1];
    if (fieldName !== name) fail(`${name}: o campo name ("${fieldName}") deve ser igual ao nome da pasta.`);
    if (!description || description.length < 40) fail(`${name}: descrição ausente ou curta demais.`);
    if (description && description.length > 1024) fail(`${name}: descrição passa de 1024 caracteres.`);
  }
  const lines = text.split('\n').length;
  if (lines > 500) fail(`${name}: SKILL.md tem ${lines} linhas (máximo 500; mova detalhe para references/).`);
  const files = [skillFile, ...(fs.existsSync(path.join(dir, 'references')) ? fs.readdirSync(path.join(dir, 'references')).map(f => path.join(dir, 'references', f)) : [])];
  for (const file of files) {
    const body = read(file);
    for (const match of body.matchAll(/\]\((?!https?:|#|mailto:)([^)\s#]+)(?:#[^)]*)?\)/g)) {
      const target = path.resolve(path.dirname(file), match[1]);
      if (!fs.existsSync(target)) fail(`${path.relative(ROOT, file)}: link quebrado para ${match[1]}.`);
    }
    if (path.basename(file) !== 'figma-mcp.md') for (const [pattern, why] of FORBIDDEN) {
      const hit = body.match(pattern);
      if (hit) fail(`${path.relative(ROOT, file)}: termo proibido "${hit[0]}" (${why}).`);
    }
  }
  if (!fs.existsSync(path.join(dir, 'references', 'figma-mcp.md'))) fail(`${name}: falta references/figma-mcp.md.`);
  if (!/references\/figma-mcp\.md/.test(text)) fail(`${name}: SKILL.md precisa mandar ler references/figma-mcp.md.`);
}
const copies = names.map(n => path.join(SKILLS, n, 'references', 'figma-mcp.md')).filter(f => fs.existsSync(f));
for (const f of copies.slice(1)) if (read(f) !== read(copies[0])) fail(`${path.relative(ROOT, f)} difere de ${path.relative(ROOT, copies[0])}: a referência comum deve ser idêntica nas skills.`);

if (errors.length) { console.error(errors.map(e => `- ${e}`).join('\n')); process.exitCode = 1; }
else console.log(`Skills conferidas: ${names.join(', ')}.`);
