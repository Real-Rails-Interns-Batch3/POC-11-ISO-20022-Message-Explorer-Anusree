'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import ComparisonView from '@/components/ComparisonView';
import GlossaryView from '@/components/GlossaryView';
import MessageExplorer from '@/components/MessageExplorer';
import PayloadLibrary from '@/components/PayloadLibrary';
import ValidationView from '@/components/ValidationView';
import { fetchMetadata } from '@/lib/api';
import type { RailMetadata, FilterState } from '@/types';

export type DashboardTab =
  | 'Message Tree'
  | 'Raw JSON'
  | 'MT ↔ MX Compare'
  | 'Validation'
  | 'Field Glossary';

export default function Home() {
  const [metadata, setMetadata] = useState<RailMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('MT ↔ MX Compare');
  const [filters, setFilters] = useState<FilterState>({
    messageType: null,
    network: null,
    direction: null,
  });

  // Fetch metadata on mount
  useEffect(() => {
    fetchMetadata().then((data) => {
      setMetadata(data);
    });
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (activeTab !== 'Message Tree') {
      setActiveTab('Message Tree');
    }
  };

  const tabs: DashboardTab[] = [
    'Message Tree',
    'Raw JSON',
    'MT ↔ MX Compare',
    'Validation',
    'Field Glossary',
  ];

  const messageCards = [
    {
      id: 'pacs.008-fednow',
      tag: 'ACCP',
      tagColor: 'var(--accent-cyan)',
      title: 'pacs.008',
      desc: 'FedNow instant credit — invoice...',
      subDesc: 'FedNow — USD 1,250',
      active: (filters.messageType === 'pacs.008' && filters.network === 'FedNow') || (filters.messageType === null && filters.network === null),
    },
    {
      id: 'pacs.008-sepa',
      tag: 'ACCP',
      tagColor: 'var(--accent-cyan)',
      title: 'pacs.008',
      desc: 'SEPA Instant — cross-border EUR',
      subDesc: 'SEPA Instant — EUR 8,420.55',
      active: filters.messageType === 'pacs.008' && filters.network === 'SEPA',
    },
    {
      id: 'pacs.002',
      tag: 'RJCT',
      tagColor: 'var(--error)',
      title: 'pacs.002',
      desc: 'Status report — rejection (insufficie...',
      subDesc: 'FedNow — USD 0',
      active: filters.messageType === 'pacs.002',
    },
    {
      id: 'pain.001',
      tag: 'PDNG',
      tagColor: 'var(--accent-indigo)',
      title: 'pain.001',
      desc: 'Corporate batch initiation — payroll',
      subDesc: 'SEPA Instant — EUR 184,220',
      active: filters.messageType === 'pain.001',
    },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--bg-obsidian)] text-[var(--text-primary)] font-sans antialiased">
      {/* ── TOP NAV BAR ── */}
      <header className="flex items-center justify-between px-10 h-16 border-b border-[var(--border-slate)] shrink-0 bg-[var(--bg-obsidian)] text-sm font-mono shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_10px_var(--accent-cyan)]" />
          <h1 className="font-semibold tracking-wider text-sm">
            <span className="text-white">REAL RAILS</span> <span className="text-[var(--text-tertiary)] mx-1">/</span> <span className="text-[var(--text-secondary)]">ISO 20022 Message Explorer</span>
          </h1>
          <span className="ml-4 px-4 py-1.5 rounded-md bg-[var(--surface-navy)] border border-[var(--border-slate)] text-[var(--text-secondary)] text-xs tracking-wide font-medium">
            PoC - 11
          </span>
        </div>
        <div className="flex items-center gap-6 text-[var(--text-secondary)] text-xs font-mono">
          <span className="hover:text-[var(--text-primary)] cursor-pointer text-[var(--text-tertiary)] transition-colors">Rail · Payments</span>
          <span className="text-[var(--border-slate)]">|</span>
          <span className="hover:text-[var(--text-primary)] cursor-pointer text-[var(--text-tertiary)] transition-colors">Sources · FedNow · EPC</span>
          <span className="text-[var(--border-slate)]">|</span>
          <div className="flex items-center gap-2 bg-[var(--surface-navy)] px-3 py-1.5 rounded-md border border-[var(--border-slate)]">
            <span className="text-[var(--accent-cyan)] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)] inline-block"></span>
              LIVE
            </span>
            <span className="text-[var(--text-tertiary)]">·</span>
            <span className="text-[var(--text-tertiary)]">MOCK FALLBACK</span>
          </div>
        </div>
      </header>

      {/* ── MAIN BODY ── */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* LEFT STAGE */}
        <main className="w-full lg:w-[70%] lg:min-w-[700px] flex flex-col h-full border-b lg:border-b-0 lg:border-r border-[var(--border-slate)] overflow-hidden">
          
          {/* Message Cards Scroll Container */}
          <div className="px-6 pt-4 pb-5 shrink-0 flex gap-3 overflow-x-auto border-b border-[var(--border-slate)]">
            {messageCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  let net: string | null = null;
                  if (card.id === 'pacs.008-fednow') net = 'FedNow';
                  else if (card.id === 'pacs.008-sepa') net = 'SEPA';
                  else if (card.id === 'pacs.002') net = 'FedNow';
                  else if (card.id === 'pain.001') net = 'SEPA';

                  const typeValue = card.id.startsWith('pacs.008') ? 'pacs.008' : card.id;
                  handleFilterChange({
                    ...filters,
                    messageType: typeValue,
                    network: net,
                  });
                }}
                className={cn(
                  'flex flex-col gap-1.5 p-3 rounded-lg min-w-[240px] border cursor-pointer transition-colors',
                  card.active
                    ? 'border-[var(--accent-cyan)] bg-[rgba(56,189,248,0.03)] shadow-[0_0_12px_rgba(56,189,248,0.1)]'
                    : 'border-[var(--border-slate)] bg-[var(--surface-navy)] hover:border-[var(--text-tertiary)]'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('text-sm font-semibold', card.active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-secondary)]')}>
                    {card.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-current font-mono" style={{ color: card.tagColor }}>
                    {card.tag}
                  </span>
                </div>
                <div className="text-xs text-[var(--text-primary)] truncate">
                  {card.desc}
                </div>
                <div className="text-[11px] text-[var(--text-tertiary)]">
                  {card.subDesc}
                </div>
              </div>
            ))}
          </div>



          {/* Tabs */}
          <div className="px-6 flex gap-6 border-b border-[var(--border-slate)] shrink-0 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'py-3 text-[13px] font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap',
                    isActive
                      ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Active Content Stage */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 bg-[rgba(3,7,18,0.3)]">
            {activeTab === 'Message Tree' && <MessageExplorer filters={filters} />}
            {activeTab === 'Raw JSON' && <PayloadLibrary />}
            {activeTab === 'MT ↔ MX Compare' && <ComparisonView />}
            {activeTab === 'Validation' && <ValidationView />}
            {activeTab === 'Field Glossary' && <GlossaryView />}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="w-full lg:w-[30%] lg:min-w-[360px] shrink-0 lg:h-full h-auto max-h-[500px] lg:max-h-full bg-[var(--surface-navy)] overflow-y-auto border-l-0 lg:border-l border-[var(--border-slate)]">
          <Sidebar activeTab={activeTab} metadata={metadata} filters={filters} onFilterChange={handleFilterChange} />
        </aside>
      </div>
    </div>
  );
}
