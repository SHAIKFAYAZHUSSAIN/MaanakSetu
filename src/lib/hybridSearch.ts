import { BIS_STANDARDS_DATABASE } from '../data/standardsKnowledgeBase';
import { IndianStandard } from '../types/standards';
import { CandidateStandardMatch, ExtractedRequirement } from '../types/procurement';

/**
 * Tokenizes text into lowercase normalized terms
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Calculates Jaccard / token overlap similarity between query tokens and text tokens
 */
function tokenSimilarity(queryTokens: string[], targetText: string): number {
  const targetTokens = new Set(tokenize(targetText));
  if (targetTokens.size === 0 || queryTokens.length === 0) return 0;

  let intersection = 0;
  for (const token of queryTokens) {
    if (targetTokens.has(token)) {
      intersection++;
    }
  }

  return intersection / Math.sqrt(queryTokens.length * targetTokens.size);
}

/**
 * Hybrid Re-ranking & Retrieval Engine
 * Final Score = semantic similarity + product match + scope match + application match + parameter match + reference relationship + current-version priority
 */
export function searchStandardsHybrid(requirement: ExtractedRequirement): CandidateStandardMatch[] {
  const queryTokens = tokenize(
    `${requirement.rawQuery} ${requirement.product} ${requirement.application} ${requirement.domain}`
  );

  const candidates: CandidateStandardMatch[] = [];

  for (const standard of BIS_STANDARDS_DATABASE) {
    const matchReasons: string[] = [];
    const parameterMatches: string[] = [];

    let score = 0;

    // 1. Exact IS Number Match
    const cleanIsNumber = standard.isNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanRaw = requirement.rawQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanRaw.includes(cleanIsNumber) || queryTokens.some((t) => standard.isNumber.toLowerCase().includes(t))) {
      score += 45;
      matchReasons.push(`Direct citation of standard identifier ${standard.isNumber}`);
    }

    // 2. Product Name Match (Weight: 35)
    const productTokens = tokenize(standard.productCategory);
    const productOverlap = productTokens.filter((pt) =>
      requirement.product.toLowerCase().includes(pt) || requirement.rawQuery.toLowerCase().includes(pt)
    ).length;

    if (productOverlap > 0) {
      const productScore = Math.min(35, (productOverlap / productTokens.length) * 35);
      score += productScore;
      matchReasons.push(`Matches primary product category "${standard.productCategory}"`);
    }

    // 3. Keyword Match (Weight: 25)
    let keywordHits = 0;
    for (const kw of standard.keywords) {
      if (
        requirement.rawQuery.toLowerCase().includes(kw.toLowerCase()) ||
        requirement.product.toLowerCase().includes(kw.toLowerCase())
      ) {
        keywordHits++;
        if (keywordHits <= 3) {
          matchReasons.push(`Matches technical keyword: "${kw}"`);
        }
      }
    }
    score += Math.min(25, keywordHits * 8);

    // 4. Scope & Application Match (Weight: 20)
    const scopeSim = tokenSimilarity(queryTokens, standard.scope);
    score += scopeSim * 20;
    if (scopeSim > 0.15) {
      matchReasons.push('Aligns with statutory scope and operating environment defined by BIS');
    }

    // 5. Technical Parameter Overlaps (Weight: 15)
    if (requirement.protectionRating && standard.scope.toLowerCase().includes('protection')) {
      score += 6;
      parameterMatches.push(`Ingress Protection: ${requirement.protectionRating}`);
    }
    if (requirement.power && (standard.scope.toLowerCase().includes('luminaire') || standard.scope.toLowerCase().includes('power'))) {
      score += 5;
      parameterMatches.push(`Rated Power: ${requirement.power}`);
    }
    if (requirement.voltage && standard.scope.toLowerCase().includes('volt')) {
      score += 4;
      parameterMatches.push(`Nominal Voltage: ${requirement.voltage}`);
    }
    if (requirement.lifetime && standard.keywords.includes('lifetime')) {
      score += 4;
      parameterMatches.push(`Operating Life: ${requirement.lifetime}`);
    }

    // 6. Current Version Priority Boost (Weight: 10)
    if (standard.status === 'Current') {
      score += 10;
    }

    // 7. Compulsory QCO Regulatory Boost (Weight: 10)
    if (standard.qco.isCompulsory) {
      score += 10;
      matchReasons.push(`Governed under compulsory certification order: ${standard.qco.orderName}`);
    }

    if (score > 12) {
      candidates.push({
        standard,
        score: Math.min(100, Math.round(score)),
        matchReasons,
        parameterMatches,
        normativeRelations: standard.relationships,
        isPrimary: false,
      });
    }
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);

  // Mark the top item as primary
  if (candidates.length > 0) {
    candidates[0].isPrimary = true;
  }

  return candidates;
}

/**
 * Resolves related and normative standards recursively from the primary standard
 */
export function resolveRelatedStandards(primaryStandard: IndianStandard): CandidateStandardMatch[] {
  const relatedMatches: CandidateStandardMatch[] = [];
  const visited = new Set<string>([primaryStandard.isNumber]);

  for (const rel of primaryStandard.relationships) {
    if (visited.has(rel.targetStandardNumber)) continue;
    visited.add(rel.targetStandardNumber);

    // Find in database or create virtual entry
    const found = BIS_STANDARDS_DATABASE.find(
      (s) => s.isNumber.toLowerCase() === rel.targetStandardNumber.toLowerCase()
    );

    if (found) {
      relatedMatches.push({
        standard: found,
        score: rel.criticality === 'Mandatory' ? 92 : 80,
        matchReasons: [`Linked via ${rel.relationshipType}: ${rel.description}`],
        parameterMatches: [],
        normativeRelations: found.relationships,
        isPrimary: false,
      });
    } else {
      // Create a virtual standard record for the referenced standard
      const virtualStandard: IndianStandard = {
        id: `virtual-${rel.targetStandardNumber.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
        isNumber: rel.targetStandardNumber,
        title: rel.targetTitle,
        department: primaryStandard.department,
        domain: primaryStandard.domain,
        productCategory: 'Referenced Standard',
        scope: rel.description,
        status: 'Current',
        versionChain: {
          currentStandard: rel.targetStandardNumber,
          currentYear: 2020,
          amendments: [],
        },
        qco: {
          isCompulsory: rel.criticality === 'Mandatory' && primaryStandard.qco.isCompulsory,
          orderName: primaryStandard.qco.orderName,
          gazetteNotification: primaryStandard.qco.gazetteNotification,
          ministry: primaryStandard.qco.ministry,
          effectiveDate: primaryStandard.qco.effectiveDate,
          scheme: primaryStandard.qco.scheme,
          description: `Referenced standard under ${primaryStandard.isNumber}`,
          enforcementStatus: primaryStandard.qco.enforcementStatus,
        },
        keywords: [rel.relationshipType.toLowerCase()],
        relationships: [],
        technicalRequirements: [],
        commonMissingSpecs: [],
        testingLaboratoriesAvailable: 20,
        schemesOfTesting: 'Standard test method verification scheme',
      };

      relatedMatches.push({
        standard: virtualStandard,
        score: rel.criticality === 'Mandatory' ? 88 : 75,
        matchReasons: [`Direct normative link: ${rel.description}`],
        parameterMatches: [],
        normativeRelations: [],
        isPrimary: false,
      });
    }
  }

  return relatedMatches;
}
