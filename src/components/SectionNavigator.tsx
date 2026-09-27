'use client';

import React from 'react';
import { SupportedLanguage, translations } from '@/types/language';
import {
  Layers,
  FileCheck,
  ShieldAlert,
  Network,
  AlertTriangle,
  FileText,
  LayoutGrid,
} from 'lucide-react';

export type SectionTabId =
  | 'all'
  | 'requirements'
  | 'primary-standard'
  | 'regulatory-qco'
  | 'knowledge-graph'
  | 'gap-analysis'
  | 'tender-clause';

interface SectionNavigatorProps {
  activeTab: SectionTabId;
  onTabChange: (tab: SectionTabId) => void;
  gapsCount: number;
  alliedCount: number;
  isQCOCompulsory: boolean;
  currentLanguage?: SupportedLanguage;
}

export default function SectionNavigator({
  activeTab,
  onTabChange,
  gapsCount,
  alliedCount,
  isQCOCompulsory,
  currentLanguage = 'en',
}: SectionNavigatorProps) {
  const t = translations[currentLanguage] || translations.en;

  const qcoBadgeText = isQCOCompulsory
    ? currentLanguage === 'hi'
      ? 'अनिवार्य'
      : currentLanguage === 'te'
      ? 'తప్పనిసరి'
      : currentLanguage === 'ta'
      ? 'கட்டாயம்'
      : 'Required'
    : currentLanguage === 'hi'
    ? 'स्वैच्छिक'
    : currentLanguage === 'te'
    ? 'స్వచ్ఛంద'
    : currentLanguage === 'ta'
    ? 'விருப்பம்'
    : 'Voluntary';

  const sections = [
    {
      id: 'all' as SectionTabId,
      label: t.tabOverview,
      icon: LayoutGrid,
      desc: 'Full Procurement Dossier',
    },
    {
      id: 'requirements' as SectionTabId,
      label: t.tabRequirements,
      icon: Layers,
      desc: 'AI Extracted Specs',
    },
    {
      id: 'primary-standard' as SectionTabId,
      label: t.tabStandard,
      icon: FileCheck,
      desc: 'IS & Version History',
    },
    {
      id: 'regulatory-qco' as SectionTabId,
      label: t.tabCertification,
      icon: ShieldAlert,
      desc: 'Statutory Certification',
      badge: qcoBadgeText,
      badgeColor: isQCOCompulsory
        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'knowledge-graph' as SectionTabId,
      label: t.tabRelated,
      icon: Network,
      desc: 'Normative Ecosystem',
      badge: `${alliedCount}`,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    },
    {
      id: 'gap-analysis' as SectionTabId,
      label: t.tabGaps,
      icon: AlertTriangle,
      desc: 'Missing Benchmarks',
      badge: `${gapsCount}`,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
    },
    {
      id: 'tender-clause' as SectionTabId,
      label: t.tabClauses,
      icon: FileText,
      desc: 'GeM Contract Clause',
    },
  ];

  return (
    <div className="sticky top-16 z-40 w-full py-2.5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:justify-start">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeTab === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => onTabChange(sec.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                    : 'bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-500 dark:text-blue-400'}`} />
                <span>{sec.label}</span>
                {sec.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : sec.badgeColor
                    }`}
                  >
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
