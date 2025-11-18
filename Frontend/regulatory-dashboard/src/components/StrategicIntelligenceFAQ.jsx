import React, { useState } from 'react'
import {
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  Users,
  Briefcase,
  Globe,
  Lightbulb
} from 'lucide-react'

const StrategicIntelligenceFAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    market: true,
    competitive: false,
    regulatory: false,
    partnerships: false,
    product: false,
    sales: false,
    geography: false
  })
  const [expandedQuestions, setExpandedQuestions] = useState(new Set())

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const toggleQuestion = (questionId) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const faqData = [
    {
      id: 'market',
      title: 'Market Understanding & Decision Makers',
      icon: Target,
      color: 'blue',
      questions: [
        {
          id: 'q1',
          question: 'True demand & willingness-to-pay?',
          shortTerm: {
            title: '18-month view (exit lens)',
            content: `Demand is overwhelmingly shaped by regulatory shocks and quantified risk.

**Fraud is the most urgent buying trigger because:**
• Kenya's fraud losses jumped to KES 1.59B, a 4× increase (mobile fraud +344%, card fraud 16×)
• The Philippines' AFASA law mandates real-time fraud monitoring and creates direct financial liability for banks that fail to prevent fraud
• Banks cannot delay fraud investment, and WTP reflects that: $50K–$250K+, with Tier 1 banks going higher

**Payments is driven by hard implementation deadlines:**
• Kenya: ISO 20022 migration completed at KEPSS; banks must align by Nov 2025
• Tanzania: TIPS & ISO 20022 migration ongoing
• Zambia: ZIPSS and TCIB interoperability mandated; data localization enforcement begins March 2025
• These make payment upgrades non-discretionary. WTP is $200K–$2M+

**Digital Onboarding is driven by competitive urgency:**
• Philippines: Digital banks holding 8.7M depositors force incumbents to modernize onboarding; PhilID eKYC is mandated by BSP Circular 1170
• Kenya Tier 2 banks compete with neobanks and mobile-first players
• WTP ranges from $15K (rural banks) to $500K (Tier 1)`,
            why: "Because compliance deadlines, fraud crises, and digital competitors create unavoidable buying windows. Optional modernization won't close before exit."
          },
          longTerm: {
            title: 'Long-term view (3–5 years)',
            content: `Demand stabilizes and shifts from compliance-driven to experience-driven:
• Digital onboarding becomes universal as national ID systems mature (PhilID, Ghana Card, Fayda, IPRS)
• Payments shifts to cross-border, API-first instant payments, and CBDC readiness
• Fraud moves from rules to machine-learning and behavioral biometrics`,
            why: 'As regulatory fires cool and baselines modernize, banks seek strategic differentiation instead of compliance survival.'
          }
        },
        {
          id: 'q2',
          question: 'Segment valuation of products?',
          shortTerm: {
            title: '18-month view',
            content: `**EMIs/Digital Banks (Philippines)**
Value fraud + onboarding because their entire customer base is digital. They are legally liable under AFASA and must meet PhilID eKYC.

**Tier 2 Banks (Kenya/Tanzania/Zambia)**
Feel regulatory pressure and competitive pressure but move faster than Tier 1 banks.

**Tier 3 Banks**
Need low-cost onboarding and basic payments compliance.

**MFIs/SACCOs**
Move slowly—budgets small, regulatory pressure lower.`,
            why: 'Speed and urgency determine where revenue lands in 18 months.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `• Tier 1 banks adopt platform layers (fraud suites, AI onboarding, open banking)
• MFIs/SACCOs digitize in volume as national ID + mobile reach penetration increases
• Pan-African groups (Ecobank, UBA, Access) look for multi-country consistency`,
            why: 'Long-term investment cycles realign technology across all tiers and geographies.'
          }
        },
        {
          id: 'q3',
          question: 'Decision-makers & cultural impact?',
          shortTerm: {
            title: '18-month view',
            content: `**Kenya:** Buying requires consensus across IT, Risk, Compliance, CFO, CEO, and Board. KBA membership = credibility accelerator.

**Philippines:** Hierarchical; often family-controlled banks. Board approval is required even for mid-size deals. Objections are indirect ("polite no").

**South Africa:** Committee-heavy procurement; 9–15 month cycles.`,
            why: 'You must navigate cultural decision-making realities to compress timelines.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `With time, Sybrin can build deep institutional trust: advisory roles with central banks, long-running C-level relationships, and routine renewals.`,
            why: 'Cultural trust compounds over years, not months.'
          }
        }
      ]
    },
    {
      id: 'competitive',
      title: 'Competitive Landscape & Pricing',
      icon: TrendingUp,
      color: 'orange',
      questions: [
        {
          id: 'q4',
          question: 'Smart Teller & Payments pricing under tender risk?',
          shortTerm: {
            title: '18-month view',
            content: `Forced migrations trigger procurement rules → competitors can enter.
Temenos, Finacle, and Oracle are aggressive in tenders, while regional players undercut cheaply.

**Thus Smart Teller pricing must:**
• Use upgrade protection (67% discounts)
• Frame upgrades as mandatory security/compliance refresh
• Avoid triggering tender thresholds
• Bundle fraud + payments connectors to strengthen retention`,
            why: 'Losing even a handful of the 33 clients cuts R10M ARR and significantly harms exit valuation.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `After consolidation into Smart Teller, Sybrin can:
• Reprice to full commercial rates
• Offer tiered editions (Essential/Pro/Enterprise)
• Expand into adjacent products (AI teller, digital branch stack)`,
            why: 'Once the base is stable and no longer fragmented, Smart Teller becomes a growth engine.'
          }
        },
        {
          id: 'q5',
          question: 'Optimal price points by customer type?',
          shortTerm: {
            title: '18-month view',
            content: `Pricing is shaped by what closes quickly:
• **Tier 2/3 banks:** $10K–$150K → need affordability + simple procurement
• **EMIs:** $50K–$250K for AFASA-compliant fraud/onboarding
• **Rural banks (PH):** $15K–$65K SaaS onboarding`,
            why: 'These segments have urgency + budget + fast decision paths.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `• **Tier 1:** $500K–$2.5M/year packages
• **MFIs/SACCOs:** $20K–$50K via SaaS volume
• **Digital banks:** consumption pricing (transactions, KYC volume)`,
            why: 'Mature markets allow higher value extraction through deeper integration.'
          }
        },
        {
          id: 'q6',
          question: 'Competing with undercutters?',
          shortTerm: {
            title: '18-month view',
            content: `**Compete on:**
• Compliance strength (ISO 20022, AFASA, FATF alignment)
• Proven uptime
• Reference customers
• Migration guarantees / parallel-run support`,
            why: 'Local competitors win on price but cannot match regulatory depth or proven stability.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Compete on advanced capabilities (AI fraud, open banking, payment orchestration).`,
            why: 'Once installed, depth > price.'
          }
        }
      ]
    },
    {
      id: 'regulatory',
      title: 'Regulatory & Compliance',
      icon: Shield,
      color: 'purple',
      questions: [
        {
          id: 'q7',
          question: 'Compliance requirements by geography?',
          shortTerm: {
            title: '18-month view',
            content: `**Focus on markets with IMMEDIATE regulatory drivers:**

**Kenya**
• ISO 20022 adoption required by Nov 2025
• FATF grey-listing (Feb 2024) → heightened AML expectations
• Cloud Policy 2025 mandates local storage of strategic data

**Philippines**
• PhilID eKYC required by BSP
• AFASA mandates real-time fraud monitoring
• OPS registration under RA 11127 for payment providers

**Tanzania**
• ISO 20022 TIPS migration
• 24-hour STR reporting
• PDPA 2022: biometrics = "sensitive data"

**Zambia**
• Data localization enforced from March 2025
• TCIB integration mandated (SADC deadline 2027)

**Avoid:**
• Ethiopia (100% localization, 100M birr capital, 49% foreign cap)
• Nigeria (multi-year CBN licensing)`,
            why: 'These regulatory deadlines drive immediate purchasing; others create multi-year delays.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Sybrin can enter Ethiopia, Nigeria, Ghana (with 30% local shareholding), and SA open banking frameworks as longer-term investments.`,
            why: 'High-barrier markets yield high returns but only after heavy groundwork.'
          }
        },
        {
          id: 'q8',
          question: 'Stability of regulatory environments?',
          shortTerm: {
            title: '18-month view',
            content: `Stick to predictable regulators: CBK, BSP, BoT, BoZ.`,
            why: 'Predictability = accelerated sales.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `EAC & SADC harmonization efforts will standardize compliance requirements regionally, reducing cost of expansion.`,
            why: 'Regional payment and AML integration lowers barriers over time.'
          }
        },
        {
          id: 'q9',
          question: 'Role of industry bodies?',
          shortTerm: {
            title: '18-month view',
            content: `**Critical accelerators:**
• KBA (Kenya)
• ZECHL (Zambia)
• BAP/RBAP (Philippines)
• BSP Sandboxes

These cut time-to-trust by 40–60%.`,
            why: 'They validate Sybrin as an accepted, safe vendor.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Become part of regulatory working groups shaping industry standards.`,
            why: 'This cements defensibility and brand prestige.'
          }
        }
      ]
    },
    {
      id: 'partnerships',
      title: 'Partnerships & Ecosystem',
      icon: Users,
      color: 'green',
      questions: [
        {
          id: 'q10',
          question: 'Why PH reseller model failed?',
          shortTerm: {
            title: '18-month view',
            content: `• Partners want services revenue, not product ARR
• They lack regulatory-selling capability (AFASA, OPS registration, PhilID)
• Philippine banks demand direct C-suite vendor interaction`,
            why: 'Resellers slow deals and reduce trust — fatal under an 18-month exit.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Implementation partners become viable once Sybrin is known and trusted.`,
            why: 'Only delivery, not sales, can be outsourced in PH.'
          }
        },
        {
          id: 'q11',
          question: 'Strategic partners that matter most?',
          shortTerm: {
            title: '18-month view',
            content: `**Kenya:** KBA (payments clearing), Craft Silicon
**Philippines:** BAP + Gates Foundation
**Zambia:** ZECHL`,
            why: 'They offer instant, hard-earned credibility + warm access.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Partnerships expand to pan-African banks, national ID authorities, and cross-border payment networks (EAC, SADC).`,
            why: 'These partners enable ecosystem-scale plays.'
          }
        }
      ]
    },
    {
      id: 'product',
      title: 'Product Modernization & Differentiation',
      icon: Briefcase,
      color: 'indigo',
      questions: [
        {
          id: 'q12',
          question: 'Consolidating 4 legacy teller products?',
          shortTerm: {
            title: '18-month view',
            content: `• Map migration pathways; start with low-complexity clients
• Freeze new features; focus entirely on migration
• Invest in customer success: parallel runs, training, rollback guarantees`,
            why: '33 clients represent R10M ARR at risk; losing even 5–6 hurts exit valuation.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Add AI-assisted teller actions, omnichannel support, biometric authentication, and open APIs.`,
            why: 'Once stable, differentiation matters.'
          }
        },
        {
          id: 'q13',
          question: 'Re-monetization opportunity?',
          shortTerm: {
            title: '18-month view',
            content: `Cross-selling fraud + payments yields $1.3M–$5.1M ARR quickly.`,
            why: 'These are mandatory/regulatory products with low friction for existing clients.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Building a full branch modernization suite expands to $7M–$15M ARR.`,
            why: 'Deep account penetration yields far higher lifetime value.'
          }
        },
        {
          id: 'q14',
          question: 'Global teller trends to align with?',
          shortTerm: {
            title: '18-month view',
            content: `Ignore trends → stabilize platform.`,
            why: 'Execution risk kills exit outcomes.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Adopt universal banker workflows, self-service kiosks, AI guidance, and video teller support.`,
            why: 'These align with global branch transformation strategies.'
          }
        }
      ]
    },
    {
      id: 'sales',
      title: 'Sales Execution & Outreach',
      icon: Lightbulb,
      color: 'yellow',
      questions: [
        {
          id: 'q15',
          question: 'Building trust in the Philippines?',
          shortTerm: {
            title: '18-month view',
            content: `Lead with Gates Foundation credibility, BAP introductions, BSP alignment. Target rural/thrift banks with SaaS onboarding.`,
            why: 'These banks have the fastest cycles and lowest political resistance.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Use early wins to approach universal banks and large EMIs.`,
            why: 'PH banking is hierarchical — early references unlock bigger deals.'
          }
        },
        {
          id: 'q16',
          question: 'Mapping decision timelines & influence networks?',
          shortTerm: {
            title: '18-month view',
            content: `Engage IT, Risk, Compliance, CFO, and CEO in parallel. Use references and regulators to accelerate.`,
            why: 'Sequential selling exceeds 12 months.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Institutionalize C-suite engagement and account management.`,
            why: 'Long-term value grows with deeper relationships.'
          }
        },
        {
          id: 'q17',
          question: 'Effective outreach channels?',
          shortTerm: {
            title: '18-month view',
            content: `• KBA tech committees (Kenya)
• ZECHL + BoZ (Zambia)
• RBAP/BAP roadshows (Philippines)`,
            why: 'Direct contact with decision-makers → compressed cycles.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Launch thought-leadership, whitepapers, and regulatory co-authorship.`,
            why: 'Brand authority reduces dependency on outbound sales.'
          }
        }
      ]
    },
    {
      id: 'geography',
      title: 'Geography-Specific Strategy',
      icon: Globe,
      color: 'red',
      questions: [
        {
          id: 'q18',
          question: 'Is South Africa payments viable?',
          shortTerm: {
            title: '18-month view',
            content: `**No.** South Africa is dominated by entrenched, quasi-monopolistic infrastructure:
• BankservAfrica (national payments switch with decades-old mandates)
• FNB/Absa/Standard Bank with in-house rails
• Very slow procurement due to SARB + POPIA governance
• PayShap (real-time payments) already deep in bank ecosystems

Switching costs are enormous, and regulatory caution is high.`,
            why: 'Sales cycles exceed 12–18 months, incumbents are deeply embedded, and banks are risk-averse — misaligned with exit timelines.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `**Yes, selectively.**
Focus on:
• ISO 20022 modernization layers
• PayShap connectors + fraud overlays
• Instant payments analytics
• Open banking compliance components`,
            why: 'SA banks modernize slowly but steadily. Supplementary modernization layers are adoptable even when core payments switching remains locked to incumbents.'
          }
        },
        {
          id: 'q19',
          question: 'Africa eCheck opportunities?',
          shortTerm: {
            title: '18-month view',
            content: `Pilot only in Kenya, where check volumes + digital grant disbursements create clear demand.`,
            why: 'Kenya has strong mobile-money penetration + a history of partial digitization → ideal test bed.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Roll out across Tanzania, Ghana, Zambia, and Malawi for:
• Social grant distribution
• Rental markets
• Informal credit
• BNPL

Pricing uses per-issue + per-cashing + per-transfer.`,
            why: 'Check-heavy workflows persist regionally, and digital alternatives are still immature.'
          }
        },
        {
          id: 'q20',
          question: 'Philippines compliance-first differentiation?',
          shortTerm: {
            title: '18-month view',
            content: `Position Sybrin as the AFASA-compliant, PhilID-ready onboarding + fraud platform, aligned with BSP Circulars 1170 (eKYC) and 1198 (merchant payments).

Use Gates Foundation as credibility anchor.`,
            why: 'Compliance buys trust instantly in a hierarchical, risk-averse market.'
          },
          longTerm: {
            title: 'Long-term view',
            content: `Shift to a full digital-bank infrastructure narrative: onboarding → fraud → payments → open finance.`,
            why: 'As trust grows, Sybrin can move up the value chain into higher margin modules.'
          }
        }
      ]
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-sybrin-blue-50 border-sybrin-blue-200 text-sybrin-blue-800',
      orange: 'bg-orange-50 border-orange-200 text-orange-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    }
    return colors[color] || colors.blue
  }

  const filteredSections = faqData.map(section => ({
    ...section,
    questions: section.questions.filter(q =>
      searchTerm === '' ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.shortTerm.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.longTerm.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.questions.length > 0)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sticky Sidebar Navigation */}
      <div className="w-64 bg-white shadow-lg sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Strategic Intelligence</h2>
          <p className="text-xs text-gray-600 mb-6">Navigate key questions</p>

          <nav className="space-y-2">
            {faqData.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="flex-1">{section.title}</span>
                  <span className="text-xs text-gray-500">{section.questions.length}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Strategic Intelligence FAQ</h1>
            <p className="text-gray-600">High-level answers to critical market, product, and expansion questions</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-sybrin-blue-600">20</p>
                </div>
                <Lightbulb className="w-8 h-8 text-sybrin-blue-200" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">7</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Timeframes</p>
                  <p className="text-2xl font-bold text-green-600">2</p>
                  <p className="text-xs text-gray-500">18mo & Long-term</p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500 shadow-sm"
              />
            </div>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-6">
            {filteredSections.map((section) => {
              const Icon = section.icon
              const isExpanded = expandedSections[section.id]

              return (
                <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full px-6 py-4 flex items-center justify-between border-l-4 ${getColorClasses(section.color)} hover:opacity-80 transition-opacity`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <h2 className="text-lg font-bold">{section.title}</h2>
                        <p className="text-xs opacity-75">{section.questions.length} questions</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </button>

                  {/* Questions */}
                  {isExpanded && (
                    <div className="p-6 space-y-4">
                      {section.questions.map((question, idx) => {
                        const isQuestionExpanded = expandedQuestions.has(question.id)

                        return (
                          <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleQuestion(question.id)}
                              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center text-left">
                                <span className="text-sm font-semibold text-gray-500 mr-3">Q{idx + 1}</span>
                                <span className="font-medium text-gray-900">{question.question}</span>
                              </div>
                              {isQuestionExpanded ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                            </button>

                            {isQuestionExpanded && (
                              <div className="p-4 bg-white">
                                {/* 18-month View */}
                                <div className="mb-6">
                                  <div className="flex items-center mb-3">
                                    <Clock className="w-5 h-5 text-orange-600 mr-2" />
                                    <h4 className="font-bold text-orange-600">{question.shortTerm.title}</h4>
                                  </div>
                                  <div className="bg-orange-50 p-4 rounded-lg mb-3">
                                    <div className="text-sm text-gray-700 whitespace-pre-line">{question.shortTerm.content}</div>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-xs font-semibold text-orange-600 mr-2">WHY:</span>
                                    <p className="text-sm text-gray-600 italic">{question.shortTerm.why}</p>
                                  </div>
                                </div>

                                {/* Long-term View */}
                                <div>
                                  <div className="flex items-center mb-3">
                                    <Calendar className="w-5 h-5 text-sybrin-blue-600 mr-2" />
                                    <h4 className="font-bold text-sybrin-blue-600">{question.longTerm.title}</h4>
                                  </div>
                                  <div className="bg-sybrin-blue-50 p-4 rounded-lg mb-3">
                                    <div className="text-sm text-gray-700 whitespace-pre-line">{question.longTerm.content}</div>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-xs font-semibold text-sybrin-blue-600 mr-2">WHY:</span>
                                    <p className="text-sm text-gray-600 italic">{question.longTerm.why}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No questions found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrategicIntelligenceFAQ
