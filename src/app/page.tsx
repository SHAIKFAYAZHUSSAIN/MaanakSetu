'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import QueryInputSection from '@/components/QueryInputSection';
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
import { SupportedLanguage } from '@/types/language';
import { RecommendationResult, SavedTenderProject } from '@/types/procurement';
import { buildOfficialTenderSpecificationClause } from '@/lib/specExporter';
import { Sparkles, HelpCircle, ArrowUpRight, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
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
  const [savedProjects, setSavedProjects] = useState<SavedTenderProject[]>([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);

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
  const handleAnalyze = async () => {
    if (!query.trim() && !tenderDocText.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsCurrentSaved(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          tenderDocText,
          language: currentLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze specification');
      }

      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'An error occurred during retrieval');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial analysis automatically so the page opens up ready and impressive
  useEffect(() => {
    handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // Regenerate the official tender specification clause with the resolved items
    updatedResult.generatedTenderClause = buildOfficialTenderSpecificationClause(updatedResult);

    setResult(updatedResult);
  };

  // Save current project to library
  const handleSaveProject = () => {
    if (!result) return;

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
    // Re-run analysis for loaded query
    setTimeout(() => {
      handleAnalyze();
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        savedCount={savedProjects.length}
        onOpenSavedProjects={() => setIsSavedDrawerOpen(true)}
        onReset={handleReset}
      />

      {/* Hero & Query Input Section */}
      <main className="flex-1 pb-16">
        <QueryInputSection
          currentLanguage={currentLanguage}
          query={query}
          onQueryChange={setQuery}
          onAnalyze={handleAnalyze}
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
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-sm">
              <strong>Error: </strong> {error}
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {result && (
          <div id="results-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4 animate-fade-in">
            {/* Top Toolbar / Architecture Link */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-white">Hybrid Retrieval Complete:</span>
                <span>Semantic & Graph Match for {result.extractedRequirement.product}</span>
              </div>

              <button
                onClick={() => setIsArchModalOpen(true)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View 10-Step AI & Graph Architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 1. AI Requirement Extraction Grid */}
            <RequirementBadgeGrid requirement={result.extractedRequirement} />

            {/* 2. Primary Standard Card */}
            <PrimaryStandardCard
              standard={result.primaryStandard}
              onOpenClauseBuilder={() => {
                document.getElementById('export-clause-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3. Statutory Certification & QCO Regulatory Engine */}
            <RegulatoryCard
              qco={result.primaryStandard.qco}
              standardNumber={result.primaryStandard.isNumber}
            />

            {/* 4. Specification Gap Analysis (Missing Requirements Killer Feature) */}
            <SpecificationGapsCard
              gaps={result.specificationGaps}
              onToggleResolveGap={handleToggleResolveGap}
            />

            {/* 5. Interactive Standards Knowledge Graph Visualizer (Killer Feature) */}
            <GraphVisualizer graphData={result.standardsGraph} />

            {/* 6. Normative & Allied Standards Table */}
            <RelatedStandardsTable relatedStandards={result.relatedStandards} />

            {/* 7. Explainable AI Audit Trail */}
            <ExplainabilityAuditCard result={result} />

            {/* 8. Exportable Tender Specification Clause */}
            <div id="export-clause-section">
              <ExportClauseCard
                result={result}
                onSaveProject={handleSaveProject}
                isSaved={isCurrentSaved}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">MaanakSetu (मानकसेतु)</span>
            <span>• Problem Statement PS 26108</span>
          </div>
          <div>
            Built with Hybrid RAG, Knowledge Graph Traversal, and Deterministic Regulatory Verification for BIS
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-medium underline"
            >
              System Architecture
            </button>
            <span>•</span>
            <a
              href="https://standards.bis.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-300"
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
    </div>
  );
}
