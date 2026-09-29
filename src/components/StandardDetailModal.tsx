'use client';

import React from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  History,
  AlertTriangle,
  Building2,
  FlaskConical,
  BookOpen,
  Layers,
  Sparkles,
} from 'lucide-react';
import { IndianStandard } from '@/types/standards';
import {
  OFFICIAL_PORTALS,
  resolveOfficialStandardUrl,
  SECURITY_TRUST_NOTICE,
  LIVE_VERIFICATION_REQUIRED_TEXT,
} from '@/lib/officialSources';

interface StandardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  standard: IndianStandard | null;
}

export default function StandardDetailModal({ isOpen, onClose, standard }: StandardDetailModalProps) {
  if (!isOpen || !standard) return null;

  const officialStdUrl = resolveOfficialStandardUrl(standard.isNumber, standard.officialSourceUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-gov border border-govborder shadow-gov-modal max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-govborder bg-ivory-50/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand px-2 py-0.5 rounded bg-brand-50 border border-brand-200">
                {standard.department}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  standard.status === 'Current'
                    ? 'bg-emerald-50 text-secgreen border border-emerald-200'
                    : 'bg-red-50 text-govdanger border border-red-200'
                }`}
              >
                {standard.status}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                OFFICIAL SOURCE
              </span>
              <span className="text-[10px] font-medium text-govmuted italic">
                {LIVE_VERIFICATION_REQUIRED_TEXT}
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-charcoal tracking-tight">{standard.isNumber}</h3>
            <p className="text-xs text-brand font-semibold mt-0.5">{standard.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-govmuted hover:text-charcoal hover:bg-ivory-200 transition-colors flex-shrink-0"
            aria-label="Close Standard Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Why It May Apply */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Why It May Apply</span>
            </h4>
            <div className="p-3.5 rounded-lg bg-brand-50/50 border border-brand-200 text-charcoal leading-relaxed font-normal">
              Directly applies to procurement tenders specifying <strong>{standard.productCategory}</strong>, establishing mandatory performance criteria, physical safety, and compliance with statutory Indian quality standards.
            </div>
          </div>

          {/* Official Scope */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">Official Standard Scope</h4>
            <div className="p-3.5 rounded-lg bg-ivory-50 border border-govborder text-charcoal leading-relaxed font-normal">
              {standard.scope}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-ivory-50 border border-govborder text-center">
              <span className="text-[10px] uppercase font-bold text-govmuted block">Product Domain</span>
              <span className="font-bold text-charcoal text-xs mt-0.5 block">{standard.domain}</span>
            </div>
            <div className="p-3 rounded-lg bg-ivory-50 border border-govborder text-center">
              <span className="text-[10px] uppercase font-bold text-govmuted block">NABL Test Labs</span>
              <span className="font-bold text-brand text-xs mt-0.5 block">
                {standard.testingLaboratoriesAvailable} Laboratories
              </span>
            </div>
            <div className="p-3 rounded-lg bg-ivory-50 border border-govborder text-center">
              <span className="text-[10px] uppercase font-bold text-govmuted block">Last Verified</span>
              <span className="font-bold text-charcoal text-xs mt-0.5 block">{standard.lastVerifiedDate || '2024-09'}</span>
            </div>
          </div>

          {/* Version Chain & Amendments */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-charcoal uppercase tracking-wider text-[11px]">
              <History className="w-4 h-4 text-brand" />
              <span>Revision & Amendments</span>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-govborder space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>
                  Current Edition: <strong>{standard.versionChain.currentYear}</strong>
                </span>
                {standard.versionChain.supersededStandard && (
                  <span className="text-govdanger font-semibold">
                    Superseded: {standard.versionChain.supersededStandard}
                  </span>
                )}
              </div>

              {standard.versionChain.revisionNotes && (
                <p className="text-govmuted text-[11px] leading-relaxed italic">
                  &ldquo;{standard.versionChain.revisionNotes}&rdquo;
                </p>
              )}

              {standard.versionChain.amendments.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-govborder">
                  <div className="font-semibold text-charcoal text-[11px]">Active Gazette Amendments:</div>
                  {standard.versionChain.amendments.map((amd) => (
                    <div
                      key={amd.number}
                      className="p-2 rounded bg-ivory-50 text-[11px] flex items-start gap-2 text-charcoal"
                    >
                      <span className="font-bold text-brand flex-shrink-0">Amd {amd.number} ({amd.year}):</span>
                      <span className="text-govmuted leading-normal">{amd.summary}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Regulatory & Certification (QCO) Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-charcoal uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>Certification & Quality Control Order (QCO)</span>
            </div>

            <div className="p-3.5 rounded-lg bg-ivory-50 border border-govborder space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-charcoal">{standard.qco.orderName}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    standard.qco.isCompulsory
                      ? 'bg-amber-100 text-accent'
                      : 'bg-gray-100 text-govmuted'
                  }`}
                >
                  {standard.qco.isCompulsory ? 'Compulsory Scheme' : 'Voluntary Scheme'}
                </span>
              </div>
              <div className="text-govmuted text-[11px]">
                <strong>Notification:</strong> {standard.qco.gazetteNotification} | <strong>Ministry:</strong>{' '}
                {standard.qco.ministry}
              </div>
              <div className="text-govmuted text-[11px] leading-relaxed">
                {standard.qco.description}
              </div>
              {standard.qco.penaltiesClause && (
                <div className="text-[11px] text-govdanger font-medium pt-1">
                  <strong>Penal Clause:</strong> {standard.qco.penaltiesClause}
                </div>
              )}
              <div className="pt-2 border-t border-govborder flex items-center justify-between text-[11px]">
                <a
                  href={OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>BIS Compulsory Certification / QCO Information</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-govmuted italic">{LIVE_VERIFICATION_REQUIRED_TEXT}</span>
              </div>
            </div>
          </div>

          {/* Related Standards & Normative References */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-charcoal uppercase tracking-wider text-[11px]">
              <Layers className="w-4 h-4 text-brand" />
              <span>Related Standards &amp; Normative References</span>
            </div>
            <div className="p-3.5 rounded-lg bg-white border border-govborder space-y-2">
              {standard.relationships && standard.relationships.length > 0 ? (
                <div className="space-y-1.5">
                  {standard.relationships.map((rel, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-ivory-50 text-[11px] gap-2">
                      <div>
                        <span className="font-bold text-brand">{rel.targetStandardNumber}</span>
                        <span className="text-charcoal ml-1.5">{rel.targetTitle}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-brand px-1.5 py-0.5 bg-white rounded border border-govborder flex-shrink-0">
                        {rel.criticality}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5 text-[11px] text-govmuted">
                  <div className="p-1.5 rounded bg-ivory-50 flex items-center justify-between">
                    <span className="font-bold text-brand">Associated Test Method</span>
                    <span>Laboratory evaluation and conformance verification</span>
                  </div>
                  <div className="p-1.5 rounded bg-ivory-50 flex items-center justify-between">
                    <span className="font-bold text-brand">Auxiliary Safety Standard</span>
                    <span>Electrical insulation and user protection benchmarks</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Requirements & Benchmarks */}
          {standard.technicalRequirements && standard.technicalRequirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
                Core Technical Benchmarks &amp; References
              </h4>
              <div className="divide-y divide-govborder border border-govborder rounded-lg overflow-hidden bg-white">
                {standard.technicalRequirements.map((req, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between gap-4">
                    <span className="font-medium text-charcoal">{req.parameter}</span>
                    <span className="font-semibold text-brand text-right">{req.benchmark}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtle Security / Trust Notice */}
          <div className="p-2.5 rounded bg-ivory-100 text-[10px] text-govmuted leading-relaxed text-center">
            {SECURITY_TRUST_NOTICE}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-govborder bg-ivory-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={officialStdUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-secgreen border border-emerald-300 text-xs font-bold shadow-gov-sm transition-all"
          >
            <span>BIS Standards Portal — Verify Standard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-charcoal hover:bg-charcoal-800 text-white text-xs font-semibold shadow-gov-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
