'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Network,
  FileCheck2,
  BookOpen,
  History,
  Layers,
  Sparkles,
  Cpu,
  Globe2,
  Menu,
  X,
  ChevronDown,
  Building2,
  UserCheck,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';

import ManakSetuLogo from '@/components/ManakSetuLogo';
import DemoLoginScreen from '@/components/DemoLoginScreen';
import MaanakChatbot from '@/components/MaanakChatbot';
import LandingWorkspaceView from '@/components/views/LandingWorkspaceView';
import AnalyzeRequirementView from '@/components/views/AnalyzeRequirementView';
import AnalysisResultsView from '@/components/views/AnalysisResultsView';
import StandardsExplorerView from '@/components/views/StandardsExplorerView';
import KnowledgeGraphView from '@/components/views/KnowledgeGraphView';
import TenderSpecGeneratorView from '@/components/views/TenderSpecGeneratorView';
import AnalysisHistoryView from '@/components/views/AnalysisHistoryView';

import RecommendationTraceabilityDrawer from '@/components/RecommendationTraceabilityDrawer';
import StandardDetailModal from '@/components/StandardDetailModal';
import SystemArchitectureModal from '@/components/SystemArchitectureModal';
import AnalysisProgressModal from '@/components/AnalysisProgressModal';

import { SupportedLanguage } from '@/types/language';
import { RecommendationResult, SavedTenderProject } from '@/types/procurement';
import { IndianStandard } from '@/types/standards';
import { ALL_PROCUREMENT_SCENARIOS, SCENARIO_LED, ProcurementScenario } from '@/data/procurementScenarios';
import { buildOfficialTenderSpecificationClause } from '@/lib/specExporter';
import { SECURITY_TRUST_NOTICE } from '@/lib/officialSources';

