import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  Globe,
  Users,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Handshake,
  Clock,
  Building2,
  AlertTriangle,
  Info
} from 'lucide-react'

const CulturalIntelligenceDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalGeographies: 0,
    avgPowerDistance: 0,
    relationshipFirst: 0,
    extendedCycles: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPattern, setSelectedPattern] = useState('all')
  const [selectedCommunication, setSelectedCommunication] = useState('all')
  const [sortField, setSortField] = useState('geography')
  const [sortDirection, setSortDirection] = useState('asc')

  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedPattern, selectedCommunication, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: culturalData, error } = await supabase
        .from('sy2_cultural_intelligence')
        .select('*')
        .order('geography', { ascending: true })

      if (error) throw error

      setData(culturalData || [])

      const avgPD = culturalData?.filter(c => c.power_distance_index).reduce((sum, c) => sum + c.power_distance_index, 0) / (culturalData?.filter(c => c.power_distance_index).length || 1)
      const relationshipFirstCount = culturalData?.filter(c => c.trust_building_pattern?.includes('Relationship')).length

      setStats({
        totalGeographies: culturalData?.length || 0,
        avgPowerDistance: Math.round(avgPD),
        relationshipFirst: relationshipFirstCount,
        extendedCycles: culturalData?.filter(c => c.typical_sales_cycle_length?.includes('month')).length
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
        item.decision_making_style?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedPattern !== 'all') {
      filtered = filtered.filter(item => item.trust_building_pattern === selectedPattern)
    }

    if (selectedCommunication !== 'all') {
      filtered = filtered.filter(item => item.communication_directness === selectedCommunication)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'power_distance_index') {
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

  const getCommunicationColor = (style) => {
    if (style?.toLowerCase() === 'direct') return 'text-sybrin-blue-700 bg-sybrin-blue-100'
    if (style?.toLowerCase() === 'indirect') return 'text-purple-700 bg-purple-100'
    return 'text-gray-700 bg-gray-100'
  }

  const getDecisionColor = (style) => {
    if (style?.toLowerCase().includes('top-down')) return 'text-orange-700 bg-orange-100'
    if (style?.toLowerCase().includes('hybrid')) return 'text-green-700 bg-green-100'
    if (style?.toLowerCase().includes('consensus')) return 'text-sybrin-blue-700 bg-sybrin-blue-100'
    return 'text-gray-700 bg-gray-100'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading cultural intelligence...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cultural Intelligence</h1>
        <p className="text-gray-600">Cultural insights and market entry strategies across geographies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Geographies</p>
              <p className="text-2xl font-bold text-sybrin-blue-600">{stats.totalGeographies}</p>
            </div>
            <Globe className="w-8 h-8 text-sybrin-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Power Distance</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgPowerDistance}</p>
              <p className="text-xs text-gray-500 mt-1">Hofstede Index</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Relationship-First</p>
              <p className="text-2xl font-bold text-green-600">{stats.relationshipFirst}</p>
              <p className="text-xs text-gray-500 mt-1">Markets</p>
            </div>
            <Handshake className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Extended Cycles</p>
              <p className="text-2xl font-bold text-orange-600">{stats.extendedCycles}</p>
              <p className="text-xs text-gray-500 mt-1">Multi-month sales</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search geographies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
            />
          </div>

          <select
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Trust Patterns</option>
            <option value="Relationship-First">Relationship-First</option>
            <option value="Transaction-First">Transaction-First</option>
          </select>

          <select
            value={selectedCommunication}
            onChange={(e) => setSelectedCommunication(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Communication Styles</option>
            <option value="Direct">Direct</option>
            <option value="Indirect">Indirect</option>
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Pattern</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Communication</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Decision Style</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('power_distance_index')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Power Distance
                    {sortField === 'power_distance_index' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Cycle</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900">{item.trust_building_pattern || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCommunicationColor(item.communication_directness)}`}>
                        {item.communication_directness || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getDecisionColor(item.decision_making_style)}`}>
                        {item.decision_making_style || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-900">{item.power_distance_index || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs text-gray-600">{item.typical_sales_cycle_length || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleRowExpansion(item.id)} className="text-sybrin-blue-600 hover:text-sybrin-blue-800 text-sm font-medium">
                        {expandedRows.has(item.id) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.id) && (
                    <tr>
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 gap-6">
                          {/* Relationship Timeline */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-sybrin-blue-600" />
                              Relationship Timeline
                            </h4>
                            <p className="text-sm text-gray-600 bg-sybrin-blue-50 p-3 rounded">
                              {item.relationship_timeline || 'No timeline information'}
                            </p>
                          </div>

                          {/* Negotiation & Communication */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <MessageCircle className="w-4 h-4 mr-2 text-purple-600" />
                                Negotiation Style
                              </h4>
                              <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                                {item.negotiation_style || 'No data'}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <Info className="w-4 h-4 mr-2 text-indigo-600" />
                                Partnership Strategy
                              </h4>
                              <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded">
                                {item.partnership_building_strategy || 'No data'}
                              </p>
                            </div>
                          </div>

                          {/* Cultural Dos and Don'ts */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Key Cultural Dos ({item.key_cultural_dos?.length || 0})
                              </h4>
                              {item.key_cultural_dos && Array.isArray(item.key_cultural_dos) && item.key_cultural_dos.length > 0 ? (
                                <ul className="text-sm text-gray-600 space-y-1 max-h-60 overflow-y-auto">
                                  {item.key_cultural_dos.map((dos, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-green-600 mr-2 mt-0.5">✓</span>
                                      <span>{dos}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-400">No cultural dos defined</p>
                              )}
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                Key Cultural Don'ts ({item.key_cultural_donts?.length || 0})
                              </h4>
                              {item.key_cultural_donts && Array.isArray(item.key_cultural_donts) && item.key_cultural_donts.length > 0 ? (
                                <ul className="text-sm text-gray-600 space-y-1 max-h-60 overflow-y-auto">
                                  {item.key_cultural_donts.map((dont, idx) => (
                                    <li key={idx} className="flex items-start">
                                      <span className="text-red-600 mr-2 mt-0.5">✗</span>
                                      <span>{dont}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-400">No cultural don'ts defined</p>
                              )}
                            </div>
                          </div>

                          {/* Banking Sector Cultural Norms */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Building2 className="w-4 h-4 mr-2 text-gray-600" />
                              Banking Sector Cultural Norms
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                              {item.banking_sector_cultural_norms || 'No banking sector information'}
                            </p>
                          </div>

                          {/* Hofstede Dimensions */}
                          {(item.power_distance_index || item.individualism_collectivism || item.uncertainty_avoidance) && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2 text-sybrin-blue-600" />
                                Hofstede Cultural Dimensions
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {item.power_distance_index && (
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500">Power Distance</p>
                                    <p className="text-lg font-bold text-sybrin-blue-600">{item.power_distance_index}</p>
                                  </div>
                                )}
                                {item.individualism_collectivism && (
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500">Individualism</p>
                                    <p className="text-lg font-bold text-purple-600">{item.individualism_collectivism}</p>
                                  </div>
                                )}
                                {item.masculinity_femininity && (
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500">Masculinity</p>
                                    <p className="text-lg font-bold text-green-600">{item.masculinity_femininity}</p>
                                  </div>
                                )}
                                {item.uncertainty_avoidance && (
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500">Uncertainty Avoidance</p>
                                    <p className="text-lg font-bold text-orange-600">{item.uncertainty_avoidance}</p>
                                  </div>
                                )}
                                {item.long_term_orientation && (
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500">Long-term Orient.</p>
                                    <p className="text-lg font-bold text-indigo-600">{item.long_term_orientation}</p>
                                  </div>
                                )}
                                {item.indulgence_restraint && (
                                  <div className="bg-white p-3 rounded border border-gray-200">
                                    <p className="text-xs text-gray-500">Indulgence</p>
                                    <p className="text-lg font-bold text-pink-600">{item.indulgence_restraint}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Red Flags */}
                          {item.red_flags_to_avoid && Array.isArray(item.red_flags_to_avoid) && item.red_flags_to_avoid.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                                Red Flags to Avoid
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {item.red_flags_to_avoid.map((flag, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-red-600 mr-2">⚠</span>
                                    <span>{flag}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
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
        <div className="text-center py-8 text-gray-500">No geographies found matching your filters.</div>
      )}
    </div>
  )
}

export default CulturalIntelligenceDashboard
