'use client';

import React, { useState } from 'react';
import { CandidateStandardMatch } from '@/types/procurement';
import {
  BookOpen,
  Shield,
  FlaskConical,
  Wrench,
  FileText,
  CheckCircle2,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface RelatedStandardsTableProps {
  relatedStandards: CandidateStandardMatch[];
}

export default function RelatedStandardsTable({ relatedStandards }: RelatedStandardsTableProps) {
  const [filterType, setFilterType] = useState<'all' | 'mandatory' | 'testing' | 'installation'>('all');

  const getCriticalityBadge = (matchReason: string, relType: string) => {
    const lower = matchReason.toLowerCase();

    if (lower.includes('mandatory safety') || relType === 'SAFETY_REQUIREMENT') {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700',
        icon: Shield,
        label: 'Mandatory Safety',
      };
    }
    if (lower.includes('mandatory subsystem') || relType === 'REQUIRES') {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        icon: Shield,
        label: 'Mandatory Subsystem',
      };
    }
    if (lower.includes('mandatory test') || relType === 'TESTED_BY') {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        icon: FlaskConical,
        label: 'Mandatory Test Method',
      };
    }
    if (relType === 'INSTALLATION') {
      return {
        bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
        icon: Wrench,
        label: 'Recommended Installation',
      };
    }

    return {
      bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      icon: BookOpen,
      label: 'Normative Reference',
    };
  };

  // Filter items
  const filteredStandards = relatedStandards.filter((item) => {
    if (filterType === 'all') return true;
    const reason = (item.matchReasons[0] || '').toLowerCase();
    const relType = item.normativeRelations[0]?.relationshipType || '';

    if (filterType === 'mandatory') {
      return (
        reason.includes('mandatory') ||
        relType === 'SAFETY_REQUIREMENT' ||
        relType === 'REQUIRES'
      );
    }
    if (filterType === 'testing') {
      return reason.includes('test') || relType === 'TESTED_BY';
    }
    if (filterType === 'installation') {
      return relType === 'INSTALLATION' || reason.includes('installation') || reason.includes('earthing');
    }
    return true;
  });

  const mandatoryCount = relatedStandards.filter(
    (i) =>
      (i.matchReasons[0] || '').toLowerCase().includes('mandatory') ||
      i.normativeRelations[0]?.relationshipType === 'SAFETY_REQUIREMENT' ||
      i.normativeRelations[0]?.relationshipType === 'REQUIRES'
  ).length;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md relative transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Normative & Allied Reference Standards Ecosystem
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear distinction between mandatory subsystem/safety requirements and recommended installation codes
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterType === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({relatedStandards.length})
          </button>
          <button
            onClick={() => setFilterType('mandatory')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterType === 'mandatory'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Mandatory Only ({mandatoryCount})
          </button>
          <button
            onClick={() => setFilterType('testing')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              filterType === 'testing'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Testing & Methods
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Criticality Level</th>
              <th className="py-3 px-3">Standard Number</th>
              <th className="py-3 px-3">Standard Title / Technical Scope</th>
              <th className="py-3 px-3">Mandatory Procurement Purpose</th>
              <th className="py-3 px-3">Official Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            {filteredStandards.map((item, idx) => {
              const standard = item.standard;
              const reason = item.matchReasons[0] || 'Normative reference cited in main standard';
              const relType = item.normativeRelations[0]?.relationshipType || 'REFERENCES';
              const badge = getCriticalityBadge(reason, relType);
              const BadgeIcon = badge.icon;

              return (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors">
                  {/* Criticality Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  </td>

                  {/* IS Number */}
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {standard.isNumber}
                  </td>

                  {/* Title & Scope */}
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{standard.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{standard.scope}</div>
                  </td>

                  {/* Purpose */}
                  <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-300 max-w-sm">
                    {reason.replace(/^[A-Za-z ]+:\s*/, '')}
                  </td>

                  {/* Official BIS Portal Link */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <a
                      href={standard.officialSourceUrl || `https://standards.bis.gov.in`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-xs font-semibold"
                    >
                      <span>BIS Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
