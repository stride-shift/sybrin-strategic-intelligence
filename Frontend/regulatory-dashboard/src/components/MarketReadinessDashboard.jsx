import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Flame,
  Sun,
  CloudRain,
  Snowflake,
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  FileText,
  Target
} from 'lucide-react'

const MarketReadinessDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    hotMarkets: 0,
    warmMarkets: 0,
    totalMarketValue: 0,
    avgRegDrivers: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemperature, setSelectedTemperature] = useState('all')
  const [sortField, setSortField] = useState('total_market_budget_millions')
  const [sortDirection, setSortDirection] = useState('desc')

  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedTemperature, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: readinessData, error } = await supabase
        .from('sy2_view_market_readiness')
        .select('*')
        .order('total_market_budget_millions', { ascending: false })

      if (error) throw error

      setData(readinessData || [])

      // Calculate stats
      const hot = readinessData?.filter(m => m.market_temperature?.includes('HOT')) || []
      const warm = readinessData?.filter(m => m.market_temperature?.includes('WARM')) || []
      const totalValue = readinessData?.reduce((sum, m) => sum + (m.total_market_budget_millions || 0), 0)
      const avgDrivers = readinessData?.reduce((sum, m) => sum + (m.regulatory_driver_count || 0), 0) / (readinessData?.length || 1)

      setStats({
        hotMarkets: hot.length,
        warmMarkets: warm.length,
        totalMarketValue: Math.round(totalValue),
        avgRegDrivers: Math.round(avgDrivers * 10) / 10
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
        item.market_temperature?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTemperature !== 'all') {
      filtered = filtered.filter(item => item.market_temperature === selectedTemperature)
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

  const toggleRowExpansion = (geography) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(geography)) {
      newExpanded.delete(geography)
    } else {
      newExpanded.add(geography)
    }
    setExpandedRows(newExpanded)
  }

  const getTemperatureIcon = (temp) => {
    if (temp?.includes('HOT')) return <Flame className="w-5 h-5 text-red-500" />
    if (temp?.includes('WARM')) return <Sun className="w-5 h-5 text-orange-500" />
    if (temp?.includes('COOL')) return <CloudRain className="w-5 h-5 text-sybrin-blue-500" />
    return <Snowflake className="w-5 h-5 text-gray-400" />
  }

  const getTemperatureColor = (temp) => {
    if (temp?.includes('HOT')) return 'text-red-600 bg-red-50 border-red-200'
    if (temp?.includes('WARM')) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (temp?.includes('COOL')) return 'text-sybrin-blue-600 bg-sybrin-blue-50 border-sybrin-blue-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getUniqueTemperatures = () => {
    return [...new Set(data.map(d => d.market_temperature).filter(Boolean))].sort((a, b) => {
      const order = ['HOT', 'WARM', 'COOL', 'COLD']
      const aIdx = order.findIndex(o => a.includes(o))
      const bIdx = order.findIndex(o => b.includes(o))
      return aIdx - bIdx
    })
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading market readiness data...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Readiness Analysis</h1>
        <p className="text-gray-600">Market temperature ratings for GTM prioritization</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">HOT Markets</p>
              <p className="text-2xl font-bold text-red-600">{stats.hotMarkets}</p>
              <p className="text-xs text-gray-500 mt-1">Ready Now</p>
            </div>
            <Flame className="w-8 h-8 text-red-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">WARM Markets</p>
              <p className="text-2xl font-bold text-orange-600">{stats.warmMarkets}</p>
              <p className="text-xs text-gray-500 mt-1">6-12 Months</p>
            </div>
            <Sun className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Market Value</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalMarketValue}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Reg Drivers</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgRegDrivers}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            value={selectedTemperature}
            onChange={(e) => setSelectedTemperature(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Temperatures</option>
            {getUniqueTemperatures().map(temp => (
              <option key={temp} value={temp}>{temp}</option>
            ))}
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-sybrin-blue-50 rounded-md">
            <span className="text-sm font-medium text-sybrin-blue-900">Markets:</span>
            <span className="text-lg font-bold text-sybrin-blue-600">{filteredData.length}</span>
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Temperature
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('total_market_budget_millions')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    Market Size
                    {sortField === 'total_market_budget_millions' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('institution_count')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    Institutions
                    {sortField === 'institution_count' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('regulatory_driver_count')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    Reg Drivers
                    {sortField === 'regulatory_driver_count' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.geography}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {getTemperatureIcon(item.market_temperature)}
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getTemperatureColor(item.market_temperature)}`}>
                          {item.market_temperature}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {item.total_market_budget_millions ? `$${item.total_market_budget_millions}M` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-sybrin-blue-500" />
                        <span className="text-sm font-medium text-gray-900">{item.total_institutions || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                        {item.regulatory_driver_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRowExpansion(item.geography)}
                        className="text-sybrin-blue-600 hover:text-sybrin-blue-800 text-sm font-medium"
                      >
                        {expandedRows.has(item.geography) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.geography) && (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="md:col-span-2 lg:col-span-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Economic Context</h4>
                            <p className="text-sm text-gray-600">{item.economic_context || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Terms</h4>
                            <p className="text-sm text-gray-600">{item.payment_terms_standard || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">OPEX Readiness</h4>
                            <p className="text-sm text-gray-600">{item.market_readiness_opex || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">IT Budget % Revenue</h4>
                            <p className="text-sm text-gray-600">{item.it_budget_pct_revenue || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Avg Institution Budget</h4>
                            <p className="text-sm text-gray-600">
                              {item.avg_institution_budget_millions
                                ? `$${parseFloat(item.avg_institution_budget_millions).toFixed(1)}M`
                                : 'No data'}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Dev Finance Opportunities</h4>
                            <p className="text-sm text-gray-600">{item.dev_finance_opportunities || 0} available</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">High Digital Maturity</h4>
                            <p className="text-sm text-gray-600">{item.high_digital_maturity_count || 0} institutions</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Priority Institutions</h4>
                            <p className="text-sm text-gray-600">{item.priority_institutions || 0} of {item.total_institutions || 0}</p>
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
          No markets found matching your filters.
        </div>
      )}
    </div>
  )
}

export default MarketReadinessDashboard
