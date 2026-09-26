'use client';

import React from 'react';
import { QCOInfo } from '@/types/standards';
import {
  ShieldAlert,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Building2,
  AlertTriangle,
  Scale,
  CheckCircle,
} from 'lucide-react';

interface RegulatoryCardProps {
  qco: QCOInfo;
  standardNumber: string;
}

export default function RegulatoryCard({ qco, standardNumber }: RegulatoryCardProps) {
  const isCompulsory = qco.isCompulsory;

  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border shadow-xl transition relative overflow-hidden ${
        isCompulsory
          ? 'bg-gradient-to-br from-rose-950/30 via-slate-900 to-slate-950 border-rose-500/40'
          : 'bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-950 border-blue-500/30'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {isCompulsory ? (
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Statutory Certification & QCO Verification
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded in official Gazette Notifications and BIS Act, 2016
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${
            isCompulsory
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse-subtle'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {isCompulsory ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              Compulsory BIS Certification Required
            </>
          ) : (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Voluntary Certification Scheme
            </>
          )}
        </span>
      </div>

      {/* Grid of Regulatory Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Scheme */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
            <span>BIS Certification Scheme</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white">{qco.scheme}</div>
        </div>

        {/* Ministry */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Issuing Ministry</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-200 truncate" title={qco.ministry}>
            {qco.ministry}
          </div>
        </div>

        {/* Gazette Order */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gazette Order / QCO</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-200 truncate" title={qco.gazetteNotification}>
            {qco.gazetteNotification}
          </div>
        </div>

        {/* Effective Date */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Enforcement Date</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-slate-200">{qco.effectiveDate}</div>
        </div>
      </div>

      {/* Description & Legal Implications */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
        <p className="mb-2">
          <strong className="text-slate-200">Legal Mandate: </strong>
          {qco.description}
        </p>
        {qco.penaltiesClause && (
          <p className="text-xs text-rose-300 font-medium">
            <strong>Penal Liability: </strong>
            {qco.penaltiesClause}
          </p>
        )}
      </div>

      {/* Direct Officer Advice */}
      <div
        className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
          isCompulsory
            ? 'bg-rose-950/30 border-rose-800/40 text-rose-200'
            : 'bg-blue-950/30 border-blue-800/40 text-blue-200'
        }`}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Tender Evaluation Directive: </span>
          {isCompulsory
            ? `Procurement officers must insert a mandatory eligibility clause requiring bidders to possess an active ${qco.scheme} license for ${standardNumber}. Bids from non-certified vendors cannot be accepted under the BIS Act, 2016.`
            : `Certification is voluntary. Tender specifications may permit bidders to submit type-test reports from NABL/BIS accredited laboratories in lieu of an ISI mark.`}
        </div>
      </div>
    </div>
  );
}
