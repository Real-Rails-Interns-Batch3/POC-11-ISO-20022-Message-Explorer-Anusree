"""
patch_mock_data.py
Replaces the rawXml template literal blocks for msg-001, msg-002, and msg-004
in the frontend mock-data.ts file with real published XML samples.
"""
import re
import os

MOCK_DATA = os.path.join(
    "..", "frontend", "src", "lib", "mock-data.ts"
)
SCHEMAS = os.path.join("data", "schemas")


def load_xml(name):
    with open(os.path.join(SCHEMAS, name), "r", encoding="utf-8") as f:
        return f.read().rstrip()


pacs008 = load_xml("pacs008_clean.txt")
pacs002 = load_xml("pacs002_clean.txt")
pain001 = load_xml("pain001_clean.txt")

with open(MOCK_DATA, "r", encoding="utf-8") as f:
    src = f.read()

# ---- Helper: replace a rawXml backtick block for a given message id ----
def replace_rawxml(content, msg_id, new_xml):
    """Replace rawXml content for the message block containing msg_id."""
    # Find the message block (starts with '  {\n    id: "msg-XXX"')
    id_pattern = rf'(\s{{4}}id: "{re.escape(msg_id)}".*?rawXml: `)(.*?)(`)'
    def replacer(m):
        return m.group(1) + "\n" + new_xml + "\n  " + m.group(3)
    new_content, n = re.subn(id_pattern, replacer, content, flags=re.DOTALL)
    if n == 0:
        raise ValueError(f"Could not find rawXml block for {msg_id}")
    print(f"  Patched rawXml for {msg_id} ({n} replacement(s))")
    return new_content


print("Patching frontend/src/lib/mock-data.ts ...")
src = replace_rawxml(src, "msg-001", pacs008)
src = replace_rawxml(src, "msg-002", pacs002)
src = replace_rawxml(src, "msg-004", pain001)

# Also update descriptions in MOCK_FULL_MESSAGES to match
src = src.replace(
    '"FI-to-FI customer credit transfer via FedNow instant payments network. Transfers $2,500 from sender to receiver with full structured data."',
    '"Real FedNow sample published by the Federal Reserve. Individual A (BankA, ABA 111111111) pays Corporation B (ABA 333333333) USD 51.74 via FedNow, referencing invoice INV34563."',
)
src = src.replace(
    '"Payment status report confirming acceptance of a FedNow credit transfer by the receiving financial institution."',
    '"Real FedNow sample published by the Federal Reserve. Accepts the credit transfer with UETR 8a562c67-ca16-48ba-b074-65581be6f011. InstgAgt ABA 111111111 \u2192 InstdAgt ABA 222222222."',
)
src = src.replace(
    '"Customer-to-bank payment initiation for EUR 1,850 SEPA credit transfer from Germany to France."',
    '"Real EPC-aligned SEPA sample (salesking/sepa_king). Two CTs: EUR 6,543.14 + EUR 112.72, Debtor IBAN DE87200500001234567890 \u2192 Creditor via SPUEDE2UXXX."',
)

with open(MOCK_DATA, "w", encoding="utf-8") as f:
    f.write(src)

print("Done.")
