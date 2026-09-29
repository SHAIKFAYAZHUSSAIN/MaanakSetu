'use client';

import React from 'react';
import {
  History,
  ArrowRight,
  ShieldCheck,
  Clock,
  Calendar,
  Layers,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ALL_PROCUREMENT_SCENARIOS, ProcurementScenario } from '@/data/procurementScenarios';
import { SavedTenderProject, RecommendationResult } from '@/types/procurement';

interface AnalysisHistoryViewProps {
  savedProjects: SavedTenderProject[];
  onSelectScenario: (scenario: ProcurementScenario) => void;
  onRestoreSavedProject?: (project: SavedTenderProject) => void;
}

export default function AnalysisHistoryView({
  savedProjects,
  onSelectScenario,
  onRestoreSavedProject,
}: AnalysisHistoryViewProps) {
  // Demo analysis datasets with dates, products, standards, and statuses
  const demoAnalyses = [
    {
      id: 'demo-led',
      scenarioId: 'led-street-lighting',
      product: 'LED Street Lighting Procurement',
      date: 'Today, 14:30 IST',
      standardsIdentified: 'IS 10322 (Part 5/Sec 3): 2012 + 6 Normative Standards',
      status: 'Verified Current • Compulsory QCO (CRS Scheme-II)',
      statusType: 'verified',
      scenario: ALL_PROCUREMENT_SCENARIOS.find((s) => s.id === 'led-street-lighting')!,
    },
    {
      id: 'demo-cement',
      scenarioId: 'cement-procurement',
      product: 'Cement Procurement (OPC & PPC)',
      date: 'Yesterday, 11:15 IST',
      standardsIdentified: 'IS 269: 2015 / IS 1489: 2015 + 4 Testing Codes',
      status: 'Verified Current • Mandatory ISI Mark (Scheme-I)',
      statusType: 'verified',
      scenario: ALL_PROCUREMENT_SCENARIOS.find((s) => s.id === 'cement-procurement')!,
    },
    {
      id: 'demo-cables',
      scenarioId: 'electrical-cables',
      product: 'Electrical Cables (XLPE Insulated Power Cables)',
      date: '24 Sep 2026, 16:45 IST',
      standardsIdentified: 'IS 7098 (Part 1): 1988 + 5 Test & Safety Standards',
      status: 'Verified Current • Compulsory Quality Control Order',
      statusType: 'verified',
      scenario: ALL_PROCUREMENT_SCENARIOS.find((s) => s.id === 'electrical-cables')!,
    },
    {
      id: 'demo-helmets',
      scenarioId: 'safety-helmets',
      product: 'Safety Helmets (Industrial Head Protection)',
      date: '22 Sep 2026, 09:20 IST',
      standardsIdentified: 'IS 2925: 1984 + 3 Protective Equipment Standards',
      status: 'Verified Current • Mandatory BIS QCO Enforcement',
      statusType: 'verified',
      scenario: ALL_PROCUREMENT_SCENARIOS.find((s) => s.id === 'safety-helmets')!,
    },
    {
      id: 'demo-pumps',
      scenarioId: 'water-pumps',
      product: 'Water Pumps (Monoset & Submersible Sets)',
      date: '19 Sep 2026, 15:05 IST',
      standardsIdentified: 'IS 9079: 2018 + 4 Energy & Earthing Standards',
      status: 'Verified Current • BEE Star Label & BIS Certified',
      statusType: 'verified',
      scenario: ALL_PROCUREMENT_SCENARIOS.find((s) => s.id === 'water-pumps')!,
    },
  ];

  return (
    <div className="gov-workspace-container space-y-8 py-2">
      {/* Header */}
      <div className="pb-2 border-b border-govborder">
        <div className="inline-flex items-center gap-1.5 text-brand text-xs font-bold uppercase tracking-wider mb-1">
          <History className="w-4 h-4" />
          <span>Procurement Audit Log & Analysis History</span>
        </div>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Analysis History</h2>
        <p className="text-xs text-govmuted mt-0.5">
          Archived tender analyses, verified benchmark specifications, and compliance audit dossiers.
        </p>
      </div>

      {/* 1. User-Generated Recent Analyses (if any) */}
      {savedProjects && savedProjects.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              <span>Recent Session Analyses ({savedProjects.length})</span>
            </h3>
            <span className="text-[11px] text-govmuted">Saved from active session</span>
          </div>

          <div className="space-y-3">
            {savedProjects.map((proj) => {
              const formattedDate = new Date(proj.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    if (onRestoreSavedProject) {
                      onRestoreSavedProject(proj);
                    } else if (proj.mockResult) {
                      const matching = ALL_PROCUREMENT_SCENARIOS.find((s) =>
                        s.title.toLowerCase().includes(proj.title.toLowerCase().split(' ')[0])
                      ) || ALL_PROCUREMENT_SCENARIOS[0];
                      onSelectScenario(matching);
                    }
                  }}
                  className="gov-card p-5 bg-white border border-brand/40 hover:border-brand hover:shadow-gov transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-govmuted flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-brand" />
                        <span>Date: {formattedDate}</span>
                      </span>
                      <span className="text-govmuted">•</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                        Status: Analysis Completed • Verified
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-charcoal">{proj.title}</h4>

                    <div className="text-xs text-brand font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Standards Identified: {proj.primaryStandardNumber}</span>
                    </div>

                    <p className="text-xs text-govmuted line-clamp-1">
                      {proj.extractedRequirement.application || proj.shortDesc}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRestoreSavedProject) {
                        onRestoreSavedProject(proj);
                      } else {
                        const matching = ALL_PROCUREMENT_SCENARIOS.find((s) =>
                          s.title.toLowerCase().includes(proj.title.toLowerCase().split(' ')[0])
                        ) || ALL_PROCUREMENT_SCENARIOS[0];
                        onSelectScenario(matching);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-bold shadow-gov-sm transition-all flex-shrink-0"
                  >
                    <span>Reopen Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. Benchmark Demo Analyses List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <span>Benchmark Procurement Analyses (5 Preserved Scenarios)</span>
          </h3>
          <span className="text-xs text-govmuted">Click to reopen any analysis</span>
        </div>

        <div className="space-y-3">
          {demoAnalyses.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectScenario(item.scenario)}
              className="gov-card p-5 bg-white border border-govborder hover:border-brand/70 hover:shadow-gov transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono text-govmuted flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    <span>Date: {item.date}</span>
                  </span>
                  <span className="text-govmuted">•</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-secgreen border border-emerald-200">
                    Status: {item.status}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-charcoal">{item.product}</h4>

                <div className="text-xs text-brand font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Standards Identified: {item.standardsIdentified}</span>
                </div>

                <p className="text-xs text-govmuted max-w-2xl font-normal leading-relaxed">
                  {item.scenario.shortDesc}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScenario(item.scenario);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ivory-100 hover:bg-brand hover:text-white border border-govborder text-xs font-bold text-charcoal transition-all shadow-gov-sm flex-shrink-0"
              >
                <span>Reopen Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
