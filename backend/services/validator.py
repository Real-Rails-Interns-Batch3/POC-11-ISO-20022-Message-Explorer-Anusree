"""
ISO 20022 Message Validator
Validates ISO 20022 messages against schema rules, business rules,
character set constraints, and network-specific requirements.
"""
import re
import json
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent.parent / "data"

_rules_cache: Optional[list] = None


def _load_rules() -> list:
    """Load validation rules from JSON."""
    global _rules_cache
    if _rules_cache is None:
        rules_path = DATA_DIR / "validation_rules.json"
        with open(rules_path, "r", encoding="utf-8") as f:
            _rules_cache = json.load(f)
    return _rules_cache


def _strip_ns(tag: str) -> str:
    """Strip namespace from XML tag."""
    return tag.split("}", 1)[1] if "}" in tag else tag


def _find_elements(root: ET.Element, tag: str) -> list:
    """Find all elements with a given tag name (namespace-agnostic)."""
    results = []
    for elem in root.iter():
        if _strip_ns(elem.tag) == tag:
            results.append(elem)
    return results


def _find_element_text(root: ET.Element, tag: str) -> Optional[str]:
    """Find first element with tag and return its text."""
    for elem in root.iter():
        if _strip_ns(elem.tag) == tag:
            return elem.text
    return None


# --- Individual validation checks ---

def _check_xml_structure(xml_string: str) -> dict:
    """Rule 001: Valid XML Structure"""
    try:
        root = ET.fromstring(xml_string)
        tag = _strip_ns(root.tag)
        has_namespace = "}" in root.tag
        return {
            "ruleId": "rule-001",
            "ruleName": "Valid XML Structure",
            "status": "passed",
            "message": f"Valid XML with root element <{tag}>" + (" and ISO 20022 namespace" if has_namespace else ""),
        }
    except ET.ParseError as e:
        return {
            "ruleId": "rule-001",
            "ruleName": "Valid XML Structure",
            "status": "failed",
            "message": f"XML Parse Error: {str(e)}",
        }


def _check_mandatory_elements(root: ET.Element) -> dict:
    """Rule 002: Mandatory Elements Present"""
    mandatory_tags = ["MsgId", "CreDtTm", "NbOfTxs"]
    missing = []
    for tag in mandatory_tags:
        if not _find_elements(root, tag):
            missing.append(tag)

    if missing:
        return {
            "ruleId": "rule-002",
            "ruleName": "Mandatory Elements Present",
            "status": "failed",
            "message": f"Missing mandatory elements: {', '.join(missing)}",
        }
    return {
        "ruleId": "rule-002",
        "ruleName": "Mandatory Elements Present",
        "status": "passed",
        "message": "All mandatory header elements present",
    }


def _check_field_lengths(root: ET.Element) -> dict:
    """Rule 003: Field Length Compliance"""
    length_limits = {
        "MsgId": 35, "EndToEndId": 35, "TxId": 35, "InstrId": 35,
        "PmtInfId": 35, "UETR": 36, "Ustrd": 140, "Nm": 140,
        "StrtNm": 70, "TwnNm": 35, "PstCd": 16,
    }
    violations = []
    for tag, max_len in length_limits.items():
        for elem in _find_elements(root, tag):
            if elem.text and len(elem.text.strip()) > max_len:
                violations.append(f"{tag}: {len(elem.text.strip())} chars (max {max_len})")

    if violations:
        return {
            "ruleId": "rule-003",
            "ruleName": "Field Length Compliance",
            "status": "failed",
            "message": f"Length violations: {'; '.join(violations)}",
        }
    return {
        "ruleId": "rule-003",
        "ruleName": "Field Length Compliance",
        "status": "passed",
        "message": "All fields within length limits",
    }


def _check_positive_amounts(root: ET.Element) -> dict:
    """Rule 004: Positive Amount Validation"""
    amount_tags = ["IntrBkSttlmAmt", "InstdAmt", "RtrdIntrBkSttlmAmt", "OrgnlIntrBkSttlmAmt"]
    issues = []
    found_any = False
    for tag in amount_tags:
        for elem in _find_elements(root, tag):
            found_any = True
            try:
                val = float(elem.text.strip())
                if val <= 0:
                    issues.append(f"{tag}: {val} (must be > 0)")
            except (ValueError, AttributeError):
                issues.append(f"{tag}: invalid numeric value")

    if not found_any:
        return {
            "ruleId": "rule-004",
            "ruleName": "Positive Amount Validation",
            "status": "skipped",
            "message": "No amount fields found in message",
        }
    if issues:
        return {
            "ruleId": "rule-004",
            "ruleName": "Positive Amount Validation",
            "status": "failed",
            "message": f"Amount issues: {'; '.join(issues)}",
        }
    return {
        "ruleId": "rule-004",
        "ruleName": "Positive Amount Validation",
        "status": "passed",
        "message": "All amounts are positive",
    }


