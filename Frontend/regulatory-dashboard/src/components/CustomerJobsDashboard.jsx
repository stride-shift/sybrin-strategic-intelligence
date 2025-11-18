import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown,
  Building2,
  Target,
  Heart,
  Users,
  TrendingUp,
  AlertCircle,
  Award,
  MapPin,
  Layers,
  Activity,
  Eye,
  Star,
  HelpCircle
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const CustomerJobsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSegmentType, setSelectedSegmentType] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedJobCategory, setSelectedJobCategory] = useState('all')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedLifecycle, setSelectedLifecycle] = useState('all')
  const [sortField, setSortField] = useState('priority')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Unique values for filters
  const [segmentTypes, setSegmentTypes] = useState([])
  const [geographies, setGeographies] = useState([])
  const [jobCategories, setJobCategories] = useState([])
  const [lifecycleStages, setLifecycleStages] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // View mode
  const [viewMode, setViewMode] = useState('table') // 'table', 'cards', 'matrix'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedSegmentType, selectedGeography, selectedJobCategory, selectedJobType, selectedPriority, selectedLifecycle, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: jobs, error } = await supabase
        .from('sy_customer_jobs')
        .select('*')
        .order('priority', { ascending: true })

      if (error) throw error

      setData(jobs || [])
      
      // Extract unique values for filters
      const uniqueSegmentTypes = [...new Set(jobs?.map(j => j.segment_type) || [])]
      const uniqueGeographies = [...new Set(jobs?.map(j => j.geography) || [])]
      const uniqueJobCategories = [...new Set(jobs?.map(j => j.job_category) || [])]
      const uniqueLifecycleStages = [...new Set(jobs?.filter(j => j.lifecycle_stage).map(j => j.lifecycle_stage) || [])]
      
      setSegmentTypes(uniqueSegmentTypes.sort())
      setGeographies(uniqueGeographies.sort())
      setJobCategories(uniqueJobCategories.sort())
      setLifecycleStages(uniqueLifecycleStages.sort())
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
        item.segment_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.critical_success_factor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.market_context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unique_challenges?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Segment Type filter
    if (selectedSegmentType !== 'all') {
      filtered = filtered.filter(item => item.segment_type === selectedSegmentType)
    }

    // Geography filter
    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    // Job Category filter
    if (selectedJobCategory !== 'all') {
      filtered = filtered.filter(item => item.job_category === selectedJobCategory)
    }

    // Job Type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(item => item.job_type === selectedJobType)
    }

    // Priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(item => item.priority === parseInt(selectedPriority))
    }

    // Lifecycle filter
    if (selectedLifecycle !== 'all') {
      filtered = filtered.filter(item => item.lifecycle_stage === selectedLifecycle)
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

  const getJobTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'functional': return <Target className="w-4 h-4" />
      case 'emotional': return <Heart className="w-4 h-4" />
      case 'social': return <Users className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getJobTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'functional': return 'text-blue-600 bg-blue-50'
      case 'emotional': return 'text-red-600 bg-red-50'
      case 'social': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 1: return 'text-red-600 bg-red-50'
      case 2: return 'text-orange-600 bg-orange-50'
      case 3: return 'text-yellow-600 bg-yellow-50'
      case 4: return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-400 bg-gray-50'
    }
  }

  const getSegmentTypeIcon = (type) => {
    if (type?.includes('Tier 1')) return <Building2 className="w-4 h-4" />
    if (type?.includes('Tier 2')) return <TrendingUp className="w-4 h-4" />
    if (type?.includes('MFI')) return <Users className="w-4 h-4" />
    if (type?.includes('Digital')) return <Activity className="w-4 h-4" />
    if (type?.includes('Central')) return <Award className="w-4 h-4" />
    if (type?.includes('Mobile')) return <Target className="w-4 h-4" />
    return <Layers className="w-4 h-4" />
  }

  // Group data by segment for card view
  const groupedData = filteredData.reduce((acc, item) => {
    const key = `${item.segment_name}-${item.geography}`
    if (!acc[key]) {
      acc[key] = {
        segment_name: item.segment_name,
        segment_type: item.segment_type,
        geography: item.geography,
        jobs: []
      }
    }
    acc[key].jobs.push(item)
    return acc
  }, {})

  // Create matrix data structure
  const matrixData = () => {
    const segments = [...new Set(filteredData.map(d => d.segment_type))]
    const geographies = [...new Set(filteredData.map(d => d.geography))]
    
    const matrix = {}
    segments.forEach(segment => {
      matrix[segment] = {}
      geographies.forEach(geo => {
        matrix[segment][geo] = filteredData.filter(
          d => d.segment_type === segment && d.geography === geo
        )
      })
    })
    
    return { matrix, segments, geographies }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading customer jobs data...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Segments Jobs Analysis</h1>
        <p className="text-gray-600">Understanding what different financial institution types need to accomplish</p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs, factors, challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedSegmentType}
            onChange={(e) => setSelectedSegmentType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Segments</option>
            {segmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
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

          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Job Types</option>
            <option value="functional">Functional</option>
            <option value="emotional">Emotional</option>
            <option value="social">Social</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="1">Priority 1</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
            <option value="4">Priority 4</option>
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-md">
            <span className="text-sm font-medium text-blue-900">Results:</span>
            <span className="text-lg font-bold text-blue-600">{filteredData.length}</span>
          </div>
        </div>

        {/* Additional filters and view controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <select
            value={selectedJobCategory}
            onChange={(e) => setSelectedJobCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {jobCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedLifecycle}
            onChange={(e) => setSelectedLifecycle(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Lifecycle Stages</option>
            {lifecycleStages.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
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
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 rounded-md transition-colors flex-1 ${viewMode === 'matrix' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Matrix View
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
                      onClick={() => handleSort('segment_name')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Segment
                      {sortField === 'segment_name' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                    <span className="flex items-center gap-1">
                      Job Type
                      <InfoPopup 
                        title="Customer Job Types"
                        content={
                          <div className="space-y-3">
                            <p>Sybrin must address all three types to win customer segments.</p>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-4 h-4 text-blue-600" />
                                  <span className="font-semibold text-blue-600">Functional</span>
                                </div>
                                <p className="text-sm ml-6">Core business tasks they must accomplish</p>
                                <p className="text-xs text-gray-500 ml-6">Example: "Process payments efficiently"</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Heart className="w-4 h-4 text-red-600" />
                                  <span className="font-semibold text-red-600">Emotional</span>
                                </div>
                                <p className="text-sm ml-6">How they want to feel</p>
                                <p className="text-xs text-gray-500 ml-6">Example: "Confident about compliance"</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Users className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-green-600">Social</span>
                                </div>
                                <p className="text-sm ml-6">How they want to be perceived</p>
                                <p className="text-xs text-gray-500 ml-6">Example: "Seen as innovative leader"</p>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('priority')}
                      className="flex items-center justify-center hover:text-gray-700 w-full"
                    >
                      <span className="flex items-center gap-1">
                        Priority
                        <InfoPopup 
                          title="Customer Priority (1-4)"
                          content={
                            <div className="space-y-3">
                              <p>Indicates which segments and jobs to target first for maximum impact.</p>
                              <div className="space-y-2">
                                <div>
                                  <span className="font-semibold text-red-600">1 - Mission-Critical:</span>
                                  <span className="ml-2">MUST solve now</span>
                                  <p className="text-xs text-gray-500 ml-2">Prime target for Sybrin</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-orange-600">2 - Important:</span>
                                  <span className="ml-2">Causing significant pain</span>
                                  <p className="text-xs text-gray-500 ml-2">Strong opportunity if delivered</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-yellow-600">3 - Valuable:</span>
                                  <span className="ml-2">Clear need but not urgent</span>
                                  <p className="text-xs text-gray-500 ml-2">Longer sales cycle expected</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-blue-600">4 - Nice to Have:</span>
                                  <span className="ml-2">Not their main focus</span>
                                  <p className="text-xs text-gray-500 ml-2">Harder to get budget approval</p>
                                </div>
                              </div>
                            </div>
                          }
                        />
                      </span>
                      {sortField === 'priority' && (
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
                        <div className="flex items-center">
                          {getSegmentTypeIcon(item.segment_type)}
                          <span className="ml-2 font-medium text-gray-900 text-sm">{item.segment_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{item.segment_type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-gray-700">{item.geography}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(item.job_type)}`}>
                          {getJobTypeIcon(item.job_type)}
                          <span className="ml-1 capitalize">{item.job_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-700 truncate">{item.job_description}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${getPriorityColor(item.priority)}`}>
                          {item.priority}
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              {item.critical_success_factor && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                                    Critical Success Factor
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.critical_success_factor}</p>
                                </div>
                              )}
                              
                              {item.market_context && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Market Context
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.market_context}</p>
                                </div>
                              )}

                              {item.lifecycle_stage && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Activity className="w-4 h-4 mr-2" />
                                    Lifecycle Stage
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6 capitalize">{item.lifecycle_stage}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              {item.unique_challenges && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                                    Unique Challenges
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.unique_challenges}</p>
                                </div>
                              )}

                              {item.examples && item.examples.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Example Institutions
                                  </h4>
                                  <div className="flex flex-wrap gap-2 ml-6">
                                    {item.examples.map((example, idx) => (
                                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                        {example}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-1">Job Category</h4>
                                <p className="text-sm text-gray-600 ml-6">{item.job_category}</p>
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

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(groupedData).map((segment) => (
            <div key={`${segment.segment_name}-${segment.geography}`} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{segment.segment_name}</h3>
                  <span className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {segment.geography}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{segment.segment_type}</p>
              </div>

              <div className="space-y-3">
                {/* Group jobs by type */}
                {['functional', 'emotional', 'social'].map(jobType => {
                  const jobsOfType = segment.jobs.filter(j => j.job_type === jobType)
                  if (jobsOfType.length === 0) return null

                  return (
                    <div key={jobType} className="border-l-4 border-gray-200 pl-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getJobTypeColor(jobType)}`}>
                        {getJobTypeIcon(jobType)}
                        <span className="ml-1 capitalize">{jobType} ({jobsOfType.length})</span>
                      </div>
                      
                      <ul className="space-y-2">
                        {jobsOfType.slice(0, 3).map((job) => (
                          <li key={job.id} className="text-sm">
                            <div className="flex items-start">
                              <Tooltip content={`Priority ${job.priority}: ${job.priority === 1 ? 'Critical need' : job.priority === 2 ? 'High importance' : job.priority === 3 ? 'Medium importance' : 'Lower importance'}`}>
                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2 mt-0.5 cursor-help ${getPriorityColor(job.priority)}`}>
                                  {job.priority}
                                </span>
                              </Tooltip>
                              <div className="flex-1">
                                <p className="text-gray-700">{job.job_description.substring(0, 100)}...</p>
                                {job.critical_success_factor && (
                                  <p className="text-xs text-gray-500 mt-1 italic">
                                    CSF: {job.critical_success_factor.substring(0, 60)}...
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                        {jobsOfType.length > 3 && (
                          <li className="text-sm text-gray-500 italic ml-7">
                            +{jobsOfType.length - 3} more {jobType} jobs
                          </li>
                        )}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-h-[650px] flex flex-col">
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full relative">
              <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                    Segment / Geography
                  </th>
                  {matrixData().geographies.map(geo => (
                    <th key={geo} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      {geo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matrixData().segments.map(segment => (
                  <tr key={segment} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white">
                      <div className="flex items-center">
                        {getSegmentTypeIcon(segment)}
                        <span className="ml-2">{segment}</span>
                      </div>
                    </td>
                    {matrixData().geographies.map(geo => {
                      const jobs = matrixData().matrix[segment][geo]
                      return (
                        <td key={geo} className="px-4 py-3 text-center">
                          {jobs.length > 0 ? (
                            <div className="space-y-1">
                              <div className="flex justify-center gap-1">
                                {['functional', 'emotional', 'social'].map(type => {
                                  const count = jobs.filter(j => j.job_type === type).length
                                  if (count === 0) return null
                                  return (
                                    <span key={type} className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getJobTypeColor(type)}`}>
                                      {count}
                                    </span>
                                  )
                                })}
                              </div>
                              <div className="text-xs text-gray-500">
                                Total: {jobs.length}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No customer jobs found matching your filters.
        </div>
      )}
    </div>
  )
}

export default CustomerJobsDashboard