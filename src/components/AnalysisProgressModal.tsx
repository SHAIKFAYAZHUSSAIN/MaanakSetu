'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Shield,
  Network,
  FileSearch,
  Layers,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  {
    number: '01',
    title: 'Extracting procurement requirements',
    subtitle: 'Parsing technical parameters, operating limits, and duties from tender text...',
    icon: FileSearch,
  },
  {
    number: '02',
    title: 'Identifying product characteristics',
    subtitle: 'Normalizing vocabulary across BIS Electrotechnical & Mechanical taxonomies...',
    icon: Layers,
  },
  {
    number: '03',
    title: 'Matching Indian Standards',
    subtitle: 'Cross-referencing 23+ Bureau of Indian Standards technical directorates...',
    icon: Shield,
  },
  {
    number: '04',
    title: 'Traversing related standards',
    subtitle: 'Resolving normative references, mandatory test methods, and component codes...',
    icon: Network,
  },
  {
    number: '05',
    title: 'Checking revision information',
    subtitle: 'Verifying active vs. superseded editions, gazetted amendments, and reaffirmations...',
    icon: Clock,
  },
  {
    number: '06',
    title: 'Checking regulatory requirements',
    subtitle: 'Auditing compulsory Quality Control Orders (QCO) and certification schemes...',
    icon: ShieldCheck,
  },
  {
    number: '07',
    title: 'Detecting specification gaps',
    subtitle: 'Benchmarking tender text against CPWD, GeM, and BIS compliance requirements...',
    icon: AlertTriangle,
  },
];

export default function AnalysisProgressModal({ isOpen, onComplete }: AnalysisProgressModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(10);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgressPercent(10);
      return;
    }

    const stepInterval = 350; // ~2.5-2.8s total controlled sequence

    const timers: NodeJS.Timeout[] = [];

    ANALYSIS_STEPS.forEach((_, idx) => {
      timers.push(
        setTimeout(() => {
          setCurrentStepIndex(idx);
          const percent = Math.min(100, Math.round(((idx + 1) / ANALYSIS_STEPS.length) * 100));
          setProgressPercent(percent);
        }, idx * stepInterval)
      );
    });

    // Complete sequence
    timers.push(
      setTimeout(() => {
        onComplete();
      }, ANALYSIS_STEPS.length * stepInterval + 250)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-gov border border-govborder shadow-gov-modal p-6 md:p-7 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-full bg-brand-50 text-brand mx-auto flex items-center justify-center shadow-gov-sm">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-charcoal tracking-tight">
            Analyzing Procurement Specification
          </h3>
          <p className="text-xs text-govmuted font-normal max-w-sm mx-auto">
            Grounded against the Bureau of Indian Standards (BIS) catalogue & Gazette QCO database
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-charcoal">
            <span>Deterministic Analysis Sequence</span>
            <span className="text-brand font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 7 Step Visual Indicators */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex || progressPercent === 100;
            const isCurrent = idx === currentStepIndex && progressPercent < 100;
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={`p-2.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-brand-50/80 border-brand shadow-gov-sm ring-1 ring-brand/30'
                    : isDone
                    ? 'bg-ivory-50 border-govborder/80 text-charcoal'
                    : 'bg-white border-govborder/40 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? 'bg-secgreen text-white'
                          : isCurrent
                          ? 'bg-brand text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.number}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-brand' : 'text-govmuted'}`} />
                        <span>{step.title}</span>
                      </div>
                      {isCurrent && (
                        <div className="text-[10px] text-brand font-medium mt-0.5 animate-pulse line-clamp-1">
                          {step.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isCurrent && <Loader2 className="w-3.5 h-3.5 text-brand animate-spin" />}
                    {isDone && <CheckCircle2 className="w-4 h-4 text-secgreen" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-1 border-t border-govborder text-[11px] text-govmuted">
          <span>Demonstration Knowledge Base • 2–4 second realistic analysis sequence</span>
        </div>
      </div>
    </div>
  );
}
