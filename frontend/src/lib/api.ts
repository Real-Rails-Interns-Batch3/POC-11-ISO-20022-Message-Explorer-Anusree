// ISO 20022 Message Explorer — API Client with Mock Fallback
import type {
  MessageListResponse,
  Message,
  ParseResult,
  ValidationResponse,
  GlossaryResponse,
  ComparisonMapping,
  ComparisonSummary,
  RailMetadata,
} from "@/types";

const API_BASE = "http://localhost:8000/api";

// === Mock data imports (fallback when backend is unavailable) ===
import { MOCK_METADATA, MOCK_MESSAGES_LIST, MOCK_FULL_MESSAGES, MOCK_GLOSSARY, MOCK_COMPARISON, MOCK_COMPARISON_SUMMARY } from "./mock-data";

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  } catch {
    console.warn(`API unavailable for ${url}, using mock data`);
    throw new Error("API_UNAVAILABLE");
  }
}

// === Messages ===
export async function fetchMessages(filters?: {
  type?: string;
  network?: string;
  direction?: string;
}): Promise<MessageListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.type) params.set("type", filters.type);
    if (filters?.network) params.set("network", filters.network);
    if (filters?.direction) params.set("direction", filters.direction);
    const query = params.toString() ? `?${params.toString()}` : "";
    return await fetchApi<MessageListResponse>(`/messages${query}`);
  } catch {
    let filtered = MOCK_MESSAGES_LIST.messages;
    if (filters?.type) {
      filtered = filtered.filter(m => m.type.startsWith(filters.type!));
    }
    if (filters?.network) {
      filtered = filtered.filter(m => m.network === filters.network);
    }
    if (filters?.direction) {
      filtered = filtered.filter(m => m.direction === filters.direction);
    }
    return { ...MOCK_MESSAGES_LIST, count: filtered.length, messages: filtered };
  }
}

export async function fetchMessage(id: string): Promise<Message> {
  try {
    return await fetchApi<Message>(`/messages/${id}`);
  } catch {
    // Use MOCK_FULL_MESSAGES (has rawXml + parsed trees) instead of the summary list
    const full = MOCK_FULL_MESSAGES.find((m) => m.id === id);
    if (full) return full as unknown as Message;
    // Final fallback: list item (no raw/parsed, but at least shows metadata)
    const summary = MOCK_MESSAGES_LIST.messages.find((m) => m.id === id);
    if (!summary) throw new Error(`Message ${id} not found`);
    return summary as unknown as Message;
  }
}

export async function parseMessage(xml: string): Promise<ParseResult & { flatFields?: unknown[] }> {
  try {
    return await fetchApi(`/messages/parse`, {
      method: "POST",
      body: JSON.stringify({ xml }),
    });
  } catch {
    // Basic client-side mock parse
    return {
      success: true,
      error: null,
      tree: { tag: "Document", depth: 0, path: "Document", children: [] },
      metadata: { messageType: "unknown", namespace: null, rootElement: "Document" },
      statistics: { totalElements: 1, totalFields: 0, maxDepth: 0, glossaryMatches: 0 },
    };
  }
}

export async function validateMessage(xml: string): Promise<ValidationResponse> {
  try {
    return await fetchApi(`/messages/validate`, {
      method: "POST",
      body: JSON.stringify({ xml }),
    });
  } catch {
    return {
      passed: true,
      score: "0/0",
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 },
      results: [],
    };
  }
}

// === Glossary ===
export async function fetchGlossary(params?: {
  search?: string;
  category?: string;
}): Promise<GlossaryResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.category) searchParams.set("category", params.category);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await fetchApi<GlossaryResponse>(`/glossary${query}`);
  } catch {
    return MOCK_GLOSSARY;
  }
}

// === Comparison ===
export async function fetchComparison(): Promise<{
  count: number;
  mapping: ComparisonMapping[];
}> {
  try {
    return await fetchApi(`/comparison`);
  } catch {
    return MOCK_COMPARISON;
  }
}

export async function fetchComparisonSummary(): Promise<ComparisonSummary> {
  try {
    return await fetchApi<ComparisonSummary>(`/comparison/summary`);
  } catch {
    return MOCK_COMPARISON_SUMMARY;
  }
}

// === Metadata ===
export async function fetchMetadata(): Promise<RailMetadata> {
  try {
    return await fetchApi<RailMetadata>(`/metadata`);
  } catch {
    return MOCK_METADATA;
  }
}
