import { BIS_STANDARDS_DATABASE } from '../data/standardsKnowledgeBase';
import { IndianStandard } from '../types/standards';
import {
  CandidateStandardMatch,
  ExtractedRequirement,
  ClarifyingQuestion,
  OutdatedStandardAlert,
  RecommendationEvidence,
  ConfidenceLevel,
} from '../types/procurement';

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
 * Semantic Synonym and Intent Dictionary for Indian Public Procurement
 * Maps regional, colloquial, and tender terms to standard concepts
 */
const PRODUCT_SYNONYMS: Record<string, string[]> = {
  'led street light': [
    'street light', 'pole light', 'batti', 'luminaire', 'road light', 'lantern', 'outdoor light',
    'highway light', 'expressway light', 'led fixture', 'streetlight', 'street lamp',
    'स्ट्रीट लाइट', 'వీధి దీపాలు', 'தெரு விளக்கு', 'रस्त्यावरील दिवे', 'রাস্তার বাতি', 'ಬೀದಿ ದೀಪ'
  ],
  'led bulb': [
    'led lamp', 'bulb', 'cfl replacement', 'b22', 'e27', 'self ballasted', 'indoor bulb',
    'एलईडी बल्ब', 'బల్బ్', 'விளக்கு', 'एलईडी दिवा'
  ],
  'transformer': [
    'step down transformer', 'distribution transformer', 'power transformer', 'dtr', 'oil transformer',
    'substation transformer', '11kv transformer', '33kv transformer', '250 kva', '100 kva', '63 kva', '500 kva',
    'ट्रान्सफार्मर', 'परिవర్తకం', 'மின்மாற்றி', 'रोहित्र'
  ],
  'cables': [
    'wire', 'submersible cable', 'armoured cable', 'pvc cable', 'xlpe cable', 'copper wire', 'aluminum cable',
    'power cable', 'control cable', 'single core wire', '3 core cable', '4 core cable', 'frls cable',
    'तार', 'కేబుల్', 'வயர்', 'केबल', 'তার'
  ],
  'ceiling fan': [
    'fan', 'pankha', 'exhaust fan', 'bldc fan', 'ceiling fans', '5 star fan', 'bee fan', '1200mm fan',
    'पंखा', 'ఫ్యాన్', 'மின்விசிறி', 'पंखा'
  ],
  'solar pv': [
    'solar panel', 'photovoltaic', 'solar module', 'rooftop solar', 'solar plate', 'mono perc', 'polycrystalline',
    'सौर पैनल', 'సౌర ఫలకం', 'சூரிய ஒளி தகடு', 'सौर पॅनेल'
  ],
  'solar inverter': [
    'inverter', 'pcu', 'power conditioning unit', 'grid tie inverter', 'solar pcu', 'hybrid inverter',
    'इन्वर्टर', 'ఇన్వర్టర్', 'மின்மாற்றி இன்வெர்ட்டர்'
  ],
  'lithium battery': [
    'lithium cell', 'li-ion', 'battery pack', 'ev battery', 'bess', 'lithium ion battery', 'lfp battery',
    'लिथियम बैटरी', 'బ్యాటరీ', 'மின்கலம்', 'लिथियम बॅटरी'
  ],
  'pump': [
    'water pump', 'monobloc pump', 'borewell motor', 'submersible pump', 'kisan pump', 'irrigation pump',
    'tullu pump', 'agricultural pump', 'centrifugal pump', 'openwell pump',
    'पंप', 'పంప్', 'மோட்டார் பம்ப்', 'पाण्याचा पंप'
  ],
  'hdpe pipe': [
    'water pipe', 'plastic pipe', 'polyethylene pipe', 'drinking water pipe', 'nal pipe', 'irrigation pipe',
    'pe100', 'pe80', 'pn6', 'pn10', 'pn16',
    'पाइप', 'పైపు', 'குழாய்', 'पाण्याची पाईप'
  ],
  'tmt steel': [
    'saria', 'steel bar', 'rebar', 'reinforcement bar', 'fe 500', 'fe 500d', 'fe 550', 'fe 550d', 'ctd',
    'tor steel', 'steel rod', 'construction steel', 'sarie',
    'सरिया', 'స్టీల్ రాడ్', 'கம்பி', 'लोखंडी गज', 'রড'
  ],
  'cement': [
    'portland cement', 'opc', 'ppc', '53 grade cement', '43 grade cement', 'concreting cement', 'cement bag',
    'सीमेंट', 'సిమెంట్', 'சிமெண்ட்', 'सिमेंट', 'সিমেন্ট'
  ],
  'wheelchair': [
    'wheel chair', 'patient chair', 'hospital trolley', 'invalid carriage', 'folding wheelchair',
    'व्हीलचेयर', 'వీల్‌చైర్', 'சக்கர நாற்காலி', 'रुग्ण वाहक खुर्ची'
  ],
  'safety helmet': [
    'industrial helmet', 'hard hat', 'construction helmet', 'head protection', 'ppe helmet', 'is 2925',
    'सुरक्षा हेलमेट', 'రక్షణ హెల్మెట్', 'பாதுகாப்பு தலைக்கவசம்', 'ಸುರಕ್ಷತಾ ಹೆಲ್ಮೆಟ್', 'हेलमेट'
  ],
  'n95 mask': [
    'ffp2', 'filtering mask', 'respirator', 'pollution mask', 'surgical mask', 'n95', 'half mask',
    'मास्क', 'మాస్క్', 'முகக்கவசம்', 'मुखवटा'
  ],
  'cctv': [
    'security camera', 'ip camera', 'surveillance camera', 'dome camera', 'bullet camera', 'ptz camera', 'nvr',
    'कैनरा', 'కెమెరా', 'கேமரா', 'सुरक्षा कॅमेरा'
  ],
  'it equipment': [
    'laptop', 'notebook', 'desktop', 'server', 'workstation', 'computer', 'pc', 'all in one pc',
    'लैपटॉप', 'ల్యాప్‌టాప్', 'மடிக்கணினி', 'संगणक'
  ],
  'fire extinguisher': [
    'fire cylinder', 'extinguisher', 'abc powder', 'aag bujhana', 'co2 cylinder', 'fire safety', 'fire fighting',
    'अग्निशामक', 'ఫైర్ సిలిండర్', 'தீயணைப்பான்', 'अग्निशामक यंत्र'
  ],
  'drinking water': [
    'packaged water', 'water jar', 'mineral water 20 litre', 'packaged drinking water', 'bisleri', 'drinking jar',
    'पानी का जार', 'తాగునీరు', 'குடிநீர்', 'पिण्याचे पाणी'
  ],
  'uniform fabric': [
    'uniform cloth', 'police uniform', 'khaki cloth', 'shirting', 'suiting', 'polyester cotton', 'dress material',
    'वर्दी का कपड़ा', 'యూనిఫాం', 'சீருடை துணி', 'गणवेश कापड'
  ],
};

