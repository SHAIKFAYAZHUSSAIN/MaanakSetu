export type RelationshipType =
  | 'REFERENCES'
  | 'TESTED_BY'
  | 'REQUIRES'
  | 'AMENDED_BY'
  | 'REVISED_TO'
  | 'RELATED_TO'
  | 'SAFETY_REQUIREMENT'
  | 'TERMINOLOGY'
  | 'INSTALLATION'
  | 'CERTIFICATION';

export type CertificationScheme =
  | 'Scheme-I (ISI Mark)'
  | 'Scheme-II (CRS - Compulsory Registration Scheme)'
  | 'Scheme-IV'
  | 'Scheme-X'
  | 'Voluntary'
  | 'Not Applicable';

export type StandardStatus = 'Current' | 'Superseded' | 'Under Revision' | 'Withdrawn';

export interface Amendment {
  number: number;
  year: number;
  summary: string;
  effectiveDate: string;
}

export interface VersionChain {
  currentStandard: string;
  currentYear: number;
  supersededStandard?: string;
  supersededYear?: number;
  amendments: Amendment[];
  revisionNotes?: string;
}

export interface StandardRelationship {
  targetStandardNumber: string;
  targetTitle: string;
  relationshipType: RelationshipType;
  description: string;
  criticality: 'Mandatory' | 'Recommended' | 'Informational';
}

export interface QCOInfo {
  isCompulsory: boolean;
  orderName: string;
  gazetteNotification: string;
  ministry: string;
  effectiveDate: string;
  scheme: CertificationScheme;
  description: string;
  enforcementStatus: 'In Force' | 'Enforced Soon' | 'Under Consultation' | 'Voluntary';
  penaltiesClause?: string;
}

export interface StandardRequirementItem {
  parameter: string;
  benchmark: string;
  testMethodStandard?: string;
  mandatory: boolean;
}

export interface IndianStandard {
  id: string;
  isNumber: string;
  title: string;
  department: string; // e.g. ETD (Electrotechnical), MED (Mechanical), CED (Civil)
  domain: string; // e.g. "Lighting & Luminaires", "Solar & Renewable", "Power Distribution"
  productCategory: string;
  scope: string;
  status: StandardStatus;
  versionChain: VersionChain;
  qco: QCOInfo;
  keywords: string[];
  relationships: StandardRelationship[];
  technicalRequirements: StandardRequirementItem[];
  commonMissingSpecs: {
    parameter: string;
    suggestedClause: string;
    whyImportant: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
  testingLaboratoriesAvailable: number;
  schemesOfTesting: string;
}
