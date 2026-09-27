'use client';

import React, { useState } from 'react';
import { RecommendationResult } from '@/types/procurement';
import {
  FileText,
  Copy,
  Check,
  Download,
  BookmarkPlus,
  BookmarkCheck,
  Printer,
} from 'lucide-react';

interface ExportClauseCardProps {
  result: RecommendationResult;
  onSaveProject: () => void;
  isSaved: boolean;
}

export default function ExportClauseCard({
  result,
  onSaveProject,
  isSaved,
}: ExportClauseCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.generatedTenderClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([result.generatedTenderClause], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stdName = result.primaryStandard
      ? result.primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')
      : 'General_Procurement';
    link.download = `Tender_Spec_${stdName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const { primaryStandard, extractedRequirement, relatedStandards, specificationGaps } = result;
    if (!primaryStandard) {
      handleDownloadTxt();
      return;
    }
    const now = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const relatedRows = relatedStandards
      .map(
        (r, i) => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; width: 25%;">${r.standard.isNumber}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 45%;">${r.standard.title}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 30%; color: #334155;">${r.matchReasons[0] || 'Normative Reference'}</td>
        </tr>`
      )
      .join('');

    const resolvedGapsList = specificationGaps
      .filter((g) => g.isResolved)
      .map(
        (g) => `
        <li style="margin-bottom: 6px; color: #0f172a;">
          <strong>[RESOLVED SPECIFICATION GAP] ${g.parameter}:</strong> ${g.suggestedClause}
        </li>`
      )
      .join('');

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tender_Specification_${primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')}</title>
          <style>
            @page {
              size: A4;
              margin: 16mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #0f172a;
              line-height: 1.5;
              font-size: 11pt;
              margin: 0;
              padding: 0;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }
            .header h1 {
              font-size: 16pt;
              text-transform: uppercase;
              margin: 0 0 4px 0;
              letter-spacing: 0.5px;
            }
            .header p {
              font-size: 9.5pt;
              color: #475569;
              margin: 2px 0;
            }
            .meta-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 18px;
              background-color: #f8fafc;
            }
            .meta-table td {
              padding: 6px 10px;
              border: 1px solid #cbd5e1;
              font-size: 10pt;
            }
            .meta-label {
              font-weight: 600;
              color: #334155;
              width: 25%;
            }
            .section-title {
              font-size: 11.5pt;
              font-weight: bold;
              text-transform: uppercase;
              color: #1e3a8a;
              border-bottom: 1px solid #94a3b8;
              padding-bottom: 4px;
              margin-top: 16px;
              margin-bottom: 8px;
            }
            .content-block {
              margin-bottom: 12px;
              font-size: 10pt;
              text-align: justify;
            }
            .qco-box {
              background-color: #fff1f2;
              border: 1px solid #fecdd3;
              padding: 10px;
              border-radius: 4px;
              margin: 10px 0;
              font-size: 9.5pt;
            }
            .table-custom {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 9pt;
            }
            .table-custom th {
              background-color: #e2e8f0;
              padding: 6px 10px;
              border: 1px solid #cbd5e1;
              text-align: left;
              font-weight: bold;
            }
            .signatures {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              padding-top: 20px;
            }
            .sig-block {
              width: 30%;
              border-top: 1px solid #64748b;
              text-align: center;
              font-size: 9.5pt;
              padding-top: 6px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GOVERNMENT OF INDIA / PUBLIC SECTOR PROCUREMENT</h1>
            <p><strong>TECHNICAL SPECIFICATION & STATUTORY COMPLIANCE SCHEDULE</strong></p>
            <p>Generated via MaanakSetu (BIS SmartSpec AI Engine) | Verified on: ${now}</p>
          </div>

          <table class="meta-table">
            <tr>
              <td class="meta-label">Tender Item / Product:</td>
              <td><strong>${extractedRequirement.product.toUpperCase()}</strong></td>
              <td class="meta-label">Primary Standard:</td>
              <td><strong>${primaryStandard.isNumber}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">Intended Application:</td>
              <td>${extractedRequirement.application}</td>
              <td class="meta-label">BIS Technical Committee:</td>
              <td>${primaryStandard.department}</td>
            </tr>
            <tr>
              <td class="meta-label">Statutory Certification:</td>
              <td style="color: ${primaryStandard.qco.isCompulsory ? '#b91c1c' : '#15803d'}; font-weight: bold;">
                ${primaryStandard.qco.isCompulsory ? 'COMPULSORY (MANDATORY QCO)' : 'VOLUNTARY SCHEME'}
              </td>
              <td class="meta-label">Applicable Scheme:</td>
              <td><strong>${primaryStandard.qco.scheme}</strong></td>
            </tr>
          </table>

          <div class="section-title">1. Mandatory Indian Standard Compliance Clause</div>
          <div class="content-block">
            1.1 The offered product shall strictly conform to <strong>${primaryStandard.isNumber}</strong> 
            (<em>${primaryStandard.title}</em>) including all amendments currently in force 
            (Amendment(s): ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'None'}).<br>
            1.2 Bids offering equipment conforming to legacy, withdrawn, or superseded editions of the standard 
            shall be summarily rejected without technical clarification.
          </div>

          <div class="section-title">2. Statutory Quality Control Order (QCO) & Legal Mandates</div>
          <div class="qco-box">
            <strong>REGULATORY COMPLIANCE MANDATE:</strong><br>
            This procurement is governed under the <strong>${primaryStandard.qco.orderName}</strong> 
            (Gazette Notification No. <em>${primaryStandard.qco.gazetteNotification}</em> issued by the ${primaryStandard.qco.ministry}).<br>
            <strong>Mandatory Bidding Clause:</strong> Bidders must submit a valid BIS License / Compulsory Registration Scheme (CRS) 
            registration certificate bearing a valid registration number on or before the tender submission deadline. 
            Under Section 29 of the BIS Act 2016, supply of non-compliant goods is a cognizable legal offense.
          </div>

          <div class="section-title">3. Normative & Subsystem Reference Standards</div>
          <div class="content-block">
            The equipment subsystems, electrical components, and testing procedures shall additionally satisfy the following reference standards:
          </div>
          <table class="table-custom">
            <thead>
              <tr>
                <th>Standard Reference</th>
                <th>Standard Title / Scope</th>
                <th>Purpose in Procurement</th>
              </tr>
            </thead>
            <tbody>
              ${relatedRows || '<tr><td colspan="3">Direct compliance under primary standard.</td></tr>'}
            </tbody>
          </table>

          <div class="section-title">4. Technical Specifications & Operating Benchmarks</div>
          <div class="content-block">
            <ul>
              <li><strong>Rated Output / Capacity:</strong> ${extractedRequirement.power || extractedRequirement.capacity || 'As per Schedule of Requirements'}</li>
              <li><strong>Nominal Operating Voltage:</strong> ${extractedRequirement.voltage || '230 V AC, 50 Hz +/- 3%'}</li>
              <li><strong>Ingress Protection & Environmental Rating:</strong> ${extractedRequirement.protectionRating || 'IP66 as per IS 12063'}</li>
              <li><strong>Rated Lifetime:</strong> ${extractedRequirement.lifetime || 'Minimum 50,000 burning hours'}</li>
              ${resolvedGapsList}
            </ul>
          </div>

          <div class="section-title">5. Testing, Quality Assurance & Acceptance Protocols</div>
          <div class="content-block">
            5.1 Bidders must submit genuine Type Test Certificates conducted at a BIS-approved or NABL-accredited test laboratory within the last 3 years.<br>
            5.2 The manufacturer must demonstrate compliance with the official <strong>Scheme of Testing and Inspection (STI):</strong> ${primaryStandard.schemesOfTesting}.<br>
            5.3 Pre-dispatch inspection (PDI) may be conducted by the Buyer or third-party inspecting agencies (e.g., RITES/EIL/BIS).
          </div>

          <div class="signatures">
            <div class="sig-block">
              <strong>Prepared By</strong><br>
              Procurement Officer
            </div>
            <div class="sig-block">
              <strong>Vetted By</strong><br>
              Technical Specification Member
            </div>
            <div class="sig-block">
              <strong>Approved By</strong><br>
              Competent Financial Authority
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    } else {
      // Fallback if popup blocked
      handleDownloadTxt();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-md relative transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Generated Tender Specification Clause & PDF
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official contract schedule formatted for GeM Custom Bids, CPWD, Railways, and Public Works
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Save Project Button */}
          <button
            type="button"
            onClick={onSaveProject}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>Save Tender</span>
              </>
            )}
          </button>

          {/* Download Text Spec */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
            title="Download Plain Text Document"
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>.txt</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1.5 transition"
            title="Export and Print Official Tender Specification PDF"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Download PDF</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Clause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code / Clause Display Box */}
      <div className="relative">
        <pre className="w-full max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-xs leading-relaxed select-all whitespace-pre-wrap">
          {result.generatedTenderClause}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Includes resolved specification gaps, QCO statutory citations, and STI testing protocols.</span>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Compatible with GeM / CPPP e-Procurement Formats</span>
      </div>
    </div>
  );
}
