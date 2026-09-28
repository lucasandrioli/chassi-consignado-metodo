#!/usr/bin/env python3
"""Gera um leitor HTML local a partir dos contratos Markdown registrados."""

from __future__ import annotations

import hashlib
import html
import json
import os
import re
from pathlib import Path
from urllib.parse import quote, urlsplit

try:
    from markdown_it import MarkdownIt
except ImportError as error:
    raise SystemExit("Instale a dependência de geração: python3 -m pip install -r viewer/requirements.txt") from error


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'contracts/index.json'
TEMPLATE = ROOT / 'viewer/contratos.template'
OUTPUT = ROOT / 'viewer/contratos.html'
MARKDOWN = MarkdownIt('commonmark', {'html': False}).enable('table')


def safe_path(relative: str) -> Path:
    candidate = (ROOT / relative).resolve()
    if not candidate.is_relative_to(ROOT) or candidate.suffix != '.md':
        raise ValueError(f'Caminho de contrato inválido: {relative}')
    return candidate


def plain(value: str) -> str:
    value = re.sub(r'!?(?:\[([^]]+)\])\([^)]*\)', r'\1', value)
    value = re.sub(r'[`*_~]', '', value)
    return html.unescape(value).strip()


def first_match(pattern: str, source: str) -> str:
    match = re.search(pattern, source, re.I | re.M)
    return plain(match.group(1)) if match else ''


def vocation_excerpt(source: str) -> str:
    match = re.search(r'^##\s+[^\n]*vocaç(?:ão|ões)[^\n]*\n', source, re.I | re.M)
    if not match:
        return ''
    remainder = source[match.end():]
    for paragraph in re.split(r'\n\s*\n', remainder):
        paragraph = paragraph.strip()
        if paragraph and not paragraph.startswith(('#', '|', '- ')):
            text = plain(paragraph.replace('\n', ' '))
            return text[:420] + ('…' if len(text) > 420 else '')
    return ''


def relative_url(href: str, source_file: Path) -> str:
    href = html.unescape(href)
    if href.startswith('#') or urlsplit(href).scheme or href.startswith('//'):
        return href
    pathname, separator, fragment = href.partition('#')
    target = (source_file.parent / pathname).resolve()
    if not target.is_relative_to(ROOT):
        return '#'
    relative = os.path.relpath(target, OUTPUT.parent)
    return quote(relative, safe='/.-_') + (separator + quote(fragment, safe='-_%') if separator else '')


def render_markdown(source: str, source_file: Path, contract_id: str) -> tuple[str, str, list[dict]]:
    rendered = MARKDOWN.render(source)
    rendered = re.sub(r'^<h1>.*?</h1>\s*', '', rendered, count=1, flags=re.S)
    headings = [plain(match.group(1)) for match in re.finditer(r'^##\s+(.+)$', source, re.M)]
    section_ids = [f"sec-{re.sub(r'[^a-z0-9]+', '-', contract_id.lower()).strip('-')}-{i}" for i in range(len(headings))]
    section_iter = iter(section_ids)
    rendered = re.sub(r'<h2>', lambda _: f'<h2 id="{next(section_iter)}">', rendered)

    def replace_link(match: re.Match[str]) -> str:
        target = relative_url(match.group(2), source_file)
        return f'{match.group(1)}{html.escape(target, quote=True)}{match.group(3)}'

    rendered = re.sub(r'(<(?:a href|img src)=")([^"]+)(")', replace_link, rendered)
    rendered = re.sub(r'<a href=', '<a target="_blank" rel="noopener noreferrer" href=', rendered)
    rendered = re.sub(r'(<table>.*?</table>)', r'<div class="table-wrap">\1</div>', rendered, flags=re.S)
    section_matches = list(re.finditer(r'<h2 id="([^"]+)">.*?</h2>', rendered, re.S))
    if len(section_matches) != len(headings):
        raise ValueError(f'Não foi possível separar as seções de {contract_id}.')
    if not section_matches:
        return rendered, '', [{
            'title': 'Conteúdo do produto' if 'product-screen' in contract_id else 'Conteúdo',
            'id': f"sec-{re.sub(r'[^a-z0-9]+', '-', contract_id.lower()).strip('-')}-0",
            'html': rendered,
            'searchText': plain(re.sub(r'<[^>]+>', ' ', rendered)).lower(),
        }]
    intro_html = rendered[:section_matches[0].start()]
    sections = []
    for index, match in enumerate(section_matches):
        end = section_matches[index + 1].start() if index + 1 < len(section_matches) else len(rendered)
        body = rendered[match.end():end].strip()
        sections.append({
            'title': headings[index],
            'id': section_ids[index],
            'html': body,
            'searchText': plain(re.sub(r'<[^>]+>', ' ', body)).lower(),
        })
    return rendered, intro_html, sections


def main() -> None:
    index = json.loads(INDEX.read_text(encoding='utf-8'))
    if index.get('schemaVersion') != 1 or not index.get('registries'):
        raise ValueError('Índice de contratos inválido.')
    contracts = []
    registered_ids: set[str] = set()
    for registry_path in index['registries']:
        registry_file = (ROOT / registry_path).resolve()
        if not registry_file.is_relative_to(ROOT):
            raise ValueError(f'Registro fora do repositório: {registry_path}')
        registry = json.loads(registry_file.read_text(encoding='utf-8'))
        entries_by_id = {entry['id']: entry for entry in registry['contracts']}
        for entry in registry['contracts']:
            if entry['id'] in registered_ids:
                raise ValueError(f'Contrato duplicado: {entry["id"]}')
            registered_ids.add(entry['id'])
            source_file = safe_path(entry['path'])
            source = source_file.read_text(encoding='utf-8')
            markup, intro_html, sections = render_markdown(source, source_file, entry['id'])
            fingerprint = hashlib.sha256(source.encode('utf-8')).hexdigest()
            locked = entry.get('locked') or {}
            expected_dependencies = {}
            for dependency_id in entry.get('dependsOn', []):
                upstream = entries_by_id[dependency_id].get('locked') or {}
                expected_dependencies[dependency_id] = f"{upstream.get('version')}:{upstream.get('state')}:{upstream.get('sha256')}"
            current = (fingerprint == locked.get('sha256') and entry['version'] == locked.get('version')
                       and entry['state'] == locked.get('state')
                       and (locked.get('dependencies') or {}) == expected_dependencies)
            contracts.append({
                'id': entry['id'],
                'layer': entry['layer'],
                'stage': entry['stage'],
                'screen': entry.get('screen'),
                'product': entry.get('product'),
                'version': entry['version'],
                'state': entry['state'],
                'current': current,
                'title': first_match(r'^#\s+(.+)$', source) or entry['id'],
                'statusNote': first_match(r'^\*\*Estado:\*\*\s*(.+)$', source),
                'vocation': vocation_excerpt(source),
                'path': entry['path'],
                'url': quote(os.path.relpath(source_file, OUTPUT.parent), safe='/.-_'),
                'html': markup,
                'introHtml': intro_html,
                'sections': sections,
                'searchText': plain(source).lower(),
            })
    data = {'contracts': contracts}
    payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c')
    page = TEMPLATE.read_text(encoding='utf-8').replace('__CONTRACT_DATA__', payload)
    OUTPUT.write_text(page, encoding='utf-8')
    print(f'Leitor gerado: {OUTPUT} ({len(contracts)} contratos).')


if __name__ == '__main__':
    main()
