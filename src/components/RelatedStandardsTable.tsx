'use client';

import React from 'react';
import { CandidateStandardMatch } from '@/types/procurement';
import { RelationshipType } from '@/types/standards';
import { BookOpen, Shield, FlaskConical, Wrench, FileText, CheckCircle2 } from 'lucide-react';

interface RelatedStandardsTableProps {
  relatedStandards: CandidateStandardMatch[];
}

export default function RelatedStandardsTable({ relatedStandards }: RelatedStandardsTableProps) {
  const getBadgeStyle = (relType: string) => {
    switch (relType) {
      case 'SAFETY_REQUIREMENT':
      case 'REQUIRES':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: Shield,
          label: 'Safety Standard',
        };
      case 'TESTED_BY':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: FlaskConical,
          label: 'Test Method',
        };
      case 'INSTALLATION':
        return {
          bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          icon: Wrench,
          label: 'Installation & Earthing',
        };
      case 'TERMINOLOGY':
        return {
          bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
          icon: FileText,
          label: 'Terminology & Definitions',
        };
      default:
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: BookOpen,
          label: 'Normative Reference',
        };
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-700/80 shadow-2xl relative">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              Normative & Allied Reference Standards Ecosystem
            </h3>
            <p className="text-xs text-slate-400">
              Mandatory subsystem, safety, and testing standards that tender specifications must cite
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          {relatedStandards.length} Allied Standards
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Relationship Type</th>
              <th className="py-3 px-3">Standard Number</th>
              <th className="py-3 px-3">Standard Title / Scope</th>
              <th className="py-3 px-3">Procurement Purpose</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {relatedStandards.map((item, idx) => {
              const standard = item.standard;
              const reason = item.matchReasons[0] || 'Normative reference cited in main standard';
              const relType = item.normativeRelations[0]?.relationshipType || 'REFERENCES';
              const badge = getBadgeStyle(relType);
              const BadgeIcon = badge.icon;

              return (
                <tr key={idx} className="hover:bg-slate-900/60 transition">
                  {/* Badge */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                  </td>

                  {/* IS Number */}
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                    {standard.isNumber}
                  </td>

                  {/* Title & Scope */}
                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-medium text-slate-200">{standard.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{standard.scope}</div>
                  </td>

                  {/* Purpose */}
                  <td className="py-3 px-3 text-xs text-slate-300 max-w-sm">
                    {reason.replace(/^Linked via [A-Z_]+:\s*/, '')}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Current
                    </span>
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
