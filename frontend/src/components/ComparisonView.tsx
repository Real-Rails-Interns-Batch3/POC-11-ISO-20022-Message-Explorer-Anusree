'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchComparison, fetchComparisonSummary } from '@/lib/api';
import type { ComparisonMapping, ComparisonSummary } from '@/types';

export default function ComparisonView() {
  const [mappings, setMappings] = useState<ComparisonMapping[]>([]);
  const [summary, setSummary] = useState<ComparisonSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [compData, summData] = await Promise.all([
        fetchComparison(),
        fetchComparisonSummary(),
      ]);
      setMappings(compData.mapping);
      setSummary(summData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-cyan)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Loading comparison data…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-8 h-8" style={{ color: 'var(--error)' }} />
        <p className="text-sm" style={{ color: 'var(--error)' }}>{error}</p>
        <button onClick={loadData} className="btn btn-secondary text-xs">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)] tracking-wide">
          Legacy SWIFT MT <span className="text-[var(--text-secondary)] font-normal mx-1">↔</span> ISO 20022 MX
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)] max-w-4xl leading-relaxed">
          The 2025 SWIFT MT retirement collapses free-form telex tags into structured, typed fields. Each row shows how a legacy <span className="text-[var(--accent-cyan)] font-mono">MT103</span> tag maps to its modern equivalent.
        </p>
      </div>

      <div className="w-full">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[var(--border-slate)] text-[10px] font-mono tracking-widest text-[var(--text-tertiary)] uppercase">
              <th className="py-3 font-semibold">MT TAG</th>
              <th className="py-3 font-semibold">LEGACY MEANING</th>
              <th className="py-3 font-semibold">ISO 20022 PATH</th>
              <th className="py-3 font-semibold">WHAT CHANGED</th>
            </tr>
          </thead>
          <tbody className="font-sans">
            {mappings.map((row, idx) => {
              const isNew = row.mtTag === 'N/A';
              const isExpanded = expandedRow === row.id;

              return (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => toggleRow(row.id)}
                    className={cn(
                      'border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(56,189,248,0.03)] cursor-pointer transition-colors',
                      isExpanded ? 'bg-[rgba(56,189,248,0.03)]' : ''
                    )}
                  >
                    {/* MT TAG */}
                    <td className="py-4 font-mono text-[var(--accent-cyan)] text-[12px] font-medium w-[100px]">
                      {isNew ? (
                        <span className="badge badge-indigo">NEW</span>
                      ) : (
                        <span style={{ color: 'var(--warning)' }}>{row.mtTag}</span>
                      )}
                    </td>

                    {/* LEGACY MEANING */}
                    <td className="py-4 text-[var(--text-primary)] w-[240px]">
                      {row.mtName}
                    </td>

                    {/* ISO PATH */}
                    <td className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[12px] text-[var(--accent-indigo)]">
                          {row.mxElement}
                        </span>
                        <span className="text-[11px] text-[var(--text-tertiary)]">
                          {row.mxFormat}
                        </span>
                      </div>
                    </td>

                    {/* WHAT CHANGED */}
                    <td className="py-4 text-[var(--text-secondary)] text-[12px] leading-relaxed max-w-[340px]">
                      {row.keyDifference}
                    </td>
                  </tr>

                  {/* ── Expanded row: MT / MX examples side-by-side ── */}
                  {isExpanded && (
                    <tr style={{ background: 'var(--bg-obsidian)' }}>
                      <td colSpan={4} className="px-10 py-6 border-b border-[rgba(255,255,255,0.05)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                          {/* MT Example */}
                          <div>
                            <span
                              className="text-[10px] font-semibold uppercase tracking-widest mb-3 block"
                              style={{ color: 'var(--warning)' }}
                            >
                              Legacy MT Example
                            </span>
                            <div className="xml-display text-[11px] whitespace-pre-wrap break-all bg-[rgba(3,7,18,0.5)] p-4 rounded-lg border border-[var(--border-slate)]">
                              {row.mtExample}
                            </div>
                          </div>

                          {/* MX Example */}
                          <div>
                            <span
                              className="text-[10px] font-semibold uppercase tracking-widest mb-3 block"
                              style={{ color: 'var(--success)' }}
                            >
                              ISO 20022 MX Example
                            </span>
                            <div className="xml-display text-[11px] whitespace-pre-wrap break-all bg-[rgba(3,7,18,0.5)] p-4 rounded-lg border border-[var(--border-slate)]">
                              {row.mxExample}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
