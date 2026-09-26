'use client';

import React from 'react';
import { SpecificationGap } from '@/types/procurement';
import {
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Check,
  ShieldAlert,
  Info,
  Sparkles,
} from 'lucide-react';

interface SpecificationGapsCardProps {
  gaps: SpecificationGap[];
  onToggleResolveGap: (gapId: string) => void;
}

export default function SpecificationGapsCard({
  gaps,
  onToggleResolveGap,
}: SpecificationGapsCardProps) {
  const resolvedCount = gaps.filter((g) => g.isResolved).length;
  const unresolvedCount = gaps.length - resolvedCount;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-amber-500/30 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Specification Gap Analysis (Missing Tender Requirements)
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {unresolvedCount} Action Item{unresolvedCount === 1 ? '' : 's'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Crucial technical and testing parameters absent from tender text that could compromise quality or cause legal disputes
            </p>
          </div>
        </div>

        {/* Resolution Progress */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Gaps Rectified:</span>
          <span className="font-bold text-emerald-400">
            {resolvedCount} / {gaps.length}
          </span>
        </div>
      </div>

      {/* List of Missing Specification Items */}
      {gaps.length === 0 ? (
        <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-emerald-300 mb-1">
            Excellent Tender Specification!
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All mandatory technical benchmarks, protection levels, and testing regimes from the
            standard are adequately addressed in your requirements.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {gaps.map((gap) => {
            const isResolved = gap.isResolved;

            return (
              <div
                key={gap.id}
                className={`p-4 rounded-xl border transition ${
                  isResolved
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : gap.severity === 'High'
                    ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                    : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Parameter Name & Severity */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          gap.severity === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : gap.severity === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {gap.severity} Risk
                      </span>

                      <h4
                        className={`text-sm font-bold ${
                          isResolved ? 'text-emerald-300 line-through' : 'text-slate-100'
                        }`}
                      >
                        ⚠ Missing: {gap.parameter}
                      </h4>

                      <span className="text-[11px] text-slate-500">
                        (Ref: {gap.standardReference})
                      </span>
                    </div>

                    {/* Why Important / Consequence */}
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-amber-400">Why Important: </strong>
                      {gap.whyImportant}
                    </p>

                    {/* Suggested Specification Clause */}
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 font-mono">
                      <span className="text-blue-400 font-sans font-semibold block text-[11px] mb-1">
                        Recommended Tender Clause to Insert:
                      </span>
                      &ldquo;{gap.suggestedClause}&rdquo;
                    </div>
                  </div>

                  {/* Resolution Action Button */}
                  <button
                    type="button"
                    onClick={() => onToggleResolveGap(gap.id)}
                    className={`flex-shrink-0 self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                      isResolved
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    }`}
                  >
                    {isResolved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Clause Included</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Add to Tender Clause</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
