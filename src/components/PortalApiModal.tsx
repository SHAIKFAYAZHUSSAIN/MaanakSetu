'use client';

import React, { useState } from 'react';
import {
  X,
  Code,
  Copy,
  Check,
  Send,
  Globe,
  Terminal,
  Server,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface PortalApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PortalApiModal({ isOpen, onClose }: PortalApiModalProps) {
  const [activeTab, setActiveTab] = useState<'docs' | 'playground'>('docs');
  const [copied, setCopied] = useState(false);
  const [testQuery, setTestQuery] = useState(
    'Procure 250 kVA outdoor oil immersed distribution transformer 11kV/433V with BEE 3 Star rating'
  );
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  if (!isOpen) return null;

  const curlSnippet = `curl -X POST "https://maanaksetu.gov.in/api/v1/recommend" \\
  -H "Content-Type: application/json" \\
  -H "X-Procurement-Portal: GeM" \\
  -d '{
    "query": "1000 LED street lights, 90W, outdoor use, IP66, with surge protection",
    "portal": "Government e-Marketplace (GeM)"
  }'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTest = async () => {
    setIsCallingApi(true);
    setApiResponse(null);
    try {
      const res = await fetch('/api/v1/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: testQuery,
          portal: 'Interactive Test Playground',
        }),
      });
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsCallingApi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900 transition-colors">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  RESTful Integration API
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  CORS Enabled
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                Procurement Portal Integration (GeM / CPWD / IREPS)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('docs')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>API Specification & cURL</span>
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Live Interactive Test Playground</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'docs' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>
                  <strong>Endpoint: </strong>
                  <code className="bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-mono font-bold">
                    POST /api/v1/recommend
                  </code>
                </p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Allows government portals to automatically query applicable Indian Standards, QCO certification requirements, outdated standard alerts, and compliant tender clauses during tender draft creation.
                </p>
              </div>

              {/* cURL Snippet */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Example cURL Request:
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy cURL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto border border-slate-800 leading-relaxed">
                  {curlSnippet}
                </pre>
              </div>

              {/* Key Response Fields */}
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider text-[11px]">
                  Returned JSON Schema Highlights:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750">
                    <code className="font-bold text-blue-600 dark:text-blue-400">primaryStandard</code>
                    <p className="text-slate-500 mt-0.5">IS Number, title, scope, official BIS URL, last verified date.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750">
                    <code className="font-bold text-purple-600 dark:text-purple-400">certificationApplicability</code>
                    <p className="text-slate-500 mt-0.5">QCO order, Gazette notification, Scheme-I/II, Ministry.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750">
                    <code className="font-bold text-rose-600 dark:text-rose-400">outdatedAlert</code>
                    <p className="text-slate-500 mt-0.5">Flags superseded standards (e.g. IS 1786:1985) and gives modern replacement.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-750">
                    <code className="font-bold text-emerald-600 dark:text-emerald-400">tenderClauseReadyToUse</code>
                    <p className="text-slate-500 mt-0.5">Pre-formulated legal compliance paragraph for tender documents.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Test Procurement Query / Specification:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    placeholder="Enter query in English or Indian language..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleRunTest}
                    disabled={isCallingApi || !testQuery.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {isCallingApi ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Send API Call</span>
                  </button>
                </div>
              </div>

              {/* Response Viewer */}
              {apiResponse && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Live API Response (HTTP 200 OK):
                    </span>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] max-h-64 overflow-y-auto border border-slate-800 leading-relaxed">
                    {apiResponse}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <span>Integrates via standard HTTPS JSON REST</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
