import { IndianStandard, StandardRelationship } from './standards';

export interface ExtractedRequirement {
  product: string;
  application: string;
  domain: string;
  rawQuery: string;
  detectedLanguage: string;
  power?: string;
  voltage?: string;
  protectionRating?: string; // e.g. IP66
  efficiency?: string;
  lifetime?: string;
  capacity?: string;
  material?: string;
  operatingTemp?: string;
  safetyFeatures?: string[];
  testRequirements?: string[];
  otherSpecs: Record<string, string>;
}

export interface SpecificationGap {
  id: string;
  parameter: string;
  suggestedClause: string;
  whyImportant: string;
  severity: 'High' | 'Medium' | 'Low';
  standardReference: string;
  isResolved: boolean;
}

export interface CandidateStandardMatch {
  standard: IndianStandard;
  score: number;
  matchReasons: string[];
  parameterMatches: string[];
  normativeRelations: StandardRelationship[];
  isPrimary: boolean;
}

export interface ClarifyingOption {
  label: string;
  value: string;
  description?: string;
  targetStandardNumber?: string;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  parameterKey: string;
  whyNeeded: string;
  options: ClarifyingOption[];
}

export interface TenderProductItem {
  id: string;
  itemNumber: number;
  productName: string;
  quantity?: string;
  rawSnippet: string;
  estimatedCategory: string;
}

export interface OutdatedStandardAlert {
  isOutdated: boolean;
  citedStandard: string;
  currentReplacement: string;
  replacementTitle: string;
  effectiveSince: string;
  actionRequired: string;
}

export interface RecommendationEvidence {
  whyApplies: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
  uncertaintyFlags: string[];
  scopeExtract: string;
}

export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'No_Reliable_Match';

export interface RecommendationResult {
  extractedRequirement: ExtractedRequirement;
  primaryStandard: IndianStandard | null;
  relatedStandards: CandidateStandardMatch[];
  specificationGaps: SpecificationGap[];
  explanation: {
    rationale: string;
    productMatchSummary: string;
    regulatorySummary: string;
    versionAction: string;
  };
  standardsGraph: {
    nodes: {
      id: string;
      label: string;
      title: string;
      group: 'primary' | 'safety' | 'testing' | 'allied' | 'amendment' | 'certification';
      status?: string;
    }[];
    edges: {
      from: string;
      to: string;
      label: string;
      type?: string;
      dashed?: boolean;
    }[];
  };
  generatedTenderClause: string;
  // Enhanced accuracy fields
  matchConfidence: number; // 0 to 100
  confidenceLevel: ConfidenceLevel;
  isNoMatch: boolean;
  noMatchExplanation?: string;
  clarifyingQuestions?: ClarifyingQuestion[];
  outdatedStandardAlert?: OutdatedStandardAlert;
  evidence?: RecommendationEvidence;
  tenderItemsDetected?: TenderProductItem[];
  selectedItemIndex?: number;
}

export interface SavedTenderProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  extractedRequirement: ExtractedRequirement;
  primaryStandardNumber: string;
  primaryStandardTitle?: string;
  resolvedGaps: string[];
  customNotes?: string;
  mockResult?: RecommendationResult;
  sampleQuery?: string;
  shortDesc?: string;
  category?: string;
  metrics?: {
    requirementsIdentified: number;
    relatedStandards: number;
    potentialGaps: number;
  };
}
