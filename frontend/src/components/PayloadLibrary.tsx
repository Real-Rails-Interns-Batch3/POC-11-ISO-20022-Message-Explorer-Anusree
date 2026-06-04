'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  Download,
  FileCode,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getNetworkColor, getStatusColor, highlightXml } from '@/lib/utils';
import { MOCK_FULL_MESSAGES } from '@/lib/mock-data';

export default function PayloadLibrary() {
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredMessages = useMemo(() => {
    return MOCK_FULL_MESSAGES.filter((msg) => {
      const matchesSearch =
        msg.title.toLowerCase().includes(search.toLowerCase()) ||
        msg.type.toLowerCase().includes(search.toLowerCase()) ||
        msg.description.toLowerCase().includes(search.toLowerCase());

      const matchesNetwork =
        networkFilter === 'All' || msg.network === networkFilter;

      return matchesSearch && matchesNetwork;
    });
  }, [search, networkFilter]);

  const handleCopy = async (id: string, xml: string) => {
    try {
      await navigator.clipboard.writeText(xml);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = (msg: typeof MOCK_FULL_MESSAGES[0]) => {
    const element = document.createElement('a');
    const file = new Blob([msg.rawXml], { type: 'application/xml' });
    element.href = URL.createObjectURL(file);
    element.download = `${msg.type}-${msg.id}.xml`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileCode className="w-5 h-5" style={{ color: 'var(--accent-cyan)' }} />
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Sample Payload Library
        </h2>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div
          className="relative flex items-center flex-1 rounded-lg border transition-colors duration-200 focus-within:border-[var(--accent-cyan)]"
          style={{
            background: 'var(--surface-navy)',
            borderColor: 'var(--border-slate)',
          }}
        >
          <Search className="absolute left-3 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter messages by type, title, or keyword..."
            className="w-full bg-transparent py-2 pl-10 pr-4 text-xs outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Network Selection */}
        <select
          value={networkFilter}
          onChange={(e) => setNetworkFilter(e.target.value)}
          className="text-xs rounded-lg px-3 py-2 outline-none transition-colors duration-200 min-w-[140px]"
          style={{
            background: 'var(--surface-navy)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-slate)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-slate)')}
        >
          <option value="All">All Networks</option>
          <option value="FedNow">FedNow (US)</option>
          <option value="SEPA">SEPA (EU)</option>
          <option value="SWIFT">SWIFT CBPR+</option>
        </select>
      </div>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 glass-card rounded-xl">
          <Search className="w-10 h-10 mb-4" style={{ color: 'var(--text-tertiary)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            No payloads match your filters
          </p>
          <button
            onClick={() => {
              setSearch('');
              setNetworkFilter('All');
            }}
            className="btn btn-secondary text-xs mt-4"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Payload Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredMessages.map((msg) => {
          const isExpanded = expandedId === msg.id;
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={cn(
                'glass-card p-6 transition-all duration-300 flex flex-col',
                isExpanded ? 'xl:col-span-2' : ''
              )}
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="badge badge-cyan text-[10px] font-mono">{msg.type}</span>
                  <span className={cn('badge text-[10px]', getNetworkColor(msg.network))}>
                    {msg.network}
                  </span>
                  <span className={cn('badge text-[10px]', getStatusColor(msg.status))}>
                    {msg.status}
                  </span>
                </div>
                <button
                  onClick={() => toggleExpand(msg.id)}
                  className="p-1 hover:bg-[rgba(255,255,255,0.05)] rounded transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  title={isExpanded ? 'Collapse Schema' : 'Expand Schema'}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-1.5">
                {msg.title}
              </h3>
              <p className={cn(
                "text-[13px] text-[var(--text-secondary)] leading-relaxed mb-5 flex-1",
                !isExpanded && "line-clamp-2"
              )}>
                {msg.description}
              </p>

              {/* Expanded XML Display */}
              {isExpanded && (
                <div className="my-4 animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--surface-navy)] border-t border-l border-r border-[var(--border-slate)] rounded-t-lg">
                    <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      {msg.type}.xml
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.rawXml)}
                        className="btn btn-secondary py-1 px-2.5 text-[10px] flex items-center gap-1.5"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                            <span style={{ color: 'var(--success)' }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy XML</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(msg)}
                        className="btn btn-secondary py-1 px-2.5 text-[10px] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                  <div
                    className="xml-display text-xs overflow-auto max-h-[450px] border-b border-l border-r border-[var(--border-slate)] rounded-b-lg"
                    dangerouslySetInnerHTML={{
                      __html: highlightXml(msg.rawXml),
                    }}
                  />
                </div>
              )}

              {/* Action Buttons (when collapsed) */}
              {!isExpanded && (
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border-slate)] pt-4 mt-auto">
                  <button
                    onClick={() => handleCopy(msg.id, msg.rawXml)}
                    className="btn btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[var(--success)]" />
                        <span className="text-[var(--success)]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(msg)}
                    className="btn btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => toggleExpand(msg.id)}
                    className="btn btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>View XML</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
