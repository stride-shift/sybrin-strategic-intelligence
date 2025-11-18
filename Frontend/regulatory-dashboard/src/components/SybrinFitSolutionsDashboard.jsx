import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Award,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react'

const SybrinFitSolutionsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    avgDealSize: 0,
    totalProspects: 0,
    highAdoption: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAdoption, setSelectedAdoption] = useState('all')
  const [sortField, setSortField] = useState('deal_avg_millions')
  const [sortDirection, setSortDirection] = useState('desc')

  const [geographies, setGeographies] = useState([])
  const [categories, setCategories] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedGeography, selectedCategory, selectedAdoption, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: solutionsData, error } = await supabase
        .from('sy2_view_sybrin_fit_solutions')
        .select('*')
        .order('deal_avg_millions', { ascending: false })

      if (error) throw error

      setData(solutionsData || [])

      const avgDeal = solutionsData?.reduce((sum, s) => sum + (parseFloat(s.deal_avg_millions) || 0), 0) / (solutionsData?.length || 1)
      const totalProspects = solutionsData?.reduce((sum, s) => sum + (s.potential_customers_in_market || 0), 0)
      const highAdoption = solutionsData?.filter(s => s.market_adoption?.toLowerCase() === 'high').length

      setStats({
        totalOpportunities: solutionsData?.length || 0,
        avgDealSize: Math.round(avgDeal * 100) / 100,
        totalProspects,
        highAdoption
      })

      const uniqueGeos = [...new Set(solutionsData?.map(s => s.geography).filter(Boolean))]
      setGeographies(uniqueGeos.sort())

      const uniqueCategories = [...new Set(solutionsData?.map(s => s.solution_category).filter(Boolean))]
      setCategories(uniqueCategories.sort())
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
        item.solution_category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.solution_category === selectedCategory)
    }

    if (selectedAdoption !== 'all') {
      filtered = filtered.filter(item => item.market_adoption === selectedAdoption)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField.includes('millions')) {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
      } else if (sortField === 'potential_customers_in_market' || sortField === 'regulatory_pressure') {
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
      setSortDirection(field.includes('millions') || field === 'potential_customers_in_market' || field === 'regulatory_pressure' ? 'desc' : 'asc')
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

  const getAdoptionColor = (adoption) => {
    if (adoption?.toLowerCase() === 'high') return 'text-green-600 bg-green-50'
    if (adoption?.toLowerCase() === 'medium') return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Compliance': 'text-purple-600 bg-purple-50',
      'Core Banking': 'text-sybrin-blue-600 bg-sybrin-blue-50',
      'Payments': 'text-green-600 bg-green-50',
      'Digital Banking': 'text-orange-600 bg-orange-50',
      'Identity': 'text-pink-600 bg-pink-50'
    }
    return colors[category] || 'text-gray-600 bg-gray-50'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading Sybrin fit solutions...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sybrin High-Fit Solutions</h1>
        <p className="text-gray-600">Solutions where Sybrin has HIGH strategic fit and competitive advantage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Opportunities</p>
              <p className="text-2xl font-bold text-sybrin-blue-600">{stats.totalOpportunities}</p>
              <p className="text-xs text-gray-500 mt-1">High fit solutions</p>
            </div>
            <Award className="w-8 h-8 text-sybrin-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-green-600">${stats.avgDealSize}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Prospects</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalProspects}</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Adoption</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highAdoption}</p>
            </div>
            <Zap className="w-8 h-8 text-orange-200" />
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('deal_avg_millions')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Avg Deal
                    {sortField === 'deal_avg_millions' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('potential_customers_in_market')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Prospects
                    {sortField === 'potential_customers_in_market' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Market Adoption</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.solution_category)}`}>
                          {item.solution_category || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-lg font-bold text-gray-900">
                            ${item.deal_avg_millions ? parseFloat(item.deal_avg_millions).toFixed(2) : '0'}M
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Target className="w-4 h-4 text-sybrin-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{item.potential_customers_in_market || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getAdoptionColor(item.market_adoption)}`}>
                          {item.market_adoption || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRowExpansion(item.geography, item.solution_type)}
                          className="text-sybrin-blue-600 hover:text-sybrin-blue-800 text-sm font-medium"
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
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Deal Range</h4>
                              <p className="text-sm text-gray-600">
                                {item.deal_min_millions && item.deal_max_millions
                                  ? `$${parseFloat(item.deal_min_millions).toFixed(2)}M - $${parseFloat(item.deal_max_millions).toFixed(2)}M`
                                  : 'No range data'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Payment Model</h4>
                              <p className="text-sm text-gray-600">{item.payment_model || 'No data'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Contract Length</h4>
                              <p className="text-sm text-gray-600">{item.typical_contract_length || 'No data'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                SaaS Readiness
                              </h4>
                              <p className="text-sm text-gray-600">{item.market_readiness_saas || 'No data'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Regulatory Pressure</h4>
                              <p className="text-sm text-gray-600">
                                {item.regulatory_pressure ? `${item.regulatory_pressure}/5` : 'No data'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Total Market Budget</h4>
                              <p className="text-sm text-gray-600">
                                {item.total_market_budget_usd
                                  ? `$${(parseFloat(item.total_market_budget_usd) / 1000000).toFixed(2)}M`
                                  : 'No data'}
                              </p>
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
        <div className="text-center py-8 text-gray-500">No solutions found matching your filters.</div>
      )}
    </div>
  )
}

export default SybrinFitSolutionsDashboard
