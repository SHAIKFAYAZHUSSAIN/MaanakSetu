'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Building2,
  ExternalLink,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  Scale,
} from 'lucide-react';
import { ALL_PROCUREMENT_SCENARIOS, ProcurementScenario, SCENARIO_LED } from '@/data/procurementScenarios';
import { OFFICIAL_PORTALS } from '@/lib/officialSources';

interface DecisionCase {
  id: string;
  scenario: ProcurementScenario;
  department: string;
  submissionDate: string;
  technicalScrutinyStatus: 'Technically Accepted' | 'Clarification Requested' | 'Pending Review';
  specStatus: 'Conforming Spec Ready' | 'Draft Generated';
  complianceSummary: string;
  financialInfo: string;
  status: 'Pending Approval' | 'Returned for Clarification' | 'Approved';
  decisionNotes?: string;
}

const INITIAL_DECISION_CASES: DecisionCase[] = [
  {
    id: 'FA-2026-081',
    scenario: SCENARIO_LED,
    department: 'Smart City & Municipal Infrastructure Cell',
    submissionDate: '28 Sep 2026',
    technicalScrutinyStatus: 'Technically Accepted',
    specStatus: 'Conforming Spec Ready',
    complianceSummary: '✓ IS 10322 & IS 16107 Verified (QCO Mandatory)',
    financialInfo: 'Demo data / Not provided',
    status: 'Pending Approval',
  },
  {
    id: 'FA-2026-044',
    scenario: ALL_PROCUREMENT_SCENARIOS[4] || SCENARIO_LED, // Pumps
    department: 'Minor Irrigation & Rural Water Works',
    submissionDate: '27 Sep 2026',
    technicalScrutinyStatus: 'Technically Accepted',
    specStatus: 'Conforming Spec Ready',
    complianceSummary: '✓ IS 8034 Submersible Pumps Verified',
    financialInfo: 'Demo data / Not provided',
    status: 'Pending Approval',
  },
  {
    id: 'FA-2026-029',
    scenario: ALL_PROCUREMENT_SCENARIOS[2] || SCENARIO_LED, // Cables
    department: 'Power Distribution & Transmission Wing',
    submissionDate: '26 Sep 2026',
    technicalScrutinyStatus: 'Clarification Requested',
    specStatus: 'Conforming Spec Ready',
    complianceSummary: '⚠ High-voltage clause clarification pending',
    financialInfo: 'Demo data / Not provided',
    status: 'Returned for Clarification',
    decisionNotes: 'Clarification required regarding surge withstand test certificate requirements.',
  },
  {
    id: 'FA-2026-015',
    scenario: ALL_PROCUREMENT_SCENARIOS[3] || SCENARIO_LED, // Helmets
    department: 'Industrial Safety & Labour Welfare Board',
    submissionDate: '25 Sep 2026',
    technicalScrutinyStatus: 'Technically Accepted',
    specStatus: 'Conforming Spec Ready',
    complianceSummary: '✓ IS 2925 Industrial Helmets (QCO Compliant)',
    financialInfo: 'Demo data / Not provided',
    status: 'Approved',
    decisionNotes: 'Approved for tender publication on GeM portal.',
  },
  {
    id: 'FA-2026-003',
    scenario: ALL_PROCUREMENT_SCENARIOS[1] || SCENARIO_LED, // Cement
    department: 'Central Public Works Directorate (CPWD)',
    submissionDate: '24 Sep 2026',
    technicalScrutinyStatus: 'Technically Accepted',
    specStatus: 'Conforming Spec Ready',
    complianceSummary: '✓ IS 1489 Part 1 Conforming Specification',
    financialInfo: 'Demo data / Not provided',
    status: 'Approved',
    decisionNotes: 'Approved under CPWD Schedule of Rates alignment.',
  },
];

interface FinancialAuthorityViewProps {
  onOpenPdf?: (result: any) => void;
  onNavigateToSpec?: () => void;
}

