# MaanakSetu Access Model & Prototype Login

### 1. Public Read-Only Access (No Login Required)
The public and external evaluators can access the application freely at `/` without logging in. Public visitors can:
* Inspect benchmark Indian Standards and active amendments
* Explore interactive force-directed normative Knowledge Graphs
* View mandatory Gazette Quality Control Orders (QCOs) and penalties under Section 29 of the BIS Act 2016
* Examine Specification Gap analysis and CVC/CAG explainability audit trails
* Read and copy GFR 144(i) compliant tender specification clauses

Public users are prevented from creating custom tenders or uploading tender files (PDF/DOCX).

### 2. Officer Access (Tender Creation & Document Uploads)
To create custom tenders, upload PDF/DOCX tender schedules, or save tenders, users sign in with authorized Procurement Officer credentials:
* **Email:** `officer@maanaksetu.demo`
* **Password:** `password`

### 3. Environment Configuration
Credentials are configured in `.env.local`:
* `AUTH_LOGIN_EMAIL`: officer@maanaksetu.demo
* `AUTH_LOGIN_PASSWORD`: password
* `AUTH_SESSION_SECRET`: Minimum 32-character secret key for HMAC SHA-256 session tokens.
