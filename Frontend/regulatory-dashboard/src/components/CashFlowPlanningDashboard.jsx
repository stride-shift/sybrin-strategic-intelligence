import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  ChevronUp,
  ChevronDown,
  DollarSign,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  Users,
  Calendar
} from 'lucide-react'

const CashFlowPlanningDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalMarkets: 0,
    avgPaymentDays: 0,
    highRiskMarkets: 0,
    totalProspects: 0
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all')
  const [sortField, setSortField] = useState('expected_payment_days')
  const [sortDirection, setSortDirection] = useState('desc')

  const [expandedRows, setExpandedRows] = useState(new Set())

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedRiskLevel, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: planningData, error } = await supabase
        .from('sy2_view_cash_flow_planning')
        .select('*')
        .order('expected_payment_days', { ascending: false })

      if (error) throw error

      setData(planningData || [])

      const avgDays = planningData?.reduce((sum, p) => sum + (p.expected_payment_days || 0), 0) / (planningData?.length || 1)
      const highRisk = planningData?.filter(p => p.payment_risk_level?.toLowerCase().includes('delay')).length
      const totalProspects = planningData?.reduce((sum, p) => sum + (p.potential_customers || 0), 0)

      setStats({
        totalMarkets: planningData?.length || 0,
        avgPaymentDays: Math.round(avgDays),
        highRiskMarkets: highRisk,
        totalProspects
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
        item.payment_terms_standard?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedRiskLevel !== 'all') {
      if (selectedRiskLevel === 'high') {
        filtered = filtered.filter(item => item.payment_risk_level?.toLowerCase().includes('delay'))
      } else if (selectedRiskLevel === 'low') {
        filtered = filtered.filter(item => item.payment_risk_level?.toLowerCase().includes('predictable'))
      }
    }

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === 'expected_payment_days' || sortField === 'potential_customers' || sortField === 'contract_type_options') {
        aVal = aVal || 0
        bVal = bVal || 0
      } else if (sortField === 'avg_customer_budget_millions') {
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
      setSortDirection(field === 'expected_payment_days' || field === 'potential_customers' || field === 'avg_customer_budget_millions' ? 'desc' : 'asc')
    }
  }

  const toggleRowExpansion = (geography) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(geography)) {
      newExpanded.delete(geography)
    } else {
      newExpanded.add(geography)
    }
    setExpandedRows(newExpanded)
  }

  const getRiskColor = (risk) => {
    if (risk?.toLowerCase().includes('delay')) return 'text-red-600 bg-red-50'
    if (risk?.toLowerCase().includes('predictable')) return 'text-green-600 bg-green-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getPaymentDaysColor = (days) => {
    if (days <= 30) return 'text-green-600'
    if (days <= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading cash flow planning data...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cash Flow Planning</h1>
        <p className="text-gray-600">Payment terms, milestones, and risk levels for financial modeling</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Markets</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalMarkets}</p>
            </div>
            <MapPin className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Payment Days</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgPaymentDays}</p>
              <p className="text-xs text-gray-500 mt-1">Expected timeline</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk Markets</p>
              <p className="text-2xl font-bold text-red-600">{stats.highRiskMarkets}</p>
              <p className="text-xs text-gray-500 mt-1">Payment delays likely</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Prospects</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalProspects}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk (Delays Likely)</option>
            <option value="low">Low Risk (Predictable)</option>
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
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('expected_payment_days')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Payment Days
                    {sortField === 'expected_payment_days' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('potential_customers')} className="flex items-center justify-center hover:text-gray-700 w-full">
                    Prospects
                    {sortField === 'potential_customers' && (sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Types</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <React.Fragment key={item.geography}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900 text-sm">{item.geography}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className={`text-lg font-bold ${getPaymentDaysColor(item.expected_payment_days)}`}>
                          {item.expected_payment_days || 0} days
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.payment_risk_level)}`}>
                        {item.payment_risk_level || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900">{item.potential_customers || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-700">{item.contract_type_options || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleRowExpansion(item.geography)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {expandedRows.has(item.geography) ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(item.geography) && (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Payment Terms
                            </h4>
                            <p className="text-sm text-gray-600">{item.payment_terms_standard || 'No data'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Milestone Structure
                            </h4>
                            <p className="text-sm text-gray-600">{item.payment_milestone_structure || 'No data'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Preferred Contract Types
                            </h4>
                            {item.preferred_contract_types && Array.isArray(item.preferred_contract_types) ? (
                              <ul className="text-sm text-gray-600 list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-1">
                                {item.preferred_contract_types.map((type, idx) => (
                                  <li key={idx}>{type}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600">No data</p>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Avg Customer Budget
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.avg_customer_budget_millions
                                ? `$${parseFloat(item.avg_customer_budget_millions).toFixed(1)}M`
                                : 'No data'}
                            </p>
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
        <div className="text-center py-8 text-gray-500">No markets found matching your filters.</div>
      )}
    </div>
  )
}

export default CashFlowPlanningDashboard
