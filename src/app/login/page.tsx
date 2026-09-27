'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, FileText, BookOpen, Eye, EyeOff, Sparkles, UserCheck, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFillDemo = () => {
    setEmail('officer@maanaksetu.demo');
    setPassword('password');
    setError('');
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
      window.location.assign('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to connect. Please try again.');
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-32 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
      />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Mission & Information */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <ShieldCheck className="w-7 h-7" />
            </span>
            <div>
              <p className="text-2xl font-bold tracking-tight">MaanakSetu</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                मानकसेतु · BIS SmartSpec Procurement Engine
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" /> SIH 2026 Problem Statement SIH262108
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mt-4 mb-5">
            Officer Portal &amp;<br />Tender Creation
          </h1>
          <p className="text-base leading-7 text-slate-600 dark:text-slate-400 max-w-md">
            Sign in as an authorized Procurement Officer to upload tender schedules, analyze custom specifications, and generate GFR 144(i) compliant clauses.
          </p>

          <div className="mt-8 space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p className="flex gap-3 items-center">
              <BookOpen className="w-5 h-5 text-blue-500 shrink-0" />
              Full access to 24+ Indian Standards and QCO Gazette database
            </p>
            <p className="flex gap-3 items-center">
              <FileText className="w-5 h-5 text-blue-500 shrink-0" />
              Create custom tenders, upload PDFs/DOCXs, and export specifications
            </p>
            <p className="flex gap-3 items-center">
              <UserCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              Public guests can explore tenders in read-only mode without login
            </p>
          </div>

          {/* Quick return to public read-only mode */}
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Browse in Public View Mode (Read-Only)</span>
            </Link>
          </div>
        </section>

        {/* Right Column: Sign In Card */}
        <section className="glass-card rounded-3xl p-7 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Demo Access Available
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              ⚡ Auto-Fill Credentials
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Officer Sign In</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Use the demo officer credentials to unlock full tender creation capabilities.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                Officer Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@maanaksetu.demo"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  maxLength={256}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Demo Officer Credentials:</span>
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">Public Demo</span>
              </div>
              <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                Email: <strong>officer@maanaksetu.demo</strong>
              </p>
              <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                Password: <strong>password</strong>
              </p>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 p-3 text-xs">
                {error}
              </p>
            )}

            <button
              disabled={busy}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 disabled:opacity-60 transition shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              {busy ? 'Signing in…' : 'Sign in as Procurement Officer'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
            >
              Want to see existing tenders only? <span className="underline font-semibold">Continue in Public Read-Only Mode</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
