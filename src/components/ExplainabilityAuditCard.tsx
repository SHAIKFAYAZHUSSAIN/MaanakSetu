'use client';

import React from 'react';
import { RecommendationResult } from '@/types/procurement';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  GitCommit,
} from 'lucide-react';

interface ExplainabilityAuditCardProps {
  result: RecommendationResult;
}

export default function ExplainabilityAuditCard({ result }: ExplainabilityAuditCardProps) {
  const { explanation } = result;

  const auditSteps = [
    {
      title: '1. Product & Intent Classification',
      desc: explanation.productMatchSummary,
      icon: Layers,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: '2. Grounded Regulatory Mandate (QCO)',
      desc: explanation.regulatorySummary,
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: '3. Normative Traceability & Safety Links',
      desc: explanation.rationale,
      icon: Cpu,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: '4. Version & Supersession Control',
      desc: explanation.versionAction,
      icon: GitCommit,
      color: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md relative transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Why this recommendation?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic regulatory facts separated from generative reasoning for statutory auditability
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          CVC & CAG Auditable
        </span>
      </div>

      {/* Audit Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
        {auditSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${step.color}`} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
}
