'use client';

import React from 'react';
import {
  X,
  ArrowDown,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Network,
  FileText,
  BadgeAlert,
  Building2,
  Sparkles,
} from 'lucide-react';
import { RecommendationResult } from '@/types/procurement';
import {
  OFFICIAL_PORTALS,
  resolveOfficialStandardUrl,
  SECURITY_TRUST_NOTICE,
  LIVE_VERIFICATION_REQUIRED_TEXT,
} from '@/lib/officialSources';

interface RecommendationTraceabilityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  result: RecommendationResult | null;
}

export default function RecommendationTraceabilityDrawer({
  isOpen,
  onClose,
  result,
}: RecommendationTraceabilityDrawerProps) {
  if (!isOpen || !result || !result.primaryStandard) return null;

  const { extractedRequirement, primaryStandard, relatedStandards, evidence } = result;
  const primaryStdUrl = resolveOfficialStandardUrl(primaryStandard.isNumber, primaryStandard.officialSourceUrl);

  const isCrsApplicable =
    (primaryStandard.qco?.scheme || '').toLowerCase().includes('crs') ||
    (primaryStandard.qco?.scheme || '').toLowerCase().includes('scheme-ii') ||
    (primaryStandard.title || '').toLowerCase().includes('driver') ||
    (primaryStandard.title || '').toLowerCase().includes('lamp') ||
    (primaryStandard.title || '').toLowerCase().includes('it equipment') ||
    relatedStandards.some(
      (r) =>
        r.standard.isNumber.includes('15885') ||
        r.standard.isNumber.includes('16103') ||
        r.standard.isNumber.includes('13252')
    );

  // 4-Step Core Traceability Chain:
  // Tender requirement -> Extracted concept -> Recommended Indian Standard -> Official source
  const coreChainSteps = [
    {
      stepNumber: '01',
      title: 'Tender Requirement',
      badge: 'Raw Input',
      badgeClass: 'bg-ivory-100 text-charcoal border-govborder',
      icon: FileText,
      body: (
        <div className="p-3 rounded-lg bg-ivory-50 border border-govborder text-xs text-charcoal font-mono italic leading-relaxed">
          &ldquo;{extractedRequirement.rawQuery || 'Specification description provided in tender document'}&rdquo;
        </div>
      ),
    },
    {
      stepNumber: '02',
      title: 'Extracted Concept',
      badge: 'Domain & Technical Parameters',
      badgeClass: 'bg-brand-50 text-brand border-brand-200',
      icon: CheckCircle2,
      body: (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-ivory-50 border border-govborder">
              <span className="text-[10px] uppercase font-bold text-govmuted block">Product Domain</span>
              <span className="font-bold text-charcoal">{extractedRequirement.domain || extractedRequirement.product}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-ivory-50 border border-govborder">
              <span className="text-[10px] uppercase font-bold text-govmuted block">Application</span>
              <span className="font-bold text-charcoal">{extractedRequirement.application}</span>
            </div>
          </div>
          {(extractedRequirement.power || extractedRequirement.voltage || extractedRequirement.protectionRating) && (
            <div className="p-2.5 rounded-lg bg-ivory-50 border border-govborder flex flex-wrap gap-2 text-[11px]">
              {extractedRequirement.power && (
                <span className="font-semibold text-charcoal">⚡ {extractedRequirement.power}</span>
              )}
              {extractedRequirement.voltage && (
                <span className="font-semibold text-charcoal">🔌 {extractedRequirement.voltage}</span>
              )}
              {extractedRequirement.protectionRating && (
                <span className="font-semibold text-charcoal">🛡️ {extractedRequirement.protectionRating}</span>
              )}
            </div>
          )}
          <div className="p-2.5 rounded-lg bg-ivory-50 border border-govborder text-govmuted text-[11px] leading-relaxed">
            <strong>Scope Alignment:</strong> {evidence?.scopeExtract || primaryStandard.scope}
          </div>
        </div>
      ),
    },
    {
      stepNumber: '03',
      title: 'Recommended Indian Standard',
      badge: 'Governing Benchmark',
      badgeClass: 'bg-emerald-50 text-brand border-brand-200',
      icon: ShieldCheck,
      body: (
        <div className="p-3.5 rounded-lg bg-brand-50/70 border border-brand-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-brand text-sm tracking-tight">{primaryStandard.isNumber}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-brand border border-brand-200">
              Confidence: {result.matchConfidence}% ({result.confidenceLevel})
            </span>
          </div>
          <div className="font-bold text-charcoal">{primaryStandard.title}</div>
          <div className="text-govmuted text-[11px] leading-relaxed font-normal">
            <strong>Why recommended:</strong>{' '}
            {evidence?.whyApplies ||
              'Matches the lighting fixture and electrical safety benchmarks detected in the tender requirements.'}
          </div>
        </div>
      ),
    },
    {
      stepNumber: '04',
      title: 'Official Source & Verification',
      badge: 'OFFICIAL SOURCE',
      badgeClass: 'bg-emerald-50 text-secgreen border-emerald-300 font-bold',
      icon: ExternalLink,
      body: (
        <div className="p-3.5 rounded-lg bg-white border border-brand/40 shadow-xs text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-govborder">
            <div>
              <span className="text-[10px] uppercase font-bold text-govmuted block">Official Source Portal</span>
              <span className="font-bold text-charcoal text-sm">{OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label}</span>
            </div>
            <a
              href={primaryStdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-gov-sm transition-all flex-shrink-0 self-start sm:self-auto"
            >
              <span>Open official source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-ivory-50 border border-govborder">
              <span className="text-[10px] font-bold uppercase text-govmuted block">Last Verified</span>
              <span className="text-charcoal font-medium italic">{LIVE_VERIFICATION_REQUIRED_TEXT}</span>
            </div>
            <div className="p-2 rounded bg-ivory-50 border border-govborder">
              <span className="text-[10px] font-bold uppercase text-govmuted block">Verification Status</span>
              <span className="text-accent font-bold">Official source available — live verification required</span>
            </div>
          </div>

          <div className="p-2 rounded bg-ivory-50 text-[10px] text-govmuted leading-normal">
            <strong>Traceability Protocol:</strong> Click &ldquo;Open official source&rdquo; to query active BIS registers directly. ManakSetu does not display simulated or fake verification dates.
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-charcoal/50 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-gov-modal flex flex-col border-l border-govborder overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-govborder flex items-center justify-between bg-ivory-50/90">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand text-xs font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Evidence &amp; Traceability Panel</span>
            </div>
            <h3 className="text-lg font-extrabold text-charcoal">Why was this standard recommended?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-govmuted hover:text-charcoal hover:bg-ivory-200 transition-colors"
            aria-label="Close Traceability Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Provenance Banner */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-charcoal leading-relaxed font-medium space-y-1">
            <div className="flex items-center gap-1.5 text-brand font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Deterministic Standards Traceability</span>
            </div>
            <p className="text-govmuted text-[11px]">
              Every recommendation establishes an unbroken, auditable link from the tender requirement to the official Bureau of Indian Standards (BIS) gazetted publication.
            </p>
          </div>

          {/* 4-Step Vertical Flow */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-govmuted">
              Traceability Evidence Chain
            </div>

            <div className="space-y-3">
              {coreChainSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.stepNumber} className="space-y-2">
                    <div className="p-4 rounded-lg bg-white border border-govborder shadow-gov-sm space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-charcoal uppercase tracking-wide">
                            {step.title}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${step.badgeClass}`}>
                          {step.badge}
                        </span>
                      </div>

                      {step.body}
                    </div>

                    {idx < coreChainSteps.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowDown className="w-4 h-4 text-brand/60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Statutory Provenance Links */}
          <div className="space-y-2 pt-2 border-t border-govborder">
            <span className="text-xs font-bold uppercase tracking-wider text-govmuted block">
              Official Regulatory &amp; Certification Portals
            </span>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <a
                href={OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-ivory-50 hover:bg-ivory-100 border border-govborder flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="font-bold text-charcoal group-hover:text-brand transition-colors">
                    {OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.label}
                  </div>
                  <div className="text-[11px] text-govmuted">
                    Verify DPIIT/Ministry Quality Control Orders &amp; mandatory certifications
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-govmuted group-hover:text-brand flex-shrink-0 ml-2" />
              </a>

              <a
                href={OFFICIAL_PORTALS.BIS_CERTIFICATION_PROCESS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-ivory-50 hover:bg-ivory-100 border border-govborder flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="font-bold text-charcoal group-hover:text-brand transition-colors">
                    {OFFICIAL_PORTALS.BIS_CERTIFICATION_PROCESS.label}
                  </div>
                  <div className="text-[11px] text-govmuted">
                    Conformity assessment protocols &amp; Scheme-I (ISI Mark) procedures
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-govmuted group-hover:text-brand flex-shrink-0 ml-2" />
              </a>

              {isCrsApplicable && (
                <a
                  href={OFFICIAL_PORTALS.BIS_CRS.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-ivory-50 hover:bg-ivory-100 border border-govborder flex items-center justify-between transition-colors group"
                >
                  <div>
                    <div className="font-bold text-charcoal group-hover:text-brand transition-colors">
                      {OFFICIAL_PORTALS.BIS_CRS.label}
                    </div>
                    <div className="text-[11px] text-govmuted">
                      Compulsory Registration Scheme for electronics, drivers, and IT equipment
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-govmuted group-hover:text-brand flex-shrink-0 ml-2" />
                </a>
              )}

              <a
                href={OFFICIAL_PORTALS.GEM_PORTAL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-ivory-50 hover:bg-ivory-100 border border-govborder flex items-center justify-between transition-colors group"
              >
                <div>
                  <div className="font-bold text-charcoal group-hover:text-brand transition-colors">
                    {OFFICIAL_PORTALS.GEM_PORTAL.label}
                  </div>
                  <div className="text-[11px] text-govmuted">
                    Procurement context reference &amp; GeM golden specifications
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-govmuted group-hover:text-brand flex-shrink-0 ml-2" />
              </a>
            </div>
          </div>

          {/* Security & Trust Notice */}
          <div className="p-3 rounded-lg bg-ivory-100 border border-govborder text-[11px] text-govmuted leading-relaxed text-center">
            <strong>Notice:</strong> {SECURITY_TRUST_NOTICE}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-govborder bg-ivory-50/70 flex items-center justify-between">
          <a
            href={primaryStdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1.5"
          >
            <span>Verify on BIS Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-semibold shadow-gov-sm transition-all"
          >
            Close Traceability Panel
          </button>
        </div>
      </div>
    </div>
  );
}
