'use client';

import React from 'react';
import { IndianStandard } from '@/types/standards';
import {
  Award,
  CheckCircle,
  FileCheck,
  GitBranch,
  History,
  AlertCircle,
  FlaskConical,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface PrimaryStandardCardProps {
  standard: IndianStandard;
  onOpenClauseBuilder: () => void;
}

export default function PrimaryStandardCard({
  standard,
  onOpenClauseBuilder,
}: PrimaryStandardCardProps) {
  const { versionChain } = standard;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-700/80 shadow-xl relative overflow-hidden">
      {/* Top Banner & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Primary Applicable Standard
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {standard.department}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">BIS Testing Labs:</span>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-950/60 text-blue-300 border border-blue-800/50 flex items-center gap-1">
            <FlaskConical className="w-3 h-3 text-blue-400" />
            {standard.testingLaboratoriesAvailable} NABL/BIS Labs
          </span>
        </div>
      </div>

      {/* Main Standard Title & Identifier */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {standard.isNumber}
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 self-start">
            Status: {standard.status}
          </span>
        </div>
        <p className="text-base sm:text-lg text-slate-200 font-medium leading-snug">
          {standard.title}
        </p>
      </div>

      {/* Scope Description */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
        <span className="font-semibold text-slate-200">Statutory Scope: </span>
        {standard.scope}
      </div>

      {/* Version and Amendment Detection Section (Requirement 8) */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Version Evolution & Amendment Verification
            </h4>
          </div>
          <span className="text-[11px] text-amber-400 font-medium">
            {versionChain.amendments.length} Active Amendment(s)
          </span>
        </div>

        {/* Version Chain Flow */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs mb-3">
          {versionChain.supersededStandard && (
            <>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 line-through">
                {versionChain.supersededStandard} (Superseded)
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </>
          )}

          <div className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-200 font-bold flex items-center gap-1.5 shadow-sm">
            <FileCheck className="w-3.5 h-3.5 text-blue-400" />
            Current: {versionChain.currentStandard}
          </div>

          {versionChain.amendments.map((amd) => (
            <div
              key={amd.number}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950/50 border border-amber-600/40 text-amber-300 font-medium flex items-center gap-1 text-[11px]"
              title={amd.summary}
            >
              <span>+ Amd {amd.number}:{amd.year}</span>
            </div>
          ))}
        </div>

        {/* Detailed Amendments List */}
        {versionChain.amendments.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {versionChain.amendments.map((amd) => (
              <div key={amd.number} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="font-semibold text-amber-400 flex-shrink-0">
                  Amd {amd.number} ({amd.year}):
                </span>
                <span className="text-slate-400">{amd.summary}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Callout for Officer */}
        <div className="mt-3 p-2.5 rounded-lg bg-blue-900/20 border border-blue-700/30 text-xs text-blue-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>
            <strong>Procurement Action:</strong> Specifically cite{' '}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">{standard.isNumber}</code>{' '}
            including Amendment {versionChain.amendments.map((a) => a.number).join(', ')} in the tender STR.
            Do not allow bidders to quote obsolete editions.
          </span>
        </div>
      </div>

      {/* Testing & Inspection Scheme */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
        <div>
          <span className="font-medium text-slate-300">Scheme of Testing & Inspection (STI): </span>
          <span>{standard.schemesOfTesting}</span>
        </div>
        <button
          onClick={onOpenClauseBuilder}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
        >
          View Full Procurement Clause
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
