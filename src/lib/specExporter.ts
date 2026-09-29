import { RecommendationResult } from '../types/procurement';
import { SupportedLanguage } from '../types/language';

export interface StructuredSpecificationClause {
  sectionNumber: number;
  title: string;
  clauses: string[];
}

export function build9SectionSpecification(
  result: RecommendationResult,
  additionalClauses: string[] = []
): StructuredSpecificationClause[] {
  const { extractedRequirement, primaryStandard, relatedStandards, specificationGaps } = result;

  const resolvedGaps = specificationGaps.filter((g) => g.isResolved);

  if (!primaryStandard) {
    return [
      {
        sectionNumber: 1,
        title: 'Scope of Procurement & Adherence Notice',
        clauses: [
          `Procurement of ${extractedRequirement.product} for ${extractedRequirement.application}.`,
          'Notice: No direct mandatory Indian Standard was automatically matched in the active BIS catalog.',
          'Guardrail recommendation: Consult the relevant BIS Standardization Division (ETD/CED/MED) for technical classification before drafting custom tender specifications.',
        ],
      },
    ];
  }

  // 1. Scope
  const section1: StructuredSpecificationClause = {
    sectionNumber: 1,
    title: 'Scope of Work & General Requirements',
    clauses: [
      `1.1 This specification covers the technical requirements for supply, inspection, testing, packaging, and delivery of ${extractedRequirement.product} intended for ${extractedRequirement.application}.`,
      `1.2 The equipment/material shall be suitable for continuous outdoor/indoor operation under Indian tropical climatic conditions (ambient temperature up to 50°C and relative humidity up to 95%).`,
      `1.3 All components supplied shall be brand new, un-used, of current manufacture, and free from any patent defects in workmanship or materials.`,
    ],
  };

  // 2. Product Requirements
  const productClauses = [
    `2.1 Power / Capacity Rating: ${extractedRequirement.power || extractedRequirement.capacity || 'As stipulated in Schedule of Requirements'}.`,
    `2.2 Operating Voltage & Supply: ${extractedRequirement.voltage || '230 V AC / 415 V AC, 50 Hz +/- 3%'}.`,
    `2.3 Enclosure Protection / Material: ${extractedRequirement.protectionRating || 'Minimum IP66 weatherproofing as per IS 12063'} constructed from high-grade corrosion-resistant materials.`,
    `2.4 Performance Benchmark: ${extractedRequirement.efficiency || extractedRequirement.lifetime || 'High energy efficiency conforming to latest Bureau of Energy Efficiency (BEE) benchmarks'}.`,
  ];
  if (extractedRequirement.otherSpecs && Object.keys(extractedRequirement.otherSpecs).length > 0) {
    Object.entries(extractedRequirement.otherSpecs).forEach(([key, val]) => {
      productClauses.push(`2.${productClauses.length + 1} ${key}: ${val}.`);
    });
  }
  const section2: StructuredSpecificationClause = {
    sectionNumber: 2,
    title: 'Product Requirements & Technical Benchmarks',
    clauses: productClauses,
  };

  // 3. Applicable Indian Standards
  const activeAmendments = primaryStandard.versionChain.amendments.length > 0
    ? primaryStandard.versionChain.amendments.map((a) => `Amd. ${a.number} (${a.year})`).join(', ')
    : 'Nil';
  const stdClauses = [
    `3.1 Primary Standard: The supplied items shall strictly conform in all respects to the latest edition of ${primaryStandard.isNumber} including all amendments in force (${activeAmendments}).`,
    `3.2 Currency Prohibition: Citing or supplying under legacy, superseded, or withdrawn revisions of standards is strictly prohibited under General Financial Rules (GFR 2017).`,
    `3.3 Normative References: The subsystems, raw materials, and components shall conform to the following allied Indian Standards:`,
  ];
  relatedStandards.slice(0, 5).forEach((rel, i) => {
    stdClauses.push(`    3.3.${i + 1} ${rel.standard.isNumber} - ${rel.standard.title}`);
  });
  const section3: StructuredSpecificationClause = {
    sectionNumber: 3,
    title: 'Applicable Indian Standards (Mandatory & Normative)',
    clauses: stdClauses,
  };

  // 4. Testing Requirements
  const testClauses = [
    `4.1 Type Tests: The bidder shall submit authentic Type Test Certificates for all mandatory tests prescribed in ${primaryStandard.isNumber} conducted at a BIS-recognized or NABL-accredited laboratory within the preceding three (3) years.`,
    `4.2 Routine & Acceptance Tests: Routine tests shall be carried out by the manufacturer on 100% of finished units in accordance with ${primaryStandard.schemesOfTesting}.`,
  ];
  // Add resolved test gaps
  resolvedGaps
    .filter((g) => g.parameter.toLowerCase().includes('test') || g.parameter.toLowerCase().includes('lab') || g.parameter.toLowerCase().includes('certificate'))
    .forEach((g) => {
      testClauses.push(`4.${testClauses.length + 1} [Adopted Requirement] ${g.suggestedClause}`);
    });
  const section4: StructuredSpecificationClause = {
    sectionNumber: 4,
    title: 'Testing Requirements & Verification Regime',
    clauses: testClauses,
  };

  // 5. Safety Requirements
  const safetyClauses = [
    `5.1 Electrical & Mechanical Safety: The equipment shall incorporate all fail-safe protections against over-voltage, short-circuit, mechanical shock, and thermal runaway.`,
    `5.2 Fire & Hazard Containment: All insulating materials and housings shall meet fire-retardant benchmarks with zero toxic emissions in accordance with national safety codes.`,
  ];
  resolvedGaps
    .filter((g) => g.parameter.toLowerCase().includes('surge') || g.parameter.toLowerCase().includes('safety') || g.parameter.toLowerCase().includes('dielectric') || g.parameter.toLowerCase().includes('protection'))
    .forEach((g) => {
      safetyClauses.push(`5.${safetyClauses.length + 1} [Adopted Safety Clause] ${g.suggestedClause}`);
    });
  const section5: StructuredSpecificationClause = {
    sectionNumber: 5,
    title: 'Safety Requirements & Fail-Safe Controls',
    clauses: safetyClauses,
  };

  // 6. Installation Requirements
  const installClauses = [
    `6.1 Site Erection & Commissioning: Supply shall include all necessary mounting hardware, vibration dampeners, and termination lugs suitable for standard municipal/industrial infrastructure.`,
    `6.2 Earthing & Grounding: Outdoor metallic enclosures and structural poles shall be bonded to earth in strict adherence to IS 3043: 2018 (Code of Practice for Earthing) maintaining loop impedance < 5 Ohms.`,
    `6.3 Environmental Clearance: Installation shall ensure adequate heat dissipation clearance and protection from standing rainwater.`,
  ];
  const section6: StructuredSpecificationClause = {
    sectionNumber: 6,
    title: 'Installation, Earthing & Commissioning Requirements',
    clauses: installClauses,
  };

  // 7. Certification Requirements
  const certClauses = [
    `7.1 Statutory Regulatory Order: ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification}).`,
    `7.2 Certification Status: ${primaryStandard.qco.isCompulsory ? 'COMPULSORY STATUTORY REQUIREMENT' : 'VOLUNTARY BENCHMARK'}.`,
    `7.3 Certification Scheme: ${primaryStandard.qco.scheme}.`,
    `7.4 Mandatory Tender Eligibility: Bidders must possess a valid BIS license (ISI Mark) or valid Compulsory Registration Scheme (CRS) R-number as on the date of technical bid opening. Bids without verified BIS credentials shall be rejected without technical evaluation.`,
  ];
  const section7: StructuredSpecificationClause = {
    sectionNumber: 7,
    title: 'Certification & Quality Control Order (QCO) Compliance',
    clauses: certClauses,
  };

  // 8. Inspection / Acceptance Criteria
  const inspectClauses = [
    `8.1 Pre-Dispatch Inspection (PDI): The Buyer or nominated third-party inspection agency (e.g. RITES, EIL, BIS) reserves the right to witness acceptance tests at the manufacturer works prior to dispatch.`,
    `8.2 Rejection Threshold: If any sample fails to meet specified benchmarks during batch sampling under ${primaryStandard.schemesOfTesting}, the entire production lot shall be rejected at supplier cost.`,
    `8.3 Delivery Acceptance: Consignments delivered at project site shall be subject to physical verification of intact factory seals and tamper-proof batch markings.`,
  ];
  const section8: StructuredSpecificationClause = {
    sectionNumber: 8,
    title: 'Inspection, Surveillance & Acceptance Criteria',
    clauses: inspectClauses,
  };

  // 9. Documentation Requirements
  const docClauses = [
    `9.1 Manufacturer Test Certificate (MTC): Every dispatch consignment shall be accompanied by an original MTC certifying physical and chemical batch conformity.`,
    `9.2 Standard Mark Authorization: A certified copy of the valid BIS endorsement letter covering the specific manufacturing location and model number.`,
    `9.3 Operating Manuals: Comprehensive Operation & Maintenance (O&M) manuals, circuit diagrams, and warranty documentation (minimum 36 months warranty) in English and Hindi.`,
  ];
  if (additionalClauses.length > 0) {
    additionalClauses.forEach((c) => {
      docClauses.push(`9.${docClauses.length + 1} ${c}`);
    });
  }
  const section9: StructuredSpecificationClause = {
    sectionNumber: 9,
    title: 'Documentation & Delivery Deliverables',
    clauses: docClauses,
  };

  return [section1, section2, section3, section4, section5, section6, section7, section8, section9];
}