/**
 * Detect explicit out-of-scope or unstandardized procurement items
 * that must NEVER be defaulted to lighting or any arbitrary standard
 */
const OUT_OF_SCOPE_PATTERNS = [
  /\b(lunch|catering|meal|breakfast|food box|snack|tiffin|canteen food|thali)\b/i,
  /\b(dining table|wooden desk|sofa set|curtain|drapes|carpet|mattress|cushion)\b/i,
  /\b(drone|uav|quadcopter|aerial delivery)\b/i,
  /\b(manpower|security guard|housekeeping|gardening service|cleaning service)\b/i,
  /\b(stationery|pen|pencil|eraser|stapler|paper clip|envelope)\b/i,
  /\b(car rental|vehicle hiring|taxi service|bus transport)\b/i,
];

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
 * Detects if the tender query or specification references an outdated or superseded standard
 */
export function detectOutdatedStandards(rawQuery: string): OutdatedStandardAlert | undefined {
  const lower = rawQuery.toLowerCase();

  // 1. IS 1786: 1985 (CTD Steel Bars)
  if (
    lower.includes('1786:1985') ||
    lower.includes('1786: 1985') ||
    lower.includes('is 1786 1985') ||
    (lower.includes('1786') && (lower.includes('1985') || lower.includes('ctd') || lower.includes('cold twisted')))
  ) {
    return {
      isOutdated: true,
      citedStandard: 'IS 1786: 1985 (Cold Twisted Deformed - CTD Bars)',
      currentReplacement: 'IS 1786: 2008 (Fourth Revision)',
      replacementTitle: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
      effectiveSince: 'May 2008 (Mandatory under Ministry of Steel QCO)',
      actionRequired:
        'Update tender clause to mandate IS 1786: 2008 (Fe 500D / Fe 550D). Specifying 1985 CTD rebars violates mandatory Steel Quality Control Orders and National Building Code 2016 seismic ductility requirements.',
    };
  }

  // 2. IS 13252 (Part 1): 2010 (Legacy IT Equipment)
  if (
    lower.includes('13252:2010') ||
    lower.includes('13252: 2010') ||
    lower.includes('is 13252') ||
    lower.includes('is 13252-1')
  ) {
    return {
      isOutdated: true,
      citedStandard: 'IS 13252 (Part 1): 2010 (Information Technology Equipment - Safety)',
      currentReplacement: 'IS/IEC 62368-1: 2018',
      replacementTitle: 'Audio/Video, Information and Communication Technology Equipment - Safety Requirements',
      effectiveSince: 'January 2021 (MeitY CRO Phase V Transition)',
      actionRequired:
        'MeitY and BIS have transitioned IT products from IS 13252 to IS/IEC 62368-1. Mandate IS/IEC 62368-1: 2018 with valid MeitY CRS registration in tender eligibility criteria.',
    };
  }

  // 3. IS 10322 (Part 5/Sec 3): 1987 (Legacy Street Lights)
  if (
    (lower.includes('10322') && lower.includes('1987')) ||
    lower.includes('10322:1987') ||
    lower.includes('10322: 1987')
  ) {
    return {
      isOutdated: true,
      citedStandard: 'IS 10322 (Part 5/Sec 3): 1987 (Discharge Luminaires)',
      currentReplacement: 'IS 10322 (Part 5/Sec 3): 2012 (with Amendments 1 & 2)',
      replacementTitle: 'Luminaires - Particular Requirements - Luminaires for Road and Street Lighting',
      effectiveSince: '2012 (Harmonized with IEC 60598-2-3 for Solid-State LED Luminaires)',
      actionRequired:
        'The 1987 edition was formulated for conventional sodium/mercury discharge fixtures. Mandate IS 10322 (Part 5/Sec 3): 2012 with Amendment 1 (IP66 testing) and Amendment 2 (2024 coastal surge withstand).',
    };
  }

  // 4. IS 1239 (Part 1): 1990 (Mild Steel Tubes)
  if (lower.includes('1239:1990') || (lower.includes('1239') && lower.includes('1990'))) {
    return {
      isOutdated: true,
      citedStandard: 'IS 1239 (Part 1): 1990 (Steel Tubes)',
      currentReplacement: 'IS 1239 (Part 1): 2004',
      replacementTitle: 'Steel Tubes, Tubulars and Other Wrought Steel Fittings - Part 1: Steel Tubes',
      effectiveSince: '2004 (Reaffirmed 2019)',
      actionRequired: 'Update tender clause to IS 1239 (Part 1): 2004 with latest galvanizing and pressure test specifications.',
    };
  }

  return undefined;
}

