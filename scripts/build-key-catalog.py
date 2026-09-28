#!/usr/bin/env python3
"""Gera um cadastro de chaves de Figma a partir dos pacotes e do registro local."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PACKAGES = ROOT / "plugin/packages"
PUBLICATIONS = ROOT / "catalog/figma-publications.json"
TEMPLATE = ROOT / "viewer/catalogo.template"
OUTPUT = ROOT / "viewer/catalogo.html"
AXES = ("operation", "context", "additional")
KEY_PATTERN = re.compile(r"[0-9a-f]{40}")


def package_hash(package: dict) -> str:
    canonical = json.dumps(package, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def variable_name(stage: str, screen: str, binding: str, axis: str) -> str:
    return f"{stage}/{screen}/{binding.replace('.', '-').replace('·', '-')}/{axis}"


def main() -> None:
    registry = json.loads(PUBLICATIONS.read_text(encoding="utf-8"))
    if registry.get("schemaVersion") != 1:
        raise SystemExit("Versão do registro de publicações incompatível.")
    publications = {
        (entry["stageId"], entry["productId"]): entry
        for entry in registry["registrations"]
    }
    if len(publications) != len(registry["registrations"]):
        raise SystemExit("Publicação duplicada para etapa e produto.")

    stages: dict[str, dict] = {}
    issues: list[str] = []
    for package_path in sorted(PACKAGES.glob("*.json")):
        package = json.loads(package_path.read_text(encoding="utf-8"))
        stage = package["stage"]
        product = package["product"]
        stage_id, product_id = stage["id"], product["id"]
        publication = publications.get((stage_id, product_id), {})
        stage_data = stages.setdefault(stage_id, {
            "id": stage_id, "name": stage["name"], "version": stage["version"],
            "products": {}, "screenOrder": [], "screenNames": {}, "coreKeys": {},
        })
        if stage_data["version"] != stage["version"]:
            issues.append(f"{stage_id}: versões de etapa divergentes entre produtos")
        observed_screens = publication.get("screens", {})
        observed_variables = publication.get("variables", {})
        collection_issues = [
            f"Coleção {axis} sem chave válida"
            for axis in AXES
            if not KEY_PATTERN.fullmatch(publication.get("collections", {}).get(axis, {}).get("key", ""))
        ]
        expected_variables: set[str] = set()
        product_screens = {}
        digest = package_hash(package)
        for screen in package["screens"]:
            sid = screen["id"]
            if sid not in stage_data["screenOrder"]:
                stage_data["screenOrder"].append(sid)
            stage_data["screenNames"][sid] = screen["name"]
            published = observed_screens.get(sid, {})
            status = collection_issues.copy()
            previous_core = stage_data["coreKeys"].setdefault(sid, screen["coreKey"])
            if previous_core != screen["coreKey"]:
                status.append("Produtos apontam para chaves Core diferentes")
            if not published.get("componentKey"):
                status.append("Chave publicada da tela não cadastrada")
            elif not KEY_PATTERN.fullmatch(published["componentKey"]):
                status.append("Chave publicada da tela inválida")
            if not KEY_PATTERN.fullmatch(screen["coreKey"]):
                status.append("Chave Core inválida no pacote")
            if published.get("coreKey") and published["coreKey"] != screen["coreKey"]:
                status.append("Chave Core divergente")
            if published.get("packageHash") and published["packageHash"] != digest:
                status.append("Pacote mudou desde a publicação observada")
            bindings = []
            for binding in screen["bindings"]:
                variables = []
                for axis in AXES:
                    if axis != "operation" and not binding.get(axis):
                        continue
                    name = variable_name(stage_id, sid, binding["id"], axis)
                    if name in expected_variables:
                        status.append(f"Nome de variável duplicado: {name}")
                    expected_variables.add(name)
                    key = observed_variables.get(name)
                    if not key:
                        status.append(f"Variável sem chave: {name}")
                    elif not KEY_PATTERN.fullmatch(key):
                        status.append(f"Chave inválida: {name}")
                    variables.append({
                        "axis": axis, "name": name, "key": key,
                        "collectionKey": publication.get("collections", {}).get(axis, {}).get("key"),
                        "overrides": binding.get(axis, {}),
                    })
                bindings.append({
                    "id": binding["id"], "type": binding["type"],
                    "target": binding["target"], "default": binding["default"],
                    "variables": variables,
                })
            product_screens[sid] = {
                "id": sid, "name": screen["name"], "version": screen["version"],
                "coreKey": screen["coreKey"], "coreFileKey": publication.get("coreFileKey"),
                "componentKey": published.get("componentKey"),
                "publicationStatus": "Conferido" if not status else "Revisar",
                "issues": status, "sourceContract": screen.get("sourceContract"),
                "bindings": bindings, "extensions": screen.get("extensions", []),
            }
            issues.extend(f"{stage_id}/{product_id}/{sid}: {item}" for item in status)
        extras = set(observed_variables) - expected_variables
        if extras:
            issues.append(f"{stage_id}/{product_id}: {len(extras)} variáveis publicadas fora do pacote")
        stage_data["products"][product_id] = {
            "id": product_id, "version": product["version"], "packageVersion": package["schemaVersion"],
            "packageState": package["state"], "packageHash": digest,
            "fileKey": publication.get("fileKey"), "libraryName": publication.get("libraryName"),
            "libraryKey": publication.get("libraryKey"), "observedAt": publication.get("observedAt"),
            "axes": package["axes"], "collections": publication.get("collections", {}),
            "screens": product_screens, "variableCount": len(expected_variables),
            "observedVariableCount": len(observed_variables),
        }

    if not stages:
        raise SystemExit("Nenhum pacote encontrado em plugin/packages.")
    data = {"schemaVersion": 1, "stages": list(stages.values()), "issues": issues,
            "registryNote": registry.get("note", "")}
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8").replace("__CATALOG_DATA__", payload)
    OUTPUT.write_text(html, encoding="utf-8")
    count = sum(len(stage["products"]) for stage in stages.values())
    print(f"Catálogo gerado: {OUTPUT.relative_to(ROOT)} · {len(stages)} etapa(s), {count} produto(s), {len(issues)} alerta(s).")


if __name__ == "__main__":
    main()
