import React, { useState } from 'react';
import {
  AlertCircle,
  Zap,
  Workflow,
  Archive,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Target,
  Users,
  Heart,
  Shield,
  TrendingUp,
  Layers,
  Lightbulb,
  Info,
  FileText
} from 'lucide-react';

const JTBDIntelligenceDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [expandedSections, setExpandedSections] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleJob = (jobId) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const tabs = [
    { id: 'jobs', name: 'Customer Jobs Analysis', icon: Users },
    { id: 'repurposing', name: 'Capability Repurposing', icon: Layers },
    { id: 'higher', name: 'Higher-Level Jobs', icon: TrendingUp }
  ];

  const priorityColors = {
    'P0': 'bg-red-100 text-red-800 border-red-300',
    'P1': 'bg-orange-100 text-orange-800 border-orange-300',
    'P2': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'P3': 'bg-gray-100 text-gray-600 border-gray-300'
  };

  const priorityLabels = {
    'P0': 'Do Now',
    'P1': 'Do Soon',
    'P2': 'Evaluate',
    'P3': 'Defer'
  };

  // Jobs Data
  const functionalJobs = [
    {
      id: 'job1',
      category: 'Regulatory',
      number: 1,
      title: 'Philippine Banks\' Job: Meet BSP AFASA real-time fraud mandate by 2025 without breaking IT budget',
      statement: 'Achieve full BSP AFASA compliance for real-time fraud detection when IT budgets are constrained and core systems are legacy/EOL.',
      evidence: 'Philippines: "AFASA/real-time fraud detection compliance by 2025; urgent need for affordable fraud management" (thrift/rural banks segment)',
      circumstances: [
        '2025 compliance deadline approaching',
        'Thrift/rural banks with PHP 50-200M budgets',
        'Legacy cores can\'t support real-time monitoring',
        'No in-house fraud expertise'
      ],
      customers: 'PSBank, CARD Bank, AllBank, rural banks segment (Philippines)',
      underserved: 'Most enterprise fraud platforms (FICO, SAS) price out thrift/rural banks. Compliance is binary (pass/fail) but solutions are priced on continuous value scale.'
    },
    {
      id: 'job2',
      category: 'Regulatory',
      number: 2,
      title: 'Kenyan/Zambian Banks\' Job: Navigate check decommissioning without losing revenue or customers',
      statement: 'Replace check-based revenue streams and customer workflows when regulators mandate check decommissioning with short timelines.',
      evidence: 'Kenya: "Active regulatory drivers (instant payments, check decommissioning)", Zambia: "E-check opportunity as checks decommission"',
      circumstances: [
        'Central bank announces check phase-out (12-24 month timeline)',
        'Corporate customers still want paper-based controls',
        'Float income from check clearing disappears',
        'Staff trained on check processing, not digital payments'
      ],
      customers: 'Kenya banks, Zambia opportunity',
      underserved: 'Most instant payment solutions don\'t replicate check workflow benefits (audit trail, stop-payment, reconciliation). Revenue replacement strategies are ad-hoc.'
    },
    {
      id: 'job3',
      category: 'Scaling',
      number: 3,
      title: 'Kenyan Banks\' Job: Reach 98% self-service transactions without losing the 20% who can\'t/won\'t go digital',
      statement: 'Push digital adoption from 86-94% to 98%+ while retaining elderly, rural, and digitally illiterate customers who prefer branches/agents.',
      evidence: 'Kenya: Equity Bank targeting 98% from 86%, Co-operative Bank 92%, Absa Kenya 94%',
      circumstances: [
        'Cost-to-serve via branch is 10x digital',
        'Board pressures for cost reduction',
        'Competitors at 95%+ digital',
        '2-15% of customer base (often high-value) can\'t/won\'t adopt'
      ],
      customers: 'Equity Bank (86%→98% target), Co-operative Bank (92%), Absa Kenya (94%)',
      underserved: 'Solutions focus on making digital easier (UX) or forcing migration (fees), not on understanding WHY customers resist.'
    },
    {
      id: 'job4',
      category: 'Scaling',
      number: 4,
      title: 'Large Banks\' Job: Manage 6M+ digital users with same operational capacity as 1M users',
      statement: 'Scale digital user base 5-10x without proportional increase in fraud losses, customer service staff, or operational costs.',
      evidence: 'Tanzania: NMB Bank 6M+ digital users drives need for advanced fraud management, AI/ML risk management',
      circumstances: [
        'Digital acquisition costs are low (vs. branch)',
        'But fraud rates, chargebacks, support queries scale with volume',
        'Legacy manual review processes can\'t keep up',
        'Board expects margin expansion, not just revenue growth'
      ],
      customers: 'NMB Bank Tanzania (6M+ digital users)',
      underserved: 'AI/ML fraud models exist but require expensive data science teams to maintain.'
    },
    {
      id: 'job5',
      category: 'Rural',
      number: 5,
      title: 'MFIs\' Job: Serve 90% rural clients profitably when connectivity is poor and field officers travel 100km on bikes',
      statement: 'Originate loans, verify identity, and collect repayments in rural areas when staff travel by bike, mobile networks are unreliable, and customers lack formal IDs.',
      evidence: 'Zambia: Agora Microfinance (90%+ rural clients, poor connectivity, bike-based field officers)',
      circumstances: [
        'Target market is unbanked rural poor (financial inclusion mandate)',
        'Field officers on motorcycles/bikes visiting villages',
        '2G coverage or no coverage',
        'Customers have no national ID, proof of address, or formal employment'
      ],
      customers: 'Agora Microfinance Zambia, Zambia MFI segment',
      underserved: 'Most digital onboarding requires online connectivity. Biometric devices don\'t work offline or are too expensive for MFI budgets.'
    },
    {
      id: 'job6',
      category: 'Rural',
      number: 6,
      title: 'Rural Banks\' Job: Manage 329 Micro Banking Offices with same oversight as 54 branches',
      statement: 'Supervise and support 329 distributed micro-offices with tiny transaction volumes when branch management systems assume 20-50 large branches.',
      evidence: 'Philippines: CARD Bank - 900K+ clients, 54 branches, 329 Micro Banking Offices',
      circumstances: [
        'Average MBO has <3 staff, <500 customers',
        'MBOs in remote barrios with poor connectivity',
        'Centralized compliance/risk systems can\'t see MBO-level detail',
        'Local staff lack banking expertise (often community volunteers)'
      ],
      customers: 'CARD Bank Philippines (329 MBOs)',
      underserved: 'Branch management systems don\'t scale to 300+ micro-sites. Agent banking platforms assume higher transaction volumes.'
    },
    {
      id: 'job7',
      category: 'Payments',
      number: 7,
      title: 'Legacy Banks\' Job: Connect to TIPS without replacing our core banking system',
      statement: 'Meet central bank mandate to connect to instant payment system when core lacks modern APIs and integration will cost 12+ months and $500k+.',
      evidence: 'Tanzania: TIPS - 45+ institutions connected; 490M+ transactions in 2024',
      circumstances: [
        'Central bank mandates TIPS/instant payment connection',
        'Legacy core lacks ISO 20022 support',
        'Core vendor quotes $500k-1M and 18-month timeline',
        'Can\'t afford/risk full core replacement'
      ],
      customers: 'Tanzania banks (CRDB, NMB, NBC...)',
      underserved: 'Payment gateways exist but most require deep core integration anyway.'
    },
    {
      id: 'job8',
      category: 'Payments',
      number: 8,
      title: 'Philippine Banks\' Job: Process InstaPay/PESONet at scale without building expensive real-time infrastructure',
      statement: 'Offer 24/7 instant payments when we lack real-time core systems and 24/7 operations staff.',
      evidence: 'Philippines: Intense competition from digital banks (GCash, Maya) with 5-minute onboarding and 24/7 services',
      circumstances: [
        'Customers expect instant transfers (GCash/Maya set standard)',
        'Our core runs batch processing overnight',
        'Weekend/holiday operations require expensive staffing',
        'Can\'t compete on speed with digital banks'
      ],
      customers: 'Philippines thrift/rural banks',
      underserved: 'Most processors still require significant core integration.'
    },
    {
      id: 'job9',
      category: 'Agents',
      number: 9,
      title: 'Banks with Agent Networks\' Job: Digitize 32,000 agents without losing productivity or creating fraud exposure',
      statement: 'Equip 32,000 agents with digital tools that increase productivity and compliance without creating new fraud risks or requiring expensive devices.',
      evidence: 'Zambia: Zanaco 32k+ agents, Kenya: Faulu 600+ agents need efficient digital onboarding and KYC/AML',
      circumstances: [
        'Agents are independent (not bank employees)',
        'Agents in rural areas with poor connectivity',
        'Agent devices must be affordable (<$100/agent = $3.2M budget for 32k)',
        'Agent fraud is major risk (fake deposits, identity theft)'
      ],
      customers: 'Zanaco Zambia (32k agents), Faulu Kenya (600+ agents)',
      underserved: 'Agent banking platforms assume smartphones. Fraud detection focuses on customer-side, not agent-side fraud.'
    }
  ];

  const emotionalJobs = [
    {
      id: 'e1',
      level: 'Executive',
      title: 'Sleep at night knowing we won\'t fail the regulatory exam',
      statement: 'Eliminate the 2am anxiety about "what if we fail the BSP exam and I\'m personally liable?"',
      context: 'Philippines AFASA 2025 deadline with penalties for non-compliance. Rural banks with limited IT budgets facing same rules as Tier 1 banks.',
      whyUnstated: 'Executives don\'t admit fear in research interviews. "Regulatory compliance" sounds professional; "I\'m scared of being fired" doesn\'t.',
      whiteSpace: [
        '"Compliance Insurance" Product – Offer regulatory guarantee with penalty coverage: "We guarantee BSP compliance or we cover your audit penalties." Turn anxiety into contractual peace-of-mind.',
        'Regulatory Monitoring Service – Subscription that monitors 50+ regulators across markets, alerts 12-24 months before mandates hit. Predict regulatory change before it\'s mandated.',
        'Audit-Ready Documentation – Automated compliance reporting that generates BSP-ready audit trails, examination responses, and board attestations. Turn "audit prep panic" into "audit prep automation."',
        'Compliance-as-Differentiation Marketing – Help banks turn "we\'re compliant" into competitive advantage: "We\'re the ONLY rural bank that passed AFASA exam in first cycle." Co-create marketing campaigns.',
        'First-Mover Positioning Service – Help banks comply 6+ months early, position as industry leaders vs. late adopters: "While competitors scramble, we\'re already certified."'
      ]
    },
    {
      id: 'e2',
      level: 'Executive',
      title: 'Avoid being the CEO who killed the bank with a bad technology decision',
      statement: 'Make technology investments that won\'t become the case study in "failed digital transformations."',
      context: 'Multiple mentions of "Legacy or EOL core banking systems", multi-million $ core bets. Investrust Bank Zambia closure (2024) = cautionary tale.',
      whyUnstated: 'Career-ending fear is too vulnerable to admit. Framed as "ROI analysis" or "vendor evaluation" instead.',
      whiteSpace: [
        'Reference Customer Program – Cultivate 10+ "lighthouse" banks willing to speak publicly: "We\'re live, fraud is down 40%, here\'s our CEO\'s number." Turn vendor claims into peer validation.',
        'Phased Implementation with Rollback Guarantees – Offer staged deployment: pilot → scale → full, with contractual rollback to previous system if KPIs aren\'t met. Remove career-ending downside risk.',
        'Proof-of-Value Pilot Pricing – "Pay nothing for 90 days, then pay based on fraud prevented / costs reduced." Let results speak before commitment. Performance-based step-ups reduce upfront risk.',
        'Migration Insurance – Guarantee zero downtime migration or cover operational losses. Explicitly insure against "we killed the bank" scenario with contractual backstops.',
        '"Battle-Tested" Positioning – Emphasize 33-year history, 240 solutions, 99.9%+ uptime on mission-critical payments. Position as "proven" vs. "unproven startups" or "risky new vendors."',
        'Executive Peer Advisory Council – Create closed-door forum where CEOs share "what went wrong" stories. Turn individual fear into collective risk management. Position Sybrin as trusted partner, not vendor.'
      ]
    },
    {
      id: 'e3',
      level: 'Executive',
      title: 'Feel like an innovator (not a dinosaur) when board members are 30 years younger',
      statement: 'Prove to younger board members that I understand digital banking despite being 55+ years old.',
      context: 'KCB, Equity Bank described as "digital leadership". Competition from digital-only banks. Generational shift in financial services.',
      whyUnstated: 'Ageism concerns are taboo. Imposter syndrome doesn\'t get documented in market research.',
      whiteSpace: [
        'Innovation Showcase Program – Create "Digital Leadership Summits" where bank CEOs present their innovations to regulators, donors, press. Give executives public platforms to be seen as visionaries.',
        'Thought Leadership Ghost-Writing – Co-author whitepapers, articles, conference keynotes with bank executives: "How [Bank Name] is Transforming African Banking." Turn implementations into executive personal brands.',
        'Industry Award Nominations – Proactively nominate client banks for "Digital Bank of the Year," "Innovation Leader," etc. Turn technology adoption into executive recognition and reputation building.',
        'Executive Education Programs – Offer "AI in Banking" / "Digital Transformation Masterclass" certifications for senior executives. Let them learn without admitting they don\'t know. Badge-able credentials.',
        'Early Adopter Recognition – Create "Sybrin Innovation Council" for first 20 banks adopting new tech. Exclusive club positioning: "You\'re not a follower, you\'re a pioneer." Feed innovator identity.',
        'Board Presentation Kits – Provide executives with polished, board-ready decks showing their bank vs. industry benchmarks on digital metrics. Make them look smart in boardrooms with younger members.'
      ]
    },
    {
      id: 'e4',
      level: 'Middle Management',
      title: 'Feel confident I won\'t be scapegoated when this project inevitably has problems',
      statement: 'Protect my reputation and employment when the digital transformation project hits inevitable roadblocks.',
      context: 'Tanzania post-core migration projects. Multiple mentions of "integration," "migration," "system harmonization".',
      whyUnstated: 'CIOs can\'t admit they expect projects to fail. "Risk management" sounds better than "cover my ass".',
      whiteSpace: [
        'CYA Documentation Service – Automated project governance: decision logs, stakeholder sign-offs, risk registers with board approvals. Create audit trail proving "I followed best practice."',
        'Shared Accountability Contracts – Explicitly document shared ownership between bank IT, Sybrin, and third parties. No single scapegoat if things go wrong. Contractual protection from blame.',
        'Continuous ROI Reporting – Real-time dashboards showing project value delivered month-by-month: "Even if we stopped today, we\'ve already saved $X." Build defensibility before final delivery.',
        'Pre-Mortem Risk Workshops – Joint sessions identifying "what could go wrong" and documenting mitigation plans signed by bank executives. Make failure everyone\'s problem, not just the CIO\'s.',
        'Industry Standard Benchmarking – Position every decision as "standard practice": "97% of African banks use this approach." Turn individual decisions into industry norms. Safety in numbers.',
        'Escalation Fast-Track – Guarantee senior leadership engagement within 4 hours for any project blocker. Show stakeholders that problems get executive attention, not CIO blame.'
      ]
    },
    {
      id: 'e5',
      level: 'Middle Management',
      title: 'Feel competent when vendors assume I understand technology I don\'t',
      statement: 'Appear knowledgeable in vendor meetings when I don\'t actually understand APIs, cloud architecture, or machine learning.',
      context: 'Tanzania community banks: "Limited IT budgets and small teams". Smaller banks have shortage of skilled IT staff.',
      whyUnstated: 'Professional competence is core to identity. Admitting ignorance = career risk.',
      whiteSpace: [
        'Simplified Evaluation Frameworks – "Banking Technology Decision Guide" (non-technical): rate vendors on 5 simple criteria. Let non-technical buyers make defensible decisions without technical depth.',
        'Plain English Documentation – Replace technical jargon with banking language: "API" → "how systems talk to each other," "cloud" → "hosted by us, not you." Make tech accessible without condescension.',
        'Guided Decision Workshops – Facilitate vendor selection using structured frameworks that don\'t assume technical knowledge. Lead buyers to right answer without exposing their knowledge gaps.',
        'Technical Translator Service – Assign a "technical liaison" who explains vendor proposals in plain language privately before formal meetings. Let buyers ask "dumb questions" safely.',
        'Peer Learning Groups – Create cohorts of non-technical IT leaders from similar-sized banks: "We\'re all figuring this out together." Normalize not knowing, reduce shame.',
        'Pre-Call Briefings – Before vendor demos, send 1-page "What to Listen For" guides: "When they say X, that means Y. Good signs: A, B. Red flags: C, D." Arm buyers with confidence.'
      ]
    },
    {
      id: 'e6',
      level: 'Frontline Staff',
      title: 'Avoid feeling stupid when learning new systems that younger colleagues master instantly',
      statement: 'Learn new digital tools without feeling humiliated by my age or education level.',
      context: 'Massive digital transformation. Equity Bank 98% digital target = radical workflow changes. 32k Zanaco agents being "digitized".',
      whyUnstated: 'Frontline Staff rarely interviewed in market research. Vulnerability about learning difficulties is shameful.',
      whiteSpace: [
        'Age-Inclusive Training Design – Training that doesn\'t assume digital native comfort: larger fonts, step-by-step screenshots, no jargon. Designed for 50+ year-olds who\'ve never used smartphones.',
        'Peer Mentoring (not youth teaching elders) – Pair experienced staff together for mutual learning. Avoid "young person teaches old person" dynamic that reinforces age hierarchy and shame.',
        'Private Practice Environments – Sandbox systems where staff can practice without anyone watching. Remove performance anxiety; mistakes don\'t have witnesses.',
        'Gradual Rollout with Opt-Out Escape – Phase new tools in slowly with graceful exits: "If this doesn\'t work for you, stay on old system for 6 more months." Reduce pressure, increase adoption.',
        'Success Stories from Older Staff – Showcase 55+ year-old staff who mastered new systems. "If I can do it, you can too" messaging from relatable peers, not 25-year-old trainers.',
        'Accessible Certification Programs – Badge/certificate programs for completing digital training. Give older staff visible proof of competence to display to peers and family.'
      ]
    },
    {
      id: 'e7',
      level: 'Frontline Staff',
      title: 'Feel proud of my work (not exploitative) when charging poor customers fees',
      statement: 'Reconcile "we serve the poor" mission with "we charge 30% interest" reality without feeling like a predator.',
      context: 'Agora MFI Zambia: 90% rural poor clients. CARD Bank: poverty eradication mission. MFIs with financial inclusion mandates vs. profit pressures.',
      whyUnstated: 'Moral discomfort isn\'t professional. Loan officers won\'t admit to guilt in interviews.',
      whiteSpace: [
        'Impact Storytelling Tools – Dashboards showing "Because of your work, 47 families bought their first cow, 12 kids went to secondary school." Turn transactions into visible social impact.',
        'Transparent Pricing Justification – Educational materials explaining cost structures: "30% interest covers 100km bike rides, loan defaults, rural operations." Turn guilt into understanding.',
        'Client Success Showcases – Regular stories of customer transformations: "Started with $50 loan, now employs 3 people." Give staff proof their work creates opportunity, not exploitation.',
        'Ethical Product Design – Products with explicit poverty-exit goals: "Graduation Loans" designed to move clients from survival → small business. Make anti-poverty mission tangible.',
        'Financial Literacy Integration – Require loan officers to teach basic finance alongside lending. Transform role from "debt collector" to "educator and advocate."',
        'Community Impact Metrics – Track and celebrate community-level outcomes: poverty rates, school enrollment, business creation. Make staff part of measurable social change.'
      ]
    },
    {
      id: 'e8',
      level: 'Frontline Staff',
      title: 'Feel safe when traveling alone to remote villages with cash/devices',
      statement: 'Do my job in dangerous environments without constant fear of robbery, assault, or device theft.',
      context: 'Agora MFI Zambia: bike-based field officers. Rural connectivity issues. Agent networks in high-crime areas.',
      whyUnstated: 'Personal safety concerns sound weak. Employers may dismiss as "part of the job".',
      whiteSpace: [
        'Cashless Field Operations – Eliminate cash handling entirely: all transactions digital, instant settlement. Remove primary robbery target (cash) from field staff.',
        'Device Insurance & Replacement Programs – "Your phone gets stolen, we replace it same day, no questions asked." Remove financial fear barrier to reporting theft.',
        'Safety Check-In Systems – Mandatory location pings every 2 hours with automatic escalation if missed. Staff know someone is watching and will respond.',
        'Community Safety Partnerships – Partner with village leaders for "safe house" networks: designated homes where field officers can seek help if threatened.',
        'Visible Security Protocols – Logo-free vehicles, plain-clothes staff, randomized schedules. Make it non-obvious who is carrying value, reduce targeting.',
        'Peer Travel Programs – Field officers travel in pairs or small teams in high-risk areas. Share costs across efficiency, provide mutual protection and emotional support.'
      ]
    }
  ];

  const socialJobs = [
    {
      id: 's1',
      level: 'Executive',
      title: 'Be seen as bold innovator by peers (not cautious bureaucrat)',
      statement: 'When industry peers mention our bank, I want them to say "cutting-edge" not "safe and boring."',
      context: 'NMB Tanzania: "Euromoney Best Digital Bank 2025". CRDB, Equity Bank, KCB all compete on "digital leadership" positioning.',
      whyUnstated: 'Vanity/ego are socially unacceptable motivations. Disguised as "brand positioning" or "competitive differentiation".',
      whiteSpace: [
        'Industry Award Nomination Services – Proactively nominate banks for "Digital Bank of Year," "Innovation Leader" awards. Turn implementations into executive personal brands and peer recognition.',
        'Executive Speaking Opportunities – Place bank leaders as keynote speakers at regional banking conferences. Give platform to be seen as thought leaders by peers.',
        'Innovation Showcase Events – Host or co-host "Digital Banking Summit" where executives present their innovations to regulators, press, competitors. Public stage for innovation positioning.',
        'Media Relations Programs – Secure Forbes/Euromoney features: "How [Bank] is transforming African banking." Turn tech adoption into executive reputation building.',
        'Early Adopter Councils – Create exclusive "Innovation Council" for first 20 banks adopting new tech. VIP club positioning: "You\'re not a follower, you\'re a pioneer."',
        'Peer Benchmarking Reports – Publish industry reports showing bank\'s digital metrics vs. competitors. Give executives data to prove "we\'re ahead of the curve" in boardrooms and cocktail parties.'
      ]
    },
    {
      id: 's2',
      level: 'Executive',
      title: 'Maintain status/respect when my branches are closing and staff are being laid off',
      statement: 'Execute digital transformation without being seen as the heartless executive who destroyed people\'s livelihoods.',
      context: 'Equity Bank: 86% → 98% digital target = massive branch reduction implied. Cost-to-income ratio improvements via digitalization.',
      whyUnstated: 'Compassion fatigue is real but can\'t be admitted. "Shareholder value" sounds better than "I feel guilty about layoffs".',
      whiteSpace: [
        'Staff Transition Programs – Retraining packages that move branch staff to digital roles, agent network management, or customer service. Show compassion through action, not rhetoric.',
        'Public Repositioning Narratives – Communications emphasizing "evolution not elimination": "We\'re not closing branches, we\'re opening 500 agent locations." Frame transformation as expansion.',
        'Community Investment Storytelling – Highlight how savings from branch closures fund rural agent networks, mobile banking access. Turn cost-cutting into financial inclusion story.',
        'Employee Ownership of Digital – Give displaced staff equity/profit-sharing in new digital channels they helped build. Turn victims into beneficiaries.',
        'Gradual Transition Timelines – 3-5 year phased approach with generous severance, early retirement packages. Demonstrate humanity through patience, not abruptness.',
        'Third-Party Transition Services – Partner with HR firms to place displaced staff at other banks. Executive reputation protected: "We took care of our people even as we transformed."'
      ]
    },
    {
      id: 's3',
      level: 'Middle Management',
      title: 'Maintain authority over my team when they know technology better than I do',
      statement: 'Retain respect and control as a manager when my team members have skills I\'ll never master.',
      context: 'Generational technology skill gaps. Young technical staff vs. older management. Digital transformation requires skills management doesn\'t have.',
      whyUnstated: 'Authority struggles are politically sensitive. Framed as "leadership" vs. "technical gaps".',
      whiteSpace: [
        'Leadership Framework Training – "Managing Technical Teams Without Being Technical" programs. Legitimize non-technical management through strategic leadership focus.',
        'Reverse Mentoring Programs – Formalize junior staff teaching seniors as "mentoring," not subordinates correcting bosses. Reframe knowledge transfer as mutual development.',
        'Decision Framework Tools – Give managers structured evaluation criteria: "Rate vendors on these 8 factors." Enable good decisions without deep technical knowledge.',
        'Technical Translator Roles – Create "technical liaison" positions that explain tech to managers privately. Managers make informed decisions without exposing knowledge gaps to team.',
        'Value Repositioning – Training emphasizing "Your job isn\'t to know the tech, it\'s to manage outcomes." Shift authority source from technical expertise to business judgment.',
        'Executive Coaching – Private coaching for managers struggling with authority: "How to lead when your team is smarter than you." Normalize the challenge, provide strategies.'
      ]
    },
    {
      id: 's4',
      level: 'Board Members',
      title: 'Be perceived as responsible fiduciary (not asleep at the wheel) if bank fails',
      statement: 'Protect my reputation and legal standing if this bank becomes the next failure case study.',
      context: 'Investrust Bank Zambia closure (2024). Multiple mentions of regulatory penalties, failed projects. Board liability is real in banking.',
      whyUnstated: 'Board members won\'t admit they\'re primarily self-interested. Fiduciary duty sounds better than "CYA".',
      whiteSpace: [
        'Board Documentation Services – Automated governance: decision logs, risk acknowledgments, dissenting opinions recorded. Create audit trail proving "I asked hard questions."',
        'Third-Party Risk Validation – Independent tech assessments that board can commission: "External experts validated this decision." Transfer accountability to credible third parties.',
        'Benchmark Governance Reports – "Industry Standard Decision Framework" showing board followed best practices. Safety in numbers: "97% of boards approved similar tech this way."',
        'Board Education Programs – "Technology Risk for Non-Technical Directors" certifications. Give board members credentials proving they took governance seriously.',
        'Liability Insurance Packages – D&O insurance specifically covering technology project failures. Financial protection reduces personal risk anxiety.',
        'Exit Documentation Protocols – For dissenting board members: formal process to document objections before project approval. Create paper trail separating them from failures.'
      ]
    }
  ];

  // Capability Repurposing Data
  const corePlatforms = [
    {
      id: 'detect',
      name: 'Sybrin Detect',
      tagline: 'Universal Real-Time Anomaly Detection',
      color: 'red',
      icon: AlertCircle,
      originalUse: 'Fraud detection',
      coreCapability: 'Real-time pattern detection and alerting',
      repurposedApplications: [
        { name: 'Fraud Detection', status: 'deployed', priority: 'P0' },
        { name: 'AFASA/FATF Regulatory Compliance Monitoring', status: 'deploying', priority: 'P0' },
        { name: 'Agent Fraud & Performance Analytics', status: 'piloting', priority: 'P1' },
        { name: 'MBO Oversight & Anomaly Detection', status: 'development', priority: 'P1' },
        { name: 'Operational Risk Detection', status: 'roadmap', priority: 'P3' },
        { name: 'Customer Service Prediction', status: 'roadmap', priority: 'P3' }
      ],
      feasibility: '95%',
      effort: '1-2 months (rule sets + reporting templates)'
    },
    {
      id: 'connect',
      name: 'Sybrin Connect',
      tagline: 'Legacy-to-Modern Integration Platform',
      color: 'blue',
      icon: Zap,
      originalUse: 'Connect cores to instant payment schemes',
      coreCapability: 'Core-agnostic transaction processing, state management, protocol translation',
      repurposedApplications: [
        { name: 'Instant Payment Integration (TIPS, iPSO, InstaPay)', status: 'deployed', priority: 'P0' },
        { name: 'Batch-Core Real-Time Facade', status: 'productizing', priority: 'P0' },
        { name: 'Cross-Border Payments (TCIB, SWIFT)', status: 'deployed', priority: 'P0' },
        { name: 'Open Banking APIs', status: 'roadmap', priority: 'P3' },
        { name: 'Fintech Partnership Integration', status: 'roadmap', priority: 'P3' }
      ],
      feasibility: '90%',
      effort: '1 month (document + implementation accelerator)'
    },
    {
      id: 'flow',
      name: 'Sybrin Flow',
      tagline: 'No-Code Workflow Automation',
      color: 'purple',
      icon: Workflow,
      originalUse: 'Digital onboarding workflows',
      coreCapability: 'Visual workflow designer, conditional logic, integrations',
      repurposedApplications: [
        { name: 'Digital Onboarding', status: 'deployed', priority: 'P0' },
        { name: 'Loan Origination', status: 'development', priority: 'P0' },
        { name: 'Compliance Workflows', status: 'development', priority: 'P0' },
        { name: 'Customer Service Exception Handling', status: 'evaluate', priority: 'P2' },
        { name: 'Agent Onboarding', status: 'bundled', priority: 'P1' },
        { name: 'Any Operational Process', status: 'platform', priority: 'P0' }
      ],
      feasibility: '85%',
      effort: '2 months (templates + business user UX)'
    },
    {
      id: 'offline',
      name: 'Sybrin Offline',
      tagline: 'Sync-When-Connected Architecture',
      color: 'green',
      icon: Archive,
      originalUse: 'Digital KYC with offline capability',
      coreCapability: 'Offline-first mobile capture, sync when connected',
      repurposedApplications: [
        { name: 'Digital KYC', status: 'deployed', priority: 'P0' },
        { name: 'MFI Rural Lending Suite', status: 'development', priority: 'P1' },
        { name: 'MBO Transaction Processing', status: 'development', priority: 'P1' },
        { name: 'Field Officer Safety & Monitoring', status: 'evaluate', priority: 'P2' },
        { name: 'Agent Tools (Feature Phone Mode)', status: 'evaluate', priority: 'P2' }
      ],
      feasibility: '70%',
      effort: '2-3 months (MFI workflow templates)'
    },
    {
      id: 'approve',
      name: 'Sybrin Approve',
      tagline: 'Transaction Governance Engine',
      color: 'orange',
      icon: CheckCircle,
      originalUse: 'Check clearing with multi-party approval',
      coreCapability: 'Multi-party approval, audit trails, reconciliation, dispute handling',
      repurposedApplications: [
        { name: 'Check Clearing', status: 'deployed', priority: 'P0' },
        { name: 'Debit Order / Mandate Management', status: 'deployed', priority: 'P0' },
        { name: 'Controlled Instant Payments', status: 'evaluate', priority: 'P2' },
        { name: 'Loan Disbursement Controls', status: 'bundled', priority: 'P1' },
        { name: 'Corporate Treasury Workflows', status: 'roadmap', priority: 'P3' }
      ],
      feasibility: '60%',
      effort: '4-6 months (apply check workflow to instant payments)'
    }
  ];

  // Higher-Level Jobs Data
  const jobFamilies = [
    {
      id: 'regulatory',
      name: 'Regulatory Adaptation Jobs',
      icon: Shield,
      operationalJobs: ['Job 1: Meet AFASA mandate', 'Job 2: Navigate check decommissioning'],
      fundamentalJob: 'Navigate regulatory change without disruption to operations or economics',
      metaJob: 'Turn regulatory mandates into competitive advantage',
      whiteSpace: [
        'Regulatory future-proofing - monitor 50+ regulators, alert 12-24 months before mandates',
        'Compliance-as-differentiation - marketing services that turn compliance into competitive advantage'
      ]
    },
    {
      id: 'scaling',
      name: 'Profitable Scaling Jobs',
      icon: TrendingUp,
      operationalJobs: ['Job 3: Reach 98% self-service', 'Job 4: Manage 6M+ digital users'],
      fundamentalJob: 'Achieve operational leverage as we scale',
      metaJob: 'Grow profitably despite diminishing returns',
      whiteSpace: [
        'Profitability-based customer routing - high-cost segments auto-routed to premium tiers',
        'Customer co-production platforms - power users help novice users (reduces cost-to-serve)'
      ]
    },
    {
      id: 'rural',
      name: 'Difficult Segment Profitability Jobs',
      icon: Heart,
      operationalJobs: ['Job 5: Serve 90% rural clients', 'Job 6: Manage 329 MBOs', 'Job 9: Digitize 32k agents'],
      fundamentalJob: 'Serve unprofitable segments profitably through operational innovation',
      metaJob: 'Make financial inclusion economically sustainable (not just mission-driven)',
      whiteSpace: [
        'Shared rural infrastructure - 5-10 MFIs share 329 MBOs, field officers (cost drops 80%)',
        'Agent capacity marketplace - 32k agents do KYC for multiple banks during idle time'
      ]
    },
    {
      id: 'legacy',
      name: 'Legacy Infrastructure Competition Jobs',
      icon: Layers,
      operationalJobs: ['Job 7: Connect to TIPS without core replacement', 'Job 8: Process InstaPay at scale'],
      fundamentalJob: 'Participate in digital infrastructure without transformation',
      metaJob: 'Turn legacy constraints into competitive advantages',
      whiteSpace: [
        'Legacy bank as platform - rent license, compliance, balance sheet to fintechs',
        'Trust arbitrage - position legacy systems as "battle-tested security" vs "unproven cloud"'
      ]
    }
  ];

  const metaJobs = [
    {
      id: 'meta1',
      title: 'Compete successfully despite incumbent constraints',
      reframe: 'Turn incumbent disadvantages into competitive advantages',
      examples: [
        'Instead of "work around legacy core" → "leverage legacy core as trust signal, compliance moat"',
        'Instead of "reduce branch costs" → "turn branches into fintech distribution, premium hubs"',
        'Instead of "comply with regulation" → "use regulation to drive competitor exit"'
      ],
      tam: '$1-10B (ecosystem play)'
    },
    {
      id: 'meta2',
      title: 'Grow and compete when we\'re asset-heavy and competitors are asset-light',
      reframe: 'Monetize existing infrastructure to compete with asset-light players',
      examples: [
        'Rent agent network to GCash (they get last-mile distribution, we get fees + data)',
        'Rent banking license to fintechs (they get regulatory cover, we get revenue share)',
        'Multi-tenant our legacy core to Tier 3 banks (infrastructure-as-a-service)'
      ],
      tam: '$1-10B (platform play)'
    },
    {
      id: 'meta3',
      title: 'Satisfy stakeholders with conflicting demands',
      reframe: 'Simultaneously satisfy contradictory stakeholder demands',
      examples: [
        'Board wants profitability vs. regulator wants inclusion',
        'Regulator wants compliance vs. shareholders want ROI',
        'Customers want digital vs. elderly need branches',
        'Real-time stakeholder demand balancing with AI optimization'
      ],
      tam: '$100M-$1B (multi-stakeholder optimization platform)'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-sybrin-blue-600 to-purple-600 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Jobs-To-Be-Done Intelligence</h1>
          </div>
          <p className="text-sybrin-blue-100 text-lg">
            Strategic analysis of customer jobs across 9 functional dimensions, emotional/social contexts, and multiple abstraction levels
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>140+ Named Institutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>248 Research Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>4 Markets: Kenya, Zambia, Tanzania, Philippines</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-sybrin-blue-600 text-sybrin-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Jobs Analysis Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-sybrin-blue-50 border border-sybrin-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-sybrin-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-sybrin-blue-900 mb-3">Understanding Customer Jobs</h3>
                  <p className="text-sybrin-blue-800 mb-4">
                    This analysis identifies the <strong>jobs customers are trying to do</strong> when they "hire" financial services solutions.
                    These are NOT Sybrin's jobs - these are the jobs of banks, MFIs, and financial institutions across Kenya, Zambia, Tanzania, and the Philippines.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-sybrin-blue-900 mb-1">9 Functional Jobs</div>
                      <div className="text-sybrin-blue-700">Operational jobs derived from actual documented customer challenges across 140+ institutions</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-sybrin-blue-900 mb-1">8 Emotional Jobs</div>
                      <div className="text-sybrin-blue-700">Unstated emotional needs from executives, managers, and frontline staff</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-sybrin-blue-900 mb-1">4 Social Jobs</div>
                      <div className="text-sybrin-blue-700">How decision-makers want to be perceived by peers, boards, and industry</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Functional Jobs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Functional Jobs</h2>
              <p className="text-gray-600 mb-6">
                Jobs derived from documented challenges at 140+ named financial institutions. Evidence-based, not assumptions.
              </p>

              <div className="space-y-4">
                {functionalJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide ${
                            job.category === 'Regulatory' ? 'bg-red-100 text-red-700' :
                            job.category === 'Scaling' ? 'bg-sybrin-blue-100 text-sybrin-blue-700' :
                            job.category === 'Rural' ? 'bg-green-100 text-green-700' :
                            job.category === 'Payments' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {job.category}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            Job {job.number}
                          </div>
                        </div>
                        {(() => {
                          const parts = job.title.split(': ');
                          if (parts.length >= 2) {
                            return (
                              <>
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                  {parts[0]}
                                </div>
                                <div className="font-semibold text-gray-900 text-lg">
                                  {parts.slice(1).join(': ')}
                                </div>
                              </>
                            );
                          }
                          return (
                            <div className="font-semibold text-gray-900 text-lg">
                              {job.title}
                            </div>
                          );
                        })()}
                      </div>
                      {expandedJobs[job.id] ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedJobs[job.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-5">
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            What They're Trying to Do
                          </div>
                          <div className="text-gray-900 leading-relaxed">{job.statement}</div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Direct Quote from Research
                          </div>
                          <div className="bg-sybrin-blue-50 border-l-4 border-sybrin-blue-400 p-3 italic text-gray-700">
                            "{job.evidence}"
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Key Challenges
                          </div>
                          <div className="space-y-2">
                            {job.circumstances.map((circ, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span className="text-sybrin-blue-500 mt-1">•</span>
                                <span className="text-gray-700 leading-relaxed">{circ}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="text-sm font-semibold text-orange-900 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Gap in the Market
                          </div>
                          <div className="text-gray-800 leading-relaxed">{job.underserved}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional Jobs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Emotional Jobs</h2>
              <p className="text-gray-600 mb-6">
                Research documents functional jobs extensively but <strong>never directly captures emotional jobs</strong>.
                However, we can infer these from documented situations and universal human motivations.
              </p>

              <div className="space-y-4">
                {emotionalJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-pink-100 text-pink-700">
                            {job.level}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            Emotional Job
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900 text-lg mb-1">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-600 italic">
                          {job.statement}
                        </div>
                      </div>
                      {expandedJobs[job.id] ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedJobs[job.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">Context Inference</div>
                          <div className="text-gray-700 text-sm">{job.context}</div>
                        </div>

                        {job.whiteSpace && job.whiteSpace.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded p-4">
                            <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              White Space Opportunities
                            </div>
                            <ul className="space-y-2">
                              {job.whiteSpace.map((opportunity, idx) => (
                                <li key={idx} className="text-green-800 text-sm flex gap-2">
                                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                                  <span>{opportunity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Jobs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Social Jobs</h2>
              <p className="text-gray-600 mb-6">
                How decision-makers want to be perceived by peers, boards, staff, and the industry.
                These social jobs drive hiring/firing decisions but are <strong>disguised in professional language</strong>.
              </p>

              <div className="space-y-4">
                {socialJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleJob(job.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-indigo-100 text-indigo-700">
                            {job.level}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            Social Job
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900 text-lg mb-1">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-600 italic">
                          {job.statement}
                        </div>
                      </div>
                      {expandedJobs[job.id] ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedJobs[job.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">Context Inference</div>
                          <div className="text-gray-700 text-sm">{job.context}</div>
                        </div>

                        {job.whiteSpace && job.whiteSpace.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded p-4">
                            <div className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              White Space Opportunities
                            </div>
                            <ul className="space-y-2">
                              {job.whiteSpace.map((opportunity, idx) => (
                                <li key={idx} className="text-green-800 text-sm flex gap-2">
                                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                                  <span>{opportunity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Capability Repurposing Tab */}
        {activeTab === 'repurposing' && (
          <div className="space-y-8">
            {/* Context Box */}
            <div className="bg-sybrin-blue-50 border border-sybrin-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-sybrin-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-sybrin-blue-900 mb-3">What is Capability Repurposing?</h3>
                  <p className="text-sybrin-blue-800 mb-4">
                    Instead of building 20 new products to address 100 customer jobs, Sybrin can <strong>systematically repurpose 5 core capabilities</strong> to solve 20 jobs each through configuration and positioning (not new development).
                  </p>
                  <div className="bg-white rounded p-4 mb-4">
                    <div className="text-sm font-semibold text-sybrin-blue-900 mb-2">Example: E-checks aren't just for replacing paper checks</div>
                    <div className="text-sybrin-blue-800 text-sm">
                      The underlying capability is "digital workflow with paper-like controls (audit trails, approval workflows, dispute resolution)."
                      This same capability can be repurposed for: loan disbursements, payroll, treasury operations, instant payments with governance, and more.
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-sybrin-blue-900 mb-1">80% Addressable</div>
                      <div className="text-sybrin-blue-700">80% of identified jobs can be addressed by repurposing existing capabilities with minimal development</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-sybrin-blue-900 mb-1">5 Core Platforms</div>
                      <div className="text-sybrin-blue-700">Detect, Connect, Flow, Offline, Approve - each solving 5-10 jobs through repurposing</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-sybrin-blue-900 mb-1">Exit Story</div>
                      <div className="text-sybrin-blue-700">Platform capabilities that solve emerging jobs faster than competitors (not just point products)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Core Platforms */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">5 Core Capability Platforms</h2>

              <div className="space-y-6">
                {corePlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(platform.id)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-${platform.color}-100`}>
                            <Icon className={`w-6 h-6 text-${platform.color}-600`} />
                          </div>
                          <div className="text-left">
                            <div className="text-xl font-bold text-gray-900">{platform.name}</div>
                            <div className="text-sm text-gray-600">{platform.tagline}</div>
                          </div>
                        </div>
                        {expandedSections[platform.id] ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {expandedSections[platform.id] && (
                        <div className="px-6 py-5 bg-gray-50 border-t-2 border-gray-200">
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <div className="text-sm font-semibold text-gray-700 mb-2">Original Use</div>
                              <div className="text-gray-900 mb-4">{platform.originalUse}</div>

                              <div className="text-sm font-semibold text-gray-700 mb-2">Core Capability</div>
                              <div className="text-gray-700 text-sm">{platform.coreCapability}</div>
                            </div>

                            <div className="space-y-3">
                              <div className="bg-white border border-gray-200 rounded p-3">
                                <div className="text-xs font-semibold text-gray-600 mb-1">FEASIBILITY</div>
                                <div className="text-2xl font-bold text-green-600">{platform.feasibility}</div>
                              </div>
                              <div className="bg-white border border-gray-200 rounded p-3">
                                <div className="text-xs font-semibold text-gray-600 mb-1">EFFORT TO REPURPOSE</div>
                                <div className="text-sm text-gray-900">{platform.effort}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-3">Repurposed Applications</div>
                            <div className="space-y-2">
                              {platform.repurposedApplications.map((app, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[app.priority]}`}>
                                      {app.priority}: {priorityLabels[app.priority]}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">{app.name}</div>
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    app.status === 'deployed' ? 'bg-green-100 text-green-700' :
                                    app.status === 'deploying' ? 'bg-sybrin-blue-100 text-sybrin-blue-700' :
                                    app.status === 'piloting' ? 'bg-yellow-100 text-yellow-700' :
                                    app.status === 'development' ? 'bg-orange-100 text-orange-700' :
                                    app.status === 'bundled' ? 'bg-purple-100 text-purple-700' :
                                    app.status === 'platform' ? 'bg-indigo-100 text-indigo-700' :
                                    app.status === 'productizing' ? 'bg-teal-100 text-teal-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {app.status}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prioritization Framework */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Prioritization Framework (18-Month Exit)</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="px-3 py-1 rounded border bg-red-100 text-red-800 border-red-300 text-sm font-medium">P0</div>
                  <div>
                    <div className="font-semibold text-gray-900">Do Now (Exit-Critical, Q1-Q2 2026)</div>
                    <div className="text-gray-600 text-sm">High feasibility (>80%) + Clear first customer + Revenue in 12 months + Strengthens exit narrative</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="px-3 py-1 rounded border bg-orange-100 text-orange-800 border-orange-300 text-sm font-medium">P1</div>
                  <div>
                    <div className="font-semibold text-gray-900">Do Soon (Exit-Valuable, Q2-Q3 2026)</div>
                    <div className="text-gray-600 text-sm">Medium feasibility (60-80%) + Identified first customer + Revenue in 18 months + Key differentiation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="px-3 py-1 rounded border bg-yellow-100 text-yellow-800 border-yellow-300 text-sm font-medium">P2</div>
                  <div>
                    <div className="font-semibold text-gray-900">Evaluate (Strategic Value, Q3-Q4 2026)</div>
                    <div className="text-gray-600 text-sm">Medium feasibility + Strategic but no immediate customer + May generate revenue post-exit</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="px-3 py-1 rounded border bg-gray-100 text-gray-600 border-gray-300 text-sm font-medium">P3</div>
                  <div>
                    <div className="font-semibold text-gray-900">Defer (Post-Exit Innovation)</div>
                    <div className="text-gray-600 text-sm">Low feasibility (&lt;50%) OR long development OR regulatory blockers + Post-exit opportunity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Higher-Level Jobs Tab */}
        {activeTab === 'higher' && (
          <div className="space-y-8">
            {/* Context Box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-3">Job Abstraction Levels</h3>
                  <p className="text-green-800 mb-4">
                    Jobs exist at different levels of abstraction. <strong>Higher abstraction reveals larger opportunities</strong> but takes longer to execute.
                    The same customer evidence reveals different white space depending on how you frame the job.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-green-900 mb-1">Operational Level</div>
                      <div className="text-green-700 mb-2">Example: "Manage 6M+ digital users with same capacity as 1M users"</div>
                      <div className="text-xs text-green-600">White Space: AI fraud platform, chatbots ($10-50M TAM)</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-green-900 mb-1">Fundamental Level</div>
                      <div className="text-green-700 mb-2">Example: "Achieve operational leverage as we scale"</div>
                      <div className="text-xs text-green-600">White Space: Customer profitability routing ($100M-$1B TAM)</div>
                    </div>
                    <div className="bg-white rounded p-3">
                      <div className="font-semibold text-green-900 mb-1">Meta Level</div>
                      <div className="text-green-700 mb-2">Example: "Turn incumbent constraints into competitive advantages"</div>
                      <div className="text-xs text-green-600">White Space: Trust infrastructure for fintechs ($1-10B TAM)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Families */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4 Job Families (Fundamental Level)</h2>
              <p className="text-gray-600 mb-6">
                Grouping the 9 operational jobs reveals 4 fundamental patterns that customers are really trying to solve.
              </p>

              <div className="space-y-4">
                {jobFamilies.map((family) => {
                  const Icon = family.icon;
                  return (
                    <div key={family.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(family.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-sybrin-blue-100">
                            <Icon className="w-5 h-5 text-sybrin-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-gray-900">{family.name}</div>
                            <div className="text-sm text-gray-600 mt-1">Meta Job: {family.metaJob}</div>
                          </div>
                        </div>
                        {expandedSections[family.id] ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {expandedSections[family.id] && (
                        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 space-y-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-2">Operational Jobs in This Family</div>
                            <ul className="list-disc list-inside space-y-1">
                              {family.operationalJobs.map((job, idx) => (
                                <li key={idx} className="text-gray-700 text-sm">{job}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-gray-700 mb-1">Fundamental Job (Abstracted)</div>
                            <div className="text-gray-900 font-medium">{family.fundamentalJob}</div>
                          </div>

                          <div className="bg-green-50 border border-green-200 rounded p-3">
                            <div className="text-sm font-semibold text-green-900 mb-2">White Space Revealed</div>
                            <ul className="list-disc list-inside space-y-1">
                              {family.whiteSpace.map((ws, idx) => (
                                <li key={idx} className="text-green-800 text-sm">{ws}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meta Jobs */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3 Meta-Level Jobs (Highest Abstraction)</h2>
              <p className="text-gray-600 mb-6">
                Cross-cutting patterns that appear across ALL job families. These reveal the <strong>largest strategic opportunities</strong> but require ecosystem orchestration.
              </p>

              <div className="space-y-4">
                {metaJobs.map((job) => (
                  <div key={job.id} className="bg-white border-2 border-sybrin-blue-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(job.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-sybrin-blue-50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <div className="text-lg font-bold text-gray-900">{job.title}</div>
                        <div className="text-sm text-sybrin-blue-600 mt-1 font-medium">Reframed: {job.reframe}</div>
                        <div className="text-xs text-gray-500 mt-2">TAM: {job.tam}</div>
                      </div>
                      {expandedSections[job.id] ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expandedSections[job.id] && (
                      <div className="px-6 py-5 bg-sybrin-blue-50 border-t-2 border-sybrin-blue-200">
                        <div className="text-sm font-semibold text-gray-700 mb-3">Solution Space Shift</div>
                        <div className="space-y-2">
                          {job.examples.map((example, idx) => (
                            <div key={idx} className="bg-white border border-sybrin-blue-200 rounded p-3 text-sm text-gray-700">
                              {example}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Timeline */}
            <div className="bg-gradient-to-r from-sybrin-blue-600 to-purple-600 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Strategic Roadmap by Abstraction Level</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2">Now (18-Month Exit)</div>
                  <div className="text-sm">
                    Operational-level solutions: Tizama for AFASA, Payment switches, Agent digitization
                  </div>
                  <div className="text-xs mt-2 opacity-80">Fastest to revenue, easiest for acquirers to understand</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2">Next (Post-Exit Growth)</div>
                  <div className="text-sm">
                    Fundamental-level: Legacy bank as trust infrastructure, MFI infrastructure marketplace
                  </div>
                  <div className="text-xs mt-2 opacity-80">Defensible moats, higher margins, network effects</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4">
                  <div className="font-bold mb-2">Future (Long-Term)</div>
                  <div className="text-sm">
                    Meta-level: Asset-light/asset-heavy exchange, multi-stakeholder optimization platform
                  </div>
                  <div className="text-xs mt-2 opacity-80">Category-creating, highly defensible, massive TAM</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JTBDIntelligenceDashboard;