export type ActiveAppView = 'landing' | 'analyze' | 'results' | 'explorer' | 'graph' | 'generator' | 'history';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveAppView>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');

  // Demo Login & Theme states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Input state
  const [query, setQuery] = useState<string>(SCENARIO_LED.sampleQuery);
  const [tenderDocText, setTenderDocText] = useState<string>('');
  const [tenderFileName, setTenderFileName] = useState<string>('');

  // Analysis result state
  const [result, setResult] = useState<RecommendationResult | null>(SCENARIO_LED.mockResult);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
  const [pendingAnalyzeData, setPendingAnalyzeData] = useState<RecommendationResult | null>(null);

  // Modals & Drawers state
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedStandardForModal, setSelectedStandardForModal] = useState<IndianStandard | null>(null);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState<boolean>(false);

  // Officer role state
  const [officerRole, setOfficerRole] = useState<string>('Procurement Officer');

  // History & Saved tenders
  const [savedProjects, setSavedProjects] = useState<SavedTenderProject[]>([]);

  // Workspace selector state
  const [activeWorkspace] = useState<string>('Central Public Procurement Portal • GeM Standards Cell');

  // Handle Escape key to close navigation drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavDrawerOpen) {
        setIsNavDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNavDrawerOpen]);

  // Load language preference, theme, and demo auth on mount
  useEffect(() => {
    try {
      // 1. Theme
      const savedTheme = localStorage.getItem('manaksetu_theme') as 'light' | 'dark' | null;
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // 2. Demo Auth & Role
      const demoAuth = localStorage.getItem('manaksetu_demo_officer_logged_in');
      const savedRole = localStorage.getItem('manaksetu_officer_role');
      if (savedRole) {
        setOfficerRole(savedRole);
      }
      if (demoAuth === 'false') {
        setIsLoggedIn(false);
      } else if (demoAuth === 'true') {
        setIsLoggedIn(true);
      } else {
        // First visit: show Demo Login screen
        setIsLoggedIn(false);
      }

      // 3. Language & Projects
      const savedLang = localStorage.getItem('manaksetu_lang') as SupportedLanguage | null;
      if (savedLang && ['en', 'hi', 'te', 'ta', 'kn'].includes(savedLang)) {
        setSelectedLanguage(savedLang);
      }
      const saved = localStorage.getItem('manaksetu_saved_projects');
      if (saved) {
        setSavedProjects(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load preferences:', e);
    } finally {
      setIsAuthChecked(true);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('manaksetu_theme', nextTheme);
    } catch (e) {}
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('manaksetu_demo_officer_logged_in');
    } catch (e) {}
    setIsLoggedIn(false);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    try {
      localStorage.setItem('manaksetu_lang', lang);
    } catch (e) {
      console.warn('Failed to save language:', e);
    }
  };

  // Trigger analysis pipeline
  const handleAnalyze = async (overrideQuery?: string) => {
    const textToAnalyze = overrideQuery !== undefined ? overrideQuery : (tenderDocText ? `${tenderDocText}\n${query}` : query);
    if (!textToAnalyze.trim()) return;

    setIsLoading(true);
    setIsProgressModalOpen(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: overrideQuery !== undefined ? overrideQuery : query,
          tenderDocText,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze specification');
      }

      setPendingAnalyzeData(data);
    } catch (err: any) {
      console.warn('Analysis error:', err);
      // Fallback deterministically to matching scenario or default LED scenario
      const fallbackScenario = ALL_PROCUREMENT_SCENARIOS.find((s) =>
        textToAnalyze.toLowerCase().includes(s.title.toLowerCase().split(' ')[0])
      ) || SCENARIO_LED;

      const fallbackResult = JSON.parse(JSON.stringify(fallbackScenario.mockResult));
      fallbackResult.extractedRequirement.rawQuery = textToAnalyze;
      setPendingAnalyzeData(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  // When AI progress modal finishes 7-step animation
  const handleProgressModalComplete = () => {
    setIsProgressModalOpen(false);
    const finalData = pendingAnalyzeData || result;
    if (finalData) {
      setResult(finalData);
      setPendingAnalyzeData(null);

      // Automatically register to Analysis History
      const newSavedProject: SavedTenderProject = {
        id: `proj-${Date.now()}`,
        title: finalData.extractedRequirement.product || 'Procurement Specification',
        category: finalData.primaryStandard?.department || 'General',
        primaryStandardNumber: finalData.primaryStandard?.isNumber || 'IS Benchmark',
        createdAt: new Date().toISOString(),
        extractedRequirement: finalData.extractedRequirement,
        resolvedGaps: finalData.specificationGaps.filter((g) => g.isResolved).map((g) => g.id),
        mockResult: finalData,
        sampleQuery: query || finalData.extractedRequirement.rawQuery,
        shortDesc: finalData.evidence?.whyApplies || finalData.primaryStandard?.scope || '',
        metrics: {
          requirementsIdentified:
            4 + Object.keys(finalData.extractedRequirement.otherSpecs || {}).length,
          relatedStandards: finalData.relatedStandards.length,
          potentialGaps: finalData.specificationGaps.length,
        },
      };

      setSavedProjects((prev) => {
        const updated = [newSavedProject, ...prev.filter((p) => p.title !== newSavedProject.title)];
        try {
          localStorage.setItem('manaksetu_saved_projects', JSON.stringify(updated));
        } catch (e) {
          console.warn('Storage failed:', e);
        }
        return updated;
      });
    }
    setActiveView('results');
  };

  // Scenario loading: populates requirement and navigates to Analyze view
  const handleSelectScenario = (scenario: ProcurementScenario) => {
    setQuery(scenario.sampleQuery);
    setTenderDocText('');
    setTenderFileName('');
    setResult(scenario.mockResult);
    setActiveView('analyze');
  };

  // Gap toggle handling
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
    updatedResult.generatedTenderClause = buildOfficialTenderSpecificationClause(
      updatedResult,
      [],
      selectedLanguage
    );
    setResult(updatedResult);
  };

  // Standard modal viewer
  const handleViewStandardDetails = (standard: IndianStandard) => {
    setSelectedStandardForModal(standard);
    setIsDetailModalOpen(true);
  };

  // Load a standard directly from explorer
  const handleSelectStandardFromExplorer = (standard: IndianStandard) => {
    const matching = ALL_PROCUREMENT_SCENARIOS.find((s) =>
      s.primaryStandardNumber.includes(standard.isNumber.split(' ')[1] || 'XYZ')
    );

    if (matching) {
      handleSelectScenario(matching);
    } else {
      setQuery(`Procurement specification conforming to ${standard.isNumber}: ${standard.title}`);
      setTenderDocText('');
      setTenderFileName('');
      setActiveView('analyze');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    try {
      const savedRole = localStorage.getItem('manaksetu_officer_role');
      if (savedRole) {
        setOfficerRole(savedRole);
      }
    } catch {}
  };

  if (isAuthChecked && !isLoggedIn) {
    return <DemoLoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col antialiased">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-govborder shadow-gov-sm px-4 lg:px-6 py-2.5 print-hide">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left Brand and Hamburger Menu (☰) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNavDrawerOpen(!isNavDrawerOpen)}
              className="p-2 rounded-lg text-charcoal hover:text-brand hover:bg-ivory-100 transition-colors border border-govborder flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand/30"
              aria-label="Toggle Navigation Drawer"
              title="Open Navigation Menu (☰)"
            >
              <Menu className="w-5 h-5 text-charcoal" />
            </button>

            <ManakSetuLogo
              size="md"
              showTagline={false}
              onClick={() => setActiveView('landing')}
            />

            {/* Current Workspace Pill */}
            <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-govborder text-xs text-govmuted">
              <Building2 className="w-3.5 h-3.5 text-brand" />
              <span className="font-semibold text-charcoal">{activeWorkspace}</span>
            </div>
          </div>

          {/* Right Controls: Theme Toggle, Language, Architecture Info & Officer Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ivory-100 hover:bg-ivory-200 border border-govborder text-xs font-semibold text-charcoal transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-accent" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-brand" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-ivory-50 border border-govborder px-2.5 py-1 rounded-lg">
              <Globe2 className="w-3.5 h-3.5 text-brand" />
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-semibold text-charcoal outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </div>

            {/* System Architecture Button */}
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ivory-100 hover:bg-ivory-200 border border-govborder text-xs font-semibold text-charcoal transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-brand" />
              <span>Architecture</span>
            </button>

            {/* Officer Profile Badge with Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-govborder">
              <div
                className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 text-brand flex items-center justify-center font-bold text-xs shadow-gov-sm"
                title={`${officerRole || 'Procurement Officer'} • Demo Account`}
              >
                {officerRole === 'Technical Scrutiny Officer'
                  ? 'TS'
                  : officerRole === 'Competent Financial Authority'
                  ? 'CA'
                  : 'PO'}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <div className="font-bold text-charcoal flex items-center gap-1">
                  <span>{officerRole || 'Procurement Officer'}</span>
                  <span title="Verified Demo Account">
                    <UserCheck className="w-3.5 h-3.5 text-secgreen" />
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-brand tracking-wide uppercase">Demo Account</div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 rounded-lg text-govmuted hover:text-govdanger hover:bg-rose-50 transition-colors ml-0.5 cursor-pointer"
                title="Sign out of Demo Session"
                aria-label="Sign out of Demo Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Header Navigation Strip for Fast 1-Click Tab Switching on Desktop */}
      <nav aria-label="Quick Navigation" className="hidden lg:flex items-center justify-between border-b border-govborder bg-white/80 px-4 lg:px-8 py-2 text-xs print-hide">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveView('landing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'landing'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setActiveView('analyze')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'analyze'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Analyze Requirement</span>
          </button>

          <button
            onClick={() => setActiveView('results')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'results'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Analysis Results</span>
            {result && (
              <span className="w-2 h-2 rounded-full bg-secgreen ring-2 ring-emerald-300 animate-pulse ml-0.5" title="Active Analysis Loaded" />
            )}
          </button>

          <button
            onClick={() => setActiveView('graph')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'graph'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Knowledge Graph</span>
          </button>

          <button
            onClick={() => setActiveView('generator')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'generator'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Spec Generator</span>
          </button>

          <button
            onClick={() => setActiveView('explorer')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'explorer'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Standards Explorer</span>
          </button>

          <button
            onClick={() => setActiveView('history')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeView === 'history'
                ? 'bg-brand text-white shadow-gov-sm font-bold'
                : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Analysis History</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-govmuted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secgreen" />
            <span>BIS Database: <strong>v2024.9 Active</strong></span>
          </span>
        </div>
      </nav>

      {/* Navigation Drawer Overlay Backdrop: Functional click-outside target with ZERO blur and ZERO dimming */}
      <div
        className={`fixed inset-0 z-50 bg-black/[0.02] transition-opacity duration-200 print-hide ${
          isNavDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsNavDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Collapsible Navigation Drawer: Left-side floating overlay (285px wide, sits smoothly above sharp workspace) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[60] h-full w-[285px] max-w-[85vw] bg-white border-r border-govborder shadow-xl flex flex-col justify-between p-5 transform transition-transform duration-200 ease-out print-hide ${
          isNavDrawerOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'
        }`}
        aria-label="Navigation Drawer"
        role="dialog"
        aria-modal={isNavDrawerOpen}
      >
        {/* Drawer Header with Logo & Close Button */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-govborder">
            <ManakSetuLogo
              size="sm"
              showTagline={false}
              onClick={() => {
                setActiveView('landing');
                setIsNavDrawerOpen(false);
              }}
            />
            <button
              onClick={() => setIsNavDrawerOpen(false)}
              className="p-1.5 rounded-lg text-govmuted hover:text-charcoal hover:bg-ivory-100 transition-colors border border-transparent hover:border-govborder"
              aria-label="Close Navigation Drawer"
              title="Close Menu (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation Items */}
          <div className="space-y-6 pt-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-govmuted px-3 block mb-2">
                Procurement Workflow
              </span>

              <button
                onClick={() => {
                  setActiveView('landing');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'landing'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4" />
                  <span>Workspace</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveView('analyze');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'analyze'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Analyze Requirement</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveView('results');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'results'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  <span>Analysis Results</span>
                </div>
                {result && (
                  <span className="w-2 h-2 rounded-full bg-secgreen" title="Active Analysis Loaded" />
                )}
              </button>

              <button
                onClick={() => {
                  setActiveView('graph');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'graph'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Network className="w-4 h-4" />
                  <span>Knowledge Graph</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveView('generator');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'generator'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4" />
                  <span>Spec Generator</span>
                </div>
              </button>
            </div>

            {/* Exploratory Section */}
            <div className="space-y-1 pt-4 border-t border-govborder">
              <span className="text-[10px] font-bold uppercase tracking-wider text-govmuted px-3 block mb-2">
                Standards Intelligence
              </span>

              <button
                onClick={() => {
                  setActiveView('explorer');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'explorer'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Standards Explorer</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveView('history');
                  setIsNavDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-gov text-xs font-semibold transition-all ${
                  activeView === 'history'
                    ? 'bg-brand-50 text-brand font-bold border border-brand-200 shadow-gov-sm'
                    : 'text-charcoal hover:bg-ivory-100 hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4" />
                  <span>Analysis History</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Bottom: Trust Badge & Settings */}
        <div className="space-y-3 pt-4 border-t border-govborder text-xs">
          <button
            onClick={() => {
              setIsArchModalOpen(true);
              setIsNavDrawerOpen(false);
            }}
            className="w-full flex items-center gap-2 p-2 rounded-lg bg-ivory-50 hover:bg-ivory-100 border border-govborder text-govmuted hover:text-charcoal font-medium text-[11px] transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-brand" />
            <span>Deterministic Verification</span>
          </button>

          <div className="p-2.5 rounded-lg bg-ivory-50 border border-govborder text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-charcoal">
              <span className="w-2 h-2 rounded-full bg-secgreen" />
              <span>BIS Database: v2024.9</span>
            </div>
            <p className="text-govmuted text-[10px] leading-tight">
              Quality Control Orders current up to gazette S.O. 4349(E).
            </p>
          </div>
        </div>
      </aside>

      {/* Primary Full-Width Main Content Workspace */}
      <main className="flex-1 w-full px-4 sm:px-6 md:px-8 py-6 min-w-0">
          {activeView === 'landing' && (
            <LandingWorkspaceView
              onAnalyzeRequirementClick={() => setActiveView('analyze')}
              onSelectScenario={(scen) => {
                handleSelectScenario(scen);
              }}
              onOpenArchitecture={() => setIsArchModalOpen(true)}
            />
          )}

          {activeView === 'analyze' && (
            <AnalyzeRequirementView
              query={query}
              setQuery={setQuery}
              tenderDocText={tenderDocText}
              setTenderDocText={setTenderDocText}
              tenderFileName={tenderFileName}
              setTenderFileName={setTenderFileName}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          )}

          {activeView === 'results' && result && (
            <AnalysisResultsView
              result={result}
              onWhyRecommendedClick={() => setIsTraceabilityOpen(true)}
              onViewStandardDetails={handleViewStandardDetails}
              onToggleResolveGap={handleToggleResolveGap}
              onGenerateSpecClick={() => setActiveView('generator')}
              onViewKnowledgeGraphClick={() => setActiveView('graph')}
              onReAnalyzeClick={() => setActiveView('analyze')}
            />
          )}

          {activeView === 'results' && !result && (
            <div className="max-w-4xl mx-auto py-12 text-center gov-card p-12 bg-white border border-govborder space-y-4">
              <div className="w-14 h-14 rounded-full bg-brand-50 text-brand mx-auto flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-charcoal">No Analysis Result Active</h3>
              <p className="text-xs text-govmuted max-w-md mx-auto">
                Please enter a procurement requirement in the analyzer or load a pre-configured benchmark tender.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    handleSelectScenario(SCENARIO_LED);
                    handleAnalyze(SCENARIO_LED.sampleQuery);
                  }}
                  className="px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-700 text-white text-xs font-semibold shadow-gov inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Analyze LED Street Lighting Sample</span>
                </button>
                <button
                  onClick={() => setActiveView('analyze')}
                  className="px-5 py-2.5 rounded-lg bg-white border border-govborder text-charcoal text-xs font-semibold"
                >
                  Go to Analyze Requirement
                </button>
              </div>
            </div>
          )}

          {activeView === 'graph' && (
            <KnowledgeGraphView
              result={result}
              onViewStandardDetails={handleViewStandardDetails}
              onLoadDefaultBenchmark={() => {
                setResult(SCENARIO_LED.mockResult);
                setQuery(SCENARIO_LED.sampleQuery);
              }}
            />
          )}

          {activeView === 'generator' && (
            <TenderSpecGeneratorView
              result={result}
              onNavigateToAnalysis={() => setActiveView('analyze')}
              onLoadDefaultBenchmark={() => {
                setResult(SCENARIO_LED.mockResult);
                setQuery(SCENARIO_LED.sampleQuery);
              }}
            />
          )}

          {activeView === 'explorer' && (
            <StandardsExplorerView
              onSelectStandardForAnalysis={handleSelectStandardFromExplorer}
              onViewStandardDetails={handleViewStandardDetails}
            />
          )}

          {activeView === 'history' && (
            <AnalysisHistoryView
              savedProjects={savedProjects}
              onSelectScenario={(scen) => {
                setQuery(scen.sampleQuery);
                setTenderDocText('');
                setTenderFileName('');
                setResult(scen.mockResult);
                setActiveView('results');
              }}
              onRestoreSavedProject={(proj) => {
                if (proj.mockResult) {
                  setResult(proj.mockResult);
                  setQuery(proj.sampleQuery || proj.extractedRequirement.rawQuery);
                  setActiveView('results');
                }
              }}
            />
          )}
        </main>

      {/* 3-Step AI Analysis Animation Progress Modal */}
      <AnalysisProgressModal
        isOpen={isProgressModalOpen}
        onComplete={handleProgressModalComplete}
      />

      {/* Recommendation Traceability Drawer */}
      <RecommendationTraceabilityDrawer
        isOpen={isTraceabilityOpen}
        onClose={() => setIsTraceabilityOpen(false)}
        result={result}
      />

      {/* Standard Detail Modal */}
      <StandardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        standard={selectedStandardForModal}
      />

      {/* System Architecture and Verification Modal */}
      <SystemArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-govborder bg-white py-6 px-4 text-xs text-govmuted print-hide">
        <div className="gov-workspace-container space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-charcoal">MaanakSetu</span>
              <span>•</span>
              <span>AI-Powered Procurement Standards Copilot</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>Bureau of Indian Standards (BIS) Cross-Referencing</span>
              <span>•</span>
              <span>CPWD &amp; GeM Conforming</span>
              <span>•</span>
              <span>General Financial Rules (GFR 2017) Aligned</span>
            </div>
          </div>
          <div className="pt-2 border-t border-govborder/60 text-center text-[11px] text-govmuted/90">
            {SECURITY_TRUST_NOTICE}
          </div>
        </div>
      </footer>

      {/* Maanak — BIS Procurement Copilot Chatbot */}
      <MaanakChatbot
        result={result}
        activeView={activeView}
        onNavigateToView={(v) => setActiveView(v as ActiveAppView)}
      />
    </div>
  );
}
