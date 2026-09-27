'use client';

import React from 'react';
import { SupportedLanguage, translations } from '@/types/language';
import {
  ShieldCheck,
  BookOpen,
  BookmarkCheck,
  ExternalLink,
  Globe,
  Sun,
  Moon,
  Server,
} from 'lucide-react';

interface NavbarProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  savedCount: number;
  onOpenSavedProjects: () => void;
  onReset: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenPortalApi?: () => void;
  isAuthenticated?: boolean;
}

export default function Navbar({
  currentLanguage,
  onLanguageChange,
  savedCount,
  onOpenSavedProjects,
  onReset,
  theme,
  onToggleTheme,
  onOpenPortalApi,
  isAuthenticated = false,
}: NavbarProps) {
  const t = translations[currentLanguage] || translations.en;

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
                {t.appName}
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                BIS SmartSpec AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentLanguage === 'hi'
                ? 'मानकसेतु • एआई भारतीय मानक अनुशंसा एवं खरीद अनुपालन प्रणाली'
                : currentLanguage === 'te'
                ? 'మానక్ సేతు • ఏఐ భారతీయ ప్రమాణాల సిఫార్సు ఇంజిన్'
                : currentLanguage === 'ta'
                ? 'மானக் சேது • AI இந்தியத் தரநிலைகள் பரிந்துரை இயந்திரம்'
                : 'मानकसेतु • AI Indian Standards Recommendation & Procurement Engine'}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.officerSession}
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                >
                  {t.logout}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {t.publicViewMode}
              </span>
              <a
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
              >
                <span>{t.officerSignIn}</span>
              </a>
            </div>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Portal API Button */}
          {onOpenPortalApi && (
            <button
              onClick={onOpenPortalApi}
              className="hidden md:flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 transition cursor-pointer"
              title="Procurement Portal REST API"
            >
              <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.portalApi}</span>
            </button>
          )}

          {/* Official BIS Reference Link */}
          <a
            href="https://www.bis.gov.in/know-your-standard/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t.bisPortal}</span>
            <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
          </a>

          {/* Saved Projects Button */}
          <button
            onClick={onOpenSavedProjects}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition cursor-pointer"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{t.savedTenders}</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Multilingual Select Box Switcher (English & Hindi prioritized, Telugu & Tamil also available) */}
          <div className="relative flex items-center">
            <div className="absolute left-2.5 pointer-events-none text-slate-500 dark:text-slate-400">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <select
              id="language-select"
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label="Select Language / भाषा चुनें"
              className="pl-8 pr-7 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition shadow-sm appearance-none cursor-pointer"
            >
              <optgroup label="Main / मुख्य भाषाएँ">
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </optgroup>
              <optgroup label="Regional / प्रादेशिक">
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </optgroup>
            </select>
            <div className="absolute right-2.5 pointer-events-none text-slate-400 dark:text-slate-500 text-[9px]">
              ▼
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
