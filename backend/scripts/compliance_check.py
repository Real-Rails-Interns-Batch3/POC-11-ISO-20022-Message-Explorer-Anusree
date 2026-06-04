"""
compliance_check.py  — verifies all originally-reported issues are fixed
Run from the iso20022-explorer root directory.
"""
import os

BASE = r"c:/Users/Anusree/OneDrive/Desktop/iso20022-explorer"

# (label, relative_path, pattern, should_be_absent)
# should_be_absent=True  → the pattern should NOT appear (it was a problem)
# should_be_absent=False → the pattern SHOULD appear (it was a missing feature)
CHECKS = [
    # ── 78% adoption stat ───────────────────────────────────────────────────
    ("78% stat in Sidebar.tsx",              "frontend/src/components/Sidebar.tsx",           "78%",                True),
    ("sourceUrl link in Sidebar.tsx",        "frontend/src/components/Sidebar.tsx",           "sourceUrl",          True),
    ("D3Sparkline import in Sidebar.tsx",    "frontend/src/components/Sidebar.tsx",           "D3Sparkline",        True),
    ("78% in mock-data.ts",                  "frontend/src/lib/mock-data.ts",                 "\"78%\"",             True),
    ("78% in UAT table",                     "Functional_UAT_Table.md",                       "78%",                True),

    # ── camt.054 / CHAPS everywhere ─────────────────────────────────────────
    ("camt.054 card in page.tsx",            "frontend/src/app/page.tsx",                     "camt.054",           True),
    ("CHAPS branch in page.tsx",             "frontend/src/app/page.tsx",                     "CHAPS",              True),
    ("camt.054 in mock-data.ts",             "frontend/src/lib/mock-data.ts",                 "camt.054",           True),
    ("CHAPS network in mock-data.ts",        "frontend/src/lib/mock-data.ts",                 "'CHAPS'",            True),
    ("camt.054 in metadata.py",              "backend/routers/metadata.py",                   "camt.054",           True),
    ("camt.054 in README",                   "README.md",                                     "camt.054",           True),
    ("CHAPS in README",                      "README.md",                                     "CHAPS",              True),
    ("camt.054 in UAT",                      "Functional_UAT_Table.md",                       "camt.054",           True),
    ("CHAPS in UAT",                         "Functional_UAT_Table.md",                       "CHAPS",              True),
    ("camt.054 in VAR",                      "Visualization_Audit_Report.md",                 "camt.054",           True),

    # ── Payment chain graph / VAR overstatement ──────────────────────────────
    ("Old misleading comment in graph",      "frontend/src/components/PaymentChainGraph.tsx", "mock representation", True),
    ("'without data loss' in VAR",           "Visualization_Audit_Report.md",                "without data loss",  True),
    ("Graph topology caveat in VAR",         "Visualization_Audit_Report.md",                "topology is fixed",  False),
    ("Mock data caveat in VAR",              "Visualization_Audit_Report.md",                "mock data",          False),

    # ── README backend steps ─────────────────────────────────────────────────
    ("uvicorn step in README",               "README.md",                                     "uvicorn",            False),
    ("pip install in README",                "README.md",                                     "pip install",        False),
    ("mock data note in README",             "README.md",                                     "mock data",          False),

    # ── lucide-react version ─────────────────────────────────────────────────
    ("lucide-react ^1.17.0 in package.json", "frontend/package.json",                        "1.17.0",             True),
    ("lucide-react ^0.x in package.json",    "frontend/package.json",                        "0.475.0",            False),

    # ── duplicate reactflow/xyflow ───────────────────────────────────────────
    ("reactflow in package.json",            "frontend/package.json",                        '"reactflow"',         True),
    ("@xyflow/react in package.json",        "frontend/package.json",                        "@xyflow/react",      False),
    ("reactflow import in PaymentChainGraph","frontend/src/components/PaymentChainGraph.tsx","from 'reactflow'",   True),
    ("reactflow import in GovernanceGraph",  "frontend/src/components/GovernanceGraph.tsx",  "from 'reactflow'",   True),

    # ── 14 validation rules → 11 (now 12 with new XSD rule) ─────────────────
    ("'14' rules in mock-data.ts",           "frontend/src/lib/mock-data.ts",                '"14"',               True),
    ("'14' rules in metadata.py",            "backend/routers/metadata.py",                  '"14"',               True),
    ("XSD rule in validator.py",             "backend/services/validator.py",                "rule-000",           False),
    ("lxml in requirements.txt",             "backend/requirements.txt",                     "lxml",               False),
]


def check(label, rel_path, pattern, should_be_absent):
    path = os.path.join(BASE, rel_path.replace("/", os.sep))
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        return "ERROR", f"file not found: {rel_path}"

    found = pattern in content
    if should_be_absent:
        passed = not found
        note = "absent (good)" if passed else f"STILL PRESENT — pattern: {pattern!r}"
    else:
        passed = found
        note = "present (good)" if passed else f"MISSING — pattern: {pattern!r}"
    return ("PASS" if passed else "FAIL"), note


all_passed = True
print(f"{'Check':<54} {'Status':<6}  Notes")
print("─" * 100)

for label, rel_path, pattern, should_be_absent in CHECKS:
    status, note = check(label, rel_path, pattern, should_be_absent)
    if status != "PASS":
        all_passed = False
    flag = "✓" if status == "PASS" else "✗"
    print(f"{flag} {label:<52} {status:<6}  {note}")

print()
if all_passed:
    print("✅  ALL CHECKS PASSED — every originally-reported issue is resolved.")
else:
    print("❌  SOME CHECKS FAILED — see items marked FAIL above.")
