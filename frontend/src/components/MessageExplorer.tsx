'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  FileText,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getNetworkColor,
  getStatusColor,
  highlightXml,
  truncate,
} from '@/lib/utils';
import { fetchMessages, fetchMessage } from '@/lib/api';
import PaymentChainGraph from './PaymentChainGraph';
import MessageTimeline from './MessageTimeline';
import ParsedFieldsTable from './ParsedFieldsTable';
import type {
  FilterState,
  MessageListItem,
  Message,
  ParsedNode,
} from '@/types';

// ─── TreeNode Sub-Component ───────────────────────────────────────────────────
interface TreeNodeProps {
  node: ParsedNode;
  depth?: number;
  defaultExpanded?: boolean;
}

function TreeNode({ node, depth = 0, defaultExpanded = true }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded && depth < 3);
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;

  return (
    <div className="select-none">
      <div
        className={cn(
          'flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors duration-150 group',
          hasChildren && 'cursor-pointer hover:bg-[rgba(56,189,248,0.06)]',
          isLeaf && 'cursor-default'
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Expand/collapse icon */}
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0 transition-transform duration-150" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0 transition-transform duration-150" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Tag name with Glossary Tooltip */}
        <div className="relative group/tooltip flex items-center">
          <span
            className="font-mono text-xs font-semibold cursor-help border-b border-dashed border-[rgba(56,189,248,0.5)]"
            style={{ color: 'var(--accent-cyan)' }}
          >
            {node.tag}
          </span>
          {node.glossaryRef && (
            <div className="absolute left-full ml-3 top-0 z-50 hidden group-hover/tooltip:block w-72 p-4 bg-[var(--surface-elevated)] border border-[var(--border-active)] rounded-lg shadow-2xl text-left pointer-events-none before:content-[''] before:absolute before:right-full before:top-2 before:border-8 before:border-transparent before:border-r-[var(--border-active)]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[13px] font-bold text-[var(--accent-cyan)]">{node.tag}</span>
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded">{node.glossaryRef.dataType}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-3 whitespace-normal break-words leading-relaxed">
                {node.glossaryRef.definition}
              </p>
              <div className="flex items-center gap-3 mt-2 pt-3 border-t border-[rgba(255,255,255,0.05)] text-[10px] font-mono">
                {node.glossaryRef.mandatory ? (
                  <span className="text-[var(--error)] bg-[rgba(239,68,68,0.1)] px-2 py-1 rounded border border-[rgba(239,68,68,0.2)]">MANDATORY</span>
                ) : (
                  <span className="text-[var(--text-tertiary)] bg-[var(--surface-navy)] px-2 py-1 rounded border border-[var(--border-slate)]">OPTIONAL</span>
                )}
                {node.glossaryRef.maxLength && (
                  <span className="text-[var(--text-tertiary)] flex items-center gap-1">
                    <span className="opacity-50">Max:</span> {node.glossaryRef.maxLength}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Attributes */}
        {node.attributes &&
          Object.entries(node.attributes).map(([key, val]) => (
            <span key={key} className="text-[11px]">
              <span style={{ color: 'var(--accent-indigo)' }}>{key}</span>
              <span className="text-[var(--text-tertiary)]">=</span>
              <span style={{ color: 'var(--success)' }}>&quot;{val}&quot;</span>
            </span>
          ))}

        {/* Leaf value inline */}
        {isLeaf && node.value && (
          <>
            <span className="text-[var(--text-tertiary)] text-[11px]">:</span>
            <span
              className="font-mono text-xs"
              style={{ color: 'var(--success)' }}
            >
              {node.value}
            </span>
          </>
        )}

        {/* Children count badge */}
        {hasChildren && (
          <span className="text-[10px] text-[var(--text-tertiary)] ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ({node.children!.length})
          </span>
        )}
      </div>

      {/* Render children */}
      {hasChildren && expanded && (
        <div className="animate-fade-in">
          {node.children!.map((child, i) => (
            <TreeNode
              key={`${child.path}-${i}`}
              node={child}
              depth={depth + 1}
              defaultExpanded={depth < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helper: Collect all leaf fields from a parsed tree ───────────────────────
interface LeafField {
  tag: string;
  path: string;
  value: string;
  dataType: string;
}

function collectLeafFields(node: ParsedNode, acc: LeafField[] = []): LeafField[] {
  if ((!node.children || node.children.length === 0) && node.value) {
    acc.push({
      tag: node.tag,
      path: node.path,
      value: node.value,
      dataType: node.glossaryRef?.dataType ?? inferDataType(node.value),
    });
  }
  if (node.children) {
    node.children.forEach((child) => collectLeafFields(child, acc));
  }
  return acc;
}

function inferDataType(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return 'ISODateTime';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'ISODate';
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))
    return 'UUIDv4';
  if (/^\d+\.\d+$/.test(value)) return 'Decimal';
  if (/^\d+$/.test(value)) return 'Integer';
  if (/^[A-Z]{2,}$/.test(value)) return 'Code';
  return 'Text';
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function MessageCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-5 w-24 rounded-md bg-[var(--surface-elevated)] animate-shimmer" />
        <div className="h-5 w-16 rounded-md bg-[var(--surface-elevated)] animate-shimmer" />
      </div>
      <div className="h-4 w-3/4 rounded bg-[var(--surface-elevated)] animate-shimmer" />
      <div className="h-3 w-full rounded bg-[var(--surface-elevated)] animate-shimmer" />
      <div className="h-3 w-1/2 rounded bg-[var(--surface-elevated)] animate-shimmer" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="h-6 w-48 rounded bg-[var(--surface-elevated)] animate-shimmer" />
      <div className="h-4 w-full rounded bg-[var(--surface-elevated)] animate-shimmer" />
      <div className="h-64 w-full rounded-lg bg-[var(--surface-elevated)] animate-shimmer" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface MessageExplorerProps {
  filters: FilterState;
}

export default function MessageExplorer({ filters }: MessageExplorerProps) {
  const [messages, setMessages] = useState<MessageListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tree' | 'payment_chain' | 'timeline' | 'raw' | 'fields'>('tree');
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch message list on mount and when filters change
  useEffect(() => {
    let cancelled = false;
    setListLoading(true);

    fetchMessages({
      type: filters.messageType ?? undefined,
      network: filters.network ?? undefined,
      direction: filters.direction ?? undefined,
    }).then((res) => {
      if (!cancelled) {
        setMessages(res.messages);
        setListLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  // Fetch full message detail when selection changes
  const handleSelect = useCallback(async (id: string) => {
    setSelectedId(id);
    setDetailLoading(true);
    setActiveTab('tree');
    try {
      const msg = await fetchMessage(id);
      setSelectedMessage(msg);
    } catch {
      setSelectedMessage(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // Filter messages by search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.network.toLowerCase().includes(q)
    );
  }, [messages, searchQuery]);

  // Collect leaf fields for parsed fields tab
  const leafFields = useMemo(() => {
    if (!selectedMessage?.parsed) return [];
    return collectLeafFields(selectedMessage.parsed);
  }, [selectedMessage]);

  const tabs = [
    { key: 'tree' as const, label: 'Tree View' },
    { key: 'payment_chain' as const, label: 'Payment Chain' },
    { key: 'timeline' as const, label: 'Timeline' },
    { key: 'raw' as const, label: 'Raw XML' },
    { key: 'fields' as const, label: 'Parsed Fields' },
  ];

  return (
    <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
      {/* ── Left Panel: Message List (40%) ───────────────────────────────── */}
      <div className="w-[40%] flex flex-col gap-3 shrink-0">
        {/* Search input */}
        <div className="relative shrink-0 mb-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[var(--surface-navy)] border border-[var(--border-slate)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors shadow-sm"
          />
        </div>

        {/* Message cards */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          {listLoading ? (
            <>
              <MessageCardSkeleton />
              <MessageCardSkeleton />
              <MessageCardSkeleton />
              <MessageCardSkeleton />
            </>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-tertiary)]">
              <Search className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm">No messages found</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg.id)}
                className={cn(
                  'glass-card glass-card-hover w-full text-left p-5 transition-all duration-200',
                  selectedId === msg.id && 'cyan-glow border-[var(--accent-cyan)]'
                )}
              >
                {/* Header row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="badge badge-cyan text-[10px]">{msg.type}</span>
                  <span className={cn('badge', getNetworkColor(msg.network))}>
                    {msg.network}
                  </span>
                  <span className={cn('badge', getStatusColor(msg.status))}>
                    {msg.status}
                  </span>
                  {msg.direction === 'outbound' ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent-cyan)] ml-auto" />
                  ) : (
                    <ArrowDownLeft className="w-3.5 h-3.5 text-[var(--accent-indigo)] ml-auto" />
                  )}
                </div>

                {/* Title */}
                <h4 className="text-sm font-medium text-[var(--text-primary)]">
                  {msg.title}
                </h4>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Right Panel: Message Detail (60%) ────────────────────────────── */}
      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        {detailLoading ? (
          <DetailSkeleton />
        ) : selectedMessage ? (
          <>
            {/* Detail header */}
            <div className="p-5 border-b border-[var(--border-slate)]">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="badge badge-cyan">{selectedMessage.type}</span>
                <span
                  className={cn(
                    'badge',
                    getNetworkColor(selectedMessage.network)
                  )}
                >
                  {selectedMessage.network}
                </span>
                <span
                  className={cn(
                    'badge',
                    getStatusColor(selectedMessage.status)
                  )}
                >
                  {selectedMessage.status}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {selectedMessage.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                {selectedMessage.description}
              </p>
            </div>

            {/* Tab navigation */}
            <div className="px-5 pt-4">
              <div className="tab-nav inline-flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={cn('tab-item', activeTab === tab.key && 'active')}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Tree View Tab */}
              {activeTab === 'tree' && (
                <div className="animate-fade-in">
                  {selectedMessage.parsed ? (
                    <div className="bg-[var(--bg-obsidian)] border border-[var(--border-slate)] rounded-lg p-3">
                      <TreeNode node={selectedMessage.parsed} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
                      <FileText className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">No parsed tree available for this message</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Chain Tab */}
              {activeTab === 'payment_chain' && (
                <div className="animate-fade-in p-2">
                  {selectedMessage.parsed ? (
                    <PaymentChainGraph messageData={selectedMessage.parsed} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
                      <FileText className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">No parsed tree available for this message</p>
                    </div>
                  )}
                </div>
              )}

              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="animate-fade-in">
                  {selectedMessage.parsed ? (
                    <MessageTimeline messageData={selectedMessage.parsed} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
                      <FileText className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">No parsed tree available for this message</p>
                    </div>
                  )}
                </div>
              )}

              {/* Raw XML Tab */}
              {activeTab === 'raw' && (
                <div className="animate-fade-in">
                  {selectedMessage.rawXml ? (
                    <div
                      className="xml-display"
                      dangerouslySetInnerHTML={{
                        __html: highlightXml(selectedMessage.rawXml),
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
                      <FileText className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">No raw XML available for this message</p>
                    </div>
                  )}
                </div>
              )}

              {/* Parsed Fields Tab */}
              {activeTab === 'fields' && (
                <div className="animate-fade-in">
                  {leafFields.length > 0 ? (
                    <ParsedFieldsTable data={leafFields} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
                      <FileText className="w-8 h-8 mb-3 opacity-40" />
                      <p className="text-sm">No parsed fields available for this message</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
            <div className="w-16 h-16 rounded-2xl bg-[var(--surface-navy)] border border-[var(--border-slate)] flex items-center justify-center mb-4 animate-float">
              <FileText className="w-7 h-7 text-[var(--accent-cyan)] opacity-60" />
            </div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
              Select a message to explore its structure
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Choose a message from the list to view its tree, raw XML, and parsed fields
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
