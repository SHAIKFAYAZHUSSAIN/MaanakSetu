import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ExtractedRequirement,
  SpecificationGap,
  CandidateStandardMatch,
  TenderProductItem,
} from '../types/procurement';
import { IndianStandard } from '../types/standards';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Out-of-scope keywords for non-standardized or non-BIS procurement
 */
const OUT_OF_SCOPE_REGEX =
  /\b(lunch|catering|meal|breakfast|food box|snack|tiffin|canteen food|thali|dining table|wooden desk|sofa set|curtain|carpet|drone delivery|security guard manpower|car rental|taxi service)\b/i;

/**
 * Deep Multilingual and Semantic Heuristic Extractor
 * Accurate fallback when Gemini API is offline or when running locally without a key
 */
function heuristicExtract(text: string): ExtractedRequirement {
  const lower = text.toLowerCase();

  // 1. Detect language
  let detectedLang = 'en';
  if (/[\u0900-\u097F]/.test(text)) {
    detectedLang = lower.includes('दिवे') || lower.includes('कापड') ? 'mr' : 'hi';
  } else if (/[\u0C00-\u0C7F]/.test(text)) {
    detectedLang = 'te';
  } else if (/[\u0B80-\u0BFF]/.test(text)) {
    detectedLang = 'ta';
  } else if (/[\u0980-\u09FF]/.test(text)) {
    detectedLang = 'bn';
  } else if (/[\u0C80-\u0CFF]/.test(text)) {
    detectedLang = 'kn';
  }

  // 2. Check for explicit out-of-scope non-standard goods/services
  if (OUT_OF_SCOPE_REGEX.test(text)) {
    return {
      product: 'Unstandardized Commercial Good / Service',
      application: 'Non-Standardized Procurement (Not Covered under BIS Mandatory Standards)',
      domain: 'Non-Standard Goods & Services',
      rawQuery: text,
      detectedLanguage: detectedLang,
      otherSpecs: {},
    };
  }

  // 3. Product & Domain Detection across all 23+ sectors
  let product = 'Unspecified Procurement Item';
  let domain = 'General Procurement';
  let application = 'Public Sector Procurement';

  if (
    lower.includes('street light') ||
    lower.includes('road light') ||
    lower.includes('pole light') ||
    lower.includes('स्ट्रीट लाइट') ||
    lower.includes('వీధి దీపాలు') ||
    lower.includes('தெரு விளக்கு') ||
    lower.includes('रस्त्यावरील दिवे') ||
    (lower.includes('led') && (lower.includes('outdoor') || lower.includes('fixture') || lower.includes('highway')))
  ) {
    product = 'LED Street Lighting Fixture';
    domain = 'Lighting & Luminaires';
    application = 'Road, Highway, and Outdoor Public Infrastructure Lighting';
  } else if (
    lower.includes('bulb') ||
    lower.includes('b22') ||
    lower.includes('e27') ||
    lower.includes('बल्ब') ||
    lower.includes('బల్బ్') ||
    (lower.includes('led lamp') && !lower.includes('street'))
  ) {
    product = 'Self-Ballasted LED Lamp';
    domain = 'Lighting & Luminaires';
    application = 'Indoor Institutional and Domestic Lighting';
  } else if (
    lower.includes('transformer') ||
    lower.includes('dtr') ||
    lower.includes('ट्रान्सफार्मर') ||
    lower.includes('పరివర్తకం') ||
    lower.includes('மின்மாற்றி')
  ) {
    product = 'Outdoor Oil-Immersed Distribution Transformer';
    domain = 'Power Distribution';
    application = 'Substation & Distribution Grid Step-Down Power Supply';
  } else if (
    lower.includes('xlpe') ||
    lower.includes('armoured cable') ||
    lower.includes('submersible cable')
  ) {
    product = 'XLPE Insulated Armoured Electric Cable';
    domain = 'Electrical Infrastructure';
    application = 'Heavy-Duty Power Distribution & Submersible Wiring';
  } else if (
    lower.includes('cable') ||
    lower.includes('wire') ||
    lower.includes('pvc cable') ||
    lower.includes('तार') ||
    lower.includes('కేబుల్') ||
    lower.includes('வயர்')
  ) {
    product = 'PVC Insulated Electric Cable (up to 1100V)';
    domain = 'Electrical Infrastructure';
    application = 'Building Electrification and Control Wiring';
  } else if (
    lower.includes('fan') ||
    lower.includes('pankha') ||
    lower.includes('पंखा') ||
    lower.includes('ఫ్యాన్') ||
    lower.includes('மின்விசிறி')
  ) {
    product = 'Electric Ceiling Fan';
    domain = 'Consumer Electricals';
    application = 'Air Circulation for Offices, Schools, and Public Buildings';
  } else if (
    lower.includes('inverter') ||
    lower.includes('pcu') ||
    lower.includes('इन्वर्टर') ||
    lower.includes('ఇన్వర్టర్')
  ) {
    product = 'Solar PV Grid-Tied Inverter / Power Conditioning Unit';
    domain = 'Solar & Renewable';
    application = 'Solar Photovoltaic Power Conversion and Grid Synchronization';
  } else if (
    lower.includes('solar') ||
    lower.includes('pv') ||
    lower.includes('photovoltaic') ||
    lower.includes('सौर') ||
    lower.includes('సౌర') ||
    lower.includes('சூரிய ஒளி')
  ) {
    product = 'Solar Photovoltaic (PV) Module';
    domain = 'Solar & Renewable';
    application = 'Outdoor Off-Grid / Grid-Tied Solar Energy Generation';
  } else if (
    lower.includes('lithium') ||
    lower.includes('li-ion') ||
    lower.includes('battery pack') ||
    lower.includes('ev battery') ||
    lower.includes('लिथियम') ||
    lower.includes('బ్యాటరీ')
  ) {
    product = 'Secondary Lithium-Ion Battery Pack';
    domain = 'Energy Storage & Electronics';
    application = 'Portable Power, EV, and Battery Energy Storage Systems (BESS)';
  } else if (
    lower.includes('pump') ||
    lower.includes('monobloc') ||
    lower.includes('submersible') ||
    lower.includes('borewell') ||
    lower.includes('पंप') ||
    lower.includes('పంప్') ||
    lower.includes('மோட்டார் பம்ப்')
  ) {
    product = 'Agricultural Monobloc Clear Water Pump';
    domain = 'Agricultural & Water Supply';
    application = 'Agricultural Irrigation and Clear Water Pumping';
  } else if (
    lower.includes('hdpe') ||
    (lower.includes('pipe') && (lower.includes('water') || lower.includes('potable') || lower.includes('nal') || lower.includes('jal jeevan'))) ||
    lower.includes('पाइप') ||
    lower.includes('పైపు') ||
    lower.includes('குழாய்')
  ) {
    product = 'High Density Polyethylene (HDPE) Water Supply Pipe';
    domain = 'Water Supply & Plumbing';
    application = 'Municipal & Rural Potable Water Distribution';
  } else if (
    lower.includes('saria') ||
    lower.includes('tmt') ||
    lower.includes('rebar') ||
    lower.includes('fe 500') ||
    lower.includes('fe 550') ||
    lower.includes('steel bar') ||
    lower.includes('ctd') ||
    lower.includes('सरिया') ||
    lower.includes('స్టీల్') ||
    lower.includes('கம்பி') ||
    lower.includes('রড')
  ) {
    product = 'TMT High Strength Deformed Steel Reinforcement Bars';
    domain = 'Civil & Construction';
    application = 'Reinforced Concrete Structural Infrastructure';
  } else if (
    lower.includes('cement') ||
    lower.includes('opc') ||
    lower.includes('ppc') ||
    lower.includes('सीमेंट') ||
    lower.includes('సిమెంట్') ||
    lower.includes('சிமெண்ட்')
  ) {
    product = 'Ordinary Portland Cement (OPC 53/43 Grade)';
    domain = 'Civil & Construction';
    application = 'Structural Concrete, Bridges, and Civil Infrastructure';
  } else if (
    lower.includes('wheelchair') ||
    lower.includes('wheel chair') ||
    lower.includes('व्हीलचेयर') ||
    lower.includes('వీల్‌చైర్') ||
    lower.includes('சக்கர நாற்காலி')
  ) {
    product = 'Hospital Folding Wheelchair';
    domain = 'Healthcare & Medical Devices';
    application = 'Patient Mobility and Hospital Transport';
  } else if (
    lower.includes('n95') ||
    lower.includes('mask') ||
    lower.includes('ffp2') ||
    lower.includes('respirator') ||
    lower.includes('मास्क') ||
    lower.includes('మాస్క్') ||
    lower.includes('முகக்கவசம்')
  ) {
    product = 'Respiratory Protective Half Mask (N95 / FFP2)';
    domain = 'Healthcare & Safety PPE';
    application = 'Particulate and Pathogen Inhalation Protection';
  } else if (
    lower.includes('cctv') ||
    lower.includes('ip camera') ||
    lower.includes('surveillance') ||
    lower.includes('कैनरा') ||
    lower.includes('కెమెరా') ||
    lower.includes('கேமரா')
  ) {
    product = 'Video Surveillance IP Camera';
    domain = 'IT & Surveillance';
    application = 'Municipal Smart City Traffic & Public Security Monitoring';
  } else if (
    lower.includes('laptop') ||
    lower.includes('notebook') ||
    lower.includes('desktop') ||
    lower.includes('server') ||
    lower.includes('workstation') ||
    lower.includes('लैपटॉप') ||
    lower.includes('ల్యాప్‌టాప్') ||
    lower.includes('மடிக்கணினி')
  ) {
    product = 'Audio/Video & Information Technology Equipment';
    domain = 'Information Technology';
    application = 'E-Governance, Institutional Workstations, and Office Computing';
  } else if (
    lower.includes('fire extinguisher') ||
    lower.includes('extinguisher') ||
    lower.includes('fire cylinder') ||
    lower.includes('abc powder') ||
    lower.includes('अग्निशामक') ||
    lower.includes('ఫైర్') ||
    lower.includes('தீயணைப்பான்')
  ) {
    product = 'Portable Fire Extinguisher (ABC Powder / CO2)';
    domain = 'Fire & Life Safety';
    application = 'First-Aid Fire Fighting in Buildings and Public Facilities';
  } else if (
    lower.includes('drinking water') ||
    lower.includes('packaged water') ||
    lower.includes('water jar') ||
    lower.includes('20 litre') ||
    lower.includes('पानी का जार') ||
    lower.includes('తాగునీరు') ||
    lower.includes('குடிநீர்')
  ) {
    product = 'Packaged Drinking Water (20L Jar / Bottles)';
    domain = 'Food & Water Safety';
    application = 'Potable Drinking Water Supply for Offices, Canteens, and Public Mess';
  } else if (
    lower.includes('uniform') ||
    lower.includes('khaki') ||
    lower.includes('shirting') ||
    lower.includes('suiting') ||
    lower.includes('वर्दी') ||
    lower.includes('యూనిఫాం') ||
    lower.includes('சீருடை')
  ) {
    product = 'Polyester-Cotton Blended Uniform Fabric';
    domain = 'Textiles & Uniforms';
    application = 'Uniforms for Police, Defense, Transport, and Institutional Staff';
  }

  // 4. Extract technical parameters via regex
  const powerMatch = text.match(/(\d+\s*(?:W|kW|HP|kVA|WATT|WATTS))/i);
  const voltMatch = text.match(/(\d+\s*(?:V|kV|VOLT|VOLTS|AC|DC))/i);
  const ipMatch = text.match(/(IP\s*\d{2})/i);
  const lifeMatch = text.match(/(\d+[\d,]*\s*(?:hours|hrs|घंटे|గంటలు))/i);
  const capMatch = text.match(/(\d+\s*(?:kVA|HP|m3\/h|Litre|L|mm|sq\s*mm))/i);

  return {
    product,
    application,
    domain,
    rawQuery: text,
    detectedLanguage: detectedLang,
    power: powerMatch ? powerMatch[1].toUpperCase() : undefined,
    voltage: voltMatch ? voltMatch[1].toUpperCase() : undefined,
    protectionRating: ipMatch ? ipMatch[1].toUpperCase().replace(/\s+/g, '') : undefined,
    lifetime: lifeMatch ? lifeMatch[1] : undefined,
    capacity: capMatch ? capMatch[1] : undefined,
    safetyFeatures: lower.includes('surge') ? ['Integrated Surge Protection Device (SPD)'] : [],
    testRequirements: lower.includes('ip') ? ['Ingress Protection Water Jet Test'] : [],
    otherSpecs: {},
  };
}

