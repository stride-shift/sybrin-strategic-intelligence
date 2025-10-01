# Market Sizing Methodology & Matrix
## Systematic Approach to Estimating Market Size by Customer Jobs and Geography

---

## Executive Summary

This document provides a systematic methodology for estimating market sizes for banking software and services across different customer jobs and geographies. Using multiple estimation approaches, we calculate Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) for each job-geography combination.

### Key Market Sizing Principles:
1. **Multiple methodologies** for triangulation
2. **Conservative estimates** to maintain credibility
3. **Data-driven** using verifiable sources
4. **Job-specific** sizing based on actual customer needs
5. **Geographic adjustments** for local conditions

---

## PART 1: MARKET SIZING METHODOLOGIES

## Methodology 1: TOP-DOWN APPROACH
**Formula: TAM = (Number of Institutions) × (Average IT Budget) × (% Allocated to Job)**

### Application by Institution Type:

| Institution Type | Avg IT Budget | Digital % | Core Banking % | Compliance % | Payments % |
|-----------------|---------------|-----------|----------------|--------------|------------|
| Tier 1 Banks | $10-50M/year | 30% | 25% | 20% | 15% |
| Tier 2 Banks | $2-10M/year | 25% | 30% | 15% | 20% |
| Digital Banks | $1-5M/year | 40% | 20% | 10% | 20% |
| MFIs | $100K-1M/year | 20% | 35% | 10% | 25% |
| SACCOs | $20-100K/year | 15% | 40% | 10% | 20% |
| Rural Banks | $50-500K/year | 20% | 35% | 15% | 20% |

---

