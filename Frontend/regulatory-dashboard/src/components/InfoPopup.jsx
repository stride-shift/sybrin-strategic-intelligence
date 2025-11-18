import React, { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

const InfoPopup = ({ title, content, children }) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShow(true)
        }}
        className="inline-flex items-center justify-center hover:bg-gray-100 rounded-full p-0.5 transition-colors"
      >
        {children || <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />}
      </button>
      
      {show && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-50"
            onClick={() => setShow(false)}
          />
          
          {/* Popup Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{title || 'Information'}</h3>
                <button
                  onClick={() => setShow(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="text-sm text-gray-700 space-y-2">
                  {typeof content === 'string' ? (
                    <p>{content}</p>
                  ) : (
                    content
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                <button
                  onClick={() => setShow(false)}
                  className="w-full px-4 py-2 bg-sybrin-blue-600 text-white text-sm font-medium rounded-md hover:bg-sybrin-blue-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default InfoPopup