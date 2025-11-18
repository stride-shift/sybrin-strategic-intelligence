# JTBD Capability Repurposing Matrix: Solving New Jobs with Existing Sybrin Assets

**Question**: Are we systematically looking at how Sybrin's existing/near-term capabilities could be REPURPOSED to solve additional jobs beyond their original intent?

**Example**: E-checks aren't just for replacing paper checks. The underlying capability is "digital workflow with paper-like controls (audit trails, approval workflows, dispute resolution)." What OTHER jobs need that?

**Methodology**: Map each of the 9 functional jobs + higher-level jobs against Sybrin's product catalog to find repurposing opportunities with minimal new development.

**Date**: November 17, 2025

---

## Sybrin Capability Inventory (Grouped by Core Function)

### Document + Workflow Capabilities
1. **Cheque Processing Module** - Digital truncation, fraud detection, clearing, reconciliation
2. **Document Management System (DMS)** - Capture, OCR, offline capability, mobile, indexing, search
3. **Case Builder/Case Management** - Workflow engine, case tracking, exception handling
4. **Digital Signatures** - Electronic signatures with compliance and encryption
5. **Intelligent Document Processing (IDP)** - AI-powered data extraction

### Real-Time Detection + Monitoring Capabilities
6. **Transaction Monitoring (Tazama)** - Real-time fraud detection, rule builder, ISO 20022
7. **Sybrin Vitals** - System monitoring, auto-recovery, health checks

### Payment + Integration Capabilities
8. **Payments Hub** - Core-agnostic transaction processing, settlement, reconciliation
9. **Switch Manager** - ACH switch, Mojaloop instant payments, routing
10. **TCIB Integration** - Cross-border payment connector

### Identity + Biometric Capabilities
11. **Liveness + Selfie Capture** - Active/passive liveness, facial comparison, deepfake detection
12. **Document Fraud Detection (DocFraud)** - Tampering detection, authenticity verification
13. **Intelligent Document Capture (Sybrin ID Capture)** - Mobile SDKs, offline functionality, barcode reading

### Branch + Agent Capabilities
14. **Digital Branch** - Teller, cash vault, queue management, bill payments
15. **Corporate-to-Bank (C2B)** - Corporate platform, user management, transaction services

### Workflow Creation Capabilities
16. **No-Code Journey Builder** - Visual workflow creator
17. **Sybrin Platform** - Low-code app development, AppBuilder, rules engine

---

## Job-by-Job Repurposing Analysis

### Job 1: Meet BSP AFASA real-time fraud mandate by 2025 without breaking IT budget

**Current Sybrin Solution**: Tazama Transaction Monitoring (designed for fraud detection)

**Repurposing Opportunities**:

1. **Tazama → Regulatory Compliance Monitoring**
   - **Original use**: Detect fraudulent transactions
   - **Repurposed use**: Monitor for ANY regulatory violation in real-time
   - **Jobs this solves**:
     - AFASA fraud compliance (current)
     - AML transaction reporting (FATF requirements)
     - Sanctions screening violations
     - Data protection breaches (GDPR/POPIA)
     - Forex regulation violations
   - **Minimal changes needed**: New rule sets for non-fraud compliance scenarios
   - **White space**: "Universal Regulatory Monitoring Platform" - one engine for all compliance, not just fraud

2. **Tazama → Agent Fraud Detection** (Job 9 overlap)
   - **Original use**: Customer-to-bank fraud
   - **Repurposed use**: Agent-to-customer fraud, agent productivity anomalies
   - **Pattern detection**: Agent behavior peer comparison, velocity checks, location anomalies
   - **Evidence**: Zanaco 32k agents, Faulu 600+ agents need this
   - **White space**: Agent-side fraud platform (currently underserved)

3. **Tazama → Operational Risk Detection**
   - **Original use**: Transaction fraud
   - **Repurposed use**: Detect operational failures before they cascade
   - **Examples**:
     - ATM cash-out patterns predicting failures
     - Branch transaction anomalies indicating staff errors
     - System performance degradation patterns
   - **White space**: Operational anomaly detection as service

---

### Job 2: Navigate check decommissioning without losing revenue or customers

**Current Sybrin Solution**: Cheque Processing Module (digital truncation + clearing)

**Repurposing Opportunities**:

1. **Cheque Processing → "Digital Check" for InstaPay/TIPS**
   - **Original use**: Process physical checks digitally
   - **Core capability**: Digital workflow that preserves paper check benefits (audit trail, stop-payment, multi-party approval, reconciliation, dispute resolution)
   - **Repurposed use**: Apply check-like workflow controls to instant payments
   - **Customer pain**: InstaPay/TIPS are fast but lack corporate controls that checks provided
   - **Solution**: Instant payment transactions that behave like checks (can be "stopped," have approval workflows, provide audit trails)
   - **White space**: "Controlled instant payments" - speed of real-time with governance of checks

2. **Cheque Processing → Any High-Value Transaction Control**
   - **Original use**: Check clearing
   - **Core capability**: Multi-party approval, audit trails, reconciliation, dispute handling
   - **Repurposed use**: Apply to:
     - Loan disbursements (Job 5 - MFI rural loans)
     - Payroll (Job 6 - CARD Bank 329 MBOs)
     - Vendor payments
     - Treasury operations
     - Trade finance
   - **White space**: "Approval workflow engine for any financial transaction"

3. **Cheque Processing → Offline Transaction Ledger** (Job 5 overlap)
   - **Original use**: Check images can be captured offline, processed later
   - **Core capability**: Offline-first transaction capture with eventual reconciliation
   - **Repurposed use**: MFI field officers capture loan applications/repayments offline, sync when connected
   - **Evidence**: Agora MFI Zambia bike-based officers, poor connectivity
   - **White space**: Offline-first transaction system for rural operations

---

### Job 3: Reach 98% self-service transactions without losing the 20% who can't/won't go digital

**Current Sybrin Solution**: Digital Branch (teller, queue management) + No-Code Journey Builder

**Repurposing Opportunities**:

