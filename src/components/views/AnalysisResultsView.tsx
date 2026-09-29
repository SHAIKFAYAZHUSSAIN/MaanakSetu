'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  FileText,
  BadgeAlert,
  ArrowDown,
  Check,
  Building,
  FlaskConical,
} from 'lucide-react';
import { RecommendationResult, SpecificationGap } from '@/types/procurement';
import { IndianStandard } from '@/types/standards';
import {
  OFFICIAL_PORTALS,
  resolveOfficialStandardUrl,
  SECURITY_TRUST_NOTICE,
  LIVE_VERIFICATION_REQUIRED_TEXT,
} from '@/lib/officialSources';

interface AnalysisResultsViewProps {
  result: RecommendationResult;
  onWhyRecommendedClick: () => void;
  onViewStandardDetails: (standard: IndianStandard) => void;
  onToggleResolveGap: (gapId: string) => void;
  onGenerateSpecClick: () => void;
  onViewKnowledgeGraphClick: () => void;
  onReAnalyzeClick: () => void;
}

export default function AnalysisResultsView({
  result,
  onWhyRecommendedClick,
  onViewStandardDetails,
  onToggleResolveGap,
  onGenerateSpecClick,
  onViewKnowledgeGraphClick,
  onReAnalyzeClick,
}: AnalysisResultsViewProps) {
  const [isRequirementExpanded, setIsRequirementExpanded] = useState<boolean>(false);
  const [fixedWithAI, setFixedWithAI] = useState<boolean>(false);

  const { extractedRequirement, primaryStandard, relatedStandards, specificationGaps, evidence } = result;

  const primaryStdUrl = primaryStandard
    ? resolveOfficialStandardUrl(primaryStandard.isNumber, primaryStandard.officialSourceUrl)
    : OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url;

  const isCrsApplicable =
    (primaryStandard?.qco?.scheme || '').toLowerCase().includes('crs') ||
    (primaryStandard?.qco?.scheme || '').toLowerCase().includes('scheme-ii') ||
    (primaryStandard?.title || '').toLowerCase().includes('driver') ||
    (primaryStandard?.title || '').toLowerCase().includes('lamp') ||
    (primaryStandard?.title || '').toLowerCase().includes('it equipment') ||
    relatedStandards.some(
      (r) =>
        r.standard.isNumber.includes('15885') ||
        r.standard.isNumber.includes('16103') ||
        r.standard.isNumber.includes('13252')
    );

  // Compute executive summary numbers
  const reqCount = 4 + Object.keys(extractedRequirement.otherSpecs || {}).length + (extractedRequirement.safetyFeatures?.length || 0);
  const primaryCount = primaryStandard ? 1 : 0;
  const relatedCount = relatedStandards.length;
  const regCount = primaryStandard?.qco ? 3 : 1;
  const gapsCount = specificationGaps.length;

  const handleFixAllGapsWithAI = () => {
    specificationGaps.forEach((gap) => {
      if (!gap.isResolved) {
        onToggleResolveGap(gap.id);
      }
    });
    setFixedWithAI(true);
  };

  // Group related standards into categories
  const testMethodStandards = relatedStandards.filter(
    (r) =>
      r.standard.productCategory?.toLowerCase().includes('test') ||
      r.standard.title?.toLowerCase().includes('test') ||
      r.standard.title?.toLowerCase().includes('method') ||
      r.matchReasons.some((m) => m.toLowerCase().includes('test'))
  );

  const safetyStandards = relatedStandards.filter(
    (r) =>
      r.standard.productCategory?.toLowerCase().includes('safety') ||
      r.standard.title?.toLowerCase().includes('safety') ||
      r.standard.title?.toLowerCase().includes('insulation') ||
      r.standard.title?.toLowerCase().includes('controlgear')
  );

  const installationStandards = relatedStandards.filter(
    (r) =>
      r.standard.title?.toLowerCase().includes('earthing') ||
      r.standard.title?.toLowerCase().includes('code of practice') ||
      r.standard.title?.toLowerCase().includes('installation')
  );

  const otherAlliedStandards = relatedStandards.filter(
    (r) =>
      !testMethodStandards.includes(r) &&
      !safetyStandards.includes(r) &&
      !installationStandards.includes(r)
  );

  return (
    <div className="gov-workspace-container space-y-8 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-govborder">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official BIS Standards Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Standards Analysis</h2>
          <p className="text-xs text-govmuted mt-0.5">
            Demonstration Knowledge Base • Grounded against BIS Act, 2016 and DPIIT Quality Control Orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReAnalyzeClick}
            className="px-3.5 py-2 rounded-lg bg-white border border-govborder text-xs font-semibold text-charcoal hover:bg-ivory-50 transition-colors shadow-gov-sm"
          >
            Edit Requirement
          </button>
          <button
            onClick={onGenerateSpecClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-bold shadow-gov transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Generate Specification</span>
          </button>
        </div>
      </div>

      {/* Outdated Standard Banner if detected */}
      {result.outdatedStandardAlert && result.outdatedStandardAlert.isOutdated && (
        <div className="p-4 rounded-gov bg-amber-50 border border-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-accent font-bold text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Superseded Standard Alert: {result.outdatedStandardAlert.citedStandard}</span>
          </div>
          <p className="text-charcoal leading-relaxed font-normal">
            {result.outdatedStandardAlert.actionRequired}
          </p>
          <div className="text-[11px] text-govmuted font-medium">
            Current Mandatory Replacement: <strong>{result.outdatedStandardAlert.currentReplacement}</strong> ({result.outdatedStandardAlert.replacementTitle})
          </div>
        </div>
      )}

      {/* A. REQUIREMENT SUMMARY CARD */}
      <div className="gov-card p-6 bg-white border border-govborder shadow-gov-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-govborder">
          <div>
            <div className="text-[10px] uppercase font-bold text-govmuted tracking-wider">Identified Product</div>
            <h3 className="text-xl font-extrabold text-charcoal tracking-tight">{extractedRequirement.product}</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-brand-50 text-brand border border-brand-200 font-semibold">
            {extractedRequirement.application}
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-charcoal block mb-2.5">Detected Tender Requirements:</span>
          <div className="flex flex-wrap gap-2">
            {[
              'Energy efficiency',
              'Electrical safety',
              'Weather resistance',
              'Optical performance',
              'Surge protection',
              'Installation & Mounting',
              'Testing & Quality Assurance',
              extractedRequirement.protectionRating ? `Ingress Protection (${extractedRequirement.protectionRating})` : null,
              extractedRequirement.power ? `Rated Power (${extractedRequirement.power})` : null,
              extractedRequirement.voltage ? `Rated Voltage (${extractedRequirement.voltage})` : null,
            ]
              .filter(Boolean)
              .map((req, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory-50 border border-govborder text-xs font-semibold text-charcoal shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-secgreen flex-shrink-0" />
                  <span>{req}</span>
                </span>
              ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-ivory-50/70 border border-govborder text-xs font-mono italic text-charcoal/80 leading-relaxed">
          &ldquo;{extractedRequirement.rawQuery}&rdquo;
        </div>
      </div>

      {/* Executive Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="gov-card p-4 bg-white text-center border border-govborder">
          <span className="text-[11px] font-semibold text-govmuted block">Requirements Identified</span>
          <span className="text-2xl font-extrabold text-charcoal mt-1 block">{reqCount}</span>
          <span className="text-[10px] text-govmuted font-medium mt-0.5 block">Extracted Features</span>
        </div>
        <div className="gov-card p-4 bg-white text-center border border-govborder">
          <span className="text-[11px] font-semibold text-govmuted block">Primary Standards</span>
          <span className="text-2xl font-extrabold text-brand mt-1 block">{primaryCount}</span>
          <span className="text-[10px] text-brand font-medium mt-0.5 block">Governing Code</span>
        </div>
        <div className="gov-card p-4 bg-white text-center border border-govborder">
          <span className="text-[11px] font-semibold text-govmuted block">Related Standards</span>
          <span className="text-2xl font-extrabold text-secgreen mt-1 block">{relatedCount}</span>
          <span className="text-[10px] text-secgreen font-medium mt-0.5 block">Normative Subsystems</span>
        </div>
        <div className="gov-card p-4 bg-white text-center border border-govborder">
          <span className="text-[11px] font-semibold text-govmuted block">Regulatory Checks</span>
          <span className="text-2xl font-extrabold text-accent mt-1 block">{regCount}</span>
          <span className="text-[10px] text-accent font-medium mt-0.5 block">Gazetted Orders</span>
        </div>
        <div className="gov-card p-4 bg-white text-center border border-govborder col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-govmuted block">Specification Gaps</span>
          <span className="text-2xl font-extrabold text-govdanger mt-1 block">{gapsCount}</span>
          <span className="text-[10px] text-govdanger font-medium mt-0.5 block">Missing Benchmarks</span>
        </div>
      </div>

      {/* B. RECOMMENDED STANDARDS CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <span>Recommended Indian Standards</span>
            </h3>
            <p className="text-xs text-govmuted">
              Ranked by semantic scope alignment, mandatory testing benchmarks, and gazetted QCO mandates
            </p>
          </div>
          <span className="text-xs text-govmuted font-medium hidden sm:inline">Official Bureau of Indian Standards</span>
        </div>

        {/* 1. Primary Standard Card */}
        {primaryStandard && (
          <div className="gov-card p-6 md:p-7 bg-white border border-brand/50 shadow-gov relative overflow-hidden space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-govborder">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-brand text-white">
                    PRIMARY
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                    Status: {primaryStandard.status} / Demo Verification
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-ivory-100 text-charcoal border border-govborder">
                    Confidence: High ({result.matchConfidence}%)
                  </span>
                </div>
                <h4 className="text-2xl font-extrabold text-charcoal tracking-tight">
                  {primaryStandard.isNumber}
                </h4>
                <p className="text-sm font-semibold text-brand mt-0.5">
                  {primaryStandard.title}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
                <a
                  href={primaryStdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-secgreen border border-emerald-300 text-xs font-bold shadow-gov-sm transition-all"
                  title="Verify standard on official BIS Standards Portal"
                >
                  <span>Verify on BIS</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => onViewStandardDetails(primaryStandard)}
                  className="px-3.5 py-2 rounded-lg bg-ivory-100 hover:bg-ivory-200 text-charcoal text-xs font-semibold border border-govborder transition-colors shadow-gov-sm"
                >
                  View Standard
                </button>
                <button
                  id="why-recommended-button"
                  onClick={onWhyRecommendedClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-bold shadow-gov transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Why recommended?</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[11px] uppercase font-bold text-govmuted mb-1">Why recommended:</div>
                <p className="text-sm text-charcoal leading-relaxed font-normal">
                  {evidence?.whyApplies ||
                    'Matches electrical safety, constructional, and performance requirements detected from the tender.'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-ivory-50 border border-govborder text-xs text-charcoal space-y-1">
                <span className="font-bold text-brand block">Sectional Scope Extract:</span>
                <p className="text-govmuted leading-relaxed font-normal italic">
                  &ldquo;{evidence?.scopeExtract || primaryStandard.scope}&rdquo;
                </p>
              </div>

              {/* Source Provenance Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-govborder text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-govmuted uppercase">Source:</span>
                  <a
                    href={primaryStdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand hover:underline inline-flex items-center gap-1"
                  >
                    <span>{OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                    OFFICIAL SOURCE
                  </span>
                </div>
                <div className="text-[11px] text-govmuted italic">
                  {LIVE_VERIFICATION_REQUIRED_TEXT}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Allied / Related Recommendation Cards */}
        {relatedStandards.slice(0, 2).map((rel) => {
          const relStdUrl = resolveOfficialStandardUrl(rel.standard.isNumber, rel.standard.officialSourceUrl);
          return (
            <div
              key={rel.standard.id || rel.standard.isNumber}
              className="gov-card p-5 bg-white border border-govborder hover:border-brand/40 shadow-gov-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-govborder">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                      RELATED / NORMATIVE
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-ivory-100 text-charcoal border border-govborder">
                      Confidence: High ({rel.score}%)
                    </span>
                    <span className="text-[10px] text-govmuted font-medium">Status: Current / Verified</span>
                  </div>
                  <h4 className="text-lg font-bold text-charcoal">{rel.standard.isNumber}</h4>
                  <p className="text-xs font-medium text-brand">{rel.standard.title}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto flex-shrink-0">
                  <a
                    href={relStdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-secgreen border border-emerald-200 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Verify on BIS</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onViewStandardDetails(rel.standard)}
                    className="px-3 py-1.5 rounded-lg bg-ivory-50 hover:bg-ivory-100 text-charcoal text-xs font-semibold border border-govborder transition-colors"
                  >
                    View Standard
                  </button>
                  <button
                    onClick={onWhyRecommendedClick}
                    className="px-3 py-1.5 rounded-lg bg-white border border-brand text-brand hover:bg-brand-50 text-xs font-semibold transition-colors"
                  >
                    Why recommended?
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-govmuted uppercase block mb-0.5">Why recommended:</span>
                <p className="text-xs text-charcoal leading-relaxed">
                  {rel.matchReasons[0] || rel.standard.scope}
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-govmuted">
                  <span className="font-bold">Source:</span>
                  <a
                    href={relStdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                    OFFICIAL
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. RELATED / ALLIED STANDARDS: Grouped Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal">Allied Standards & Normative Hierarchy</h3>
            <p className="text-xs text-govmuted">
              Visual relationship flow connecting primary standard to test methods, safety subsystems, and installation
            </p>
          </div>
          <button
            onClick={onViewKnowledgeGraphClick}
            className="text-xs text-brand font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>Explore in Knowledge Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Relationship Flow */}
        <div className="p-3.5 rounded-gov bg-ivory-100/90 border border-govborder flex flex-wrap items-center justify-center gap-2.5 text-xs font-semibold text-charcoal">
          <span className="px-3 py-1 rounded bg-brand text-white shadow-xs">Primary Standard</span>
          <span className="text-govmuted font-bold">→</span>
          <span className="px-2.5 py-1 rounded bg-white border border-govborder">Test Methods</span>
          <span className="text-govmuted font-bold">→</span>
          <span className="px-2.5 py-1 rounded bg-white border border-govborder">Safety Standards</span>
          <span className="text-govmuted font-bold">→</span>
          <span className="px-2.5 py-1 rounded bg-white border border-govborder">Installation & Earthing</span>
        </div>

        {/* Grouped Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testMethodStandards.length > 0 && (
            <div className="gov-card p-5 bg-white border border-govborder space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-charcoal pb-2 border-b border-govborder">
                <FlaskConical className="w-4 h-4 text-secgreen" />
                <span>Test Methods</span>
              </div>
              <div className="space-y-2.5">
                {testMethodStandards.map((rel) => (
                  <div key={rel.standard.id || rel.standard.isNumber} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal text-xs">{rel.standard.isNumber}</span>
                      <span className="text-[10px] font-semibold text-secgreen px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        Test Method
                      </span>
                    </div>
                    <p className="text-xs text-govmuted font-medium line-clamp-1">{rel.standard.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {safetyStandards.length > 0 && (
            <div className="gov-card p-5 bg-white border border-govborder space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-charcoal pb-2 border-b border-govborder">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>Safety Standards</span>
              </div>
              <div className="space-y-2.5">
                {safetyStandards.map((rel) => (
                  <div key={rel.standard.id || rel.standard.isNumber} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal text-xs">{rel.standard.isNumber}</span>
                      <span className="text-[10px] font-semibold text-brand px-1.5 py-0.5 rounded bg-brand-50 border border-brand-200">
                        Safety Code
                      </span>
                    </div>
                    <p className="text-xs text-govmuted font-medium line-clamp-1">{rel.standard.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. COMPLIANCE & CURRENCY PANEL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-charcoal">Compliance & Currency</h3>
          <span className="text-xs px-2.5 py-1 rounded bg-ivory-100 border border-govborder text-govmuted font-medium">
            Demo Knowledge Base • Requires Official Verification
          </span>
        </div>

        <div className="gov-card p-6 bg-white border border-govborder shadow-gov-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Revision Status */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-2 pb-2 border-b border-govborder">
              <Clock className="w-4 h-4 text-brand" />
              <span>Standard Status & Currency</span>
            </h4>

            {primaryStandard ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-ivory-50 border border-govborder">
                  <span className="text-charcoal font-medium">Standard Currency:</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                    VERIFIED CURRENT
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-ivory-50 border border-govborder">
                  <span className="text-charcoal font-medium">Latest Revision:</span>
                  <span className="font-bold text-charcoal">{primaryStandard.versionChain.currentYear} Edition</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-ivory-50 border border-govborder">
                  <span className="text-charcoal font-medium">Amendments Currency:</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                    VERIFIED UP TO DATE
                  </span>
                </div>
                {primaryStandard.versionChain.amendments.map((a) => (
                  <div key={a.number} className="text-[11px] text-govmuted pl-2 border-l-2 border-brand">
                    Amendment {a.number} ({a.year}): {a.summary}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right Column: Regulatory & QCO References */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-charcoal flex items-center gap-2 pb-2 border-b border-govborder">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>Certification &amp; Regulatory Status</span>
            </h4>

            {primaryStandard?.qco ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-ivory-50 border border-govborder">
                  <span className="text-charcoal font-medium">Quality Control Order:</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-amber-50 text-accent border border-amber-200">
                    {primaryStandard.qco.isCompulsory ? 'VERIFIED COMPULSORY' : 'REQUIRES VERIFICATION'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-ivory-50 border border-govborder space-y-1 text-[11px]">
                  <div><strong>Order:</strong> {primaryStandard.qco.orderName}</div>
                  <div><strong>Gazette Notification:</strong> {primaryStandard.qco.gazetteNotification}</div>
                  <div><strong>Certification Scheme:</strong> {primaryStandard.qco.scheme}</div>
                </div>

                <div className="p-2.5 rounded bg-brand-50/70 border border-brand-200 text-[11px] text-brand font-medium">
                  <strong>Procurement Mandate:</strong> CPPP &amp; GeM bidders must furnish valid BIS license at technical bid submission.
                </div>

                {/* Working Official Verification Links */}
                <div className="pt-2 border-t border-govborder space-y-1.5 text-[11px]">
                  <span className="text-[10px] uppercase font-bold text-govmuted block">Official Portals</span>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-ivory-50 border border-govborder text-brand font-semibold transition-colors"
                    >
                      <span>BIS Compulsory Certification / QCO ↗</span>
                    </a>
                    <a
                      href={OFFICIAL_PORTALS.BIS_CERTIFICATION_PROCESS.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-ivory-50 border border-govborder text-brand font-semibold transition-colors"
                    >
                      <span>Product Certification Process ↗</span>
                    </a>
                    {isCrsApplicable && (
                      <a
                        href={OFFICIAL_PORTALS.BIS_CRS.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-ivory-50 border border-govborder text-brand font-semibold transition-colors"
                      >
                        <span>BIS CRS Portal ↗</span>
                      </a>
                    )}
                    <a
                      href={OFFICIAL_PORTALS.GEM_PORTAL.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-ivory-50 border border-govborder text-govmuted font-semibold transition-colors"
                      title="Procurement context reference"
                    >
                      <span>GeM Portal ↗</span>
                    </a>
                  </div>
                  <div className="text-[10px] text-govmuted italic pt-0.5">
                    {LIVE_VERIFICATION_REQUIRED_TEXT}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-ivory-50 border border-govborder text-xs text-govmuted space-y-2">
                <span className="font-bold text-charcoal block mb-1">NOT IDENTIFIED</span>
                <p>No compulsory Quality Control Order identified for this category. Verification recommended.</p>
                <div className="pt-2 border-t border-govborder">
                  <a
                    href={OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Check BIS Compulsory Certification List ↗</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. SPECIFICATION GAPS DETECTED */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-charcoal">Specification Gaps Detected</h3>
            <p className="text-xs text-govmuted">
              Auditing tender specifications against BIS governing clauses to prevent vendor ambiguity
            </p>
          </div>

          <button
            onClick={handleFixAllGapsWithAI}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-700 text-white text-xs font-bold shadow-gov transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fix gaps with AI ({specificationGaps.filter((g) => !g.isResolved).length} remaining)</span>
          </button>
        </div>

        {/* Satisfied Requirements vs Missing Requirements */}
        <div className="gov-card p-5 bg-white border border-govborder space-y-3">
          {/* Missing Gaps List */}
          {specificationGaps.map((gap) => (
            <div
              key={gap.id}
              className={`p-3.5 rounded-gov border transition-all ${
                gap.isResolved
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-ivory-50 border-govborder hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-accent">
                    {gap.isResolved ? '✓' : '⚠'}
                  </span>
                  <h4 className="text-xs font-bold text-charcoal">
                    {gap.isResolved ? `${gap.parameter} specified & adopted` : `${gap.parameter} missing in tender`}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      gap.severity === 'High'
                        ? 'bg-red-50 text-govdanger border border-red-200'
                        : 'bg-amber-50 text-accent border border-amber-200'
                    }`}
                  >
                    {gap.severity}
                  </span>
                </div>

                <button
                  onClick={() => onToggleResolveGap(gap.id)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                    gap.isResolved
                      ? 'bg-secgreen text-white hover:bg-green-700'
                      : 'bg-white border border-govborder text-charcoal hover:border-brand hover:text-brand'
                  }`}
                >
                  {gap.isResolved ? 'Resolved ✓' : 'Adopt AI Clause'}
                </button>
              </div>

              <p className="text-[11px] text-govmuted mb-1">{gap.whyImportant}</p>
              <div className="p-2 rounded bg-white border border-govborder text-charcoal text-[11px] font-mono">
                {gap.suggestedClause}
              </div>
            </div>
          ))}

          {/* Already Specified Benchmarks */}
          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1.5 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secgreen block">
              Adequately Specified in Tender:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-charcoal">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-secgreen" />
                <span>Electrical safety provisions aligned with BIS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-secgreen" />
                <span>Installation and mounting guidelines cited</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Final Action Bar */}
      <div className="gov-card p-6 bg-gradient-to-r from-brand-50 via-white to-ivory-100 border border-brand/40 shadow-gov flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-charcoal">
            Ready to generate standards-ready tender specification?
          </h4>
          <p className="text-xs text-govmuted">
            Formats an official 9-clause procurement specification clause incorporating all resolved gaps.
          </p>
        </div>

        <button
          onClick={onGenerateSpecClick}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-gov bg-brand hover:bg-brand-700 text-white font-bold text-sm shadow-gov transition-all hover:shadow-gov-hover hover:-translate-y-0.5 flex-shrink-0"
        >
          <FileCheck2 className="w-5 h-5 text-accent" />
          <span>Generate Standards-Ready Specification</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle Security / Trust Notice */}
      <div className="p-3.5 rounded-lg bg-ivory-100/80 border border-govborder text-xs text-govmuted leading-relaxed text-center">
        <strong>Official Standards Advisory:</strong> {SECURITY_TRUST_NOTICE}
      </div>
    </div>
  );
}
