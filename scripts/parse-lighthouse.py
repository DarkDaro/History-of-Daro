#!/usr/bin/env python3
"""Разбор JSON-отчётов Lighthouse (/tmp/lh*.json): a11y-нарушения и perf-резервы."""
import glob
import json


def get_items(det):
    if not det:
        return []
    items = det.get("items")
    if isinstance(items, list):
        return items
    if isinstance(items, dict):
        return list(items.values())
    return []


viol = {}
perf = {}
for f in sorted(glob.glob("/tmp/lh*.json")):
    d = json.load(open(f))
    route = f.replace("/tmp/lh", "").replace(".json", "")
    aud = d["audits"]
    for aid, a in aud.items():
        if a.get("score") is not None and a["score"] < 1 and a.get("scoreDisplayMode") not in (
            "notApplicable", "informative", "manual",
        ):
            items = get_items(a.get("details"))
            if items:
                viol.setdefault(aid, {"title": a["title"], "routes": set(), "sample": None})
                viol[aid]["routes"].add(route)
                if not viol[aid]["sample"]:
                    node = items[0].get("node", {}) if isinstance(items[0], dict) else {}
                    label = node.get("nodeLabel") or node.get("explanation") or node.get("snippet") or ""
                    viol[aid]["sample"] = (node.get("selector", "") or "", str(label)[:110])
    for aid, a in aud.items():
        sav = (a.get("details") or {}).get("overallSavingsMs") or 0
        if sav and sav > 150:
            perf.setdefault(aid, {"title": a["title"], "ms": 0, "route": route})
            if sav > perf[aid]["ms"]:
                perf[aid].update({"ms": sav, "route": route})

print("=== A11Y НАРУШЕНИЯ ===")
for aid, v in viol.items():
    print(f"- {aid}: {v['title']}")
    print(f"  маршруты: {', '.join(sorted(v['routes']))}")
    print(f"  пример: {v['sample']}")
print()
print("=== PERF (резервы >150 мс) ===")
for aid, v in sorted(perf.items(), key=lambda x: -x[1]["ms"])[:10]:
    print(f"- {aid} [{v['route']}]: ~{int(v['ms'])} мс — {v['title']}")
