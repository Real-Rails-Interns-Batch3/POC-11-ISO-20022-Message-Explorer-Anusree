'use client';

import { cn } from '@/lib/utils';
import type { DashboardTab } from '@/app/page';
import type { RailMetadata, FilterState } from '@/types';
import { Activity } from 'lucide-react';
import { downloadJson } from '@/lib/utils';
import { MOCK_FULL_MESSAGES } from '@/lib/mock-data';
import GovernanceGraph from './GovernanceGraph';
import D3Sparkline from './D3Sparkline';

interface SidebarProps {
  activeTab: DashboardTab;
  metadata: RailMetadata | null;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function Sidebar({ activeTab, metadata, filters, onFilterChange }: SidebarProps) {
  const isGlossary = activeTab === 'Field Glossary';

  if (!metadata) {
    return (
      <div className="flex flex-col h-full overflow-y-auto px-6 py-6 items-center justify-center">
        <Activity className="w-6 h-6 animate-pulse-cyan text-[var(--accent-cyan)] mb-3" />
        <p className="text-sm text-[var(--text-secondary)]">Loading intelligence data…</p>
      </div>
    );
  }  const showWhyThisMatters = activeTab === 'MT ↔ MX Compare';

  // Derive active message details for the Snapshot
  let currentType = 'pacs.008';
  let currentScheme = 'FedNow';
  let currentStatus = 'ACCP';
  let statusColor = 'var(--success)';
  let statusBg = 'rgba(52,211,153,0.05)';
  let statusBorder = 'rgba(52,211,153,0.1)';

  if (filters.messageType === 'pacs.008' && filters.network === 'SEPA') {
    currentScheme = 'SEPA Instant';
  } else if (filters.messageType === 'pacs.002') {
    currentType = 'pacs.002';
    currentScheme = 'FedNow';
    currentStatus = 'RJCT';
    statusColor = 'var(--error)';
    statusBg = 'rgba(248,113,113,0.05)';
    statusBorder = 'rgba(248,113,113,0.2)';
  } else if (filters.messageType === 'pain.001') {
    currentType = 'pain.001';
    currentScheme = 'SEPA Instant';
    currentStatus = 'PDNG';
    statusColor = 'var(--accent-indigo)';
    statusBg = 'rgba(129,140,248,0.05)';
    statusBorder = 'rgba(129,140,248,0.2)';
  } else if (filters.messageType === 'camt.054') {
    currentType = 'camt.054';
    currentScheme = 'CHAPS';
  } else if (filters.messageType) {
    currentType = filters.messageType.split('.')[0] + '.' + filters.messageType.split('.')[1];
    currentScheme = filters.network || 'Multiple';
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto px-6 py-6 pb-20 gap-10">
      
      {/* A - SNAPSHOT */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
        <h3 className="text-[10px] font-mono tracking-widest text-[var(--accent-cyan)] font-semibold uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]"></span>
          A · SNAPSHOT
        </h3>
        
        <div className="flex flex-col gap-4 border border-[var(--border-slate)] rounded-xl p-5 bg-[rgba(3,7,18,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(56,189,248,0.03)] to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col w-full">
              <span className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Global ISO 20022 Adoption</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white tracking-tight">{metadata.globalAdoption?.stat || "78%"}</span>
                <span className="text-[11px] font-mono text-[var(--success)] font-medium bg-[rgba(52,211,153,0.1)] px-1.5 py-0.5 rounded flex items-center gap-1">
                  {metadata.globalAdoption?.trend || "↑ 14pts YoY"}
                </span>
                <D3Sparkline data={[60, 62, 65, 68, 72, 75, 78]} />
              </div>
            </div>
          </div>
          
          <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed relative z-10 mt-1">
            {metadata.globalAdoption?.description || "Share of cross-border value moving over ISO 20022-native rails (CBPR+, TARGET2, FedNow, Lynx, CHAPS)."}
          </p>
          
          {metadata.globalAdoption?.sourceUrl && (
            <div className="flex justify-between items-center relative z-10 mt-1 text-[10px] font-mono text-[var(--text-tertiary)]">
              <a href={metadata.globalAdoption.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-cyan)] hover:underline transition-colors">
                Source
              </a>
              <span>As of: {metadata.globalAdoption.asOfDate}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-2 relative z-10 border-t border-[rgba(255,255,255,0.05)] pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">Type</span>
              <span className="text-[11px] font-mono text-[var(--accent-cyan)] bg-[rgba(56,189,248,0.05)] px-2 py-1 rounded border border-[rgba(56,189,248,0.1)] inline-block w-fit">
                {currentType}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">Scheme</span>
              <span className="text-[11px] font-mono text-[var(--text-primary)] bg-[var(--surface-navy)] px-2 py-1 rounded border border-[var(--border-slate)] inline-block w-fit">
                {currentScheme}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">Status</span>
              <span 
                className="text-[11px] font-mono px-2 py-1 rounded border inline-block w-fit"
                style={{ color: statusColor, backgroundColor: statusBg, borderColor: statusBorder }}
              >
                {currentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showWhyThisMatters && (
        <div className="flex flex-col gap-4 animate-fade-in mt-2" style={{ animationDelay: '100ms' }}>
          <h3 className="text-[10px] font-mono tracking-widest text-[var(--accent-cyan)] font-semibold uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]"></span>
            B · WHY THIS MATTERS
          </h3>
          
          <div className="flex flex-col gap-4 border border-[var(--border-slate)] rounded-xl p-5 bg-[rgba(3,7,18,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(56,189,248,0.03)] to-transparent pointer-events-none"></div>
            
            <p className="text-[12.5px] text-[var(--text-primary)] font-medium leading-relaxed relative z-10 border-b border-[rgba(255,255,255,0.05)] pb-3">
              {metadata.whyThisMatters.headline}
            </p>

            <ul className="flex flex-col gap-3 relative z-10">
              <li className="flex items-start gap-2.5 text-[12px] text-[var(--text-secondary)] bg-[var(--surface-navy)] p-3 rounded-lg border border-[rgba(255,255,255,0.02)]">
                <span className="text-[var(--accent-cyan)] font-mono text-lg leading-none mt-[-2px]">›</span> 
                <span className="leading-relaxed">{metadata.whyThisMatters.keyInsight}</span>
              </li>
              {metadata.whyThisMatters.content.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <span className="text-[var(--accent-cyan)] font-mono opacity-50">›</span> 
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* C - WHO CONTROLS THE RAIL (Common) */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="text-[10px] font-mono tracking-widest text-[var(--accent-cyan)] font-semibold uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]"></span>
          C · WHO CONTROLS THE RAIL
        </h3>
        
        <div className="flex flex-col gap-4 border border-[var(--border-slate)] rounded-xl p-5 bg-[rgba(3,7,18,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
          {/* Subtle gradient background for premium feel */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(56,189,248,0.03)] to-transparent pointer-events-none"></div>

          <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed relative z-10">
            {metadata.whoControlsTheRail.summary}
          </p>

          <div className="relative z-10 mt-1 h-[300px] border border-[var(--border-slate)] rounded-lg bg-[var(--bg-obsidian)] overflow-hidden">
            <GovernanceGraph />
          </div>
        </div>
      </div>

      {/* D - FILTERS */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h3 className="text-[10px] font-mono tracking-widest text-[var(--accent-cyan)] font-semibold uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]"></span>
          D · FILTERS
        </h3>
        
        <div className="flex flex-col gap-4 border border-[var(--border-slate)] rounded-lg p-4 bg-[rgba(3,7,18,0.3)]">
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-tertiary)] uppercase">MESSAGE TYPE</span>
            <div className="flex flex-wrap gap-2">
              <span 
                onClick={() => onFilterChange({ ...filters, messageType: null })}
                className={cn(
                  "text-[11px] font-mono px-2 py-1 rounded border cursor-pointer",
                  filters.messageType === null 
                    ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)] bg-[rgba(56,189,248,0.06)]"
                    : "border-[var(--border-slate)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]"
                )}>
                ALL
              </span>
              {metadata.filters.messageTypes.map((opt) => (
                <span 
                  key={opt.value}
                  onClick={() => onFilterChange({ ...filters, messageType: opt.value })}
                  className={cn(
                    "text-[11px] font-mono px-2 py-1 rounded border cursor-pointer",
                    filters.messageType === opt.value 
                      ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)] bg-[rgba(56,189,248,0.06)]"
                      : "border-[var(--border-slate)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]"
                  )}>
                  {opt.value}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-tertiary)] uppercase">SCHEME</span>
            <div className="flex flex-wrap gap-2">
              <span 
                onClick={() => onFilterChange({ ...filters, network: null })}
                className={cn(
                  "text-[11px] font-mono px-2 py-1 rounded border cursor-pointer",
                  filters.network === null 
                    ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)] bg-[rgba(56,189,248,0.06)]"
                    : "border-[var(--border-slate)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]"
                )}>
                ALL
              </span>
              {metadata.filters.networks.map((opt) => (
                <span 
                  key={opt.value}
                  onClick={() => onFilterChange({ ...filters, network: opt.value })}
                  className={cn(
                    "text-[11px] font-mono px-2 py-1 rounded border cursor-pointer",
                    filters.network === opt.value 
                      ? "border-[var(--accent-cyan)] text-[var(--accent-cyan)] bg-[rgba(56,189,248,0.06)]"
                      : "border-[var(--border-slate)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]"
                  )}>
                  {opt.label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* E - SAMPLE DATA */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <h3 className="text-[10px] font-mono tracking-widest text-[var(--accent-cyan)] font-semibold uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_6px_var(--accent-cyan)]"></span>
          E · SAMPLE DATA
        </h3>
        
        <p className="text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
          Download the current payload as a standalone ISO 20022 JSON sample. All values are synthetic.
        </p>

        <button 
          onClick={() => downloadJson(MOCK_FULL_MESSAGES, 'iso20022-sample-messages.json')}
          className="flex items-center justify-between w-full p-3 rounded-lg border border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.04)] hover:bg-[rgba(56,189,248,0.08)] transition-colors group mt-2"
        >
          <span className="text-[13px] text-[var(--accent-cyan)] font-medium flex items-center gap-2">
            <span className="text-lg">↓</span> download
          </span>
          <span className="text-[11px] font-mono text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
            pacs.008-pay-001.json
          </span>
        </button>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-auto pt-10 pb-4">
        <p className="text-[10px] font-mono text-[var(--text-tertiary)] leading-relaxed text-justify opacity-70">
          Data shown is synthetic and labeled for demonstration. When live FedNow / EPC feeds are unavailable the explorer falls back to local mock data so the terminal remains operational.
        </p>
      </div>

    </div>
  );
}
