import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Target,
  BarChart3,
  Shield,
  Users,
  Briefcase,
  LogOut,
  Microscope,
  TrendingUp,
  Database,
  Layers,
  Building2
} from 'lucide-react'

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    foundational: false,
    analytical: false,
    npo: false
  })
  const location = useLocation()

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const navSections = [
    {
      id: 'standalone',
      items: [
        {
          path: '/research-methodology',
          name: 'Research Methodology',
          icon: Microscope,
          description: 'Our systematic approach'
        }
      ]
    },
    {
      id: 'foundational',
      title: 'Foundational Research Nodes',
      icon: Database,
      items: [
        {
          path: '/customers',
          name: 'Customers',
          icon: Users,
          description: 'Existing & potential customers'
        },
        {
          path: '/regulatory-tailwinds',
          name: 'Regulatory Tailwinds',
          icon: Globe,
          description: 'Compliance initiatives across markets'
        },
        {
          path: '/products-jobs',
          name: 'Products to Jobs',
          icon: Briefcase,
          description: 'Jobs-to-be-Done mapping'
        },
        {
          path: '/customer-jobs',
          name: 'Customer Jobs',
          icon: Target,
          description: 'Customer segments JTBD analysis'
        }
      ]
    },
    {
      id: 'analytical',
      title: 'Analytical Layers',
      icon: Layers,
      items: [
        {
          path: '/competitive-analysis',
          name: 'Competitive Analysis',
          icon: BarChart3,
          description: 'Competitor positioning'
        },
        {
          path: '/market-intelligence',
          name: 'Market Intelligence',
          icon: TrendingUp,
          description: 'TAM/SAM/SOM & Market Entry Analysis'
        }
      ]
    },
    {
      id: 'npo',
      title: 'NPO Research',
      icon: Building2,
      items: [
        {
          path: '/npo-jurisdiction',
          name: 'Jurisdiction Matrix',
          icon: Globe,
          description: 'NPO registration & operations analysis'
        }
      ]
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Side Navigation */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-16'}`}>
        <div className="flex flex-col h-full">
          {/* Header with collapse button */}
          <div className={`${isOpen ? 'p-6' : 'p-3'} border-b border-gray-200 relative transition-all duration-300`}>
            <div className="flex items-center justify-center">
              {isOpen ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1">
                    <img
                      src="/sybrin_logo.png"
                      alt="Sybrin"
                      className="h-8 mb-2"
                    />
                    <h2 className="text-xl font-bold text-gray-900">Sybrin Intel</h2>
                    <p className="text-xs text-gray-500">Strategic Intelligence Hub</p>
                  </div>
                  {/* Collapse button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className={`flex-1 overflow-y-auto ${isOpen ? 'p-4' : 'p-2'}`}>
            <div className="space-y-2">
              {navSections.map((section) => {
                const SectionIcon = section.icon
                const isExpanded = expandedSections[section.id]

                return (
                  <div key={section.id}>
                    {/* Section Header (if it has a title, it's collapsible) */}
                    {section.title && isOpen ? (
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center p-3 mb-2 mt-2 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-200"
                      >
                        <SectionIcon className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="text-sm font-bold text-gray-700 uppercase tracking-wide flex-1 text-left">
                          {section.title}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    ) : null}

                    {/* Section Items */}
                    {(!section.title || isExpanded || !isOpen) && (
                      <ul className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <li key={item.path}>
                              <Link
                                to={item.path}
                                title={!isOpen ? item.name : ''}
                                className={`group flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-3 rounded-lg transition-all duration-200 ${
                                  isActive(item.path)
                                    ? 'bg-blue-50 border-l-4 border-blue-600 shadow-sm'
                                    : 'hover:bg-gray-100 border-l-4 border-transparent hover:border-gray-300'
                                }`}
                              >
                                {isOpen ? (
                                  <>
                                    <div className="flex items-center space-x-3">
                                      <Icon className={`w-5 h-5 transition-colors ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                      <div>
                                        <p className={`text-sm font-medium transition-colors ${isActive(item.path) ? 'text-blue-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                          {item.name}
                                        </p>
                                        <p className={`text-xs transition-colors ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 transition-colors ${isActive(item.path) ? 'text-blue-600' : 'text-gray-300 group-hover:text-gray-500'}`} />
                                  </>
                                ) : (
                                  <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`} />
                                )}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  localStorage.removeItem('sybrin_auth')
                  window.location.reload()
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
        {children}
      </div>
    </div>
  )
}

export default Layout