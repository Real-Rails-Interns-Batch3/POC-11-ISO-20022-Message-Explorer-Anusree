// ISO 20022 Message Explorer — Mock Data for Frontend Fallback
import type {
  MessageListResponse,
  GlossaryResponse,
  ComparisonMapping,
  ComparisonSummary,
  RailMetadata,
} from "@/types";

// === Metadata ===
export const MOCK_METADATA: RailMetadata = {
  projectId: "11",
  title: "ISO 20022 Message Explorer",
  subtitle: "Real Rails Intelligence Library",
  railCategory: "Payments",
  version: "1.0.0",
  metrics: [
    {
      label: "Message Types Indexed",
      value: "8",
      trend: "active",
      description: "pacs.008, pacs.002, pacs.004, pacs.028, pain.001, pain.013, camt.056 + variants",
    },
    {
      label: "Fields Mapped",
      value: "32+",
      trend: "active",
      description: "Complete ISO 20022 data dictionary coverage for payment messages",
    },
    {
      label: "Validation Rules",
      value: "14",
      trend: "stable",
      description: "Schema, business rules, character set, and network-specific checks",
    },
    {
      label: "Networks Covered",
      value: "3",
      trend: "active",
      description: "FedNow (US instant), SEPA (EU), SWIFT CBPR+ (cross-border)",
    },
  ],
  whyThisMatters: {
    title: "Why This Matters",
    headline: "The Backbone of Next-Gen Payments is Being Rewired",
    content: [
      "ISO 20022 replaces legacy SWIFT MT formats with structured XML, enabling richer data and faster processing globally.",
      "For builders: Better compliance screening and >95% straight-through processing. It's table stakes for modern infrastructure.",
      "For allocators: The 2025 migration deadline is driving massive enterprise spend in payments tech.",
      "For everyday viewers: Faster processing, better tracking, and fewer errors for international transfers.",
    ],
    keyInsight:
      "The largest coordinated technology upgrade in financial infrastructure history.",
    sources: ["FedNow Service", "European Payments Council", "SWIFT"],
  },
  whoControlsTheRail: {
    title: "Who Controls the Rail",
    headline: "Governance & Power Dynamics",
    summary:
      "ISO TC 68 sets the standard, SWIFT maintains the repository as Registration Authority, but central banks (Fed, ECB, BoE) drive adoption by mandating migration — giving them outsized influence over the global payments architecture.",
    hierarchy: [
      {
        level: 1,
        entity: "ISO Technical Committee 68 (TC 68)",
        role: "Standard Setter",
        description: "Top-level ISO committee for financial services standards. Ultimate authority over ISO 20022 development.",
        influence: "high",
      },
      {
        level: 2,
        entity: "Registration Management Group (RMG)",
        role: "Registration Oversight",
        description: "Senior industry experts who approve new message definitions and ensure standard coherence.",
        influence: "high",
      },
      {
        level: 3,
        entity: "Standards Evaluation Groups (SEGs)",
        role: "Domain Experts",
        description: "Specialized groups for payments, securities, trade finance, and FX.",
        influence: "medium",
      },
      {
        level: 4,
        entity: "SWIFT (Registration Authority)",
        role: "Repository Guardian",
        description: "Maintains the ISO 20022 Financial Repository, publishes schemas, manages iso20022.org.",
        influence: "high",
      },
      {
        level: 5,
        entity: "Central Banks & Market Infrastructures",
        role: "Adoption Drivers",
        description: "Fed (FedNow), ECB (TARGET2), BoE (CHAPS). Mandate timelines and define local usage rules.",
        influence: "very-high",
      },
      {
        level: 6,
        entity: "Commercial Banks & Corporates",
        role: "Implementers",
        description: "Build, test, and deploy ISO 20022 capabilities. Bear migration cost but gain from richer data.",
        influence: "medium",
      },
    ],
    keyTension:
      "While ISO and SWIFT set the technical standard, central banks hold the real power — they can mandate adoption timelines that force entire banking ecosystems to comply.",
  },
  dataSources: [
    {
      name: "FedNow Service",
      type: "Public Documentation",
      status: "active",
      description: "Federal Reserve's instant payment service. Native ISO 20022 implementation launched July 2023.",
      url: "https://www.frbservices.org/financial-services/fednow",
    },
    {
      name: "European Payments Council",
      type: "Public Documentation",
      status: "active",
      description: "Governs SEPA payment schemes across 36 European countries.",
      url: "https://www.europeanpaymentscouncil.eu",
    },
    {
      name: "ISO 20022 Repository",
      type: "Reference",
      status: "active",
      description: "Official message catalog maintained by SWIFT as Registration Authority.",
      url: "https://www.iso20022.org",
    },
  ],
  filters: {
    messageTypes: [
      { value: "pacs.008.001.08", label: "pacs.008 — Credit Transfer" },
      { value: "pacs.002.001.10", label: "pacs.002 — Status Report" },
      { value: "pacs.004.001.09", label: "pacs.004 — Payment Return" },
      { value: "pacs.028.001.03", label: "pacs.028 — Status Request" },
      { value: "pain.001.001.03", label: "pain.001 — Payment Initiation" },
      { value: "pain.013.001.07", label: "pain.013 — Request for Payment" },
      { value: "camt.056.001.08", label: "camt.056 — Cancellation" },
    ],
    networks: [
      { value: "FedNow", label: "FedNow (US Instant)" },
      { value: "SEPA", label: "SEPA (European)" },
      { value: "SWIFT", label: "SWIFT CBPR+" },
    ],
    directions: [
      { value: "inbound", label: "Inbound" },
      { value: "outbound", label: "Outbound" },
    ],
  },
};

// === Messages ===
export const MOCK_MESSAGES_LIST: MessageListResponse = {
  count: 8,
  messages: [
    {
      id: "msg-001",
      type: "pacs.008.001.08",
      title: "FedNow Customer Credit Transfer",
      description: "FI-to-FI customer credit transfer via FedNow. Transfers $2,500 from sender to receiver with full structured data.",
      network: "FedNow",
      direction: "outbound",
      category: "Credit Transfer",
      status: "settled",
    },
    {
      id: "msg-002",
      type: "pacs.002.001.10",
      title: "FedNow Payment Accept (ACTC)",
      description: "Payment status report confirming acceptance of a FedNow credit transfer by the receiving FI.",
      network: "FedNow",
      direction: "inbound",
      category: "Status Report",
      status: "accepted",
    },
    {
      id: "msg-003",
      type: "pacs.002.001.10",
      title: "FedNow Payment Reject (RJCT)",
      description: "Payment status report indicating rejection due to closed beneficiary account (AC04).",
      network: "FedNow",
      direction: "inbound",
      category: "Status Report",
      status: "rejected",
    },
    {
      id: "msg-004",
      type: "pain.001.001.03",
      title: "SEPA Credit Transfer Initiation",
      description: "Customer-to-bank payment initiation for EUR 1,850 SEPA credit transfer from Germany to France.",
      network: "SEPA",
      direction: "outbound",
      category: "Payment Initiation",
      status: "pending",
    },
    {
      id: "msg-005",
      type: "pacs.004.001.09",
      title: "FedNow Payment Return",
      description: "Return of previously settled FedNow payment due to incorrect account number (AC01). $750 returned.",
      network: "FedNow",
      direction: "outbound",
      category: "Payment Return",
      status: "returned",
    },
    {
      id: "msg-006",
      type: "pacs.028.001.03",
      title: "Payment Status Request",
      description: "FI requesting status of a previously submitted FedNow credit transfer.",
      network: "FedNow",
      direction: "outbound",
      category: "Status Inquiry",
      status: "pending",
    },
    {
      id: "msg-007",
      type: "pain.013.001.07",
      title: "FedNow Request for Payment (RFP)",
      description: "Creditor-initiated request for $320 payment through FedNow for e-commerce order.",
      network: "FedNow",
      direction: "outbound",
      category: "Request for Payment",
      status: "pending",
    },
    {
      id: "msg-008",
      type: "camt.056.001.08",
      title: "SEPA Payment Cancellation Request",
      description: "Request to cancel a SEPA credit transfer due to duplicate payment (DUPL).",
      network: "SEPA",
      direction: "outbound",
      category: "Cancellation",
      status: "pending",
    },
    {
      id: "msg-009",
      type: "camt.054.001.08",
      title: "CHAPS Credit Notification",
      description: "Credit notification for incoming wire via CHAPS.",
      network: "CHAPS",
      direction: "inbound",
      category: "Status Report",
      status: "accepted",
    },
    {
      id: "msg-010",
      type: "pacs.008.001.08",
      title: "Lynx High-Value Transfer",
      description: "FI-to-FI high value transfer via Lynx (Payments Canada).",
      network: "Lynx",
      direction: "outbound",
      category: "Credit Transfer",
      status: "settled",
    },
  ],
  filters: {
    types: [
      "pacs.008.001.08",
      "pacs.002.001.10",
      "pacs.004.001.09",
      "pacs.028.001.03",
      "pain.001.001.03",
      "pain.013.001.07",
      "camt.056.001.08",
      "camt.054.001.08",
    ],
    networks: ["FedNow", "SEPA", "SWIFT", "CHAPS", "Lynx"],
    directions: ["inbound", "outbound"],
    categories: [
      "Credit Transfer",
      "Status Report",
      "Payment Initiation",
      "Payment Return",
      "Status Inquiry",
      "Request for Payment",
      "Cancellation",
    ],
  },
};

