import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedRequirement, SpecificationGap, CandidateStandardMatch } from '../types/procurement';
import { IndianStandard } from '../types/standards';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Fallback heuristic extractor when Gemini API is unavailable or offline
 */
function heuristicExtract(text: string): ExtractedRequirement {
  const lower = text.toLowerCase();

  // Detect language
  let detectedLang = 'en';
  if (/[\u0900-\u097F]/.test(text)) {
    detectedLang = 'hi';
  } else if (/[\u0C00-\u0C7F]/.test(text)) {
    detectedLang = 'te';
  } else if (/[\u0B80-\u0BFF]/.test(text)) {
    detectedLang = 'ta';
  }

  // Detect product & domain
  let product = 'LED Street Lighting Fixture';
  let domain = 'Lighting & Luminaires';
  let application = 'Road and Outdoor Public Infrastructure';

  if (lower.includes('solar') || lower.includes('pv') || lower.includes('सौर') || lower.includes('సౌర')) {
    product = 'Solar Photovoltaic (PV) Module / Solar Street Light';
    domain = 'Solar & Renewable';
    application = 'Outdoor Off-grid / Grid-tied Solar Energy Generation';
  } else if (lower.includes('transformer') || lower.includes('ट्रान्सफार्मर') || lower.includes('పరివర్తకం')) {
    product = 'Outdoor Oil-Immersed Distribution Transformer';
    domain = 'Power Distribution';
    application = 'Substation & Distribution Grid Step-Down Power Supply';
  } else if (lower.includes('pump') || lower.includes('पंप') || lower.includes('పంప్') || lower.includes('monobloc')) {
    product = 'Agricultural Monobloc Clear Water Pump';
    domain = 'Agricultural & Water Supply';
    application = 'Agricultural Irrigation and Clear Water Pumping';
  } else if (lower.includes('wheelchair') || lower.includes('व्हीलचेयर') || lower.includes('వీల్‌చైర్')) {
    product = 'Hospital Folding Wheelchair';
    domain = 'Healthcare & Medical Devices';
    application = 'Patient Mobility and Hospital Transport';
  } else if (lower.includes('cctv') || lower.includes('camera') || lower.includes('कैनरा') || lower.includes('కెమెరా')) {
    product = 'Video Surveillance IP Camera';
    domain = 'IT & Surveillance';
    application = 'Municipal Smart City Traffic & Public Security Monitoring';
  } else if (lower.includes('tmt') || lower.includes('steel') || lower.includes('सरिया') || lower.includes('స్టీల్')) {
    product = 'TMT High Strength Deformed Steel Reinforcement Bars';
    domain = 'Civil & Construction';
    application = 'Reinforced Concrete Structural Infrastructure';
  } else if (lower.includes('pipe') || lower.includes('hdpe') || lower.includes('पाइप') || lower.includes('పైపు')) {
    product = 'High Density Polyethylene (HDPE) Water Supply Pipe';
    domain = 'Water Supply & Plumbing';
    application = 'Municipal & Rural Potable Water Distribution';
  }

  // Extract parameters via regex
  const powerMatch = text.match(/(\d+\s*(?:W|kW|HP|kVA|WATT|WATTS))/i);
  const voltMatch = text.match(/(\d+\s*(?:V|kV|VOLT|VOLTS|AC|DC))/i);
  const ipMatch = text.match(/(IP\s*\d{2})/i);
  const lifeMatch = text.match(/(\d+[\d,]*\s*(?:hours|hrs|घंटे|గంటలు))/i);

  return {
    product,
    application,
    domain,
    rawQuery: text,
    detectedLanguage: detectedLang,
    power: powerMatch ? powerMatch[1].toUpperCase() : undefined,
    voltage: voltMatch ? voltMatch[1].toUpperCase() : '230 V AC',
    protectionRating: ipMatch ? ipMatch[1].toUpperCase().replace(/\s+/g, '') : undefined,
    lifetime: lifeMatch ? lifeMatch[1] : undefined,
    safetyFeatures: lower.includes('surge') ? ['Integrated Surge Protection Device (SPD)'] : [],
    testRequirements: lower.includes('ip') ? ['Ingress Protection Water Jet Test'] : [],
    otherSpecs: {},
  };
}

/**
 * Intelligent requirement extraction using Gemini 1.5 / 2.0 with instant fallback
 */
