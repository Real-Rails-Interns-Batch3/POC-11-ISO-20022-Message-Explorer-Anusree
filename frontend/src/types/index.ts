// ISO 20022 Message Explorer — TypeScript Type Definitions

// === Message Types ===
export interface ParsedNode {
  tag: string;
  depth: number;
  path: string;
  value?: string;
  attributes?: Record<string, string>;
  children?: ParsedNode[];
  glossaryRef?: GlossaryRef;
}

export interface GlossaryRef {
  id: string;
  name: string;
  definition: string;
  dataType: string;
  mandatory: boolean;
  maxLength?: number;
}

export interface Message {
  id: string;
  type: string;
  title: string;
  description: string;
  network: string;
  direction: string;
  category: string;
  status: string;
  rawXml?: string;
  parsed?: ParsedNode;
  liveParsed?: ParseResult;
}

export interface MessageListItem {
  id: string;
  type: string;
  title: string;
  description: string;
  network: string;
  direction: string;
  category: string;
  status: string;
}

export interface MessageListResponse {
  count: number;
  messages: MessageListItem[];
  filters: {
    types: string[];
    networks: string[];
    directions: string[];
    categories: string[];
  };
}

export interface ParseResult {
  success: boolean;
  error: string | null;
  tree: ParsedNode | null;
  metadata: {
    messageType: string | null;
    namespace: string | null;
    rootElement: string;
  } | null;
  statistics: {
    totalElements: number;
    totalFields: number;
    maxDepth: number;
    glossaryMatches: number;
  } | null;
  flatFields?: FlatField[];
}

export interface FlatField {
  path: string;
  tag: string;
  depth: number;
  value?: string;
  attributes?: Record<string, string>;
  glossaryRef?: GlossaryRef;
}

// === Glossary Types ===
export interface GlossaryEntry {
  id: string;
  xmlTag: string;
  name: string;
  category: string;
  definition: string;
  dataType: string;
  maxLength: number | null;
  mandatory: boolean;
  format: string;
  example: string;
  usedIn: string[];
  relatedFields: string[];
}

export interface GlossaryResponse {
  count: number;
  categories: string[];
  entries: GlossaryEntry[];
}

// === Comparison Types ===
export interface ComparisonMapping {
  id: string;
  mtTag: string;
  mtName: string;
  mtFormat: string;
  mxElement: string;
  mxPath: string;
  mxFormat: string;
  keyDifference: string;
  mtExample: string;
  mxExample: string;
}

export interface ComparisonMetric {
  label: string;
  mtValue: string;
  mxValue: string;
  improvement: string;
  icon: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
  description: string;
  status: string;
}

export interface ComparisonSummary {
  metrics: ComparisonMetric[];
  timeline: TimelineEvent[];
  fieldStats: {
    totalMappings: number;
    directMappings: number;
    newMxFields: number;
  };
}

// === Validation Types ===
export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  status: "passed" | "failed" | "warning" | "skipped";
  message: string;
}

export interface ValidationResponse {
  passed: boolean;
  score: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
  results: ValidationResult[];
}

// === Metadata Types ===
export interface MetricItem {
  label: string;
  value: string;
  trend: string;
  description: string;
}

export interface GovernanceEntity {
  level: number;
  entity: string;
  role: string;
  description: string;
  influence: string;
}

export interface DataSource {
  name: string;
  type: string;
  status: string;
  description: string;
  url: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface RailMetadata {
  projectId: string;
  title: string;
  subtitle: string;
  railCategory: string;
  version: string;
  metrics: MetricItem[];
  whyThisMatters: {
    title: string;
    headline: string;
    content: string[];
    keyInsight: string;
    sources: string[];
  };
  whoControlsTheRail: {
    title: string;
    headline: string;
    summary: string;
    hierarchy: GovernanceEntity[];
    keyTension: string;
  };
  dataSources: DataSource[];
  globalAdoption?: {
    stat: string;
    trend: string;
    description: string;
    sourceUrl: string;
    asOfDate: string;
  };
  filters: {
    messageTypes: FilterOption[];
    networks: FilterOption[];
    directions: FilterOption[];
  };
}

// === UI State ===
export type ActiveTab = "explorer" | "compare" | "glossary" | "payloads" | "validate";

export interface FilterState {
  messageType: string | null;
  network: string | null;
  direction: string | null;
}
