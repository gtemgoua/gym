## 5-Minute Product Walkthrough

**Audience**: Gym owner evaluating PulseFit for front-desk automation.  
**Goal**: Show end-to-end flow from lead capture to check-in and analytics.

### 1. Welcome & Context (0:00 – 0:45)
- Introduce PulseFit dashboard with live KPIs (Active members, MRR, Occupancy, Failed payments).
- Highlight left navigation for core workflows (Members, Plans, Classes, Billing, Reports, Settings).

### 2. Lead to Member Conversion (0:45 – 2:00)
- Open **Leads**: show pipeline stages (Lead → Trial → Member) with notes and tags.
- Create a new lead via the "Add lead" button to demonstrate capture.
- Promote lead to **Trial** and mention automated welcome email (template editable under Messages).
- Jump to **Members**, show lead now listed as trial with waiver status and contact info.

### 3. Plan & Subscription Setup (2:00 – 3:00)
- Visit **Plans**: review Unlimited Monthly + Punch Card example (price, credits, contract).
- Mention ability to create plan variations (freeze rules, prorations, tax handling).
- Back in **Members**, open member profile and attach plan to start subscription (auto Stripe checkout via hosted flow).
- Note dunning policy configuration (Settings → Dunning Policy) and automatic card retries.

### 4. Scheduling, Booking, and Check-In (3:00 – 4:15)
- Open **Classes**: show upcoming events, capacity, and coach assignments.
- Book the trial member into a class (Bookings page updates instantly; waitlist auto-promote workflow).
- Trigger a kiosk-style check-in (Attendance → “Check-in” API) and demonstrate eligibility validation.
- Show Access Control stub (Settings → Access Control) where door controller sync uses the `/api/access/allowed` feed.

### 5. Billing & Reporting (4:15 – 5:00)
- Visit **Billing**: walk through invoices, payment status, manual capture, CSV export, Stripe webhook syncing.
- Scroll to **Reports**: point out live MRR, churn, LTV snapshots and scheduled weekly email exports.
- Conclude back on the **Dashboard** summarizing today’s numbers and next steps (enable Postmark & Stripe keys, run seed for demo tenant).

Wrap by referencing documentation (`README`, OpenAPI spec) and infrastructure stubs (Dockerfile, Terraform) for production readiness.
