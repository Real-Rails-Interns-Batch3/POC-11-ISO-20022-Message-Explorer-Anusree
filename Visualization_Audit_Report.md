# Visualization Audit Report (VAR)

**Project:** ISO 20022 Message Explorer
**Date:** May 31, 2026
**Reviewer:** Senior UX Architect

## 1. Requirement Match
**Criterion:** Does the visual archetype (Geo/Relational/Temporal) match the Excel's intent?
**Status:** **Pass**

**Analysis:**
- **Relational Archetype (Pass):** The payment chain (`Debtor → Debtor Agent → Creditor Agent → Creditor`) and the governance network are successfully mapped using `React Flow` and `Dagre`, satisfying the core flow requirement.
- **Temporal Archetype (Pass):** The message lifecycle (`CreDtTm`, `AccptncDtTm`, etc.) is effectively mapped to a chronological sequence diagram in the new Timeline component.
- **Stack Alignment (Pass):** The `D3.js` stack requirement has been implemented via the `D3Sparkline` component which tracks the adoption metrics dynamically.

---

## 2. DNA Check
**Criterion:** Is the background strictly #030712? Is the 70/30 split enforced?
**Status:** **Pass**

**Analysis:**
- **Background:** The `--bg-obsidian` token maps exactly to `#030712` in `globals.css` and is universally applied to the body layer, ensuring strict adherence to the brand palette.
- **70/30 Split:** Enforced directly on the `<main>` and `<aside>` columns in `page.tsx` using `lg:w-[70%]` and `lg:w-[30%]`. Furthermore, responsive collapse guards (`flex-col lg:flex-row` and `min-w-[700px]` / `min-w-[360px]`) successfully maintain the precise ratio on desktop while providing a graceful fallback on mobile.

---

## 3. Data Mapping
**Criterion:** Is the data from the [DataSource] being represented accurately in the 70% stage?
**Status:** **Pass**

**Analysis:**
- **Tree and Graph Mapping (Pass):** The parsed message JSON structure is accurately driving both the hierarchical `TreeNode` component and the `PaymentChainGraph` without data loss. Glossary metadata is cleanly surfaceable via interactive tooltips on the tree nodes.
- **Tabular Data Mapping (Pass):** The Excel requirement specifies the use of **TanStack Table**. The "Parsed Fields" and "MT ↔ MX Compare" views correctly instantiate the `@tanstack/react-table` engine.