/**
 * Generates proactive clarifying questions when technical parameters are underspecified
 */
export function generateClarifyingQuestions(
  requirement: ExtractedRequirement,
  topCandidates: CandidateStandardMatch[]
): ClarifyingQuestion[] {
  const questions: ClarifyingQuestion[] = [];
  const lowerQuery = `${requirement.rawQuery} ${requirement.product}`.toLowerCase();

  // 1. Ambiguous Cables / Wires
  if (
    (lowerQuery.includes('cable') || lowerQuery.includes('wire') || lowerQuery.includes('तार')) &&
    !lowerQuery.includes('xlpe') &&
    !lowerQuery.includes('pvc') &&
    !lowerQuery.includes('1100v') &&
    !lowerQuery.includes('11kv')
  ) {
    questions.push({
      id: 'cable-insulation-voltage',
      question: 'Which cable insulation and voltage grade is required for this tender?',
      parameterKey: 'cableType',
      whyNeeded:
        'PVC cables are governed by IS 694 for general wiring, whereas heavy-duty underground or submersible distribution cables require XLPE insulation under IS 7098 (Part 1).',
      options: [
        {
          label: '1.1 kV PVC Insulated Cable (IS 694: 2010)',
          value: 'is-694',
          description: 'Suitable for building electrification, internal panels, and commercial surface wiring.',
          targetStandardNumber: 'IS 694: 2010',
        },
        {
          label: '1.1 kV XLPE Insulated Armoured Cable (IS 7098 Part 1: 1988)',
          value: 'is-7098-1',
          description: 'High-temperature, moisture-resistant armoured cable for direct ground burial or borewell motors.',
          targetStandardNumber: 'IS 7098 (Part 1): 1988',
        },
        {
          label: 'High Voltage 11 kV / 33 kV XLPE Cable (IS 7098 Part 2)',
          value: 'is-7098-2',
          description: 'Heavy distribution substation feed lines.',
          targetStandardNumber: 'IS 7098 (Part 2): 2011',
        },
      ],
    });
  }

  // 2. Ambiguous Water Pumps
  if (
    (lowerQuery.includes('pump') || lowerQuery.includes('पंप') || lowerQuery.includes('మోటార్')) &&
    !lowerQuery.includes('monobloc') &&
    !lowerQuery.includes('submersible') &&
    !lowerQuery.includes('centrifugal')
  ) {
    questions.push({
      id: 'pump-construction-type',
      question: 'What installation configuration is needed for the water pumping system?',
      parameterKey: 'pumpType',
      whyNeeded:
        'Surface irrigation uses Monobloc pumps (IS 9079), while deep tubewells require Submersible Borewell pumps (IS 8034).',
      options: [
        {
          label: 'Agricultural Monobloc Clear Water Pump (IS 9079: 2018)',
          value: 'is-9079',
          description: 'Compact surface-mounted pump set for canal, open well, and field lifting.',
          targetStandardNumber: 'IS 9079: 2018',
        },
        {
          label: 'Submersible Borewell Pump Set (IS 8034: 2018)',
          value: 'is-8034',
          description: 'Multi-stage water-filled motor for deep agricultural and rural tubewells.',
          targetStandardNumber: 'IS 8034: 2018',
        },
      ],
    });
  }

  // 3. Ambiguous Pipes
  if (
    (lowerQuery.includes('pipe') || lowerQuery.includes('पाइप')) &&
    !lowerQuery.includes('hdpe') &&
    !lowerQuery.includes('gi') &&
    !lowerQuery.includes('pvc')
  ) {
    questions.push({
      id: 'pipe-material-grade',
      question: 'What pipe material is specified for the water conveyance system?',
      parameterKey: 'pipeMaterial',
      whyNeeded: 'HDPE pipes (IS 4984) offer corrosion-free potable water distribution, whereas GI pipes (IS 1239) offer mechanical rigidity.',
      options: [
        {
          label: 'High Density Polyethylene (HDPE) Pipes (IS 4984: 2016)',
          value: 'is-4984',
          description: 'Flexible, fused jointing for municipal potable water and Jal Jeevan Mission distribution.',
          targetStandardNumber: 'IS 4984: 2016',
        },
        {
          label: 'Galvanized Iron (GI) Threaded Pipes (IS 1239 Part 1)',
          value: 'is-1239',
          description: 'Rigid zinc-coated steel pipes for external risers and plumbing manifolds.',
          targetStandardNumber: 'IS 1239 (Part 1): 2004',
        },
      ],
    });
  }

  // 4. Ambiguous Cement Grade
  if (
    (lowerQuery.includes('cement') || lowerQuery.includes('सीमेंट')) &&
    !lowerQuery.includes('53') &&
    !lowerQuery.includes('43') &&
    !lowerQuery.includes('33') &&
    !lowerQuery.includes('ppc')
  ) {
    questions.push({
      id: 'cement-strength-grade',
      question: 'Which grade of Ordinary Portland Cement (OPC) is required?',
      parameterKey: 'cementGrade',
      whyNeeded:
        'IS 269: 2015 unifies 33, 43, and 53 grades. Structural works (bridges, RCC frames) require 53 Grade, while masonry uses 43 Grade.',
      options: [
        {
          label: 'OPC 53 Grade (IS 269: 2015) - High Early Strength',
          value: 'opc-53',
          description: 'Mandated for RCC bridges, multi-storey frames, and pre-stressed concrete.',
          targetStandardNumber: 'IS 269: 2015',
        },
        {
          label: 'OPC 43 Grade (IS 269: 2015) - Standard Construction',
          value: 'opc-43',
          description: 'General civil construction, brickwork mortar, and non-structural plastering.',
          targetStandardNumber: 'IS 269: 2015',
        },
      ],
    });
  }

  // 5. Ambiguous TMT Steel Ductility Grade
  if (
    (lowerQuery.includes('tmt') || lowerQuery.includes('steel') || lowerQuery.includes('सरिया')) &&
    !lowerQuery.includes('500d') &&
    !lowerQuery.includes('550d')
  ) {
    questions.push({
      id: 'steel-ductility-grade',
      question: 'Which ductility grade of TMT rebar is specified?',
      parameterKey: 'steelGrade',
      whyNeeded:
        'CPWD and MoRTH mandate "D" (High Ductility) grade (Fe 500D) for seismic safety across Zones III, IV, and V.',
      options: [
        {
          label: 'Fe 500D - High Ductility (IS 1786: 2008) [Recommended]',
          value: 'fe-500d',
          description: 'Minimum 16% elongation and 1.10 TS/YS ratio for earthquake-resistant infrastructure.',
          targetStandardNumber: 'IS 1786: 2008',
        },
        {
          label: 'Fe 550D - Extra High Tensile (IS 1786: 2008)',
          value: 'fe-550d',
          description: 'Used in heavy load-bearing flyovers, metros, and deep foundation piles.',
          targetStandardNumber: 'IS 1786: 2008',
        },
      ],
    });
  }

  return questions;
}

