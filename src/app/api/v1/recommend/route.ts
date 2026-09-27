import { NextRequest, NextResponse } from 'next/server';
import { extractRequirementsWithGemini, generateExplanation } from '@/lib/gemini';
import {
  searchStandardsHybrid,
  detectOutdatedStandards,
  generateClarifyingQuestions,
  generateRecommendationEvidence,
  resolveRelatedStandards,
} from '@/lib/hybridSearch';

export const dynamic = 'force-dynamic';

// Enable Cross-Origin Resource Sharing (CORS) for external procurement portal integration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Procurement-Portal',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/v1/recommend - API Specification & Documentation for Portal Integrators
 */
export async function GET() {
  return NextResponse.json(
    {
      api: 'MaanakSetu BIS SmartSpec Procurement API',
      version: 'v1.0.0',
      description:
        'RESTful API for Government e-Marketplace (GeM), CPWD, Indian Railways, and State e-Procurement Portals to query verified Indian Standards, Quality Control Orders (QCO), and compliance clauses during tender preparation.',
      endpoints: {
        recommend: {
          method: 'POST',
          url: '/api/v1/recommend',
          requestBody: {
            query: 'Full tender specification description or product name (English or Indian languages)',
            portal: 'Optional portal identifier (e.g., GeM, CPWD, IndianRailways, StateProcurement)',
          },
          responseFields: [
            'status',
            'isNoMatch',
            'matchConfidence',
            'confidenceLevel',
            'primaryStandard',
            'qcoCompliance',
            'outdatedAlert',
            'clarifyingQuestions',
            'relatedStandards',
            'specificationGaps',
            'tenderClauseReadyToUse',
            'evidence',
          ],
        },
      },
      status: 'online',
    },
    { headers: corsHeaders }
  );
}

/**
 * POST /api/v1/recommend - Standard Recommendation Engine
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body.query || body.specification || body.text || '';
    const portal = body.portal || req.headers.get('X-Procurement-Portal') || 'e-Procurement Portal';

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        {
          error: 'Missing required field: "query". Please provide a product specification or requirement description.',
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Extract requirements via AI
    const extracted = await extractRequirementsWithGemini(query);

    // 2. Check for outdated/withdrawn standard citations
    const outdatedAlert = detectOutdatedStandards(query);

    // 3. Search verified standards database
    const candidates = searchStandardsHybrid(extracted);

    // 4. Handle "No Reliable Match" with strict guardrails (Never default to lighting)
    if (candidates.length === 0 || candidates[0].score < 24) {
      return NextResponse.json(
        {
          status: 'no_reliable_match',
          portal,
          query,
          isNoMatch: true,
          matchConfidence: candidates.length > 0 ? candidates[0].score : 0,
          confidenceLevel: 'No_Reliable_Match',
          message:
            'No reliable Indian Standard found matching this product query in the BIS database. In compliance with strict public procurement guardrails, MaanakSetu does not default unmatched goods to unrelated standards.',
          extractedRequirement: extracted,
          recommendation: null,
          actionRequired:
            'Review product nomenclature or submit a technical classification request to the Bureau of Indian Standards (BIS) Standardization Directorate.',
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // 5. Successful match found
    const primaryCandidate = candidates[0];
    const primaryStandard = primaryCandidate.standard;
    const related = resolveRelatedStandards(primaryStandard);

    // 6. Clarifying questions & evidence
    const clarifyingQuestions = generateClarifyingQuestions(extracted, candidates);
    const evidence = generateRecommendationEvidence(primaryStandard, extracted);
    const explanation = await generateExplanation(extracted, primaryStandard, related);

    // 7. Calculate confidence level
    let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Low';
    if (primaryCandidate.score >= 70) {
      confidenceLevel = 'High';
    } else if (primaryCandidate.score >= 45) {
      confidenceLevel = 'Medium';
    }

    // 8. Generate ready-to-paste tender clause
    const qcoClause = primaryStandard.qco.isCompulsory
      ? `In accordance with the ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification}), all offered products must mandatorily hold a valid ${primaryStandard.qco.scheme} license at the time of bid submission. Bids offering non-certified stock shall be rejected summarily.`
      : `Bidders shall furnish valid type-test certificates from BIS recognized or NABL accredited testing laboratories.`;

    const tenderClauseReadyToUse = `TECHNICAL COMPLIANCE CLAUSE: The supplied equipment shall strictly conform to ${primaryStandard.isNumber} ("${primaryStandard.title}") incorporating all up-to-date amendments. ${qcoClause} Normative compliance with ${related.slice(0, 3).map((r) => r.standard.isNumber).join(', ')} is mandatory for component safety and testing.`;

    return NextResponse.json(
      {
        status: 'success',
        portal,
        query,
        isNoMatch: false,
        matchConfidence: primaryCandidate.score,
        confidenceLevel,
        extractedRequirement: extracted,
        primaryStandard: {
          isNumber: primaryStandard.isNumber,
          title: primaryStandard.title,
          productCategory: primaryStandard.productCategory,
          department: primaryStandard.department,
          domain: primaryStandard.domain,
          scope: primaryStandard.scope,
          status: primaryStandard.status,
          officialSourceUrl: primaryStandard.officialSourceUrl,
          lastVerifiedDate: primaryStandard.lastVerifiedDate,
          versionChain: primaryStandard.versionChain,
        },
        certificationApplicability: {
          isCompulsory: primaryStandard.qco.isCompulsory,
          scheme: primaryStandard.qco.scheme,
          orderName: primaryStandard.qco.orderName,
          gazetteNotification: primaryStandard.qco.gazetteNotification,
          ministry: primaryStandard.qco.ministry,
          effectiveDate: primaryStandard.qco.effectiveDate,
          enforcementStatus: primaryStandard.qco.enforcementStatus,
          officialNotificationUrl: primaryStandard.qco.officialNotificationUrl,
          penaltiesClause: primaryStandard.qco.penaltiesClause,
        },
        outdatedAlert: outdatedAlert || null,
        clarifyingQuestions,
        relatedStandards: related.map((r) => ({
          isNumber: r.standard.isNumber,
          title: r.standard.title,
          criticality: r.matchReasons[0]?.split(':')[0] || 'Mandatory Subsystem',
          description: r.matchReasons[0] || '',
          score: r.score,
        })),
        specificationGaps: primaryStandard.commonMissingSpecs,
        tenderClauseReadyToUse,
        evidence,
        explanation,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('API /api/v1/recommend error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error?.message || 'Unexpected failure' },
      { status: 500, headers: corsHeaders }
    );
  }
}
