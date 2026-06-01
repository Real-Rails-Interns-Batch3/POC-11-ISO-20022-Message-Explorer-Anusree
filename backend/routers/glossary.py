"""
Glossary Router — Searchable field glossary for ISO 20022 data elements.
"""
import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/glossary", tags=["glossary"])

DATA_DIR = Path(__file__).parent.parent / "data"

_glossary_cache: Optional[list] = None


def _load_glossary() -> list:
    global _glossary_cache
    if _glossary_cache is None:
        with open(DATA_DIR / "field_glossary.json", "r", encoding="utf-8") as f:
            _glossary_cache = json.load(f)
    return _glossary_cache


@router.get("")
def get_glossary(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    mandatory: Optional[bool] = Query(None),
):
    """Get field glossary with optional search and filtering."""
    glossary = _load_glossary()
    results = glossary

    # Filter by search query
    if search:
        q = search.lower()
        results = [
            entry for entry in results
            if q in entry["xmlTag"].lower()
            or q in entry["name"].lower()
            or q in entry["definition"].lower()
        ]

    # Filter by category
    if category:
        results = [
            entry for entry in results
            if entry["category"].lower() == category.lower()
        ]

    # Filter by mandatory status
    if mandatory is not None:
        results = [
            entry for entry in results
            if entry["mandatory"] == mandatory
        ]

    # Get unique categories for filtering UI
    categories = sorted(set(e["category"] for e in glossary))

    return {
        "count": len(results),
        "categories": categories,
        "entries": results,
    }


@router.get("/{field_id}")
def get_field(field_id: str):
    """Get a specific glossary entry by ID or XML tag."""
    glossary = _load_glossary()
    for entry in glossary:
        if entry["id"] == field_id or entry["xmlTag"] == field_id:
            return entry

    return {"error": f"Field '{field_id}' not found"}
