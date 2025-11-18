import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown, 
  Target, 
  Heart, 
  Users, 
  Briefcase,
  TrendingUp,
  Award,
  Eye,
  Package,
  Globe,
  Building,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import InfoPopup from './InfoPopup'

const ProductsJobsDashboard = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedJobType, setSelectedJobType] = useState('all')
  const [selectedJobLevel, setSelectedJobLevel] = useState('all')
  const [selectedGeography, setSelectedGeography] = useState('all')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [sortField, setSortField] = useState('product_name')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Unique values for filters
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [geographies, setGeographies] = useState([])
  const [segments, setSegments] = useState([])
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // View mode
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortData()
  }, [data, searchTerm, selectedProduct, selectedCategory, selectedJobType, selectedJobLevel, selectedGeography, selectedSegment, sortField, sortDirection])

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data: jobs, error } = await supabase
        .from('sy_products_jobs')
        .select('*')
        .order('product_name', { ascending: true })

      if (error) throw error

      setData(jobs || [])
      
      // Extract unique values for filters
      const uniqueProducts = [...new Set(jobs?.map(j => j.product_name) || [])]
      const uniqueCategories = [...new Set(jobs?.map(j => j.product_category) || [])]
      const uniqueGeographies = [...new Set(jobs?.filter(j => j.geography).map(j => j.geography) || [])]
      const uniqueSegments = [...new Set(jobs?.filter(j => j.customer_segment).map(j => j.customer_segment) || [])]
      
      setProducts(uniqueProducts.sort())
      setCategories(uniqueCategories.sort())
      setGeographies(uniqueGeographies.sort())
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
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.key_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unexpected_use_case?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.urgency_creator?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Product filter
    if (selectedProduct !== 'all') {
      filtered = filtered.filter(item => item.product_name === selectedProduct)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.product_category === selectedCategory)
    }

    // Job Type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(item => item.job_type === selectedJobType)
    }

    // Job Level filter
    if (selectedJobLevel !== 'all') {
      filtered = filtered.filter(item => item.job_level === selectedJobLevel)
    }

    // Geography filter
    if (selectedGeography !== 'all') {
      filtered = filtered.filter(item => item.geography === selectedGeography)
    }

    // Segment filter
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(item => item.customer_segment === selectedSegment)
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
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
    switch(type) {
      case 'functional': return <Target className="w-4 h-4" />
      case 'emotional': return <Heart className="w-4 h-4" />
      case 'social': return <Users className="w-4 h-4" />
      default: return <Briefcase className="w-4 h-4" />
    }
  }

  const getJobTypeColor = (type) => {
    switch(type) {
      case 'functional': return 'text-sybrin-blue-600 bg-sybrin-blue-50'
      case 'emotional': return 'text-red-600 bg-red-50'
      case 'social': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getJobLevelColor = (level) => {
    switch(level) {
      case 'obvious': return 'text-gray-600'
      case 'higher_level': return 'text-sybrin-blue-600'
      case 'non_obvious': return 'text-purple-600'
      case 'hidden': return 'text-orange-600'
      default: return 'text-gray-500'
    }
  }

  const getPriorityColor = (priority) => {
    if (priority === 1) return 'text-red-600 bg-red-50'
    if (priority === 2) return 'text-orange-600 bg-orange-50'
    if (priority === 3) return 'text-yellow-600 bg-yellow-50'
    if (priority === 4) return 'text-sybrin-blue-600 bg-sybrin-blue-50'
    if (priority === 5) return 'text-gray-600 bg-gray-50'
    return 'text-gray-400 bg-gray-50'
  }

  // Group data by product for card view
  const groupedData = filteredData.reduce((acc, item) => {
    if (!acc[item.product_name]) {
      acc[item.product_name] = {
        product_name: item.product_name,
        product_category: item.product_category,
        jobs: []
      }
    }
    acc[item.product_name].jobs.push(item)
    return acc
  }, {})

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Loading products and jobs data...</div>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products to Jobs Mapping</h1>
        <p className="text-gray-600">Comprehensive Jobs-to-be-Done analysis for Sybrin products</p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search jobs, messages, use cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
            />
          </div>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Products</option>
            {products.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedJobType}
            onChange={(e) => setSelectedJobType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Job Types</option>
            <option value="functional">Functional</option>
            <option value="emotional">Emotional</option>
            <option value="social">Social</option>
          </select>

          <select
            value={selectedJobLevel}
            onChange={(e) => setSelectedJobLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="obvious">Obvious</option>
            <option value="higher_level">Higher Level</option>
            <option value="non_obvious">Non-Obvious</option>
            <option value="hidden">Hidden</option>
          </select>

          <div className="flex items-center justify-between px-3 py-2 bg-sybrin-blue-50 rounded-md">
            <span className="text-sm font-medium text-sybrin-blue-900">Results:</span>
            <span className="text-lg font-bold text-sybrin-blue-600">{filteredData.length}</span>
          </div>
        </div>

        {/* Additional filters row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
            {segments.map(segment => (
              <option key={segment} value={segment}>{segment}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-sybrin-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Card View
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
                      onClick={() => handleSort('product_name')}
                      className="flex items-center hover:text-gray-700"
                    >
                      Product
                      {sortField === 'product_name' && (
                        sortDirection === 'asc' ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      Job Type
                      <InfoPopup 
                        title="Job Type Categories"
                        content={
                          <div className="space-y-3">
                            <p>Understanding all three helps position Sybrin's value completely.</p>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Target className="w-4 h-4 text-sybrin-blue-600" />
                                  <span className="font-semibold text-sybrin-blue-600">Functional</span>
                                </div>
                                <p className="text-sm ml-6">Practical tasks customers need to accomplish</p>
                                <p className="text-xs text-gray-500 ml-6">Examples: Process payments, manage risk, ensure compliance</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Heart className="w-4 h-4 text-red-600" />
                                  <span className="font-semibold text-red-600">Emotional</span>
                                </div>
                                <p className="text-sm ml-6">How customers want to feel</p>
                                <p className="text-xs text-gray-500 ml-6">Examples: Confident, secure, empowered, proud</p>
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Users className="w-4 h-4 text-green-600" />
                                  <span className="font-semibold text-green-600">Social</span>
                                </div>
                                <p className="text-sm ml-6">How customers want to be perceived</p>
                                <p className="text-xs text-gray-500 ml-6">Examples: Innovative, trustworthy, industry leader</p>
                              </div>
                            </div>
                          </div>
                        }
                      />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      Level
                      <InfoPopup 
                        title="Job Level"
                        content={
                          <div className="space-y-3">
                            <p>Sybrin wins by addressing higher-level and non-obvious jobs competitors miss.</p>
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold text-gray-600">Obvious:</span>
                                <span className="ml-2">What customers explicitly ask for</span>
                                <p className="text-xs text-gray-500 ml-2">Table stakes for competing</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sybrin-blue-600">Higher Level:</span>
                                <span className="ml-2">Strategic objectives behind the request</span>
                                <p className="text-xs text-gray-500 ml-2">Key to consultative selling</p>
                              </div>
                              <div>
                                <span className="font-semibold text-purple-600">Non-Obvious:</span>
                                <span className="ml-2">Hidden needs not articulated</span>
                                <p className="text-xs text-gray-500 ml-2">Source of differentiation</p>
                              </div>
                              <div>
                                <span className="font-semibold text-orange-600">Hidden:</span>
                                <span className="ml-2">Unconscious needs from deep analysis</span>
                                <p className="text-xs text-gray-500 ml-2">Breakthrough innovation opportunity</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Geography
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center justify-center gap-1">
                      Priority
                      <InfoPopup 
                        title="Job Priority (1-5)"
                        content={
                          <div className="space-y-3">
                            <p>Focus sales efforts on priority 1-2 jobs for faster wins.</p>
                            <div className="space-y-2">
                              <div>
                                <span className="font-semibold text-red-600">1 - Critical/Urgent:</span>
                                <span className="ml-2">Desperately need this solved now</span>
                                <p className="text-xs text-gray-500 ml-2">Highest win probability, fastest sales</p>
                              </div>
                              <div>
                                <span className="font-semibold text-orange-600">2 - High:</span>
                                <span className="ml-2">Important problem causing pain</span>
                                <p className="text-xs text-gray-500 ml-2">Strong buying motivation</p>
                              </div>
                              <div>
                                <span className="font-semibold text-yellow-600">3 - Medium:</span>
                                <span className="ml-2">Clear need but not urgent</span>
                                <p className="text-xs text-gray-500 ml-2">Requires ROI justification</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sybrin-blue-600">4 - Low:</span>
                                <span className="ml-2">Nice to have</span>
                                <p className="text-xs text-gray-500 ml-2">Hard to justify budget</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-600">5 - Minimal:</span>
                                <span className="ml-2">Future consideration</span>
                                <p className="text-xs text-gray-500 ml-2">Educational sale required</p>
                              </div>
                            </div>
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
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900 text-sm">{item.product_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{item.product_category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(item.job_type)}`}>
                          {getJobTypeIcon(item.job_type)}
                          <span className="ml-1 capitalize">{item.job_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${getJobLevelColor(item.job_level)}`}>
                          {item.job_level?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-md">
                        <p className="text-sm text-gray-700 truncate">{item.job_description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-sm">
                          {item.geography && (
                            <>
                              <Globe className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-gray-700">{item.geography}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.job_priority && (
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${getPriorityColor(item.job_priority)}`}>
                            {item.job_priority}
                          </span>
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              {item.key_message && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Award className="w-4 h-4 mr-2" />
                                    Key Message
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.key_message}</p>
                                </div>
                              )}
                              
                              {item.urgency_creator && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Urgency Creator
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.urgency_creator}</p>
                                </div>
                              )}

                              {item.customer_segment && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Building className="w-4 h-4 mr-2" />
                                    Customer Segment
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.customer_segment}</p>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              {item.unexpected_use_case && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Unexpected Use Case
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.unexpected_use_case}</p>
                                </div>
                              )}

                              {item.competitive_differentiator && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Competitive Differentiator
                                  </h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.competitive_differentiator}</p>
                                </div>
                              )}

                              {item.market_context && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Market Context</h4>
                                  <p className="text-sm text-gray-600 ml-6">{item.market_context}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {item.institution_examples && item.institution_examples.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Example Institutions</h4>
                              <div className="flex flex-wrap gap-2 ml-6">
                                {item.institution_examples.map((inst, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-sybrin-blue-100 text-sybrin-blue-700 text-xs rounded">
                                    {inst}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
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
          {Object.values(groupedData).map((product) => (
            <div key={product.product_name} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{product.product_name}</h3>
                <p className="text-sm text-gray-500">{product.product_category}</p>
              </div>

              <div className="space-y-3">
                {/* Group jobs by type */}
                {['functional', 'emotional', 'social'].map(jobType => {
                  const jobsOfType = product.jobs.filter(j => j.job_type === jobType)
                  if (jobsOfType.length === 0) return null

                  return (
                    <div key={jobType} className="border-l-4 border-gray-200 pl-3">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${getJobTypeColor(jobType)}`}>
                        {getJobTypeIcon(jobType)}
                        <span className="ml-1 capitalize">{jobType} Jobs ({jobsOfType.length})</span>
                      </div>
                      
                      <ul className="space-y-1">
                        {jobsOfType.slice(0, 3).map((job) => (
                          <li key={job.id} className="text-sm text-gray-700">
                            <span className={`font-medium ${getJobLevelColor(job.job_level)}`}>
                              [{job.job_level?.replace('_', ' ')}]
                            </span> {job.job_description.substring(0, 100)}...
                          </li>
                        ))}
                        {jobsOfType.length > 3 && (
                          <li className="text-sm text-gray-500 italic">
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

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No jobs found matching your filters.
        </div>
      )}
    </div>
  )
}

export default ProductsJobsDashboard