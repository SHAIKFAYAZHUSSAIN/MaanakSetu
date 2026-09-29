# 🇮🇳 MaanakSetu (मानकसेतु)
### *AI-Powered Procurement Recommendation, Standards Intelligence & Statutory Compliance Copilot*

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH%202026-Problem%20Statement%20SIH262108-orange?style=for-the-badge&logo=target)](https://sih.gov.in/)
[![Bureau of Indian Standards](https://img.shields.io/badge/Organization-Bureau%20of%20Indian%20Standards%20(BIS)-blue?style=for-the-badge&logo=shield)](https://www.bis.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-Consumer%20Affairs%2C%20Food%20%26%20Public%20Distribution-green?style=for-the-badge)](https://consumeraffairs.nic.in/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSHAIKFAYAZHUSSAIN%2FMaanakSetu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **"Transforming unstructured tender requirements into authoritative, standards-ready procurement specifications grounded in the Bureau of Indian Standards (BIS) Act, 2016 and General Financial Rules (GFR 2017) Rule 144(i)."**

---

## 🚀 Instant Deployment on Vercel

MaanakSetu is fully pre-configured for zero-friction Vercel deployment:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSHAIKFAYAZHUSSAIN%2FMaanakSetu)

### Option A: 1-Click Web Deployment (Recommended)
1. Navigate to **[vercel.com/new](https://vercel.com/new)**.
2. Select your repository: **`SHAIKFAYAZHUSSAIN/MaanakSetu`**.
3. Framework Preset: **`Next.js`** (auto-detected).
4. *(Optional)* Add Environment Variables:
   - `AUTH_LOGIN_EMAIL`: `officer@maanaksetu.demo`
   - `AUTH_LOGIN_PASSWORD`: `password@123`
   - `AUTH_SESSION_SECRET`: `HRZsCZkVletaAsT9VHHxxzv7aRXOvGe0I4RtzZHz25o6J1g3jDYQgN03iPIR8sJY`
5. Click **Deploy**. Vercel will build and assign a live production URL (`https://maanaksetu.vercel.app`).

### Option B: Terminal CLI Deployment
```bash
npx vercel login
npx vercel --prod
```

---

## ⚡ Quick Start for Evaluators (5-Minute Walkthrough)

Evaluators and technical judges can immediately inspect and test the full application locally:

### 1. Launch Application
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in any modern web browser.

### 2. Demo Officer Credentials
| Parameter | Value | Notes |
|:---|:---|:---|
| **URL** | `http://localhost:3000` | Gated demo login screen |
| **Role** | `Procurement Officer` | Dropdown with Officer & Scrutiny roles |
| **Username** | `procurement.officer` | Or click **"Auto-Fill Demo"** button |
| **Password** | `Demo@1234` | Fully validated client-side session |
| **Session** | Local browser storage | Sign out anytime via header profile badge |

---

## 🎯 Evaluator Feature Tour: What to Test

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 EVALUATION CHECKLIST                   │
                  └───────────────────────────┬────────────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌──────────────────┐               ┌───────────────────────┐             ┌─────────────────────┐
│ 1. Demo Login    │               │ 2. Standards Analysis │             │ 3. Maanak AI Bot    │
│ • procurement.   │               │ • LED Street Light    │             │ • Fixed bottom-right│
│   officer        │               │ • IS 10322 Match      │             │ • Context-aware     │
│ • Auto-fill demo │               │ • QCO Mandate         │             │ • Grounded advice   │
│ • Sign-out icon  │               │ • 4 Spec Gaps         │             │ • Zero hallucination│
└──────────────────┘               └───────────────────────┘             └─────────────────────┘
         │                                    │                                    │
         ├────────────────────────────────────┴────────────────────────────────────┤
         ▼                                                                         ▼
┌─────────────────────────────────┐                       ┌────────────────────────────────────┐
│ 4. Dark Mode Toggle             │                       │ 5. GFR 144(i) PDF Exporter         │
│ • ☀ Light / ☾ Dark in header    │                       │ • Formal 5-page Government Schedule│
│ • Deep slate-teal palette       │                       │ • 45 clickable verified BIS links  │
│ • System-wide coherent styling  │                       │ • Restrained footnotes & approvals │
└─────────────────────────────────┘                       └────────────────────────────────────┘
```

1. **Procurement Officer Demo Login**: Sign in using `procurement.officer` / `Demo@1234` or click the 1-click **"Auto-Fill Demo"** button. Test invalid credentials to verify security notice.
2. **Responsive Full-Width Workspace**: Notice the expanded enterprise layout (~88–95% viewport width utilization), eliminating excessive right margins on large displays (1280px to 1600px+).
3. **Left Navigation Drawer (☰)**: Click the hamburger button. The drawer floats smoothly on the left at `285px` width without blurring or dimming the underlying workspace.
4. **Standards Analysis & Recommendation**: Click **"Try a Sample Tender"** or **"Analysis Results"** to view the **IS 10322 (Part 5/Sec 3): 2012** recommendation for municipal LED street lighting.
5. **Traceability Drawer ("Why recommended?")**: Click **"Why recommended?"** on the primary card to inspect the **4-step vertical decision chain**:
   $$\text{Tender Requirement} \longrightarrow \text{Extracted Concept} \longrightarrow \text{Recommended Indian Standard} \longrightarrow \text{Official BIS Source}$$
6. **Maanak Procurement Copilot Chatbot**: Click `[ ✦ ] Maanak` in the bottom-right corner. Try clicking quick action chips:
   - `[ Explain this analysis ]` → Generates real-time summary of active tender parameters.
   - `[ Check compliance ]` → Explains DPIIT Quality Control Orders and mandatory ISI/CRS marks.
   - `[ Find official BIS source ]` → Returns canonical government verification URLs.
7. **Coherent Enterprise Dark Mode**: Click `☾ Dark` in the top-right header to experience the institutional slate-charcoal theme across all cards, modals, and the chatbot.
8. **Statutory GFR 144(i) Tender Schedule PDF**: Go to the **Spec Generator** tab and click **"Download PDF"**. Inspect the formal 5-page government procurement schedule containing **45 active, clickable hyperlinks** pointing strictly to verified official government portals.

---

## 📌 Problem Statement SIH262108: Context & Challenge

Public procurement in India accounts for over **₹20 to ₹25 Lakh Crores (~20% of GDP)** annually across portals like the **Government e-Marketplace (GeM)**, **Central Public Procurement Portal (CPPP)**, **CPWD**, **Indian Railways (IREPS)**, and Defense bodies.

Under **Rule 144(i) of the General Financial Rules (GFR 2017)** and **Central Vigilance Commission (CVC) guidelines**, all purchasing officers are legally required to cite authoritative **Indian Standards (IS)** established by the **Bureau of Indian Standards (BIS)**.

### 🔴 The Operational Crisis
1. **Catalog Density & Navigation Barrier:** BIS administers **22,000+ active standards** across 15 Division Councils (*Electrotechnical ETD, Civil CED, Mechanical MED, Petroleum/Chemical PCD, Electronics LITD, etc.*). Identifying the right standard is complex and time-consuming.
2. **Superseded & Outdated Standards:** Tenders frequently cite obsolete standards (e.g. *IS 10322:1987* instead of *IS 10322 (Part 5/Sec 3):2012 Amd 2:2024*), leading to bidder disputes, supplier arbitration, and CAG audit objections.
3. **Mandatory Quality Control Orders (QCOs):** Over 700+ products are governed by compulsory QCOs under **Section 16 of the BIS Act, 2016** (mandating Scheme-I ISI Mark or Scheme-II CRS). Procuring non-QCO compliant items violates federal law, attracting penalties under Section 29.
4. **Specification Loopholes:** Tenders often specify basic commercial terms (*e.g., "90W LED Street Light"*) while missing indispensable safety and durability parameters (*Surge Withstand ≥ 10kV as per IS 16074, IP66 Ingress, THD < 10%*).
5. **The "Generic AI" Trap:** Off-the-shelf LLMs (ChatGPT, Claude) regularly hallucinate non-existent Indian Standard numbers, quote repealed specifications, fail to verify Gazette notifications, and lack audit trails required by vigilance bodies.

---

## 💡 The Solution: MaanakSetu (मानकसेतु)

**MaanakSetu** is an enterprise-grade **AI Recommendation and Procurement Intelligence Engine** purpose-built to solve **SIH262108**.

Operating at the intersection of **Deterministic Hybrid Search**, **Normative Knowledge Graph Traversal**, **Gazette QCO Verification**, and **Automated Specification Gap Analysis**, MaanakSetu transforms unstructured requirements or tender schedules into **legally unassailable, QCO-compliant tender clauses in under 2 seconds**.

```
                ┌──────────────────────────────────────────────────────────┐
                │          MaanakSetu Core Processing Architecture         │
                └─────────────────────────────┬────────────────────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌──────────────────┐               ┌───────────────────────┐             ┌─────────────────────┐
│  Multilingual    │               │  Deterministic RAG    │             │   Knowledge Graph   │
│  Tender Parser   │──────────────▶│  Hybrid Re-Ranking    │────────────▶│  Normative Network  │
│ (8+ Languages &  │               │ (Domain, Scope, QCO,  │             │ (Safety, Testing,   │
│   PDF / DOCX)    │               │  Version Chain Score) │             │  Allied Standards)  │
└──────────────────┘               └───────────────────────┘             └──────────┬──────────┘
                                                                                    │
         ┌──────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MaanakSetu Intelligence Output                               │
├─────────────────────────┬──────────────────────────┬──────────────────────────┬──────────────┤
│ 🛡️ Verified Primary IS  │ ⚠️ Superseded Sentinel   │ 🧩 Spec Gap Detection    │ 📜 GeM Ready │
│   & Mandatory QCO Order │    & Active Amendments   │    & Remediation Clauses │    Clause    │
└─────────────────────────┴──────────────────────────┴──────────────────────────┴──────────────┘
```

---

## ✨ Key System Innovations & Features

### 1. 🔍 Multilingual & Multi-Item Document Parsing
* **Vernacular Procurement Ingestion:** Understands tender schedules in **8+ Indian Languages** (*English, Hindi, Telugu, Tamil, Kannada, etc.*).
* **Multi-Format Parsing:** Ingests unstructured tender schedules (PDF, DOCX, TXT) and automatically extracts engineering specifications (*rated power, voltage, ingress protection, surge immunity*).

### 2. ⚡ Deterministic Hybrid Retrieval & Multi-Factor Scoring
Couples vector embeddings with deterministic catalog filtering and a transparent multi-factor re-ranking formula:

$$\text{Final Score} = 0.25 \cdot \text{SemanticSim} + 0.35 \cdot \text{ProductMatch} + 0.20 \cdot \text{ScopeSim} + 0.15 \cdot \text{ParamMatch} + 0.10 \cdot \text{VersionBonus} + 0.10 \cdot \text{QCOBonus}$$

* **Zero-Hallucination Guardrail:** Strict confidence scoring with automatic thresholding. Out-of-scope commercial goods (catering, civil labor) trigger a clear **"No Reliable Match"** status with interactive clarifying questions rather than generating fake standards.

### 3. 🕸️ Normative Knowledge Graph Engine
An interactive, force-directed topological graph visualizer that uncovers hidden standards dependencies:
* **Primary Standard** (Core Specification)
* **Subsystem & Safety Standards** (e.g., driver safety IS 15885, light engine IS 16103)
* **Normative Test Methods** (e.g., ingress protection IS/IEC 60529, surge immunity IS 16074)
* **Certification Schemes** (Scheme-I ISI Mark vs. Scheme-II Compulsory Registration)

### 4. ⚠️ "Superseded Standard Sentinel" & Version Chain Tracking
* Automatically flags obsolete standard citations (e.g. *IS 10322:1987*, *IS 456:1978*, *IS 1180:1989*).
* Instantly surfaces the active replacement, gazetted enforcement year, and active amendments (e.g., *Amendment 1: 2018*, *Amendment 2: 2024*).

### 5. 🛠️ Specification Gap Analysis & Remediation
* Compares user-provided tender specs against mandatory benchmarks in the Indian Standard.
* Detects omitted parameters (*Total Harmonic Distortion < 10%, Surge Withstand ≥ 10kV, IP66 Ingress*).
* Provides 1-click clause insertion to immediately plug vulnerabilities in the tender text.

### 6. 📜 Ready-to-Copy GeM / CPPP Tender Clause Exporter & PDF
* Automatically builds comprehensive, legally binding procurement clauses conforming to **GFR Rule 144(i)**.
* Includes mandatory BIS certification requirements, test certificate stipulations, Scheme verification links, and penalty clauses under **Section 29 of the BIS Act, 2016**.
* Exportable in **Raw Text (.txt)** or **Official Government Tender PDF format** (5-page tagged PDF with embedded hyperlinks and approval block).

### 7. 🔗 Official Source Links & Provenance Whitelist
The application restricts external linking strictly to **5 approved government domains** across 9 designated portals:
- `standards.bis.gov.in` (BIS Standards Portal — primary verification source)
- `bis.gov.in` (BIS Official Portal, QCO Compulsory Certification, Product Certification, BIS CARE)
- `manakonline.in` (BIS e-BIS / Manakonline stakeholder portal)
- `crsbis.in` (BIS Compulsory Registration Scheme for electronics/IT)
- `gem.gov.in` (Government e-Marketplace procurement context)

---

## 📊 Pre-Configured Benchmark Scenarios

MaanakSetu includes interactive procurement benchmark scenarios ready for 1-click evaluation:

| Domain / Sector | Procurement Item | Primary Standard | Key Allied Standards | Statutory QCO Mandate |
|:---|:---|:---|:---|:---|
| **ETD 24 (Lighting)** | **LED Street Lighting Fixture** | **IS 10322 (Part 5/Sec 3): 2012** | IS 15885, IS 16103, IS 16074, IS/IEC 60529 | **Compulsory Scheme-I / CRS (DPIIT)** |
| **MED 20 (Pumps)** | **Submersible Water Pump Sets** | **IS 9079: 2018** | IS 8034, IS 9283, IS 12615 | **BEE Star Rating & BIS Mandatory** |
| **ETD 32 (Solar)** | **Solar PV Grid-Tied Inverters** | **IS 16221 (Part 2): 2015** | IS/IEC 61683, IS/IEC 60068, IS 16169 | **MNRE Solar QCO / CRS Mandate** |
| **CED 02 (Civil)** | **Structural Portland Cement** | **IS 269: 2015** | IS 456, IS 1489, IS 383, IS 4031 | **Compulsory Scheme-I ISI Mark** |
| **LITD 10 (IT)** | **IP CCTV Surveillance Cameras** | **IS 13252 (Part 1): 2010** | IS 16833, IS/IEC 62676 | **MeitY CRS Compulsory Order** |

---

## 🏛️ Statutory & Legal Framework Grounding

MaanakSetu is engineered in strict alignment with Government of India public procurement laws:

1. **General Financial Rules (GFR 2017) — Rule 144(i):**
   * *Mandate:* "The technical specifications should, to the extent practicable, be based on national standards, having regard to the aspects of performance, quality, and environmental friendliness."
   * *MaanakSetu alignment:* Automatically prepopulates verified national standards and generates auditable compliance clauses.
2. **Bureau of Indian Standards Act, 2016:**
   * *Section 16:* Power of Central Government to notify mandatory Quality Control Orders (QCOs).
   * *Section 17:* Prohibition on manufacturing, importing, selling, or procuring non-conforming items.
   * *Section 29:* Penalties (imprisonment up to 2 years or fines) for non-compliant public procurement.
3. **Central Vigilance Commission (CVC) Tender Guidelines:**
   * Mandates that technical parameters must not be biased towards proprietary vendors and must conform to open national standards.
4. **Comptroller & Auditor General (CAG) Audit Traceability:**
   * Generates deterministic mathematical match scores and complete evidence trails to eliminate post-tender audit queries.

---

## 📁 Project Repository Structure

```
MaanakSetu/
├── public/                                  # Static assets, emblems & logos
├── scripts/
│   ├── generatePdfCdp.js                    # Headless Chrome CDP tagged PDF generator
│   ├── verifyLayoutAndSidebar.js            # Automated width & drawer verification suite
│   ├── verifyLinks.js                       # Whitelisted domain compliance scanner
│   └── testFinalPolish.js                   # 20-point automated end-to-end test suite
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/route.ts             # Main AI & heuristic recommendation pipeline
│   │   │   ├── export-pdf/route.ts          # Server-side HTML/PDF schedule endpoint
│   │   │   ├── upload/route.ts              # Multi-format document parser (PDF, DOCX)
│   │   │   └── v1/recommend/route.ts        # GeM / CPPP RESTful Integration API
│   │   ├── globals.css                      # Enterprise styling, container & dark theme
│   │   ├── layout.tsx                       # Root layout with font & metadata
│   │   ├── login/page.tsx                   # Unified demo login route
│   │   └── page.tsx                         # Core procurement copilot workstation
│   ├── components/
│   │   ├── DemoLoginScreen.tsx              # Procurement officer demo login screen
│   │   ├── MaanakChatbot.tsx                # Context-aware grounded procurement AI copilot
│   │   ├── ManakSetuLogo.tsx                # Institutional SVG emblem branding
│   │   ├── RecommendationTraceabilityDrawer.tsx # 4-step vertical decision chain panel
│   │   ├── StandardDetailModal.tsx          # Full-scope standard & amendment modal
│   │   ├── SystemArchitectureModal.tsx      # System design & verification architecture
│   │   ├── AnalysisProgressModal.tsx        # 7-stage deterministic pipeline animation
│   │   └── views/
│   │       ├── LandingWorkspaceView.tsx     # Institutional landing & benchmark scenarios
│   │       ├── AnalyzeRequirementView.tsx   # Text & PDF document input interface
│   │       ├── AnalysisResultsView.tsx      # Primary cards, metrics, gaps, QCOs
│   │       ├── KnowledgeGraphView.tsx       # Interactive force-directed topology visualizer
│   │       ├── TenderSpecGeneratorView.tsx  # 9-clause GFR 144(i) schedule generator
│   │       ├── StandardsExplorerView.tsx    # BIS catalog explorer with sector filters
│   │       └── AnalysisHistoryView.tsx      # Saved audit dossiers & session history
│   ├── data/
│   │   ├── procurementScenarios.ts          # Benchmark test cases (LED, Pumps, Solar)
│   │   └── standardsKnowledgeBase.ts        # Curated 24+ domain BIS standards database
│   ├── lib/
│   │   ├── officialSources.ts               # Approved domains whitelist & portal registry
│   │   ├── pdfTemplate.ts                   # Official 5-page Government PDF template
│   │   ├── specExporter.ts                  # GFR 144(i) clause formatter
│   │   ├── hybridSearch.ts                  # Deterministic multi-factor scoring engine
│   │   └── gemini.ts                        # Multilingual NLP & fallback parser
│   └── types/
│       ├── language.ts                      # Multilingual translations
│       ├── procurement.ts                   # Result, gap, project & audit types
│       └── standards.ts                     # BIS standard, QCO & graph models
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🔌 GeM & CPPP Integration REST API

MaanakSetu exposes a high-throughput, low-latency REST API designed for immediate integration into government procurement software like **GeM**, **CPWD e-Tender**, and **IREPS**.

### Endpoint: `POST /api/v1/recommend`
**Headers:**
```http
Content-Type: application/json
X-Procurement-Portal: GeM
```

### Sample Request
```bash
curl -X POST "http://localhost:3000/api/v1/recommend" \
  -H "Content-Type: application/json" \
  -H "X-Procurement-Portal: GeM" \
  -d '{
    "query": "Procure 1000 LED street lighting fixtures, 90W, outdoor municipal use, IP66 with surge protection",
    "portal": "Government e-Marketplace (GeM)"
  }'
```

### Sample Response (Truncated)
```json
{
  "query": "Procure 1000 LED street lighting fixtures, 90W, outdoor municipal use, IP66 with surge protection",
  "portal": "Government e-Marketplace (GeM)",
  "timestamp": "2026-09-29T09:45:00.000Z",
  "matchStatus": "MATCH_FOUND",
  "confidenceScore": 96,
  "confidenceLevel": "High",
  "primaryStandard": {
    "isNumber": "IS 10322 (Part 5/Sec 3): 2012",
    "title": "Luminaires - Particular Requirements - Luminaires for Road and Street Lighting",
    "department": "Electrotechnical Department (ETD 24)",
    "status": "Current",
    "officialSourceUrl": "https://standards.bis.gov.in/item/is-10322-part-5-sec-3-2012",
    "activeAmendments": [
      { "number": 1, "year": 2018, "summary": "Mandates strict ingress protection test procedures (IP65/IP66)." },
      { "number": 2, "year": 2024, "summary": "Harmonizes high-voltage surge withstand requirements with IS 16074." }
    ],
    "qcoOrder": {
      "isCompulsory": true,
      "orderName": "Solar DC Cable and LED Luminaires (Quality Control) Order",
      "scheme": "Scheme-I (ISI Mark) / CRS",
      "gazetteNotification": "S.O. 2357(E)"
    }
  },
  "specificationGapsIdentified": [
    {
      "parameter": "Surge Protection Level",
      "severity": "High",
      "suggestedClause": "The luminaire shall incorporate internal and external surge protection capable of withstanding minimum 10 kV/5 kA surges conforming to IS 16074."
    }
  ],
  "generatedTenderSpecificationClause": "### MANDATORY TECHNICAL COMPLIANCE CLAUSE (GFR RULE 144):\n1. The supplied item shall strictly comply with IS 10322 (Part 5/Sec 3): 2012 incorporating Amendments 1 & 2..."
}
```

---

## 🧪 Automated Verification & Testing Suite

Evaluators can re-verify the codebase at any time using our built-in test scripts:

```bash
# 1. Test Demo Login, Dark Mode, and Maanak Chatbot (20 end-to-end checks)
node scripts/testFinalPolish.js

# 2. Test Responsive Workspace Width & Left Navigation Drawer
node scripts/verifyLayoutAndSidebar.js

# 3. Audit all URLs against the 5 approved Government domains
node scripts/verifyLinks.js

# 4. Generate official 5-page Government Tagged PDF with 45 clickable links
node scripts/generatePdfCdp.js
```

---

## 👥 Hackathon Details & Acknowledgements

* **Hackathon:** Smart India Hackathon (SIH) 2026
* **Problem Statement ID:** `SIH262108` / `SIH26108`
* **Problem Statement Title:** *AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications*
* **Nodal Ministry / Organization:** Ministry of Consumer Affairs, Food & Public Distribution | **Bureau of Indian Standards (BIS)**
* **Category:** Software
* **Domain:** Smart Automation / Legal & Regulatory Technology / Public Governance

### 🙏 Acknowledgements
We express our deepest gratitude to the **Bureau of Indian Standards (BIS)** for establishing the standard benchmarks that power national quality, and to the **Smart India Hackathon** organizers for formulating a problem statement of immense economic, industrial, and national significance.

---

<div align="center">
  <sub>Built with ❤️ for a Quality-First, Standardized India (आत्मनिर्भर एवं मानक भारत)</sub><br/>
  <b>MaanakSetu © 2026 | Bureau of Indian Standards Intelligence Initiative</b>
</div>
