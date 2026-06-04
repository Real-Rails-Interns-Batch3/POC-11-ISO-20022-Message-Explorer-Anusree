"""
update_real_data.py
Replaces rawXml in mock_messages.json with real published XML from:
  - Federal Reserve / moov-io (FedNow pacs.008, pacs.002)
  - EPC / salesking/sepa_king (SEPA pain.001)
Run from the backend/ directory.
"""
import json
import re
import os

SCHEMAS_DIR = os.path.join("data", "schemas")
MESSAGES_FILE = os.path.join("data", "mock_messages.json")


def clean_xml(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()
    raw = re.sub(r"<\?xml[^?]*\?>", "", raw)
    raw = re.sub(r"<!--.*?-->", "", raw, flags=re.DOTALL)
    raw = re.sub(r"\r\n", "\n", raw)
    raw = re.sub(r"\n{3,}", "\n\n", raw)
    return raw.strip()


pacs008_xml = clean_xml(os.path.join(SCHEMAS_DIR, "fednow_pacs008_document.xml"))
pacs002_xml = clean_xml(os.path.join(SCHEMAS_DIR, "fednow_pacs002_document.xml"))
pain001_xml = clean_xml(os.path.join(SCHEMAS_DIR, "sepa_pain001_raw.xml"))

SOURCE_FEDNOW = "Federal Reserve / moov-io/fednow20022 (MIT)"
SOURCE_EPC = "EPC / salesking/sepa_king (MIT)"

with open(MESSAGES_FILE, "r", encoding="utf-8") as f:
    messages = json.load(f)

print(f"Loaded {len(messages)} messages")

replacements = {
    "msg-001": {
        "rawXml": pacs008_xml,
        "dataSource": SOURCE_FEDNOW,
        "title": "FedNow Customer Credit Transfer",
        "description": (
            "FI-to-FI customer credit transfer via FedNow instant payments. "
            "Real sample published by the Federal Reserve. "
            "Individual A (BankA, ABA 111111111) pays Corporation B (ABA 333333333), "
            "referencing invoice INV34563."
        ),
    },
    "msg-002": {
        "rawXml": pacs002_xml,
        "dataSource": SOURCE_FEDNOW,
        "title": "FedNow Payment Accept (ACTC)",
        "description": (
            "Payment status report confirming acceptance (ACTC) of a FedNow credit transfer. "
            "Real sample published by the Federal Reserve. "
            "References original UETR 8a562c67-ca16-48ba-b074-65581be6f011."
        ),
    },
    "msg-004": {
        "rawXml": pain001_xml,
        "dataSource": SOURCE_EPC,
        "title": "SEPA Credit Transfer Initiation",
        "description": (
            "Customer-to-bank payment initiation for two SEPA credit transfers (EUR 6,543.14 + EUR 112.72). "
            "Real sample from the European Payments Council reference implementation (salesking/sepa_king). "
            "Debtor IBAN DE87200500001234567890, Creditor IBAN DE21500500009876543210."
        ),
    },
}

updated = 0
for msg in messages:
    msg_id = msg.get("id")
    if msg_id in replacements:
        for key, val in replacements[msg_id].items():
            msg[key] = val
        updated += 1
        print(f"  Updated {msg_id}: {msg['title']}")

with open(MESSAGES_FILE, "w", encoding="utf-8") as f:
    json.dump(messages, f, indent=2, ensure_ascii=False)

print(f"\nDone. Updated {updated} messages in {MESSAGES_FILE}")
