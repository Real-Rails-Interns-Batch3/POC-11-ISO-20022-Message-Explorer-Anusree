"""Quick validation smoke test."""
import sys
sys.path.insert(0, '.')
from services.validator import validate_message

with open('data/schemas/pacs008_clean.txt', 'r', encoding='utf-8') as f:
    xml = f.read()

result = validate_message(xml)
print('Overall passed:', result['passed'])
print('Score:', result['score'])
print()
for r in result['results']:
    status = r['status'].upper().ljust(7)
    print(f'  [{status}] {r["ruleId"]} - {r["ruleName"]}')
    print(f'           {r["message"]}')
