export type SupportedLanguage = 'en' | 'hi' | 'te' | 'ta';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  subTagline: string;
  searchPlaceholder: string;
  uploadTenderPrompt: string;
  analyzeButton: string;
  analyzingButton: string;
  sampleQueriesTitle: string;
  primaryStandardTitle: string;
  relatedStandardsTitle: string;
  standardsGraphTitle: string;
  certificationQCOTitle: string;
  gapAnalysisTitle: string;
  gapSubtitle: string;
  explainabilityTitle: string;
  exportClauseTitle: string;
  saveProjectButton: string;
  copyClauseButton: string;
  missingBadge: string;
  mandatoryBadge: string;
  currentStatus: string;
  amendmentsCount: string;
  qcoCompulsory: string;
  qcoVoluntary: string;

  // Additional App & Navigation Labels
  savedTenders: string;
  officerSession: string;
  publicViewMode: string;
  officerSignIn: string;
  logout: string;
  portalApi: string;
  bisPortal: string;

  // Section Headers
  section1Title: string;
  section2Title: string;
  section3Title: string;
  section4Title: string;
  section5Title: string;
  section6Title: string;

  // Tabs & Dashboard
  tabOverview: string;
  tabRequirements: string;
  tabStandard: string;
  tabCertification: string;
  tabRelated: string;
  tabGaps: string;
  tabClauses: string;
  dashboardSections: string;
  openDashboard: string;
  closeDashboard: string;

  // Report & Export
  downloadPdf: string;
  downloadTxt: string;
  copied: string;
  publicPreviewNotice: string;
  exportSubtitle: string;
  gemCompatible: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "MaanakSetu",
    tagline: "AI Indian Standards Recommendation & Procurement Compliance Engine",
    subTagline: "Bridging government tenders with authoritative BIS standards, normative graphs, and compulsory QCO certification orders.",
    searchPlaceholder: "Enter your procurement requirement (e.g., '1000 LED street lights, 90W, outdoor use, IP66, 50,000 hrs, surge protection') or upload tender doc...",
    uploadTenderPrompt: "Upload Tender PDF / DOCX or Paste Specification",
    analyzeButton: "Find Standards",
    analyzingButton: "Finding relevant standards...",
    sampleQueriesTitle: "Try an example",
    primaryStandardTitle: "Primary Applicable Standard",
    relatedStandardsTitle: "Allied & Normative Standards",
    standardsGraphTitle: "Interactive Standards Knowledge Graph",
    certificationQCOTitle: "Regulatory & Compulsory Certification Check",
    gapAnalysisTitle: "Specification Gap Analysis (Missing Requirements)",
    gapSubtitle: "Crucial technical benchmarks missing from tender specifications that could lead to procurement disputes or substandard supply.",
    explainabilityTitle: "Explainable AI Audit Trail",
    exportClauseTitle: "Generated Tender Specification Clause",
    saveProjectButton: "Save Tender Specification",
    copyClauseButton: "Copy Clause to Clipboard",
    missingBadge: "Missing in Tender",
    mandatoryBadge: "Mandatory BIS Requirement",
    currentStatus: "Current Version",
    amendmentsCount: "Active Amendments",
    qcoCompulsory: "Compulsory Certification (Mandatory QCO)",
    qcoVoluntary: "Voluntary Certification Scheme",

    savedTenders: "Saved Tenders",
    officerSession: "Officer Session",
    publicViewMode: "Public View Mode",
    officerSignIn: "Officer Sign In",
    logout: "Log out",
    portalApi: "Portal API",
    bisPortal: "BIS Portal",

    section1Title: "Review extracted procurement requirements",
    section2Title: "Match primary standard & evaluate QCO",
    section3Title: "Discover linked & allied standards",
    section4Title: "Resolve technical specification gaps",
    section5Title: "Review explainable AI audit trail",
    section6Title: "Review & export your draft",

    tabOverview: "Overview",
    tabRequirements: "1. Requirements",
    tabStandard: "2. Standard",
    tabCertification: "3. Certification",
    tabRelated: "4. Related",
    tabGaps: "5. Gaps",
    tabClauses: "6. Clauses",
    dashboardSections: "Sections Dashboard",
    openDashboard: "Open Dashboard",
    closeDashboard: "Close Dashboard",

    downloadPdf: "Download PDF",
    downloadTxt: ".txt",
    copied: "Copied!",
    publicPreviewNotice: "You can read and copy this draft clause. Formal document exports (PDF / TXT) and saving are restricted to Procurement Officers.",
    exportSubtitle: "Includes resolved specification gaps, QCO statutory citations, and STI testing protocols.",
    gemCompatible: "Compatible with GeM / CPPP e-Procurement Formats",
  },
  hi: {
    appName: "मानकसेतु",
    tagline: "एआई भारतीय मानक अनुशंसा एवं खरीद अनुपालन प्रणाली",
    subTagline: "सरकारी निविदाओं को आधिकारिक बीआईएस मानकों, मानकीय संबंधों और अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCO) से जोड़ना।",
    searchPlaceholder: "अपनी खरीद आवश्यकता दर्ज करें (उदा. '1000 एलईडी स्ट्रीट लाइट, 90W, आउटडोर, IP66, 50,000 घंटे, सर्ज प्रोटेक्शन') या निविदा दस्तावेज़ अपलोड करें...",
    uploadTenderPrompt: "निविदा पीडीएफ / दस्तावेज़ अपलोड करें",
    analyzeButton: "मानक खोजें एवं विश्लेषण करें",
    analyzingButton: "हाइब्रिड सिमेंटिक एवं ग्राफ खोज प्रगति पर है...",
    sampleQueriesTitle: "मानक खरीद उदाहरण चुनें:",
    primaryStandardTitle: "प्राथमिक लागू मानक",
    relatedStandardsTitle: "संबंधित एवं मानकीय मानक",
    standardsGraphTitle: "इंटरएक्टिव मानक ज्ञान ग्राफ",
    certificationQCOTitle: "नियामक एवं अनिवार्य प्रमाणन जाँच (QCO)",
    gapAnalysisTitle: "विशिष्टता अंतर विश्लेषण (छूटी हुई आवश्यकताएं)",
    gapSubtitle: "निविदा में महत्वपूर्ण तकनीकी विवरणों की अनुपस्थिति जो घटिया आपूर्ति का कारण बन सकती है।",
    explainabilityTitle: "पारदर्शी एआई ऑडिट ट्रेल",
    exportClauseTitle: "तैयार निविदा विनिर्देश खंड",
    saveProjectButton: "निविदा विनिर्देश सहेजें",
    copyClauseButton: "खंड क्लिपबोर्ड पर कॉपी करें",
    missingBadge: "निविदा में अनुपस्थित",
    mandatoryBadge: "अनिवार्य बीआईएस आवश्यकता",
    currentStatus: "वर्तमान संस्करण",
    amendmentsCount: "सक्रिय संशोधन",
    qcoCompulsory: "अनिवार्य प्रमाणन (QCO लागू)",
    qcoVoluntary: "स्वैच्छिक प्रमाणन योजना",

    savedTenders: "सहेजी गई निविदाएं",
    officerSession: "अधिकारी सत्र सक्रिय",
    publicViewMode: "सार्वजनिक दृश्य",
    officerSignIn: "अधिकारी लॉगिन",
    logout: "लॉग आउट",
    portalApi: "पोर्टल एपीआई",
    bisPortal: "बीआईएस पोर्टल",

    section1Title: "निकाली गई खरीद आवश्यकताओं की समीक्षा करें",
    section2Title: "प्राथमिक मानक मिलान एवं क्यूसीओ मूल्यांकन",
    section3Title: "संबंधित एवं मानकीय मानक खोजें",
    section4Title: "तकनीकी विनिर्देश कमियों का समाधान करें",
    section5Title: "पारदर्शी एआई ऑडिट ट्रेल की समीक्षा करें",
    section6Title: "अपने ड्राफ्ट विनिर्देश की समीक्षा एवं निर्यात करें",

    tabOverview: "समग्र दृश्य",
    tabRequirements: "1. आवश्यकताएँ",
    tabStandard: "2. मानक",
    tabCertification: "3. प्रमाणन",
    tabRelated: "4. संबद्ध",
    tabGaps: "5. कमियाँ",
    tabClauses: "6. निविदा खंड",
    dashboardSections: "अनुभाग डैशबोर्ड",
    openDashboard: "डैशबोर्ड खोलें",
    closeDashboard: "डैशबोर्ड बंद करें",

    downloadPdf: "पीडीएफ डाउनलोड",
    downloadTxt: ".txt डाउनलोड",
    copied: "कॉपी हो गया!",
    publicPreviewNotice: "आप इस ड्राफ्ट खंड को पढ़ और कॉपी कर सकते हैं। औपचारिक दस्तावेज़ निर्यात (PDF / TXT) एवं सहेजना केवल खरीद अधिकारियों के लिए उपलब्ध है।",
    exportSubtitle: "हल की गई विनिर्देश कमियाँ, क्यूसीओ वैधानिक संदर्भ एवं एसटीआई परीक्षण प्रक्रियाएँ शामिल हैं।",
    gemCompatible: "GeM / CPPP ई-खरीद प्रारूपों के अनुकूल",
  },
  te: {
    appName: "మానక్ సేతు",
    tagline: "ఏఐ ఆధారిత భారతీయ ప్రమాణాల సిఫార్సు & కొనుగోలు నిబంధనల ఇంజిన్",
    subTagline: "ప్రభుత్వ టెండర్లను అధికారిక బీఐఎస్ ప్రమాణాలు మరియు తప్పనిసరి క్వాలిటీ కంట్రోల్ ఆర్డర్లతో (QCO) అనుసంధానించడం.",
    searchPlaceholder: "మీ కొనుగోలు వివరాలను నమోదు చేయండి (ఉదా. 'మున్సిపల్ రోడ్ల కోసం 1000 ఎల్ఈడీ స్ట్రీట్ లైట్లు, 90W, IP66, 50,000 గంటల జీవితకాలం') లేదా టెండర్ అప్‌లోడ్ చేయండి...",
    uploadTenderPrompt: "టెండర్ పిడిఎఫ్ లేదా డాక్యుమెంట్ అప్‌లోడ్ చేయండి",
    analyzeButton: "విశ్లేషించి ప్రమాణాలను గుర్తించండి",
    analyzingButton: "సెమాంటిక్ & గ్రాఫ్ విశ్లేషణ జరుగుతోంది...",
    sampleQueriesTitle: "నమూనా కొనుగోలు ప్రశ్నలు:",
    primaryStandardTitle: "ప్రధాన వర్తించే ప్రమాణం",
    relatedStandardsTitle: "సంబంధిత మరియు పరీక్షా ప్రమాణాలు",
    standardsGraphTitle: "ఇంటరాక్టివ్ ప్రమాణాల నాలెడ్జ్ గ్రాఫ్",
    certificationQCOTitle: "నియంత్రణ మరియు తప్పనిసరి ధృవీకరణ తనిఖీ",
    gapAnalysisTitle: "స్పెసిఫికేషన్ లోపాల విశ్లేషణ (మిస్సింగ్ వివరాలు)",
    gapSubtitle: "టెండర్ స్పెసిఫికేషన్‌లో తప్పిపోయిన ముఖ్యమైన సాంకేతిక పారామితులు.",
    explainabilityTitle: "వివరణాత్మక ఏఐ ఆడిట్ వివరాలు",
    exportClauseTitle: "టెండర్ స్పెసిఫికేషన్ క్లాజ్",
    saveProjectButton: "ప్రాజెక్ట్‌ను సేవ్ చేయండి",
    copyClauseButton: "క్లాజ్‌ను కాపీ చేయండి",
    missingBadge: "టెండర్‌లో లేదు",
    mandatoryBadge: "తప్పనిసరి బీఐఎస్ నిబంధన",
    currentStatus: "ప్రస్తుత వెర్షన్",
    amendmentsCount: "సవరణలు",
    qcoCompulsory: "తప్పనిసరి ధృవీకరణ (QCO వర్తిస్తుంది)",
    qcoVoluntary: "స్వచ్ఛంద ధృవీకరణ పథకం",

    savedTenders: "సేవ్ చేసిన టెండర్లు",
    officerSession: "అధికారి సెషన్",
    publicViewMode: "పబ్లిక్ వీక్షణ",
    officerSignIn: "అధికారి లాగిన్",
    logout: "లాగ్ అవుట్",
    portalApi: "పోర్టల్ API",
    bisPortal: "బీఐఎస్ పోర్టల్",

    section1Title: "సేకరించిన కొనుగోలు అవసరాలను సమీక్షించండి",
    section2Title: "ప్రధాన ప్రమాణాన్ని సరిపోల్చి QCO ను అంచనా వేయండి",
    section3Title: "అనుబంధ మరియు సంబంధిత ప్రమాణాలను కనుగొనండి",
    section4Title: "సాంకేతిక స్పెసిఫికేషన్ లోపాలను పరిష్కరించండి",
    section5Title: "వివరణాత్మక AI ఆడిట్ ట్రయల్‌ను సమీక్షించండి",
    section6Title: "మీ డ్రాఫ్ట్ టెండర్ క్లాజ్‌ను సమీక్షించి ఎగుమతి చేయండి",

    tabOverview: "అవలోకనం",
    tabRequirements: "1. అవసరాలు",
    tabStandard: "2. ప్రమాణం",
    tabCertification: "3. ధృవీకరణ",
    tabRelated: "4. సంబంధిత",
    tabGaps: "5. లోపాలు",
    tabClauses: "6. క్లాజులు",
    dashboardSections: "విభాగాల డ్యాష్‌బోర్డ్",
    openDashboard: "డ్యాష్‌బోర్డ్ తెరవండి",
    closeDashboard: "డ్యాష్‌బోర్డ్ మూసివేయండి",

    downloadPdf: "PDF డౌన్‌లోడ్",
    downloadTxt: ".txt డౌన్‌లోడ్",
    copied: "కాపీ చేయబడింది!",
    publicPreviewNotice: "మీరు ఈ ముసాయిదా క్లాజ్‌ను చదవవచ్చు మరియు కాపీ చేయవచ్చు. అధికారిక పత్రాల డౌన్‌లోడ్ (PDF / TXT) అధికారులు మాత్రమే చేయగలరు.",
    exportSubtitle: "పరిష్కరించిన స్పెసిఫికేషన్ లోపాలు మరియు చట్టబద్ధమైన QCO వివరాలు కలిగి ఉంది.",
    gemCompatible: "GeM / CPPP ఈ-ప్రొక్యూర్మెంట్ ఫార్మాట్‌లకు అనుకూలం",
  },
  ta: {
    appName: "மானக் சேது",
    tagline: "AI இந்தியத் தரநிலைகள் பரிந்துரை மற்றும் கொள்முதல் இணக்க இயந்திரம்",
    subTagline: "அரசு டெண்டர்களை அதிகாரப்பூர்வ BIS தரநிலைகள் மற்றும் கட்டாய QCO உத்தரவுகளுடன் இணைக்கிறது.",
    searchPlaceholder: "உங்கள் கொள்முதல் தேவையை உள்ளிடவும் (எ.கா: '1000 எல்இடி தெரு விளக்குகள், 90W, IP66, 50,000 மணிநேரம்')...",
    uploadTenderPrompt: "டெண்டர் ஆவணத்தை பதிவேற்றவும்",
    analyzeButton: "பகுப்பாய்வு செய்து தரநிலைகளை இணைக்கவும்",
    analyzingButton: "தரநிலைகள் தேடப்படுகின்றன...",
    sampleQueriesTitle: "மாதிரி கொள்முதல் வினவல்கள்:",
    primaryStandardTitle: "முதன்மை பொருந்தக்கூடிய தரநிலை",
    relatedStandardsTitle: "தொடர்புடைய மற்றும் சோதனை தரநிலைகள்",
    standardsGraphTitle: "ஊடாடும் தரநிலைகள் வரைபடம்",
    certificationQCOTitle: "கட்டாய சான்றிதழ் சோதனை (QCO)",
    gapAnalysisTitle: "விவரக்குறிப்பு இடைவெளி பகுப்பாய்வு",
    gapSubtitle: "டெண்டரில் விடுபட்ட முக்கியமான தொழில்நுட்ப அளவுருக்கள்.",
    explainabilityTitle: "விளக்கக்கூடிய AI தணிக்கை விவரம்",
    exportClauseTitle: "உருவாக்கப்பட்ட டெண்டர் விவரக்குறிப்பு விதி",
    saveProjectButton: "திட்டத்தைச் சேமிக்கவும்",
    copyClauseButton: "நகலெடுக்கவும்",
    missingBadge: "டெண்டரில் விடுபட்டுள்ளது",
    mandatoryBadge: "கட்டாய BIS தேவை",
    currentStatus: "தற்போதைய பதிப்பு",
    amendmentsCount: "செயலில் உள்ள திருத்தங்கள்",
    qcoCompulsory: "கட்டாய சான்றிதழ் (QCO)",
    qcoVoluntary: "விருப்ப சான்றிதழ் திட்டம்",

    savedTenders: "சேமிக்கப்பட்டவை",
    officerSession: "அதிகாரி அமர்வு",
    publicViewMode: "பொது பார்வை",
    officerSignIn: "அதிகாரி உள்நுழைவு",
    logout: "வெளியேறு",
    portalApi: "போர்டல் API",
    bisPortal: "BIS போர்டல்",

    section1Title: "கொள்முதல் தேவைகளை மதிப்பாய்வு செய்யவும்",
    section2Title: "முதன்மை தரநிலையை பொருத்தி QCO ஐ சரிபார்க்கவும்",
    section3Title: "தொடர்புடைய தரநிலைகளை கண்டறியவும்",
    section4Title: "தொழில்நுட்ப விவரக்குறிப்பு இடைவெளிகளை தீர்க்கவும்",
    section5Title: "AI தணிக்கை விவரங்களை மதிப்பாய்வு செய்யவும்",
    section6Title: "உங்கள் வரைவு விவரக்குறிப்பை ஏற்றுமதி செய்யவும்",

    tabOverview: "கண்ணோட்டம்",
    tabRequirements: "1. தேவைகள்",
    tabStandard: "2. தரநிலை",
    tabCertification: "3. சான்றிதழ்",
    tabRelated: "4. தொடர்புடைய",
    tabGaps: "5. இடைவெளிகள்",
    tabClauses: "6. விதிகள்",
    dashboardSections: "பிரிவுகள் டாஷ்போர்டு",
    openDashboard: "டாஷ்போர்டைத் திறக்கவும்",
    closeDashboard: "டாஷ்போர்டை மூடுக",

    downloadPdf: "PDF பதிவிறக்கு",
    downloadTxt: ".txt பதிவிறக்கு",
    copied: "நகலெடுக்கப்பட்டது!",
    publicPreviewNotice: "நீங்கள் இந்த வரைவு விதியை படிக்கலாம் மற்றும் நகலெடுக்கலாம். அதிகாரப்பூர்வ ஆவண பதிவிறக்கம் (PDF / TXT) அதிகாரிகளுக்கு மட்டுமே.",
    exportSubtitle: "தீர்க்கப்பட்ட விவரக்குறிப்பு இடைவெளிகள் மற்றும் QCO விதிகள் இதில் அடங்கும்.",
    gemCompatible: "GeM / CPPP மின்-கொள்முதல் அமைப்புகளுக்கு ஏற்றது",
  }
};
