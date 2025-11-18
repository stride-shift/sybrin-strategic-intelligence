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
  PieChart
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const CustomersDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalExisting: 0,
    totalPotential: 0,
    countriesServed: 0,
    avgMarketShare: 0
  })
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [sortField, setSortField] = useState('customer_name')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Unique values for filters
  const [countries, setCountries] = useState([])
  const [segments, setSegments] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // View mode
  const [viewMode, setViewMode] = useState('table') // 'table', 'cards', 'stats'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedType, selectedStatus, selectedGeography, selectedCountry, selectedSegment, selectedPriority, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: customers, error } = await supabase
        .from('sy_customers')
        .select('*')
        .order('customer_name', { ascending: true })

      if (error) throw error

      setData(customers || [])
      
      // Calculate stats
      const existing = customers?.filter(c => c.customer_type === 'Existing') || []
      const potential = customers?.filter(c => c.customer_type === 'Potential') || []
      const uniqueCountries = [...new Set(customers?.map(c => c.country).filter(Boolean))]
      const avgShare = existing
        .filter(c => c.market_share_percentage)
        .reduce((acc, c) => acc + c.market_share_percentage, 0) / 
        (existing.filter(c => c.market_share_percentage).length || 1)
      
      setStats({
        totalExisting: existing.length,
        totalPotential: potential.length,
        countriesServed: uniqueCountries.length,
        avgMarketShare: Math.round(avgShare)
      })
      
      // Extract unique values for filters
      const uniqueSegments = [...new Set(customers?.map(c => c.segment_type).filter(Boolean))]
      
      setCountries(uniqueCountries.sort())
      setSegments(uniqueSegments.sort())
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
        item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.segment_type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.customer_type === selectedType)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.customer_status === selectedStatus)
    }

    // Geography filter
    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(item => item.country === selectedCountry)
    }

    // Segment filter
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(item => item.segment_type === selectedSegment)
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === selectedPriority)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      // Handle null values
      if (aVal === null) aVal = ''
      if (bVal === null) bVal = ''
      
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Confirmed': return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'Likely': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'Target': return <Target className="w-4 h-4 text-blue-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'text-green-600 bg-green-50'
      case 'Likely': return 'text-yellow-600 bg-yellow-50'
      case 'Target': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getSegmentIcon = (segment) => {
    if (segment?.includes('Commercial Bank')) return <Building2 className="w-4 h-4" />
    if (segment?.includes('Digital Bank')) return <Smartphone className="w-4 h-4" />
    if (segment?.includes('MFB') || segment?.includes('Microfinance')) return <Users className="w-4 h-4" />
    if (segment?.includes('SACCO')) return <Users className="w-4 h-4" />
    if (segment?.includes('Mobile Money')) return <Smartphone className="w-4 h-4" />
    if (segment?.includes('Infrastructure')) return <Globe className="w-4 h-4" />
    return <Briefcase className="w-4 h-4" />
  }

  // Group data by country for stats view
  const countryStats = filteredData.reduce((acc, item) => {
    const country = item.country || 'Unknown'
    if (!acc[country]) {
      acc[country] = {
        country,
        existing: 0,
        potential: 0,
        confirmed: 0,
        likely: 0,
        target: 0
      }
    }
    if (item.customer_type === 'Existing') acc[country].existing++
    if (item.customer_type === 'Potential') acc[country].potential++
    if (item.customer_status === 'Confirmed') acc[country].confirmed++
    if (item.customer_status === 'Likely') acc[country].likely++
    if (item.customer_status === 'Target') acc[country].target++
    return acc
  }, {})

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

  return (
    <div className="p-6 max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h1>
        <p className="text-gray-600">Comprehensive view of Sybrin's existing and potential customers</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Existing Customers</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalExisting}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Potential Customers</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalPotential}</p>
            </div>
            <Target className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Countries</p>
              <p className="text-2xl font-bold text-purple-600">{stats.countriesServed}</p>
            </div>
            <Globe className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Market Share</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgMarketShare}%</p>
            </div>
            <PieChart className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="Existing">Existing</option>
            <option value="Potential">Potential</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Likely">Likely</option>
            <option value="Target">Target</option>
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Segments</option>
            {segments.map(segment => (
              <option key={segment} value={segment}>{segment}</option>
            ))}
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-md">
            <span className="text-sm font-medium text-blue-900">Results:</span>
            <span className="text-lg font-bold text-blue-600">{filteredData.length}</span>
          </div>
        </div>

        {/* Additional filters and view controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <select
            value={selectedGeography}
            onChange={(e) => setSelectedGeography(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Asia">Asia</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="flex gap-2 lg:col-span-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Card View
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'stats' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Statistics
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
                      onClick={() => handleSort('customer_name')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Customer
                      {sortField === 'customer_name' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('customer_type')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Type
                      {sortField === 'customer_type' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('customer_status')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Status
                      {sortField === 'customer_status' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('country')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Country
                      {sortField === 'country' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Market Share
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
                          {getSegmentIcon(item.segment_type)}
                          <span className="ml-2 font-medium text-gray-900 text-sm">{item.customer_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.customer_type === 'Existing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.customer_type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.customer_status)}
                          <span className="text-xs text-gray-600">{item.customer_status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-gray-700">{item.country || item.geography}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="text-gray-700">{item.segment_type}</p>
                          {item.tier && (
                            <p className="text-xs text-gray-500">{item.tier}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.market_share_percentage ? (
                          <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                            {item.market_share_percentage}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.priority && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
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
                        <td colSpan="8" className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                              <p className="text-sm text-gray-600">{item.description || 'No description available'}</p>
                            </div>
                            <div className="space-y-2">
                              {item.branches_count && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-700">Branches: </span>
                                  <span className="text-sm text-gray-600">{item.branches_count}</span>
                                </div>
                              )}
                              {item.notes && (
                                <div>
                                  <span className="text-sm font-semibold text-gray-700">Notes: </span>
                                  <span className="text-sm text-gray-600">{item.notes}</span>
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
          {filteredData.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {getSegmentIcon(customer.segment_type)}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{customer.customer_name}</h3>
                    <p className="text-sm text-gray-500">{customer.segment_type}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  customer.customer_type === 'Existing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {customer.customer_type}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(customer.customer_status)}
                    <span className={`text-sm font-medium ${getStatusColor(customer.customer_status).split(' ')[0]}`}>
                      {customer.customer_status}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Country:</span>
                  <span className="text-sm font-medium text-gray-900">{customer.country || customer.geography}</span>
                </div>

                {customer.market_share_percentage && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Market Share:</span>
                    <span className="text-sm font-bold text-purple-600">{customer.market_share_percentage}%</span>
                  </div>
                )}

                {customer.priority && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Priority:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(customer.priority)}`}>
                      {customer.priority}
                    </span>
                  </div>
                )}
              </div>

              {customer.description && (
                <p className="text-sm text-gray-600 border-t pt-3">
                  {customer.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Statistics View */}
      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Distribution by Type</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Existing Customers</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{stats.totalExisting}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Potential Customers</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.totalPotential}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Opportunity</span>
                  <span className="text-2xl font-bold text-gray-900">{stats.totalExisting + stats.totalPotential}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Geographic Coverage</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(countryStats).map(([country, stats]) => (
                <div key={country} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-900">{country}</p>
                    <div className="flex gap-2 mt-1">
                      {stats.confirmed > 0 && (
                        <span className="text-xs text-green-600">{stats.confirmed} confirmed</span>
                      )}
                      {stats.likely > 0 && (
                        <span className="text-xs text-yellow-600">{stats.likely} likely</span>
                      )}
                      {stats.target > 0 && (
                        <span className="text-xs text-blue-600">{stats.target} targets</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{stats.existing + stats.potential}</p>
                    <p className="text-xs text-gray-500">total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Segment Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {segments.map(segment => {
                const count = filteredData.filter(c => c.segment_type === segment).length
                return (
                  <div key={segment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getSegmentIcon(segment)}
                      <span className="text-sm font-medium text-gray-700">{segment}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No customers found matching your filters.
        </div>
      )}
    </div>
  )
}

export default CustomersDashboard