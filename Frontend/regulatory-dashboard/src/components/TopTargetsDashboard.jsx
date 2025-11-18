import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Building2,
  DollarSign,
  Target,
  TrendingUp,
  MapPin,
  Award,
  Briefcase,
  Users,
  Shield
} from 'lucide-react'

const TopTargetsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalTargets: 0,
    avgBudget: 0,
    enterpriseCount: 0,
    totalValue: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedMaturity, setSelectedMaturity] = useState('all')
  const [sortField, setSortField] = useState('budget_millions_usd')
  const [sortDirection, setSortDirection] = useState('desc')

  // Unique values for filters
  const [tiers, setTiers] = useState([])
  const [geographies, setGeographies] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedTier, selectedGeography, selectedMaturity, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: targetsData, error } = await supabase
        .from('sy2_view_top_targets')
        .select('*')
        .order('budget_millions_usd', { ascending: false })

      if (error) throw error

      setData(targetsData || [])

      // Calculate stats
      const enterprise = targetsData?.filter(t => t.target_tier?.includes('Tier S') || t.target_tier?.includes('Enterprise')) || []
      const avgBudget = targetsData?.reduce((sum, t) => sum + (t.budget_millions_usd || 0), 0) / (targetsData?.length || 1)
      const totalValue = targetsData?.reduce((sum, t) => sum + (t.budget_millions_usd || 0), 0)

      setStats({
        totalTargets: targetsData?.length || 0,
        avgBudget: Math.round(avgBudget * 10) / 10,
        enterpriseCount: enterprise.length,
        totalValue: Math.round(totalValue)
      })

      // Extract unique values
      const uniqueTiers = [...new Set(targetsData?.map(t => t.target_tier).filter(Boolean))]
      const uniqueGeos = [...new Set(targetsData?.map(t => t.geography).filter(Boolean))]

      setTiers(uniqueTiers.sort())
      setGeographies(uniqueGeos.sort())
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
        item.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.geography?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.target_tier?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTier !== 'all') {
      filtered = filtered.filter(item => item.target_tier === selectedTier)
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    if (selectedMaturity !== 'all') {
      filtered = filtered.filter(item => item.digital_maturity === selectedMaturity)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (aVal === null || aVal === undefined) aVal = sortField === 'budget_millions_usd' ? 0 : ''
      if (bVal === null || bVal === undefined) bVal = sortField === 'budget_millions_usd' ? 0 : ''

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
      setSortDirection(field === 'budget_millions_usd' ? 'desc' : 'asc')
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

  const getTierColor = (tier) => {
    if (tier?.includes('Tier S') || tier?.includes('Enterprise')) return 'text-purple-600 bg-purple-50 border-purple-200'
    if (tier?.includes('Tier A') || tier?.includes('Large')) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (tier?.includes('Tier B')) return 'text-green-600 bg-green-50 border-green-200'
    if (tier?.includes('Tier C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getMaturityIcon = (maturity) => {
    if (maturity?.includes('Advanced') || maturity?.includes('High')) return <Award className="w-4 h-4 text-green-600" />
    if (maturity?.includes('Medium') || maturity?.includes('Moderate')) return <TrendingUp className="w-4 h-4 text-yellow-600" />
    return <Shield className="w-4 h-4 text-gray-400" />
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading top targets...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Target Institutions</h1>
        <p className="text-gray-600">Highest-value prospects segmented by budget tier</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Targets</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTargets}</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Budget</p>
              <p className="text-2xl font-bold text-green-600">${stats.avgBudget}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Enterprise Tier</p>
              <p className="text-2xl font-bold text-purple-600">{stats.enterpriseCount}</p>
            </div>
            <Building2 className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-orange-600">${stats.totalValue}M</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tiers</option>
            {tiers.map(tier => (
              <option key={tier} value={tier}>{tier}</option>
            ))}
          </select>

          <select
            value={selectedGeography}
            onChange={(e) => setSelectedGeography(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Geographies</option>
            {geographies.map(geo => (
              <option key={geo} value={geo}>{geo}</option>
            ))}
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-md">
            <span className="text-sm font-medium text-blue-900">Results:</span>
            <span className="text-lg font-bold text-blue-600">{filteredData.length}</span>
          </div>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full relative">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('institution_name')}
                    className="flex items-center hover:text-gray-700"
                  >
                    Institution
                    {sortField === 'institution_name' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Geography
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('budget_millions_usd')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    Budget (USD)
                    {sortField === 'budget_millions_usd' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Tier
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Digital Maturity
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.institution_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-gray-700">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {item.budget_millions_usd ? `$${item.budget_millions_usd}M` : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getTierColor(item.target_tier)}`}>
                        {item.target_tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {getMaturityIcon(item.digital_maturity)}
                        <span className="text-xs text-gray-600">{item.digital_maturity || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.priority_rank || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRowExpansion(item.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {expandedRows.has(item.id) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Financial Health</h4>
                            <p className="text-sm text-gray-600">{item.financial_health || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Tech Investments</h4>
                            <p className="text-sm text-gray-600">{item.recent_tech_investments || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Source</h4>
                            {item.source_urls ? (
                              <a href={item.source_urls} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                View Source
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">No source</span>
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
        <div className="text-center py-8 text-gray-500">
          No targets found matching your filters.
        </div>
      )}
    </div>
  )
}

export default TopTargetsDashboard