1. **Journey Builder → Transition Diagnosis Engine**
   - **Original use**: Create digital onboarding workflows
   - **Core capability**: Conditional workflow based on user characteristics
   - **Repurposed use**: Diagnose WHY specific customers resist digital, prescribe intervention
   - **How it works**:
     - Customer profiling: Transaction pattern analysis → identify digital resisters
     - Diagnosis workflows: Test for literacy, trust, access, preference
     - Intervention routing: Send to assisted digital, agent training, exception handling
   - **White space**: "Customer transition intelligence" (from White Space #4 in original JTBD)

2. **Queue Management → Assisted Digital Hub**
   - **Original use**: Manage branch queues
   - **Core capability**: Route customers to appropriate service channel
   - **Repurposed use**: Route digital resisters to "assisted digital" stations
   - **Integration**: Queue system detects customer attempting digital but struggling → routes to "digital helper" desk
   - **Equity Bank use case**: 86% → 98% digital requires managing the remaining 12%
   - **White space**: Branch transformation from transaction processing to digital enablement

---

### Job 4: Manage 6M+ digital users with same operational capacity as 1M users

**Current Sybrin Solution**: Transaction Monitoring (Tazama) + Case Management + Sybrin Vitals

**Repurposing Opportunities**:

1. **Tazama → Customer Service Anomaly Detection**
   - **Original use**: Fraud detection
   - **Core capability**: Real-time pattern detection and alerting
   - **Repurposed use**: Detect customers about to churn, complain, or need intervention
   - **Patterns to detect**:
     - Failed transaction sequences (frustration indicators)
     - Login/logout patterns (struggling with app)
     - Balance inquiry without transaction (hesitation)
     - Repeated small transactions (testing, lack of confidence)
   - **Action**: Proactive outreach before customer calls support
   - **White space**: "Predictive customer service" - reduce support volume by solving problems before complaints

2. **Case Management → Automated Exception Handling**
   - **Original use**: KYC/AML case workflows
   - **Core capability**: Route, track, and resolve exceptions
   - **Repurposed use**: Automate 80% of customer service exception handling
   - **NMB Tanzania use case**: 6M digital users → can't manually review every exception
   - **Examples**:
     - Failed biometric match → auto-route to video verification
     - Stuck transaction → auto-reconciliation workflow
     - Account lockout → risk-based unlock decision tree
   - **White space**: Self-healing customer service (exceptions resolve without human intervention)

3. **Sybrin Vitals → Customer Journey Health Monitoring**
   - **Original use**: System uptime monitoring
   - **Core capability**: Monitor health, predict failures, auto-recover
   - **Repurposed use**: Monitor customer journey health (app UX, transaction success rates, feature adoption)
   - **Metrics**:
     - Transaction completion rates by customer segment
     - Feature adoption curves
     - Journey drop-off points
   - **Action**: Auto-adjust UX, trigger interventions, route to human support
   - **White space**: "Customer experience observability" (treat customer journeys like system uptime)

---

### Job 5: Serve 90% rural clients profitably when connectivity is poor and field officers travel 100km on bikes

**Current Sybrin Solution**: Document Capture (offline-capable) + Biometrics (mobile SDKs) + Cheque Processing (offline workflow)

**Repurposing Opportunities**:

1. **Document Capture + Offline Capability → Rural Loan Origination Suite**
   - **Original use**: Capture IDs/documents for KYC
   - **Core capability**: Offline-first mobile capture, sync when connected
   - **Repurposed use**: Complete loan origination offline
   - **Workflow**:
     - Field officer on bike captures: borrower photo, ID, thumbprint, loan application (paper form via OCR), collateral photos
     - All captured offline on mobile device
     - Syncs to HQ when officer returns to town (WiFi/3G)
     - Back-office processes application
   - **Evidence**: Agora MFI Zambia 90% rural, bike officers, poor connectivity
   - **White space**: "Offline-first MFI origination" (vs. current online-only digital lending)

2. **Biometric Liveness + Geolocation → Field Officer Safety System**
   - **Original use**: Verify customer identity
   - **Core capability**: Live selfie + GPS location
   - **Repurposed use**: Field officer check-in/safety monitoring
   - **Workflow**:
     - Officer takes selfie + GPS at each village visit
     - HQ sees real-time officer locations on map
     - Panic button (photo + GPS + audio) if threatened
     - Remote wipe if device stolen
   - **Evidence**: Emotional Job E8 - "Feel safe when traveling alone to remote villages with cash/devices"
   - **White space**: "Safety-by-design field tools" (from Emotional Jobs analysis)

3. **Offline Document Capture → Community Vouching as Alternative ID**
   - **Original use**: Capture government-issued ID
   - **Core capability**: Capture ANY document, extract data via OCR
   - **Repurposed use**: Capture community vouching evidence as identity proof
   - **Workflow**:
     - Rural borrower lacks national ID
     - Field officer captures: Village chief letter, church leader attestation, neighbor signatures, borrower family photos
     - OCR extracts names/relationships
     - Back-office verifies via social network analysis
   - **White space**: "Social identity verification" (alternative to government ID for unbanked)

---

### Job 6: Manage 329 Micro Banking Offices with same oversight as 54 branches

**Current Sybrin Solution**: Digital Branch (teller, cash vault, queue) + Case Management + Vitals + Transaction Monitoring

**Repurposing Opportunities**:

1. **Digital Branch → MBO Network Management Platform**
   - **Original use**: Digitize large branches
   - **Core capability**: Teller functions, cash management, transaction processing
   - **Repurposed use**: Simplified branch platform for micro-offices (3 staff, <500 customers)
   - **Key adaptations**:
     - Ultra-lightweight (runs on basic tablet)
     - Offline-first (rural MBOs have poor connectivity)
     - Simplified compliance (non-bankers can operate)
     - Network-level dashboards (view all 329 MBOs at once)
   - **CARD Bank use case**: 329 MBOs, 54 branches
   - **White space**: "Micro-branch network management" (from original JTBD White Space #3)

2. **Transaction Monitoring → MBO Anomaly Detection**
   - **Original use**: Fraud detection
   - **Core capability**: Detect patterns across transaction streams
   - **Repurposed use**: Detect problems across 329 MBOs
   - **Anomalies to detect**:
     - MBO with unusual transaction volumes (fraud or operational issue)
     - MBO with declining activity (staff problems, local competition)
     - MBO with high error rates (training needed)
     - MBO cash imbalances (theft or process failure)
   - **Action**: Alert regional manager, trigger remote audit, deploy support
   - **White space**: "Network intelligence for distributed micro-branches"

3. **Case Management → MBO Exception Handling**
   - **Original use**: KYC/AML cases
   - **Core capability**: Route exceptions to appropriate resolver
   - **Repurposed use**: Route MBO operational problems
   - **Examples**:
     - MBO staff can't resolve customer issue → route to HQ expert via video call
     - MBO transaction limit exceeded → route to regional manager for approval
     - MBO compliance violation → route to compliance team
   - **Result**: MBOs operate autonomously for 95% of cases, escalate 5%
   - **White space**: "Distributed decision-making platform" (empower local staff with HQ backup)

---

### Job 7: Connect to TIPS without replacing our core banking system

**Current Sybrin Solution**: Payments Hub (core-agnostic) + TCIB Integration Microservice

**Repurposing Opportunities**:

1. **Payments Hub → Universal Legacy System Facade**
   - **Original use**: Connect any core to instant payment schemes
   - **Core capability**: Core-agnostic transaction processing, state management, protocol translation
   - **Repurposed use**: Connect ANY legacy system to ANY modern API-based service
   - **Applications beyond payments**:
     - Legacy core → Cloud banking apps
     - Legacy core → Fintech partnerships
     - Legacy core → Open banking APIs
     - Legacy core → Digital wallet integrations
   - **White space**: "Legacy-to-modern adapter as a service" (not just payments)

2. **TCIB Integration Microservice → Reusable Integration Pattern**
   - **Original use**: Connect to TCIB cross-border scheme
   - **Core capability**: Microservice that translates between core and scheme
   - **Repurposed use**: Template for ANY scheme integration
   - **Pattern**:
     - Core-facing adapter (handles core's unique APIs)
     - Scheme-facing adapter (handles scheme's requirements)
     - Business logic in middle
   - **Applications**: TIPS, iPSO, InstaPay, PESONet, SWIFT, mobile money, any payment scheme
   - **White space**: "Integration microservice factory" (rapid scheme onboarding)

---

### Job 8: Process InstaPay/PESONet at scale without building expensive real-time infrastructure

**Current Sybrin Solution**: Payments Hub + Switch Manager (Mojaloop)

**Repurposing Opportunities**:

1. **Payments Hub → Instant Payment Facade for Batch-Mode Cores**
   - **Original use**: Real-time payment processing
   - **Core capability**: Maintain transaction state externally, sync to core when available
   - **Repurposed use**: Make batch-mode cores appear real-time
   - **How it works**:
     - Customer initiates InstaPay transaction
     - Payments Hub accepts, validates, settles in real-time (authoritative ledger)
     - Core is still batch-processing overnight
     - Payments Hub syncs to core as batch file overnight
     - Core sees normal batch transactions, but customers experienced real-time
   - **Evidence**: Philippines rural banks, Tanzania community banks with legacy cores
   - **White space**: "Instant payments for batch cores" (from original JTBD White Space #2)

2. **Mojaloop Switch → White-Label Instant Payments for Banks**
   - **Original use**: Run instant payment scheme infrastructure
   - **Core capability**: Open-source, proven instant payment switch
   - **Repurposed use**: Banks offer instant payments BEFORE national scheme exists
   - **Model**: Sybrin operates Mojaloop switch; multiple banks connect; offers instant bank-to-bank transfers
   - **Example**: Botswana banks waiting for national instant payment scheme → Sybrin runs interim multi-bank switch
   - **White space**: "Instant payments as infrastructure service" (Sybrin becomes scheme operator)

---

### Job 9: Digitize 32,000 agents without losing agent productivity or creating fraud exposure

**Current Sybrin Solution**: Transaction Monitoring (Tazama) + Biometrics + Document Capture (mobile)

**Repurposing Opportunities**:

1. **Transaction Monitoring → Agent Fraud Prevention**
   - **Original use**: Customer fraud
   - **Core capability**: Real-time pattern detection
   - **Repurposed use**: Agent-side fraud detection
   - **Patterns to detect**:
     - Agent transactions vs. peer agents (outlier detection)
     - Agent customer complaints vs. peers
     - Agent transaction velocity (too fast = fake deposits)
     - Agent location anomalies (GPS says agent not at claimed location)
     - Agent device switching (sharing credentials)
   - **Zanaco use case**: 32k agents = impossible to manually monitor
   - **White space**: "Agent fraud prevention" (from original JTBD White Space #5)

2. **Biometrics + Document Capture → Ultra-Low-Cost Agent Tools**
   - **Original use**: Digital onboarding on smartphones
   - **Core capability**: Mobile SDKs for capture, offline capability
   - **Repurposed use**: Agent tools that work on feature phones (USSD) OR basic smartphones
   - **Feature phone mode**:
     - USSD menus for transactions
     - SMS receipts
     - Biometric via Bluetooth dongle (<$20 vs. $200 smartphone)
   - **Smartphone mode**: Progressive Web App (no app store download)
   - **Evidence**: 32k agents × $200 smartphone = $6.4M; vs. 32k agents × $20 dongle = $640k
   - **White space**: "Feature phone agent banking" (10x cost reduction)

3. **Digital Signatures → Agent Authorization System**
   - **Original use**: Customer e-signatures for account opening
   - **Core capability**: Cryptographic signatures with compliance
   - **Repurposed use**: Agent transaction authorization
   - **How it works**:
     - Agent initiates transaction on behalf of customer
     - Customer signs digitally on agent's device (biometric thumbprint)
     - Signature cryptographically binds customer to transaction
     - Prevents agent fraud (fake transactions)
   - **White space**: "Cryptographic non-repudiation for agent transactions"

---

## Higher-Level Job Repurposing Opportunities

### Meta Job: Turn incumbent constraints into competitive advantages

**Repurposing the "Constraint" Itself**:

1. **Legacy Core as Trust Infrastructure** (from Higher-Level Jobs Analysis)
   - **Sybrin capability to repurpose**: Payments Hub + Integration Microservices
   - **How**:
     - Fintech partners with legacy bank
     - Fintech provides UX/speed
     - Legacy bank provides: Deposit insurance, regulatory cover, fraud protection (via Tazama), compliance (via Case Management)
     - Sybrin provides: Integration layer that connects them
   - **Revenue model**: Legacy bank pays for integration; fintech pays for trust services
   - **White space**: "Trust-as-a-Service broker" (Sybrin connects asset-light and asset-heavy players)

2. **Branch Network as Fintech Distribution**
   - **Sybrin capability to repurpose**: Digital Branch + Queue Management + C2B platform
   - **How**:
     - Legacy bank has 100 branches (cost center)
     - Fintech needs physical distribution (for cash-in/out, customer acquisition)
     - Sybrin provides: Branch platform that can handle both bank transactions AND fintech services
     - Branch becomes multi-tenant (serves bank customers AND fintech customers)
   - **Revenue model**: Bank charges fintech for branch access; Sybrin charges platform fees
   - **White space**: "Multi-tenant branch infrastructure" (monetize legacy asset)

---

## Systematic Repurposing by Capability Type

### Type 1: "Real-Time Detection" Capabilities (Tazama, Vitals)

**Original use**: Fraud detection, system monitoring

**Repurposing pattern**: ANY domain where real-time anomaly detection adds value

**Jobs addressed**:
- Regulatory compliance monitoring (Job 1)
- Agent fraud (Job 9)
- Operational risk (Job 4)
- MBO oversight (Job 6)
- Customer service prediction (Job 4)

**Product name**: "Sybrin Detect" - Universal Real-Time Anomaly Platform

---

### Type 2: "Offline-First" Capabilities (Document Capture, Cheque Processing, Biometrics)

**Original use**: KYC, check truncation, identity verification

**Repurposing pattern**: ANY domain where connectivity is unreliable

**Jobs addressed**:
- Rural MFI operations (Job 5)
- MBO operations (Job 6)
- Field officer workflows (Job 5)
- Agent tools in remote areas (Job 9)

**Product name**: "Sybrin Offline" - Sync-When-Connected Transaction Suite

---

### Type 3: "Core-Agnostic Integration" Capabilities (Payments Hub, Integration Microservices)

**Original use**: Connect legacy cores to instant payment schemes

**Repurposing pattern**: Connect legacy systems to ANY modern service

**Jobs addressed**:
- TIPS integration (Job 7)
- InstaPay processing (Job 8)
- Batch-to-real-time facade (Job 8)
- Open banking APIs
- Fintech partnerships

**Product name**: "Sybrin Connect" - Legacy-to-Modern Integration Platform

---

### Type 4: "Workflow + Case Management" Capabilities (Journey Builder, Case Management, DMS)

**Original use**: Digital onboarding, KYC/AML cases, document processing

**Repurposing pattern**: ANY complex workflow that needs routing, tracking, exception handling

**Jobs addressed**:
- Transition diagnosis (Job 3)
- MBO exception handling (Job 6)
- Customer service automation (Job 4)
- Loan origination (Job 5)
- Compliance processes (Job 1)

**Product name**: "Sybrin Flow" - No-Code Workflow Automation Platform

---

### Type 5: "Multi-Party Approval + Audit Trail" Capabilities (Cheque Processing, Digital Signatures)

**Original use**: Check clearing, e-signatures

**Repurposing pattern**: ANY high-value transaction that needs governance

**Jobs addressed**:
- Controlled instant payments (Job 2)
- Loan disbursements (Job 5)
- Treasury operations
- Trade finance
- Agent authorization (Job 9)

**Product name**: "Sybrin Approve" - Transaction Governance Engine

---

## Capability Repurposing Roadmap (18-Month Exit Focus)

### Tier 1: Repurposing with ZERO New Development (Just Positioning)

1. **Tazama → Regulatory Compliance Monitoring**
   - **Effort**: Create new rule sets for AFASA, AML, sanctions
   - **Time**: 1-2 months
   - **Market**: Philippines AFASA, Namibia FATF, Botswana AML

2. **Payments Hub → Instant Payment Facade for Batch Cores**
   - **Effort**: Document existing capability (may already exist)
   - **Time**: 1 month
   - **Market**: Tanzania community banks, Philippines rural banks

3. **Journey Builder → Any Workflow (Not Just Onboarding)**
   - **Effort**: Rebrand + create templates for loan origination, compliance
   - **Time**: 2 months
   - **Market**: All markets, any workflow-heavy process

### Tier 2: Repurposing with Minor Development (1-3 Months)

4. **Tazama → Agent Fraud Detection**
   - **Effort**: Add peer comparison analytics, GPS integration
   - **Time**: 2-3 months
   - **Market**: Kenya (Faulu 600 agents), Zambia (Zanaco 32k agents)

5. **Digital Branch → MBO Network Management**
   - **Effort**: Simplify UI, add offline mode, create network dashboards
   - **Time**: 3 months
   - **Market**: Philippines (CARD Bank 329 MBOs)

6. **Document Capture → Offline Loan Origination**
   - **Effort**: Bundle existing capabilities into MFI-specific workflow
   - **Time**: 2 months
   - **Market**: Zambia (Agora MFI), Kenya MFIs

### Tier 3: Repurposing with Moderate Development (3-6 Months)

7. **Queue Management → Assisted Digital Hub**
   - **Effort**: Add customer profiling, intervention routing
   - **Time**: 4 months
   - **Market**: Kenya (Equity Bank 86%→98% digital target)

8. **Biometrics + GPS → Field Officer Safety System**
   - **Effort**: Add panic button, geofencing, remote wipe
   - **Time**: 3 months
   - **Market**: All MFI markets (Emotional Job E8)

9. **Cheque Processing → Controlled Instant Payments**
   - **Effort**: Apply check workflow logic to InstaPay/TIPS transactions
   - **Time**: 4-6 months
   - **Market**: Kenya (check decommissioning), Philippines (InstaPay)

---

## White Space Revealed by Systematic Repurposing

### New White Space #1: "Sybrin Detect" - Universal Anomaly Detection Platform

**Core capability**: Real-time pattern detection (from Tazama)

**Repurposed applications**:
- Fraud detection (original)
- Regulatory compliance monitoring
- Agent performance/fraud
- Operational risk
- Customer service prediction
- MBO oversight

**Market positioning**: "One detection engine for all risks"

**18-month opportunity**: Package Tazama with compliance rule sets for each geography's regulatory requirements

---

### New White Space #2: "Sybrin Offline" - Sync-When-Connected Suite

**Core capability**: Offline-first transaction capture (from Document Capture + Cheque Processing)

**Repurposed applications**:
- KYC (original)
- Loan origination
- Repayment collection
- Agent transactions
- MBO operations
- Field officer workflows

**Market positioning**: "Built for poor connectivity, works anywhere"

**18-month opportunity**: Target all rural/MFI segments across Kenya, Zambia, Philippines

---

### New White Space #3: "Sybrin Connect" - Legacy Integration Platform

**Core capability**: Core-agnostic transaction processing (from Payments Hub)

**Repurposed applications**:
- Instant payment integration (original)
- Batch-to-real-time facade
- Open banking APIs
- Fintech partnerships
- Mobile money integration
- Digital wallet connections

**Market positioning**: "Make any core modern without replacing it"

**18-month opportunity**: Position against expensive core replacements in all markets

---

### New White Space #4: "Sybrin Flow" - No-Code Workflow Automation

**Core capability**: Visual workflow builder (from Journey Builder)

**Repurposed applications**:
- Digital onboarding (original)
- Loan origination
- Compliance processes
- Customer service workflows
- Agent onboarding
- Any operational process

**Market positioning**: "Build any workflow without developers"

**18-month opportunity**: Sell to banks' business units (not just IT) for rapid process digitization

---

### New White Space #5: "Sybrin Approve" - Transaction Governance Engine

**Core capability**: Multi-party approval + audit trails (from Cheque Processing + Digital Signatures)

**Repurposed applications**:
- Check clearing (original)
- Instant payment controls
- Loan disbursements
- Payroll
- Treasury operations
- Trade finance
- High-value transfers

**Market positioning**: "Governance for any financial transaction"

**18-month opportunity**: Target corporate customers (C2B platform expansion)

---

## Strategic Implications for 18-Month Exit

### What This Changes:

**Before repurposing analysis**:
- Sybrin has ~20 distinct products
- Each product addresses 1-2 specific jobs
- New jobs require new product development
- Exit story: "We have many products"

**After repurposing analysis**:
- Sybrin has 5 core capability platforms
- Each platform addresses 5-10 jobs through configuration/positioning
- New jobs addressed by repurposing, not development
- Exit story: "We have platform capabilities that solve emerging jobs faster than competitors"

### Specific Exit Story Improvements:

1. **From**: "We built Tazama for AFASA compliance in Philippines"
   **To**: "We have universal real-time detection platform that solves fraud, compliance, operations, and agent oversight across all markets"

2. **From**: "We have cheque processing for Kenya/Zambia"
   **To**: "We have transaction governance engine that preserves audit/control for ANY payment type, including instant payments"

3. **From**: "We have digital onboarding"
   **To**: "We have no-code workflow platform that digitizes ANY process (onboarding, lending, compliance, operations)"

4. **From**: "We connect cores to instant payment schemes"
   **To**: "We have legacy integration platform that connects ANY old system to ANY new service (payments, APIs, fintechs, wallets)"

### Revenue Impact (18-Month Exit Window):

**Repurposing opportunities with FASTEST time-to-revenue**:

1. **Tazama for AFASA compliance** (Philippines)
   - Existing product, new positioning
   - Time: 1 month
   - Revenue: Included in Philippines ZAR 6M FY26 projection

2. **Tazama for Namibia FATF compliance**
   - Existing product, new market
   - Time: 2 months (if Namibia resourced)
   - Revenue: Part of Namibia $6.8-9.4M 3-year SOM

3. **Journey Builder for loan origination** (Kenya MFIs, Philippines rural banks)
   - Existing product, new use case
   - Time: 2 months (create templates)
   - Revenue: Attach to existing digital onboarding sales

4. **Payments Hub batch-to-real-time facade** (Tanzania community banks)
   - Existing capability, document + position
   - Time: 1 month
   - Revenue: Tanzania market expansion

5. **Agent fraud detection** (Kenya Faulu, Zambia Zanaco)
   - Minor Tazama extension
   - Time: 3 months
   - Revenue: Upsell to existing agent banking customers

**Total incremental revenue potential from repurposing** (18 months): $2-4M
- Mostly from faster sales cycles (sell existing products into new jobs)
- Minimal development investment required
- Higher margins (software configuration vs. custom development)

---

## Conclusion: Systematic Repurposing is Strategic Leverage

**Key insight**: Sybrin doesn't need to build 20 new products to address 100 customer jobs. Sybrin needs to systematically repurpose 5 core capabilities to solve 20 jobs each.

**Repurposing advantages**:
1. **Speed**: 1-3 months vs. 12-18 months for new product
2. **Cost**: Configuration vs. development
3. **Risk**: Proven technology vs. unproven new product
4. **Sales**: Easier to sell "different use of proven product" vs. "brand new unproven product"
5. **Exit story**: "Platform capabilities" > "point products"

**For 18-month exit**:
- Focus on Tier 1 repurposing (zero new development)
- Selectively pursue Tier 2 (minor development, high revenue)
- Defer Tier 3 to post-exit (moderate development, longer payback)

**For post-exit growth**:
- Productize the 5 core capability platforms (Detect, Offline, Connect, Flow, Approve)
- Create marketplace of "applications" built on each platform
- Position as horizontal platform provider, not vertical product vendor

---

**Analysis Date**: November 17, 2025
**Methodology**: Systematic mapping of Sybrin product catalog against identified JTBD to find repurposing opportunities
**Key Finding**: 80% of identified jobs can be addressed by repurposing existing Sybrin capabilities with minimal development

---

# SECTION 2: FEASIBILITY REALITY CHECKS & PRIORITIZATION

> **Note**: The analysis above presents the conceptual repurposing opportunities. This section adds realistic assessment of what truly exists vs. what needs building, honest effort estimates, and prioritization for 18-month exit focus.

---

## Feasibility Reality Check: What Exists vs. What Needs Building

### HIGH FEASIBILITY (Exists, Needs Packaging/Positioning Only)

#### 1. Tazama → AFASA/Regulatory Compliance Monitoring
**What exists today**:
- Real-time transaction monitoring engine
- Rule builder and configuration
- ISO 20022 message support
- Alert and case management integration

**What needs to be built** (1-2 months):
- AFASA-specific rule sets (BSP fraud patterns)
- AML/sanctions rule packs per geography
- Compliance-specific reporting templates
- Regulatory attestation/audit trail formatting

**Feasibility rating**: 95% - This is truly just new rule sets + templates

**First customer**: Philippines banks (AFASA mandate), Namibia (FATF)

---

#### 2. Payments Hub → Batch-Core Instant Payment Facade
**What exists today**:
- Core-agnostic transaction processing
- External state management (maintains transaction ledger separate from core)
- Reconciliation engine
- Settlement management

**What needs validation** (1 month):
- Confirm batch-core sync patterns work robustly
- Document reconciliation exception handling
- Create implementation accelerator/runbook

**Feasibility rating**: 90% - Likely already done in projects, just needs productization

**First customer**: Tanzania community banks, Philippines rural banks with batch cores

---

#### 3. Journey Builder → General Workflow Engine ("Sybrin Flow")
**What exists today**:
- Visual workflow designer
- Conditional branching, multi-step flows
- Human + system task orchestration
- API integration capability

**What needs to be built** (2 months):
- Workflow templates for: loan origination, compliance processes, exception handling
- Template library UX
- Governance patterns (roles, permissions per workflow type)
- Documentation for non-IT business users

**Feasibility rating**: 85% - Core platform exists, needs use-case packaging

**First customer**: Kenya MFIs (loan origination), Philippines rural banks (compliance workflows)

---

### MEDIUM FEASIBILITY (Exists But Needs 10-30% Product Enhancement)

#### 4. Tazama → Agent Fraud Detection
**What exists today**:
- Real-time detection engine
- Pattern matching and alerting
- Rule configuration

**What needs to be built** (2-3 months):
- Peer agent comparison analytics (statistical outlier detection across agent population)
- GPS/location integration for agent mobility patterns
- Agent-specific dashboard and alerting UX
- Agent performance scoring (not just fraud, but productivity)

**Feasibility rating**: 70% - Engine exists, needs agent-specific data model + analytics

**Effort classification**: "Minor new product module" not "just configuration"

**First customer**: Zambia Zanaco (32k agents), Kenya Faulu (600 agents)

---

#### 5. Digital Branch → MBO Network Management Platform
**What exists today**:
- Teller, cash vault, transaction processing
- Branch management core functions

**What needs to be built** (3-4 months):
- Offline-first mode (full transaction capability offline, sync later)
- Ultra-lightweight mobile/tablet version (current may be too heavy)
- Network-level dashboards (329 MBOs on single screen with drill-down)
- Simplified compliance UI (non-banker-friendly)
- MBO-specific training mode

**Feasibility rating**: 65% - Core exists, but MBO adaptations are non-trivial

**Effort classification**: "Specialized productization" - more than configuration, less than new product

**First customer**: Philippines CARD Bank (329 MBOs)

---

#### 6. Document Capture → Offline MFI Loan Origination Suite
**What exists today**:
- Mobile SDK with offline capability
- Document capture (ID, photos, OCR)
- Sync-when-connected

**What needs to be built** (2-3 months):
- MFI loan workflow templates (bundled: borrower ID, loan app, collateral, guarantor)
- Offline form capture (paper loan applications via OCR)
- Geolocation tagging (for field officer location verification)
- Back-office loan processing workflow integration
- MFI-specific training materials

**Feasibility rating**: 70% - Capabilities exist, needs MFI workflow packaging

**Effort classification**: "Vertical solution bundle" - assembly + config + templates

**First customer**: Zambia Agora MFI (bike-based officers), Kenya MFIs

---

### LOWER FEASIBILITY (Requires Significant New Development = "Small New Product")

#### 7. Tazama → Universal Regulatory Monitoring Platform
**What exists today**:
- Real-time detection for payment transactions
- Rule engine

**What needs to be built** (4-6 months):
- Ingest NON-payment data sources (system logs, access logs, HR data, document access)
- Richer policy/rule model per geography per regulation
- Cross-domain correlation (detect patterns across fraud + compliance + ops)
- Audit-friendly attestation reporting
- Regulator-specific export formats

**Feasibility rating**: 40% - Engine exists, but "universal monitoring" is bigger scope

**Effort classification**: "New product module" - this is Tazama v2 with broader data scope

**Reality check**: Don't oversell this as "zero dev" - it's a 6-month product evolution

**First customer**: Wait for Tier 1/2 repurposing traction, then pilot with sophisticated bank (NMB Tanzania, KCB Kenya)

---

#### 8. Sybrin Vitals → Customer Journey Health Monitoring
**What exists today**:
- System uptime monitoring
- Health check automation
- Auto-recovery

**What needs to be built** (5-7 months):
- Ingest customer UX event data (app analytics, transaction telemetry)
- Customer journey modeling (define "healthy" vs. "unhealthy" journey patterns)
- Segment-specific health metrics
- Intervention triggering (route to human support, adjust UX)
- Integration with customer service platforms

**Feasibility rating**: 30% - Concept is sound, but this is truly a new product

**Effort classification**: "New product" - not a repurposing, a conceptual leap

**Reality check**: Defer to post-exit unless a flagship customer funds development

---

#### 9. Offline Document Capture → Community Vouching / Social Identity Verification
**What exists today**:
- Document capture (any document type)
- OCR data extraction

**What needs to be built** (6-12 months):
- Social identity schema (village chief letters, community attestations, family networks)
- Social network analysis / graph database
- Risk scoring for non-traditional ID
- Regulator engagement & approval (this is the REAL blocker)
- Compliance framework for alternative identity

**Feasibility rating**: 25% - Technically feasible, but regulatory/compliance risk is high

**Effort classification**: "R&D project" - needs pilot + regulator partnership before productization

**Reality check**: Amazing conceptually, but wrong timeline for exit. Post-exit innovation play.

---

#### 10. Branch Network as Multi-Tenant Fintech Distribution
**What exists today**:
- Digital Branch platform

**What needs to be built** (8-12 months):
- Multi-tenancy (one branch serves multiple brands/entities)
- Commercial agreements framework (bank-fintech revenue sharing)
- Tenant onboarding workflows
- Segregated accounting/reconciliation per tenant
- Regulatory compliance (banks providing services to fintechs)

**Feasibility rating**: 20% - Technically possible, commercially/operationally complex

**Effort classification**: "Business model innovation" - not just product, entire go-to-market

**Reality check**: Visionary but requires long sales cycles, complex partnerships. Post-exit.

---

## Prioritization Framework for 18-Month Exit

### Prioritization Criteria

| Priority | Criteria |
|----------|----------|
| **P0 (Do Now)** | High feasibility (>80%) + Clear first customer + Revenue in 12 months + Strengthens exit narrative |
| **P1 (Do Soon)** | Medium feasibility (60-80%) + Identified first customer + Revenue in 18 months + Key differentiation |
| **P2 (Evaluate)** | Medium feasibility + Strategic but no immediate customer + May generate revenue post-exit |
| **P3 (Defer)** | Low feasibility (<50%) OR long development OR regulatory blockers + Post-exit opportunity |

---

### P0 - DO NOW (Exit-Critical, Q1-Q2 2026 Delivery)

#### P0-1: Tazama → AFASA/FATF Regulatory Compliance Monitoring
- **Feasibility**: 95%
- **Effort**: 1-2 months (rule sets + reporting templates)
- **Revenue potential**: Included in Philippines ZAR 6M FY26 + Namibia early wins
- **First customers**: Philippines banks (AFASA deadline), Namibia (FATF pressure)
- **Exit narrative value**: "Universal compliance platform, not just fraud"
- **Action**: Immediate - assign team, create AFASA rule packs, pilot with 2 Philippines banks

#### P0-2: Payments Hub → Batch-Core Instant Payment Facade
- **Feasibility**: 90%
- **Effort**: 1 month (document + create implementation accelerator)
- **Revenue potential**: Tanzania expansion + Philippines rural bank upsells
- **First customers**: Tanzania community banks, Philippines rural banks with EOL cores
- **Exit narrative value**: "Instant payments without core replacement = massive TAM"
- **Action**: Validate capability exists in current implementations, create repeatable deployment package

#### P0-3: Journey Builder → General Workflow Engine (Sybrin Flow)
- **Feasibility**: 85%
- **Effort**: 2 months (templates + business user UX)
- **Revenue potential**: Attach to existing digital onboarding sales (loan origination template = upsell)
- **First customers**: Kenya MFIs, Philippines rural banks
- **Exit narrative value**: "Horizontal platform, not just vertical onboarding tool"
- **Action**: Create 3 templates (loan origination, compliance workflows, customer service exceptions), package as "Sybrin Flow"

---

### P1 - DO SOON (Exit-Valuable, Q2-Q3 2026 Delivery)

#### P1-1: Tazama → Agent Fraud Detection
- **Feasibility**: 70%
- **Effort**: 2-3 months (peer analytics + agent UX)
- **Revenue potential**: Kenya/Zambia upsells to existing agent banking customers
- **First customers**: Zambia Zanaco (32k agents), Kenya Faulu (600 agents)
- **Exit narrative value**: "Agent oversight = differentiation in agent banking market"
- **Action**: Start after P0-1 complete (same team, similar product)

#### P1-2: Document Capture → Offline MFI Loan Origination Suite
- **Feasibility**: 70%
- **Effort**: 2-3 months (MFI workflow templates + field officer UX)
- **Revenue potential**: Zambia MFI wins, Kenya MFI expansion
- **First customers**: Zambia Agora MFI, Kenya MFIs
- **Exit narrative value**: "Rural/MFI specialist = underserved segment ownership"
- **Action**: Validate with Agora MFI in Q1 2026, package as "Rural Lending Suite"

#### P1-3: Digital Branch → MBO Network Management
- **Feasibility**: 65%
- **Effort**: 3-4 months (offline mode + network dashboards + simplification)
- **Revenue potential**: Philippines CARD Bank flagship win (329 MBOs)
- **First customers**: CARD Bank (reference customer for micro-branch concept globally)
- **Exit narrative value**: "Micro-branch network management = new category creation"
- **Action**: Pilot with CARD Bank Q2 2026, co-develop with their input

---

### P2 - EVALUATE (Strategic Value, Q3-Q4 2026 Consideration)

#### P2-1: Queue Management → Assisted Digital Hub
- **Feasibility**: 60%
- **Effort**: 4 months (customer profiling + intervention routing)
- **Revenue potential**: Kenya Equity Bank (86%→98% digital push)
- **Strategic value**: Helps banks achieve digital adoption targets without customer loss
- **Risk**: Equity Bank may need this, but have they budgeted for it?
- **Action**: Validate demand with Equity, delay development until customer commits

#### P2-2: Biometrics + GPS → Field Officer Safety System
- **Feasibility**: 65%
- **Effort**: 3 months (panic button + geofencing + remote wipe)
- **Revenue potential**: Differentiation in MFI sales, but not primary purchase driver
- **Strategic value**: Emotional job E8 (safety) - high impact but hard to measure ROI
- **Risk**: Not a line item in budgets, requires HR/security buy-in
- **Action**: Build AFTER P1-2 (offline MFI suite) proves successful, position as add-on module

#### P2-3: Cheque Processing → Controlled Instant Payments
- **Feasibility**: 60%
- **Effort**: 4-6 months (apply check workflow to instant payments)
- **Revenue potential**: Kenya (check decommissioning), Philippines (InstaPay governance)
- **Strategic value**: Solves corporate "loss of check controls" pain
- **Risk**: Requires buy-in from both banks AND corporate customers
- **Action**: Evaluate in Q2 2026 - if Kenya check decommissioning accelerates, prioritize

---

### P3 - DEFER (Post-Exit Innovation)

#### P3-1: Tazama → Universal Regulatory Monitoring Platform (all regulations, all data sources)
- **Why defer**: 6-month product evolution, no immediate customer funding it
- **Post-exit value**: High - could become Sybrin's "GRC platform" offering
- **Recommendation**: Prove P0-1 (AFASA compliance) first, then expand scope

#### P3-2: Vitals → Customer Journey Health Monitoring
- **Why defer**: Truly a new product (30% feasibility), 5-7 month build
- **Post-exit value**: High - "observability for customer experience" is hot category
- **Recommendation**: Innovation roadmap, not exit revenue driver

#### P3-3: Offline Capture → Community Vouching / Social Identity
- **Why defer**: Regulatory approval required, long development (6-12 months)
- **Post-exit value**: Very high - frontier markets, financial inclusion play
- **Recommendation**: R&D project with donor/DFI funding post-exit

#### P3-4: Branch Network → Multi-Tenant Fintech Distribution
- **Why defer**: Business model innovation, complex partnerships, 8-12 month cycles
- **Post-exit value**: Very high - platform play, recurring revenue
- **Recommendation**: Flagship post-exit strategy, requires new commercial team

---

## Product Boundary Definitions (Clarity for Exit Story)

### What IS "Sybrin Detect"?

**Product definition**:
- **Engine**: Tazama real-time detection platform (ISO 20022, rule builder, alerting)
- **Modules** (SKUs):
  1. Fraud Detection (original, deployed)
  2. Regulatory Compliance Monitoring (AFASA, AML, sanctions - **P0-1**)
  3. Agent Fraud & Performance Analytics (**P1-1**)
  4. MBO Oversight & Anomaly Detection (**bundle with P1-3**)
  5. Operational Risk Detection (**P3**, post-exit)
  6. Customer Service Prediction (**P3**, post-exit)

**Brand hierarchy**:
- **Platform**: Sybrin Detect
- **Engine**: Tazama
- **Modules**: Fraud, Compliance, Agents, MBO, Ops, CX

**What we DON'T claim (yet)**:
- "Universal GRC platform" - that's P3 territory
- "All data sources" - currently payment-centric, expanding to agents/MBOs in P1

**Exit deck positioning**: "Real-time detection platform with 6 proven use cases: fraud (deployed), compliance (deploying), agents (piloting), MBOs (CARD Bank), ops (roadmap), CX (roadmap)"

---

### What IS "Sybrin Connect"?

**Product definition**:
- **Core**: Payments Hub (core-agnostic transaction processing, state management, reconciliation)
- **Modules** (SKUs):
  1. Instant Payment Integration - TIPS, iPSO, InstaPay (original, deployed)
  2. Batch-Core Real-Time Facade (**P0-2**, productizing existing capability)
  3. Cross-Border Payments - TCIB, SWIFT (deployed)
  4. Open Banking APIs (**P3**, post-exit)
  5. Fintech Partnership Integration (**P3**, post-exit)

**Brand hierarchy**:
- **Platform**: Sybrin Connect
- **Core engine**: Payments Hub
- **Integration patterns**: TCIB microservice, scheme adapters

**What we DON'T claim (yet)**:
- "Connect ANY legacy system to ANY modern service" - that's aspirational
- Currently: "Connect ANY core to payment schemes" (proven)
- Expansion: Payment schemes → APIs/fintechs/open banking (roadmap)

**Exit deck positioning**: "Core-agnostic integration platform proven for instant payments (45+ banks), expanding to open banking and fintech partnerships"

---

### What IS "Sybrin Flow"?

**Product definition**:
- **Core**: No-Code Journey Builder (visual workflow designer, conditional logic, integrations)
- **Applications** (Templates):
  1. Digital Onboarding (original, deployed)
  2. Loan Origination (**P0-3**, templates in development)
  3. Compliance Workflows (**P0-3**, templates in development)
  4. Customer Service Exception Handling (**P2**, evaluate)
  5. Agent Onboarding (**bundle with P1-1**)
  6. Any Operational Process (**platform capability**)

**Brand hierarchy**:
- **Platform**: Sybrin Flow
- **Engine**: Journey Builder
- **Applications**: Onboarding, Lending, Compliance, Service, Agents, Custom

**What we DON'T claim (yet)**:
- "Replace RPA/BPM platforms" - not going head-to-head with Pega/Appian
- Focus: Financial services workflows, not general enterprise automation

**Exit deck positioning**: "No-code workflow platform for financial services, proven in onboarding (deployed), expanding to lending and compliance (Q1 2026)"

---

### What IS "Sybrin Offline"?

**Product definition**:
- **Core capabilities**: Document Capture mobile SDKs + Cheque Processing offline patterns + Biometric capture
- **Bundles** (Vertical Solutions):
  1. Digital KYC (original, deployed)
  2. MFI Rural Lending Suite (**P1-2**, in development)
  3. MBO Transaction Processing (**P1-3**, bundled with Digital Branch)
  4. Field Officer Safety & Monitoring (**P2-2**, evaluate)
  5. Agent Tools (Feature Phone Mode) (**P2**, evaluate)

**Brand hierarchy**:
- **Platform**: Sybrin Offline (Sync-When-Connected Architecture)
- **Core SDKs**: Document Capture, Biometrics, Offline Transaction Ledger
- **Solutions**: KYC, Rural Lending, MBO Ops, Field Safety, Agent Tools

**What we DON'T claim (yet)**:
- "Fully offline core banking" - no, that's too complex
- Focus: Offline workflows that sync to core when connected

**Exit deck positioning**: "Offline-first platform for poor connectivity markets, proven in digital KYC (deployed), expanding to rural lending and MBO operations (Q1-Q2 2026)"

---

### What IS "Sybrin Approve"?

**Product definition**:
- **Core capabilities**: Cheque Processing workflow engine + Digital Signatures + Mandate Manager
- **Applications**:
  1. Check Clearing (original, deployed)
  2. Debit Order / Mandate Management (deployed, SignPay)
  3. Controlled Instant Payments (**P2-3**, evaluate)
  4. Loan Disbursement Controls (**bundle with P1-2**)
  5. Corporate Treasury Workflows (**C2B integration**, post-exit)

**Brand hierarchy**:
- **Platform**: Sybrin Approve (Transaction Governance Engine)
- **Core**: Cheque Processing + Digital Signatures + Workflow Engine
- **Applications**: Checks, Mandates, Instant Payments, Loans, Treasury

**What we DON'T claim (yet)**:
- "Governance for ANY financial transaction" - that's aspirational
- Currently: Checks, mandates, controlled payments (proven)
- Expansion: Loans, treasury, trade finance (roadmap)

**Exit deck positioning**: "Transaction governance platform preserving audit/approval controls across payment types, proven in checks (deployed), expanding to instant payments and loan disbursements (Q2 2026)"

---

## Quantified Proof Points Needed (Per Platform, 3-5 Each)

### Sybrin Detect - Need to Demonstrate:

1. **Fraud reduction** (original use case)
   - Bank X reduced fraud losses from Y% to Z% using Tazama
   - [Need: actual customer metric]

2. **AFASA compliance** (**P0-1**)
   - Philippines Bank A passed BSP AFASA examination using Sybrin Detect Compliance Module
   - Time to compliance: X months (vs. Y months competitor average)
   - [Target: 2 banks pass by Q3 2026]

3. **Agent fraud detection** (**P1-1**)
   - Zanaco detected X fraudulent agents in first 90 days (vs. Y manual detection rate)
   - Agent fraud losses reduced Z%
   - [Target: Zanaco or Faulu pilot Q2 2026]

4. **Real-time detection speed**
   - Transaction evaluated in <500ms, decision in <2 seconds
   - [Validation: bench test published]

5. **Multi-geography rule coverage**
   - 14 geographies, 200+ regulatory rules across AFASA/FATF/AML/sanctions
   - [Target: rule library documented Q2 2026]

---

### Sybrin Connect - Need to Demonstrate:

1. **Core-agnostic proven**
   - Integrated with X different core banking systems (Temenos, Flexcube, Oracle, Craft, etc.)
   - [Document: integration matrix by core vendor]

2. **Batch-to-real-time facade** (**P0-2**)
   - Bank B processed X instant payments/day while core still batch
   - Customer experience: real-time; core impact: zero
   - [Target: 1 Tanzania community bank Q2 2026]

3. **Instant payment scheme connections**
   - Connected to TIPS (Tanzania), iPSO (Kenya), InstaPay (Philippines), TCIB (SADC)
   - 45+ institutions connected, XM transactions/month
   - [Validation: scheme participation certificates]

4. **Implementation speed**
   - Instant payment integration in X weeks (vs. core vendor Y months)
   - [Target: 3 reference customers with timelines]

5. **Cost avoidance**
   - Saved Bank C $Xm by avoiding core replacement for instant payment mandate
   - [Target: 1-2 customer case studies with CFO quotes]

---

### Sybrin Flow - Need to Demonstrate:

1. **Non-IT user adoption**
   - Business users created X workflows without developer involvement
   - Time to deploy new process: Y days (vs. Z months with IT backlog)
   - [Target: 2 banks with business-created workflows by Q3 2026]

2. **Loan origination efficiency** (**P0-3**)
   - MFI A reduced loan turnaround from X days to Y days using Sybrin Flow
   - Field officer productivity: +Z%
   - [Target: Kenya/Zambia MFI pilot Q2 2026]

3. **Template reusability**
   - Loan origination template deployed to X institutions with <Y% customization
   - [Validation: template library usage metrics]

4. **Workflow complexity handled**
   - Managed workflows with X steps, Y decision points, Z integrations
   - [Document: complexity benchmarks]

5. **Digital onboarding success** (original use case)
   - Bank D onboarded X customers in Y months using Journey Builder
   - Customer completion rate: Z%
   - [Update: current customer metrics]

---

### Sybrin Offline - Need to Demonstrate:

1. **Connectivity resilience**
   - MFI E field officers operated X days offline, synced Y transactions when connected
   - Zero data loss, zero duplicate transactions
   - [Target: Agora MFI pilot Q2 2026]

2. **Rural coverage expansion**
   - Bank F reached X additional villages using offline field officer tools
   - Customer acquisition cost reduced Y%
   - [Target: 1 MFI case study Q3 2026]

3. **MBO operational efficiency** (**P1-3**)
   - CARD Bank managed 329 MBOs with same oversight team as 54 branches
   - MBO operational cost reduced X%
   - [Target: CARD Bank pilot completion Q3 2026]

4. **Offline duration supported**
   - Field officers can operate X hours offline with Y transaction capacity
   - [Technical spec: publish offline capability limits]

5. **Mobile device cost reduction**
   - Feature phone + dongle ($X) vs. smartphone ($Y) = Z% cost savings for 10k+ agent networks
   - [Validation: device cost analysis published]

---

### Sybrin Approve - Need to Demonstrate:

1. **Check processing volume** (original use case)
   - Processing X checks/day across Y institutions
   - Fraud detection rate: Z% improvement vs. manual
   - [Update: current deployment metrics]

2. **Instant payment governance** (**P2-3**)
   - Corporate customer A applied check-like controls to InstaPay transactions
   - Reduced unauthorized payments by X%
   - [Target: 1 pilot customer Q3 2026 if check decommissioning accelerates]

3. **Multi-party approval complexity**
   - Handled workflows with X approval levels, Y exception paths
   - Approval cycle time: Z hours (vs. manual A days)
   - [Document: governance complexity benchmarks]

4. **Audit trail completeness**
   - 100% transaction audit trail, regulator-acceptable format
   - Zero audit findings related to transaction governance
   - [Validation: regulator acceptance letters]

5. **Mandate/debit order management** (SignPay)
   - Processing X mandates/debit orders for Y customers
   - Dispute resolution time: Z days
   - [Update: SignPay deployment metrics]

---

## Honest Effort Summary Table

| Repurposing Opportunity | Original Tier | Feasibility | Realistic Effort | Revised Classification | Priority |
|------------------------|---------------|-------------|------------------|------------------------|----------|
| Tazama → AFASA Compliance | Tier 1 (Zero Dev) | 95% | 1-2 months | **Packaging + Rule Sets** | **P0-1** |
| Payments Hub → Batch Facade | Tier 1 (Zero Dev) | 90% | 1 month | **Documentation + Accelerator** | **P0-2** |
| Journey Builder → Sybrin Flow | Tier 1 (Zero Dev) | 85% | 2 months | **Templates + UX** | **P0-3** |
| Tazama → Agent Fraud | Tier 2 (Minor Dev) | 70% | 2-3 months | **Minor Product Module** | **P1-1** |
| Document Capture → MFI Lending | Tier 2 (Minor Dev) | 70% | 2-3 months | **Vertical Solution Bundle** | **P1-2** |
| Digital Branch → MBO Platform | Tier 2 (Minor Dev) | 65% | 3-4 months | **Specialized Productization** | **P1-3** |
| Queue Mgmt → Assisted Digital | Tier 3 (Moderate Dev) | 60% | 4 months | **Small Product Module** | **P2-1** |
| Biometrics → Field Safety | Tier 3 (Moderate Dev) | 65% | 3 months | **Add-On Module** | **P2-2** |
| Cheque → Controlled Instant Pmt | Tier 3 (Moderate Dev) | 60% | 4-6 months | **Product Extension** | **P2-3** |
| Tazama → Universal Reg Platform | Tier 1 (labeled) | 40% | **6 months** | **New Product Evolution** | **P3-1** |
| Vitals → CX Monitoring | Tier 3 (Moderate Dev) | 30% | **5-7 months** | **New Product** | **P3-2** |
| Offline → Social Identity | N/A (conceptual) | 25% | **6-12 months** | **R&D Project** | **P3-3** |
| Branch → Multi-Tenant Fintech | N/A (conceptual) | 20% | **8-12 months** | **Business Model Innovation** | **P3-4** |

---

## Key Recommendations for GTM Clarity

### 1. Don't Try to Sell All 5 Platforms Simultaneously
**Problem**: GTM team gets confused, customers get muddled message.

**Solution**: Lead with vertical use cases, roll up to platform story for exit.

**Market-by-market lead**:
- **Philippines**: Sybrin Detect (AFASA compliance) + Sybrin Offline (rural lending)
- **Kenya**: Sybrin Detect (agent fraud) + Sybrin Connect (instant payments + e-checks)
- **Zambia**: Sybrin Connect (e-checks/EPO) + Sybrin Offline (MFI lending)
- **Tanzania**: Sybrin Connect (TIPS integration, batch facade)
- **Namibia**: Sybrin Detect (FATF compliance)
- **Ghana**: Sybrin Detect (compliance) + Sybrin Flow (digital processes)

### 2. Clarify Platform vs. Engine vs. Module in Sales Conversations
**Use this hierarchy**:
- **Platform** = high-level positioning for exit deck (Detect, Connect, Offline, Flow, Approve)
- **Engine** = core technology (Tazama, Payments Hub, Journey Builder, Document Capture, Cheque Processing)
- **Module/Application** = what we actually sell to customers (AFASA Compliance, Agent Fraud, Batch Facade, MFI Lending, etc.)

**Sales script**: "We sell the AFASA Compliance module, powered by our Tazama engine, which is part of our Sybrin Detect platform. As you grow, we can expand to agent fraud, MBO oversight, all on the same platform."

### 3. Template Every Repurposing for Repeatable Delivery
**For each P0/P1 repurposing**, create:
- Implementation accelerator (reduce deployment from custom project to 4-8 week repeatable)
- Configuration templates (80% pre-configured, 20% customer-specific)
- Training packages (don't reinvent training for each customer)
- Pricing SKU (standardized pricing, not bespoke quotes)

**Example**: "MFI Rural Lending Suite"
- Document Capture SDK (pre-configured for: borrower ID, loan app, collateral photo, guarantor)
- Offline workflow template (field officer → back office loan approval)
- Training: 2-day field officer workshop, 1-day back office training
- Pricing: $X/month SaaS per field officer + $Y implementation
- Deployment: 6 weeks from contract to live

### 4. Ruthlessly Sequence P0 → P1 → P2, Don't Parallel Everything
**18-month exit timeline is SHORT.**

**Focus sequence**:
- **Q1 2026**: Ship P0-1, P0-2, P0-3 (3 capabilities, minimal dev)
- **Q2 2026**: Ship P1-1, P1-2 (2 capabilities, minor dev)
- **Q3 2026**: Evaluate P2 based on customer pull + exit buyer interest
- **Q4 2026**: Optimize for exit metrics (ARR growth, gross margin, logo wins), freeze new features

**Don't**:
- Start 10 things in parallel
- Chase every cool idea from this document
- Let "platform vision" distract from "Q1 2027 exit revenue reality"

---

## Final Reality Check: What to Say vs. What NOT to Say (Exit Conversations)

### ✅ SAFE TO SAY (Backed by reality):

"We have **5 core capability platforms** that address multiple jobs:
- **Sybrin Detect**: Real-time anomaly detection for fraud, compliance, agent oversight (proven: fraud deployed; expanding: AFASA compliance Q1 2026)
- **Sybrin Connect**: Core-agnostic integration for instant payments, batch facades, open banking (proven: 45+ TIPS/iPSO connections; expanding: batch facade Q1 2026)
- **Sybrin Flow**: No-code workflow automation for onboarding, lending, compliance (proven: digital onboarding; expanding: loan origination templates Q1 2026)
- **Sybrin Offline**: Sync-when-connected for poor connectivity (proven: digital KYC; expanding: rural MFI lending Q2 2026)
- **Sybrin Approve**: Transaction governance for checks, mandates, instant payments (proven: check processing; expanding: controlled instant payments Q2-Q3 2026)"

### ❌ DON'T SAY (Overselling):

"We have a **universal regulatory monitoring platform** that monitors ALL data sources across fraud, compliance, and operations."
- **Reality**: Tazama monitors payment transactions very well; expanding to agents/MBOs in 2026; "universal" is 6+ months away.

"Our platform connects **ANY legacy system to ANY modern service**."
- **Reality**: Payments Hub connects cores to payment schemes very well; open banking/fintech integrations are roadmap, not deployed.

"We offer **zero-development repurposing** for all use cases."
- **Reality**: Some repurposing is just configuration (P0 tier); others require 2-6 months product work (P1-P2).

"We're a **horizontal platform company** competing with Salesforce/Pega/Workday."
- **Reality**: We're a financial services specialist with platform capabilities; don't over-expand scope.

### 🎯 BEST EXIT NARRATIVE:

"Sybrin has built **5 proven platform capabilities** that solve 20+ jobs across fraud, compliance, payments, workflows, and offline operations. We've deployed these in 23 countries with 140+ financial institutions. Our 18-month roadmap systematically packages these capabilities for faster time-to-revenue by repurposing existing technology into new use cases (AFASA compliance, agent fraud, batch-core facades, MFI lending, MBO oversight). This creates **platform leverage**: each new job addressed requires configuration, not development, leading to margin expansion and faster growth. Our exit strategy focuses on proving 3-5 flagship repurposing wins by Q1 2027 to demonstrate platform scalability to acquirers."

---

**Enhanced Analysis Date**: November 17, 2025
**Enhancement Focus**: Feasibility reality checks, prioritization framework, product boundary definitions, proof points, honest effort estimates
**Key Insight**: The repurposing thesis is sound, but ~30% of "zero dev" claims need honest recalibration to "minor product work." Prioritizing P0/P1 tiers for 18-month exit is critical; P2/P3 are valuable post-exit innovations, not exit revenue drivers.
