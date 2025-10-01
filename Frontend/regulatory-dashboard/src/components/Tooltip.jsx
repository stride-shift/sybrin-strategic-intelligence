import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

const Tooltip = ({ content, children, className = '' }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={className}
      >
        {children || <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />}
      </div>
      
      {show && (
        <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg max-w-xs whitespace-normal">
          <div className="relative">
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1">
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-900"></div>
            </div>
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip