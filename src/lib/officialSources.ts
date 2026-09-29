/**
 * Official Source Links and Provenance Module
 * 
 * Strict traceability and safety registry for Bureau of Indian Standards (BIS)
 * and Government of India regulatory portals.
 * 
 * ZERO INVENTED URLS. Only verified official domains:
 * - bis.gov.in
 * - standards.bis.gov.in
 * - manakonline.in
 * - crsbis.in
 * - gem.gov.in
 */

export interface OfficialPortal {
  id: string;
  name: string;
  label: string;
  url: string;
  domain: string;
  purpose: string;
  isPrimaryForStandards?: boolean;
  requiresCondition?: 'crs_only' | 'compulsory_only' | 'procurement_context';
}

/**
 * 9 Verified Official Portals
 */
export const OFFICIAL_PORTALS: Record<string, OfficialPortal> = {
  // 1. BIS — Bureau of Indian Standards
  BIS_MAIN: {
    id: 'bis_main',
    name: 'Bureau of Indian Standards',
    label: 'BIS Official Portal',
    url: 'https://www.bis.gov.in/',
    domain: 'bis.gov.in',
    purpose: 'Official BIS information, certification, standards and regulatory information.',
  },

  // 2. BIS Standards Portal — Know Your Standards (PRIMARY for IS standards)
  BIS_STANDARDS_PORTAL: {
    id: 'bis_standards_portal',
    name: 'BIS Standards Portal — Know Your Standards',
    label: 'BIS Standards Portal — Verify Standard',
    url: 'https://standards.bis.gov.in/',
    domain: 'standards.bis.gov.in',
    purpose: 'Search Indian Standards by number or keyword and verify standard information. Primary source link for standard recommendations.',
    isPrimaryForStandards: true,
  },

  // 3. BIS Published Standards
  BIS_PUBLISHED_STANDARDS: {
    id: 'bis_published_standards',
    name: 'BIS Published Standards Register',
    label: 'BIS Published Standards',
    url: 'https://standards.bis.gov.in/website/published-standards/published-standards-list',
    domain: 'standards.bis.gov.in',
    purpose: 'Verify publication and current standards information.',
  },

  // 4. BIS Products Under Compulsory Certification (QCOs)
  BIS_COMPULSORY_CERTIFICATION: {
    id: 'bis_compulsory_certification',
    name: 'BIS Compulsory Certification & Quality Control Orders',
    label: 'BIS Compulsory Certification / QCO Information',
    url: 'https://www.bis.gov.in/product-certification/products-under-compulsory-certification/',
    domain: 'bis.gov.in',
    purpose: 'Verify whether a product falls under compulsory certification requirements.',
    requiresCondition: 'compulsory_only',
  },

  // 5. BIS Product Certification Process
  BIS_CERTIFICATION_PROCESS: {
    id: 'bis_certification_process',
    name: 'BIS Product Certification Process & Conformity Assessment',
    label: 'BIS Product Certification Process',
    url: 'https://www.bis.gov.in/product-certification/product-certification-process/',
    domain: 'bis.gov.in',
    purpose: 'Official certification process and conformity-assessment information.',
  },

  // 6. BIS e-BIS / Manakonline
  BIS_EBIS: {
    id: 'bis_ebis',
    name: 'BIS e-BIS / Manakonline Stakeholder Portal',
    label: 'BIS e-BIS Portal',
    url: 'https://www.manakonline.in/',
    domain: 'manakonline.in',
    purpose: 'Official BIS stakeholder and online service portal.',
  },

  // 7. BIS CARE
  BIS_CARE: {
    id: 'bis_care',
    name: 'BIS CARE — Verification & Consumer Safety',
    label: 'BIS CARE — Verification & Consumer Safety',
    url: 'https://www.bis.gov.in/bis-apps/',
    domain: 'bis.gov.in',
    purpose: 'Official BIS information about verification of licence/registration details, standards and complaints.',
  },

  // 8. BIS Compulsory Registration Scheme (CRS)
  BIS_CRS: {
    id: 'bis_crs',
    name: 'BIS Compulsory Registration Scheme (CRS)',
    label: 'BIS CRS Portal',
    url: 'https://www.crsbis.in/',
    domain: 'crsbis.in',
    purpose: 'Official Compulsory Registration Scheme portal for electronics and IT goods.',
    requiresCondition: 'crs_only',
  },

  // 9. Government e-Marketplace (GeM)
  GEM_PORTAL: {
    id: 'gem_portal',
    name: 'Government e-Marketplace',
    label: 'Government e-Marketplace (GeM)',
    url: 'https://gem.gov.in/',
    domain: 'gem.gov.in',
    purpose: 'Official government procurement marketplace context reference.',
    requiresCondition: 'procurement_context',
  },
};

/**
 * Approved Official Domains
 */
export const ALLOWED_OFFICIAL_DOMAINS = [
  'bis.gov.in',
  'standards.bis.gov.in',
  'manakonline.in',
  'crsbis.in',
  'gem.gov.in',
] as const;

/**
 * Validates whether a URL strictly belongs to an approved official domain.
 */
export function isOfficialDomain(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_OFFICIAL_DOMAINS.some(
      (allowed) => host === allowed || host.endsWith('.' + allowed)
    );
  } catch {
    return false;
  }
}

/**
 * Resolves a safe, verified official URL for a standard.
 * If the provided URL is not within approved domains, falls back to the BIS Standards Portal.
 */
export function resolveOfficialStandardUrl(standardNumber: string, candidateUrl?: string): string {
  if (candidateUrl && isOfficialDomain(candidateUrl)) {
    return candidateUrl;
  }
  // Safe default: BIS Standards Portal primary entry
  return OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url;
}

/**
 * Source Classification Categories
 */
export type SourceClassification = 'OFFICIAL' | 'DEMO KNOWLEDGE BASE' | 'REQUIRES VERIFICATION';

export interface SourceProvenance {
  sourceName: string;
  sourceUrl: string;
  classification: SourceClassification;
  statusText: string;
  lastVerifiedText: string;
}

/**
 * Standard Security / Trust Notice
 */
export const SECURITY_TRUST_NOTICE =
  'ManakSetu provides standards intelligence and procurement decision support. Official BIS and regulatory sources should be consulted for final verification before procurement issuance.';

/**
 * Honest Verification Status Text (Do not display fake dates)
 */
export const LIVE_VERIFICATION_REQUIRED_TEXT = 'Official source available — live verification required';

/**
 * Returns provenance information for a standard
 */
export function getStandardProvenance(
  standardNumber: string,
  officialSourceUrl?: string
): SourceProvenance {
  const verifiedUrl = resolveOfficialStandardUrl(standardNumber, officialSourceUrl);

  return {
    sourceName: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.label,
    sourceUrl: verifiedUrl,
    classification: 'OFFICIAL',
    statusText: 'OFFICIAL SOURCE',
    lastVerifiedText: LIVE_VERIFICATION_REQUIRED_TEXT,
  };
}

/**
 * Returns provenance for demonstration knowledge base records
 */
export function getDemoKnowledgeBaseProvenance(): SourceProvenance {
  return {
    sourceName: 'ManakSetu Demonstration Knowledge Base',
    sourceUrl: OFFICIAL_PORTALS.BIS_STANDARDS_PORTAL.url,
    classification: 'DEMO KNOWLEDGE BASE',
    statusText: 'REQUIRES OFFICIAL VERIFICATION',
    lastVerifiedText: LIVE_VERIFICATION_REQUIRED_TEXT,
  };
}
