'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchGlossary } from '@/lib/api';
import type { GlossaryEntry } from '@/types';

const getTagPath = (xmlTag: string): string => {
  switch (xmlTag) {
    case 'MsgId': return 'GrpHdr.MsgId';
    case 'CreDtTm': return 'GrpHdr.CreDtTm';
    case 'NbOfTxs': return 'GrpHdr.NbOfTxs';
    case 'EndToEndId': return 'CdtTrfTxInf.PmtId.EndToEndId';
    case 'IntrBkSttlmAmt': return 'CdtTrfTxInf.IntrBkSttlmAmt';
    case 'ChrgBr': return 'CdtTrfTxInf.ChrgBr';
    case 'Dbtr.Nm': return 'CdtTrfTxInf.Dbtr.Nm';
    case 'BICFI': return 'CdtTrfTxInf.DbtrAgt.FinInstnId.BICFI';
    case 'SttlmMtd': return 'GrpHdr.SttlmInf.SttlmMtd';
    case 'InstrId': return 'CdtTrfTxInf.PmtId.InstrId';
    case 'TxId': return 'CdtTrfTxInf.PmtId.TxId';
    case 'UETR': return 'CdtTrfTxInf.PmtId.UETR';
    case 'InstdAmt': return 'CdtTrfTxInf.Amt.InstdAmt';
    case 'Dbtr': return 'CdtTrfTxInf.Dbtr';
    case 'Cdtr': return 'CdtTrfTxInf.Cdtr.Nm';
    case 'RmtInf': return 'CdtTrfTxInf.RmtInf';
    case 'TxSts': return 'TxInfAndSts.TxSts';
    default: return '';
  }
};

const getLegacyMt = (xmlTag: string): string => {
  switch (xmlTag) {
    case 'MsgId': return 'MT103 :20:';
    case 'CreDtTm': return 'MT103 :32A:\n(date portion)';
    case 'NbOfTxs': return '—';
    case 'EndToEndId': return 'MT103 :70: (Line 1)';
    case 'IntrBkSttlmAmt': return 'MT103 :32A:\n(amount)';
    case 'ChrgBr': return 'MT103 :71A:';
    case 'Dbtr.Nm': return 'MT103 :50K:\n(Line 2+)';
    case 'BICFI': return 'MT103 :52A:';
    case 'InstdAmt': return 'MT103 :33B:';
    case 'Cdtr': return 'MT103 :59:\n(Line 2+)';
    case 'RmtInf': return 'MT103 :70:';
    default: return '—';
  }
};

export default function GlossaryView() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchGlossary();
      setEntries(data.entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load glossary');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase().trim();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.xmlTag.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q)
    );
  }, [entries, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-cyan)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Loading field glossary…
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
    <div className="flex flex-col gap-8 animate-fade-in w-full h-full">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search field name, tag, or MT equivalent.."
          className="w-full bg-[var(--surface-navy)] border border-[var(--border-slate)] text-[var(--text-primary)] rounded-lg pl-10 pr-4 py-3 text-[13px] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors placeholder:text-[var(--text-tertiary)]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-3 text-[10px] uppercase font-mono px-2 py-1 rounded bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] text-[var(--text-secondary)]"
          >
            Clear
          </button>
        )}
      </div>

      <div className="w-full overflow-y-auto">
        <table className="w-full text-left text-[12.5px] border-separate" style={{ borderSpacing: '0 10px' }}>
          <thead>
            <tr className="border-b border-[var(--border-slate)] text-[10px] font-mono tracking-widest text-[var(--text-tertiary)] uppercase">
              <th className="py-3 font-semibold w-[220px]">TAG</th>
              <th className="py-3 font-semibold w-[240px]">NAME / TYPE</th>
              <th className="py-3 font-semibold min-w-[280px]">DESCRIPTION</th>
              <th className="py-3 font-semibold w-[180px]">LEGACY MT</th>
            </tr>
          </thead>
          <tbody className="font-sans">
            {filtered.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(56,189,248,0.03)] transition-colors group'
                )}
              >
                {/* TAG */}
                <td style={{ paddingTop: '24px', paddingBottom: '24px' }} className="align-top pr-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[var(--accent-cyan)] font-semibold text-[12px]">
                      {row.xmlTag}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-tertiary)] truncate">
                      {getTagPath(row.xmlTag)}
                    </span>
                  </div>
                </td>

                {/* NAME / TYPE */}
                <td style={{ paddingTop: '24px', paddingBottom: '24px' }} className="align-top pr-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--text-primary)] font-medium">
                      {row.name}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {row.dataType} ·{' '}
                      {row.mandatory ? (
                        <span className="text-[var(--accent-indigo)]">required</span>
                      ) : (
                        <span className="text-[var(--text-tertiary)]">optional</span>
                      )}
                    </span>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td style={{ paddingTop: '24px', paddingBottom: '24px' }} className="align-top pr-6 text-[var(--text-secondary)] leading-[1.75] text-[12.5px]">
                  {row.definition}
                </td>

                {/* LEGACY MT */}
                <td style={{ paddingTop: '24px', paddingBottom: '24px' }} className="align-top">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[11px] text-[var(--accent-indigo)] whitespace-pre-line leading-relaxed">
                      {getLegacyMt(row.xmlTag)}
                    </span>
                    <button className="border border-[var(--border-slate)] text-[var(--text-tertiary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] px-2 py-0.5 rounded text-[10px] font-mono tracking-wider ml-2 shrink-0">
                      locate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[var(--text-tertiary)] text-[13px]">
            No fields match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
