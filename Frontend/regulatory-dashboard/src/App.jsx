import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import ResearchMethodology from './components/ResearchMethodology'
import ProductsJobsDashboard from './components/ProductsJobsDashboard'
import CustomerJobsDashboard from './components/CustomerJobsDashboard'
import MarketIntelligenceDashboard from './components/MarketIntelligenceDashboard'
import NPOJurisdictionDashboard from './components/NPOJurisdictionDashboard'
import Sy2CompetitorsDashboard from './components/Sy2CompetitorsDashboard'
import Sy2CustomersDashboard from './components/Sy2CustomersDashboard'
import Sy2RegulatoryDashboard from './components/Sy2RegulatoryDashboard'
import TopTargetsDashboard from './components/TopTargetsDashboard'
import MarketReadinessDashboard from './components/MarketReadinessDashboard'
import CompetitiveSweetSpotsDashboard from './components/CompetitiveSweetSpotsDashboard'
import BudgetInstitutionsDashboard from './components/BudgetInstitutionsDashboard'
import SolutionPricingDashboard from './components/SolutionPricingDashboard'
import ProcurementFrameworksDashboard from './components/ProcurementFrameworksDashboard'
import SybrinFitSolutionsDashboard from './components/SybrinFitSolutionsDashboard'
import CashFlowPlanningDashboard from './components/CashFlowPlanningDashboard'
import SegmentIntelligenceDashboard from './components/SegmentIntelligenceDashboard'
import CulturalIntelligenceDashboard from './components/CulturalIntelligenceDashboard'
import PricingExpansionDashboard from './components/PricingExpansionDashboard'
import StrategicIntelligenceFAQ from './components/StrategicIntelligenceFAQ'
import StrategicIntelligenceFAQ2 from './components/StrategicIntelligenceFAQ2'
import ResearchChat from './components/ResearchChat'
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
          <Route path="/products-jobs" element={<ProductsJobsDashboard />} />
          <Route path="/customer-jobs" element={<CustomerJobsDashboard />} />
          <Route path="/npo-jurisdiction" element={<NPOJurisdictionDashboard />} />

          {/* Foundational Sy2 Dashboards */}
          <Route path="/sy2-competitive-intelligence" element={<Sy2CompetitorsDashboard />} />
          <Route path="/sy2-customer-intelligence" element={<Sy2CustomersDashboard />} />
          <Route path="/sy2-regulatory-intelligence" element={<Sy2RegulatoryDashboard />} />
          <Route path="/budget-institutions" element={<BudgetInstitutionsDashboard />} />
          <Route path="/solution-pricing" element={<SolutionPricingDashboard />} />
          <Route path="/procurement-frameworks" element={<ProcurementFrameworksDashboard />} />
          <Route path="/cultural-intelligence" element={<CulturalIntelligenceDashboard />} />

          {/* Analytical Dashboards */}
          <Route path="/market-intelligence" element={<MarketIntelligenceDashboard />} />
          <Route path="/top-targets" element={<TopTargetsDashboard />} />
          <Route path="/market-readiness" element={<MarketReadinessDashboard />} />
          <Route path="/competitive-sweet-spots" element={<CompetitiveSweetSpotsDashboard />} />
          <Route path="/sybrin-fit-solutions" element={<SybrinFitSolutionsDashboard />} />
          <Route path="/underserved-segments" element={<SegmentIntelligenceDashboard />} />
          <Route path="/cash-flow-planning" element={<CashFlowPlanningDashboard />} />
          <Route path="/pricing-expansion" element={<PricingExpansionDashboard />} />

          {/* Strategic Intelligence */}
          <Route path="/strategic-faq" element={<StrategicIntelligenceFAQ />} />
          <Route path="/strategic-intelligence" element={<StrategicIntelligenceFAQ2 />} />
          <Route path="/research-chat" element={<ResearchChat />} />

          {/* Redirect old routes to new Sy2 versions */}
          <Route path="/customers" element={<Navigate to="/sy2-customer-intelligence" replace />} />
          <Route path="/regulatory-tailwinds" element={<Navigate to="/sy2-regulatory-intelligence" replace />} />
          <Route path="/competitive-analysis" element={<Navigate to="/sy2-competitive-intelligence" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
