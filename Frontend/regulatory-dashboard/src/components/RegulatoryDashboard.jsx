import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Filter, ChevronUp, ChevronDown, AlertTriangle, Clock, Building2, FileText, HelpCircle } from 'lucide-react'
import InfoPopup from './InfoPopup'

const RegulatoryDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedScore, setSelectedScore] = useState('all')
  const [selectedComplexity, setSelectedComplexity] = useState('all')
  const [sortField, setSortField] = useState('tailwind_score')
  const [sortDirection, setSortDirection] = useState('desc')
  
  const [countries, setCountries] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedCountry, selectedScore, selectedComplexity, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: regulations, error } = await supabase
        .from('sy_regulatory_tailwinds')
        .select('*')
        .order('tailwind_score', { ascending: false })

      if (error) throw error

      setData(regulations || [])
      
      const uniqueCountries = [...new Set(regulations?.map(r => r.country) || [])]
      setCountries(uniqueCountries.sort())
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
        item.regulation_initiative.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.what_banks_must_buy_change?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(item => item.country === selectedCountry)
    }

    if (selectedScore !== 'all') {
      filtered = filtered.filter(item => item.tailwind_score === parseInt(selectedScore))
    }

    if (selectedComplexity !== 'all') {
      filtered = filtered.filter(item => item.impl_complexity === selectedComplexity)
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      if (sortField === 'tailwind_score') {
        aVal = aVal || 0
        bVal = bVal || 0
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

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-red-600 bg-red-50'
    if (score === 3) return 'text-orange-600 bg-orange-50'
    if (score === 2) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getComplexityColor = (complexity) => {
    if (complexity?.includes('High')) return 'text-purple-600'
    if (complexity?.includes('Med')) return 'text-blue-600'
    return 'text-green-600'
  }

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Regulatory Tailwinds Dashboard</h1>
        <p className="text-gray-600">Track regulatory compliance initiatives across multiple markets</p>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search regulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            value={selectedScore}
            onChange={(e) => setSelectedScore(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Scores</option>
            <option value="5">5 - Critical</option>
            <option value="4">4 - High</option>
            <option value="3">3 - Medium</option>
            <option value="2">2 - Low</option>
            <option value="1">1 - Minimal</option>
          </select>

          <select
            value={selectedComplexity}
            onChange={(e) => setSelectedComplexity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Complexity</option>
            <option value="High">High</option>
            <option value="Med-High">Med-High</option>
            <option value="Med">Med</option>
            <option value="Low-Med">Low-Med</option>
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
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('deadline_date')}
                    className="flex items-center hover:text-gray-700"
                  >
                    Deadline
                    {sortField === 'deadline_date' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('tailwind_score')}
                    className="flex items-center justify-center hover:text-gray-700 w-full"
                  >
                    <span className="flex items-center gap-1">
                      Score
                      <InfoPopup 
                        title="Tailwind Score"
                        content={
                          <div className="space-y-3">
                            <p>Measures the opportunity strength for Sybrin based on regulatory requirements.</p>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <span className="font-semibold text-red-600">5 - Critical:</span>
                                <span>Must-win opportunity with urgent demand</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-orange-600">4 - High:</span>
                                <span>High priority with clear value proposition</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-yellow-600">3 - Medium:</span>
                                <span>Good opportunity with longer sales cycles</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-blue-600">2 - Low:</span>
                                <span>Limited opportunity or indirect benefits</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="font-semibold text-gray-600">1 - Minimal:</span>
                                <span>Monitor only, minimal immediate impact</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 italic">Higher scores indicate stronger demand for Sybrin's solutions.</p>
                          </div>
                        }
                      />
                    </span>
                    {sortField === 'tailwind_score' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center justify-center gap-1">
                    Complexity
                    <InfoPopup 
                      title="Implementation Complexity"
                      content={
                        <div className="space-y-3">
                          <p>Indicates the effort required for banks to comply with regulations.</p>
                          <div className="space-y-2">
                            <div>
                              <span className="font-semibold text-purple-600">High:</span>
                              <span className="ml-2">Major system overhaul (12+ months)</span>
                            </div>
                            <div>
                              <span className="font-semibold text-purple-500">Med-High:</span>
                              <span className="ml-2">Significant changes (9-12 months)</span>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-600">Med:</span>
                              <span className="ml-2">Moderate changes (6-9 months)</span>
                            </div>
                            <div>
                              <span className="font-semibold text-blue-500">Low-Med:</span>
                              <span className="ml-2">Some changes needed (3-6 months)</span>
                            </div>
                            <div>
                              <span className="font-semibold text-green-600">Low:</span>
                              <span className="ml-2">Minor changes only (&lt;3 months)</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 italic">Higher complexity = bigger opportunity for Sybrin's expertise.</p>
                        </div>
                      }
                    />
                  </span>
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{item.country}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 font-medium">{item.regulation_initiative}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.coverage}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{item.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        {item.deadline_date !== '—' && <Clock className="w-3 h-3 text-gray-400 mr-1" />}
                        <span className="text-gray-700">{item.deadline_date}</span>
                      </div>
                      {item.deadline_proximity !== '—' && (
                        <div className="text-xs text-orange-600 mt-1">{item.deadline_proximity}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${getScoreColor(item.tailwind_score)}`}>
                        {item.tailwind_score || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${getComplexityColor(item.impl_complexity)}`}>
                        {item.impl_complexity || '-'}
                      </span>
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
                      <td colSpan="7" className="px-4 py-4 bg-gray-50">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              What Banks Must Buy/Change
                            </h4>
                            <p className="text-sm text-gray-600 ml-6">{item.what_banks_must_buy_change || 'Not specified'}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Enforcement Strength</h4>
                              <p className="text-sm text-gray-600">{item.enforcement_strength || 'Not specified'}</p>
                            </div>
                            {item.evidence && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Evidence</h4>
                                <p className="text-sm text-gray-600">{item.evidence}</p>
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
          No regulations found matching your filters.
        </div>
      )}
    </div>
  )
}

export default RegulatoryDashboard