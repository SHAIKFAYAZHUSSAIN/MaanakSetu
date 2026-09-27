import { NextRequest, NextResponse } from 'next/server';
import { extractRequirementsWithGemini, generateExplanation, extractTenderProducts } from '@/lib/gemini';
import {
  searchStandardsHybrid,
  resolveRelatedStandards,
  detectOutdatedStandards,
  generateClarifyingQuestions,
  generateRecommendationEvidence,
} from '@/lib/hybridSearch';
import { buildStandardsKnowledgeGraph } from '@/lib/graphEngine';
import { analyzeSpecificationGaps } from '@/lib/gapAnalysis';
import { buildOfficialTenderSpecificationClause } from '@/lib/specExporter';
import { RecommendationResult, ConfidenceLevel } from '@/types/procurement';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const tenderDocText = (body.tenderDocText || '').trim();
    const selectedItemIndex = typeof body.selectedItemIndex === 'number' ? body.selectedItemIndex : 0;

    const textToAnalyze = tenderDocText ? `${tenderDocText}\n${query}` : query;

    if (!textToAnalyze) {
      return NextResponse.json(
        { error: 'Please provide a procurement query or upload a tender document.' },
        { status: 400 }
      );
    }

    // Step 1: Detect multi-product line items from document
    const tenderItemsDetected = extractTenderProducts(textToAnalyze);

    // If an item index was specifically selected by user, analyze that item's snippet
    let activeText = textToAnalyze;
    if (tenderItemsDetected.length > 1 && tenderItemsDetected[selectedItemIndex]) {
      activeText = `${tenderItemsDetected[selectedItemIndex].productName}\n${tenderItemsDetected[selectedItemIndex].rawSnippet}`;
    }

    // Step 2: AI / Heuristic Requirement Extraction
    const extractedRequirement = await extractRequirementsWithGemini(activeText);

    // Step 3: Outdated / Superseded Standard Detection
    const outdatedStandardAlert = detectOutdatedStandards(textToAnalyze);

    // Step 4: Hybrid Retrieval & Re-Ranking
    const candidateMatches = searchStandardsHybrid(extractedRequirement);

    // Step 5: Strict Confidence & No-Match Guardrail (NEVER DEFAULT TO LIGHTING)
    const primaryCandidate = candidateMatches.length > 0 ? candidateMatches[0] : null;

    if (!primaryCandidate || primaryCandidate.score < 24) {
      const matchScore = primaryCandidate ? primaryCandidate.score : 0;
      const noMatchResult: RecommendationResult = {
        extractedRequirement,
        primaryStandard: null,
        relatedStandards: [],
        specificationGaps: [],
        explanation: {
          rationale: `No reliable Indian Standard was found matching "${extractedRequirement.product}".`,
          productMatchSummary: `Product "${extractedRequirement.product}" does not have a direct mandatory specification in the BIS active standard catalogue.`,
          regulatorySummary: 'No applicable Quality Control Order (QCO) identified for this specific item description.',
          versionAction: 'Verify technical keywords or request BIS Standardization Division classification.',
        },
        standardsGraph: { nodes: [], edges: [] },
        generatedTenderClause: '',
        matchConfidence: matchScore,
        confidenceLevel: 'No_Reliable_Match',
        isNoMatch: true,
        noMatchExplanation: `No reliable Indian Standard found in the database matching "${extractedRequirement.product}". MaanakSetu adheres to strict public procurement integrity and never substitutes unrelated standards (such as lighting). Please verify the product nomenclature or search by specific technical parameters.`,
        clarifyingQuestions: generateClarifyingQuestions(extractedRequirement, candidateMatches),
        outdatedStandardAlert,
        tenderItemsDetected,
        selectedItemIndex,
      };

      return NextResponse.json(noMatchResult);
    }

    // High/Medium/Low confidence calculation
    const primaryStandard = primaryCandidate.standard;
    const matchScore = primaryCandidate.score;
    let confidenceLevel: ConfidenceLevel = 'Low';
    if (matchScore >= 70) {
      confidenceLevel = 'High';
    } else if (matchScore >= 45) {
      confidenceLevel = 'Medium';
    }

    // Step 6: Normative & Related Standards Resolution
    const relatedMatches = resolveRelatedStandards(primaryStandard);

    // Step 7: Specification Gap Analysis (Missing Requirements)
    const specificationGaps = analyzeSpecificationGaps(extractedRequirement, primaryStandard);

    // Step 8: Knowledge Graph Construction
    const standardsGraph = buildStandardsKnowledgeGraph(primaryStandard, relatedMatches);

    // Step 9: Explainable AI Rationale Generation
    const explanation = await generateExplanation(extractedRequirement, primaryStandard, relatedMatches);

    // Step 10: Recommendation Evidence & Clarifying Questions
    const evidence = generateRecommendationEvidence(primaryStandard, extractedRequirement);
    const clarifyingQuestions = generateClarifyingQuestions(extractedRequirement, candidateMatches);

    // Step 11: Formulate Official Tender Clause
    const fullResult: RecommendationResult = {
      extractedRequirement,
      primaryStandard,
      relatedStandards: relatedMatches,
      specificationGaps,
      explanation,
      standardsGraph,
      generatedTenderClause: '',
      matchConfidence: matchScore,
      confidenceLevel,
      isNoMatch: false,
      clarifyingQuestions,
      outdatedStandardAlert,
      evidence,
      tenderItemsDetected,
      selectedItemIndex,
    };

    fullResult.generatedTenderClause = buildOfficialTenderSpecificationClause(fullResult);

    return NextResponse.json(fullResult);
  } catch (error: any) {
    console.error('Error during standards analysis:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze procurement specifications' },
      { status: 500 }
    );
  }
}
