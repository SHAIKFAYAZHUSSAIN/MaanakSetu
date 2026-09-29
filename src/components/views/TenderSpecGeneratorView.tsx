'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Copy,
  Download,
  Printer,
  Check,
  Building2,
  ShieldCheck,
  Share2,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { RecommendationResult } from '@/types/procurement';
import { build9SectionSpecification, buildOfficialTenderSpecificationClause } from '@/lib/specExporter';
import { printOfficialTenderPdf } from '@/lib/pdfTemplate';

interface TenderSpecGeneratorViewProps {
  result: RecommendationResult | null;
  onNavigateToAnalysis: () => void;
  onLoadDefaultBenchmark?: () => void;
}

export default function TenderSpecGeneratorView({
  result,
  onNavigateToAnalysis,
  onLoadDefaultBenchmark,
}: TenderSpecGeneratorViewProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!result || !result.primaryStandard) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center gov-card p-12 bg-white border border-govborder space-y-4">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand mx-auto flex items-center justify-center">
          <FileCheck2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-charcoal">No Specification Draft Generated Yet</h3>
        <p className="text-xs text-govmuted max-w-md mx-auto">
          Please run an analysis on a procurement requirement or select a sample tender to generate the official 9-clause
          standards-ready procurement specification.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onLoadDefaultBenchmark && (
            <button
              onClick={onLoadDefaultBenchmark}
              className="px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-semibold shadow-gov inline-flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Generate LED Street Lighting Specification</span>
            </button>
          )}
          <button
            onClick={onNavigateToAnalysis}
            className="px-5 py-2.5 rounded-lg bg-white border border-govborder hover:border-brand text-charcoal text-xs font-semibold shadow-sm"
          >
            Go to Analyze Requirement
          </button>
        </div>
      </div>
    );
  }

  const primaryStandard = result.primaryStandard;
  const sections = build9SectionSpecification(result);
  const fullTextClause = buildOfficialTenderSpecificationClause(result);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTextClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([fullTextClause], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `MaanakSetu_Spec_${primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintPdf = () => {
    printOfficialTenderPdf(result);
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="gov-workspace-container space-y-6 py-2">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-govborder print-hide">
        <div>
          <div className="inline-flex items-center gap-1.5 text-brand text-xs font-bold uppercase tracking-wider mb-1">
            <BadgeCheck className="w-4 h-4" />
            <span>Standards-Ready Output</span>
          </div>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">Tender Specification Generator</h2>
          <p className="text-xs text-govmuted mt-0.5">
            Official 9-clause procurement document formatted for GeM Custom Parameters and CPWD Tender Conditions
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-govborder text-xs font-semibold text-charcoal hover:bg-ivory-50 shadow-gov-sm transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-secgreen" /> : <Copy className="w-4 h-4 text-govmuted" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Specification'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-govborder text-xs font-semibold text-charcoal hover:bg-ivory-50 shadow-gov-sm transition-all"
          >
            <Printer className="w-4 h-4 text-govmuted" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-bold shadow-gov transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export to Tender</span>
          </button>
        </div>
      </div>

      {/* Official Government Procurement Document Sheet */}
      <div className="gov-card p-8 md:p-10 bg-white border border-govborder shadow-gov-hover relative">
        {/* Document Header / Emblem Watermark */}
        <div className="text-center pb-6 border-b-2 border-charcoal/20 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-govmuted">
            Government of India / Public Procurement Organization
          </div>
          <h3 className="text-xl font-extrabold text-charcoal tracking-tight uppercase">
            Schedule of Technical Requirements & Standards Compliance
          </h3>
          <div className="text-xs text-brand font-semibold">
            Drafted via MaanakSetu AI Standards Copilot • Reference No: MS-2026/{primaryStandard.isNumber.split(' ')[1] || 'TNDR'}
          </div>
          <div className="text-[11px] text-govmuted font-mono pt-1">
            Date of Generation: {todayStr} • Status: Standards-Aware Draft
          </div>
        </div>

        {/* Tender Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 my-4 bg-ivory-50 rounded-lg p-3 text-xs border border-govborder">
          <div>
            <span className="text-[10px] font-bold text-govmuted uppercase block">Item Description</span>
            <span className="font-bold text-charcoal">{result.extractedRequirement.product}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-govmuted uppercase block">Primary BIS Standard</span>
            <span className="font-bold text-brand">{primaryStandard.isNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-govmuted uppercase block">QCO Status</span>
            <span className="font-bold text-accent">
              {primaryStandard.qco.isCompulsory ? 'Compulsory Scheme-I/II' : 'Voluntary'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-govmuted uppercase block">Resolved Gaps</span>
            <span className="font-bold text-secgreen">
              {result.specificationGaps.filter((g) => g.isResolved).length} Clauses Adopted
            </span>
          </div>
        </div>

        {/* The 9 Official Sections */}
        <div className="space-y-6 pt-2 text-xs">
          {sections.map((section) => (
            <div key={section.sectionNumber} className="space-y-2">
              <div className="flex items-center gap-2 pb-1 border-b border-govborder/80">
                <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[10px]">
                  {section.sectionNumber}
                </span>
                <h4 className="font-extrabold text-charcoal uppercase tracking-wider text-xs">
                  {section.title}
                </h4>
              </div>

              <div className="space-y-1.5 pl-7">
                {section.clauses.map((clause, idx) => (
                  <p key={idx} className="text-charcoal leading-relaxed font-normal">
                    {clause}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Document Footer */}
        <div className="mt-10 pt-6 border-t-2 border-charcoal/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-govmuted gap-2">
          <span>Formulated strictly against authentic Bureau of Indian Standards (BIS) specifications.</span>
          <span className="font-mono text-[10px]">GeM Specification Template Conforming Clause</span>
        </div>
      </div>
    </div>
  );
}
