import React, { useState } from 'react'
import { 
  Search, 
  Database, 
  TrendingUp, 
  Users, 
  Package,
  Target,
  BarChart3,
  Layers,
  CheckCircle2,
  ArrowRight,
  FileText,
  Globe,
  Shield,
  Lightbulb,
  Link,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Microscope
} from 'lucide-react'

const ResearchMethodology = () => {
  const [expandedPhase, setExpandedPhase] = useState(null)

  const researchPhases = [
    {
      number: 1,
      title: "Gather Foundational Information",
      icon: Database,
      color: "blue",
      description: "Build comprehensive knowledge base",
      tasks: [
        "Collect all available info about the client (products, customers, existing docs)",
        "Supplement with web research",
        "Document problem statements and outcomes from discovery sessions"
      ],
      outputs: [
        "Product inventory",
        "Customer list",
        "Discovery session notes",
        "Initial problem statements"
      ],
      toolsUsed: ["Web scraping", "Document analysis", "Interview transcripts"]
    },
    {
      number: 2,
      title: "Extract Key Outcomes",
      icon: Target,
      color: "green",
      description: "Identify strategic objectives",
      tasks: [
        "Identify what the client is trying to achieve",
        "Multiple discovery conversations (not just one)",
        "Map outcomes to measurable goals"
      ],
      outputs: [
        "Strategic objectives",
        "Success metrics",
        "Priority outcomes"
      ],
      toolsUsed: ["Stakeholder interviews", "Outcome mapping", "Goal alignment"]
    },
    {
      number: 3,
      title: "Build Foundational Research Nodes",
      icon: Layers,
      color: "purple",
      description: "Create systematic knowledge layers",
      subPhases: [
        {
          name: "Regulatory Tailwinds",
          icon: Shield,
          description: "What regulations/initiatives exist and their implications",
          dashboardPath: "/regulatory-tailwinds"
        },
        {
          name: "Customer Mapping",
          icon: Users,
          description: "Current customers + potential customers across geographies",
          dashboardPath: null
        },
        {
          name: "Product-to-Jobs Mapping",
          icon: Package,
          description: "What pain points can products solve (functional, emotional, social jobs)",
          dashboardPath: "/products-jobs"
        },
        {
          name: "Customer-to-Jobs Mapping",
          icon: Target,
          description: "What different customer segments need to accomplish",
          dashboardPath: "/customer-jobs"
        },
        {
          name: "Competitor Analysis",
          icon: BarChart3,
          description: "Who does these jobs well/poorly/not at all",
          dashboardPath: "/competitive-analysis"
        }
      ],
      outputs: [
        "Regulatory opportunity matrix",
        "Customer segment profiles",
        "Jobs-to-be-done framework",
        "Competitive landscape map"
      ]
    },
    {
      number: 4,
      title: "Add Analytical Layers",
      icon: TrendingUp,
      color: "orange",
      description: "Quantify and assess opportunities",
      tasks: [
        "Market size relative to specific jobs",
        "Market entry friction (by geography AND by job type)",
        "Market saturation assessment",
        "Growth potential analysis"
      ],
      outputs: [
        "TAM/SAM/SOM analysis",
        "Market friction matrix",
        "Opportunity heat maps"
      ],
      toolsUsed: ["Market sizing models", "Friction analysis", "Saturation metrics"]
    },
    {
      number: 5,
      title: "Synthesize Strategic Insights",
      icon: Lightbulb,
      color: "yellow",
      description: "Transform data into actionable strategy",
      tasks: [
        "Gap analysis (where products don't match needs)",
        "Desirability, feasibility, viability framework",
        "Create easy-to-scan matrices and visualizations",
        "Develop strategic recommendations"
      ],
      outputs: [
        "Strategic recommendations",
        "Priority action matrix",
        "Go-to-market strategies",
        "Risk mitigation plans"
      ],
      toolsUsed: ["Gap analysis", "DFV framework", "Visual synthesis"]
    },
    {
      number: 6,
      title: "Validate Everything",
      icon: CheckCircle2,
      color: "green",
      description: "Ensure accuracy and reliability",
      tasks: [
        "Link checking",
        "Modular validation of each piece",
        "Human verification",
        "Cross-reference with multiple sources"
      ],
      outputs: [
        "Validated insights",
        "Confidence scores",
        "Audit trail documentation"
      ],
      toolsUsed: ["Automated validation", "Expert review", "Source verification"]
    }
  ]

  const keyPrinciples = [
    {
      icon: BookOpen,
      title: "Foundation First",
      description: "Do foundational work systematically BEFORE trying to answer big strategic questions"
    },
    {
      icon: Link,
      title: "Audit Trail",
      description: "Build an audit trail so you can validate each step, rather than letting AI jump to conclusions"
    },
    {
      icon: Microscope,
      title: "Modular Validation",
      description: "Each research node can be independently verified and updated"
    },
    {
      icon: Database,
      title: "Strategic Asset",
      description: "The foundation becomes a strategic asset even if initial reports need refinement"
    }
  ]

  const getColorClasses = (color) => {
    switch(color) {
      case 'blue': return 'bg-sybrin-blue-100 text-sybrin-blue-700 border-sybrin-blue-300'
      case 'green': return 'bg-green-100 text-green-700 border-green-300'
      case 'purple': return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'orange': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'yellow': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-sybrin-blue-100 rounded-lg">
            <Microscope className="w-8 h-8 text-sybrin-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Research Methodology</h1>
            <p className="text-gray-600">Systematic approach to strategic intelligence</p>
          </div>
        </div>
      </div>

      {/* Key Principles */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyPrinciples.map((principle, idx) => {
            const Icon = principle.icon
            return (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-sybrin-blue-600" />
                  <h3 className="font-semibold text-gray-900">{principle.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{principle.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Research Process */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">The Research Process</h2>
        
        <div className="space-y-4">
          {researchPhases.map((phase, idx) => {
            const Icon = phase.icon
            const isExpanded = expandedPhase === idx
            const colorClasses = getColorClasses(phase.color)
            
            return (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : idx)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${colorClasses}`}>
                        <span className="text-lg font-bold">{phase.number}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${colorClasses.split(' ')[1]}`} />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                          <p className="text-sm text-gray-600">{phase.description}</p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {/* Tasks */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-600" />
                          Tasks
                        </h4>
                        <ul className="space-y-2">
                          {phase.tasks?.map((task, tidx) => (
                            <li key={tidx} className="flex items-start gap-2">
                              <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span className="text-sm text-gray-700">{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Outputs */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-600" />
                          Outputs
                        </h4>
                        <ul className="space-y-2">
                          {phase.outputs?.map((output, oidx) => (
                            <li key={oidx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                              <span className="text-sm text-gray-700">{output}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tools or Sub-phases */}
                      {phase.toolsUsed ? (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-600" />
                            Tools & Methods
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {phase.toolsUsed.map((tool, toolIdx) => (
                              <span key={toolIdx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Sub-phases for Phase 3 */}
                    {phase.subPhases && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Research Nodes (Sequential)</h4>
                        <div className="space-y-3">
                          {phase.subPhases.map((subPhase, spIdx) => {
                            const SubIcon = subPhase.icon
                            return (
                              <div key={spIdx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg">
                                    <SubIcon className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{subPhase.name}</p>
                                    <p className="text-sm text-gray-600">{subPhase.description}</p>
                                  </div>
                                </div>
                                {subPhase.dashboardPath && (
                                  <a 
                                    href={subPhase.dashboardPath}
                                    className="text-sm text-sybrin-blue-600 hover:text-sybrin-blue-800 flex items-center gap-1"
                                  >
                                    View Dashboard
                                    <ArrowRight className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Progress indicator */}
                    {idx < researchPhases.length - 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-sm">Leads to</span>
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-sm font-medium">{researchPhases[idx + 1].title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-sybrin-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Why This Approach Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Systematic</h3>
            <p className="text-sm text-gray-600">
              Each phase builds on the previous, ensuring no critical insights are missed
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Validated</h3>
            <p className="text-sm text-gray-600">
              Multiple verification points ensure accuracy and reliability of insights
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Actionable</h3>
            <p className="text-sm text-gray-600">
              Transforms raw data into specific, implementable strategic recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResearchMethodology