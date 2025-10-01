import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  TrendingUp,
  Globe,
  DollarSign,
  Target,
  AlertTriangle,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Layers,
  Filter,
  ChevronUp,
  ChevronDown,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  EyeOff
} from 'lucide-react'

const MarketIntelligenceDashboard = () => {
  const [marketData, setMarketData] = useState([])
  const [frictionData, setFrictionData] = useState([])
  const [filteredMarketData, setFilteredMarketData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('overview') // 'overview', 'opportunities', 'friction', 'detailed'

  // Filters
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('som_usd')
  const [sortDirection, setSortDirection] = useState('desc')

  // Unique filter values
  const [geographies, setGeographies] = useState([])
  const [categories, setCategories] = useState([])
  const [priorities] = useState(['Critical', 'High', 'Medium', 'Low'])

  // Expanded rows
  const [expandedRows, setExpandedRows] = useState(new Set())

  // Stats
  const [stats, setStats] = useState({
    totalTAM: 0,
    totalSAM: 0,
    totalSOM: 0,
    avgFriction: 0,
    easyMarkets: 0,
    criticalJobs: 0,
    topGeography: '',
    topCategory: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
    calculateStats()
  }, [marketData, frictionData, searchTerm, selectedGeography, selectedCategory, selectedPriority, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch market size data
      const { data: market, error: marketError } = await supabase
        .from('sy_market_size_matrix')
        .select('*')
        .order('som_usd', { ascending: false })

      if (marketError) throw marketError

      // Fetch friction data
      const { data: friction, error: frictionError } = await supabase
        .from('sy_geographic_friction')
        .select('*')
        .order('total_cfi', { ascending: true })

      if (frictionError) throw frictionError

      setMarketData(market || [])
      setFrictionData(friction || [])

      // Extract unique values for filters
      const uniqueGeos = [...new Set(market?.map(m => m.geography).filter(Boolean))]
      const uniqueCats = [...new Set(market?.map(m => m.job_category).filter(Boolean))]

      setGeographies(uniqueGeos.sort())
      setCategories(uniqueCats.sort())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortData = () => {
    let filtered = [...marketData]

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.customer_job?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.geography?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job_category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.job_category === selectedCategory)
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === selectedPriority)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField] || 0
      let bVal = b[sortField] || 0

      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    setFilteredMarketData(filtered)
  }

  const calculateStats = () => {
    const totalTAM = marketData.reduce((sum, item) => sum + (parseFloat(item.tam_usd) || 0), 0)
    const totalSAM = marketData.reduce((sum, item) => sum + (parseFloat(item.sam_usd) || 0), 0)
    const totalSOM = marketData.reduce((sum, item) => sum + (parseFloat(item.som_usd) || 0), 0)

    const avgFriction = frictionData.length > 0
      ? frictionData.reduce((sum, item) => sum + (parseFloat(item.total_cfi) || 0), 0) / frictionData.length
      : 0

    const easyMarkets = frictionData.filter(f => f.entry_difficulty === 'Easy' || f.entry_difficulty === 'Easiest').length
    const criticalJobs = marketData.filter(m => m.priority === 'Critical').length

    // Find top geography by SOM
    const geoSums = {}
    marketData.forEach(item => {
      geoSums[item.geography] = (geoSums[item.geography] || 0) + (parseFloat(item.som_usd) || 0)
    })
    const topGeo = Object.entries(geoSums).sort((a, b) => b[1] - a[1])[0]

    // Find top category by SOM
    const catSums = {}
    marketData.forEach(item => {
      catSums[item.job_category] = (catSums[item.job_category] || 0) + (parseFloat(item.som_usd) || 0)
    })
    const topCat = Object.entries(catSums).sort((a, b) => b[1] - a[1])[0]

    setStats({
      totalTAM,
      totalSAM,
      totalSOM,
      avgFriction: avgFriction.toFixed(1),
      easyMarkets,
      criticalJobs,
      topGeography: topGeo ? topGeo[0] : '',
      topCategory: topCat ? topCat[0] : ''
    })
  }

  const formatCurrency = (value) => {
    if (!value) return '$0'
    const num = parseFloat(value)
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`
    return `$${num.toFixed(0)}`
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'text-red-600 bg-red-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getFrictionColor = (cfi) => {
    const score = parseFloat(cfi)
    if (score < 2.5) return 'text-green-600 bg-green-50'
    if (score < 3.0) return 'text-yellow-600 bg-yellow-50'
    if (score < 3.5) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case 'Easiest':
      case 'Easy': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'Moderate': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'Difficult': return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'Very Difficult': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <Info className="w-5 h-5 text-gray-400" />
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading market intelligence...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Intelligence Dashboard</h1>
        <p className="text-gray-600">Strategic market analysis with TAM/SAM/SOM sizing and entry friction assessment</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total SOM (3-Year)</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalSOM)}</p>
              <p className="text-xs text-gray-500">from {formatCurrency(stats.totalTAM)} TAM</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Easy Entry Markets</p>
              <p className="text-2xl font-bold text-green-600">{stats.easyMarkets}</p>
              <p className="text-xs text-gray-500">Avg friction: {stats.avgFriction}</p>
            </div>
            <Globe className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Opportunities</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticalJobs}</p>
              <p className="text-xs text-gray-500">Immediate action required</p>
            </div>
            <Target className="w-8 h-8 text-red-200" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Market</p>
              <p className="text-lg font-bold text-purple-600">{stats.topGeography}</p>
              <p className="text-xs text-gray-500">{stats.topCategory}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Market Overview
          </button>
          <button
            onClick={() => setViewMode('opportunities')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'opportunities' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Top Opportunities
          </button>
          <button
            onClick={() => setViewMode('friction')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'friction' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Market Friction
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-md transition-colors ${
              viewMode === 'detailed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Detailed Analysis
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs..."
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-md">
            <span className="text-sm font-medium text-blue-900">Results:</span>
            <span className="text-lg font-bold text-blue-600">{filteredMarketData.length}</span>
          </div>
        </div>
      </div>

      {/* Market Overview View */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Size by Geography</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {geographies.map(geo => {
                const geoData = marketData.filter(m => m.geography === geo)
                const tam = geoData.reduce((sum, item) => sum + (parseFloat(item.tam_usd) || 0), 0)
                const sam = geoData.reduce((sum, item) => sum + (parseFloat(item.sam_usd) || 0), 0)
                const som = geoData.reduce((sum, item) => sum + (parseFloat(item.som_usd) || 0), 0)
                const friction = frictionData.find(f => f.geography === geo)

                return (
                  <div key={geo} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{geo}</span>
                        {friction && getDifficultyIcon(friction.entry_difficulty)}
                      </div>
                      <span className="text-sm font-bold text-blue-600">{formatCurrency(som)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">TAM: </span>
                        <span className="font-medium">{formatCurrency(tam)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">SAM: </span>
                        <span className="font-medium">{formatCurrency(sam)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">CFI: </span>
                        <span className={`font-medium ${friction ? getFrictionColor(friction.total_cfi).split(' ')[0] : ''}`}>
                          {friction?.total_cfi || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Size by Category</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map(cat => {
                const catData = marketData.filter(m => m.job_category === cat)
                const tam = catData.reduce((sum, item) => sum + (parseFloat(item.tam_usd) || 0), 0)
                const sam = catData.reduce((sum, item) => sum + (parseFloat(item.sam_usd) || 0), 0)
                const som = catData.reduce((sum, item) => sum + (parseFloat(item.som_usd) || 0), 0)
                const criticalCount = catData.filter(m => m.priority === 'Critical').length

                return (
                  <div key={cat} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{cat}</span>
                        {criticalCount > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            {criticalCount} critical
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-blue-600">{formatCurrency(som)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">TAM: </span>
                        <span className="font-medium">{formatCurrency(tam)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">SAM: </span>
                        <span className="font-medium">{formatCurrency(sam)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Jobs: </span>
                        <span className="font-medium">{catData.length}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Opportunities View */}
      {viewMode === 'opportunities' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('customer_job')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Opportunity
                      {sortField === 'customer_job' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
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
                    Category
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('som_usd')}
                      className="flex items-center hover:text-gray-700 mx-auto"
                    >
                      3-Year SOM
                      {sortField === 'som_usd' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SAM
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TAM
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Win Rate
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMarketData.slice(0, 50).map((item) => {
                  const winRate = item.sam_usd > 0 ? ((parseFloat(item.som_usd) / parseFloat(item.sam_usd)) * 100).toFixed(0) : 0
                  return (
                    <React.Fragment key={item.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{item.customer_job}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                            <span className="text-gray-700">{item.geography}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">{item.job_category}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-blue-600">{formatCurrency(item.som_usd)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-600">{formatCurrency(item.sam_usd)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm text-gray-500">{formatCurrency(item.tam_usd)}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-medium ${winRate > 40 ? 'text-green-600' : winRate > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {winRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleRowExpansion(item.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {expandedRows.has(item.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                      {expandedRows.has(item.id) && (
                        <tr>
                          <td colSpan="9" className="px-4 py-4 bg-gray-50">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Market Analysis</h4>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <p>• Conversion Rate: {item.sam_usd > 0 ? ((parseFloat(item.som_usd) / parseFloat(item.sam_usd)) * 100).toFixed(1) : 0}% of SAM</p>
                                  <p>• Market Coverage: {item.tam_usd > 0 ? ((parseFloat(item.sam_usd) / parseFloat(item.tam_usd)) * 100).toFixed(1) : 0}% of TAM</p>
                                  <p>• Year: {item.year || new Date().getFullYear()}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                                <p className="text-sm text-gray-600">{item.notes || 'No additional notes available'}</p>
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
      )}

      {/* Market Friction View */}
      {viewMode === 'friction' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geography</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CFI Score</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Difficulty</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Market Share</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Mode</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Friction Scores</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {frictionData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${getFrictionColor(item.total_cfi)}`}>
                        {item.total_cfi}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getDifficultyIcon(item.entry_difficulty)}
                        <span className="text-sm">{item.entry_difficulty}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.sybrin_market_share_pct ? (
                        <span className="text-sm font-medium">{item.sybrin_market_share_pct}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{item.recommended_entry_mode}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium">{formatCurrency(item.estimated_investment_usd)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm">
                        {item.estimated_timeline_months ? `${item.estimated_timeline_months} mo` : 'Immediate'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <span className="text-xs px-1 py-0.5 bg-gray-100 rounded" title="Regulatory">R:{item.regulatory_score}</span>
                        <span className="text-xs px-1 py-0.5 bg-gray-100 rounded" title="Competitive">C:{item.competitive_score}</span>
                        <span className="text-xs px-1 py-0.5 bg-gray-100 rounded" title="Cultural">Cu:{item.cultural_score}</span>
                        <span className="text-xs px-1 py-0.5 bg-gray-100 rounded" title="Technical">T:{item.technical_score}</span>
                        <span className="text-xs px-1 py-0.5 bg-gray-100 rounded" title="Economic">E:{item.economic_score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Analysis View */}
      {viewMode === 'detailed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Strategic Recommendations</h3>
            <div className="space-y-4">
              {/* Immediate Wins */}
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-600 mb-2">Immediate Actions (Critical)</h4>
                <div className="space-y-2">
                  {filteredMarketData
                    .filter(m => m.priority === 'Critical')
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.customer_job} in {item.geography}</span>
                        <span className="font-bold text-blue-600">{formatCurrency(item.som_usd)}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* High Priority */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-600 mb-2">High Priority Opportunities</h4>
                <div className="space-y-2">
                  {filteredMarketData
                    .filter(m => m.priority === 'High')
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.customer_job} in {item.geography}</span>
                        <span className="font-bold text-blue-600">{formatCurrency(item.som_usd)}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Easy Wins */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-600 mb-2">Easy Entry Markets</h4>
                <div className="space-y-2">
                  {frictionData
                    .filter(f => f.entry_difficulty === 'Easy' || f.entry_difficulty === 'Easiest')
                    .map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span>{item.geography}</span>
                        <div className="flex items-center gap-2">
                          <span>CFI: {item.total_cfi}</span>
                          <span className="text-gray-500">|</span>
                          <span>{item.recommended_entry_mode}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Market Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">TAM Coverage</span>
                  <span className="text-sm font-bold">{((stats.totalSAM / stats.totalTAM) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(stats.totalSAM / stats.totalTAM) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">SAM to SOM Conversion</span>
                  <span className="text-sm font-bold">{((stats.totalSOM / stats.totalSAM) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(stats.totalSOM / stats.totalSAM) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-700 mb-2">Investment Required</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Easy Markets:</span>
                    <span className="font-medium">$1.5M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moderate Markets:</span>
                    <span className="font-medium">$4.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficult Markets:</span>
                    <span className="font-medium">$5.3M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredMarketData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No market opportunities found matching your filters.
        </div>
      )}
    </div>
  )
}

export default MarketIntelligenceDashboard