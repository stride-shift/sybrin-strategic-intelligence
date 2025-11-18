import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Globe,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Building,
  FileText,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BarChart3,
  Users,
  Briefcase
} from 'lucide-react'

const NPOJurisdictionDashboard = () => {
  const [jurisdictions, setJurisdictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedComplexity, setSelectedComplexity] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [viewMode, setViewMode] = useState('table')
  const [expandedJurisdiction, setExpandedJurisdiction] = useState(null)
  const [sortBy, setSortBy] = useState('operational_ease_score')
  const [sortOrder, setSortOrder] = useState('desc')

  useEffect(() => {
    fetchJurisdictions()
  }, [])

  const fetchJurisdictions = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('sy_npo_jurisdiction_matrix')
        .select('*')
        .order('operational_ease_score', { ascending: false })

      if (error) throw error
      setJurisdictions(data || [])
    } catch (error) {
      console.error('Error fetching NPO jurisdictions:', error)
      setJurisdictions([])
    } finally {
      setLoading(false)
    }
  }

  // Filter jurisdictions
  const filteredJurisdictions = jurisdictions.filter(j => {
    if (selectedRegion !== 'all' && j.region !== selectedRegion) return false
    if (selectedComplexity !== 'all' && j.registration_complexity !== selectedComplexity) return false
    if (selectedRisk !== 'all' && j.risk_level !== selectedRisk) return false
    return true
  })

  // Sort jurisdictions
  const sortedJurisdictions = [...filteredJurisdictions].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    if (sortBy === 'operational_ease_score') {
      aVal = parseInt(aVal) || 0
      bVal = parseInt(bVal) || 0
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  // Get unique values for filters
  const regions = [...new Set(jurisdictions.map(j => j.region))]
  const complexityLevels = ['Low', 'Medium', 'High', 'Very High']
  const riskLevels = ['Low', 'Medium', 'High', 'Critical']

  // Calculate statistics
  const stats = {
    totalJurisdictions: filteredJurisdictions.length,
    lowRisk: filteredJurisdictions.filter(j => j.risk_level === 'Low').length,
    highEase: filteredJurisdictions.filter(j => j.operational_ease_score >= 7).length,
    quickSetup: filteredJurisdictions.filter(j =>
      j.typical_timeline && j.typical_timeline.includes('1-') || j.typical_timeline?.includes('2-')
    ).length
  }

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getComplexityColor = (complexity) => {
    switch(complexity) {
      case 'Low': return 'text-green-600'
      case 'Medium': return 'text-blue-600'
      case 'High': return 'text-orange-600'
      case 'Very High': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getOpportunityIcon = (opportunity) => {
    switch(opportunity) {
      case 'Emerging': return '🌱'
      case 'Growing': return '📈'
      case 'Mature': return '🏢'
      case 'Saturated': return '📊'
      default: return '📍'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center text-gray-600">Loading NPO jurisdiction data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-purple-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NPO Jurisdiction Matrix</h1>
                <p className="text-sm text-gray-600">
                  Comprehensive analysis of NPO registration and operations across jurisdictions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {stats.totalJurisdictions} jurisdictions analyzed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jurisdictions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJurisdictions}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Risk</p>
                <p className="text-2xl font-bold text-green-600">{stats.lowRisk}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Ease Score (7+)</p>
                <p className="text-2xl font-bold text-blue-600">{stats.highEase}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quick Setup (&lt;3 months)</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.quickSetup}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-600 opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Mode */}
      <div className="px-8 pb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>

              <select
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Complexity</option>
                {complexityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Risk Levels</option>
                {riskLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="operational_ease_score">Ease Score</option>
                <option value="jurisdiction">Jurisdiction</option>
                <option value="risk_level">Risk Level</option>
                <option value="registration_complexity">Complexity</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'card'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'comparison'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Comparison
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedJurisdictions.map(jurisdiction => (
              <div key={jurisdiction.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-4">
                  {/* Header: Jurisdiction and Region */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">
                      {jurisdiction.jurisdiction}
                    </h3>
                    <p className="text-sm text-gray-600">{jurisdiction.region}</p>
                  </div>

                  {/* Core Metrics Grid - matching table columns */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ease Score</span>
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                        {jurisdiction.operational_ease_score}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Complexity</span>
                      <span className={`text-sm font-medium ${getComplexityColor(jurisdiction.registration_complexity)}`}>
                        {jurisdiction.registration_complexity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(jurisdiction.risk_level)}`}>
                        {jurisdiction.risk_level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Timeline</span>
                      <span className="text-sm font-medium text-gray-900">{jurisdiction.typical_timeline}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cost</span>
                      <span className="text-sm font-medium text-gray-900">{jurisdiction.estimated_costs}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Market</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center">
                        <span className="mr-1">{getOpportunityIcon(jurisdiction.market_opportunity)}</span>
                        {jurisdiction.market_opportunity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Funders</span>
                      <span className="text-sm font-medium text-gray-900">
                        {jurisdiction.key_funders || 'TBD'}
                      </span>
                    </div>
                  </div>

                  {/* Entity Type */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">Entity Type</p>
                    <p className="text-sm font-medium text-gray-900">{jurisdiction.recommended_entity_type}</p>
                  </div>

                  <button
                    onClick={() => setExpandedJurisdiction(
                      expandedJurisdiction === jurisdiction.id ? null : jurisdiction.id
                    )}
                    className="mt-3 w-full flex items-center justify-center text-sm text-purple-600 hover:text-purple-700"
                  >
                    {expandedJurisdiction === jurisdiction.id ? (
                      <>Less Details <ChevronUp className="w-4 h-4 ml-1" /></>
                    ) : (
                      <>More Details <ChevronDown className="w-4 h-4 ml-1" /></>
                    )}
                  </button>

                  {expandedJurisdiction === jurisdiction.id && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Regulatory Bodies:</span>
                        <p className="text-gray-600">{jurisdiction.regulatory_bodies}</p>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Tax Benefits:</span>
                        <span className="ml-2 text-gray-600">{jurisdiction.tax_benefits}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Digital Readiness:</span>
                        <span className="ml-2 text-gray-600">{jurisdiction.digital_readiness}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Funding Availability:</span>
                        <span className="ml-2 text-gray-600">{jurisdiction.funding_availability}</span>
                      </div>
                      {jurisdiction.notes && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="text-gray-600 text-xs mt-1">{jurisdiction.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-h-[650px] flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1">
              <table className="w-full relative">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Jurisdiction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ease Score
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Complexity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Entity Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Market
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Funders
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedJurisdictions.map(jurisdiction => (
                    <tr key={jurisdiction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {jurisdiction.jurisdiction}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {jurisdiction.region}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-medium text-sm">
                          {jurisdiction.operational_ease_score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-medium ${getComplexityColor(jurisdiction.registration_complexity)}`}>
                          {jurisdiction.registration_complexity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(jurisdiction.risk_level)}`}>
                          {jurisdiction.risk_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {jurisdiction.typical_timeline}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {jurisdiction.estimated_costs}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {jurisdiction.recommended_entity_type}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="flex items-center">
                          <span className="mr-1">{getOpportunityIcon(jurisdiction.market_opportunity)}</span>
                          {jurisdiction.market_opportunity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {jurisdiction.key_funders || 'TBD'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Top Recommended Jurisdictions
              </h3>
              <div className="space-y-3">
                {sortedJurisdictions
                  .filter(j => j.operational_ease_score >= 7 && j.risk_level === 'Low')
                  .slice(0, 5)
                  .map(jurisdiction => (
                    <div key={jurisdiction.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{jurisdiction.jurisdiction}</p>
                        <p className="text-sm text-gray-600">{jurisdiction.region}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{jurisdiction.operational_ease_score}/10</div>
                          <div className="text-xs text-gray-500">Ease</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-700">{jurisdiction.typical_timeline}</div>
                          <div className="text-xs text-gray-500">Timeline</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                Complex Jurisdictions
              </h3>
              <div className="space-y-3">
                {sortedJurisdictions
                  .filter(j => j.registration_complexity === 'High' || j.registration_complexity === 'Very High')
                  .slice(0, 5)
                  .map(jurisdiction => (
                    <div key={jurisdiction.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{jurisdiction.jurisdiction}</p>
                        <p className="text-sm text-gray-600">{jurisdiction.key_considerations}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(jurisdiction.risk_level)}`}>
                          {jurisdiction.risk_level} Risk
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {jurisdiction.compliance_burden} compliance
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                Quick Setup Options
              </h3>
              <div className="space-y-3">
                {sortedJurisdictions
                  .filter(j => j.typical_timeline && (j.typical_timeline.includes('1-') || j.typical_timeline.includes('2-')))
                  .slice(0, 5)
                  .map(jurisdiction => (
                    <div key={jurisdiction.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{jurisdiction.jurisdiction}</p>
                        <p className="text-sm text-gray-600">{jurisdiction.typical_timeline}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{jurisdiction.estimated_costs}</p>
                        <p className="text-xs text-gray-500">Est. cost</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                Growth Markets
              </h3>
              <div className="space-y-3">
                {sortedJurisdictions
                  .filter(j => j.market_opportunity === 'Growing' || j.market_opportunity === 'Emerging')
                  .slice(0, 5)
                  .map(jurisdiction => (
                    <div key={jurisdiction.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{jurisdiction.jurisdiction}</p>
                        <p className="text-sm text-gray-600">
                          {getOpportunityIcon(jurisdiction.market_opportunity)} {jurisdiction.market_opportunity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{jurisdiction.funding_availability}</p>
                        <p className="text-xs text-gray-500">Funding</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NPOJurisdictionDashboard