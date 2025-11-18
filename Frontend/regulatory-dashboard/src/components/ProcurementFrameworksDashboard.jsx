import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  FileText,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const ProcurementFrameworksDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalMarkets: 0,
    highReadinessSaaS: 0,
    highReadinessOpex: 0,
    increasingTrends: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReadinessSaaS, setSelectedReadinessSaaS] = useState('all')
  const [selectedReadinessOpex, setSelectedReadinessOpex] = useState('all')
  const [selectedGrowthTrend, setSelectedGrowthTrend] = useState('all')
  const [sortField, setSortField] = useState('geography')
  const [sortDirection, setSortDirection] = useState('asc')

  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedReadinessSaaS, selectedReadinessOpex, selectedGrowthTrend, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: frameworksData, error } = await supabase
        .from('sy2_procurement_frameworks')
        .select('*')
        .order('geography', { ascending: true })

      if (error) throw error

      setData(frameworksData || [])

      const highSaaS = frameworksData?.filter(f => f.market_readiness_saas?.toLowerCase() === 'high').length
      const highOpex = frameworksData?.filter(f => f.market_readiness_opex?.toLowerCase() === 'high').length
      const increasing = frameworksData?.filter(f => f.growth_trends?.toLowerCase().includes('increasing')).length

      setStats({
        totalMarkets: frameworksData?.length || 0,
        highReadinessSaaS: highSaaS,
        highReadinessOpex: highOpex,
        increasingTrends: increasing
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
        item.economic_context?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedReadinessSaaS !== 'all') {
      filtered = filtered.filter(item => item.market_readiness_saas === selectedReadinessSaaS)
    }

    if (selectedReadinessOpex !== 'all') {
      filtered = filtered.filter(item => item.market_readiness_opex === selectedReadinessOpex)
    }

    if (selectedGrowthTrend !== 'all') {
      filtered = filtered.filter(item => item.growth_trends === selectedGrowthTrend)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (aVal === null || aVal === undefined) aVal = ''
      if (bVal === null || bVal === undefined) bVal = ''

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
      setSortDirection('asc')
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

  const getReadinessColor = (readiness) => {
    if (readiness?.toLowerCase() === 'high') return 'text-green-600 bg-green-50'
    if (readiness?.toLowerCase() === 'medium') return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getTrendColor = (trend) => {
    if (trend?.toLowerCase().includes('increasing')) return 'text-green-600 bg-green-50'
    if (trend?.toLowerCase().includes('stable')) return 'text-sybrin-blue-600 bg-sybrin-blue-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading procurement frameworks...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Procurement Frameworks</h1>
        <p className="text-gray-600">Payment terms, approval processes, and market readiness by geography</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Markets</p>
              <p className="text-2xl font-bold text-sybrin-blue-600">{stats.totalMarkets}</p>
            </div>
            <MapPin className="w-8 h-8 text-sybrin-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High SaaS Readiness</p>
              <p className="text-2xl font-bold text-green-600">{stats.highReadinessSaaS}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High OPEX Readiness</p>
              <p className="text-2xl font-bold text-purple-600">{stats.highReadinessOpex}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Increasing Trends</p>
              <p className="text-2xl font-bold text-orange-600">{stats.increasingTrends}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
            />
          </div>

          <select
            value={selectedReadinessSaaS}
            onChange={(e) => setSelectedReadinessSaaS(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All SaaS Readiness</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedReadinessOpex}
            onChange={(e) => setSelectedReadinessOpex(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All OPEX Readiness</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
                  <button onClick={() => handleSort('geography')} className="flex items-center hover:text-gray-700">
                    Geography
                    {sortField === 'geography' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SaaS Readiness</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OPEX Readiness</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Trend</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-sybrin-blue-500" />
                        <span className="text-xs text-gray-700">{item.payment_terms_standard || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(item.market_readiness_saas)}`}>
                        {item.market_readiness_saas || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(item.market_readiness_opex)}`}>
                        {item.market_readiness_opex || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(item.growth_trends)}`}>
                        {item.growth_trends || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleRowExpansion(item.id)} className="text-sybrin-blue-600 hover:text-sybrin-blue-800 text-sm font-medium">
                        {expandedRows.has(item.id) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Payment Milestones
                            </h4>
                            <p className="text-sm text-gray-600">{item.payment_milestone_structure || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Preferred Contract Types
                            </h4>
                            {item.preferred_contract_types && Array.isArray(item.preferred_contract_types) ? (
                              <ul className="text-sm text-gray-600 list-disc list-inside">
                                {item.preferred_contract_types.slice(0, 4).map((type, idx) => (
                                  <li key={idx}>{type}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600">No data</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Key Decision Makers
                            </h4>
                            {item.decision_makers && Array.isArray(item.decision_makers) ? (
                              <ul className="text-sm text-gray-600 list-disc list-inside">
                                {item.decision_makers.slice(0, 5).map((dm, idx) => (
                                  <li key={idx}>{dm}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600">No data</p>
                            )}
                          </div>
                          <div className="md:col-span-2 lg:col-span-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Economic Context
                            </h4>
                            <p className="text-sm text-gray-600">{item.economic_context || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Private Sector Process</h4>
                            <p className="text-xs text-gray-600">{item.private_sector_process ? (item.private_sector_process.substring(0, 150) + '...') : 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Approval Hierarchy</h4>
                            <p className="text-xs text-gray-600">{item.approval_hierarchy ? (item.approval_hierarchy.substring(0, 150) + '...') : 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">IT Budget % Revenue</h4>
                            <p className="text-sm text-gray-600">
                              {item.it_budget_pct_revenue_min && item.it_budget_pct_revenue_max
                                ? `${item.it_budget_pct_revenue_min}% - ${item.it_budget_pct_revenue_max}%`
                                : 'No data'}
                            </p>
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

export default ProcurementFrameworksDashboard
