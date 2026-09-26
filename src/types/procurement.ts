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

export interface RecommendationResult {
  extractedRequirement: ExtractedRequirement;
  primaryStandard: IndianStandard;
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
      status: string;
    }[];
    edges: {
      from: string;
      to: string;
      label: string;
      type: string;
    }[];
  };
  generatedTenderClause: string;
}

export interface SavedTenderProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  extractedRequirement: ExtractedRequirement;
  primaryStandardNumber: string;
  primaryStandardTitle: string;
  resolvedGaps: string[];
  customNotes?: string;
}
