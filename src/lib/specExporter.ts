import { RecommendationResult } from '../types/procurement';

export function buildOfficialTenderSpecificationClause(
  result: RecommendationResult,
  additionalClauses: string[] = []
): string {
  const { extractedRequirement, primaryStandard, relatedStandards, specificationGaps } = result;

  const now = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const resolvedGapClauses = specificationGaps
    .filter((g) => g.isResolved)
    .map((g) => `   - [SPEC GAP RESOLVED] ${g.parameter}: ${g.suggestedClause}`)
    .join('\n');

  const customAdditions = additionalClauses.length > 0
    ? `\n\n4. ADDITIONAL PROCUREMENT STIPULATIONS:\n${additionalClauses.map((c, i) => `   4.${i + 1} ${c}`).join('\n')}`
    : '';

  const relatedCitations = relatedStandards
    .map((r, i) => `   2.${i + 1} ${r.standard.isNumber} - ${r.standard.title}`)
    .join('\n');

  return `================================================================================
GOVERNMENT OF INDIA / PUBLIC SECTOR PROCUREMENT SPECIFICATION CLAUSE
Generated via MaanakSetu - BIS SmartSpec AI Engine | Date: ${now}
================================================================================

TENDER ITEM: ${extractedRequirement.product.toUpperCase()}
APPLICATION: ${extractedRequirement.application}
PRIMARY BIS STANDARD: ${primaryStandard.isNumber}

1. MANDATORY APPLICABLE INDIAN STANDARDS:
   1.1 The supplied items shall strictly conform to the latest edition of ${primaryStandard.isNumber} 
       including all amendments in force (Amendment(s): ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'Nil'}).
   1.2 Legacy or superseded revisions of standards shall not be accepted under any circumstances.

2. NORMATIVE & ALLIED REFERENCE STANDARDS (MANDATORY SUBSYSTEM COMPLIANCE):
${relatedCitations || '   (None specified)'}

3. REGULATORY QUALITY CONTROL ORDER (QCO) & BIS CERTIFICATION CLAUSE:
   3.1 Certification Status: ${primaryStandard.qco.isCompulsory ? 'COMPULSORY STATUTORY REQUIREMENT' : 'VOLUNTARY / STANDARD SPECIFICATION'}
   3.2 Scheme: ${primaryStandard.qco.scheme}
   3.3 Regulatory Order: ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification})
   3.4 Mandatory Clause: Bidders must possess a valid BIS license / CRS registration number as of the 
       date of tender opening. Bids without verified BIS credentials shall be summarily rejected at the 
       technical evaluation stage without further clarification.

4. TECHNICAL BENCHMARKS & SPECIFICATION CLAUSES:
   - Rated Power / Capacity: ${extractedRequirement.power || extractedRequirement.capacity || 'As specified in schedule of quantities'}
   - Nominal Voltage & Supply: ${extractedRequirement.voltage || '230 V AC, 50 Hz'}
   - Environmental Enclosure Rating: ${extractedRequirement.protectionRating || 'IP66 minimum as per IS 12063'}
   - Lifetime & Endurance: ${extractedRequirement.lifetime || 'Minimum 50,000 burning hours'}
${resolvedGapClauses ? `\n${resolvedGapClauses}` : ''}
${customAdditions}

5. TESTING, INSPECTION & ACCEPTANCE REGIME:
   5.1 The manufacturer shall furnish authentic Type Test Certificates from a BIS-approved or 
       NABL-accredited test laboratory conducted within the preceding three (3) years.
   5.2 Scheme of Testing and Inspection (STI): Supplier must adhere to ${primaryStandard.schemesOfTesting}.
   5.3 Pre-dispatch inspection (PDI) may be conducted by the Buyer or an authorized third-party inspection agency (RITES / EIL / BIS).

================================================================================
Generated for insertion into GeM Custom Parameters / Schedule of Technical Requirements (STR).
================================================================================`;
}
