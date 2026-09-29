'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowDown,
  Info,
  Check,
  FileText,
} from 'lucide-react';
import { ALL_PROCUREMENT_SCENARIOS, ProcurementScenario, SCENARIO_LED } from '@/data/procurementScenarios';
import { OFFICIAL_PORTALS } from '@/lib/officialSources';

interface ScrutinyCase {
  id: string;
  scenario: ProcurementScenario;
  department: string;
  submissionDate: string;
  status: 'Awaiting Review' | 'Under Review' | 'Returned for Revision' | 'Technically Accepted' | 'Gap Flagged';
  notes?: string;
}

const INITIAL_CASES: ScrutinyCase[] = [
  {
    id: 'TC-2026-081',
    scenario: SCENARIO_LED,
    department: 'Smart City & Municipal Infrastructure Cell',
    submissionDate: '28 Sep 2026',
    status: 'Awaiting Review',
  },
  {
    id: 'TC-2026-044',
    scenario: ALL_PROCUREMENT_SCENARIOS[4] || SCENARIO_LED, // Pumps
    department: 'Minor Irrigation & Rural Water Works',
    submissionDate: '27 Sep 2026',
    status: 'Under Review',
  },
  {
    id: 'TC-2026-029',
    scenario: ALL_PROCUREMENT_SCENARIOS[2] || SCENARIO_LED, // Cables
    department: 'Power Distribution & Transmission Wing',
    submissionDate: '26 Sep 2026',
    status: 'Returned for Revision',
    notes: 'Missing high-voltage surge withstand parameters as per IS 7098.',
  },
  {
    id: 'TC-2026-015',
    scenario: ALL_PROCUREMENT_SCENARIOS[3] || SCENARIO_LED, // Helmets
    department: 'Industrial Safety & Labour Welfare Board',
    submissionDate: '25 Sep 2026',
    status: 'Awaiting Review',
  },
  {
    id: 'TC-2026-003',
    scenario: ALL_PROCUREMENT_SCENARIOS[1] || SCENARIO_LED, // Cement
    department: 'Central Public Works Directorate (CPWD)',
    submissionDate: '24 Sep 2026',
    status: 'Technically Accepted',
    notes: 'Conforms to IS 1489 (Part 1): 2015. Mandatory ISI mark required at bid submission.',
  },
];

interface TechnicalScrutinyViewProps {
  onOpenPdf?: (result: any) => void;
}