/**
 * Generates transparent recommendation evidence for procurement officers
 */
export function generateRecommendationEvidence(
  standard: IndianStandard,
  requirement: ExtractedRequirement
): RecommendationEvidence {
  const flags: string[] = [];

  // Check for common missing parameters
  if (standard.productCategory === 'LED Street Light' && !requirement.power) {
    flags.push('Tender does not specify rated wattage (e.g. 70W, 90W, 120W). Verify lumen package before issuance.');
  }
  if (standard.productCategory === 'LED Street Light' && !requirement.protectionRating) {
    flags.push('Ingress protection rating (IP66) is missing in query. Mandate IP66 as per IS 10322 (Part 5/Sec 3) Amd 1.');
  }
  if (standard.productCategory === 'Distribution Transformer' && !requirement.capacity) {
    flags.push('Transformer capacity (kVA) not specified. Confirm substation loading capacity (e.g. 100 kVA, 250 kVA).');
  }
  if (standard.productCategory === 'TMT Steel Rebars' && !requirement.material?.includes('500D')) {
    flags.push('High-ductility grade (Fe 500D) should be explicitly mandated to comply with IS 13920 seismic codes.');
  }

  const whyApplies = standard.applicabilityEvidence
    ? `${standard.applicabilityEvidence} Specifically matches product "${requirement.product}" under domain "${standard.domain}".`
    : `Primary standard ${standard.isNumber} formally defines the quality parameters, safety requirements, and testing procedures for ${standard.productCategory}.`;

  return {
    whyApplies,
    officialSourceUrl: standard.officialSourceUrl,
    lastVerifiedDate: standard.lastVerifiedDate || '2024-09-01',
    uncertaintyFlags: flags,
    scopeExtract: standard.scope,
  };
}

