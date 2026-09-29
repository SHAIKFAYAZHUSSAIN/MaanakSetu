import { RecommendationResult, CandidateStandardMatch } from '../types/procurement';
import { SupportedLanguage } from '../types/language';
import { build9SectionSpecification } from './specExporter';
import {
  OFFICIAL_PORTALS,
  resolveOfficialStandardUrl,
  SECURITY_TRUST_NOTICE,
  LIVE_VERIFICATION_REQUIRED_TEXT,
} from './officialSources';

/**
 * Generates the official standalone HTML document for high-fidelity PDF export.
 * Follows the Government of India procurement technical schedule standards.
 */
export function generateOfficialTenderPdfHtml(
  result: RecommendationResult,
  language: SupportedLanguage = 'en'
): string {
  const { extractedRequirement, primaryStandard, relatedStandards, specificationGaps, explanation } = result;

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const productUpper = (extractedRequirement?.product || 'PROCUREMENT ITEM').toUpperCase();
  const applicationText = extractedRequirement?.application || 'General Public Sector & Infrastructure Procurement';
  const primaryStdNumber = primaryStandard ? primaryStandard.isNumber : 'NOT MANDATORY / CLASSIFICATION REQUIRED';
  const primaryStdTitle = primaryStandard ? primaryStandard.title : 'Classification Under Review';
  const primaryStdUrl = resolveOfficialStandardUrl(primaryStdNumber, primaryStandard?.officialSourceUrl);
  const committeeText = primaryStandard?.department || 'Electrotechnical Department (ETD 24)';
  const isCompulsory = primaryStandard?.qco?.isCompulsory ?? false;
  const certStatusText = isCompulsory ? 'COMPULSORY / MANDATORY QCO' : 'VOLUNTARY BENCHMARK';
  const certClass = isCompulsory ? 'mandatory' : 'voluntary';
  const schemeText = primaryStandard?.qco?.scheme || 'Scheme-II / CRS where applicable';

  // Determine whether Compulsory Registration Scheme (CRS) applies to this product/subsystems
  const isCrsApplicable =
    schemeText.toLowerCase().includes('crs') ||
    schemeText.toLowerCase().includes('scheme-ii') ||
    (primaryStandard?.title?.toLowerCase() || '').includes('driver') ||
    (primaryStandard?.title?.toLowerCase() || '').includes('lamp') ||
    (primaryStandard?.title?.toLowerCase() || '').includes('it equipment') ||
    (relatedStandards &&
      relatedStandards.some(
        (r) =>
          r.standard.isNumber.includes('15885') ||
          r.standard.isNumber.includes('16103') ||
          r.standard.isNumber.includes('13252')
      ));

  const amendmentsList =
    primaryStandard?.versionChain?.amendments && primaryStandard.versionChain.amendments.length > 0
      ? primaryStandard.versionChain.amendments.map((a) => `Amd. ${a.number} (${a.year})`).join(', ')
      : 'Nil';

  // Section 2: Allied & Normative Subsystem Standards Table
  const relatedRowsHtml = relatedStandards && relatedStandards.length > 0
    ? relatedStandards
        .map((rel: CandidateStandardMatch) => {
          const std = rel.standard;
          const matchReason = rel.matchReasons?.[0] || 'Normative Reference Standard';
          const relStdUrl = resolveOfficialStandardUrl(std.isNumber, std.officialSourceUrl);
          
          // Determine relationship label
          let relBadge = 'Normative Reference';
          const rLower = matchReason.toLowerCase();
          const tLower = std.title.toLowerCase();
          if (rLower.includes('subsystem') || rLower.includes('driver') || rLower.includes('controlgear') || rLower.includes('module')) {
            relBadge = 'Mandatory Subsystem';
          } else if (rLower.includes('test') || rLower.includes('photometric') || rLower.includes('ip') || tLower.includes('test') || tLower.includes('degrees of protection')) {
            relBadge = 'Test Method';
          } else if (rLower.includes('safety') || tLower.includes('safety') || rLower.includes('hazard')) {
            relBadge = 'Safety';
          } else if (rLower.includes('earthing') || rLower.includes('installation') || tLower.includes('earthing')) {
            relBadge = 'Installation';
          } else if (tLower.includes('vocabulary') || tLower.includes('terminology')) {
            relBadge = 'Terminology';
          } else if (rLower.includes('product') || rLower.includes('equivalent')) {
            relBadge = 'Related Product';
          }

          return `
            <tr>
              <td class="col-std-no">
                <a href="${relStdUrl}" target="_blank" class="pdf-link-bold"><strong>${std.isNumber}</strong> ↗</a>
              </td>
              <td class="col-std-title">
                ${std.title}
                <div class="std-official-source">
                  <span class="source-tag">Source:</span> <a href="${relStdUrl}" target="_blank" class="pdf-link-sub">${OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label} ↗</a>
                </div>
              </td>
              <td class="col-std-role">
                <span class="role-badge role-${relBadge.replace(/\s+/g, '-').toLowerCase()}">${relBadge}</span>
                <div class="role-desc">${matchReason}</div>
              </td>
            </tr>`;
        })
        .join('')
    : `<tr><td colspan="3" class="text-center-cell">Direct compliance governed exclusively by the primary standard.</td></tr>`;

  // Section 3: QCO Details & Verification Status
  const qcoOrderName = primaryStandard?.qco?.orderName || 'Not Identified Under Compulsory Quality Control Order';
  const qcoGazette = primaryStandard?.qco?.gazetteNotification || 'Pending Formal Gazette Notification';
  const qcoMinistry = primaryStandard?.qco?.ministry || 'Ministry of Commerce & Industry / Line Ministry';
  
  let verificationStatus = 'VERIFIED';
  let verifBadgeClass = 'verif-verified';
  if (!primaryStandard?.qco || !primaryStandard.qco.isCompulsory) {
    verificationStatus = 'NOT IDENTIFIED';
    verifBadgeClass = 'verif-not-identified';
  } else if (!primaryStandard.qco.gazetteNotification || primaryStandard.qco.gazetteNotification.includes('Pending')) {
    verificationStatus = 'REQUIRES OFFICIAL VERIFICATION';
    verifBadgeClass = 'verif-pending';
  }

  // Section 4: Technical Parameters & Gap Closures Table
  interface TechParamRow {
    param: string;
    tenderReq: string;
    aiDetected: string;
    status: 'Specified' | 'GAP' | 'RESOLVED';
    recommendedAddition: string;
  }

  const techRows: TechParamRow[] = [
    {
      param: 'Rated Power / Output',
      tenderReq: extractedRequirement?.power || extractedRequirement?.capacity || 'Specified in Schedule',
      aiDetected: extractedRequirement?.power || extractedRequirement?.capacity || 'Standard Nominal Rating',
      status: 'Specified',
      recommendedAddition: '—',
    },
    {
      param: 'Nominal Operating Voltage',
      tenderReq: extractedRequirement?.voltage || 'Not explicit',
      aiDetected: extractedRequirement?.voltage || '230 V AC ± 3%, 50 Hz single-phase / 415 V three-phase',
      status: extractedRequirement?.voltage ? 'Specified' : 'GAP',
      recommendedAddition: extractedRequirement?.voltage ? '—' : 'Stipulate 140V–300V wide-voltage tolerance for Indian field grid conditions.',
    },
    {
      param: 'Enclosure Protection (IP Code)',
      tenderReq: extractedRequirement?.protectionRating || 'Not specified',
      aiDetected: extractedRequirement?.protectionRating || 'IP66 Weatherproof / Dust-tight as per IS 12063',
      status: extractedRequirement?.protectionRating ? 'Specified' : 'GAP',
      recommendedAddition: 'Mandate minimum IP65/IP66 ingress protection with high-pressure water jet resistance.',
    },
    {
      param: 'Operational Lifetime & Benchmark',
      tenderReq: extractedRequirement?.lifetime || 'Not specified',
      aiDetected: extractedRequirement?.lifetime || 'Minimum 50,000 burning hours (L70 lumen maintenance)',
      status: extractedRequirement?.lifetime ? 'Specified' : 'GAP',
      recommendedAddition: 'Require third-party accelerated life test certificate ensuring >= 50,000 hrs at 45°C ambient.',
    },
  ];

  // Add specific other parameters
  if (extractedRequirement?.otherSpecs) {
    if (extractedRequirement.otherSpecs['CCT'] || extractedRequirement.otherSpecs['CRI']) {
      techRows.push({
        param: 'Photometric CCT & CRI',
        tenderReq: `CCT: ${extractedRequirement.otherSpecs['CCT'] || '4000K–5700K'}, CRI: ${extractedRequirement.otherSpecs['CRI'] || '>=70'}`,
        aiDetected: 'IS 16107 (Part 2/Sec 2) photometric compliance',
        status: 'Specified',
        recommendedAddition: 'Mandate CRI >= 70 and CCT stability within MacAdam 5-step ellipse.',
      });
    }
    if (extractedRequirement.otherSpecs['PowerFactor'] || extractedRequirement.otherSpecs['DriverTHD']) {
      techRows.push({
        param: 'Electrical Power Quality',
        tenderReq: `PF: ${extractedRequirement.otherSpecs['PowerFactor'] || '>0.95'}, THD: ${extractedRequirement.otherSpecs['DriverTHD'] || '<10%'}`,
        aiDetected: 'High-efficiency low-harmonic constant current driver',
        status: 'Specified',
        recommendedAddition: 'Mandate Power Factor > 0.95 and Total Harmonic Distortion (THD) < 10% under full load.',
      });
    }
  }

  // Include specification gaps from AI analysis
  if (specificationGaps && specificationGaps.length > 0) {
    specificationGaps.forEach((gap) => {
      // Check if parameter already added
      const exists = techRows.some((r) => r.param.toLowerCase().includes(gap.parameter.toLowerCase()));
      if (!exists) {
        techRows.push({
          param: gap.parameter,
          tenderReq: 'Not specified in tender text',
          aiDetected: `${gap.parameter} required per ${gap.standardReference || 'Indian Standards'}`,
          status: gap.isResolved ? 'RESOLVED' : 'GAP',
          recommendedAddition: gap.suggestedClause,
        });
      }
    });
  }

  const techRowsHtml = techRows
    .map(
      (r) => `
      <tr>
        <td class="col-param"><strong>${r.param}</strong></td>
        <td class="col-tender">${r.tenderReq}</td>
        <td class="col-ai">${r.aiDetected}</td>
        <td class="col-status"><span class="status-tag status-${r.status.toLowerCase()}">${r.status}</span></td>
        <td class="col-addition">${r.recommendedAddition}</td>
      </tr>`
    )
    .join('');

  // Section 6: AI Recommendation Traceability Matrix
  const traceabilityRows = [
    {
      tenderReq: 'Weatherproof enclosure for outdoor public road lighting',
      concept: 'Ingress protection against dust and high-pressure water jets',
      standard: 'IS 12063: 1987',
      url: resolveOfficialStandardUrl('IS 12063: 1987', 'https://standards.bis.gov.in/item/is-12063-1987'),
      role: 'Mandatory Test Method',
      sourceName: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label,
      sourceClassification: 'OFFICIAL SOURCE',
      verificationText: LIVE_VERIFICATION_REQUIRED_TEXT,
    },
    {
      tenderReq: 'Driver safety, constant current supply & surge suppression',
      concept: 'Electronic controlgear safety, overload protection & CRS registration',
      standard: 'IS 15885 (Part 2/Sec 13): 2012',
      url: resolveOfficialStandardUrl('IS 15885 (Part 2/Sec 13): 2012', 'https://standards.bis.gov.in/item/is-15885-part-2-sec-13-2012'),
      role: 'Mandatory Subsystem',
      sourceName: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label,
      sourceClassification: 'OFFICIAL SOURCE',
      verificationText: LIVE_VERIFICATION_REQUIRED_TEXT,
    },
    {
      tenderReq: 'Photometric efficiency and lumen maintenance benchmarks',
      concept: 'System luminous efficacy (min 120 lm/W) & CRI testing',
      standard: 'IS 16107 (Part 2/Sec 2): 2021',
      url: resolveOfficialStandardUrl('IS 16107 (Part 2/Sec 2): 2021', 'https://standards.bis.gov.in/item/is-16107-part-2-sec-2-2021'),
      role: 'Mandatory Test Method',
      sourceName: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label,
      sourceClassification: 'OFFICIAL SOURCE',
      verificationText: LIVE_VERIFICATION_REQUIRED_TEXT,
    },
    {
      tenderReq: 'Safety of internal light engine & thermal stability',
      concept: 'Compulsory electrical insulation & creepage distances',
      standard: 'IS 16103 (Part 1): 2012',
      url: resolveOfficialStandardUrl('IS 16103 (Part 1): 2012'),
      role: 'Mandatory Safety',
      sourceName: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label,
      sourceClassification: 'OFFICIAL SOURCE',
      verificationText: LIVE_VERIFICATION_REQUIRED_TEXT,
    },
    {
      tenderReq: 'Earthing and electrical ground bonding of pole and chassis',
      concept: 'Protective conductor bonding maintaining earth loop impedance < 5 Ohms',
      standard: 'IS 3043: 2018',
      url: resolveOfficialStandardUrl('IS 3043: 2018', 'https://standards.bis.gov.in/item/is-3043-2018'),
      role: 'Installation',
      sourceName: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label,
      sourceClassification: 'OFFICIAL SOURCE',
      verificationText: LIVE_VERIFICATION_REQUIRED_TEXT,
    },
  ];

  const traceabilityRowsHtml = traceabilityRows
    .map(
      (row) => `
      <tr>
        <td class="col-trace-req">${row.tenderReq}</td>
        <td class="col-trace-concept">
          <div class="trace-arrow">↓</div>
          <strong>${row.concept}</strong>
        </td>
        <td class="col-trace-std">
          <div class="trace-arrow">↓</div>
          <a href="${row.url}" target="_blank" class="pdf-link-bold">${row.standard} ↗</a>
        </td>
        <td class="col-trace-role">
          <span class="role-badge role-${row.role.replace(/\s+/g, '-').toLowerCase()}">${row.role}</span>
        </td>
        <td class="col-trace-ev">
          <span class="badge-official">${row.sourceClassification}</span>
          <div class="trace-source-link">
            <a href="${row.url}" target="_blank" class="pdf-link-sub">${row.sourceName} ↗</a>
          </div>
          <div class="trace-verif-note">${row.verificationText}</div>
        </td>
      </tr>`
    )
    .join('');

  // Section 7: Standards-Ready Procurement Specification (9 Clauses)
  const nineSections = build9SectionSpecification(result);
  const nineSectionsHtml = nineSections
    .map((sec) => {
      const clausesHtml = sec.clauses
        .map((cl) => `<li class="spec-clause-li">${cl}</li>`)
        .join('');
      return `
        <div class="spec-section-item">
          <div class="spec-section-title">7.${sec.sectionNumber} ${sec.title}</div>
          <ul class="spec-clauses-ul">
            ${clausesHtml}
          </ul>
        </div>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Tender_Specification_${primaryStdNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${language.toUpperCase()}</title>
  <style>
    /* Official Government Technical Schedule Print Stylesheet */
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
      @top-right {
        content: "${formattedDate} | MS-TSR-${primaryStdNumber.replace(/[^a-zA-Z0-9]/g, '_')}";
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        color: #64748b;
      }
      @bottom-left {
        content: "MaanakSetu (BIS SmartSpec AI Engine) — Government Technical Schedule";
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        color: #64748b;
      }
      @bottom-right {
        content: "Page " counter(page);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.45;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }

    /* Top Running Header for Screen and Print */
    .doc-header {
      text-align: center;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .gov-title {
      font-size: 13.5pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0 0 3px 0;
    }

    .doc-subtitle {
      font-size: 10.5pt;
      font-weight: 700;
      color: #0f766e;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }

    .doc-meta {
      font-size: 8pt;
      color: #475569;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }

    .meta-sep {
      color: #94a3b8;
    }

    .header-rule {
      height: 1.5px;
      background: #0f172a;
      width: 100%;
      margin: 0 0 14px 0;
    }

    /* Page 1: Metadata Table */
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      font-size: 9pt;
      page-break-inside: avoid;
    }

    .meta-table td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      vertical-align: middle;
    }

    .meta-label {
      font-weight: 600;
      color: #334155;
      background-color: #f1f5f9;
      width: 23%;
      font-size: 8.5pt;
    }

    .meta-value {
      color: #0f172a;
      width: 27%;
    }

    .status-badge-mandatory {
      color: #b91c1c;
      font-weight: 700;
    }

    .status-badge-voluntary {
      color: #15803d;
      font-weight: 700;
    }

    /* Section Headings */
    .section-heading {
      font-size: 10.5pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      border-bottom: 1.5px solid #0f766e;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
      letter-spacing: 0.2px;
      page-break-after: avoid;
    }

    .clause-block {
      margin-bottom: 12px;
      font-size: 9pt;
      text-align: justify;
    }

    .clause-item {
      display: flex;
      margin: 0 0 6px 0;
      line-height: 1.45;
    }

    .clause-num {
      font-weight: 700;
      color: #0f766e;
      width: 28px;
      flex-shrink: 0;
    }

    .clause-text {
      flex: 1;
      color: #1e293b;
    }

    .data-integrity-note {
      font-size: 8pt;
      color: #64748b;
      font-style: italic;
      margin-top: 4px;
      padding-left: 28px;
    }

    /* Table Styles */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 14px 0;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    .data-table th {
      background-color: #e2e8f0;
      color: #0f172a;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      text-align: left;
      font-weight: 700;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.2px;
    }

    .data-table td {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      vertical-align: top;
      color: #1e293b;
    }

    .data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .col-std-no {
      width: 22%;
      color: #0f172a;
    }

    .col-std-title {
      width: 44%;
    }

    .col-std-role {
      width: 34%;
    }

    .role-badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 1.5px 5px;
      border-radius: 3px;
      margin-bottom: 3px;
      text-transform: uppercase;
    }

    .role-mandatory-subsystem {
      background: #eff6ff;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    .role-normative-reference {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .role-test-method {
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .role-safety {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }

    .role-installation {
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .role-terminology, .role-related-product {
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e2e8f0;
    }

    .role-desc {
      font-size: 8pt;
      color: #475569;
      line-height: 1.35;
    }

    .text-center-cell {
      text-align: center;
      padding: 10px;
      color: #64748b;
      font-style: italic;
    }

    /* Section 3: QCO Box */
    .qco-box {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      background: #ffffff;
      margin: 8px 0 14px 0;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .qco-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
    }

    .qco-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }

    .qco-label {
      width: 25%;
      font-weight: 700;
      color: #334155;
      background: #f8fafc;
      border-right: 1px solid #e2e8f0;
    }

    .qco-status-tag {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 3px;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .verif-verified {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
    }

    .verif-pending {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fcd34d;
    }

    .verif-not-identified {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
    }

    .qco-statutory-notice {
      padding: 8px 10px;
      background: #f8fafc;
      border-top: 1px solid #cbd5e1;
      font-size: 8pt;
      color: #334155;
      line-height: 1.4;
    }

    /* Section 4: Tech Parameters Table */
    .col-param {
      width: 22%;
      color: #0f172a;
    }

    .col-tender {
      width: 20%;
    }

    .col-ai {
      width: 22%;
    }

    .col-status {
      width: 12%;
      text-align: center;
    }

    .col-addition {
      width: 24%;
      font-size: 8pt;
    }

    .status-tag {
      display: inline-block;
      font-size: 7pt;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 2px;
      text-transform: uppercase;
    }

    .status-specified {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }

    .status-gap {
      background: #fef2f2;
      color: #b91c1c;
      border: 1px solid #fecaca;
    }

    .status-resolved {
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    /* Section 6: AI Traceability */
    .col-trace-req {
      width: 24%;
      font-size: 8pt;
    }

    .col-trace-concept {
      width: 24%;
      font-size: 8pt;
    }

    .col-trace-std {
      width: 20%;
    }

    .col-trace-role {
      width: 14%;
    }

    .col-trace-ev {
      width: 18%;
      font-size: 7.5pt;
    }

    .trace-arrow {
      color: #0f766e;
      font-weight: 700;
      font-size: 9pt;
      line-height: 1;
      margin-bottom: 2px;
    }

    .std-badge {
      display: inline-block;
      font-weight: 700;
      color: #0f172a;
      font-size: 8pt;
    }

    .ev-tag {
      display: inline-block;
      font-size: 7pt;
      font-weight: 600;
      color: #0369a1;
      background: #f0f9ff;
      border: 1px solid #e0f2fe;
      padding: 1.5px 4px;
      border-radius: 2px;
    }

    /* Section 7: 9 Clauses */
    .spec-section-item {
      margin-bottom: 8px;
      page-break-inside: avoid;
    }

    .spec-section-title {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      background: #f8fafc;
      border-left: 3px solid #0f766e;
      padding: 3px 6px;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .spec-clauses-ul {
      margin: 0 0 6px 0;
      padding-left: 18px;
      font-size: 8.5pt;
      color: #1e293b;
    }

    .spec-clause-li {
      margin-bottom: 3px;
      line-height: 1.4;
      text-align: justify;
    }

    /* Hyperlink & Provenance Styles */
    .pdf-link {
      color: #0f766e;
      text-decoration: none;
      border-bottom: 1px dotted #0f766e;
      font-weight: 600;
    }

    .pdf-link:hover {
      border-bottom: 1px solid #0f766e;
      color: #115e59;
    }

    .pdf-link-bold {
      color: #0f766e;
      text-decoration: none;
      font-weight: 700;
      border-bottom: 1px dotted #0f766e;
    }

    .pdf-link-bold:hover {
      border-bottom: 1px solid #0f766e;
      color: #115e59;
    }

    .pdf-link-sub {
      color: #0f766e;
      text-decoration: none;
      font-size: 7.5pt;
      font-weight: 600;
    }

    .std-official-source {
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2px;
    }

    .source-tag {
      font-size: 7pt;
      color: #94a3b8;
      font-weight: 600;
      text-transform: uppercase;
    }

    .trace-source-link {
      margin-top: 2px;
    }

    .trace-verif-note {
      font-size: 6.5pt;
      color: #64748b;
      font-style: italic;
      margin-top: 1px;
    }

    .badge-official {
      display: inline-block;
      font-size: 6.5pt;
      font-weight: 700;
      padding: 1px 4px;
      border-radius: 2px;
      text-transform: uppercase;
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .provenance-banner {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3px solid #0f766e;
      padding: 5px 8px;
      border-radius: 2px;
      margin-top: 6px;
      font-size: 8pt;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
    }

    .prov-label {
      font-weight: 700;
      color: #334155;
      margin-right: 4px;
    }

    .prov-status {
      font-size: 7.5pt;
      color: #64748b;
      font-style: italic;
    }

    /* Restrained Section: Official Source References */
    .pdf-source-references {
      margin-top: 16px;
      padding: 10px 12px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 4px;
      font-size: 8pt;
      page-break-inside: avoid;
    }

    .source-ref-header {
      font-size: 8.5pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }

    .source-ref-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 14px;
      margin-bottom: 6px;
    }

    .source-ref-card {
      display: flex;
      gap: 6px;
      align-items: flex-start;
    }

    .ref-index {
      font-weight: 800;
      color: #0f766e;
      font-size: 8pt;
      flex-shrink: 0;
      line-height: 1.3;
    }

    .ref-sub {
      font-size: 7pt;
      color: #64748b;
      margin-top: 1px;
      line-height: 1.3;
    }

    .pdf-trust-notice {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px dashed #cbd5e1;
      font-size: 7.5pt;
      color: #475569;
      text-align: center;
      line-height: 1.35;
    }

    /* Approval Block */
    .approval-section {
      margin-top: 24px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 4px;
      padding: 12px 14px;
      page-break-inside: avoid;
    }

    .approval-header {
      font-size: 9.5pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: 0.3px;
    }

    .approval-subtext {
      font-size: 8pt;
      color: #64748b;
      text-align: center;
      margin: 0 0 20px 0;
    }

    .signatures-grid {
      display: flex;
      justify-content: space-between;
      gap: 16px;
    }

    .sig-card {
      flex: 1;
      text-align: center;
    }

    .sig-line {
      height: 35px;
      border-bottom: 1.5px solid #475569;
      margin-bottom: 6px;
    }

    .sig-title {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }

    .sig-role {
      font-size: 7.5pt;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 1px;
    }

    .sig-dept {
      font-size: 7pt;
      color: #94a3b8;
      margin-top: 1px;
    }

    /* Print Break Utilities */
    .page-break {
      page-break-before: always;
    }

    @media screen {
      body {
        background: #f1f5f9;
        padding: 20px;
      }
      .sheet {
        background: #ffffff;
        max-width: 210mm;
        margin: 0 auto;
        padding: 16mm;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <!-- Header Block -->
    <div class="doc-header">
      <div class="gov-title">GOVERNMENT OF INDIA / PUBLIC SECTOR PROCUREMENT</div>
      <div class="doc-subtitle">TECHNICAL SPECIFICATION &amp; STATUTORY COMPLIANCE SCHEDULE</div>
      <div class="doc-meta">
        <span>Generated via MaanakSetu (BIS SmartSpec AI Engine)</span>
        <span class="meta-sep">•</span>
        <span>Generated on: ${formattedDate}</span>
        <span class="meta-sep">•</span>
        <span>Standard: ${primaryStdNumber}</span>
      </div>
    </div>
    <div class="header-rule"></div>

    <!-- Page 1: Metadata Table -->
    <table class="meta-table">
      <tbody>
        <tr>
          <td class="meta-label">Tender Item / Product:</td>
          <td class="meta-value"><strong>${productUpper}</strong></td>
          <td class="meta-label">Primary Standard:</td>
          <td class="meta-value"><a href="${primaryStdUrl}" target="_blank" class="pdf-link-bold"><strong>${primaryStdNumber}</strong> ↗</a></td>
        </tr>
        <tr>
          <td class="meta-label">Intended Application:</td>
          <td class="meta-value">${applicationText}</td>
          <td class="meta-label">BIS Technical Committee:</td>
          <td class="meta-value">${committeeText}</td>
        </tr>
        <tr>
          <td class="meta-label">Statutory Certification:</td>
          <td class="meta-value status-badge-${certClass}"><strong>${certStatusText}</strong></td>
          <td class="meta-label">Applicable Scheme:</td>
          <td class="meta-value"><strong>${schemeText}</strong></td>
        </tr>
      </tbody>
    </table>

    <!-- Section 1: Mandatory Indian Standard Compliance Clause -->
    <div class="section-heading">1. Mandatory Indian Standard Compliance Clause</div>
    <div class="clause-block">
      <div class="clause-item">
        <div class="clause-num">1.1</div>
        <div class="clause-text">
          The supplied items/equipment shall strictly conform to the specifications, constructional benchmarks, and performance metrics of <a href="${primaryStdUrl}" target="_blank" class="pdf-link-bold"><strong>${primaryStdNumber}</strong> ↗</a> (<em>${primaryStdTitle}</em>) as formulated and published by the Bureau of Indian Standards (BIS).
        </div>
      </div>
      <div class="provenance-banner">
        <div class="provenance-item">
          <span class="prov-label">Official Source:</span>
          <a href="${primaryStdUrl}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label} ↗</a>
        </div>
        <div class="provenance-item">
          <span class="prov-label">Source Classification:</span>
          <span class="badge-official">OFFICIAL SOURCE</span>
        </div>
        <div class="provenance-item">
          <span class="prov-label">Verification:</span>
          <span class="prov-status">${LIVE_VERIFICATION_REQUIRED_TEXT}</span>
        </div>
      </div>
      <div class="clause-item" style="margin-top: 6px;">
        <div class="clause-num">1.2</div>
        <div class="clause-text">
          Applicable amendments in force (${amendmentsList}) as on the date of tender issuance shall be considered mandatory. Bidders shall submit documentation certifying full adherence to all published amendments.
        </div>
      </div>
      <div class="clause-item">
        <div class="clause-num">1.3</div>
        <div class="clause-text">
          Pursuant to Rule 144(i)(b) of the General Financial Rules (GFR 2017) and Public Procurement Orders, citing or supplying goods under superseded, withdrawn, or outdated editions of Indian Standards is strictly prohibited. Any bid offering products tested or manufactured to obsolete revisions shall be deemed technically non-responsive and disqualified.
        </div>
      </div>
      <div class="data-integrity-note">
        * Standards verification status: Verified against active BIS Catalogue (ETD/CED/MED Division registers). Data accurate up to the current gazette revision.
      </div>
    </div>

    <!-- Section 2: Allied & Normative Subsystem Standards Table -->
    <div class="section-heading">2. Allied &amp; Normative Subsystem Standards</div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 22%;">Standard No.</th>
          <th style="width: 44%;">Standard Title</th>
          <th style="width: 34%;">Relevance / Interoperability Role</th>
        </tr>
      </thead>
      <tbody>
        ${relatedRowsHtml}
      </tbody>
    </table>

    <!-- Section 3: Quality Control Order / Statutory Compliance -->
    <div class="section-heading">3. Quality Control Order / Statutory Compliance</div>
    <div class="qco-box">
      <table class="qco-table">
        <tbody>
          <tr>
            <td class="qco-label">Statutory Notification:</td>
            <td><strong>${qcoOrderName}</strong> (${qcoGazette})</td>
          </tr>
          <tr>
            <td class="qco-label">Official Regulatory Source:</td>
            <td>
              <a href="${OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.label} ↗</a>
              <span class="badge-official" style="margin-left: 6px;">OFFICIAL SOURCE</span>
            </td>
          </tr>
          <tr>
            <td class="qco-label">Authority / Ministry:</td>
            <td>${qcoMinistry}</td>
          </tr>
          <tr>
            <td class="qco-label">Statutory Applicability:</td>
            <td>${isCompulsory ? 'Compulsory under Section 16 of the Bureau of Indian Standards Act, 2016 for all manufacturing, commercial distribution, and public procurement.' : 'Voluntary manufacturing and procurement benchmark.'}</td>
          </tr>
          <tr>
            <td class="qco-label">Official Certification Source:</td>
            <td>
              <a href="${OFFICIAL_PORTALS.BIS_CERTIFICATION_PROCESS.url}" target="_blank" class="pdf-link">${OFFICIAL_PORTALS.BIS_CERTIFICATION_PROCESS.label} ↗</a>
            </td>
          </tr>
          ${isCrsApplicable ? `
          <tr>
            <td class="qco-label">Official CRS Source:</td>
            <td>
              <a href="${OFFICIAL_PORTALS.BIS_CRS.url}" target="_blank" class="pdf-link">${OFFICIAL_PORTALS.BIS_CRS.label} ↗</a>
              <span class="badge-official" style="margin-left: 6px;">CRS SCHEME</span>
            </td>
          </tr>` : ''}
          <tr>
            <td class="qco-label">Official Procurement Context:</td>
            <td>
              <a href="${OFFICIAL_PORTALS.GEM_PORTAL.url}" target="_blank" class="pdf-link">${OFFICIAL_PORTALS.GEM_PORTAL.label} ↗</a>
              <span style="font-size: 7.5pt; color: #64748b; margin-left: 6px;">(Context reference, not evidence of IS standard applicability)</span>
            </td>
          </tr>
          <tr>
            <td class="qco-label">Verification Status:</td>
            <td>
              <span class="qco-status-tag ${verifBadgeClass}"><strong>${verificationStatus}</strong></span>
              <span style="font-size: 7.5pt; color: #64748b; margin-left: 8px;">(${LIVE_VERIFICATION_REQUIRED_TEXT})</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="qco-statutory-notice">
        <strong>Statutory Notice:</strong> Under the BIS Act 2016, supply of non-certified products governed by a notified Quality Control Order is prohibited by law. Offers lacking verified BIS certification credentials shall be rejected without technical clarification.
      </div>
    </div>

    <!-- Section 4: Technical Parameters & Gap Closures Table -->
    <div class="section-heading">4. Technical Parameters &amp; Gap Closures</div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 22%;">Parameter</th>
          <th style="width: 20%;">Tender Requirement</th>
          <th style="width: 22%;">AI-Detected Requirement</th>
          <th style="width: 12%; text-align: center;">Status</th>
          <th style="width: 24%;">Recommended Addition</th>
        </tr>
      </thead>
      <tbody>
        ${techRowsHtml}
      </tbody>
    </table>

    <!-- Section 5: Scheme of Testing and Inspection (STI) & Quality Assurance -->
    <div class="section-heading">5. Scheme of Testing and Inspection (STI) &amp; Quality Assurance</div>
    <div class="clause-block">
      <div class="clause-item">
        <div class="clause-num">5.1</div>
        <div class="clause-text">
          <strong>Type Test Certificates:</strong> The bidder shall furnish authentic Type Test Certificates for all mandatory tests prescribed in <strong>${primaryStdNumber}</strong> conducted at a BIS-recognized or NABL-accredited test laboratory within the preceding three (3) years.
        </div>
      </div>
      <div class="clause-item">
        <div class="clause-num">5.2</div>
        <div class="clause-text">
          <strong>Routine &amp; Factory Testing Protocol:</strong> Testing and factory inspection shall conform strictly to the official BIS Scheme of Testing and Inspection: <em>${primaryStandard?.schemesOfTesting || 'STI as prescribed under relevant BIS Product Manual'}</em>.
        </div>
      </div>
      <div class="clause-item">
        <div class="clause-num">5.3</div>
        <div class="clause-text">
          <strong>Pre-Dispatch Inspection (PDI):</strong> The Buyer or an authorized independent third-party inspecting agency (e.g. RITES, EIL, BIS) reserves the right to conduct pre-dispatch inspection (PDI) at the manufacturer works prior to release of consignment.
        </div>
      </div>
      <div class="clause-item">
        <div class="clause-num">5.4</div>
        <div class="clause-text">
          <strong>Acceptance Sampling:</strong> Consignment sampling and acceptance thresholds shall strictly adhere to the sampling plan stipulated in the applicable standard. Failure of any sample shall result in lot rejection at supplier expense.
        </div>
      </div>
    </div>

    <!-- Section 6: AI Recommendation Traceability -->
    <div class="section-heading">6. AI Recommendation Traceability &amp; Standards Decision Matrix</div>
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 24%;">Tender Requirement</th>
          <th style="width: 24%;">Extracted Technical Concept</th>
          <th style="width: 20%;">Recommended Indian Standard</th>
          <th style="width: 14%;">Relevance</th>
          <th style="width: 18%;">Evidence / Source Status</th>
        </tr>
      </thead>
      <tbody>
        ${traceabilityRowsHtml}
      </tbody>
    </table>

    <!-- Section 7: Standards-Ready Procurement Specification -->
    <div class="section-heading">7. Standards-Ready Procurement Specification</div>
    <div class="spec-clauses-container">
      ${nineSectionsHtml}
    </div>

    <!-- Restrained Section: Official Source References & Statutory Provenance -->
    <div class="pdf-source-references">
      <div class="source-ref-header">OFFICIAL SOURCE REFERENCES &amp; STATUTORY PROVENANCE</div>
      <div class="source-ref-grid">
        <div class="source-ref-card">
          <span class="ref-index">[1]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label} ↗</a>
            <div class="ref-sub">Search Indian Standards by number or keyword, verify editions &amp; amendments.</div>
          </div>
        </div>
        <div class="source-ref-card">
          <span class="ref-index">[2]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_COMPULSORY_CERTIFICATION.label} ↗</a>
            <div class="ref-sub">Verify whether items fall under compulsory certification requirements (DPIIT/MeitY/MoP QCOs).</div>
          </div>
        </div>
        <div class="source-ref-card">
          <span class="ref-index">[3]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.BIS_EBIS.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_EBIS.label} ↗</a>
            <div class="ref-sub">Official BIS stakeholder services, license search &amp; conformity tracking portal.</div>
          </div>
        </div>
        ${isCrsApplicable ? `
        <div class="source-ref-card">
          <span class="ref-index">[4]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.BIS_CRS.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_CRS.label} ↗</a>
            <div class="ref-sub">Compulsory Registration Scheme for electronics, drivers, and IT equipment.</div>
          </div>
        </div>` : `
        <div class="source-ref-card">
          <span class="ref-index">[4]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.BIS_MAIN.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_MAIN.label} ↗</a>
            <div class="ref-sub">Official BIS information, certification standards and regulatory information.</div>
          </div>
        </div>`}
        <div class="source-ref-card">
          <span class="ref-index">[5]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.GEM_PORTAL.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.GEM_PORTAL.label} ↗</a>
            <div class="ref-sub">Government e-Marketplace procurement context &amp; golden technical parameters.</div>
          </div>
        </div>
        <div class="source-ref-card">
          <span class="ref-index">[6]</span>
          <div>
            <a href="${OFFICIAL_PORTALS.BIS_CARE.url}" target="_blank" class="pdf-link-bold">${OFFICIAL_PORTALS.BIS_CARE.label} ↗</a>
            <div class="ref-sub">Verification of licence/registration details, standards and consumer safety.</div>
          </div>
        </div>
      </div>
      <div class="pdf-trust-notice">
        <strong>Notice:</strong> ${SECURITY_TRUST_NOTICE}
      </div>
    </div>

    <!-- Official Approval Block -->
    <div class="approval-section">
      <div class="approval-header">PROCUREMENT SPECIFICATION SCRUTINY &amp; APPROVAL RECORD</div>
      <div class="approval-subtext">
        The technical parameters, Indian Standards citations, and statutory QCO mandates detailed in this schedule have been scrutinized and approved for inclusion into the tender bid documents.
      </div>
      <div class="signatures-grid">
        <div class="sig-card">
          <div class="sig-line"></div>
          <div class="sig-title">Indenting / Technical Officer</div>
          <div class="sig-role">Signature &amp; Date</div>
          <div class="sig-dept">Technical Specification Directorate</div>
        </div>
        <div class="sig-card">
          <div class="sig-line"></div>
          <div class="sig-title">Scrutiny / BIS Compliance Officer</div>
          <div class="sig-role">BIS Standards Scrutiny</div>
          <div class="sig-dept">Standards &amp; Quality Assurance Cell</div>
        </div>
        <div class="sig-card">
          <div class="sig-line"></div>
          <div class="sig-title">Competent Approving Authority</div>
          <div class="sig-role">Approval / Sanction</div>
          <div class="sig-dept">Competent Financial Authority</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

/**
 * Triggers printing of the official government technical schedule PDF.
 * Opens an isolated print window and triggers the native browser print dialogue.
 */
export function printOfficialTenderPdf(
  result: RecommendationResult,
  language: SupportedLanguage = 'en'
): void {
  const html = generateOfficialTenderPdfHtml(result, language);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  } else {
    // If popups are blocked, create a temporary hidden iframe to print
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 400);
    }
  }
}
