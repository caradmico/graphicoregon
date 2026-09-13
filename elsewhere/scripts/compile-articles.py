#!/usr/bin/env python3
"""Fold elsewhere/articles/*.json into elsewhere/articles.json for the public paper."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "articles"
OUT = ROOT / "articles.json"


def main() -> None:
    rows = []
    for p in sorted(SRC.glob("*.json")):
        if p.name.startswith("_"):
            continue
        try:
            data = json.loads(p.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if isinstance(data, dict) and data.get("slug"):
            rows.append(data)
    rows.sort(key=lambda a: (a.get("date") or "", a.get("title") or ""), reverse=True)
    OUT.write_text(
        json.dumps({"articles": rows}, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"compiled {len(rows)} → {OUT.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
