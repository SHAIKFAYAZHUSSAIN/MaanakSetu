'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QueryInputSection from '@/components/QueryInputSection';
import SectionNavigator, { SectionTabId } from '@/components/SectionNavigator';
import RequirementBadgeGrid from '@/components/RequirementBadgeGrid';
import PrimaryStandardCard from '@/components/PrimaryStandardCard';
import RegulatoryCard from '@/components/RegulatoryCard';
import GraphVisualizer from '@/components/GraphVisualizer';
import RelatedStandardsTable from '@/components/RelatedStandardsTable';
import SpecificationGapsCard from '@/components/SpecificationGapsCard';
import ExplainabilityAuditCard from '@/components/ExplainabilityAuditCard';
import ExportClauseCard from '@/components/ExportClauseCard';
import SavedProjectsDrawer from '@/components/SavedProjectsDrawer';
import ArchitectureModal from '@/components/ArchitectureModal';
import NoReliableMatchCard from '@/components/NoReliableMatchCard';
import OutdatedStandardAlertCard from '@/components/OutdatedStandardAlertCard';
import ClarifyingQuestionsCard from '@/components/ClarifyingQuestionsCard';
import TenderLineItemsCard from '@/components/TenderLineItemsCard';
import RecommendationEvidenceCard from '@/components/RecommendationEvidenceCard';
import PortalApiModal from '@/components/PortalApiModal';
import { SupportedLanguage } from '@/types/language';
import { RecommendationResult, SavedTenderProject } from '@/types/procurement';
import { buildOfficialTenderSpecificationClause } from '@/lib/specExporter';
import { Compass, ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<SectionTabId>('all');
  const [query, setQuery] = useState<string>(
    '1000 LED street lights, 90W, outdoor use, IP66, suitable for Indian roads, with surge protection and minimum 50,000 hours lifetime.'
  );
  const [tenderDocText, setTenderDocText] = useState<string>('');
  const [tenderFileName, setTenderFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawers
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isPortalApiOpen, setIsPortalApiOpen] = useState<boolean>(false);
  const [savedProjects, setSavedProjects] = useState<SavedTenderProject[]>([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('maanaksetu_theme') as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch (e) {
      console.warn('Failed to load theme preference:', e);
    }
  }, []);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      localStorage.setItem('maanaksetu_theme', newTheme);
    } catch (e) {
      console.warn('Failed to save theme:', e);
    }
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  // Load saved projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('maanaksetu_saved_projects');
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to read localStorage:', e);
    }
  }, []);

  // Sync saved projects back to localStorage
  const persistProjects = (projects: SavedTenderProject[]) => {
    setSavedProjects(projects);
    try {
      localStorage.setItem('maanaksetu_saved_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to write localStorage:', e);
    }
  };

  // Trigger analysis pipeline
  const handleAnalyze = async (overrideQuery?: string, itemIndex?: number) => {
    const activeQuery = overrideQuery !== undefined ? overrideQuery : query;
    if (!activeQuery.trim() && !tenderDocText.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsCurrentSaved(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: activeQuery,
          tenderDocText,
          selectedItemIndex: itemIndex ?? result?.selectedItemIndex ?? 0,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze specification');
      }

      setResult(data);

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'An error occurred during retrieval');
    } finally {
      setIsLoading(false);
    }
  };

  // Start analysis only when the user chooses Find Standards.

  // Handle 1-click update for outdated standard
  const handleApplyOutdatedUpdate = (replacementStandard: string) => {
    const updated = query
      ? query
          .replace(/IS\s*1786[:\s]*1985/gi, replacementStandard)
          .replace(/IS\s*13252([^\n,]*)/gi, replacementStandard)
          .replace(/IS\s*10322([^\n,]*1987)/gi, replacementStandard)
      : replacementStandard;
    const finalQuery =
      updated !== query ? updated : `${query} (Updated to conform to ${replacementStandard})`;
    setQuery(finalQuery);
    handleAnalyze(finalQuery);
  };

  // Handle clarifying question option selection
  const handleAnswerClarifyingQuestion = (
    _questionId: string,
    _optionValue: string,
    targetStandard?: string
  ) => {
    const newQuery = targetStandard
      ? `${query} (Mandating ${targetStandard})`
      : `${query} [Specified: ${_optionValue}]`;
    setQuery(newQuery);
    handleAnalyze(newQuery);
  };

  // Handle multi-product line item selection from tender document
  const handleSelectTenderItem = (itemIndex: number) => {
    if (!result?.tenderItemsDetected?.[itemIndex]) return;
    const selectedItem = result.tenderItemsDetected[itemIndex];
    const newQuery = `${selectedItem.productName}: ${selectedItem.rawSnippet}`;
    setQuery(newQuery);
    handleAnalyze(newQuery, itemIndex);
  };

  // Handle Specification Gap Toggling (In-place live clause update)
  const handleToggleResolveGap = (gapId: string) => {
    if (!result) return;

    const updatedGaps = result.specificationGaps.map((gap) => {
      if (gap.id === gapId) {
        return { ...gap, isResolved: !gap.isResolved };
      }
      return gap;
    });

    const updatedResult: RecommendationResult = {
      ...result,
      specificationGaps: updatedGaps,
    };

    updatedResult.generatedTenderClause = buildOfficialTenderSpecificationClause(updatedResult);
    setResult(updatedResult);
  };

  // Save current project to library
  const handleSaveProject = () => {
    if (!result || !result.primaryStandard) return;

    const newProject: SavedTenderProject = {
      id: `proj-${Date.now()}`,
      title: `${result.extractedRequirement.product} (${result.primaryStandard.isNumber})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      extractedRequirement: result.extractedRequirement,
      primaryStandardNumber: result.primaryStandard.isNumber,
      primaryStandardTitle: result.primaryStandard.title,
      resolvedGaps: result.specificationGaps.filter((g) => g.isResolved).map((g) => g.parameter),
    };

    const updated = [newProject, ...savedProjects];
    persistProjects(updated);
    setIsCurrentSaved(true);
  };

  // Load a previously saved tender project
  const handleLoadProject = (project: SavedTenderProject) => {
    setQuery(project.extractedRequirement.rawQuery);
    setTenderDocText('');
    setTenderFileName('');
    setIsSavedDrawerOpen(false);
    setTimeout(() => {
      handleAnalyze(project.extractedRequirement.rawQuery);
    }, 50);
  };

  const handleDeleteProject = (id: string) => {
    const updated = savedProjects.filter((p) => p.id !== id);
    persistProjects(updated);
  };

  const handleReset = () => {
    setQuery('');
    setTenderDocText('');
    setTenderFileName('');
    setResult(null);
  };

  const shouldShowSection = (sectionId: SectionTabId) => {
    return activeTab === 'all' || activeTab === sectionId;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        savedCount={savedProjects.length}
        onOpenSavedProjects={() => setIsSavedDrawerOpen(true)}
        onReset={handleReset}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenPortalApi={() => setIsPortalApiOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 pb-16">
        {/* Section 0: Query & Document Upload */}
        <QueryInputSection
          currentLanguage={currentLanguage}
          query={query}
          onQueryChange={setQuery}
          onAnalyze={() => handleAnalyze()}
          isLoading={isLoading}
          tenderDocText={tenderDocText}
          tenderFileName={tenderFileName}
          onClearUploadedDoc={() => {
            setTenderDocText('');
            setTenderFileName('');
          }}
          onDocUploaded={(name, text) => {
            setTenderFileName(name);
            setTenderDocText(text);
          }}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="max-w-5xl mx-auto px-4 mb-6">
            <div className="p-4 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-500 text-rose-800 dark:text-rose-200 text-sm">
              <strong>Error: </strong> {error}
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {result && (
          <div id="results-section">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4 animate-fade-in">
              {/* Outdated / Superseded Standard Alert Banner (Feature 6) */}
              {result.outdatedStandardAlert && result.outdatedStandardAlert.isOutdated && (
                <OutdatedStandardAlertCard
                  alert={result.outdatedStandardAlert}
                  onApplyUpdate={handleApplyOutdatedUpdate}
                />
              )}

              {/* Multi-Product Tender Items Schedule (Feature 4) */}
              {result.tenderItemsDetected && result.tenderItemsDetected.length > 1 && (
                <TenderLineItemsCard
                  items={result.tenderItemsDetected}
                  selectedItemIndex={result.selectedItemIndex || 0}
                  onSelectItem={handleSelectTenderItem}
                  ocrApplied={result.extractedRequirement.rawQuery.includes('OCR')}
                />
              )}

              {/* Case A: "NO RELIABLE MATCH" Integrity Guardrail Active (Feature 3) */}
              {result.isNoMatch || !result.primaryStandard ? (
                <NoReliableMatchCard
                  productName={result.extractedRequirement.product}
                  rawQuery={result.extractedRequirement.rawQuery}
                  explanation={result.noMatchExplanation}
                  clarifyingQuestions={result.clarifyingQuestions}
                  onSelectOption={(val, std) => handleAnswerClarifyingQuestion('', val, std)}
                  onResetSearch={handleReset}
                />
              ) : (
                /* Case B: SUCCESSFUL VERIFIED MATCH FOUND */
                <>
                  {/* Proactive Clarifying Questions (Feature 3) */}
                  {result.clarifyingQuestions && result.clarifyingQuestions.length > 0 && (
                    <ClarifyingQuestionsCard
                      questions={result.clarifyingQuestions}
                      onSelectOption={handleAnswerClarifyingQuestion}
                    />
                  )}

                  {/* Sticky Section Navigator & Filter */}
                  <SectionNavigator
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    gapsCount={result.specificationGaps.filter((g) => !g.isResolved).length}
                    alliedCount={result.relatedStandards.length}
                    isQCOCompulsory={result.primaryStandard.qco.isCompulsory}
                  />

                  {/* Summary Status Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                    <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold text-slate-900 dark:text-white">Analysis Status:</span>
                      <span>
                        Recommended standard <strong>{result.primaryStandard.isNumber}</strong>{' '}
                        (Confidence: <strong>{result.matchConfidence}% - {result.confidenceLevel}</strong>) with{' '}
                        {result.relatedStandards.length} normative references and{' '}
                        {result.specificationGaps.length} specification checks.
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <button
                        onClick={() => setIsPortalApiOpen(true)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Procurement Portal API</span>
                      </button>
                      <button
                        onClick={() => setIsArchModalOpen(true)}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>System Architecture</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* SECTION 1: AI REQUIREMENT EXTRACTION & SCOPE */}
                  {shouldShowSection('requirements') && (
                    <section id="section-requirements" className="space-y-2">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                          Section 01
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Your requirements
                        </h2>
                      </div>
                      <RequirementBadgeGrid requirement={result.extractedRequirement} />
                    </section>
                  )}

                  {/* SECTION 2: PRIMARY APPLICABLE STANDARD & EVIDENCE */}
                  {shouldShowSection('primary-standard') && (
                    <section id="section-primary-standard" className="space-y-4">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                          Section 02
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Recommended standard & editions
                        </h2>
                      </div>
                      <PrimaryStandardCard
                        standard={result.primaryStandard}
                        onOpenClauseBuilder={() => {
                          setActiveTab('all');
                          setTimeout(() => {
                            document
                              .getElementById('section-tender-clause')
                              ?.scrollIntoView({ behavior: 'smooth' });
                          }, 50);
                        }}
                      />

                      {/* Transparent Recommendation Evidence (Feature 9) */}
                      {result.evidence && (
                        <RecommendationEvidenceCard
                          evidence={result.evidence}
                          standardNumber={result.primaryStandard.isNumber}
                        />
                      )}
                    </section>
                  )}

                  {/* SECTION 3: STATUTORY CERTIFICATION & QCO CHECK (Feature 7) */}
                  {shouldShowSection('regulatory-qco') && (
                    <section id="section-regulatory-qco" className="space-y-2">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                          Section 03
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Certification requirements
                        </h2>
                      </div>
                      <RegulatoryCard
                        qco={result.primaryStandard.qco}
                        standardNumber={result.primaryStandard.isNumber}
                      />
                    </section>
                  )}

                  {/* SECTION 4: STANDARDS ECOSYSTEM & KNOWLEDGE GRAPH (Feature 5) */}
                  {shouldShowSection('knowledge-graph') && (
                    <section id="section-knowledge-graph" className="space-y-6">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                          Section 04
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Related standards
                        </h2>
                      </div>
                      <GraphVisualizer graphData={result.standardsGraph} />
                      <RelatedStandardsTable relatedStandards={result.relatedStandards} />
                    </section>
                  )}

                  {/* SECTION 5: SPECIFICATION GAP ANALYSIS */}
                  {shouldShowSection('gap-analysis') && (
                    <section id="section-gap-analysis" className="space-y-2">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                          Section 05
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Missing requirements
                        </h2>
                      </div>
                      <SpecificationGapsCard
                        gaps={result.specificationGaps}
                        onToggleResolveGap={handleToggleResolveGap}
                      />
                    </section>
                  )}

                  {/* SECTION 6: AUDIT TRAIL & TENDER CLAUSE EXPORTER */}
                  {shouldShowSection('tender-clause') && (
                    <section id="section-tender-clause" className="space-y-6">
                      <div className="flex items-center gap-2 pb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                          Section 06
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Review & export your draft
                        </h2>
                      </div>
                      <ExplainabilityAuditCard result={result} />
                      <ExportClauseCard
                        result={result}
                        onSaveProject={handleSaveProject}
                        isSaved={isCurrentSaved}
                      />
                    </section>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">MaanakSetu (मानकसेतु)</span>
            <span>• Problem Statement PS 26108</span>
          </div>
          <div>
            Discover standards. Review requirements. Prepare a better tender.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPortalApiOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Procurement REST API
            </button>
            <span>•</span>
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              System Architecture
            </button>
            <span>•</span>
            <a
              href="https://standards.bis.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 dark:text-slate-400 hover:underline"
            >
              BIS Standards Portal
            </a>
          </div>
        </div>
      </footer>

      {/* Drawers and Modals */}
      <SavedProjectsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        projects={savedProjects}
        onLoadProject={handleLoadProject}
        onDeleteProject={handleDeleteProject}
      />

      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Procurement Portal Integration API Modal (Feature 10) */}
      <PortalApiModal
        isOpen={isPortalApiOpen}
        onClose={() => setIsPortalApiOpen(false)}
      />
    </div>
  );
}
