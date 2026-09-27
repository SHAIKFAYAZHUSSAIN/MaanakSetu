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
import { SESSION_COOKIE, validSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const tenderDocText = (body.tenderDocText || '').trim();
    const selectedItemIndex = typeof body.selectedItemIndex === 'number' ? body.selectedItemIndex : 0;

    const isAuth = await validSession(req.cookies.get(SESSION_COOKIE)?.value);

    // Exact pre-configured benchmark tenders that public visitors are allowed to inspect
    const ALLOWED_BENCHMARK_QUERIES = [
      '1000 led street lights, 90w, outdoor use, ip66, suitable for indian roads, with surge protection and minimum 50,000 hours lifetime.',
      'procurement of 500 kva outdoor oil-immersed distribution transformer, 11kv / 433v, energy efficiency level 2, copper winding with cpri type test.',
      '40w standalone solar led street light system with monocrystalline solar pv module, lifepo4 battery storage, ip65 housing and mnre compliance.',
      '5 hp three phase agricultural monobloc water pump, 415v, clear cold water irrigation, energy efficient bee star rating with ip55 protection.',
      '200 units folding hospital wheelchairs for adult patients, epoxy powder-coated tubular steel frame, solid rubber tyres with 120 kg load capacity.',
      '300 units 4mp outdoor ip cctv surveillance cameras with night vision ir, ip66 weatherproof housing, onvif compliant and stqc cybersecurity certification.',
      'ग्रामीण विद्युतीकरण के लिए 250 kva आउटडोर डिस्ट्रीब्यूशन ट्रांसफार्मर, 11kv/433v, तांबे की वाइंडिंग और बीईई स्टार रेटिंग।',
      'గ్రామీణ విద్యుదీకరణ కొరకు 250 kva అవుట్‌డోర్ డిస్ట్రిబ్యూషన్ ట్రాన్స్‌ఫార్మర్, 11kv/433v, రాగి వైండింగ్ మరియు bee స్టార్ రేటింగ్.',
      'మున్సిపల్ రోడ్ల ప్రాజెక్ట్ కోసం 90w అవుట్‌డోర్ led స్ట్రీట్ లైట్లు 1000 కావలెను, ip66 ప్రొటెక్షన్ మరియు సర్జ్ రక్షణతో కనీసం 50,000 గంటల జీవితకాలం.',
      'கிராமப்புற மின்மயமாக்கலுக்கான 250 kva வெளிப்புற விநியோக மின்மாற்றி, 11kv/433v, தாமிர முறுக்கு மற்றும் bee நட்சத்திர மதிப்பீடு.',
      'விவசாய பாசனத்திற்கு 5hp மூன்று கட்ட மோனோபிளாக் நீர் பம்ப், 415v, ஐபி55 பாதுகாப்புடன்.',
      'procure 50 metric tonnes of 16mm saria fe 500d for primary school concrete building construction.',
      'tender specification for high strength deformed steel bars conforming to is 1786:1985 for bridge pier foundation.',
      'supply of 500 packed lunch catering boxes with bottled water for national civil services training workshop.',
    ];

    const isExactBenchmark =
      !tenderDocText &&
      ALLOWED_BENCHMARK_QUERIES.some((b) => b.trim() === query.trim().toLowerCase());

    if (!isAuth && !isExactBenchmark) {
      return NextResponse.json(
        {
          error:
            'Officer authentication required to create or analyze custom tender specifications. You are in Public View Mode (you can browse existing benchmark tenders).',
          requiresAuth: true,
        },
        { status: 403 }
      );
    }

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
