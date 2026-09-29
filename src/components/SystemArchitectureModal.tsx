'use client';

import React from 'react';
import { X, Cpu, ArrowRight, ShieldCheck, CheckCircle2, Network, FileSearch, HelpCircle } from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemArchitectureModal({ isOpen, onClose }: SystemArchitectureModalProps) {
  if (!isOpen) return null;

  const steps = [
    {
      step: '01',
      title: 'Natural-Language Input',
      desc: 'Accepts technical specifications, tender schedule of requirements, or colloquial descriptions in 5 Indian languages.',
      concept: 'Multilingual Normalization',
      conceptExpl: 'Maps regional words (e.g. Hindi, Telugu, Tamil, Kannada) into formal technical concepts.',
    },
    {
      step: '02',
      title: 'Requirement Extraction',
      desc: 'Parses engineering parameters: operating voltage, power ratings, duty cycles, ingress protection, and environmental constraints.',
      concept: 'Deterministic Parameter Extraction',
      conceptExpl: 'Uses strict regex heuristics and semantic parsing so exact numerical benchmarks are never hallucinated.',
    },
    {
      step: '03',
      title: 'Semantic Retrieval & Ranking',
      desc: 'Traverses the 23+ Bureau of Indian Standards (BIS) Technical Divisions to identify the candidate standards that govern the item.',
      concept: 'Hybrid RAG',
      conceptExpl: 'Combines exact keyword code matching (IS 10322) with semantic concept similarity for high recall.',
    },
    {
      step: '04',
      title: 'Knowledge Graph Traversal',
      desc: 'Follows normative cross-references embedded inside primary standard clauses to pull mandatory test methods, safety subsystems, and installation codes.',
      concept: 'Knowledge Graph Traversal',
      conceptExpl: 'A standard never stands alone: lighting requires controlgear and earthing standards. The graph resolves this automatically.',
    },
    {
      step: '05',
      title: 'Regulatory Verification',
      desc: 'Verifies whether the product falls under a mandatory Quality Control Order (QCO) gazetted by DPIIT or line ministries.',
      concept: 'Deterministic Verification',
      conceptExpl: 'Cross-checks gazette orders to confirm whether BIS ISI mark or Compulsory Registration Scheme (CRS) is legally compulsory.',
    },
    {
      step: '06',
      title: 'Specification Gap Analysis',
      desc: 'Audits the buyer specification against standard benchmarks to flag missing safety protections or uncertified test methods.',
      concept: 'Rule-Based Gap Detection',
      conceptExpl: 'Compares tender requirements against known failure modes (e.g., missing 10kV surge protection device).',
    },
    {
      step: '07',
      title: 'Procurement-Ready Output',
      desc: 'Assembles an official 9-clause tender specification ready for direct insertion into GeM Custom Parameters and CPWD conditions.',
      concept: 'Standards-Ready Export',
      conceptExpl: 'Generates formal government clauses with copy, PDF download, and text export functionality.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-gov border border-govborder shadow-gov-modal max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-govborder bg-ivory-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-brand-50 text-brand">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-charcoal">System Architecture & Verification Methodology</h3>
              <p className="text-xs text-govmuted">How MaanakSetu ensures traceable, hallucination-free recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-govmuted hover:text-charcoal hover:bg-ivory-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Architecture Banner */}
          <div className="p-4 rounded-lg bg-brand-50 border border-brand-200 text-brand space-y-1">
            <span className="font-bold block text-sm">Core Engineering Principle: Evidence Over Generative Guesswork</span>
            <p className="text-govmuted text-xs leading-relaxed font-normal">
              Public procurement cannot tolerate AI hallucinations. MaanakSetu links every recommendation to a verified
              clause in the active BIS standards database and official government gazette notifications.
            </p>
          </div>

          {/* 7-Step Pipeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-charcoal uppercase tracking-wider text-[11px]">
              End-to-End Analysis Pipeline
            </h4>

            <div className="space-y-3">
              {steps.map((st) => (
                <div key={st.step} className="p-3.5 rounded-gov bg-ivory-50 border border-govborder space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[10px]">
                        {st.step}
                      </span>
                      <h5 className="font-bold text-charcoal text-xs">{st.title}</h5>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-brand border border-govborder">
                      {st.concept}
                    </span>
                  </div>

                  <p className="text-charcoal leading-relaxed font-normal">{st.desc}</p>

                  <div className="p-2 rounded bg-white border border-govborder/80 text-[11px] text-govmuted">
                    <strong className="text-charcoal">In plain English:</strong> {st.conceptExpl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-govborder bg-ivory-50/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-charcoal hover:bg-charcoal-800 text-white text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