/**
 * Parses multiple line items from a tender document or Schedule of Requirements
 */
export function extractTenderProducts(documentText: string): TenderProductItem[] {
  const items: TenderProductItem[] = [];

  // Match line item patterns like "Item 1:", "Item No. 2", "Schedule A - 1.", "1. Procure...", "Sl No 1"
  const lineItemRegex =
    /(?:Item\s*(?:No\.?)?\s*(\d+)[:.-]?|Sl\.?\s*(?:No\.?)?\s*(\d+)[:.-]?|^(\d+)[.)]\s+)([\s\S]*?)(?=(?:Item\s*(?:No\.?)?\s*\d+[:.-]?|Sl\.?\s*(?:No\.?)?\s*\d+[:.-]?|^\d+[.)]\s+)|$)/gim;

  let match;
  let index = 1;

  while ((match = lineItemRegex.exec(documentText)) !== null) {
    const rawSnippet = match[4]?.trim() || '';
    if (rawSnippet.length < 10) continue;

    // Detect product from snippet
    const extracted = heuristicExtract(rawSnippet);

    items.push({
      id: `tender-item-${index}`,
      itemNumber: index,
      productName: extracted.product,
      rawSnippet: rawSnippet.substring(0, 300),
      estimatedCategory: extracted.domain,
    });

    index++;
    if (index > 10) break; // Limit to 10 line items
  }

  // Fallback: If no structured numbering was found, check if document mentions 2 or more distinct products
  if (items.length === 0) {
    const extracted = heuristicExtract(documentText);
    items.push({
      id: 'tender-item-1',
      itemNumber: 1,
      productName: extracted.product,
      rawSnippet: documentText.substring(0, 350),
      estimatedCategory: extracted.domain,
    });
  }

  return items;
}