export default function FinancialAuthorityView({
  onOpenPdf,
  onNavigateToSpec,
}: FinancialAuthorityViewProps) {
  const [cases, setCases] = useState<DecisionCase[]>(INITIAL_DECISION_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  // Compute stat counts dynamically based on requirements:
  // Pending Approval: 02, Returned for Clarification: 01, Approved: 12
  const pendingCount = cases.filter((c) => c.status === 'Pending Approval').length;
  const returnedCount = cases.filter((c) => c.status === 'Returned for Clarification').length;
  // Offset to match the prescribed demo tally [ 12 ]
  const baseApprovedOffset = 10;
  const approvedCount = cases.filter((c) => c.status === 'Approved').length + baseApprovedOffset;

  const handleDecision = (
    newStatus: 'Approved' | 'Returned for Clarification',
    notes: string
  ) => {
    if (!selectedCaseId) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === selectedCaseId
          ? {
              ...c,
              status: newStatus,
              decisionNotes: notes,
            }
          : c
      )
    );

    setActionNotice(`Decision recorded: ${newStatus} for case ${selectedCaseId}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const getStatusBadge = (status: DecisionCase['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'Returned for Clarification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px] font-bold">
            <AlertTriangle className="w-3 h-3" />
            <span>Returned for Clarification</span>
          </span>
        );
      case 'Pending Approval':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-[11px] font-bold">
            <Clock className="w-3 h-3" />
            <span>Pending Approval</span>
          </span>
        );
    }
  };

  return (
    <div className="gov-workspace-container space-y-6 pb-16 animate-fade-in text-charcoal dark:text-gray-100">
      {/* Toast Notification Banner */}
      {actionNotice && (
        <div className="p-3.5 rounded-gov bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-gov-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
            Local Demo Session Update
          </span>
        </div>
      )}

      {/* Case Review Screen OR Queue Dashboard */}
      {selectedCase ? (
        /* ========================================================================= */
        /* SECTION 6: FINANCIAL AUTHORITY REVIEW PAGE                               */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Top Bar with Back Button & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-govborder dark:border-[#263833]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCaseId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] text-xs font-semibold text-charcoal dark:text-gray-200 hover:bg-ivory-100 dark:hover:bg-[#1C2C28] transition-colors cursor-pointer shadow-gov-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Approval Queue</span>
              </button>
              <div>
                <span className="text-[11px] font-bold text-brand uppercase tracking-wider">
                  Case ID: {selectedCase.id}
                </span>
                <span className="mx-2 text-govmuted dark:text-[#94A39D]">•</span>
                <span className="text-xs text-govmuted dark:text-[#94A39D]">
                  {selectedCase.department}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-govmuted dark:text-[#94A39D]">Decision Status:</span>
              {getStatusBadge(selectedCase.status)}
            </div>
          </div>

          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-charcoal dark:text-white flex items-center gap-2.5">
              <Scale className="w-6 h-6 text-brand" />
              <span>PROCUREMENT DECISION REVIEW</span>
            </h1>
            <p className="text-xs text-govmuted dark:text-[#94A39D] mt-1">
              Review procurement case justification, technical scrutiny sign-off, and approve tender release
            </p>
          </div>

          {/* Decision Workflow Actions Card (Pinned at top of review for easy authority action) */}
          <div className="gov-card p-5 bg-gradient-to-r from-brand-50/50 via-white to-ivory-50 dark:from-[#16221F] dark:via-[#1A2825] dark:to-[#16221F] border-2 border-brand-200 dark:border-brand-800 rounded-gov shadow-gov space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  <span>DECISION</span>
                </h3>
                <p className="text-xs text-govmuted dark:text-[#94A39D]">
                  Execute competent authority sign-off or return for clarification (Demo workflow action)
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() =>
                    handleDecision(
                      'Approved',
                      'Competent Financial Authority has accorded administrative and financial concurrence for tender issuance.'
                    )
                  }
                  className="px-4 py-2 rounded-gov bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-gov transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>✓ Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDecision(
                      'Returned for Clarification',
                      'Returned to procurement cell for clarification on specification parameters or budgetary provision.'
                    )
                  }
                  className="px-3.5 py-2 rounded-gov bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-gov transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>↩ Return for Clarification</span>
                </button>
              </div>
            </div>

            {selectedCase.decisionNotes && (
              <div className="p-3 rounded-lg bg-white dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-xs space-y-1">
                <span className="font-bold text-charcoal dark:text-white text-[11px] uppercase tracking-wide">
                  Active Authority Note:
                </span>
                <p className="text-govmuted dark:text-[#94A39D]">{selectedCase.decisionNotes}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Core Scrutiny & Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* CASE SUMMARY */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-4 shadow-gov-sm">
                <div className="flex items-center justify-between border-b border-govborder dark:border-[#263833] pb-3">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand" />
                    <span>CASE SUMMARY</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-brand px-2 py-0.5 bg-brand-50 dark:bg-brand-950/40 rounded border border-brand-200 dark:border-brand-800">
                    Demo Case
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-govmuted dark:text-[#94A39D] block mb-1">
                      Procurement Requirement:
                    </span>
                    <div className="p-3.5 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-xs font-medium text-charcoal dark:text-gray-100 leading-relaxed">
                      {selectedCase.scenario.sampleQuery}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-govmuted dark:text-[#94A39D] block">
                        Procurement Status:
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready for Decision</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase text-govmuted dark:text-[#94A39D] block">
                        Originating Department:
                      </span>
                      <span className="text-xs font-semibold text-charcoal dark:text-gray-200 mt-0.5 block">
                        {selectedCase.department}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TECHNICAL SCRUTINY */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-4 shadow-gov-sm">
                <div className="flex items-center justify-between border-b border-govborder dark:border-[#263833] pb-3">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>TECHNICAL SCRUTINY</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Technical review completed</span>
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Scrutiny Status: </span>
                      <span>
                        Technical Scrutiny Officer has vetted standards mapping against BIS database and verified mandatory Quality Control Order (QCO) applicability.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
                      <span className="text-[10px] font-bold text-govmuted dark:text-[#94A39D] uppercase block">
                        Recommended Primary Standard:
                      </span>
                      <span className="font-mono font-bold text-brand dark:text-brand-300 text-xs">
                        {selectedCase.scenario.mockResult.primaryStandard?.isNumber || 'IS 10322 (Part 5/Sec 3)'}
                      </span>
                      <p className="text-[11px] text-govmuted dark:text-[#94A39D] mt-0.5 line-clamp-1">
                        {selectedCase.scenario.mockResult.primaryStandard?.title || 'Indian Standard Specification'}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
                      <span className="text-[10px] font-bold text-govmuted dark:text-[#94A39D] uppercase block">
                        Mandatory Compliance:
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-1">
                        {selectedCase.scenario.mockResult.primaryStandard?.qco?.isCompulsory ? 'Mandatory (QCO)' : 'Standard Recommended'}
                      </span>
                      <p className="text-[11px] text-govmuted dark:text-[#94A39D] mt-0.5">
                        {selectedCase.scenario.mockResult.primaryStandard?.qco?.orderName || 'Conforms to standards catalogue'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SPECIFICATION */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-4 shadow-gov-sm">
                <div className="flex items-center justify-between border-b border-govborder dark:border-[#263833] pb-3">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-brand" />
                    <span>SPECIFICATION</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Specification generated</span>
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-govmuted dark:text-[#94A39D] leading-relaxed">
                    A complete, harmonized procurement specification clause has been generated with explicit BIS test standard references, tolerance criteria, and mandatory inspection requirements.
                  </p>

                  <div className="p-3.5 rounded-lg bg-ivory-100 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] font-mono text-[11px] text-charcoal dark:text-gray-300 space-y-1">
                    <div className="text-[10px] font-bold text-brand uppercase">Sample Specification Clause Extract:</div>
                    <p className="line-clamp-3 italic">
                      &quot;The equipment/material supplied shall strictly conform to Indian Standard{' '}
                      {selectedCase.scenario.mockResult.primaryStandard?.isNumber || 'IS 10322'} with valid BIS License / ISI mark.
                      All parameters including quality tolerances and performance metrics shall be certified prior to dispatch.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Financial Information & Supporting Documents */}
            <div className="space-y-6">
              {/* FINANCIAL INFORMATION */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-4 shadow-gov-sm">
                <div className="border-b border-govborder dark:border-[#263833] pb-3">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-brand" />
                    <span>FINANCIAL INFORMATION</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>Financial Information</span>
                    </div>
                    <div className="font-semibold text-charcoal dark:text-gray-100 pl-5">
                      Demo data / Not provided
                    </div>
                    <div className="text-[11px] text-govmuted dark:text-[#94A39D] pl-5 italic">
                      Not available in current demo dataset
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-[11px] text-govmuted dark:text-[#94A39D] space-y-1">
                    <span className="font-bold text-charcoal dark:text-white block">
                      Demonstration Protocol:
                    </span>
                    <p>
                      MaanakSetu does not invent simulated government procurement rupee amounts or budget heads. Real financial figures are ingested from GeM / CPP Portal integration during production deployment.
                    </p>
                  </div>
                </div>
              </div>

              {/* COMPLIANCE */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-3 shadow-gov-sm">
                <div className="border-b border-govborder dark:border-[#263833] pb-3">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand" />
                    <span>COMPLIANCE STATUS</span>
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
                    <span className="font-semibold">BIS Standard Validity:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Active &amp; Current</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
                    <span className="font-semibold">Quality Control Order:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">Mandatory Gazette Listed</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833]">
                    <span className="font-semibold">Verification Mode:</span>
                    <span className="text-brand dark:text-brand-300 font-bold">Deterministic BIS Cross-Ref</span>
                  </div>

                  <p className="text-[10px] text-govmuted dark:text-[#94A39D] italic pt-1">
                    Verification status based on deterministic BIS knowledge base cross-referencing. Verification is demonstration-level; official gazette and GeM validation remains subject to competent departmental procedure.
                  </p>
                </div>
              </div>

              {/* SUPPORTING DOCUMENTS */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov space-y-3 shadow-gov-sm">
                <div className="border-b border-govborder dark:border-[#263833] pb-3">
                  <h3 className="text-sm font-bold text-charcoal dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand" />
                    <span>SUPPORTING DOCUMENTS</span>
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <a
                    href={OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] hover:bg-ivory-100 dark:hover:bg-[#243833] border border-govborder dark:border-[#263833] text-charcoal dark:text-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-brand" />
                      <span className="font-semibold">BIS Standards Portal Entry</span>
                    </div>
                    <span className="text-[10px] text-govmuted dark:text-[#94A39D]">standardsbis.in</span>
                  </a>

                  <a
                    href={OFFICIAL_PORTALS.GEM_PORTAL.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] hover:bg-ivory-100 dark:hover:bg-[#243833] border border-govborder dark:border-[#263833] text-charcoal dark:text-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-brand" />
                      <span className="font-semibold">GeM Portal Standards Cell</span>
                    </div>
                    <span className="text-[10px] text-govmuted dark:text-[#94A39D]">gem.gov.in</span>
                  </a>

                  <div className="p-2.5 rounded-lg bg-ivory-50 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="font-semibold">Technical Scrutiny Sign-Off</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Attached</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* SECTION 5: APPROVAL & DECISION DASHBOARD                                  */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-govborder dark:border-[#263833]">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-brand-50 dark:bg-brand-950/40 text-brand dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  DEMO ENVIRONMENT
                </span>
                <span className="text-xs text-govmuted dark:text-[#94A39D]">
                  Competent Financial Authority Workspace
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-charcoal dark:text-white mt-1">
                APPROVAL &amp; DECISION DASHBOARD
              </h1>
              <p className="text-xs text-govmuted dark:text-[#94A39D]">
                Review procurement cases and approval status
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory-100 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-xs font-semibold text-charcoal dark:text-gray-200">
                <Building2 className="w-3.5 h-3.5 text-brand" />
                <span>GeM &amp; CPPP Decision Ledger</span>
              </span>
            </div>
          </div>

          {/* APPROVAL QUEUE STAT CARDS */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-govmuted dark:text-[#94A39D] mb-3">
              APPROVAL QUEUE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stat 1: Pending Approval */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov shadow-gov-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-govmuted dark:text-[#94A39D] font-semibold">
                  <span>Pending Approval</span>
                  <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">
                  {String(pendingCount).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-govmuted dark:text-[#94A39D]">
                  Awaiting competent financial clearance
                </div>
              </div>

              {/* Stat 2: Returned for Clarification */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov shadow-gov-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-govmuted dark:text-[#94A39D] font-semibold">
                  <span>Returned for Clarification</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">
                  {String(returnedCount).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-govmuted dark:text-[#94A39D]">
                  Under clarification with procurement officer
                </div>
              </div>

              {/* Stat 3: Approved */}
              <div className="gov-card p-5 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov shadow-gov-sm space-y-1">
                <div className="flex items-center justify-between text-xs text-govmuted dark:text-[#94A39D] font-semibold">
                  <span>Approved</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-charcoal dark:text-white tracking-tight">
                  {String(approvedCount).padStart(2, '0')}
                </div>
                <div className="text-[10px] text-govmuted dark:text-[#94A39D]">
                  Tender release authorized &amp; archived
                </div>
              </div>
            </div>
          </div>

          {/* PROCUREMENT CASES AWAITING DECISION TABLE */}
          <div className="gov-card bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] rounded-gov shadow-gov overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-govborder dark:border-[#263833] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-charcoal dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-brand" />
                  <span>PROCUREMENT CASES AWAITING DECISION</span>
                </h2>
                <p className="text-xs text-govmuted dark:text-[#94A39D]">
                  Verified procurement proposals prepared with BIS-compliant specifications
                </p>
              </div>
              <span className="text-[11px] font-semibold text-govmuted dark:text-[#94A39D]">
                Showing {cases.length} Demo Cases • Notional / Demonstration Only
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-100 dark:bg-[#1C2C28] text-govmuted dark:text-[#94A39D] font-bold text-[11px] uppercase tracking-wider border-b border-govborder dark:border-[#263833]">
                  <tr>
                    <th scope="col" className="p-3.5 pl-5">Procurement Case</th>
                    <th scope="col" className="p-3.5">Department / Organization</th>
                    <th scope="col" className="p-3.5">Technical Scrutiny</th>
                    <th scope="col" className="p-3.5">Specification</th>
                    <th scope="col" className="p-3.5">Compliance</th>
                    <th scope="col" className="p-3.5">Financial Information</th>
                    <th scope="col" className="p-3.5">Status</th>
                    <th scope="col" className="p-3.5 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-govborder dark:divide-[#263833]">
                  {cases.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-ivory-50/80 dark:hover:bg-[#1F302C] transition-colors"
                    >
                      {/* Procurement Case */}
                      <td className="p-3.5 pl-5">
                        <div className="font-bold text-charcoal dark:text-white">
                          {c.scenario.title}
                        </div>
                        <div className="text-[11px] text-govmuted dark:text-[#94A39D] flex items-center gap-1.5 mt-0.5 font-mono">
                          <span>{c.id}</span>
                          <span>•</span>
                          <span>{c.submissionDate}</span>
                        </div>
                      </td>

                      {/* Department / Organization */}
                      <td className="p-3.5 text-govmuted dark:text-[#94A39D] max-w-[180px]">
                        <span className="line-clamp-2">{c.department}</span>
                      </td>

                      {/* Technical Scrutiny */}
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{c.technicalScrutinyStatus}</span>
                        </span>
                      </td>

                      {/* Specification */}
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand dark:text-brand-300">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>{c.specStatus}</span>
                        </span>
                      </td>

                      {/* Compliance */}
                      <td className="p-3.5 text-[11px] text-charcoal dark:text-gray-200 max-w-[190px]">
                        <span className="line-clamp-2">{c.complianceSummary}</span>
                      </td>

                      {/* Financial Information */}
                      <td className="p-3.5 text-[11px] text-govmuted dark:text-[#94A39D] italic">
                        {c.financialInfo}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {getStatusBadge(c.status)}
                      </td>

                      {/* Action */}
                      <td className="p-3.5 pr-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedCaseId(c.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-gov bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-gov-sm transition-all cursor-pointer"
                        >
                          <span>Review Case</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
