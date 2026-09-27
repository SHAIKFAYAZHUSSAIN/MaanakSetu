'use client';

import React, { useState, useMemo } from 'react';
import { StandardsGraphData, GraphNode } from '@/lib/graphEngine';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
} from 'lucide-react';

interface GraphVisualizerProps {
  graphData: StandardsGraphData;
}

export default function GraphVisualizer({ graphData }: GraphVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filter edges based on user selection
  const filteredEdges = useMemo(() => {
    if (filterType === 'ALL') return graphData.edges;
    return graphData.edges.filter((e) => e.type === filterType || e.label === filterType);
  }, [graphData.edges, filterType]);

  // Compute 2D node positions in a radial layout
  const layoutNodes = useMemo(() => {
    const centerNode = graphData.nodes.find((n) => n.group === 'primary') || graphData.nodes[0];
    const otherNodes = graphData.nodes.filter((n) => n.id !== centerNode?.id);

    const width = 800;
    const height = 480;
    const centerX = width / 2;
    const centerY = height / 2;

    const result: (GraphNode & { x: number; y: number })[] = [];

    if (centerNode) {
      result.push({ ...centerNode, x: centerX, y: centerY });
    }

    const totalOthers = otherNodes.length;
    otherNodes.forEach((node, index) => {
      let radius = 190;
      if (node.group === 'certification') radius = 190;
      if (node.group === 'amendment') radius = 190;
      if (node.group === 'testing') radius = 210;
      if (node.group === 'safety') radius = 200;

      const angle = (2 * Math.PI * index) / totalOthers - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      result.push({ ...node, x, y });
    });

    return result;
  }, [graphData.nodes]);

  const nodeCoordMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; node: GraphNode }>();
    layoutNodes.forEach((n) => map.set(n.id, { x: n.x, y: n.y, node: n }));
    return map;
  }, [layoutNodes]);

  const getNodeColor = (group: GraphNode['group']) => {
    switch (group) {
      case 'primary':
        return { fill: '#1d4ed8', stroke: '#3b82f6', text: '#bfdbfe', badge: 'bg-blue-600' };
      case 'safety':
        return { fill: '#be123c', stroke: '#f43f5e', text: '#fecdd3', badge: 'bg-rose-600' };
      case 'testing':
        return { fill: '#047857', stroke: '#10b981', text: '#a7f3d0', badge: 'bg-emerald-600' };
      case 'amendment':
        return { fill: '#b45309', stroke: '#f59e0b', text: '#fde68a', badge: 'bg-amber-600' };
      case 'certification':
        return { fill: '#7e22ce', stroke: '#a855f7', text: '#e9d5ff', badge: 'bg-purple-600' };
      default:
        return { fill: '#475569', stroke: '#94a3b8', text: '#e2e8f0', badge: 'bg-slate-600' };
    }
  };

  const relationshipTypes = ['ALL', 'REQUIRES', 'TESTED_BY', 'SAFETY_REQUIREMENT', 'AMENDED_BY', 'CERTIFICATION'];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md relative transition-colors">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Interactive Standards Knowledge Graph
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Traversing normative references, test methods, safety standards, and QCO certification
            </p>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.6))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.6))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setFilterType('ALL');
              setSelectedNode(null);
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Relationship Filters */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter Link:
        </span>
        {relationshipTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              filterType === type
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main SVG Graph Canvas */}
      <div className="relative w-full h-[480px] bg-slate-50 dark:bg-slate-950/90 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center transition-colors">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20 dark:opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <svg
          viewBox="0 0 800 480"
          className="w-full h-full select-none cursor-grab active:cursor-grabbing transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Arrow Head Marker Definitions */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
            </marker>
          </defs>

          {/* Render Graph Directed Edges */}
          <g className="edges">
            {filteredEdges.map((edge, idx) => {
              const from = nodeCoordMap.get(edge.from);
              const to = nodeCoordMap.get(edge.to);
              if (!from || !to) return null;

              const isEdgeHighlighted =
                selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isEdgeHighlighted ? '#2563eb' : '#94a3b8'}
                    strokeWidth={isEdgeHighlighted ? 2.5 : 1.5}
                    strokeDasharray={edge.type === 'AMENDED_BY' ? '4 3' : undefined}
                    markerEnd={isEdgeHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    className="transition-colors duration-200"
                  />
                  <rect
                    x={midX - 32}
                    y={midY - 9}
                    width={64}
                    height={16}
                    rx={4}
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={isEdgeHighlighted ? '#93c5fd' : '#e2e8f0'}
                    fontSize="8"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {edge.label.substring(0, 12)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Render Graph Nodes */}
          <g className="nodes">
            {layoutNodes.map((node) => {
              const colors = getNodeColor(node.group);
              const isSelected = selectedNode?.id === node.id;
              const isPrimary = node.group === 'primary';
              const radius = isPrimary ? 34 : 26;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <title>{node.label}: {node.title}</title>
                  {/* Glowing ring for primary node */}
                  {isPrimary && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      className="animate-spin"
                      style={{ animationDuration: '20s', transformOrigin: '0 0' }}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={radius}
                    fill={colors.fill}
                    stroke={isSelected ? '#ffffff' : colors.stroke}
                    strokeWidth={isSelected ? 3 : 2}
                    filter={isSelected ? 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.6))' : undefined}
                    className="transition duration-150 group-hover:opacity-95"
                  />

                  {/* Node Label Text */}
                  <text
                    textAnchor="middle"
                    dy="-3"
                    fill="#ffffff"
                    fontSize={isPrimary ? '11' : '10'}
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    {node.label.match(/IS\s*\d+/)?.[0] || (node.group === 'certification' ? 'BIS' : node.label)}
                  </text>

                  {/* Group Tag */}
                  <text
                    textAnchor="middle"
                    dy="11"
                    fill={colors.text}
                    fontSize="8"
                    fontWeight="600"
                    className="pointer-events-none uppercase tracking-wider"
                  >
                    {node.group}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-96 p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-md animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Standards Graph Node Inspector
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                ✕ Close
              </button>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{selectedNode.label}</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">{selectedNode.title}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Classification: <strong className="text-slate-800 dark:text-slate-200 capitalize">{selectedNode.group}</strong></span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium">
                {selectedNode.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            Primary Standard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            Test Method Standard
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            Safety Requirement
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            Active Amendment
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            Compulsory QCO
          </span>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Click any node to inspect relationship details
        </span>
      </div>
    </div>
  );
}
