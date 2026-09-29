import { RecommendationResult, ExtractedRequirement, SpecificationGap } from '../types/procurement';
import { IndianStandard } from '../types/standards';
import { BIS_STANDARDS_DATABASE } from './standardsKnowledgeBase';

export interface ProcurementScenario {
  id: string;
  title: string;
  badge: string;
  category: string;
  shortDesc: string;
  sampleQuery: string;
  primaryStandardNumber: string;
  metrics: {
    requirementsIdentified: number;
    primaryStandards: number;
    relatedStandards: number;
    regulatoryChecks: number;
    potentialGaps: number;
  };
  mockResult: RecommendationResult;
}

// Find standard helper
const getStandard = (isNumberPrefix: string): IndianStandard => {
  const match = BIS_STANDARDS_DATABASE.find((s) =>
    s.isNumber.toLowerCase().includes(isNumberPrefix.toLowerCase())
  );
  if (!match) {
    throw new Error(`Standard not found: ${isNumberPrefix}`);
  }
  return match;
};

// 1. LED STREET LIGHTING SCENARIO
const ledStandard = getStandard('IS 10322 (Part 5/Sec 3)');
export const SCENARIO_LED: ProcurementScenario = {
  id: 'led-street-lighting',
  title: 'LED Street Lighting Procurement',
  badge: 'Smart City & Municipal Infrastructure',
  category: 'Electrotechnical (ETD 24)',
  shortDesc: 'Energy-efficient LED roadway luminaires with weather sealing, surge suppression, and driver safety.',
  sampleQuery:
    'Supply, installation and commissioning of energy-efficient LED street lighting fixtures for municipal roads, including weather-resistant housing, suitable optical performance, electrical safety, surge protection and testing requirements.',
  primaryStandardNumber: 'IS 10322 (Part 5/Sec 3): 2012',
  metrics: {
    requirementsIdentified: 12,
    primaryStandards: 1,
    relatedStandards: 6,
    regulatoryChecks: 3,
    potentialGaps: 4,
  },
  mockResult: {
    extractedRequirement: {
      product: 'LED Street Lighting Fixture',
      application: 'Municipal Roads, Expressways, and Outdoor Public Infrastructure',
      domain: 'Lighting & Luminaires',
      rawQuery:
        'Supply, installation and commissioning of energy-efficient LED street lighting fixtures for municipal roads, including weather-resistant housing, suitable optical performance, electrical safety, surge protection and testing requirements.',
      detectedLanguage: 'en',
      power: '90W / 120W Rated',
      voltage: '140V - 300V AC, 50 Hz',
      protectionRating: 'IP66',
      efficiency: '>= 120 Lumens/Watt',
      lifetime: '50,000 Hours (L70)',
      safetyFeatures: ['10 kV Internal Surge Protection Device (SPD)', 'Class I Insulation', 'Die-Cast Aluminum Housing (IK08)'],
      testRequirements: ['IP66 Water Jet Test', 'Type Test as per IS 16107', 'Photobiological RG0 Exemption'],
      otherSpecs: {
        CCT: '4000K to 5700K',
        CRI: '>= 70',
        DriverTHD: '< 10%',
        PowerFactor: '> 0.95',
      },
    },
    primaryStandard: ledStandard,
    relatedStandards: [
      {
        standard: getStandard('IS 16107 (Part 2/Sec 2)'),
        score: 94,
        matchReasons: ['Mandatory photometric performance and efficacy test method for LED fixtures'],
        parameterMatches: ['Luminous Efficacy >= 120 lm/W', 'CRI >= 70', 'Lumen Maintenance'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: getStandard('IS 15885 (Part 2/Sec 13)'),
        score: 91,
        matchReasons: ['Mandatory electronic controlgear (LED Driver) safety and CRS registration'],
        parameterMatches: ['Constant Current Driver', 'Over-voltage Protection', 'Driver THD < 10%'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-12063-ip',
          isNumber: 'IS 12063: 1987',
          title: 'Classification of Degrees of Protection Provided by Enclosures (IP Code)',
          department: 'Electrotechnical (ETD 24)',
          domain: 'Enclosures & Protection',
          productCategory: 'Enclosure Testing',
          scope: 'Prescribes degrees of ingress protection against solid foreign objects, dust, and water penetration.',
          status: 'Current',
          versionChain: {
            currentStandard: 'IS 12063: 1987',
            currentYear: 1987,
            amendments: [],
          },
          qco: {
            isCompulsory: false,
            orderName: 'Testing Reference Standard',
            gazetteNotification: 'Referenced Normative Code',
            ministry: 'BIS / DPIIT',
            effectiveDate: '1987-01-01',
            scheme: 'Not Applicable',
            description: 'Normative test methodology referenced by IS 10322 for IP65/IP66 weather sealing verification.',
            enforcementStatus: 'In Force',
          },
          keywords: ['ip66', 'ingress protection', 'weatherproof', 'dust test'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 45,
          schemesOfTesting: 'Laboratory Ingress Test',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-12063-1987',
        },
        score: 88,
        matchReasons: ['Prescribes official NABL test methods for IP66 enclosure weather-sealing'],
        parameterMatches: ['IP66 Ingress Protection', 'Silicon Gasket Sealing'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-16004-photo',
          isNumber: 'IS 16004 (Part 1): 2013',
          title: 'Photo-biological Safety of Lamps and Lamp Systems',
          department: 'Electrotechnical (ETD 24)',
          domain: 'Optical Safety',
          productCategory: 'Optical Safety Testing',
          scope: 'Evaluates optical radiation hazards from LEDs, including retinal blue-light hazard risk grouping.',
          status: 'Current',
          versionChain: {
            currentStandard: 'IS 16004 (Part 1): 2013',
            currentYear: 2013,
            amendments: [],
          },
          qco: {
            isCompulsory: true,
            orderName: 'LED Safety Normative Clause',
            gazetteNotification: 'Under CRO Phase-II',
            ministry: 'MeitY',
            effectiveDate: '2014-04-03',
            scheme: 'Scheme-II (CRS - Compulsory Registration Scheme)',
            description: 'Risk Group RG0 (Exempt) or RG1 is mandatory for street and roadway public illumination.',
            enforcementStatus: 'In Force',
          },
          keywords: ['blue light hazard', 'photobiological', 'retinal safety'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 28,
          schemesOfTesting: 'Spectroradiometric optical safety scan',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-16004-1-2013',
        },
        score: 84,
        matchReasons: ['Mandatory optical safety check to prevent retinal glare and photobiological damage'],
        parameterMatches: ['Risk Group RG0 (Exempt)', 'Blue light hazard assessment'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-3043-earthing',
          isNumber: 'IS 3043: 2018',
          title: 'Code of Practice for Earthing (First Revision)',
          department: 'Electrotechnical (ETD 30)',
          domain: 'Electrical Installation',
          productCategory: 'Earthing & Grounding',
          scope: 'Sets out engineering practice for electrical installation grounding, earthing pits, and equipotential bonding on lighting poles.',
          status: 'Current',
          versionChain: {
            currentStandard: 'IS 3043: 2018',
            currentYear: 2018,
            amendments: [],
          },
          qco: {
            isCompulsory: false,
            orderName: 'National Electrical Code Normative Practice',
            gazetteNotification: 'CEA Safety Regulations 2010',
            ministry: 'Ministry of Power / Central Electricity Authority',
            effectiveDate: '2018-09-01',
            scheme: 'Not Applicable',
            description: 'Mandatory installation practice under Central Electricity Authority (Measures relating to Safety and Electric Supply) Regulations.',
            enforcementStatus: 'In Force',
          },
          keywords: ['earthing', 'grounding', 'pole earthing', 'electrical bonding'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 60,
          schemesOfTesting: 'Earth resistance loop testing',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-3043-2018',
        },
        score: 80,
        matchReasons: ['Mandates grounding and bonding practices for outdoor metallic streetlight poles'],
        parameterMatches: ['Earthing resistance < 5 Ohms', 'Chassis earth lug bonding'],
        normativeRelations: [],
        isPrimary: false,
      },
    ],
    specificationGaps: [
      {
        id: 'gap-spd',
        parameter: 'Surge Protection Device (SPD) Voltage & Discharge Capacity',
        suggestedClause:
          'The luminaire shall feature an integrated and replaceable Surge Protection Device (SPD) rated for minimum 10 kV (common & differential mode) with 5 kA nominal discharge capacity conforming to IS 16074 / IEC 61643-11.',
        whyImportant:
          'Indian municipal distribution lines encounter severe voltage spikes and seasonal lightning. Fixtures lacking 10 kV SPDs suffer catastrophic driver failure within 6 months.',
        severity: 'High',
        standardReference: 'IS 10322 (Part 5/Sec 3): 2012 Amd 2 & IS 16074',
        isResolved: false,
      },
      {
        id: 'gap-ip-lab',
        parameter: 'Certified Ingress Protection (IP66) Test Certificate',
        suggestedClause:
          'Bidders shall submit a valid Type Test Certificate for IP66 Ingress Protection from an authentic NABL-accredited or BIS-recognized laboratory carried out on the exact tendered luminaire model.',
        whyImportant:
          'Without third-party NABL IP66 test proof, monsoon rain and urban dust penetrate gaskets, corroding optics and causing LED cluster short circuits.',
        severity: 'High',
        standardReference: 'IS 12063: 1987 / IS 10322 (Part 1)',
        isResolved: false,
      },
      {
        id: 'gap-thd',
        parameter: 'Driver Total Harmonic Distortion (THD) and Power Factor',
        suggestedClause:
          'The electronic LED driver shall maintain Total Harmonic Distortion (THD) < 10% under full rated load and Power Factor >= 0.95 at 230 V nominal input.',
        whyImportant:
          'High THD introduces severe harmonic distortion into municipal distribution transformers, causing feeder overheating and high energy penalty tariffs.',
        severity: 'Medium',
        standardReference: 'IS 15885 (Part 2/Sec 13): 2012',
        isResolved: false,
      },
      {
        id: 'gap-photo',
        parameter: 'Photobiological Eye Safety Classification',
        suggestedClause:
          'Luminaires shall be certified under Risk Group 0 (Exempt) or Risk Group 1 (Low Risk) for optical radiation hazard in accordance with IS 16004 (Part 1): 2013.',
        whyImportant:
          'Guarantees driver peripheral visibility without intense blue-light retinal hazard to oncoming highway drivers and public pedestrians.',
        severity: 'Low',
        standardReference: 'IS 16004 (Part 1): 2013',
        isResolved: false,
      },
    ],
    explanation: {
      rationale:
        'Matched IS 10322 (Part 5/Sec 3): 2012 as the primary governing standard for outdoor roadway luminaires. Normative cross-referencing resolved IS 16107 for photometric testing, IS 15885 for compulsory driver registration under MeitY CRO, and IS 12063 for IP66 weatherproofing.',
      productMatchSummary:
        'Semantic entity extraction mapped "LED street lighting fixtures for municipal roads" to Electrotechnical Department Sectional Committee ETD 24. Standard status is active with Amendments 1 and 2 in force.',
      regulatorySummary:
        'Quality Control Order (QCO) is COMPULSORY under Scheme-II (Compulsory Registration Scheme - CRS). Supplying or bidding un-registered luminaires or drivers is prohibited under Section 29 of the BIS Act, 2016.',
      versionAction:
        'Verify that tender specifies the 2012 edition with 2018 and 2024 amendments. Superseded 1987 edition (conventional discharge lamps) must NOT be cited.',
    },
    standardsGraph: {
      nodes: [
        { id: 'is-10322-5-3', label: 'IS 10322 (Part 5/Sec 3)', title: 'Luminaires - Road & Street Lighting', group: 'primary' },
        { id: 'is-16107-2-2', label: 'IS 16107 (Part 2/Sec 2)', title: 'LED Luminaire Performance & Efficacy', group: 'testing' },
        { id: 'is-15885-2-13', label: 'IS 15885 (Part 2/Sec 13)', title: 'Electronic Controlgear (Driver)', group: 'safety' },
        { id: 'is-12063', label: 'IS 12063: 1987', title: 'IP66 Ingress Protection Code', group: 'testing' },
        { id: 'is-16004-1', label: 'IS 16004 (Part 1)', title: 'Photobiological Eye Safety', group: 'safety' },
        { id: 'is-3043', label: 'IS 3043: 2018', title: 'Code of Practice for Earthing', group: 'allied' },
        { id: 'qco-led', label: 'MeitY CRS Mandate', title: 'Compulsory Registration Scheme QCO', group: 'certification' },
        { id: 'amd-2', label: 'Amendment 2 (2024)', title: 'Surge Withstand & Coastal Cycling', group: 'amendment' },
      ],
      edges: [
        { from: 'is-10322-5-3', to: 'is-16107-2-2', label: 'Tested By (Photometry)', dashed: false },
        { from: 'is-10322-5-3', to: 'is-15885-2-13', label: 'Requires (Driver Safety)', dashed: false },
        { from: 'is-10322-5-3', to: 'is-12063', label: 'Tested By (IP66)', dashed: false },
        { from: 'is-10322-5-3', to: 'is-16004-1', label: 'Safety Requirement', dashed: false },
        { from: 'is-10322-5-3', to: 'is-3043', label: 'Installation Earthing', dashed: true },
        { from: 'is-10322-5-3', to: 'qco-led', label: 'Compulsory Scheme-II', dashed: false },
        { from: 'is-10322-5-3', to: 'amd-2', label: 'Current Amendment', dashed: true },
      ],
    },
    generatedTenderClause: '',
    matchConfidence: 96,
    confidenceLevel: 'High',
    isNoMatch: false,
    evidence: {
      whyApplies:
        'Direct scope match: IS 10322 (Part 5/Sec 3) explicitly governs fixed outdoor luminaires for municipal roadways, public highways, and expressways on supply voltages up to 1000 V.',
      officialSourceUrl: 'https://standards.bis.gov.in/item/is-10322-part-5-sec-3-2012',
      lastVerifiedDate: '2024-08-15',
      uncertaintyFlags: [
        'Centralized Control and Monitoring System (CCMS) protocol conformance (DALI-2 / 0-10V) should be verified if municipal smart dimming is required.',
      ],
      scopeExtract:
        'Clause 1.1: This section specifies particular requirements for road, street, and highway lighting luminaires using electrical light sources on supply voltages not exceeding 1000 V.',
    },
    clarifyingQuestions: [],
    outdatedStandardAlert: undefined,
  },
};

// 2. CEMENT PROCUREMENT SCENARIO
const cementStandard = getStandard('IS 269: 2015');
export const SCENARIO_CEMENT: ProcurementScenario = {
  id: 'cement-procurement',
  title: 'Cement Procurement (OPC 53 Grade)',
  badge: 'Civil & Structural Infrastructure',
  category: 'Civil Engineering (CED 02)',
  shortDesc: 'Ordinary Portland Cement 53 Grade for high-performance structural concrete and bridge works.',
  sampleQuery:
    'Procurement of 500 MT Ordinary Portland Cement (OPC 53 Grade) for high-strength bridge pier and structural concrete works, conforming to mandatory physical and chemical requirements, initial setting time, compressive strength and tamper-proof packaging.',
  primaryStandardNumber: 'IS 269: 2015',
  metrics: {
    requirementsIdentified: 10,
    primaryStandards: 1,
    relatedStandards: 5,
    regulatoryChecks: 2,
    potentialGaps: 3,
  },
  mockResult: {
    extractedRequirement: {
      product: 'Ordinary Portland Cement (OPC 53 Grade)',
      application: 'High-Strength Bridge Piers, Precast Girders, and Structural Reinforced Concrete',
      domain: 'Civil & Construction',
      rawQuery:
        'Procurement of 500 MT Ordinary Portland Cement (OPC 53 Grade) for high-strength bridge pier and structural concrete works, conforming to mandatory physical and chemical requirements, initial setting time, compressive strength and tamper-proof packaging.',
      detectedLanguage: 'en',
      capacity: '500 Metric Tonnes (50 kg HDPE Bags)',
      safetyFeatures: ['Tamper-proof Bag Stitching', 'Batch Date Printing', 'IS 456 Durability Compliance'],
      testRequirements: [
        'Compressive Strength Cube Test (3-day, 7-day, 28-day)',
        'Vicat Initial and Final Setting Time Test',
        'Chemical Soundness (Le-Chatelier Test)',
      ],
      otherSpecs: {
        InitialSettingTime: '>= 30 Minutes',
        FinalSettingTime: '<= 600 Minutes',
        CompressiveStrength28D: '>= 53 N/mm2',
        FinenessSpecificSurface: '>= 225 m2/kg',
      },
    },
    primaryStandard: cementStandard,
    relatedStandards: [
      {
        standard: {
          id: 'is-4031-6',
          isNumber: 'IS 4031 (Part 6): 1988',
          title: 'Methods of Physical Tests for Hydraulic Cement - Determination of Compressive Strength',
          department: 'Civil Engineering (CED 02)',
          domain: 'Cement Testing',
          productCategory: 'Physical Test Method',
          scope: 'Prescribes apparatus and procedure for compressive strength testing of cement-sand mortar cubes.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 4031 (Part 6): 1988', currentYear: 1988, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'Cement Quality Order Mandatory Test',
            gazetteNotification: 'DPIIT Cement QCO',
            ministry: 'DPIIT',
            effectiveDate: '2003-02-17',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Compulsory testing methodology for factory and site acceptance.',
            enforcementStatus: 'In Force',
          },
          keywords: ['compressive strength', 'mortar cube', '7 day strength', '28 day strength'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 72,
          schemesOfTesting: 'Routine Batch Compressive Testing',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-4031-part-6-1988',
        },
        score: 95,
        matchReasons: ['Mandatory test method standard for 28-day compressive strength (>= 53 MPa) verification'],
        parameterMatches: ['Compressive Strength >= 53 N/mm2', 'Mortar cube test'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-4031-5',
          isNumber: 'IS 4031 (Part 5): 1988',
          title: 'Methods of Physical Tests for Hydraulic Cement - Determination of Setting Time',
          department: 'Civil Engineering (CED 02)',
          domain: 'Cement Testing',
          productCategory: 'Physical Test Method',
          scope: 'Prescribes Vicat needle apparatus testing for initial and final setting times of cement paste.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 4031 (Part 5): 1988', currentYear: 1988, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'Cement QCO Test Standard',
            gazetteNotification: 'DPIIT Cement QCO',
            ministry: 'DPIIT',
            effectiveDate: '2003-02-17',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Mandatory standard for batch acceptance.',
            enforcementStatus: 'In Force',
          },
          keywords: ['setting time', 'vicat apparatus', 'initial setting', 'final setting'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 68,
          schemesOfTesting: 'Batch Vicat Needle Test',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-4031-part-5-1988',
        },
        score: 91,
        matchReasons: ['Prescribes initial setting time (min 30 min) and final setting time (max 600 min) tests'],
        parameterMatches: ['Initial Setting Time >= 30 min', 'Final Setting Time <= 600 min'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-456-concrete',
          isNumber: 'IS 456: 2000',
          title: 'Plain and Reinforced Concrete - Code of Practice (Fourth Revision)',
          department: 'Civil Engineering (CED 02)',
          domain: 'Structural Concrete',
          productCategory: 'Code of Practice',
          scope: 'Governs design, minimum cement content, water-cement ratios, durability exposure conditions, and structural placement.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 456: 2000', currentYear: 2000, amendments: [] },
          qco: {
            isCompulsory: false,
            orderName: 'National Building Code Reference',
            gazetteNotification: 'National Building Code 2016',
            ministry: 'Ministry of Housing and Urban Affairs',
            effectiveDate: '2000-07-01',
            scheme: 'Not Applicable',
            description: 'Statutory structural engineering code for reinforced and prestressed concrete across India.',
            enforcementStatus: 'In Force',
          },
          keywords: ['is 456', 'reinforced concrete', 'concrete mix', 'durability', 'water cement ratio'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 85,
          schemesOfTesting: 'Structural Mix Design Assessment',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-456-2000',
        },
        score: 87,
        matchReasons: ['Mandates concrete grade, durability exposure classification, and maximum water-cement ratio'],
        parameterMatches: ['Structural Concrete Practice', 'Exposure Conditions'],
        normativeRelations: [],
        isPrimary: false,
      },
    ],
    specificationGaps: [
      {
        id: 'gap-cement-age',
        parameter: 'Maximum Delivery Age of Cement at Site',
        suggestedClause:
          'Cement delivered at project site shall not be older than 30 days (maximum 45 days) from the date of manufacture printed on the bag, and shall show zero signs of pre-hydration or lumping.',
        whyImportant:
          'Cement stored in humid Indian monsoon conditions absorbs atmospheric moisture, losing up to 20% compressive strength in 4 weeks and 30% in 8 weeks.',
        severity: 'High',
        standardReference: 'IS 269: 2015 Clause 11 & CPWD Specifications',
        isResolved: false,
      },
      {
        id: 'gap-packing-hdpe',
        parameter: 'Moisture-Proof Packaging & Tare Weight Tolerance',
        suggestedClause:
          'Cement shall be supplied in 50 kg laminated HDPE or multi-wall kraft paper bags conforming to IS 11652 / IS 14968, stitched tamper-evident, with bag weight variation within +/- 1.0%.',
        whyImportant:
          'Non-laminated porous bags allow rapid clinker deterioration during transit and cause substantial weight loss through dusting.',
        severity: 'High',
        standardReference: 'IS 269: 2015 Clause 10',
        isResolved: false,
      },
      {
        id: 'gap-test-freq',
        parameter: 'Mandatory Manufacturer Test Certificate (MTC) per Batch',
        suggestedClause:
          'Every consignment shall be accompanied by a Manufacturer Test Certificate (MTC) indicating chemical analysis (IS 4032) and physical test results (IS 4031) matching the batch identification stamped on bags.',
        whyImportant:
          'Without batch-linked MTCs, project engineers cannot verify clinker quality or total chloride content, risking premature corrosion of reinforcement steel.',
        severity: 'Medium',
        standardReference: 'IS 269: 2015 Clause 12',
        isResolved: false,
      },
    ],
    explanation: {
      rationale:
        'Matched IS 269: 2015 (incorporating 53-Grade OPC) as the mandatory primary standard. Consolidated earlier separate standards (IS 12269 for 53G, IS 8112 for 43G) into a single unified standard. Normatively linked physical testing (IS 4031) and structural durability rules (IS 456).',
      productMatchSummary:
        'Mapped to Civil Engineering Department CED 02. Active standard with Amendment 1 (2021) permitting verified micro-limestone additions up to 5%.',
      regulatorySummary:
        'Cement (Quality Control) Order strictly prohibits manufacture, supply, or public procurement of cement without valid BIS Scheme-I (ISI Mark) license. Supplying non-ISI cement is a non-bailable offense under Section 29, BIS Act 2016.',
      versionAction:
        'Ensure tender references IS 269: 2015. Do NOT cite withdrawn legacy standard IS 12269: 1987.',
    },
    standardsGraph: {
      nodes: [
        { id: 'is-269', label: 'IS 269: 2015', title: 'Ordinary Portland Cement (33, 43, 53)', group: 'primary' },
        { id: 'is-4031-6', label: 'IS 4031 (Part 6)', title: 'Compressive Strength Cube Test', group: 'testing' },
        { id: 'is-4031-5', label: 'IS 4031 (Part 5)', title: 'Setting Time (Vicat Apparatus)', group: 'testing' },
        { id: 'is-4032', label: 'IS 4032: 1985', title: 'Chemical Analysis of Cement', group: 'testing' },
        { id: 'is-456', label: 'IS 456: 2000', title: 'Plain & Reinforced Concrete Code', group: 'allied' },
        { id: 'is-1489', label: 'IS 1489 (Part 1)', title: 'PPC Fly Ash Cement', group: 'allied' },
        { id: 'qco-cement', label: 'DPIIT Cement QCO', title: 'Mandatory ISI Mark Order', group: 'certification' },
      ],
      edges: [
        { from: 'is-269', to: 'is-4031-6', label: 'Tested By (Strength)', dashed: false },
        { from: 'is-269', to: 'is-4031-5', label: 'Tested By (Setting Time)', dashed: false },
        { from: 'is-269', to: 'is-4032', label: 'Tested By (Chemical)', dashed: false },
        { from: 'is-269', to: 'is-456', label: 'Governing Structural Code', dashed: true },
        { from: 'is-269', to: 'is-1489', label: 'Allied Product Option', dashed: true },
        { from: 'is-269', to: 'qco-cement', label: 'Mandatory Scheme-I', dashed: false },
      ],
    },
    generatedTenderClause: '',
    matchConfidence: 98,
    confidenceLevel: 'High',
    isNoMatch: false,
    evidence: {
      whyApplies:
        'Direct scope match: IS 269: 2015 specifies physical and chemical requirements for 53-Grade OPC used in high-strength structural, precast, and bridge concrete works.',
      officialSourceUrl: 'https://standards.bis.gov.in/item/is-269-2015',
      lastVerifiedDate: '2024-09-01',
      uncertaintyFlags: [
        'If bridge foundation is exposed to coastal marine or sulphate-bearing soil, consider specifying Sulphate Resisting Portland Cement (IS 12330) or PPC (IS 1489 Part 1).',
      ],
      scopeExtract:
        'Clause 1: This standard covers the manufacture, chemical and physical requirements of ordinary Portland cement of 33, 43 and 53 strength grades.',
    },
    clarifyingQuestions: [],
    outdatedStandardAlert: undefined,
  },
};

// 3. ELECTRICAL CABLES SCENARIO
const cableStandard = getStandard('IS 7098 (Part 1)');
export const SCENARIO_CABLES: ProcurementScenario = {
  id: 'electrical-cables',
  title: 'Electrical Power Cables (1.1 kV XLPE)',
  badge: 'Power Distribution & Transmission',
  category: 'Electrotechnical (ETD 09)',
  shortDesc: 'Cross-linked polyethylene insulated, armoured aluminium power cables for underground distribution.',
  sampleQuery:
    'Supply of 1.1 kV grade XLPE insulated, PVC inner sheathed, galvanized steel wire armoured aluminium conductor power cables for underground electrical distribution, including type test conformity and flame retardant properties.',
  primaryStandardNumber: 'IS 7098 (Part 1): 1988',
  metrics: {
    requirementsIdentified: 11,
    primaryStandards: 1,
    relatedStandards: 5,
    regulatoryChecks: 2,
    potentialGaps: 3,
  },
  mockResult: {
    extractedRequirement: {
      product: 'XLPE Insulated Armoured Electric Cable',
      application: 'Underground Heavy-Duty Power Distribution & Substation Feeder',
      domain: 'Electrical Infrastructure',
      rawQuery:
        'Supply of 1.1 kV grade XLPE insulated, PVC inner sheathed, galvanized steel wire armoured aluminium conductor power cables for underground electrical distribution, including type test conformity and flame retardant properties.',
      detectedLanguage: 'en',
      voltage: '1100 V (1.1 kV Grade)',
      material: 'Stranded Compacted Aluminium Conductor / XLPE / Galvanized Steel Armour',
      protectionRating: 'Galvanized Round Wire / Strip Armour',
      safetyFeatures: ['Flame Retardant Low Smoke (FRLS) Sheath', 'Water Tight Extruded PVC Inner Sheath'],
      testRequirements: ['Type Test as per IS 10810', 'Conductor Resistance Test (IS 8130)', 'High Voltage Spark Test'],
      otherSpecs: {
        ConductorClass: 'Class 2 Stranded Compacted Aluminium',
        Insulation: 'Cross-Linked Polyethylene (XLPE) 90 deg C',
        Armouring: 'Galvanized Steel Strip/Wire',
      },
    },
    primaryStandard: cableStandard,
    relatedStandards: [
      {
        standard: {
          id: 'is-8130-conductor',
          isNumber: 'IS 8130: 2013',
          title: 'Conductors for Insulated Electric Cables and Flexible Cords (Second Revision)',
          department: 'Electrotechnical (ETD 09)',
          domain: 'Cables & Conductors',
          productCategory: 'Conductor Standard',
          scope: 'Specifies electrical resistance, tensile strength, and dimensions for copper and aluminium conductors.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 8130: 2013', currentYear: 2013, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'Wires and Cables QCO',
            gazetteNotification: 'DPIIT Wires and Cables Order',
            ministry: 'DPIIT',
            effectiveDate: '2023-09-01',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Compulsory ISI marking for conductor material quality.',
            enforcementStatus: 'In Force',
          },
          keywords: ['conductor resistance', 'aluminium conductor', 'copper wire', 'class 2'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 50,
          schemesOfTesting: 'Conductor Resistance Kelvin Double Bridge Test',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-8130-2013',
        },
        score: 93,
        matchReasons: ['Mandatory normative standard for aluminium conductor purity and DC electrical resistance'],
        parameterMatches: ['Conductor Resistance', 'Class 2 Stranded Aluminium'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-5831-sheath',
          isNumber: 'IS 5831: 1984',
          title: 'PVC Insulation and Sheath of Electric Cables',
          department: 'Electrotechnical (ETD 09)',
          domain: 'Cables & Insulation',
          productCategory: 'Polymer Compound Standard',
          scope: 'Prescribes physical, mechanical, thermal, and chemical requirements for PVC compounds used in cable outer sheaths.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 5831: 1984', currentYear: 1984, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'Wires and Cables QCO',
            gazetteNotification: 'DPIIT Wires and Cables Order',
            ministry: 'DPIIT',
            effectiveDate: '2023-09-01',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Normative standard for sheath compound verification.',
            enforcementStatus: 'In Force',
          },
          keywords: ['pvc sheath', 'frls', 'oxygen index', 'outer jacket'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 44,
          schemesOfTesting: 'Tensile & Elongation compound testing',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-5831-1984',
        },
        score: 89,
        matchReasons: ['Prescribes Type ST2 PVC outer sheath with flame retardant and anti-termite additives'],
        parameterMatches: ['Outer Sheath Material', 'Flame Retardant Properties'],
        normativeRelations: [],
        isPrimary: false,
      },
    ],
    specificationGaps: [
      {
        id: 'gap-frls',
        parameter: 'FRLS (Flame Retardant Low Smoke) Oxygen & Smoke Index',
        suggestedClause:
          'The outer PVC sheath shall be Type ST-2 Flame Retardant Low Smoke (FRLS) with Minimum Oxygen Index of 29% conforming to IS 10810 (Part 58) and maximum smoke density not exceeding 60% as per IS 10810 (Part 63).',
        whyImportant:
          'In underground conduits and trenches, ordinary PVC cables emit dense toxic hydrogen chloride gas and black smoke during electrical fires, incapacitating response crews.',
        severity: 'High',
        standardReference: 'IS 7098 (Part 1) & IS 10810 (Parts 58, 63)',
        isResolved: false,
      },
      {
        id: 'gap-marking',
        parameter: 'Sequential Metre Length & ISI Embossing',
        suggestedClause:
          'Cable outer sheath shall be embossed or indented sequentially at every 1 metre interval with manufacturer name, voltage grade (1100 V), cable code (e.g., A2XFY), BIS standard mark, and progressive length in metres.',
        whyImportant:
          'Prevents dispute during trench laying, guards against counterfeit short-length drums, and ensures complete traceability during utility audits.',
        severity: 'Medium',
        standardReference: 'IS 7098 (Part 1): 1988 Clause 17',
        isResolved: false,
      },
    ],
    explanation: {
      rationale:
        'Identified IS 7098 (Part 1): 1988 as the mandatory primary Indian Standard for 1.1 kV XLPE insulated armoured cables. Normatively resolved conductor specifications under IS 8130 and compound safety under IS 5831.',
      productMatchSummary:
        'Electrotechnical Department committee ETD 09 governs all industrial and utility power cables. Active standard reaffirmed in 2020.',
      regulatorySummary:
        'Electrical Wires and Cables (Quality Control) Order mandates Scheme-I (ISI Mark) certification. Bidding or supplying non-ISI power cables violates statutory Central Electricity Authority safety regulations.',
      versionAction:
        'Verify that tender mandates 1.1 kV XLPE insulated armoured cables conforming to IS 7098 (Part 1) rather than generic unarmoured building wires under IS 694.',
    },
    standardsGraph: {
      nodes: [
        { id: 'is-7098-1', label: 'IS 7098 (Part 1)', title: '1.1 kV XLPE Insulated Armoured Cables', group: 'primary' },
        { id: 'is-8130', label: 'IS 8130: 2013', title: 'Conductors for Insulated Cables', group: 'safety' },
        { id: 'is-5831', label: 'IS 5831: 1984', title: 'PVC Insulation & Sheath', group: 'testing' },
        { id: 'is-10810', label: 'IS 10810 Series', title: 'Methods of Test for Cables', group: 'testing' },
        { id: 'qco-cable', label: 'Wires & Cables QCO', title: 'Compulsory Scheme-I ISI Mark', group: 'certification' },
      ],
      edges: [
        { from: 'is-7098-1', to: 'is-8130', label: 'Conductor Normative', dashed: false },
        { from: 'is-7098-1', to: 'is-5831', label: 'Sheath Compound', dashed: false },
        { from: 'is-7098-1', to: 'is-10810', label: 'Tested By (Type Tests)', dashed: false },
        { from: 'is-7098-1', to: 'qco-cable', label: 'Mandatory QCO', dashed: false },
      ],
    },
    generatedTenderClause: '',
    matchConfidence: 95,
    confidenceLevel: 'High',
    isNoMatch: false,
    evidence: {
      whyApplies:
        'Direct scope match: IS 7098 (Part 1) covers cross-linked polyethylene (XLPE) insulated and PVC sheathed armoured cables for operating voltages up to and including 1100 V.',
      officialSourceUrl: 'https://standards.bis.gov.in/item/is-7098-part-1-1988',
      lastVerifiedDate: '2024-09-01',
      uncertaintyFlags: [
        'Verify whether steel wire armour (round wire) or steel strip armour (flat strip) is required based on trench pulling tension and bend radius.',
      ],
      scopeExtract:
        'Clause 1: This standard covers the requirements of single, two, three, three and a half, and four core XLPE insulated armoured cables for working voltages up to 1100 V.',
    },
    clarifyingQuestions: [],
    outdatedStandardAlert: undefined,
  },
};

// 4. SAFETY HELMETS SCENARIO
const helmetStandard = getStandard('IS 2925: 1984');
export const SCENARIO_HELMETS: ProcurementScenario = {
  id: 'safety-helmets',
  title: 'Industrial Safety Helmets',
  badge: 'Occupational Health & PPE',
  category: 'Chemical / Mechanical (CHD 33 / MED 06)',
  shortDesc: 'Hard hats with shock absorption, penetration resistance, electrical insulation, and chin strap retention.',
  sampleQuery:
    'Procurement of 2500 industrial safety helmets for construction project workers and site engineers, with high-density polyethylene (HDPE) shell, shock absorption, penetration resistance, adjustable nape strap, electrical insulation and chin strap.',
  primaryStandardNumber: 'IS 2925: 1984',
  metrics: {
    requirementsIdentified: 9,
    primaryStandards: 1,
    relatedStandards: 4,
    regulatoryChecks: 2,
    potentialGaps: 3,
  },
  mockResult: {
    extractedRequirement: {
      product: 'Industrial Safety Helmet',
      application: 'Construction Sites, Power Plant Erecting, Mining, and Industrial Engineering',
      domain: 'Healthcare & Safety PPE',
      rawQuery:
        'Procurement of 2500 industrial safety helmets for construction project workers and site engineers, with high-density polyethylene (HDPE) shell, shock absorption, penetration resistance, adjustable nape strap, electrical insulation and chin strap.',
      detectedLanguage: 'en',
      capacity: '2500 Units',
      material: 'Virgin High-Density Polyethylene (HDPE) Shell with UV Stabilizer',
      safetyFeatures: ['Shock Absorption (Transmitted Force < 5.0 kN)', 'Penetration Resistance', 'Class E/G Electrical Insulation up to 1200V'],
      testRequirements: ['Drop Weight Impact Test (5 kg striker)', 'Conical Penetration Test (3 kg striker)', 'Dielectric Proof Test'],
      otherSpecs: {
        Suspension: '6-Point Textile Cradle with Ratchet Adjustment',
        ChinStrap: 'Adjustable Chin Strap with Quick Release (150-250 N)',
        ColorCoding: 'White for Engineers, Yellow for Workers',
      },
    },
    primaryStandard: helmetStandard,
    relatedStandards: [
      {
        standard: {
          id: 'is-2925-10-1',
          isNumber: 'IS 2925 (Clause 10.1): 1984',
          title: 'Shock Absorption Resistance Test Procedure',
          department: 'Chemical / Mechanical (CHD 33)',
          domain: 'PPE Testing',
          productCategory: 'Test Clause',
          scope: 'Prescribes drop test using a 5 kg steel striker from 1 m height onto helmet mounted on a calibrated headform.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 2925: 1984', currentYear: 1984, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'PPE Helmets QCO Test Clause',
            gazetteNotification: 'DPIIT PPE QCO',
            ministry: 'DPIIT',
            effectiveDate: '2021-06-01',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Transmitted force shall never exceed 5.0 kN.',
            enforcementStatus: 'In Force',
          },
          keywords: ['shock absorption', 'transmitted force', '5 kn limit'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 24,
          schemesOfTesting: 'Impact tower load cell test',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-2925-1984',
        },
        score: 96,
        matchReasons: ['Mandatory test clause: Maximum transmitted impact force shall not exceed 5.0 kN'],
        parameterMatches: ['Shock Absorption <= 5.0 kN', 'Drop test with 5 kg striker'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-9944-safety',
          isNumber: 'IS 9944: 1992',
          title: 'Recommendations on Safe Working Conditions for Occupational Safety',
          department: 'Chemical / Mechanical (CHD 33)',
          domain: 'Occupational Safety',
          productCategory: 'Code of Practice',
          scope: 'Provides statutory guidelines for head, eye, and foot protection equipment deployment on hazardous sites.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 9944: 1992', currentYear: 1992, amendments: [] },
          qco: {
            isCompulsory: false,
            orderName: 'Factories Act Advisory',
            gazetteNotification: 'Directorate General Factory Advice Service (DGFASLI)',
            ministry: 'Ministry of Labour & Employment',
            effectiveDate: '1992-06-01',
            scheme: 'Not Applicable',
            description: 'Statutory compliance guideline for construction contracts.',
            enforcementStatus: 'In Force',
          },
          keywords: ['worker safety', 'bocw act', 'ppe selection'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 35,
          schemesOfTesting: 'Site safety audit',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-9944-1992',
        },
        score: 86,
        matchReasons: ['Statutory guideline under Building and Other Construction Workers (BOCW) Act'],
        parameterMatches: ['Occupational PPE Deployment', 'Worker Protection'],
        normativeRelations: [],
        isPrimary: false,
      },
    ],
    specificationGaps: [
      {
        id: 'gap-dielectric',
        parameter: 'Certified Electrical Proof Test up to 1200 V AC',
        suggestedClause:
          'Helmets shall carry a certified Electrical Insulation Test Certificate conforming to IS 2925 Clause 10.4 with leakage current not exceeding 3.0 mA under 1200 V AC, 50 Hz test conditions.',
        whyImportant:
          'Guarantees construction personnel and site electricians are shielded against fatal electrocution from accidental overhead cable strikes.',
        severity: 'High',
        standardReference: 'IS 2925: 1984 Clause 10.4',
        isResolved: false,
      },
      {
        id: 'gap-uv-hdpe',
        parameter: '100% Virgin HDPE with Certified UV Inhibitors',
        suggestedClause:
          'Helmet shell shall be injection molded from 100% virgin High-Density Polyethylene (HDPE) or ABS with certified ultraviolet (UV) stabilizer masterbatch to prevent embrittlement during outdoor summer exposure.',
        whyImportant:
          'Unstabilized recycled plastics degrade rapidly under intense Indian sunlight, causing the shell to shatter like glass upon impact.',
        severity: 'High',
        standardReference: 'IS 2925: 1984 Amendment 3 (2019)',
        isResolved: false,
      },
      {
        id: 'gap-chin-strap',
        parameter: '6-Point Harness & Chin-Strap Retention Rating',
        suggestedClause:
          'Suspension shall feature a 6-point textile cradle with sweatband, nape ratchet band, and chin-strap with release load between 150 N and 250 N to eliminate strangulation risk.',
        whyImportant:
          'Inadequate chin straps result in helmets falling off during slips or wind gusts, leaving the worker completely unprotected.',
        severity: 'Medium',
        standardReference: 'IS 2925: 1984 Clause 6 & 7',
        isResolved: false,
      },
    ],
    explanation: {
      rationale:
        'Matched IS 2925: 1984 as the primary Indian Standard for industrial safety helmets. Verified that two-wheeler motorcycle helmets (IS 4151) are distinct and non-interchangeable.',
      productMatchSummary:
        'Governed by Joint Committee CHD 33 / MED 06. Active standard reaffirmed in 2020 with Amendments 1, 2, and 3 in force.',
      regulatorySummary:
        'Personal Protective Equipment (Protective Helmets) Quality Control Order mandates compulsory Scheme-I (ISI Mark) certification. Bidding or supplying uncertified safety helmets violates BOCW Act and Section 29 of BIS Act 2016.',
      versionAction:
        'Ensure tender mandates IS 2925: 1984 with Amendment 3 (2019 UV stabilization).',
    },
    standardsGraph: {
      nodes: [
        { id: 'is-2925', label: 'IS 2925: 1984', title: 'Specification for Industrial Safety Helmets', group: 'primary' },
        { id: 'is-2925-10-1', label: 'IS 2925 (Cl 10.1)', title: 'Shock Absorption <= 5.0 kN', group: 'testing' },
        { id: 'is-2925-10-2', label: 'IS 2925 (Cl 10.2)', title: 'Penetration Resistance', group: 'testing' },
        { id: 'is-2925-10-4', label: 'IS 2925 (Cl 10.4)', title: '1200V Dielectric Proof', group: 'safety' },
        { id: 'is-9944', label: 'IS 9944: 1992', title: 'Safe Working Conditions Code', group: 'allied' },
        { id: 'qco-ppe', label: 'DPIIT PPE QCO', title: 'Mandatory ISI Mark Order', group: 'certification' },
      ],
      edges: [
        { from: 'is-2925', to: 'is-2925-10-1', label: 'Tested By (Impact)', dashed: false },
        { from: 'is-2925', to: 'is-2925-10-2', label: 'Tested By (Penetration)', dashed: false },
        { from: 'is-2925', to: 'is-2925-10-4', label: 'Tested By (Electrical)', dashed: false },
        { from: 'is-2925', to: 'is-9944', label: 'Normative Safety Code', dashed: true },
        { from: 'is-2925', to: 'qco-ppe', label: 'Mandatory Scheme-I', dashed: false },
      ],
    },
    generatedTenderClause: '',
    matchConfidence: 97,
    confidenceLevel: 'High',
    isNoMatch: false,
    evidence: {
      whyApplies:
        'Direct scope match: IS 2925 specifies physical, performance, and testing requirements for industrial safety helmets protecting occupational workers against falling objects and electrical shock.',
      officialSourceUrl: 'https://standards.bis.gov.in/item/is-2925-1984',
      lastVerifiedDate: '2024-09-01',
      uncertaintyFlags: [
        'Specify whether non-ventilated shells are required for chemical splash or live electrical switchyard maintenance.',
      ],
      scopeExtract:
        'Clause 1: This standard covers requirements regarding materials, construction, finish, and tests for helmets intended to provide head protection to industrial workers.',
    },
    clarifyingQuestions: [],
    outdatedStandardAlert: undefined,
  },
};

// 5. WATER PUMPS SCENARIO
const pumpStandard = getStandard('IS 9079: 2018');
export const SCENARIO_PUMPS: ProcurementScenario = {
  id: 'water-pumps',
  title: 'Agricultural Monobloc Water Pumps',
  badge: 'Agriculture & Water Supply',
  category: 'Mechanical Engineering (MED 20)',
  shortDesc: 'Centrifugal monobloc pumpsets for clear cold water irrigation with BEE 5-star efficiency rating.',
  sampleQuery:
    'Procurement of 5 HP three-phase agricultural monobloc water pumpsets, 415V, 50 Hz, suitable for clear cold water irrigation, with IP55 protection, BEE 5-star energy efficiency rating, and mandatory test certificates.',
  primaryStandardNumber: 'IS 9079: 2018',
  metrics: {
    requirementsIdentified: 10,
    primaryStandards: 1,
    relatedStandards: 4,
    regulatoryChecks: 2,
    potentialGaps: 3,
  },
  mockResult: {
    extractedRequirement: {
      product: 'Agricultural Monobloc Clear Water Pump',
      application: 'Agricultural Irrigation and Clear Cold Water Lifting',
      domain: 'Agricultural & Water Supply',
      rawQuery:
        'Procurement of 5 HP three-phase agricultural monobloc water pumpsets, 415V, 50 Hz, suitable for clear cold water irrigation, with IP55 protection, BEE 5-star energy efficiency rating, and mandatory test certificates.',
      detectedLanguage: 'en',
      power: '5 HP (3.7 kW)',
      voltage: '415 V +/- 10%, 50 Hz Three Phase',
      protectionRating: 'IP55',
      efficiency: 'BEE 5-Star Energy Rating',
      safetyFeatures: ['Thermal Overload Protector', 'Carbon-Ceramic Mechanical Seal', 'Class F Insulation'],
      testRequirements: ['Hydraulic Pressure Test', 'Pump Performance & Head vs Flow Rate Test', 'IP55 Motor Ingress Test'],
      otherSpecs: {
        PumpType: 'Centrifugal Monobloc',
        SuctionDelivery: '65 mm x 50 mm',
        Speed: '2880 RPM Nominal',
      },
    },
    primaryStandard: pumpStandard,
    relatedStandards: [
      {
        standard: {
          id: 'is-996-motor',
          isNumber: 'IS 996: 2009',
          title: 'Single-Phase and Three-Phase AC Induction Motors for General Purpose',
          department: 'Electrotechnical (ETD 15)',
          domain: 'Motors & Generators',
          productCategory: 'Electric Motor Standard',
          scope: 'Specifies electrical efficiency, temperature rise, and breakdown torque for driving induction motors.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 996: 2009', currentYear: 2009, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'Electric Motors QCO',
            gazetteNotification: 'DPIIT Motors Order',
            ministry: 'DPIIT',
            effectiveDate: '2020-10-01',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Compulsory Scheme-I certification for motor section.',
            enforcementStatus: 'In Force',
          },
          keywords: ['induction motor', 'motor efficiency', '415v motor', 'class f'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 48,
          schemesOfTesting: 'Dynamometer efficiency test',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-996-2009',
        },
        score: 92,
        matchReasons: ['Mandatory normative standard for the integral electric motor driving the monobloc pump'],
        parameterMatches: ['415V Three Phase Motor', 'Class F Insulation'],
        normativeRelations: [],
        isPrimary: false,
      },
      {
        standard: {
          id: 'is-11346-tests',
          isNumber: 'IS 11346: 2002',
          title: 'Code for Acceptance Tests for Agricultural and Water Supply Pumps',
          department: 'Mechanical Engineering (MED 20)',
          domain: 'Pump Testing',
          productCategory: 'Testing Code',
          scope: 'Prescribes measurement of head, discharge volume, power input, and pump efficiency.',
          status: 'Current',
          versionChain: { currentStandard: 'IS 11346: 2002', currentYear: 2002, amendments: [] },
          qco: {
            isCompulsory: true,
            orderName: 'Pump Acceptance Test Code',
            gazetteNotification: 'DPIIT Pumps Order',
            ministry: 'DPIIT',
            effectiveDate: '2020-10-01',
            scheme: 'Scheme-I (ISI Mark)',
            description: 'Mandatory acceptance test methodology.',
            enforcementStatus: 'In Force',
          },
          keywords: ['pump test', 'discharge measurement', 'head test', 'npsh'],
          relationships: [],
          technicalRequirements: [],
          commonMissingSpecs: [],
          testingLaboratoriesAvailable: 32,
          schemesOfTesting: 'Flow test bench verification',
          officialSourceUrl: 'https://standards.bis.gov.in/item/is-11346-2002',
        },
        score: 88,
        matchReasons: ['Prescribes official hydraulic test bench methods for discharge rate and total head testing'],
        parameterMatches: ['Head vs Flow Testing', 'Overall Efficiency Verification'],
        normativeRelations: [],
        isPrimary: false,
      },
    ],
    specificationGaps: [
      {
        id: 'gap-duty-point',
        parameter: 'Operating Head and Discharge Duty Point Specification',
        suggestedClause:
          'The monobloc pumpset shall deliver a guaranteed discharge of minimum 450 Liters Per Minute (LPM) at rated Total Head of 24 meters at nominal 2880 RPM under specified test conditions.',
        whyImportant:
          'Procuring a pump without exact total head and flow rate duty point leads to severe cavitation, impeller wear, or motor burnout on field irrigation wells.',
        severity: 'High',
        standardReference: 'IS 9079: 2018 Clause 5 & Table 1',
        isResolved: false,
      },
      {
        id: 'gap-bee-label',
        parameter: 'BEE 5-Star Energy Efficiency Certification',
        suggestedClause:
          'Pumpsets shall bear an authentic Bureau of Energy Efficiency (BEE) 5-Star rating label valid on tender submission date with Star Rating test certificate from a NABL laboratory.',
        whyImportant:
          'Reduces power consumption by up to 25% over sub-standard pumps, lowering agricultural power subsidy burdens for state distribution utilities.',
        severity: 'High',
        standardReference: 'BEE Star Labeling Mandate / IS 9079',
        isResolved: false,
      },
      {
        id: 'gap-mech-seal',
        parameter: 'Carbon-Ceramic Mechanical Seal vs Gland Packing',
        suggestedClause:
          'The pump shall be fitted with a precision carbon vs ceramic mechanical face seal with stainless steel spring to completely prevent water ingress into motor bearings.',
        whyImportant:
          'Traditional cotton gland packings leak continuously, requiring constant manual tightening and causing motor shaft corrosion.',
        severity: 'Medium',
        standardReference: 'IS 9079: 2018 Clause 9',
        isResolved: false,
      },
    ],
    explanation: {
      rationale:
        'Matched IS 9079: 2018 (Third Revision) as the governing standard for centrifugal monobloc pumpsets handling clear, cold water. Normatively linked driving motor benchmarks under IS 996 and hydraulic acceptance tests under IS 11346.',
      productMatchSummary:
        'Mechanical Engineering Department committee MED 20 governs agricultural irrigation pumping. Standard reaffirmed in 2023 with Amendment 1.',
      regulatorySummary:
        'Pumps for Agricultural and Domestic Purpose (Quality Control) Order mandates compulsory Scheme-I (ISI Mark) licensing. Supplying non-ISI pumpsets under government subsidy or agricultural schemes is prohibited.',
      versionAction:
        'Ensure tender cites IS 9079: 2018 with Amendment 1 rather than the superseded 2002 edition.',
    },
    standardsGraph: {
      nodes: [
        { id: 'is-9079', label: 'IS 9079: 2018', title: 'Monobloc Clear Water Pumps', group: 'primary' },
        { id: 'is-996', label: 'IS 996: 2009', title: 'Induction Driving Motors', group: 'safety' },
        { id: 'is-11346', label: 'IS 11346: 2002', title: 'Hydraulic Acceptance Tests', group: 'testing' },
        { id: 'is-12063', label: 'IS 12063: 1987', title: 'IP55 Enclosure Protection', group: 'testing' },
        { id: 'qco-pumps', label: 'Heavy Industries QCO', title: 'Compulsory Scheme-I ISI Mark', group: 'certification' },
      ],
      edges: [
        { from: 'is-9079', to: 'is-996', label: 'Requires (Motor Section)', dashed: false },
        { from: 'is-9079', to: 'is-11346', label: 'Tested By (Acceptance)', dashed: false },
        { from: 'is-9079', to: 'is-12063', label: 'Tested By (IP55)', dashed: false },
        { from: 'is-9079', to: 'qco-pumps', label: 'Mandatory QCO', dashed: false },
      ],
    },
    generatedTenderClause: '',
    matchConfidence: 96,
    confidenceLevel: 'High',
    isNoMatch: false,
    evidence: {
      whyApplies:
        'Direct scope match: IS 9079 specifies requirements for centrifugal monobloc pumps driven by electric motors, handling clear, cold water for agricultural, irrigation, and municipal applications.',
      officialSourceUrl: 'https://standards.bis.gov.in/item/is-9079-2018',
      lastVerifiedDate: '2024-09-01',
      uncertaintyFlags: [
        'If pumping water with sand or suspended silt from open tubewells, verify whether open-impeller submersible pumps under IS 14220 should be procured instead.',
      ],
      scopeExtract:
        'Clause 1: This standard covers centrifugal monobloc pumpsets driven by single-phase or three-phase electric motors for clear, cold water.',
    },
    clarifyingQuestions: [],
    outdatedStandardAlert: undefined,
  },
};

export const ALL_PROCUREMENT_SCENARIOS: ProcurementScenario[] = [
  SCENARIO_LED,
  SCENARIO_CEMENT,
  SCENARIO_CABLES,
  SCENARIO_HELMETS,
  SCENARIO_PUMPS,
];

export function getScenarioById(id: string): ProcurementScenario | undefined {
  return ALL_PROCUREMENT_SCENARIOS.find((s) => s.id === id);
}

export function findMatchingScenario(text: string): ProcurementScenario | undefined {
  const lower = text.toLowerCase();
  if (lower.includes('street light') || lower.includes('street lighting') || (lower.includes('led') && lower.includes('road'))) {
    return SCENARIO_LED;
  }
  if (lower.includes('cement') || lower.includes('opc') || lower.includes('portland cement')) {
    return SCENARIO_CEMENT;
  }
  if (lower.includes('cable') || lower.includes('wire') || lower.includes('xlpe')) {
    return SCENARIO_CABLES;
  }
  if (lower.includes('helmet') || lower.includes('hard hat') || lower.includes('head protection')) {
    return SCENARIO_HELMETS;
  }
  if (lower.includes('pump') || lower.includes('monobloc') || lower.includes('water pump')) {
    return SCENARIO_PUMPS;
  }
  return undefined;
}
