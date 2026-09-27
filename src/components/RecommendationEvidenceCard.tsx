'use client';

import React from 'react';
import {
  FileCheck2,
  ExternalLink,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { RecommendationEvidence } from '@/types/procurement';

interface RecommendationEvidenceCardProps {
  evidence: RecommendationEvidence;
  standardNumber: string;
}

export default function RecommendationEvidenceCard({
  evidence,
  standardNumber,
}: RecommendationEvidenceCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md relative overflow-hidden transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Recommendation context
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Why this standard fits
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            <span>Record date: <strong>{evidence.lastVerifiedDate}</strong></span>
          </div>

          <a
            href={evidence.officialSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 font-semibold flex items-center gap-1.5 transition"
          >
            <span>Official BIS Record</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Why Standard Applies */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Why it applies</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {evidence.whyApplies}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Primary Standard: <strong>{standardNumber}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Source-linked record</span>
          </div>
        </div>

        {/* Statutory Scope Extract */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Standard scope</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
              &ldquo;{evidence.scopeExtract}&rdquo;
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
            Source: Bureau of Indian Standards Official Gazette & Technical Catalogues
          </div>
        </div>
      </div>

      {/* Uncertainty & Technical Review Flags */}
      {evidence.uncertaintyFlags && evidence.uncertaintyFlags.length > 0 ? (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold mb-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Items to review</span>
          </div>
          <ul className="space-y-1 list-disc list-inside text-amber-800 dark:text-amber-300">
            {evidence.uncertaintyFlags.map((flag, idx) => (
              <li key={idx} className="leading-snug">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Scope review:</strong> No additional scope questions identified. Check the missing requirements below before preparing your draft.
          </span>
        </div>
      )}
    </div>
  );
}
