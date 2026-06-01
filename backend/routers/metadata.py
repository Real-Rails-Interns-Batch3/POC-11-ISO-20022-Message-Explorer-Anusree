"""
Metadata Router — Rail metadata, Why This Matters, Who Controls the Rail.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/metadata", tags=["metadata"])


@router.get("")
def get_metadata():
    """Get full rail metadata for the Intelligence Sidebar."""
    return {
        "projectId": "11",
        "title": "ISO 20022 Message Explorer",
        "subtitle": "Real Rails Intelligence Library",
        "railCategory": "Payments",
        "version": "1.0.0",

        "metrics": [
            {
                "label": "Message Types Indexed",
                "value": "8",
                "trend": "active",
                "description": "pacs.008, pacs.002, pacs.004, pacs.028, pain.001, pain.013, camt.056 + variants",
            },
            {
                "label": "Fields Mapped",
                "value": "32+",
                "trend": "active",
                "description": "Complete ISO 20022 data dictionary coverage for payment messages",
            },
            {
                "label": "Validation Rules",
                "value": "14",
                "trend": "stable",
                "description": "Schema, business rules, character set, and network-specific checks",
            },
            {
                "label": "Networks Covered",
                "value": "3",
                "trend": "active",
                "description": "FedNow (US instant), SEPA (EU), SWIFT CBPR+ (cross-border)",
            },
        ],

        "whyThisMatters": {
            "title": "Why This Matters",
            "headline": "The Backbone of Next-Gen Payments is Being Rewired",
            "content": [
                "ISO 20022 replaces legacy SWIFT MT formats with structured XML, enabling richer data and faster processing globally.",
                "For builders: Better compliance screening and >95% straight-through processing. It's table stakes for modern infrastructure.",
                "For allocators: The 2025 migration deadline is driving massive enterprise spend in payments tech.",
                "For everyday viewers: Faster processing, better tracking, and fewer errors for international transfers.",
            ],
            "keyInsight": "The largest coordinated technology upgrade in financial infrastructure history.",
            "sources": ["FedNow Service", "European Payments Council", "SWIFT"],
        },

        "whoControlsTheRail": {
            "title": "Who Controls the Rail",
            "headline": "Governance & Power Dynamics",
            "summary": "ISO TC 68 sets the standard, SWIFT maintains the repository as Registration Authority, but central banks (Fed, ECB, BoE) drive adoption by mandating migration for their domestic payment infrastructures — giving them outsized influence over the global payments architecture.",
            "hierarchy": [
                {
                    "level": 1,
                    "entity": "ISO Technical Committee 68 (TC 68)",
                    "role": "Standard Setter",
                    "description": "Top-level ISO committee for financial services standards. Ultimate authority over ISO 20022 development and evolution.",
                    "influence": "high",
                },
                {
                    "level": 2,
                    "entity": "Registration Management Group (RMG)",
                    "role": "Registration Oversight",
                    "description": "Senior industry experts who approve new message definitions and ensure standard coherence across all financial domains.",
                    "influence": "high",
                },
                {
                    "level": 3,
                    "entity": "Standards Evaluation Groups (SEGs)",
                    "role": "Domain Experts",
                    "description": "Specialized groups for payments, securities, trade finance, and FX. Evaluate and approve message proposals.",
                    "influence": "medium",
                },
                {
                    "level": 4,
                    "entity": "SWIFT (Registration Authority)",
                    "role": "Repository Guardian",
                    "description": "Maintains the ISO 20022 Financial Repository, publishes message schemas, and manages iso20022.org. Not the owner — the custodian.",
                    "influence": "high",
                },
                {
                    "level": 5,
                    "entity": "Central Banks & Market Infrastructures",
                    "role": "Adoption Drivers",
                    "description": "Federal Reserve (FedNow/Fedwire), ECB (TARGET2/T2), Bank of England (CHAPS). Mandate migration timelines and define local usage rules.",
                    "influence": "very-high",
                },
                {
                    "level": 6,
                    "entity": "Commercial Banks & Corporates",
                    "role": "Implementers",
                    "description": "Build, test, and deploy ISO 20022 capabilities. Bear the cost of migration but gain from richer data and efficiency.",
                    "influence": "medium",
                },
            ],
            "keyTension": "While ISO and SWIFT set the technical standard, central banks hold the real power — they can mandate adoption timelines that force entire banking ecosystems to comply, often at significant cost.",
        },

        "dataSources": [
            {
                "name": "FedNow Service",
                "type": "Public Documentation",
                "status": "active",
                "description": "Federal Reserve's instant payment service. Native ISO 20022 implementation launched July 2023.",
                "url": "https://www.frbservices.org/financial-services/fednow",
            },
            {
                "name": "European Payments Council",
                "type": "Public Documentation",
                "status": "active",
                "description": "Governs SEPA payment schemes across 36 European countries. Full ISO 20022 adoption since 2018.",
                "url": "https://www.europeanpaymentscouncil.eu",
            },
            {
                "name": "ISO 20022 Repository",
                "type": "Reference",
                "status": "active",
                "description": "Official message catalog maintained by SWIFT as Registration Authority.",
                "url": "https://www.iso20022.org",
            },
        ],

        "filters": {
            "messageTypes": [
                {"value": "pacs.008.001.08", "label": "pacs.008 — Credit Transfer"},
                {"value": "pacs.002.001.10", "label": "pacs.002 — Status Report"},
                {"value": "pacs.004.001.09", "label": "pacs.004 — Payment Return"},
                {"value": "pacs.028.001.03", "label": "pacs.028 — Status Request"},
                {"value": "pain.001.001.03", "label": "pain.001 — Payment Initiation"},
                {"value": "pain.013.001.07", "label": "pain.013 — Request for Payment"},
                {"value": "camt.056.001.08", "label": "camt.056 — Cancellation"},
            ],
            "networks": [
                {"value": "FedNow", "label": "FedNow (US Instant)"},
                {"value": "SEPA", "label": "SEPA (European)"},
                {"value": "SWIFT", "label": "SWIFT CBPR+"},
            ],
            "directions": [
                {"value": "inbound", "label": "Inbound"},
                {"value": "outbound", "label": "Outbound"},
            ],
        },
    }
