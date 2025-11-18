import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  DollarSign,
  MapPin,
  Award,
  Calendar,
  CreditCard,
  Target
} from 'lucide-react'

const SolutionPricingDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalSolutions: 0,
    avgDealSize: 0,
    highFit: 0,
    avgContractLength: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedFit, setSelectedFit] = useState('all')
  const [selectedModel, setSelectedModel] = useState('all')
  const [sortField, setSortField] = useState('deal_size_max_usd')
  const [sortDirection, setSortDirection] = useState('desc')

  const [geographies, setGeographies] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedGeography, selectedFit, selectedModel, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: pricingData, error } = await supabase
        .from('sy2_solution_pricing')
        .select('*')
        .order('deal_size_max_usd', { ascending: false })

      if (error) throw error

      setData(pricingData || [])

      const avgMax = pricingData?.reduce((sum, s) => sum + (s.deal_size_max_usd || 0), 0) / (pricingData?.length || 1)
      const highFit = pricingData?.filter(s => s.sybrin_fit_rating?.toLowerCase().includes('high')).length
      const avgContract = pricingData?.reduce((sum, s) => sum + (s.typical_contract_length_months || 0), 0) / (pricingData?.length || 1)

      setStats({
        totalSolutions: pricingData?.length || 0,
        avgDealSize: Math.round(avgMax / 1000000),
        highFit,
        avgContractLength: Math.round(avgContract)
      })

      const uniqueGeos = [...new Set(pricingData?.map(s => s.geography).filter(Boolean))]
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
        item.solution_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.geography?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    if (selectedFit !== 'all') {
      filtered = filtered.filter(item => item.sybrin_fit_rating === selectedFit)
    }

    if (selectedModel !== 'all') {
      filtered = filtered.filter(item => item.payment_model === selectedModel)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (aVal === null || aVal === undefined) aVal = sortField.includes('usd') || sortField.includes('months') ? 0 : ''
      if (bVal === null || bVal === undefined) bVal = sortField.includes('usd') || sortField.includes('months') ? 0 : ''

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
      setSortDirection(field.includes('usd') || field.includes('months') ? 'desc' : 'asc')
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

  const getFitColor = (fit) => {
    if (fit?.toLowerCase().includes('high')) return 'text-green-600 bg-green-50'
    if (fit?.toLowerCase().includes('medium')) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading pricing data...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Solution Pricing Intelligence</h1>
        <p className="text-gray-600">Willingness-to-pay pricing and deal size intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Solutions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalSolutions}</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Max Deal</p>
              <p className="text-2xl font-bold text-green-600">${stats.avgDealSize}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Fit Solutions</p>
              <p className="text-2xl font-bold text-purple-600">{stats.highFit}</p>
            </div>
            <Award className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Contract</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgContractLength}mo</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search solutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <select
            value={selectedFit}
            onChange={(e) => setSelectedFit(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Fit Ratings</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
                  <button onClick={() => handleSort('solution_type')} className="flex items-center hover:text-gray-700">
                    Solution
                    {sortField === 'solution_type' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geography</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('deal_size_min_usd')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Deal Range
                    {sortField === 'deal_size_min_usd' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Model</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sybrin Fit</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('typical_contract_length_months')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Contract Length
                    {sortField === 'typical_contract_length_months' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 text-sm">{item.solution_type}</span>
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
                        <span className="text-sm font-bold text-gray-900">
                          ${(item.deal_size_min_usd / 1000000).toFixed(1)}M - ${(item.deal_size_max_usd / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-700">{item.payment_model || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getFitColor(item.sybrin_fit_rating)}`}>
                        {item.sybrin_fit_rating || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.typical_contract_length_months}mo</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleRowExpansion(item.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        {expandedRows.has(item.id) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Pricing Notes</h4>
                            <p className="text-sm text-gray-600">{item.pricing_notes || 'No pricing notes available'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Fit Rationale</h4>
                            <p className="text-sm text-gray-600">{item.fit_rationale || 'No rationale provided'}</p>
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
        <div className="text-center py-8 text-gray-500">No solutions found matching your filters.</div>
      )}
    </div>
  )
}

export default SolutionPricingDashboard
