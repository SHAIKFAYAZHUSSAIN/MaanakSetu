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
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "MaanakSetu",
    tagline: "AI Indian Standards Recommendation & Procurement Compliance Engine",
    subTagline: "Bridging government tenders with authoritative BIS standards, normative graphs, and compulsory QCO certification orders.",
    searchPlaceholder: "Enter your procurement requirement (e.g., '1000 LED street lights, 90W, outdoor use, IP66, 50,000 hrs, surge protection') or upload tender doc...",
    uploadTenderPrompt: "Upload Tender PDF / DOCX or Paste Specification",
    analyzeButton: "Analyze & Map Standards",
    analyzingButton: "Performing Hybrid Semantic & Graph Retrieval...",
    sampleQueriesTitle: "Try Standard Procurement Queries:",
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
  },
  hi: {
    appName: "मानकसेतु",
    tagline: "एआई भारतीय मानक अनुशंसा एवं खरीद अनुपालन प्रणाली",
    subTagline: "सरकारी निविदाओं को आधिकारिक बीआईएस मानकों, मानकीय संबंधों और अनिवार्य गुणवत्ता नियंत्रण आदेशों (QCO) से जोड़ना।",
    searchPlaceholder: "अपनी खरीद आवश्यकता दर्ज करें (उदा. '1000 एलईडी स्ट्रीट लाइट, 90W, आउटडोर, IP66, 50,000 घंटे, सर्ज प्रोटेक्शन') या निविदा दस्तावेज़ अपलोड करें...",
    uploadTenderPrompt: "निविदा पीडीएफ / दस्तावेज़ अपलोड करें",
    analyzeButton: "विश्लेषण एवं मानक मैपिंग करें",
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
    copyClauseButton: "क्लिपबोर्ड पर कॉपी करें",
    missingBadge: "निविदा में अनुपस्थित",
    mandatoryBadge: "अनिवार्य बीआईएस आवश्यकता",
    currentStatus: "वर्तमान संस्करण",
    amendmentsCount: "सक्रिय संशोधन",
    qcoCompulsory: "अनिवार्य प्रमाणन (QCO लागू)",
    qcoVoluntary: "स्वैच्छिक प्रमाणन योजना",
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
  }
};