def _check_currency_codes(root: ET.Element) -> dict:
    """Rule 005: Valid Currency Code"""
    valid_currencies = {
        "USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "NZD",
        "SEK", "NOK", "DKK", "SGD", "HKD", "KRW", "CNY", "INR",
        "BRL", "MXN", "ZAR", "PLN", "CZK", "HUF", "TRY", "THB",
    }
    issues = []
    found_any = False
    for elem in root.iter():
        ccy = elem.attrib.get("Ccy")
        if ccy:
            found_any = True
            if ccy not in valid_currencies:
                issues.append(f"Unknown currency: {ccy}")

    if not found_any:
        return {
            "ruleId": "rule-005",
            "ruleName": "Valid Currency Code",
            "status": "skipped",
            "message": "No currency attributes found",
        }
    if issues:
        return {
            "ruleId": "rule-005",
            "ruleName": "Valid Currency Code",
            "status": "failed",
            "message": "; ".join(issues),
        }
    return {
        "ruleId": "rule-005",
        "ruleName": "Valid Currency Code",
        "status": "passed",
        "message": "All currency codes are valid ISO 4217",
    }


def _check_uetr_format(root: ET.Element) -> dict:
    """Rule 006: UETR Format (UUID v4)"""
    uuid4_pattern = re.compile(
        r"^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$",
        re.IGNORECASE,
    )
    uetrs = _find_elements(root, "UETR")
    if not uetrs:
        uetrs = _find_elements(root, "OrgnlUETR")

    if not uetrs:
        return {
            "ruleId": "rule-006",
            "ruleName": "UETR Format (UUID v4)",
            "status": "skipped",
            "message": "No UETR element found in message",
        }

    for elem in uetrs:
        if elem.text and not uuid4_pattern.match(elem.text.strip()):
            return {
                "ruleId": "rule-006",
                "ruleName": "UETR Format (UUID v4)",
                "status": "failed",
                "message": f"Invalid UETR format: {elem.text.strip()}",
            }
    return {
        "ruleId": "rule-006",
        "ruleName": "UETR Format (UUID v4)",
        "status": "passed",
        "message": "UETR conforms to UUID v4 format",
    }


def _check_rejection_reason(root: ET.Element) -> dict:
    """Rule 007: Rejection Requires Reason"""
    tx_sts = _find_element_text(root, "TxSts")
    if not tx_sts:
        return {
            "ruleId": "rule-007",
            "ruleName": "Rejection Requires Reason",
            "status": "skipped",
            "message": "No TxSts element found (not a status report)",
        }

    if tx_sts.strip() == "RJCT":
        reason_codes = _find_elements(root, "StsRsnInf")
        if not reason_codes:
            return {
                "ruleId": "rule-007",
                "ruleName": "Rejection Requires Reason",
                "status": "failed",
                "message": "TxSts is RJCT but StsRsnInf block is missing (mandatory for rejections)",
            }
        return {
            "ruleId": "rule-007",
            "ruleName": "Rejection Requires Reason",
            "status": "passed",
            "message": "Rejection includes required StsRsnInf",
        }
    return {
        "ruleId": "rule-007",
        "ruleName": "Rejection Requires Reason",
        "status": "passed",
        "message": f"TxSts is {tx_sts.strip()} (rule applies only to RJCT)",
    }


def _check_character_set(root: ET.Element) -> dict:
    """Rule 008: Allowed Character Set"""
    allowed_pattern = re.compile(r"^[a-zA-Z0-9\s/\-?:().,'+\r\nÀ-ÿ]*$")
    violations = []
    for elem in root.iter():
        if elem.text and elem.text.strip():
            text = elem.text.strip()
            if not allowed_pattern.match(text):
                bad_chars = set(c for c in text if not re.match(r"[a-zA-Z0-9\s/\-?:().,'+\r\nÀ-ÿ]", c))
                violations.append(f"{_strip_ns(elem.tag)}: invalid chars {bad_chars}")

    if violations and len(violations) > 3:
        violations = violations[:3] + [f"...and {len(violations) - 3} more"]

    if violations:
        return {
            "ruleId": "rule-008",
            "ruleName": "Allowed Character Set",
            "status": "warning",
            "message": f"Character issues: {'; '.join(violations)}",
        }
    return {
        "ruleId": "rule-008",
        "ruleName": "Allowed Character Set",
        "status": "passed",
        "message": "All text content uses allowed character set",
    }


