'use client';

import React, { useState } from 'react';
import { RecommendationResult } from '@/types/procurement';
import { SupportedLanguage, translations } from '@/types/language';
import { printOfficialTenderPdf } from '@/lib/pdfTemplate';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookmarkPlus,
  BookmarkCheck,
  Printer,
} from 'lucide-react';

interface ExportClauseCardProps {
  result: RecommendationResult;
  onSaveProject: () => void;
  isSaved: boolean;
  isAuthenticated?: boolean;
  onRequireOfficerAuth?: (actionName?: string) => void;
  currentLanguage?: SupportedLanguage;
}

export default function ExportClauseCard({
  result,
  onSaveProject,
  isSaved,
  isAuthenticated = false,
  onRequireOfficerAuth,
  currentLanguage = 'en',
}: ExportClauseCardProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[currentLanguage] || translations.en;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.generatedTenderClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!isAuthenticated) {
      onRequireOfficerAuth?.('download tender specification clauses (.txt)');
      return;
    }
    const blob = new Blob([result.generatedTenderClause], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stdName = result.primaryStandard
      ? result.primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')
      : 'General_Procurement';
    link.download = `Tender_Spec_${stdName}_${currentLanguage.toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    if (!isAuthenticated) {
      onRequireOfficerAuth?.('generate and download official GFR 144(i) tender document (PDF)');
      return;
    }
    printOfficialTenderPdf(result, currentLanguage);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{t.exportClauseTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                GFR 144(i)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentLanguage === 'hi'
                ? 'सरकारी ई-मार्केटप्लेस (GeM) एवं सीपीपीपी निविदाओं में सीधे उपयोग हेतु तैयार'
                : currentLanguage === 'te'
                ? 'GeM మరియు CPPP టెండర్లలో నేరుగా ఉపయోగించడానికి రూపొందించబడింది'
                : currentLanguage === 'ta'
                ? 'GeM மற்றும் CPPP டெண்டர்களில் நேரடியாக பயன்படுத்தக்கூடியது'
                : 'Formatted for direct insertion into GeM / CPPP tender documentation'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Save Tender Button */}
          <button
            type="button"
            onClick={onSaveProject}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm cursor-pointer'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentLanguage === 'hi' ? 'सहेजा गया' : currentLanguage === 'te' ? 'సేవ్ చేయబడింది' : currentLanguage === 'ta' ? 'சேமிக்கப்பட்டது' : 'Saved'}</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{t.saveProjectButton}</span>
                {!isAuthenticated && <span className="text-[10px] opacity-80">🔒</span>}
              </>
            )}
          </button>

          {/* Download Text Spec */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title={isAuthenticated ? 'Download Plain Text Document' : 'Officer sign-in required to download .txt'}
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>{t.downloadTxt}</span>
            {!isAuthenticated && <span className="text-[10px] text-amber-500">🔒</span>}
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            title={isAuthenticated ? 'Print or save your draft as PDF' : 'Officer sign-in required to download PDF'}
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>{t.downloadPdf}</span>
            {!isAuthenticated && <span className="text-[10px] text-amber-300">🔒</span>}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyClauseButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Public Preview Mode Notice */}
      {!isAuthenticated && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 shrink-0">
              {currentLanguage === 'hi' ? 'सार्वजनिक पूर्वावलोकन' : currentLanguage === 'te' ? 'పబ్లిక్ ప్రివ్యూ' : currentLanguage === 'ta' ? 'பொது முன்னோட்டம்' : 'Public Preview'}
            </span>
            <span>{t.publicPreviewNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => onRequireOfficerAuth?.('download official tender documents')}
            className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] shrink-0 transition cursor-pointer"
          >
            {t.officerSignIn}
          </button>
        </div>
      )}

      {/* Code / Clause Display Box */}
      <div className="relative">
        <pre className="w-full max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-sans text-sm leading-7 select-all whitespace-pre-wrap">
          {result.generatedTenderClause}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>{t.exportSubtitle}</span>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{t.gemCompatible}</span>
      </div>
    </div>
  );
}
