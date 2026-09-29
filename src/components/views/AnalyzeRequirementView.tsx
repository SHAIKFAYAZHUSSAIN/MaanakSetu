'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  Globe2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Shield,
  Layers,
  Search,
} from 'lucide-react';
import { ALL_PROCUREMENT_SCENARIOS, ProcurementScenario } from '@/data/procurementScenarios';
import { SupportedLanguage } from '@/types/language';

interface AnalyzeRequirementViewProps {
  query: string;
  setQuery: (q: string) => void;
  tenderDocText: string;
  setTenderDocText: (text: string) => void;
  tenderFileName: string;
  setTenderFileName: (name: string) => void;
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onAnalyze: (overrideQuery?: string) => void;
  isLoading: boolean;
}

type InputMode = 'paste' | 'upload' | 'query';

export default function AnalyzeRequirementView({
  query,
  setQuery,
  tenderDocText,
  setTenderDocText,
  tenderFileName,
  setTenderFileName,
  selectedLanguage,
  onLanguageChange,
  onAnalyze,
  isLoading,
}: AnalyzeRequirementViewProps) {
  const [inputMode, setInputMode] = useState<InputMode>('paste');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScenarioSelect = (scenario: ProcurementScenario) => {
    setSelectedScenarioId(scenario.id);
    setQuery(scenario.sampleQuery);
    setTenderDocText('');
    setTenderFileName('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse tender document');
      }

      setTenderDocText(data.text);
      setTenderFileName(file.name);
      setQuery(''); // clear direct query to prioritize uploaded doc
      setInputMode('upload');
    } catch (err: any) {
      setUploadError(err.message || 'Error processing document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearUpload = () => {
    setTenderDocText('');
    setTenderFileName('');
    setUploadError(null);
  };

  const languageLabels: Record<SupportedLanguage, string> = {
    en: 'English (Default)',
    hi: 'हिन्दी (Hindi)',
    te: 'తెలుగు (Telugu)',
    ta: 'தமிழ் (Tamil)',
    kn: 'ಕನ್ನಡ (Kannada)',
  };

  const activeContent = tenderDocText ? tenderDocText : query;

  return (
    <div className="gov-workspace-container space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-50 text-brand text-xs font-semibold border border-brand-200">
          <FileCheck className="w-3.5 h-3.5" />
          <span>Procurement Specification Analysis</span>
        </div>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
          Analyze Procurement Requirement
        </h2>
        <p className="text-sm text-govmuted max-w-2xl font-normal">
          Enter an item description, upload tender schedule of requirements, or provide a natural language specification.
          ManakSetu identifies mandatory Indian Standards, QCO orders, and specification gaps.
        </p>
      </div>

      {/* Input Mode Selector & Language Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        {/* Input Modes */}
        <div className="inline-flex p-1 rounded-gov bg-ivory-200/80 border border-govborder text-xs font-semibold text-charcoal">
          <button
            onClick={() => setInputMode('paste')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              inputMode === 'paste'
                ? 'bg-white text-brand shadow-gov-sm font-bold'
                : 'text-govmuted hover:text-charcoal'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Requirement</span>
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              inputMode === 'upload'
                ? 'bg-white text-brand shadow-gov-sm font-bold'
                : 'text-govmuted hover:text-charcoal'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Tender</span>
          </button>
          <button
            onClick={() => setInputMode('query')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
              inputMode === 'query'
                ? 'bg-white text-brand shadow-gov-sm font-bold'
                : 'text-govmuted hover:text-charcoal'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Natural Language</span>
          </button>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Globe2 className="w-4 h-4 text-brand" />
          <span className="text-xs text-govmuted font-medium">Input Language:</span>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-govborder text-charcoal focus:border-brand focus:ring-1 focus:ring-brand outline-none"
          >
            <option value="en">English (Default)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
          </select>
        </div>
      </div>

      {/* Main Input Experience */}
      <div className="gov-card p-6 bg-white border border-govborder space-y-4 relative shadow-gov">
        {inputMode === 'upload' ? (
          /* Document Upload Mode */
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            {!tenderDocText ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-govborder hover:border-brand rounded-gov p-8 text-center cursor-pointer transition-all bg-ivory-50/50 hover:bg-ivory-50"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-charcoal mb-1">
                  Upload Schedule of Requirements / Tender Document
                </h4>
                <p className="text-xs text-govmuted max-w-sm mx-auto mb-3 font-normal">
                  Supported formats: <strong>PDF</strong>, <strong>DOCX</strong>, <strong>TXT</strong> up to 25MB.
                  ManakSetu parses multiple line items and schedules automatically.
                </p>
                <button
                  type="button"
                  disabled={isUploading}
                  className="px-4 py-2 rounded-lg bg-white border border-govborder text-xs font-semibold text-charcoal hover:border-brand"
                >
                  {isUploading ? 'Extracting document text...' : 'Select File from Computer'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-brand-50 border border-brand-200">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-brand" />
                    <div>
                      <div className="text-xs font-bold text-charcoal">{tenderFileName || 'Uploaded Tender Document'}</div>
                      <div className="text-[11px] text-govmuted">
                        Extracted {tenderDocText.split(/\s+/).length} words for standards reasoning
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClearUpload}
                    className="text-xs text-govdanger hover:underline font-semibold"
                  >
                    Remove & Upload Another
                  </button>
                </div>

                <textarea
                  value={tenderDocText}
                  onChange={(e) => setTenderDocText(e.target.value)}
                  rows={8}
                  className="w-full p-4 rounded-lg bg-ivory-50 border border-govborder text-xs text-charcoal font-mono leading-relaxed focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand outline-none resize-y"
                  placeholder="Document content preview..."
                />
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-govdanger text-xs border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        ) : (
          /* Text / Natural Language Mode */
          <div className="space-y-2">
            <textarea
              id="procurement-requirement-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={6}
              placeholder="Describe the product or paste the relevant tender specification..."
              className="w-full p-4 rounded-lg bg-ivory-50 border border-govborder text-sm text-charcoal leading-relaxed placeholder:text-govmuted/70 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none resize-y transition-all font-normal"
            />
          </div>
        )}

        {/* Multilingual Normalization Indicator */}
        {selectedLanguage !== 'en' && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-50/70 border border-brand-100 text-xs text-brand">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>
              Multilingual query in <strong>{languageLabels[selectedLanguage]}</strong> is automatically normalized to
              standard procurement terminology for BIS semantic mapping.
            </span>
          </div>
        )}

        {/* Action Button & Meta */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-govborder">
          <div className="text-xs text-govmuted font-normal">
            Deterministic matching adheres strictly to official BIS Sectional Committees & Gazette Quality Orders.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setQuery(
                  'Supply, installation and commissioning of energy-efficient LED street lighting fixtures for municipal roads, including weather-resistant housing, suitable optical performance, electrical safety, surge protection and testing requirements.'
                );
                setTenderDocText('');
                setTenderFileName('');
              }}
              className="px-4 py-2.5 rounded-gov bg-ivory-100 hover:bg-ivory-200 border border-govborder text-charcoal font-semibold text-xs transition-all"
            >
              Use Sample
            </button>

            <button
              id="analyze-with-manaksetu-button"
              onClick={() => onAnalyze()}
              disabled={isLoading || (!query.trim() && !tenderDocText.trim())}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-gov bg-brand hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-gov transition-all hover:shadow-gov-hover hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Standards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Analyze Requirement</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Requirements Cards (5 Curated Scenarios from prompt) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-govmuted">
            Curated Benchmark Scenarios (Click to Load)
          </h3>
          <span className="text-[11px] text-govmuted">Real BIS Standard Numbers & Gazetted QCOs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ALL_PROCUREMENT_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario)}
                className={`text-left p-3.5 rounded-gov border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-50/80 border-brand shadow-gov-sm ring-1 ring-brand'
                    : 'bg-white border-govborder hover:border-brand/60 hover:bg-ivory-50/50'
                }`}
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-brand mb-1">
                    {scenario.primaryStandardNumber.split(':')[0]}
                  </div>
                  <h4 className="text-xs font-bold text-charcoal line-clamp-1 mb-1.5">
                    {scenario.title}
                  </h4>
                  <p className="text-[11px] text-govmuted line-clamp-2 leading-relaxed font-normal">
                    {scenario.shortDesc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-govborder/60 flex items-center justify-between text-[10px] font-semibold text-brand">
                  <span>Load scenario</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
