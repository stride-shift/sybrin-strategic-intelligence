import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import ResearchMethodology from './components/ResearchMethodology'
import RegulatoryDashboard from './components/RegulatoryDashboard'
import ProductsJobsDashboard from './components/ProductsJobsDashboard'
import CustomerJobsDashboard from './components/CustomerJobsDashboard'
import CompetitorsDashboard from './components/CompetitorsDashboard'
import CustomersDashboard from './components/CustomersDashboard'
import MarketIntelligenceDashboard from './components/MarketIntelligenceDashboard'
import NPOJurisdictionDashboard from './components/NPOJurisdictionDashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem('sybrin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/research-methodology" replace />} />
          <Route path="/research-methodology" element={<ResearchMethodology />} />
          <Route path="/market-intelligence" element={<MarketIntelligenceDashboard />} />
          <Route path="/regulatory-tailwinds" element={<RegulatoryDashboard />} />
          <Route path="/products-jobs" element={<ProductsJobsDashboard />} />
          <Route path="/customer-jobs" element={<CustomerJobsDashboard />} />
          <Route path="/competitive-analysis" element={<CompetitorsDashboard />} />
          <Route path="/customers" element={<CustomersDashboard />} />
          <Route path="/npo-jurisdiction" element={<NPOJurisdictionDashboard />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
