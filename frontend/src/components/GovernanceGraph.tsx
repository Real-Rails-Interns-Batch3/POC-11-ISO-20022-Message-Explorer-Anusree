'use client';

import React, { useMemo } from 'react';
import { ReactFlow, Background, MarkerType, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: 'iso',
    position: { x: 190, y: 10 },
    data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px] text-[var(--accent-cyan)]">ISO TC 68</div>Standard Setter</div> },
    style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '6px 10px', width: 140 },
  },
  {
    id: 'rmg',
    position: { x: 190, y: 80 },
    data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px]">RMG</div>Registration</div> },
    style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '6px 10px', width: 140 },
  },
  {
    id: 'swift',
    position: { x: 110, y: 160 },
    data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px]">SWIFT</div>Repository</div> },
    style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '6px 10px', width: 120 },
  },
  {
    id: 'cb',
    position: { x: 280, y: 160 },
    data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px] text-[var(--accent-indigo)]">Central Banks</div>Adoption Drivers</div> },
    style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '6px 10px', width: 140 },
  },
  {
    id: 'banks',
    position: { x: 190, y: 240 },
    data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px]">Commercial Banks</div>Implementers</div> },
    style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '6px 10px', width: 140 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1', source: 'iso', target: 'rmg', animated: true, style: { stroke: 'var(--border-active)' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-active)' } },
  { id: 'e2', source: 'rmg', target: 'swift', animated: true, style: { stroke: 'var(--border-slate)' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-slate)' } },
  { id: 'e3', source: 'rmg', target: 'cb', animated: true, style: { stroke: 'var(--border-slate)' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-slate)' } },
  { id: 'e4', source: 'cb', target: 'banks', animated: true, style: { stroke: 'var(--accent-indigo)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-indigo)' } },
  { id: 'e5', source: 'swift', target: 'banks', animated: true, style: { stroke: 'var(--border-slate)' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-slate)' } },
];

export default function GovernanceGraph() {
  const nodes = useMemo(() => initialNodes, []);
  const edges = useMemo(() => initialEdges, []);

  return (
    <div className="w-full h-full" style={{ minHeight: '300px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnDrag={false}
      >
        <Background color="var(--border-slate)" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
