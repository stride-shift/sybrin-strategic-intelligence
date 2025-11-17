import React, { useState } from 'react';
import {
  ChevronDown, ChevronRight, Target, Layers, TrendingUp,
  AlertCircle, CheckCircle, Clock, DollarSign, Users, Building,
  Zap, Shield, Globe, Workflow, Archive, ThumbsUp
} from 'lucide-react';

const JTBDIntelligenceDashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('all');

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Job categories with color coding
  const jobCategories = [
    { id: 'regulatory', name: 'Regulatory Compliance', icon: Shield, color: 'red', count: 2 },
    { id: 'scaling', name: 'Scaling Digital Ops', icon: TrendingUp, color: 'blue', count: 2 },
    { id: 'rural', name: 'Rural/Inclusion', icon: Users, color: 'green', count: 2 },
    { id: 'payments', name: 'Payment Integration', icon: DollarSign, color: 'purple', count: 2 },
    { id: 'agents', name: 'Agent Networks', icon: Building, color: 'orange', count: 1 }
  ];

  // 5 Core platforms
  const platforms = [
    {
      id: 'detect',
      name: 'Sybrin Detect',
      icon: AlertCircle,
      color: 'red',
      tagline: 'Universal Real-Time Anomaly Detection',
      modules: ['Fraud Detection', 'AFASA Compliance (P0)', 'Agent Fraud (P1)', 'MBO Oversight', 'Operational Risk', 'Customer Service Prediction']
    },
    {
      id: 'connect',
      name: 'Sybrin Connect',
      icon: Zap,
      color: 'blue',
      tagline: 'Legacy-to-Modern Integration Platform',
      modules: ['Instant Payment Integration', 'Batch-Core Facade (P0)', 'Cross-Border Payments', 'Open Banking APIs', 'Fintech Partnerships']
    },
    {
      id: 'flow',
      name: 'Sybrin Flow',
      icon: Workflow,
      color: 'purple',
      tagline: 'No-Code Workflow Automation',
      modules: ['Digital Onboarding', 'Loan Origination (P0)', 'Compliance Workflows (P0)', 'Service Exceptions', 'Agent Onboarding']
    },
    {
      id: 'offline',
      name: 'Sybrin Offline',
      icon: Archive,
      color: 'green',
      tagline: 'Sync-When-Connected Architecture',
      modules: ['Digital KYC', 'MFI Rural Lending (P1)', 'MBO Operations (P1)', 'Field Officer Safety', 'Agent Tools']
    },
    {
      id: 'approve',
      name: 'Sybrin Approve',
      icon: CheckCircle,
      color: 'orange',
      tagline: 'Transaction Governance Engine',
      modules: ['Check Clearing', 'Mandate Management', 'Controlled Instant Payments', 'Loan Disbursements', 'Treasury Workflows']
    }
  ];

  const priorityBadge = (priority) => {
    const styles = {
      'P0': 'bg-red-100 text-red-800 border-red-300',
      'P1': 'bg-orange-100 text-orange-800 border-orange-300',
      'P2': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'P3': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    const labels = {
      'P0': 'Do Now • Exit-Critical',
      'P1': 'Do Soon • Exit-Valuable',
      'P2': 'Evaluate • Strategic',
      'P3': 'Defer • Post-Exit'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const AbstractionBadge = ({ level }) => {
    const styles = {
      'Operational': 'bg-blue-50 text-blue-700 border-blue-200',
      'Fundamental': 'bg-purple-50 text-purple-700 border-purple-200',
      'Meta': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${styles[level]}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">Jobs-To-Be-Done Strategic Intelligence</h1>
              <p className="text-indigo-100 mt-1">9 Functional Jobs • 5 Core Platforms • 3 Abstraction Levels</p>
            </div>
          </div>
          <div className="flex gap-2 text-sm mt-4">
            <span className="bg-white/20 px-3 py-1 rounded">140+ Named Institutions</span>
            <span className="bg-white/20 px-3 py-1 rounded">248 Research Documents</span>
            <span className="bg-white/20 px-3 py-1 rounded">4 Top Markets: Kenya, Zambia, Tanzania, Philippines</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'jobs'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>Jobs Analysis</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('capabilities')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'capabilities'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                <span>Capability Repurposing</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('abstraction')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'abstraction'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Higher-Level Jobs</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: Jobs Analysis */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Executive Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Top 5 Most Urgent Jobs</h3>
                  <ol className="text-sm space-y-2 text-gray-700">
                    <li>1. <strong>Comply with new real-time fraud mandates</strong> (Philippines AFASA, Kenya check decommissioning)</li>
                    <li>2. <strong>Scale digital channels without operational meltdown</strong> (Equity Bank 98% target, NMB 6M users)</li>
                    <li>3. <strong>Serve rural/unbanked profitably</strong> (CARD Bank 329 MBOs, Agora 90% rural)</li>
                    <li>4. <strong>Integrate with instant payment systems</strong> (TIPS Tanzania, iPSO Kenya, InstaPay Philippines)</li>
                    <li>5. <strong>Digitize agent networks at scale</strong> (Zanaco 32k agents, Faulu 600+ agents)</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Key Finding</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Research extensively documents <strong>functional challenges</strong> but rarely mentions emotional/social jobs:
                  </p>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• How decision-makers want to feel</li>
                    <li>• Social/reputational concerns</li>
                    <li>• Fear of obsolescence or competitive displacement</li>
                  </ul>
                  <p className="text-sm text-blue-700 font-medium mt-3">
                    White space opportunity: Solutions addressing unstated emotional/social jobs
                  </p>
                </div>
              </div>
            </div>

            {/* Job Categories */}
            <div className="space-y-4">
              {jobCategories.map((category) => {
                const Icon = category.icon;
                const isExpanded = expandedSections[`job-${category.id}`];
                return (
                  <div key={category.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleSection(`job-${category.id}`)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                          <Icon className={`w-6 h-6 text-${category.color}-600`} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.count} functional jobs identified</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 italic">
                          Detailed job breakdowns will load from the markdown file...
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Emotional & Social Jobs */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Emotional & Social Jobs (Inferred)</h2>
              <p className="text-sm text-gray-700 mb-4">
                Research never directly captures emotional/social jobs, but we can infer from context:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Executive Level</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Sleep at night (regulatory anxiety)</li>
                    <li>• Avoid career-ending tech decisions</li>
                    <li>• Feel like innovator (not dinosaur)</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Middle Management</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Avoid being scapegoated</li>
                    <li>• Feel competent with new tech</li>
                    <li>• Maintain authority over technical team</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">Frontline Staff</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• Avoid feeling stupid learning new systems</li>
                    <li>• Feel proud (not exploitative) serving poor</li>
                    <li>• Feel safe traveling to remote villages</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Capability Repurposing */}
        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Systematic Repurposing is Strategic Leverage</h2>
              <p className="text-gray-700 mb-4">
                <strong>Key insight</strong>: Sybrin doesn't need to build 20 new products to address 100 customer jobs.
                Sybrin needs to systematically repurpose 5 core capabilities to solve 20 jobs each.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Repurposing Advantages</h3>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li><strong>Speed</strong>: 1-3 months vs. 12-18 months for new product</li>
                    <li><strong>Cost</strong>: Configuration vs. development</li>
                    <li><strong>Risk</strong>: Proven technology vs. unproven new product</li>
                    <li><strong>Sales</strong>: Easier to sell "different use of proven product"</li>
                    <li><strong>Exit story</strong>: "Platform capabilities" &gt; "point products"</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">18-Month Exit Focus</h3>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>✅ <strong>Tier 1</strong>: Zero new development (just positioning)</li>
                    <li>✅ <strong>Tier 2</strong>: Minor development, high revenue</li>
                    <li>⏸ <strong>Tier 3</strong>: Moderate development - defer to post-exit</li>
                  </ul>
                  <p className="text-sm text-green-700 font-medium mt-3">
                    Total incremental revenue potential: $2-4M over 18 months
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Core Platforms */}
            <div className="space-y-4">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isExpanded = expandedSections[`platform-${platform.id}`];
                return (
                  <div key={platform.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleSection(`platform-${platform.id}`)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-${platform.color}-100 rounded-lg`}>
                          <Icon className={`w-6 h-6 text-${platform.color}-600`} />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900 text-lg">{platform.name}</h3>
                          <p className="text-sm text-gray-600">{platform.tagline}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                    </button>

                    {isExpanded && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Modules / SKUs:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {platform.modules.map((module, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                              {module}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Prioritization Matrix */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Prioritization Framework</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  {priorityBadge('P0')}
                  <p className="text-sm text-gray-700 mt-2">
                    High feasibility (&gt;80%) + Clear first customer + Revenue in 12 months + Strengthens exit narrative
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Examples: Tazama→AFASA, Payments Hub→Batch Facade, Journey Builder→Sybrin Flow</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  {priorityBadge('P1')}
                  <p className="text-sm text-gray-700 mt-2">
                    Medium feasibility (60-80%) + Identified first customer + Revenue in 18 months + Key differentiation
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Examples: Agent Fraud Detection, MFI Lending Suite, MBO Network Management</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  {priorityBadge('P2')}
                  <p className="text-sm text-gray-700 mt-2">
                    Medium feasibility + Strategic but no immediate customer + May generate revenue post-exit
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Examples: Assisted Digital Hub, Field Officer Safety, Controlled Instant Payments</p>
                </div>
                <div className="border-l-4 border-gray-400 pl-4">
                  {priorityBadge('P3')}
                  <p className="text-sm text-gray-700 mt-2">
                    Low feasibility (&lt;50%) OR long development OR regulatory blockers + Post-exit opportunity
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Examples: Universal Regulatory Platform, Customer Journey Monitoring, Social Identity Verification</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Higher-Level Jobs */}
        {activeTab === 'abstraction' && (
          <div className="space-y-6">
            {/* Abstraction Framework */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Abstraction Framework</h2>
              <p className="text-gray-700 mb-4">
                Jobs exist at different levels of abstraction. Higher abstraction = broader solution space = more white space opportunities.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Level</th>
                      <th className="px-4 py-2 text-left font-semibold">Example</th>
                      <th className="px-4 py-2 text-left font-semibold">Characteristics</th>
                      <th className="px-4 py-2 text-left font-semibold">TAM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                      <td className="px-4 py-3"><AbstractionBadge level="Operational" /></td>
                      <td className="px-4 py-3 text-gray-700">"Meet BSP AFASA real-time fraud mandate by 2025"</td>
                      <td className="px-4 py-3 text-gray-600">Geography-specific, time-bound, solution-hinting</td>
                      <td className="px-4 py-3 text-gray-600">$10-50M per product</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3"><AbstractionBadge level="Fundamental" /></td>
                      <td className="px-4 py-3 text-gray-700">"Navigate regulatory change without disruption"</td>
                      <td className="px-4 py-3 text-gray-600">Generalizable across contexts, outcome-focused</td>
                      <td className="px-4 py-3 text-gray-600">$100M-$1B per platform</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3"><AbstractionBadge level="Meta" /></td>
                      <td className="px-4 py-3 text-gray-700">"Turn incumbent constraints into competitive advantages"</td>
                      <td className="px-4 py-3 text-gray-600">Universal, transformational, cross-industry</td>
                      <td className="px-4 py-3 text-gray-600">$1B-$10B+ per ecosystem</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Meta-Level Jobs */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">3 Meta-Level Fundamental Jobs</h2>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ThumbsUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Meta Job 1: Compete successfully despite incumbent constraints</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Instead of "work around legacy," → "leverage legacy as trust signal, compliance moat, or partnership asset"
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">White Space Revealed:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>Legacy bank as trust infrastructure</strong> - Position as "trust layer" for fintech ecosystem</li>
                    <li>• <strong>Regulatory future-proofing</strong> - Monitor 50+ regulators, alert 12-24 months before mandates</li>
                    <li>• <strong>Compliance-as-differentiation</strong> - Marketing services that turn compliance into advantage</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Meta Job 2: Grow when we're asset-heavy and competitors are asset-light</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Monetize existing infrastructure (branches, agents, licenses) to compete with asset-light fintechs
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">White Space Revealed:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>MFI Infrastructure Marketplace</strong> - CARD Bank's 329 MBOs become shared infrastructure for 10 MFIs</li>
                    <li>• <strong>Asset-Light/Asset-Heavy Exchange</strong> - Banks rent infrastructure to fintechs; fintechs rent UX/dev to banks</li>
                    <li>• <strong>Multi-tenant branch infrastructure</strong> - Branches serve both bank AND fintech customers</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Meta Job 3: Satisfy stakeholders with conflicting demands</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Board wants profitability, regulators want inclusion, customers want convenience, staff want jobs
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">White Space Revealed:</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>• <strong>Multi-Stakeholder Optimization Platform</strong> - AI balances contradictory demands in real-time</li>
                    <li>• <strong>Stakeholder dashboard intelligence</strong> - Show each stakeholder their demands are being met</li>
                    <li>• <strong>Trade-off automation</strong> - Continuously optimize multi-objective functions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Roadmap */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Strategic Roadmap by Abstraction Level</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold">Now (18-Month Exit)</h3>
                  </div>
                  <AbstractionBadge level="Operational" />
                  <p className="text-sm text-gray-300 mt-2">
                    Focus on operational-level solutions (Tizana AFASA, payment switches, agent digitization). Fastest to revenue, easiest to explain to acquirers.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold">Next (Post-Exit Growth)</h3>
                  </div>
                  <AbstractionBadge level="Fundamental" />
                  <p className="text-sm text-gray-300 mt-2">
                    Invest in fundamental-level white space (Legacy bank as trust infrastructure, MFI marketplace). Creates defensible moats, higher margins, network effects.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold">Future (Long-Term)</h3>
                  </div>
                  <AbstractionBadge level="Meta" />
                  <p className="text-sm text-gray-300 mt-2">
                    Explore meta-level white space (Asset exchange platform, Multi-stakeholder optimization). Category-creating, highly defensible, massive TAM.
                  </p>
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
