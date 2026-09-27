'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, RefreshCw, HelpCircle, ExternalLink } from 'lucide-react';
import { ClarifyingQuestion } from '@/types/procurement';

interface NoReliableMatchCardProps {
  productName: string;
  rawQuery: string;
  explanation?: string;
  clarifyingQuestions?: ClarifyingQuestion[];
  onSelectOption?: (optionValue: string, standardNumber?: string) => void;
  onResetSearch: () => void;
}

export default function NoReliableMatchCard({
  productName,
  rawQuery,
  explanation,
  clarifyingQuestions,
  onSelectOption,
  onResetSearch,
}: NoReliableMatchCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-amber-300 dark:border-amber-700/80 bg-amber-50/50 dark:bg-amber-950/20 shadow-lg relative overflow-hidden transition-all">
      {/* Decorative gradient blur */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-amber-200 dark:border-amber-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
              Procurement Guardrail Active
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              No Reliable Indian Standard Match Identified
            </h2>
          </div>
        </div>

        <button
          onClick={onResetSearch}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refine Search</span>
        </button>
      </div>

      {/* Core Explanation */}
      <div className="space-y-3 mb-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800/60">
          <p className="font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            Zero-Default Integrity Guardrail:
          </p>
          <p>
            {explanation ||
              `The procurement requirement for "${productName}" does not correspond to any active mandatory Indian Standard in the BIS database. In compliance with strict public procurement integrity guidelines, MaanakSetu refuses to default unknown or non-standard goods to unrelated specifications (e.g. lighting standards).`}
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          <strong>Analyzed Query Snippet: </strong>
          <span className="italic">&ldquo;{rawQuery}&rdquo;</span>
        </div>
      </div>

      {/* Clarifying Questions if Ambiguous */}
      {clarifyingQuestions && clarifyingQuestions.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2 text-blue-900 dark:text-blue-200 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Missing Technical Details — Select a Standardized Specification:</span>
          </div>
          {clarifyingQuestions.map((cq) => (
            <div key={cq.id} className="space-y-2 mt-2">
              <p className="text-xs text-blue-800 dark:text-blue-300">{cq.question}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {cq.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onSelectOption && onSelectOption(opt.value, opt.targetStandardNumber)}
                    className="p-3 text-left rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800/80 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-sm transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    {opt.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {opt.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Procurement Actions */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
          Recommended Procurement Officer Next Steps:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">1. Check GeM Services</span>
            <p className="text-slate-600 dark:text-slate-400">
              For catering, hospitality, housekeeping, or manpower, procure under GeM Service Categories instead of product standards.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">2. Refine Nomenclature</span>
            <p className="text-slate-600 dark:text-slate-400">
              Use standard engineering terms (e.g. &ldquo;TMT Rebar Fe 500D&rdquo;, &ldquo;Monobloc Clear Water Pump&rdquo;, &ldquo;HDPE Pipe PE100&rdquo;).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">3. Consult BIS Directorate</span>
            <p className="text-slate-600 dark:text-slate-400 mb-2">
              For unstandardized items, request an advisory from the concerned BIS Sectional Committee (ETD, MED, CED).
            </p>
            <a
              href="https://www.bis.gov.in/know-your-standard/?lang=en"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>BIS Know Your Standard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
