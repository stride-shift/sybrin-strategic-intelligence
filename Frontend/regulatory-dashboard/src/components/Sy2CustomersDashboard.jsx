import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Building2,
  Globe,
  TrendingUp,
  Target,
  Users,
  MapPin,
  Award,
  AlertCircle,
  CheckCircle2,
  Clock,
  Briefcase,
  Smartphone,
  DollarSign,
  BarChart3,
  PieChart,
  Layers
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const Sy2CustomersDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    crossBorderCount: 0,
    highPriorityCount: 0,
    geographiesCount: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [selectedOpportunity, setSelectedOpportunity] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [sortField, setSortField] = useState('institution_name')
  const [sortDirection, setSortDirection] = useState('asc')

  // Unique values for filters
  const [geographies, setGeographies] = useState([])
  const [segments, setSegments] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  // View mode - includes specialized views
  const [viewMode, setViewMode] = useState('all') // 'all', 'cross_border', 'high_priority', 'pan_african_groups'

  useEffect(() => {
    fetchData()
  }, [viewMode])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedGeography, selectedSegment, selectedOpportunity, selectedPriority, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      let query
      let orderBy = 'institution_name'

      // Use views for specialized modes
      switch(viewMode) {
        case 'cross_border':
          query = supabase.from('sy2_customers_cross_border').select('*')
          orderBy = 'group_geography_count'
          break
        case 'high_priority':
          query = supabase.from('sy2_customers_high_priority').select('*')
          orderBy = 'priority_tier'
          break
        case 'pan_african_groups':
          query = supabase.from('sy2_customers_pan_african_groups').select('*')
          orderBy = 'geography_count'
          break
        default:
          query = supabase.from('sy2_customers').select('*')
          orderBy = 'institution_name'
      }

      // Only order by institution_name if not in pan_african_groups view
      if (viewMode === 'pan_african_groups') {
        query = query.order(orderBy, { ascending: false })
      } else {
        query = query.order(orderBy, { ascending: true })
      }

      const { data: customersData, error } = await query

      if (error) throw error

      setData(customersData || [])

      // Calculate stats based on view mode
      let totalCustomers = customersData?.length || 0
      let crossBorderCount = 0
      let highPriorityCount = 0
      let geographiesCount = 0

      if (viewMode === 'pan_african_groups') {
        // For pan-african groups view, stats are different
        totalCustomers = customersData?.reduce((sum, g) => sum + (g.total_institutions || 0), 0) || 0
        crossBorderCount = customersData?.length || 0 // All groups are cross-border by definition
        geographiesCount = Math.max(...(customersData?.map(g => g.geography_count || 0) || [0]))
      } else {
        // For regular views
        const crossBorder = customersData?.filter(c => c.is_cross_border === true) || []
        const highPriority = customersData?.filter(c =>
          c.priority_tier === 'P1' || c.priority_tier === 'P2' ||
          c.priority_tier === 'Tier 1' || c.priority_tier === 'High' ||
          c.priority_tier === 'Critical'
        ) || []
        const uniqueGeographies = [...new Set(customersData?.map(c => c.geography).filter(Boolean))]

        crossBorderCount = crossBorder.length
        highPriorityCount = highPriority.length
        geographiesCount = uniqueGeographies.length
      }

      setStats({
        totalCustomers,
        crossBorderCount,
        highPriorityCount,
        geographiesCount
      })

      // Extract unique values for filters based on view mode
      if (viewMode === 'pan_african_groups') {
        // For pan-african groups, flatten the geographies array
        const allGeos = customersData?.flatMap(g => g.geographies || []) || []
        const uniqueGeos = [...new Set(allGeos)]
        setGeographies(uniqueGeos.sort())
        setSegments([]) // No segments in this view
      } else {
        const uniqueSegments = [...new Set(customersData?.map(c => c.segment).filter(Boolean))]
        const uniqueGeos = [...new Set(customersData?.map(c => c.geography).filter(Boolean))]
        setGeographies(uniqueGeos.sort())
        setSegments(uniqueSegments.sort())
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortData = () => {
    let filtered = [...data]

    // Search filter - adjust based on view mode
    if (searchTerm) {
      if (viewMode === 'pan_african_groups') {
        // Pan-African Groups view only has pan_african_group and opportunity_levels
        filtered = filtered.filter(item =>
          item.pan_african_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.opportunity_levels?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      } else {
        // Regular view with institution details
        filtered = filtered.filter(item =>
          item.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.segment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.pan_african_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.opportunity_details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.market_position?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
    }

    // Only apply these filters for non-aggregated views
    if (viewMode !== 'pan_african_groups') {
      // Geography filter
      if (selectedGeography !== 'all') {
        filtered = filtered.filter(item => item.geography === selectedGeography)
      }

      // Segment filter
      if (selectedSegment !== 'all') {
        filtered = filtered.filter(item => item.segment === selectedSegment)
      }

      // Opportunity filter
      if (selectedOpportunity !== 'all') {
        filtered = filtered.filter(item => item.opportunity_level === selectedOpportunity)
      }

      // Priority filter
      if (selectedPriority !== 'all') {
        filtered = filtered.filter(item => item.priority_tier === selectedPriority)
      }
    }

    // Sort - use appropriate field based on view mode
    let activeSortField = sortField
    if (viewMode === 'pan_african_groups' && sortField === 'institution_name') {
      activeSortField = 'pan_african_group'
    }

    filtered.sort((a, b) => {
      let aVal = a[activeSortField]
      let bVal = b[activeSortField]

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

  // Get appropriate sort field based on view mode
  const getDefaultSortField = () => {
    if (viewMode === 'pan_african_groups') {
      return 'pan_african_group'
    }
    return 'institution_name'
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

  const getOpportunityColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'high':
      case 'strategic': return 'text-green-600 bg-green-50'
      case 'medium':
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-gray-600 bg-gray-50'
      default: return 'text-sybrin-blue-600 bg-sybrin-blue-50'
    }
  }

  const getPriorityColor = (priority) => {
    if (priority === 'P1' || priority === 'Tier 1' || priority === 'Critical') return 'text-red-600 bg-red-50'
    if (priority === 'P2' || priority === 'High') return 'text-orange-600 bg-orange-50'
    if (priority === 'P3' || priority === 'Medium') return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getSegmentIcon = (segment) => {
    if (segment?.includes('Bank')) return <Building2 className="w-4 h-4" />
    if (segment?.includes('Digital')) return <Smartphone className="w-4 h-4" />
    if (segment?.includes('MFI') || segment?.includes('Microfinance')) return <Users className="w-4 h-4" />
    if (segment?.includes('Mobile Money')) return <Smartphone className="w-4 h-4" />
    return <Briefcase className="w-4 h-4" />
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading customer data...</div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-red-600">Error: {error}</div>
    </div>
  )

  // Render Pan-African Groups View
  if (viewMode === 'pan_african_groups') {
    return (
      <div className="p-6 max-w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sy2 Customers - Pan-African Banking Groups</h1>
          <p className="text-gray-600">Banking groups with presence across multiple African markets</p>
        </div>

        {/* View Mode Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'all' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All Customers
            </button>
            <button
              onClick={() => setViewMode('cross_border')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'cross_border' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Cross-Border
            </button>
            <button
              onClick={() => setViewMode('high_priority')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'high_priority' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              High Priority
            </button>
            <button
              onClick={() => setViewMode('pan_african_groups')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'pan_african_groups' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Pan-African Groups
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full relative">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banking Group
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Markets
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Institutions
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geographies
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity Levels
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-sybrin-blue-500 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.pan_african_group}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-sybrin-blue-100 text-sybrin-blue-700">
                        {item.geography_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-gray-900">{item.total_institutions}</span>
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
                      <span className="text-sm text-gray-700">{item.opportunity_levels}</span>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sy2 Customer Intelligence Dashboard</h1>
        <p className="text-gray-600">Enhanced customer database with detailed institution profiles and opportunity assessment</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Institutions</p>
              <p className="text-2xl font-bold text-sybrin-blue-600">{stats.totalCustomers}</p>
            </div>
            <Building2 className="w-8 h-8 text-sybrin-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cross-Border Groups</p>
              <p className="text-2xl font-bold text-green-600">{stats.crossBorderCount}</p>
            </div>
            <Globe className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highPriorityCount}</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Markets</p>
              <p className="text-2xl font-bold text-purple-600">{stats.geographiesCount}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'all' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All Customers
          </button>
          <button
            onClick={() => setViewMode('cross_border')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'cross_border' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Cross-Border
          </button>
          <button
            onClick={() => setViewMode('high_priority')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'high_priority' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            High Priority
          </button>
          <button
            onClick={() => setViewMode('pan_african_groups')}
            className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'pan_african_groups' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pan-African Groups
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search institutions..."
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
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Segments</option>
            {segments.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="Tier 1">Tier 1</option>
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
                  Segment
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
                  Pan-African Group
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cross-Border
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunity
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
                        {getSegmentIcon(item.segment)}
                        <span className="ml-2 font-medium text-gray-900 text-sm">{item.institution_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{item.segment}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                        <span className="text-gray-700">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.pan_african_group && item.pan_african_group !== 'None' ? (
                        <div className="flex items-center text-sm">
                          <Globe className="w-3 h-3 text-sybrin-blue-500 mr-1" />
                          <span className="text-sybrin-blue-700">{item.pan_african_group}</span>
                          {item.group_geography_count && (
                            <span className="ml-1 text-xs text-gray-500">({item.group_geography_count})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.is_cross_border ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.opportunity_level ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getOpportunityColor(item.opportunity_level)}`}>
                          {item.opportunity_level}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.priority_tier ? (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(item.priority_tier)}`}>
                          {item.priority_tier}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
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
                      <td colSpan="8" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Opportunity Details */}
                          <div className="space-y-3">
                            {item.opportunity_details && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <Target className="w-4 h-4 mr-2 text-sybrin-blue-500" />
                                  Opportunity Details
                                </h4>
                                <p className="text-sm text-gray-600">{item.opportunity_details}</p>
                              </div>
                            )}

                            {item.digital_maturity && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Digital Maturity</h4>
                                <p className="text-sm text-gray-600">{item.digital_maturity}</p>
                              </div>
                            )}

                            {item.regulatory_status && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Regulatory Status</h4>
                                <p className="text-sm text-gray-600">{item.regulatory_status}</p>
                              </div>
                            )}
                          </div>

                          {/* Market Position */}
                          <div className="space-y-3">
                            {item.market_position && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
                                  Market Position
                                </h4>
                                <p className="text-sm text-gray-600">{item.market_position}</p>
                              </div>
                            )}

                            {item.financial_health && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Financial Health</h4>
                                <p className="text-sm text-gray-600">{item.financial_health}</p>
                              </div>
                            )}

                            {item.assets && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Assets</h4>
                                <p className="text-sm text-gray-600">{item.assets}</p>
                              </div>
                            )}

                            {item.ownership && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Ownership</h4>
                                <p className="text-sm text-gray-600">{item.ownership}</p>
                              </div>
                            )}
                          </div>

                          {/* Operations */}
                          <div className="space-y-3">
                            {item.branch_network && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                                  Branch Network
                                </h4>
                                <p className="text-sm text-gray-600">{item.branch_network}</p>
                              </div>
                            )}

                            {item.customer_base && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Customer Base</h4>
                                <p className="text-sm text-gray-600">{item.customer_base}</p>
                              </div>
                            )}

                            {item.key_products && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Products</h4>
                                <p className="text-sm text-gray-600">{item.key_products}</p>
                              </div>
                            )}

                            {item.technology_stack && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Technology Stack</h4>
                                <p className="text-sm text-gray-600">{item.technology_stack}</p>
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
          No institutions found matching your filters.
        </div>
      )}
    </div>
  )
}

export default Sy2CustomersDashboard