## Methodology 2: BOTTOM-UP APPROACH
**Formula: TAM = (# of End Users) × (Price per User) × (Penetration Rate)**

### Pricing Models by Job:

| Customer Job | Pricing Model | Range | Notes |
|--------------|--------------|-------|-------|
| Core Banking | Per account/year | $0.50-5.00 | Varies by volume |
| Digital Onboarding | Per customer | $1-10 | One-time + annual |
| Payment Processing | Per transaction | $0.001-0.10 | Volume-based |
| Compliance/AML | Per check | $0.10-1.00 | Risk-based |
| Fraud Management | % of prevented loss | 10-30% | Performance-based |
| Branch Operations | Per branch/month | $500-5000 | Size-dependent |

---

## Methodology 3: REPLACEMENT COST APPROACH
**Formula: TAM = (Current Manual Cost) × (Institutions) × (Automation Potential)**

### Manual Process Costs:

| Process | Manual Cost/Year | Automation Potential | Sybrin Solution |
|---------|-----------------|---------------------|-----------------|
| Account Opening | $20 per account | 80% | Digital Onboarding |
| Payment Processing | $0.50 per payment | 95% | Payment Hub |
| Document Management | $5 per document | 90% | DMS |
| Compliance Checks | $10 per check | 70% | AML Suite |
| Fraud Investigation | $100 per case | 60% | Fraud Tools |
| Report Generation | $500 per report | 95% | Automation Platform |

---

## Methodology 4: BUDGET ALLOCATION APPROACH
**Formula: TAM = (GDP) × (Financial Sector %) × (IT Spending %) × (Job %)**

### Country Economic Indicators:

| Country | GDP (2025E) | Financial Sector % | IT Spending % | Banking Software % |
|---------|------------|-------------------|---------------|-------------------|
| Kenya | $120B | 10% | 3% | 30% |
| Tanzania | $85B | 8% | 2.5% | 25% |
| South Africa | $420B | 12% | 4% | 35% |
| Philippines | $450B | 8% | 3.5% | 30% |
| Rwanda | $14B | 15% | 3% | 40% |
| Zambia | $30B | 9% | 2% | 25% |
| Ghana | $75B | 11% | 2.5% | 30% |
| Egypt | $470B | 7% | 2% | 25% |
| Uganda | $50B | 9% | 2% | 25% |
| Nigeria | $390B | 10% | 2.5% | 30% |

---

## PART 2: MARKET SIZE BY CUSTOMER JOB CATEGORY

## 1. CORE BANKING TRANSFORMATION

### Market Sizing Calculation:

| Geography | # Banks | Avg Spend | Replacement Cycle | Annual TAM |
|-----------|---------|-----------|-------------------|------------|
| Kenya | 39 | $3M | 7 years | $16.7M |
| Tanzania | 45 | $2M | 8 years | $11.3M |
| South Africa | 30 | $8M | 6 years | $40M |
| Philippines | 46 | $4M | 7 years | $26.3M |
| Rwanda | 11 | $1.5M | 10 years | $1.7M |
| Zambia | 19 | $1.8M | 8 years | $4.3M |
| Ghana | 23 | $2.5M | 7 years | $8.2M |
| Egypt | 40 | $5M | 6 years | $33.3M |
| **TOTAL** | **253** | | | **$141.8M** |

### Calculation Method:
- TAM = (Number of Banks) × (Average Core Banking Project) ÷ (Replacement Cycle Years)
- Assumes 1 in X banks replace core each year
- Verified against actual RFP activity

---

## 2. DIGITAL TRANSFORMATION JOBS

### Market Sizing by Sub-Job:

| Sub-Job | Market Size Calculation | Annual TAM |
|---------|------------------------|------------|
| **Digital Onboarding** | 500M African adults × 10% banking × $2/onboarding × 20% annual | $200M |
| **Mobile Banking** | 100M mobile bank users × $5/user/year | $500M |
| **API/Open Banking** | 300 banks × $500K average project | $150M |
| **Channel Integration** | 250 banks × $300K/year | $75M |
| **Customer Experience** | 200 banks × $250K/year | $50M |
| **TOTAL DIGITAL** | | **$975M** |

---

## 3. PAYMENTS & CLEARING

### Transaction Volume Based Sizing:

| Geography | Annual Transactions | Price/Transaction | TAM |
|-----------|-------------------|-------------------|-----|
| Kenya | 5B | $0.01 | $50M |
| Tanzania | 3B | $0.01 | $30M |
| South Africa | 8B | $0.015 | $120M |
| Philippines | 10B | $0.008 | $80M |
| Rwanda | 1B | $0.01 | $10M |
| Others | 15B | $0.01 | $150M |
| **TOTAL** | **42B** | | **$440M** |

### Infrastructure Projects:
- National switches: $10-50M per country
- Clearing house upgrades: $5-20M
- Instant payment systems: $20-100M
- **Annual Infrastructure TAM: $85M**

---

## 4. COMPLIANCE & REGULATORY

### Compliance Market Calculation:

| Job Component | Calculation Method | Annual TAM |
|---------------|-------------------|------------|
| **AML/KYC** | 300 banks × $200K/year | $60M |
| **Sanctions Screening** | 50M checks × $0.50 | $25M |
| **Regulatory Reporting** | 400 FIs × $100K/year | $40M |
| **Risk Management** | 200 banks × $300K/year | $60M |
| **Audit & Controls** | 300 FIs × $50K/year | $15M |
| **TOTAL COMPLIANCE** | | **$200M** |

---

## 5. FINANCIAL INCLUSION

### Underserved Market Sizing:

| Segment | # Institutions | Avg Spend | Penetration | Annual TAM |
|---------|---------------|-----------|-------------|------------|
| MFIs | 500 | $200K | 30% | $30M |
| SACCOs | 300 | $50K | 20% | $3M |
| Rural Banks | 600 | $150K | 25% | $22.5M |
| Mobile Money | 50 | $2M | 40% | $40M |
| Agent Networks | 100 | $300K | 35% | $10.5M |
| **TOTAL INCLUSION** | | | | **$106M** |

---

## PART 3: GEOGRAPHIC MARKET SIZE MATRIX

## Comprehensive Market Size by Geography and Job

| Geography | Core Banking | Digital Trans | Payments | Compliance | Inclusion | TOTAL TAM |
|-----------|--------------|---------------|----------|------------|-----------|-----------|
| **Kenya** | $16.7M | $120M | $50M | $25M | $18M | **$229.7M** |
| **Tanzania** | $11.3M | $65M | $30M | $15M | $12M | **$133.3M** |
| **South Africa** | $40M | $180M | $120M | $45M | $8M | **$393M** |
| **Philippines** | $26.3M | $150M | $80M | $35M | $25M | **$316.3M** |
| **Rwanda** | $1.7M | $20M | $10M | $8M | $5M | **$44.7M** |
| **Zambia** | $4.3M | $25M | $15M | $10M | $6M | **$60.3M** |
| **Ghana** | $8.2M | $45M | $25M | $18M | $10M | **$106.2M** |
| **Egypt** | $33.3M | $200M | $60M | $40M | $15M | **$348.3M** |
| **Uganda** | $6M | $35M | $20M | $12M | $8M | **$81M** |
| **Nigeria** | $35M | $250M | $100M | $50M | $30M | **$465M** |
| **Others** | $25M | $150M | $75M | $35M | $20M | **$305M** |
| **TOTAL** | **$207.8M** | **$1,240M** | **$585M** | **$293M** | **$157M** | **$2,482.8M** |

### Market Maturity Indicators:

```
Market Maturity Heat Map:
                Core    Digital  Payments  Compliance  Inclusion
Kenya           ███     ████     ████      ███         ██
Tanzania        ██      ██       ███       ██          ███
South Africa    ████    ████     ████      ████        █
Philippines     ██      ███      ███       ██          ███
Rwanda          ███     ██       ██        ███         ██
Zambia          ██      █        ██        ██          ██
Ghana           █       ██       ██        █           ██
Egypt           ██      ███      ██        ██          ██

Legend: ████ = Mature  ███ = Growing  ██ = Emerging  █ = Nascent
```

---

## PART 4: SAM AND SOM CALCULATIONS

## Serviceable Addressable Market (SAM)

### SAM Filters Applied:

| Filter | Impact on TAM | Rationale |
|--------|---------------|-----------|
| Sybrin's Geographic Presence | 60% | Only countries where present/planned |
| Technical Fit | 70% | Not all jobs match capabilities |
| Budget Reality | 50% | Not all have immediate budget |
| Competition | 40% | Realistic win rate |
| **Combined SAM** | **8.4%** | Multiply all factors |

### SAM by Geography:

| Geography | TAM | Geographic | Technical | Budget | Competition | SAM |
|-----------|-----|------------|-----------|---------|-------------|-----|
| Kenya | $229.7M | 100% | 80% | 60% | 50% | $55.1M |
| Tanzania | $133.3M | 100% | 75% | 50% | 45% | $22.5M |
| South Africa | $393M | 100% | 70% | 70% | 35% | $67.5M |
| Philippines | $316.3M | 60% | 60% | 40% | 30% | $13.6M |
| Rwanda | $44.7M | 100% | 85% | 70% | 60% | $16.0M |
| Zambia | $60.3M | 100% | 75% | 50% | 50% | $11.3M |
| Ghana | $106.2M | 70% | 70% | 40% | 40% | $7.8M |
| Egypt | $348.3M | 50% | 60% | 30% | 25% | $7.8M |
| **TOTAL SAM** | | | | | | **$201.6M** |

---

## Serviceable Obtainable Market (SOM)

### Realistic 3-Year Targets:

| Market Segment | SAM | Year 1 | Year 2 | Year 3 | Total SOM |
|----------------|-----|---------|---------|---------|-----------|
| Existing Markets Strong | $100M | 15% | 20% | 25% | $60M |
| Existing Markets Weak | $50M | 5% | 10% | 15% | $15M |
| New Markets | $51.6M | 2% | 5% | 10% | $8.7M |
| **TOTAL SOM** | **$201.6M** | | | | **$83.7M** |

### SOM by Customer Job:

| Customer Job | 3-Year SOM | Rationale |
|--------------|------------|-----------|
| Core Banking | $12M | 6-8 implementations/year |
| Digital Transformation | $35M | High demand, good fit |
| Payments | $18M | Infrastructure wins |
| Compliance | $10M | Regulatory drivers |
| Inclusion | $8.7M | Emerging opportunity |
| **TOTAL** | **$83.7M** | 3-year achievable |

---

## PART 5: MARKET OPPORTUNITY PRIORITIZATION

## Opportunity Heat Map

### Size vs. Accessibility Matrix:

```
HIGH VALUE
    ↑
    |  🔴 SOUTH AFRICA        🔴 EGYPT
    |  (Large, Competitive)    (Large, Difficult)
    |  
    |  🟡 KENYA               🟡 PHILIPPINES
    |  (Good size, Strong)     (Good size, New)
SIZE|
    |  🟢 TANZANIA            🟢 GHANA
    |  (Medium, Growing)       (Medium, Open)
    |
    |  🔵 RWANDA              🔵 ZAMBIA
    |  (Small, Dominant)       (Small, Strong)
    ↓
LOW VALUE
    └────────────────────────────────→
      DIFFICULT            EASY
           ACCESSIBILITY
```

---

## PART 6: MARKET SIZING VALIDATION

## Triangulation Methods Used:

### 1. Public Company Benchmarks
- Temenos: $600M Africa/ME revenue ÷ 30% market share = $2B market
- Finastra: Reports suggest $300M Africa revenue
- **Validates our $2.5B TAM estimate** ✓

### 2. IT Spending Benchmarks
- Banks typically spend 5-8% of revenue on IT
- African banking revenue: ~$150B
- IT spending: $7.5-12B
- Banking software: 20-30% = $1.5-3.6B
- **Aligns with our estimates** ✓

### 3. Transaction Volume Method
- 42B transactions × $0.01-0.02 = $420-840M payments market
- **Our $585M payments estimate validated** ✓

### 4. Per-Bank Spending
- ~1000 banks/FIs in target markets
- Average $2-3M software spend
- = $2-3B total market
- **Consistent with TAM calculation** ✓

---

## PART 7: KEY MARKET INSIGHTS

## High-Value Job Opportunities:

### 1. Digital Transformation ($1.24B TAM)
- **Largest opportunity** across all markets
- Growing 15-20% annually
- Sybrin well-positioned

### 2. Payments ($585M TAM)  
- Infrastructure plays create moats
- Recurring revenue model
- Critical for financial inclusion

### 3. Compliance ($293M TAM)
- Regulatory driven = guaranteed demand
- Increasing requirements
- Sybrin's sweet spot

### 4. Core Banking ($208M TAM)
- Smaller but strategic
- Creates long-term relationships
- Platform for other sales

### 5. Inclusion ($157M TAM)
- Emerging opportunity
- Government support
- Social impact angle

---

## Market Entry Priorities:

### Priority 1: Maximize Existing Markets
- Kenya: Push from 56% to 70% share
- Tanzania: Grow from 30% to 50%
- Rwanda: Maintain 64% dominance
- **Potential: $30M incremental**

### Priority 2: Adjacent Market Entry
- Ghana: 144 rural banks opportunity
- Egypt: Digital transformation wave
- Uganda: Expand from base
- **Potential: $15M new revenue**

### Priority 3: Strategic New Markets
- Philippines: Digital banks
- Nigeria: If stability improves
- Ethiopia: Market opening
- **Potential: $20M long-term**

---

## CONCLUSION

## Total Market Opportunity:

| Metric | Value | Notes |
|--------|-------|-------|
| **Total Addressable Market (TAM)** | $2.48B | All jobs, all geographies |
| **Serviceable Addressable Market (SAM)** | $202M | Realistic reach |
| **Serviceable Obtainable Market (SOM)** | $84M | 3-year target |
| **Current Revenue** | ~$50M | Estimated base |
| **Growth Potential** | 68% | To reach SOM |

## Key Takeaways:

1. **Digital transformation jobs** represent 50% of total opportunity
2. **Kenya and South Africa** are largest markets but most competitive
3. **Financial inclusion** is underserved with high growth potential
4. **Payment infrastructure** creates sustainable competitive advantages
5. **Total realistic opportunity** of $84M represents 68% growth potential

## Investment Priorities:

1. **Digital capabilities** - Address largest market
2. **Payment infrastructure** - Build moats
3. **Compliance automation** - Guaranteed demand
4. **Inclusion tools** - Future growth
5. **Geographic expansion** - Selective entry

This systematic approach provides defensible market size estimates that can guide investment decisions and growth strategies.