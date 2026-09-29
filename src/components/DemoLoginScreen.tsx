'use client';

import React, { useState, FormEvent } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  FileCheck2,
  ChevronDown,
  Info,
} from 'lucide-react';
import ManakSetuLogo from '@/components/ManakSetuLogo';

interface DemoLoginScreenProps {
  onLoginSuccess: (selectedRole?: string) => void;
}

export default function DemoLoginScreen({ onLoginSuccess }: DemoLoginScreenProps) {
  const [role, setRole] = useState('Procurement Officer');
  const [username, setUsername] = useState('procurement.officer');
  const [password, setPassword] = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRoleDefaultUsername = (r: string) => {
    if (r === 'Technical Scrutiny Officer') return 'technical.officer';
    if (r === 'Competent Financial Authority') return 'financial.authority';
    return 'procurement.officer';
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setUsername(getRoleDefaultUsername(newRole));
    setPassword('Demo@1234');
    setErrorMessage('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      // Demo authentication: does not require real credentials or external auth
      try {
        localStorage.setItem('manaksetu_demo_officer_logged_in', 'true');
        localStorage.setItem('manaksetu_officer_role', role);
      } catch (e) {
        console.warn('Could not save login state:', e);
      }
      setIsSubmitting(false);
      onLoginSuccess(role);
    }, 350);
  };

  const handleFillDemo = () => {
    setUsername(getRoleDefaultUsername(role));
    setPassword('Demo@1234');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-[#0F1715] text-charcoal dark:text-[#F1F5F3] flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
      {/* Background Decorative Accents */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 dark:bg-brand-500/5 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-500/10 dark:bg-accent-500/5 blur-3xl pointer-events-none"
      />

      {/* Top Header Strip */}
      <header className="w-full bg-white/90 dark:bg-[#16221F]/90 backdrop-blur-md border-b border-govborder dark:border-[#263833] px-4 sm:px-8 py-3 z-10 sticky top-0 shadow-gov-sm transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ManakSetuLogo size="md" showTagline={false} />
          </div>

          <div className="flex items-center gap-2 text-xs text-govmuted dark:text-[#94A39D]">
            <Building2 className="w-3.5 h-3.5 text-brand" />
            <span className="hidden sm:inline">Central Public Procurement Portal • GeM Standards Cell</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="gov-card p-7 sm:p-8 bg-white dark:bg-[#16221F] border border-govborder dark:border-[#263833] shadow-gov-modal rounded-gov transition-colors">
            {/* Header Titles */}
            <div className="text-center space-y-2 pb-5 border-b border-govborder dark:border-[#263833]">
              <div className="inline-flex items-center justify-center p-2 rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-700/40 text-brand mb-1">
                <ShieldCheck className="w-7 h-7 text-brand" />
              </div>

              <div className="flex items-center justify-center">
                <h1 className="text-xl font-extrabold tracking-tight text-charcoal dark:text-white">
                  MaanakSetu
                </h1>
              </div>

              <p className="text-xs text-govmuted dark:text-[#94A39D] font-medium">
                Public Procurement Standards Intelligence
              </p>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 text-brand dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  DEMO ENVIRONMENT
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-5">
              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-200 mb-1.5">
                  Role:
                </label>
                <div className="relative">
                  <select
                    id="demo-role-select"
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full appearance-none text-xs rounded-lg border border-govborder dark:border-[#263833] bg-ivory-50 dark:bg-[#1C2C28] px-3.5 py-2.5 pr-9 text-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand font-medium cursor-pointer transition"
                  >
                    <option value="Procurement Officer">Procurement Officer</option>
                    <option value="Technical Scrutiny Officer">Technical Scrutiny Officer</option>
                    <option value="Competent Financial Authority">Competent Financial Authority</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-govmuted dark:text-[#94A39D] absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-200 mb-1.5">
                  Username:
                </label>
                <div className="relative">
                  <input
                    id="demo-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={getRoleDefaultUsername(role)}
                    className="w-full text-xs rounded-lg border border-govborder dark:border-[#263833] bg-ivory-50 dark:bg-[#1C2C28] pl-9 pr-3.5 py-2.5 text-charcoal dark:text-white placeholder:text-govmuted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
                  />
                  <User className="w-4 h-4 text-govmuted dark:text-[#94A39D] absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-charcoal dark:text-gray-200 mb-1.5">
                  Password:
                </label>
                <div className="relative">
                  <input
                    id="demo-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Demo@1234"
                    className="w-full text-xs rounded-lg border border-govborder dark:border-[#263833] bg-ivory-50 dark:bg-[#1C2C28] pl-9 pr-10 py-2.5 text-charcoal dark:text-white placeholder:text-govmuted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
                  />
                  <Lock className="w-4 h-4 text-govmuted dark:text-[#94A39D] absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 text-govmuted hover:text-charcoal dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="demo-signin-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-gov bg-brand hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-gov transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entering Demo Environment...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in as {role}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials Box */}
            <div className="mt-5 p-3 rounded-lg bg-ivory-100 dark:bg-[#1C2C28] border border-govborder dark:border-[#263833] text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-charcoal dark:text-gray-200">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>Demo Credentials:</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[10px] text-brand hover:underline font-semibold"
                >
                  Auto-Fill Demo
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-govmuted dark:text-[#94A39D]">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-charcoal dark:text-gray-300">Username:</span>
                  <span className="text-brand dark:text-brand-300 font-semibold">{username}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-charcoal dark:text-gray-300">Password:</span>
                  <span className="text-brand dark:text-brand-300 font-semibold">Demo@1234</span>
                </div>
              </div>
            </div>

            {/* Small Footer Notice */}
            <div className="mt-4 text-center">
              <span className="text-[11px] text-govmuted dark:text-[#94A39D] font-medium">
                DEMO ENVIRONMENT • {role} • Demo Account
              </span>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-3 rounded-lg bg-white/70 dark:bg-[#16221F]/70 border border-govborder dark:border-[#263833] text-[11px] text-govmuted dark:text-[#94A39D] flex items-center justify-center gap-2 text-center">
            <Info className="w-3.5 h-3.5 text-brand shrink-0" />
            <span>General Financial Rules (GFR 2017) &amp; BIS Act 2016 Compliant Demo</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 dark:bg-[#16221F]/80 border-t border-govborder dark:border-[#263833] py-3.5 px-4 text-center text-xs text-govmuted dark:text-[#94A39D] z-10 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <p>
            मानकसेतु · Bureau of Indian Standards (BIS) SmartSpec AI Procurement Engine
          </p>
          <div className="flex items-center gap-3">
            <span>SIH262108 Benchmark Prototype</span>
            <span>•</span>
            <span>Government of India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
