'use client';

import React, { useState } from 'react';
import { RecommendationResult } from '@/types/procurement';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react';

interface ExportClauseCardProps {
  result: RecommendationResult;
  onSaveProject: () => void;
  isSaved: boolean;
}

export default function ExportClauseCard({
  result,
  onSaveProject,
  isSaved,
}: ExportClauseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.generatedTenderClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([result.generatedTenderClause], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tender_Spec_${result.primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md relative transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Generated Tender Specification Clause
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ready-to-paste contract clause for GeM Custom Bids, CPWD, Railways, and Public Works
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Save Project Button */}
          <button
            type="button"
            onClick={onSaveProject}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Saved to Library</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Tender</span>
              </>
            )}
          </button>

          {/* Download Text Spec */}
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
            title="Download Specification Document"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Download .txt</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Clause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code / Clause Display Box */}
      <div className="relative">
        <pre className="w-full max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-xs leading-relaxed select-all whitespace-pre-wrap">
          {result.generatedTenderClause}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Includes resolved specification gaps, QCO statutory citations, and STI testing protocols.</span>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Compatible with GeM / CPPP e-Procurement Formats</span>
      </div>
    </div>
  );
}