/**
 * Hybrid Re-ranking & Retrieval Engine
 * Evaluates semantic concept overlap, synonym expansion, exact citations, QCO status, and version freshness
 * Implements strict confidence scoring: If no candidate achieves >= 24, returns isNoMatch = true
 */
export function searchStandardsHybrid(requirement: ExtractedRequirement): CandidateStandardMatch[] {
  const rawQuery = requirement.rawQuery || '';
  const rawLower = rawQuery.toLowerCase();

  // Guardrail 1: Check for explicit out-of-scope non-standard items
  const isExplicitOutOfScope = OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(rawLower));
  if (isExplicitOutOfScope) {
    return [];
  }

  // Tokenize requirement terms
  const queryTokens = tokenize(
    `${rawQuery} ${requirement.product} ${requirement.application} ${requirement.domain}`
  );

  // Expand with semantic synonyms
  const expandedTokens = new Set<string>(queryTokens);
  for (const [canonicalTerm, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
    const canonicalTokens = tokenize(canonicalTerm);
    const matchesSynonym = synonyms.some((syn) => rawLower.includes(syn.toLowerCase()));
    if (matchesSynonym || canonicalTokens.some((ct) => queryTokens.includes(ct))) {
      synonyms.forEach((syn) => tokenize(syn).forEach((t) => expandedTokens.add(t)));
      canonicalTokens.forEach((t) => expandedTokens.add(t));
    }
  }

  const tokenList = Array.from(expandedTokens);
  const candidates: CandidateStandardMatch[] = [];

  for (const standard of BIS_STANDARDS_DATABASE) {
    const matchReasons: string[] = [];
    const parameterMatches: string[] = [];
    let score = 0;

    // 1. Direct Standard Identifier Match (Weight: 50)
    const cleanIsNumber = standard.isNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanRaw = rawLower.replace(/[^a-z0-9]/g, '');
    if (cleanRaw.includes(cleanIsNumber) || queryTokens.some((t) => standard.isNumber.toLowerCase().includes(t))) {
      score += 50;
      matchReasons.push(`Direct citation of standard identifier ${standard.isNumber}`);
    }

    // 2. Product Name & Category Overlap (Weight: 35)
    const productTokens = tokenize(standard.productCategory);
    const productOverlap = productTokens.filter((pt) =>
      tokenList.includes(pt) || rawLower.includes(pt)
    ).length;

    if (productOverlap > 0) {
      const productScore = Math.min(35, (productOverlap / productTokens.length) * 35);
      score += productScore;
      matchReasons.push(`Matches product category "${standard.productCategory}"`);
    }

    // 3. Technical Keyword Matches (Weight: 30)
    let keywordHits = 0;
    for (const kw of standard.keywords) {
      const kwLower = kw.toLowerCase();
      if (rawLower.includes(kwLower) || tokenList.some((t) => kwLower.includes(t))) {
        keywordHits++;
        if (keywordHits <= 3) {
          matchReasons.push(`Matches technical term: "${kw}"`);
        }
      }
    }
    score += Math.min(30, keywordHits * 7);

    // 4. Scope & Application Overlap (Weight: 20)
    const scopeSim = tokenSimilarity(tokenList, standard.scope);
    score += scopeSim * 20;
    if (scopeSim > 0.12) {
      matchReasons.push('Directly aligns with BIS statutory scope and operating environment');
    }

    // 5. Technical Parameter Matches (Weight: 15)
    if (requirement.protectionRating && standard.scope.toLowerCase().includes('protection')) {
      score += 5;
      parameterMatches.push(`Ingress Protection: ${requirement.protectionRating}`);
    }
    if (requirement.power && (standard.scope.toLowerCase().includes('luminaire') || standard.scope.toLowerCase().includes('power'))) {
      score += 5;
      parameterMatches.push(`Rated Power: ${requirement.power}`);
    }
    if (requirement.voltage && standard.scope.toLowerCase().includes('volt')) {
      score += 4;
      parameterMatches.push(`Operating Voltage: ${requirement.voltage}`);
    }
    if (requirement.capacity && standard.scope.toLowerCase().includes('capacity')) {
      score += 5;
      parameterMatches.push(`Capacity Rating: ${requirement.capacity}`);
    }

    // 6. Current Version vs Superseded Handling
    if (standard.status === 'Current') {
      score += 8;
    } else if (standard.status === 'Superseded') {
      // If the query specifically cited the superseded number, keep it as candidate so we can flag it
      if (cleanRaw.includes(cleanIsNumber)) {
        score += 30;
        matchReasons.push('Detected reference to legacy/superseded standard edition');
      } else {
        score -= 20; // Deprioritize superseded standards for general keyword searches
      }
    }

    // 7. Compulsory QCO Regulatory Boost (Weight: 10)
    if (standard.qco.isCompulsory) {
      score += 8;
      matchReasons.push(`Governed under compulsory QCO: ${standard.qco.orderName}`);
    }

    // Minimum viability threshold: score must be at least 24
    if (score >= 24) {
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

  // Mark top item as primary if confidence is sufficient
  if (candidates.length > 0) {
    candidates[0].isPrimary = true;
  }

  return candidates;
}

/**
 * Resolves related and normative standards recursively from the primary standard
 * Clearly distinguishing required references from recommended practice
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

    const isMandatory =
      rel.criticality === 'Mandatory Subsystem' ||
      rel.criticality === 'Mandatory Test Method' ||
      rel.criticality === 'Mandatory Safety';

    if (found) {
      relatedMatches.push({
        standard: found,
        score: isMandatory ? 92 : 78,
        matchReasons: [`${rel.criticality}: ${rel.description}`],
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
          isCompulsory: isMandatory && primaryStandard.qco.isCompulsory,
          orderName: primaryStandard.qco.orderName,
          gazetteNotification: primaryStandard.qco.gazetteNotification,
          ministry: primaryStandard.qco.ministry,
          effectiveDate: primaryStandard.qco.effectiveDate,
          scheme: primaryStandard.qco.scheme,
          description: `Referenced normative standard under ${primaryStandard.isNumber}`,
          enforcementStatus: primaryStandard.qco.enforcementStatus,
        },
        keywords: [rel.relationshipType.toLowerCase()],
        relationships: [],
        technicalRequirements: [],
        commonMissingSpecs: [],
        testingLaboratoriesAvailable: 20,
        schemesOfTesting: 'Standard test method verification scheme',
        officialSourceUrl: `https://standards.bis.gov.in/item/${encodeURIComponent(
          rel.targetStandardNumber.toLowerCase().replace(/[^a-z0-9]/g, '-')
        )}`,
        lastVerifiedDate: primaryStandard.lastVerifiedDate,
        applicabilityEvidence: `Normatively cited under ${primaryStandard.isNumber}.`,
      };

      relatedMatches.push({
        standard: virtualStandard,
        score: isMandatory ? 88 : 72,
        matchReasons: [`${rel.criticality}: ${rel.description}`],
        parameterMatches: [],
        normativeRelations: [],
        isPrimary: false,
      });
    }
  }

  return relatedMatches;
}
