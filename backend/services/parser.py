"""
ISO 20022 XML Message Parser
Parses ISO 20022 XML strings into hierarchical JSON tree structures
with field-level annotations and glossary cross-references.
"""
import xml.etree.ElementTree as ET
import json
import re
from pathlib import Path
from typing import Optional

DATA_DIR = Path(__file__).parent.parent / "data"

_glossary_cache: Optional[dict] = None


def _load_glossary() -> dict:
    """Load and cache field glossary for cross-referencing."""
    global _glossary_cache
    if _glossary_cache is None:
        glossary_path = DATA_DIR / "field_glossary.json"
        with open(glossary_path, "r", encoding="utf-8") as f:
            entries = json.load(f)
        _glossary_cache = {entry["xmlTag"]: entry for entry in entries}
    return _glossary_cache


def _strip_namespace(tag: str) -> str:
    """Remove XML namespace prefix from tag name."""
    if "}" in tag:
        return tag.split("}", 1)[1]
    return tag


def _extract_namespace(tag: str) -> Optional[str]:
    """Extract namespace URI from a tag."""
    match = re.match(r"\{(.+?)\}", tag)
    return match.group(1) if match else None


def _detect_message_type(namespace: Optional[str]) -> Optional[str]:
    """Detect ISO 20022 message type from namespace URI."""
    if not namespace:
        return None
    # e.g., urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08
    match = re.search(r"(pacs|pain|camt|admi|head)\.\d{3}\.\d{3}\.\d{2}", namespace)
    return match.group(0) if match else None


def _parse_element(element: ET.Element, depth: int = 0, parent_path: str = "") -> dict:
    """Recursively parse an XML element into a tree node."""
    glossary = _load_glossary()
    tag = _strip_namespace(element.tag)
    current_path = f"{parent_path}/{tag}" if parent_path else tag

    node = {
        "tag": tag,
        "depth": depth,
        "path": current_path,
    }

    # Extract attributes (e.g., Ccy="USD")
    if element.attrib:
        node["attributes"] = dict(element.attrib)

    # Extract text value
    text = element.text
    if text and text.strip():
        node["value"] = text.strip()

    # Cross-reference with glossary
    if tag in glossary:
        entry = glossary[tag]
        node["glossaryRef"] = {
            "id": entry["id"],
            "name": entry["name"],
            "definition": entry["definition"],
            "dataType": entry["dataType"],
            "mandatory": entry["mandatory"],
        }
        if entry.get("maxLength"):
            node["glossaryRef"]["maxLength"] = entry["maxLength"]

    # Recursively parse children
    children = []
    for child in element:
        children.append(_parse_element(child, depth + 1, current_path))

    if children:
        node["children"] = children

    return node


def parse_xml(xml_string: str) -> dict:
    """
    Parse an ISO 20022 XML string into a structured tree.

    Args:
        xml_string: Raw ISO 20022 XML content

    Returns:
        Dictionary with parsed tree, message metadata, and statistics
    """
    try:
        root = ET.fromstring(xml_string)
    except ET.ParseError as e:
        return {
            "success": False,
            "error": f"XML Parse Error: {str(e)}",
            "tree": None,
            "metadata": None,
        }

    # Extract metadata
    namespace = _extract_namespace(root.tag)
    message_type = _detect_message_type(namespace)

    # Parse tree
    tree = _parse_element(root)

    # Compute statistics
    stats = _compute_stats(tree)

    return {
        "success": True,
        "error": None,
        "tree": tree,
        "metadata": {
            "messageType": message_type,
            "namespace": namespace,
            "rootElement": _strip_namespace(root.tag),
        },
        "statistics": stats,
    }


def _compute_stats(node: dict, stats: Optional[dict] = None) -> dict:
    """Compute statistics about the parsed tree."""
    if stats is None:
        stats = {
            "totalElements": 0,
            "totalFields": 0,
            "maxDepth": 0,
            "glossaryMatches": 0,
            "categories": {},
        }

    stats["totalElements"] += 1
    if node["depth"] > stats["maxDepth"]:
        stats["maxDepth"] = node["depth"]

    if "value" in node:
        stats["totalFields"] += 1

    if "glossaryRef" in node:
        stats["glossaryMatches"] += 1

    for child in node.get("children", []):
        _compute_stats(child, stats)

    return stats


def flatten_tree(node: dict, result: Optional[list] = None) -> list:
    """Flatten a parsed tree into a list of field entries."""
    if result is None:
        result = []

    entry = {
        "path": node["path"],
        "tag": node["tag"],
        "depth": node["depth"],
    }

    if "value" in node:
        entry["value"] = node["value"]
    if "attributes" in node:
        entry["attributes"] = node["attributes"]
    if "glossaryRef" in node:
        entry["glossaryRef"] = node["glossaryRef"]

    result.append(entry)

    for child in node.get("children", []):
        flatten_tree(child, result)

    return result
