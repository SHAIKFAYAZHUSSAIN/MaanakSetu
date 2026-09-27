'use client';

import React, { useState } from 'react';
import { SupportedLanguage, translations } from '@/types/language';
import {
  Layers,
  FileCheck,
  ShieldAlert,
  Network,
  AlertTriangle,
  FileText,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  X,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ListFilter,
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
  isOpen?: boolean;
  onToggleOpen?: () => void;
  confidenceLevel?: string;
  matchConfidence?: number;
  standardNumber?: string;
}

export default function SectionNavigator({
  activeTab,
  onTabChange,
  gapsCount,
  alliedCount,
  isQCOCompulsory,
  currentLanguage = 'en',
  isOpen = true,
  onToggleOpen,
  confidenceLevel,
  matchConfidence,
  standardNumber,
}: SectionNavigatorProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
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
      num: 'ALL',
      label: t.tabOverview,
      icon: LayoutGrid,
      desc: 'Full Procurement Dossier',
      badge: undefined,
      badgeColor: undefined,
      dotColor: 'bg-blue-500',
    },
    {
      id: 'requirements' as SectionTabId,
      num: '01',
      label: t.tabRequirements,
      icon: Layers,
      desc: 'AI Extracted Specs',
      badge: undefined,
      badgeColor: undefined,
      dotColor: 'bg-indigo-500',
    },
    {
      id: 'primary-standard' as SectionTabId,
      num: '02',
      label: t.tabStandard,
      icon: FileCheck,
      desc: 'IS & Version History',
      badge: standardNumber ? standardNumber.split(' ')[0] : undefined,
      badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
      dotColor: 'bg-emerald-500',
    },
    {
      id: 'regulatory-qco' as SectionTabId,
      num: '03',
      label: t.tabCertification,
      icon: ShieldAlert,
      desc: 'Statutory Certification',
      badge: qcoBadgeText,
      badgeColor: isQCOCompulsory
        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold'
        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      dotColor: isQCOCompulsory ? 'bg-rose-500' : 'bg-emerald-500',
    },
    {
      id: 'knowledge-graph' as SectionTabId,
      num: '04',
      label: t.tabRelated,
      icon: Network,
      desc: 'Normative Ecosystem',
      badge: `${alliedCount}`,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      dotColor: 'bg-blue-500',
    },
    {
      id: 'gap-analysis' as SectionTabId,
      num: '05',
      label: t.tabGaps,
      icon: AlertTriangle,
      desc: 'Missing Benchmarks',
      badge: `${gapsCount}`,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      dotColor: 'bg-amber-500',
    },
    {
      id: 'tender-clause' as SectionTabId,
      num: '06',
      label: t.tabClauses,
      icon: FileText,
      desc: 'GeM Contract Clause',
      badge: undefined,
      badgeColor: undefined,
      dotColor: 'bg-purple-500',
    },
  ];

  const handleSelectSection = (id: SectionTabId) => {
    onTabChange(id);
    setIsMobileDrawerOpen(false);
  };

  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <>
      {/* ============================================================== */}
      {/* 1. MOBILE / TABLET VIEW (< lg): Trigger bar & Slide-over Drawer */}
      {/* ============================================================== */}
      <div className="lg:hidden w-full mb-4">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm">
              <LayoutDashboard className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t.dashboardSections}
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                {activeSection.label}
                <span className="text-slate-400">• {activeSection.num}</span>
              </span>
            </div>
          </button>

          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{t.openDashboard}</span>
          </button>
        </div>

        {/* Mobile Slide-over Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setIsMobileDrawerOpen(false)}
            />

            {/* Drawer Container */}
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col z-50 border-r border-slate-200 dark:border-slate-800 animate-slide-up">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-sm">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {t.dashboardSections}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      MaanakSetu Dossier Index
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Section List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeTab === sec.id;

                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleSelectSection(sec.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold opacity-60">
                              {sec.num}
                            </span>
                            <span className="text-xs font-bold truncate">
                              {sec.label}
                            </span>
                          </div>
                          <div
                            className={`text-[11px] truncate ${
                              isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {sec.desc}
                          </div>
                        </div>
                      </div>

                      {sec.badge && (
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

              {/* Drawer Footer */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <button
                  onClick={() => handleSelectSection('all')}
                  className="w-full py-2 px-3 text-xs font-semibold text-center rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                >
                  {t.tabOverview} (View All)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP VIEW (lg:block): Left-side Dashboard Navigation      */}
      {/* ============================================================== */}
      <aside className="hidden lg:block shrink-0 transition-all duration-300">
        {isOpen ? (
          /* -------------------------------------------------------- */
          /* OPEN / EXPANDED STATE (w-64 xl:w-72)                    */
          /* -------------------------------------------------------- */
          <div className="w-64 xl:w-72 sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30 p-3.5 space-y-3 z-30">
            {/* Header: Title & Close Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{t.dashboardSections}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      {sections.length}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Procurement Dossier Index
                  </p>
                </div>
              </div>

              {onToggleOpen && (
                <button
                  onClick={onToggleOpen}
                  title={t.closeDashboard}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer group"
                >
                  <PanelLeftClose className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                </button>
              )}
            </div>

            {/* Quick Overview Reset / Filter Indication */}
            {activeTab !== 'all' ? (
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 text-xs">
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 truncate">
                  Filtered: {activeSection.num}
                </span>
                <button
                  onClick={() => onTabChange('all')}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Show All
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">All sections active in document view</span>
              </div>
            )}

            {/* Vertical Sections List */}
            <nav className="flex-1 overflow-y-auto space-y-1 pr-0.5 scrollbar-thin">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;

                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200/80 dark:hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-bold ${
                              isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {sec.num}
                          </span>
                          <span className="text-xs font-bold truncate">
                            {sec.label}
                          </span>
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-blue-100/90' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {sec.desc}
                        </div>
                      </div>
                    </div>

                    {sec.badge && (
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : sec.badgeColor
                        }`}
                      >
                        {sec.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Card: Confidence & Quick Action */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              {matchConfidence !== undefined && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Match Confidence</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{matchConfidence}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${matchConfidence}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  onTabChange('all');
                  document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-1.5 px-2 text-[11px] font-semibold text-center rounded-xl text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-1"
              >
                <span>↑ Scroll to Top of Dossier</span>
              </button>
            </div>
          </div>
        ) : (
          /* -------------------------------------------------------- */
          /* COLLAPSED / CLOSED STATE (w-14)                         */
          /* -------------------------------------------------------- */
          <div className="w-14 sticky top-20 max-h-[calc(100vh-6rem)] flex flex-col items-center rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md p-2 space-y-2 z-30 transition-all duration-300">
            {/* Expand / Open Toggle Button */}
            {onToggleOpen && (
              <button
                onClick={onToggleOpen}
                title={t.openDashboard}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 transition-transform duration-200 hover:scale-105 cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            )}

            <div className="w-7 h-px bg-slate-200 dark:bg-slate-800 my-1" />

            {/* Compact Vertical Icons Rail */}
            <div className="flex-1 space-y-1.5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;

                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    title={`${sec.num}. ${sec.label} - ${sec.desc}`}
                    className={`relative p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                        : 'text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />

                    {/* Indicator Dot */}
                    {sec.badge && (
                      <span
                        className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${sec.dotColor} ring-2 ring-white dark:ring-slate-900`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="w-7 h-px bg-slate-200 dark:bg-slate-800 my-1" />

            {/* Bottom Mini Expand Indicator */}
            {onToggleOpen && (
              <button
                onClick={onToggleOpen}
                title={t.openDashboard}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
