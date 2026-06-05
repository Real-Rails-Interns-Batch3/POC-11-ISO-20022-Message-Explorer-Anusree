# ISO 20022 Message Explorer

> **Real Rails Intelligence Library · PoC #11 · Rail: Payments**

The **ISO 20022 Message Explorer** is a full-stack analytics dashboard for parsing, exploring, and validating ISO 20022 payment messages. Built as a Proof of Concept for the Real Rails Internship (Batch 3), it surfaces deeply nested XML structures into an intuitive 70/30 split UI — enabling users to trace payment flows, inspect compliance, and understand the ISO 20022 governance model.

> **Scope:** FedNow (US) and SEPA (EU) networks only.
>
> **Data:** The application ships with real ISO 20022 sample messages published by the Federal Reserve (pacs.008, pacs.002) and EPC (pain.001). The backend is optional — the frontend falls back to local mock fixtures automatically when it is not running.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [API Reference](#api-reference)
- [Validation Rules](#validation-rules)
- [Data Sources](#data-sources)
- [UI Components](#ui-components)
- [Known Limitations](#known-limitations)
- [Testing & Reports](#testing--reports)

---

## Features

| Feature | Description |
|---|---|
| **Payload Library** | Browse 8 ISO 20022 messages across pacs, pain, and camt families |
| **Hierarchical XML Tree** | Interactive collapsible tree mapping raw tags (e.g. `FIToFICstmrCdtTrf`) to human-readable labels |
| **Parsed Fields Table** | Flat tabular view of all extracted fields with types and values, powered by TanStack Table |
| **Glossary Tooltips** | Hover any XML tag for its full definition, data type, format, and mandatory/optional status |
| **Message Validation Sandbox** | Paste any ISO 20022 XML and run 12 active rules including real XSD schema compliance |
| **Payment Chain Graph** | React Flow + Dagre visualisation of the Debtor → Debtor Agent → Creditor Agent → Creditor chain |
| **Governance Network Graph** | Hierarchy of ISO 20022 control: ISO TC 68 → BIS → Central Banks → Commercial implementers |
| **Message Timeline** | D3.js temporal visualisation of message activity |
| **MT vs MX Comparison** | Side-by-side mapping of legacy MT field codes to ISO 20022 MX equivalents |
| **Message Comparison** | Diff two ISO 20022 messages side by side |
| **Dynamic Filtering** | Filter messages by network (FedNow / SEPA), direction, status, and message type |

---

## Architecture

```
iso20022-explorer/
├── frontend/          Next.js 14 + TypeScript (port 3000)
│   └── calls backend at localhost:8000 — falls back to mock-data.ts if unavailable
│
├── backend/           FastAPI + Python 3.10+ (port 8000)
│   ├── serves mock_messages.json (contains real Fed/EPC XML)
│   ├── runs real XSD validation via lxml
│   └── exposes 4 API routers: messages, glossary, comparison, metadata
│
└── data/
    ├── mock_messages.json        — 8 pre-loaded ISO 20022 messages
    ├── schemas/                  — 8 real ISO 20022 XSD files (moov-io/fednow20022)
    └── validation_rules.json     — rule definitions for the UI
```

**Data flow:**
```
Browser → GET /api/messages → FastAPI → mock_messages.json
       → POST /api/messages/{id}/validate → validator.py (XSD + custom rules)
       → POST /api/messages/{id}/parse    → parser.py
       ↓ (if backend is down)
       → mock-data.ts (client-side fallback, same XML content)
```

---

## Tech Stack

### Frontend
| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Graph / Network Viz | `@xyflow/react` + Dagre |
| Temporal Viz | D3.js |
| Tabular Data | TanStack Table v8 |
| Icons | lucide-react `^0.475.0` |

### Backend
| Layer | Library |
|---|---|
| Framework | FastAPI |
| Language | Python 3.10+ |
| XML Parsing | `xml.etree.ElementTree` (stdlib) |
| XSD Validation | `lxml >= 5.0.0` |
| Server | Uvicorn |

---

## Project Structure

```
iso20022-explorer/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx                  # Root page — message card grid
│   │   ├── components/
│   │   │   ├── Sidebar.tsx               # Left-rail intelligence panel
│   │   │   ├── MessageExplorer.tsx       # Main 70/30 split explorer
│   │   │   ├── PayloadLibrary.tsx        # Message browser & search
│   │   │   ├── ValidationView.tsx        # Validation sandbox UI
│   │   │   ├── PaymentChainGraph.tsx     # React Flow payment chain
│   │   │   ├── GovernanceGraph.tsx       # ISO governance hierarchy
│   │   │   ├── GlossaryView.tsx          # Tag-definition lookup
│   │   │   ├── ComparisonView.tsx        # MT vs MX side-by-side
│   │   │   ├── ParsedFieldsTable.tsx     # TanStack Table field renderer
│   │   │   ├── MessageTimeline.tsx       # D3 timeline
│   │   │   └── D3Sparkline.tsx           # Reusable sparkline component
│   │   └── lib/
│   │       ├── mock-data.ts              # Frontend fallback data (real XML embedded)
│   │       └── utils.ts
│   ├── package.json
│   └── next.config.js
│
├── backend/
│   ├── main.py                           # FastAPI app entry point + CORS config
│   ├── requirements.txt
│   ├── .env.example
│   ├── routers/
│   │   ├── messages.py                   # GET /api/messages, POST /validate, /parse
│   │   ├── glossary.py                   # GET /api/glossary
│   │   ├── comparison.py                 # GET /api/comparison
│   │   └── metadata.py                   # GET /api/metadata (sidebar intelligence)
│   ├── services/
│   │   ├── parser.py                     # XML field extractor + tree builder
│   │   └── validator.py                  # 12 active validation rules (incl. XSD)
│   └── data/
│       ├── mock_messages.json            # 8 ISO 20022 messages (real XML content)
│       ├── validation_rules.json         # Rule definitions
│       └── schemas/                      # Real ISO 20022 XSD files
│           ├── pacs.008.001.08.xsd
│           ├── pacs.002.001.10.xsd
│           ├── pacs.004.001.10.xsd
│           ├── pacs.028.001.03.xsd
│           ├── pain.013.001.07.xsd
│           ├── camt.056.001.08.xsd
│           ├── fednow-incoming_external.xsd
│           └── fednow-outgoing_external.xsd
│
├── README.md
├── Functional_UAT_Table.md
├── Functional_UAT_Table.csv
└── Visualization_Audit_Report.md
```

---

## Getting Started

### Prerequisites
- **Node.js** v18 or later
- **npm** v9 or later
- **Python** 3.10 or later *(optional — only needed for the backend)*

---

### Frontend

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs fully on mock data if the backend is not started — no extra setup needed for read-only exploration.

---

### Backend

The backend is optional. It provides the same data as the frontend mock fixtures plus real XSD validation via `lxml`.

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment (recommended)
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Set up environment variables
copy .env.example .env       # Windows
# cp .env.example .env       # macOS / Linux

# 5. Start the FastAPI development server
uvicorn main:app --reload --port 8000
```

| URL | Purpose |
|---|---|
| `http://localhost:8000` | Health check / API root |
| `http://localhost:8000/docs` | Swagger UI (interactive API docs) |
| `http://localhost:8000/redoc` | ReDoc API reference |

---

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/messages` | List all messages (supports `?network=`, `?type=`, `?status=` filters) |
| `GET` | `/api/messages/{id}` | Get full message including raw XML |
| `POST` | `/api/messages/{id}/parse` | Parse XML into structured field tree |
| `POST` | `/api/messages/{id}/validate` | Run all 12 validation rules against the message |
| `GET` | `/api/glossary` | Full ISO 20022 tag glossary |
| `GET` | `/api/glossary/search?q=` | Search glossary by tag name or description |
| `GET` | `/api/comparison` | MT → MX field mapping table |
| `GET` | `/api/metadata` | Sidebar intelligence data (stats, data sources, filters) |

---

## Validation Rules

The validator (`backend/services/validator.py`) runs 12 active rules on every submitted XML:

| Rule ID | Name | Method |
|---|---|---|
| `rule-000` | **XSD Schema Compliance** | Real `lxml` XSD validation against moov-io/fednow20022 schemas |
| `rule-001` | Valid XML Structure | `xml.etree.ElementTree` parse check |
| `rule-002` | Mandatory Elements Present | Checks `MsgId`, `CreDtTm`, `NbOfTxs` |
| `rule-003` | Field Length Compliance | ISO 20022 max-length per field |
| `rule-004` | Positive Amount Validation | `IntrBkSttlmAmt`, `InstdAmt` > 0 |
| `rule-005` | Valid Currency Code | ISO 4217 allowlist |
| `rule-006` | UETR Format (UUID v4) | Regex match on `UETR` / `OrgnlUETR` |
| `rule-007` | Rejection Requires Reason | `RJCT` TxSts must include `StsRsnInf` |
| `rule-008` | Allowed Character Set | SWIFT Latin character set |
| `rule-009` | Valid Date Format | ISO 8601 date and datetime |
| `rule-010` | BIC / BICFI Format | ISO 9362 regex |
| `rule-012` | Transaction Count Consistency | `NbOfTxs` matches actual transaction blocks |

> **XSD sources:** `pacs.008.001.08`, `pacs.002.001.10`, `pacs.028.001.03`, `pain.013.001.07`, `camt.056.001.08` — all from [moov-io/fednow20022](https://github.com/moov-io/fednow20022) (Federal Reserve, MIT licence).

---

## Data Sources

All sample XML in this project comes from real published sources — not hand-written synthetic data.

| Message | Source | Licence |
|---|---|---|
| `pacs.008` — FedNow Credit Transfer | [moov-io/fednow20022](https://github.com/moov-io/fednow20022) — Federal Reserve sample | MIT |
| `pacs.002` — FedNow Payment Status | [moov-io/fednow20022](https://github.com/moov-io/fednow20022) — Federal Reserve sample | MIT |
| `pain.001` — SEPA Credit Transfer Initiation | [salesking/sepa_king](https://github.com/salesking/sepa_king) — EPC-aligned sample | MIT |
| XSD schemas | [moov-io/fednow20022/xsd/iso](https://github.com/moov-io/fednow20022/tree/master/xsd/iso) | MIT |
| ISO 20022 standard reference | [iso20022.org](https://www.iso20022.org) | ISO |

> **No API keys required.** All data is sourced from public, freely accessible GitHub repositories under MIT licence.

---

## UI Components

| Component | File | Purpose |
|---|---|---|
| Root Page | `app/page.tsx` | Message type cards — entry point to the explorer |
| Sidebar | `Sidebar.tsx` | Left-rail: network stats, data sources, message type guide |
| Message Explorer | `MessageExplorer.tsx` | 70/30 split: XML tree (left) + detail panels (right) |
| Payload Library | `PayloadLibrary.tsx` | Searchable, filterable message browser |
| Validation View | `ValidationView.tsx` | Paste XML → run 12 rules → see per-rule results |
| Payment Chain Graph | `PaymentChainGraph.tsx` | React Flow graph: Debtor → DbtrAgt → CdtrAgt → Creditor |
| Governance Graph | `GovernanceGraph.tsx` | ISO 20022 authority hierarchy visualisation |
| Glossary View | `GlossaryView.tsx` | Tag search with definitions, types, formats |
| Comparison View | `ComparisonView.tsx` | MT vs MX field-by-field mapping table |
| Parsed Fields Table | `ParsedFieldsTable.tsx` | TanStack Table flat field list |
| Message Timeline | `MessageTimeline.tsx` | D3.js temporal activity chart |

---

## Known Limitations

| Area | Limitation |
|---|---|
| **Live data** | No live FedNow or SEPA transaction feed — requires a banking licence to access production rails. Samples are real published references, not live transactions. |
| **Payment chain graph** | Topology is fixed to the pacs.008 FI-to-FI four-node shape. It is not dynamically derived from arbitrary parsed XML. |
| **Filtering** | All message filtering is client-side on the static JSON fixture. There is no server-side query engine. |
| **SEPA XSD** | `pain.001.001.03` XSD is not included in moov-io's FedNow-focused repo. Rule-000 skips XSD validation for this message type and falls back to the 11 custom rules. |
| **Scope** | FedNow and SEPA only. Other rails (Fedwire, SWIFT CBPR+, TIPS) are out of scope for this PoC. |

---

## Testing & Reports

Pre-generated reports are included at the project root:

| File | Contents |
|---|---|
| [`Functional_UAT_Table.md`](./Functional_UAT_Table.md) | User Acceptance Testing — 12+ test cases covering message loading, filtering, parsing, validation, and graph rendering |
| [`Functional_UAT_Table.csv`](./Functional_UAT_Table.csv) | Same UAT data in CSV format |
| [`Visualization_Audit_Report.md`](./Visualization_Audit_Report.md) | Audit of all visual archetypes (Relational, Hierarchical, Temporal) against stack requirements and known limitations |

---

## Design Philosophy

The application follows three principles:

- **Premium** — Glassmorphic panels, obsidian (`#030712`) base, neon cyan accents, token-based colour system
- **Data-Dense** — Every screen carries maximum information without clutter; 70/30 layout keeps context visible alongside detail
- **Honest** — UI, docs, and validation results only claim what the code actually delivers
