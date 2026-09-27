'use client';

import React, { useState } from 'react';
import { RecommendationResult } from '@/types/procurement';
import { SupportedLanguage, translations } from '@/types/language';
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
  isAuthenticated?: boolean;
  onRequireOfficerAuth?: (actionName?: string) => void;
  currentLanguage?: SupportedLanguage;
}

export default function ExportClauseCard({
  result,
  onSaveProject,
  isSaved,
  isAuthenticated = false,
  onRequireOfficerAuth,
  currentLanguage = 'en',
}: ExportClauseCardProps) {
  const [copied, setCopied] = useState(false);
  const t = translations[currentLanguage] || translations.en;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.generatedTenderClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!isAuthenticated) {
      onRequireOfficerAuth?.('download tender specification clauses (.txt)');
      return;
    }
    const blob = new Blob([result.generatedTenderClause], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stdName = result.primaryStandard
      ? result.primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')
      : 'General_Procurement';
    link.download = `Tender_Spec_${stdName}_${currentLanguage.toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    if (!isAuthenticated) {
      onRequireOfficerAuth?.('generate and download official GFR 144(i) tender document (PDF)');
      return;
    }
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
        (r) => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; font-weight: bold; width: 25%;">${r.standard.isNumber}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 45%;">${r.standard.title}</td>
          <td style="padding: 8px 12px; border: 1px solid #cbd5e1; width: 30%; color: #334155;">${r.matchReasons[0] || 'Normative Reference'}</td>
        </tr>`
      )
      .join('');

    const resolvedGapsList = specificationGaps
      .filter((g) => g.isResolved)
      .map((g) => {
        const gapPrefix =
          currentLanguage === 'hi'
            ? '[हल किया गया विनिर्देश अंतर]'
            : currentLanguage === 'te'
            ? '[పరిష్కరించిన లోపం]'
            : currentLanguage === 'ta'
            ? '[சரிசெய்யப்பட்ட இடைவெளி]'
            : '[RESOLVED SPECIFICATION GAP]';
        return `
        <li style="margin-bottom: 6px; color: #0f172a;">
          <strong>${gapPrefix} ${g.parameter}:</strong> ${g.suggestedClause}
        </li>`;
      })
      .join('');

    // Localized Headers & Titles for the Official PDF Document
    const pdfTitles = {
      en: {
        govHeader: 'GOVERNMENT OF INDIA / PUBLIC SECTOR PROCUREMENT',
        docSubtitle: 'TECHNICAL SPECIFICATION & STATUTORY COMPLIANCE SCHEDULE',
        engineCredit: `Generated via MaanakSetu (BIS SmartSpec AI Engine) | Generated on: ${now}`,
        tenderItem: 'Tender Item / Product:',
        primaryStd: 'Primary Standard:',
        app: 'Intended Application:',
        committee: 'BIS Technical Committee:',
        statutoryCert: 'Statutory Certification:',
        scheme: 'Applicable Scheme:',
        compulsory: 'COMPULSORY (MANDATORY QCO)',
        voluntary: 'VOLUNTARY SCHEME',
        sec1: '1. Mandatory Indian Standard Compliance Clause',
        sec2: '2. Allied & Normative Subsystem Standards',
        sec3: '3. Quality Control Order (QCO) Statutory Mandate',
        sec4: '4. Technical Parameters & Gap Closures',
        sec5: '5. Scheme of Testing and Inspection (STI) & Quality Assurance',
        sig1: 'Indenting / Technical Officer',
        sig2: 'Scrutiny / BIS Compliance Officer',
        sig3: 'Competent Approving Authority',
      },
      hi: {
        govHeader: 'भारत सरकार / सार्वजनिक क्षेत्र खरीद (GOVERNMENT OF INDIA)',
        docSubtitle: 'तकनीकी विनिर्देश एवं वैधानिक अनुपालन अनुसूची (GFR 144(i) COMPLIANT)',
        engineCredit: `मानकसेतु (MaanakSetu) - बीआईएस स्मार्टस्पेक एआई इंजन | सृजन तिथि: ${now}`,
        tenderItem: 'निविदा मद / उत्पाद (Tender Item):',
        primaryStd: 'प्राथमिक लागू मानक (Primary Standard):',
        app: 'प्रयोजन / उपयोग (Intended Application):',
        committee: 'बीआईएस तकनीकी समिति (BIS Committee):',
        statutoryCert: 'वैधानिक प्रमाणन स्थिति (Statutory Certification):',
        scheme: 'लागू प्रमाणन योजना (Scheme):',
        compulsory: 'अनिवार्य वैधानिक प्रमाणन (MANDATORY QCO)',
        voluntary: 'मानक स्वैच्छिक योजना (VOLUNTARY)',
        sec1: '1. अनिवार्य भारतीय मानक अनुपालन खंड (Mandatory Compliance Clause)',
        sec2: '2. मानकीय एवं संबद्ध संदर्भ मानक (Normative & Allied Standards)',
        sec3: '3. गुणवत्ता नियंत्रण आदेश (QCO) वैधानिक आदेश (Statutory Order)',
        sec4: '4. तकनीकी विनिर्देश एवं अंतर समाधान (Technical Benchmarks)',
        sec5: '5. परीक्षण एवं निरीक्षण योजना (STI) एवं गुणवत्ता आश्वासन',
        sig1: 'मांगकर्ता / तकनीकी अधिकारी',
        sig2: 'बीआईएस अनुपालन अधिकारी',
        sig3: 'सक्षम अनुमोदन प्राधिकारी',
      },
      te: {
        govHeader: 'భారత ప్రభుత్వం / పబ్లిక్ సెక్టార్ సేకరణ (GOVERNMENT OF INDIA)',
        docSubtitle: 'సాంకేతిక స్పెసిఫికేషన్ మరియు చట్టబద్ధమైన సమ్మతి షెడ్యూల్ (GFR 144(i))',
        engineCredit: `మానక్ సేతు (MaanakSetu) - బీఐఎస్ స్మార్ట్‌స్పెక్ ఏఐ ఇంజిన్ | తేదీ: ${now}`,
        tenderItem: 'టెండర్ అంశం (Tender Item):',
        primaryStd: 'ప్రధాన ప్రమాణం (Primary Standard):',
        app: 'వినియోగం (Application):',
        committee: 'బీఐఎస్ కమిటీ (BIS Committee):',
        statutoryCert: 'చట్టబద్ధ ధృవీకరణ (Statutory Certification):',
        scheme: 'పథకం (Scheme):',
        compulsory: 'తప్పనిసరి ధృవీకరణ (MANDATORY QCO)',
        voluntary: 'స్వచ్ఛంద పథకం (VOLUNTARY)',
        sec1: '1. తప్పనిసరి భారతీయ ప్రమాణాల సమ్మతి నిబంధన',
        sec2: '2. అనుబంధ మరియు పరీక్షా ప్రమాణాలు',
        sec3: '3. క్వాలిటీ కంట్రోల్ ఆర్డర్ (QCO) నిబంధనలు',
        sec4: '4. సాంకేతిక స్పెసిఫికేషన్లు & లోపాల పరిష్కారం',
        sec5: '5. పరీక్ష మరియు నాణ్యత తనిఖీ వ్యవస్థ (STI)',
        sig1: 'సాంకేతిక అధికారి',
        sig2: 'బీఐఎస్ సమ్మతి అధికారి',
        sig3: 'అనుమోదించే అధికారి',
      },
      ta: {
        govHeader: 'இந்திய அரசு / பொதுத்துறை கொள்முதல் (GOVERNMENT OF INDIA)',
        docSubtitle: 'தொழில்நுட்ப விவரக்குறிப்பு மற்றும் சட்டப்பூர்வ இணக்க அட்டவணை (GFR 144(i))',
        engineCredit: `மானக் சேது (MaanakSetu) - BIS ஸ்மார்ட்ஸ்பெக் AI இயந்திரம் | தேதி: ${now}`,
        tenderItem: 'டெண்டர் பொருள் (Tender Item):',
        primaryStd: 'முதன்மை தரநிலை (Primary Standard):',
        app: 'பயன்பாடு (Application):',
        committee: 'BIS தொழில்நுட்பக் குழு (Committee):',
        statutoryCert: 'சட்டப்பூர்வ சான்றிதழ் (Statutory Certification):',
        scheme: 'திட்டம் (Scheme):',
        compulsory: 'கட்டாய சான்றிதழ் (MANDATORY QCO)',
        voluntary: 'விருப்பத் திட்டம் (VOLUNTARY)',
        sec1: '1. கட்டாய இந்தியத் தரநிலைகள் இணக்க விதி',
        sec2: '2. தொடர்புடைய மற்றும் துணை தரநிலைகள்',
        sec3: '3. தரக் கட்டுப்பாட்டு ஆணை (QCO) சட்டப்பூர்வ விதி',
        sec4: '4. தொழில்நுட்ப விவரக்குறிப்புகள் மற்றும் தீர்வுகள்',
        sec5: '5. சோதனை மற்றும் ஆய்வுத் திட்டம் (STI)',
        sig1: 'தொழில்நுட்ப அதிகாரி',
        sig2: 'BIS இணக்க அதிகாரி',
        sig3: 'ஒப்புதல் அதிகாரி',
      },
    };

    const strings = pdfTitles[currentLanguage] || pdfTitles.en;

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tender_Specification_${primaryStandard.isNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${currentLanguage.toUpperCase()}</title>
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
              font-size: 15pt;
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
              padding: 8px 12px;
              border: 1px solid #cbd5e1;
              font-size: 10pt;
            }
            .meta-label {
              font-weight: bold;
              color: #334155;
              width: 25%;
              background-color: #f1f5f9;
            }
            .section-title {
              font-size: 12pt;
              font-weight: bold;
              color: #0f172a;
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
            <h1>${strings.govHeader}</h1>
            <p><strong>${strings.docSubtitle}</strong></p>
            <p>${strings.engineCredit}</p>
          </div>

          <table class="meta-table">
            <tr>
              <td class="meta-label">${strings.tenderItem}</td>
              <td><strong>${extractedRequirement.product.toUpperCase()}</strong></td>
              <td class="meta-label">${strings.primaryStd}</td>
              <td><strong>${primaryStandard.isNumber}</strong></td>
            </tr>
            <tr>
              <td class="meta-label">${strings.app}</td>
              <td>${extractedRequirement.application}</td>
              <td class="meta-label">${strings.committee}</td>
              <td>${primaryStandard.department}</td>
            </tr>
            <tr>
              <td class="meta-label">${strings.statutoryCert}</td>
              <td style="color: ${primaryStandard.qco.isCompulsory ? '#b91c1c' : '#15803d'}; font-weight: bold;">
                ${primaryStandard.qco.isCompulsory ? strings.compulsory : strings.voluntary}
              </td>
              <td class="meta-label">${strings.scheme}</td>
              <td><strong>${primaryStandard.qco.scheme}</strong></td>
            </tr>
          </table>

          <div class="section-title">${strings.sec1}</div>
          <div class="content-block">
            <p>1.1 The supplied items/equipment shall strictly conform to the specifications and performance metrics of <strong>${primaryStandard.isNumber}</strong> (<em>${primaryStandard.title}</em>) including all current active amendments (${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'Nil'}).</p>
            <p>1.2 Bids offering products manufactured or tested to superseded/outdated editions of Indian Standards shall be deemed non-responsive in accordance with GFR 2017 Rule 144(i)(b).</p>
          </div>

          <div class="section-title">${strings.sec2}</div>
          <table class="table-custom">
            <thead>
              <tr>
                <th>Standard No.</th>
                <th>Standard Title</th>
                <th>Relevance / Interoperability Role</th>
              </tr>
            </thead>
            <tbody>
              ${relatedRows || '<tr><td colspan="3" style="text-align: center; padding: 8px;">No allied standards mandated.</td></tr>'}
            </tbody>
          </table>

          <div class="section-title">${strings.sec3}</div>
          <div class="qco-box">
            <p style="margin: 0 0 6px 0;"><strong>Statutory Notification:</strong> ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification})</p>
            <p style="margin: 0 0 6px 0;"><strong>Ministry / Authority:</strong> ${primaryStandard.qco.ministry}</p>
            <p style="margin: 0;"><strong>Mandatory Clause:</strong> Bidders must submit a valid BIS License / CRS Registration certificate issued by the Bureau of Indian Standards as of the date of bid submission. Offers without valid BIS certification shall be rejected without technical clarification.</p>
          </div>

          <div class="section-title">${strings.sec4}</div>
          <div class="content-block">
            <ul style="padding-left: 20px; margin: 6px 0;">
              <li><strong>Rated Power / Capacity:</strong> ${extractedRequirement.power || extractedRequirement.capacity || 'As per Schedule of Requirements'}</li>
              <li><strong>Rated Voltage / Frequency:</strong> ${extractedRequirement.voltage || '230V AC, 50Hz single-phase / 415V three-phase'}</li>
              <li><strong>Enclosure Protection Rating:</strong> ${extractedRequirement.protectionRating || 'IP65/IP66 as per IS 12063 / IEC 60529'}</li>
              <li><strong>Operational Lifetime:</strong> ${extractedRequirement.lifetime || 'Minimum 50,000 burning hours'}</li>
              ${resolvedGapsList}
            </ul>
          </div>

          <div class="section-title">${strings.sec5}</div>
          <div class="content-block">
            <p>5.1 <strong>Type Test Certificates:</strong> The bidder must submit authentic Type Test reports conducted at a BIS-approved laboratory or NABL-accredited facility within the last 3 years.</p>
            <p>5.2 <strong>Factory Testing Protocol:</strong> Testing and factory inspection shall conform to <em>${primaryStandard.schemesOfTesting}</em>.</p>
            <p>5.3 <strong>Pre-Dispatch Inspection:</strong> Buyer reserves the right to conduct pre-dispatch inspection (PDI) at the manufacturer's premises through an authorized inspection agency.</p>
          </div>

          <div class="signatures">
            <div class="sig-block">
              <strong>${strings.sig1}</strong><br/>
              <span style="font-size: 8pt; color: #64748b;">Signature & Date</span>
            </div>
            <div class="sig-block">
              <strong>${strings.sig2}</strong><br/>
              <span style="font-size: 8pt; color: #64748b;">BIS Standards Scrutiny</span>
            </div>
            <div class="sig-block">
              <strong>${strings.sig3}</strong><br/>
              <span style="font-size: 8pt; color: #64748b;">Approval / Sanction</span>
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
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{t.exportClauseTitle}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                GFR 144(i)
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentLanguage === 'hi'
                ? 'सरकारी ई-मार्केटप्लेस (GeM) एवं सीपीपीपी निविदाओं में सीधे उपयोग हेतु तैयार'
                : currentLanguage === 'te'
                ? 'GeM మరియు CPPP టెండర్లలో నేరుగా ఉపయోగించడానికి రూపొందించబడింది'
                : currentLanguage === 'ta'
                ? 'GeM மற்றும் CPPP டெண்டர்களில் நேரடியாக பயன்படுத்தக்கூடியது'
                : 'Formatted for direct insertion into GeM / CPPP tender documentation'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Save Tender Button */}
          <button
            type="button"
            onClick={onSaveProject}
            disabled={isSaved}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm cursor-pointer'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentLanguage === 'hi' ? 'सहेजा गया' : currentLanguage === 'te' ? 'సేవ్ చేయబడింది' : currentLanguage === 'ta' ? 'சேமிக்கப்பட்டது' : 'Saved'}</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span>{t.saveProjectButton}</span>
                {!isAuthenticated && <span className="text-[10px] opacity-80">🔒</span>}
              </>
            )}
          </button>

          {/* Download Text Spec */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            title={isAuthenticated ? 'Download Plain Text Document' : 'Officer sign-in required to download .txt'}
          >
            <Download className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>{t.downloadTxt}</span>
            {!isAuthenticated && <span className="text-[10px] text-amber-500">🔒</span>}
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
            title={isAuthenticated ? 'Print or save your draft as PDF' : 'Officer sign-in required to download PDF'}
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>{t.downloadPdf}</span>
            {!isAuthenticated && <span className="text-[10px] text-amber-300">🔒</span>}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyClauseButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Public Preview Mode Notice */}
      {!isAuthenticated && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wider bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 shrink-0">
              {currentLanguage === 'hi' ? 'सार्वजनिक पूर्वावलोकन' : currentLanguage === 'te' ? 'పబ్లిక్ ప్రివ్యూ' : currentLanguage === 'ta' ? 'பொது முன்னோட்டம்' : 'Public Preview'}
            </span>
            <span>{t.publicPreviewNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => onRequireOfficerAuth?.('download official tender documents')}
            className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px] shrink-0 transition cursor-pointer"
          >
            {t.officerSignIn}
          </button>
        </div>
      )}

      {/* Code / Clause Display Box */}
      <div className="relative">
        <pre className="w-full max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-sans text-sm leading-7 select-all whitespace-pre-wrap">
          {result.generatedTenderClause}
        </pre>
      </div>

      {/* Footer Info */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>{t.exportSubtitle}</span>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{t.gemCompatible}</span>
      </div>
    </div>
  );
}
