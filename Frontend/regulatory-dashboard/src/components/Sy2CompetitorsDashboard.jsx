import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Building2,
  Globe,
  AlertTriangle,
  TrendingUp,
  Target,
  Shield,
  Users,
  MapPin,
  Award,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Link,
  Calendar,
  BarChart3,
  HelpCircle,
  Layers,
  Database
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const Sy2CompetitorsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompetitor, setSelectedCompetitor] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedThreatLevel, setSelectedThreatLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortField, setSortField] = useState('competitor_name')
  const [sortDirection, setSortDirection] = useState('asc')

  // Unique values for filters
  const [competitors, setCompetitors] = useState([])
  const [types, setTypes] = useState([])
  const [geographies, setGeographies] = useState([])
  const [categories, setCategories] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  // View mode - includes specialized views
  const [viewMode, setViewMode] = useState('all') // 'all', 'direct', 'major_direct', 'potential_partners', 'pan_african', 'geography_summary'

  useEffect(() => {
    fetchData()
  }, [viewMode])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedCompetitor, selectedType, selectedGeography, selectedThreatLevel, selectedCategory, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      let query = supabase.from('sy2_competitors').select('*')

      // Use views for specialized modes
      switch(viewMode) {
        case 'direct':
          query = supabase.from('sy2_competitors_direct').select('*')
          break
        case 'major_direct':
          query = supabase.from('sy2_competitors_major_direct').select('*')
          break
        case 'potential_partners':
          query = supabase.from('sy2_competitors_potential_partners').select('*')
          break
        case 'pan_african':
          query = supabase.from('sy2_competitors_pan_african').select('*')
          break
        case 'geography_summary':
          query = supabase.from('sy2_competitors_geography_summary').select('*')
          break
        default:
          query = supabase.from('sy2_competitors').select('*')
      }

      query = query.order('competitor_name', { ascending: true })

      const { data: competitorsData, error } = await query

      if (error) throw error

      setData(competitorsData || [])

      // Extract unique values for filters
      const uniqueCompetitors = [...new Set(competitorsData?.map(c => c.competitor_name) || [])]
      const uniqueTypes = [...new Set(competitorsData?.map(c => c.competitor_type) || [])]
      const uniqueGeographies = [...new Set(competitorsData?.map(c => c.geography) || [])]
      const uniqueCategories = [...new Set(competitorsData?.map(c => c.competition_category) || [])]

      setCompetitors(uniqueCompetitors.sort())
      setTypes(uniqueTypes.filter(Boolean).sort())
      setGeographies(uniqueGeographies.filter(Boolean).sort())
      setCategories(uniqueCategories.filter(Boolean).sort())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortData = () => {
    let filtered = [...data]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.competitor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market_position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.why_competitor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.differentiation_opportunity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market_significance?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Competitor filter
    if (selectedCompetitor !== 'all') {
      filtered = filtered.filter(item => item.competitor_name === selectedCompetitor)
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.competitor_type === selectedType)
    }

    // Geography filter
    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    // Threat Level filter
    if (selectedThreatLevel !== 'all') {
      filtered = filtered.filter(item => item.threat_level === selectedThreatLevel)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.competition_category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      // Handle null values
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

  const getThreatLevelColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'critical':
      case 'very high': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium':
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'low':
      case 'minimal': return 'text-green-600 bg-green-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getTypeIcon = (type) => {
    if (type?.includes('GLOBAL') || type?.includes('Global')) return <Globe className="w-4 h-4" />
    if (type?.includes('REGIONAL') || type?.includes('Regional')) return <MapPin className="w-4 h-4" />
    if (type?.includes('LOCAL') || type?.includes('Local')) return <Building2 className="w-4 h-4" />
    if (type?.includes('DIRECT')) return <Target className="w-4 h-4" />
    if (type?.includes('PARTNER')) return <Users className="w-4 h-4" />
    return <Shield className="w-4 h-4" />
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading competitor data...</div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-red-600">Error: {error}</div>
    </div>
  )

  // Render Geography Summary View
  if (viewMode === 'geography_summary') {
    return (
      <div className="p-6 max-w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sy2 Competitive Analysis - Geography Summary</h1>
          <p className="text-gray-600">Competitor distribution and threat analysis by geography</p>
        </div>

        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Competitors
            </button>
            <button
              onClick={() => setViewMode('direct')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Direct
            </button>
            <button
              onClick={() => setViewMode('major_direct')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'major_direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Major Direct
            </button>
            <button
              onClick={() => setViewMode('potential_partners')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'potential_partners' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Potential Partners
            </button>
            <button
              onClick={() => setViewMode('pan_african')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'pan_african' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Pan-African
            </button>
            <button
              onClick={() => setViewMode('geography_summary')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'geography_summary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Geography Summary
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full relative">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geography
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direct
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Major Direct
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enabler
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indirect
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niche
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System Integrator
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Potential Partner
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Direct Threats
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-900">{item.direct_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-900">{item.major_direct_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700">{item.enabler_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700">{item.indirect_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700">{item.niche_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700">{item.system_integrator_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-blue-600">{item.potential_partner_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-gray-900">{item.total_count || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                        {item.direct_threat_count || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Render Pan-African View
  if (viewMode === 'pan_african') {
    return (
      <div className="p-6 max-w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sy2 Competitive Analysis - Pan-African Competitors</h1>
          <p className="text-gray-600">Competitors with presence in multiple African markets</p>
        </div>

        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Competitors
            </button>
            <button
              onClick={() => setViewMode('direct')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Direct
            </button>
            <button
              onClick={() => setViewMode('major_direct')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'major_direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Major Direct
            </button>
            <button
              onClick={() => setViewMode('potential_partners')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'potential_partners' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Potential Partners
            </button>
            <button
              onClick={() => setViewMode('pan_african')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'pan_african' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Pan-African
            </button>
            <button
              onClick={() => setViewMode('geography_summary')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'geography_summary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Geography Summary
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full relative">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competitor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Markets
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geographies
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Types
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Threat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.competitor_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                        {item.geo_count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.geographies?.map((geo, idx) => (
                          <span key={idx} className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {geo}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{item.types}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getThreatLevelColor(item.max_threat_level)}`}>
                        {item.max_threat_level || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Regular table view
  return (
    <div className="p-6 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sy2 Competitive Intelligence Dashboard</h1>
        <p className="text-gray-600">Enhanced competitive analysis with detailed competitor profiles</p>
      </div>

      {/* View Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All Competitors
          </button>
          <button
            onClick={() => setViewMode('direct')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Direct
          </button>
          <button
            onClick={() => setViewMode('major_direct')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'major_direct' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Major Direct
          </button>
          <button
            onClick={() => setViewMode('potential_partners')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'potential_partners' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Potential Partners
          </button>
          <button
            onClick={() => setViewMode('pan_african')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'pan_african' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pan-African
          </button>
          <button
            onClick={() => setViewMode('geography_summary')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'geography_summary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Geography Summary
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search competitors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCompetitor}
            onChange={(e) => setSelectedCompetitor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Competitors</option>
            {competitors.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
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
            value={selectedThreatLevel}
            onChange={(e) => setSelectedThreatLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Threat Levels</option>
            <option value="Critical">Critical</option>
            <option value="Very High">Very High</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
            <option value="Minimal">Minimal</option>
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
                    onClick={() => handleSort('competitor_name')}
                    className="flex items-center hover:text-gray-700"
                  >
                    Competitor
                    {sortField === 'competitor_name' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type / Category
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
                  Market Significance
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threat Level
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
                      <div>
                        <div className="flex items-center">
                          {getTypeIcon(item.competitor_type)}
                          <span className="ml-2 font-medium text-gray-900 text-sm">{item.competitor_name}</span>
                        </div>
                        {item.headquarters && (
                          <p className="text-xs text-gray-500 ml-6 mt-1">{item.headquarters}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm text-gray-700">{item.competitor_type}</p>
                        <p className="text-xs text-gray-500">{item.competition_category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-gray-700">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-md">
                      <p className="text-sm text-gray-700 truncate">{item.market_significance}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.threat_level ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getThreatLevelColor(item.threat_level)}`}>
                          {item.threat_level}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
                      <td colSpan="6" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Why Competitor */}
                          <div className="space-y-3">
                            {item.why_competitor && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                                  Why Competitor
                                </h4>
                                <p className="text-sm text-gray-600">{item.why_competitor}</p>
                              </div>
                            )}

                            {item.competitive_relationship && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Relationship</h4>
                                <p className="text-sm text-gray-600">{item.competitive_relationship}</p>
                              </div>
                            )}
                          </div>

                          {/* Market Position */}
                          <div className="space-y-3">
                            {item.market_position && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                                  Market Position
                                </h4>
                                <p className="text-sm text-gray-600">{item.market_position}</p>
                              </div>
                            )}

                            {item.local_presence && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Local Presence</h4>
                                <p className="text-sm text-gray-600">{item.local_presence}</p>
                              </div>
                            )}

                            {item.known_customers && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Known Customers</h4>
                                <p className="text-sm text-gray-600">{item.known_customers}</p>
                              </div>
                            )}
                          </div>

                          {/* Strengths, Weaknesses & Differentiation */}
                          <div className="space-y-3">
                            {item.key_strengths && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                                  Key Strengths
                                </h4>
                                <p className="text-sm text-gray-600">{item.key_strengths}</p>
                              </div>
                            )}

                            {item.key_weaknesses && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
                                  Key Weaknesses
                                </h4>
                                <p className="text-sm text-gray-600">{item.key_weaknesses}</p>
                              </div>
                            )}

                            {item.differentiation_opportunity && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <Target className="w-4 h-4 mr-2 text-purple-500" />
                                  Differentiation Opportunity
                                </h4>
                                <p className="text-sm text-gray-600">{item.differentiation_opportunity}</p>
                              </div>
                            )}

                            {item.website_url && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <Link className="w-4 h-4 mr-2" />
                                  Website
                                </h4>
                                <a href={item.website_url} target="_blank" rel="noopener noreferrer"
                                   className="text-sm text-blue-600 hover:underline">
                                  {item.website_url}
                                </a>
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
        <div className="text-center py-8 text-gray-500">
          No competitors found matching your filters.
        </div>
      )}
    </div>
  )
}

export default Sy2CompetitorsDashboard