export function buildOfficialTenderSpecificationClause(
  result: RecommendationResult,
  additionalClauses: string[] = [],
  _language: SupportedLanguage = 'en'
): string {
  const sections = build9SectionSpecification(result, additionalClauses);
  const now = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const lines: string[] = [
    '================================================================================',
    'GOVERNMENT OF INDIA / PUBLIC SECTOR ENTERPRISE PROCUREMENT SPECIFICATION',
    `ManakSetu - AI Procurement Standards Copilot | Date: ${now}`,
    '================================================================================',
    '',
    `TENDER ITEM: ${result.extractedRequirement.product.toUpperCase()}`,
    `APPLICATION: ${result.extractedRequirement.application}`,
    `PRIMARY BIS STANDARD: ${result.primaryStandard ? result.primaryStandard.isNumber : 'NOT MANDATORY / CLASSIFICATION REQUIRED'}`,
    `CERTIFICATION STATUS: ${result.primaryStandard ? (result.primaryStandard.qco.isCompulsory ? 'COMPULSORY QCO IN FORCE' : 'VOLUNTARY BENCHMARK') : 'N/A'}`,
    '',
    '--------------------------------------------------------------------------------',
  ];

  sections.forEach((sec) => {
    lines.push(`SECTION ${sec.sectionNumber}: ${sec.title.toUpperCase()}`);
    lines.push('--------------------------------------------------------------------------------');
    sec.clauses.forEach((cl) => lines.push(cl));
    lines.push('');
  });

  lines.push('================================================================================');
  lines.push('Formulated for direct insertion into GeM Custom Parameters / Schedule of Technical Requirements (STR).');
  lines.push('================================================================================');

  return lines.join('\n');
}
