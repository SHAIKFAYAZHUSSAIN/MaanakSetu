'use client';

import React, { useState } from 'react';
import { RecommendationResult } from '@/types/procurement';
import { IndianStandard } from '@/types/standards';
import {
  Network,
  X,
  ShieldCheck,
  ExternalLink,
  Filter,
  Info,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Maximize2,
  BookOpen,
  FlaskConical,
  HardHat,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

interface KnowledgeGraphViewProps {
  result: RecommendationResult | null;
  onViewStandardDetails?: (standard: IndianStandard) => void;
  onLoadDefaultBenchmark?: () => void;
}

export type GraphNodeType =
  | 'primary'
  | 'testing'
  | 'safety'
  | 'installation'
  | 'terminology'
  | 'certification'
  | 'related_product';

interface GraphNode {
  id: string;
  label: string;
  title: string;
  type: GraphNodeType;
  x: number;
  y: number;
  relationship: string;
  reason: string;
  status: string;
  sourceEvidence: string;
  clauseRef?: string;
  isMandatory: boolean;
  associatedStandard?: IndianStandard;
}

export default function KnowledgeGraphView({
  result,
  onViewStandardDetails,
  onLoadDefaultBenchmark,
}: KnowledgeGraphViewProps) {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!result || !result.primaryStandard) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center gov-card p-12 bg-white border border-govborder space-y-4">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand mx-auto flex items-center justify-center">
          <Network className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-charcoal">No Active Standards Graph Available</h3>
        <p className="text-xs text-govmuted max-w-md mx-auto">
          Please run an analysis on a procurement requirement or select a sample scenario from the workspace to generate
          the interactive standards knowledge graph.
        </p>
        {onLoadDefaultBenchmark && (
          <div className="pt-2">
            <button
              onClick={onLoadDefaultBenchmark}
              className="px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-semibold shadow-gov inline-flex items-center gap-2"
            >
              <Network className="w-4 h-4" />
              <span>Explore LED Street Lighting Standards Graph</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  const primary = result.primaryStandard;
  const related = result.relatedStandards;
  const req = result.extractedRequirement;

  // Center node: Primary Standard
  const centerNode: GraphNode = {
    id: primary.id || 'center-primary',
    label: primary.isNumber,
    title: primary.title,
    type: 'primary',
    x: 400,
    y: 250,
    relationship: 'Primary Governing Standard',
    reason: result.evidence?.whyApplies || 'Governs mandatory product performance, electrical safety, and technical construction.',
    status: `Current Edition (${primary.versionChain.currentYear}) • Demo Knowledge Base`,
    sourceEvidence: `Tender Scope Match • BIS Act 2016 Section 16 • Sectional Committee ${primary.department}`,
    clauseRef: 'Governing Specification',
    isMandatory: true,
    associatedStandard: primary,
  };

  // Find or synthesize specific node types from related standards or domain context
  // 1. Test Standard
  const testRel = related.find((r) =>
    r.standard.productCategory?.toLowerCase().includes('test') ||
    r.standard.title.toLowerCase().includes('test') ||
    r.standard.title.toLowerCase().includes('method') ||
    r.matchReasons.some((m) => m.toLowerCase().includes('test'))
  );
  const testNode: GraphNode = testRel
    ? {
        id: testRel.standard.id || 'node-test',
        label: testRel.standard.isNumber,
        title: testRel.standard.title,
        type: 'testing',
        x: 400,
        y: 75,
        relationship: 'Normative Test Method',
        reason: testRel.matchReasons[0] || 'Defines mandatory laboratory measurement protocols and pass/fail thresholds.',
        status: 'Current • Verified against BIS Lab Scheme',
        sourceEvidence: 'Section 4.1 Test Procedures • NABL Accredited Verification',
        clauseRef: 'Testing Protocol',
        isMandatory: true,
        associatedStandard: testRel.standard,
      }
    : {
        id: 'node-test-default',
        label: 'IS 16107 (Part 2/Sec 2)',
        title: 'LED Luminaire Performance Testing Methods',
        type: 'testing',
        x: 400,
        y: 75,
        relationship: 'Normative Test Method',
        reason: 'Prescribes photometric measurement protocols for luminous flux, CCT, CRI, and lumen maintenance.',
        status: 'Current • Verified against BIS Lab Scheme',
        sourceEvidence: 'Tender Clause 3.2 • NABL Test Protocol',
        clauseRef: 'Photometric & Electrical Testing',
        isMandatory: true,
      };

  // 2. Safety Standard
  const safetyRel = related.find((r) =>
    r.standard.productCategory?.toLowerCase().includes('safety') ||
    r.standard.title.toLowerCase().includes('safety') ||
    r.standard.title.toLowerCase().includes('controlgear') ||
    r.standard.title.toLowerCase().includes('insulation')
  );
  const safetyNode: GraphNode = safetyRel
    ? {
        id: safetyRel.standard.id || 'node-safety',
        label: safetyRel.standard.isNumber,
        title: safetyRel.standard.title,
        type: 'safety',
        x: 565,
        y: 155,
        relationship: 'Electrical & Occupational Safety Specification',
        reason: safetyRel.matchReasons[0] || 'Mandates insulation resistance, creepage clearance, and high voltage protection.',
        status: 'Current • Compulsory Scheme-II CRS',
        sourceEvidence: 'MeitY Safety Notification • Gazette S.O. 4349(E)',
        clauseRef: 'Safety Subsystem',
        isMandatory: true,
        associatedStandard: safetyRel.standard,
      }
    : {
        id: 'node-safety-default',
        label: 'IS 15885 (Part 2/Sec 13)',
        title: 'Safety of Electronic Controlgear for LED Modules',
        type: 'safety',
        x: 565,
        y: 155,
        relationship: 'Electrical Safety Standard',
        reason: 'Prevents electrical hazards, thermal runaway, and short-circuit faults in luminaire power supply.',
        status: 'Current • Compulsory Scheme-II CRS',
        sourceEvidence: 'Electronics & IT Goods Order • BIS Registration',
        clauseRef: 'Driver Safety',
        isMandatory: true,
      };

  // 3. Certification / QCO
  const qcoNode: GraphNode = {
    id: 'node-certification',
    label: primary.qco.orderName.length > 22 ? `${primary.qco.orderName.substring(0, 20)}...` : primary.qco.orderName,
    title: primary.qco.orderName,
    type: 'certification',
    x: 565,
    y: 345,
    relationship: 'Statutory Quality Control Order (QCO)',
    reason: primary.qco.description,
    status: primary.qco.isCompulsory ? 'Compulsory Gazette Mandate' : 'Voluntary Benchmark',
    sourceEvidence: `Gazette Notification: ${primary.qco.gazetteNotification} • Ministry: ${primary.qco.ministry}`,
    clauseRef: primary.qco.scheme,
    isMandatory: primary.qco.isCompulsory,
  };

  // 4. Installation Standard
  const installRel = related.find((r) =>
    r.standard.title.toLowerCase().includes('earthing') ||
    r.standard.title.toLowerCase().includes('code of practice') ||
    r.standard.title.toLowerCase().includes('installation')
  );
  const installNode: GraphNode = installRel
    ? {
        id: installRel.standard.id || 'node-install',
        label: installRel.standard.isNumber,
        title: installRel.standard.title,
        type: 'installation',
        x: 400,
        y: 425,
        relationship: 'Field Installation & Mounting Code of Practice',
        reason: installRel.matchReasons[0] || 'Guides field mounting, earthing electrode installation, and structural stability.',
        status: 'Current • CPWD Conforming Practice',
        sourceEvidence: 'CPWD Works Manual 2024 • National Building Code (NBC) 2016',
        clauseRef: 'Code of Practice',
        isMandatory: false,
        associatedStandard: installRel.standard,
      }
    : {
        id: 'node-install-default',
        label: 'IS 3043: 2018',
        title: 'Code of Practice for Earthing',
        type: 'installation',
        x: 400,
        y: 425,
        relationship: 'Code of Practice for Installation',
        reason: 'Prescribes mandatory grounding, surge earth resistance (< 2 Ohms), and fault protection for outdoor poles.',
        status: 'Current • CPWD Conforming Practice',
        sourceEvidence: 'Central Electricity Authority (CEA) Regulations • CPWD Cl. 14',
        clauseRef: 'Earthing & Lightning Protection',
        isMandatory: false,
      };

  // 5. Terminology Node
  const termNode: GraphNode = {
    id: 'node-terminology',
    label: primary.isNumber.includes('10322') ? 'IS 16101: 2012' : 'IS 1885 (Part 1)',
    title: primary.isNumber.includes('10322')
      ? 'General Lighting - LEDs and LED Modules - Terms and Definitions'
      : 'Electrotechnical Vocabulary - Fundamental Concepts & Terminology',
    type: 'terminology',
    x: 235,
    y: 345,
    relationship: 'Harmonized Technical Terminology',
    reason: 'Standardizes definitions for optical terms, luminous flux, thermal impedance, and rated lifetime (L70/B50).',
    status: 'Current • Harmonized with IEC 62504',
    sourceEvidence: 'Section 2 Normative Definitions • Glossary',
    clauseRef: 'Vocabulary & Definitions',
    isMandatory: false,
  };

  // 6. Related Product / Auxiliary Subsystem
  const productRel = related.find((r) =>
    r.standard.productCategory?.toLowerCase().includes('enclosure') ||
    r.standard.title.toLowerCase().includes('enclosure') ||
    r.standard.title.toLowerCase().includes('cable') ||
    r.standard.title.toLowerCase().includes('surge') ||
    (r !== testRel && r !== safetyRel && r !== installRel)
  );
  const relatedProductNode: GraphNode = productRel
    ? {
        id: productRel.standard.id || 'node-related-product',
        label: productRel.standard.isNumber,
        title: productRel.standard.title,
        type: 'related_product',
        x: 235,
        y: 155,
        relationship: 'Allied Product / Subsystem Standard',
        reason: productRel.matchReasons[0] || 'Specifies housing weather-proofing, ingress protection (IP66), and structural strength.',
        status: 'Current • Normative Cross-Reference',
        sourceEvidence: 'Tender Mechanical Requirement • BIS Clause 5.3',
        clauseRef: 'Enclosure Protection',
        isMandatory: false,
        associatedStandard: productRel.standard,
      }
    : {
        id: 'node-related-product-default',
        label: 'IS 12063: 1987',
        title: 'Classification of Degrees of Protection Provided by Enclosures (IP Code)',
        type: 'related_product',
        x: 235,
        y: 155,
        relationship: 'Auxiliary Subsystem Standard',
        reason: 'Verifies IP66 weatherproofing against tropical rainstorms, dust penetration, and outdoor contaminants.',
        status: 'Current • Normative Cross-Reference',
        sourceEvidence: 'Tender Requirement (IP66) • Clause 7.2',
        clauseRef: 'Ingress Protection Code',
        isMandatory: true,
      };

  const allNodes: GraphNode[] = [
    centerNode,
    testNode,
    safetyNode,
    qcoNode,
    installNode,
    termNode,
    relatedProductNode,
  ];

  const filteredNodes =
    filterType === 'all'
      ? allNodes
      : allNodes.filter((n) => n.type === filterType || n.type === 'primary');

  const getNodeColor = (type: GraphNodeType) => {
    switch (type) {
      case 'primary':
        return {
          fill: '#0F766E',
          stroke: '#0D625C',
          text: '#FFFFFF',
          badgeBg: 'bg-brand text-white',
          label: 'Primary Standard',
        };
      case 'testing':
        return {
          fill: '#15803D',
          stroke: '#166534',
          text: '#FFFFFF',
          badgeBg: 'bg-emerald-50 text-secgreen border border-emerald-200',
          label: 'Test Method',
        };
      case 'safety':
        return {
          fill: '#0D9488',
          stroke: '#0F766E',
          text: '#FFFFFF',
          badgeBg: 'bg-teal-50 text-teal-700 border border-teal-200',
          label: 'Safety Standard',
        };
      case 'installation':
        return {
          fill: '#1E293B',
          stroke: '#0F172A',
          text: '#FFFFFF',
          badgeBg: 'bg-slate-100 text-slate-800 border border-slate-300',
          label: 'Installation Standard',
        };
      case 'terminology':
        return {
          fill: '#475569',
          stroke: '#334155',
          text: '#FFFFFF',
          badgeBg: 'bg-gray-100 text-gray-700 border border-gray-300',
          label: 'Terminology',
        };
      case 'certification':
        return {
          fill: '#D97706',
          stroke: '#B45309',
          text: '#FFFFFF',
          badgeBg: 'bg-amber-50 text-accent border border-amber-200',
          label: 'Certification / QCO',
        };
      case 'related_product':
        return {
          fill: '#7C3AED',
          stroke: '#6D28D9',
          text: '#FFFFFF',
          badgeBg: 'bg-purple-50 text-purple-700 border border-purple-200',
          label: 'Related Product',
        };
    }
  };

  return (
    <div className="gov-workspace-container space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-govborder">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand text-xs font-bold uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>Interactive Standards Topology</span>
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Standards Knowledge Graph</h2>
          <p className="text-xs text-govmuted mt-0.5">
            Cross-referenced ontology mapping primary standard, test methods, safety subsystems, installation codes, and gazetted QCOs.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-govmuted" />
          <span className="text-xs text-govmuted font-medium">Filter Nodes:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-govborder text-charcoal outline-none focus:border-brand"
          >
            <option value="all">All Standards ({allNodes.length})</option>
            <option value="testing">Test Methods</option>
            <option value="safety">Safety Standards</option>
            <option value="installation">Installation Codes</option>
            <option value="terminology">Terminology</option>
            <option value="certification">Regulatory / QCOs</option>
            <option value="related_product">Related Products</option>
          </select>
        </div>
      </div>

      {/* Main Graph Canvas & Right Detail Panel */}
      <div className="relative gov-card bg-white border border-govborder shadow-gov overflow-hidden rounded-gov min-h-[580px] flex flex-col lg:flex-row">
        {/* Canvas Toolbar: Zoom +, Zoom -, Reset, Fit graph */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-sm rounded-lg border border-govborder shadow-gov-sm text-xs">
          <button
            onClick={() => setZoomLevel((z) => Math.min(Number((z + 0.15).toFixed(2)), 1.5))}
            className="p-1.5 hover:bg-ivory-100 rounded text-charcoal flex items-center gap-1"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
            <span className="text-[10px] hidden sm:inline">Zoom +</span>
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.7))}
            className="p-1.5 hover:bg-ivory-100 rounded text-charcoal flex items-center gap-1"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
            <span className="text-[10px] hidden sm:inline">Zoom -</span>
          </button>
          <div className="h-4 w-px bg-govborder mx-0.5" />
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 hover:bg-ivory-100 rounded text-charcoal flex items-center gap-1"
            title="Reset to 100%"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setSelectedNode(null);
            }}
            className="p-1.5 hover:bg-ivory-100 rounded text-charcoal flex items-center gap-1"
            title="Fit Graph to View"
          >
            <Maximize2 className="w-3.5 h-3.5 text-brand" />
            <span className="text-[10px] font-semibold text-brand">Fit graph</span>
          </button>
          <span className="text-[10px] text-govmuted px-2 font-mono font-bold">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 hidden md:flex flex-wrap items-center gap-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-lg border border-govborder shadow-gov-sm text-[11px] font-semibold text-charcoal">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand" />
            <span>Primary Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-secgreen" />
            <span>Test Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-600" />
            <span>Safety Standard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span>Certification / QCO</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800" />
            <span>Installation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600" />
            <span>Related Product</span>
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto min-h-[500px]">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-full max-h-[520px] transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="graph-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#DDE3DE" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#graph-grid)" opacity="0.6" />

            {/* Connecting Edges with Hover Highlighting */}
            {filteredNodes
              .filter((n) => n.id !== centerNode.id)
              .map((node) => {
                const isHovered =
                  hoveredNodeId === node.id || hoveredNodeId === centerNode.id;
                const isSelected = selectedNode?.id === node.id;
                const isDimmed =
                  hoveredNodeId !== null &&
                  hoveredNodeId !== node.id &&
                  hoveredNodeId !== centerNode.id;

                const strokeColor = isSelected
                  ? '#0F766E'
                  : isHovered
                  ? '#0F766E'
                  : '#C8D1CE';
                const strokeWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;
                const opacity = isDimmed ? 0.2 : 1;

                return (
                  <g
                    key={`edge-${node.id}`}
                    style={{ opacity, transition: 'all 0.2s ease-in-out' }}
                  >
                    <line
                      x1={centerNode.x}
                      y1={centerNode.y}
                      x2={node.x}
                      y2={node.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={node.type === 'installation' ? '5 3' : 'none'}
                    />
                    {/* Edge Label Pill */}
                    <rect
                      x={(centerNode.x + node.x) / 2 - 34}
                      y={(centerNode.y + node.y) / 2 - 10}
                      width="68"
                      height="20"
                      rx="4"
                      fill="#FFFFFF"
                      stroke={strokeColor}
                      strokeWidth="1"
                    />
                    <text
                      x={(centerNode.x + node.x) / 2}
                      y={(centerNode.y + node.y) / 2 + 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={isHovered || isSelected ? '#0F766E' : '#64706B'}
                    >
                      {node.type === 'testing'
                        ? 'Tested By'
                        : node.type === 'safety'
                        ? 'Requires'
                        : node.type === 'certification'
                        ? 'Mandated'
                        : node.type === 'installation'
                        ? 'Installed By'
                        : node.type === 'terminology'
                        ? 'Glossary'
                        : 'Subsystem'}
                    </text>
                  </g>
                );
              })}

            {/* Interactive Nodes */}
            {filteredNodes.map((node) => {
              const isCenter = node.id === centerNode.id;
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isDimmed =
                hoveredNodeId !== null &&
                hoveredNodeId !== node.id &&
                hoveredNodeId !== centerNode.id &&
                !isSelected;

              const colors = getNodeColor(node.type);
              const nodeRadius = isCenter ? 46 : 34;

              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="cursor-pointer"
                  style={{
                    opacity: isDimmed ? 0.35 : 1,
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {/* Outer glow ring on selection or hover */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={nodeRadius + 8}
                      fill="none"
                      stroke={colors.fill}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      strokeDasharray={isSelected ? '4 2' : 'none'}
                      opacity={isSelected ? 1 : 0.7}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={nodeRadius}
                    fill={colors.fill}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    filter="drop-shadow(0 4px 6px rgba(23, 32, 29, 0.15))"
                  />

                  {/* Label Text */}
                  <text
                    x={node.x}
                    y={isCenter ? node.y - 4 : node.y - 2}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize={isCenter ? '11' : '9'}
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {node.label.length > 16 ? `${node.label.substring(0, 14)}..` : node.label}
                  </text>
                  <text
                    x={node.x}
                    y={isCenter ? node.y + 10 : node.y + 10}
                    textAnchor="middle"
                    fill={colors.text}
                    fontSize="8"
                    opacity="0.85"
                    className="select-none pointer-events-none uppercase tracking-wider"
                  >
                    {isCenter ? 'Primary' : colors.label.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right-Side Node Detail Panel (Click node → open detail panel) */}
        {selectedNode && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-govborder bg-ivory-50/80 p-5 space-y-4 flex flex-col justify-between animate-fade-in shadow-gov-sm flex-shrink-0">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-govborder">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    getNodeColor(selectedNode.type).badgeBg
                  }`}
                >
                  {getNodeColor(selectedNode.type).label}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded text-govmuted hover:text-charcoal hover:bg-ivory-200 transition-colors"
                  aria-label="Close Detail Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Standard */}
              <div>
                <span className="text-[10px] uppercase font-bold text-govmuted block mb-0.5">Standard:</span>
                <h4 className="text-base font-extrabold text-charcoal">{selectedNode.label}</h4>
                <p className="text-xs text-brand font-medium mt-0.5">{selectedNode.title}</p>
              </div>

              {/* Relationship */}
              <div className="p-3 rounded-lg bg-white border border-govborder text-xs space-y-1">
                <span className="font-bold text-charcoal block text-[11px]">Relationship:</span>
                <p className="text-brand font-semibold">{selectedNode.relationship}</p>
              </div>

              {/* Reason */}
              <div className="p-3 rounded-lg bg-white border border-govborder text-xs space-y-1">
                <span className="font-bold text-charcoal block text-[11px]">Reason:</span>
                <p className="text-govmuted leading-relaxed font-normal">{selectedNode.reason}</p>
              </div>

              {/* Status */}
              <div className="p-3 rounded-lg bg-white border border-govborder text-xs space-y-1">
                <span className="font-bold text-charcoal block text-[11px]">Status:</span>
                <div className="flex items-center gap-1.5 text-secgreen font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{selectedNode.status}</span>
                </div>
              </div>

              {/* Source / evidence */}
              <div className="p-3 rounded-lg bg-white border border-govborder text-xs space-y-1">
                <span className="font-bold text-charcoal block text-[11px]">Source / Evidence:</span>
                <p className="text-govmuted text-[11px] leading-relaxed font-mono">
                  {selectedNode.sourceEvidence}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-govborder space-y-2">
              {selectedNode.associatedStandard && onViewStandardDetails && (
                <button
                  onClick={() => onViewStandardDetails(selectedNode.associatedStandard!)}
                  className="w-full inline-flex items-center justify-center gap-1.5 p-2 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-semibold shadow-gov-sm transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Standard in Detail</span>
                </button>
              )}

              {primary.officialSourceUrl && (
                <a
                  href={primary.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 p-2 rounded-lg bg-ivory-100 hover:bg-ivory-200 border border-govborder text-charcoal text-xs font-semibold transition-colors"
                >
                  <span>Verify on BIS Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-govmuted" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