export async function extractRequirementsWithGemini(rawText: string): Promise<ExtractedRequirement> {
  if (!genAI) {
    return heuristicExtract(rawText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are an expert Indian Standards and public procurement AI assistant for the Bureau of Indian Standards (BIS) and Government e-Marketplace (GeM).
Analyze the following procurement tender query or text (which may be in English, Hindi, Telugu, or another Indian language):
"""${rawText}"""

Extract a structured JSON response with the following schema ONLY (no markdown fences, pure JSON):
{
  "product": "Clear standard name of the product being procured in English",
  "application": "Intended application environment (e.g., Road lighting, Irrigation, Hospital)",
  "domain": "One of: Lighting & Luminaires | Solar & Renewable | Power Distribution | Agricultural & Water Supply | Healthcare & Medical Devices | IT & Surveillance | Civil & Construction | Water Supply & Plumbing",
  "detectedLanguage": "en | hi | te | ta | other",
  "power": "e.g., 90W or null",
  "voltage": "e.g., 230V AC or null",
  "protectionRating": "e.g., IP66 or null",
  "lifetime": "e.g., 50000 hours or null",
  "capacity": "e.g., 250 kVA, 5 HP or null",
  "material": "e.g., Die-cast aluminum, Fe 500D or null",
  "operatingTemp": "e.g., -10C to +50C or null",
  "safetyFeatures": ["list of explicit safety features like Surge protection, Earthing, etc."],
  "testRequirements": ["list of test requirements mentioned like IP test, Photometric test, etc."],
  "otherSpecs": { "key": "value" }
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      product: parsed.product || 'Procurement Item',
      application: parsed.application || 'General Public Procurement',
      domain: parsed.domain || 'Lighting & Luminaires',
      rawQuery: rawText,
      detectedLanguage: parsed.detectedLanguage || 'en',
      power: parsed.power || undefined,
      voltage: parsed.voltage || undefined,
      protectionRating: parsed.protectionRating || undefined,
      lifetime: parsed.lifetime || undefined,
      capacity: parsed.capacity || undefined,
      material: parsed.material || undefined,
      operatingTemp: parsed.operatingTemp || undefined,
      safetyFeatures: parsed.safetyFeatures || [],
      testRequirements: parsed.testRequirements || [],
      otherSpecs: parsed.otherSpecs || {},
    };
  } catch (error) {
    console.warn('Gemini API extraction fallback to heuristic:', error);
    return heuristicExtract(rawText);
  }
}

/**
 * Generates an explainable procurement audit trail
 */
export async function generateExplanation(
  requirement: ExtractedRequirement,
  primaryStandard: IndianStandard,
  relatedStandards: CandidateStandardMatch[]
): Promise<{
  rationale: string;
  productMatchSummary: string;
  regulatorySummary: string;
  versionAction: string;
}> {
  const versionAction = `Mandate current standard ${primaryStandard.isNumber} in tender documents. Verify that suppliers comply with Amendment ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'None'} and supersede legacy editions.`;

  const regulatorySummary = primaryStandard.qco.isCompulsory
    ? `MANDATORY COMPLIANCE: Governed under the "${primaryStandard.qco.orderName}" (${primaryStandard.qco.gazetteNotification}). It is legally compulsory under Section 16 of the BIS Act 2016 for all bidders to hold a valid ${primaryStandard.qco.scheme} license.`
    : `VOLUNTARY SCHEME: Currently under ${primaryStandard.qco.scheme}. Bidders should submit certified NABL/BIS accredited laboratory type-test reports.`;

  const productMatchSummary = `Identified as "${primaryStandard.productCategory}" under ${primaryStandard.domain} (${primaryStandard.department}). The scope directly governs equipment for ${requirement.application}.`;

  const relatedCitations = relatedStandards
    .slice(0, 3)
    .map((r) => `${r.standard.isNumber} (${r.standard.title.split('-')[0].trim()})`)
    .join(', ');

  const rationale = `Recommended standard ${primaryStandard.isNumber} serves as the primary applicable specification for ${requirement.product}. Normative references link to ${relatedCitations} to enforce electrical safety, testing procedures, and driver controlgear integrity.`;

  return {
    rationale,
    productMatchSummary,
    regulatorySummary,
    versionAction,
  };
}
