import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Target,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  Award,
  Briefcase
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const Sy2RegulatoryDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalRegulations: 0,
    tailwindCount: 0,
    highImpactCount: 0,
    countriesCount: 0
  })

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedClassification, setSelectedClassification] = useState('all')
  const [selectedImpact, setSelectedImpact] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortField, setSortField] = useState('country')
  const [sortDirection, setSortDirection] = useState('asc')

  // Unique values for filters
  const [countries, setCountries] = useState([])
  const [classifications, setClassifications] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  // View mode
  const [viewMode, setViewMode] = useState('table') // 'table', 'cards', 'timeline'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedCountry, selectedClassification, selectedImpact, selectedStatus, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: regulatoryData, error } = await supabase
        .from('sy2_regulatory')
        .select('*')
        .order('country', { ascending: true })

      if (error) throw error

      setData(regulatoryData || [])

      // Calculate stats
      const tailwind = regulatoryData?.filter(r =>
        r.classification?.toLowerCase().includes('tailwind') ||
        r.classification?.toLowerCase().includes('opportunity')
      ) || []
      const highImpact = regulatoryData?.filter(r =>
        r.impact_level === 'High' || r.impact_level === 'Critical' || r.impact_level === 'Very High'
      ) || []
      const uniqueCountries = [...new Set(regulatoryData?.map(r => r.country).filter(Boolean))]

      setStats({
        totalRegulations: regulatoryData?.length || 0,
        tailwindCount: tailwind.length,
        highImpactCount: highImpact.length,
        countriesCount: uniqueCountries.length
      })

      // Extract unique values for filters
      const uniqueClassifications = [...new Set(regulatoryData?.map(r => r.classification).filter(Boolean))]

      setCountries(uniqueCountries.sort())
      setClassifications(uniqueClassifications.sort())
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
        item.regulation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.governing_body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actions?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(item => item.country === selectedCountry)
    }

    // Classification filter
    if (selectedClassification !== 'all') {
      filtered = filtered.filter(item => item.classification === selectedClassification)
    }

    // Impact filter
    if (selectedImpact !== 'all') {
      filtered = filtered.filter(item => item.impact_level === selectedImpact)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus)
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

  const getImpactColor = (level) => {
    switch(level?.toLowerCase()) {
      case 'critical':
      case 'very high': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium':
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getClassificationColor = (classification) => {
    if (classification?.toLowerCase().includes('tailwind')) return 'text-green-600 bg-green-50'
    if (classification?.toLowerCase().includes('opportunity')) return 'text-sybrin-blue-600 bg-sybrin-blue-50'
    if (classification?.toLowerCase().includes('headwind')) return 'text-orange-600 bg-orange-50'
    if (classification?.toLowerCase().includes('compliance')) return 'text-purple-600 bg-purple-50'
    if (classification?.toLowerCase().includes('risk')) return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
      case 'enacted':
      case 'in force': return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'pending':
      case 'proposed': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'draft': return <FileText className="w-4 h-4 text-sybrin-blue-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  // Group data by country for card view
  const countryStats = filteredData.reduce((acc, item) => {
    const country = item.country || 'Unknown'
    if (!acc[country]) {
      acc[country] = {
        country,
        regulations: [],
        tailwinds: 0,
        highImpact: 0
      }
    }
    acc[country].regulations.push(item)
    if (item.classification?.toLowerCase().includes('tailwind')) acc[country].tailwinds++
    if (item.impact_level === 'High' || item.impact_level === 'Critical') acc[country].highImpact++
    return acc
  }, {})

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading regulatory data...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sy2 Regulatory Intelligence Dashboard</h1>
        <p className="text-gray-600">Comprehensive regulatory requirements and initiatives across markets</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Regulations</p>
              <p className="text-2xl font-bold text-sybrin-blue-600">{stats.totalRegulations}</p>
            </div>
            <FileText className="w-8 h-8 text-sybrin-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tailwinds</p>
              <p className="text-2xl font-bold text-green-600">{stats.tailwindCount}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Impact</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highImpactCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Countries</p>
              <p className="text-2xl font-bold text-purple-600">{stats.countriesCount}</p>
            </div>
            <Globe className="w-8 h-8 text-purple-200" />
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
              placeholder="Search regulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
            />
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Classifications</option>
            {classifications.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Impact Levels</option>
            <option value="Critical">Critical</option>
            <option value="Very High">Very High</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Enacted">Enacted</option>
            <option value="In Force">In Force</option>
            <option value="Pending">Pending</option>
            <option value="Proposed">Proposed</option>
            <option value="Draft">Draft</option>
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-sybrin-blue-50 rounded-md">
            <span className="text-sm font-medium text-sybrin-blue-900">Results:</span>
            <span className="text-lg font-bold text-sybrin-blue-600">{filteredData.length}</span>
          </div>
        </div>

        {/* View controls */}
        <div className="flex gap-2 mt-4">
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
                    Regulation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classification
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
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
                          <MapPin className="w-3 h-3 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900 text-sm">{item.country}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.regulation}</p>
                        {item.governing_body && (
                          <p className="text-xs text-gray-500 mt-1">{item.governing_body}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.classification && (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(item.classification)}`}>
                            {item.classification}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.impact_level ? (
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getImpactColor(item.impact_level)}`}>
                            {item.impact_level}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {getStatusIcon(item.status)}
                          <span className="text-xs text-gray-600">{item.status || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.deadline ? (
                          <div className="flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-700">{item.deadline}</span>
                          </div>
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
                        <td colSpan="7" className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Reason & Classification */}
                            <div className="space-y-3">
                              {item.reason && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2 text-sybrin-blue-500" />
                                    Reason
                                  </h4>
                                  <p className="text-sm text-gray-600">{item.reason}</p>
                                </div>
                              )}

                              {item.governing_body && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Governing Body</h4>
                                  <p className="text-sm text-gray-600">{item.governing_body}</p>
                                </div>
                              )}
                            </div>

                            {/* Products & Actions */}
                            <div className="space-y-3">
                              {item.products && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                                    Related Products
                                  </h4>
                                  <p className="text-sm text-gray-600">{item.products}</p>
                                </div>
                              )}

                              {item.actions && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Target className="w-4 h-4 mr-2 text-orange-500" />
                                    Required Actions
                                  </h4>
                                  <p className="text-sm text-gray-600">{item.actions}</p>
                                </div>
                              )}
                            </div>

                            {/* Source & Timeline */}
                            <div className="space-y-3">
                              {item.deadline && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                                    Deadline
                                  </h4>
                                  <p className="text-sm text-gray-600">{item.deadline}</p>
                                </div>
                              )}

                              {item.source_url && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Source</h4>
                                  <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                                     className="text-sm text-sybrin-blue-600 hover:underline break-all">
                                    View Source
                                  </a>
                                </div>
                              )}

                              <div className="text-xs text-gray-500">
                                Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Unknown'}
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
      )}

      {/* Card View - By Country */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(countryStats).map((country) => (
            <div key={country.country} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-sybrin-blue-500" />
                    <h3 className="text-lg font-bold text-gray-900">{country.country}</h3>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{country.regulations.length}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tailwinds:</span>
                  <span className="text-sm font-bold text-green-600">{country.tailwinds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Impact:</span>
                  <span className="text-sm font-bold text-orange-600">{country.highImpact}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Regulations</h4>
                {country.regulations.slice(0, 3).map((reg, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="text-gray-900 font-medium line-clamp-2">{reg.regulation}</p>
                    {reg.classification && (
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs ${getClassificationColor(reg.classification)}`}>
                        {reg.classification}
                      </span>
                    )}
                  </div>
                ))}
                {country.regulations.length > 3 && (
                  <p className="text-xs text-gray-500 italic">
                    +{country.regulations.length - 3} more regulations
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No regulations found matching your filters.
        </div>
      )}
    </div>
  )
}

export default Sy2RegulatoryDashboard
