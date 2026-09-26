'use client';

import React from 'react';
import { X, Network, Database, ShieldCheck, Cpu, GitBranch, AlertTriangle, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                MaanakSetu System Architecture & Retrieval Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Hybrid RAG + Knowledge Graph + Regulatory Verification Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Visual 10-Step Workflow */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              End-to-End Procurement Recommendation Pipeline
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { step: '01', title: 'Tender Input', desc: 'Multilingual Text / PDF Upload' },
                { step: '02', title: 'Requirement Parsing', desc: 'AI Structured Extraction' },
                { step: '03', title: 'Domain ID', desc: 'ETD / MED / CED Technical Division' },
                { step: '04', title: 'Hybrid Retrieval', desc: 'Vector Similarity + Keyword Filtering' },
                { step: '05', title: 'Multi-Factor Re-Ranking', desc: 'Current Version & Scope Weighting' },
                { step: '06', title: 'Graph Traversal', desc: 'Normative & Allied Standards' },
                { step: '07', title: 'Version Tracking', desc: 'Active Amendments Verification' },
                { step: '08', title: 'QCO Engine', desc: 'Compulsory Certification Orders' },
                { step: '09', title: 'Gap Analysis', desc: 'Missing Benchmark Detection' },
                { step: '10', title: 'Auditable Report', desc: 'GeM Specification & Clause' },
              ].map((s) => (
                <div key={s.step} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-blue-400">{s.step}</span>
                  <div className="text-xs font-bold text-white mt-0.5 mb-1">{s.title}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Distinction (Point 18) */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-2">
              Why MaanakSetu Beats Generic LLMs (ChatGPT) in Public Procurement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-rose-900/40">
                <span className="font-bold text-rose-400 block mb-1">❌ Generic LLMs:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Hallucinates plausible-sounding but obsolete standard editions.</li>
                  <li>No knowledge of live Gazette QCO notifications or enforcement dates.</li>
                  <li>Cannot traverse normative and test-method dependency graphs.</li>
                  <li>Lacks deterministic audit trail required by CVC and CAG guidelines.</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-emerald-900/40">
                <span className="font-bold text-emerald-400 block mb-1">✓ MaanakSetu Engine:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Grounded in authoritative BIS repository and Technical Committees.</li>
                  <li>Tracks active amendments (e.g. Amd 1:2018, Amd 2:2024).</li>
                  <li>Directly links Scheme-I (ISI) and Scheme-II (CRS) compulsory QCO orders.</li>
                  <li>Specification Gap Analysis flags omitted benchmarks before tender publication.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Formula */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Hybrid Re-Ranking Score Formulation
            </h4>
            <code className="text-amber-300 text-xs font-mono block bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              Score = SemanticSim(0.25) + ProductMatch(0.35) + ScopeSim(0.20) + ParameterMatch(0.15) + CurrentVersionBonus(0.10) + QCOCompulsoryBonus(0.10)
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center px-5">
          <span>Problem Statement PS 26108 • Bureau of Indian Standards (BIS)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
