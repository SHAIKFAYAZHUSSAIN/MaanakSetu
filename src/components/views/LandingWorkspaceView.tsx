'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Network, History, CheckCircle2, FileCheck2, Cpu, Sparkles } from 'lucide-react';
import { SCENARIO_LED, ALL_PROCUREMENT_SCENARIOS, ProcurementScenario } from '@/data/procurementScenarios';

interface LandingWorkspaceViewProps {
  onAnalyzeRequirementClick: () => void;
  onSelectScenario: (scenario: ProcurementScenario) => void;
  onOpenArchitecture: () => void;
}

export default function LandingWorkspaceView({
  onAnalyzeRequirementClick,
  onSelectScenario,
  onOpenArchitecture,
}: LandingWorkspaceViewProps) {
  return (
    <div className="gov-workspace-container space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-2">
        {/* Subtle Institutional Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span>Government of India & Public Sector Procurement Copilot</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-charcoal tracking-tight max-w-4xl mx-auto leading-[1.18]">
          Turn procurement requirements into{' '}
          <span className="text-brand underline decoration-accent/40 decoration-4 underline-offset-4">
            standards-ready specifications.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-govmuted max-w-3xl mx-auto leading-relaxed font-normal">
          ManakSetu analyzes tender requirements and maps them to applicable Indian Standards, allied references,
          certifications and regulatory requirements.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <button
            onClick={onAnalyzeRequirementClick}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-gov bg-brand hover:bg-brand-700 text-white font-semibold text-base shadow-gov transition-all hover:shadow-gov-hover hover:-translate-y-0.5"
          >
            <span>Analyze a Requirement</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSelectScenario(SCENARIO_LED)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-gov bg-white hover:bg-ivory-100 text-charcoal font-semibold text-base border border-govborder shadow-gov-sm transition-all hover:border-brand/50"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Try a Sample Tender</span>
          </button>
        </div>

        {/* Credibility Strip */}
        <div className="pt-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 md:gap-10 py-3 px-6 rounded-full bg-white/80 border border-govborder/80 shadow-gov-sm text-xs font-semibold text-charcoal">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand" />
              <span>Semantic Retrieval</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-govborder hidden sm:block" />
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-brand" />
              <span>Standards Knowledge Graph</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-govborder hidden sm:block" />
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand" />
              <span>Revision Awareness</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-govborder hidden sm:block" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>Regulatory Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* ONE Realistic Example Card (As strictly required by the prompt) */}
      <section className="max-w-3xl mx-auto">
        <div className="gov-card p-7 md:p-8 bg-white border border-govborder relative overflow-hidden transition-all hover:border-brand/60 hover:shadow-gov-hover">
          {/* Subtle Accent Edge */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand via-secgreen to-accent" />

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-accent-50 text-accent font-semibold text-xs border border-accent-100">
              <span>Representative Procurement Workflow</span>
            </div>
            <span className="text-xs text-govmuted font-medium">Smart City Municipal Infrastructure</span>
          </div>

          <h3 className="text-2xl font-bold text-charcoal tracking-tight mb-2">
            LED Street Lighting Procurement
          </h3>

          <p className="text-xs uppercase tracking-wider font-semibold text-brand mb-3">
            Tender Requirement Input:
          </p>

          <blockquote className="p-4 rounded-gov bg-ivory-50 border-l-4 border-brand text-charcoal text-sm leading-relaxed mb-6 font-normal italic">
            &ldquo;Supply, installation and commissioning of energy-efficient LED street lighting fixtures for municipal
            roads, including weather-resistant housing, suitable optical performance, electrical safety, surge protection
            and testing requirements.&rdquo;
          </blockquote>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-govborder mb-6 text-xs">
            <div>
              <div className="text-govmuted font-normal">Primary Standard</div>
              <div className="font-bold text-charcoal mt-0.5">IS 10322 (P5/S3)</div>
            </div>
            <div>
              <div className="text-govmuted font-normal">Normative Citations</div>
              <div className="font-bold text-charcoal mt-0.5">6 Allied Codes</div>
            </div>
            <div>
              <div className="text-govmuted font-normal">Quality Order</div>
              <div className="font-bold text-brand mt-0.5">CRS Scheme-II</div>
            </div>
            <div>
              <div className="text-govmuted font-normal">Gap Detection</div>
              <div className="font-bold text-accent mt-0.5">4 Gaps Audited</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-govmuted font-normal">
              Click below to load this requirement into the AI analysis workspace:
            </span>
            <button
              onClick={() => onSelectScenario(SCENARIO_LED)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-gov bg-brand hover:bg-brand-700 text-white font-semibold text-sm shadow-gov transition-all"
            >
              <span>Analyze this requirement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5 Quick-Start Benchmark Procurement Tenders */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal tracking-tight">
              Pre-Configured Procurement Scenarios
            </h3>
            <p className="text-xs text-govmuted">
              Select any benchmark requirement to load into the AI analyzer
            </p>
          </div>
          <span className="text-xs font-semibold text-brand">5 Verified Standards Benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {ALL_PROCUREMENT_SCENARIOS.map((scen) => (
            <div
              key={scen.id}
              onClick={() => onSelectScenario(scen)}
              className="gov-card p-4 bg-white border border-govborder hover:border-brand/70 hover:shadow-gov cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand border border-brand-200">
                    {scen.category.split('(')[0].trim()}
                  </span>
                  <span className="text-[10px] text-govmuted font-semibold truncate max-w-[100px]">{scen.primaryStandardNumber.split(':')[0]}</span>
                </div>
                <h4 className="text-sm font-bold text-charcoal group-hover:text-brand transition-colors">
                  {scen.title}
                </h4>
                <p className="text-[11px] text-govmuted line-clamp-2 leading-relaxed">
                  {scen.shortDesc}
                </p>
              </div>

              <div className="pt-2.5 mt-2.5 border-t border-govborder/70 flex items-center justify-between text-xs font-semibold text-brand">
                <span>Load requirement</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* System Architecture Strip */}
      <section className="bg-white rounded-gov border border-govborder p-6 shadow-gov-sm max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-govborder">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-50 text-brand">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-charcoal">Underlying AI System Architecture</h4>
              <p className="text-xs text-govmuted">Traceable, revision-aware standards reasoning engine</p>
            </div>
          </div>
          <button
            onClick={onOpenArchitecture}
            className="text-xs text-brand font-semibold hover:underline inline-flex items-center gap-1"
          >
            <span>View Architecture Diagram & Methodology</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-lg bg-ivory-50 border border-govborder/60">
            <div className="font-bold text-charcoal mb-1">01. Semantic Parsing</div>
            <p className="text-govmuted font-normal leading-relaxed">
              Extracts operational parameters, voltage ratings, and duty cycles from unstructured tender text.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-ivory-50 border border-govborder/60">
            <div className="font-bold text-charcoal mb-1">02. Knowledge Graph</div>
            <p className="text-govmuted font-normal leading-relaxed">
              Traverses normative cross-references to automatically pull mandatory test methods and safety standards.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-ivory-50 border border-govborder/60">
            <div className="font-bold text-charcoal mb-1">03. Deterministic Verification</div>
            <p className="text-govmuted font-normal leading-relaxed">
              Verifies gazette notifications and QCO validity without relying on ungrounded generative predictions.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-ivory-50 border border-govborder/60">
            <div className="font-bold text-charcoal mb-1">04. Spec Generator</div>
            <p className="text-govmuted font-normal leading-relaxed">
              Assembles an official 9-clause procurement document formatted for direct GeM and CPPP tender upload.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