// Full message data with rawXml and parsed trees
export const MOCK_FULL_MESSAGES = [
  {
    id: "msg-001",
    type: "pacs.008.001.08",
    title: "FedNow Customer Credit Transfer",
    description: "FI-to-FI customer credit transfer via FedNow instant payments network. Transfers $2,500 from sender to receiver with full structured data.",
    network: "FedNow",
    direction: "outbound",
    category: "Credit Transfer",
    status: "settled",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>FNOW-20260528-CTR-001</MsgId>
      <CreDtTm>2026-05-28T09:30:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <InstrId>INSTR-20260528-001</InstrId>
        <EndToEndId>E2E-FNOW-2026052800001</EndToEndId>
        <TxId>TXN-FNOW-20260528-001</TxId>
        <UETR>eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a</UETR>
      </PmtId>
      <IntrBkSttlmAmt Ccy="USD">2500.00</IntrBkSttlmAmt>
      <IntrBkSttlmDt>2026-05-28</IntrBkSttlmDt>
      <InstdAmt Ccy="USD">2500.00</InstdAmt>
      <ChrgBr>SHAR</ChrgBr>
      <Dbtr>
        <Nm>Alice Richardson</Nm>
        <PstlAdr>
          <StrtNm>1200 Market Street</StrtNm>
          <TwnNm>Philadelphia</TwnNm>
          <CtrySubDvsn>PA</CtrySubDvsn>
          <PstCd>19107</PstCd>
          <Ctry>US</Ctry>
        </PstlAdr>
      </Dbtr>
      <DbtrAcct>
        <Id><Othr><Id>445566778899</Id></Othr></Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>CHASUS33</BICFI>
          <Nm>JPMorgan Chase Bank</Nm>
        </FinInstnId>
      </DbtrAgt>
      <CdtrAgt>
        <FinInstnId>
          <BICFI>BOFAUS3N</BICFI>
          <Nm>Bank of America</Nm>
        </FinInstnId>
      </CdtrAgt>
      <Cdtr>
        <Nm>Bob Martinez</Nm>
        <PstlAdr>
          <StrtNm>500 Boylston Street</StrtNm>
          <TwnNm>Boston</TwnNm>
          <CtrySubDvsn>MA</CtrySubDvsn>
          <PstCd>02116</PstCd>
          <Ctry>US</Ctry>
        </PstlAdr>
      </Cdtr>
      <CdtrAcct>
        <Id><Othr><Id>112233445566</Id></Othr></Id>
      </CdtrAcct>
      <Purp>
        <Cd>SUPP</Cd>
      </Purp>
      <RmtInf>
        <Ustrd>Invoice INV-2026-0528 - Consulting Services May 2026</Ustrd>
      </RmtInf>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "FIToFICstmrCdtTrf",
          depth: 1,
          path: "Document/FIToFICstmrCdtTrf",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/FIToFICstmrCdtTrf/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/FIToFICstmrCdtTrf/GrpHdr/MsgId", value: "FNOW-20260528-CTR-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/FIToFICstmrCdtTrf/GrpHdr/CreDtTm", value: "2026-05-28T09:30:00Z" },
                { tag: "NbOfTxs", depth: 3, path: "Document/FIToFICstmrCdtTrf/GrpHdr/NbOfTxs", value: "1" },
                {
                  tag: "SttlmInf",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf",
                  children: [
                    { tag: "SttlmMtd", depth: 4, path: "Document/FIToFICstmrCdtTrf/GrpHdr/SttlmInf/SttlmMtd", value: "CLRG" },
                  ],
                },
              ],
            },
            {
              tag: "CdtTrfTxInf",
              depth: 2,
              path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf",
              children: [
                {
                  tag: "PmtId",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId",
                  children: [
                    { tag: "InstrId", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/InstrId", value: "INSTR-20260528-001" },
                    { tag: "EndToEndId", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/EndToEndId", value: "E2E-FNOW-2026052800001" },
                    { tag: "TxId", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/TxId", value: "TXN-FNOW-20260528-001" },
                    { tag: "UETR", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/PmtId/UETR", value: "eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a" },
                  ],
                },
                { tag: "IntrBkSttlmAmt", depth: 3, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt", value: "2500.00", attributes: { Ccy: "USD" } },
                { tag: "IntrBkSttlmDt", depth: 3, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmDt", value: "2026-05-28" },
                { tag: "InstdAmt", depth: 3, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/InstdAmt", value: "2500.00", attributes: { Ccy: "USD" } },
                { tag: "ChrgBr", depth: 3, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/ChrgBr", value: "SHAR" },
                {
                  tag: "Dbtr",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr",
                  children: [
                    { tag: "Nm", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/Nm", value: "Alice Richardson" },
                    {
                      tag: "PstlAdr",
                      depth: 4,
                      path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr",
                      children: [
                        { tag: "StrtNm", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/StrtNm", value: "1200 Market Street" },
                        { tag: "TwnNm", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/TwnNm", value: "Philadelphia" },
                        { tag: "CtrySubDvsn", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/CtrySubDvsn", value: "PA" },
                        { tag: "PstCd", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/PstCd", value: "19107" },
                        { tag: "Ctry", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr/PstlAdr/Ctry", value: "US" },
                      ],
                    },
                  ],
                },
                {
                  tag: "DbtrAgt",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt",
                  children: [
                    {
                      tag: "FinInstnId",
                      depth: 4,
                      path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId",
                      children: [
                        { tag: "BICFI", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI", value: "CHASUS33" },
                        { tag: "Nm", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/Nm", value: "JPMorgan Chase Bank" },
                      ],
                    },
                  ],
                },
                {
                  tag: "CdtrAgt",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt",
                  children: [
                    {
                      tag: "FinInstnId",
                      depth: 4,
                      path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId",
                      children: [
                        { tag: "BICFI", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/BICFI", value: "BOFAUS3N" },
                        { tag: "Nm", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/CdtrAgt/FinInstnId/Nm", value: "Bank of America" },
                      ],
                    },
                  ],
                },
                {
                  tag: "Cdtr",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr",
                  children: [
                    { tag: "Nm", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/Nm", value: "Bob Martinez" },
                    {
                      tag: "PstlAdr",
                      depth: 4,
                      path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr",
                      children: [
                        { tag: "StrtNm", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/StrtNm", value: "500 Boylston Street" },
                        { tag: "TwnNm", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm", value: "Boston" },
                        { tag: "CtrySubDvsn", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/CtrySubDvsn", value: "MA" },
                        { tag: "PstCd", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/PstCd", value: "02116" },
                        { tag: "Ctry", depth: 5, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry", value: "US" },
                      ],
                    },
                  ],
                },
                { tag: "Purp", depth: 3, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Purp", children: [{ tag: "Cd", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Purp/Cd", value: "SUPP" }] },
                {
                  tag: "RmtInf",
                  depth: 3,
                  path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf",
                  children: [
                    { tag: "Ustrd", depth: 4, path: "Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf/Ustrd", value: "Invoice INV-2026-0528 - Consulting Services May 2026" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-002",
    type: "pacs.002.001.10",
    title: "FedNow Payment Accept (ACTC)",
    description: "Payment status report confirming acceptance of a FedNow credit transfer by the receiving financial institution.",
    network: "FedNow",
    direction: "inbound",
    category: "Status Report",
    status: "accepted",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.002.001.10">
  <FIToFIPmtStsRpt>
    <GrpHdr>
      <MsgId>FNOW-STS-20260528-001</MsgId>
      <CreDtTm>2026-05-28T09:30:05Z</CreDtTm>
    </GrpHdr>
    <TxInfAndSts>
      <OrgnlInstrId>INSTR-20260528-001</OrgnlInstrId>
      <OrgnlEndToEndId>E2E-FNOW-2026052800001</OrgnlEndToEndId>
      <OrgnlUETR>eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a</OrgnlUETR>
      <TxSts>ACTC</TxSts>
      <AccptncDtTm>2026-05-28T09:30:04Z</AccptncDtTm>
      <InstgAgt>
        <FinInstnId>
          <BICFI>BOFAUS3N</BICFI>
        </FinInstnId>
      </InstgAgt>
      <InstdAgt>
        <FinInstnId>
          <BICFI>CHASUS33</BICFI>
        </FinInstnId>
      </InstdAgt>
    </TxInfAndSts>
  </FIToFIPmtStsRpt>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "FIToFIPmtStsRpt",
          depth: 1,
          path: "Document/FIToFIPmtStsRpt",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/FIToFIPmtStsRpt/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/FIToFIPmtStsRpt/GrpHdr/MsgId", value: "FNOW-STS-20260528-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/FIToFIPmtStsRpt/GrpHdr/CreDtTm", value: "2026-05-28T09:30:05Z" },
              ],
            },
            {
              tag: "TxInfAndSts",
              depth: 2,
              path: "Document/FIToFIPmtStsRpt/TxInfAndSts",
              children: [
                { tag: "OrgnlInstrId", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlInstrId", value: "INSTR-20260528-001" },
                { tag: "OrgnlEndToEndId", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlEndToEndId", value: "E2E-FNOW-2026052800001" },
                { tag: "OrgnlUETR", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlUETR", value: "eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a" },
                { tag: "TxSts", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/TxSts", value: "ACTC" },
                { tag: "AccptncDtTm", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/AccptncDtTm", value: "2026-05-28T09:30:04Z" },
                {
                  tag: "InstgAgt", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt",
                  children: [{ tag: "FinInstnId", depth: 4, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt/FinInstnId", children: [{ tag: "BICFI", depth: 5, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt/FinInstnId/BICFI", value: "BOFAUS3N" }] }],
                },
                {
                  tag: "InstdAgt", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt",
                  children: [{ tag: "FinInstnId", depth: 4, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt/FinInstnId", children: [{ tag: "BICFI", depth: 5, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt/FinInstnId/BICFI", value: "CHASUS33" }] }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-003",
    type: "pacs.002.001.10",
    title: "FedNow Payment Reject (RJCT)",
    description: "Payment status report indicating rejection due to closed beneficiary account (AC04). Demonstrates mandatory StsRsnInf block.",
    network: "FedNow",
    direction: "inbound",
    category: "Status Report",
    status: "rejected",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.002.001.10">
  <FIToFIPmtStsRpt>
    <GrpHdr>
      <MsgId>FNOW-STS-20260528-002</MsgId>
      <CreDtTm>2026-05-28T10:15:00Z</CreDtTm>
    </GrpHdr>
    <TxInfAndSts>
      <OrgnlInstrId>INSTR-20260528-002</OrgnlInstrId>
      <OrgnlEndToEndId>E2E-FNOW-2026052800002</OrgnlEndToEndId>
      <OrgnlUETR>a1b2c3d4-5e6f-4a8b-9c0d-e1f2a3b4c5d6</OrgnlUETR>
      <TxSts>RJCT</TxSts>
      <StsRsnInf>
        <Rsn>
          <Cd>AC04</Cd>
        </Rsn>
        <AddtlInf>Account has been closed at receiving institution</AddtlInf>
      </StsRsnInf>
      <InstgAgt>
        <FinInstnId>
          <BICFI>WFBIUS6S</BICFI>
        </FinInstnId>
      </InstgAgt>
      <InstdAgt>
        <FinInstnId>
          <BICFI>CITIUS33</BICFI>
        </FinInstnId>
      </InstdAgt>
    </TxInfAndSts>
  </FIToFIPmtStsRpt>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "FIToFIPmtStsRpt",
          depth: 1,
          path: "Document/FIToFIPmtStsRpt",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/FIToFIPmtStsRpt/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/FIToFIPmtStsRpt/GrpHdr/MsgId", value: "FNOW-STS-20260528-002" },
                { tag: "CreDtTm", depth: 3, path: "Document/FIToFIPmtStsRpt/GrpHdr/CreDtTm", value: "2026-05-28T10:15:00Z" },
              ],
            },
            {
              tag: "TxInfAndSts",
              depth: 2,
              path: "Document/FIToFIPmtStsRpt/TxInfAndSts",
              children: [
                { tag: "OrgnlInstrId", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlInstrId", value: "INSTR-20260528-002" },
                { tag: "OrgnlEndToEndId", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlEndToEndId", value: "E2E-FNOW-2026052800002" },
                { tag: "OrgnlUETR", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/OrgnlUETR", value: "a1b2c3d4-5e6f-4a8b-9c0d-e1f2a3b4c5d6" },
                { tag: "TxSts", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/TxSts", value: "RJCT" },
                {
                  tag: "StsRsnInf", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/StsRsnInf",
                  children: [
                    { tag: "Rsn", depth: 4, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/StsRsnInf/Rsn", children: [{ tag: "Cd", depth: 5, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/StsRsnInf/Rsn/Cd", value: "AC04" }] },
                    { tag: "AddtlInf", depth: 4, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/StsRsnInf/AddtlInf", value: "Account has been closed at receiving institution" },
                  ],
                },
                {
                  tag: "InstgAgt", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt",
                  children: [{ tag: "FinInstnId", depth: 4, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt/FinInstnId", children: [{ tag: "BICFI", depth: 5, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstgAgt/FinInstnId/BICFI", value: "WFBIUS6S" }] }],
                },
                {
                  tag: "InstdAgt", depth: 3, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt",
                  children: [{ tag: "FinInstnId", depth: 4, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt/FinInstnId", children: [{ tag: "BICFI", depth: 5, path: "Document/FIToFIPmtStsRpt/TxInfAndSts/InstdAgt/FinInstnId/BICFI", value: "CITIUS33" }] }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-004",
    type: "pain.001.001.03",
    title: "SEPA Credit Transfer Initiation",
    description: "Customer-to-bank payment initiation for EUR 1,850 SEPA credit transfer from Germany to France.",
    network: "SEPA",
    direction: "outbound",
    category: "Payment Initiation",
    status: "pending",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr>
      <MsgId>SEPA-20260528-PI-001</MsgId>
      <CreDtTm>2026-05-28T08:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <CtrlSum>1850.00</CtrlSum>
      <InitgPty>
        <Nm>Mueller Technologies GmbH</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>PMTINF-SEPA-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2026-05-29</ReqdExctnDt>
      <Dbtr>
        <Nm>Mueller Technologies GmbH</Nm>
        <PstlAdr>
          <StrtNm>Unter den Linden 10</StrtNm>
          <TwnNm>Berlin</TwnNm>
          <PstCd>10117</PstCd>
          <Ctry>DE</Ctry>
        </PstlAdr>
      </Dbtr>
      <DbtrAcct>
        <Id><IBAN>DE89370400440532013000</IBAN></Id>
      </DbtrAcct>
      <DbtrAgt>
        <FinInstnId>
          <BICFI>DEUTDEDB</BICFI>
          <Nm>Deutsche Bank</Nm>
        </FinInstnId>
      </DbtrAgt>
      <CdtTrfTxInf>
        <PmtId>
          <EndToEndId>E2E-SEPA-2026052800001</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="EUR">1850.00</InstdAmt>
        </Amt>
        <ChrgBr>SLEV</ChrgBr>
        <CdtrAgt>
          <FinInstnId>
            <BICFI>BNPAFRPP</BICFI>
            <Nm>BNP Paribas</Nm>
          </FinInstnId>
        </CdtrAgt>
        <Cdtr>
          <Nm>Dupont Consulting SARL</Nm>
          <PstlAdr>
            <StrtNm>12 Rue de la Paix</StrtNm>
            <TwnNm>Paris</TwnNm>
            <PstCd>75001</PstCd>
            <Ctry>FR</Ctry>
          </PstlAdr>
        </Cdtr>
        <CdtrAcct>
          <Id><IBAN>FR7630006000011234567890189</IBAN></Id>
        </CdtrAcct>
        <Purp>
          <Cd>SUPP</Cd>
        </Purp>
        <RmtInf>
          <Ustrd>Invoice INV-FR-2026-0528 - IT Consulting May 2026</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "CstmrCdtTrfInitn",
          depth: 1,
          path: "Document/CstmrCdtTrfInitn",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/CstmrCdtTrfInitn/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/CstmrCdtTrfInitn/GrpHdr/MsgId", value: "SEPA-20260528-PI-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/CstmrCdtTrfInitn/GrpHdr/CreDtTm", value: "2026-05-28T08:00:00Z" },
                { tag: "NbOfTxs", depth: 3, path: "Document/CstmrCdtTrfInitn/GrpHdr/NbOfTxs", value: "1" },
                { tag: "CtrlSum", depth: 3, path: "Document/CstmrCdtTrfInitn/GrpHdr/CtrlSum", value: "1850.00" },
                {
                  tag: "InitgPty", depth: 3, path: "Document/CstmrCdtTrfInitn/GrpHdr/InitgPty",
                  children: [{ tag: "Nm", depth: 4, path: "Document/CstmrCdtTrfInitn/GrpHdr/InitgPty/Nm", value: "Mueller Technologies GmbH" }],
                },
              ],
            },
            {
              tag: "PmtInf",
              depth: 2,
              path: "Document/CstmrCdtTrfInitn/PmtInf",
              children: [
                { tag: "PmtInfId", depth: 3, path: "Document/CstmrCdtTrfInitn/PmtInf/PmtInfId", value: "PMTINF-SEPA-001" },
                { tag: "PmtMtd", depth: 3, path: "Document/CstmrCdtTrfInitn/PmtInf/PmtMtd", value: "TRF" },
                { tag: "ReqdExctnDt", depth: 3, path: "Document/CstmrCdtTrfInitn/PmtInf/ReqdExctnDt", value: "2026-05-29" },
                {
                  tag: "Dbtr", depth: 3, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr",
                  children: [
                    { tag: "Nm", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr/Nm", value: "Mueller Technologies GmbH" },
                    {
                      tag: "PstlAdr", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr/PstlAdr",
                      children: [
                        { tag: "StrtNm", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr/PstlAdr/StrtNm", value: "Unter den Linden 10" },
                        { tag: "TwnNm", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr/PstlAdr/TwnNm", value: "Berlin" },
                        { tag: "PstCd", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr/PstlAdr/PstCd", value: "10117" },
                        { tag: "Ctry", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/Dbtr/PstlAdr/Ctry", value: "DE" },
                      ],
                    },
                  ],
                },
                {
                  tag: "CdtTrfTxInf", depth: 3, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf",
                  children: [
                    {
                      tag: "PmtId", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/PmtId",
                      children: [{ tag: "EndToEndId", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/PmtId/EndToEndId", value: "E2E-SEPA-2026052800001" }],
                    },
                    {
                      tag: "Amt", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Amt",
                      children: [{ tag: "InstdAmt", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Amt/InstdAmt", value: "1850.00", attributes: { Ccy: "EUR" } }],
                    },
                    { tag: "ChrgBr", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/ChrgBr", value: "SLEV" },
                    {
                      tag: "Cdtr", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr",
                      children: [
                        { tag: "Nm", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr/Nm", value: "Dupont Consulting SARL" },
                        {
                          tag: "PstlAdr", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr",
                          children: [
                            { tag: "StrtNm", depth: 6, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/StrtNm", value: "12 Rue de la Paix" },
                            { tag: "TwnNm", depth: 6, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm", value: "Paris" },
                            { tag: "PstCd", depth: 6, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/PstCd", value: "75001" },
                            { tag: "Ctry", depth: 6, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry", value: "FR" },
                          ],
                        },
                      ],
                    },
                    {
                      tag: "RmtInf", depth: 4, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/RmtInf",
                      children: [{ tag: "Ustrd", depth: 5, path: "Document/CstmrCdtTrfInitn/PmtInf/CdtTrfTxInf/RmtInf/Ustrd", value: "Invoice INV-FR-2026-0528 - IT Consulting May 2026" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-005",
    type: "pacs.004.001.09",
    title: "FedNow Payment Return",
    description: "Return of previously settled FedNow payment due to incorrect account number (AC01). $750 returned.",
    network: "FedNow",
    direction: "outbound",
    category: "Payment Return",
    status: "returned",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.004.001.09">
  <PmtRtr>
    <GrpHdr>
      <MsgId>FNOW-RTR-20260528-001</MsgId>
      <CreDtTm>2026-05-28T11:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <TxInf>
      <RtrId>RTR-FNOW-20260528-001</RtrId>
      <OrgnlInstrId>INSTR-20260527-005</OrgnlInstrId>
      <OrgnlEndToEndId>E2E-FNOW-2026052700005</OrgnlEndToEndId>
      <OrgnlUETR>c3d4e5f6-7a8b-4c9d-ae0f-1b2c3d4e5f6a</OrgnlUETR>
      <RtrdIntrBkSttlmAmt Ccy="USD">750.00</RtrdIntrBkSttlmAmt>
      <IntrBkSttlmDt>2026-05-28</IntrBkSttlmDt>
      <RtrRsnInf>
        <Rsn>
          <Cd>AC01</Cd>
        </Rsn>
        <AddtlInf>Incorrect account number provided by originator</AddtlInf>
      </RtrRsnInf>
      <RtrChain>
        <Dbtr>
          <FinInstnId>
            <BICFI>BOFAUS3N</BICFI>
          </FinInstnId>
        </Dbtr>
        <Cdtr>
          <FinInstnId>
            <BICFI>CHASUS33</BICFI>
          </FinInstnId>
        </Cdtr>
      </RtrChain>
    </TxInf>
  </PmtRtr>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "PmtRtr",
          depth: 1,
          path: "Document/PmtRtr",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/PmtRtr/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/PmtRtr/GrpHdr/MsgId", value: "FNOW-RTR-20260528-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/PmtRtr/GrpHdr/CreDtTm", value: "2026-05-28T11:00:00Z" },
                { tag: "NbOfTxs", depth: 3, path: "Document/PmtRtr/GrpHdr/NbOfTxs", value: "1" },
                {
                  tag: "SttlmInf", depth: 3, path: "Document/PmtRtr/GrpHdr/SttlmInf",
                  children: [{ tag: "SttlmMtd", depth: 4, path: "Document/PmtRtr/GrpHdr/SttlmInf/SttlmMtd", value: "CLRG" }],
                },
              ],
            },
            {
              tag: "TxInf",
              depth: 2,
              path: "Document/PmtRtr/TxInf",
              children: [
                { tag: "RtrId", depth: 3, path: "Document/PmtRtr/TxInf/RtrId", value: "RTR-FNOW-20260528-001" },
                { tag: "OrgnlInstrId", depth: 3, path: "Document/PmtRtr/TxInf/OrgnlInstrId", value: "INSTR-20260527-005" },
                { tag: "OrgnlEndToEndId", depth: 3, path: "Document/PmtRtr/TxInf/OrgnlEndToEndId", value: "E2E-FNOW-2026052700005" },
                { tag: "OrgnlUETR", depth: 3, path: "Document/PmtRtr/TxInf/OrgnlUETR", value: "c3d4e5f6-7a8b-4c9d-ae0f-1b2c3d4e5f6a" },
                { tag: "RtrdIntrBkSttlmAmt", depth: 3, path: "Document/PmtRtr/TxInf/RtrdIntrBkSttlmAmt", value: "750.00", attributes: { Ccy: "USD" } },
                { tag: "IntrBkSttlmDt", depth: 3, path: "Document/PmtRtr/TxInf/IntrBkSttlmDt", value: "2026-05-28" },
                {
                  tag: "RtrRsnInf", depth: 3, path: "Document/PmtRtr/TxInf/RtrRsnInf",
                  children: [
                    { tag: "Rsn", depth: 4, path: "Document/PmtRtr/TxInf/RtrRsnInf/Rsn", children: [{ tag: "Cd", depth: 5, path: "Document/PmtRtr/TxInf/RtrRsnInf/Rsn/Cd", value: "AC01" }] },
                    { tag: "AddtlInf", depth: 4, path: "Document/PmtRtr/TxInf/RtrRsnInf/AddtlInf", value: "Incorrect account number provided by originator" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-006",
    type: "pacs.028.001.03",
    title: "Payment Status Request",
    description: "FI requesting status of a previously submitted FedNow credit transfer.",
    network: "FedNow",
    direction: "outbound",
    category: "Status Inquiry",
    status: "pending",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.028.001.03">
  <FIToFIPmtStsReq>
    <GrpHdr>
      <MsgId>FNOW-STSREQ-20260528-001</MsgId>
      <CreDtTm>2026-05-28T12:00:00Z</CreDtTm>
    </GrpHdr>
    <TxInf>
      <StsReqId>STSREQ-FNOW-001</StsReqId>
      <OrgnlInstrId>INSTR-20260528-001</OrgnlInstrId>
      <OrgnlEndToEndId>E2E-FNOW-2026052800001</OrgnlEndToEndId>
      <OrgnlUETR>eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a</OrgnlUETR>
      <OrgnlTxRef>
        <IntrBkSttlmAmt Ccy="USD">2500.00</IntrBkSttlmAmt>
        <IntrBkSttlmDt>2026-05-28</IntrBkSttlmDt>
      </OrgnlTxRef>
    </TxInf>
  </FIToFIPmtStsReq>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "FIToFIPmtStsReq",
          depth: 1,
          path: "Document/FIToFIPmtStsReq",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/FIToFIPmtStsReq/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/FIToFIPmtStsReq/GrpHdr/MsgId", value: "FNOW-STSREQ-20260528-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/FIToFIPmtStsReq/GrpHdr/CreDtTm", value: "2026-05-28T12:00:00Z" },
              ],
            },
            {
              tag: "TxInf",
              depth: 2,
              path: "Document/FIToFIPmtStsReq/TxInf",
              children: [
                { tag: "StsReqId", depth: 3, path: "Document/FIToFIPmtStsReq/TxInf/StsReqId", value: "STSREQ-FNOW-001" },
                { tag: "OrgnlInstrId", depth: 3, path: "Document/FIToFIPmtStsReq/TxInf/OrgnlInstrId", value: "INSTR-20260528-001" },
                { tag: "OrgnlEndToEndId", depth: 3, path: "Document/FIToFIPmtStsReq/TxInf/OrgnlEndToEndId", value: "E2E-FNOW-2026052800001" },
                { tag: "OrgnlUETR", depth: 3, path: "Document/FIToFIPmtStsReq/TxInf/OrgnlUETR", value: "eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a" },
                {
                  tag: "OrgnlTxRef", depth: 3, path: "Document/FIToFIPmtStsReq/TxInf/OrgnlTxRef",
                  children: [
                    { tag: "IntrBkSttlmAmt", depth: 4, path: "Document/FIToFIPmtStsReq/TxInf/OrgnlTxRef/IntrBkSttlmAmt", value: "2500.00", attributes: { Ccy: "USD" } },
                    { tag: "IntrBkSttlmDt", depth: 4, path: "Document/FIToFIPmtStsReq/TxInf/OrgnlTxRef/IntrBkSttlmDt", value: "2026-05-28" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-007",
    type: "pain.013.001.07",
    title: "FedNow Request for Payment (RFP)",
    description: "Creditor-initiated request for $320 payment through FedNow for e-commerce order.",
    network: "FedNow",
    direction: "outbound",
    category: "Request for Payment",
    status: "pending",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.013.001.07">
  <CdtrPmtActvtnReq>
    <GrpHdr>
      <MsgId>FNOW-RFP-20260528-001</MsgId>
      <CreDtTm>2026-05-28T13:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <InitgPty>
        <Nm>ShopRight E-Commerce Ltd</Nm>
      </InitgPty>
    </GrpHdr>
    <PmtInf>
      <PmtInfId>RFP-PMTINF-001</PmtInfId>
      <PmtMtd>TRF</PmtMtd>
      <ReqdExctnDt>2026-05-29</ReqdExctnDt>
      <XpryDt>2026-05-30</XpryDt>
      <CdtTrfTxInf>
        <PmtId>
          <InstrId>RFP-INSTR-001</InstrId>
          <EndToEndId>E2E-RFP-2026052800001</EndToEndId>
        </PmtId>
        <Amt>
          <InstdAmt Ccy="USD">320.00</InstdAmt>
        </Amt>
        <ChrgBr>SHAR</ChrgBr>
        <Cdtr>
          <Nm>ShopRight E-Commerce Ltd</Nm>
          <PstlAdr>
            <StrtNm>200 Commerce Drive</StrtNm>
            <TwnNm>Seattle</TwnNm>
            <Ctry>US</Ctry>
          </PstlAdr>
        </Cdtr>
        <CdtrAcct>
          <Id><Othr><Id>9988776655443</Id></Othr></Id>
        </CdtrAcct>
        <CdtrAgt>
          <FinInstnId>
            <BICFI>USBKUS44</BICFI>
            <Nm>US Bancorp</Nm>
          </FinInstnId>
        </CdtrAgt>
        <Purp>
          <Cd>GDDS</Cd>
        </Purp>
        <RmtInf>
          <Ustrd>Order ORD-2026-5028-001 - Electronics Purchase</Ustrd>
        </RmtInf>
      </CdtTrfTxInf>
    </PmtInf>
  </CdtrPmtActvtnReq>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "CdtrPmtActvtnReq",
          depth: 1,
          path: "Document/CdtrPmtActvtnReq",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/CdtrPmtActvtnReq/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/CdtrPmtActvtnReq/GrpHdr/MsgId", value: "FNOW-RFP-20260528-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/CdtrPmtActvtnReq/GrpHdr/CreDtTm", value: "2026-05-28T13:00:00Z" },
                { tag: "NbOfTxs", depth: 3, path: "Document/CdtrPmtActvtnReq/GrpHdr/NbOfTxs", value: "1" },
                {
                  tag: "InitgPty", depth: 3, path: "Document/CdtrPmtActvtnReq/GrpHdr/InitgPty",
                  children: [{ tag: "Nm", depth: 4, path: "Document/CdtrPmtActvtnReq/GrpHdr/InitgPty/Nm", value: "ShopRight E-Commerce Ltd" }],
                },
              ],
            },
            {
              tag: "PmtInf",
              depth: 2,
              path: "Document/CdtrPmtActvtnReq/PmtInf",
              children: [
                { tag: "PmtInfId", depth: 3, path: "Document/CdtrPmtActvtnReq/PmtInf/PmtInfId", value: "RFP-PMTINF-001" },
                { tag: "PmtMtd", depth: 3, path: "Document/CdtrPmtActvtnReq/PmtInf/PmtMtd", value: "TRF" },
                { tag: "ReqdExctnDt", depth: 3, path: "Document/CdtrPmtActvtnReq/PmtInf/ReqdExctnDt", value: "2026-05-29" },
                { tag: "XpryDt", depth: 3, path: "Document/CdtrPmtActvtnReq/PmtInf/XpryDt", value: "2026-05-30" },
                {
                  tag: "CdtTrfTxInf", depth: 3, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf",
                  children: [
                    {
                      tag: "PmtId", depth: 4, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/PmtId",
                      children: [
                        { tag: "InstrId", depth: 5, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/PmtId/InstrId", value: "RFP-INSTR-001" },
                        { tag: "EndToEndId", depth: 5, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/PmtId/EndToEndId", value: "E2E-RFP-2026052800001" },
                      ],
                    },
                    {
                      tag: "Amt", depth: 4, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Amt",
                      children: [{ tag: "InstdAmt", depth: 5, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Amt/InstdAmt", value: "320.00", attributes: { Ccy: "USD" } }],
                    },
                    { tag: "ChrgBr", depth: 4, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/ChrgBr", value: "SHAR" },
                    {
                      tag: "Cdtr", depth: 4, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Cdtr",
                      children: [
                        { tag: "Nm", depth: 5, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Cdtr/Nm", value: "ShopRight E-Commerce Ltd" },
                        {
                          tag: "PstlAdr", depth: 5, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr",
                          children: [
                            { tag: "StrtNm", depth: 6, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/StrtNm", value: "200 Commerce Drive" },
                            { tag: "TwnNm", depth: 6, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/TwnNm", value: "Seattle" },
                            { tag: "Ctry", depth: 6, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/Cdtr/PstlAdr/Ctry", value: "US" },
                          ],
                        },
                      ],
                    },
                    {
                      tag: "RmtInf", depth: 4, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/RmtInf",
                      children: [{ tag: "Ustrd", depth: 5, path: "Document/CdtrPmtActvtnReq/PmtInf/CdtTrfTxInf/RmtInf/Ustrd", value: "Order ORD-2026-5028-001 - Electronics Purchase" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-008",
    type: "camt.056.001.08",
    title: "SEPA Payment Cancellation Request",
    description: "Request to cancel a SEPA credit transfer due to duplicate payment (DUPL).",
    network: "SEPA",
    direction: "outbound",
    category: "Cancellation",
    status: "pending",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.056.001.08">
  <FIToFIPmtCxlReq>
    <Assgnmt>
      <MsgId>SEPA-CXL-20260528-001</MsgId>
      <CreDtTm>2026-05-28T14:00:00Z</CreDtTm>
      <Assgnr>
        <Agt>
          <FinInstnId>
            <BICFI>DEUTDEDB</BICFI>
          </FinInstnId>
        </Agt>
      </Assgnr>
      <Assgne>
        <Agt>
          <FinInstnId>
            <BICFI>BNPAFRPP</BICFI>
          </FinInstnId>
        </Agt>
      </Assgne>
    </Assgnmt>
    <Undrlyg>
      <TxInf>
        <CxlId>CXL-SEPA-001</CxlId>
        <OrgnlInstrId>SEPA-INSTR-20260527-001</OrgnlInstrId>
        <OrgnlEndToEndId>E2E-SEPA-2026052700001</OrgnlEndToEndId>
        <OrgnlUETR>f1e2d3c4-b5a6-4978-8f9e-0a1b2c3d4e5f</OrgnlUETR>
        <CxlRsnInf>
          <Rsn>
            <Cd>DUPL</Cd>
          </Rsn>
          <AddtlInf>Duplicate payment detected — same beneficiary and amount within 24 hours</AddtlInf>
        </CxlRsnInf>
        <OrgnlTxRef>
          <IntrBkSttlmAmt Ccy="EUR">500.00</IntrBkSttlmAmt>
          <IntrBkSttlmDt>2026-05-27</IntrBkSttlmDt>
        </OrgnlTxRef>
      </TxInf>
    </Undrlyg>
  </FIToFIPmtCxlReq>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "FIToFIPmtCxlReq",
          depth: 1,
          path: "Document/FIToFIPmtCxlReq",
          children: [
            {
              tag: "Assgnmt",
              depth: 2,
              path: "Document/FIToFIPmtCxlReq/Assgnmt",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/FIToFIPmtCxlReq/Assgnmt/MsgId", value: "SEPA-CXL-20260528-001" },
                { tag: "CreDtTm", depth: 3, path: "Document/FIToFIPmtCxlReq/Assgnmt/CreDtTm", value: "2026-05-28T14:00:00Z" },
                {
                  tag: "Assgnr", depth: 3, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgnr",
                  children: [{ tag: "Agt", depth: 4, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgnr/Agt", children: [{ tag: "FinInstnId", depth: 5, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgnr/Agt/FinInstnId", children: [{ tag: "BICFI", depth: 6, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgnr/Agt/FinInstnId/BICFI", value: "DEUTDEDB" }] }] }],
                },
                {
                  tag: "Assgne", depth: 3, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgne",
                  children: [{ tag: "Agt", depth: 4, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgne/Agt", children: [{ tag: "FinInstnId", depth: 5, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgne/Agt/FinInstnId", children: [{ tag: "BICFI", depth: 6, path: "Document/FIToFIPmtCxlReq/Assgnmt/Assgne/Agt/FinInstnId/BICFI", value: "BNPAFRPP" }] }] }],
                },
              ],
            },
            {
              tag: "Undrlyg",
              depth: 2,
              path: "Document/FIToFIPmtCxlReq/Undrlyg",
              children: [
                {
                  tag: "TxInf",
                  depth: 3,
                  path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf",
                  children: [
                    { tag: "CxlId", depth: 4, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlId", value: "CXL-SEPA-001" },
                    { tag: "OrgnlInstrId", depth: 4, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlInstrId", value: "SEPA-INSTR-20260527-001" },
                    { tag: "OrgnlEndToEndId", depth: 4, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlEndToEndId", value: "E2E-SEPA-2026052700001" },
                    { tag: "OrgnlUETR", depth: 4, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlUETR", value: "f1e2d3c4-b5a6-4978-8f9e-0a1b2c3d4e5f" },
                    {
                      tag: "CxlRsnInf", depth: 4, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf",
                      children: [
                        { tag: "Rsn", depth: 5, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf/Rsn", children: [{ tag: "Cd", depth: 6, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf/Rsn/Cd", value: "DUPL" }] },
                        { tag: "AddtlInf", depth: 5, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/CxlRsnInf/AddtlInf", value: "Duplicate payment detected — same beneficiary and amount within 24 hours" },
                      ],
                    },
                    {
                      tag: "OrgnlTxRef", depth: 4, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef",
                      children: [
                        { tag: "IntrBkSttlmAmt", depth: 5, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/IntrBkSttlmAmt", value: "500.00", attributes: { Ccy: "EUR" } },
                        { tag: "IntrBkSttlmDt", depth: 5, path: "Document/FIToFIPmtCxlReq/Undrlyg/TxInf/OrgnlTxRef/IntrBkSttlmDt", value: "2026-05-27" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "msg-009",
    type: "camt.054.001.08",
    title: "CHAPS Credit Notification",
    description: "Credit notification for incoming wire via CHAPS.",
    network: "CHAPS",
    direction: "inbound",
    category: "Status Report",
    status: "accepted",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.054.001.08">
  <BkToCstmrDbtCdtNtfctn>
    <GrpHdr>
      <MsgId>CHAPS-NTF-20260528-01</MsgId>
      <CreDtTm>2026-05-28T14:30:00Z</CreDtTm>
    </GrpHdr>
    <Ntfctn>
      <Id>NTF-CHAPS-001</Id>
      <CreDtTm>2026-05-28T14:30:00Z</CreDtTm>
      <Acct>
        <Id><IBAN>GB29MIDL40051566778899</IBAN></Id>
      </Acct>
      <Ntry>
        <NtryRef>ENTRY-001</NtryRef>
        <Amt Ccy="GBP">42000.00</Amt>
        <CdtDbtInd>CRDT</CdtDbtInd>
        <Sts>BOOK</Sts>
        <BookgDt>
          <Dt>2026-05-28</Dt>
        </BookgDt>
      </Ntry>
    </Ntfctn>
  </BkToCstmrDbtCdtNtfctn>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "BkToCstmrDbtCdtNtfctn",
          depth: 1,
          path: "Document/BkToCstmrDbtCdtNtfctn",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/BkToCstmrDbtCdtNtfctn/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/BkToCstmrDbtCdtNtfctn/GrpHdr/MsgId", value: "CHAPS-NTF-20260528-01" },
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: "msg-010",
    type: "pacs.008.001.08",
    title: "Lynx High-Value Transfer",
    description: "FI-to-FI high value transfer via Lynx (Payments Canada).",
    network: "Lynx",
    direction: "outbound",
    category: "Credit Transfer",
    status: "settled",
    rawXml: `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
  <FIToFICstmrCdtTrf>
    <GrpHdr>
      <MsgId>LYNX-20260528-01</MsgId>
      <CreDtTm>2026-05-28T10:00:00Z</CreDtTm>
      <NbOfTxs>1</NbOfTxs>
      <SttlmInf>
        <SttlmMtd>CLRG</SttlmMtd>
      </SttlmInf>
    </GrpHdr>
    <CdtTrfTxInf>
      <PmtId>
        <EndToEndId>E2E-LYNX-2026052801</EndToEndId>
        <TxId>TXN-LYNX-01</TxId>
      </PmtId>
      <IntrBkSttlmAmt Ccy="CAD">150000.00</IntrBkSttlmAmt>
      <IntrBkSttlmDt>2026-05-28</IntrBkSttlmDt>
      <ChrgBr>SHAR</ChrgBr>
    </CdtTrfTxInf>
  </FIToFICstmrCdtTrf>
</Document>`,
    parsed: {
      tag: "Document",
      depth: 0,
      path: "Document",
      children: [
        {
          tag: "FIToFICstmrCdtTrf",
          depth: 1,
          path: "Document/FIToFICstmrCdtTrf",
          children: [
            {
              tag: "GrpHdr",
              depth: 2,
              path: "Document/FIToFICstmrCdtTrf/GrpHdr",
              children: [
                { tag: "MsgId", depth: 3, path: "Document/FIToFICstmrCdtTrf/GrpHdr/MsgId", value: "LYNX-20260528-01" },
              ]
            }
          ]
        }
      ]
    }
  }
];

// === Glossary ===
export const MOCK_GLOSSARY: GlossaryResponse = {
  count: 32,
  categories: ["Identification", "Dates", "Settlement", "Amounts", "Parties", "Charges", "Remittance", "Status"],
  entries: [
    {
      id: "fld-001",
      xmlTag: "MsgId",
      name: "Message Identification",
      category: "Identification",
      definition: "Point-to-point reference assigned by the instructing party to unambiguously identify the message.",
      dataType: "Max35Text",
      maxLength: 35,
      mandatory: true,
      format: "Alphanumeric, no spaces recommended",
      example: "FNOW-20260528-CTR-001",
      usedIn: ["pacs.008", "pacs.002", "pain.001", "pacs.004", "camt.056"],
      relatedFields: ["InstrId", "EndToEndId", "TxId"],
    },
    {
      id: "fld-002",
      xmlTag: "CreDtTm",
      name: "Creation Date Time",
      category: "Dates",
      definition: "Date and time at which the message was created by the instructing party. Must be a valid ISO 8601 datetime.",
      dataType: "ISODateTime",
      maxLength: null,
      mandatory: true,
      format: "YYYY-MM-DDThh:mm:ss.sssZ",
      example: "2026-05-28T09:30:00Z",
      usedIn: ["pacs.008", "pacs.002", "pain.001", "pacs.004"],
      relatedFields: ["IntrBkSttlmDt", "AccptncDtTm", "ReqdExctnDt"],
    },
    {
      id: "fld-003",
      xmlTag: "NbOfTxs",
      name: "Number of Transactions",
      category: "Identification",
      definition: "Total number of individual transactions contained in the message.",
      dataType: "Max15NumericText",
      maxLength: 15,
      mandatory: true,
      format: "Numeric string (no decimals)",
      example: "1",
      usedIn: ["pacs.008", "pain.001", "pacs.004"],
      relatedFields: ["CtrlSum"],
    },
    {
      id: "fld-004",
      xmlTag: "SttlmMtd",
      name: "Settlement Method",
      category: "Settlement",
      definition: "Method used to settle the credit transfer instruction.",
      dataType: "Code",
      maxLength: 4,
      mandatory: true,
      format: "CLRG, INDA, INGA, COVE",
      example: "CLRG",
      usedIn: ["pacs.008", "pacs.004", "pacs.009"],
      relatedFields: ["IntrBkSttlmAmt", "IntrBkSttlmDt"],
    },
    {
      id: "fld-005",
      xmlTag: "InstrId",
      name: "Instruction Identification",
      category: "Identification",
      definition: "Unique identification assigned by the instructing party for the instructed party.",
      dataType: "Max35Text",
      maxLength: 35,
      mandatory: false,
      format: "Alphanumeric",
      example: "INSTR-20260528-001",
      usedIn: ["pacs.008"],
      relatedFields: ["EndToEndId", "TxId", "UETR"],
    },
    {
      id: "fld-006",
      xmlTag: "EndToEndId",
      name: "End-to-End Identification",
      category: "Identification",
      definition: "Unique identification assigned by the initiating party. Carried unchanged through entire payment chain.",
      dataType: "Max35Text",
      maxLength: 35,
      mandatory: true,
      format: "Alphanumeric — must be unique per originator",
      example: "E2E-FNOW-2026052800001",
      usedIn: ["pacs.008", "pacs.002", "pain.001", "pacs.004"],
      relatedFields: ["InstrId", "TxId", "UETR"],
    },
    {
      id: "fld-007",
      xmlTag: "TxId",
      name: "Transaction Identification",
      category: "Identification",
      definition: "Unique identification assigned by the first instructing agent.",
      dataType: "Max35Text",
      maxLength: 35,
      mandatory: true,
      format: "Alphanumeric",
      example: "TXN-FNOW-20260528-001",
      usedIn: ["pacs.008"],
      relatedFields: ["InstrId", "EndToEndId", "UETR"],
    },
    {
      id: "fld-008",
      xmlTag: "UETR",
      name: "Unique End-to-End Transaction Reference",
      category: "Identification",
      definition: "Universally unique identifier (UUID v4) for tracking a transaction globally. Introduced by SWIFT gpi.",
      dataType: "UUIDv4Text",
      maxLength: 36,
      mandatory: true,
      format: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
      example: "eb6305c9-1f7a-4c3b-8a2d-5e9f1b3c7d4a",
      usedIn: ["pacs.008", "pacs.002", "pacs.004", "pacs.028"],
      relatedFields: ["EndToEndId", "TxId"],
    },
    {
      id: "fld-009",
      xmlTag: "IntrBkSttlmAmt",
      name: "Interbank Settlement Amount",
      category: "Amounts",
      definition: "Amount of money to be moved between instructing and instructed agent at interbank level.",
      dataType: "ActiveCurrencyAndAmount",
      maxLength: null,
      mandatory: true,
      format: "Decimal number with Ccy attribute",
      example: '2500.00 (Ccy="USD")',
      usedIn: ["pacs.008", "pacs.009"],
      relatedFields: ["InstdAmt", "IntrBkSttlmDt", "ChrgBr"],
    },
    {
      id: "fld-010",
      xmlTag: "InstdAmt",
      name: "Instructed Amount",
      category: "Amounts",
      definition: "Amount of money to be moved as instructed by the initiating party.",
      dataType: "ActiveOrHistoricCurrencyAndAmount",
      maxLength: null,
      mandatory: false,
      format: "Decimal number with Ccy attribute",
      example: '2500.00 (Ccy="USD")',
      usedIn: ["pacs.008", "pain.001"],
      relatedFields: ["IntrBkSttlmAmt", "ChrgBr"],
    },
    {
      id: "fld-012",
      xmlTag: "ChrgBr",
      name: "Charge Bearer",
      category: "Charges",
      definition: "Specifies which party will bear the charges associated with the payment transaction.",
      dataType: "Code",
      maxLength: 4,
      mandatory: true,
      format: "DEBT, CRED, SHAR, SLEV",
      example: "SHAR",
      usedIn: ["pacs.008", "pain.001"],
      relatedFields: ["InstdAmt", "IntrBkSttlmAmt"],
    },
    {
      id: "fld-013",
      xmlTag: "Dbtr.Nm",
      name: "Debtor Name",
      category: "Parties",
      definition: "Party that owes the amount of money to the (ultimate) creditor.",
      dataType: "Max140Text",
      maxLength: 140,
      mandatory: true,
      format: "Nm, PstlAdr (StrtNm, TwnNm, Ctry, PstCd)",
      example: "Nm: Alice Richardson, Ctry: US",
      usedIn: ["pacs.008", "pain.001"],
      relatedFields: ["DbtrAcct", "DbtrAgt", "UltmtDbtr"],
    },
    {
      id: "fld-016",
      xmlTag: "Cdtr",
      name: "Creditor",
      category: "Parties",
      definition: "Party to which an amount of money is due.",
      dataType: "PartyIdentification",
      maxLength: null,
      mandatory: true,
      format: "Nm, PstlAdr (StrtNm, TwnNm, Ctry, PstCd)",
      example: "Nm: Bob Martinez, Ctry: US",
      usedIn: ["pacs.008", "pain.001"],
      relatedFields: ["CdtrAcct", "CdtrAgt", "UltmtCdtr"],
    },
    {
      id: "fld-020",
      xmlTag: "BICFI",
      name: "Debtor Agent BIC",
      category: "Identification",
      definition: "Business Identifier Code of the debtor's financial institution.",
      dataType: "BICFIDec2014Identifier",
      maxLength: 11,
      mandatory: true,
      format: "8 or 11 alphanumeric: BANKCCLL(BBB)",
      example: "CHASUS33 (JPMorgan Chase, US)",
      usedIn: ["pacs.008", "pacs.002", "pain.001"],
      relatedFields: ["IBAN", "DbtrAgt", "CdtrAgt"],
    },
    {
      id: "fld-021",
      xmlTag: "RmtInf",
      name: "Remittance Information",
      category: "Remittance",
      definition: "Information supplied to enable matching of payment with items that the transfer is intended to settle.",
      dataType: "RemittanceInformation",
      maxLength: null,
      mandatory: false,
      format: "Ustrd (Max140Text) or Strd (Max9000Text structured)",
      example: "Invoice INV-2026-0528 - Consulting Services",
      usedIn: ["pacs.008", "pain.001"],
      relatedFields: ["Purp", "EndToEndId"],
    },
    {
      id: "fld-022",
      xmlTag: "TxSts",
      name: "Transaction Status",
      category: "Status",
      definition: "Specifies the status of a transaction in the payment lifecycle.",
      dataType: "Code",
      maxLength: 4,
      mandatory: true,
      format: "ACTC, ACCP, ACSC, RCVD, PDNG, RJCT",
      example: "ACTC",
      usedIn: ["pacs.002"],
      relatedFields: ["StsRsnInf", "OrgnlUETR"],
    },
  ],
};

// === Comparison ===
export const MOCK_COMPARISON: { count: number; mapping: ComparisonMapping[] } = {
  count: 7,
  mapping: [
    {
      id: "map-001",
      mtTag: ":20:",
      mtName: "Transaction Reference",
      mtFormat: "16x",
      mxElement: "GrpHdr.MsgId",
      mxPath: "/Document/FIToFICstmrCdtTrf/GrpHdr/MsgId",
      mxFormat: "Message Identification",
      keyDifference: "MX widens the format to Max35Text and clarifies uniqueness scope.",
      mtExample: ":20:REF20260528001",
      mxExample: "<MsgId>FNOW-20260528-CTR-001</MsgId>",
    },
    {
      id: "map-003",
      mtTag: ":32A:",
      mtName: "Value Date / Currency / Amount",
      mtFormat: "6!n3!a15d",
      mxElement: "IntrBkSttlmAmt + IntrBkSttlmDt",
      mxPath: "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/IntrBkSttlmAmt",
      mxFormat: "Settlement Date + Amount",
      keyDifference: "MX splits date and amount into explicit, typed fields.",
      mtExample: ":32A:260528USD2500,00",
      mxExample: '<IntrBkSttlmAmt Ccy="USD">2500.00</IntrBkSttlmAmt>',
    },
    {
      id: "map-005",
      mtTag: ":50K:",
      mtName: "Ordering Customer (free text)",
      mtFormat: "4*35x",
      mxElement: "Dbtr (Nm + PstlAdr + Id)",
      mxPath: "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Dbtr",
      mxFormat: "Debtor structured party",
      keyDifference: "MX requires structured party data — name, address lines, postal code, country.",
      mtExample: ":50K:/445566778899\nAlice Richardson\n1200 Market Street\nPhiladelphia PA 19107",
      mxExample: "<Dbtr><Nm>Alice Richardson</Nm><PstlAdr><StrtNm>1200 Market Street</StrtNm></PstlAdr></Dbtr>",
    },
    {
      id: "map-007",
      mtTag: ":52A:",
      mtName: "Ordering Institution",
      mtFormat: "BIC (4!a2!a2!c[3!c])",
      mxElement: "DbtrAgt.FinInstnId.BICFI",
      mxPath: "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/DbtrAgt/FinInstnId/BICFI",
      mxFormat: "Debtor Agent BIC",
      keyDifference: "MX adds LEI, ClrSysMmbId, and free-form name fallbacks.",
      mtExample: ":52A:CHASUS33",
      mxExample: "<DbtrAgt><FinInstnId><BICFI>CHASUS33</BICFI><Nm>JPMorgan Chase Bank</Nm></FinInstnId></DbtrAgt>",
    },
    {
      id: "map-009",
      mtTag: ":59:",
      mtName: "Beneficiary Customer",
      mtFormat: "Account + 4*35x",
      mxElement: "Cdtr (Nm + PstlAdr + Id)",
      mxPath: "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/Cdtr",
      mxFormat: "Creditor structured party",
      keyDifference: "Same enrichment as Debtor — enables structured AML/KYC checks.",
      mtExample: ":59:/112233445566\nBob Martinez\n500 Boylston Street\nBoston MA 02116",
      mxExample: "<Cdtr><Nm>Bob Martinez</Nm><PstlAdr><StrtNm>500 Boylston Street</StrtNm></PstlAdr></Cdtr>",
    },
    {
      id: "map-010",
      mtTag: ":70:",
      mtName: "Remittance Information (4×35)",
      mtFormat: "4*35x",
      mxElement: "RmtInf.Ustrd / RmtInf.Strd",
      mxPath: "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/RmtInf",
      mxFormat: "Unstructured or Structured Remittance",
      keyDifference: "MX supports structured remittance with codes, enabling automated reconciliation.",
      mtExample: ":70:Invoice INV-2026-0528\nConsulting Services",
      mxExample: "<RmtInf><Ustrd>Invoice INV-2026-0528 - Consulting Services May 2026</Ustrd></RmtInf>",
    },
    {
      id: "map-011",
      mtTag: ":71A:",
      mtName: "Details of Charges",
      mtFormat: "3!a",
      mxElement: "ChrgBr",
      mxPath: "/Document/FIToFICstmrCdtTrf/CdtTrfTxInf/ChrgBr",
      mxFormat: "Charge Bearer",
      keyDifference: "Identical semantics; ISO 20022 enforces enumerated codes. EPC specifically mandates SLEV (Service Level) for SEPA payments to ensure charge bearer matches the SEPA rulebook.",
      mtExample: ":71A:SHA",
      mxExample: "<ChrgBr>SLEV</ChrgBr>",
    },
  ],
};

export const MOCK_COMPARISON_SUMMARY: ComparisonSummary = {
  metrics: [
    { label: "Character Limits", mtValue: "16-35 chars", mxValue: "35-9000 chars", improvement: "64x capacity increase", icon: "📊" },
    { label: "Data Structure", mtValue: "Flat text fields", mxValue: "Hierarchical XML", improvement: "Structured & machine-readable", icon: "🏗️" },
    { label: "Party Identification", mtValue: "Free-text (4×35)", mxValue: "Structured fields", improvement: "Better AML/sanctions screening", icon: "🔍" },
    { label: "Transaction Tracking", mtValue: "No global ID", mxValue: "UETR (UUID v4)", improvement: "End-to-end visibility", icon: "🌐" },
  ],
  timeline: [
    { date: "2004", event: "ISO 20022 Published", description: "Standard first published by ISO TC 68", status: "completed" },
    { date: "2018", event: "SEPA Full Adoption", description: "European payments fully migrated to ISO 20022", status: "completed" },
    { date: "2023", event: "FedNow Launch", description: "US instant payments launched with native ISO 20022", status: "completed" },
    { date: "2025", event: "SWIFT Deadline", description: "SWIFT CBPR+ migration deadline for cross-border", status: "active" },
    { date: "2027", event: "MT Retirement", description: "Planned phase-out of legacy MT message formats", status: "upcoming" },
  ],
  fieldStats: {
    totalMappings: 15,
    directMappings: 11,
    newMxFields: 4,
  },
};
