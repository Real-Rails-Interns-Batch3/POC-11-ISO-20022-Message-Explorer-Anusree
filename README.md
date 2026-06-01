# ISO 20022 Message Explorer

The **ISO 20022 Message Explorer** is a high-performance, visually rich analytics dashboard for parsing, exploring, and navigating complex ISO 20022 payment messages. Built as a PoC (Proof of Concept), this explorer surfaces deeply nested XML fields into an intuitive 70/30 split UI, enabling users to trace payment chains, monitor compliance timelines, and understand global financial governance.

##  Features

- **Hierarchical Message Tree:** An interactive XML tree that maps complex tags (e.g., `FIToFICstmrCdtTrf`, `DbtrAgt`) to human-readable values.
- **Intelligent Glossary Tooltips:** Instantly translates obscure XML tags into clear definitions, data types, and mandatory/optional validation statuses.
- **Payment Chain Graph:** Uses `React Flow` and `Dagre` to dynamically visualize the relationship between the Debtor, Debtor Agent, Creditor Agent, and Creditor.
- **Governance Network Visualization:** Maps the hierarchy of ISO 20022 control, from ISO TC 68 down to Central Banks and commercial implementers.
- **Temporal Analysis:** Visualizes adoption growth using a dynamic `D3.js` sparkline.
- **Parsed Fields Engine:** Leverages `@tanstack/react-table` for highly performant tabular rendering of flat field data.
- **Dynamic Filtering:** Navigate flawlessly between FedNow, SEPA, and CHAPS message types (`pacs.008`, `pain.001`, `camt.054`, etc.) using instant client-side mock filtering.

## 🛠 Tech Stack

- **Framework:** React / Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Strictly enforcing a `#030712` obsidian background & precise 70/30 layout splits)
- **UI Components:** shadcn/ui
- **Network / Hierarchy Viz:** React Flow + Dagre
- **Temporal / Metric Viz:** D3.js
- **Tabular Data:** TanStack Table
- **Data Source:** Synthetic mocked ISO 20022 JSON representations (Python FastAPI ready for live integration)

##  Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Installation
Clone the repository and install the frontend dependencies:
```bash
cd frontend
npm install
```

### 3. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

##  Testing and Validation
The explorer ships with pre-generated UAT and VAR reports:
- `Visualization_Audit_Report.md`: Validates that all visual archetypes (Relational, Hierarchical, Temporal) map to the desired stack requirements.
- `Functional_UAT_Table.csv / .md`: Contains the test cases necessary to validate the handshake logic, local filtering, and intelligence panels.

##  Design Philosophy
The application adheres to strict aesthetic guidelines: **Premium, Dynamic, and Data-Dense**. It utilizes glassmorphic paneling, vibrant token-based colors (e.g., neon cyan for tagging, obsidian base), and micro-animations to ensure financial data feels modern and engaging.
