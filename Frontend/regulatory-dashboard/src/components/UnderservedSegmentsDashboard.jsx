import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Users,
  DollarSign,
  MapPin,
  TrendingUp,
  Heart,
  Building2,
  Target,
  Clock
} from 'lucide-react'

const UnderservedSegmentsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalInstitutions: 0,
    totalMarket: 0,
    avgDealSize: 0,
    totalSegments: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedReadiness, setSelectedReadiness] = useState('all')
  const [sortField, setSortField] = useState('total_segment_budget_millions')
  const [sortDirection, setSortDirection] = useState('desc')

  const [geographies, setGeographies] = useState([])
  const [types, setTypes] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedGeography, selectedType, selectedReadiness, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: segmentsData, error } = await supabase
        .from('sy2_view_underserved_segments')
        .select('*')
        .order('total_segment_budget_millions', { ascending: false })

      if (error) throw error

      setData(segmentsData || [])

      const totalInsts = segmentsData?.reduce((sum, s) => sum + (s.institution_count || 0), 0)
      const totalMarket = segmentsData?.reduce((sum, s) => sum + (parseFloat(s.total_segment_budget_millions) || 0), 0)
      const avgDeal = segmentsData?.reduce((sum, s) => sum + (parseFloat(s.avg_budget_millions) || 0), 0) / (segmentsData?.length || 1)

      setStats({
        totalInstitutions: totalInsts,
        totalMarket: Math.round(totalMarket * 100) / 100,
        avgDealSize: Math.round(avgDeal * 100) / 100,
        totalSegments: segmentsData?.length || 0
      })

      const uniqueGeos = [...new Set(segmentsData?.map(s => s.geography).filter(Boolean))]
      setGeographies(uniqueGeos.sort())

      const uniqueTypes = [...new Set(segmentsData?.map(s => s.institution_type).filter(Boolean))]
      setTypes(uniqueTypes.sort())
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
        item.institution_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.segment_category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.institution_type === selectedType)
    }

    if (selectedReadiness !== 'all') {
      filtered = filtered.filter(item => item.market_readiness_saas === selectedReadiness)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField.includes('millions') || sortField === 'institution_count') {
        aVal = parseFloat(aVal) || 0
        bVal = parseFloat(bVal) || 0
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
      setSortDirection(field.includes('millions') || field === 'institution_count' ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (geography, institutionType) => {
    const key = `${geography}-${institutionType}`
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedRows(newExpanded)
  }

  const getReadinessColor = (readiness) => {
    if (readiness?.toLowerCase() === 'high') return 'text-green-600 bg-green-50'
    if (readiness?.toLowerCase() === 'medium') return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading underserved segments...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Underserved Segments</h1>
        <p className="text-gray-600">SACCO/MFI/Thrift opportunities for financial inclusion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Institutions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalInstitutions}</p>
              <p className="text-xs text-gray-500 mt-1">Across segments</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Market</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalMarket}M</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-purple-600">${stats.avgDealSize}M</p>
            </div>
            <Target className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Segments</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalSegments}</p>
            </div>
            <Heart className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search segments..."
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
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
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
                  <button onClick={() => handleSort('geography')} className="flex items-center hover:text-gray-700">
                    Geography
                    {sortField === 'geography' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('institution_count')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Count
                    {sortField === 'institution_count' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('avg_budget_millions')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Avg Budget
                    {sortField === 'avg_budget_millions' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('total_segment_budget_millions')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Total Market
                    {sortField === 'total_segment_budget_millions' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SaaS Readiness</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, idx) => {
                const rowKey = `${item.geography}-${item.institution_type}-${idx}`
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
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{item.institution_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{item.institution_count}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-bold text-gray-900">
                            ${item.avg_budget_millions ? parseFloat(item.avg_budget_millions).toFixed(2) : '0'}M
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <span className="text-lg font-bold text-gray-900">
                            ${item.total_segment_budget_millions ? parseFloat(item.total_segment_budget_millions).toFixed(2) : '0'}M
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getReadinessColor(item.market_readiness_saas)}`}>
                          {item.market_readiness_saas || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRowExpansion(item.geography, item.institution_type)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {expandedRows.has(rowKey) ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedRows.has(rowKey) && (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Digital Maturity</h4>
                              <p className="text-sm text-gray-600">{item.digital_maturity_levels || 'No data'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Financial Health</h4>
                              <p className="text-sm text-gray-600">{item.financial_health_levels || 'No data'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Segment Category</h4>
                              <p className="text-sm text-gray-600">{item.segment_category || 'No data'}</p>
                            </div>
                            <div className="md:col-span-2 lg:col-span-3">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Payment Terms
                              </h4>
                              <p className="text-sm text-gray-600">{item.payment_terms_standard || 'No data'}</p>
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
        <div className="text-center py-8 text-gray-500">No segments found matching your filters.</div>
      )}
    </div>
  )
}

export default UnderservedSegmentsDashboard