def _check_date_formats(root: ET.Element) -> dict:
    """Rule 009: Valid Date Format"""
    date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
    datetime_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}")
    date_tags = ["CreDtTm", "IntrBkSttlmDt", "AccptncDtTm", "ReqdExctnDt", "OrgnlIntrBkSttlmDt"]

    issues = []
    for tag in date_tags:
        for elem in _find_elements(root, tag):
            if elem.text:
                val = elem.text.strip()
                if not date_pattern.match(val) and not datetime_pattern.match(val):
                    issues.append(f"{tag}: '{val}' is not valid ISO 8601")

    if issues:
        return {
            "ruleId": "rule-009",
            "ruleName": "Valid Date Format",
            "status": "failed",
            "message": "; ".join(issues),
        }
    return {
        "ruleId": "rule-009",
        "ruleName": "Valid Date Format",
        "status": "passed",
        "message": "All date/datetime fields are valid ISO 8601",
    }


def _check_bic_format(root: ET.Element) -> dict:
    """Rule 010: BIC/BICFI Format"""
    bic_pattern = re.compile(r"^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$")
    bic_tags = ["BICFI", "BIC"]
    issues = []
    found = False

    for tag in bic_tags:
        for elem in _find_elements(root, tag):
            found = True
            if elem.text:
                val = elem.text.strip()
                if not bic_pattern.match(val):
                    issues.append(f"{tag}: '{val}' does not match ISO 9362 pattern")

    if not found:
        return {
            "ruleId": "rule-010",
            "ruleName": "BIC/BICFI Format",
            "status": "skipped",
            "message": "No BIC/BICFI elements found",
        }
    if issues:
        return {
            "ruleId": "rule-010",
            "ruleName": "BIC/BICFI Format",
            "status": "failed",
            "message": "; ".join(issues),
        }
    return {
        "ruleId": "rule-010",
        "ruleName": "BIC/BICFI Format",
        "status": "passed",
        "message": "All BIC codes conform to ISO 9362",
    }


def _check_tx_count(root: ET.Element) -> dict:
    """Rule 012: Transaction Count Consistency"""
    nb_elem = _find_element_text(root, "NbOfTxs")
    if not nb_elem:
        return {
            "ruleId": "rule-012",
            "ruleName": "Transaction Count Consistency",
            "status": "skipped",
            "message": "No NbOfTxs element found",
        }

    try:
        declared = int(nb_elem.strip())
    except ValueError:
        return {
            "ruleId": "rule-012",
            "ruleName": "Transaction Count Consistency",
            "status": "failed",
            "message": f"NbOfTxs '{nb_elem}' is not a valid integer",
        }

    # Count transaction blocks
    tx_blocks = (
        _find_elements(root, "CdtTrfTxInf")
        or _find_elements(root, "TxInfAndSts")
        or _find_elements(root, "TxInf")
    )
    actual = len(tx_blocks)

    if actual != declared:
        return {
            "ruleId": "rule-012",
            "ruleName": "Transaction Count Consistency",
            "status": "failed",
            "message": f"Declared {declared} transactions, found {actual}",
        }
    return {
        "ruleId": "rule-012",
        "ruleName": "Transaction Count Consistency",
        "status": "passed",
        "message": f"Transaction count matches: {declared}",
    }


def validate_message(xml_string: str) -> dict:
    """
    Validate an ISO 20022 XML message against all rules.

    Args:
        xml_string: Raw ISO 20022 XML content

    Returns:
        Validation results with score and per-rule details
    """
    results = []

    # Rule 001: XML structure (always first)
    xml_result = _check_xml_structure(xml_string)
    results.append(xml_result)

    if xml_result["status"] == "failed":
        # Can't proceed with other checks if XML is invalid
        rules = _load_rules()
        for rule in rules[1:]:
            results.append({
                "ruleId": rule["id"],
                "ruleName": rule["name"],
                "status": "skipped",
                "message": "Skipped — XML structure validation failed",
            })
        return _build_response(results)

    # Parse XML for remaining checks
    root = ET.fromstring(xml_string)

    checks = [
        _check_mandatory_elements,
        _check_field_lengths,
        _check_positive_amounts,
        _check_currency_codes,
        _check_uetr_format,
        _check_rejection_reason,
        _check_character_set,
        _check_date_formats,
        _check_bic_format,
        _check_tx_count,
    ]

    for check_fn in checks:
        results.append(check_fn(root))

    return _build_response(results)


def _build_response(results: list) -> dict:
    """Build the final validation response."""
    total = len(results)
    passed = sum(1 for r in results if r["status"] == "passed")
    failed = sum(1 for r in results if r["status"] == "failed")
    warnings = sum(1 for r in results if r["status"] == "warning")
    skipped = sum(1 for r in results if r["status"] == "skipped")

    return {
        "passed": failed == 0,
        "score": f"{passed}/{total - skipped}",
        "summary": {
            "total": total,
            "passed": passed,
            "failed": failed,
            "warnings": warnings,
            "skipped": skipped,
        },
        "results": results,
    }
