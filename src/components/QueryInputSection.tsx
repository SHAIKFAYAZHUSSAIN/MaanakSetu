'use client';

import React, { useState } from 'react';
import { SupportedLanguage, translations } from '@/types/language';
import {
  Search,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Cpu,
  Sun,
  Activity,
  ShieldAlert,
  Droplet,
  CheckCircle2,
} from 'lucide-react';

interface QueryInputSectionProps {
  currentLanguage: SupportedLanguage;
  query: string;
  onQueryChange: (q: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  tenderDocText: string;
  tenderFileName: string;
  onClearUploadedDoc: () => void;
  onDocUploaded: (name: string, text: string) => void;
}

export default function QueryInputSection({
  currentLanguage,
  query,
  onQueryChange,
  onAnalyze,
  isLoading,
  tenderDocText,
  tenderFileName,
  onClearUploadedDoc,
  onDocUploaded,
}: QueryInputSectionProps) {
  const t = translations[currentLanguage] || translations.en;
  const [showAllExamples, setShowAllExamples] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Pre-configured realistic public procurement samples
  const sampleQueries = [
    {
      icon: Lightbulb,
      title: 'LED Street Lighting',
      category: 'Electrical / Smart City',
      text: '1000 LED street lights, 90W, outdoor use, IP66, suitable for Indian roads, with surge protection and minimum 50,000 hours lifetime.',
      lang: 'en',
    },
    {
      icon: Cpu,
      title: 'Distribution Transformer',
      category: 'Power Grid',
      text: 'Procurement of 500 kVA outdoor oil-immersed distribution transformer, 11kV / 433V, Energy Efficiency Level 2, copper winding with CPRI type test.',
      lang: 'en',
    },
    {
      icon: Sun,
      title: 'Solar PV Street Light',
      category: 'Renewable Energy',
      text: '40W standalone solar LED street light system with monocrystalline solar PV module, LiFePO4 battery storage, IP65 housing and MNRE compliance.',
      lang: 'en',
    },
    {
      icon: Droplet,
      title: 'Agricultural Water Pump',
      category: 'Irrigation & Water',
      text: '5 HP Three Phase agricultural monobloc water pump, 415V, clear cold water irrigation, energy efficient BEE star rating with IP55 protection.',
      lang: 'en',
    },
    {
      icon: Activity,
      title: 'Hospital Wheelchairs',
      category: 'Healthcare / Medical',
      text: '200 units folding hospital wheelchairs for adult patients, epoxy powder-coated tubular steel frame, solid rubber tyres with 120 kg load capacity.',
      lang: 'en',
    },
    {
      icon: ShieldAlert,
      title: 'IP CCTV Surveillance',
      category: 'Security & IT',
      text: '300 units 4MP outdoor IP CCTV surveillance cameras with night vision IR, IP66 weatherproof housing, ONVIF compliant and STQC cybersecurity certification.',
      lang: 'en',
    },
  ];

  // Multilingual Indian Language & Compliance Verification Samples
  const regionalSamples = [
    {
      tag: 'हिन्दी (Hindi)',
      title: '250 kVA ट्रांसफार्मर',
      text: 'ग्रामीण विद्युतीकरण के लिए 250 kVA आउटडोर डिस्ट्रीब्यूशन ट्रांसफार्मर, 11kV/433V, तांबे की वाइंडिंग और बीईई स्टार रेटिंग।',
    },
    {
      tag: 'తెలుగు (Telugu)',
      title: '90W LED లైట్లు',
      text: 'మున్సిపల్ రోడ్ల ప్రాజెక్ట్ కోసం 90W అవుట్‌డోర్ LED స్ట్రీట్ లైట్లు 1000 కావలెను, IP66 ప్రొటెక్షన్ మరియు సర్జ్ రక్షణతో కనీసం 50,000 గంటల జీవితకాలం.',
    },
    {
      tag: 'தமிழ் (Tamil)',
      title: '5HP விவசாய மோட்டார்',
      text: 'விவசாய பாசனத்திற்கு 5HP மூன்று கட்ட மோனோபிளாக் நீர் பம்ப், 415V, ஐபி55 பாதுகாப்புடன்.',
    },
    {
      tag: 'सरिया (Colloquial)',
      title: 'TMT Saria Fe 500D',
      text: 'Procure 50 metric tonnes of 16mm saria Fe 500D for primary school concrete building construction.',
    },
    {
      tag: 'Older edition',
      title: 'IS 1786:1985 CTD Bars',
      text: 'Tender specification for high strength deformed steel bars conforming to IS 1786:1985 for bridge pier foundation.',
    },
    {
      tag: 'Unmatched product',
      title: 'Lunch Catering Service',
      text: 'Supply of 500 packed lunch catering boxes with bottled water for national civil services training workshop.',
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload document');
      }

      onDocUploaded(data.fileName, data.extractedText);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing document');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <section className="relative pt-6 pb-8">
      {/* Background Glow Circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-medium mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>Demo prototype • Indian Standards for procurement</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
            The right standards. A clearer tender.
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Describe what you need to buy. Explore relevant Indian Standards, review missing requirements,
            and prepare a tender draft — in English or an Indian language.
          </p>
        </div>

        {/* Smart Query Box */}
        <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-700/60 ring-1 ring-black/5 dark:ring-white/10 transition-colors">
          <div className="relative">
            <label htmlFor="procurement-query" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Describe your procurement requirement</label>
            <textarea
              id="procurement-query"
              rows={4}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm md:text-base rounded-xl p-4 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
            />

            {/* Uploaded File Indicator Banner */}
            {tenderFileName && (
              <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-500/30 text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="font-semibold truncate">Tender Attached: {tenderFileName}</span>
                  <span className="text-slate-500 dark:text-slate-400">({tenderDocText.length} characters parsed)</span>
                </div>
                <button
                  type="button"
                  onClick={onClearUploadedDoc}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium ml-4 flex-shrink-0"
                >
                  Remove Document
                </button>
              </div>
            )}

            {uploadError && (
              <div className="mt-2 text-xs text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-800">
                {uploadError}
              </div>
            )}

            {/* Input Action Toolbar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              {/* File Upload Trigger */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition">
                  <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{isUploading ? 'Extracting Text...' : 'Upload Tender PDF / Spec'}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-600 dark:text-slate-400 hidden sm:inline">
                  PDF, Word or plain text
                </span>
              </div>

              {/* Main Submit Button */}
              <button
                type="button"
                onClick={onAnalyze}
                disabled={isLoading || (!query.trim() && !tenderDocText.trim())}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t.analyzingButton}</span>
                  </>
                ) : (
                  <>
                    <span>{t.analyzeButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Procurement Scenarios Pills */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {t.sampleQueriesTitle}
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Choose an example to get started</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {(showAllExamples ? sampleQueries : sampleQueries.slice(0, 3)).map((sample, idx) => {
                const Icon = sample.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQueryChange(sample.text)}
                    className="text-left p-3 rounded-xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 shadow-sm transition group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:text-blue-500">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white">
                        {sample.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {sample.text}
                    </p>
                  </button>
                );
              })}
            </div>

            <button type="button" onClick={() => setShowAllExamples(!showAllExamples)} aria-expanded={showAllExamples} className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">{showAllExamples ? "Fewer examples" : "More examples"}</button>
            {/* Compliance & Multilingual Quick Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/50">
              <span className="text-[11px] text-slate-500 font-medium">Explore more scenarios:</span>
              {regionalSamples.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onQueryChange(r.text)}
                  title={r.text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/40 shadow-sm transition"
                >
                  <span className="font-bold text-amber-600 dark:text-amber-400">{r.tag}:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{r.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
