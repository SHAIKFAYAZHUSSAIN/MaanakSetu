# MaanakSetu Access Model & Officer Portal

### 1. Public Read-Only Access (No Login Required)
The public and external evaluators can access the application freely at `/` without logging in. Public visitors can:
* Inspect benchmark Indian Standards (24+ pre-configured standards) and active amendments
* Explore interactive normative Knowledge Graphs
* View mandatory Gazette Quality Control Orders (QCOs) and penalties under Section 29 of the BIS Act 2016
* Examine Specification Gap analysis and CVC/CAG explainability audit trails
* Read and copy GFR 144(i) compliant tender specification clauses

Public users are prevented from creating custom tenders or uploading tender files (PDF/DOCX).

---

### 2. Officer Access & Dedicated Login Page
The dedicated Officer Login portal is accessible at **`/login`**, or by clicking **"Officer Sign In"** in the top navigation bar or menu drawer.

Authorized Procurement Officers unlock:
* Uploading custom PDF / DOCX tender schedules for semantic parsing & gap analysis
* Generating and exporting official 9-clause tender specifications (PDF / Plain Text)
* CVC & CAG statutory explainability logs and compliance checklists

---

### 3. Demo Login (Instant 1-Click Access)
For evaluators, judges, and prototype demonstration, two convenient demo access methods are provided:

1. **⚡ Instant 1-Click Demo Login Button:**
   * Available directly on the **`/login`** page, in the **top header bar**, and in the **navigation drawer**.
   * Clicking **"⚡ Demo Login"** immediately authenticates the session as the authorized Senior Procurement Officer (`P. K. Sharma`) and redirects to the workspace with full permissions.

2. **Auto-Fill & Manual Credentials:**
   * **Email:** `officer@maanaksetu.demo`
   * **Password:** `password@123`
   * **Designation:** Joint Director (Procurement), GeM & CPPP Standards Cell

---

### 4. Environment Configuration
Credentials and HMAC session secret are configured in `.env.local`:
* `AUTH_LOGIN_EMAIL`: `officer@maanaksetu.demo`
* `AUTH_LOGIN_PASSWORD`: `password@123`
* `AUTH_SESSION_SECRET`: 64-character secret key for HMAC SHA-256 session tokens.