export default function TechnicalScrutinyView({ onOpenPdf }: TechnicalScrutinyViewProps) {
  const [cases, setCases] = useState<ScrutinyCase[]>(INITIAL_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // Compute stat counts dynamically
  const pendingCount = cases.filter((c) => c.status === 'Awaiting Review').length;
  const underReviewCount = cases.filter((c) => c.status === 'Under Review').length;
  const returnedCount = cases.filter((c) => c.status === 'Returned for Revision').length;
  const approvedCount = cases.filter((c) => c.status === 'Technically Accepted').length;

  const handleUpdateStatus = (
    newStatus: 'Technically Accepted' | 'Returned for Revision' | 'Gap Flagged',
    noteText: string
  ) => {
    if (!selectedCaseId) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseId
          ? {
              ...c,
              status: newStatus,
              notes: noteText,
            }
          : c
      )
    );

    setActionNotice(`Case ${selectedCaseId} status updated to: ${newStatus}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const getStatusBadge = (status: ScrutinyCase['status']) => {
    switch (status) {
      case 'Technically Accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Technically Accepted</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span>Under Review</span>
          </span>
        );
      case 'Returned for Revision':
      case 'Gap Flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
      case 'Awaiting Review':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span>Awaiting Review</span>
          </span>
        );
    }
  };

  // If a case is selected, render the Technical Review Page
  if (selectedCase) {
    const result = selectedCase.scenario.mockResult;
    const req = result.extractedRequirement;
    const primary = result.primaryStandard;

    return (
      <div className="gov-workspace-container space-y-6 py-4 animate-fade-in">
        {/* Back and Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-govborder dark:border-[#263833]">
          <button
            onClick={() => setSelectedCaseId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Technical Scrutiny Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-govmuted dark:text-[#94A39D] font-mono">{selectedCase.id}</span>
            {getStatusBadge(selectedCase.status)}
          </div>
        </div>

        {/* Action Notice Alert */}
        {actionNotice && (
          <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand dark:text-brand-200 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-[10px] hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Main Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-50 dark:bg-brand-900/30 text-brand dark:text-brand-300 text-[11px] font-bold border border-brand-200 dark:border-brand-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TECHNICAL SCRUTINY REVIEW • DEMO WORKFLOW</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">
            {selectedCase.scenario.title}
          </h2>
          <p className="text-xs text-govmuted dark:text-[#94A39D]">
            Originating Department: <strong>{selectedCase.department}</strong> • Submitted: {selectedCase.submissionDate}
          </p>
        </div>

        {/* 1. Procurement Requirement */}
        <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-govmuted dark:text-[#94A39D]">
            Procurement Requirement (Tender Schedule of Requirements)
          </span>
          <p className="text-xs sm:text-sm text-charcoal dark:text-gray-200 leading-relaxed font-mono bg-ivory-50 dark:bg-[#1C2C28] p-3.5 rounded border border-govborder dark:border-[#263833]">
            {req.rawQuery}
          </p>
        </div>

        {/* 2. Requirement Analysis */}
        <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-3">
          <div className="flex items-center justify-between border-b border-govborder dark:border-[#263833] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-brand" />
              <span>Requirement Analysis</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Requirement Identified</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] uppercase font-bold text-govmuted dark:text-[#94A39D]">Product Category</span>
              <span className="font-bold text-charcoal dark:text-white">{req.product}</span>
            </div>
            <div className="p-3 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] uppercase font-bold text-govmuted dark:text-[#94A39D]">Target Application</span>
              <span className="font-semibold text-charcoal dark:text-gray-200">{req.application}</span>
            </div>
            <div className="p-3 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] uppercase font-bold text-govmuted dark:text-[#94A39D]">Standards Domain</span>
              <span className="font-semibold text-brand dark:text-brand-300">{req.domain}</span>
            </div>
          </div>
        </div>

        {/* 3. Recommended Standards */}
        <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-4">
          <div className="border-b border-govborder dark:border-[#263833] pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>Recommended Indian Standards</span>
            </h3>
            <span className="text-[10px] font-semibold text-govmuted dark:text-[#94A39D]">
              Demonstration Knowledge Base
            </span>
          </div>

          {primary ? (
            <div className="p-4 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded bg-brand text-white text-[10px] font-bold mr-2">
                    PRIMARY IS
                  </span>
                  <span className="font-mono font-bold text-sm text-charcoal dark:text-white">{primary.isNumber}</span>
                  <div className="text-xs text-charcoal dark:text-gray-200 font-medium mt-0.5">{primary.title}</div>
                </div>

                <a
                  href={primary.officialSourceUrl || OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] text-xs font-semibold text-brand hover:underline shrink-0"
                >
                  <span>Verify on BIS Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Why Recommended */}
              <div className="p-3 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-govmuted dark:text-[#94A39D] block">
                  Why this standard was recommended:
                </span>
                <p className="text-charcoal dark:text-gray-300 leading-relaxed font-normal">
                  {result.evidence?.whyApplies || primary.scope}
                </p>
              </div>

              {/* Verification Status */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 text-[11px]">
                  <Check className="w-3 h-3" />
                  <span>Demo Verification: Committee Scope Verified ({primary.department})</span>
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800 text-[11px]">
                  ⚠ Requires official verification on standards.bis.gov.in
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 text-xs text-govmuted">No primary standard identified.</div>
          )}

          {/* Allied Standards */}
          {result.relatedStandards && result.relatedStandards.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold text-charcoal dark:text-white uppercase tracking-wider block">
                Allied &amp; Normative Standards ({result.relatedStandards.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {result.relatedStandards.slice(0, 4).map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-bold text-charcoal dark:text-white block text-[11px]">
                        {rel.standard.isNumber}
                      </span>
                      <span className="text-govmuted dark:text-[#94A39D] text-[11px] line-clamp-1">
                        {rel.standard.title}
                      </span>
                      <span className="text-[10px] text-brand font-medium">
                        {rel.matchReasons?.[0] || 'Normative Reference'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Technical Parameters & Specification Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Technical Parameters */}
          <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white border-b border-govborder dark:border-[#263833] pb-2">
              Technical Specification Parameters
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-govborder/60 dark:border-[#263833]">
                <span className="text-govmuted dark:text-[#94A39D]">Operating Rating:</span>
                <span className="font-mono font-bold text-charcoal dark:text-white">{req.power || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-govborder/60 dark:border-[#263833]">
                <span className="text-govmuted dark:text-[#94A39D]">Application Environment:</span>
                <span className="font-medium text-charcoal dark:text-gray-200">{req.application}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-govborder/60 dark:border-[#263833]">
                <span className="text-govmuted dark:text-[#94A39D]">Material / Construction:</span>
                <span className="font-medium text-charcoal dark:text-gray-200">{req.material || 'Engineering standard'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-govborder/60 dark:border-[#263833]">
                <span className="text-govmuted dark:text-[#94A39D]">Mandatory Test Certificates:</span>
                <span className="font-medium text-brand dark:text-brand-300">BIS NABL Accredited Lab Reports</span>
              </div>
            </div>
          </div>

          {/* Specification Gaps */}
          <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-3">
            <div className="flex items-center justify-between border-b border-govborder dark:border-[#263833] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white">
                Specification Gaps Identified
              </h3>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                {result.specificationGaps.length} Gaps
              </span>
            </div>

            <div className="space-y-2.5 text-xs max-h-60 overflow-y-auto pr-1">
              {result.specificationGaps.map((gap) => (
                <div
                  key={gap.id}
                  className="p-3 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal dark:text-white">{gap.parameter}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        gap.severity === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {gap.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-govmuted dark:text-[#94A39D] leading-normal">{gap.suggestedClause}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Traceability Chain */}
        <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal dark:text-white border-b border-govborder dark:border-[#263833] pb-2">
            Standards Traceability Chain (GFR 2017 Rule 144(i))
          </h3>
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2 p-3 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-xs font-semibold text-center">
            <div className="flex-1 p-2 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] text-govmuted uppercase">1. Requirement</span>
              <span className="font-bold text-charcoal dark:text-white">{req.product}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-govmuted shrink-0 hidden md:block" />
            <div className="flex-1 p-2 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] text-govmuted uppercase">2. Standard</span>
              <span className="font-bold text-brand">{primary?.isNumber}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-govmuted shrink-0 hidden md:block" />
            <div className="flex-1 p-2 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] text-govmuted uppercase">3. Parameters</span>
              <span className="font-bold text-charcoal dark:text-white">Safety &amp; Performance</span>
            </div>
            <ArrowRight className="w-4 h-4 text-govmuted shrink-0 hidden md:block" />
            <div className="flex-1 p-2 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] text-govmuted uppercase">4. Compliance</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Gazetted QCO</span>
            </div>
            <ArrowRight className="w-4 h-4 text-govmuted shrink-0 hidden md:block" />
            <div className="flex-1 p-2 rounded bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833]">
              <span className="block text-[10px] text-govmuted uppercase">5. Specification</span>
              <span className="font-bold text-charcoal dark:text-white">9-Clause Schedule</span>
            </div>
          </div>
        </div>

        {/* 6. Technical Scrutiny Action Bar */}
        <div className="gov-card p-6 bg-white dark:bg-[#16221F] border-2 border-brand/40 dark:border-brand-700/50 rounded-gov space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-charcoal dark:text-white">
                Technical Scrutiny Officer Decision Record
              </h4>
              <p className="text-xs text-govmuted dark:text-[#94A39D]">
                Actions perform demonstration state updates for evaluation.
              </p>
            </div>
            {selectedCase.notes && (
              <span className="text-xs italic text-govmuted dark:text-[#94A39D]">
                Last note: &ldquo;{selectedCase.notes}&rdquo;
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() =>
                handleUpdateStatus(
                  'Technically Accepted',
                  'Technical parameters, Indian Standards citations, and QCO mandates verified and accepted.'
                )
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-gov transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>✓ Accept Technical Specification</span>
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(
                  'Returned for Revision',
                  'Specification returned to Indenting Officer for updating missing test parameters.'
                )
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-gov transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>↩ Return for Revision</span>
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(
                  'Gap Flagged',
                  'Technical gaps flagged in surge withstand rating and ingress protection certification.'
                )
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-gov transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>⚠ Flag Technical Gap</span>
            </button>

            {onOpenPdf && (
              <button
                onClick={() => onOpenPdf(result)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-charcoal dark:text-white font-semibold text-xs hover:bg-ivory-100 transition-colors ml-auto cursor-pointer"
              >
                <FileText className="w-4 h-4 text-brand" />
                <span>View Full Schedule PDF</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the Main Scrutiny Dashboard
  return (
    <div className="gov-workspace-container space-y-6 py-4 animate-fade-in">
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-brand-50 dark:bg-brand-900/30 text-brand dark:text-brand-300 text-[11px] font-bold border border-brand-200 dark:border-brand-700/50">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>TECHNICAL SCRUTINY DASHBOARD • DEMO ENVIRONMENT</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">
          TECHNICAL SCRUTINY DASHBOARD
        </h2>
        <p className="text-xs sm:text-sm text-govmuted dark:text-[#94A39D]">
          Review and validate procurement technical specifications
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="gov-card p-4 sm:p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-govmuted dark:text-[#94A39D] block">
            Pending Technical Scrutiny
          </span>
          <div className="text-3xl font-extrabold text-charcoal dark:text-white font-mono">
            {String(pendingCount).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">Awaiting initial review</span>
        </div>

        <div className="gov-card p-4 sm:p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-govmuted dark:text-[#94A39D] block">
            Under Review
          </span>
          <div className="text-3xl font-extrabold text-charcoal dark:text-white font-mono">
            {String(underReviewCount).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">In active scrutiny</span>
        </div>

        <div className="gov-card p-4 sm:p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-govmuted dark:text-[#94A39D] block">
            Returned for Revision
          </span>
          <div className="text-3xl font-extrabold text-charcoal dark:text-white font-mono">
            {String(returnedCount).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Deficiency flagged</span>
        </div>

        <div className="gov-card p-4 sm:p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-govmuted dark:text-[#94A39D] block">
            Approved
          </span>
          <div className="text-3xl font-extrabold text-charcoal dark:text-white font-mono">
            {String(approvedCount).padStart(2, '0')}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Technically cleared</span>
        </div>
      </div>

      {/* Table: PENDING TECHNICAL REVIEW */}
      <div className="gov-card bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-govborder dark:border-[#263833] flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-brand" />
            <span>PENDING TECHNICAL REVIEW</span>
          </h3>
          <span className="text-[11px] text-govmuted dark:text-[#94A39D]">
            Showing {cases.length} demonstration procurement cases
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-ivory-50 dark:bg-[#1C2C28] text-govmuted dark:text-[#94A39D] uppercase text-[10px] font-bold tracking-wider border-b border-govborder dark:border-[#263833]">
              <tr>
                <th className="py-3 px-4">Procurement Case</th>
                <th className="py-3 px-4">Technical Requirement</th>
                <th className="py-3 px-4">Standards Mapping</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-govborder/60 dark:divide-[#263833]">
              {cases.map((sc) => {
                const req = sc.scenario.mockResult.extractedRequirement;
                const primary = sc.scenario.mockResult.primaryStandard;
                return (
                  <tr
                    key={sc.id}
                    className="hover:bg-ivory-50/60 dark:hover:bg-[#1C2C28]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal dark:text-white whitespace-nowrap">
                      {sc.id}
                      <span className="block text-[10px] font-sans font-normal text-govmuted dark:text-[#94A39D]">
                        {sc.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-charcoal dark:text-white block">{req.product}</span>
                      <span className="text-govmuted dark:text-[#94A39D] text-[11px] line-clamp-1">
                        {req.application}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-brand block">{primary?.isNumber}</span>
                      <span className="text-[10px] text-govmuted dark:text-[#94A39D]">{primary?.department}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>QCO In Force</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(sc.status)}</td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedCaseId(sc.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-700 text-white font-bold text-[11px] shadow-gov-sm transition-colors cursor-pointer"
                      >
                        <span>Review Case</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
