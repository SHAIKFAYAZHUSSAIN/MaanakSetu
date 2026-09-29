'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShieldCheck, ArrowRight, Lock, UserCheck, AlertCircle, Eye, EyeOff, Zap, ExternalLink } from 'lucide-react';

interface OfficerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionName?: string;
}

export default function OfficerAuthModal({
  isOpen,
  onClose,
  onSuccess,
  actionName = 'create or analyze a custom tender specification',
}: OfficerAuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoFilled, setDemoFilled] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setBusy(false);
    }
  };

  const handleOfficerLoginDemo = () => {
    setEmail('officer@maanaksetu.demo');
    setPassword('password@123');
    setError('');
    setDemoFilled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in print-hide">
      <div className="gov-card rounded-gov-lg w-full max-w-md border border-govborder shadow-gov-modal overflow-hidden bg-white text-charcoal">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-govborder flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-accent border border-accent-200">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-charcoal">
                Officer Access Required
              </h3>
              <p className="text-[11px] text-govmuted">
                Public View Mode is Read-Only
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-govmuted hover:text-charcoal hover:bg-ivory-100 transition-colors border border-transparent hover:border-govborder cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-gov bg-brand-50 border border-brand-200 text-xs text-brand-900 leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5 text-brand">
              <UserCheck className="w-4 h-4 text-brand shrink-0" />
              <span>Public users can view, but cannot upload or export:</span>
            </p>
            You are currently in <strong>Public Read-Only Mode</strong>. To <strong>{actionName}</strong>, please sign in
            as an authorized Procurement Officer.
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-charcoal">Officer Credentials</span>
            <button
              type="button"
              onClick={handleOfficerLoginDemo}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs shadow-gov-sm transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-amber-600" />
              <span>Officer Login Demo</span>
            </button>
          </div>

          {demoFilled && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-fade-in">
              Demo details filled (<strong>officer@maanaksetu.demo</strong>). Click <strong>Sign In</strong> below to continue.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-charcoal">
                Officer Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDemoFilled(false);
                }}
                placeholder="officer@maanaksetu.demo"
                className="w-full text-xs rounded-lg border border-govborder bg-ivory-50 px-3 py-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-charcoal">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setDemoFilled(false);
                  }}
                  placeholder="••••••••••••"
                  className="w-full text-xs rounded-lg border border-govborder bg-ivory-50 px-3 pr-10 py-2 text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-govmuted hover:text-charcoal cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand hover:bg-brand-700 text-white font-bold text-xs shadow-gov transition disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Authenticating...' : 'Sign In as Officer & Continue'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-govborder">
            <Link
              href="/login"
              onClick={onClose}
              className="text-[11px] font-semibold text-brand hover:underline inline-flex items-center gap-1"
            >
              <span>Full Officer Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] text-govmuted hover:text-charcoal hover:underline cursor-pointer"
            >
              Cancel &amp; stay in Public Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
