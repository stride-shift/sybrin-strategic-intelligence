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
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react'

const SegmentIntelligenceDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalSegments: 0,
    totalInstitutions: 0,
    criticalPriority: 0,
    avgMarketSize: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortField, setSortField] = useState('strategic_priority')
  const [sortDirection, setSortDirection] = useState('asc')

  const [geographies, setGeographies] = useState([])
  const [types, setTypes] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedGeography, selectedPriority, selectedType, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: segmentData, error } = await supabase
        .from('sy2_segment_intelligence')
        .select('*')
        .order('strategic_priority', { ascending: true })

      if (error) throw error

      setData(segmentData || [])

      const totalInsts = segmentData?.reduce((sum, s) => sum + (s.total_institutions || 0), 0)
      const critical = segmentData?.filter(s => s.strategic_priority?.toLowerCase() === 'critical').length

      setStats({
        totalSegments: segmentData?.length || 0,
        totalInstitutions: totalInsts,
        criticalPriority: critical,
        avgMarketSize: Math.round(totalInsts / (segmentData?.length || 1))
      })

      const uniqueGeos = [...new Set(segmentData?.map(s => s.geography).filter(Boolean))]
      setGeographies(uniqueGeos.sort())

      const uniqueTypes = [...new Set(segmentData?.map(s => s.segment_type).filter(Boolean))]
      setTypes(uniqueTypes.sort())
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
        item.segment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.geography?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.go_to_market_strategy?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.strategic_priority === selectedPriority)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.segment_type === selectedType)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'total_institutions') {
        aVal = aVal || 0
        bVal = bVal || 0
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
      setSortDirection(field === 'total_institutions' ? 'desc' : 'asc')
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

  const getPriorityColor = (priority) => {
    if (priority?.toLowerCase() === 'critical') return 'text-red-700 bg-red-100 border-red-300'
    if (priority?.toLowerCase() === 'high') return 'text-orange-700 bg-orange-100 border-orange-300'
    if (priority?.toLowerCase() === 'medium') return 'text-yellow-700 bg-yellow-100 border-yellow-300'
    return 'text-gray-700 bg-gray-100 border-gray-300'
  }

  const getMaturityColor = (maturity) => {
    if (maturity?.toLowerCase() === 'high') return 'text-green-600 bg-green-50'
    if (maturity?.toLowerCase() === 'medium') return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading segment intelligence...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Underserved Segments</h1>
        <p className="text-gray-600">Strategic GTM intelligence for SACCO, MFI, Thrift Bank, and RCB opportunities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Segments</p>
              <p className="text-2xl font-bold text-sybrin-blue-600">{stats.totalSegments}</p>
            </div>
            <Target className="w-8 h-8 text-sybrin-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Institutions</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalInstitutions.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalPriority}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Market Size</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgMarketSize.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search segments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
            />
          </div>

          <select
            value={selectedGeography}
            onChange={(e) => setSelectedGeography(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Geographies</option>
            {geographies.map(geo => (
              <option key={geo} value={geo}>{geo}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-sybrin-blue-50 rounded-md">
            <span className="text-sm font-medium text-sybrin-blue-900">Results:</span>
            <span className="text-lg font-bold text-sybrin-blue-600">{filteredData.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <table className="w-full relative">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('segment_name')} className="flex items-center hover:text-gray-700">
                    Segment
                    {sortField === 'segment_name' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geography</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('total_institutions')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Institutions
                    {sortField === 'total_institutions' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('strategic_priority')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Priority
                    {sortField === 'strategic_priority' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Market Maturity</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Addressable Size</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-gray-900 text-sm">{item.segment_name}</span>
                        <p className="text-xs text-gray-500">{item.segment_type}</p>
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
                        <Users className="w-4 h-4 text-sybrin-blue-500" />
                        <span className="text-lg font-bold text-gray-900">{item.total_institutions?.toLocaleString() || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(item.strategic_priority)}`}>
                        {item.strategic_priority || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getMaturityColor(item.market_maturity)}`}>
                        {item.market_maturity || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.addressable_market_size || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleRowExpansion(item.id)} className="text-sybrin-blue-600 hover:text-sybrin-blue-800 text-sm font-medium">
                        {expandedRows.has(item.id) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 gap-6">
                          {/* GTM Strategy */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Target className="w-4 h-4 mr-2 text-sybrin-blue-600" />
                              Go-to-Market Strategy
                            </h4>
                            <p className="text-sm text-gray-600 bg-sybrin-blue-50 p-3 rounded">{item.go_to_market_strategy || 'No strategy defined'}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Recommended Actions */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Recommended Actions
                              </h4>
                              {item.recommended_actions && Array.isArray(item.recommended_actions) && item.recommended_actions.length > 0 ? (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {item.recommended_actions.map((action, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-green-600 mr-2">✓</span>
                                      <span>{action}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-400">No actions defined</p>
                              )}
                            </div>

                            {/* Key Opportunities */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                                Key Opportunities
                              </h4>
                              {item.key_opportunities && Array.isArray(item.key_opportunities) && item.key_opportunities.length > 0 ? (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {item.key_opportunities.map((opp, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-yellow-600 mr-2">●</span>
                                      <span>{opp}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-400">No opportunities listed</p>
                              )}
                            </div>

                            {/* Key Challenges */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                                Key Challenges
                              </h4>
                              {item.key_challenges && Array.isArray(item.key_challenges) && item.key_challenges.length > 0 ? (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {item.key_challenges.map((challenge, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-red-600 mr-2">!</span>
                                      <span>{challenge}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-400">No challenges listed</p>
                              )}
                            </div>
                          </div>

                          {/* Additional Details */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-1">IT Budget Range</h4>
                              <p className="text-sm text-gray-600">
                                {item.it_budget_range_min_usd && item.it_budget_range_max_usd
                                  ? `$${(parseInt(item.it_budget_range_min_usd) / 1000).toFixed(0)}K - $${(parseInt(item.it_budget_range_max_usd) / 1000).toFixed(0)}K`
                                  : 'No data'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-1">Total Assets</h4>
                              <p className="text-sm text-gray-600">
                                {item.total_assets_usd
                                  ? `$${(parseInt(item.total_assets_usd) / 1000000000).toFixed(2)}B`
                                  : 'No data'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-1">Regulatory Body</h4>
                              <p className="text-sm text-gray-600">{item.regulatory_body || 'No data'}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-gray-700 mb-1">Research Date</h4>
                              <p className="text-sm text-gray-600">
                                {item.research_date ? new Date(item.research_date).toLocaleDateString() : 'No data'}
                              </p>
                            </div>
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
        <div className="text-center py-8 text-gray-500">No segments found matching your filters.</div>
      )}
    </div>
  )
}

export default SegmentIntelligenceDashboard
