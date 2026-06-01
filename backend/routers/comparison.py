"""
Comparison Router — MT vs MX field mapping and migration data.
"""
import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter

router = APIRouter(prefix="/api/comparison", tags=["comparison"])

DATA_DIR = Path(__file__).parent.parent / "data"

_mapping_cache: Optional[list] = None


def _load_mapping() -> list:
    global _mapping_cache
    if _mapping_cache is None:
        with open(DATA_DIR / "mt_mx_mapping.json", "r", encoding="utf-8") as f:
            _mapping_cache = json.load(f)
    return _mapping_cache


@router.get("")
def get_comparison():
    """Get full MT103 ↔ pacs.008 field mapping table."""
    mapping = _load_mapping()
    return {
        "count": len(mapping),
        "mapping": mapping,
    }


@router.get("/summary")
def get_comparison_summary():
    """Get key comparison metrics and migration timeline."""
    mapping = _load_mapping()

    # Count fields with no MT equivalent
    new_fields = sum(1 for m in mapping if m["mtTag"] == "N/A")
    mapped_fields = len(mapping) - new_fields

    return {
        "metrics": [
            {
                "label": "Data Fields",
                "mtValue": "15 tags",
                "mxValue": "25+ elements",
                "improvement": "+67% more granular data points",
                "icon": "layers",
            },
            {
                "label": "Remittance Capacity",
                "mtValue": "140 chars",
                "mxValue": "9,000 chars",
                "improvement": "64x increase in payment detail",
                "icon": "file-text",
            },
            {
                "label": "Address Format",
                "mtValue": "Free-text (4×35)",
                "mxValue": "Structured XML fields",
                "improvement": "Machine-readable for AML screening",
                "icon": "map-pin",
            },
            {
                "label": "STP Rate",
                "mtValue": "~75-80%",
                "mxValue": ">95%",
                "improvement": "Fewer manual repairs needed",
                "icon": "zap",
            },
            {
                "label": "Global Tracking",
                "mtValue": "None built-in",
                "mxValue": "UETR (UUID v4)",
                "improvement": "End-to-end visibility across all banks",
                "icon": "globe",
            },
            {
                "label": "New MX-Only Fields",
                "mtValue": "—",
                "mxValue": f"{new_fields} fields",
                "improvement": "Purpose codes, LEI, structured IDs",
                "icon": "plus-circle",
            },
        ],
        "timeline": [
            {
                "date": "2004",
                "event": "ISO 20022 Standard Published",
                "description": "ISO publishes the initial financial messaging standard, laying groundwork for MX messages.",
                "status": "completed",
            },
            {
                "date": "2018-2020",
                "event": "SEPA Full Adoption",
                "description": "European Payments Council mandates ISO 20022 for all SEPA Credit Transfers and Direct Debits.",
                "status": "completed",
            },
            {
                "date": "March 2023",
                "event": "SWIFT Coexistence Begins",
                "description": "SWIFT network begins supporting both MT and MX messages simultaneously for cross-border payments.",
                "status": "completed",
            },
            {
                "date": "July 2023",
                "event": "FedNow Launch",
                "description": "Federal Reserve launches FedNow instant payment service, built natively on ISO 20022.",
                "status": "completed",
            },
            {
                "date": "November 2025",
                "event": "MT Retirement Deadline",
                "description": "SWIFT retires MT payment messages (MT103, MT202) for cross-border payments. Full MX migration required.",
                "status": "completed",
            },
            {
                "date": "November 2026",
                "event": "Structured Address Mandate",
                "description": "All ISO 20022 messages must use fully structured postal addresses. No more unstructured address lines.",
                "status": "upcoming",
            },
        ],
        "fieldStats": {
            "totalMappings": len(mapping),
            "directMappings": mapped_fields,
            "newMxFields": new_fields,
        },
    }
