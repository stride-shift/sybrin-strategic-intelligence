import React, { useState } from 'react'
import { Shield, Lock, AlertCircle } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === '#sybrinresearch2025') {
      localStorage.setItem('sybrin_auth', 'true')
      onLogin()
    } else {
      setError(true)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-sybrin-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sybrin Intel</h1>
          <p className="text-sm text-gray-600 mt-2">Strategic Intelligence Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sybrin-blue-500"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-md">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">Invalid access code</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-sybrin-blue-600 text-white font-medium rounded-md hover:bg-sybrin-blue-700 transition-colors"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Sybrin Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login