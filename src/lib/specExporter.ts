import { RecommendationResult } from '../types/procurement';
import { SupportedLanguage } from '../types/language';

export function buildOfficialTenderSpecificationClause(
  result: RecommendationResult,
  additionalClauses: string[] = [],
  language: SupportedLanguage = 'en'
): string {
  const { extractedRequirement, primaryStandard, relatedStandards, specificationGaps } = result;

  const now = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (!primaryStandard) {
    if (language === 'hi') {
      return `================================================================================
भारत सरकार / सार्वजनिक क्षेत्र खरीद सूचना (GOVERNMENT OF INDIA PROCUREMENT NOTICE)
मानकसेतु (MaanakSetu) - बीआईएस स्मार्टस्पेक एआई इंजन द्वारा तैयार | दिनांक: ${now}
================================================================================

निविदा मद (TENDER ITEM): ${extractedRequirement.product.toUpperCase()}
स्थिति: कोई अनिवार्य भारतीय मानक चिन्हित नहीं हुआ
मानकसेतु सुरक्षा प्रणाली ने इस आवश्यकता को किसी असंबद्ध मानक से जोड़ने से रोक दिया।
कृपया जांचें कि क्या यह मद राज्य विशिष्ट पीडब्ल्यूडी विनिर्देशों द्वारा शासित है अथवा तकनीकी वर्गीकरण हेतु बीआईएस मानकीकरण निदेशालय से संपर्क करें।`;
    }

    if (language === 'te') {
      return `================================================================================
భారత ప్రభుత్వం / పబ్లిక్ సెక్టార్ సేకరణ నోటీసు (GOVERNMENT OF INDIA PROCUREMENT NOTICE)
మానక్ సేతు (MaanakSetu) - బీఐఎస్ స్మార్ట్‌స్పెక్ ఏఐ ఇంజిన్ | తేదీ: ${now}
================================================================================

టెండర్ అంశం (TENDER ITEM): ${extractedRequirement.product.toUpperCase()}
స్థితి: నిర్దిష్ట భారతీయ ప్రమాణం గుర్తించబడలేదు
ఈ అవసరానికి సరిపోలని ప్రమాణాలను కేటాయించకుండా భద్రతా నిబంధనలు నిరోధించాయి.
దయచేసి సాంకేతిక వర్గీకరణ కొరకు సంబంధిత శాఖను లేదా బీఐఎస్ కార్యాలయాన్ని సంప్రదించండి.`;
    }

    if (language === 'ta') {
      return `================================================================================
இந்திய அரசு / பொதுத்துறை கொள்முதல் அறிவிப்பு (GOVERNMENT OF INDIA PROCUREMENT NOTICE)
மானக் சேது (MaanakSetu) - BIS ஸ்மார்ட்ஸ்பெக் AI இயந்திரம் | தேதி: ${now}
================================================================================

டெண்டர் பொருள் (TENDER ITEM): ${extractedRequirement.product.toUpperCase()}
நிலை: கட்டாய இந்தியத் தரநிலை எதுவும் அடையாளம் காணப்படவில்லை
பொருந்தாத தரநிலையை இணைப்பதைத் தடுக்க பாதுகாப்பு விதிகள் செயல்படுத்தப்பட்டுள்ளன.
தயவுசெய்து தொழில்நுட்ப வகைப்பாட்டிற்கு BIS தரநிலைப்படுத்தல் இயக்குநரகத்தைத் தொடர்பு கொள்ளவும்.`;
    }

    return `================================================================================
GOVERNMENT OF INDIA / PUBLIC SECTOR PROCUREMENT NOTICE
Generated via MaanakSetu - BIS SmartSpec AI Engine | Date: ${now}
================================================================================

TENDER ITEM: ${extractedRequirement.product.toUpperCase()}
STATUS: NO MANDATORY INDIAN STANDARD IDENTIFIED
MaanakSetu guardrails prevented defaulting this requirement to an unrelated standard.
Please verify whether this item is governed by state-specific PWD specifications or contact the BIS Standardization Directorate for technical classification.`;
  }

  const resolvedGapClausesHi = specificationGaps
    .filter((g) => g.isResolved)
    .map((g) => `   - [हल किया गया विनिर्देश अंतर] ${g.parameter}: ${g.suggestedClause}`)
    .join('\n');

  const resolvedGapClausesTe = specificationGaps
    .filter((g) => g.isResolved)
    .map((g) => `   - [పరిష్కరించిన లోపం] ${g.parameter}: ${g.suggestedClause}`)
    .join('\n');

  const resolvedGapClausesTa = specificationGaps
    .filter((g) => g.isResolved)
    .map((g) => `   - [சரிசெய்யப்பட்ட இடைவெளி] ${g.parameter}: ${g.suggestedClause}`)
    .join('\n');

  const resolvedGapClausesEn = specificationGaps
    .filter((g) => g.isResolved)
    .map((g) => `   - [SPEC GAP RESOLVED] ${g.parameter}: ${g.suggestedClause}`)
    .join('\n');

  const relatedCitations = relatedStandards
    .map((r, i) => `   2.${i + 1} ${r.standard.isNumber} - ${r.standard.title}`)
    .join('\n');

  // HINDI REPORT
  if (language === 'hi') {
    return `================================================================================
भारत सरकार / सार्वजनिक क्षेत्र खरीद विनिर्देश खंड (GOVERNMENT OF INDIA PROCUREMENT SPECIFICATION)
मानकसेतु (MaanakSetu) - बीआईएस स्मार्टस्पेक एआई इंजन द्वारा तैयार | दिनांक: ${now}
================================================================================

निविदा मद (TENDER ITEM): ${extractedRequirement.product.toUpperCase()}
प्रयोजन / उपयोग (APPLICATION): ${extractedRequirement.application}
प्राथमिक लागू बीआईएस मानक (PRIMARY BIS STANDARD): ${primaryStandard.isNumber}

1. अनिवार्य लागू भारतीय मानक (MANDATORY APPLICABLE INDIAN STANDARDS):
   1.1 आपूर्ति की गई सामग्री पूर्णतः लागू संशोधनों सहित ${primaryStandard.isNumber} के नवीनतम संस्करण के अनुरूप होनी चाहिए 
       (सक्रिय संशोधन: ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'शून्य / Nil'})।
   1.2 किसी भी परिस्थिति में पुराने अथवा निरस्त मानकों (Superseded Standards) के तहत आपूर्ति स्वीकार नहीं की जाएगी।

2. मानकीय एवं संबद्ध संदर्भ मानक (NORMATIVE & ALLIED SUBSYSTEM STANDARDS):
${relatedCitations || '   (कोई अतिरिक्त मानक निर्दिष्ट नहीं)'}

3. गुणवत्ता नियंत्रण आदेश (QCO) एवं वैधानिक प्रमाणन खंड (STATUTORY CERTIFICATION):
   3.1 प्रमाणन स्थिति: ${primaryStandard.qco.isCompulsory ? 'अनिवार्य वैधानिक आवश्यकता (COMPULSORY STATUTORY REQUIREMENT)' : 'मानक विनिर्देश (VOLUNTARY SPECIFICATION)'}
   3.2 प्रमाणन योजना: ${primaryStandard.qco.scheme}
   3.3 विनियामक आदेश: ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification})
   3.4 अनिवार्य शर्त: निविदा खुलने की तिथि पर बोलीदाता के पास वैध बीआईएस लाइसेंस (ISI Mark) / सीआरएस पंजीकरण संख्या होना अनिवार्य है।
       बिना वैध बीआईएस प्रमाण पत्र वाली बोलियों को तकनीकी मूल्यांकन के दौरान सीधे निरस्त कर दिया जाएगा।

4. तकनीकी विनिर्देश एवं मापदंड (TECHNICAL BENCHMARKS & SPECIFICATIONS):
   - निर्धारित क्षमता / शक्ति (Rated Power / Capacity): ${extractedRequirement.power || extractedRequirement.capacity || 'मात्राओं की अनुसूची के अनुसार'}
   - आपूर्ति वोल्टेज (Nominal Voltage & Supply): ${extractedRequirement.voltage || '230 V AC, 50 Hz'}
   - पर्यावरण सुरक्षा रेटिंग (Protection Rating): ${extractedRequirement.protectionRating || 'IS 12063 के अनुसार न्यूनतम IP66'}
   - जीवनकाल एवं सहनशीलता (Lifetime & Endurance): ${extractedRequirement.lifetime || 'न्यूनतम 50,000 कार्य घंटे'}
${resolvedGapClausesHi ? `\n${resolvedGapClausesHi}` : ''}
${additionalClauses.length > 0 ? `\n\nअतिरिक्त निविदा शर्तें:\n${additionalClauses.map((c, i) => `   4.${i + 1} ${c}`).join('\n')}` : ''}

5. परीक्षण, निरीक्षण एवं स्वीकृति व्यवस्था (TESTING, INSPECTION & ACCEPTANCE):
   5.1 निर्माता को बीआईएस-अनुमोदित या एनएबीएल-मान्यता प्राप्त प्रयोगशाला से पिछले 3 वर्षों के भीतर जारी वैध टाइप टेस्ट प्रमाण पत्र प्रस्तुत करना होगा।
   5.2 परीक्षण और निरीक्षण योजना (STI): आपूर्तिकर्ता को ${primaryStandard.schemesOfTesting} का पूर्णतः पालन करना होगा।
   5.3 प्रेषण-पूर्व निरीक्षण (PDI) क्रेता अथवा अधिकृत तृतीय-पक्ष निरीक्षण एजेंसी (RITES / EIL / BIS) द्वारा किया जा सकता है।

================================================================================
GeM कस्टम पैरामीटर / तकनीकी आवश्यकताओं की अनुसूची (STR) में सीधे उपयोग हेतु तैयार।
================================================================================`;
  }

  // TELUGU REPORT
  if (language === 'te') {
    return `================================================================================
భారత ప్రభుత్వం / పబ్లిక్ సెక్టార్ సేకరణ సాంకేతిక నిబంధనలు (GOVERNMENT OF INDIA PROCUREMENT)
మానక్ సేతు (MaanakSetu) - బీఐఎస్ స్మార్ట్‌స్పెక్ ఏఐ ఇంజిన్ | తేదీ: ${now}
================================================================================

టెండర్ అంశం (TENDER ITEM): ${extractedRequirement.product.toUpperCase()}
వినియోగం (APPLICATION): ${extractedRequirement.application}
ప్రధాన భారతీయ ప్రమాణం (PRIMARY BIS STANDARD): ${primaryStandard.isNumber}

1. తప్పనిసరి వర్తించే భారతీయ ప్రమాణాలు:
   1.1 సరఫరా చేయబడే వస్తువులు అన్ని సవరణలతో కూడిన ${primaryStandard.isNumber} తాజా వెర్షన్‌కు అనుగుణంగా ఉండాలి 
       (సవరణలు: ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'ఏమీ లేవు'}).
   1.2 పాతబడిన లేదా రద్దు చేయబడిన ప్రమాణాల కింద సరఫరా ఏ పరిస్థితుల్లోనూ ఆమోదించబడదు.

2. అనుబంధ మరియు పరీక్షా ప్రమాణాలు:
${relatedCitations || '   (నిర్దిష్ట వివరాలు లేవు)'}

3. క్వాలిటీ కంట్రోల్ ఆర్డర్ (QCO) మరియు చట్టబద్ధమైన ధృవీకరణ:
   3.1 సర్టిఫికేషన్ స్థితి: ${primaryStandard.qco.isCompulsory ? 'తప్పనిసరి చట్టబద్ధ నిబంధన (COMPULSORY)' : 'స్వచ్ఛంద ప్రమాణం (VOLUNTARY)'}
   3.2 స్కీమ్: ${primaryStandard.qco.scheme}
   3.3 ఆర్డర్ వివరాలు: ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification})
   3.4 నిబంధన: టెండర్ తెరిచే తేదీ నాటికి బిడ్డర్లు చెల్లుబాటు అయ్యే బీఐఎస్ లైసెన్స్ / రిజిస్ట్రేషన్ కలిగి ఉండాలి.

4. సాంకేతిక స్పెసిఫికేషన్లు & పారామితులు:
   - సామర్థ్యం (Rated Power/Capacity): ${extractedRequirement.power || extractedRequirement.capacity || 'షెడ్యూల్ ప్రకారం'}
   - సరఫరా వోల్టేజ్ (Supply Voltage): ${extractedRequirement.voltage || '230 V AC, 50 Hz'}
   - ప్రొటెక్షన్ రేటింగ్ (Protection Rating): ${extractedRequirement.protectionRating || 'కనీసం IP66 (IS 12063)'}
   - జీవితకాలం (Lifetime): ${extractedRequirement.lifetime || 'కనీసం 50,000 పని గంటలు'}
${resolvedGapClausesTe ? `\n${resolvedGapClausesTe}` : ''}

5. పరీక్ష మరియు నాణ్యత తనిఖీ వ్యవస్థ:
   5.1 గత 3 సంవత్సరాలలో అధీకృత ల్యాబ్ నుండి పొందిన టైప్ టెస్ట్ సర్టిఫికెట్లను సమర్పించాలి.
   5.2 టెస్టింగ్ మరియు ఇన్‌స్పెక్షన్ స్కీమ్ (STI): ${primaryStandard.schemesOfTesting} ఖచ్చితంగా పాటించాలి.

================================================================================
GeM పోర్టల్ కస్టమ్ పారామీటర్లలో ఉపయోగించడానికి రూపొందించబడింది.
================================================================================`;
  }

  // TAMIL REPORT
  if (language === 'ta') {
    return `================================================================================
இந்திய அரசு / பொதுத்துறை கொள்முதல் விவரக்குறிப்பு விதி (GOVERNMENT OF INDIA PROCUREMENT)
மானக் சேது (MaanakSetu) - BIS ஸ்மார்ட்ஸ்பெக் AI இயந்திரம் | தேதி: ${now}
================================================================================

டெண்டர் பொருள் (TENDER ITEM): ${extractedRequirement.product.toUpperCase()}
பயன்பாடு (APPLICATION): ${extractedRequirement.application}
முதன்மை BIS தரநிலை (PRIMARY BIS STANDARD): ${primaryStandard.isNumber}

1. கட்டாய இந்தியத் தரநிலைகள்:
   1.1 விநியோகிக்கப்படும் பொருட்கள் அனைத்தும் ${primaryStandard.isNumber} தரநிலையின் சமீபத்திய பதிப்பிற்கு இணங்க வேண்டும்
       (செயலில் உள்ள திருத்தங்கள்: ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'இல்லை'}).
   1.2 காலாவதியான அல்லது மாற்றப்பட்ட தரநிலைகள் எக்காரணம் கொண்டும் ஏற்றுக்கொள்ளப்படாது.

2. தொடர்புடைய மற்றும் துணை தரநிலைகள்:
${relatedCitations || '   (குறிப்பிடப்படவில்லை)'}

3. தரக் கட்டுப்பாட்டு ஆணை (QCO) மற்றும் சட்டப்பூர்வ சான்றிதழ்:
   3.1 சான்றிதழ் நிலை: ${primaryStandard.qco.isCompulsory ? 'கட்டாய சட்டப்பூர்வ தேவை (COMPULSORY)' : 'விருப்பத் தரநிலை (VOLUNTARY)'}
   3.2 திட்டம்: ${primaryStandard.qco.scheme}
   3.3 ஒழுங்குமுறை ஆணை: ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification})
   3.4 கட்டாய விதி: டெண்டர் திறக்கும் தேதியில் ஏலதாரர்கள் செல்லுபடியாகும் BIS உரிமம் வைத்திருக்க வேண்டும்.

4. தொழில்நுட்ப விவரக்குறிப்புகள்:
   - மதிப்பிடப்பட்ட திறன் (Power / Capacity): ${extractedRequirement.power || extractedRequirement.capacity || 'அட்டவணைப்படி'}
   - மின்னழுத்தம் (Supply Voltage): ${extractedRequirement.voltage || '230 V AC, 50 Hz'}
   - பாதுகாப்பு மதிப்பீடு (Protection Rating): ${extractedRequirement.protectionRating || 'குறைந்தபட்சம் IP66'}
   - ஆயுட்காலம் (Lifetime): ${extractedRequirement.lifetime || 'குறைந்தபட்சம் 50,000 மணிநேரம்'}
${resolvedGapClausesTa ? `\n${resolvedGapClausesTa}` : ''}

5. சோதனை மற்றும் ஆய்வு நடைமுறைகள்:
   5.1 அங்கீகரிக்கப்பட்ட ஆய்வகத்திலிருந்து கடந்த 3 ஆண்டுகளுக்குள் பெறப்பட்ட சோதனை சான்றிதழ்களை சமர்ப்பிக்க வேண்டும்.
   5.2 சோதனை மற்றும் ஆய்வுத் திட்டம் (STI): ${primaryStandard.schemesOfTesting} பின்பற்றப்பட வேண்டும்.

================================================================================
GeM மின்-கொள்முதல் தளத்தில் நேரடியாக பயன்படுத்த ஏற்றது.
================================================================================`;
  }

  // ENGLISH REPORT (DEFAULT)
  const customAdditions = additionalClauses.length > 0
    ? `\n\n4. ADDITIONAL PROCUREMENT STIPULATIONS:\n${additionalClauses.map((c, i) => `   4.${i + 1} ${c}`).join('\n')}`
    : '';

  return `================================================================================
GOVERNMENT OF INDIA / PUBLIC SECTOR PROCUREMENT SPECIFICATION CLAUSE
Generated via MaanakSetu - BIS SmartSpec AI Engine | Date: ${now}
================================================================================

TENDER ITEM: ${extractedRequirement.product.toUpperCase()}
APPLICATION: ${extractedRequirement.application}
PRIMARY BIS STANDARD: ${primaryStandard.isNumber}

1. MANDATORY APPLICABLE INDIAN STANDARDS:
   1.1 The supplied items shall strictly conform to the latest edition of ${primaryStandard.isNumber} 
       including all amendments in force (Amendment(s): ${primaryStandard.versionChain.amendments.map((a) => a.number).join(', ') || 'Nil'}).
   1.2 Legacy or superseded revisions of standards shall not be accepted under any circumstances.

2. NORMATIVE & ALLIED REFERENCE STANDARDS (MANDATORY SUBSYSTEM COMPLIANCE):
${relatedCitations || '   (None specified)'}

3. REGULATORY QUALITY CONTROL ORDER (QCO) & BIS CERTIFICATION CLAUSE:
   3.1 Certification Status: ${primaryStandard.qco.isCompulsory ? 'COMPULSORY STATUTORY REQUIREMENT' : 'VOLUNTARY / STANDARD SPECIFICATION'}
   3.2 Scheme: ${primaryStandard.qco.scheme}
   3.3 Regulatory Order: ${primaryStandard.qco.orderName} (${primaryStandard.qco.gazetteNotification})
   3.4 Mandatory Clause: Bidders must possess a valid BIS license / CRS registration number as of the 
       date of tender opening. Bids without verified BIS credentials shall be summarily rejected at the 
       technical evaluation stage without further clarification.

4. TECHNICAL BENCHMARKS & SPECIFICATION CLAUSES:
   - Rated Power / Capacity: ${extractedRequirement.power || extractedRequirement.capacity || 'As specified in schedule of quantities'}
   - Nominal Voltage & Supply: ${extractedRequirement.voltage || '230 V AC, 50 Hz'}
   - Environmental Enclosure Rating: ${extractedRequirement.protectionRating || 'IP66 minimum as per IS 12063'}
   - Lifetime & Endurance: ${extractedRequirement.lifetime || 'Minimum 50,000 burning hours'}
${resolvedGapClausesEn ? `\n${resolvedGapClausesEn}` : ''}
${customAdditions}

5. TESTING, INSPECTION & ACCEPTANCE REGIME:
   5.1 The manufacturer shall furnish authentic Type Test Certificates from a BIS-approved or 
       NABL-accredited test laboratory conducted within the preceding three (3) years.
   5.2 Scheme of Testing and Inspection (STI): Supplier must adhere to ${primaryStandard.schemesOfTesting}.
   5.3 Pre-dispatch inspection (PDI) may be conducted by the Buyer or an authorized third-party inspection agency (RITES / EIL / BIS).

================================================================================
Generated for insertion into GeM Custom Parameters / Schedule of Technical Requirements (STR).
================================================================================`;
}
