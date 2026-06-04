'use client';

import React, { useMemo, useEffect } from 'react';
import { ReactFlow, Background, MarkerType, Edge, Node, useNodesState, useEdgesState, Position } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import type { ParsedNode } from '@/types';

interface PaymentChainGraphProps {
  messageData: ParsedNode;
}

const nodeWidth = 180;
const nodeHeight = 80;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });

  return { nodes, edges };
};

export default function PaymentChainGraph({ messageData }: PaymentChainGraphProps) {
  // Extract chain entities: Dbtr, DbtrAgt, CdtrAgt, Cdtr
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // In a real application, we would traverse messageData dynamically. 
    // For this mock representation, we'll extract the known paths for a typical pacs.008 flow.
    const extractName = (tag: string) => {
      let foundName = '';
      const traverse = (node: ParsedNode) => {
        if (node.tag === tag) {
          const nmNode = node.children?.find(c => c.tag === 'Nm');
          if (nmNode?.value) foundName = nmNode.value;
          else {
             // check for FinInstnId -> BICFI
             const finInstn = node.children?.find(c => c.tag === 'FinInstnId');
             const bic = finInstn?.children?.find(c => c.tag === 'BICFI');
             if (bic?.value) foundName = bic.value;
          }
        }
        if (node.children) node.children.forEach(traverse);
      };
      traverse(messageData);
      return foundName || tag;
    };

    const dbtr = extractName('Dbtr');
    const dbtrAgt = extractName('DbtrAgt');
    const cdtrAgt = extractName('CdtrAgt');
    const cdtr = extractName('Cdtr');

    nodes.push({
      id: 'dbtr',
      position: { x: 0, y: 0 },
      data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px] text-[var(--accent-cyan)]">Debtor</div>{dbtr}</div> },
      style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '10px' },
    });

    nodes.push({
      id: 'dbtrAgt',
      position: { x: 0, y: 0 },
      data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px]">Debtor Agent</div>{dbtrAgt}</div> },
      style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '10px' },
    });

    nodes.push({
      id: 'cdtrAgt',
      position: { x: 0, y: 0 },
      data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px]">Creditor Agent</div>{cdtrAgt}</div> },
      style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '10px' },
    });

    nodes.push({
      id: 'cdtr',
      position: { x: 0, y: 0 },
      data: { label: <div className="text-center font-mono text-[10px]"><div className="font-bold text-[12px] text-[var(--success)]">Creditor</div>{cdtr}</div> },
      style: { background: 'var(--surface-navy)', color: 'var(--text-primary)', border: '1px solid var(--border-slate)', borderRadius: '6px', padding: '10px' },
    });

    edges.push({ id: 'e1', source: 'dbtr', target: 'dbtrAgt', animated: true, style: { stroke: 'var(--border-active)' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-active)' } });
    edges.push({ id: 'e2', source: 'dbtrAgt', target: 'cdtrAgt', animated: true, style: { stroke: 'var(--accent-indigo)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-indigo)' }, label: 'pacs.008', labelStyle: { fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 'bold' } });
    edges.push({ id: 'e3', source: 'cdtrAgt', target: 'cdtr', animated: true, style: { stroke: 'var(--border-active)' }, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--border-active)' } });

    return getLayoutedElements(nodes, edges, 'LR');
  }, [messageData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="w-full h-[400px] border border-[var(--border-slate)] rounded-lg bg-[var(--bg-obsidian)] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border-slate)" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
