'use client';

import React from 'react';
import { SupportedLanguage } from '@/types/language';
import {
  ShieldCheck,
  BookOpen,
  BookmarkCheck,
  ExternalLink,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  savedCount: number;
  onOpenSavedProjects: () => void;
  onReset: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({
  currentLanguage,
  onLanguageChange,
  savedCount,
  onOpenSavedProjects,
  onReset,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const languageOptions: { code: SupportedLanguage; label: string; nativeName: string }[] = [
    { code: 'en', label: 'English', nativeName: 'EN' },
    { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 shadow-md shadow-blue-500/20 ring-1 ring-white/20">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Stylized bridge arch (Setu) + standard pillar mark */}
              <path d="M3 19c3-6 7-9 9-9s6 3 9 9" />
              <path d="M12 10v9" />
              <circle cx="12" cy="5" r="2.5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 via-slate-900 to-amber-600 dark:from-white dark:via-slate-100 dark:to-amber-400 bg-clip-text text-transparent">
                MaanakSetu
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                BIS SmartSpec AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              मानकसेतु • AI Indian Standards Recommendation & Procurement Engine
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Official BIS Reference Link */}
          <a
            href="https://www.bis.gov.in/know-your-standard/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>BIS Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          </a>

          {/* Saved Projects Button */}
          <button
            onClick={onOpenSavedProjects}
            className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline">Saved Tenders</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Multilingual Switcher */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-0.5">
            <div className="px-1.5 sm:px-2 text-slate-500">
              <Globe className="w-3.5 h-3.5" />
            </div>
            {languageOptions.map((opt) => (
              <button
                key={opt.code}
                onClick={() => onLanguageChange(opt.code)}
                className={`px-2 sm:px-2.5 py-1 text-xs rounded-md font-medium transition ${
                  currentLanguage === opt.code
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={opt.label}
              >
                {opt.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
