import { IndianStandard } from '../types/standards';
import { ExtractedRequirement, SpecificationGap } from '../types/procurement';

export function analyzeSpecificationGaps(
  requirement: ExtractedRequirement,
  primaryStandard: IndianStandard
): SpecificationGap[] {
  const gaps: SpecificationGap[] = [];
  const rawText = requirement.rawQuery.toLowerCase();

  // Inspect standard's commonMissingSpecs
  for (const item of primaryStandard.commonMissingSpecs) {
    const paramKey = item.parameter.toLowerCase();

    // Check if user's text already covers this parameter
    let covered = false;

    if (paramKey.includes('surge') && (rawText.includes('surge') || rawText.includes('10kv') || rawText.includes('spd'))) {
      covered = true;
    } else if (paramKey.includes('thd') && (rawText.includes('thd') || rawText.includes('harmonic'))) {
      covered = true;
    } else if (paramKey.includes('driver') && (rawText.includes('driver') || rawText.includes('controlgear') || rawText.includes('15885'))) {
      covered = true;
    } else if (paramKey.includes('cct') && (rawText.includes('cct') || rawText.includes('kelvin') || rawText.includes('cri') || rawText.includes('color'))) {
      covered = true;
    } else if (paramKey.includes('ip') && (rawText.includes('ip65') || rawText.includes('ip66') || rawText.includes('ip67') || rawText.includes('ingress'))) {
      covered = true;
    } else if (paramKey.includes('loss level') && (rawText.includes('loss') || rawText.includes('level 2') || rawText.includes('level 1') || rawText.includes('star'))) {
      covered = true;
    } else if (paramKey.includes('short-circuit') && (rawText.includes('short circuit') || rawText.includes('cpri') || rawText.includes('erda'))) {
      covered = true;
    } else if (paramKey.includes('winding') && (rawText.includes('copper') || rawText.includes('aluminum') || rawText.includes('winding'))) {
      covered = true;
    } else if (paramKey.includes('temperature') && (rawText.includes('temperature') || rawText.includes('temp rise') || rawText.includes('deg c'))) {
      covered = true;
    } else if (paramKey.includes('almm') && (rawText.includes('almm') || rawText.includes('approved list'))) {
      covered = true;
    } else if (paramKey.includes('head') && (rawText.includes('head') || rawText.includes('discharge') || rawText.includes('lpm') || rawText.includes('flow'))) {
      covered = true;
    } else if (paramKey.includes('load') && (rawText.includes('load') || rawText.includes('kg') || rawText.includes('capacity') || rawText.includes('weight'))) {
      covered = true;
    } else if (paramKey.includes('stqc') && (rawText.includes('stqc') || rawText.includes('cyber') || rawText.includes('trusted'))) {
      covered = true;
    } else if (paramKey.includes('earthquake') && (rawText.includes('500d') || rawText.includes('550d') || rawText.includes('ductility'))) {
      covered = true;
    }

    if (!covered) {
      gaps.push({
        id: `gap-${Math.random().toString(36).substring(2, 9)}`,
        parameter: item.parameter,
        suggestedClause: item.suggestedClause,
        whyImportant: item.whyImportant,
        severity: item.severity,
        standardReference: primaryStandard.isNumber,
        isResolved: false,
      });
    }
  }

  // Also check standard technical benchmarks
  if (!requirement.lifetime && primaryStandard.technicalRequirements.some((t) => t.parameter.toLowerCase().includes('life'))) {
    gaps.push({
      id: `gap-lifetime-${Math.random().toString(36).substring(2, 7)}`,
      parameter: 'Guaranteed Operating Lifetime & L70/B50 Criteria',
      suggestedClause: 'The product shall have a certified burning lifetime of minimum 50,000 hours with L70 lumen maintenance.',
      whyImportant: 'Guarantees durability and prevents early equipment failure before capital payback.',
      severity: 'Medium',
      standardReference: primaryStandard.isNumber,
      isResolved: false,
    });
  }

  if (!requirement.operatingTemp && primaryStandard.domain.includes('Lighting')) {
    gaps.push({
      id: `gap-temp-${Math.random().toString(36).substring(2, 7)}`,
      parameter: 'Operating Ambient Temperature Range',
      suggestedClause: 'Equipment shall operate satisfactorily in ambient temperatures ranging from -10 deg C to +50 deg C with relative humidity up to 95%.',
      whyImportant: 'Indian outdoor climates experience extreme summer heat; unrated electronics degrade rapidly.',
      severity: 'Low',
      standardReference: primaryStandard.isNumber,
      isResolved: false,
    });
  }

  return gaps;
}
