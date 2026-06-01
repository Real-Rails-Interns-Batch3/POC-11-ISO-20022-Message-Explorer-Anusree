"""
Messages Router — CRUD + Parse + Validate endpoints for ISO 20022 messages.
"""
import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from services.parser import parse_xml, flatten_tree
from services.validator import validate_message

router = APIRouter(prefix="/api/messages", tags=["messages"])

DATA_DIR = Path(__file__).parent.parent / "data"

_messages_cache: Optional[list] = None


def _load_messages() -> list:
    global _messages_cache
    if _messages_cache is None:
        with open(DATA_DIR / "mock_messages.json", "r", encoding="utf-8") as f:
            _messages_cache = json.load(f)
    return _messages_cache


class ParseRequest(BaseModel):
    xml: str


class ValidateRequest(BaseModel):
    xml: str


@router.get("")
def list_messages(
    message_type: Optional[str] = Query(None, alias="type"),
    network: Optional[str] = Query(None),
    direction: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    """List all sample messages with optional filtering."""
    messages = _load_messages()
    results = []

    for msg in messages:
        # Apply filters
        if message_type and msg["type"] != message_type:
            continue
        if network and msg["network"].lower() != network.lower():
            continue
        if direction and msg["direction"].lower() != direction.lower():
            continue
        if category and msg["category"].lower() != category.lower():
            continue

        results.append({
            "id": msg["id"],
            "type": msg["type"],
            "title": msg["title"],
            "description": msg["description"],
            "network": msg["network"],
            "direction": msg["direction"],
            "category": msg["category"],
            "status": msg["status"],
        })

    return {
        "count": len(results),
        "messages": results,
        "filters": {
            "types": sorted(set(m["type"] for m in messages)),
            "networks": sorted(set(m["network"] for m in messages)),
            "directions": sorted(set(m["direction"] for m in messages)),
            "categories": sorted(set(m["category"] for m in messages)),
        },
    }


@router.get("/{message_id}")
def get_message(message_id: str):
    """Get a specific message with full details including parsed tree."""
    messages = _load_messages()
    for msg in messages:
        if msg["id"] == message_id:
            # Parse the raw XML for live tree
            parsed = parse_xml(msg["rawXml"])
            return {
                **msg,
                "liveParsed": parsed,
            }

    raise HTTPException(status_code=404, detail=f"Message '{message_id}' not found")


@router.post("/parse")
def parse_message(request: ParseRequest):
    """Parse a raw ISO 20022 XML string into a structured tree."""
    if not request.xml or not request.xml.strip():
        raise HTTPException(status_code=400, detail="XML content is required")

    result = parse_xml(request.xml)

    if not result["success"]:
        raise HTTPException(status_code=422, detail=result["error"])

    # Also provide flattened view
    flat = flatten_tree(result["tree"]) if result["tree"] else []

    return {
        **result,
        "flatFields": flat,
    }


@router.post("/validate")
def validate_msg(request: ValidateRequest):
    """Validate an ISO 20022 XML message against all rules."""
    if not request.xml or not request.xml.strip():
        raise HTTPException(status_code=400, detail="XML content is required")

    return validate_message(request.xml)
