# ISO 20022 Message Explorer

The **ISO 20022 Message Explorer** is a high-performance, visually rich analytics dashboard for parsing, exploring, and navigating ISO 20022 payment messages. Built as a PoC (Proof of Concept), this explorer surfaces deeply nested XML fields into an intuitive 70/30 split UI, enabling users to trace payment chains, monitor compliance timelines, and understand global financial governance.

> **Note:** The application ships with synthetic mock data and runs fully client-side by default. The Python/FastAPI backend is optional — when unavailable, the frontend falls back to local mock fixtures automatically.

##  Features

- **Hierarchical Message Tree:** An interactive XML tree that maps complex tags (e.g., `FIToFICstmrCdtTrf`, `DbtrAgt`) to human-readable values.
- **Intelligent Glossary Tooltips:** Instantly translates obscure XML tags into clear definitions, data types, and mandatory/optional validation statuses.
- **Payment Chain Graph:** Uses `React Flow` and `Dagre` to visualize the relationship between the Debtor, Debtor Agent, Creditor Agent, and Creditor. The four-node topology is fixed to the pacs.008 FI-to-FI transfer shape — entity names are extracted from the parsed message.
- **Governance Network Visualization:** Maps the hierarchy of ISO 20022 control, from ISO TC 68 down to Central Banks and commercial implementers.
- **Message Validation Sandbox:** Client-side validator with 11 active schema and business rules. Attempts to call the backend API and falls back to local rules when the backend is unavailable.
- **Parsed Fields Engine:** Leverages `@tanstack/react-table` for highly performant tabular rendering of flat field data.
- **Dynamic Filtering:** Navigate between FedNow and SEPA message types (`pacs.008`, `pacs.002`, `pacs.004`, `pacs.028`, `pain.001`, `pain.013`, `camt.056`) using instant client-side mock filtering.

## Scope

This PoC covers **FedNow (US)** and **SEPA (EU)** networks only.

## 🛠 Tech Stack

- **Framework:** React / Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Strictly enforcing a `#030712` obsidian background & precise 70/30 layout splits)
- **UI Components:** shadcn/ui
- **Network / Hierarchy Viz:** `@xyflow/react` + Dagre
- **Temporal / Metric Viz:** D3.js
- **Tabular Data:** TanStack Table
- **Data Source:** Synthetic mocked ISO 20022 JSON representations (Python FastAPI backend optional for live integration)

##  Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm
- Python 3.10+ (optional, for backend)

### 2. Frontend — Installation & Dev Server
Clone the repository and install the frontend dependencies:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The app will run on mock data if the backend is not started.

### 3. Backend — Installation & Dev Server (Optional)
The backend is a FastAPI app that serves the same data as the mock fixtures. It is **not required** to run the frontend.

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment variables
copy .env.example .env    # Windows
# cp .env.example .env    # macOS/Linux

# Start the development server
uvicorn main:app --reload --port 8000
```
The API will be available at [http://localhost:8000](http://localhost:8000) with interactive docs at [http://localhost:8000/docs](http://localhost:8000/docs).

##  Testing and Validation
The explorer ships with pre-generated UAT and VAR reports:
- `Visualization_Audit_Report.md`: Validates that all visual archetypes (Relational, Hierarchical, Temporal) map to the desired stack requirements.
- `Functional_UAT_Table.csv / .md`: Contains the test cases necessary to validate the handshake logic, local filtering, and intelligence panels.

##  Design Philosophy
The application adheres to strict aesthetic guidelines: **Premium, Dynamic, and Data-Dense**. It utilizes glassmorphic paneling, vibrant token-based colors (e.g., neon cyan for tagging, obsidian base), and micro-animations to ensure financial data feels modern and engaging.
