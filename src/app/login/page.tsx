'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  Key,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  Building2,
  Copy,
  Check,
  Zap,
  BookOpen,
  FileCheck2,
  LogOut,
  Shield,
  Award,
} from 'lucide-react';
import ManakSetuLogo from '@/components/ManakSetuLogo';

export default function LoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [demoFilled, setDemoFilled] = useState(false);

  // Existing auth check
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [existingOfficer, setExistingOfficer] = useState<{
    authenticated: boolean;
    email?: string;
    officerName?: string;
    officerDesignation?: string;
  } | null>(null);

  // Check if session is already active
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setExistingOfficer(data);
          }
        }
      } catch (err) {
        console.warn('Status check warning:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkStatus();
  }, []);

  // Copy helper
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Pre-fill demo credentials when clicking "Officer Login Demo"
  const handleOfficerLoginDemo = () => {
    setEmail('officer@maanaksetu.demo');
    setPassword('password@123');
    setErrorMessage('');
    setDemoFilled(true);
  };

  // Normal Form Submission (Triggered by clicking "Sign In as Procurement Officer")
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please provide both your officer email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Invalid officer credentials. Please check and try again.');
      }

      window.location.assign('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  // Handle Logout if already signed in
  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
      });
      setExistingOfficer(null);
      setEmail('');
      setPassword('');
      setDemoFilled(false);
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col justify-between relative overflow-hidden bg-hero-pattern">
      {/* Background Decorative Glow Elements */}
      <div
        aria-hidden="true"
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none"
      />

      {/* Top Navigation Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-govborder px-4 sm:px-8 py-3.5 z-10 sticky top-0 shadow-gov-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ManakSetuLogo size="md" showTagline={false} onClick={() => router.push('/')} />
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand text-[11px] font-bold border border-brand-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <span>OFFICER PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal hover:text-brand px-3 py-1.5 rounded-lg border border-govborder hover:bg-ivory-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue in Public View Mode</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12 z-10 flex items-center">
        <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Institutional Mission & Role Context (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand border border-brand-200 shadow-gov-sm">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>Authorized Procurement Officer Access</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent-50 text-accent border border-accent-200">
                <Sparkles className="w-3 h-3" />
                <span>SIH262108 Benchmark Engine</span>
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal tracking-tight leading-[1.15]">
                Procurement Officer Sign In &amp; <br />
                <span className="text-brand underline decoration-accent/40 decoration-4 underline-offset-4">
                  Standards Verification
                </span>
              </h1>
              <p className="text-sm sm:text-base text-govmuted leading-relaxed max-w-xl pt-1">
                Authenticating as an authorized Procurement Officer unlocks custom tender creation, PDF/DOCX document
                upload &amp; semantic parsing, and GFR 144(i) compliant tender clause exports.
              </p>
            </div>

            {/* Officer Privileges List */}
            <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-gov bg-white border border-govborder shadow-gov-sm space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-charcoal">
                  <FileCheck2 className="w-4 h-4 text-brand" />
                  <span>Custom Tender Creation</span>
                </div>
                <p className="text-[11px] text-govmuted leading-normal">
                  Upload custom tender schedules (PDF/DOCX) or formulate new requirements from scratch.
                </p>
              </div>

              <div className="p-3.5 rounded-gov bg-white border border-govborder shadow-gov-sm space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-charcoal">
                  <Award className="w-4 h-4 text-brand" />
                  <span>Mandatory QCO Auditing</span>
                </div>
                <p className="text-[11px] text-govmuted leading-normal">
                  Verify Section 29 BIS Act Quality Orders and compulsory certification eligibility.
                </p>
              </div>

              <div className="p-3.5 rounded-gov bg-white border border-govborder shadow-gov-sm space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-charcoal">
                  <FileText className="w-4 h-4 text-brand" />
                  <span>Official GFR 144(i) Export</span>
                </div>
                <p className="text-[11px] text-govmuted leading-normal">
                  Generate standards-ready 9-clause procurement specifications in PDF and TXT formats.
                </p>
              </div>

              <div className="p-3.5 rounded-gov bg-white border border-govborder shadow-gov-sm space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-charcoal">
                  <Shield className="w-4 h-4 text-brand" />
                  <span>CVC &amp; CAG Traceability</span>
                </div>
                <p className="text-[11px] text-govmuted leading-normal">
                  Inspect transparent explainability audit trails with mathematical cosine similarity metrics.
                </p>
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="gov-card p-4 sm:p-5 bg-white border border-govborder shadow-gov">
              <div className="flex items-center justify-between mb-3 border-b border-govborder pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand" />
                  <span>Access Permission Matrix</span>
                </span>
                <span className="text-[10px] text-govmuted">GFR 2017 &amp; BIS Normative Rules</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal font-medium">Browse 24+ Indian Standards &amp; Gazette QCOs</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-secgreen font-semibold">Public: Yes</span>
                    <span className="text-secgreen font-semibold">Officer: Yes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal font-medium">Interactive Normative Knowledge Graphs</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-secgreen font-semibold">Public: Yes</span>
                    <span className="text-secgreen font-semibold">Officer: Yes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-ivory-200">
                  <span className="text-charcoal font-medium">Upload Tender Schedules (PDF/DOCX)</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-govmuted font-normal">Public: Read-Only</span>
                    <span className="text-brand font-bold">Officer: Full Access</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-charcoal font-medium">Generate &amp; Download Official 9-Clause Spec (PDF/TXT)</span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-govmuted font-normal">Public: Preview Only</span>
                    <span className="text-brand font-bold">Officer: Full Export</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick return to public read-only mode */}
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand hover:text-brand-700 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Want to inspect existing benchmarks only? Continue in Public Read-Only Mode</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Sign In Form with "Officer Login Demo" Button (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* If user is ALREADY authenticated, display active session card */}
            {existingOfficer?.authenticated ? (
              <div className="gov-card p-6 sm:p-7 bg-white border border-brand-300 shadow-gov-hover space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-govborder">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secgreen animate-pulse" />
                    <span className="text-xs font-bold text-secgreen uppercase tracking-wide">
                      Active Officer Session
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secgreen-50 text-secgreen font-semibold border border-secgreen-200">
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-gov bg-ivory-50 border border-govborder">
                  <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand flex items-center justify-center font-bold text-base shadow-gov-sm">
                    PK
                  </div>
                  <div>
                    <div className="font-bold text-charcoal text-sm flex items-center gap-1.5">
                      <span>{existingOfficer.officerName || 'P. K. Sharma'}</span>
                      <UserCheck className="w-4 h-4 text-secgreen" />
                    </div>
                    <div className="text-xs text-govmuted">
                      {existingOfficer.officerDesignation || 'Joint Director (Procurement)'}
                    </div>
                    <div className="text-[11px] font-mono text-brand mt-0.5">
                      {existingOfficer.email || 'officer@maanaksetu.demo'}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-govmuted leading-relaxed">
                  You are currently authenticated as an authorized Procurement Officer. You have full access to
                  specification generation, tender document uploads, and GFR 144(i) clause exports.
                </p>

                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-gov bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-gov transition-all"
                  >
                    <span>Enter Procurement Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-gov bg-white hover:bg-ivory-100 text-charcoal border border-govborder font-semibold text-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-govmuted" />
                    <span>Sign Out / Switch Officer Account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If NOT authenticated: Show Officer Sign In card with "Officer Login Demo" button */
              <div className="gov-card p-6 sm:p-8 bg-white border border-govborder shadow-gov">
                
                {/* Header with Title and "Officer Login Demo" Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-govborder">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
                      <Lock className="w-4 h-4 text-brand" />
                      <span>Officer Sign In</span>
                    </h2>
                    <p className="text-[11px] text-govmuted mt-0.5">
                      Enter your procurement officer credentials
                    </p>
                  </div>

                  {/* Officer Login Demo Button */}
                  <button
                    type="button"
                    onClick={handleOfficerLoginDemo}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs shadow-gov-sm transition-all hover:shadow cursor-pointer shrink-0"
                    title="Fill demo credentials for Officer P. K. Sharma"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-600" />
                    <span>Officer Login Demo</span>
                  </button>
                </div>

                {/* Feedback notice when demo credentials are filled */}
                {demoFilled && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Demo credentials filled: <strong>officer@maanaksetu.demo</strong>. Click <strong>Sign In</strong> below to continue.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="officer-email" className="block text-xs font-semibold text-charcoal mb-1.5">
                      Government / Officer Email Address
                    </label>
                    <input
                      id="officer-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setDemoFilled(false);
                      }}
                      placeholder="officer@maanaksetu.demo"
                      className="w-full text-xs rounded-lg border border-govborder bg-ivory-50 px-3.5 py-2.5 text-charcoal placeholder:text-govmuted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="officer-password" className="block text-xs font-semibold text-charcoal">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleOfficerLoginDemo}
                        className="text-[10px] font-semibold text-brand hover:underline"
                      >
                        Auto-Fill Demo
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="officer-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setDemoFilled(false);
                        }}
                        placeholder="••••••••••••"
                        className="w-full text-xs rounded-lg border border-govborder bg-ivory-50 px-3.5 pr-10 py-2.5 text-charcoal placeholder:text-govmuted focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-2.5 text-govmuted hover:text-charcoal"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Session & Security Note */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-govmuted">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-govborder text-brand focus:ring-brand"
                      />
                      <span>Remember session (8 hrs)</span>
                    </label>
                    <span className="text-[10px] text-govmuted">HMAC SHA-256</span>
                  </div>

                  {/* Error Banner */}
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button ("Clicking on signin makes officer login") */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-gov bg-brand hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-gov transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Credentials &amp; Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Sign In as Procurement Officer</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Credentials Details */}
                <div className="mt-5 p-3 rounded-lg bg-ivory-50 border border-govborder text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-charcoal">
                    <span>Officer Prototype Credentials:</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono">
                      DEMO
                    </span>
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-govborder">
                      <span className="text-govmuted text-[10px]">Email:</span>
                      <span className="text-charcoal font-semibold">officer@maanaksetu.demo</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('officer@maanaksetu.demo', 'email')}
                        className="text-govmuted hover:text-brand"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? (
                          <Check className="w-3 h-3 text-secgreen" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-govborder">
                      <span className="text-govmuted text-[10px]">Password:</span>
                      <span className="text-charcoal font-semibold">password@123</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('password@123', 'pass')}
                        className="text-govmuted hover:text-brand"
                        title="Copy password"
                      >
                        {copiedField === 'pass' ? (
                          <Check className="w-3 h-3 text-secgreen" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statutory Notice */}
            <div className="p-3 rounded-lg bg-white/70 border border-govborder text-[11px] text-govmuted flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <p className="leading-tight">
                Authentication protects against unauthorized tender alteration pursuant to the Public Procurement
                Order and Bureau of Indian Standards Act, 2016.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="w-full bg-white/80 border-t border-govborder py-4 px-4 sm:px-8 text-center text-xs text-govmuted z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            मानकसेतु · Bureau of Indian Standards (BIS) SmartSpec AI Procurement Engine · Problem Statement SIH262108
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-brand">Public View</Link>
            <span>•</span>
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand"
            >
              BIS Official Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
