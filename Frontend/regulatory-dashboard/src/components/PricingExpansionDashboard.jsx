import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Globe,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Target,
  FileText,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Info
} from 'lucide-react'

const PricingExpansionDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalGeographies: 0,
    highDifficulty: 0,
    avgEntryCost: 0,
    partnershipRequired: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedIntensity, setSelectedIntensity] = useState('all')
  const [sortField, setSortField] = useState('geography')
  const [sortDirection, setSortDirection] = useState('asc')

  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedDifficulty, selectedIntensity, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: pricingData, error } = await supabase
        .from('sy2_view_pricing_expansion_unified')
        .select('*')
        .order('geography', { ascending: true })

      if (error) throw error

      setData(pricingData || [])

      const avgCost = pricingData?.filter(p => p.total_estimated_entry_cost_usd).reduce((sum, p) => sum + parseFloat(p.total_estimated_entry_cost_usd), 0) / (pricingData?.filter(p => p.total_estimated_entry_cost_usd).length || 1)
      const highDiff = pricingData?.filter(p => p.market_entry_difficulty === 'High').length
      const partnerReq = pricingData?.filter(p => p.local_partnership_required).length

      setStats({
        totalGeographies: pricingData?.length || 0,
        highDifficulty: highDiff,
        avgEntryCost: Math.round(avgCost / 1000),
        partnershipRequired: partnerReq
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortData = () => {
    let filtered = [...data]

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.geography?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recommended_entry_strategy?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.market_entry_difficulty === selectedDifficulty)
    }

    if (selectedIntensity !== 'all') {
      filtered = filtered.filter(item => item.competitive_intensity === selectedIntensity)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'total_estimated_entry_cost_usd' || sortField === 'competitor_count') {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      } else {
        aVal = aVal || ''
        bVal = bVal || ''
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredData(filtered)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'total_estimated_entry_cost_usd' || field === 'competitor_count' ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'High') return 'text-red-700 bg-red-100 border-red-300'
    if (difficulty === 'Medium') return 'text-yellow-700 bg-yellow-100 border-yellow-300'
    if (difficulty === 'Low') return 'text-green-700 bg-green-100 border-green-300'
    return 'text-gray-700 bg-gray-100 border-gray-300'
  }

  const getIntensityColor = (intensity) => {
    if (intensity === 'High') return 'text-orange-700 bg-orange-100'
    if (intensity === 'Medium') return 'text-yellow-700 bg-yellow-100'
    if (intensity === 'Low') return 'text-green-700 bg-green-100'
    return 'text-gray-700 bg-gray-100'
  }

  const formatCurrency = (value) => {
    if (!value) return '-'
    const num = parseFloat(value)
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num.toFixed(0)}`
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading pricing & expansion intelligence...</div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-red-600">Error: {error}</div>
    </div>
  )

  return (
    <div className="p-6 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing & Expansion Intelligence</h1>
        <p className="text-gray-600">Comprehensive market entry, pricing, and procurement intelligence across all geographies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Markets</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalGeographies}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Difficulty</p>
              <p className="text-2xl font-bold text-red-600">{stats.highDifficulty}</p>
              <p className="text-xs text-gray-500 mt-1">Markets</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Entry Cost</p>
              <p className="text-2xl font-bold text-green-600">${stats.avgEntryCost}K</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partnership Req'd</p>
              <p className="text-2xl font-bold text-purple-600">{stats.partnershipRequired}</p>
              <p className="text-xs text-gray-500 mt-1">Markets</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulty Levels</option>
            <option value="High">High Difficulty</option>
            <option value="Medium">Medium Difficulty</option>
            <option value="Low">Low Difficulty</option>
          </select>

          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Competition Levels</option>
            <option value="High">High Competition</option>
            <option value="Medium">Medium Competition</option>
            <option value="Low">Low Competition</option>
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-md">
            <span className="text-sm font-medium text-blue-900">Results:</span>
            <span className="text-lg font-bold text-blue-600">{filteredData.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full relative">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('geography')} className="flex items-center hover:text-gray-700">
                    Geography
                    {sortField === 'geography' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Difficulty</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Competition</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('total_estimated_entry_cost_usd')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Entry Cost
                    {sortField === 'total_estimated_entry_cost_usd' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('competitor_count')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Competitors
                    {sortField === 'competitor_count' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Partnership</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.geography}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(item.market_entry_difficulty)}`}>
                        {item.market_entry_difficulty || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(item.competitive_intensity)}`}>
                        {item.competitive_intensity || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(item.total_estimated_entry_cost_usd)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-900">{item.competitor_count || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.local_partnership_required ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleRowExpansion(item.geography)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        {expandedRows.has(item.geography) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.geography) && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 gap-6">
                          {/* Strategic Overview */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                              <Target className="w-5 h-5 mr-2 text-blue-600" />
                              Strategic Overview
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Regulatory Complexity</p>
                                <p className={`text-sm font-semibold px-2 py-1 rounded inline-block mt-1 ${getDifficultyColor(item.regulatory_complexity)}`}>
                                  {item.regulatory_complexity || '-'}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Procurement Complexity</p>
                                <p className={`text-sm font-semibold px-2 py-1 rounded inline-block mt-1 ${getDifficultyColor(item.procurement_complexity)}`}>
                                  {item.procurement_complexity || '-'}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Time to Market</p>
                                <p className="text-lg font-bold text-blue-600">{item.estimated_time_to_market_months || '-'} mo</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Overall Confidence</p>
                                <p className="text-sm font-semibold text-gray-700">{item.overall_confidence || '-'}</p>
                              </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded mb-3">
                              <h5 className="text-xs font-semibold text-gray-700 mb-2">Recommended Entry Strategy</h5>
                              <p className="text-sm text-gray-700 leading-relaxed">{item.recommended_entry_strategy || 'No strategy defined'}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Gov't Procurement</h5>
                                <p className="text-sm text-gray-600">{item.gov_procurement_viability || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Partnership Necessity</h5>
                                <p className="text-sm text-gray-600">{item.partnership_necessity || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Quick Wins</h5>
                                <p className="text-sm text-gray-600">{item.quick_wins || '-'}</p>
                              </div>
                            </div>
                            {item.recommended_partnerships && (
                              <div className="bg-purple-50 p-3 rounded mt-3">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Recommended Partnerships</h5>
                                <p className="text-sm text-gray-700">{item.recommended_partnerships}</p>
                              </div>
                            )}
                          </div>

                          {/* Competitor Pricing Metrics */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                              <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                              Competitor Pricing Metrics
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Competitor Count</p>
                                <p className="text-lg font-bold text-orange-600">{item.competitor_count || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Unique Vendors</p>
                                <p className="text-lg font-bold text-orange-600">{item.unique_vendors || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Avg Annual Cost</p>
                                <p className="text-sm font-bold text-green-600">{formatCurrency(item.avg_annual_cost_usd)}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Cost Range</p>
                                <p className="text-xs font-semibold text-gray-700">
                                  {formatCurrency(item.min_annual_cost_usd)} - {formatCurrency(item.max_annual_cost_usd)}
                                </p>
                              </div>
                            </div>
                            {item.top_vendors && (
                              <div className="bg-orange-50 p-3 rounded mt-3">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Top Vendors</h5>
                                <p className="text-sm text-gray-700">{item.top_vendors}</p>
                              </div>
                            )}
                          </div>

                          {/* Willingness-to-Pay Metrics */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                              Willingness-to-Pay Metrics
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">WTP Tiers</p>
                                <p className="text-lg font-bold text-green-600">{item.wtp_tiers_count || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">IT Budget Range</p>
                                <p className="text-xs font-semibold text-gray-700">
                                  {formatCurrency(item.min_it_budget_usd)} - {formatCurrency(item.max_it_budget_usd)}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Tier 1 Pricing</p>
                                <p className="text-sm font-semibold text-gray-700">{item.tier1_preferred_pricing || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Tier 1 Timeline</p>
                                <p className="text-sm font-bold text-blue-600">{item.tier1_procurement_timeline_months || '-'} mo</p>
                              </div>
                            </div>
                          </div>

                          {/* Regulatory Costs Metrics */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                              <Shield className="w-5 h-5 mr-2 text-purple-600" />
                              Regulatory Costs & Requirements
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">License Types</p>
                                <p className="text-lg font-bold text-purple-600">{item.regulatory_license_types_count || '-'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Total Capital Req'd</p>
                                <p className="text-sm font-bold text-red-600">{formatCurrency(item.total_capital_requirements_usd)}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Annual Renewals</p>
                                <p className="text-sm font-bold text-orange-600">{formatCurrency(item.total_annual_renewal_fees_usd)}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Data Localization</p>
                                <p className="text-lg font-bold text-blue-600">{item.data_localization_required_count || 0}</p>
                              </div>
                            </div>
                            {item.regulatory_bodies && (
                              <div className="bg-purple-50 p-3 rounded">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Regulatory Bodies</h5>
                                <p className="text-sm text-gray-700">{item.regulatory_bodies}</p>
                              </div>
                            )}
                          </div>

                          {/* Procurement Rules */}
                          <div>
                            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                              Procurement Rules & Processes
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Bidding Threshold</p>
                                <p className="text-sm font-bold text-indigo-600">{formatCurrency(item.competitive_bidding_required_above_usd)}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Single Source</p>
                                <p className="text-sm font-semibold text-gray-700">{item.single_source_allowed ? 'Allowed' : 'Not Allowed'}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Local Content</p>
                                <p className="text-sm font-semibold text-gray-700">
                                  {item.local_content_mandatory ? `${item.local_content_minimum_percentage || 0}% Required` : 'Not Required'}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="text-sm font-bold text-blue-600">{item.typical_procurement_duration_months || '-'} mo</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                                  <Info className="w-3 h-3 mr-1" />
                                  Vendor Registration
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {item.vendor_registration_required ? `Required - ${formatCurrency(item.vendor_registration_cost_usd)}` : 'Not Required'}
                                </p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Buy Local Policy</h5>
                                <p className="text-sm text-gray-600">
                                  {item.buy_local_policy_name ? `${item.buy_local_policy_name} (${item.buy_local_price_advantage_percentage || 0}% advantage)` : 'None'}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-indigo-50 p-3 rounded">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Single Source Pathway</h5>
                                <p className="text-sm text-gray-700">{item.single_source_pathway_viability || 'No data'}</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />
                                  Procurement Risks
                                </h5>
                                <p className="text-sm text-gray-700">{item.procurement_risks || 'No data'}</p>
                              </div>
                            </div>
                            {item.partnership_strategy_recommendations && (
                              <div className="bg-green-50 p-3 rounded mt-3">
                                <h5 className="text-xs font-semibold text-gray-700 mb-1">Partnership Strategy</h5>
                                <p className="text-sm text-gray-700">{item.partnership_strategy_recommendations}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">No markets found matching your filters.</div>
      )}
    </div>
  )
}

export default PricingExpansionDashboard
