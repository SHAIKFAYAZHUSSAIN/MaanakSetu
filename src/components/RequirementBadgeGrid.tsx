'use client';

import React from 'react';
import { ExtractedRequirement } from '@/types/procurement';
import {
  Tag,
  Zap,
  ShieldCheck,
  Clock,
  Compass,
  Layers,
  Cpu,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface RequirementBadgeGridProps {
  requirement: ExtractedRequirement;
}

export default function RequirementBadgeGrid({ requirement }: RequirementBadgeGridProps) {
  const params = [
    { label: 'Identified Product', value: requirement.product, icon: Tag, highlight: true },
    { label: 'Application Context', value: requirement.application, icon: Compass },
    { label: 'Domain & Sector', value: requirement.domain, icon: Layers },
    { label: 'Rated Power / Output', value: requirement.power || requirement.capacity, icon: Zap },
    { label: 'Operating Voltage', value: requirement.voltage, icon: Cpu },
    { label: 'Ingress Protection', value: requirement.protectionRating, icon: ShieldCheck },
    { label: 'Target Lifetime', value: requirement.lifetime, icon: Clock },
  ].filter((p) => p.value);

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
      <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            AI Requirement Extraction & Parameter Parsing
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Detected Language:</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700">
            {requirement.detectedLanguage}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {params.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-colors ${
                item.highlight
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/30'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{item.label}</span>
              </div>
              <div
                className={`text-xs sm:text-sm font-semibold truncate ${
                  item.highlight ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100'
                }`}
                title={item.value}
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {requirement.safetyFeatures && requirement.safetyFeatures.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 dark:text-slate-400">Explicit Safety Features:</span>
          {requirement.safetyFeatures.map((feat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40"
            >
              <CheckCircle2 className="w-3 h-3" />
              {feat}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
