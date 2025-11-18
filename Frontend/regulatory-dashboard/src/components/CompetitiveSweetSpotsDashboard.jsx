import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  MapPin,
  Award,
  Star,
  Zap
} from 'lucide-react'

const CompetitiveSweetSpotsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    primeOpps: 0,
    totalValue: 0,
    avgDealSize: 0,
    totalProspects: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRating, setSelectedRating] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [sortField, setSortField] = useState('avg_deal_millions')
  const [sortDirection, setSortDirection] = useState('desc')

  const [geographies, setGeographies] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedRating, selectedGeography, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: spotsData, error } = await supabase
        .from('sy2_view_competitive_sweet_spots')
        .select('*')
        .order('avg_deal_millions', { ascending: false })

      if (error) throw error

      setData(spotsData || [])

      // Calculate stats
      const prime = spotsData?.filter(s => s.opportunity_rating?.includes('PRIME')) || []
      const totalValue = spotsData?.reduce((sum, s) => sum + (parseFloat(s.avg_deal_millions) || 0) * (s.total_prospects || 0), 0)
      const avgDeal = spotsData?.reduce((sum, s) => sum + (parseFloat(s.avg_deal_millions) || 0), 0) / (spotsData?.length || 1)
      const totalProspects = spotsData?.reduce((sum, s) => sum + (s.total_prospects || 0), 0)

      setStats({
        primeOpps: prime.length,
        totalValue: Math.round(totalValue),
        avgDealSize: Math.round(avgDeal * 100) / 100,
        totalProspects
      })

      // Extract unique geographies
      const uniqueGeos = [...new Set(spotsData?.map(s => s.geography).filter(Boolean))]
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
        item.geography?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.solution_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.opportunity_rating?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedRating !== 'all') {
      if (selectedRating === 'PRIME') {
        filtered = filtered.filter(item => item.opportunity_rating?.includes('PRIME'))
      } else {
        filtered = filtered.filter(item => item.opportunity_rating === selectedRating)
      }
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (aVal === null || aVal === undefined) aVal = sortField.includes('count') || sortField.includes('millions') ? 0 : ''
      if (bVal === null || bVal === undefined) bVal = sortField.includes('count') || sortField.includes('millions') ? 0 : ''

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
      setSortDirection(field.includes('count') || field.includes('millions') ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (geography, solutionType) => {
    const key = `${geography}-${solutionType}`
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedRows(newExpanded)
  }

  const getRatingColor = (rating) => {
    if (rating?.includes('PRIME')) return 'text-green-700 bg-green-100 border-green-300'
    if (rating?.includes('Strong')) return 'text-blue-700 bg-blue-100 border-blue-300'
    if (rating?.includes('Good')) return 'text-yellow-700 bg-yellow-100 border-yellow-300'
    return 'text-gray-700 bg-gray-100 border-gray-300'
  }

  const getRatingIcon = (rating) => {
    if (rating?.includes('PRIME')) return <Star className="w-5 h-5 text-green-600 fill-green-600" />
    if (rating?.includes('Strong')) return <Award className="w-5 h-5 text-blue-600" />
    if (rating?.includes('Good')) return <Target className="w-5 h-5 text-yellow-600" />
    return <Zap className="w-5 h-5 text-gray-600" />
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading competitive sweet spots...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitive Sweet Spots</h1>
        <p className="text-gray-600">Low competition + High fit + Good value opportunities</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">PRIME Opportunities</p>
              <p className="text-2xl font-bold text-green-600">{stats.primeOpps}</p>
              <p className="text-xs text-gray-500 mt-1">Best chances</p>
            </div>
            <Star className="w-8 h-8 text-green-200 fill-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Prospects</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalProspects}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-purple-600">${stats.avgDealSize}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pipeline Value</p>
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
              placeholder="Search solutions or markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="PRIME">PRIME Only</option>
            <option value="Strong">Strong</option>
            <option value="Good">Good</option>
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
                    onClick={() => handleSort('geography')}
                    className="flex items-center hover:text-gray-700"
                  >
                    Geography
                    {sortField === 'geography' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solution
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity Rating
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('avg_deal_millions')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    Avg Deal Size
                    {sortField === 'avg_deal_millions' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('total_prospects')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    Prospects
                    {sortField === 'total_prospects' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sybrin Fit
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, idx) => {
                const rowKey = `${item.geography}-${item.solution_type}-${idx}`
                return (
                <React.Fragment key={rowKey}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.solution_type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {getRatingIcon(item.opportunity_rating)}
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getRatingColor(item.opportunity_rating)}`}>
                          {item.opportunity_rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-lg font-bold text-gray-900">
                          ${item.avg_deal_millions ? parseFloat(item.avg_deal_millions).toFixed(2) : '0'}M
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{item.total_prospects || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-purple-600">{item.sybrin_fit_rating || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRowExpansion(item.geography, item.solution_type)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {expandedRows.has(rowKey) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(rowKey) && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Market Adoption</h4>
                            <p className="text-sm text-gray-600">{item.market_adoption || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">High Maturity Prospects</h4>
                            <p className="text-sm text-gray-600">{item.high_maturity_prospects || 0} of {item.total_prospects || 0}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Pipeline Value</h4>
                            <p className="text-sm text-gray-600">
                              {item.avg_deal_millions && item.total_prospects
                                ? `$${(parseFloat(item.avg_deal_millions) * item.total_prospects).toFixed(2)}M total opportunity`
                                : 'No data'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">SaaS Readiness</h4>
                            <p className="text-sm text-gray-600">{item.market_readiness_saas || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Regulatory Pressure</h4>
                            <p className="text-sm text-gray-600">{item.regulatory_pressure ? `${item.regulatory_pressure}/5` : 'No data'}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No opportunities found matching your filters.
        </div>
      )}
    </div>
  )
}

export default CompetitiveSweetSpotsDashboard
