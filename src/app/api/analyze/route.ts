import { NextRequest, NextResponse } from 'next/server';
import { extractRequirementsWithGemini, generateExplanation } from '@/lib/gemini';
import { searchStandardsHybrid, resolveRelatedStandards } from '@/lib/hybridSearch';
import { buildStandardsKnowledgeGraph } from '@/lib/graphEngine';
import { analyzeSpecificationGaps } from '@/lib/gapAnalysis';
import { buildOfficialTenderSpecificationClause } from '@/lib/specExporter';
import { BIS_STANDARDS_DATABASE } from '@/data/standardsKnowledgeBase';
import { RecommendationResult } from '@/types/procurement';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const tenderDocText = (body.tenderDocText || '').trim();

    const textToAnalyze = tenderDocText ? `${tenderDocText}\n${query}` : query;

    if (!textToAnalyze) {
      return NextResponse.json({ error: 'Please provide a procurement query or upload a tender document.' }, { status: 400 });
    }

    // Step 1: AI / Heuristic Requirement Extraction
    const extractedRequirement = await extractRequirementsWithGemini(textToAnalyze);

    // Step 2: Hybrid Retrieval & Re-Ranking
    const candidateMatches = searchStandardsHybrid(extractedRequirement);

    // Primary standard: top scored match or fallback to default
    const primaryCandidate = candidateMatches.length > 0 ? candidateMatches[0] : null;
    const primaryStandard = primaryCandidate ? primaryCandidate.standard : BIS_STANDARDS_DATABASE[0];

    // Step 3: Normative & Related Standards Resolution
    const relatedMatches = resolveRelatedStandards(primaryStandard);

    // Step 4: Specification Gap Analysis (Missing Requirements)
    const specificationGaps = analyzeSpecificationGaps(extractedRequirement, primaryStandard);

    // Step 5: Knowledge Graph Construction
    const standardsGraph = buildStandardsKnowledgeGraph(primaryStandard, relatedMatches);

    // Step 6: Explainable AI Rationale Generation
    const explanation = await generateExplanation(extractedRequirement, primaryStandard, relatedMatches);

    // Step 7: Formulate Official Tender Clause
    const partialResult: RecommendationResult = {
      extractedRequirement,
      primaryStandard,
      relatedStandards: relatedMatches,
      specificationGaps,
      explanation,
      standardsGraph,
      generatedTenderClause: '',
    };

    partialResult.generatedTenderClause = buildOfficialTenderSpecificationClause(partialResult);

    return NextResponse.json(partialResult);
  } catch (error: any) {
    console.error('Error during standards analysis:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze procurement specifications' },
      { status: 500 }
    );
  }
}
