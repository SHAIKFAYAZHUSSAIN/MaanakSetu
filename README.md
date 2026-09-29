# 🇮🇳 MaanakSetu (मानकसेतु)
### *AI-Powered Public Procurement Standards Intelligence & Compliance Platform*

[![Live Application](https://img.shields.io/badge/Live%20Application-maanaksetu.vercel.app-0F766E?style=for-the-badge&logo=vercel&logoColor=white)](https://maanaksetu.vercel.app)
[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH%202026-Problem%20Statement%20SIH262108-orange?style=for-the-badge&logo=target)](https://sih.gov.in/)
[![Bureau of Indian Standards](https://img.shields.io/badge/Organization-Bureau%20of%20Indian%20Standards%20(BIS)-blue?style=for-the-badge&logo=shield)](https://www.bis.gov.in/)
[![Ministry](https://img.shields.io/badge/Ministry-Consumer%20Affairs%2C%20Food%20%26%20Public%20Distribution-green?style=for-the-badge)](https://consumeraffairs.nic.in/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🌐 **Live Web Application**: **[https://maanaksetu.vercel.app](https://maanaksetu.vercel.app)**  
> **"Transforming unstructured tender requirements into authoritative, standards-ready procurement specifications grounded in the Bureau of Indian Standards (BIS) Act, 2016 and General Financial Rules (GFR 2017) Rule 144(i)."**

---

## 📌 Overview

**MaanakSetu (मानकसेतु)** is a specialized public procurement standards intelligence platform developed for **Smart India Hackathon 2026 (Problem Statement SIH262108)**.

Public purchasing authorities across India (GeM, CPPP, CPWD, Indian Railways, Defense) are legally mandated under **GFR 2017 Rule 144(i)** to base procurement specifications on national standards. However, manually navigating 22,000+ Indian Standards and hundreds of mandatory Quality Control Orders (QCOs) is complex and error-prone.

MaanakSetu bridges this gap by automatically analyzing raw tender schedules, recommending applicable Indian Standards (IS), verifying statutory QCO orders, detecting specification gaps, and generating an official, auditable technical procurement schedule.

---

## ⚡ Quick Start (Run Locally)

### 1. Installation & Start
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Demo Officer Credentials
| Parameter | Value | Details |
|:---|:---|:---|
| **Login URL** | `http://localhost:3000` | Gated demo login screen |
| **Role** | `Procurement Officer` | Dropdown with Officer & Scrutiny roles |
| **Username** | `procurement.officer` | Or click **"Auto-Fill Demo"** button |
| **Password** | `Demo@1234` | Client-side validated session |
| **Sign Out** | Header profile menu | Click username badge to sign out |

---

## 🔄 Core Application Workflow

```
Raw Tender Requirement (Text / PDF / DOCX)
                  ↓
          Requirement Parser (Parameters, Ratings, Use-case)
                  ↓
      Indian Standards Match Engine (Primary IS + Allied Normative References)
                  ↓
       Statutory Compliance Sentinel (Mandatory QCOs under BIS Act Sec 16)
                  ↓
     Specification Gap Detector (Missing Ingress, Surge, Safety Clauses)
                  ↓
    Technical Spec Generator (9-Clause GFR 144(i) Schedule + PDF Export)
                  ↓
     Traceability & Verification (Direct links to official BIS registers)
```

---

## 🌟 Key Features & Modules

### 1. 🔍 Tender Requirement Analyzer
- Ingests raw technical specifications via natural language text or document uploads (**PDF**, **DOCX**, **TXT**).
- Automatically parses parameters including rated power, voltage, ingress protection (IP ratings), operating temperature, and application context.

### 2. 🛡️ Indian Standards Recommendation & Evidence Panel
- Matches technical parameters against the demonstration knowledge base covering multiple engineering disciplines (ETD, MED, CED, LITD).
- Displays primary standard citations (e.g., **IS 10322** for street lighting, **IS 9079** for pumps, **IS 16221** for solar inverters).
- Explains **why** each standard was selected through a 4-step vertical traceability chain citing exact sectional committee scopes.

### 3. ⚠️ Statutory QCO & Compliance Sentinel
- Checks whether the procurement item falls under a gazetted **Quality Control Order (QCO)** under **Section 16 of the BIS Act, 2016**.
- Alerts officers whether **Scheme-I (ISI Mark)** or **Scheme-II (CRS)** certification is legally mandatory prior to tender publication.

### 4. 🧩 Specification Gap Detection & 1-Click Remediation
- Automatically flags omitted safety, durability, or performance criteria (*e.g., missing surge immunity ≥ 10 kV, harmonic distortion < 10%*).
- Allows officers to adopt recommended clauses with one click to prevent vendor disputes and substandard deliveries.

### 5. 🕸️ Normative Knowledge Graph
- Interactive visualizer revealing the full standard ecosystem:
  - **Primary Standard** (Core Specification)
  - **Subsystem & Safety Standards** (e.g., LED drivers, solar modules)
  - **Normative Test Methods** (e.g., ingress protection, surge endurance)
  - **Applicable Certification Schemes**

### 6. 📜 9-Clause Spec Generator & Official PDF Export
- Compiles an authoritative, 9-clause procurement schedule formatted for **GeM Custom Parameters** and **CPWD tender conditions**.
- Generates an official **5-page compliance schedule PDF** with an auditable officer sign-off block and clickable links.

### 7. 🤖 "Maanak" Conversational Copilot
- Grounded AI assistant located at the bottom-right corner.
- Answers questions about why standards were recommended, explains QCO mandates, and suggests testing protocols with anti-hallucination guardrails.

### 8. 👥 3-Officer Governance Workflow
- Reflects the statutory 3-tier public procurement hierarchy:
  1. **Procurement Officer** (Indenting & requirement formulation)
  2. **Technical Scrutiny Officer** (Standards vetting & gap remediation)
  3. **Competent Financial Authority** (Statutory sanction & audit sign-off)

### 9. 🌓 Enterprise Dark Mode & Responsive Layout
- High-contrast, accessibility-focused institutional theme (`#0F1715` slate-charcoal).
- Responsive full-width workspace maximizing desktop viewport efficiency without blurring modals.

---

## 📊 Pre-Configured Benchmark Scenarios

The workspace includes 5 pre-loaded, one-click demonstration scenarios:

| Domain | Item | Primary Standard | Allied Standards | Statutory QCO Status |
|:---|:---|:---|:---|:---|
| **ETD 24 (Lighting)** | **LED Street Light** | **IS 10322 (Part 5/Sec 3)** | IS 15885, IS 16103, IS 16074 | Mandatory Scheme-I / CRS |
| **MED 20 (Pumps)** | **Submersible Water Pump** | **IS 9079: 2018** | IS 8034, IS 9283, IS 12615 | BEE Star & BIS Mandatory |
| **ETD 32 (Solar)** | **Solar Grid-Tied Inverter** | **IS 16221 (Part 2)** | IS/IEC 61683, IS 16169 | MNRE Solar QCO Order |
| **CED 02 (Civil)** | **Portland Pozzolana Cement** | **IS 1489 (Part 1)** | IS 269, IS 456, IS 4031 | Compulsory Scheme-I ISI Mark |
| **LITD 10 (IT)** | **IP CCTV Surveillance Camera** | **IS 13252 (Part 1)** | IS 16833, IS/IEC 62676 | MeitY CRS Compulsory Order |

---

## 🔗 Official Verification Sources Whitelist

To eliminate AI hallucinations and ensure legal safety, all external links point strictly to verified official government portals:

| Official Portal | Domain | Verification Purpose |
|:---|:---|:---|
| **BIS Standards Portal** | `standards.bis.gov.in` | Search and verify active Indian Standards |
| **BIS Official Portal** | `bis.gov.in` | Gazette notifications and regulatory information |
| **BIS e-BIS / Manakonline** | `manakonline.in` | Manufacturer license and test lab directory |
| **BIS CRS Portal** | `crsbis.in` | Compulsory Registration Scheme for IT/Electronics |
| **GeM Portal** | `gem.gov.in` | Government e-Marketplace procurement parameters |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Serverless API Routes)
- **Language**: [TypeScript 5.5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Parsers**: `pdf-parse`, `mammoth` (DOCX)
- **Architecture**: Modular client/server components with zero external database prerequisites for evaluation.

---

## 🧪 Automated Verification Suite

Run the built-in automated test suites to verify functionality:

```bash
# Test Demo Login, Dark Mode, and Maanak Chatbot (20 end-to-end checks)
node scripts/testFinalPolish.js

# Test Workspace Layout, Responsive Width, and Drawer Navigation
node scripts/verifyLayoutAndSidebar.js

# Audit all links against the approved Government domains whitelist
node scripts/verifyLinks.js

# Generate official 5-page Government Tagged PDF
node scripts/generatePdfCdp.js
```

---

## 🏛️ Smart India Hackathon 2026 Context

- **Problem Statement ID**: `SIH262108`
- **Problem Statement**: *AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications*
- **Organization**: **Bureau of Indian Standards (BIS)**
- **Ministry**: Ministry of Consumer Affairs, Food & Public Distribution

---

<div align="center">
  <sub>Built for a Quality-First, Standardized India (आत्मनिर्भर एवं मानक भारत)</sub><br/>
  <b>MaanakSetu © 2026 | Bureau of Indian Standards Intelligence Initiative</b>
</div>
