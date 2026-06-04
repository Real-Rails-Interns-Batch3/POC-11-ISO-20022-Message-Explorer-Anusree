'use client';

import React, { useMemo } from 'react';
import type { ParsedNode } from '@/types';

interface MessageTimelineProps {
  messageData: ParsedNode;
}

export default function MessageTimeline({ messageData }: MessageTimelineProps) {
  // Extract temporal fields
  const timelineEvents = useMemo(() => {
    const events: { label: string; date: string; tag: string }[] = [];
    
    const extractDate = (tag: string, label: string) => {
      const traverse = (node: ParsedNode) => {
        if (node.tag === tag && node.value) {
          events.push({ label, date: node.value, tag });
        }
        if (node.children) node.children.forEach(traverse);
      };
      traverse(messageData);
    };

    extractDate('CreDtTm', 'Creation Date Time');
    extractDate('IntrBkSttlmDt', 'Interbank Settlement Date');
    extractDate('AccptncDtTm', 'Acceptance Date Time');
    extractDate('ReqdExctnDt', 'Requested Execution Date');

    // Sort events by date
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [messageData]);

  if (timelineEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
        <p className="text-sm">No temporal fields found in this message.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative border-l-2 border-[var(--border-slate)] ml-4 pl-8 space-y-8">
        {timelineEvents.map((event, i) => (
          <div key={i} className="relative">
            {/* Timeline node */}
            <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[var(--surface-navy)] border-2 border-[var(--accent-cyan)] shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            
            <div className="bg-[rgba(3,7,18,0.4)] border border-[var(--border-slate)] p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[var(--accent-cyan)] px-2 py-0.5 bg-[rgba(56,189,248,0.1)] rounded">
                  {event.tag}
                </span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {event.label}
                </span>
              </div>
              <p className="font-mono text-sm text-[var(--success)]">
                {event.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
