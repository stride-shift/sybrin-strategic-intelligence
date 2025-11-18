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
  HelpCircle
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const CompetitorsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompetitor, setSelectedCompetitor] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedThreatLevel, setSelectedThreatLevel] = useState('all')
  const [selectedPresence, setSelectedPresence] = useState('all')
  const [sortField, setSortField] = useState('competitor_name')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Unique values for filters
  const [competitors, setCompetitors] = useState([])
  const [categories, setCategories] = useState([])
  const [types, setTypes] = useState([])
  const [geographies, setGeographies] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // View mode
  const [viewMode, setViewMode] = useState('table') // 'table', 'cards', 'comparison'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedCompetitor, selectedCategory, selectedType, selectedGeography, selectedThreatLevel, selectedPresence, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: competitorsData, error } = await supabase
        .from('sy_competitors')
        .select('*')
        .order('competitor_name', { ascending: true })

      if (error) throw error

      setData(competitorsData || [])
      
      // Extract unique values for filters
      const uniqueCompetitors = [...new Set(competitorsData?.map(c => c.competitor_name) || [])]
      const uniqueCategories = [...new Set(competitorsData?.map(c => c.competitor_category) || [])]
      const uniqueTypes = [...new Set(competitorsData?.map(c => c.competitor_type) || [])]
      const uniqueGeographies = [...new Set(competitorsData?.map(c => c.geography) || [])]
      
      setCompetitors(uniqueCompetitors.sort())
      setCategories(uniqueCategories.sort())
      setTypes(uniqueTypes.sort())
      setGeographies(uniqueGeographies.sort())
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
        item.why_they_win?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.why_they_lose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sybrin_position?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Competitor filter
    if (selectedCompetitor !== 'all') {
      filtered = filtered.filter(item => item.competitor_name === selectedCompetitor)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.competitor_category === selectedCategory)
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

    // Presence Level filter
    if (selectedPresence !== 'all') {
      filtered = filtered.filter(item => item.presence_level === selectedPresence)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      // Handle null values
      if (aVal === null) aVal = ''
      if (bVal === null) bVal = ''
      
      // Special handling for threat_level
      if (sortField === 'threat_level') {
        const threatOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
        aVal = threatOrder[aVal] || 0
        bVal = threatOrder[bVal] || 0
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
    switch(level) {
      case 'Critical': return 'text-red-600 bg-red-50'
      case 'High': return 'text-orange-600 bg-orange-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getPresenceLevelColor = (level) => {
    switch(level) {
      case 'Dominant': return 'text-purple-600'
      case 'Strong': return 'text-sybrin-blue-600'
      case 'Limited': return 'text-yellow-600'
      case 'Emerging': return 'text-green-600'
      default: return 'text-gray-500'
    }
  }

  const getTypeIcon = (type) => {
    if (type?.includes('Global')) return <Globe className="w-4 h-4" />
    if (type?.includes('Regional')) return <MapPin className="w-4 h-4" />
    if (type?.includes('Local')) return <Building2 className="w-4 h-4" />
    if (type?.includes('Startup')) return <TrendingUp className="w-4 h-4" />
    return <Shield className="w-4 h-4" />
  }

  // Group data by competitor for card view
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.competitor_name]) {
      acc[item.competitor_name] = {
        competitor_name: item.competitor_name,
        competitor_type: item.competitor_type,
        competitor_category: item.competitor_category,
        headquarters: item.headquarters,
        website: item.website,
        entries: []
      }
    }
    acc[item.competitor_name].entries.push(item)
    return acc
  }, {})

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

  return (
    <div className="p-6 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitive Analysis Dashboard</h1>
        <p className="text-gray-600">Track and analyze competitor positioning across markets</p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search competitors, positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
            />
          </div>

          <select
            value={selectedCompetitor}
            onChange={(e) => setSelectedCompetitor(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Competitors</option>
            {competitors.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
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
            value={selectedThreatLevel}
            onChange={(e) => setSelectedThreatLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Threat Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-sybrin-blue-50 rounded-md">
            <span className="text-sm font-medium text-sybrin-blue-900">Results:</span>
            <span className="text-lg font-bold text-sybrin-blue-600">{filteredData.length}</span>
          </div>
        </div>

        {/* Additional filters and view controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={selectedPresence}
            onChange={(e) => setSelectedPresence(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Presence Levels</option>
            <option value="Dominant">Dominant</option>
            <option value="Strong">Strong</option>
            <option value="Limited">Limited</option>
            <option value="Emerging">Emerging</option>
          </select>

          <div className="flex gap-2 lg:col-span-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'table' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'cards' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'comparison' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
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
                    Category / Type
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
                    Market Position
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center justify-center gap-1">
                      Presence
                      <InfoPopup 
                        title="Market Presence Level"
                        content={
                          <div className="space-y-3">
                            <p>Indicates competitor's market strength in specific geography.</p>
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold text-purple-600">Dominant:</span>
                                <span className="ml-2">Market leader with 30%+ share</span>
                                <p className="text-xs text-gray-500 ml-2">Sets standards, hard to displace</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sybrin-blue-600">Strong:</span>
                                <span className="ml-2">Major player with 15-30% share</span>
                                <p className="text-xs text-gray-500 ml-2">Well-established relationships</p>
                              </div>
                              <div>
                                <span className="font-semibold text-yellow-600">Limited:</span>
                                <span className="ml-2">Niche player with &lt;15% share</span>
                                <p className="text-xs text-gray-500 ml-2">Opportunity for Sybrin to compete</p>
                              </div>
                              <div>
                                <span className="font-semibold text-green-600">Emerging:</span>
                                <span className="ml-2">New entrant building presence</span>
                                <p className="text-xs text-gray-500 ml-2">Vulnerable to competition</p>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('threat_level')}
                      className="flex items-center justify-center hover:text-gray-700 w-full"
                    >
                      <span className="flex items-center gap-1">
                        Threat
                        <InfoPopup 
                          title="Threat Level to Sybrin"
                          content={
                            <div className="space-y-3">
                              <p>Helps prioritize competitive response strategies.</p>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-red-600">Critical:</span>
                                  <span className="ml-2">Directly winning our target deals</span>
                                  <p className="text-xs text-gray-500 ml-2">Immediate action required</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-orange-600">High:</span>
                                  <span className="ml-2">Strong in our key segments</span>
                                  <p className="text-xs text-gray-500 ml-2">Needs competitive strategy</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-yellow-600">Medium:</span>
                                  <span className="ml-2">Overlapping but differentiated</span>
                                  <p className="text-xs text-gray-500 ml-2">Monitor and differentiate</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-green-600">Low:</span>
                                  <span className="ml-2">Different segments or weak</span>
                                  <p className="text-xs text-gray-500 ml-2">Minimal immediate concern</p>
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </span>
                      {sortField === 'threat_level' && (
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
                          <p className="text-sm text-gray-700">{item.competitor_category}</p>
                          <p className="text-xs text-gray-500">{item.competitor_type}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-gray-700">{item.geography}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-700 truncate">{item.market_position}</p>
                        {item.client_count && (
                          <p className="text-xs text-gray-500 mt-1">{item.client_count}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-medium ${getPresenceLevelColor(item.presence_level)}`}>
                          {item.presence_level || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getThreatLevelColor(item.threat_level)}`}>
                          {item.threat_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRowExpansion(item.id)}
                          className="text-sybrin-blue-600 hover:text-sybrin-blue-800 text-sm font-medium"
                        >
                          {expandedRows.has(item.id) ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(item.id) && (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Strengths & Weaknesses */}
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                                  Why They Win
                                </h4>
                                <p className="text-sm text-gray-600">{item.why_they_win}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
                                  Why They Lose
                                </h4>
                                <p className="text-sm text-gray-600">{item.why_they_lose}</p>
                              </div>

                              {item.sybrin_position && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-sybrin-blue-500" />
                                    Sybrin Position
                                  </h4>
                                  <p className="text-sm text-gray-600">{item.sybrin_position}</p>
                                </div>
                              )}
                            </div>

                            {/* Jobs Served */}
                            <div className="space-y-3">
                              {item.jobs_served_well && item.jobs_served_well.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Award className="w-4 h-4 mr-2 text-green-500" />
                                    Jobs Served Well
                                  </h4>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {item.jobs_served_well.slice(0, 3).map((job, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="text-green-500 mr-2">•</span>
                                        <span>{job}</span>
                                      </li>
                                    ))}
                                    {item.jobs_served_well.length > 3 && (
                                      <li className="text-xs text-gray-500 italic ml-4">
                                        +{item.jobs_served_well.length - 3} more
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              {item.jobs_served_poorly && item.jobs_served_poorly.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                                    Jobs Served Poorly
                                  </h4>
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {item.jobs_served_poorly.slice(0, 3).map((job, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="text-orange-500 mr-2">•</span>
                                        <span>{job}</span>
                                      </li>
                                    ))}
                                    {item.jobs_served_poorly.length > 3 && (
                                      <li className="text-xs text-gray-500 italic ml-4">
                                        +{item.jobs_served_poorly.length - 3} more
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-3">
                              {item.target_segments && item.target_segments.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Target className="w-4 h-4 mr-2" />
                                    Target Segments
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {item.target_segments.map((segment, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-sybrin-blue-100 text-sybrin-blue-700 text-xs rounded">
                                        {segment}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {item.competitive_advantages && item.competitive_advantages.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Competitive Advantages</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {item.competitive_advantages.map((adv, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                        {adv}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {item.website && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Link className="w-4 h-4 mr-2" />
                                    Website
                                  </h4>
                                  <a href={item.website} target="_blank" rel="noopener noreferrer" 
                                     className="text-sm text-sybrin-blue-600 hover:underline">
                                    {item.website}
                                  </a>
                                </div>
                              )}

                              {item.last_updated && (
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Updated: {item.last_updated}
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
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(groupedData).map((competitor) => (
            <div key={competitor.competitor_name} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{competitor.competitor_name}</h3>
                    <p className="text-sm text-gray-500">{competitor.competitor_category}</p>
                    <p className="text-xs text-gray-400 mt-1">{competitor.headquarters}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    competitor.entries.some(e => e.threat_level === 'Critical') ? 'bg-red-100 text-red-700' :
                    competitor.entries.some(e => e.threat_level === 'High') ? 'bg-orange-100 text-orange-700' :
                    competitor.entries.some(e => e.threat_level === 'Medium') ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {competitor.entries.find(e => e.threat_level === 'Critical')?.threat_level ||
                     competitor.entries.find(e => e.threat_level === 'High')?.threat_level ||
                     competitor.entries.find(e => e.threat_level === 'Medium')?.threat_level ||
                     'Low'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Geographic Presence</h4>
                  <div className="flex flex-wrap gap-1">
                    {competitor.entries.map((entry, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {entry.geography}
                        {entry.presence_level && (
                          <span className={`ml-1 font-medium ${getPresenceLevelColor(entry.presence_level)}`}>
                            ({entry.presence_level})
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {competitor.entries[0].jobs_served_well && competitor.entries[0].jobs_served_well.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Key Strengths</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {competitor.entries[0].jobs_served_well.slice(0, 2).map((job, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-xs">{job}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {competitor.entries[0].why_they_win && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Why they win:</span> {competitor.entries[0].why_they_win.substring(0, 100)}...
                    </p>
                  </div>
                )}

                {competitor.website && (
                  <div className="text-center mt-4">
                    <a href={competitor.website} target="_blank" rel="noopener noreferrer" 
                       className="text-xs text-sybrin-blue-600 hover:underline">
                      Visit Website →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison View */}
      {viewMode === 'comparison' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full relative">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                    Competitor
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geographic Reach
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Count
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Threat Level
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Strength
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Weakness
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(groupedData).map(competitor => {
                  const mainEntry = competitor.entries[0]
                  return (
                    <tr key={competitor.competitor_name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white">
                        {competitor.competitor_name}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {mainEntry.competitor_type}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-sybrin-blue-100 text-sybrin-blue-700 text-xs rounded">
                          {competitor.entries.length} markets
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {mainEntry.client_count || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getThreatLevelColor(mainEntry.threat_level)}`}>
                          {mainEntry.threat_level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs">
                        {mainEntry.competitive_advantages?.[0] || mainEntry.jobs_served_well?.[0] || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs">
                        {mainEntry.competitive_weaknesses?.[0] || mainEntry.jobs_served_poorly?.[0] || '-'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No competitors found matching your filters.
        </div>
      )}
    </div>
  )
}

export default CompetitorsDashboard