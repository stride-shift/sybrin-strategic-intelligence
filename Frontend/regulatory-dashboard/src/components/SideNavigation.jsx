import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu, 
  X, 
  FileText, 
  Briefcase, 
  ChevronRight,
  Globe,
  Target,
  BarChart3,
  Shield,
  Users
} from 'lucide-react'

const SideNavigation = () => {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const navItems = [
    {
      path: '/customer-insights',
      name: 'Customer Insights',
      icon: Users,
      description: 'Customer feedback & insights',
      disabled: true
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
      path: '/market-segments',
      name: 'Market Segments',
      icon: Target,
      description: 'Customer segments by geography',
      disabled: true
    },
    {
      path: '/competitive-analysis',
      name: 'Competitive Analysis',
      icon: BarChart3,
      description: 'Competitor positioning',
      disabled: true
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 ${isOpen ? 'left-64' : 'left-4'} z-50 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200`}
      >
        {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Side Navigation */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-sybrin-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sybrin Intel</h2>
                <p className="text-xs text-gray-500">Strategic Intelligence Hub</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    {item.disabled ? (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 opacity-50 cursor-not-allowed">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-400">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">Coming Soon</span>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          isActive(item.path)
                            ? 'bg-sybrin-blue-50 border-l-4 border-sybrin-blue-600'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-sybrin-blue-600' : 'text-gray-500'}`} />
                          <div>
                            <p className={`text-sm font-medium ${isActive(item.path) ? 'text-sybrin-blue-900' : 'text-gray-700'}`}>
                              {item.name}
                            </p>
                            <p className={`text-xs ${isActive(item.path) ? 'text-sybrin-blue-600' : 'text-gray-500'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive(item.path) ? 'text-sybrin-blue-600' : 'text-gray-400'}`} />
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p>© 2025 Sybrin Systems</p>
              <p>Strategic Intelligence Platform</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Content will be rendered here */}
      </div>
    </>
  )
}

export default SideNavigation