/**
 * Intelligent requirement extraction using Gemini 1.5 / 2.0 with instant heuristic fallback
 */
export async function extractRequirementsWithGemini(rawText: string): Promise<ExtractedRequirement> {
  if (!genAI) {
    return heuristicExtract(rawText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are an expert Indian Standards and public procurement AI assistant for the Bureau of Indian Standards (BIS) and Government e-Marketplace (GeM).
Analyze the following procurement tender query or specification text (which may be in English, Hindi, Telugu, Tamil, Marathi, Bengali, or another Indian language):
"""${rawText}"""

CRITICAL ACCURACY RULES:
1. NEVER default an unknown, out-of-scope, or generic product to LED street lights or lighting.
2. If the user mentions food, catering, furniture, drones, or manpower, classify it accurately as "Unstandardized Commercial Good / Service".
3. Accurately translate and interpret Indian languages (Hindi, Telugu, Tamil, Marathi, etc.) into proper English procurement terminology.
4. If technical parameters (wattage, voltage, kVA, capacity, IP rating, steel grade) are present, extract them.

Extract a structured JSON response with the following schema ONLY (no markdown fences, pure JSON):
{
  "product": "Clear standard name of the product being procured in English (e.g. 'TMT Steel Rebars', 'Distribution Transformer', 'Agricultural Monobloc Pump', 'HDPE Pipes')",
  "application": "Intended application environment (e.g., Road lighting, Tubewell irrigation, Hospital mobility)",
  "domain": "One of: Lighting & Luminaires | Solar & Renewable | Power Distribution | Electrical Infrastructure | Consumer Electricals | Energy Storage & Electronics | Agricultural & Water Supply | Water Supply & Plumbing | Civil & Construction | Healthcare & Medical Devices | Healthcare & Safety PPE | IT & Surveillance | Information Technology | Fire & Life Safety | Food & Water Safety | Textiles & Uniforms | Non-Standard Goods & Services | General Procurement",
  "detectedLanguage": "en | hi | te | ta | mr | bn | kn | other",
  "power": "e.g., 90W or null",
  "voltage": "e.g., 230V AC, 11kV or null",
  "protectionRating": "e.g., IP66 or null",
  "lifetime": "e.g., 50000 hours or null",
  "capacity": "e.g., 250 kVA, 5 HP, 20 Litre or null",
  "material": "e.g., Fe 500D, HDPE PE100, Die-cast aluminum or null",
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
      domain: parsed.domain || 'General Procurement',
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
 * Generates an explainable procurement audit trail with evidence and official citations
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
  const versionAction = `Mandate current standard ${primaryStandard.isNumber} in tender documents. Verify that suppliers comply with Amendment ${
    primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'None'
  } and strictly supersede legacy editions.`;

  const regulatorySummary = primaryStandard.qco.isCompulsory
    ? `COMPULSORY REGULATORY ORDER: Governed under the "${primaryStandard.qco.orderName}" (${primaryStandard.qco.gazetteNotification}) issued by the ${primaryStandard.qco.ministry}. Under Section 16 & Section 29 of the BIS Act 2016, it is legally mandatory for all bidders to hold a valid ${primaryStandard.qco.scheme} license. Procurement of non-certified stock violates CVC guidelines.`
    : `VOLUNTARY SCHEME: Governed under ${primaryStandard.qco.scheme}. Bidders must be required to submit certified type-test reports from NABL / BIS accredited laboratories conducted within the preceding 24 months.`;

  const productMatchSummary = `Matched product category "${primaryStandard.productCategory}" under ${primaryStandard.domain} (${primaryStandard.department}). The official scope directly encompasses equipment intended for ${requirement.application}.`;

  const relatedCitations = relatedStandards
    .slice(0, 3)
    .map((r) => `${r.standard.isNumber} (${r.standard.title.split('-')[0].trim()})`)
    .join(', ');

  const rationale = `Recommended standard ${primaryStandard.isNumber} serves as the primary applicable specification for "${requirement.product}". Normative references link to ${relatedCitations || 'associated component standards'} to enforce essential safety, test methods, and subsystem reliability.`;

  return {
    rationale,
    productMatchSummary,
    regulatorySummary,
    versionAction,
  };
}
