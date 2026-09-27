'use client';

import React from 'react';
import { HelpCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { ClarifyingQuestion } from '@/types/procurement';

interface ClarifyingQuestionsCardProps {
  questions: ClarifyingQuestion[];
  onSelectOption: (questionId: string, optionValue: string, targetStandard?: string) => void;
}

export default function ClarifyingQuestionsCard({
  questions,
  onSelectOption,
}: ClarifyingQuestionsCardProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-blue-300 dark:border-blue-700/80 bg-blue-50/40 dark:bg-blue-950/20 shadow-md relative overflow-hidden transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-blue-200 dark:border-blue-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 flex items-center gap-1 w-max">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Proactive Technical Clarification
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
              Refine Tender Specification to Pinpoint Exact Indian Standard
            </h3>
          </div>
        </div>

        <span className="text-xs text-blue-800 dark:text-blue-300 font-medium">
          {questions.length} Specification Query Detected
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-blue-200 dark:border-blue-800/60"
          >
            <div className="mb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {q.question}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{q.whyNeeded}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSelectOption(q.id, opt.value, opt.targetStandardNumber)}
                  className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-between">
                      <span>{opt.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform text-blue-600 dark:text-blue-400" />
                    </div>
                    {opt.description && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {opt.description}
                      </p>
                    )}
                  </div>

                  {opt.targetStandardNumber && (
                    <span className="text-[10px] font-mono font-semibold text-blue-700 dark:text-blue-300 mt-2 block">
                      Target: {opt.targetStandardNumber}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
