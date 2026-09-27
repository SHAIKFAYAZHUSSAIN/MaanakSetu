'use client';

import React from 'react';
import { AlertOctagon, ArrowRight, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';
import { OutdatedStandardAlert } from '@/types/procurement';

interface OutdatedStandardAlertCardProps {
  alert: OutdatedStandardAlert;
  onApplyUpdate: (replacementStandard: string) => void;
}

export default function OutdatedStandardAlertCard({
  alert,
  onApplyUpdate,
}: OutdatedStandardAlertCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border-2 border-rose-500/80 bg-rose-50/70 dark:bg-rose-950/30 shadow-lg relative overflow-hidden transition-all animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-rose-200 dark:border-rose-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-700">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
              Audit & Legal Non-Compliance Warning
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Outdated or Withdrawn Standard Detected in Tender
            </h3>
          </div>
        </div>

        <button
          onClick={() => onApplyUpdate(alert.currentReplacement)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-2 transition-all transform active:scale-95"
        >
          <Zap className="w-4 h-4" />
          <span>1-Click Update to {alert.currentReplacement.split(' ')[1] || 'Current Standard'}</span>
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Outdated Side */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-rose-200 dark:border-rose-800/60">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs mb-1 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Legacy / Withdrawn Standard Cited:</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white line-through decoration-rose-500 decoration-2">
            {alert.citedStandard}
          </p>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-2">
            Status: <strong>Withdrawn by Bureau of Indian Standards</strong>. Citing this in modern tenders invites vendor disputes, disqualification of compliant bidders, and CVC audit objections.
          </p>
        </div>

        {/* Current Verified Replacement */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-300 dark:border-emerald-700/60 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-1 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Mandatory Replacement:</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">
              {alert.currentReplacement}
            </p>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
            {alert.replacementTitle}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Mandatory in force: {alert.effectiveSince}
          </p>
        </div>
      </div>

      {/* Officer Directive */}
      <div className="p-3.5 rounded-xl bg-rose-100/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
        <ArrowRight className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Required Procurement Action: </span>
          {alert.actionRequired}
        </div>
      </div>
    </div>
  );
}
